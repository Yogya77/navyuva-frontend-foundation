import * as THREE from "three";
import type { InteractiveEntity3D, BoxCollider3D } from "../types";
import type { StylizedMaterialPalette } from "../materials";
import {
  createSkyDome,
  createProceduralCloudSky,
  createRollingTerrain,
  createStylizedRock,
  createGrassTuft,
  createStylizedPalmTree,
  createStylizedBush,
  createPotteryCluster,
  createExcavationTent,
  createDistantSkyline,
  createWeatheredBrickWall,
  createTorch,
  type TorchInstance,
} from "../environmentHelpers";
import {
  createHarappanMonumentalGate,
  createHarappanCourtyardHouse,
  createRadialStonePlaza,
} from "../modularArchitecture";
import { createExcavationDigTrench, createSortingStation } from "../archaeologyProps";
import {
  createMonumentalGreatBath,
  createHarappanWaterWell,
  createHarappanWoodenCart,
} from "../harappanWorldBuilder";
import {
  createFloatingDust,
  createRuneGlow,
  createActivationPulse,
  type RuneGlow,
  type ActivationPulse,
} from "../vfx";
import {
  createFieldJournalModel,
  createStratigraphyProfileModel,
  createHydraulicSluiceModel,
  createScribeTabletDeskModel,
  createGateBullaPedestalModel,
} from "../archaeologicalModels";

export interface LevelSceneResult {
  group: THREE.Group;
  colliders: BoxCollider3D[];
  interactiveEntities: InteractiveEntity3D[];
  spawnPoint: THREE.Vector3;
  spawnRotation: number;
  sunColor: number;
  sunIntensity: number;
  ambientColor: number;
  fogColor: number;
  fogDensity: number;
  animatedProps: {
    update: (dt: number, time: number) => void;
  };
  triggerPulse?: (x: number, y: number, z: number) => void;
  onEntityInspected?: (id: string) => void;
}

export function createLevel1LostCity(mats: StylizedMaterialPalette): LevelSceneResult {
  const group = new THREE.Group();
  const colliders: BoxCollider3D[] = [];
  const interactiveEntities: InteractiveEntity3D[] = [];

  const addEntity = (
    id: string,
    type: InteractiveEntity3D["type"],
    name: string,
    promptLabel: string,
    x: number,
    y: number,
    z: number,
    mesh: THREE.Object3D,
    objectiveAfterInspect?: string,
  ) => {
    mesh.position.set(x, y, z);
    group.add(mesh);

    interactiveEntities.push({
      id,
      type,
      name,
      promptLabel,
      zone: "The Lost City",
      position: new THREE.Vector3(x, y, z),
      interactionRadius: 3.6,
      objectiveAfterInspect,
      isInspected: false,
      mesh,
    });
  };

  // 1. Radiant Atmospheric Sky Dome Enclosure with Animated 3D Clouds
  const cloudSky = createProceduralCloudSky(mats);
  group.add(cloudSky.group);

  // 2. Distant Monumental Harappan Skyline (Citadel Mounds, Granaries, and Towers)
  const skyline = createDistantSkyline(mats);
  group.add(skyline);

  // 3. Organic Rolling Terrain
  const terrain = createRollingTerrain(mats, 140, 140);
  group.add(terrain);

  // 4. Central Paved Ceremonial Boulevard & Covered Brick Drainage Channel
  const roadGeo = new THREE.PlaneGeometry(13, 82);
  const road = new THREE.Mesh(roadGeo, mats.stoneFloor);
  road.rotation.x = -Math.PI / 2;
  road.position.set(0, 0.04, 0);
  road.receiveShadow = true;
  group.add(road);

  // Covered Drainage Channel on West Curb
  const drainMesh = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.18, 76), mats.brickDark);
  drainMesh.position.set(-5.2, 0.09, 0);
  drainMesh.receiveShadow = true;
  group.add(drainMesh);

  // Removable stone inspection sumps with limestone slabs
  for (let z = -32; z <= 32; z += 9.5) {
    const sump = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.26, 2.1), mats.wallCap);
    sump.position.set(-5.2, 0.12, z);
    sump.receiveShadow = true;
    sump.castShadow = true;
    group.add(sump);
  }

  // 5. Radial Stone Plazas (South Entry Plaza & North Gateway Plaza)
  const southPlaza = createRadialStonePlaza(mats, 8.0);
  southPlaza.position.set(0, 0, 26);
  group.add(southPlaza);

  const northPlaza = createRadialStonePlaza(mats, 7.5);
  northPlaza.position.set(0, 0, -22);
  group.add(northPlaza);

  // 6. Perimeter Retaining Walls with Stepped Crenellations
  group.add(createWeatheredBrickWall(mats, colliders, -28, 0, 0, 2.6, 5.4, 82)); // West Citadel Wall
  group.add(createWeatheredBrickWall(mats, colliders, 28, 0, 0, 2.6, 5.4, 82)); // East Citadel Wall
  group.add(createWeatheredBrickWall(mats, colliders, -17, 0, -40, 26, 5.4, 2.6)); // North Boundary Wall (West Wing)
  group.add(createWeatheredBrickWall(mats, colliders, 17, 0, -40, 26, 5.4, 2.6));  // North Boundary Wall (East Wing)
  group.add(createWeatheredBrickWall(mats, colliders, -17, 0, 40, 26, 5.6, 2.6));
  group.add(createWeatheredBrickWall(mats, colliders, 17, 0, 40, 26, 5.6, 2.6));

  // 7. Monumental Harappan Gateways (South Arrival Gate & North Citadel Gate)
  const southGate = createHarappanMonumentalGate(mats, colliders, 0, 0, 40);
  group.add(southGate);

  const northGate = createHarappanMonumentalGate(mats, colliders, 0, 0, -38);
  group.add(northGate);

  // 8. Two-Story Harappan Courtyard Residences
  const houseWest = createHarappanCourtyardHouse(mats, colliders, -18, 0, -14, 0);
  group.add(houseWest);

  const houseEast = createHarappanCourtyardHouse(mats, colliders, 18, 0, 20, Math.PI);
  group.add(houseEast);

  // 9. THE MONUMENTAL GREAT BATH / STEPWELL (East Courtyard Masterpiece Landmark)
  const greatBath = createMonumentalGreatBath(mats, colliders, 15, 0, -6);
  group.add(greatBath.group);

  // 10. Authentic Circular Brick Water Wells
  const well1 = createHarappanWaterWell(mats, colliders, -8.5, 0, 24);
  group.add(well1);

  const well2 = createHarappanWaterWell(mats, colliders, 8.5, 0, -22);
  group.add(well2);

  // 11. Ancient Harappan Wooden Bullock Carts
  const cart1 = createHarappanWoodenCart(mats, -3.8, 0, 16, Math.PI / 6);
  group.add(cart1);

  const cart2 = createHarappanWoodenCart(mats, 4.2, 0, -12, -Math.PI / 4);
  group.add(cart2);

  // 12. Active Archaeological Excavation Camp (West Courtyard)
  const digTrench = createExcavationDigTrench(mats, colliders, -15, 0, 18);
  group.add(digTrench);

  const sortStation = createSortingStation(mats, colliders, -13, 0, 10);
  group.add(sortStation);

  const tent1 = createExcavationTent(mats);
  tent1.position.set(-19, 0, 12);
  group.add(tent1);
  colliders.push({ minX: -21.5, maxX: -16.5, minZ: 9.5, maxZ: 14.5 });

  const tent2 = createExcavationTent(mats);
  tent2.position.set(-19, 0, 2);
  tent2.scale.set(0.92, 0.92, 0.92);
  group.add(tent2);
  colliders.push({ minX: -21, maxX: -17, minZ: 0, maxZ: 4 });

  // 13. Stylized Date Palm Groves & Organic Vegetation
  const palmPositions = [
    { x: -21, z: -28 },
    { x: -19, z: -8 },
    { x: 21, z: 14 },
    { x: 19, z: 30 },
    { x: -10, z: -34 },
    { x: 10, z: -34 },
    { x: 27, z: -6 },
    { x: 3, z: -6 },
  ];

  for (const pp of palmPositions) {
    const palm = createStylizedPalmTree(mats);
    palm.position.set(pp.x, 0, pp.z);
    group.add(palm);
    colliders.push({ minX: pp.x - 0.75, maxX: pp.x + 0.75, minZ: pp.z - 0.75, maxZ: pp.z + 0.75 });
  }

  // Bushes & Shrubs
  const bushPositions = [
    { x: -8.5, z: 29 },
    { x: 8.5, z: 28 },
    { x: -21, z: -19 },
    { x: 21, z: -27 },
    { x: -7.5, z: -17 },
    { x: 8.5, z: 11 },
  ];

  for (const bp of bushPositions) {
    const bush = createStylizedBush(mats, 1.3);
    bush.position.set(bp.x, 0, bp.z);
    group.add(bush);
  }

  // Desert Sandstone Rocks
  const rockPositions = [
    { x: -12, z: 31, s: 1.35 },
    { x: 12, z: 31, s: 1.15 },
    { x: -21, z: 0, s: 1.55 },
    { x: 21, z: -14, s: 1.25 },
    { x: -15, z: -29, s: 1.45 },
    { x: 15, z: 12, s: 1.05 },
  ];

  for (const rp of rockPositions) {
    const rock = createStylizedRock(mats, rp.s, colliders, rp.x, rp.z);
    group.add(rock);
  }

  // Dual-tone Grass Tufts along walls and pavements
  for (let g = 0; g < 32; g++) {
    const gx = (Math.random() - 0.5) * 42;
    const gz = (Math.random() - 0.5) * 64;
    if (Math.abs(gx) > 5.8) {
      const isDry = g % 2 === 0;
      const tuft = createGrassTuft(mats, 0.9 + Math.random() * 0.5, isDry);
      tuft.position.set(gx, 0, gz);
      group.add(tuft);
    }
  }

  // 14. CINEMATIC LEVEL 1 STORY & PUZZLE PROGRESSION ENTITIES
  // Quest Step 1: Field Journal at the Sorting Station
  const logbookModel = createFieldJournalModel(mats);
  addEntity(
    "camp_logbook",
    "marker",
    "DK-G Archaeological Field Journal",
    "Examine Field Journal",
    -13,
    0,
    10,
    logbookModel,
    "The logbook reveals the Master Steatite Seal is missing! Inspect the excavation dig trench stratigraphy.",
  );

  // Quest Step 2: Stratigraphy Profile in Excavation Trench
  const trenchModel = createStratigraphyProfileModel(mats);
  addEntity(
    "trench_strata",
    "mound",
    "Excavation Strata (DK-G Profile)",
    "Inspect Stratigraphic Strata",
    -15,
    0,
    18,
    trenchModel,
    "Mature Harappan stratum confirmed! Search the Great Bath and operate the hydraulic sluice valves.",
  );

  // Quest Step 3: Great Bath Hydraulic Sluice Valve Control (Environmental Puzzle)
  const sluiceModel = createHydraulicSluiceModel(mats);
  addEntity(
    "bath_sluice",
    "water_puzzle",
    "Great Bath Hydraulic Sluice System",
    "Operate Sluice Valves",
    10,
    0,
    -6,
    sluiceModel,
    "Sluice gates engaged! Synthesize trade records at the Northern Scribe Station.",
  );

  // Quest Step 4: Scribe Station Ledger Archives (Accounting Puzzle)
  const scribeDeskModel = createScribeTabletDeskModel(mats);
  addEntity(
    "northern_tablet",
    "merchant_puzzle",
    "Scribe Station Ledger Archives",
    "Decipher Merchant Guild Ledger",
    -7,
    0,
    -20,
    scribeDeskModel,
    "Merchant House 7 identified! Examine the North Gate Clay Bulla to confirm passage clearance.",
  );

  // Quest Step 5: Damaged Clay Bulla Tag by the North Gate
  const bullaPedestalModel = createGateBullaPedestalModel(mats);
  addEntity(
    "seal_impression",
    "seal_impression",
    "Monumental Gate Clay Bulla",
    "Inspect Magistrate Bulla Tag",
    0,
    0,
    -24,
    bullaPedestalModel,
    "Northern passage clearance authorized! Pass through the monumental archway into the Merchant Quarter.",
  );

  // Quest Step 6: Monumental North Archway Portal leading into Level 2
  const northPortalGroup = new THREE.Group();
  const northGateFrame = new THREE.Mesh(new THREE.BoxGeometry(5.0, 6.0, 1.6), mats.wallCap);
  northGateFrame.position.y = 3.0;
  northGateFrame.castShadow = true;
  northPortalGroup.add(northGateFrame);
  addEntity(
    "passage_gate",
    "passage_gate",
    "Archway to Merchant Quarter",
    "Enter Chapter 2: Merchant Quarter",
    0,
    0,
    -37.8,
    northPortalGroup,
    "Entering Chapter 2: The Merchant Quarter...",
  );

  // ── TORCHES ────────────────────────────────────────────────────────────────
  // Boulevard torches — paired every ~12m along the central road
  const torches: TorchInstance[] = [];
  const torchPositions: [number, number, number, number, number][] = [
    // [x, y, z, wallDir, flickerOffset]
    [ 5.5, 1.4,  16,  Math.PI,       0.0],
    [-5.5, 1.4,  16,  0,             0.7],
    [ 5.5, 1.4,   4,  Math.PI,       1.4],
    [-5.5, 1.4,   4,  0,             2.1],
    [ 5.5, 1.4,  -8,  Math.PI,       2.8],
    [-5.5, 1.4,  -8,  0,             0.3],
    [ 5.5, 1.4, -20,  Math.PI,       1.1],
    [-5.5, 1.4, -20,  0,             1.8],
    // Gate approach torches
    [ 2.8, 2.2, -30,  Math.PI / 2,   0.5],
    [-2.8, 2.2, -30, -Math.PI / 2,   1.3],
    // Great Bath torches
    [ 8.0, 1.6,   0,  Math.PI * 0.75, 2.2],
    [-8.0, 1.6,   0,  Math.PI * 1.25, 0.9],
  ];
  for (const [x, y, z, dir, offset] of torchPositions) {
    const torch = createTorch(x, y, z, dir, offset);
    group.add(torch.group);
    torches.push(torch);
  }

  // ── FLOATING DUST PARTICLES ────────────────────────────────────────────────
  const dust = createFloatingDust(200, 32);
  group.add(dust.points);

  // ── RUNE GLOWS on interactive objects ─────────────────────────────────────
  const runeGlows: RuneGlow[] = [];

  // Logbook rune
  const runeLogbook = createRuneGlow(12, 0.9, 22, 0);
  group.add(runeLogbook.group);
  runeGlows.push(runeLogbook);

  // Great Bath rune
  const runeBath = createRuneGlow(0, -1.6, 0, Math.PI / 2);
  group.add(runeBath.group);
  runeGlows.push(runeBath);

  // Northern Trench rune
  const runeTrench = createRuneGlow(-7, 0.85, -20, 0);
  group.add(runeTrench.group);
  runeGlows.push(runeTrench);

  // North Gate rune
  const runeGate = createRuneGlow(0, 1.2, -24, 0);
  group.add(runeGate.group);
  runeGlows.push(runeGate);

  // ── ACTIVATION PULSE ───────────────────────────────────────────────────────
  const activationPulse: ActivationPulse = createActivationPulse(0x00dddd);
  group.add(activationPulse.mesh);

  return {
    group,
    colliders,
    interactiveEntities,
    spawnPoint: new THREE.Vector3(0, 0, 26),
    spawnRotation: Math.PI,
    sunColor: 0xffeed8,
    sunIntensity: 2.0,
    ambientColor: 0x483a2d,
    fogColor: 0x6da4d6, // Clean atmospheric cerulean blue haze
    fogDensity: 0.005,
    animatedProps: {
      update: (dt, time) => {
        // Slowly drifting 3D volumetric clouds
        cloudSky.update(dt, time);
        // Water caustic wave oscillation
        greatBath.waterMesh.position.y = -3.2 + 1.4 + Math.sin(time * 2.4) * 0.035;
        // Torch flicker
        for (const torch of torches) torch.update(time);
        // Dust drift
        dust.update(dt, time);
        // Rune rotation + pulse
        for (const rune of runeGlows) rune.update(time);
        // Activation pulse expand
        activationPulse.update(dt);
      },
    },
    triggerPulse: (x: number, y: number, z: number) => {
      activationPulse.trigger(x, y, z);
    },
    onEntityInspected: (id: string) => {
      const ent = interactiveEntities.find(e => e.id === id);
      if (ent) {
        activationPulse.trigger(ent.position.x, ent.position.y + 0.5, ent.position.z);
      }
    },
  };
}

