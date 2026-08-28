import * as THREE from "three";

export interface StylizedPlayer {
  root: THREE.Group;
  lanternLight: THREE.SpotLight;
  lanternBulb: THREE.PointLight;
  updateAnimation: (dt: number, state: "idle" | "walk" | "run" | "jump" | "fall") => void;
  setHeading: (angleRad: number) => void;
}

export function createStylizedPlayer(): StylizedPlayer {
  const root = new THREE.Group();

  // ─── MATERIAL PALETTE ──────────────────────────────────────────────────────
  const skinMat   = new THREE.MeshStandardMaterial({ color: 0xf2c48a, roughness: 0.55 });
  const hairMat   = new THREE.MeshStandardMaterial({ color: 0x2a1a08, roughness: 0.9 });
  const coatMat   = new THREE.MeshStandardMaterial({ color: 0xb07828, roughness: 0.7 }); // warm khaki
  const vestMat   = new THREE.MeshStandardMaterial({ color: 0x8b5e20, roughness: 0.75 });
  const shirtMat  = new THREE.MeshStandardMaterial({ color: 0xe8dcc8, roughness: 0.85 });
  const pantsMat  = new THREE.MeshStandardMaterial({ color: 0x3e3020, roughness: 0.9 });
  const bootMat   = new THREE.MeshStandardMaterial({ color: 0x1e1008, roughness: 0.55, metalness: 0.1 });
  const beltMat   = new THREE.MeshStandardMaterial({ color: 0x4a2c10, roughness: 0.5 });
  const brassMat  = new THREE.MeshStandardMaterial({ color: 0xe0a830, roughness: 0.25, metalness: 0.85 });
  const hatMat    = new THREE.MeshStandardMaterial({ color: 0x8a5a20, roughness: 0.8 });
  const hatBandMat= new THREE.MeshStandardMaterial({ color: 0x2a1208, roughness: 0.6 });
  const satchelMat= new THREE.MeshStandardMaterial({ color: 0x5c3515, roughness: 0.6 });
  const cloakMat  = new THREE.MeshStandardMaterial({
    color: 0x1a0d2e,
    roughness: 0.9,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.92,
  });

  // Glowing cyan magical amulet — picked up by bloom pass
  const amuletMat = new THREE.MeshStandardMaterial({
    color: 0x00dddd,
    emissive: new THREE.Color(0x00cccc),
    emissiveIntensity: 2.8,
    roughness: 0.1,
    metalness: 0.6,
  });

  // ─── LEGS ──────────────────────────────────────────────────────────────────
  const leftLegPivot = new THREE.Group();
  leftLegPivot.position.set(-0.135, 0.78, 0);
  root.add(leftLegPivot);

  const rightLegPivot = new THREE.Group();
  rightLegPivot.position.set(0.135, 0.78, 0);
  root.add(rightLegPivot);

  for (const [pivot, side] of [[leftLegPivot, -1], [rightLegPivot, 1]] as [THREE.Group, number][]) {
    // Thigh
    const thigh = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.38, 0.17), pantsMat);
    thigh.position.y = -0.19;
    thigh.castShadow = true;
    pivot.add(thigh);
    // Knee pad (stylized detail)
    const kneePad = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.08, 0.16), beltMat);
    kneePad.position.set(0, -0.36, 0.02);
    pivot.add(kneePad);
    // Shin
    const shin = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.32, 0.15), pantsMat);
    shin.position.y = -0.54;
    shin.castShadow = true;
    pivot.add(shin);
    // Boot — tapered with slight front lift
    const boot = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.22, 0.27), bootMat);
    boot.position.set(0, -0.77, 0.02);
    boot.castShadow = true;
    pivot.add(boot);
    // Boot toe cap
    const toeCap = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.07, 0.08), brassMat);
    toeCap.position.set(0, -0.74, 0.14);
    pivot.add(toeCap);
    void side;
  }

  // ─── TORSO ─────────────────────────────────────────────────────────────────
  const upperBody = new THREE.Group();
  upperBody.position.y = 0.98;
  root.add(upperBody);

  // Shirt base
  const shirt = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.44, 0.24), shirtMat);
  shirt.position.y = 0.08;
  shirt.castShadow = true;
  upperBody.add(shirt);

  // Field coat (slightly larger, open front silhouette)
  const coat = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.50, 0.28), coatMat);
  coat.position.y = 0.09;
  coat.castShadow = true;
  upperBody.add(coat);

  // Vest overlay (dark center panel)
  const vest = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.48, 0.30), vestMat);
  vest.position.set(0, 0.09, 0);
  vest.castShadow = true;
  upperBody.add(vest);

  // Lapels
  for (const sx of [-0.1, 0.1]) {
    const lapel = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.24, 0.31), coatMat);
    lapel.position.set(sx, 0.26, 0);
    lapel.rotation.z = sx * -0.15;
    upperBody.add(lapel);
  }

  // Utility belt
  const belt = new THREE.Mesh(new THREE.BoxGeometry(0.47, 0.10, 0.30), beltMat);
  belt.position.set(0, -0.17, 0);
  belt.castShadow = true;
  upperBody.add(belt);

  // Belt buckle
  const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.09, 0.31), brassMat);
  buckle.position.set(0, -0.17, 0);
  upperBody.add(buckle);

  // Shoulder epaulettes
  for (const sx of [-0.24, 0.24]) {
    const ep = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.06, 0.24), coatMat);
    ep.position.set(sx, 0.36, 0);
    upperBody.add(ep);
    const epStrap = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.26), brassMat);
    epStrap.position.set(sx, 0.36, 0.02);
    upperBody.add(epStrap);
  }

  // Satchel on back
  const satchel = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.34, 0.14), satchelMat);
  satchel.position.set(0.06, 0.08, -0.22);
  satchel.castShadow = true;
  upperBody.add(satchel);
  const satchelFlap = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.14, 0.15), satchelMat);
  satchelFlap.position.set(0.06, 0.22, -0.22);
  upperBody.add(satchelFlap);
  const satchelBuckle = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.16), brassMat);
  satchelBuckle.position.set(0.06, 0.17, -0.22);
  upperBody.add(satchelBuckle);

  // Canteen flask on left hip
  const flask = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.13, 10), brassMat);
  flask.position.set(-0.25, -0.14, 0.05);
  flask.rotation.z = Math.PI / 10;
  flask.castShadow = true;
  upperBody.add(flask);

  // ─── MAGICAL AMULET (cyan emissive — glows with bloom) ─────────────────────
  const amuletGroup = new THREE.Group();
  amuletGroup.position.set(0, 0.18, 0.155); // Center chest
  upperBody.add(amuletGroup);

  // Outer ring
  const amuletRing = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.012, 8, 20), amuletMat);
  amuletGroup.add(amuletRing);
  // Inner crystal gem
  const amuletGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.034, 0), amuletMat);
  amuletGroup.add(amuletGem);
  // Glow halo (slightly larger transparent sphere for soft aura)
  const amuletGlowMat = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    emissive: new THREE.Color(0x00eeee),
    emissiveIntensity: 1.2,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
  });
  const amuletHalo = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), amuletGlowMat);
  amuletGroup.add(amuletHalo);

  // Amulet point light (very short range — subtle warm-cyan fill on chest)
  const amuletLight = new THREE.PointLight(0x00cccc, 0.6, 1.4, 2.0);
  amuletGroup.add(amuletLight);

  // ─── CLOAK (flowing dark cloth behind body) ────────────────────────────────
  // Built from 4 vertical strips so we can animate each independently
  const cloakGroup = new THREE.Group();
  cloakGroup.position.set(0, 0.22, -0.16);
  upperBody.add(cloakGroup);

  const cloakStrips: THREE.Mesh[] = [];
  const cloakStripPositions = [-0.18, -0.06, 0.06, 0.18];

  for (const cx of cloakStripPositions) {
    const stripGeo = new THREE.PlaneGeometry(0.14, 0.68, 1, 6);
    const strip = new THREE.Mesh(stripGeo, cloakMat);
    strip.position.set(cx, -0.34, 0);
    strip.castShadow = true;
    cloakGroup.add(strip);
    cloakStrips.push(strip);
  }

  // Cloak shoulder mantle (fixed, covers shoulder seam)
  const mantle = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.10, 0.06), cloakMat);
  mantle.position.set(0, 0.04, 0);
  cloakGroup.add(mantle);

  // ─── ARMS ──────────────────────────────────────────────────────────────────
  const leftArmPivot  = new THREE.Group();
  const rightArmPivot = new THREE.Group();
  leftArmPivot.position.set(-0.275, 0.32, 0);
  rightArmPivot.position.set(0.275, 0.32, 0);
  upperBody.add(leftArmPivot);
  upperBody.add(rightArmPivot);

  for (const [pivot, mat] of [[leftArmPivot, coatMat], [rightArmPivot, coatMat]] as [THREE.Group, THREE.MeshStandardMaterial][]) {
    const upper = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.30, 0.15), mat);
    upper.position.y = -0.15;
    upper.castShadow = true;
    pivot.add(upper);
    const forearm = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.28, 0.13), shirtMat);
    forearm.position.y = -0.40;
    forearm.castShadow = true;
    pivot.add(forearm);
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.058, 10, 10), skinMat);
    hand.scale.set(1, 0.85, 1.15);
    hand.position.y = -0.55;
    hand.castShadow = true;
    pivot.add(hand);
  }

  // Brass lantern on right hand
  const lanternGroup = new THREE.Group();
  lanternGroup.position.set(0, -0.58, 0.10);
  rightArmPivot.add(lanternGroup);

  const lanternBody = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.14, 8), brassMat);
  lanternBody.castShadow = true;
  lanternGroup.add(lanternBody);
  const lanternCap = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.08, 8), brassMat);
  lanternCap.position.y = 0.11;
  lanternGroup.add(lanternCap);
  const lanternGlassMat = new THREE.MeshStandardMaterial({
    color: 0xffe588,
    emissive: new THREE.Color(0xff9900),
    emissiveIntensity: 2.6,
    transparent: true,
    opacity: 0.65,
    depthWrite: false,
  });
  const lanternGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.10, 8), lanternGlassMat);
  lanternGroup.add(lanternGlass);

  const lanternBulb = new THREE.PointLight(0xffdf99, 1.8, 6.5, 1.5);
  lanternGroup.add(lanternBulb);

  const lanternLight = new THREE.SpotLight(0xfff5dd, 3.2, 18, Math.PI / 3.2, 0.4, 1.2);
  lanternLight.position.set(0, 0, 0.08);
  lanternLight.castShadow = true;
  lanternLight.shadow.bias = -0.001;
  lanternGroup.add(lanternLight);

  const lanternTarget = new THREE.Object3D();
  lanternTarget.position.set(0, -0.5, 5);
  lanternGroup.add(lanternTarget);
  lanternLight.target = lanternTarget;

  // ─── HEAD ──────────────────────────────────────────────────────────────────
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.47, 0);
  upperBody.add(headGroup);

  // Head — slightly flattened sphere for stylized look
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.175, 16, 16), skinMat);
  head.scale.set(1, 1.05, 0.95);
  head.position.y = 0.10;
  head.castShadow = true;
  headGroup.add(head);

  // Neck
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.10, 10), skinMat);
  neck.position.y = 0.02;
  headGroup.add(neck);

  // Hair — hemisphere cap
  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.185, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.52),
    hairMat
  );
  hair.position.y = 0.11;
  headGroup.add(hair);

  // Subtle brow ridge
  const brow = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.04, 0.06), hairMat);
  brow.position.set(0, 0.18, 0.15);
  headGroup.add(brow);

  // Fedora brim
  const hatBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.34, 0.022, 24), hatMat);
  hatBrim.position.set(0, 0.23, 0.015);
  hatBrim.rotation.x = -0.04;
  hatBrim.castShadow = true;
  headGroup.add(hatBrim);

  // Hat band
  const hatBand = new THREE.Mesh(new THREE.CylinderGeometry(0.198, 0.208, 0.042, 22), hatBandMat);
  hatBand.position.set(0, 0.255, 0.015);
  headGroup.add(hatBand);

  // Hat crown (wider, flatter, more cinematic fedora shape)
  const hatCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.165, 0.205, 0.165, 22), hatMat);
  hatCrown.position.set(0, 0.325, 0.015);
  hatCrown.castShadow = true;
  headGroup.add(hatCrown);

  // Hat feather decoration (small shard behind band)
  const feather = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.14, 0.06), new THREE.MeshStandardMaterial({ color: 0x334466, roughness: 0.8 }));
  feather.position.set(-0.17, 0.30, 0.01);
  feather.rotation.z = 0.3;
  headGroup.add(feather);

  // ─── ANIMATION ─────────────────────────────────────────────────────────────
  let animTimer = 0;
  let cloakTimer = 0;

  const updateAnimation = (dt: number, state: "idle" | "walk" | "run" | "jump" | "fall") => {
    if (state === "run") {
      animTimer += dt * 13.5;
      cloakTimer += dt * 12;
      const legStride = Math.sin(animTimer) * 0.88;
      leftLegPivot.rotation.x  =  legStride;
      rightLegPivot.rotation.x = -legStride;
      leftArmPivot.rotation.x  = -Math.sin(animTimer) * 0.72;
      rightArmPivot.rotation.x =  Math.sin(animTimer) * 0.50;
      upperBody.position.y = 0.98 + Math.abs(Math.sin(animTimer * 2)) * 0.058;
      upperBody.rotation.x = 0.14;
      // Cloak flares back during run
      cloakStrips.forEach((strip, i) => {
        strip.rotation.x = -0.55 - Math.sin(cloakTimer * 0.9 + i * 0.6) * 0.14;
        strip.position.z = Math.sin(cloakTimer * 1.1 + i * 0.5) * 0.04;
      });
      amuletGroup.rotation.y = Math.sin(animTimer * 0.7) * 0.25;
      amuletMat.emissiveIntensity = 2.8 + Math.sin(animTimer * 2) * 0.5;

    } else if (state === "walk") {
      animTimer += dt * 8;
      cloakTimer += dt * 6;
      const legStride = Math.sin(animTimer) * 0.58;
      leftLegPivot.rotation.x  =  legStride;
      rightLegPivot.rotation.x = -legStride;
      leftArmPivot.rotation.x  = -Math.sin(animTimer) * 0.46;
      rightArmPivot.rotation.x =  Math.sin(animTimer) * 0.32;
      upperBody.position.y = 0.98 + Math.abs(Math.sin(animTimer * 2)) * 0.026;
      upperBody.rotation.x = 0.035;
      // Cloak gentle sway
      cloakStrips.forEach((strip, i) => {
        strip.rotation.x = THREE.MathUtils.lerp(strip.rotation.x, -0.22 + Math.sin(cloakTimer + i * 0.8) * 0.08, 0.12);
      });
      amuletGroup.rotation.y = Math.sin(animTimer * 0.5) * 0.12;
      amuletMat.emissiveIntensity = 2.8;

    } else if (state === "jump") {
      leftLegPivot.rotation.x  = THREE.MathUtils.lerp(leftLegPivot.rotation.x,  -0.45, 0.18);
      rightLegPivot.rotation.x = THREE.MathUtils.lerp(rightLegPivot.rotation.x,  0.28, 0.18);
      leftArmPivot.rotation.x  = THREE.MathUtils.lerp(leftArmPivot.rotation.x,  -0.65, 0.18);
      rightArmPivot.rotation.x = THREE.MathUtils.lerp(rightArmPivot.rotation.x, -0.40, 0.18);
      upperBody.rotation.x = -0.08;
      cloakStrips.forEach(strip => {
        strip.rotation.x = THREE.MathUtils.lerp(strip.rotation.x, -0.7, 0.15);
      });
      amuletMat.emissiveIntensity = 3.8; // Pulse on jump

    } else if (state === "fall") {
      leftLegPivot.rotation.x  = THREE.MathUtils.lerp(leftLegPivot.rotation.x,  0.22, 0.10);
      rightLegPivot.rotation.x = THREE.MathUtils.lerp(rightLegPivot.rotation.x, -0.22, 0.10);
      leftArmPivot.rotation.x  = THREE.MathUtils.lerp(leftArmPivot.rotation.x,   0.5, 0.10);
      rightArmPivot.rotation.x = THREE.MathUtils.lerp(rightArmPivot.rotation.x,  0.5, 0.10);
      upperBody.rotation.x = 0.08;
      cloakStrips.forEach(strip => {
        strip.rotation.x = THREE.MathUtils.lerp(strip.rotation.x, 0.35, 0.10);
      });

    } else {
      // Idle — breathing + subtle sway
      animTimer += dt * 2.2;
      cloakTimer += dt * 1.4;

      const breath = Math.sin(animTimer) * 0.018;
      upperBody.position.y = 0.98 + breath;
      upperBody.rotation.x = Math.sin(animTimer * 0.5) * 0.008;

      leftLegPivot.rotation.x  = THREE.MathUtils.lerp(leftLegPivot.rotation.x,  0, 0.10);
      rightLegPivot.rotation.x = THREE.MathUtils.lerp(rightLegPivot.rotation.x, 0, 0.10);
      leftArmPivot.rotation.x  = THREE.MathUtils.lerp(leftArmPivot.rotation.x,  Math.sin(animTimer * 0.4) * 0.06, 0.06);
      rightArmPivot.rotation.x = THREE.MathUtils.lerp(rightArmPivot.rotation.x, Math.sin(animTimer * 0.4 + 1) * 0.04, 0.06);

      // Cloak settles with micro ripple
      cloakStrips.forEach((strip, i) => {
        strip.rotation.x = THREE.MathUtils.lerp(strip.rotation.x, -0.12 + Math.sin(cloakTimer + i * 1.2) * 0.04, 0.06);
      });

      // Amulet pulses during idle
      amuletMat.emissiveIntensity = 2.8 + Math.sin(animTimer * 1.8) * 0.6;
      amuletHalo.scale.setScalar(1 + Math.sin(animTimer * 1.8) * 0.12);
    }
  };

  const setHeading = (angleRad: number) => {
    root.rotation.y = angleRad;
  };

  return {
    root,
    lanternLight,
    lanternBulb,
    updateAnimation,
    setHeading,
  };
}
