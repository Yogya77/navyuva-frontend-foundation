import * as THREE from "three";
import type { BoxCollider3D, PlayerPhysicsState } from "./types";

export class PlayerPhysicsController {
  public state: PlayerPhysicsState = {
    position: new THREE.Vector3(0, 0, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    direction: 0,
    isMoving: false,
    isRunning: false,
    isGrounded: true,
    isJumping: false,
    jumpTimer: 0,
    animState: "idle",
  };

  private gravity = -24.0;
  private jumpForce = 8.2;
  private walkSpeed = 5.0;
  private runSpeed = 8.8;
  private acceleration = 38.0;
  private friction = 30.0;
  private playerRadius = 0.42;

  public setSpawn(pos: THREE.Vector3, rot: number) {
    this.state.position.copy(pos);
    this.state.velocity.set(0, 0, 0);
    this.state.direction = rot;
    this.state.isGrounded = true;
    this.state.isJumping = false;
    this.state.animState = "idle";
  }

  public update(
    dt: number,
    keys: Record<string, boolean>,
    cameraYaw: number,
    colliders: BoxCollider3D[],
    isPaused: boolean,
    touchVector?: { x: number; y: number },
  ) {
    if (isPaused) {
      this.state.velocity.set(0, 0, 0);
      this.state.animState = "idle";
      return;
    }

    // 1. Calculate Camera-Relative Input Direction
    let inputForward = 0;
    let inputRight = 0;

    if (keys["w"] || keys["arrowup"]) inputForward += 1;
    if (keys["s"] || keys["arrowdown"]) inputForward -= 1;
    if (keys["d"] || keys["arrowright"]) inputRight += 1; // Strafe Right
    if (keys["a"] || keys["arrowleft"]) inputRight -= 1; // Strafe Left

    // Touch joystick input overlay
    if (touchVector && (touchVector.x !== 0 || touchVector.y !== 0)) {
      inputForward = touchVector.y;
      inputRight = touchVector.x;
    }

    const isRunning =
      (Boolean(keys["shift"]) || Boolean(keys["sprint"])) &&
      (inputForward !== 0 || inputRight !== 0);
    this.state.isRunning = isRunning;

    const targetSpeed = isRunning ? this.runSpeed : this.walkSpeed;

    // Movement Direction in Horizontal Plane (Camera Relative)
    let moveDirX = 0;
    let moveDirZ = 0;

    if (inputForward !== 0 || inputRight !== 0) {
      const len = Math.hypot(inputForward, inputRight);
      const normFwd = inputForward / len;
      const normRt = inputRight / len;

      const sinYaw = Math.sin(cameraYaw);
      const cosYaw = Math.cos(cameraYaw);

      // Camera view direction: (sinYaw, 0, cosYaw)
      // Camera right direction: (-cosYaw, 0, sinYaw)
      // W (Forward): moves along (sinYaw, cosYaw)
      // S (Backward): moves along (-sinYaw, -cosYaw)
      // D (Right): moves along (-cosYaw, sinYaw)
      // A (Left): moves along (cosYaw, -sinYaw)
      moveDirX = normFwd * sinYaw - normRt * cosYaw;
      moveDirZ = normFwd * cosYaw + normRt * sinYaw;
    }

    const isInputActive = moveDirX !== 0 || moveDirZ !== 0;

    // 2. Horizontal Velocity Integration & Friction
    const currentSpeedX = this.state.velocity.x;
    const currentSpeedZ = this.state.velocity.z;

    if (isInputActive) {
      const targetVx = moveDirX * targetSpeed;
      const targetVz = moveDirZ * targetSpeed;

      this.state.velocity.x = THREE.MathUtils.lerp(
        currentSpeedX,
        targetVx,
        Math.min(1.0, this.acceleration * dt * 0.22),
      );
      this.state.velocity.z = THREE.MathUtils.lerp(
        currentSpeedZ,
        targetVz,
        Math.min(1.0, this.acceleration * dt * 0.22),
      );

      // Smoothly rotate character toward actual movement heading
      const targetAngle = Math.atan2(moveDirX, moveDirZ);
      let angleDiff = targetAngle - this.state.direction;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      this.state.direction += angleDiff * Math.min(1.0, dt * 15);

      this.state.isMoving = true;
    } else {
      this.state.velocity.x = THREE.MathUtils.lerp(
        currentSpeedX,
        0,
        Math.min(1.0, this.friction * dt * 0.35),
      );
      this.state.velocity.z = THREE.MathUtils.lerp(
        currentSpeedZ,
        0,
        Math.min(1.0, this.friction * dt * 0.35),
      );
      if (Math.hypot(this.state.velocity.x, this.state.velocity.z) < 0.05) {
        this.state.velocity.x = 0;
        this.state.velocity.z = 0;
        this.state.isMoving = false;
      }
    }

    // 3. Jump & Vertical Gravity
    if (
      (keys[" "] || keys["space"] || keys["jump"]) &&
      this.state.isGrounded &&
      !this.state.isJumping
    ) {
      this.state.velocity.y = this.jumpForce;
      this.state.isGrounded = false;
      this.state.isJumping = true;
    }

    // Apply gravity
    this.state.velocity.y += this.gravity * dt;

    // 4. Collision Detection & Position Integration
    const nextX = this.state.position.x + this.state.velocity.x * dt;
    const nextZ = this.state.position.z + this.state.velocity.z * dt;
    const nextY = this.state.position.y + this.state.velocity.y * dt;

    // Check X collision against colliders
    let canMoveX = true;
    for (const col of colliders) {
      if (
        nextX + this.playerRadius > col.minX &&
        nextX - this.playerRadius < col.maxX &&
        this.state.position.z + this.playerRadius > col.minZ &&
        this.state.position.z - this.playerRadius < col.maxZ
      ) {
        canMoveX = false;
        this.state.velocity.x = 0;
        break;
      }
    }
    if (canMoveX) this.state.position.x = nextX;

    // Check Z collision against colliders
    let canMoveZ = true;
    for (const col of colliders) {
      if (
        this.state.position.x + this.playerRadius > col.minX &&
        this.state.position.x - this.playerRadius < col.maxX &&
        nextZ + this.playerRadius > col.minZ &&
        nextZ - this.playerRadius < col.maxZ
      ) {
        canMoveZ = false;
        this.state.velocity.z = 0;
        break;
      }
    }
    if (canMoveZ) this.state.position.z = nextZ;

    // Check Ground / Y Collision
    if (nextY <= 0) {
      this.state.position.y = 0;
      this.state.velocity.y = 0;
      this.state.isGrounded = true;
      this.state.isJumping = false;
    } else {
      this.state.position.y = nextY;
      this.state.isGrounded = false;
    }

    // 5. Update Animation State
    if (!this.state.isGrounded) {
      this.state.animState = this.state.velocity.y > 0 ? "jump" : "fall";
    } else if (this.state.isMoving) {
      this.state.animState = this.state.isRunning ? "run" : "walk";
    } else {
      this.state.animState = "idle";
    }
  }
}
