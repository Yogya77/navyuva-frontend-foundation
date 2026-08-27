import * as THREE from "three";
import type { InteractiveEntity3D, BoxCollider3D, GateState3D } from "./types3D";

export interface World3DResult {
  scene: THREE.Group;
  colliders: BoxCollider3D[];
  interactiveEntities: InteractiveEntity3D[];
  gates: Record<string, GateState3D>;
  animatedProps: {
    update: (dt: number, time: number) => void;
  };
  sealMesh: THREE.Group;
}

export function createWorld3D(): World3DResult {
  const scene = new THREE.Group();
  const colliders: BoxCollider3D[] = [];
  const interactiveEntities: InteractiveEntity3D[] = [];
  const gates: Record<string, GateState3D> = {};

  // Shared Materials with authentic Harappan earthy tones
  const brickMat = new THREE.MeshStandardMaterial({
    color: 0x9c4a22, // Rich terracotta baked-brick
    roughness: 0.85,
    metalness: 0.1,
  });
  const wallCapMat = new THREE.MeshStandardMaterial({
    color: 0xc27640,
    roughness: 0.8,
  });
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x3d2919, // Dark sandstone floor
    roughness: 0.9,
  });
  const trenchDirtMat = new THREE.MeshStandardMaterial({
    color: 0x22160d, // Dark excavated silt stratum
    roughness: 0.95,
  });
  const stonePillarMat = new THREE.MeshStandardMaterial({
    color: 0x7a5b42,
    roughness: 0.7,
  });
  const terracottaMat = new THREE.MeshStandardMaterial({
    color: 0xc75d2c,
    roughness: 0.75,
  });
  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x4a2e18,
    roughness: 0.8,
  });
  const goldAltarMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.7,
    roughness: 0.3,
  });
  const steatiteMat = new THREE.MeshStandardMaterial({
    color: 0xf5eedc, // Vitrified white steatite
    roughness: 0.2,
    metalness: 0.1,
  });

  // Helper to add solid wall + collider
  const addWall = (x: number, y: number, z: number, w: number, h: number, d: number) => {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, brickMat);
    mesh.position.set(x, y + h / 2, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    // Wall cap
    const capGeo = new THREE.BoxGeometry(w + 0.1, 0.2, d + 0.1);
    const cap = new THREE.Mesh(capGeo, wallCapMat);
    cap.position.set(x, y + h + 0.1, z);
    cap.castShadow = true;
    scene.add(cap);

    colliders.push({
      minX: x - w / 2,
      maxX: x + w / 2,
      minZ: z - d / 2,
      maxZ: z + d / 2,
    });
  };

  // Helper to add interactive entity
  const addEntity = (
    id: string,
    type: InteractiveEntity3D["type"],
    name: string,
    promptLabel: string,
    zone: string,
    x: number,
    y: number,
    z: number,
    mesh: THREE.Object3D,
  ) => {
    mesh.position.set(x, y, z);
    scene.add(mesh);

    interactiveEntities.push({
      id,
      type,
      name,
      promptLabel,
      zone,
      position: new THREE.Vector3(x, y, z),
      interactionRadius: 2.8,
      isInspected: false,
      mesh,
    });
  };

  // -------------------------------------------------------------
  // 1. GLOBAL GROUND & FLOORS (5 Connected Zones: X from 0 to 95)
  // -------------------------------------------------------------
  const mainFloorGeo = new THREE.PlaneGeometry(105, 30);
  const mainFloor = new THREE.Mesh(mainFloorGeo, floorMat);
  mainFloor.rotation.x = -Math.PI / 2;
  mainFloor.position.set(48, 0, 0);
  mainFloor.receiveShadow = true;
  scene.add(mainFloor);

  // Harappan Covered Drainage Channel along the main boulevard
  const drainGeo = new THREE.BoxGeometry(90, 0.1, 1.2);
  const drainMat = new THREE.MeshStandardMaterial({ color: 0x1f140b, roughness: 0.9 });
  const drainMesh = new THREE.Mesh(drainGeo, drainMat);
  drainMesh.position.set(48, 0.05, 0);
  drainMesh.receiveShadow = true;
  scene.add(drainMesh);

  // Periodic stone drain inspection sumps
  for (let sx = 10; sx < 85; sx += 12) {
    const sumpGeo = new THREE.BoxGeometry(1.6, 0.14, 1.6);
    const sumpMesh = new THREE.Mesh(sumpGeo, stonePillarMat);
    sumpMesh.position.set(sx, 0.07, 0);
    sumpMesh.receiveShadow = true;
    scene.add(sumpMesh);
  }

  // -------------------------------------------------------------
  // 2. PERIMETER & PARTITION WALLS
  // -------------------------------------------------------------
  // North Boundary Wall (Z: -8 to -12)
  addWall(48, 0, -10, 100, 4.0, 1.0);
  // South Boundary Wall (Z: 8 to 12)
  addWall(48, 0, 10, 100, 4.0, 1.0);
  // West Entrance Boundary Wall (X: 0)
  addWall(0, 0, 0, 1.0, 4.0, 20);
  // East Sanctum Back Wall (X: 95)
  addWall(95, 0, 0, 1.0, 5.0, 20);

  // Area 1 -> Area 2 Portal Wall (X: 18, Open at Z: -2 to 2)
  addWall(18, 0, -6, 1.0, 4.0, 8);
  addWall(18, 0, 6, 1.0, 4.0, 8);

  // Area 2 (Excavation Court) Interior Trenches
  addWall(28, 0, -4, 6.0, 0.6, 0.6);
  addWall(28, 0, 4, 6.0, 0.6, 0.6);

  // Excavation Trench Pit in Area 2
  const trenchPitGeo = new THREE.BoxGeometry(8, 0.2, 5);
  const trenchPit = new THREE.Mesh(trenchPitGeo, trenchDirtMat);
  trenchPit.position.set(28, 0.02, -5);
  trenchPit.receiveShadow = true;
  scene.add(trenchPit);

  // Area 2 -> Area 3 Portal Wall (X: 38, Open at Z: -2 to 2)
  addWall(38, 0, -6, 1.0, 4.0, 8);
  addWall(38, 0, 6, 1.0, 4.0, 8);

  // Area 3 (Symbol Hall) Colonnade Pillars
  for (let px = 42; px <= 54; px += 4) {
    // North pillar
    const pilGeo = new THREE.CylinderGeometry(0.4, 0.45, 4.0, 16);
    const pil1 = new THREE.Mesh(pilGeo, stonePillarMat);
    pil1.position.set(px, 2.0, -3.5);
    pil1.castShadow = true;
    pil1.receiveShadow = true;
    scene.add(pil1);
    colliders.push({ minX: px - 0.5, maxX: px + 0.5, minZ: -4.0, maxZ: -3.0 });

    // South pillar
    const pil2 = new THREE.Mesh(pilGeo, stonePillarMat);
    pil2.position.set(px, 2.0, 3.5);
    pil2.castShadow = true;
    pil2.receiveShadow = true;
    scene.add(pil2);
    colliders.push({ minX: px - 0.5, maxX: px + 0.5, minZ: 3.0, maxZ: 4.0 });
  }

  // Area 3 -> Area 4 Gateway (X: 58, Holds the Sliding Symbol Gate)
  addWall(58, 0, -6, 1.2, 4.5, 8);
  addWall(58, 0, 6, 1.2, 4.5, 8);

  // 3D SLIDING SYMBOL GATE (Gate 1 Door Mesh)
  const doorGeo = new THREE.BoxGeometry(0.8, 3.8, 4.0);
  const doorMat = new THREE.MeshStandardMaterial({
    color: 0x8b4513,
    roughness: 0.6,
    metalness: 0.2,
  });
  const doorMesh = new THREE.Mesh(doorGeo, doorMat);
  doorMesh.position.set(58, 1.9, 0);
  doorMesh.castShadow = true;
  doorMesh.receiveShadow = true;
  scene.add(doorMesh);

  // Gate Collider
  const gateCollider: BoxCollider3D = {
    minX: 57.4,
    maxX: 58.6,
    minZ: -2.0,
    maxZ: 2.0,
    name: "symbol_gate",
  };
  colliders.push(gateCollider);

  gates["symbol_gate"] = {
    id: "symbol_gate",
    isOpen: false,
    progress: 0,
    doorMesh,
  };

  // Area 4 -> Area 5 Portal Wall (X: 78, Secret Passage)
  addWall(78, 0, -6, 1.2, 4.5, 8);
  addWall(78, 0, 6, 1.2, 4.5, 8);

  // -------------------------------------------------------------
  // 3. INTERACTIVE 3D PROPS & ARTIFACT OBJECTS
  // -------------------------------------------------------------

  // Area 1: Survey Datum Stake
  const stakeGroup = new THREE.Group();
  const stakeGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8);
  const stake = new THREE.Mesh(stakeGeo, woodMat);
  stake.position.y = 0.6;
  stake.castShadow = true;
  stakeGroup.add(stake);
  const markerCapGeo = new THREE.ConeGeometry(0.16, 0.3, 8);
  const markerCap = new THREE.Mesh(markerCapGeo, goldAltarMat);
  markerCap.position.y = 1.25;
  stakeGroup.add(markerCap);
  addEntity(
    "survey_marker",
    "marker",
    "Archaeological Grid Datum Stake",
    "Examine Survey Datum",
    "Entrance Gate",
    8,
    0,
    3,
    stakeGroup,
  );

  // Area 2: Stratified Silt Mound
  const moundGeo = new THREE.DodecahedronGeometry(1.4, 1);
  const mound = new THREE.Mesh(moundGeo, trenchDirtMat);
  mound.position.y = 0.5;
  mound.scale.set(1.5, 0.8, 1.2);
  mound.castShadow = true;
  mound.receiveShadow = true;
  addEntity(
    "mound",
    "mound",
    "Stratified Silt Excavation Mound",
    "Examine Stratigraphy Trench",
    "Excavation Court",
    25,
    0,
    -5,
    mound,
  );

  // Area 2: Red Ware Ceramic Sherds
  const potGroup = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const potGeo = new THREE.SphereGeometry(0.35, 12, 12);
    const pot = new THREE.Mesh(potGeo, terracottaMat);
    pot.position.set((i % 2) * 0.4, 0.3, Math.floor(i / 2) * 0.4);
    pot.castShadow = true;
    potGroup.add(pot);
  }
  addEntity(
    "pottery_sherd",
    "pottery",
    "Red Ware Painted Ceramic Sherds",
    "Inspect Painted Ceramics",
    "Excavation Court",
    30,
    0,
    4,
    potGroup,
  );

  // Area 2: Carved Soapstone Testing Slab
  const slabGeo = new THREE.BoxGeometry(0.8, 0.15, 0.6);
  const slab = new THREE.Mesh(slabGeo, steatiteMat);
  slab.position.y = 0.1;
  slab.castShadow = true;
  addEntity(
    "carved_tablet",
    "tablet",
    "Carved Soapstone Testing Slab",
    "Study Inscribed Slab Fragment",
    "Excavation Court",
    32,
    0,
    -4,
    slab,
  );

  // Area 2: Field Tool Crate
  const crateGeo = new THREE.BoxGeometry(0.9, 0.7, 0.9);
  const crate = new THREE.Mesh(crateGeo, woodMat);
  crate.position.y = 0.35;
  crate.castShadow = true;
  crate.receiveShadow = true;
  addEntity(
    "tool_crate",
    "crate",
    "Field Expedition Crate",
    "Open Equipment Box",
    "Excavation Court",
    24,
    0,
    5,
    crate,
  );

  // Area 3: Carved Symbol Gate Trigger Object
  const symPortalObj = new THREE.Object3D();
  symPortalObj.position.set(57, 1.5, 0);
  addEntity(
    "symbol_gate",
    "symbol_gate",
    "Carved Indus Symbol Gate",
    "Examine Inscribed Mechanism",
    "Symbol Hall",
    56.5,
    0,
    0,
    symPortalObj,
  );

  // Area 4: Merchant Storage Amphorae Jars
  const storageGroup = new THREE.Group();
  for (let j = 0; j < 5; j++) {
    const jarGeo = new THREE.CylinderGeometry(0.4, 0.25, 1.3, 12);
    const jar = new THREE.Mesh(jarGeo, terracottaMat);
    jar.position.set((j % 3) * 0.8, 0.65, Math.floor(j / 3) * 0.8);
    jar.castShadow = true;
    storageGroup.add(jar);
  }
  addEntity(
    "storage_jars",
    "storage_jars",
    "Grain Storage Amphorae",
    "Search Storage Vessels",
    "Merchant Storage",
    65,
    0,
    -5,
    storageGroup,
  );

  // Area 4: Export Textile Bales
  const baleGroup = new THREE.Group();
  const baleGeo = new THREE.BoxGeometry(1.2, 0.6, 0.8);
  const baleMat = new THREE.MeshStandardMaterial({ color: 0x3d332a, roughness: 0.9 });
  const bale = new THREE.Mesh(baleGeo, baleMat);
  bale.position.y = 0.3;
  bale.castShadow = true;
  baleGroup.add(bale);
  addEntity(
    "textile_bales",
    "textile_bales",
    "Carbonized Export Textile Bales",
    "Inspect Clay Sealings (Bullae)",
    "Merchant Storage",
    72,
    0,
    -4,
    baleGroup,
  );

  // Area 4: Zebu Guild Shrine Niche
  const shrineGeo = new THREE.BoxGeometry(1.0, 1.8, 0.5);
  const shrine = new THREE.Mesh(shrineGeo, stonePillarMat);
  shrine.position.y = 0.9;
  shrine.castShadow = true;
  addEntity(
    "wall_shrine",
    "wall_shrine",
    "Zebu Guild Shrine",
    "Inspect Guild Altar Niche",
    "Merchant Storage",
    66,
    0,
    6,
    shrine,
  );

  // Area 4: Sub-Floor Mortared Flagstone Cache
  const cacheGeo = new THREE.BoxGeometry(1.4, 0.08, 1.4);
  const cacheMat = new THREE.MeshStandardMaterial({ color: 0x6e4e37, roughness: 0.6 });
  const cacheMesh = new THREE.Mesh(cacheGeo, cacheMat);
  cacheMesh.position.y = 0.04;
  cacheMesh.receiveShadow = true;
  addEntity(
    "floor_cache",
    "floor_cache",
    "Mortared Sub-Floor Flagstone Cache",
    "Investigate Sub-Floor Flagstone",
    "Merchant Storage",
    73,
    0,
    5,
    cacheMesh,
  );

  // -------------------------------------------------------------
  // 4. AREA 5: SEALED SANCTUM & THE STEATITE SEAL PEDESTAL
  // -------------------------------------------------------------
  // Stepped Grand Altar Pedestal
  const base1Geo = new THREE.BoxGeometry(3.0, 0.4, 3.0);
  const base1 = new THREE.Mesh(base1Geo, stonePillarMat);
  base1.position.set(88, 0.2, 0);
  base1.receiveShadow = true;
  base1.castShadow = true;
  scene.add(base1);

  const base2Geo = new THREE.BoxGeometry(2.0, 0.6, 2.0);
  const base2 = new THREE.Mesh(base2Geo, stonePillarMat);
  base2.position.set(88, 0.7, 0);
  base2.receiveShadow = true;
  base2.castShadow = true;
  scene.add(base2);

  const pillarCapGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.2, 16);
  const pillarCap = new THREE.Mesh(pillarCapGeo, goldAltarMat);
  pillarCap.position.set(88, 1.1, 0);
  pillarCap.receiveShadow = true;
  scene.add(pillarCap);

  // THE 3D STEATITE STAMP SEAL (Masterpiece Artifact)
  const sealGroup = new THREE.Group();
  const sealGeo = new THREE.BoxGeometry(0.6, 0.6, 0.12);
  const sealMesh = new THREE.Mesh(sealGeo, steatiteMat);
  sealMesh.castShadow = true;
  sealGroup.add(sealMesh);

  // Reverse perforated boss knob
  const bossGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.14, 12);
  const boss = new THREE.Mesh(bossGeo, steatiteMat);
  boss.position.set(0, 0, -0.1);
  boss.rotation.x = Math.PI / 2;
  sealGroup.add(boss);

  // Spot light above the altar
  const altarLight = new THREE.PointLight(0xfbbf24, 2.5, 8, 1.2);
  altarLight.position.set(88, 3.2, 0);
  altarLight.castShadow = true;
  scene.add(altarLight);

  addEntity(
    "steatite_seal",
    "steatite_seal",
    "The Lost Steatite Seal",
    "Recover Steatite Seal",
    "Sealed Sanctum",
    88,
    1.5,
    0,
    sealGroup,
  );

  // -------------------------------------------------------------
  // 5. TORCH LIGHTS & PARTICLES IN ENVIRONMENT
  // -------------------------------------------------------------
  const torchPositions = [
    { x: 18, y: 2.2, z: -3 },
    { x: 18, y: 2.2, z: 3 },
    { x: 38, y: 2.2, z: -3 },
    { x: 38, y: 2.2, z: 3 },
    { x: 50, y: 2.2, z: -3.5 },
    { x: 50, y: 2.2, z: 3.5 },
    { x: 58, y: 2.2, z: -3 },
    { x: 58, y: 2.2, z: 3 },
    { x: 78, y: 2.2, z: -3 },
    { x: 78, y: 2.2, z: 3 },
    { x: 88, y: 2.2, z: -3.5 },
    { x: 88, y: 2.2, z: 3.5 },
  ];

  const torchLights: THREE.PointLight[] = [];

  for (const tp of torchPositions) {
    // Sconce mesh
    const sconceGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.5, 8);
    const sconce = new THREE.Mesh(sconceGeo, woodMat);
    sconce.position.set(tp.x, tp.y, tp.z);
    sconce.rotation.z = Math.PI / 6;
    scene.add(sconce);

    // Torch flame light
    const pLight = new THREE.PointLight(0xf59e0b, 1.8, 7, 1.5);
    pLight.position.set(tp.x, tp.y + 0.3, tp.z);
    pLight.castShadow = true;
    pLight.shadow.bias = -0.002;
    scene.add(pLight);
    torchLights.push(pLight);
  }

  // Atmospheric Dust Particle Field
  const particleCount = 200;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = Math.random() * 95;
    particlePositions[i + 1] = Math.random() * 4.0;
    particlePositions[i + 2] = (Math.random() - 0.5) * 16;
  }

  particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xf59e0b,
    size: 0.08,
    transparent: true,
    opacity: 0.6,
  });
  const dustParticles = new THREE.Points(particleGeo, particleMat);
  scene.add(dustParticles);

  // Animated Props update function
  const animatedProps = {
    update: (dt: number, time: number) => {
      // Rotate and float Steatite Seal in Area 5
      sealGroup.rotation.y = time * 0.8;
      sealGroup.position.y = 1.5 + Math.sin(time * 2.0) * 0.1;

      // Animate Torchlight Flickering
      torchLights.forEach((light, i) => {
        const flicker = Math.sin(time * 8 + i * 2) * 0.2 + 0.8;
        light.intensity = 1.8 * flicker;
      });

      // Animate Gate 1 sliding down if open
      const symGate = gates["symbol_gate"];
      if (symGate && symGate.isOpen && symGate.progress < 1) {
        symGate.progress = Math.min(1, symGate.progress + dt * 1.2);
        if (symGate.doorMesh) {
          symGate.doorMesh.position.y = 1.9 - symGate.progress * 3.6;
        }
      }

      // Animate drifting dust motes
      const posAttr = particleGeo.getAttribute("position") as THREE.BufferAttribute | undefined;
      if (posAttr) {
        const array = posAttr.array as Float32Array;
        for (let i = 0; i < particleCount * 3; i += 3) {
          const currentY = array[i + 1] ?? 0;
          const currentX = array[i] ?? 0;
          array[i + 1] = currentY + Math.sin(time + currentX) * 0.002;
          if ((array[i + 1] ?? 0) > 4.0) {
            array[i + 1] = 0.2;
          }
        }
        posAttr.needsUpdate = true;
      }
    },
  };

  return {
    scene,
    colliders,
    interactiveEntities,
    gates,
    animatedProps,
    sealMesh: sealGroup,
  };
}
