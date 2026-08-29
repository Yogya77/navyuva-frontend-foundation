import * as THREE from "three";

// ─────────────────────────────────────────────────────────────────────────────
// VFX SYSTEM — Magical particles, rune glows, activation pulses
// All lightweight: Points geometry, emissive planes, scale-tweened rings
// ─────────────────────────────────────────────────────────────────────────────

// ─── FLOATING DUST PARTICLES ──────────────────────────────────────────────────
export interface DustSystem {
  points: THREE.Points;
  update: (dt: number, time: number) => void;
}

export function createFloatingDust(count = 220, bounds = 28): DustSystem {
  const positions = new Float32Array(count * 3);
  const speeds    = new Float32Array(count);
  const offsets   = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * bounds;
    positions[i * 3 + 1] = Math.random() * 6.5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * bounds;
    speeds[i]   = 0.06 + Math.random() * 0.10;
    offsets[i]  = Math.random() * Math.PI * 2;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    color: 0xffe4bb,
    size: 0.065,
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;

  const update = (dt: number, time: number) => {
    const pos = geo.attributes["position"] as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const sp  = (speeds[i]  as number | undefined) ?? 0;
      const off = (offsets[i] as number | undefined) ?? 0;
      const y  = (arr[i * 3 + 1] as number | undefined) ?? 0;
      const x  = (arr[i * 3]     as number | undefined) ?? 0;
      arr[i * 3 + 1] = y + sp * dt;
      arr[i * 3]     = x + Math.sin(time * 0.4 + off) * 0.003;
      if (arr[i * 3 + 1]! > 7.5) {
        arr[i * 3 + 1] = 0;
        arr[i * 3]     = (Math.random() - 0.5) * bounds;
        arr[i * 3 + 2] = (Math.random() - 0.5) * bounds;
      }
    }
    pos.needsUpdate = true;
  };

  return { points, update };
}

// ─── MAGICAL RUNE GLOW ────────────────────────────────────────────────────────
export interface RuneGlow {
  group: THREE.Group;
  activate: () => void;
  update: (time: number) => void;
}

export function createRuneGlow(
  x: number,
  y: number,
  z: number,
  rotY = 0,
  color: THREE.ColorRepresentation = 0x00cccc,
): RuneGlow {
  const group = new THREE.Group();
  group.position.set(x, y, z);
  group.rotation.y = rotY;

  const runeMat = new THREE.MeshStandardMaterial({
    color,
    emissive: new THREE.Color(color),
    emissiveIntensity: 0.4,   // dim by default — activates to 3.5
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  // Outer ring
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.025, 8, 32), runeMat);
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  // Inner symbol (simplified Harappan-style cross + circle)
  const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.022, 0.028), runeMat);
  group.add(crossH);
  const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.52, 0.028), runeMat);
  group.add(crossV);
  const innerCircle = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.018, 8, 24), runeMat);
  innerCircle.rotation.x = Math.PI / 2;
  group.add(innerCircle);

  // Soft glow halo plane
  const haloMat = new THREE.MeshStandardMaterial({
    color,
    emissive: new THREE.Color(color),
    emissiveIntensity: 0.3,
    transparent: true,
    opacity: 0.12,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const halo = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), haloMat);
  group.add(halo);

  let isActive = false;
  let activationTime = 0;

  const activate = () => {
    isActive = true;
    activationTime = 0;
  };

  const update = (time: number) => {
    if (isActive) {
      activationTime += 0.016;
      const t = Math.min(activationTime * 1.5, 1);
      runeMat.emissiveIntensity = THREE.MathUtils.lerp(0.4, 3.5, t);
      haloMat.emissiveIntensity = THREE.MathUtils.lerp(0.3, 1.8, t);
      haloMat.opacity = THREE.MathUtils.lerp(0.12, 0.35, t);
    }
    // Slow rotation + pulse
    group.rotation.z = time * 0.22;
    const pulse = Math.sin(time * 2.4) * 0.18;
    if (isActive) runeMat.emissiveIntensity = 3.5 + pulse;
  };

  return { group, activate, update };
}

// ─── ACTIVATION PULSE RING ────────────────────────────────────────────────────
export interface ActivationPulse {
  mesh: THREE.Object3D;
  trigger: (x: number, y: number, z: number) => void;
  update: (dt: number) => void;
}

export function createActivationPulse(
  color: THREE.ColorRepresentation = 0x00dddd,
): ActivationPulse {
  const group = new THREE.Group();
  const pulseMat = new THREE.MeshStandardMaterial({
    color,
    emissive: new THREE.Color(color),
    emissiveIntensity: 3.0,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.04, 8, 48), pulseMat);
  mesh.rotation.x = Math.PI / 2;
  group.add(mesh);
  const echoMat = pulseMat.clone();
  echoMat.color.setHex(0xffbd5a);
  echoMat.emissive.setHex(0xff7a22);
  const echo = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.022, 8, 48), echoMat);
  echo.rotation.x = Math.PI / 2;
  group.add(echo);
  const coreLight = new THREE.PointLight(color, 0, 7, 2);
  coreLight.position.y = 0.4;
  group.add(coreLight);
  group.visible = false;

  let active = false;
  let progress = 0;

  const trigger = (x: number, y: number, z: number) => {
    group.position.set(x, y + 0.05, z);
    group.visible = true;
    mesh.scale.setScalar(0.2);
    echo.scale.setScalar(0.08);
    pulseMat.opacity = 0.95;
    echoMat.opacity = 0.75;
    coreLight.intensity = 4.5;
    active = true;
    progress = 0;
  };

  const update = (dt: number) => {
    if (!active) return;
    progress += dt * 1.6;
    mesh.scale.setScalar(0.2 + progress * 2.8);
    echo.scale.setScalar(0.08 + progress * 4.6);
    echo.rotation.z -= dt * 1.8;
    pulseMat.opacity = Math.max(0, 0.95 - progress);
    echoMat.opacity = Math.max(0, 0.75 - progress * 0.78);
    coreLight.intensity = Math.max(0, 4.5 - progress * 4.5);
    if (progress >= 1) {
      active = false;
      group.visible = false;
    }
  };

  return { mesh: group, trigger, update };
}

// ─── MAGICAL PORTAL (for Level 3 final chamber) ────────────────────────────────
export interface MagicalPortal {
  group: THREE.Group;
  update: (time: number, charge?: number, reveal?: number) => void;
}

export function createMagicalPortal(x: number, y: number, z: number): MagicalPortal {
  const group = new THREE.Group();
  group.position.set(x, y, z);

  // Outer stone arch ring
  const archMat = new THREE.MeshStandardMaterial({ color: 0x6b5030, roughness: 0.85 });
  const archOuter = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.22, 10, 40), archMat);
  archOuter.castShadow = true;
  group.add(archOuter);

  // A procedural energy surface gives the portal movement and depth without a
  // render target or post-processing pass. It is deliberately one low-poly disc.
  const portalMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uCharge: { value: 0 },
      uReveal: { value: 0 },
    },
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `varying vec2 vUv; uniform float uTime; uniform float uCharge; uniform float uReveal;
      void main() {
        vec2 p = vUv - 0.5; float r = length(p); float a = atan(p.y, p.x);
        float spiral = sin(a * 7.0 - r * 19.0 - uTime * (2.4 + uCharge * 1.8));
        float ripples = sin(r * 28.0 - uTime * 3.2 + spiral * 1.8);
        float edge = smoothstep(0.52, 0.08, r) * smoothstep(0.62, 0.34, r);
        float veins = smoothstep(0.2, 0.92, spiral * 0.5 + ripples * 0.5 + 0.5);
        vec3 deep = vec3(0.005, 0.045, 0.075);
        vec3 cyan = vec3(0.02, 0.72, 0.9);
        vec3 gold = vec3(1.0, 0.42, 0.08);
        vec3 color = mix(deep, cyan, veins * (0.45 + uCharge * 0.3));
        color = mix(color, gold, uReveal * (0.18 + veins * 0.34));
        float alpha = edge * (0.62 + veins * 0.25 + uCharge * 0.12);
        gl_FragColor = vec4(color, alpha);
      }`,
  });
  const portalDisc = new THREE.Mesh(new THREE.CircleGeometry(1.65, 40), portalMat);
  group.add(portalDisc);

  // Two concentric particle streams make the vortex read at a distance while
  // staying below the cost of dozens of individual meshes.
  const particleCount = 96;
  const particlePositions = new Float32Array(particleCount * 3);
  const particleSeeds = new Float32Array(particleCount * 2);
  for (let i = 0; i < particleCount; i++) {
    particleSeeds[i * 2] = Math.random() * Math.PI * 2;
    particleSeeds[i * 2 + 1] = 0.2 + Math.random() * 1.5;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x7ffcff,
    size: 0.075,
    transparent: true,
    opacity: 0.78,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  particles.frustumCulled = false;
  group.add(particles);

  // Rotating inner rune ring
  const runeRingMat = new THREE.MeshStandardMaterial({
    color: 0x00ccdd,
    emissive: new THREE.Color(0x00aacc),
    emissiveIntensity: 3.0,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
  });
  const runeRingInner = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.028, 8, 36), runeRingMat);
  group.add(runeRingInner);
  const runeRingOuter = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.018, 8, 36), runeRingMat);
  group.add(runeRingOuter);

  // Portal light
  const portalLight = new THREE.PointLight(0x00aacc, 2.8, 10, 1.5);
  group.add(portalLight);

  const update = (time: number, charge = 0, reveal = 0) => {
    runeRingInner.rotation.z =  time * 0.55;
    runeRingOuter.rotation.z = -time * 0.38;
    if (portalMat.uniforms["uTime"]) portalMat.uniforms["uTime"].value = time;
    if (portalMat.uniforms["uCharge"]) portalMat.uniforms["uCharge"].value = charge;
    if (portalMat.uniforms["uReveal"]) portalMat.uniforms["uReveal"].value = reveal;
    runeRingMat.emissiveIntensity = 2.5 + charge * 2.0 + Math.sin(time * 1.7) * 0.6;
    portalLight.intensity = 2.4 + charge * 2.0 + reveal * 1.8 + Math.sin(time * 2.1) * 0.6;
    const positions = particleGeo.attributes["position"] as THREE.BufferAttribute;
    const values = positions.array as Float32Array;
    const speed = 0.8 + charge * 1.4 + reveal * 0.8;
    for (let i = 0; i < particleCount; i++) {
      const seed = particleSeeds[i * 2]!;
      const radius = particleSeeds[i * 2 + 1]!;
      const angle = seed + time * speed * (0.75 + radius * 0.2);
      const contraction = 0.72 + 0.28 * Math.sin(time * 0.8 + seed);
      values[i * 3] = Math.cos(angle) * radius * contraction;
      values[i * 3 + 1] = Math.sin(angle * 1.7 + time) * 0.8;
      values[i * 3 + 2] = Math.sin(angle) * radius * contraction + 0.05;
    }
    positions.needsUpdate = true;
    particleMat.opacity = 0.48 + charge * 0.22 + reveal * 0.15;
  };

  return { group, update };
}
