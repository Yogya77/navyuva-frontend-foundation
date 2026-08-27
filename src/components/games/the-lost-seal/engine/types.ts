export type Direction = "up" | "down" | "left" | "right";

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface PlayerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  dir: Direction;
  isMoving: boolean;
  animFrame: number;
  animTimer: number;
  width: number;
  height: number;
}

export interface CameraState {
  x: number;
  y: number;
  viewportWidth: number;
  viewportHeight: number;
  targetX: number;
  targetY: number;
}

export type EntityType =
  | "pottery"
  | "tablet"
  | "crate"
  | "mound"
  | "marker"
  | "symbol_gate"
  | "storage_jars"
  | "textile_bales"
  | "wall_shrine"
  | "floor_cache"
  | "steatite_seal";

export interface InteractiveEntity {
  id: string;
  type: EntityType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  icon: string;
  promptLabel: string;
  zone: string;
  isInspected: boolean;
  requiredStage?: number;
}

export interface TorchLight {
  x: number;
  y: number;
  radius: number;
  color: string;
  flicker: number;
}

export interface DustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export interface GateState {
  id: string;
  isOpen: boolean;
  progress: number; // 0 (closed) to 1 (open)
}
