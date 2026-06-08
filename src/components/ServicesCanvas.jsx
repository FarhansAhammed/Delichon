"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const cardData = [
  {
    id: '01',
    title: 'Front-End Development',
    desc: 'High-performance, accessible, and interactive user interfaces built with React, Next.js, and modern tools for flawless digital experiences.',
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'
  },
  {
    id: '02',
    title: 'Full-Stack Development',
    desc: 'End-to-end web applications engineered with secure backend systems, database scalability, and robust cloud integration.',
    icon: 'M4 7v10c0 2 16 2 16 0V7c0-2-16-2-16 0z M4 12c0 2 16 2 16 0'
  },
  {
    id: '03',
    title: 'Custom Software Development',
    desc: 'Tailored business applications and enterprise software platforms designed to solve complex operations and scale with your growth.',
    icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 5h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2z'
  },
  {
    id: '04',
    title: 'Android & iOS Applications',
    desc: 'Native and cross-platform mobile app development delivering premium user experiences on both iOS and Android devices.',
    icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z'
  },
  {
    id: '05',
    title: 'UI/UX Design',
    desc: 'Strategic user-experience architecture and sophisticated interface designs that blend minimalism with clear customer journeys.',
    icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
  },
  {
    id: '06',
    title: 'Product Engineering',
    desc: 'Complete digital product engineering from conceptual blueprint to cloud architecture, deployment, and long-term maintenance.',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
  }
];

// Helper functions for 2D Canvas Drawing
function roundRect(ctx, x, y, width, height, radius) {
  if (ctx.roundRect) {
    ctx.roundRect(x, y, width, height, radius);
  } else {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}

function drawDiamond(ctx, cx, cy, size, color = '#38bdf8') {
  ctx.beginPath();
  ctx.moveTo(cx, cy - size);
  ctx.lineTo(cx + size, cy);
  ctx.lineTo(cx, cy + size);
  ctx.lineTo(cx - size, cy);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function drawTinyStar(ctx, cx, cy, inner, outer, p, color = '#38bdf8') {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  let step = Math.PI / p;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outer);
  for (let i = 0; i < p; i++) {
    x = cx + Math.cos(rot) * outer;
    y = cy + Math.sin(rot) * outer;
    ctx.lineTo(x, y);
    rot += step;
    x = cx + Math.cos(rot) * inner;
    y = cy + Math.sin(rot) * inner;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outer);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function drawEightPointedStar(ctx, cx, cy, outer, inner, color = '#38bdf8') {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    let angle = (i * Math.PI) / 4;
    ctx.lineTo(cx + Math.cos(angle) * outer, cy + Math.sin(angle) * outer);
    let nextAngle = angle + Math.PI / 8;
    ctx.lineTo(cx + Math.cos(nextAngle) * inner, cy + Math.sin(nextAngle) * inner);
  }
  ctx.closePath();
  ctx.fill();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  for (let n = 0; n < words.length; n++) {
    let testLine = line + words[n] + ' ';
    let metrics = ctx.measureText(testLine);
    let testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
  return currentY;
}

function drawCardFront(ctx, title, desc, id, iconPath) {
  // Background (1024x1536)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 1024, 1536);

  // Borders
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 8;
  ctx.beginPath();
  roundRect(ctx, 24, 24, 976, 1488, 48);
  ctx.stroke();

  ctx.strokeStyle = '#f1f5f9';
  ctx.lineWidth = 3;
  ctx.beginPath();
  roundRect(ctx, 44, 44, 936, 1448, 36);
  ctx.stroke();

  // ID Number at top
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 52px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(id, 512, 120);

  // Top line divider
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(360, 170);
  ctx.lineTo(664, 170);
  ctx.stroke();

  // Draw the SVG Icon (scaled up)
  ctx.save();
  ctx.translate(512, 350);
  ctx.scale(5.0, 5.0);
  ctx.translate(-12, -12); // Center the 24x24 path
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke(new Path2D(iconPath));
  ctx.restore();

  // Title
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 58px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, 512, 640);

  // Description
  ctx.fillStyle = '#475569';
  ctx.font = '500 32px sans-serif';
  ctx.textAlign = 'center';
  wrapText(ctx, desc, 512, 760, 820, 52);

  // Bottom divider
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(360, 1200);
  ctx.lineTo(664, 1200);
  ctx.stroke();

  // ArrowRight
  ctx.save();
  ctx.translate(512, 1300);
  ctx.scale(3.6, 3.6);
  ctx.translate(-12, -12);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke(new Path2D("M5 12h14M12 5l7 7-7 7"));
  ctx.restore();
}

function drawCardBack(ctx) {
  // Background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 1024, 1536);

  // Double border
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 8;
  ctx.beginPath();
  roundRect(ctx, 24, 24, 976, 1488, 48);
  ctx.stroke();

  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  roundRect(ctx, 44, 44, 936, 1448, 36);
  ctx.stroke();

  // Corner stars
  drawTinyStar(ctx, 90, 90, 10, 24, 4, '#38bdf8');
  drawTinyStar(ctx, 934, 90, 10, 24, 4, '#38bdf8');
  drawTinyStar(ctx, 90, 1446, 10, 24, 4, '#38bdf8');
  drawTinyStar(ctx, 934, 1446, 10, 24, 4, '#38bdf8');

  ctx.save();
  ctx.translate(512, 768);

  // Concentric detailed rings
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 260, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(0, 0, 230, 0, Math.PI * 2);
  ctx.stroke();

  ctx.save();
  ctx.setLineDash([12, 12]);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 190, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Interlocked geometric diamonds
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, -170);
  ctx.lineTo(170, 0);
  ctx.lineTo(0, 170);
  ctx.lineTo(-170, 0);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, -120);
  ctx.lineTo(120, 0);
  ctx.lineTo(0, 120);
  ctx.lineTo(-120, 0);
  ctx.closePath();
  ctx.stroke();

  // Central Mandala
  drawEightPointedStar(ctx, 0, 0, 90, 32, '#38bdf8');
  ctx.fillStyle = '#ffffff';
  drawTinyStar(ctx, 0, 0, 12, 30, 8, '#ffffff');

  ctx.restore();
}

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
  drawDiamond(ctx, 64, 64, 16, '#38bdf8');
  drawDiamond(ctx, 960, 64, 16, '#38bdf8');
  drawDiamond(ctx, 64, 960, 16, '#38bdf8');
  drawDiamond(ctx, 960, 960, 16, '#38bdf8');

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

  drawEightPointedStar(ctx, 512, 710, 90, 36, '#38bdf8');
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
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 20;
    dirLight.shadow.bias = -0.0008;
    scene.add(dirLight);

    const boxLight = new THREE.PointLight(0x38bdf8, 1.5, 6);
    boxLight.position.set(-2.5, -1.6, 1.5);
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
    
    // Texture optimizations for high quality
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

    // --- CARDS CREATION (Scaled up from 1.12x1.68 to 1.30x1.95) ---
    const cardMeshesGroup = [];
    const cardWidth = 1.30;
    const cardHeight = 1.95;
    const cardThickness = 0.025;

    // Shared Card Back Texture (High-res 1024x1536)
    const backCanvas = document.createElement('canvas');
    backCanvas.width = 1024;
    backCanvas.height = 1536;
    drawCardBack(backCanvas.getContext('2d'));
    const backTexture = new THREE.CanvasTexture(backCanvas);
    
    // Texture quality optimizations
    backTexture.minFilter = THREE.LinearFilter;
    backTexture.magFilter = THREE.LinearFilter;
    backTexture.generateMipmaps = false;
    backTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // Glossy clearcoat physical material
    const backMaterial = new THREE.MeshPhysicalMaterial({
      map: backTexture,
      roughness: 0.25,
      metalness: 0.05,
      clearcoat: 0.4,
      clearcoatRoughness: 0.1
    });

    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0, // silver edge
      roughness: 0.2,
      metalness: 0.8
    });

    cardData.forEach((data, index) => {
      const frontCanvas = document.createElement('canvas');
      frontCanvas.width = 1024;
      frontCanvas.height = 1536;
      drawCardFront(frontCanvas.getContext('2d'), data.title, data.desc, data.id, data.icon);

      const frontTexture = new THREE.CanvasTexture(frontCanvas);
      
      // Texture quality optimizations
      frontTexture.minFilter = THREE.LinearFilter;
      frontTexture.magFilter = THREE.LinearFilter;
      frontTexture.generateMipmaps = false;
      frontTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

      const frontMaterial = new THREE.MeshPhysicalMaterial({
        map: frontTexture,
        roughness: 0.2,
        metalness: 0.05,
        clearcoat: 0.4,
        clearcoatRoughness: 0.1
      });

      const materials = [
        edgeMaterial, edgeMaterial, // sides
        edgeMaterial, edgeMaterial, // top/bottom
        frontMaterial, backMaterial // front/back
      ];

      const geom = new THREE.BoxGeometry(cardWidth, cardHeight, cardThickness);
      const cardMesh = new THREE.Mesh(geom, materials);
      cardMesh.castShadow = true;
      cardMesh.receiveShadow = true;
      cardMesh.name = "card_mesh_" + index;

      const cardGroup = new THREE.Group();
      cardGroup.name = "card_group_" + index;
      cardGroup.add(cardMesh);

      scene.add(cardGroup);
      cardMeshesGroup.push(cardGroup);
    });

    // --- RESPONSIVE LAYOUT & TARGET COORDINATES ---
    let cardTargets = [];
    let isMobile = false;

    function updateLayout() {
      const rect = containerRef.current.getBoundingClientRect();
      const aspect = rect.width / rect.height;
      cardTargets = [];

      renderer.setSize(rect.width, rect.height);
      camera.aspect = aspect;
      camera.updateProjectionMatrix();

      if (window.innerWidth < 1024) { // Mobile portrait view
        isMobile = true;
        
        // 3 rows, 2 columns layout - spaced safely for 1.30x1.95 cards
        const colX = [-0.8, 0.8];
        const rowY = [2.2, 0.0, -2.2];

        cardTargets.push({ x: colX[0], y: rowY[0] });
        cardTargets.push({ x: colX[1], y: rowY[0] });
        cardTargets.push({ x: colX[0], y: rowY[1] });
        cardTargets.push({ x: colX[1], y: rowY[1] });
        cardTargets.push({ x: colX[0], y: rowY[2] });
        cardTargets.push({ x: colX[1], y: rowY[2] });

        boxGroup.position.set(0, -3.2, 0);
        boxGroup.rotation.set(0.35, 0, 0);
        boxLight.position.set(0, -3.2, 1.5);
        
        // Pull camera slightly back on mobile to fit the tall layout
        camera.position.set(0, 0.0, 8.5);
      } else { // Desktop landscape view
        isMobile = false;
        
        // 2 rows, 3 columns layout - spaced safely for 1.30x1.95 cards
        const colX = [-1.8, 0, 1.8];
        const rowY = [1.2, -1.2];

        cardTargets.push({ x: colX[0], y: rowY[0] }); 
        cardTargets.push({ x: colX[1], y: rowY[0] }); 
        cardTargets.push({ x: colX[2], y: rowY[0] }); 
        cardTargets.push({ x: colX[0], y: rowY[1] }); 
        cardTargets.push({ x: colX[1], y: rowY[1] }); 
        cardTargets.push({ x: colX[2], y: rowY[1] }); 

        boxGroup.position.set(-2.5, -1.6, 0);
        boxGroup.rotation.set(0.2, 0.45, -0.12);
        boxLight.position.set(-2.5, -1.6, 1.5);

        // Bring camera closer to make text large and razor-sharp
        camera.position.set(0, 0, 5.8);
      }
    }

    updateLayout();

    // --- TIMELINE SETUP ---
    let scrollTimeline;

    function buildTimeline() {
      if (scrollTimeline) {
        scrollTimeline.kill();
      }

      cardMeshesGroup.forEach((cardGroup, index) => {
        cardGroup.position.copy(boxGroup.position);
        cardGroup.rotation.copy(boxGroup.rotation);

        const zOffset = (index - 2.5) * 0.045;
        cardGroup.translateZ(zOffset);
        cardGroup.translateY(-0.1);
      });

      scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".services-scroll-track",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.4,
          invalidateOnRefresh: true,
        }
      });

      // Box opens
      scrollTimeline.to(boxGroup.rotation, {
        x: boxGroup.rotation.x + 0.12,
        duration: 0.6,
        ease: "power1.inOut"
      }, 0);

      let currentVal = 0.5;

      // Animate Row 1
      for (let i = 0; i < 3; i++) {
        const cardGroup = cardMeshesGroup[i];
        const target = cardTargets[i];

        scrollTimeline.to(cardGroup.position, {
          x: target.x,
          z: i * 0.015,
          duration: 2.2,
          ease: "power2.inOut"
        }, currentVal);

        scrollTimeline.to(cardGroup.position, {
          y: isMobile ? 3.0 : 2.2,
          duration: 1.1,
          ease: "sine.out"
        }, currentVal);

        scrollTimeline.to(cardGroup.position, {
          y: target.y,
          duration: 1.1,
          ease: "sine.in"
        }, currentVal + 1.1);

        scrollTimeline.to(cardGroup.rotation, {
          x: 0,
          y: Math.PI,
          z: 0,
          duration: 2.2,
          ease: "power2.out"
        }, currentVal);

        currentVal += 0.75;
      }

      currentVal += 0.8;

      // Flip Row 1 face-up
      for (let i = 0; i < 3; i++) {
        const cardGroup = cardMeshesGroup[i];

        scrollTimeline.to(cardGroup.rotation, {
          y: 0,
          duration: 1.3,
          ease: "back.out(1.4)"
        }, currentVal + i * 0.28);

        scrollTimeline.to(cardGroup.position, {
          z: 0.65,
          duration: 0.65,
          ease: "power2.out"
        }, currentVal + i * 0.28);

        scrollTimeline.to(cardGroup.position, {
          z: i * 0.015,
          duration: 0.65,
          ease: "power2.in"
        }, currentVal + i * 0.28 + 0.65);
      }

      currentVal += 2.0;

      // Animate Row 2
      for (let i = 3; i < 6; i++) {
        const cardGroup = cardMeshesGroup[i];
        const target = cardTargets[i];

        scrollTimeline.to(cardGroup.position, {
          x: target.x,
          z: i * 0.015,
          duration: 2.2,
          ease: "power2.inOut"
        }, currentVal);

        scrollTimeline.to(cardGroup.position, {
          y: isMobile ? 2.5 : 1.7,
          duration: 1.1,
          ease: "sine.out"
        }, currentVal);

        scrollTimeline.to(cardGroup.position, {
          y: target.y,
          duration: 1.1,
          ease: "sine.in"
        }, currentVal + 1.1);

        scrollTimeline.to(cardGroup.rotation, {
          x: 0,
          y: Math.PI,
          z: 0,
          duration: 2.2,
          ease: "power2.out"
        }, currentVal);

        currentVal += 0.75;
      }

      currentVal += 0.8;

      // Flip Row 2 face-up
      for (let i = 3; i < 6; i++) {
        const cardGroup = cardMeshesGroup[i];

        scrollTimeline.to(cardGroup.rotation, {
          y: 0,
          duration: 1.3,
          ease: "back.out(1.4)"
        }, currentVal + (i - 3) * 0.28);

        scrollTimeline.to(cardGroup.position, {
          z: 0.65,
          duration: 0.65,
          ease: "power2.out"
        }, currentVal + (i - 3) * 0.28);

        scrollTimeline.to(cardGroup.position, {
          z: i * 0.015,
          duration: 0.65,
          ease: "power2.in"
        }, currentVal + (i - 3) * 0.28 + 0.65);
      }
    }

    buildTimeline();

    // --- INTERACTION HOVER TILT ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredCardMesh = null;

    const meshesToIntersect = cardMeshesGroup.map(group => group.children[0]);

    const handleMouseMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(meshesToIntersect);

      if (intersects.length > 0) {
        const mesh = intersects[0].object;
        const idx = meshesToIntersect.indexOf(mesh);
        const parentGroup = cardMeshesGroup[idx];

        const angleMod = Math.abs(parentGroup.rotation.y % (Math.PI * 2));
        if (angleMod < 0.25 || angleMod > (Math.PI * 2 - 0.25)) {
          hoveredCardMesh = mesh;
        } else {
          hoveredCardMesh = null;
        }
      } else {
        hoveredCardMesh = null;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // --- RENDER LOOP ---
    const clock = new THREE.Clock();
    let frameId;

    const tick = () => {
      frameId = requestAnimationFrame(tick);

      const time = clock.getElapsedTime();

      // Box float
      boxGroup.position.y += Math.sin(time * 1.8) * 0.0012;
      boxLight.position.y = boxGroup.position.y;

      // Particles
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

      // Card Tilting
      cardMeshesGroup.forEach((group) => {
        const mesh = group.children[0];

        if (mesh === hoveredCardMesh) {
          const targetX = mouse.y * 0.26;
          const targetY = -mouse.x * 0.26;
          const targetZ = -mouse.x * 0.06;

          mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, targetX, 0.08);
          mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, targetY, 0.08);
          mesh.rotation.z = THREE.MathUtils.lerp(mesh.rotation.z, targetZ, 0.08);
          mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, 0.16, 0.08);
        } else {
          mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, 0, 0.1);
          mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, 0, 0.1);
          mesh.rotation.z = THREE.MathUtils.lerp(mesh.rotation.z, 0, 0.1);
          mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, 0, 0.1);
        }
      });

      renderer.render(scene, camera);
    };

    tick();

    // --- RESIZE ---
    const handleResize = () => {
      updateLayout();
      buildTimeline();
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    // --- CLEANUP ---
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (scrollTimeline) {
        scrollTimeline.kill();
      }

      bgGeometry.dispose();
      bgMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      boxFrontTexture.dispose();
      boxFrontFaceMaterial.dispose();
      boxBodyMaterial.dispose();
      backTexture.dispose();
      backMaterial.dispose();
      edgeMaterial.dispose();
      
      cardMeshesGroup.forEach((group) => {
        const mesh = group.children[0];
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => {
            if (mat.map) mat.map.dispose();
            mat.dispose();
          });
        } else {
          if (mesh.material.map) mesh.material.map.dispose();
          mesh.material.dispose();
        }
      });

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
