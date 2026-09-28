import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function DevPass3D() {
  const cardGroupRef = useRef<THREE.Group>(null);
  const holoMeshRef = useRef<THREE.Mesh>(null);

  // Generate ultra-sharp, photorealistic canvas texture for the card face
  const cardTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Deep luxury dark titanium / carbon gradient
    const grad = ctx.createLinearGradient(0, 0, 1024, 640);
    grad.addColorStop(0, '#040d0a');
    grad.addColorStop(0.5, '#071611');
    grad.addColorStop(1, '#020605');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 640);

    // Subtle brushed metal grain lines
    ctx.fillStyle = 'rgba(16, 185, 129, 0.03)';
    for (let i = 0; i < 640; i += 3) {
      ctx.fillRect(0, i, 1024, 1);
    }

    // Outer security border
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.35)';
    ctx.lineWidth = 4;
    ctx.strokeRect(32, 32, 960, 576);

    // Banknote Guilloche security wave pattern in background
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
    ctx.lineWidth = 1.5;
    for (let j = 0; j < 5; j++) {
      ctx.beginPath();
      for (let x = 32; x < 992; x += 10) {
        const y = 320 + Math.sin(x * 0.02 + j * 0.8) * 80 + Math.cos(x * 0.01) * 30;
        if (x === 32) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Top Header: System & ID
    ctx.fillStyle = '#34d399';
    ctx.font = '600 24px monospace';
    ctx.fillText('IDENTITY PROTOCOL // ZERO-TRUST', 60, 80);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 20px monospace';
    ctx.fillText('ID: ML-0710-DS', 800, 80);

    // Gold Neural Chip Simulation
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(60, 120, 140, 110);
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 3;
    ctx.strokeRect(60, 120, 140, 110);

    ctx.fillStyle = '#b45309';
    ctx.fillRect(95, 120, 20, 110);
    ctx.fillRect(145, 120, 20, 110);
    ctx.fillRect(60, 170, 140, 15);

    // Full Name (Massive, luxury engraved typography)
    ctx.fillStyle = '#f8fafc';
    ctx.font = '700 56px "Cinzel", serif';
    ctx.fillText('DEVESH SINGH', 60, 310);

    // Role & Specialties
    ctx.fillStyle = '#10b981';
    ctx.font = '600 28px monospace';
    ctx.fillText('MACHINE LEARNING ENGINEER', 60, 360);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '400 22px monospace';
    ctx.fillText('COMPUTATIONAL PHYSICS • COMPUTER VISION • DISTRIBUTED AI', 60, 410);

    // GitHub & Access Verification footer
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '500 22px monospace';
    ctx.fillText('@deveshsingh0710', 60, 540);

    ctx.fillStyle = '#34d399';
    ctx.font = '700 20px monospace';
    ctx.fillText('● SYSTEM STATUS: ONLINE', 640, 540);

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 16;
    return tex;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (cardGroupRef.current) {
      // 3D Parallax tilt tracking mouse cursor with weighted spring damping
      const targetRotX = -state.pointer.y * 0.45;
      const targetRotY = state.pointer.x * 0.55;

      cardGroupRef.current.rotation.x = THREE.MathUtils.lerp(cardGroupRef.current.rotation.x, targetRotX, 0.08);
      cardGroupRef.current.rotation.y = THREE.MathUtils.lerp(cardGroupRef.current.rotation.y, targetRotY, 0.08);
      cardGroupRef.current.position.y = Math.sin(t * 1.5) * 0.08;
    }

    // Holographic thin-film rainbow iridescence responding to angle & cursor
    if (holoMeshRef.current) {
      const mat = holoMeshRef.current.material as THREE.MeshPhysicalMaterial;
      const hue = ((state.pointer.x * 0.6 + state.pointer.y * 0.6 + t * 0.12) % 1 + 1) % 1;
      mat.color.setHSL(hue, 0.85, 0.55);
      mat.emissive.setHSL(hue, 0.9, 0.45);
    }
  });

  return (
    <group ref={cardGroupRef} position={[0, 0, 0]}>
      {/* 3D Titanium Chassis with Front Textured Plate */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4.2, 2.62, 0.08]} />
        <meshPhysicalMaterial
          map={cardTexture}
          roughness={0.18}
          metalness={0.8}
          clearcoat={1.0}
          clearcoatRoughness={0.04}
          reflectivity={0.9}
        />
      </mesh>

      {/* Chamfered Metallic Emerald Edge Glow */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4.22, 2.64, 0.082]} />
        <meshBasicMaterial color="#10b981" wireframe transparent opacity={0.3} />
      </mesh>

      {/* Iridescent Holographic Security Foil Strip (Thin-film reflection) */}
      <mesh ref={holoMeshRef} position={[1.4, 0, 0.045]}>
        <planeGeometry args={[0.9, 2.4]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.6}
          roughness={0.08}
          metalness={0.95}
          clearcoat={1.0}
          reflectivity={1.0}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Bottom Anchor Socket (Where the Precision Rail begins) */}
      <group position={[0, -1.31, 0]}>
        <mesh>
          <cylinderGeometry args={[0.12, 0.12, 0.18, 16]} />
          <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={1.2} />
        </mesh>
        <pointLight color="#34d399" intensity={3.0} distance={3} />
      </group>

      {/* Card Lighting Setup */}
      <pointLight position={[0, 2, 2.5]} color="#ecfdf5" intensity={2.5} distance={5} />
      <pointLight position={[-2, -1, 1.8]} color="#10b981" intensity={2.0} distance={4} />
      <pointLight position={[2, -1, 1.8]} color="#38bdf8" intensity={1.8} distance={4} />
    </group>
  );
}
