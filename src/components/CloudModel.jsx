import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function CloudModel({ position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0], floatIntensity = 1, speed = 1 }) {
  const groupRef = useRef();
  const { scene } = useGLTF('/3d/cloud_test.glb');

  // Apply a soft, airy cloud material
  React.useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = new THREE.MeshStandardMaterial({
          color: "#ffffff",
          roughness: 0.8,
          metalness: 0.0,
          transparent: true,
          opacity: 0.9,
          emissive: "#ffffff",
          emissiveIntensity: 0.05
        });
      }
    });
  }, [scene]);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime() * speed;
      
      // Gentle floating and rotation
      groupRef.current.rotation.y = rotation[1] + Math.sin(t * 0.2) * 0.1;
      groupRef.current.rotation.z = rotation[2] + Math.cos(t * 0.3) * 0.05;
      groupRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.1 * floatIntensity;
    }
  });

  return (
    <primitive 
      ref={groupRef} 
      object={scene} 
      position={position} 
      scale={scale} 
      rotation={rotation} 
    />
  );
}

useGLTF.preload('/3d/cloud_test.glb');
