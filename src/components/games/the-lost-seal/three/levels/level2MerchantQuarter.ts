import * as THREE from "three";
import type { InteractiveEntity3D, BoxCollider3D } from "../types";
import type { StylizedMaterialPalette } from "../materials";
import type { LevelSceneResult } from "./level1LostCity";
import {
  createPotteryCluster,
  createDistantSkyline,
  createWeatheredBrickWall,
} from "../environmentHelpers";

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

  // 1. Distant Skyline Background
  const skyline = createDistantSkyline(mats);
  group.add(skyline);

  // 2. Cobbled Merchant Street Ground Floor
  const groundGeo = new THREE.PlaneGeometry(80, 80);
  const ground = new THREE.Mesh(groundGeo, mats.stoneFloor);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  group.add(ground);

  // 3. Dense Multi-Story Merchant Buildings & Perimeter Walls
  group.add(createWeatheredBrickWall(mats, colliders, -20, 0, 0, 2.5, 7.0, 70)); // West High Facade
  group.add(createWeatheredBrickWall(mats, colliders, 20, 0, 0, 2.5, 7.0, 70)); // East High Facade
  group.add(createWeatheredBrickWall(mats, colliders, 0, 0, 32, 40, 7.0, 2.5)); // South Wall (Entry from Level 1)

  // North Monumental Vault Wall with the Giant Symbol Gate
  group.add(createWeatheredBrickWall(mats, colliders, -12, 0, -32, 18, 7.5, 2.5));
  group.add(createWeatheredBrickWall(mats, colliders, 12, 0, -32, 18, 7.5, 2.5));

  // 4. THE 3D SLIDING SYMBOL GATE (Gate 1 Door Mesh)
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

  // Gate Arch Framing & Relief Pillars
  const gateArch = new THREE.Mesh(new THREE.BoxGeometry(7.5, 1.6, 2.0), mats.wallCap);
  gateArch.position.set(0, 6.8, -32);
  gateArch.castShadow = true;
  group.add(gateArch);

  // Interior Warehouse Partitions & Storage Alleys
  group.add(createWeatheredBrickWall(mats, colliders, -8, 0, 10, 14, 5.0, 1.5));
  group.add(createWeatheredBrickWall(mats, colliders, -8, 0, -10, 14, 5.0, 1.5));
  group.add(createWeatheredBrickWall(mats, colliders, 8, 0, 16, 14, 5.0, 1.5));
  group.add(createWeatheredBrickWall(mats, colliders, 8, 0, -16, 14, 5.0, 1.5));

  // 5. Circular Harappan Brick Water Well
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
  wellGroup.position.set(-6, 0, 20);
  group.add(wellGroup);
  colliders.push({ minX: -8.2, maxX: -3.8, minZ: 17.8, maxZ: 22.2 });

  // 6. Covered Textile Bazaar Awnings & Merchant Stalls
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

  // Overturned Merchant Cart Prop
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

  cartGroup.position.set(-4, 0, -2);
  group.add(cartGroup);
  colliders.push({ minX: -5.5, maxX: -2.5, minZ: -3.2, maxZ: -0.8 });

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

  // Torchlight Sconces along the merchant corridors
  const torchLights: THREE.PointLight[] = [];
  const tPositions = [
    { x: -18, y: 3.2, z: 12 },
    { x: -18, y: 3.2, z: -12 },
    { x: 18, y: 3.2, z: 12 },
    { x: 18, y: 3.2, z: -12 },
    { x: 0, y: 4.2, z: -29 },
  ];

  for (const tp of tPositions) {
    const torch = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.6, 8), mats.torchWood);
    torch.position.set(tp.x, tp.y, tp.z);
    torch.rotation.z = tp.x < 0 ? -Math.PI / 6 : Math.PI / 6;
    group.add(torch);

    const light = new THREE.PointLight(0xf59e0b, 2.2, 10, 1.3);
    light.position.set(tp.x, tp.y + 0.35, tp.z);
    light.castShadow = true;
    group.add(light);
    torchLights.push(light);
  }

  let isGateOpened = false;
  let gateProgress = 0;

  return {
    group,
    colliders,
    interactiveEntities,
    spawnPoint: new THREE.Vector3(0, 0, 26),
    spawnRotation: Math.PI,
    sunColor: 0xfbd38d, // Late afternoon warm amber
    sunIntensity: 1.8,
    ambientColor: 0x6e4e34,
    fogColor: 0xc49666,
    fogDensity: 0.016,
    animatedProps: {
      update: (dt, time) => {
        // Torch flicker
        torchLights.forEach((tl, idx) => {
          tl.intensity = 2.2 + Math.sin(time * 8.5 + idx * 2) * 0.35;
        });

        // Gate opening animation
        if (isGateOpened && gateProgress < 1) {
          gateProgress = Math.min(1, gateProgress + dt * 1.4);
          gateDoor.position.y = 3.0 - gateProgress * 5.8;
        }
      },
    },
  };
}
