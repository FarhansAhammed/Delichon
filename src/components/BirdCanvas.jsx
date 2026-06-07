import { Suspense, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, PerspectiveCamera, Cloud, Clouds } from '@react-three/drei';
import * as THREE from 'three';

/* ─────────────────────────────────────────────
   1. "D" ELEMENT — Loaded from user GLB
   ───────────────────────────────────────────── */
function DElement({ progress }) {
  const groupRef = useRef();
  const { scene } = useGLTF('/3d/D.glb');

  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = new THREE.MeshPhysicalMaterial({
          color: "#172135",
          roughness: 0.18,
          metalness: 0.8,
          transparent: true,
          reflectivity: 1.0,
          clearcoat: 1.0,
          clearcoatRoughness: 0.01
        });
      }
    });
    return clone;
  }, [scene]);

  useFrame(() => {
    if (groupRef.current) {
      const p = progress.current;
      const exitProgress = THREE.MathUtils.smoothstep(p, 0.02, 0.15);

      // Animation Logic
      groupRef.current.position.y = 0.20 + exitProgress * 14;
      groupRef.current.position.z = -1.6 - exitProgress * 6;

      groupRef.current.traverse((child) => {
        if (child.isMesh) {
          child.material.opacity = 1.0 - exitProgress;
        }
      });
    }
  });

  return (
    <primitive
      ref={groupRef}
      object={clonedScene}
      position={[2.5, 0.5, -1.0]}
      rotation={[0.00, -0.00, 0]}
      scale={4.0}
    />
  );
}

/* ─────────────────────────────────────────────
   2. SYMBOL BACKGROUND — Behind the "D"
   ───────────────────────────────────────────── */
function SymbolBackground({ progress }) {
  const groupRef = useRef();
  const color = "#5fb2ff"; // Premium sky blue

  useFrame(() => {
    if (groupRef.current) {
      const p = progress.current;
      const exitProgress = THREE.MathUtils.smoothstep(p, 0.02, 0.15);

      // Mirror DElement movement precisely
      groupRef.current.position.y = 0.20 + exitProgress * 14;
      groupRef.current.position.z = -1.65 - exitProgress * 6;

      // Handle opacity fade out with scroll
      groupRef.current.traverse((child) => {
        if (child.material) {
          child.material.opacity = (1.0 - exitProgress) * 0.45;
        }
      });
    }
  });

  return (
    <group ref={groupRef} position={[2.5, 0.2, -1.65]} scale={3.4}>
      {/* Outer Ring */}
      <mesh>
        <torusGeometry args={[0.85, 0.005, 16, 100]} />
        <meshBasicMaterial color={color} transparent />
      </mesh>

      {/* Vertical & Horizontal Spokes (Segmented, broken center) */}
      {[0, Math.PI / 2].map((rot, i) => (
        <group key={`main-${i}`} rotation-z={rot}>
          <mesh position={[0.7, 0, 0]}>
            <boxGeometry args={[0.4, 0.005, 0.005]} />
            <meshBasicMaterial color={color} transparent />
          </mesh>
          <mesh position={[-0.7, 0, 0]}>
            <boxGeometry args={[0.4, 0.005, 0.005]} />
            <meshBasicMaterial color={color} transparent />
          </mesh>
          {/* Outer Dots */}
          <mesh position={[0.9, 0, 0]}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshBasicMaterial color={color} transparent />
          </mesh>
          <mesh position={[-0.9, 0, 0]}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshBasicMaterial color={color} transparent />
          </mesh>
        </group>
      ))}

      {/* Diagonal Spokes (Shorter segments, broken center) */}
      {[Math.PI / 4, Math.PI * 0.75].map((rot, i) => (
        <group key={`diag-${i}`} rotation-z={rot}>
          <mesh position={[0.8, 0, 0]}>
            <boxGeometry args={[0.15, 0.005, 0.005]} />
            <meshBasicMaterial color={color} transparent />
          </mesh>
          <mesh position={[-0.8, 0, 0]}>
            <boxGeometry args={[0.15, 0.005, 0.005]} />
            <meshBasicMaterial color={color} transparent />
          </mesh>
          {/* Outer Dots */}
          <mesh position={[0.9, 0, 0]}>
            <sphereGeometry args={[0.015, 16, 16]} />
            <meshBasicMaterial color={color} transparent />
          </mesh>
          <mesh position={[-0.9, 0, 0]}>
            <sphereGeometry args={[0.015, 16, 16]} />
            <meshBasicMaterial color={color} transparent />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ─────────────────────────────────────────────
   3. BIRD — Original Model State
   ───────────────────────────────────────────── */
function BirdModel({ scrollProgress }) {
  const birdRef = useRef();
  const { scene, animations } = useGLTF('/3d/bird_v2.glb');
  const mixer = useRef();

  // Clone scene and set up bird materials inside useMemo before rendering
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          // Convert standard material to MeshPhysicalMaterial safely to support clearcoat gloss
          const mat = new THREE.MeshPhysicalMaterial();

          // Safely copy available properties from the source material
          const src = child.material;
          if (src.color) mat.color.copy(src.color);
          if (src.map) mat.map = src.map;
          if (src.normalMap) mat.normalMap = src.normalMap;
          if (src.normalScale && mat.normalScale) mat.normalScale.copy(src.normalScale);
          if (src.roughnessMap) mat.roughnessMap = src.roughnessMap;
          if (src.metalnessMap) mat.metalnessMap = src.metalnessMap;
          if (src.aoMap) mat.aoMap = src.aoMap;
          if (src.aoMapIntensity !== undefined) mat.aoMapIntensity = src.aoMapIntensity;
          if (src.emissive) mat.emissive.copy(src.emissive);
          if (src.emissiveMap) mat.emissiveMap = src.emissiveMap;
          if (src.emissiveIntensity !== undefined) mat.emissiveIntensity = src.emissiveIntensity;
          if (src.opacity !== undefined) mat.opacity = src.opacity;
          if (src.transparent !== undefined) mat.transparent = src.transparent;
          if (src.alphaMap) mat.alphaMap = src.alphaMap;

          child.material = mat;

          // Override default metallic properties to display base color textures correctly
          // and prevent environment reflections from washing out the base color,
          // while adding a highly glossy/reflective clearcoat on top.
          mat.metalness = 0.0;
          mat.roughness = 0.35; // Semi-gloss, less shiny plastic finish
          mat.clearcoat = 0.0; // Disable clearcoat entirely to remove the double-layer reflection
          mat.clearcoatRoughness = 0.0;
          mat.envMapIntensity = 0.2; // Further soften environment reflections
          mat.color.setHex(0xffffff); // Force color to white so texture color is fully preserved

          // Ensure colorSpace is correctly interpreted as sRGB
          if (mat.map) {
            mat.map.colorSpace = THREE.SRGBColorSpace;
          }

          mat.onBeforeCompile = (shader) => {
            shader.uniforms.uTime = { value: 0 };
            shader.vertexShader = 'uniform float uTime;\n' + shader.vertexShader;
            shader.vertexShader = shader.vertexShader.replace(
              '#include <begin_vertex>',
              `
              #include <begin_vertex>
              
              // 1. WINGS (X-axis flapping)
              float wingDist = abs(transformed.x);
              
              // Deadzone for the body. The further out on the X axis, the more it bends.
              float flapAmount = pow(max(wingDist - 0.15, 0.0), 1.2) * 1.4; 
              
              // Apply wing flap motion to Y (up and down)
              transformed.y += sin(uTime * 15.0) * flapAmount;
              
              // Slight aerodynamic twist to Z (forward/back) to simulate catching air
              transformed.z -= cos(uTime * 15.0) * flapAmount * 0.15;
              
              // 2. HEAD & TAIL (Z-axis natural flexing)
              float bodyZ = transformed.z;
              
              // Deadzone near the torso, applying gentle flex mainly to extremities
              float bodyFlex = pow(max(abs(bodyZ) - 0.1, 0.0), 1.2) * 0.08; 
              
              // Natural counter-balance bobbing to the wings
              // Phase delay (abs(bodyZ) * 1.5) creates a slight organic ripple effect
              transformed.y -= sin(uTime * 15.0 - abs(bodyZ) * 1.5) * bodyFlex; 
              
              // Very subtle look/swish left and right for realism
              transformed.x += sin(uTime * 4.0 + bodyZ * 2.0) * bodyFlex * 0.15;
              `
            );
            child.userData.shaderUniforms = shader.uniforms;
          };
          mat.needsUpdate = true;
          mat.customProgramCacheKey = () => Math.random().toString();
        }
      }
    });
    return clone;
  }, [scene]);

  useEffect(() => {
    // Play animations on the cloned scene
    if (animations && animations.length) {
      mixer.current = new THREE.AnimationMixer(clonedScene);
      const action = mixer.current.clipAction(animations[0]);
      action.setEffectiveTimeScale(0.12);
      action.play();
    }
  }, [animations, clonedScene]);

  // Perfectly balanced intersection with the lower horizontal bar of the "D"
  const currentPos = useRef(new THREE.Vector3(0.5, -0.2, 1.0));
  const heroPos = new THREE.Vector3(0.5, -0.2, 1.0);
  const heroRotY = Math.PI / 2.0; // Rotated a bit to the left

  useFrame((state, delta) => {
    if (mixer.current) mixer.current.update(delta);
    const t = state.clock.getElapsedTime();

    // Update shader time for the procedural bending by traversing the meshes of the clonedScene
    clonedScene.traverse((child) => {
      if (child.isMesh && child.userData.shaderUniforms && child.userData.shaderUniforms.uTime) {
        child.userData.shaderUniforms.uTime.value = t;
      }
    });

    if (birdRef.current) {
      const p = scrollProgress.current;

      // Stage Calculation: 4 transitions based on the image trail
      const stage = Math.min(Math.floor(p * 4), 3);
      const stageP = THREE.MathUtils.smoothstep((p * 4) % 1, 0, 1);

      let targetX, targetY, targetZ = 0.0;
      let targetRotY = heroRotY;
      let targetRotX = 0;
      let currentScale = 0.55;

      // Vertical Tracking: The bird moves UP with the content as the user scrolls DOWN.
      // This makes it "patrol" the sections as they pass by.
      const riseY = -7.5 + (p * 32);

      // X-Coordinates for gutters (Wider for modern screens)
      const rightX = 6.2;
      const leftX = -6.2;

      // Vertical Points: Cinematic "Lift-off" then steady descent down the viewport
      const yPoints = [heroPos.y, 1.6, 0.0, -1.6, -3.4];

      // ROTATION RULE: Face Inward
      const rotRight = Math.PI / 2;
      const rotLeft = -Math.PI / 2;

      // Calculate current targets based on stage
      targetY = THREE.MathUtils.lerp(yPoints[stage], yPoints[stage + 1], stageP);

      switch (stage) {
        case 0: // PHASE 1: D (Right) -> Left (Gutter)
          targetX = THREE.MathUtils.lerp(heroPos.x, leftX, stageP);
          targetRotY = THREE.MathUtils.lerp(heroRotY, rotRight, stageP);
          currentScale = THREE.MathUtils.lerp(1.2, 0.55, stageP);
          break;
        case 1: // PHASE 2: Left -> Right (Gutter)
          targetX = THREE.MathUtils.lerp(leftX, rightX, stageP);
          targetRotY = THREE.MathUtils.lerp(rotRight, rotLeft, stageP);
          targetRotX = Math.sin(stageP * Math.PI) * 0.15;
          break;
        case 2: // PHASE 3: Right -> Left (Gutter)
          targetX = THREE.MathUtils.lerp(rightX, leftX, stageP);
          targetRotY = THREE.MathUtils.lerp(rotLeft, rotRight - Math.PI * 2, stageP);
          targetRotX = Math.sin(stageP * Math.PI) * 0.15;
          break;
        case 3: // PHASE 4: Left -> Right (Gutter)
          targetX = THREE.MathUtils.lerp(leftX, rightX, stageP);
          targetRotY = THREE.MathUtils.lerp(rotRight - Math.PI * 2, rotLeft - Math.PI * 2, stageP);
          targetRotX = Math.sin(stageP * Math.PI) * 0.15;
          break;
      }

      // Life-like hover jitter
      const hoverX = Math.sin(t * 1.5) * 0.1;
      const hoverY = Math.cos(t * 1.8) * 0.08;

      currentPos.current.lerp(new THREE.Vector3(targetX + hoverX, targetY + hoverY, targetZ), 0.08);
      birdRef.current.position.copy(currentPos.current);

      // Smoothly approach the inward rotation
      birdRef.current.rotation.y = THREE.MathUtils.lerp(birdRef.current.rotation.y, targetRotY, 0.06);
      birdRef.current.rotation.x = THREE.MathUtils.lerp(birdRef.current.rotation.x, targetRotX, 0.06);

      birdRef.current.scale.setScalar(currentScale);
    }
  });

  return (
    <group ref={birdRef}>
      <primitive object={clonedScene} scale={3.8} rotation={[0, 0, 0]} castShadow />
    </group>
  );
}

/* ─────────────────────────────────────────────
   4. SCENE — Cinematic Environment
   ───────────────────────────────────────────── */
function Scene() {
  const scrollProgress = useRef(0);
  useEffect(() => {
    const handleScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.current = h > 0 ? window.scrollY / h : 0;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />

      {/* Premium Studio Lighting Setup (Bright & Beautiful) */}
      {/* 1. Hemisphere Light for a soft, natural sky/ground ambient illumination */}
      <hemisphereLight args={["#ffffff", "#e0e8ff", 1.2]} />

      {/* 2. Key Light (Front-Right-Top) to highlight the bird's face and side details beautifully */}
      <directionalLight position={[5, 8, 8]} intensity={1.8} castShadow />

      {/* 3. Fill Light (Front-Left-Bottom) to soften any crevices or under-body dark spots */}
      <directionalLight position={[-5, 2, 5]} intensity={1.0} />

      {/* 4. Back/Rim Light (Behind) to create beautiful highlight glows along the wings and feathers */}
      <directionalLight position={[0, 5, -10]} intensity={1.4} />

      {/* 5. Under Light (Bottom-Up) to ensure the belly and underside of the wings are bright and vibrant */}
      <directionalLight position={[0, -10, 0]} intensity={0.8} />

      {/* High-Precision Top Rim Highlight for the D element */}
      <spotLight
        position={[2.0, 15, -1.5]}
        intensity={10.0}
        angle={0.15}
        penumbra={0.3}
        color="#ffffff"
      />

      <SymbolBackground progress={scrollProgress} />
      <DElement progress={scrollProgress} />

      <Suspense fallback={null}>
        <BirdModel scrollProgress={scrollProgress} />
      </Suspense>

      <Environment preset="city" />
    </>
  );
}


export default function BirdCanvas({ eventSource }) {
  return (
    <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }} className="w-full h-full" eventSource={eventSource}>
      <Scene />
    </Canvas>
  );
}

useGLTF.preload('/3d/bird_v2.glb');
useGLTF.preload('/3d/D.glb');