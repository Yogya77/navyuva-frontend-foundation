import * as THREE from "three";
import type { StylizedMaterialPalette } from "./materials";
import type { BoxCollider3D } from "./types";

/**
 * Creates a monumental Harappan Stepwell / Great Bath with geometric stepped pyramidal
 * stairways descending on all 4 sides into glistening water, surrounded by columned
 * porticoes with timber pergolas and terracotta storage jars.
 */
export function createMonumentalGreatBath(
  mats: StylizedMaterialPalette,
  colliders: BoxCollider3D[],
  x: number,
  y: number,
  z: number,
): { group: THREE.Group; waterMesh: THREE.Mesh } {
  const bathGroup = new THREE.Group();

  // 1. Deep sunken reservoir basin
  const basinW = 26;
  const basinD = 34;
  const basinH = 3.2;

  const basinBase = new THREE.Mesh(new THREE.BoxGeometry(basinW, 0.6, basinD), mats.brickDark);
  basinBase.position.y = -basinH + 0.3;
  basinBase.receiveShadow = true;
  bathGroup.add(basinBase);

  // 2. Stepped Pyramidal Stairways on North and South sides
  const stepLevels = 10;
  const stepH = basinH / stepLevels;
  const stepDepth = 0.95;

  // South Steps (Main entrance descent)
  for (let s = 0; s < stepLevels; s++) {
    const sw = basinW - 4.0 - s * 1.1;
    const stepGeo = new THREE.BoxGeometry(sw, stepH, stepDepth);
    const stepMesh = new THREE.Mesh(stepGeo, mats.brick);
    stepMesh.position.set(0, -basinH + (s + 0.5) * stepH, basinD / 2 - (s + 0.5) * stepDepth);
    stepMesh.receiveShadow = true;
    stepMesh.castShadow = true;
    bathGroup.add(stepMesh);
  }

  // North Steps (Sacred inner descent)
  for (let s = 0; s < stepLevels; s++) {
    const sw = basinW - 4.0 - s * 1.1;
    const stepGeo = new THREE.BoxGeometry(sw, stepH, stepDepth);
    const stepMesh = new THREE.Mesh(stepGeo, mats.brick);
    stepMesh.position.set(0, -basinH + (s + 0.5) * stepH, -basinD / 2 + (s + 0.5) * stepDepth);
    stepMesh.receiveShadow = true;
    stepMesh.castShadow = true;
    bathGroup.add(stepMesh);
  }

  // 3. Side Terraces & Brick Retaining Walls
  const sideWallL = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, basinH + 1.2, basinD + 4),
    mats.brick,
  );
  sideWallL.position.set(-basinW / 2 - 1.2, 0.6 - basinH / 2, 0);
  sideWallL.castShadow = true;
  sideWallL.receiveShadow = true;
  bathGroup.add(sideWallL);

  const sideWallR = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, basinH + 1.2, basinD + 4),
    mats.brick,
  );
  sideWallR.position.set(basinW / 2 + 1.2, 0.6 - basinH / 2, 0);
  sideWallR.castShadow = true;
  sideWallR.receiveShadow = true;
  bathGroup.add(sideWallR);

  // 4. Surrounding Colonnaded Portico with Timber Pergola Roof
  const colPositions = [
    { x: -basinW / 2 + 1.5, z: -basinD / 2 + 2 },
    { x: basinW / 2 - 1.5, z: -basinD / 2 + 2 },
    { x: -basinW / 2 + 1.5, z: 0 },
    { x: basinW / 2 - 1.5, z: 0 },
    { x: -basinW / 2 + 1.5, z: basinD / 2 - 2 },
    { x: basinW / 2 - 1.5, z: basinD / 2 - 2 },
  ];

  for (const cp of colPositions) {
    const colGroup = new THREE.Group();
    // Square Brick Plinth
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 1.2), mats.brickDark);
    plinth.position.y = 0.3;
    plinth.castShadow = true;
    colGroup.add(plinth);

    // Cylindrical Column Shaft
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.46, 3.8, 16), mats.brick);
    shaft.position.y = 2.5;
    shaft.castShadow = true;
    shaft.receiveShadow = true;
    colGroup.add(shaft);

    // Carved Capital
    const cap = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.4, 1.3), mats.wallCap);
    cap.position.y = 4.6;
    cap.castShadow = true;
    colGroup.add(cap);

    colGroup.position.set(cp.x, 0, cp.z);
    bathGroup.add(colGroup);

    colliders.push({
      minX: x + cp.x - 0.7,
      maxX: x + cp.x + 0.7,
      minZ: z + cp.z - 0.7,
      maxZ: z + cp.z + 0.7,
    });
  }

  // Timber Pergola Beams spanning columns
  const beamL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.4, basinD), mats.woodPlank);
  beamL.position.set(-basinW / 2 + 1.5, 4.8, 0);
  beamL.castShadow = true;
  bathGroup.add(beamL);

  const beamR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.4, basinD), mats.woodPlank);
  beamR.position.set(basinW / 2 - 1.5, 4.8, 0);
  beamR.castShadow = true;
  bathGroup.add(beamR);

  // Wicker / Timber Cross battens
  for (let b = -basinD / 2 + 2; b <= basinD / 2 - 2; b += 2.8) {
    const crossBeam = new THREE.Mesh(
      new THREE.BoxGeometry(basinW - 1.0, 0.16, 0.25),
      mats.woodPlank,
    );
    crossBeam.position.set(0, 4.9, b);
    crossBeam.castShadow = true;
    bathGroup.add(crossBeam);
  }

  // 5. Translucent Caustic Water Surface
  const waterGeo = new THREE.PlaneGeometry(basinW - 3.0, basinD - 4.0);
  const waterMesh = new THREE.Mesh(waterGeo, mats.water);
  waterMesh.rotation.x = -Math.PI / 2;
  waterMesh.position.set(0, -basinH + 1.4, 0);
  bathGroup.add(waterMesh);

  bathGroup.position.set(x, y, z);

  // Outer border colliders
  colliders.push({
    minX: x - basinW / 2 - 2,
    maxX: x - basinW / 2,
    minZ: z - basinD / 2,
    maxZ: z + basinD / 2,
  });
  colliders.push({
    minX: x + basinW / 2,
    maxX: x + basinW / 2 + 2,
    minZ: z - basinD / 2,
    maxZ: z + basinD / 2,
  });

  return { group: bathGroup, waterMesh };
}

/**
 * Creates authentic Harappan circular brick water wells with raised brick rims.
 */
export function createHarappanWaterWell(
  mats: StylizedMaterialPalette,
  colliders: BoxCollider3D[],
  x: number,
  y: number,
  z: number,
): THREE.Group {
  const well = new THREE.Group();

  // Raised Circular Brick Rim
  const rimGeo = new THREE.CylinderGeometry(1.6, 1.7, 1.1, 18, 1, true);
  const rim = new THREE.Mesh(rimGeo, mats.brick);
  rim.position.y = 0.55;
  rim.castShadow = true;
  rim.receiveShadow = true;
  well.add(rim);

  // Stone Coping Ring
  const capGeo = new THREE.CylinderGeometry(1.75, 1.75, 0.18, 18, 1, true);
  const cap = new THREE.Mesh(capGeo, mats.wallCap);
  cap.position.y = 1.15;
  cap.castShadow = true;
  well.add(cap);

  // Dark interior water depth
  const depthGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.1, 16);
  const depth = new THREE.Mesh(depthGeo, mats.brickDark);
  depth.position.y = 0.15;
  well.add(depth);

  well.position.set(x, y, z);

  colliders.push({
    minX: x - 1.7,
    maxX: x + 1.7,
    minZ: z - 1.7,
    maxZ: z + 1.7,
  });

  return well;
}

/**
 * Creates an authentic ancient Harappan wooden bullock cart.
 */
export function createHarappanWoodenCart(
  mats: StylizedMaterialPalette,
  x: number,
  y: number,
  z: number,
  rotY = 0,
): THREE.Group {
  const cart = new THREE.Group();

  // Cart Bed
  const bedGeo = new THREE.BoxGeometry(2.4, 0.14, 1.4);
  const bed = new THREE.Mesh(bedGeo, mats.woodPlank);
  bed.position.y = 0.65;
  bed.castShadow = true;
  cart.add(bed);

  // Cart Slatted Rails
  const railL = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.45, 0.08), mats.woodPlank);
  railL.position.set(0, 0.92, 0.68);
  railL.castShadow = true;
  cart.add(railL);

  const railR = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.45, 0.08), mats.woodPlank);
  railR.position.set(0, 0.92, -0.68);
  railR.castShadow = true;
  cart.add(railR);

  // Solid Wooden Wheels (Harappan 3-plank solid wheel design)
  const wheelL = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.16, 16), mats.woodPlank);
  wheelL.rotation.x = Math.PI / 2;
  wheelL.position.set(0, 0.55, 0.85);
  wheelL.castShadow = true;
  cart.add(wheelL);

  const wheelR = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.16, 16), mats.woodPlank);
  wheelR.rotation.x = Math.PI / 2;
  wheelR.position.set(0, 0.55, -0.85);
  wheelR.castShadow = true;
  cart.add(wheelR);

  // Yoke Pole
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.2, 8), mats.woodPlank);
  pole.position.set(1.6, 0.5, 0);
  pole.rotation.z = -Math.PI / 8;
  pole.castShadow = true;
  cart.add(pole);

  cart.position.set(x, y, z);
  cart.rotation.y = rotY;
  return cart;
}
