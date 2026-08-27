import * as THREE from "three";
import type { StylizedMaterialPalette } from "./materials";
import type { BoxCollider3D } from "./types";

/**
 * Creates an atmospheric sky dome enclosing the entire world.
 */
export function createSkyDome(mats: StylizedMaterialPalette): THREE.Mesh {
  const skyGeo = new THREE.SphereGeometry(150, 32, 24);
  const skyMesh = new THREE.Mesh(skyGeo, mats.skyDome);
  skyMesh.position.set(0, 0, 0);
  return skyMesh;
}

/**
 * Creates organic rolling terrain with gentle elevation contours and natural depressions.
 */
export function createRollingTerrain(
  mats: StylizedMaterialPalette,
  width = 120,
  depth = 120,
): THREE.Mesh {
  const segments = 48;
  const geo = new THREE.PlaneGeometry(width, depth, segments, segments);
  const pos = geo.getAttribute("position") as THREE.BufferAttribute;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);

    const distFromCenter = Math.hypot(x, y);
    const flankElevation =
      Math.sin(x * 0.07) * Math.cos(y * 0.07) * 1.2 + Math.sin(x * 0.14 + y * 0.09) * 0.55;

    let zOffset = flankElevation;
    // Flatten the main road & Great Bath area
    if (Math.abs(x) < 8 && Math.abs(y) < 36) {
      zOffset *= 0.12;
    } else if (distFromCenter > 40) {
      zOffset += (distFromCenter - 40) * 0.14; // Perimeter dunes rise naturally
    }

    pos.setZ(i, zOffset);
  }

  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, mats.sandFloor);
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  return mesh;
}

/**
 * Creates stylized sandstone boulders and rocks.
 */
export function createStylizedRock(
  mats: StylizedMaterialPalette,
  scale = 1.0,
  colliders?: BoxCollider3D[],
  x = 0,
  z = 0,
): THREE.Group {
  const rockGroup = new THREE.Group();
  const geo = new THREE.DodecahedronGeometry(0.85 * scale, 1);
  const mesh = new THREE.Mesh(geo, mats.rockStone);
  mesh.scale.set(1.15, 0.75, 0.95);
  mesh.rotation.set(Math.random(), Math.random(), Math.random());
  mesh.position.y = 0.5 * scale;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  rockGroup.add(mesh);

  rockGroup.position.set(x, 0, z);

  if (colliders && scale > 0.8) {
    colliders.push({
      minX: x - 0.75 * scale,
      maxX: x + 0.75 * scale,
      minZ: z - 0.75 * scale,
      maxZ: z + 0.75 * scale,
    });
  }

  return rockGroup;
}

/**
 * Creates grass / reed tufts with dual-tone green or dry savannah blades.
 */
export function createGrassTuft(
  mats: StylizedMaterialPalette,
  scale = 1.0,
  isDry = false,
): THREE.Group {
  const tuft = new THREE.Group();
  const bladeCount = 6;
  const mat = isDry ? mats.grassTuftDry : mats.grassTuft;

  for (let i = 0; i < bladeCount; i++) {
    const angle = (i / bladeCount) * Math.PI;
    const bladeGeo = new THREE.PlaneGeometry(0.48 * scale, 0.75 * scale);
    const blade = new THREE.Mesh(bladeGeo, mat);
    blade.position.y = 0.375 * scale;
    blade.rotation.y = angle;
    blade.rotation.x = -0.16 + (Math.random() - 0.5) * 0.1;
    tuft.add(blade);
  }

  return tuft;
}

/**
 * Creates a stylized Date Palm tree with organic segmented trunk, layered fronds, and date clusters.
 */
export function createStylizedPalmTree(mats: StylizedMaterialPalette): THREE.Group {
  const palm = new THREE.Group();

  // Segmented curved trunk
  const segments = 8;
  let currentY = 0;
  let currentOffset = 0;

  for (let i = 0; i < segments; i++) {
    const bottomRadius = 0.38 - i * 0.025;
    const topRadius = 0.36 - i * 0.025;
    const segHeight = 0.95;
    const segGeo = new THREE.CylinderGeometry(topRadius, bottomRadius, segHeight, 8);
    const segMesh = new THREE.Mesh(segGeo, mats.woodPlank);

    segMesh.position.set(currentOffset, currentY + segHeight / 2, 0);
    segMesh.rotation.z = -0.042 * i;
    segMesh.castShadow = true;
    segMesh.receiveShadow = true;
    palm.add(segMesh);

    currentY += segHeight - 0.08;
    currentOffset += 0.09;
  }

  // Date fruit clusters underneath the crown
  const fruitGeo = new THREE.SphereGeometry(0.22, 8, 8);
  const fruitMesh = new THREE.Mesh(fruitGeo, mats.brickDark);
  fruitMesh.position.set(currentOffset, currentY - 0.2, 0);
  fruitMesh.castShadow = true;
  palm.add(fruitMesh);

  // Layered palm fronds
  const frondCount = 14;
  const crownY = currentY;
  const crownX = currentOffset;

  for (let i = 0; i < frondCount; i++) {
    const angle = (i / frondCount) * Math.PI * 2;
    const frondGroup = new THREE.Group();
    frondGroup.position.set(crownX, crownY, 0);
    frondGroup.rotation.y = angle;

    // Curved frond blade
    const frondGeo = new THREE.BoxGeometry(3.4, 0.04, 0.65);
    const frond = new THREE.Mesh(frondGeo, i % 2 === 0 ? mats.foliage : mats.foliageDark);
    frond.position.set(1.6, 0.12, 0);
    frond.rotation.z = -0.35;
    frond.castShadow = true;
    frondGroup.add(frond);

    // Drooping tip
    const tipGeo = new THREE.BoxGeometry(1.5, 0.03, 0.48);
    const tip = new THREE.Mesh(tipGeo, mats.foliage);
    tip.position.set(3.0, -0.48, 0);
    tip.rotation.z = -0.68;
    tip.castShadow = true;
    frondGroup.add(tip);

    palm.add(frondGroup);
  }

  return palm;
}

/**
 * Creates a stylized Desert Acacia / Shrub.
 */
export function createStylizedBush(mats: StylizedMaterialPalette, scale = 1.0): THREE.Group {
  const bush = new THREE.Group();
  const blobCount = 6;

  for (let i = 0; i < blobCount; i++) {
    const r = (0.55 + Math.random() * 0.4) * scale;
    const geo = new THREE.DodecahedronGeometry(r, 1);
    const mesh = new THREE.Mesh(geo, i % 2 === 0 ? mats.foliage : mats.foliageDark);
    mesh.position.set(
      (Math.random() - 0.5) * 0.9 * scale,
      r * 0.8,
      (Math.random() - 0.5) * 0.9 * scale,
    );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    bush.add(mesh);
  }

  return bush;
}

/**
 * Creates a cluster of painted Harappan terracotta storage jars and amphorae.
 */
export function createPotteryCluster(mats: StylizedMaterialPalette): THREE.Group {
  const cluster = new THREE.Group();

  // Large amphora
  const ampGeo = new THREE.CylinderGeometry(0.5, 0.28, 1.55, 16);
  const amp = new THREE.Mesh(ampGeo, mats.terracottaPot);
  amp.position.set(0, 0.775, 0);
  amp.castShadow = true;
  amp.receiveShadow = true;
  cluster.add(amp);

  // Black painted slip band around neck
  const bandGeo = new THREE.CylinderGeometry(0.51, 0.51, 0.22, 16);
  const band = new THREE.Mesh(bandGeo, mats.brickDark);
  band.position.set(0, 1.15, 0);
  cluster.add(band);

  // Small globular pot
  const potGeo = new THREE.SphereGeometry(0.4, 12, 12);
  const pot = new THREE.Mesh(potGeo, mats.terracottaPot);
  pot.position.set(0.75, 0.4, 0.28);
  pot.castShadow = true;
  cluster.add(pot);

  // Shallow offering bowl
  const bowlGeo = new THREE.CylinderGeometry(0.36, 0.18, 0.25, 12);
  const bowl = new THREE.Mesh(bowlGeo, mats.terracottaPot);
  bowl.position.set(-0.65, 0.125, 0.42);
  bowl.castShadow = true;
  cluster.add(bowl);

  // Scattered loose bricks beside the pots
  for (let b = 0; b < 3; b++) {
    const brickPiece = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.18, 0.25), mats.brick);
    brickPiece.position.set(-0.5 + b * 0.45, 0.09, -0.4);
    brickPiece.rotation.y = (b * Math.PI) / 4;
    brickPiece.castShadow = true;
    cluster.add(brickPiece);
  }

  return cluster;
}

/**
 * Creates a detailed excavation field tent with canvas drape and guy ropes.
 */
export function createExcavationTent(mats: StylizedMaterialPalette): THREE.Group {
  const tent = new THREE.Group();

  // A-frame tent canvas roof
  const roofGeo = new THREE.ConeGeometry(4.0, 3.0, 4);
  const roof = new THREE.Mesh(roofGeo, mats.clothTent);
  roof.position.y = 2.0;
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  roof.receiveShadow = true;
  tent.add(roof);

  // Crimson trimmed edge band
  const trimGeo = new THREE.BoxGeometry(4.2, 0.15, 4.2);
  const trim = new THREE.Mesh(trimGeo, mats.clothTrim);
  trim.position.y = 0.6;
  trim.rotation.y = Math.PI / 4;
  tent.add(trim);

  // Center timber pole
  const poleGeo = new THREE.CylinderGeometry(0.1, 0.1, 3.6, 8);
  const pole = new THREE.Mesh(poleGeo, mats.woodPlank);
  pole.position.y = 1.8;
  pole.castShadow = true;
  tent.add(pole);

  return tent;
}

/**
 * Creates an archaeological field workbench with tools, open notebook, maps, and calipers.
 */
export function createFieldWorkbench(mats: StylizedMaterialPalette): THREE.Group {
  const bench = new THREE.Group();

  // Table top
  const topGeo = new THREE.BoxGeometry(2.8, 0.12, 1.4);
  const top = new THREE.Mesh(topGeo, mats.woodPlank);
  top.position.y = 0.95;
  top.castShadow = true;
  top.receiveShadow = true;
  bench.add(top);

  // Legs
  const legPositions = [
    { x: -1.2, z: -0.55 },
    { x: 1.2, z: -0.55 },
    { x: -1.2, z: 0.55 },
    { x: 1.2, z: 0.55 },
  ];

  for (const lp of legPositions) {
    const legGeo = new THREE.BoxGeometry(0.12, 0.95, 0.12);
    const leg = new THREE.Mesh(legGeo, mats.woodPlank);
    leg.position.set(lp.x, 0.475, lp.z);
    leg.castShadow = true;
    bench.add(leg);
  }

  // Open field journal notebook
  const bookGeo = new THREE.BoxGeometry(0.5, 0.05, 0.35);
  const book = new THREE.Mesh(bookGeo, mats.clothTent);
  book.position.set(-0.2, 1.04, 0.1);
  book.rotation.y = 0.2;
  book.castShadow = true;
  bench.add(book);

  // Rolled parchment map on table
  const mapGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.95, 8);
  const map = new THREE.Mesh(mapGeo, mats.clothTent);
  map.position.set(-0.7, 1.05, 0.25);
  map.rotation.z = Math.PI / 2;
  map.castShadow = true;
  bench.add(map);

  // Brass caliper tool
  const caliperGeo = new THREE.BoxGeometry(0.38, 0.02, 0.18);
  const caliper = new THREE.Mesh(caliperGeo, mats.goldBrass);
  caliper.position.set(0.6, 1.02, -0.15);
  bench.add(caliper);

  return bench;
}

/**
 * Creates a distant Harappan skyline backdrop with stepped towers, granaries, and mountain ridges.
 */
export function createDistantSkyline(mats: StylizedMaterialPalette): THREE.Group {
  const skyline = new THREE.Group();

  const towerPositions = [
    { x: -60, z: -70, w: 16, h: 26, d: 16 },
    { x: -30, z: -80, w: 20, h: 22, d: 18 },
    { x: 0, z: -88, w: 26, h: 32, d: 22 }, // Central High Citadel Mound
    { x: 35, z: -80, w: 18, h: 24, d: 16 },
    { x: 65, z: -70, w: 16, h: 28, d: 16 },
    { x: -75, z: 0, w: 18, h: 24, d: 18 },
    { x: 75, z: 0, w: 18, h: 24, d: 18 },
    { x: -60, z: 70, w: 16, h: 22, d: 16 },
    { x: 60, z: 70, w: 16, h: 22, d: 16 },
  ];

  for (const tp of towerPositions) {
    const towerGeo = new THREE.BoxGeometry(tp.w, tp.h, tp.d);
    const tower = new THREE.Mesh(towerGeo, mats.brickDark);
    tower.position.set(tp.x, tp.h / 2 - 2, tp.z);
    tower.receiveShadow = true;
    skyline.add(tower);

    // Stepped crown parapet on tower
    const crownGeo = new THREE.BoxGeometry(tp.w * 0.82, 3.8, tp.d * 0.82);
    const crown = new THREE.Mesh(crownGeo, mats.wallCap);
    crown.position.set(tp.x, tp.h + 0.6, tp.z);
    skyline.add(crown);
  }

  return skyline;
}

/**
 * Creates an ornate weathered brick wall with stepped crenellations and doorway openings.
 */
export function createWeatheredBrickWall(
  mats: StylizedMaterialPalette,
  colliders: BoxCollider3D[],
  x: number,
  y: number,
  z: number,
  w: number,
  h: number,
  d: number,
): THREE.Group {
  const wallGroup = new THREE.Group();

  // Main wall body
  const bodyGeo = new THREE.BoxGeometry(w, h, d);
  const body = new THREE.Mesh(bodyGeo, mats.brick);
  body.position.set(x, y + h / 2, z);
  body.castShadow = true;
  body.receiveShadow = true;
  wallGroup.add(body);

  // Stepped sandstone cap
  const capGeo = new THREE.BoxGeometry(w + 0.2, 0.3, d + 0.2);
  const cap = new THREE.Mesh(capGeo, mats.wallCap);
  cap.position.set(x, y + h + 0.15, z);
  cap.castShadow = true;
  wallGroup.add(cap);

  // Periodic crenellation battlements along top
  const crenCount = Math.max(1, Math.floor(w / 2.8));
  const crenW = w / (crenCount * 2);

  for (let i = 0; i < crenCount; i++) {
    const crenGeo = new THREE.BoxGeometry(crenW, 0.55, d + 0.14);
    const cren = new THREE.Mesh(crenGeo, mats.brick);
    const cx = x - w / 2 + crenW * (1 + i * 2);
    cren.position.set(cx, y + h + 0.55, z);
    cren.castShadow = true;
    wallGroup.add(cren);
  }

  // Register physical collision
  colliders.push({
    minX: x - w / 2,
    maxX: x + w / 2,
    minZ: z - d / 2,
    maxZ: z + d / 2,
  });

  return wallGroup;
}
