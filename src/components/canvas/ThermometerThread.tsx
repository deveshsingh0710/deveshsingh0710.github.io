import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ThermometerThreadProps {
  scrollProgress: number; // 0.0 to 1.0
}

const TOTAL_DEPTH = 24.0; // Deep vertical span for generous spacing

const MILESTONES = [
  { y: -6.0, label: "01 // QUANTUM", color: "#38bdf8" },
  { y: -12.0, label: "02 // VISION", color: "#10b981" },
  { y: -18.0, label: "03 // HEALTH", color: "#06b6d4" },
  { y: -23.5, label: "04 // CONTACT", color: "#f59e0b" },
];

export function ThermometerThread({ scrollProgress }: ThermometerThreadProps) {
  const mercuryFillRef = useRef<THREE.Mesh>(null);
  const pulseHeadRef = useRef<THREE.Mesh>(null);
  const headLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Current filled depth based on scroll progress
    const currentY = -scrollProgress * TOTAL_DEPTH;

    // Scale and position the filled mercury beam
    if (mercuryFillRef.current) {
      const height = Math.max(scrollProgress * TOTAL_DEPTH, 0.01);
      mercuryFillRef.current.scale.set(1, height, 1);
      mercuryFillRef.current.position.y = -height / 2 - 1.2;
    }

    // Lead pulse head
    if (pulseHeadRef.current) {
      pulseHeadRef.current.position.y = currentY - 1.2;
      const s = 1 + Math.sin(t * 10) * 0.25;
      pulseHeadRef.current.scale.set(s, s, s);
    }

    if (headLightRef.current) {
      headLightRef.current.position.y = currentY - 1.2;
      headLightRef.current.intensity = 3.5 + Math.sin(t * 8) * 1.0;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. The Hollow Glass Tube (Thermometer Rail Housing) */}
      <mesh position={[0, -TOTAL_DEPTH / 2 - 1.2, 0]}>
        <cylinderGeometry args={[0.07, 0.07, TOTAL_DEPTH, 16]} />
        <meshPhysicalMaterial
          color="#04140f"
          roughness={0.1}
          metalness={0.2}
          transmission={0.8}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* 2. The Filled Mercury / Laser Beam (Grows down with scroll) */}
      <mesh ref={mercuryFillRef} position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 1, 16]} />
        <meshStandardMaterial
          color="#a7f3d0"
          emissive="#10b981"
          emissiveIntensity={2.5}
          roughness={0.1}
        />
      </mesh>

      {/* 3. The Traveling Pulse Head */}
      <mesh ref={pulseHeadRef} position={[0, -1.2, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#34d399"
          emissiveIntensity={4.0}
        />
      </mesh>

      <pointLight ref={headLightRef} position={[0, -1.2, 0.5]} color="#34d399" intensity={3.5} distance={4} />

      {/* 4. Milestone Nodes along the Thermometer Rail */}
      {MILESTONES.map((m, idx) => {
        const isReached = scrollProgress >= Math.abs(m.y) / TOTAL_DEPTH;
        return (
          <group key={idx} position={[0, m.y - 1.2, 0]}>
            {/* Outer milestone ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.3, 0.02, 16, 32]} />
              <meshStandardMaterial
                color={isReached ? m.color : '#1e293b'}
                emissive={isReached ? m.color : '#0f172a'}
                emissiveIntensity={isReached ? 1.5 : 0.2}
              />
            </mesh>

            {/* Core milestone bead */}
            <mesh>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial
                color={isReached ? m.color : '#334155'}
                emissive={isReached ? m.color : '#000000'}
                emissiveIntensity={isReached ? 2.0 : 0}
              />
            </mesh>

            {isReached && (
              <pointLight color={m.color} intensity={1.5} distance={3} />
            )}
          </group>
        );
      })}
    </group>
  );
}
