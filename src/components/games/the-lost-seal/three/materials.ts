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
 * Creates a sky dome texture with azure zenith, warm golden horizon, and soft cloud bands.
 */
export function createSkyDomeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  // Atmospheric gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, "#2c7bd6"); // Deep azure zenith
  grad.addColorStop(0.4, "#68aae8"); // Atmospheric blue
  grad.addColorStop(0.75, "#f6cca0"); // Warm golden amber horizon
  grad.addColorStop(1.0, "#e4af76"); // Alluvial desert haze

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // Soft cumulus cloud wisps
  ctx.fillStyle = "rgba(255, 255, 255, 0.38)";
  for (let i = 0; i < 40; i++) {
    const cx = Math.random() * 1024;
    const cy = 100 + Math.random() * 200;
    const rad = 45 + Math.random() * 65;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.arc(cx + 40, cy - 12, rad * 0.75, 0, Math.PI * 2);
    ctx.arc(cx - 40, cy + 6, rad * 0.82, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
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
