import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TerminalStageProps {
  opacity: number;
}

export function TerminalStage({ opacity }: TerminalStageProps) {
  const groupRef = useRef<THREE.Group>(null);
  const monolithRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (monolithRef.current) {
      monolithRef.current.rotation.y = t * 0.2;
    }

    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.6) * 0.1;
      groupRef.current.rotation.y = state.pointer.x * 0.3;
      groupRef.current.rotation.x = -state.pointer.y * 0.15;
    }
  });

  if (opacity <= 0.01) return null;

  return (
    <group ref={groupRef} position={[2.2, 0, 0]} scale={[opacity, opacity, opacity]}>
      {/* Monolithic Server Blade */}
      <mesh ref={monolithRef}>
        <cylinderGeometry args={[1.2, 1.2, 3.8, 6]} />
        <meshPhysicalMaterial
          color="#091411"
          emissive="#10b981"
          emissiveIntensity={0.25}
          roughness={0.15}
          metalness={0.8}
          transmission={0.4}
          clearcoat={1}
          transparent
          opacity={0.9 * opacity}
        />
      </mesh>

      {/* Hex Wireframe Aura */}
      <mesh>
        <cylinderGeometry args={[1.22, 1.22, 3.82, 6]} />
        <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.3 * opacity} />
      </mesh>

      <pointLight position={[0, 0, 2]} color="#10b981" intensity={2.5 * opacity} distance={6} />
    </group>
  );
}
