import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface IntroPopUpProps {
  unfoldProgress: number;
}

export function IntroPopUp({ unfoldProgress }: IntroPopUpProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (ring1Ref.current) ring1Ref.current.rotation.x = t * 0.8;
    if (ring2Ref.current) ring2Ref.current.rotation.y = t * 0.6;
    if (ring3Ref.current) ring3Ref.current.rotation.z = t * 0.5;

    if (coreRef.current) {
      const s = 1 + Math.sin(t * 3) * 0.1;
      coreRef.current.scale.set(s, s, s);
    }

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.15;
    }
  });

  return (
    <group
      ref={groupRef}
      scale={[unfoldProgress, unfoldProgress, unfoldProgress]}
      position={[0, unfoldProgress * 0.9, 0]}
    >
      {/* 3D Paper Stand Base */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.2, 2.4]} />
        <meshStandardMaterial
          color="#1e1b18"
          roughness={0.8}
          metalness={0.2}
          transparent
          opacity={0.8 * unfoldProgress}
        />
      </mesh>

      <gridHelper args={[4, 16, '#eab308', '#292524']} position={[0, 0.01, 0]} />

      {/* Rotating Gold Gyroscope / Astrolabe Rings */}
      <group position={[0, 0.8, 0]}>
        {/* Ring 1 */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[0.9, 0.025, 16, 64]} />
          <meshStandardMaterial
            color="#eab308"
            emissive="#ca8a04"
            emissiveIntensity={0.3}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Ring 2 */}
        <mesh ref={ring2Ref}>
          <torusGeometry args={[0.7, 0.025, 16, 64]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#d97706"
            emissiveIntensity={0.3}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Ring 3 */}
        <mesh ref={ring3Ref}>
          <torusGeometry args={[0.5, 0.02, 16, 64]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#b45309"
            emissiveIntensity={0.3}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Glowing Crystal Core */}
        <mesh ref={coreRef}>
          <octahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial
            color="#fef08a"
            emissive="#eab308"
            emissiveIntensity={1.2}
            metalness={0.5}
            roughness={0.1}
          />
        </mesh>

        <pointLight color="#eab308" intensity={1.8 * unfoldProgress} distance={2.5} />
      </group>
    </group>
  );
}
