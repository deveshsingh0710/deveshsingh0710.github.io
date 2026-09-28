import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ThermometerThreadProps {
  scrollProgress: number; // 0.0 to 1.0
}

const TOTAL_DEPTH = 24.0;

const MILESTONES = [
  { y: -6.0, label: "01 // QUANTUM", color: "#38bdf8" },
  { y: -12.0, label: "02 // VISION", color: "#10b981" },
  { y: -18.0, label: "03 // HEALTH", color: "#06b6d4" },
  { y: -23.5, label: "04 // CONTACT", color: "#fbbf24" },
];

export function ThermometerThread({ scrollProgress }: ThermometerThreadProps) {
  const mercuryFillRef = useRef<THREE.Mesh>(null);
  const pulseHeadRef = useRef<THREE.Mesh>(null);
  const headLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const currentY = -scrollProgress * TOTAL_DEPTH;

    // Fluid laser fill
    if (mercuryFillRef.current) {
      const height = Math.max(scrollProgress * TOTAL_DEPTH, 0.01);
      mercuryFillRef.current.scale.set(1, height, 1);
      mercuryFillRef.current.position.y = -height / 2 - 1.35;
    }

    // High-energy optical pulse head
    if (pulseHeadRef.current) {
      pulseHeadRef.current.position.y = currentY - 1.35;
      const s = 1 + Math.sin(t * 12) * 0.2;
      pulseHeadRef.current.scale.set(s, s, s);
    }

    if (headLightRef.current) {
      headLightRef.current.position.y = currentY - 1.35;
      headLightRef.current.intensity = 3.5 + Math.sin(t * 8) * 0.8;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Precision Hollow Glass Optical Guide (Slim & Elegant) */}
      <mesh position={[0, -TOTAL_DEPTH / 2 - 1.35, 0]}>
        <cylinderGeometry args={[0.025, 0.025, TOTAL_DEPTH, 16]} />
        <meshPhysicalMaterial
          color="#062016"
          roughness={0.05}
          metalness={0.1}
          transmission={0.88}
          thickness={0.2}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* 2. Fluid Laser Core (Fills smoothly with scroll) */}
      <mesh ref={mercuryFillRef} position={[0, -1.35, 0]}>
        <cylinderGeometry args={[0.016, 0.016, 1, 16]} />
        <meshStandardMaterial
          color="#d1fae5"
          emissive="#10b981"
          emissiveIntensity={3.5}
          roughness={0.1}
        />
      </mesh>

      {/* 3. The Leading Optical Spark */}
      <mesh ref={pulseHeadRef} position={[0, -1.35, 0]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#6ee7b7"
          emissiveIntensity={5.0}
        />
      </mesh>

      <pointLight ref={headLightRef} position={[0, -1.35, 0.4]} color="#34d399" intensity={3.5} distance={3.5} />

      {/* 4. Precision Milestone Nodes */}
      {MILESTONES.map((m, idx) => {
        const isReached = scrollProgress >= Math.abs(m.y) / TOTAL_DEPTH;
        return (
          <group key={idx} position={[0, m.y - 1.35, 0]}>
            {/* Minimalist Glass Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.2, 0.01, 16, 32]} />
              <meshStandardMaterial
                color={isReached ? m.color : '#1e293b'}
                emissive={isReached ? m.color : '#020617'}
                emissiveIntensity={isReached ? 2.0 : 0.1}
              />
            </mesh>

            {/* Core Optical Bead */}
            <mesh>
              <sphereGeometry args={[0.045, 16, 16]} />
              <meshStandardMaterial
                color={isReached ? m.color : '#334155'}
                emissive={isReached ? m.color : '#000000'}
                emissiveIntensity={isReached ? 2.5 : 0}
              />
            </mesh>

            {isReached && (
              <pointLight color={m.color} intensity={2.0} distance={2.5} />
            )}
          </group>
        );
      })}
    </group>
  );
}
