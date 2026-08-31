import * as THREE from "three";
import type { InteractiveEntity3D, BoxCollider3D } from "../types";
import type { StylizedMaterialPalette } from "../materials";
import type { LevelSceneResult } from "./level1LostCity";
import {
  createWeatheredBrickWall,
  createTorch,
  type TorchInstance,
  createStylizedRock,
  createPotteryCluster,
} from "../environmentHelpers";
import {
  createFloatingDust,
  createRuneGlow,
  type RuneGlow,
  createActivationPulse,
  type ActivationPulse,
  createMagicalPortal,
  type MagicalPortal,
} from "../vfx";
import {
  createSanctuaryWallFriezeModel,
  createSanctuaryKeystoneModel,
  createMasterSteatiteSealModel,
} from "../archaeologicalModels";

export function createLevel3SealedSanctum(mats: StylizedMaterialPalette): LevelSceneResult {
  const group = new THREE.Group();
  const colliders: BoxCollider3D[] = [];
  const interactiveEntities: InteractiveEntity3D[] = [];
  // Sanctum-specific material tuning: matte, soot-dark masonry lets the ritual
  // metal and seal carry the eye without making the whole chamber shiny.
  const sanctumStone = mats.wallCap.clone();
  sanctumStone.color.setHex(0x6f5542);
  sanctumStone.roughness = 0.93;
  const altarMetal = mats.goldBrass.clone();
  altarMetal.color.setHex(0x9b6c2a);
  altarMetal.roughness = 0.52;
  altarMetal.emissive = new THREE.Color(0x140b02);
  const routeInlayMat = new THREE.MeshStandardMaterial({
    color: 0x8b6235,
    emissive: new THREE.Color(0x100703),
    roughness: 0.82,
    metalness: 0.08,
  });

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
    // The seal is deliberately revealed by the portal finale. It must not be
    // interactable through/above the altar before that reveal.
    const enabled = id !== "steatite_seal";
    mesh.visible = enabled;
    group.add(mesh);

    interactiveEntities.push({
      id,
      type,
      name,
      promptLabel,
      zone: "Sealed Sanctum",
      position: new THREE.Vector3(x, y, z),
      interactionRadius: 3.5,
      objectiveAfterInspect,
      isInspected: false,
      mesh,
      data: { enabled },
    });
  };

  // 1. Vaulted Subterranean Hall Ceiling & Monumental Overhead Arch Ribs
  const ceilingMat = new THREE.MeshStandardMaterial({
    color: 0x1e120a,
    roughness: 0.95,
    side: THREE.BackSide,
  });
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(68, 78), ceilingMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(0, 8.6, 0);
  group.add(ceiling);

  // Massive Corbelled Stone Vault Ribs spanning East-to-West overhead
  for (let z = -24; z <= 24; z += 12) {
    const rib = new THREE.Mesh(new THREE.BoxGeometry(40.5, 0.7, 1.2), mats.wallCap);
    rib.position.set(0, 8.2, z);
    rib.castShadow = true;
    group.add(rib);
  }

  // 2. Ancient Sanctum Floor with Multi-Level Flagstones & Water Channels
  const groundGeo = new THREE.PlaneGeometry(68, 78);
  const ground = new THREE.Mesh(groundGeo, mats.stoneFloor);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  group.add(ground);

  // Central Ceremonial Altar Runway (Raised Dark Masonry)
  const runwayGeo = new THREE.BoxGeometry(10, 0.16, 56);
  const runway = new THREE.Mesh(runwayGeo, mats.brickDark);
  runway.position.set(0, 0.08, 0);
  runway.receiveShadow = true;
  group.add(runway);

  // Runway Flagstone Trim Curbs
  const curbL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.24, 56), sanctumStone);
  curbL.position.set(-5.1, 0.12, 0);
  curbL.receiveShadow = true;
  group.add(curbL);

  const curbR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.24, 56), sanctumStone);
  curbR.position.set(5.1, 0.12, 0);
  curbR.receiveShadow = true;
  group.add(curbR);

  // Reflecting Sacred Water Channels flanking the runway
  const poolBaseGeo = new THREE.BoxGeometry(3.6, 0.08, 44);
  const poolBaseL = new THREE.Mesh(poolBaseGeo, mats.brickDark);
  poolBaseL.position.set(-7.5, 0.02, -2);
  group.add(poolBaseL);

  const poolBaseR = new THREE.Mesh(poolBaseGeo, mats.brickDark);
  poolBaseR.position.set(7.5, 0.02, -2);
  group.add(poolBaseR);

  const leftPool = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 43), mats.water);
  leftPool.rotation.x = -Math.PI / 2;
  leftPool.position.set(-7.5, 0.07, -2);
  group.add(leftPool);

  const rightPool = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 43), mats.water);
  rightPool.rotation.x = -Math.PI / 2;
  rightPool.position.set(7.5, 0.07, -2);
  group.add(rightPool);

  // Broken brass-and-stone inlays lead the player from the threshold to the
  // keystone, barrier, and altar without adding UI arrows.
  const routeInlays: THREE.Mesh[] = [];
  for (const z of [20, 13, 6, -1, -8]) {
    const inlay = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.52, 6), routeInlayMat);
    inlay.rotation.x = -Math.PI / 2;
    inlay.position.set(0, 0.205, z);
    group.add(inlay);
    routeInlays.push(inlay);
  }

  // 3. Vault Enclosure Perimeter Walls & Recessed Ritual Niches
  group.add(createWeatheredBrickWall(mats, colliders, -20, 0, 0, 2.5, 8.5, 74)); // West Vault Wall
  group.add(createWeatheredBrickWall(mats, colliders, 20, 0, 0, 2.5, 8.5, 74)); // East Vault Wall
  group.add(createWeatheredBrickWall(mats, colliders, 0, 0, 32, 42, 8.5, 2.5)); // South Wall (Entry)
  group.add(createWeatheredBrickWall(mats, colliders, 0, 0, -32, 42, 8.5, 2.5)); // North Sanctuary Wall

  // Recessed Ritual Niches along East/West Walls with ceremonial offerings
  for (let z = -18; z <= 18; z += 12) {
    // West Niche
    const nicheW = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2.0, 1.8), mats.brickDark);
    nicheW.position.set(-18.7, 2.4, z);
    group.add(nicheW);
    const nicheSlabW = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.15, 2.2), mats.wallCap);
    nicheSlabW.position.set(-18.6, 1.35, z);
    group.add(nicheSlabW);

    // East Niche
    const nicheE = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2.0, 1.8), mats.brickDark);
    nicheE.position.set(18.7, 2.4, z);
    group.add(nicheE);
    const nicheSlabE = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.15, 2.2), mats.wallCap);
    nicheSlabE.position.set(18.6, 1.35, z);
    group.add(nicheSlabE);
  }

  // 4. Monolithic Sanctuary Columns with Stepped Bases & Capitals
  const pillarPositions = [
    { x: -11, z: -18 },
    { x:  11, z: -18 },
    { x: -11, z:  -6 },
    { x:  11, z:  -6 },
    { x: -11, z:   8 },
    { x:  11, z:   8 },
    { x: -11, z:  20 },
    { x:  11, z:  20 },
  ];

  for (const pos of pillarPositions) {
    const pillarGroup = new THREE.Group();

    // Stepped Tier 1 Base
    const base1 = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.4, 2.6), mats.brickDark);
    base1.position.y = 0.2;
    base1.castShadow = true;
    base1.receiveShadow = true;
    pillarGroup.add(base1);

    // Stepped Tier 2 Base
    const base2 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.4, 2.2), mats.wallCap);
    base2.position.y = 0.55;
    base2.castShadow = true;
    base2.receiveShadow = true;
    pillarGroup.add(base2);

    // Fluted cylindrical column shaft
    const colMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.92, 6.6, 18), mats.brick);
    colMesh.position.y = 4.0;
    colMesh.castShadow = true;
    colMesh.receiveShadow = true;
    pillarGroup.add(colMesh);

    // Stepped Corbelled Capital
    const cap1 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.35, 2.2), sanctumStone);
    cap1.position.y = 7.4;
    cap1.castShadow = true;
    pillarGroup.add(cap1);

    const cap2 = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.4, 2.8), mats.brickDark);
    cap2.position.y = 7.75;
    cap2.castShadow = true;
    pillarGroup.add(cap2);

    pillarGroup.position.set(pos.x, 0, pos.z);
    group.add(pillarGroup);

    colliders.push({ minX: pos.x - 1.3, maxX: pos.x + 1.3, minZ: pos.z - 1.3, maxZ: pos.z + 1.3 });
  }

  // 5. Sacred Central Stepped Altar Pyramid
  const altarGroup = new THREE.Group();

  // Tier 1 Base
  // Each rise stays below the physics controller's step threshold, making the
  // altar reliably climbable instead of requiring an awkward jump at the gate.
  const step1 = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.42, 7.5), mats.brickDark);
  step1.position.set(0, 0.21, -12);
  step1.receiveShadow = true;
  step1.castShadow = true;
  altarGroup.add(step1);

  // Tier 2 Middle Step
  const step2 = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.42, 5.6), mats.brick);
  step2.position.set(0, 0.63, -12);
  step2.receiveShadow = true;
  step2.castShadow = true;
  altarGroup.add(step2);

  // Tier 3 Top Step with Inscribed Moulding
  const step3 = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.42, 3.8), mats.brickDark);
  step3.position.set(0, 1.05, -12);
  step3.receiveShadow = true;
  step3.castShadow = true;
  altarGroup.add(step3);

  // Golden Altar Pedestal with Indus Relief Trim
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.15, 0.85, 18), altarMetal);
  pedestal.position.set(0, 1.68, -12);
  pedestal.receiveShadow = true;
  pedestal.castShadow = true;
  altarGroup.add(pedestal);

  const pedestalCap = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.0, 0.15, 18), mats.wallCap);
  pedestalCap.position.set(0, 2.15, -12);
  pedestalCap.receiveShadow = true;
  pedestalCap.castShadow = true;
  altarGroup.add(pedestalCap);

  group.add(altarGroup);
  // Stepped climbable pyramid colliders (Tier 1 -> Tier 2 -> Tier 3)
  colliders.push({ minX: -3.75, maxX: 3.75, minZ: -15.75, maxZ: -8.25, maxY: 0.42, isWalkable: true });
  colliders.push({ minX: -2.8, maxX: 2.8, minZ: -14.8, maxZ: -9.2, maxY: 0.84, isWalkable: true });
  colliders.push({ minX: -1.9, maxX: 1.9, minZ: -13.9, maxZ: -10.1, maxY: 1.26, isWalkable: true });
  colliders.push({ minX: -0.6, maxX: 0.6, minZ: -12.6, maxZ: -11.4, minY: 1.26, maxY: 2.25, isWalkable: false });

  // 6. MAGICAL PORTAL (Ethereal Ancient Sanctuary Vortex behind the Altar)
  const magicalPortal = createMagicalPortal(0, 4.4, -15.2);
  group.add(magicalPortal.group);
  addEntity(
    "sanctum_portal",
    "sanctum_portal",
    "The Sacred Sanctum Vortex",
    "Enter Sanctum Vortex",
    0,
    2.5,
    -15.2,
    magicalPortal.group,
    "The ancient vortex hums with harmonic energy!",
  );
  const portalEnt = interactiveEntities.find((e) => e.id === "sanctum_portal");
  if (portalEnt) {
    portalEnt.interactionRadius = 4.8;
  }

  // 7. PROGRESSION GATING: Sacred Inner Sanctum Barrier & Monolithic Pylons
  const barrierGroup = new THREE.Group();

  // Left Pylon
  const barrierPillarL = new THREE.Mesh(new THREE.BoxGeometry(1.4, 5.5, 1.4), mats.wallCap);
  barrierPillarL.position.set(-4.5, 2.75, -4);
  barrierPillarL.castShadow = true;
  barrierGroup.add(barrierPillarL);

  const pylonCapL = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.4, 1.8), altarMetal);
  pylonCapL.position.set(-4.5, 5.6, -4);
  barrierGroup.add(pylonCapL);

  // Right Pylon
  const barrierPillarR = new THREE.Mesh(new THREE.BoxGeometry(1.4, 5.5, 1.4), mats.wallCap);
  barrierPillarR.position.set(4.5, 2.75, -4);
  barrierPillarR.castShadow = true;
  barrierGroup.add(barrierPillarR);

  const pylonCapR = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.4, 1.8), altarMetal);
  pylonCapR.position.set(4.5, 5.6, -4);
  barrierGroup.add(pylonCapR);

  // Glowing energy/bronze lattice gate
  const barrierGateMat = altarMetal.clone();
  barrierGateMat.emissive = new THREE.Color(0x1b0f02);
  barrierGateMat.emissiveIntensity = 0.25;
  const barrierGate = new THREE.Mesh(new THREE.BoxGeometry(7.6, 4.2, 0.4), barrierGateMat);
  barrierGate.position.set(0, 2.1, -4);
  barrierGate.castShadow = true;
  barrierGroup.add(barrierGate);

  group.add(barrierGroup);

  // Physical barrier collider
  const barrierCollider: BoxCollider3D = {
    minX: -4.8,
    maxX: 4.8,
    minZ: -4.8,
    maxZ: -3.2,
    name: "altar_barrier_col",
  };
  colliders.push(barrierCollider);

  // A recessed ceremonial arch and alternating relief blocks deepen the altar
  // wall silhouette; these are visual-only to preserve the existing route.
  const portalRecess = new THREE.Mesh(new THREE.TorusGeometry(3.15, 0.3, 10, 36), sanctumStone);
  portalRecess.position.set(0, 3.4, -16.1);
  group.add(portalRecess);
  for (let i = 0; i < 8; i++) {
    const angle = Math.PI * (i / 7);
    const relief = new THREE.Mesh(
      new THREE.BoxGeometry(i % 2 === 0 ? 0.62 : 0.42, 0.28, 0.18),
      i % 2 === 0 ? altarMetal : sanctumStone,
    );
    relief.position.set(Math.cos(angle) * 3.15, 3.4 + Math.sin(angle) * 3.15, -16.25);
    relief.rotation.z = angle - Math.PI / 2;
    group.add(relief);
  }

  const altarSpot = new THREE.SpotLight(0xffbd66, 0.85, 19, Math.PI / 5, 0.75, 1.5);
  altarSpot.position.set(0, 7.6, -6.5);
  altarSpot.target.position.set(0, 1.3, -12);
  altarSpot.castShadow = false;
  group.add(altarSpot, altarSpot.target);
  const portalRimLight = new THREE.PointLight(0x006d82, 0.8, 12, 2);
  portalRimLight.position.set(0, 4.5, -15.6);
  group.add(portalRimLight);

  const barrierSparks: THREE.Mesh[] = [];
  const sparkMat = new THREE.MeshBasicMaterial({ color: 0x7ffcff, transparent: true, opacity: 0 });
  for (let i = 0; i < 14; i++) {
    const spark = new THREE.Mesh(new THREE.SphereGeometry(0.035 + (i % 3) * 0.012, 5, 5), sparkMat);
    spark.position.set((i % 7 - 3) * 0.9, 1.2 + Math.floor(i / 7) * 1.5, -3.7);
    spark.visible = false;
    group.add(spark);
    barrierSparks.push(spark);
  }

  // 8. Interactive Sanctuary Exploration Finds (Required for unlocking the Altar Barrier)
  // Find 1: East Sanctuary Frieze (Script Line Inscription)
  const frieze1Model = createSanctuaryWallFriezeModel(mats, false);
  addEntity(
    "tablet",
    "tablet",
    "Sanctuary Inscription Frieze",
    "Study Sanctuary Glyphs",
    17.5,
    0.8,
    4,
    frieze1Model,
    "Inspect the West Wall Totem Relief to find the keystone formula.",
  );

  // Find 2: West Sanctuary Frieze (Zebu Totem Sacred Relief)
  const frieze2Model = createSanctuaryWallFriezeModel(mats, true);
  addEntity(
    "crate",
    "crate",
    "Zebu Bull Sacred Frieze",
    "Examine Sacred Totem Relief",
    -17.5,
    0.8,
    4,
    frieze2Model,
    "Approach the Sanctuary Keystone Mechanism in front of the gate!",
  );

  // Find 3: Sanctuary Keystone Mechanism (Triggers the unlocking of the Altar Barrier)
  const keystoneModel = createSanctuaryKeystoneModel(mats);
  addEntity(
    "underground_cache",
    "underground_cache",
    "Sanctuary Keystone Mechanism",
    "Align Sanctuary Keystone",
    0,
    0,
    2,
    keystoneModel,
    "The Altar Barrier is disengaged! Approach the central altar to recover the Steatite Seal.",
  );

  // 9. THE HERO STEATITE STAMP SEAL (Masterpiece Artifact Climax)
  const sealGroup = createMasterSteatiteSealModel(mats);
  addEntity(
    "steatite_seal",
    "steatite_seal",
    "The Master Steatite Stamp Seal",
    "Recover & Authenticate Steatite Seal",
    0,
    2.65,
    -12,
    sealGroup,
    "Perform forensic authentication on the recovered artifact.",
  );

  // 10. Archaeological Props & Ancient Debris
  group.add(createPotteryCluster(mats));
  const potCluster2 = createPotteryCluster(mats);
  potCluster2.position.set(-16.5, 0, -18);
  group.add(potCluster2);

  const potCluster3 = createPotteryCluster(mats);
  potCluster3.position.set(16.5, 0, -18);
  group.add(potCluster3);

  // Fallen carved masonry rubble & stylized rocks around perimeter
  group.add(createStylizedRock(mats, 1.1, colliders, -15.5, 14));
  group.add(createStylizedRock(mats, 0.9, colliders,  15.5, 14));
  group.add(createStylizedRock(mats, 0.8, colliders, -16.5, -24));
  group.add(createStylizedRock(mats, 1.0, colliders,  16.5, -24));

  // ── SCONCE TORCHES ──────────────────────────────────────────────────────────
  const torches: TorchInstance[] = [];
  const torchPositions: [number, number, number, number, number][] = [
    // [x, y, z, wallDir, flickerOffset]
    // West wall sconces
    [-18.5, 2.4, -20,  Math.PI / 2,   0.0],
    [-18.5, 2.4,  -6,  Math.PI / 2,   0.9],
    [-18.5, 2.4,   8,  Math.PI / 2,   1.8],
    [-18.5, 2.4,  22,  Math.PI / 2,   2.7],
    // East wall sconces
    [ 18.5, 2.4, -20, -Math.PI / 2,   0.45],
    [ 18.5, 2.4,  -6, -Math.PI / 2,   1.35],
    [ 18.5, 2.4,   8, -Math.PI / 2,   2.25],
    [ 18.5, 2.4,  22, -Math.PI / 2,   0.15],
    // Altar corner braziers
    [-4.0,  1.6, -16, -Math.PI / 4,   0.7],
    [ 4.0,  1.6, -16,  Math.PI / 4,   1.6],
    [-4.0,  1.6,  -8, -Math.PI * 0.75, 2.3],
    [ 4.0,  1.6,  -8,  Math.PI * 0.75, 0.3],
    // Entrance framing torches
    [-3.5,  2.2,  30.5, Math.PI,      1.1],
    [ 3.5,  2.2,  30.5, Math.PI,      2.0],
  ];

  for (const [x, y, z, dir, offset] of torchPositions) {
    const torch = createTorch(x, y, z, dir, offset);
    group.add(torch.group);
    torches.push(torch);
  }

  // ── FLOATING DUST PARTICLES ────────────────────────────────────────────────
  const dust = createFloatingDust(260, 34);
  group.add(dust.points);

  // ── RUNE GLOWS on interactive discovery objects ───────────────────────────
  const runeGlows: RuneGlow[] = [];

  // East Inscription Frieze rune
  const runeEast = createRuneGlow(17.5, 1.7, 4, 0, 0x00cccc);
  group.add(runeEast.group);
  runeGlows.push(runeEast);

  // West Totem Frieze rune
  const runeWest = createRuneGlow(-17.5, 1.7, 4, 0, 0x00cccc);
  group.add(runeWest.group);
  runeGlows.push(runeWest);

  // Keystone Mechanism rune
  const runeKeystone = createRuneGlow(0, 0.95, 2, 0, 0x00e8ff);
  group.add(runeKeystone.group);
  runeGlows.push(runeKeystone);

  // Altar Dais Divine rune
  const runeAltar = createRuneGlow(0, 2.65, -12, 0, 0xffbb22);
  group.add(runeAltar.group);
  runeGlows.push(runeAltar);

  // ── ACTIVATION PULSE ───────────────────────────────────────────────────────
  const activationPulse: ActivationPulse = createActivationPulse(0x00ffff);
  group.add(activationPulse.mesh);

  let isBarrierLowered = false;
  let barrierProgress = 0;

  return {
    group,
    colliders,
    interactiveEntities,
    spawnPoint: new THREE.Vector3(0, 0, 24),
    spawnRotation: Math.PI,
    sunColor: 0xdf9856, // Warm directional key bounce
    sunIntensity: 1.8,
    ambientColor: 0x3e281c, // Subterranean moody ambient contrast
    fogColor: 0x1c1008,
    fogDensity: 0.013,
    animatedProps: {
      update: (dt, time) => {
        // Dynamic barrier lowering when keystone puzzle removes collider
        const isBarrierLowered = !colliders.some((c) => c.name === "altar_barrier_col");
        const barrierCharge = isBarrierLowered ? Math.min(1, barrierProgress * 1.7 + 0.25) : 0;
        const sealRevealed = sealGroup.visible;

        // Rotate and float the hero Steatite Seal (intensifies when barrier opens)
        const sealSpinSpeed = isBarrierLowered ? 1.45 : 0.95;
        sealGroup.rotation.y = time * sealSpinSpeed;
        sealGroup.position.y = (isBarrierLowered ? 2.9 : 2.65) + Math.sin(time * 2.4) * 0.16;

        if (isBarrierLowered) {
          altarSpot.intensity = THREE.MathUtils.lerp(altarSpot.intensity, sealRevealed ? 3.2 : 1.9, 0.035);
          portalRimLight.intensity = THREE.MathUtils.lerp(portalRimLight.intensity, sealRevealed ? 3.4 : 1.8, 0.04);
          altarMetal.emissiveIntensity = THREE.MathUtils.lerp(
            altarMetal.emissiveIntensity,
            sealRevealed ? 1.25 : 0.55,
            0.04,
          );
        }

        // A subtle route shimmer guides the eye while the final state pushes
        // light toward the altar and vortex rather than the whole room.
        for (let i = 0; i < routeInlays.length; i++) {
          const inlay = routeInlays[i]!;
          const wave = Math.max(0, Math.sin(time * 1.35 - i * 0.78));
          inlay.scale.setScalar(1 + wave * 0.08);
        }
        routeInlayMat.emissiveIntensity = isBarrierLowered ? 0.35 + Math.sin(time * 2.1) * 0.12 : 0.04;

        // Magical Portal backdrop gains intensity after Keystone activation and
        // a warm final highlight once the seal has materialized.
        magicalPortal.update(time, barrierCharge, sealRevealed ? 1 : 0);

        // Water caustic ripple oscillation
        leftPool.position.y = 0.07 + Math.sin(time * 2.0) * 0.015;
        rightPool.position.y = 0.07 + Math.sin(time * 2.0 + 1) * 0.015;

        // Torches dynamic multi-sine flicker
        for (const torch of torches) torch.update(time);

        // Subterranean dust drift
        dust.update(dt, time);

        // Rune glows animation
        for (const rune of runeGlows) rune.update(time);

        // Activation pulse expand
        activationPulse.update(dt);

        // Barrier lowering animation when solved
        if (isBarrierLowered && barrierProgress < 1) {
          barrierProgress = Math.min(1, barrierProgress + dt * 1.5);
          barrierGate.position.y = 2.1 - barrierProgress * 4.8;
          barrierGateMat.emissiveIntensity = 0.35 + (1 - barrierProgress) * 2.8;
          for (let i = 0; i < barrierSparks.length; i++) {
            const spark = barrierSparks[i]!;
            spark.visible = true;
            const phase = time * 4.6 + i * 1.73;
            spark.position.x = (i % 7 - 3) * 0.92 + Math.sin(phase) * 0.14;
            spark.position.y = 0.4 + ((phase * 0.55) % 3.7);
            spark.scale.setScalar(0.6 + Math.sin(phase * 2) * 0.25);
          }
          sparkMat.opacity = Math.max(0, 0.92 - barrierProgress * 0.9);
        } else if (isBarrierLowered) {
          barrierGate.visible = false;
          for (const spark of barrierSparks) spark.visible = false;
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
