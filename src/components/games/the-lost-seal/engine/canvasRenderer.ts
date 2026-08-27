import type { PlayerState, CameraState, InteractiveEntity, DustParticle, GateState } from "./types";
import { WORLD_WIDTH, WORLD_HEIGHT, COLLISION_WALLS, WORLD_TORCHES } from "./worldData";

export function renderWorld(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  player: PlayerState,
  camera: CameraState,
  entities: InteractiveEntity[],
  particles: DustParticle[],
  gates: Record<string, GateState>,
  nearbyEntity: InteractiveEntity | null,
  gameTime: number,
) {
  // Clear canvas
  ctx.fillStyle = "#0c0806";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.save();
  // Apply Camera Translation
  ctx.translate(-camera.x, -camera.y);

  // -------------------------------------------------------------
  // 1. FLOOR & GROUND LAYER (Baked-Brick Paving & Sandstone Terrain)
  // -------------------------------------------------------------
  renderFloor(ctx);

  // -------------------------------------------------------------
  // 2. WALLS & ARCHITECTURAL MASONRY (2.5D Raised Structures)
  // -------------------------------------------------------------
  renderWalls(ctx, gates);

  // -------------------------------------------------------------
  // 3. INTERACTIVE WORLD OBJECTS
  // -------------------------------------------------------------
  renderEntities(ctx, entities, gameTime);

  // -------------------------------------------------------------
  // 4. PLAYER CHARACTER
  // -------------------------------------------------------------
  renderPlayer(ctx, player);

  // -------------------------------------------------------------
  // 5. ATMOSPHERIC PARTICLES (Dust Motes & Sparks)
  // -------------------------------------------------------------
  renderParticles(ctx, particles);

  // -------------------------------------------------------------
  // 6. DYNAMIC TORCHLIGHTS & AMBIENT SHADOWS
  // -------------------------------------------------------------
  renderLighting(ctx, canvasWidth, canvasHeight, camera, gameTime);

  // -------------------------------------------------------------
  // 7. PROXIMITY INTERACTION PROMPT
  // -------------------------------------------------------------
  if (nearbyEntity) {
    renderInteractionPrompt(ctx, nearbyEntity, gameTime);
  }

  ctx.restore();

  // -------------------------------------------------------------
  // 8. SCREEN-SPACE MINI-MAP RADAR (Top-Right Corner)
  // -------------------------------------------------------------
  renderMiniMap(ctx, canvasWidth, canvasHeight, player, entities, gates);
}

function renderFloor(ctx: CanvasRenderingContext2D) {
  // Base Sandstone Earth Ground
  ctx.fillStyle = "#1c140e";
  ctx.fillRect(80, 320, WORLD_WIDTH - 160, 760);

  // Area 1: Ancient Entrance Gate (Paved Approach)
  ctx.fillStyle = "#251b13";
  ctx.fillRect(80, 320, 360, 760);

  // Area 2: Excavation Courtyard (Excavated trench silt & earth)
  ctx.fillStyle = "#2a1e15";
  ctx.fillRect(480, 320, 460, 760);

  // Trench cuts in Area 2
  ctx.fillStyle = "#18100a";
  ctx.fillRect(560, 480, 240, 200);
  ctx.strokeStyle = "#451a03";
  ctx.lineWidth = 3;
  ctx.strokeRect(560, 480, 240, 200);

  // Harappan Drainage Channel (Signature civic engineering feature along the main corridor)
  ctx.fillStyle = "#120c08";
  ctx.fillRect(200, 690, 1800, 20);
  ctx.strokeStyle = "rgba(180, 115, 60, 0.4)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(200, 690, 1800, 20);

  // Area 3: Symbol Hall (Polished Colonnade Floor)
  ctx.fillStyle = "#22170f";
  ctx.fillRect(980, 320, 460, 760);

  // Area 4: Merchant Storage Vault (Brick flagged flooring)
  ctx.fillStyle = "#261a11";
  ctx.fillRect(1480, 320, 460, 760);

  // Area 5: Sealed Chamber / Inner Sanctum (Ornate sacred flagstones)
  ctx.fillStyle = "#1d1209";
  ctx.fillRect(1980, 320, 340, 760);

  // Subtle Harappan brick grid lines (1:2:4 ratio)
  ctx.strokeStyle = "rgba(180, 115, 60, 0.08)";
  ctx.lineWidth = 1;
  for (let x = 80; x < WORLD_WIDTH - 80; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 320);
    ctx.lineTo(x, 1080);
    ctx.stroke();
  }
  for (let y = 320; y < 1080; y += 24) {
    ctx.beginPath();
    ctx.moveTo(80, y);
    ctx.lineTo(WORLD_WIDTH - 80, y);
    ctx.stroke();
  }

  // Zone Names inscribed into the floor
  ctx.font = "bold 13px Cinzel, Georgia, serif";
  ctx.fillStyle = "rgba(217, 119, 6, 0.25)";
  ctx.textAlign = "center";
  ctx.fillText("AREA 1 • ANCIENT ENTRANCE GATE", 260, 360);
  ctx.fillText("AREA 2 • EXCAVATION COURTYARD", 710, 360);
  ctx.fillText("AREA 3 • SYMBOL HALL", 1210, 360);
  ctx.fillText("AREA 4 • MERCHANT STORAGE", 1710, 360);
  ctx.fillText("AREA 5 • SEALED SANCTUM", 2150, 360);
}

function renderWalls(ctx: CanvasRenderingContext2D, gates: Record<string, GateState>) {
  // Draw solid collision walls with 2.5D depth
  for (const wall of COLLISION_WALLS) {
    // Cast shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
    ctx.fillRect(wall.x + 6, wall.y + 6, wall.w, wall.h);

    // Wall base / side brickwork
    ctx.fillStyle = "#451a03";
    ctx.fillRect(wall.x, wall.y, wall.w, wall.h);

    // Wall top surface (highlighted sandstone)
    ctx.fillStyle = "#78350f";
    ctx.fillRect(wall.x, wall.y, wall.w, Math.min(18, wall.h));

    // Brick cap highlight
    ctx.strokeStyle = "#92400e";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(wall.x, wall.y, wall.w, wall.h);
  }

  // Draw Gate 1: Symbol Gate (X: 1440, Y: 640-760)
  const symbolGate = gates["symbol_gate"];
  const gateOpenPercent = symbolGate?.progress ?? 0;
  const doorWidth = 40;
  const doorHeight = 60 * (1 - gateOpenPercent);

  if (doorHeight > 2) {
    // Upper sliding door leaf
    ctx.fillStyle = "#92400e";
    ctx.fillRect(1440, 640, doorWidth, doorHeight);
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.strokeRect(1440, 640, doorWidth, doorHeight);

    // Lower sliding door leaf
    ctx.fillStyle = "#92400e";
    ctx.fillRect(1440, 760 - doorHeight, doorWidth, doorHeight);
    ctx.strokeRect(1440, 760 - doorHeight, doorWidth, doorHeight);
  }
}

function renderEntities(
  ctx: CanvasRenderingContext2D,
  entities: InteractiveEntity[],
  gameTime: number,
) {
  for (const ent of entities) {
    ctx.save();
    ctx.translate(ent.x, ent.y);

    // Drop shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.beginPath();
    ctx.ellipse(0, ent.height / 3, ent.width / 2, ent.height / 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Floating pulsing indicator for uninspected entities
    if (!ent.isInspected) {
      const bob = Math.sin(gameTime * 4 + ent.x) * 4;
      ctx.fillStyle = "rgba(245, 158, 11, 0.2)";
      ctx.beginPath();
      ctx.arc(0, -ent.height / 2 + bob, 22, 0, Math.PI * 2);
      ctx.fill();
    }

    // Entity Icon / Physical Sprite
    ctx.font = `${ent.width * 0.75}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(ent.icon, 0, 0);

    // If Steatite Seal, draw sacred golden halo in Area 5
    if (ent.type === "steatite_seal") {
      const pulse = (Math.sin(gameTime * 3) + 1) * 0.5;
      ctx.strokeStyle = `rgba(245, 158, 11, ${0.4 + pulse * 0.4})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 36 + pulse * 6, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Small entity name label underneath
    ctx.font = "10px Inter, sans-serif";
    ctx.fillStyle = ent.isInspected ? "#10b981" : "#fef3c7";
    ctx.fillText(ent.name, 0, ent.height / 2 + 14);

    ctx.restore();
  }
}

function renderPlayer(ctx: CanvasRenderingContext2D, player: PlayerState) {
  ctx.save();
  ctx.translate(player.x, player.y);

  // Character drop shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
  ctx.beginPath();
  ctx.ellipse(0, 18, 16, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Walking leg bob offset
  const walkBob = player.isMoving ? Math.sin(player.animTimer * 12) * 3 : 0;
  const legSwing = player.isMoving ? Math.sin(player.animTimer * 12) * 6 : 0;

  // Legs / Boots
  ctx.fillStyle = "#78350f"; // Brown boots
  ctx.fillRect(-8 + legSwing, 8 + walkBob, 6, 12);
  ctx.fillRect(2 - legSwing, 8 + walkBob, 6, 12);

  // Torso / Archaeologist Safari Jacket
  ctx.fillStyle = "#d97706"; // Khaki/amber coat
  ctx.fillRect(-10, -10 + walkBob, 20, 20);
  ctx.strokeStyle = "#92400e";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-10, -10 + walkBob, 20, 20);

  // Field Satchel & Leather Strap
  ctx.strokeStyle = "#451a03";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-10, -8 + walkBob);
  ctx.lineTo(8, 10 + walkBob);
  ctx.stroke();

  // Head
  ctx.fillStyle = "#fde68a"; // Skin tone
  ctx.beginPath();
  ctx.arc(0, -18 + walkBob, 8, 0, Math.PI * 2);
  ctx.fill();

  // Explorer Hat (Pith / Fedora with wide brim)
  ctx.fillStyle = "#b45309";
  // Hat brim
  ctx.beginPath();
  ctx.ellipse(0, -22 + walkBob, 15, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  // Hat crown
  ctx.beginPath();
  ctx.ellipse(0, -25 + walkBob, 9, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Directional Facing indicator (Flashlight/Sight Beam)
  let beamAngle = 0;
  if (player.dir === "down") beamAngle = Math.PI / 2;
  else if (player.dir === "up") beamAngle = -Math.PI / 2;
  else if (player.dir === "left") beamAngle = Math.PI;
  else if (player.dir === "right") beamAngle = 0;

  const beamGradient = ctx.createRadialGradient(
    Math.cos(beamAngle) * 15,
    Math.sin(beamAngle) * 15,
    5,
    Math.cos(beamAngle) * 60,
    Math.sin(beamAngle) * 60,
    70,
  );
  beamGradient.addColorStop(0, "rgba(254, 240, 138, 0.35)");
  beamGradient.addColorStop(1, "rgba(254, 240, 138, 0)");

  ctx.fillStyle = beamGradient;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, 75, beamAngle - Math.PI / 5, beamAngle + Math.PI / 5);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function renderParticles(ctx: CanvasRenderingContext2D, particles: DustParticle[]) {
  for (const p of particles) {
    ctx.fillStyle = `rgba(245, 158, 11, ${p.alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function renderLighting(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  camera: CameraState,
  gameTime: number,
) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  for (const torch of WORLD_TORCHES) {
    if (
      torch.x < camera.x - 200 ||
      torch.x > camera.x + canvasWidth + 200 ||
      torch.y < camera.y - 200 ||
      torch.y > camera.y + canvasHeight + 200
    ) {
      continue;
    }

    const flicker = (Math.sin(gameTime * 10 + torch.x) + 1) * 0.08 + 0.92;
    const rad = torch.radius * flicker;

    const torchGrad = ctx.createRadialGradient(torch.x, torch.y, 10, torch.x, torch.y, rad);
    torchGrad.addColorStop(0, "rgba(251, 191, 36, 0.45)");
    torchGrad.addColorStop(0.5, "rgba(217, 119, 6, 0.2)");
    torchGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = torchGrad;
    ctx.beginPath();
    ctx.arc(torch.x, torch.y, rad, 0, Math.PI * 2);
    ctx.fill();

    // Torch flame particle
    ctx.fillStyle = "#fffbeb";
    ctx.beginPath();
    ctx.arc(torch.x, torch.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function renderInteractionPrompt(
  ctx: CanvasRenderingContext2D,
  entity: InteractiveEntity,
  gameTime: number,
) {
  ctx.save();
  ctx.translate(entity.x, entity.y - entity.height / 2 - 24);

  const bob = Math.sin(gameTime * 5) * 3;

  // Background badge
  ctx.fillStyle = "#000000";
  ctx.strokeStyle = "#f59e0b";
  ctx.lineWidth = 1.5;

  const text = `[E] ${entity.promptLabel}`;
  ctx.font = "bold 12px Inter, sans-serif";
  const metrics = ctx.measureText(text);
  const pad = 10;
  const w = metrics.width + pad * 2;
  const h = 24;

  ctx.beginPath();
  ctx.roundRect(-w / 2, -h / 2 + bob, w, h, 6);
  ctx.fill();
  ctx.stroke();

  // Text
  ctx.fillStyle = "#fbbf24";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 0, bob);

  ctx.restore();
}

function renderMiniMap(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  player: PlayerState,
  entities: InteractiveEntity[],
  gates: Record<string, GateState>,
) {
  // Screen-space mini-map HUD in top-right
  const mapW = 160;
  const mapH = 94;
  const margin = 12;
  const mapX = canvasWidth - mapW - margin;
  const mapY = margin;

  ctx.save();

  // Mini-map frame & background
  ctx.fillStyle = "rgba(12, 8, 6, 0.85)";
  ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(mapX, mapY, mapW, mapH, 8);
  ctx.fill();
  ctx.stroke();

  // Mini-map title
  ctx.font = "bold 8px Cinzel, serif";
  ctx.fillStyle = "#d97706";
  ctx.textAlign = "left";
  ctx.fillText("CITADEL RADAR", mapX + 8, mapY + 12);

  // Coordinate scales
  const scaleX = (mapW - 16) / WORLD_WIDTH;
  const scaleY = (mapH - 24) / (WORLD_HEIGHT - 320);

  // Draw walls in mini-map
  ctx.fillStyle = "rgba(180, 83, 9, 0.5)";
  for (const wall of COLLISION_WALLS) {
    const rx = mapX + 8 + wall.x * scaleX;
    const ry = mapY + 18 + (wall.y - 320) * scaleY;
    const rw = Math.max(1, wall.w * scaleX);
    const rh = Math.max(1, wall.h * scaleY);
    ctx.fillRect(rx, ry, rw, rh);
  }

  // Draw entities blips
  for (const ent of entities) {
    const ex = mapX + 8 + ent.x * scaleX;
    const ey = mapY + 18 + (ent.y - 320) * scaleY;
    ctx.fillStyle = ent.isInspected ? "#10b981" : "#f59e0b";
    ctx.beginPath();
    ctx.arc(ex, ey, ent.type === "steatite_seal" ? 3 : 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw Player dot (pulsing gold)
  const px = mapX + 8 + player.x * scaleX;
  const py = mapY + 18 + (player.y - 320) * scaleY;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(px, py, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#fbbf24";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.restore();
}
