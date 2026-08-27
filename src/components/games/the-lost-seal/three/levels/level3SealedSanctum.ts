import * as THREE from "three";
import type { InteractiveEntity3D, BoxCollider3D } from "../types";
import type { StylizedMaterialPalette } from "../materials";
import type { LevelSceneResult } from "./level1LostCity";
import { createWeatheredBrickWall } from "../environmentHelpers";

export function createLevel3SealedSanctum(mats: StylizedMaterialPalette): LevelSceneResult {
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
      zone: "Sealed Sanctum",
      position: new THREE.Vector3(x, y, z),
      interactionRadius: 3.5,
      objectiveAfterInspect,
      isInspected: false,
      mesh,
    });
  };

  // 1. Ancient Sanctum Floor with Sacred Flagstone Patterns
  const groundGeo = new THREE.PlaneGeometry(65, 75);
  const ground = new THREE.Mesh(groundGeo, mats.stoneFloor);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  group.add(ground);

  // Central Ceremonial Altar Runway
  const runwayGeo = new THREE.PlaneGeometry(10, 55);
  const runway = new THREE.Mesh(runwayGeo, mats.brickDark);
  runway.rotation.x = -Math.PI / 2;
  runway.position.set(0, 0.02, 0);
  runway.receiveShadow = true;
  group.add(runway);

  // Reflecting Water Channels flanking the altar runway
  const leftPool = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 42), mats.water);
  leftPool.rotation.x = -Math.PI / 2;
  leftPool.position.set(-6.5, 0.04, -2);
  group.add(leftPool);

  const rightPool = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 42), mats.water);
  rightPool.rotation.x = -Math.PI / 2;
  rightPool.position.set(6.5, 0.04, -2);
  group.add(rightPool);

  // 2. Vault Enclosure Walls
  group.add(createWeatheredBrickWall(mats, colliders, -20, 0, 0, 2.2, 8.0, 70)); // West Vault Wall
  group.add(createWeatheredBrickWall(mats, colliders, 20, 0, 0, 2.2, 8.0, 70)); // East Vault Wall
  group.add(createWeatheredBrickWall(mats, colliders, 0, 0, 30, 40, 8.0, 2.2)); // South Wall (Entry)
  group.add(createWeatheredBrickWall(mats, colliders, 0, 0, -30, 40, 8.0, 2.2)); // North Sanctuary Wall

  // 3. Monolithic Sanctuary Pillars with Carved Capitals
  const pillarPositions = [
    { x: -10, z: -18 },
    { x: 10, z: -18 },
    { x: -10, z: -6 },
    { x: 10, z: -6 },
    { x: -10, z: 8 },
    { x: 10, z: 8 },
    { x: -10, z: 20 },
    { x: 10, z: 20 },
  ];

  for (const pos of pillarPositions) {
    const pillarGroup = new THREE.Group();

    // Pillar base
    const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.7, 2.2), mats.wallCap);
    baseMesh.position.y = 0.35;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    pillarGroup.add(baseMesh);

    // Fluted cylindrical column
    const colMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.9, 6.5, 16), mats.brick);
    colMesh.position.y = 3.6;
    colMesh.castShadow = true;
    colMesh.receiveShadow = true;
    pillarGroup.add(colMesh);

    // Capital
    const capMesh = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.7, 2.4), mats.wallCap);
    capMesh.position.y = 7.1;
    capMesh.castShadow = true;
    pillarGroup.add(capMesh);

    pillarGroup.position.set(pos.x, 0, pos.z);
    group.add(pillarGroup);

    colliders.push({ minX: pos.x - 1.1, maxX: pos.x + 1.1, minZ: pos.z - 1.1, maxZ: pos.z + 1.1 });
  }

  // 4. Sacred Central Stepped Altar Pyramid
  const altarGroup = new THREE.Group();

  const step1 = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.5, 6.5), mats.brickDark);
  step1.position.set(0, 0.25, -12);
  step1.receiveShadow = true;
  step1.castShadow = true;
  altarGroup.add(step1);

  const step2 = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.5, 4.8), mats.brick);
  step2.position.set(0, 0.75, -12);
  step2.receiveShadow = true;
  step2.castShadow = true;
  altarGroup.add(step2);

  const step3 = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.5, 3.2), mats.brickDark);
  step3.position.set(0, 1.25, -12);
  step3.receiveShadow = true;
  step3.castShadow = true;
  altarGroup.add(step3);

  // Golden Altar Pedestal
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.0, 0.7, 16), mats.goldBrass);
  pedestal.position.set(0, 1.85, -12);
  pedestal.receiveShadow = true;
  pedestal.castShadow = true;
  altarGroup.add(pedestal);

  group.add(altarGroup);
  colliders.push({ minX: -3.3, maxX: 3.3, minZ: -15.5, maxZ: -8.5 });

  // 5. PROGRESSION GATING: Sacred Inner Sanctum Barrier
  // This barrier physically blocks walking directly into the altar until the sanctuary friezes & keystone are solved!
  const barrierGroup = new THREE.Group();
  const barrierPillarL = new THREE.Mesh(new THREE.BoxGeometry(1.2, 5.0, 1.2), mats.goldBrass);
  barrierPillarL.position.set(-4.2, 2.5, -4);
  barrierPillarL.castShadow = true;
  barrierGroup.add(barrierPillarL);

  const barrierPillarR = new THREE.Mesh(new THREE.BoxGeometry(1.2, 5.0, 1.2), mats.goldBrass);
  barrierPillarR.position.set(4.2, 2.5, -4);
  barrierPillarR.castShadow = true;
  barrierGroup.add(barrierPillarR);

  // Glowing energy/bronze lattice gate
  const barrierGate = new THREE.Mesh(new THREE.BoxGeometry(7.2, 4.0, 0.4), mats.goldBrass);
  barrierGate.position.set(0, 2.0, -4);
  barrierGate.castShadow = true;
  barrierGroup.add(barrierGate);

  group.add(barrierGroup);

  // Physical barrier collider
  const barrierCollider: BoxCollider3D = {
    minX: -4.5,
    maxX: 4.5,
    minZ: -4.8,
    maxZ: -3.2,
    name: "altar_barrier_col",
  };
  colliders.push(barrierCollider);

  // 6. Interactive Sanctuary Exploration Finds (Required for unlocking the Altar Barrier)
  // Find 1: East Sanctuary Frieze (Script Line)
  const frieze1 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.4, 0.2), mats.steatiteSeal);
  frieze1.position.set(18.5, 2.2, 4);
  addEntity(
    "tablet",
    "tablet",
    "Sanctuary Inscription Frieze",
    "Study Sanctuary Glyphs",
    17.5,
    0,
    4,
    frieze1,
    "Inspect the West Wall Totem Relief to find the keystone formula.",
  );

  // Find 2: West Sanctuary Frieze (Zebu Totem Relief)
  const frieze2 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.4, 0.2), mats.steatiteSeal);
  frieze2.position.set(-18.5, 2.2, 4);
  addEntity(
    "crate",
    "crate",
    "Zebu Bull Sacred Frieze",
    "Examine Sacred Totem Relief",
    -17.5,
    0,
    4,
    frieze2,
    "Approach the Sanctuary Keystone Mechanism in front of the gate!",
  );

  // Find 3: Sanctuary Keystone Mechanism (Triggers the unlocking of the Altar Barrier)
  const keystone = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.8, 1.2, 16), mats.goldBrass);
  keystone.position.set(0, 0.6, 2);
  keystone.castShadow = true;
  addEntity(
    "underground_cache",
    "underground_cache",
    "Sanctuary Keystone Mechanism",
    "Align Sanctuary Keystone",
    0,
    0,
    2,
    keystone,
    "The Altar Barrier is disengaged! Approach the central altar to recover the Steatite Seal.",
  );

  // 7. THE HERO STEATITE STAMP SEAL (Masterpiece Artifact on Altar)
  const sealGroup = new THREE.Group();

  // White vitrified steatite seal body
  const sealBody = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.85, 0.18), mats.steatiteSeal);
  sealBody.castShadow = true;
  sealGroup.add(sealBody);

  // Engraved relief boss on reverse
  const boss = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.2, 16), mats.steatiteSeal);
  boss.position.set(0, 0, -0.16);
  boss.rotation.x = Math.PI / 2;
  sealGroup.add(boss);

  // Golden Sacred Halo Point Light on the Seal
  const altarLight = new THREE.PointLight(0xf59e0b, 3.8, 14, 1.1);
  altarLight.position.set(0, 4.0, -12);
  altarLight.castShadow = true;
  group.add(altarLight);

  addEntity(
    "steatite_seal",
    "steatite_seal",
    "The Master Steatite Stamp Seal",
    "Recover & Authenticate Steatite Seal",
    0,
    2.4,
    -12,
    sealGroup,
    "Perform forensic authentication on the recovered artifact.",
  );

  // 8. Atmospheric Golden Dust Particles
  const particleCount = 240;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 35;
    particlePositions[i + 1] = Math.random() * 6.0;
    particlePositions[i + 2] = (Math.random() - 0.5) * 55;
  }

  particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xfbbf24,
    size: 0.12,
    transparent: true,
    opacity: 0.75,
  });
  const dustParticles = new THREE.Points(particleGeo, particleMat);
  group.add(dustParticles);

  // 9. Sconce Torches with Dynamic Point Lights (Warm, Bright & Visible!)
  const torchLights: THREE.PointLight[] = [];
  const tPositions = [
    { x: -18, y: 3.4, z: -20 },
    { x: 18, y: 3.4, z: -20 },
    { x: -18, y: 3.4, z: -6 },
    { x: 18, y: 3.4, z: -6 },
    { x: -18, y: 3.4, z: 8 },
    { x: 18, y: 3.4, z: 8 },
    { x: -18, y: 3.4, z: 22 },
    { x: 18, y: 3.4, z: 22 },
  ];

  for (const tp of tPositions) {
    const torch = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.7, 8), mats.torchWood);
    torch.position.set(tp.x, tp.y, tp.z);
    torch.rotation.z = tp.x < 0 ? -Math.PI / 6 : Math.PI / 6;
    group.add(torch);

    const light = new THREE.PointLight(0xf59e0b, 2.6, 12, 1.2);
    light.position.set(tp.x, tp.y + 0.35, tp.z);
    light.castShadow = true;
    group.add(light);
    torchLights.push(light);
  }

  let isBarrierLowered = false;
  let barrierProgress = 0;

  return {
    group,
    colliders,
    interactiveEntities,
    spawnPoint: new THREE.Vector3(0, 0, 24),
    spawnRotation: Math.PI,
    sunColor: 0xa87548, // Warm bounce fill
    sunIntensity: 1.4,
    ambientColor: 0x6e4e36, // Rich ambient fill ensuring 100% readability!
    fogColor: 0x241910,
    fogDensity: 0.015,
    animatedProps: {
      update: (dt, time) => {
        // Rotate and float the hero Steatite Seal
        sealGroup.rotation.y = time * 0.95;
        sealGroup.position.y = 2.4 + Math.sin(time * 2.4) * 0.14;

        // Water ripple oscillation
        leftPool.position.y = 0.04 + Math.sin(time * 2.0) * 0.015;
        rightPool.position.y = 0.04 + Math.sin(time * 2.0 + 1) * 0.015;

        // Torchlight flicker
        torchLights.forEach((tl, idx) => {
          tl.intensity = 2.6 + Math.sin(time * 9.0 + idx * 2) * 0.4;
        });

        // Barrier lowering animation when solved
        if (isBarrierLowered && barrierProgress < 1) {
          barrierProgress = Math.min(1, barrierProgress + dt * 1.5);
          barrierGate.position.y = 2.0 - barrierProgress * 4.5;
        }

        // Dust motes drifting
        const posAttr = particleGeo.getAttribute("position") as THREE.BufferAttribute | undefined;
        if (posAttr) {
          const array = posAttr.array as Float32Array;
          for (let i = 0; i < particleCount * 3; i += 3) {
            const curY = array[i + 1] ?? 0;
            const curX = array[i] ?? 0;
            array[i + 1] = curY + Math.sin(time + curX) * 0.0035;
            if ((array[i + 1] ?? 0) > 6.0) array[i + 1] = 0.2;
          }
          posAttr.needsUpdate = true;
        }
      },
    },
  };
}
