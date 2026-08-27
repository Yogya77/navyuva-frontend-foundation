import { useState, useEffect, useRef, useCallback } from "react";
import type { PlayerState, CameraState, InteractiveEntity, DustParticle, GateState } from "./types";
import {
  WORLD_WIDTH,
  WORLD_HEIGHT,
  COLLISION_WALLS,
  INITIAL_INTERACTIVE_ENTITIES,
} from "./worldData";
import { renderWorld } from "./canvasRenderer";
import { soundEngine } from "./soundEffects";

interface UseLostSealEngineProps {
  onInteract: (entity: InteractiveEntity) => void;
  isModalOpen: boolean;
}

export function useLostSealEngine({ onInteract, isModalOpen }: UseLostSealEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Player State
  const playerRef = useRef<PlayerState>({
    x: 220,
    y: 700,
    vx: 0,
    vy: 0,
    speed: 4.4,
    dir: "right",
    isMoving: false,
    animFrame: 0,
    animTimer: 0,
    width: 28,
    height: 38,
  });

  // Camera State
  const cameraRef = useRef<CameraState>({
    x: 0,
    y: 0,
    viewportWidth: 960,
    viewportHeight: 560,
    targetX: 0,
    targetY: 0,
  });

  // World Entities & Gates State
  const entitiesRef = useRef<InteractiveEntity[]>(INITIAL_INTERACTIVE_ENTITIES);
  const gatesRef = useRef<Record<string, GateState>>({
    symbol_gate: { id: "symbol_gate", isOpen: false, progress: 0 },
    floor_cache: { id: "floor_cache", isOpen: false, progress: 0 },
  });

  // Particles
  const particlesRef = useRef<DustParticle[]>([]);
  const footstepTimerRef = useRef<number>(0);

  // Key tracking
  const keysRef = useRef<Record<string, boolean>>({});
  const nearbyEntityRef = useRef<InteractiveEntity | null>(null);
  const [nearbyEntityState, setNearbyEntityState] = useState<InteractiveEntity | null>(null);

  // Mark entity inspected
  const markEntityInspected = useCallback((entityId: string) => {
    entitiesRef.current = entitiesRef.current.map((ent) =>
      ent.id === entityId ? { ...ent, isInspected: true } : ent,
    );
  }, []);

  // Open a gate in the world
  const openGate = useCallback((gateId: string) => {
    if (gatesRef.current[gateId]) {
      gatesRef.current[gateId]!.isOpen = true;
      soundEngine.playStoneDoorOpen();
    }
  }, []);

  // Initialize Dust Particles and Ambience
  useEffect(() => {
    const list: DustParticle[] = [];
    for (let i = 0; i < 40; i++) {
      list.push({
        x: Math.random() * WORLD_WIDTH,
        y: 320 + Math.random() * 760,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2,
        life: Math.random() * 200,
        maxLife: 200 + Math.random() * 100,
      });
    }
    particlesRef.current = list;

    soundEngine.startAmbience();
    return () => {
      soundEngine.stopAmbience();
    };
  }, []);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysRef.current[key] = true;

      // Interaction trigger
      if (key === "e" && !isModalOpen && nearbyEntityRef.current) {
        onInteract(nearbyEntityRef.current);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysRef.current[key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isModalOpen, onInteract]);

  // Main 60 FPS Game Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const canvas = canvasRef.current;
      if (!canvas) {
        animId = requestAnimationFrame(loop);
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        animId = requestAnimationFrame(loop);
        return;
      }

      // Update Viewport Dimensions based on container
      const width = canvas.width;
      const height = canvas.height;
      cameraRef.current.viewportWidth = width;
      cameraRef.current.viewportHeight = height;

      // 1. UPDATE PLAYER INPUT & MOVEMENT (if no modal is open)
      const player = playerRef.current;
      let dx = 0;
      let dy = 0;

      if (!isModalOpen) {
        const keys = keysRef.current;
        if (keys["w"] || keys["arrowup"]) dy -= 1;
        if (keys["s"] || keys["arrowdown"]) dy += 1;
        if (keys["a"] || keys["arrowleft"]) dx -= 1;
        if (keys["d"] || keys["arrowright"]) dx += 1;
      }

      // Normalize diagonal speed
      if (dx !== 0 && dy !== 0) {
        dx *= 0.7071;
        dy *= 0.7071;
      }

      player.isMoving = dx !== 0 || dy !== 0;

      if (dx > 0) player.dir = "right";
      else if (dx < 0) player.dir = "left";
      else if (dy > 0) player.dir = "down";
      else if (dy < 0) player.dir = "up";

      if (player.isMoving) {
        player.animTimer += dt;
        footstepTimerRef.current += dt;
        if (footstepTimerRef.current > 0.3) {
          soundEngine.playFootstep();
          footstepTimerRef.current = 0;
        }
      }

      // 2. COLLISION CHECK & MOVEMENT (separate X and Y for wall sliding)
      const nextX = player.x + dx * player.speed;
      const nextY = player.y + dy * player.speed;
      const halfW = player.width / 2;
      const halfH = player.height / 2;

      const collidesWithWalls = (checkX: number, checkY: number): boolean => {
        // Check solid walls
        for (const wall of COLLISION_WALLS) {
          if (
            checkX + halfW > wall.x &&
            checkX - halfW < wall.x + wall.w &&
            checkY + halfH > wall.y &&
            checkY - halfH < wall.y + wall.h
          ) {
            return true;
          }
        }

        // Check locked Gate 1 (Symbol Gate at X: 1440, Y: 640-760)
        const symbolGate = gatesRef.current["symbol_gate"];
        if (symbolGate && !symbolGate.isOpen) {
          if (
            checkX + halfW > 1440 &&
            checkX - halfW < 1480 &&
            checkY + halfH > 640 &&
            checkY - halfH < 760
          ) {
            return true;
          }
        }

        return false;
      };

      // Move along X if no collision
      if (!collidesWithWalls(nextX, player.y)) {
        player.x = nextX;
      }
      // Move along Y if no collision
      if (!collidesWithWalls(player.x, nextY)) {
        player.y = nextY;
      }

      // 3. CAMERA FOLLOW (Smooth Lerp Centered on Player)
      const targetCamX = Math.max(0, Math.min(WORLD_WIDTH - width, player.x - width / 2));
      const targetCamY = Math.max(0, Math.min(WORLD_HEIGHT - height, player.y - height / 2));

      cameraRef.current.x += (targetCamX - cameraRef.current.x) * 0.1;
      cameraRef.current.y += (targetCamY - cameraRef.current.y) * 0.1;

      // 4. PROXIMITY DETECTION (Nearest Interactive Entity within 75px)
      let closestEntity: InteractiveEntity | null = null;
      let minDistance = 75;

      for (const ent of entitiesRef.current) {
        const dist = Math.hypot(ent.x - player.x, ent.y - player.y);
        if (dist < minDistance) {
          closestEntity = ent;
          minDistance = dist;
        }
      }

      nearbyEntityRef.current = closestEntity;
      setNearbyEntityState(closestEntity);

      // 5. UPDATE GATES ANIMATION
      for (const gate of Object.values(gatesRef.current)) {
        if (gate.isOpen && gate.progress < 1) {
          gate.progress = Math.min(1, gate.progress + dt * 1.5);
        }
      }

      // 6. UPDATE PARTICLES
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.life += dt * 30;
        if (p.life > p.maxLife) {
          p.x = Math.random() * WORLD_WIDTH;
          p.y = 320 + Math.random() * 760;
          p.life = 0;
        }
      }

      // 7. RENDER WORLD
      renderWorld(
        ctx,
        width,
        height,
        player,
        cameraRef.current,
        entitiesRef.current,
        particlesRef.current,
        gatesRef.current,
        closestEntity,
        time / 1000,
      );

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isModalOpen]);

  return {
    canvasRef,
    nearbyEntity: nearbyEntityState,
    markEntityInspected,
    openGate,
  };
}
