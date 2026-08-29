import type * as THREE from "three";

export type LevelId = "level-1-lost-city" | "level-2-merchant-quarter" | "level-3-sealed-sanctum";

export interface LevelInfo {
  id: LevelId;
  name: string;
  subtitle: string;
  theme: string;
  defaultObjective: string;
  spawnPoint: THREE.Vector3;
  spawnRotation: number;
}

export type EntityType3D =
  | "marker"
  | "mound"
  | "pottery"
  | "tablet"
  | "crate"
  | "seal_impression"
  | "passage_gate"
  | "sanctum_portal"
  | "water_puzzle"
  | "merchant_puzzle"
  | "storage_jars"
  | "textile_bales"
  | "merchant_tablet"
  | "symbol_puzzle_gate"
  | "underground_cache"
  | "steatite_seal";

export interface InteractiveEntity3D {
  id: string;
  type: EntityType3D;
  name: string;
  position: THREE.Vector3;
  interactionRadius: number;
  promptLabel: string;
  zone?: string | undefined;
  objectiveAfterInspect?: string | undefined;
  isInspected: boolean;
  mesh?: THREE.Object3D | undefined;
  data?: Record<string, unknown> | undefined;
}

export interface BoxCollider3D {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  minY?: number;
  maxY?: number;
  isWalkable?: boolean;
  isStep?: boolean;
  name?: string;
}

export interface PlayerPhysicsState {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  direction: number; // yaw angle in radians
  isMoving: boolean;
  isRunning: boolean;
  isGrounded: boolean;
  isJumping: boolean;
  jumpTimer: number;
  animState: "idle" | "walk" | "run" | "jump" | "fall";
}

export type StoryActId =
  | "act-1-discovery"
  | "act-2-lost-city"
  | "act-3-merchant-quarter"
  | "act-4-sealed-sanctum";

export interface StoryActInfo {
  id: StoryActId;
  actNumber: string;
  title: string;
  subtitle: string;
  historicalContext: string;
}

export interface GameStoryProgress {
  introCompleted: boolean;
  currentAct: StoryActId;
  discoveredArtifacts: string[];
  completedObjectives: string[];
  levelProgress: LevelId;
}
