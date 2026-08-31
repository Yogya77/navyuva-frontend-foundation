import * as THREE from "three";

/**
 * Creates high-fidelity procedural Harappan brick texture with individual brick variation,
 * surface grit, weathered mortar relief, and subtle edge chipping.
 */
function createBrickTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  // Deep kiln-fired mortar base
  ctx.fillStyle = "#3a1d0e";
  ctx.fillRect(0, 0, 1024, 1024);

  const rowH = 64;
  const brickW = 128;

  for (let y = 0; y < 1024; y += rowH) {
    const isOffset = (y / rowH) % 2 === 1;
    const startX = isOffset ? -brickW / 2 : 0;

    for (let x = startX; x < 1024 + brickW; x += brickW) {
      // Authentic Mature Harappan baked brick tones (1:2:4 ratio)
      const r = Math.random();
      if (r > 0.65)
        ctx.fillStyle = "#cf5d2c"; // Vibrant fired terracotta
      else if (r > 0.35)
        ctx.fillStyle = "#b64e22"; // Warm baked earth
      else ctx.fillStyle = "#963a14"; // Deep kiln-fired clay

      // Draw brick body with rounded weathered corners
      ctx.beginPath();
      ctx.roundRect(x + 4, y + 4, brickW - 8, rowH - 8, 4);
      ctx.fill();

      // Subtle surface noise, chips, and grain
      ctx.fillStyle = "rgba(0, 0, 0, 0.14)";
      for (let i = 0; i < 8; i++) {
        ctx.fillRect(
          x + 6 + Math.random() * (brickW - 20),
          y + 6 + Math.random() * (rowH - 20),
          Math.random() * 12 + 3,
          Math.random() * 5 + 2,
        );
      }

      // Warm highlight on top edge of brick
      ctx.fillStyle = "rgba(255, 230, 190, 0.16)";
      ctx.fillRect(x + 5, y + 5, brickW - 10, 3);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Creates a procedural bump map for Harappan brickwork depth.
 */
function createBrickBumpMap(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#222222"; // Recessed mortar
  ctx.fillRect(0, 0, 512, 512);

  const rowH = 32;
  const brickW = 64;

  for (let y = 0; y < 512; y += rowH) {
    const isOffset = (y / rowH) % 2 === 1;
    const startX = isOffset ? -brickW / 2 : 0;

    for (let x = startX; x < 512 + brickW; x += brickW) {
      ctx.fillStyle = "#dddddd"; // Elevated brick surface
      ctx.fillRect(x + 2, y + 2, brickW - 4, rowH - 4);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Creates high-detail procedural terrain texture with alluvial silt, sand ripples, and grit.
 */
function createTerrainTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#dfb07b"; // Warm alluvial sand
  ctx.fillRect(0, 0, 1024, 1024);

  // Organic soil layers and silt deposits
  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const r = Math.random() * 5 + 1;
    ctx.fillStyle = Math.random() > 0.5 ? "rgba(180, 125, 75, 0.24)" : "rgba(248, 212, 160, 0.28)";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Desert wind ripples
  ctx.fillStyle = "rgba(195, 145, 95, 0.08)";
  for (let y = 0; y < 1024; y += 16) {
    ctx.fillRect(0, y, 1024, 6);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Creates a rich cinematic sky dome texture with deep azure zenith,
 * atmospheric cerulean blue, soft sun glow disk, and volumetric-style cumulus clouds.
 */
export function createSkyDomeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  // 1. Rich Atmospheric Daytime Gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 1024);
  grad.addColorStop(0, "#195bb5"); // Deep rich cerulean zenith
  grad.addColorStop(0.35, "#3d8fe0"); // Vibrant sky blue
  grad.addColorStop(0.65, "#78b8f2"); // Soft atmospheric light blue
  grad.addColorStop(0.85, "#f7d3a8"); // Warm golden amber horizon band
  grad.addColorStop(1.0, "#e8be8b"); // Alluvial desert haze

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 2048, 1024);

  // 2. Visible Warm Sun Corona Glow in the Sky
  const sunX = 620;
  const sunY = 320;
  const sunGlow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 340);
  sunGlow.addColorStop(0, "rgba(255, 252, 235, 0.95)");
  sunGlow.addColorStop(0.15, "rgba(255, 235, 180, 0.65)");
  sunGlow.addColorStop(0.45, "rgba(255, 210, 140, 0.25)");
  sunGlow.addColorStop(1.0, "rgba(255, 200, 120, 0)");

  ctx.fillStyle = sunGlow;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 340, 0, Math.PI * 2);
  ctx.fill();

  // Sharp sun disk core
  ctx.fillStyle = "rgba(255, 255, 250, 0.98)";
  ctx.beginPath();
  ctx.arc(sunX, sunY, 28, 0, Math.PI * 2);
  ctx.fill();

  // 3. Volumetric-looking Soft Cumulus Cloud Clusters
  // Multi-pass puff drawing with shaded undersides and sun-highlighted tops
  const cloudClusters = [
    { cx: 350, cy: 380, count: 24, scale: 95 },
    { cx: 850, cy: 440, count: 32, scale: 110 },
    { cx: 1350, cy: 360, count: 28, scale: 100 },
    { cx: 1800, cy: 420, count: 30, scale: 105 },
    { cx: 100, cy: 480, count: 20, scale: 85 },
    { cx: 1100, cy: 520, count: 22, scale: 90 },
    { cx: 1600, cy: 500, count: 26, scale: 95 },
  ];

  for (const cluster of cloudClusters) {
    // Under-layer shadow
    ctx.fillStyle = "rgba(165, 190, 215, 0.28)";
    for (let p = 0; p < cluster.count; p++) {
      const px = cluster.cx + (Math.random() - 0.5) * cluster.scale * 3.2;
      const py = cluster.cy + 18 + Math.random() * cluster.scale * 0.5;
      const r = cluster.scale * (0.45 + Math.random() * 0.45);
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Mid-layer cloud body (soft white)
    ctx.fillStyle = "rgba(255, 255, 255, 0.62)";
    for (let p = 0; p < cluster.count; p++) {
      const px = cluster.cx + (Math.random() - 0.5) * cluster.scale * 2.8;
      const py = cluster.cy + (Math.random() - 0.5) * cluster.scale * 0.6;
      const r = cluster.scale * (0.4 + Math.random() * 0.45);
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Top sun-highlighted crests
    ctx.fillStyle = "rgba(255, 253, 245, 0.85)";
    for (let p = 0; p < Math.floor(cluster.count * 0.6); p++) {
      const px = cluster.cx + (Math.random() - 0.5) * cluster.scale * 2.2;
      const py = cluster.cy - 16 + (Math.random() - 0.5) * cluster.scale * 0.4;
      const r = cluster.scale * (0.35 + Math.random() * 0.35);
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export interface StylizedMaterialPalette {
  brick: THREE.MeshStandardMaterial;
  brickDark: THREE.MeshStandardMaterial;
  wallCap: THREE.MeshStandardMaterial;
  sandFloor: THREE.MeshStandardMaterial;
  stoneFloor: THREE.MeshStandardMaterial;
  grassTuft: THREE.MeshStandardMaterial;
  grassTuftDry: THREE.MeshStandardMaterial;
  rockStone: THREE.MeshStandardMaterial;
  terracottaPot: THREE.MeshStandardMaterial;
  woodPlank: THREE.MeshStandardMaterial;
  goldBrass: THREE.MeshStandardMaterial;
  steatiteSeal: THREE.MeshStandardMaterial;
  water: THREE.MeshStandardMaterial;
  clothTent: THREE.MeshStandardMaterial;
  clothTrim: THREE.MeshStandardMaterial;
  foliage: THREE.MeshStandardMaterial;
  foliageDark: THREE.MeshStandardMaterial;
  torchWood: THREE.MeshStandardMaterial;
  skyDome: THREE.MeshBasicMaterial;
}

export function createStylizedMaterials(): StylizedMaterialPalette {
  const brickTex = createBrickTexture();
  brickTex.repeat.set(4, 4);

  const brickBump = createBrickBumpMap();
  brickBump.repeat.set(4, 4);

  const sandTex = createTerrainTexture();
  sandTex.repeat.set(12, 12);

  const stoneTex = createBrickTexture();
  stoneTex.repeat.set(8, 8);

  const skyTex = createSkyDomeTexture();

  return {
    brick: new THREE.MeshStandardMaterial({
      map: brickTex,
      bumpMap: brickBump,
      bumpScale: 0.04,
      color: 0xc86438,
      roughness: 0.72,
      metalness: 0.04,
    }),
    brickDark: new THREE.MeshStandardMaterial({
      map: brickTex,
      bumpMap: brickBump,
      bumpScale: 0.05,
      color: 0x8a3c1e,
      roughness: 0.8,
      metalness: 0.05,
    }),
    wallCap: new THREE.MeshStandardMaterial({
      color: 0xdf9259,
      roughness: 0.62,
      metalness: 0.05,
    }),
    sandFloor: new THREE.MeshStandardMaterial({
      map: sandTex,
      color: 0xd9ab78,
      roughness: 0.88,
    }),
    stoneFloor: new THREE.MeshStandardMaterial({
      map: stoneTex,
      bumpMap: brickBump,
      bumpScale: 0.03,
      color: 0x8a6245,
      roughness: 0.75,
    }),
    grassTuft: new THREE.MeshStandardMaterial({
      color: 0x6e963b,
      roughness: 0.85,
      side: THREE.DoubleSide,
    }),
    grassTuftDry: new THREE.MeshStandardMaterial({
      color: 0xa8934a, // Sun-baked golden savannah grass
      roughness: 0.9,
      side: THREE.DoubleSide,
    }),
    rockStone: new THREE.MeshStandardMaterial({
      color: 0x9c7a5c,
      roughness: 0.82,
      metalness: 0.06,
    }),
    terracottaPot: new THREE.MeshStandardMaterial({
      color: 0xd95c2b,
      roughness: 0.55,
      metalness: 0.08,
    }),
    woodPlank: new THREE.MeshStandardMaterial({
      color: 0x6d4427,
      roughness: 0.75,
    }),
    goldBrass: new THREE.MeshStandardMaterial({
      color: 0xe8b843,
      roughness: 0.3,
      metalness: 0.85,
    }),
    steatiteSeal: new THREE.MeshStandardMaterial({
      color: 0xf6f0dd, // Vitrified white enstatite soapstone
      roughness: 0.16,
      metalness: 0.12,
    }),
    water: new THREE.MeshStandardMaterial({
      color: 0x2496be,
      roughness: 0.06,
      metalness: 0.28,
      transparent: true,
      opacity: 0.84,
    }),
    clothTent: new THREE.MeshStandardMaterial({
      color: 0xf8f2e4, // Natural woven linen canvas
      roughness: 0.85,
      side: THREE.DoubleSide,
    }),
    clothTrim: new THREE.MeshStandardMaterial({
      color: 0xb8382b, // Harappan crimson madder dye
      roughness: 0.85,
      side: THREE.DoubleSide,
    }),
    foliage: new THREE.MeshStandardMaterial({
      color: 0x588c3f, // Lush palm green
      roughness: 0.62,
      side: THREE.DoubleSide,
    }),
    foliageDark: new THREE.MeshStandardMaterial({
      color: 0x3d6628,
      roughness: 0.68,
      side: THREE.DoubleSide,
    }),
    torchWood: new THREE.MeshStandardMaterial({
      color: 0x3d2716,
      roughness: 0.9,
    }),
    skyDome: new THREE.MeshBasicMaterial({
      map: skyTex,
      side: THREE.BackSide,
      fog: false,
    }),
  };
}
