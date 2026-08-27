import * as THREE from "three";
import { createPlayer3D, type Player3DController } from "./createPlayer3D";
import { createWorld3D, type World3DResult } from "./createWorld3D";
import type { InteractiveEntity3D } from "./types3D";
import { soundEngine } from "../engine/soundEffects";

export interface ThreeLostSealEngineCallbacks {
  onNearbyEntityChange: (entity: InteractiveEntity3D | null) => void;
  onInteract: (entity: InteractiveEntity3D) => void;
}

export class ThreeLostSealEngine {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  private player: Player3DController;
  private world: World3DResult;

  private keys: Record<string, boolean> = {};
  private isModalOpen = false;
  private callbacks: ThreeLostSealEngineCallbacks;

  private animFrameId: number | null = null;
  private lastTime = performance.now();
  private footstepTimer = 0;
  private nearbyEntity: InteractiveEntity3D | null = null;

  constructor(canvas: HTMLCanvasElement, callbacks: ThreeLostSealEngineCallbacks) {
    this.canvas = canvas;
    this.callbacks = callbacks;

    // 1. Renderer Setup
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    // 2. Scene & Fog Setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a120b); // Desert night amber
    this.scene.fog = new THREE.FogExp2(0x1a120b, 0.02);

    // 3. Camera Setup (Elevated Third-Person View)
    const aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 200);

    // 4. Ambient & Sunlight Setup
    const ambientLight = new THREE.AmbientLight(0x5c4228, 0.8);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfde68a, 1.8);
    sunLight.position.set(40, 30, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 100;
    sunLight.shadow.camera.left = -50;
    sunLight.shadow.camera.right = 50;
    sunLight.shadow.camera.top = 25;
    sunLight.shadow.camera.bottom = -25;
    sunLight.shadow.bias = -0.0005;
    this.scene.add(sunLight);

    // 5. Build 3D World & Player
    this.world = createWorld3D();
    this.scene.add(this.world.scene);

    this.player = createPlayer3D();
    this.scene.add(this.player.root);

    // 6. Bind Event Listeners
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("resize", this.onResize);

    soundEngine.startAmbience();

    // 7. Start Render Loop
    this.animate(performance.now());
  }

  public setModalOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  public markEntityInspected(id: string) {
    const ent = this.world.interactiveEntities.find((e) => e.id === id);
    if (ent) ent.isInspected = true;
  }

  public openGate(gateId: string) {
    const gate = this.world.gates[gateId];
    if (gate) {
      gate.isOpen = true;
      soundEngine.playStoneDoorOpen();

      // Remove collision collider for this gate
      const idx = this.world.colliders.findIndex((c) => c.name === gateId);
      if (idx !== -1) {
        this.world.colliders.splice(idx, 1);
      }
    }
  }

  private onKeyDown = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    this.keys[key] = true;

    if (key === "e" && !this.isModalOpen && this.nearbyEntity) {
      this.callbacks.onInteract(this.nearbyEntity);
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    this.keys[key] = false;
  };

  private onResize = () => {
    if (!this.canvas) return;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  };

  private animate = (time: number) => {
    const dt = Math.min((time - this.lastTime) / 1000, 0.1);
    this.lastTime = time;

    // 1. Update Player Movement & Collisions
    this.updatePlayer(dt);

    // 2. Update Camera Chase Target
    this.updateCamera(dt);

    // 3. Update 3D Proximity Detection
    this.updateProximity();

    // 4. Update Animated World Props (Torches, Gate, Dust, Seal)
    this.world.animatedProps.update(dt, time / 1000);

    // 5. Render Three.js Scene
    this.renderer.render(this.scene, this.camera);

    this.animFrameId = requestAnimationFrame(this.animate);
  };

  private updatePlayer(dt: number) {
    if (this.isModalOpen) {
      this.player.updateAnimation(dt, false);
      return;
    }

    let moveX = 0;
    let moveZ = 0;

    if (this.keys["w"] || this.keys["arrowup"]) moveX += 1;
    if (this.keys["s"] || this.keys["arrowdown"]) moveX -= 1;
    if (this.keys["a"] || this.keys["arrowleft"]) moveZ -= 1;
    if (this.keys["d"] || this.keys["arrowright"]) moveZ += 1;

    const isMoving = moveX !== 0 || moveZ !== 0;

    if (isMoving) {
      // Normalize velocity
      const len = Math.hypot(moveX, moveZ);
      const speed = 7.0;
      const vx = (moveX / len) * speed * dt;
      const vz = (moveZ / len) * speed * dt;

      // Desired position
      const targetX = this.player.root.position.x + vx;
      const targetZ = this.player.root.position.z + vz;
      const r = 0.4; // Player collision radius

      // Check X collision
      let canMoveX = true;
      for (const col of this.world.colliders) {
        if (
          targetX + r > col.minX &&
          targetX - r < col.maxX &&
          this.player.root.position.z + r > col.minZ &&
          this.player.root.position.z - r < col.maxZ
        ) {
          canMoveX = false;
          break;
        }
      }
      if (canMoveX) this.player.root.position.x = targetX;

      // Check Z collision
      let canMoveZ = true;
      for (const col of this.world.colliders) {
        if (
          this.player.root.position.x + r > col.minX &&
          this.player.root.position.x - r < col.maxX &&
          targetZ + r > col.minZ &&
          targetZ - r < col.maxZ
        ) {
          canMoveZ = false;
          break;
        }
      }
      if (canMoveZ) this.player.root.position.z = targetZ;

      // Rotate player toward movement angle
      const angle = Math.atan2(vz, vx);
      this.player.setDirection(-angle + Math.PI / 2);

      // Footstep sound
      this.footstepTimer += dt;
      if (this.footstepTimer > 0.32) {
        soundEngine.playFootstep();
        this.footstepTimer = 0;
      }
    }

    this.player.updateAnimation(dt, isMoving);
  }

  private updateCamera(dt: number) {
    const pPos = this.player.root.position;

    // Elevated Isometric-Angle Chase Cam
    const targetCamX = pPos.x - 7.5;
    const targetCamY = pPos.y + 7.0;
    const targetCamZ = pPos.z + 5.5;

    this.camera.position.lerp(new THREE.Vector3(targetCamX, targetCamY, targetCamZ), 0.08);

    // Look slightly ahead of the character
    const lookTarget = new THREE.Vector3(pPos.x + 1.5, pPos.y + 1.2, pPos.z);
    this.camera.lookAt(lookTarget);
  }

  private updateProximity() {
    const pPos = this.player.root.position;
    let closest: InteractiveEntity3D | null = null;
    let minDistance = 2.8;

    for (const ent of this.world.interactiveEntities) {
      const dist = pPos.distanceTo(ent.position);
      if (dist < minDistance) {
        closest = ent;
        minDistance = dist;
      }
    }

    if (closest !== this.nearbyEntity) {
      this.nearbyEntity = closest;
      this.callbacks.onNearbyEntityChange(closest);
    }
  }

  public destroy() {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("resize", this.onResize);
    soundEngine.stopAmbience();
    this.renderer.dispose();
  }
}
