import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface QuantumPopUpProps {
  unfoldProgress: number; // 0 (flat on page) to 1 (fully elevated in 3D)
}

export function QuantumPopUp({ unfoldProgress }: QuantumPopUpProps) {
  const groupRef = useRef<THREE.Group>(null);
  const waveRef = useRef<THREE.Line>(null);
  const particleRef = useRef<THREE.Mesh>(null);

  // Generate wave packet points
  const pointCount = 120;
  const positions = useMemo(() => {
    const pos = new Float32Array(pointCount * 3);
    for (let i = 0; i < pointCount; i++) {
      const x = (i / pointCount) * 4 - 2;
      pos[i * 3] = x;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;
    }
    return pos;
  }, []);

  const lineGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [positions]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (waveRef.current) {
      const posAttr = waveRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;

      for (let i = 0; i < pointCount; i++) {
        const x = (i / pointCount) * 4 - 2;
        let amplitude = 0.5 * Math.exp(-Math.pow(x + 0.7, 2) / 0.5);
        if (x > 0.15) {
          amplitude = 0.18 * Math.exp(-Math.pow(x - 1.0, 2) / 0.8);
        }

        const y = Math.sin(x * 9 - t * 4) * amplitude * unfoldProgress;
        const z = Math.cos(x * 9 - t * 4) * amplitude * 0.4 * unfoldProgress;

        array[i * 3 + 1] = y;
        array[i * 3 + 2] = z;
      }
      posAttr.needsUpdate = true;
    }

    if (particleRef.current) {
      const progress = ((t * 0.8) % 3) - 1.5;
      particleRef.current.position.x = progress;
      const isPast = progress > 0;
      particleRef.current.scale.setScalar((isPast ? 0.05 : 0.08) * unfoldProgress);
      particleRef.current.position.y = (Math.sin(t * 10) * (isPast ? 0.08 : 0.2)) * unfoldProgress;
    }

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.15;
    }
  });

  return (
    <group
      ref={groupRef}
      scale={[unfoldProgress, unfoldProgress, unfoldProgress]}
      position={[0, unfoldProgress * 0.9, 0]}
    >
      {/* 3D Folding Paper Stand Base */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.2, 2.2]} />
        <meshStandardMaterial
          color="#1e2230"
          roughness={0.8}
          metalness={0.2}
          transparent
          opacity={0.8 * unfoldProgress}
        />
      </mesh>

      {/* Grid Floor Lines on the paper */}
      <gridHelper args={[4, 16, '#38bdf8', '#1e293b']} position={[0, 0.01, 0]} />

      {/* The Potential Energy Barrier (Glass / Crystalline Prism) */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[0.3, 1.2, 1.4]} />
        <meshPhysicalMaterial
          color="#f43f5e"
          emissive="#be123c"
          emissiveIntensity={0.4}
          roughness={0.1}
          metalness={0.1}
          transmission={0.85}
          thickness={0.5}
          transparent
          opacity={0.85 * unfoldProgress}
        />
      </mesh>

      {/* Barrier Wireframe Outline */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[0.31, 1.21, 1.41]} />
        <meshBasicMaterial color="#fda4af" wireframe transparent opacity={0.6 * unfoldProgress} />
      </mesh>

      {/* Wave-packet line */}
      {/* @ts-expect-error Three line JSX type cast */}
      <line ref={waveRef} geometry={lineGeometry}>
        <lineBasicMaterial color="#38bdf8" linewidth={2} transparent opacity={0.9 * unfoldProgress} />
      </line>

      {/* Tunneling Quantum Particle */}
      <mesh ref={particleRef} position={[-1.5, 0, 0]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color="#fef08a"
          emissive="#eab308"
          emissiveIntensity={1.5}
          roughness={0.2}
        />
      </mesh>

      {/* Glow Halo around particle */}
      <pointLight position={[0, 0.6, 0.2]} color="#f43f5e" intensity={1.5 * unfoldProgress} distance={2} />
      <pointLight position={[-0.8, 0.4, 0.2]} color="#38bdf8" intensity={1.2 * unfoldProgress} distance={2} />

      {/* Floating 3D Text / Holographic Label */}
      <group position={[0, 1.4, 0]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[2.2, 0.35]} />
          <meshBasicMaterial color="#0f172a" transparent opacity={0.7 * unfoldProgress} />
        </mesh>
      </group>
    </group>
  );
}
