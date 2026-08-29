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
  private playerHeight = 1.8;
  private stepHeight = 0.48; // Max height of steps/curbs character can smoothly step up

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
        Math.min(1.0, this.acceleration * dt * 0.28),
      );
      this.state.velocity.z = THREE.MathUtils.lerp(
        currentSpeedZ,
        targetVz,
        Math.min(1.0, this.acceleration * dt * 0.28),
      );

      // Smoothly rotate character toward actual movement heading with responsive angular lerp
      const targetAngle = Math.atan2(moveDirX, moveDirZ);
      let angleDiff = targetAngle - this.state.direction;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      this.state.direction += angleDiff * Math.min(1.0, dt * 18);

      this.state.isMoving = true;
    } else {
      this.state.velocity.x = THREE.MathUtils.lerp(
        currentSpeedX,
        0,
        Math.min(1.0, this.friction * dt * 0.42),
      );
      this.state.velocity.z = THREE.MathUtils.lerp(
        currentSpeedZ,
        0,
        Math.min(1.0, this.friction * dt * 0.42),
      );
      if (Math.hypot(this.state.velocity.x, this.state.velocity.z) < 0.04) {
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

    // 4. Determine Dynamic Ground Elevation (Stairs / Platforms / Stepped Altars)
    const currentX = this.state.position.x;
    const currentZ = this.state.position.z;
    const currentY = this.state.position.y;

    let targetGroundY = 0;
    for (const col of colliders) {
      if (col.isWalkable !== false && col.maxY !== undefined) {
        if (
          currentX >= col.minX - 0.12 &&
          currentX <= col.maxX + 0.12 &&
          currentZ >= col.minZ - 0.12 &&
          currentZ <= col.maxZ + 0.12
        ) {
          // If player is on or near the step surface
          if (currentY >= col.maxY - this.stepHeight - 0.1) {
            targetGroundY = Math.max(targetGroundY, col.maxY);
          }
        }
      }
    }

    // 5. 3D Collision Detection & Step-Up Traversal
    const nextX = currentX + this.state.velocity.x * dt;
    const nextZ = currentZ + this.state.velocity.z * dt;
    let nextY = currentY + this.state.velocity.y * dt;

    // Helper: Check if a collider blocks horizontal movement at player's current height
    const isSolidBlocker = (col: BoxCollider3D, testX: number, testZ: number): boolean => {
      // Check horizontal AABB overlap
      const overlapX = testX + this.playerRadius > col.minX && testX - this.playerRadius < col.maxX;
      const overlapZ = testZ + this.playerRadius > col.minZ && testZ - this.playerRadius < col.maxZ;
      if (!overlapX || !overlapZ) return false;

      // If it's a walkable step within stepHeight, allow smooth step-up
      if (col.isWalkable && col.maxY !== undefined) {
        if (col.maxY <= currentY + this.stepHeight + 0.05) {
          return false; // Walkable step, do not block horizontally
        }
      }

      // Check vertical 3D height overlap
      const colMinY = col.minY ?? 0;
      const colMaxY = col.maxY ?? 100;
      const playerFeet = currentY;
      const playerHead = currentY + this.playerHeight;

      const overlapY = playerHead > colMinY && playerFeet < colMaxY;
      return overlapY;
    };

    // Check X collision against colliders (Wall-sliding supported)
    let canMoveX = true;
    for (const col of colliders) {
      if (isSolidBlocker(col, nextX, currentZ)) {
        canMoveX = false;
        this.state.velocity.x = 0;
        break;
      }
    }
    if (canMoveX) this.state.position.x = nextX;

    // Check Z collision against colliders
    let canMoveZ = true;
    for (const col of colliders) {
      if (isSolidBlocker(col, this.state.position.x, nextZ)) {
        canMoveZ = false;
        this.state.velocity.z = 0;
        break;
      }
    }
    if (canMoveZ) this.state.position.z = nextZ;

    // Re-evaluate ground elevation after horizontal movement (for smooth step-up)
    let stepUpGroundY = 0;
    for (const col of colliders) {
      if (col.isWalkable !== false && col.maxY !== undefined) {
        if (
          this.state.position.x >= col.minX - 0.12 &&
          this.state.position.x <= col.maxX + 0.12 &&
          this.state.position.z >= col.minZ - 0.12 &&
          this.state.position.z <= col.maxZ + 0.12
        ) {
          if (this.state.position.y >= col.maxY - this.stepHeight - 0.1) {
            stepUpGroundY = Math.max(stepUpGroundY, col.maxY);
          }
        }
      }
    }
    targetGroundY = Math.max(targetGroundY, stepUpGroundY);

    // 6. Ground & Vertical Position Resolution
    if (nextY <= targetGroundY) {
      this.state.position.y = targetGroundY;
      this.state.velocity.y = 0;
      this.state.isGrounded = true;
      this.state.isJumping = false;
    } else {
      // If walking up a step, smoothly step up if grounded
      if (this.state.isGrounded && targetGroundY > this.state.position.y) {
        this.state.position.y = THREE.MathUtils.lerp(this.state.position.y, targetGroundY, Math.min(1.0, dt * 25));
        this.state.velocity.y = 0;
      } else {
        this.state.position.y = nextY;
        this.state.isGrounded = false;
      }
    }

    // 7. Update Animation State
    if (!this.state.isGrounded) {
      this.state.animState = this.state.velocity.y > 0 ? "jump" : "fall";
    } else if (this.state.isMoving) {
      this.state.animState = this.state.isRunning ? "run" : "walk";
    } else {
      this.state.animState = "idle";
    }
  }
}

