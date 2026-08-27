import * as THREE from "three";
import { createStylizedMaterials, type StylizedMaterialPalette } from "./materials";
import { createStylizedPlayer, type StylizedPlayer } from "./character";
import { createLevel1LostCity, type LevelSceneResult } from "./levels/level1LostCity";
import { createLevel2MerchantQuarter } from "./levels/level2MerchantQuarter";
import { createLevel3SealedSanctum } from "./levels/level3SealedSanctum";
import { ThirdPersonCamera } from "./camera";
import { PlayerPhysicsController } from "./physics";
import { adventureAudio } from "./audio";
import type { LevelId, InteractiveEntity3D } from "./types";

export type QualityTier = "ultra" | "high" | "mobile-high" | "mobile";

export interface AdventureEngineCallbacks {
  onNearbyEntityChange: (entity: InteractiveEntity3D | null) => void;
  onInteract: (entity: InteractiveEntity3D) => void;
  onLevelChanged: (levelId: LevelId) => void;
}

export class ThreeAdventureEngine {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private cameraController: ThirdPersonCamera;
  private physics: PlayerPhysicsController;
  private player: StylizedPlayer;
  private mats: StylizedMaterialPalette;

  private currentLevelId: LevelId = "level-1-lost-city";
  private currentLevelData: LevelSceneResult | null = null;
  private sunLight: THREE.DirectionalLight;
  private ambientLight: THREE.AmbientLight;
  private hemiLight: THREE.HemisphereLight;

  private keys: Record<string, boolean> = {};
  private touchVector = { x: 0, y: 0 };
  private isPaused = false;
  private callbacks: AdventureEngineCallbacks;

  private animFrameId: number | null = null;
  private lastTime = performance.now();
  private nearbyEntity: InteractiveEntity3D | null = null;
  private currentQuality: QualityTier = "high";

  constructor(
    canvas: HTMLCanvasElement,
    callbacks: AdventureEngineCallbacks,
    initialQuality: QualityTier = "high",
  ) {
    this.canvas = canvas;
    this.callbacks = callbacks;
    this.currentQuality = initialQuality;

    // 1. Renderer Setup with Quality Scalability
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: initialQuality !== "mobile",
      powerPreference: "high-performance",
    });

    this.applyQualitySettings(initialQuality);

    // 2. Scene & Base Lights
    this.scene = new THREE.Scene();
    this.mats = createStylizedMaterials();

    this.ambientLight = new THREE.AmbientLight(0x6e5038, 0.85);
    this.scene.add(this.ambientLight);

    this.hemiLight = new THREE.HemisphereLight(0x7ab6f0, 0xdfb07b, 0.95);
    this.scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight(0xfff0cc, 2.4);
    this.sunLight.position.set(32, 52, 28);
    this.sunLight.castShadow = initialQuality !== "mobile";

    const shadowRes = initialQuality === "ultra" ? 4096 : initialQuality === "high" ? 2048 : 1024;
    this.sunLight.shadow.mapSize.width = shadowRes;
    this.sunLight.shadow.mapSize.height = shadowRes;
    this.sunLight.shadow.camera.near = 1.0;
    this.sunLight.shadow.camera.far = 150;
    this.sunLight.shadow.camera.left = -48;
    this.sunLight.shadow.camera.right = 48;
    this.sunLight.shadow.camera.top = 48;
    this.sunLight.shadow.camera.bottom = -48;
    this.sunLight.shadow.bias = -0.0005;
    this.scene.add(this.sunLight);

    // 3. Camera & Player
    const aspect = canvas.clientWidth / canvas.clientHeight;
    this.cameraController = new ThirdPersonCamera(aspect);

    this.player = createStylizedPlayer();
    this.scene.add(this.player.root);

    this.physics = new PlayerPhysicsController();

    // 4. Load Initial Level 1
    this.loadLevel("level-1-lost-city");

    // 5. Bind Listeners
    this.bindEvents();

    // 6. Start Loop
    this.animate(performance.now());
  }

  public setQuality(quality: QualityTier) {
    this.currentQuality = quality;
    this.applyQualitySettings(quality);
  }

  private applyQualitySettings(quality: QualityTier) {
    const dpr =
      quality === "ultra"
        ? Math.min(window.devicePixelRatio, 2.0)
        : quality === "high"
          ? Math.min(window.devicePixelRatio, 1.5)
          : 1.0;

    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);
    this.renderer.shadowMap.enabled = quality !== "mobile";
    this.renderer.shadowMap.type =
      quality === "ultra" ? THREE.PCFSoftShadowMap : THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.18;
  }

  public loadLevel(levelId: LevelId) {
    if (this.currentLevelData) {
      this.scene.remove(this.currentLevelData.group);
    }

    this.currentLevelId = levelId;

    if (levelId === "level-1-lost-city") {
      this.currentLevelData = createLevel1LostCity(this.mats);
      this.hemiLight.intensity = 0.95;
      adventureAudio.startAmbience("daylight");
    } else if (levelId === "level-2-merchant-quarter") {
      this.currentLevelData = createLevel2MerchantQuarter(this.mats);
      this.hemiLight.intensity = 0.65;
      adventureAudio.startAmbience("daylight");
    } else {
      this.currentLevelData = createLevel3SealedSanctum(this.mats);
      this.hemiLight.intensity = 0.25;
      adventureAudio.startAmbience("underground");
    }

    this.scene.add(this.currentLevelData.group);

    // Set Lighting & Fog for level
    this.sunLight.color.setHex(this.currentLevelData.sunColor);
    this.sunLight.intensity = this.currentLevelData.sunIntensity;
    this.ambientLight.color.setHex(this.currentLevelData.ambientColor);

    this.scene.background = new THREE.Color(this.currentLevelData.fogColor);
    this.scene.fog = new THREE.FogExp2(
      this.currentLevelData.fogColor,
      this.currentLevelData.fogDensity,
    );

    // Spawn player
    this.physics.setSpawn(this.currentLevelData.spawnPoint, this.currentLevelData.spawnRotation);
    this.player.root.position.copy(this.currentLevelData.spawnPoint);
    this.player.setHeading(this.currentLevelData.spawnRotation);

    this.cameraController.yaw = this.currentLevelData.spawnRotation;
    this.cameraController.update(this.player.root.position, 0.1, this.currentLevelData.colliders);

    this.callbacks.onLevelChanged(levelId);
  }

  public getCurrentLevelId(): LevelId {
    return this.currentLevelId;
  }

  public setPaused(paused: boolean) {
    this.isPaused = paused;
  }

  public markEntityInspected(entityId: string) {
    const ent = this.currentLevelData?.interactiveEntities.find((e) => e.id === entityId);
    if (ent) ent.isInspected = true;
  }

  public openGate(gateId: string) {
    adventureAudio.playGateOpen();
    if (this.currentLevelData) {
      const idx = this.currentLevelData.colliders.findIndex((c) => c.name === gateId);
      if (idx !== -1) {
        this.currentLevelData.colliders.splice(idx, 1);
      }
    }
  }

  public disengageAltarBarrier() {
    adventureAudio.playGateOpen();
    if (this.currentLevelData) {
      const idx = this.currentLevelData.colliders.findIndex((c) => c.name === "altar_barrier_col");
      if (idx !== -1) {
        this.currentLevelData.colliders.splice(idx, 1);
      }
    }
  }

  public setTouchJoystick(x: number, y: number) {
    this.touchVector = { x, y };
  }

  public handleTouchLook(dx: number, dy: number) {
    this.cameraController.yaw -= dx * 0.006;
    this.cameraController.pitch += dy * 0.006;
    this.cameraController.pitch = Math.max(0.08, Math.min(1.22, this.cameraController.pitch));
  }

  public triggerJump() {
    this.keys["jump"] = true;
    adventureAudio.playJump();
    setTimeout(() => {
      this.keys["jump"] = false;
    }, 150);
  }

  public triggerInteract() {
    if (!this.isPaused && this.nearbyEntity) {
      this.callbacks.onInteract(this.nearbyEntity);
    }
  }

  private bindEvents() {
    window.addEventListener("keydown", this.onKeyDown, { passive: false });
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("resize", this.onResize);

    this.canvas.addEventListener("mousedown", (e) => {
      this.canvas.focus();
      this.cameraController.onPointerDown(e.clientX, e.clientY);
    });
    window.addEventListener("mousemove", (e) =>
      this.cameraController.onPointerMove(e.clientX, e.clientY),
    );
    window.addEventListener("mouseup", () => this.cameraController.onPointerUp());
    this.canvas.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        this.cameraController.onWheel(e.deltaY);
      },
      { passive: false },
    );
    this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  private onKeyDown = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    const code = e.code;

    // Prevent default webpage scrolling when game keys are pressed
    if (
      key === " " ||
      code === "Space" ||
      key === "arrowup" ||
      key === "arrowdown" ||
      key === "arrowleft" ||
      key === "arrowright"
    ) {
      e.preventDefault();
    }

    this.keys[key] = true;

    if (key === " " || code === "Space") {
      adventureAudio.playJump();
    }

    if (key === "e" && !this.isPaused && this.nearbyEntity) {
      e.preventDefault();
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
    this.cameraController.resize(width / height);
    this.renderer.setSize(width, height, false);
  };

  private animate = (time: number) => {
    const dt = Math.min((time - this.lastTime) / 1000, 0.08);
    this.lastTime = time;

    // 1. Update Player Physics & Collisions
    if (this.currentLevelData) {
      this.physics.update(
        dt,
        this.keys,
        this.cameraController.yaw,
        this.currentLevelData.colliders,
        this.isPaused,
        this.touchVector,
      );

      this.player.root.position.copy(this.physics.state.position);
      this.player.setHeading(this.physics.state.direction);
      this.player.updateAnimation(dt, this.physics.state.animState);

      // Footstep Sound updates
      adventureAudio.updateFootsteps(
        dt,
        this.physics.state.isMoving,
        this.physics.state.isRunning,
        this.physics.state.isGrounded,
      );

      // 2. Update Third-Person Chase Camera with Collision Awareness
      this.cameraController.update(this.player.root.position, dt, this.currentLevelData.colliders);

      // 3. Update 3D Proximity Detection
      this.updateProximity();

      // 4. Update Level Animated Props (water, torches, dust)
      this.currentLevelData.animatedProps.update(dt, time / 1000);
    }

    // 5. Render Three.js Frame
    this.renderer.render(this.scene, this.cameraController.camera);

    this.animFrameId = requestAnimationFrame(this.animate);
  };

  private updateProximity() {
    if (!this.currentLevelData) return;

    const pPos = this.player.root.position;
    let closest: InteractiveEntity3D | null = null;
    let minDist = 3.2;

    for (const ent of this.currentLevelData.interactiveEntities) {
      const dist = pPos.distanceTo(ent.position);
      if (dist < ent.interactionRadius && dist < minDist) {
        closest = ent;
        minDist = dist;
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
    adventureAudio.stopAmbience();
    this.renderer.dispose();
  }
}
