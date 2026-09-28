import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RealisticFrameProps {
  title: string;
  tag: string;
  position: [number, number, number];
  opacity: number;
  children: React.ReactNode;
}

export function RealisticFrame({ title: _title, tag: _tag, position, opacity, children }: RealisticFrameProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      // Parallax mouse tilt when hovered, or gentle float
      const targetRotX = hovered ? -state.pointer.y * 0.25 : Math.sin(state.clock.getElapsedTime() * 0.5) * 0.04;
      const targetRotY = hovered ? state.pointer.x * 0.35 : -0.25 + Math.cos(state.clock.getElapsedTime() * 0.4) * 0.05;
      const targetScale = hovered ? 1.05 : 1.0;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.08);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.08);
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
    }
  });

  if (opacity <= 0.01) return null;

  return (
    <group
      ref={groupRef}
      position={position}
      scale={[opacity, opacity, opacity]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Outer Titanium Chassis (Bezel) */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[5.6, 3.6, 0.2]} />
        <meshPhysicalMaterial
          color="#0b100e"
          roughness={0.2}
          metalness={0.85}
          clearcoat={0.5}
          transparent
          opacity={0.95 * opacity}
        />
      </mesh>

      {/* Glossy Glass Screen Layer */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[5.3, 3.3]} />
        <meshPhysicalMaterial
          color="#020806"
          emissive="#064e3b"
          emissiveIntensity={hovered ? 0.15 : 0.05}
          roughness={0.05}
          metalness={0.1}
          transmission={0.4}
          thickness={0.5}
          reflectivity={0.9}
          clearcoat={1.0}
          transparent
          opacity={0.9 * opacity}
        />
      </mesh>

      {/* Top Window Bar */}
      <group position={[0, 1.48, 0.08]}>
        {/* Bar strip */}
        <mesh>
          <planeGeometry args={[5.3, 0.32]} />
          <meshStandardMaterial color="#0f1915" metalness={0.5} roughness={0.3} />
        </mesh>

        {/* Traffic Light Gems */}
        <mesh position={[-2.35, 0, 0.01]}>
          <circleGeometry args={[0.06, 16]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <mesh position={[-2.15, 0, 0.01]}>
          <circleGeometry args={[0.06, 16]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
        <mesh position={[-1.95, 0, 0.01]}>
          <circleGeometry args={[0.06, 16]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
      </group>

      {/* Frame Border Glow Sheen (Reacts to Hover) */}
      <mesh position={[0, 0, 0.07]}>
        <boxGeometry args={[5.32, 3.32, 0.02]} />
        <meshBasicMaterial
          color={hovered ? '#34d399' : '#065f46'}
          wireframe
          transparent
          opacity={(hovered ? 0.8 : 0.35) * opacity}
        />
      </mesh>

      {/* Inner Rich Visuals Mount */}
      <group position={[0, -0.08, 0.1]}>{children}</group>

      {/* Frame Accent Spotlight */}
      <pointLight
        position={[0, 1.5, 1.5]}
        color={hovered ? '#34d399' : '#10b981'}
        intensity={(hovered ? 2.5 : 1.2) * opacity}
        distance={4}
      />
    </group>
  );
}
