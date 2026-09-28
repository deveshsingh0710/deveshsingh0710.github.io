import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface HeroInteractive3DProps {
  scrollProgress: number; // 0.0 to 1.0
}

export function HeroInteractive3D({ scrollProgress }: HeroInteractive3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Smoothly track mouse cursor pointer for attractive interactive tilt
    const targetRotX = -state.pointer.y * 0.45;
    const targetRotY = state.pointer.x * 0.6;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.06);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.06);

    const t = state.clock.getElapsedTime();

    // Rotate gimbal rings at subtle varied speeds
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.4;
      ring1Ref.current.rotation.x = t * 0.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.35;
      ring2Ref.current.rotation.z = t * 0.15;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = -t * 0.25;
      ring3Ref.current.rotation.y = t * 0.3;
    }

    // Gentle pulse on inner core
    if (coreRef.current) {
      const pulse = 1 + Math.sin(t * 3) * 0.08;
      coreRef.current.scale.set(pulse, pulse, pulse);
      coreRef.current.rotation.y = t * 0.5;
    }

    // Scroll fade out: as user leaves hero (scroll > 0.08), smoothly shrink and fade upward
    const heroFactor = THREE.MathUtils.clamp(1 - scrollProgress * 6.5, 0, 1);
    groupRef.current.scale.setScalar(heroFactor * 1.0);
    groupRef.current.position.y = 0.2 + (1 - heroFactor) * 2.5; // floats up when scrolling away
  });

  return (
    <group ref={groupRef} position={[2.0, 0.2, 0]}>
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        {/* 1. Inner Glowing Holographic ML Neural Core */}
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[0.7, 1]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#059669"
            emissiveIntensity={1.8}
            wireframe
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* 2. Inner Solid Energy Kernel */}
        <mesh>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshStandardMaterial
            color="#34d399"
            emissive="#10b981"
            emissiveIntensity={3.2}
            roughness={0.1}
          />
        </mesh>

        {/* 3. Outer Gyroscopic Gimbal Rings (Cursor responsive) */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[1.15, 0.02, 16, 100]} />
          <meshStandardMaterial
            color="#6ee7b7"
            emissive="#10b981"
            emissiveIntensity={1.2}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        <mesh ref={ring2Ref}>
          <torusGeometry args={[1.35, 0.015, 16, 100]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={1.0}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        <mesh ref={ring3Ref}>
          <torusGeometry args={[1.55, 0.012, 16, 100]} />
          <meshStandardMaterial
            color="#a7f3d0"
            emissive="#059669"
            emissiveIntensity={0.8}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* 4. Local Core Glow Light */}
        <pointLight color="#34d399" intensity={3.5} distance={5} />
      </Float>
    </group>
  );
}
