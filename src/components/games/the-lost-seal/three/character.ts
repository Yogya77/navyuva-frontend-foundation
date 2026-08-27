import * as THREE from "three";

export interface StylizedPlayer {
  root: THREE.Group;
  lanternLight: THREE.SpotLight;
  lanternBulb: THREE.PointLight;
  updateAnimation: (dt: number, state: "idle" | "walk" | "run" | "jump" | "fall") => void;
  setHeading: (angleRad: number) => void;
}

export function createStylizedPlayer(): StylizedPlayer {
  const root = new THREE.Group();

  // Color Palette & Materials
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xf5cca0, roughness: 0.6 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x3d2716, roughness: 0.8 });
  const jacketMat = new THREE.MeshStandardMaterial({ color: 0xc8963e, roughness: 0.75 }); // Golden khaki coat
  const shirtMat = new THREE.MeshStandardMaterial({ color: 0xe8dec8, roughness: 0.8 }); // Off-white linen shirt
  const pantsMat = new THREE.MeshStandardMaterial({ color: 0x4a3b32, roughness: 0.85 }); // Rugged brown trousers
  const bootMat = new THREE.MeshStandardMaterial({ color: 0x2e1c11, roughness: 0.6 }); // Dark oiled leather boots
  const leatherMat = new THREE.MeshStandardMaterial({ color: 0x5a3118, roughness: 0.5 }); // Harness & satchel
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xe5b23d,
    roughness: 0.3,
    metalness: 0.8,
  });
  const hatMat = new THREE.MeshStandardMaterial({ color: 0x93652b, roughness: 0.75 });
  const hatBandMat = new THREE.MeshStandardMaterial({ color: 0x3a2114, roughness: 0.6 });

  // 1. Torso & Upper Body Group
  const upperBody = new THREE.Group();
  upperBody.position.y = 0.95;
  root.add(upperBody);

  // Inner Shirt
  const shirtGeo = new THREE.BoxGeometry(0.38, 0.48, 0.26);
  const shirt = new THREE.Mesh(shirtGeo, shirtMat);
  shirt.position.y = 0.1;
  shirt.castShadow = true;
  upperBody.add(shirt);

  // Field Jacket
  const jacketGeo = new THREE.BoxGeometry(0.44, 0.52, 0.3);
  const jacket = new THREE.Mesh(jacketGeo, jacketMat);
  jacket.position.y = 0.1;
  jacket.castShadow = true;
  jacket.receiveShadow = true;
  upperBody.add(jacket);

  // Jacket Collar
  const collarGeo = new THREE.BoxGeometry(0.3, 0.1, 0.34);
  const collar = new THREE.Mesh(collarGeo, jacketMat);
  collar.position.set(0, 0.35, 0);
  collar.castShadow = true;
  upperBody.add(collar);

  // Leather Utility Belt
  const beltGeo = new THREE.BoxGeometry(0.46, 0.09, 0.32);
  const belt = new THREE.Mesh(beltGeo, leatherMat);
  belt.position.set(0, -0.15, 0);
  belt.castShadow = true;
  upperBody.add(belt);

  // Belt Buckle
  const buckleGeo = new THREE.BoxGeometry(0.12, 0.08, 0.34);
  const buckle = new THREE.Mesh(buckleGeo, brassMat);
  buckle.position.set(0, -0.15, 0.01);
  upperBody.add(buckle);

  // Canteen Flask on Hip
  const flaskGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.14, 12);
  const flask = new THREE.Mesh(flaskGeo, brassMat);
  flask.position.set(-0.24, -0.15, 0.05);
  flask.rotation.z = Math.PI / 12;
  flask.castShadow = true;
  upperBody.add(flask);

  // Adventure Satchel on Back
  const satchelGeo = new THREE.BoxGeometry(0.32, 0.36, 0.16);
  const satchel = new THREE.Mesh(satchelGeo, leatherMat);
  satchel.position.set(0.08, 0.08, -0.22);
  satchel.castShadow = true;
  upperBody.add(satchel);

  // Satchel Flap
  const flapGeo = new THREE.BoxGeometry(0.34, 0.18, 0.18);
  const flap = new THREE.Mesh(flapGeo, leatherMat);
  flap.position.set(0.08, 0.2, -0.22);
  flap.castShadow = true;
  upperBody.add(flap);

  // 2. Head & Adventure Hat
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.46, 0);
  upperBody.add(headGroup);

  const headGeo = new THREE.SphereGeometry(0.18, 16, 16);
  const head = new THREE.Mesh(headGeo, skinMat);
  head.position.y = 0.1;
  head.castShadow = true;
  headGroup.add(head);

  // Hair Fringe
  const hairGeo = new THREE.SphereGeometry(0.19, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2);
  const hair = new THREE.Mesh(hairGeo, hairMat);
  hair.position.y = 0.12;
  headGroup.add(hair);

  // Fedora Hat Brim
  const hatBrimGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.025, 24);
  const hatBrim = new THREE.Mesh(hatBrimGeo, hatMat);
  hatBrim.position.set(0, 0.22, 0.02);
  hatBrim.rotation.x = -0.05;
  hatBrim.castShadow = true;
  headGroup.add(hatBrim);

  // Hat Band
  const hatBandGeo = new THREE.CylinderGeometry(0.205, 0.215, 0.04, 20);
  const hatBand = new THREE.Mesh(hatBandGeo, hatBandMat);
  hatBand.position.set(0, 0.25, 0.02);
  headGroup.add(hatBand);

  // Hat Crown (Creased Fedora Crown)
  const hatCrownGeo = new THREE.CylinderGeometry(0.18, 0.21, 0.18, 20);
  const hatCrown = new THREE.Mesh(hatCrownGeo, hatMat);
  hatCrown.position.set(0, 0.32, 0.02);
  hatCrown.castShadow = true;
  headGroup.add(hatCrown);

  // 3. Articulated Arms
  // Left Arm (Swings naturally)
  const leftArmPivot = new THREE.Group();
  leftArmPivot.position.set(-0.28, 0.32, 0);
  upperBody.add(leftArmPivot);

  const leftArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.44, 0.14), jacketMat);
  leftArmMesh.position.y = -0.2;
  leftArmMesh.castShadow = true;
  leftArmPivot.add(leftArmMesh);

  const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), skinMat);
  leftHand.position.y = -0.44;
  leftHand.castShadow = true;
  leftArmPivot.add(leftHand);

  // Right Arm (Holds the brass lantern)
  const rightArmPivot = new THREE.Group();
  rightArmPivot.position.set(0.28, 0.32, 0);
  upperBody.add(rightArmPivot);

  const rightArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.44, 0.14), jacketMat);
  rightArmMesh.position.y = -0.2;
  rightArmMesh.castShadow = true;
  rightArmPivot.add(rightArmMesh);

  const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), skinMat);
  rightHand.position.y = -0.44;
  rightHand.castShadow = true;
  rightArmPivot.add(rightHand);

  // Brass Lantern in Hand
  const lantern = new THREE.Group();
  lantern.position.set(0, -0.52, 0.12);
  rightArmPivot.add(lantern);

  const lanternCapGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.16, 8);
  const lanternCap = new THREE.Mesh(lanternCapGeo, brassMat);
  lanternCap.castShadow = true;
  lantern.add(lanternCap);

  // Light Source from Lantern
  const lanternBulb = new THREE.PointLight(0xffdf99, 1.6, 6, 1.4);
  lanternBulb.position.set(0, 0, 0);
  lantern.add(lanternBulb);

  const lanternLight = new THREE.SpotLight(0xfff5dd, 2.8, 16, Math.PI / 3.5, 0.5, 1.2);
  lanternLight.position.set(0, 0, 0.1);
  lanternLight.castShadow = true;
  lanternLight.shadow.bias = -0.001;
  lantern.add(lanternLight);

  const lanternTarget = new THREE.Object3D();
  lanternTarget.position.set(0, -0.5, 5);
  lantern.add(lanternTarget);
  lanternLight.target = lanternTarget;

  // 4. Articulated Legs
  // Left Leg Pivot
  const leftLegPivot = new THREE.Group();
  leftLegPivot.position.set(-0.13, 0.72, 0);
  root.add(leftLegPivot);

  const leftPants = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.44, 0.18), pantsMat);
  leftPants.position.y = -0.2;
  leftPants.castShadow = true;
  leftLegPivot.add(leftPants);

  const leftBoot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.28, 0.26), bootMat);
  leftBoot.position.set(0, -0.52, 0.04);
  leftBoot.castShadow = true;
  leftLegPivot.add(leftBoot);

  // Right Leg Pivot
  const rightLegPivot = new THREE.Group();
  rightLegPivot.position.set(0.13, 0.72, 0);
  root.add(rightLegPivot);

  const rightPants = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.44, 0.18), pantsMat);
  rightPants.position.y = -0.2;
  rightPants.castShadow = true;
  rightLegPivot.add(rightPants);

  const rightBoot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.28, 0.26), bootMat);
  rightBoot.position.set(0, -0.52, 0.04);
  rightBoot.castShadow = true;
  rightLegPivot.add(rightBoot);

  // Animation State
  let animTimer = 0;

  const updateAnimation = (dt: number, state: "idle" | "walk" | "run" | "jump" | "fall") => {
    if (state === "run") {
      animTimer += dt * 14;
      const legStride = Math.sin(animTimer) * 0.9;
      leftLegPivot.rotation.x = legStride;
      rightLegPivot.rotation.x = -legStride;

      const armStride = Math.sin(animTimer) * 0.8;
      leftArmPivot.rotation.x = -armStride;
      rightArmPivot.rotation.x = armStride * 0.6; // Lantern arm controlled

      upperBody.position.y = 0.95 + Math.abs(Math.sin(animTimer * 2)) * 0.06;
      upperBody.rotation.x = 0.15; // Lean into sprint
    } else if (state === "walk") {
      animTimer += dt * 8.5;
      const legStride = Math.sin(animTimer) * 0.6;
      leftLegPivot.rotation.x = legStride;
      rightLegPivot.rotation.x = -legStride;

      const armStride = Math.sin(animTimer) * 0.5;
      leftArmPivot.rotation.x = -armStride;
      rightArmPivot.rotation.x = armStride * 0.4;

      upperBody.position.y = 0.95 + Math.abs(Math.sin(animTimer * 2)) * 0.03;
      upperBody.rotation.x = 0.04;
    } else if (state === "jump") {
      // Jump pose
      leftLegPivot.rotation.x = THREE.MathUtils.lerp(leftLegPivot.rotation.x, -0.4, 0.2);
      rightLegPivot.rotation.x = THREE.MathUtils.lerp(rightLegPivot.rotation.x, 0.3, 0.2);
      leftArmPivot.rotation.x = THREE.MathUtils.lerp(leftArmPivot.rotation.x, -0.6, 0.2);
      upperBody.rotation.x = -0.1;
    } else if (state === "fall") {
      // Fall pose
      leftLegPivot.rotation.x = THREE.MathUtils.lerp(leftLegPivot.rotation.x, 0.2, 0.1);
      rightLegPivot.rotation.x = THREE.MathUtils.lerp(rightLegPivot.rotation.x, -0.2, 0.1);
      leftArmPivot.rotation.x = THREE.MathUtils.lerp(leftArmPivot.rotation.x, 0.4, 0.1);
      upperBody.rotation.x = 0.1;
    } else {
      // Idle breathing
      animTimer += dt * 2.5;
      leftLegPivot.rotation.x = THREE.MathUtils.lerp(leftLegPivot.rotation.x, 0, 0.1);
      rightLegPivot.rotation.x = THREE.MathUtils.lerp(rightLegPivot.rotation.x, 0, 0.1);
      leftArmPivot.rotation.x = THREE.MathUtils.lerp(leftArmPivot.rotation.x, 0, 0.1);
      rightArmPivot.rotation.x = THREE.MathUtils.lerp(rightArmPivot.rotation.x, 0, 0.1);

      const breath = Math.sin(animTimer) * 0.02;
      upperBody.position.y = 0.95 + breath;
      upperBody.rotation.x = 0;
    }
  };

  const setHeading = (angleRad: number) => {
    root.rotation.y = angleRad;
  };

  return {
    root,
    lanternLight,
    lanternBulb,
    updateAnimation,
    setHeading,
  };
}
