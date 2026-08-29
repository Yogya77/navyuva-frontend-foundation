import * as THREE from "three";
import type { InteractiveEntity3D, BoxCollider3D } from "../types";
import type { StylizedMaterialPalette } from "../materials";
import type { LevelSceneResult } from "./level1LostCity";
import {
  createPotteryCluster,
  createDistantSkyline,
  createWeatheredBrickWall,
  createTorch,
  type TorchInstance,
  createStylizedRock,
  createGrassTuft,
} from "../environmentHelpers";
import {
  createFloatingDust,
  createRuneGlow,
  type RuneGlow,
  createActivationPulse,
  type ActivationPulse,
} from "../vfx";

export function createLevel2MerchantQuarter(mats: StylizedMaterialPalette): LevelSceneResult {
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
      zone: "Merchant Quarter",
      position: new THREE.Vector3(x, y, z),
      interactionRadius: 3.2,
      objectiveAfterInspect,
      isInspected: false,
      mesh,
    });
  };

  // 1. Distant Skyline Background (Citadel Mounds and Granary Outlines)
  const skyline = createDistantSkyline(mats);
  group.add(skyline);

  // 2. Cobbled Merchant Street Ground Floor with Material Layering
  const groundGeo = new THREE.PlaneGeometry(80, 80);
  const ground = new THREE.Mesh(groundGeo, mats.stoneFloor);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  group.add(ground);

  // Raised Brick Walkways flanking both sides of the main market street
  const westWalkway = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.18, 68), mats.brickDark);
  westWalkway.position.set(-13, 0.09, 0);
  westWalkway.receiveShadow = true;
  group.add(westWalkway);

  const eastWalkway = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.18, 68), mats.brickDark);
  eastWalkway.position.set(13, 0.09, 0);
  eastWalkway.receiveShadow = true;
  group.add(eastWalkway);

  // Central Covered Harappan Drainage Channel with stone slabs
  const drainGeo = new THREE.BoxGeometry(1.6, 0.12, 64);
  const drainBase = new THREE.Mesh(drainGeo, mats.brick);
  drainBase.position.set(0, 0.01, 0);
  drainBase.receiveShadow = true;
  group.add(drainBase);

  const drainWater = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 62), mats.water);
  drainWater.rotation.x = -Math.PI / 2;
  drainWater.position.set(0, 0.04, 0);
  group.add(drainWater);

  // Intermittent Stone Crossing Slabs across the drain
  for (let z = -24; z <= 24; z += 8) {
    const slab = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 1.2), mats.wallCap);
    slab.position.set(0, 0.07, z);
    slab.receiveShadow = true;
    slab.castShadow = true;
    group.add(slab);
  }

  // 3. Dense Multi-Story Merchant Buildings & Perimeter Facades with Recessed Windows & Lintels
  group.add(createWeatheredBrickWall(mats, colliders, -20, 0, 0, 2.5, 7.5, 70)); // West High Facade
  group.add(createWeatheredBrickWall(mats, colliders, 20, 0, 0, 2.5, 7.5, 70)); // East High Facade
  group.add(createWeatheredBrickWall(mats, colliders, 0, 0, 32, 40, 7.0, 2.5)); // South Wall (Entry from Level 1)

  // Architectural detailing on West/East Facades (Recessed Windows & Timber Lintels)
  for (let z = -24; z <= 24; z += 12) {
    // West windows & lintels
    const lintelW = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 1.8), mats.woodPlank);
    lintelW.position.set(-18.7, 4.2, z);
    lintelW.castShadow = true;
    group.add(lintelW);

    const windowW = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 1.4), mats.brickDark);
    windowW.position.set(-18.7, 3.5, z);
    group.add(windowW);

    // East windows & lintels
    const lintelE = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 1.8), mats.woodPlank);
    lintelE.position.set(18.7, 4.2, z);
    lintelE.castShadow = true;
    group.add(lintelE);

    const windowE = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 1.4), mats.brickDark);
    windowE.position.set(18.7, 3.5, z);
    group.add(windowE);
  }

  // High Overhead Timber Rafters / Cross-Beams between Bazaar walls
  for (let z = -20; z <= 20; z += 10) {
    const beam = new THREE.Mesh(new THREE.BoxGeometry(37.5, 0.28, 0.28), mats.woodPlank);
    beam.position.set(0, 6.2, z);
    beam.castShadow = true;
    group.add(beam);
  }

  // North Monumental Vault Wall with the Giant Symbol Gate
  group.add(createWeatheredBrickWall(mats, colliders, -12, 0, -32, 18, 7.5, 2.5));
  group.add(createWeatheredBrickWall(mats, colliders, 12, 0, -32, 18, 7.5, 2.5));

  // 4. THE 3D SLIDING SYMBOL GATE (Monumental Stone Door)
  const gateDoor = new THREE.Mesh(new THREE.BoxGeometry(5.0, 6.0, 1.2), mats.brickDark);
  gateDoor.position.set(0, 3.0, -32);
  gateDoor.castShadow = true;
  gateDoor.receiveShadow = true;
  group.add(gateDoor);

  const gateCollider: BoxCollider3D = {
    minX: -2.5,
    maxX: 2.5,
    minZ: -32.8,
    maxZ: -31.2,
    name: "symbol_puzzle_gate",
  };
  colliders.push(gateCollider);

  // Gate Arch Framing & Carved Relief Pilasters
  const gateArch = new THREE.Mesh(new THREE.BoxGeometry(8.2, 1.8, 2.2), mats.wallCap);
  gateArch.position.set(0, 6.9, -32);
  gateArch.castShadow = true;
  group.add(gateArch);

  const gatePilasterL = new THREE.Mesh(new THREE.BoxGeometry(1.4, 7.0, 2.0), mats.wallCap);
  gatePilasterL.position.set(-3.2, 3.5, -32);
  gatePilasterL.castShadow = true;
  group.add(gatePilasterL);

  const gatePilasterR = new THREE.Mesh(new THREE.BoxGeometry(1.4, 7.0, 2.0), mats.wallCap);
  gatePilasterR.position.set(3.2, 3.5, -32);
  gatePilasterR.castShadow = true;
  group.add(gatePilasterR);

  // Decorative Stepped Cornice above Gate
  const cornice = new THREE.Mesh(new THREE.BoxGeometry(9.0, 0.4, 2.6), mats.brickDark);
  cornice.position.set(0, 7.9, -32);
  cornice.castShadow = true;
  group.add(cornice);

  // Interior Warehouse Partitions & Storage Alleys
  group.add(createWeatheredBrickWall(mats, colliders, -8, 0, 10, 14, 5.0, 1.5));
  group.add(createWeatheredBrickWall(mats, colliders, -8, 0, -10, 14, 5.0, 1.5));
  group.add(createWeatheredBrickWall(mats, colliders, 8, 0, 16, 14, 5.0, 1.5));
  group.add(createWeatheredBrickWall(mats, colliders, 8, 0, -16, 14, 5.0, 1.5));

  // 5. Circular Harappan Brick Water Well with Wooden Pulley Frame
  const wellGroup = new THREE.Group();
  const well = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.0, 1.4, 20), mats.brick);
  well.position.y = 0.7;
  well.castShadow = true;
  well.receiveShadow = true;
  wellGroup.add(well);

  const wellCoping = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 0.2, 20), mats.wallCap);
  wellCoping.position.y = 1.4;
  wellCoping.castShadow = true;
  wellGroup.add(wellCoping);

  const wellWater = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.1, 16), mats.water);
  wellWater.position.y = 0.6;
  wellGroup.add(wellWater);

  // Pulley Timber Frame
  const wellPost1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.6, 8), mats.woodPlank);
  wellPost1.position.set(-1.4, 2.0, 0);
  wellPost1.castShadow = true;
  wellGroup.add(wellPost1);

  const wellPost2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.6, 8), mats.woodPlank);
  wellPost2.position.set(1.4, 2.0, 0);
  wellPost2.castShadow = true;
  wellGroup.add(wellPost2);

  const wellCrossbar = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.14, 0.14), mats.woodPlank);
  wellCrossbar.position.set(0, 3.2, 0);
  wellCrossbar.castShadow = true;
  wellGroup.add(wellCrossbar);

  wellGroup.position.set(-6, 0, 20);
  group.add(wellGroup);
  colliders.push({ minX: -8.2, maxX: -3.8, minZ: 17.8, maxZ: 22.2 });

  // 6. Covered Textile Bazaar Awnings & Merchant Stalls
  // East Textile Stall with draped canvas and wooden counter
  const awning1 = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.12, 4.5), mats.clothTrim);
  awning1.position.set(11, 3.8, 0);
  awning1.rotation.z = -0.18;
  awning1.castShadow = true;
  group.add(awning1);

  const pole1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.8, 8), mats.woodPlank);
  pole1.position.set(8.2, 1.9, -2.0);
  pole1.castShadow = true;
  group.add(pole1);

  const pole2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.8, 8), mats.woodPlank);
  pole2.position.set(8.2, 1.9, 2.0);
  pole2.castShadow = true;
  group.add(pole2);

  // West Grain & Spice Canopy Stall
  const awning2 = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.10, 4.0), mats.clothTent);
  awning2.position.set(-11, 3.6, -8);
  awning2.rotation.z = 0.16;
  awning2.castShadow = true;
  group.add(awning2);

  const pole3 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.6, 8), mats.woodPlank);
  pole3.position.set(-8.2, 1.8, -9.8);
  pole3.castShadow = true;
  group.add(pole3);

  const pole4 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.6, 8), mats.woodPlank);
  pole4.position.set(-8.2, 1.8, -6.2);
  pole4.castShadow = true;
  group.add(pole4);

  // Overturned Merchant Cart Prop with Spilled Pottery & Grain Sacks
  const cartGroup = new THREE.Group();
  const cartBed = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.15, 1.4), mats.woodPlank);
  cartBed.position.set(0, 0.5, 0);
  cartBed.rotation.z = 0.35;
  cartBed.castShadow = true;
  cartGroup.add(cartBed);

  const wheelGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.12, 16);
  const wheel = new THREE.Mesh(wheelGeo, mats.woodPlank);
  wheel.position.set(-0.8, 0.55, 0.75);
  wheel.rotation.x = Math.PI / 2;
  wheel.castShadow = true;
  cartGroup.add(wheel);

  // Spilled grain sacks near cart
  const sack1 = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), mats.clothTent);
  sack1.scale.set(1.2, 0.7, 0.9);
  sack1.position.set(0.6, 0.25, 0.4);
  sack1.castShadow = true;
  cartGroup.add(sack1);

  cartGroup.position.set(-4, 0, -2);
  group.add(cartGroup);
  colliders.push({ minX: -5.5, maxX: -2.5, minZ: -3.2, maxZ: -0.8 });

  // Additional Decorative Pottery Clusters & Storage Crates around the Quarter
  const potClusterEast = createPotteryCluster(mats);
  potClusterEast.position.set(13.5, 0.2, 8);
  group.add(potClusterEast);

  const potClusterWest = createPotteryCluster(mats);
  potClusterWest.position.set(-13.5, 0.2, -18);
  group.add(potClusterWest);

  // Stacked Cargo Crates near West warehouse
  for (let ci = 0; ci < 3; ci++) {
    const crate = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.9, 1.0), mats.woodPlank);
    crate.position.set(-13.5, 0.45 + (ci === 2 ? 0.9 : 0), 12 + (ci === 1 ? 1.1 : 0));
    crate.castShadow = true;
    crate.receiveShadow = true;
    group.add(crate);
  }
  colliders.push({ minX: -14.2, maxX: -12.8, minZ: 11.2, maxZ: 13.8 });

  // Rocks and dry desert shrubs nestled against building foundations
  group.add(createStylizedRock(mats, 0.9, colliders, -17.5, 18));
  group.add(createStylizedRock(mats, 0.7, colliders, 17.5, -22));
  group.add(createStylizedRock(mats, 0.8, colliders, -17.5, -25));

  const grass1 = createGrassTuft(mats, 0.8, true);
  grass1.position.set(-16.5, 0, 15);
  group.add(grass1);

  const grass2 = createGrassTuft(mats, 0.75, true);
  grass2.position.set(16.5, 0, -18);
  group.add(grass2);

  const grass3 = createGrassTuft(mats, 0.7, false);
  grass3.position.set(-4.5, 0, 22);
  group.add(grass3);

  // 7. Interactive In-World Entities (Level 2 Investigation)
  // Find 1: Standardized Binary Chert Weights on table
  const weightsGroup = new THREE.Group();
  const table = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.9, 1.1), mats.woodPlank);
  table.position.y = 0.45;
  table.castShadow = true;
  table.receiveShadow = true;
  weightsGroup.add(table);

  // 4 cubic binary chert weights (1:2:4:8 ratio)
  for (let w = 0; w < 4; w++) {
    const size = 0.14 * (w + 1);
    const cube = new THREE.Mesh(new THREE.BoxGeometry(size, size, size), mats.wallCap);
    cube.position.set(-0.6 + w * 0.32, 0.95 + size / 2, 0);
    cube.castShadow = true;
    weightsGroup.add(cube);
  }
  addEntity(
    "crate",
    "crate",
    "Standardized Binary Chert Weights",
    "Examine Balance Weights",
    10,
    0,
    0,
    weightsGroup,
    "Inspect the merchant account tablets in the west corridor.",
  );

  // Find 2: Merchant Guild Inscribed Account Tablet
  const tablet = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.16, 0.65), mats.steatiteSeal);
  tablet.position.y = 0.08;
  tablet.castShadow = true;
  addEntity(
    "tablet",
    "tablet",
    "Merchant Guild Account Tablet",
    "Read Trade Records",
    -11,
    0,
    0,
    tablet,
    "Search the storage amphorae and clay bullae.",
  );

  // Find 3: Export Storage Amphorae & Clay Bullae
  const pottery1 = createPotteryCluster(mats);
  pottery1.position.set(10, 0, -10);
  addEntity(
    "storage_jars",
    "storage_jars",
    "Grain & Oil Storage Amphorae",
    "Inspect Clay Bullae Tags",
    10,
    0,
    -10,
    pottery1,
    "Approach the ancient Carved Symbol Gate at the north wall!",
  );

  // Find 4: Carved Symbol Gate Mechanism (Environmental Puzzle)
  const symMechanismGroup = new THREE.Group();
  const lockBase = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.0, 0.7), mats.goldBrass);
  lockBase.position.y = 1.5;
  lockBase.castShadow = true;
  symMechanismGroup.add(lockBase);

  // 4 Symbol Glyphs in relief
  for (let s = 0; s < 4; s++) {
    const glyphSlot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 0.08, 16),
      mats.steatiteSeal,
    );
    glyphSlot.position.set(-0.5 + (s % 2) * 1.0, 1.8 - Math.floor(s / 2) * 0.9, 0.36);
    glyphSlot.rotation.x = Math.PI / 2;
    glyphSlot.castShadow = true;
    symMechanismGroup.add(glyphSlot);
  }
  addEntity(
    "symbol_puzzle_gate",
    "symbol_puzzle_gate",
    "Carved Indus Symbol Gate",
    "Examine Symbol Lock Mechanism",
    0,
    0,
    -30.5,
    symMechanismGroup,
    "Solve the 4-sign sequence to open the stone gate to Level 3!",
  );

  // ── TORCHES ─────────────────────────────────────────────────────────────────
  // High-quality flickering torches along the merchant corridors & gate
  const torches: TorchInstance[] = [];
  const torchPositions: [number, number, number, number, number][] = [
    // [x, y, z, wallDir, flickerOffset]
    // West corridor wall torches
    [-18.5, 2.2,  16,  Math.PI / 2,   0.0],
    [-18.5, 2.2,   4,  Math.PI / 2,   0.8],
    [-18.5, 2.2,  -8,  Math.PI / 2,   1.6],
    [-18.5, 2.2, -20,  Math.PI / 2,   2.4],
    // East corridor wall torches
    [ 18.5, 2.2,  16, -Math.PI / 2,   0.4],
    [ 18.5, 2.2,   4, -Math.PI / 2,   1.2],
    [ 18.5, 2.2,  -8, -Math.PI / 2,   2.0],
    [ 18.5, 2.2, -20, -Math.PI / 2,   2.8],
    // Gate framing torches
    [-3.8,  2.8, -30.8, 0,            0.6],
    [ 3.8,  2.8, -30.8, 0,            1.4],
    // Water well torch
    [-6.0,  2.2,  22.2, Math.PI,      2.1],
  ];

  for (const [x, y, z, dir, offset] of torchPositions) {
    const torch = createTorch(x, y, z, dir, offset);
    group.add(torch.group);
    torches.push(torch);
  }

  // ── FLOATING DUST PARTICLES ────────────────────────────────────────────────
  const dust = createFloatingDust(190, 36);
  group.add(dust.points);

  // ── RUNE GLOWS on interactive objects ─────────────────────────────────────
  const runeGlows: RuneGlow[] = [];

  // Weights table rune
  const runeWeights = createRuneGlow(10, 1.15, 0, 0, 0x00cccc);
  group.add(runeWeights.group);
  runeGlows.push(runeWeights);

  // Account tablet rune
  const runeTablet = createRuneGlow(-11, 0.45, 0, 0, 0x00cccc);
  group.add(runeTablet.group);
  runeGlows.push(runeTablet);

  // Storage jars rune
  const runeJars = createRuneGlow(10, 0.85, -10, 0, 0x00cccc);
  group.add(runeJars.group);
  runeGlows.push(runeJars);

  // Symbol Gate lock rune
  const runeGate = createRuneGlow(0, 2.1, -30.5, 0, 0x00dddd);
  group.add(runeGate.group);
  runeGlows.push(runeGate);

  // Activation pulse ring
  const activationPulse: ActivationPulse = createActivationPulse(0x00ffff);
  group.add(activationPulse.mesh);

  let gateProgress = 0;

  return {
    group,
    colliders,
    interactiveEntities,
    spawnPoint: new THREE.Vector3(0, 0, 26),
    spawnRotation: Math.PI,
    sunColor: 0xffb86c, // Rich warm late-afternoon golden amber sunlight
    sunIntensity: 2.2,
    ambientColor: 0x5a3e2e, // Moody Harappan brick ambient bounce
    fogColor: 0xb5784a,
    fogDensity: 0.014,
    animatedProps: {
      update: (dt, time) => {
        // Torch flicker
        for (const torch of torches) torch.update(time);

        // Floating dust drift
        dust.update(dt, time);

        // Rune rotation and pulse
        for (const rune of runeGlows) rune.update(time);

        // Activation pulse update
        activationPulse.update(dt);

        // Water ripple in central drainage channel and well
        drainWater.position.y = 0.04 + Math.sin(time * 2.0) * 0.008;
        wellWater.position.y = 0.6 + Math.sin(time * 2.2) * 0.012;

        // Dynamic Gate opening animation when symbol puzzle is solved
        const isGateOpened = !colliders.some(c => c.name === "symbol_puzzle_gate");
        if (isGateOpened && gateProgress < 1) {
          gateProgress = Math.min(1, gateProgress + dt * 1.4);
          gateDoor.position.y = 3.0 - gateProgress * 5.8;
        }
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


