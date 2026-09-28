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
  const innerRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const satellitesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Fluid mouse pointer tracking with natural tilt dynamics
    const targetRotX = -state.pointer.y * 0.55;
    const targetRotY = state.pointer.x * 0.7;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.07);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.07);

    const t = state.clock.getElapsedTime();

    // Multiaxis gyroscopic rotation
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.5;
      ring1Ref.current.rotation.x = t * 0.25;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.45;
      ring2Ref.current.rotation.z = t * 0.2;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = -t * 0.35;
      ring3Ref.current.rotation.y = t * 0.4;
    }

    // High-frequency quantum pulse
    if (coreRef.current) {
      const pulse = 1 + Math.sin(t * 3.5) * 0.08;
      coreRef.current.scale.set(pulse, pulse, pulse);
      coreRef.current.rotation.y = t * 0.4;
      coreRef.current.rotation.x = t * 0.2;
    }

    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.8;
    }

    if (satellitesRef.current) {
      satellitesRef.current.rotation.y = t * 0.7;
    }

    // Scroll exit: smoothly shrinks and ascends when scrolling past hero
    const heroFactor = THREE.MathUtils.clamp(1 - scrollProgress * 7.0, 0, 1);
    groupRef.current.scale.setScalar(heroFactor * 1.15);
    groupRef.current.position.y = 0.2 + (1 - heroFactor) * 3.0;
  });

  return (
    <group ref={groupRef} position={[2.2, 0.2, 0]}>
      <Float speed={2.4} rotationIntensity={0.2} floatIntensity={0.4}>
        {/* 1. Outer Faceted Holographic Shell */}
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[0.9, 1]} />
          <meshPhysicalMaterial
            color="#064e3b"
            emissive="#10b981"
            emissiveIntensity={1.8}
            wireframe
            roughness={0.1}
            metalness={0.9}
            transmission={0.4}
          />
        </mesh>

        {/* 2. Inner Glowing Quantum Energy Sphere */}
        <mesh ref={innerRef}>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshStandardMaterial
            color="#34d399"
            emissive="#10b981"
            emissiveIntensity={3.5}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>

        {/* 3. Orbiting Data Nodes / Satellites */}
        <group ref={satellitesRef}>
          {[0, 1, 2, 3].map((idx) => {
            const angle = (idx / 4) * Math.PI * 2;
            const radius = 1.35;
            return (
              <mesh
                key={idx}
                position={[Math.cos(angle) * radius, Math.sin(angle) * 0.3, Math.sin(angle) * radius]}
              >
                <sphereGeometry args={[0.045, 16, 16]} />
                <meshStandardMaterial
                  color="#ffffff"
                  emissive="#6ee7b7"
                  emissiveIntensity={4.0}
                />
              </mesh>
            );
          })}
        </group>

        {/* 4. Precision Gyroscopic Gimbal Rings */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[1.3, 0.016, 16, 120]} />
          <meshStandardMaterial
            color="#6ee7b7"
            emissive="#10b981"
            emissiveIntensity={1.4}
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>

        <mesh ref={ring2Ref}>
          <torusGeometry args={[1.55, 0.014, 16, 120]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={1.2}
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>

        <mesh ref={ring3Ref}>
          <torusGeometry args={[1.78, 0.012, 16, 120]} />
          <meshStandardMaterial
            color="#a7f3d0"
            emissive="#059669"
            emissiveIntensity={0.9}
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>

        {/* 5. Core Point Lights */}
        <pointLight color="#34d399" intensity={4.5} distance={6} />
        <pointLight color="#38bdf8" intensity={2.5} distance={4} position={[0, -1, 1]} />
      </Float>
    </group>
  );
}
