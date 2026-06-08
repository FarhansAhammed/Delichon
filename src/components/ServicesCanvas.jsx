"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function drawBoxFront(ctx) {
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 1024, 1024);

  // Borders
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 12;
  ctx.strokeRect(40, 40, 944, 944);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.strokeRect(64, 64, 896, 896);

  // Diamonds
  ctx.beginPath();
  ctx.moveTo(64, 64 - 16); ctx.lineTo(64 + 16, 64); ctx.lineTo(64, 64 + 16); ctx.lineTo(64 - 16, 64);
  ctx.closePath(); ctx.fillStyle = '#38bdf8'; ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(960, 64 - 16); ctx.lineTo(960 + 16, 64); ctx.lineTo(960, 64 + 16); ctx.lineTo(960 - 16, 64);
  ctx.closePath(); ctx.fillStyle = '#38bdf8'; ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(64, 960 - 16); ctx.lineTo(64 + 16, 960); ctx.lineTo(64, 960 + 16); ctx.lineTo(64 - 16, 960);
  ctx.closePath(); ctx.fillStyle = '#38bdf8'; ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(960, 960 - 16); ctx.lineTo(960 + 16, 960); ctx.lineTo(960, 960 + 16); ctx.lineTo(960 - 16, 960);
  ctx.closePath(); ctx.fillStyle = '#38bdf8'; ctx.fill();

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 72px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('DELICHON', 512, 370);

  ctx.font = 'bold 30px sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('DIGITAL ENGINEERING', 512, 470);

  // Central emblem
  ctx.save();
  ctx.translate(512, 710);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 130, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.strokeStyle = '#ffffff';
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.arc(0, 0, 104, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Draw 8-pointed star in center
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    let angle = (i * Math.PI) / 4;
    ctx.lineTo(512 + Math.cos(angle) * 90, 710 + Math.sin(angle) * 90);
    let nextAngle = angle + Math.PI / 8;
    ctx.lineTo(512 + Math.cos(nextAngle) * 36, 710 + Math.sin(nextAngle) * 36);
  }
  ctx.closePath();
  ctx.fill();
}

export default function ServicesCanvas() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xf8fafc, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.6);
    dirLight.position.set(6, 10, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 20;
    scene.add(dirLight);

    const boxLight = new THREE.PointLight(0x38bdf8, 1.5, 6);
    scene.add(boxLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.5);
    fillLight.position.set(-5, 3, -2);
    scene.add(fillLight);

    // Ground Shadow Catcher
    const bgGeometry = new THREE.PlaneGeometry(100, 100);
    const bgMaterial = new THREE.ShadowMaterial({ opacity: 0.1 });
    const bgPlane = new THREE.Mesh(bgGeometry, bgMaterial);
    bgPlane.position.z = -0.6;
    bgPlane.receiveShadow = true;
    scene.add(bgPlane);

    // --- BLUE PARTICLE SYSTEM ---
    const particleCount = 100;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 12;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 6 - 1;
      
      velocities.push({
        x: (Math.random() - 0.5) * 0.002,
        y: (Math.random() * 0.001) + 0.001,
        z: (Math.random() - 0.5) * 0.001
      });
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    function createParticleTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      grad.addColorStop(0, 'rgba(56, 189, 248, 1)'); // Sky Blue
      grad.addColorStop(0.3, 'rgba(56, 189, 248, 0.5)');
      grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 16, 16);
      return new THREE.CanvasTexture(canvas);
    }

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.12,
      map: createParticleTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // --- BOX CREATION ---
    const boxGroup = new THREE.Group();
    const boxThickness = 0.05;
    const boxWidth = 1.34;
    const boxHeight = 1.84;
    const boxDepth = 0.54;

    const boxBodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // dark slate
      roughness: 0.6,
      metalness: 0.1
    });

    const boxFrontCanvas = document.createElement('canvas');
    boxFrontCanvas.width = 1024;
    boxFrontCanvas.height = 1024;
    drawBoxFront(boxFrontCanvas.getContext('2d'));
    const boxFrontTexture = new THREE.CanvasTexture(boxFrontCanvas);
    
    boxFrontTexture.minFilter = THREE.LinearFilter;
    boxFrontTexture.magFilter = THREE.LinearFilter;
    boxFrontTexture.generateMipmaps = false;
    boxFrontTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const boxFrontFaceMaterial = new THREE.MeshStandardMaterial({
      map: boxFrontTexture,
      roughness: 0.45,
      metalness: 0.2
    });

    function createBoxPanel(w, h, d, x, y, z, materials) {
      const geo = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geo, materials || boxBodyMaterial);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      boxGroup.add(mesh);
    }

    createBoxPanel(boxWidth, boxHeight, boxThickness, 0, 0, -boxDepth / 2);
    createBoxPanel(boxThickness, boxHeight, boxDepth, -boxWidth / 2, 0, 0);
    createBoxPanel(boxThickness, boxHeight, boxDepth, boxWidth / 2, 0, 0);
    createBoxPanel(boxWidth, boxThickness, boxDepth, 0, -boxHeight / 2, 0);

    const frontMaterials = [
      boxBodyMaterial, boxBodyMaterial,
      boxBodyMaterial, boxBodyMaterial,
      boxFrontFaceMaterial, boxBodyMaterial
    ];
    createBoxPanel(boxWidth, boxHeight, boxThickness, 0, 0, boxDepth / 2, frontMaterials);
    scene.add(boxGroup);

    // --- RESPONSIVE LAYOUT ---
    function updateLayout() {
      const rect = containerRef.current.getBoundingClientRect();
      const aspect = rect.width / rect.height;

      renderer.setSize(rect.width, rect.height);
      camera.aspect = aspect;
      camera.updateProjectionMatrix();

      if (window.innerWidth < 1024) { // Mobile portrait view
        boxGroup.position.set(0, -3.2, 0);
        boxGroup.rotation.set(0.35, 0, 0);
        boxLight.position.set(0, -3.2, 1.5);
        camera.position.set(0, 0.0, 8.5);
      } else { // Desktop landscape view
        boxGroup.position.set(-2.5, -1.6, 0);
        boxGroup.rotation.set(0.2, 0.45, -0.12);
        boxLight.position.set(-2.5, -1.6, 1.5);
        camera.position.set(0, 0, 5.8);
      }
    }

    updateLayout();

    // --- RENDER LOOP ---
    const clock = new THREE.Clock();
    let frameId;

    const tick = () => {
      frameId = requestAnimationFrame(tick);

      const time = clock.getElapsedTime();

      // Box float
      boxGroup.position.y += Math.sin(time * 1.8) * 0.0012;
      boxLight.position.y = boxGroup.position.y;

      // Particles drift
      particles.rotation.y = time * 0.012;
      particles.rotation.x = time * 0.006;

      const posAttr = particleGeometry.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        let y = posAttr.getY(i);
        let x = posAttr.getX(i);
        let z = posAttr.getZ(i);

        y += velocities[i].y;
        x += velocities[i].x;
        z += velocities[i].z;

        if (y > 5) {
          y = -5;
          x = (Math.random() - 0.5) * 12;
        }
        posAttr.setY(i, y);
        posAttr.setX(i, x);
        posAttr.setZ(i, z);
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    tick();

    // --- RESIZE ---
    const handleResize = () => {
      updateLayout();
    };

    window.addEventListener('resize', handleResize);

    // --- CLEANUP ---
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      
      bgGeometry.dispose();
      bgMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      boxFrontTexture.dispose();
      boxFrontFaceMaterial.dispose();
      boxBodyMaterial.dispose();

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
