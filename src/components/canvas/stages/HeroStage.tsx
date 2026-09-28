import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HeroStageProps {
  opacity: number;
}

export function HeroStage({ opacity }: HeroStageProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (coreRef.current) {
      coreRef.current.rotation.x = t * 0.25;
      coreRef.current.rotation.y = t * 0.35;
    }

    if (ring1Ref.current) ring1Ref.current.rotation.z = -t * 0.2;
    if (ring2Ref.current) ring2Ref.current.rotation.x = t * 0.15;

    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.12;
      // Parallax mouse tilt
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        state.pointer.x * 0.4,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -state.pointer.y * 0.2,
        0.05
      );
    }
  });

  if (opacity <= 0.01) return null;

  return (
    <group ref={groupRef} position={[2.5, 0, 0]} scale={[opacity, opacity, opacity]}>
      {/* Central Obsidian Monolith Core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshPhysicalMaterial
          color="#0b1311"
          emissive="#10b981"
          emissiveIntensity={0.25}
          roughness={0.15}
          metalness={0.85}
          reflectivity={0.9}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Core Wireframe Glow */}
      <mesh>
        <icosahedronGeometry args={[1.52, 0]} />
        <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.35 * opacity} />
      </mesh>

      {/* Outer Gyro Ring 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.3, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#059669"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Outer Gyro Ring 2 */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.7, 0.015, 16, 64]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Accent Point Lights */}
      <pointLight color="#10b981" intensity={2.5 * opacity} distance={5} />
      <pointLight color="#38bdf8" intensity={1.8 * opacity} distance={6} position={[1, 1, 1]} />
    </group>
  );
}
