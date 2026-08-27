import * as THREE from "three";
import type { InteractiveEntity3D, BoxCollider3D } from "../types";
import type { StylizedMaterialPalette } from "../materials";
import {
  createSkyDome,
  createRollingTerrain,
  createStylizedRock,
  createGrassTuft,
  createStylizedPalmTree,
  createStylizedBush,
  createPotteryCluster,
  createExcavationTent,
  createDistantSkyline,
  createWeatheredBrickWall,
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

  // 1. Radiant Sky Dome Enclosure
  const skyDome = createSkyDome(mats);
  group.add(skyDome);

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
  group.add(createWeatheredBrickWall(mats, colliders, 0, 0, -40, 56, 5.4, 2.6)); // North Boundary Wall
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
  // Quest Step 1: Excavation Logbook at the Sorting Station
  const logbookGroup = new THREE.Group();
  const logMesh = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.08, 0.5), mats.clothTent);
  logMesh.position.y = 1.05;
  logMesh.castShadow = true;
  logbookGroup.add(logMesh);
  addEntity(
    "camp_logbook",
    "marker",
    "Excavation Logbook & Field Calipers",
    "Read Excavation Logbook",
    -13,
    0,
    10,
    logbookGroup,
    "The logbook notes an uncatalogued votive deposit inside the Great Bath reservoir! Explore the pool.",
  );

  // Quest Step 2: Painted Red Ware Amphorae inside the Great Bath
  const pottery = createPotteryCluster(mats);
  addEntity(
    "bath_pottery",
    "pottery",
    "Submerged Storage Amphorae",
    "Inspect Votive Amphora",
    10,
    0,
    -6,
    pottery,
    "A carved soapstone tablet was uncovered! Study it at the Northern Excavation Trench.",
  );

  // Quest Step 3: Inscribed Soapstone Testing Slab at the Northern Trench
  const slabGroup = new THREE.Group();
  const slab = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.2, 0.9), mats.steatiteSeal);
  slab.position.y = 0.1;
  slab.castShadow = true;
  slabGroup.add(slab);
  addEntity(
    "northern_tablet",
    "tablet",
    "Inscribed Soapstone Testing Slab",
    "Study Indus Glyphs",
    -7,
    0,
    -20,
    slabGroup,
    "The tablet describes the seal locking the Monumental North Gate! Examine the Gate Seal Impression.",
  );

  // Quest Step 4: Damaged Clay Seal Impression by the North Gate
  const sealImpGroup = new THREE.Group();
  const sealImp = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.12, 16), mats.brickDark);
  sealImp.position.y = 0.06;
  sealImp.castShadow = true;
  sealImpGroup.add(sealImp);
  addEntity(
    "seal_impression",
    "seal_impression",
    "Monumental Gate Seal Impression",
    "Decipher Gate Impression",
    0,
    0,
    -24,
    sealImpGroup,
    "The path into the Merchant Quarter is open! Pass through the northern archway.",
  );

  // Quest Step 5: Monumental North Archway Portal leading into Level 2
  const northPortalGroup = new THREE.Group();
  const northGateFrame = new THREE.Mesh(new THREE.BoxGeometry(5.0, 6.0, 1.6), mats.wallCap);
  northGateFrame.position.y = 3.0;
  northGateFrame.castShadow = true;
  northPortalGroup.add(northGateFrame);
  addEntity(
    "passage_gate",
    "passage_gate",
    "Archway to Merchant Quarter",
    "Enter Level 2: Merchant Quarter",
    0,
    0,
    -37.8,
    northPortalGroup,
    "Entering Level 2: The Merchant Quarter...",
  );

  return {
    group,
    colliders,
    interactiveEntities,
    spawnPoint: new THREE.Vector3(0, 0, 26),
    spawnRotation: Math.PI,
    sunColor: 0xffedd0, // Radiant warm golden sunrise sunlight
    sunIntensity: 2.8,
    ambientColor: 0x8aa8c8, // Soft azure sky ambient bounce
    fogColor: 0xe8cfb0,
    fogDensity: 0.007,
    animatedProps: {
      update: (_dt, time) => {
        // Water caustic wave oscillation
        greatBath.waterMesh.position.y = -3.2 + 1.4 + Math.sin(time * 2.4) * 0.035;
      },
    },
  };
}
