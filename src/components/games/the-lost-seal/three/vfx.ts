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
  mesh: THREE.Mesh;
  trigger: (x: number, y: number, z: number) => void;
  update: (dt: number) => void;
}

export function createActivationPulse(
  color: THREE.ColorRepresentation = 0x00dddd,
): ActivationPulse {
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
  mesh.visible = false;

  let active = false;
  let progress = 0;

  const trigger = (x: number, y: number, z: number) => {
    mesh.position.set(x, y + 0.05, z);
    mesh.visible = true;
    mesh.scale.setScalar(0.2);
    pulseMat.opacity = 0.95;
    active = true;
    progress = 0;
  };

  const update = (dt: number) => {
    if (!active) return;
    progress += dt * 1.6;
    mesh.scale.setScalar(0.2 + progress * 2.8);
    pulseMat.opacity = Math.max(0, 0.95 - progress);
    if (progress >= 1) {
      active = false;
      mesh.visible = false;
    }
  };

  return { mesh, trigger, update };
}

// ─── MAGICAL PORTAL (for Level 3 final chamber) ────────────────────────────────
export interface MagicalPortal {
  group: THREE.Group;
  update: (time: number) => void;
}

export function createMagicalPortal(x: number, y: number, z: number): MagicalPortal {
  const group = new THREE.Group();
  group.position.set(x, y, z);

  // Outer stone arch ring
  const archMat = new THREE.MeshStandardMaterial({ color: 0x6b5030, roughness: 0.85 });
  const archOuter = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.22, 10, 40), archMat);
  archOuter.castShadow = true;
  group.add(archOuter);

  // Inner glowing portal disc
  const portalMat = new THREE.MeshStandardMaterial({
    color: 0x003344,
    emissive: new THREE.Color(0x007799),
    emissiveIntensity: 2.2,
    transparent: true,
    opacity: 0.82,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const portalDisc = new THREE.Mesh(new THREE.CircleGeometry(1.65, 40), portalMat);
  group.add(portalDisc);

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

  const update = (time: number) => {
    runeRingInner.rotation.z =  time * 0.55;
    runeRingOuter.rotation.z = -time * 0.38;
    portalMat.emissiveIntensity = 2.2 + Math.sin(time * 1.4) * 0.5;
    portalLight.intensity = 2.8 + Math.sin(time * 2.1) * 0.6;
  };

  return { group, update };
}
