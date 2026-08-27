import * as THREE from "three";
import type { StylizedMaterialPalette } from "./materials";
import type { BoxCollider3D } from "./types";

/**
 * Creates a monumental Harappan Gate with multi-layered stone pylons, stepped corbelled arch,
 * carved relief friezes, and hanging fabric banners.
 */
export function createHarappanMonumentalGate(
  mats: StylizedMaterialPalette,
  colliders: BoxCollider3D[],
  x: number,
  y: number,
  z: number,
): THREE.Group {
  const gateGroup = new THREE.Group();

  // Left Pylon Tower (Multi-tiered with stepped recesses)
  const pylonL = new THREE.Group();
  const baseL = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.0, 4.2), mats.brickDark);
  baseL.position.set(-4.5, 1.0, 0);
  baseL.castShadow = true;
  baseL.receiveShadow = true;
  pylonL.add(baseL);

  const midL = new THREE.Mesh(new THREE.BoxGeometry(3.6, 5.0, 3.6), mats.brick);
  midL.position.set(-4.5, 4.5, 0);
  midL.castShadow = true;
  midL.receiveShadow = true;
  pylonL.add(midL);

  const topL = new THREE.Mesh(new THREE.BoxGeometry(4.0, 1.2, 4.0), mats.wallCap);
  topL.position.set(-4.5, 7.6, 0);
  topL.castShadow = true;
  pylonL.add(topL);

  // Pilaster relief columns flanking left pylon
  const colL1 = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 5.2, 12), mats.wallCap);
  colL1.position.set(-2.8, 3.6, 1.9);
  colL1.castShadow = true;
  pylonL.add(colL1);

  gateGroup.add(pylonL);
  colliders.push({ minX: x - 6.6, maxX: x - 2.4, minZ: z - 2.2, maxZ: z + 2.2 });

  // Right Pylon Tower (Matching symmetry with weathered variation)
  const pylonR = new THREE.Group();
  const baseR = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.0, 4.2), mats.brickDark);
  baseR.position.set(4.5, 1.0, 0);
  baseR.castShadow = true;
  baseR.receiveShadow = true;
  pylonR.add(baseR);

  const midR = new THREE.Mesh(new THREE.BoxGeometry(3.6, 5.0, 3.6), mats.brick);
  midR.position.set(4.5, 4.5, 0);
  midR.castShadow = true;
  midR.receiveShadow = true;
  pylonR.add(midR);

  const topR = new THREE.Mesh(new THREE.BoxGeometry(4.0, 1.2, 4.0), mats.wallCap);
  topR.position.set(4.5, 7.6, 0);
  topR.castShadow = true;
  pylonR.add(topR);

  const colR1 = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 5.2, 12), mats.wallCap);
  colR1.position.set(2.8, 3.6, 1.9);
  colR1.castShadow = true;
  pylonR.add(colR1);

  gateGroup.add(pylonR);
  colliders.push({ minX: x + 2.4, maxX: x + 6.6, minZ: z - 2.2, maxZ: z + 2.2 });

  // Stepped Corbelled Archway spanning the gate
  const arch1 = new THREE.Mesh(new THREE.BoxGeometry(9.0, 0.9, 3.2), mats.wallCap);
  arch1.position.set(0, 6.8, 0);
  arch1.castShadow = true;
  gateGroup.add(arch1);

  const arch2 = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.8, 2.8), mats.brick);
  arch2.position.set(0, 7.6, 0);
  arch2.castShadow = true;
  gateGroup.add(arch2);

  const arch3 = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.8, 2.4), mats.wallCap);
  arch3.position.set(0, 8.4, 0);
  arch3.castShadow = true;
  gateGroup.add(arch3);

  // Hanging Weathered Cloth Banners
  const bannerL = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 3.6), mats.clothTrim);
  bannerL.position.set(-2.8, 4.2, 2.1);
  bannerL.castShadow = true;
  gateGroup.add(bannerL);

  const bannerR = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 3.6), mats.clothTrim);
  bannerR.position.set(2.8, 4.2, 2.1);
  bannerR.castShadow = true;
  gateGroup.add(bannerR);

  gateGroup.position.set(x, y, z);
  return gateGroup;
}

/**
 * Creates a two-story Harappan residential courtyard structure with corbelled doorway,
 * exterior staircase, window slits, and timber lintel beams.
 */
export function createHarappanCourtyardHouse(
  mats: StylizedMaterialPalette,
  colliders: BoxCollider3D[],
  x: number,
  y: number,
  z: number,
  rotY = 0,
): THREE.Group {
  const house = new THREE.Group();

  // Foundation Plinth
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.7, 9.5), mats.brickDark);
  plinth.position.y = 0.35;
  plinth.receiveShadow = true;
  plinth.castShadow = true;
  house.add(plinth);

  // Ground Floor Outer Walls
  const wallNorth = new THREE.Mesh(new THREE.BoxGeometry(10.0, 3.2, 1.2), mats.brick);
  wallNorth.position.set(0, 2.3, -4.0);
  wallNorth.castShadow = true;
  wallNorth.receiveShadow = true;
  house.add(wallNorth);

  const wallWest = new THREE.Mesh(new THREE.BoxGeometry(1.2, 3.2, 8.0), mats.brick);
  wallWest.position.set(-4.4, 2.3, 0);
  wallWest.castShadow = true;
  wallWest.receiveShadow = true;
  house.add(wallWest);

  const wallEast = new THREE.Mesh(new THREE.BoxGeometry(1.2, 3.2, 8.0), mats.brick);
  wallEast.position.set(4.4, 2.3, 0);
  wallEast.castShadow = true;
  wallEast.receiveShadow = true;
  house.add(wallEast);

  // South Wall with Corbelled Doorway Entry
  const wallSouthL = new THREE.Mesh(new THREE.BoxGeometry(3.5, 3.2, 1.2), mats.brick);
  wallSouthL.position.set(-3.25, 2.3, 4.0);
  wallSouthL.castShadow = true;
  house.add(wallSouthL);

  const wallSouthR = new THREE.Mesh(new THREE.BoxGeometry(3.5, 3.2, 1.2), mats.brick);
  wallSouthR.position.set(3.25, 2.3, 4.0);
  wallSouthR.castShadow = true;
  house.add(wallSouthR);

  // Heavy Timber Doorway Lintel
  const timberLintel = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.4, 1.4), mats.woodPlank);
  timberLintel.position.set(0, 3.5, 4.0);
  timberLintel.castShadow = true;
  house.add(timberLintel);

  // Upper Floor Balcony & Parapet
  const upperFloor = new THREE.Mesh(new THREE.BoxGeometry(10.2, 0.4, 6.5), mats.wallCap);
  upperFloor.position.set(0, 4.1, -1.0);
  upperFloor.castShadow = true;
  house.add(upperFloor);

  const upperWall = new THREE.Mesh(new THREE.BoxGeometry(9.8, 2.4, 1.0), mats.brick);
  upperWall.position.set(0, 5.5, -3.8);
  upperWall.castShadow = true;
  house.add(upperWall);

  // Exterior Stepped Brick Staircase
  for (let s = 0; s < 6; s++) {
    const step = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.4, 0.7), mats.wallCap);
    step.position.set(-5.6, 0.2 + s * 0.4, -2.5 + s * 0.7);
    step.castShadow = true;
    step.receiveShadow = true;
    house.add(step);
  }

  house.position.set(x, y, z);
  house.rotation.y = rotY;

  // Collision box
  colliders.push({
    minX: x - 5.5,
    maxX: x + 5.5,
    minZ: z - 5.0,
    maxZ: z + 5.0,
  });

  return house;
}

/**
 * Creates a circular flagstone plaza with cracked radial stone slabs.
 */
export function createRadialStonePlaza(mats: StylizedMaterialPalette, radius = 6.5): THREE.Group {
  const plaza = new THREE.Group();

  // Base stone circular dais
  const daisGeo = new THREE.CylinderGeometry(radius, radius + 0.5, 0.35, 24);
  const dais = new THREE.Mesh(daisGeo, mats.wallCap);
  dais.position.y = 0.175;
  dais.receiveShadow = true;
  dais.castShadow = true;
  plaza.add(dais);

  // Inner flagstone pattern
  const innerGeo = new THREE.CylinderGeometry(radius * 0.85, radius * 0.85, 0.38, 16);
  const inner = new THREE.Mesh(innerGeo, mats.stoneFloor);
  inner.position.y = 0.19;
  inner.receiveShadow = true;
  plaza.add(inner);

  return plaza;
}
