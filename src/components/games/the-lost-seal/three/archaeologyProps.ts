import * as THREE from "three";
import type { StylizedMaterialPalette } from "./materials";
import type { BoxCollider3D } from "./types";

/**
 * Creates an active archaeological excavation trench with stepped earth levels,
 * timber shoring planks, surveyor grid string lines, and stratum tag markers.
 */
export function createExcavationDigTrench(
  mats: StylizedMaterialPalette,
  colliders: BoxCollider3D[],
  x: number,
  y: number,
  z: number,
): THREE.Group {
  const trench = new THREE.Group();

  // Excavated soil trench pit (recessed into ground)
  const pitBed = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.4, 6.5), mats.sandFloor);
  pitBed.position.set(0, 0.2, 0);
  pitBed.receiveShadow = true;
  trench.add(pitBed);

  // Timber shoring retaining planks around the dig edge
  const plankNorth = new THREE.Mesh(new THREE.BoxGeometry(8.8, 0.8, 0.18), mats.woodPlank);
  plankNorth.position.set(0, 0.4, -3.2);
  plankNorth.castShadow = true;
  trench.add(plankNorth);

  const plankSouth = new THREE.Mesh(new THREE.BoxGeometry(8.8, 0.8, 0.18), mats.woodPlank);
  plankSouth.position.set(0, 0.4, 3.2);
  plankSouth.castShadow = true;
  trench.add(plankSouth);

  const plankWest = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.8, 6.4), mats.woodPlank);
  plankWest.position.set(-4.3, 0.4, 0);
  plankWest.castShadow = true;
  trench.add(plankWest);

  // Surveyor Datum Stakes at corners with red string lines
  const stakePos = [
    { x: -4.4, z: -3.3 },
    { x: 4.4, z: -3.3 },
    { x: -4.4, z: 3.3 },
    { x: 4.4, z: 3.3 },
  ];

  for (const sp of stakePos) {
    const stake = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.2, 8), mats.woodPlank);
    stake.position.set(sp.x, 0.6, sp.z);
    stake.castShadow = true;
    trench.add(stake);

    // Red flag on corner stakes
    const flag = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.15, 0.02), mats.clothTrim);
    flag.position.set(sp.x + 0.12, 1.1, sp.z);
    trench.add(flag);
  }

  // Archaeological Pickaxe resting on plank
  const axeHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.9, 6), mats.woodPlank);
  axeHandle.position.set(-2.0, 0.82, -3.1);
  axeHandle.rotation.z = Math.PI / 4;
  axeHandle.castShadow = true;
  trench.add(axeHandle);

  const axeHead = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.08, 0.08), mats.brickDark);
  axeHead.position.set(-2.3, 1.1, -3.1);
  axeHead.castShadow = true;
  trench.add(axeHead);

  trench.position.set(x, y, z);

  colliders.push({
    minX: x - 4.5,
    maxX: x + 4.5,
    minZ: z - 3.4,
    maxZ: z + 3.4,
  });

  return trench;
}

/**
 * Creates an archaeological sorting and cataloging station with sorting trays,
 * magnifying loupe, calipers, numbered tags, and field notebook.
 */
export function createSortingStation(
  mats: StylizedMaterialPalette,
  colliders: BoxCollider3D[],
  x: number,
  y: number,
  z: number,
): THREE.Group {
  const station = new THREE.Group();

  // Heavy wooden workbench
  const table = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.14, 1.6), mats.woodPlank);
  table.position.y = 1.0;
  table.castShadow = true;
  table.receiveShadow = true;
  station.add(table);

  // 4 Table Legs
  const legPos = [
    { x: -1.4, z: -0.65 },
    { x: 1.4, z: -0.65 },
    { x: -1.4, z: 0.65 },
    { x: 1.4, z: 0.65 },
  ];

  for (const lp of legPos) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.0, 0.14), mats.woodPlank);
    leg.position.set(lp.x, 0.5, lp.z);
    leg.castShadow = true;
    station.add(leg);
  }

  // Pottery Sherd Sorting Tray with divided compartments
  const tray = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.12, 0.8), mats.woodPlank);
  tray.position.set(-0.8, 1.12, 0.1);
  tray.castShadow = true;
  station.add(tray);

  // Red Ware Ceramic Sherds in the tray
  for (let s = 0; s < 4; s++) {
    const sherd = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.22), mats.terracottaPot);
    sherd.position.set(-1.1 + s * 0.2, 1.2, 0.1 + (s % 2) * 0.15);
    sherd.rotation.y = s * 0.4;
    sherd.castShadow = true;
    station.add(sherd);
  }

  // Open Archaeological Field Journal with written lines
  const journal = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.06, 0.45), mats.clothTent);
  journal.position.set(0.6, 1.1, 0.15);
  journal.rotation.y = -0.15;
  journal.castShadow = true;
  station.add(journal);

  // Brass Field Calipers
  const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.03, 0.18), mats.goldBrass);
  caliper.position.set(0.1, 1.09, -0.3);
  caliper.rotation.y = 0.35;
  station.add(caliper);

  station.position.set(x, y, z);

  colliders.push({
    minX: x - 1.8,
    maxX: x + 1.8,
    minZ: z - 1.0,
    maxZ: z + 1.0,
  });

  return station;
}
