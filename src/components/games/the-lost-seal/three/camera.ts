import * as THREE from "three";
import type { BoxCollider3D } from "./types";

export class ThirdPersonCamera {
  public camera: THREE.PerspectiveCamera;
  private target: THREE.Vector3 = new THREE.Vector3();
  public currentPosition: THREE.Vector3 = new THREE.Vector3();
  public currentLookAt: THREE.Vector3 = new THREE.Vector3();

  // Orbit controls
  public yaw = 0; // Horizontal orbit angle (radians)
  public pitch = 0.38; // Vertical orbit angle (radians)
  public targetDistance = 6.2; // Desired distance
  public currentDistance = 6.2; // Actual distance after collision checks

  // Cinematic override state
  public isCinematic = false;

  private isDragging = false;
  private prevPointerX = 0;
  private prevPointerY = 0;

  constructor(aspect: number) {
    this.camera = new THREE.PerspectiveCamera(52, aspect, 0.1, 200);
  }

  public setCinematicTransform(pos: THREE.Vector3, lookAt: THREE.Vector3, dt: number) {
    this.isCinematic = true;
    const damp = Math.min(1.0, dt * 10);
    this.currentPosition.lerp(pos, damp);
    this.currentLookAt.lerp(lookAt, damp);
    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentLookAt);
  }

  public snapToThirdPerson(playerPos: THREE.Vector3, heading = Math.PI) {
    this.isCinematic = false;
    this.yaw = heading;
    this.pitch = 0.38;
    this.targetDistance = 6.2;
    this.currentDistance = 6.2;

    this.target.copy(playerPos);
    this.target.y += 1.35;

    const cosPitch = Math.cos(this.pitch);
    const sinPitch = Math.sin(this.pitch);
    const sinYaw = Math.sin(this.yaw);
    const cosYaw = Math.cos(this.yaw);

    this.currentPosition.set(
      this.target.x - sinYaw * cosPitch * this.currentDistance,
      Math.max(0.7, this.target.y + sinPitch * this.currentDistance),
      this.target.z - cosYaw * cosPitch * this.currentDistance,
    );
    this.currentLookAt.copy(this.target);

    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentLookAt);
  }

  public update(playerPos: THREE.Vector3, dt: number, colliders: BoxCollider3D[] = []) {
    if (this.isCinematic) return;

    this.target.copy(playerPos);
    this.target.y += 1.35; // Look at upper chest & head level

    // Calculate ideal camera position
    const cosPitch = Math.cos(this.pitch);
    const sinPitch = Math.sin(this.pitch);
    const sinYaw = Math.sin(this.yaw);
    const cosYaw = Math.cos(this.yaw);

    const idealOffsetX = -sinYaw * cosPitch * this.targetDistance;
    const idealOffsetY = sinPitch * this.targetDistance;
    const idealOffsetZ = -cosYaw * cosPitch * this.targetDistance;

    const idealPos = new THREE.Vector3(
      this.target.x + idealOffsetX,
      Math.max(0.7, this.target.y + idealOffsetY),
      this.target.z + idealOffsetZ,
    );

    // Collision check from player target to ideal camera position
    let adjustedDist = this.targetDistance;
    const rayDir = new THREE.Vector3().subVectors(idealPos, this.target).normalize();

    for (const col of colliders) {
      // Fast AABB intersection test
      const tMinX = (col.minX - this.target.x) / (rayDir.x || 0.00001);
      const tMaxX = (col.maxX - this.target.x) / (rayDir.x || 0.00001);
      const tMinZ = (col.minZ - this.target.z) / (rayDir.z || 0.00001);
      const tMaxZ = (col.maxZ - this.target.z) / (rayDir.z || 0.00001);

      const realMinX = Math.min(tMinX, tMaxX);
      const realMaxX = Math.max(tMinX, tMaxX);
      const realMinZ = Math.min(tMinZ, tMaxZ);
      const realMaxZ = Math.max(tMinZ, tMaxZ);

      const enterT = Math.max(realMinX, realMinZ);
      const exitT = Math.min(realMaxX, realMaxZ);

      if (enterT < exitT && enterT > 0.4 && enterT < adjustedDist) {
        adjustedDist = Math.max(2.2, enterT - 0.4);
      }
    }

    this.currentDistance = THREE.MathUtils.lerp(
      this.currentDistance,
      adjustedDist,
      Math.min(1.0, dt * 14),
    );

    const finalPos = new THREE.Vector3(
      this.target.x - sinYaw * cosPitch * this.currentDistance,
      Math.max(0.7, this.target.y + sinPitch * this.currentDistance),
      this.target.z - cosYaw * cosPitch * this.currentDistance,
    );

    // Smooth Lerp Damping
    const damp = Math.min(1.0, dt * 12);
    this.currentPosition.lerp(finalPos, damp);
    this.currentLookAt.lerp(this.target, damp);

    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentLookAt);
  }

  public onPointerDown(clientX: number, clientY: number) {
    this.isDragging = true;
    this.prevPointerX = clientX;
    this.prevPointerY = clientY;
  }

  public onPointerMove(clientX: number, clientY: number, sensitivity = 0.0055) {
    if (!this.isDragging) return;

    const dx = clientX - this.prevPointerX;
    const dy = clientY - this.prevPointerY;
    this.prevPointerX = clientX;
    this.prevPointerY = clientY;

    this.yaw -= dx * sensitivity;
    this.pitch += dy * sensitivity;

    // Pitch safety limits (prevent going underground or flipping)
    this.pitch = Math.max(0.08, Math.min(1.22, this.pitch));
  }

  public onPointerUp() {
    this.isDragging = false;
  }

  public onWheel(deltaY: number) {
    this.targetDistance += deltaY * 0.005;
    this.targetDistance = Math.max(3.2, Math.min(9.5, this.targetDistance));
  }

  public resize(aspect: number) {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }
}
