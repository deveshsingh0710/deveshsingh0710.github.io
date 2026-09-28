import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function DevPass3D() {
  const cardGroupRef = useRef<THREE.Group>(null);
  const holographicStripRef = useRef<THREE.Mesh>(null);
  const chipRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (cardGroupRef.current) {
      // 3D Parallax tilt tracking mouse cursor with smooth damping
      const targetRotX = -state.pointer.y * 0.45;
      const targetRotY = state.pointer.x * 0.55;

      cardGroupRef.current.rotation.x = THREE.MathUtils.lerp(cardGroupRef.current.rotation.x, targetRotX, 0.08);
      cardGroupRef.current.rotation.y = THREE.MathUtils.lerp(cardGroupRef.current.rotation.y, targetRotY, 0.08);

      // Subtle breathing float
      cardGroupRef.current.position.y = Math.sin(t * 1.5) * 0.08;
    }

    // Holographic rainbow shimmer effect based on tilt
    if (holographicStripRef.current) {
      const mat = holographicStripRef.current.material as THREE.MeshPhysicalMaterial;
      const hue = ((state.pointer.x * 0.5 + state.pointer.y * 0.5 + t * 0.1) % 1 + 1) % 1;
      mat.color.setHSL(hue, 0.8, 0.5);
      mat.emissive.setHSL(hue, 0.9, 0.4);
    }
  });

  return (
    <group ref={cardGroupRef} position={[0, 0, 0]}>
      {/* 3D Card Chassis (Obsidian Glass + Titanium Bevel) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.8, 2.4, 0.08]} />
        <meshPhysicalMaterial
          color="#06120e"
          emissive="#04261c"
          emissiveIntensity={0.2}
          roughness={0.12}
          metalness={0.8}
          clearcoat={1.0}
          clearcoatRoughness={0.06}
          reflectivity={0.9}
        />
      </mesh>

      {/* Emerald Chamfer Border */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.82, 2.42, 0.082]} />
        <meshBasicMaterial color="#10b981" wireframe transparent opacity={0.4} />
      </mesh>

      {/* Golden Neural Microchip */}
      <group position={[-1.2, 0.4, 0.045]}>
        <mesh ref={chipRef}>
          <boxGeometry args={[0.6, 0.5, 0.02]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#d97706"
            emissiveIntensity={0.4}
            metalness={0.95}
            roughness={0.15}
          />
        </mesh>
        {/* Chip contacts */}
        {[-0.15, 0.15].map((x, i) => (
          <mesh key={i} position={[x, 0, 0.012]}>
            <planeGeometry args={[0.18, 0.35]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
        ))}
      </group>

      {/* Iridescent Holographic Foil Band */}
      <mesh ref={holographicStripRef} position={[0.7, 0, 0.045]}>
        <planeGeometry args={[1.7, 1.8]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.9}
          clearcoat={1}
          reflectivity={1}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Card Header Line */}
      <mesh position={[0, 0.95, 0.045]}>
        <planeGeometry args={[3.4, 0.04]} />
        <meshBasicMaterial color="#34d399" transparent opacity={0.6} />
      </mesh>

      {/* Holographic Security Dots */}
      {[-0.4, -0.2, 0, 0.2, 0.4].map((x, idx) => (
        <mesh key={idx} position={[x, -0.85, 0.045]}>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
      ))}

      {/* Bottom Anchor / Socket (Where the Thermometer Thread connects) */}
      <group position={[0, -1.2, 0]}>
        <mesh>
          <cylinderGeometry args={[0.14, 0.14, 0.15, 16]} />
          <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.8} />
        </mesh>
        <pointLight color="#34d399" intensity={2.5} distance={3} />
      </group>

      {/* Lighting for the Card */}
      <pointLight position={[0, 1.5, 2]} color="#ecfdf5" intensity={2.0} distance={5} />
      <pointLight position={[-2, -1, 1.5]} color="#10b981" intensity={1.8} distance={4} />
      <pointLight position={[2, -1, 1.5]} color="#38bdf8" intensity={1.5} distance={4} />
    </group>
  );
}
