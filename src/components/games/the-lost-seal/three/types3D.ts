import type * as THREE from "three";

export type EntityType3D =
  | "marker"
  | "mound"
  | "pottery"
  | "tablet"
  | "crate"
  | "symbol_gate"
  | "storage_jars"
  | "textile_bales"
  | "wall_shrine"
  | "floor_cache"
  | "steatite_seal";

export interface InteractiveEntity3D {
  id: string;
  type: EntityType3D;
  name: string;
  position: THREE.Vector3;
  interactionRadius: number;
  promptLabel: string;
  zone: string;
  isInspected: boolean;
  mesh?: THREE.Object3D | undefined;
}

export interface BoxCollider3D {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  name?: string;
}

export interface GateState3D {
  id: string;
  isOpen: boolean;
  progress: number;
  doorMesh?: THREE.Mesh | undefined;
}
