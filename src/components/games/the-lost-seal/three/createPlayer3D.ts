import * as THREE from "three";

export interface Player3DController {
  root: THREE.Group;
  updateAnimation: (dt: number, isMoving: boolean) => void;
  setDirection: (angleRad: number) => void;
  lanternLight: THREE.SpotLight;
}

export function createPlayer3D(): Player3DController {
  const root = new THREE.Group();
  root.position.set(5, 0, 0); // Spawn at Entrance

  // Materials
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xf3cca3, roughness: 0.6 });
  const coatMat = new THREE.MeshStandardMaterial({ color: 0xb8860b, roughness: 0.8 }); // Khaki safari jacket
  const pantsMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.9 }); // Dark brown trousers
  const bootMat = new THREE.MeshStandardMaterial({ color: 0x2b1d0c, roughness: 0.7 }); // Leather boots
  const leatherMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.5 }); // Belt / Satchel
  const hatMat = new THREE.MeshStandardMaterial({ color: 0x966919, roughness: 0.8 }); // Fedora hat
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.8,
    roughness: 0.3,
  });

  // 1. Torso
  const torsoGeo = new THREE.BoxGeometry(0.5, 0.6, 0.3);
  const torso = new THREE.Mesh(torsoGeo, coatMat);
  torso.position.y = 1.0;
  torso.castShadow = true;
  torso.receiveShadow = true;
  root.add(torso);

  // Belt
  const beltGeo = new THREE.BoxGeometry(0.52, 0.1, 0.32);
  const belt = new THREE.Mesh(beltGeo, leatherMat);
  belt.position.y = 0.75;
  belt.castShadow = true;
  root.add(belt);

  // Buckle
  const buckleGeo = new THREE.BoxGeometry(0.12, 0.08, 0.34);
  const buckle = new THREE.Mesh(buckleGeo, brassMat);
  buckle.position.set(0, 0.75, 0.01);
  root.add(buckle);

  // Satchel / Backpack on back
  const satchelGeo = new THREE.BoxGeometry(0.35, 0.4, 0.16);
  const satchel = new THREE.Mesh(satchelGeo, leatherMat);
  satchel.position.set(0.05, 0.95, -0.22);
  satchel.castShadow = true;
  root.add(satchel);

  // 2. Head & Neck
  const neckGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.12);
  const neck = new THREE.Mesh(neckGeo, skinMat);
  neck.position.y = 1.36;
  root.add(neck);

  const headGeo = new THREE.SphereGeometry(0.16, 16, 16);
  const head = new THREE.Mesh(headGeo, skinMat);
  head.position.y = 1.52;
  head.castShadow = true;
  root.add(head);

  // 3. Explorer Fedora / Pith Hat
  const hatBrimGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.02, 24);
  const hatBrim = new THREE.Mesh(hatBrimGeo, hatMat);
  hatBrim.position.y = 1.62;
  hatBrim.castShadow = true;
  root.add(hatBrim);

  const hatCrownGeo = new THREE.CylinderGeometry(0.18, 0.2, 0.18, 20);
  const hatCrown = new THREE.Mesh(hatCrownGeo, hatMat);
  hatCrown.position.y = 1.72;
  hatCrown.castShadow = true;
  root.add(hatCrown);

  // 4. Limbs (Hierarchical Pivots for Walking Animation)
  // Left Leg Pivot
  const leftLegPivot = new THREE.Group();
  leftLegPivot.position.set(-0.14, 0.7, 0);
  root.add(leftLegPivot);

  const legGeo = new THREE.BoxGeometry(0.16, 0.4, 0.18);
  const leftPants = new THREE.Mesh(legGeo, pantsMat);
  leftPants.position.y = -0.2;
  leftPants.castShadow = true;
  leftLegPivot.add(leftPants);

  const bootGeo = new THREE.BoxGeometry(0.18, 0.25, 0.24);
  const leftBoot = new THREE.Mesh(bootGeo, bootMat);
  leftBoot.position.set(0, -0.5, 0.04);
  leftBoot.castShadow = true;
  leftLegPivot.add(leftBoot);

  // Right Leg Pivot
  const rightLegPivot = new THREE.Group();
  rightLegPivot.position.set(0.14, 0.7, 0);
  root.add(rightLegPivot);

  const rightPants = new THREE.Mesh(legGeo, pantsMat);
  rightPants.position.y = -0.2;
  rightPants.castShadow = true;
  rightLegPivot.add(rightPants);

  const rightBoot = new THREE.Mesh(bootGeo, bootMat);
  rightBoot.position.set(0, -0.5, 0.04);
  rightBoot.castShadow = true;
  rightLegPivot.add(rightBoot);

  // Left Arm Pivot
  const leftArmPivot = new THREE.Group();
  leftArmPivot.position.set(-0.32, 1.25, 0);
  root.add(leftArmPivot);

  const armGeo = new THREE.BoxGeometry(0.12, 0.5, 0.14);
  const leftArm = new THREE.Mesh(armGeo, coatMat);
  leftArm.position.y = -0.25;
  leftArm.castShadow = true;
  leftArmPivot.add(leftArm);

  // Right Arm Pivot (holding lantern)
  const rightArmPivot = new THREE.Group();
  rightArmPivot.position.set(0.32, 1.25, 0);
  root.add(rightArmPivot);

  const rightArm = new THREE.Mesh(armGeo, coatMat);
  rightArm.position.y = -0.25;
  rightArm.castShadow = true;
  rightArmPivot.add(rightArm);

  // Brass Lantern in hand
  const lanternGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.16, 8);
  const lantern = new THREE.Mesh(lanternGeo, brassMat);
  lantern.position.set(0, -0.52, 0.15);
  lantern.castShadow = true;
  rightArmPivot.add(lantern);

  // Directional Light Beam from lantern
  const lanternLight = new THREE.SpotLight(0xfffaed, 2.5, 12, Math.PI / 4, 0.4, 1.2);
  lanternLight.position.set(0, 1.0, 0.2);
  lanternLight.castShadow = true;
  lanternLight.shadow.bias = -0.001;
  root.add(lanternLight);

  const lightTarget = new THREE.Object3D();
  lightTarget.position.set(0, 0.2, 5);
  root.add(lightTarget);
  lanternLight.target = lightTarget;

  // Animation state
  let animTimer = 0;

  const updateAnimation = (dt: number, isMoving: boolean) => {
    if (isMoving) {
      animTimer += dt * 10;
      const legSwing = Math.sin(animTimer) * 0.6;
      leftLegPivot.rotation.x = legSwing;
      rightLegPivot.rotation.x = -legSwing;

      const armSwing = Math.sin(animTimer) * 0.5;
      leftArmPivot.rotation.x = -armSwing;
      rightArmPivot.rotation.x = armSwing;

      // Torso slight bob
      torso.position.y = 1.0 + Math.abs(Math.sin(animTimer * 2)) * 0.04;
      head.position.y = 1.52 + Math.abs(Math.sin(animTimer * 2)) * 0.04;
      hatBrim.position.y = 1.62 + Math.abs(Math.sin(animTimer * 2)) * 0.04;
      hatCrown.position.y = 1.72 + Math.abs(Math.sin(animTimer * 2)) * 0.04;
    } else {
      // Idle breathing
      animTimer += dt * 2;
      leftLegPivot.rotation.x = THREE.MathUtils.lerp(leftLegPivot.rotation.x, 0, 0.1);
      rightLegPivot.rotation.x = THREE.MathUtils.lerp(rightLegPivot.rotation.x, 0, 0.1);
      leftArmPivot.rotation.x = THREE.MathUtils.lerp(leftArmPivot.rotation.x, 0, 0.1);
      rightArmPivot.rotation.x = THREE.MathUtils.lerp(rightArmPivot.rotation.x, 0, 0.1);

      const breath = Math.sin(animTimer) * 0.02;
      torso.position.y = 1.0 + breath;
      head.position.y = 1.52 + breath;
      hatBrim.position.y = 1.62 + breath;
      hatCrown.position.y = 1.72 + breath;
    }
  };

  const setDirection = (angleRad: number) => {
    root.rotation.y = angleRad;
  };

  return {
    root,
    updateAnimation,
    setDirection,
    lanternLight,
  };
}
