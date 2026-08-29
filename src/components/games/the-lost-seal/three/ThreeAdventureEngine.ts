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

  private composer: {
    render: () => void;
    setSize: (w: number, h: number) => void;
  } | null = null;

  // Cinematic system. The finale uses its own camera track so it never replays
  // the opening fly-through or teleports the player back to the level spawn.
  private isCinematicIntro = false;
  private cinematicKind: "intro" | "finale" = "intro";
  private cinematicDuration = 15;
  private cinematicTimer = 0;
  private currentShotIndex = -1;
  private onCinematicShotChange: ((shotIndex: number, progress: number) => void) | null = null;
  private onCinematicComplete: (() => void) | null = null;


  constructor(
    canvas: HTMLCanvasElement,
    callbacks: AdventureEngineCallbacks,
    initialQuality: QualityTier = "high",
  ) {
    this.canvas = canvas;
    this.callbacks = callbacks;
    this.currentQuality = initialQuality;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: initialQuality !== "mobile",
      powerPreference: "high-performance",
    });

    this.applyQualitySettings(initialQuality);

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

    const aspect = canvas.clientWidth / canvas.clientHeight;
    this.cameraController = new ThirdPersonCamera(aspect);

    this.player = createStylizedPlayer();
    this.scene.add(this.player.root);

    this.physics = new PlayerPhysicsController();

    this.initPostProcessing();
    this.loadLevel("level-1-lost-city");
    this.bindEvents();
    this.animate(performance.now());
  }

  private async initPostProcessing() {
    try {
      const [
        { EffectComposer },
        { RenderPass },
        { UnrealBloomPass },
        { OutputPass },
        { ShaderPass },
      ] = await Promise.all([
        import("three/addons/postprocessing/EffectComposer.js"),
        import("three/addons/postprocessing/RenderPass.js"),
        import("three/addons/postprocessing/UnrealBloomPass.js"),
        import("three/addons/postprocessing/OutputPass.js"),
        import("three/addons/postprocessing/ShaderPass.js"),
      ]);

      const w = this.canvas.clientWidth;
      const h = this.canvas.clientHeight;

      const effectComposer = new EffectComposer(this.renderer);
      effectComposer.setSize(w, h);

      const renderPass = new RenderPass(this.scene, this.cameraController.camera);
      effectComposer.addPass(renderPass);

      const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 0.52, 0.42, 0.78);
      effectComposer.addPass(bloomPass);

      const vignetteShader = {
        uniforms: {
          tDiffuse: { value: null as THREE.Texture | null },
          offset: { value: 0.90 },
          darkness: { value: 0.50 },
        },
        vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `uniform sampler2D tDiffuse; uniform float offset; uniform float darkness; varying vec2 vUv; void main() { vec4 color = texture2D(tDiffuse, vUv); vec2 uv = (vUv - vec2(0.5)) * vec2(offset); float vig = 1.0 - dot(uv, uv) * darkness; color.rgb *= clamp(vig, 0.0, 1.0); gl_FragColor = color; }`,
      };
      const vignettePass = new ShaderPass(vignetteShader);
      effectComposer.addPass(vignettePass);

      const outputPass = new OutputPass();
      effectComposer.addPass(outputPass);

      this.composer = {
        render: () => effectComposer.render(),
        setSize: (w: number, h: number) => effectComposer.setSize(w, h),
      };
    } catch {
      this.composer = null;
    }
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

    this.sunLight.color.setHex(this.currentLevelData.sunColor);
    this.sunLight.intensity = this.currentLevelData.sunIntensity;
    this.ambientLight.color.setHex(this.currentLevelData.ambientColor);

    this.scene.background = new THREE.Color(this.currentLevelData.fogColor);
    this.scene.fog = new THREE.FogExp2(
      this.currentLevelData.fogColor,
      this.currentLevelData.fogDensity,
    );

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
    if (ent) {
      ent.isInspected = true;
      this.currentLevelData?.onEntityInspected?.(entityId);
    }
  }

  public triggerActivationPulse(x: number, y: number, z: number) {
    this.currentLevelData?.triggerPulse?.(x, y, z);
  }

  public openGate(gateId: string) {
    adventureAudio.playGateOpen();
    if (this.currentLevelData) {
      const idx = this.currentLevelData.colliders.findIndex((c) => c.name === gateId);
      if (idx !== -1) {
        this.currentLevelData.colliders.splice(idx, 1);
      }
      this.currentLevelData.triggerPulse?.(0, 2.1, -30.5);
    }
  }

  public disengageAltarBarrier() {
    adventureAudio.playGateOpen();
    if (this.currentLevelData) {
      const idx = this.currentLevelData.colliders.findIndex((c) => c.name === "altar_barrier_col");
      if (idx !== -1) {
        this.currentLevelData.colliders.splice(idx, 1);
      }
      this.currentLevelData.triggerPulse?.(0, 1.0, 2);
    }
  }

  public setEntityEnabled(entityId: string, enabled: boolean) {
    const entity = this.currentLevelData?.interactiveEntities.find((item) => item.id === entityId);
    if (!entity) return;

    entity.data = { ...entity.data, enabled };
    if (entity.mesh) entity.mesh.visible = enabled;
    if (!enabled && this.nearbyEntity?.id === entityId) {
      this.nearbyEntity = null;
      this.callbacks.onNearbyEntityChange(null);
    }
  }

  public setTouchJoystick(x: number, y: number) {
    this.touchVector = { x, y };
  }

  public handleTouchLook(dx: number, dy: number) {
    this.cameraController.yaw -= dx * 0.006;
    this.cameraController.pitch += dy * 0.006;
    this.cameraController.pitch = Math.max(0.08, Math.min(1.28, this.cameraController.pitch));
  }

  public triggerJump() {
    this.keys["jump"] = true;
    adventureAudio.playJump();
    setTimeout(() => { this.keys["jump"] = false; }, 150);
  }

  public startCinematicIntro(
    onShotChange?: (shotIndex: number, progress: number) => void,
    onComplete?: () => void,
  ) {
    this.isCinematicIntro = true;
    this.cinematicKind = "intro";
    this.cinematicDuration = 15;
    this.cinematicTimer = 0;
    this.currentShotIndex = -1;
    this.onCinematicShotChange = onShotChange || null;
    this.onCinematicComplete = onComplete || null;
    adventureAudio.playCinematicTone();
  }

  public startFinaleCinematic(
    onShotChange?: (shotIndex: number, progress: number) => void,
    onComplete?: () => void,
  ) {
    this.isCinematicIntro = true;
    this.cinematicKind = "finale";
    this.cinematicDuration = 7.2;
    this.cinematicTimer = 0;
    this.currentShotIndex = -1;
    this.onCinematicShotChange = onShotChange || null;
    this.onCinematicComplete = onComplete || null;
    adventureAudio.playCinematicTone();
  }

  public skipCinematicIntro() {
    if (!this.isCinematicIntro) return;
    this.isCinematicIntro = false;
    this.cinematicTimer = 0;
    this.currentShotIndex = -1;

    if (this.currentLevelData) {
      const cameraAnchor = this.cinematicKind === "finale"
        ? this.player.root.position
        : this.currentLevelData.spawnPoint;
      const cameraHeading = this.cinematicKind === "finale"
        ? this.physics.state.direction
        : this.currentLevelData.spawnRotation;
      this.cameraController.snapToThirdPerson(
        cameraAnchor,
        cameraHeading,
      );
    }

    const cb = this.onCinematicComplete;
    this.onCinematicComplete = null;
    this.onCinematicShotChange = null;
    if (cb) cb();
  }

  public isCinematicActive(): boolean {
    return this.isCinematicIntro;
  }

  public triggerInteract() {
    if (!this.isPaused && !this.isCinematicIntro && this.nearbyEntity) {
      this.callbacks.onInteract(this.nearbyEntity);
    }
  }

  private bindEvents() {
    window.addEventListener("keydown", this.onKeyDown, { passive: false });
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("resize", this.onResize);

    this.canvas.addEventListener("mousedown", (e) => {
      this.canvas.focus();
      if (!this.isCinematicIntro) {
        this.cameraController.onPointerDown(e.clientX, e.clientY);
      }
    });
    window.addEventListener("mousemove", (e) => {
      if (!this.isCinematicIntro) {
        this.cameraController.onPointerMove(e.clientX, e.clientY);
      }
    });
    window.addEventListener("mouseup", () => {
      if (!this.isCinematicIntro) {
        this.cameraController.onPointerUp();
      }
    });
    this.canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      if (!this.isCinematicIntro) {
        this.cameraController.onWheel(e.deltaY);
      }
    }, { passive: false });
    this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  private onKeyDown = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    const code = e.code;

    // Skip cinematic on Space, Escape, or Enter
    if (this.isCinematicIntro) {
      if (key === "escape" || key === " " || code === "Space" || key === "enter") {
        e.preventDefault();
        this.skipCinematicIntro();
        return;
      }
    }

    if (key === " " || code === "Space" || key === "arrowup" || key === "arrowdown" || key === "arrowleft" || key === "arrowright") {
      e.preventDefault();
    }

    this.keys[key] = true;

    if (key === " " || code === "Space") {
      if (!this.isCinematicIntro) {
        adventureAudio.playJump();
      }
    }

    if (key === "e" && !this.isPaused && !this.isCinematicIntro && this.nearbyEntity) {
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
    if (this.composer) this.composer.setSize(width, height);
  };

  private animate = (time: number) => {
    const dt = Math.min((time - this.lastTime) / 1000, 0.08);
    this.lastTime = time;

    if (this.currentLevelData) {
      if (this.isCinematicIntro) {
        this.cinematicTimer += dt;

        // Cinematic keyframe sequences. The finale focuses the newly charged
        // portal and altar instead of reusing the Level 1 establishing shots.
        // Shot 0: (0 to 3.2s) - High aerial establishing pan overlooking Citadel & distant skyline
        // Shot 1: (3.2 to 6.8s) - Descending track along the central boulevard & Great Bath
        // Shot 2: (6.8 to 10.0s) - Low tracking shot passing northern excavation dig trench & inscribed slab
        // Shot 3: (10.0 to 12.8s) - North Monumental Gateway flanked by flickering torches
        // Shot 4: (12.8 to 15.0s) - Crane glide descending toward the player explorer
        const introShots = [
          {
            dur: 3.2,
            sPos: new THREE.Vector3(0, 26, 52),
            ePos: new THREE.Vector3(-6, 20, 36),
            sLook: new THREE.Vector3(0, 3, 4),
            eLook: new THREE.Vector3(0, 2, 0),
          },
          {
            dur: 3.6,
            sPos: new THREE.Vector3(16, 12, 22),
            ePos: new THREE.Vector3(6, 6, 2),
            sLook: new THREE.Vector3(0, 0, 4),
            eLook: new THREE.Vector3(0, -1.0, 0),
          },
          {
            dur: 3.2,
            sPos: new THREE.Vector3(-14, 5, -8),
            ePos: new THREE.Vector3(-8, 3.2, -18),
            sLook: new THREE.Vector3(-7, 0.5, -20),
            eLook: new THREE.Vector3(-7, 0.2, -20),
          },
          {
            dur: 2.8,
            sPos: new THREE.Vector3(5, 4.5, -22),
            ePos: new THREE.Vector3(0, 3.8, -16),
            sLook: new THREE.Vector3(0, 3.2, -32),
            eLook: new THREE.Vector3(0, 3.5, -34),
          },
          {
            dur: 2.2,
            sPos: new THREE.Vector3(0, 4.2, 35),
            ePos: new THREE.Vector3(0, 2.3, 32.2),
            sLook: new THREE.Vector3(0, 1.4, 26),
            eLook: new THREE.Vector3(0, 1.35, 26),
          },
        ];
        const finaleShots = [
          {
            dur: 2.1,
            sPos: new THREE.Vector3(10, 6.4, -1),
            ePos: new THREE.Vector3(5.6, 4.8, -7.5),
            sLook: new THREE.Vector3(0, 2.0, -10),
            eLook: new THREE.Vector3(0, 3.0, -13),
          },
          {
            dur: 2.5,
            sPos: new THREE.Vector3(5.6, 4.8, -7.5),
            ePos: new THREE.Vector3(-3.2, 4.2, -13.8),
            sLook: new THREE.Vector3(0, 3.2, -14.7),
            eLook: new THREE.Vector3(0, 3.5, -15.2),
          },
          {
            dur: 2.6,
            sPos: new THREE.Vector3(-3.2, 4.2, -13.8),
            ePos: new THREE.Vector3(0, 3.8, -15.8),
            sLook: new THREE.Vector3(0, 3.4, -15.2),
            eLook: new THREE.Vector3(0, 3.1, -12),
          },
        ];
        const shots = this.cinematicKind === "finale" ? finaleShots : introShots;

        let accumulated = 0;
        let activeShot = shots[shots.length - 1]!;
        let shotIdx = shots.length - 1;
        let localT = 1.0;

        for (let i = 0; i < shots.length; i++) {
          const s = shots[i]!;
          if (this.cinematicTimer < accumulated + s.dur) {
            activeShot = s;
            shotIdx = i;
            localT = (this.cinematicTimer - accumulated) / s.dur;
            break;
          }
          accumulated += s.dur;
        }

        // Smoothstep easing for cinematic smoothness
        const easeT = localT * localT * (3 - 2 * localT);
        const camPos = new THREE.Vector3().lerpVectors(activeShot.sPos, activeShot.ePos, easeT);
        const camLook = new THREE.Vector3().lerpVectors(activeShot.sLook, activeShot.eLook, easeT);

        this.cameraController.setCinematicTransform(camPos, camLook, dt);

        if (this.currentShotIndex !== shotIdx) {
          this.currentShotIndex = shotIdx;
          if (this.onCinematicShotChange) {
            this.onCinematicShotChange(shotIdx, this.cinematicTimer / this.cinematicDuration);
          }
        }

        // Keep the explorer still during a cinematic. Only the opening scene
        // anchors them to spawn; the finale must preserve their altar position.
        if (this.cinematicKind === "intro") {
          this.player.root.position.copy(this.currentLevelData.spawnPoint);
          this.player.setHeading(this.currentLevelData.spawnRotation);
        }
        this.player.updateAnimation(dt, "idle");

        // Keep world active (torches, dust, water caustics, runes)
        this.currentLevelData.animatedProps.update(dt, time / 1000);

        if (this.cinematicTimer >= this.cinematicDuration) {
          this.skipCinematicIntro();
        }
      } else {
        // Normal Gameplay
        this.physics.update(dt, this.keys, this.cameraController.yaw, this.currentLevelData.colliders, this.isPaused, this.touchVector);
        this.player.root.position.copy(this.physics.state.position);
        this.player.setHeading(this.physics.state.direction);
        this.player.updateAnimation(dt, this.physics.state.animState);

        adventureAudio.updateFootsteps(dt, this.physics.state.isMoving, this.physics.state.isRunning, this.physics.state.isGrounded);
        this.cameraController.update(this.player.root.position, dt, this.currentLevelData.colliders);
        this.updateProximity();
        this.currentLevelData.animatedProps.update(dt, time / 1000);
      }
    }


    if (this.composer) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.cameraController.camera);
    }

    this.animFrameId = requestAnimationFrame(this.animate);
  };

  private updateProximity() {
    if (!this.currentLevelData) return;

    const pPos = this.player.root.position;
    let closest: InteractiveEntity3D | null = null;
    let minDist = Infinity;

    for (const ent of this.currentLevelData.interactiveEntities) {
      const dist = pPos.distanceTo(ent.position);
      if (dist <= ent.interactionRadius && dist < minDist) {
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
