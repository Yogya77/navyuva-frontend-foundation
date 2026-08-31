import * as THREE from "three";
import type { StylizedMaterialPalette } from "./materials";

/**
 * Procedural archaeological 3D models for The Lost Seal.
 * Highly recognizable, historically grounded, and optimized for browser Three.js performance.
 */

/**
 * 1. Open Archaeological Field Journal on Excavation Sorting Table
 */
export function createFieldJournalModel(mats: StylizedMaterialPalette): THREE.Group {
  const group = new THREE.Group();

  // Wooden field table
  const table = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, 1.1), mats.woodPlank);
  table.position.y = 0.85;
  table.castShadow = true;
  table.receiveShadow = true;
  group.add(table);

  // 4 Table legs
  const legGeo = new THREE.BoxGeometry(0.08, 0.85, 0.08);
  const legPositions: [number, number, number][] = [
    [-0.7, 0.425, -0.45],
    [0.7, 0.425, -0.45],
    [-0.7, 0.425, 0.45],
    [0.7, 0.425, 0.45],
  ];
  for (const [lx, ly, lz] of legPositions) {
    const leg = new THREE.Mesh(legGeo, mats.woodPlank);
    leg.position.set(lx, ly, lz);
    leg.castShadow = true;
    group.add(leg);
  }

  // Open Leather Cover
  const coverMat = new THREE.MeshStandardMaterial({
    color: 0x4a2e18,
    roughness: 0.8,
  });
  const coverL = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.02, 0.44), coverMat);
  coverL.position.set(-0.16, 0.91, 0);
  coverL.rotation.z = 0.06;
  coverL.castShadow = true;
  group.add(coverL);

  const coverR = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.02, 0.44), coverMat);
  coverR.position.set(0.16, 0.91, 0);
  coverR.rotation.z = -0.06;
  coverR.castShadow = true;
  group.add(coverR);

  // Open Pages (cream paper)
  const pageMat = new THREE.MeshStandardMaterial({
    color: 0xfbf6ea,
    roughness: 0.9,
  });
  const pageL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.025, 0.42), pageMat);
  pageL.position.set(-0.15, 0.925, 0);
  pageL.rotation.z = 0.05;
  pageL.castShadow = true;
  group.add(pageL);

  const pageR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.025, 0.42), pageMat);
  pageR.position.set(0.15, 0.925, 0);
  pageR.rotation.z = -0.05;
  pageR.castShadow = true;
  group.add(pageR);

  // Handwritten lines on pages
  const inkMat = new THREE.MeshBasicMaterial({ color: 0x2d1d12 });
  for (let row = 0; row < 6; row++) {
    const lineL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.002, 0.015), inkMat);
    lineL.position.set(-0.15, 0.94, -0.15 + row * 0.06);
    lineL.rotation.z = 0.05;
    group.add(lineL);

    const lineR = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.002, 0.015), inkMat);
    lineR.position.set(0.15, 0.94, -0.15 + row * 0.06);
    lineR.rotation.z = -0.05;
    group.add(lineR);
  }

  // Magnifying Loupe on table
  const loupeRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.08, 0.015, 8, 16),
    mats.goldBrass,
  );
  loupeRing.position.set(0.48, 0.91, -0.15);
  loupeRing.rotation.x = Math.PI / 2;
  loupeRing.castShadow = true;
  group.add(loupeRing);

  const loupeHandle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 0.16, 8),
    mats.torchWood,
  );
  loupeHandle.position.set(0.58, 0.91, -0.22);
  loupeHandle.rotation.z = Math.PI / 4;
  loupeHandle.castShadow = true;
  group.add(loupeHandle);

  // Dedicated warm archival spotlight
  const light = new THREE.PointLight(0xffe2a8, 2.2, 5.0, 1.2);
  light.position.set(0, 1.8, 0);
  light.castShadow = true;
  group.add(light);

  return group;
}

/**
 * 2. Exposed Archaeological Stratigraphy Profile with Fired Bricks & Dig Tools
 */
export function createStratigraphyProfileModel(mats: StylizedMaterialPalette): THREE.Group {
  const group = new THREE.Group();

  // Stepped soil strata block (exposed trench wall)
  const soilStrataGroup = new THREE.Group();

  // Layer 1: Bedrock / Silt Base
  const layer1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.35, 1.4), mats.sandFloor);
  layer1.position.y = 0.175;
  layer1.castShadow = true;
  layer1.receiveShadow = true;
  soilStrataGroup.add(layer1);

  // Layer 2: Mature Harappan Fired Brick Dust & Silt Layer
  const layer2 = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.4, 1.35), mats.brickDark);
  layer2.position.y = 0.55;
  layer2.castShadow = true;
  layer2.receiveShadow = true;
  soilStrataGroup.add(layer2);

  // Layer 3: Top Habitation Silt & Sand Layer
  const layer3 = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.35, 1.3), mats.wallCap);
  layer3.position.y = 0.925;
  layer3.castShadow = true;
  layer3.receiveShadow = true;
  soilStrataGroup.add(layer3);

  // Embedded authentic Mature Harappan baked bricks in the strata wall (1:2:4 ratio)
  for (let b = 0; b < 5; b++) {
    const brick = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.12, 0.19), mats.brick);
    brick.position.set(-0.7 + (b % 3) * 0.7, 0.52 + Math.floor(b / 3) * 0.22, 0.62);
    brick.castShadow = true;
    soilStrataGroup.add(brick);
  }

  // Embedded broken red-ware ceramic sherds sticking out of the stratum
  for (let s = 0; s < 3; s++) {
    const sherd = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.03, 0.18), mats.terracottaPot);
    sherd.position.set(0.3 - s * 0.4, 0.4 + s * 0.25, 0.65);
    sherd.rotation.x = 0.2;
    sherd.rotation.z = s * 0.3;
    sherd.castShadow = true;
    soilStrataGroup.add(sherd);
  }

  group.add(soilStrataGroup);

  // Surveyor Depth Datum Stake with depth markings
  const stake = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.4, 8), mats.torchWood);
  stake.position.set(0.9, 0.7, 0.68);
  stake.castShadow = true;
  group.add(stake);

  const flag = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.18, 0.02), mats.clothTrim);
  flag.position.set(1.05, 1.3, 0.68);
  group.add(flag);

  // Archaeologist Trowel resting on top stratum ledge
  const trowelBlade = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.015, 0.22), mats.wallCap);
  trowelBlade.position.set(-0.4, 1.12, 0.3);
  trowelBlade.rotation.y = 0.4;
  group.add(trowelBlade);

  const trowelHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.14, 8), mats.woodPlank);
  trowelHandle.position.set(-0.48, 1.15, 0.4);
  trowelHandle.rotation.x = Math.PI / 6;
  group.add(trowelHandle);

  // Local warm dig lantern light
  const light = new THREE.PointLight(0xffbe76, 2.0, 5.5, 1.2);
  light.position.set(0, 1.8, 0.8);
  light.castShadow = true;
  group.add(light);

  return group;
}

/**
 * 3. Great Bath Hydraulic Sluice Valve System
 */
export function createHydraulicSluiceModel(mats: StylizedMaterialPalette): THREE.Group {
  const group = new THREE.Group();

  // Brick Sluice Housing Basin with Gypsum Coping
  const basin = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.7, 1.4), mats.brickDark);
  basin.position.y = 0.35;
  basin.castShadow = true;
  basin.receiveShadow = true;
  group.add(basin);

  const coping = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.12, 1.6), mats.wallCap);
  coping.position.y = 0.76;
  coping.castShadow = true;
  group.add(coping);

  // Twin Bronze Hydraulic Valve Pillars & Wheels
  for (let v = 0; v < 2; v++) {
    const vx = -0.45 + v * 0.9;

    // Bronze pillar stand
    const stand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.14, 0.6, 12),
      mats.goldBrass,
    );
    stand.position.set(vx, 1.05, 0);
    stand.castShadow = true;
    group.add(stand);

    // Spoked Valve Wheel
    const wheel = new THREE.Mesh(
      new THREE.TorusGeometry(0.24, 0.035, 8, 16),
      mats.goldBrass,
    );
    wheel.position.set(vx, 1.35, 0);
    wheel.rotation.x = Math.PI / 2;
    wheel.castShadow = true;
    group.add(wheel);

    // 4 spokes on wheel
    for (let sp = 0; sp < 4; sp++) {
      const spoke = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.44, 6),
        mats.goldBrass,
      );
      spoke.position.set(vx, 1.35, 0);
      spoke.rotation.z = (sp * Math.PI) / 4;
      spoke.rotation.x = Math.PI / 2;
      group.add(spoke);
    }
  }

  // Exposed Corbelled Drainage Sump Conduit
  const conduit = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.15, 0.6), mats.water);
  conduit.position.set(0, 0.72, 0.35);
  group.add(conduit);

  // Local warm water reflection light
  const light = new THREE.PointLight(0x00dddd, 1.6, 4.5, 1.4);
  light.position.set(0, 1.6, 0);
  group.add(light);

  return group;
}

/**
 * 4. Scribe Station Inscribed Steatite Ledger Tablet on Wooden Desk
 */
export function createScribeTabletDeskModel(mats: StylizedMaterialPalette): THREE.Group {
  const group = new THREE.Group();

  // Heavy wooden scribe table
  const desk = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.12, 1.2), mats.woodPlank);
  desk.position.y = 0.85;
  desk.castShadow = true;
  desk.receiveShadow = true;
  group.add(desk);

  // 4 Table legs
  const legPositions: [number, number, number][] = [
    [-0.8, 0.425, -0.5],
    [0.8, 0.425, -0.5],
    [-0.8, 0.425, 0.5],
    [0.8, 0.425, 0.5],
  ];
  for (const [lx, ly, lz] of legPositions) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.85, 0.1), mats.woodPlank);
    leg.position.set(lx, ly, lz);
    leg.castShadow = true;
    group.add(leg);
  }

  // The Main Hero Inscribed Steatite Tablet (Soapstone slab with engraved glyphs)
  const tablet = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.08, 0.5),
    mats.steatiteSeal,
  );
  tablet.position.set(0, 0.95, 0.05);
  tablet.castShadow = true;
  group.add(tablet);

  // Engraved glyph grooves on the tablet face
  const grooveMat = new THREE.MeshBasicMaterial({ color: 0x223030 });
  for (let g = 0; g < 4; g++) {
    const groove = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.005, 0.08), grooveMat);
    groove.position.set(-0.22 + g * 0.15, 0.995, -0.08);
    group.add(groove);
  }

  // Numerical tally strokes
  for (let t = 0; t < 5; t++) {
    const tally = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.005, 0.14), grooveMat);
    tally.position.set(-0.2 + t * 0.1, 0.995, 0.1);
    group.add(tally);
  }

  // Stack of secondary accounting tablets beside the main tablet
  for (let st = 0; st < 3; st++) {
    const subTablet = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.05, 0.28),
      mats.terracottaPot,
    );
    subTablet.position.set(0.6, 0.94 + st * 0.055, -0.2 + st * 0.02);
    subTablet.rotation.y = st * 0.15;
    subTablet.castShadow = true;
    group.add(subTablet);
  }

  // Bronze writing stylus
  const stylus = new THREE.Mesh(
    new THREE.CylinderGeometry(0.008, 0.008, 0.28, 6),
    mats.goldBrass,
  );
  stylus.position.set(-0.55, 0.92, 0.2);
  stylus.rotation.z = Math.PI / 3;
  group.add(stylus);

  // Dedicated archival focus spotlight
  const light = new THREE.PointLight(0xffe6b0, 2.4, 5.0, 1.2);
  light.position.set(0, 1.7, 0);
  light.castShadow = true;
  group.add(light);

  return group;
}

/**
 * 5. North Gate Magistrate Bulla Tag on Stone Pedestal
 */
export function createGateBullaPedestalModel(mats: StylizedMaterialPalette): THREE.Group {
  const group = new THREE.Group();

  // Stone Inspection Pedestal Plinth
  const plinthBase = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.9), mats.brickDark);
  plinthBase.position.y = 0.3;
  plinthBase.castShadow = true;
  plinthBase.receiveShadow = true;
  group.add(plinthBase);

  const plinthCap = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.15, 1.0), mats.wallCap);
  plinthCap.position.y = 0.68;
  plinthCap.castShadow = true;
  group.add(plinthCap);

  // Carved Wooden Presentation Tray
  const tray = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.04, 0.55), mats.woodPlank);
  tray.position.y = 0.78;
  tray.castShadow = true;
  group.add(tray);

  // The Baked Clay Bulla Tag (Disc with relief seal impression)
  const bullaMat = new THREE.MeshStandardMaterial({
    color: 0xc26d40, // Terracotta red clay
    roughness: 0.75,
    metalness: 0.05,
  });
  const bullaBody = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.06, 18), bullaMat);
  bullaBody.position.y = 0.83;
  bullaBody.castShadow = true;
  group.add(bullaBody);

  // High-relief sacred unicorn seal impression in the clay center
  const sealImpression = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.02, 0.14),
    mats.brickDark,
  );
  sealImpression.position.y = 0.865;
  group.add(sealImpression);

  // Jute cord twine wrapped around the bulla channel
  const cord = new THREE.Mesh(
    new THREE.TorusGeometry(0.2, 0.015, 6, 16),
    mats.torchWood,
  );
  cord.position.y = 0.82;
  cord.rotation.x = Math.PI / 2;
  group.add(cord);

  // Focused golden spotlight
  const light = new THREE.PointLight(0xffbe66, 2.2, 4.5, 1.2);
  light.position.set(0, 1.6, 0);
  light.castShadow = true;
  group.add(light);

  return group;
}

/**
 * 6. Standardized Binary Chert Weights & Balance Scale on Merchant Table (Level 2)
 */
export function createBinaryWeightsTableModel(mats: StylizedMaterialPalette): THREE.Group {
  const group = new THREE.Group();

  // Heavy merchant bazaar table
  const table = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 1.3), mats.woodPlank);
  table.position.y = 0.85;
  table.castShadow = true;
  table.receiveShadow = true;
  group.add(table);

  // 4 Table legs
  const legPositions: [number, number, number][] = [
    [-1.0, 0.425, -0.5],
    [1.0, 0.425, -0.5],
    [-1.0, 0.425, 0.5],
    [1.0, 0.425, 0.5],
  ];
  for (const [lx, ly, lz] of legPositions) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.85, 0.12), mats.woodPlank);
    leg.position.set(lx, ly, lz);
    leg.castShadow = true;
    group.add(leg);
  }

  // Cloth trade runner mat on the table
  const runner = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.01, 0.9), mats.clothTrim);
  runner.position.set(0, 0.915, 0);
  group.add(runner);

  // 5 Cubic Standardized Binary Chert Weights (1, 2, 4, 8, 16 ratio) in Rohri Chert grey-banded stone
  const chertMat = new THREE.MeshStandardMaterial({
    color: 0x9e9a91, // Rohri Chert polished grey flint
    roughness: 0.35,
    metalness: 0.1,
  });

  const weightSizes = [0.08, 0.11, 0.15, 0.2, 0.26];
  for (let w = 0; w < weightSizes.length; w++) {
    const s = weightSizes[w]!;
    const cube = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), chertMat);
    cube.position.set(-0.65 + w * 0.32, 0.92 + s / 2, 0.15);
    cube.castShadow = true;
    group.add(cube);
  }

  // Ancient Bronze Balance Scale
  const scalePillar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.04, 0.55, 10),
    mats.goldBrass,
  );
  scalePillar.position.set(0, 1.2, -0.2);
  scalePillar.castShadow = true;
  group.add(scalePillar);

  const scaleBeam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.01, 0.01, 0.7, 8),
    mats.goldBrass,
  );
  scaleBeam.position.set(0, 1.48, -0.2);
  scaleBeam.rotation.z = Math.PI / 2;
  scaleBeam.castShadow = true;
  group.add(scaleBeam);

  // Twin hanging scale pans
  for (let p of [-0.3, 0.3]) {
    const pan = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.08, 0.03, 16),
      mats.goldBrass,
    );
    pan.position.set(p, 1.15, -0.2);
    pan.castShadow = true;
    group.add(pan);
  }

  // Focused warm trade lantern light
  const light = new THREE.PointLight(0xffd588, 2.2, 5.0, 1.2);
  light.position.set(0, 1.8, 0);
  light.castShadow = true;
  group.add(light);

  return group;
}

/**
 * 7. Group of Authentic Red Ware Storage Amphorae with Bullae Sealing Tags (Level 2)
 */
export function createStorageAmphoraeClusterModel(mats: StylizedMaterialPalette): THREE.Group {
  const group = new THREE.Group();

  // Large Main Storage Amphora (Red Ware with black painted bands)
  const pot1 = new THREE.Group();
  const pot1Body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.5, 1.1, 18),
    mats.terracottaPot,
  );
  pot1Body.position.y = 0.55;
  pot1Body.castShadow = true;
  pot1.add(pot1Body);

  const pot1Rim = new THREE.Mesh(
    new THREE.TorusGeometry(0.38, 0.06, 8, 18),
    mats.brickDark,
  );
  pot1Rim.position.y = 1.1;
  pot1Rim.rotation.x = Math.PI / 2;
  pot1.add(pot1Rim);

  // Painted black intersecting circle slip band
  const band = new THREE.Mesh(
    new THREE.CylinderGeometry(0.47, 0.47, 0.22, 18),
    mats.brickDark,
  );
  band.position.y = 0.65;
  pot1.add(band);

  // Stamped clay bulla tag on the neck
  const bulla = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.12, 0.04),
    mats.clothTent,
  );
  bulla.position.set(0.38, 0.95, 0);
  bulla.castShadow = true;
  pot1.add(bulla);

  pot1.position.set(0, 0, 0);
  group.add(pot1);

  // Medium Amphora (Flanked left)
  const pot2 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.38, 0.8, 16),
    mats.terracottaPot,
  );
  pot2.position.set(-0.65, 0.4, -0.2);
  pot2.castShadow = true;
  group.add(pot2);

  // Small Amphora (Flanked right)
  const pot3 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.3, 0.6, 14),
    mats.terracottaPot,
  );
  pot3.position.set(0.65, 0.3, 0.15);
  pot3.castShadow = true;
  group.add(pot3);

  // Focused warm pottery spotlight
  const light = new THREE.PointLight(0xffbe66, 2.0, 4.5, 1.2);
  light.position.set(0, 1.6, 0);
  group.add(light);

  return group;
}

/**
 * 8. Carved Indus Symbol Gate Lock Mechanism (Level 2 Puzzle Gate)
 */
export function createSymbolGateMechanismModel(mats: StylizedMaterialPalette): THREE.Group {
  const group = new THREE.Group();

  // Ornate Gold & Bronze Lock Housing
  const lockBase = new THREE.Mesh(new THREE.BoxGeometry(2.8, 3.4, 0.8), mats.goldBrass);
  lockBase.position.y = 1.7;
  lockBase.castShadow = true;
  lockBase.receiveShadow = true;
  group.add(lockBase);

  // Stepped dark stone border framing the glyphs
  const frame = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3.1, 0.86), mats.brickDark);
  frame.position.y = 1.7;
  group.add(frame);

  // 4 Rotating Epigraphic Glyph Dials (Manger, Zebu, Fish, Bow)
  const dialColors = [0x00cccc, 0xffaa00, 0x00eeaa, 0xff8833];
  for (let s = 0; s < 4; s++) {
    const col = s % 2;
    const row = Math.floor(s / 2);
    const dx = -0.55 + col * 1.1;
    const dy = 2.2 - row * 1.0;

    // Bronze dial bezel ring
    const bezel = new THREE.Mesh(
      new THREE.TorusGeometry(0.34, 0.05, 8, 20),
      mats.goldBrass,
    );
    bezel.position.set(dx, dy, 0.44);
    bezel.castShadow = true;
    group.add(bezel);

    // Steatite glyph disc in center
    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.28, 0.08, 20),
      mats.steatiteSeal,
    );
    disc.position.set(dx, dy, 0.44);
    disc.rotation.x = Math.PI / 2;
    disc.castShadow = true;
    group.add(disc);

    // Relief emblem inside glyph slot
    const emblem = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.16, 0.04),
      mats.brickDark,
    );
    emblem.position.set(dx, dy, 0.49);
    group.add(emblem);
  }

  // Cyan mystical power conduit
  const light = new THREE.PointLight(0x00e5ff, 2.6, 6.0, 1.2);
  light.position.set(0, 1.8, 0.8);
  group.add(light);

  return group;
}

/**
 * 9. Sacred Sanctuary Inscription / Zebu Bull Wall Friezes (Level 3)
 */
export function createSanctuaryWallFriezeModel(
  mats: StylizedMaterialPalette,
  isZebuTotem: boolean,
): THREE.Group {
  const group = new THREE.Group();

  // Heavy Bronze Architectural Mounting Bracket
  const bracket = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.3, 0.2), mats.goldBrass);
  bracket.position.y = 1.15;
  bracket.castShadow = true;
  group.add(bracket);

  // Steatite Relief Slab (High-relief carved iconographic frieze)
  const slab = new THREE.Mesh(new THREE.BoxGeometry(1.35, 2.0, 0.28), mats.steatiteSeal);
  slab.position.y = 1.15;
  slab.castShadow = true;
  group.add(slab);

  if (isZebuTotem) {
    // High-relief Zebu Bull carving on the frieze
    const bullBody = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.45, 0.12), mats.brickDark);
    bullBody.position.set(0, 1.05, 0.18);
    group.add(bullBody);

    // Zebu shoulder hump
    const hump = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), mats.brickDark);
    hump.position.set(-0.18, 1.32, 0.18);
    group.add(hump);

    // Curved horns
    const hornL = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.04, 0.3, 6), mats.brickDark);
    hornL.position.set(-0.25, 1.45, 0.18);
    hornL.rotation.z = Math.PI / 4;
    group.add(hornL);
  } else {
    // Sacred Pipal Tree & Processional Deity Glyphs
    const treeTrunk = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.8, 0.1), mats.brickDark);
    treeTrunk.position.set(0, 1.2, 0.18);
    group.add(treeTrunk);

    // Radiating branch foliage
    for (let f = 0; f < 5; f++) {
      const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.08, 0.06), mats.brickDark);
      leaf.position.set(-0.3 + f * 0.15, 1.6 + (f % 2) * 0.1, 0.18);
      group.add(leaf);
    }
  }

  // Script header bar across top margin
  const scriptBar = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.16, 0.06), mats.brickDark);
  scriptBar.position.set(0, 1.9, 0.18);
  group.add(scriptBar);

  // Dedicated wall sconce spotlight
  const light = new THREE.PointLight(isZebuTotem ? 0xffb74d : 0x00e5ff, 2.4, 5.0, 1.2);
  light.position.set(0, 1.6, 0.6);
  group.add(light);

  return group;
}

/**
 * 10. Sanctuary Keystone Mechanism Plinth (Level 3)
 */
export function createSanctuaryKeystoneModel(mats: StylizedMaterialPalette): THREE.Group {
  const group = new THREE.Group();

  // Tier 1: Stepped Dark Brick Plinth
  const plinth1 = new THREE.Mesh(
    new THREE.CylinderGeometry(1.3, 1.5, 0.25, 24),
    mats.brickDark,
  );
  plinth1.position.y = 0.125;
  plinth1.castShadow = true;
  plinth1.receiveShadow = true;
  group.add(plinth1);

  // Tier 2: Gold Brass Concentric Dial
  const dial = new THREE.Mesh(
    new THREE.CylinderGeometry(1.05, 1.2, 0.2, 24),
    mats.goldBrass,
  );
  dial.position.y = 0.35;
  dial.castShadow = true;
  group.add(dial);

  // Tier 3: Vitrified Steatite Keystone Hub
  const hub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.65, 0.5, 20),
    mats.steatiteSeal,
  );
  hub.position.y = 0.7;
  hub.castShadow = true;
  group.add(hub);

  // 4 Radial alignment keys
  for (let k = 0; k < 4; k++) {
    const key = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.15, 0.4),
      mats.goldBrass,
    );
    key.position.set(0, 0.7, 0);
    key.rotation.y = (k * Math.PI) / 2;
    key.translateZ(0.55);
    group.add(key);
  }

  // Golden energy pulse light
  const light = new THREE.PointLight(0xffa726, 2.6, 6.0, 1.1);
  light.position.set(0, 1.2, 0);
  group.add(light);

  return group;
}

/**
 * 11. The Master Steatite Stamp Seal (Hero Final Artifact)
 */
export function createMasterSteatiteSealModel(mats: StylizedMaterialPalette): THREE.Group {
  const group = new THREE.Group();

  // Vitrified Ivory-White Steatite Stamp Seal Body (Square format: 3.8 x 3.8 cm proportional)
  const sealBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.88, 0.88, 0.2),
    mats.steatiteSeal,
  );
  sealBody.castShadow = true;
  group.add(sealBody);

  // High-Relief Intaglio Zebu Bull on Front Face
  const bullBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.48, 0.32, 0.08),
    mats.brickDark,
  );
  bullBody.position.set(0, -0.08, 0.12);
  group.add(bullBody);

  const hump = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 8, 8),
    mats.brickDark,
  );
  hump.position.set(-0.14, 0.1, 0.12);
  group.add(hump);

  // 5 Distinct Indus Script Signs along the top header
  const scriptMat = new THREE.MeshBasicMaterial({ color: 0x112222 });
  for (let s = 0; s < 5; s++) {
    const sign = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.02), scriptMat);
    sign.position.set(-0.28 + s * 0.14, 0.28, 0.11);
    group.add(sign);
  }

  // Perforated reverse suspension boss knob on the back
  const boss = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.22, 0.2, 16),
    mats.steatiteSeal,
  );
  boss.position.set(0, 0, -0.18);
  boss.rotation.x = Math.PI / 2;
  group.add(boss);

  // Ethereal golden/cyan halo ring around the hero seal
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.65,
  });
  const halo = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.025, 8, 32), ringMat);
  group.add(halo);

  // Celestial golden spotlight
  const light = new THREE.PointLight(0xffea9f, 3.8, 12, 1.0);
  light.position.set(0, 0, 0.8);
  group.add(light);

  return group;
}
