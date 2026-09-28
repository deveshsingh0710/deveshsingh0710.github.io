import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VisionStageProps {
  opacity: number;
}

export function VisionStage({ opacity }: VisionStageProps) {
  const groupRef = useRef<THREE.Group>(null);
  const laserRef = useRef<THREE.Mesh>(null);
  const target1Ref = useRef<THREE.Group>(null);
  const target2Ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (laserRef.current) {
      laserRef.current.position.y = Math.sin(t * 2.4) * 1.2;
    }

    if (target1Ref.current) {
      const s = 1 + Math.sin(t * 6) * 0.04;
      target1Ref.current.scale.set(s, s, s);
    }

    if (target2Ref.current) {
      const s = 1 + Math.cos(t * 5) * 0.04;
      target2Ref.current.scale.set(s, s, s);
    }

    if (groupRef.current) {
      groupRef.current.rotation.y = -0.25 + Math.sin(t * 0.4) * 0.08 + state.pointer.x * 0.2;
      groupRef.current.rotation.x = 0.08 - state.pointer.y * 0.15;
      groupRef.current.position.y = Math.sin(t * 0.6) * 0.08;
    }
  });

  if (opacity <= 0.01) return null;

  return (
    <group ref={groupRef} position={[2.2, 0, 0]} scale={[opacity, opacity, opacity]}>
      {/* Floating Dark Inspection Glass Slabs */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[5.2, 3.2, 0.3]} />
        <meshPhysicalMaterial
          color="#03140f"
          emissive="#064e3b"
          emissiveIntensity={0.2}
          roughness={0.15}
          metalness={0.1}
          transmission={0.85}
          thickness={1.0}
          transparent
          opacity={0.88 * opacity}
        />
      </mesh>

      {/* Frame Wireframe Edge */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[5.22, 3.22, 0.32]} />
        <meshBasicMaterial color="#10b981" wireframe transparent opacity={0.3 * opacity} />
      </mesh>

      {/* Sweeping Laser Scan Line */}
      <mesh ref={laserRef} position={[0, 0, 0.18]}>
        <planeGeometry args={[5.0, 0.04]} />
        <meshBasicMaterial color="#34d399" side={THREE.DoubleSide} transparent opacity={0.9 * opacity} />
      </mesh>

      {/* Laser Glow Light */}
      <pointLight position={[0, 0, 0.8]} color="#10b981" intensity={2.5 * opacity} distance={4} />

      {/* Target Bracket 1: OCR Text Box */}
      <group ref={target1Ref} position={[-0.8, 0.5, 0.16]}>
        <mesh>
          <planeGeometry args={[2.0, 0.6]} />
          <meshBasicMaterial color="#059669" transparent opacity={0.15 * opacity} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(2.0, 0.6)]} />
          <lineBasicMaterial color="#6ee7b7" linewidth={2} />
        </lineSegments>
      </group>

      {/* Target Bracket 2: Barcode / QR Box */}
      <group ref={target2Ref} position={[1.1, -0.4, 0.16]}>
        <mesh>
          <planeGeometry args={[1.2, 1.0]} />
          <meshBasicMaterial color="#0284c7" transparent opacity={0.15 * opacity} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(1.2, 1.0)]} />
          <lineBasicMaterial color="#38bdf8" linewidth={2} />
        </lineSegments>

        {/* 3D Barcode Slits */}
        {[-0.4, -0.25, -0.1, 0.05, 0.2, 0.35].map((xOff, idx) => (
          <mesh key={idx} position={[xOff, 0, 0.01]}>
            <planeGeometry args={[0.04, 0.7]} />
            <meshBasicMaterial color="#f8fafc" />
          </mesh>
        ))}
      </group>
    </group>
  );
}
