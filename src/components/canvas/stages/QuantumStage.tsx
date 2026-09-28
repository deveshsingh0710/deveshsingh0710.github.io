import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface QuantumStageProps {
  opacity: number;
}

export function QuantumStage({ opacity }: QuantumStageProps) {
  const groupRef = useRef<THREE.Group>(null);
  const waveRef = useRef<THREE.Line>(null);
  const particleRef = useRef<THREE.Mesh>(null);

  const pointCount = 140;
  const positions = useMemo(() => {
    const pos = new Float32Array(pointCount * 3);
    for (let i = 0; i < pointCount; i++) {
      pos[i * 3] = (i / pointCount) * 4.6 - 2.3;
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
        const x = (i / pointCount) * 4.6 - 2.3;
        let amp = 0.7 * Math.exp(-Math.pow(x + 0.9, 2) / 0.6);
        if (x > 0.2) {
          amp = 0.22 * Math.exp(-Math.pow(x - 1.1, 2) / 0.9);
        }

        array[i * 3 + 1] = Math.sin(x * 8 - t * 4) * amp;
        array[i * 3 + 2] = Math.cos(x * 8 - t * 4) * amp * 0.3;
      }
      posAttr.needsUpdate = true;
    }

    if (particleRef.current) {
      const prog = ((t * 0.9) % 3.6) - 1.8;
      particleRef.current.position.x = prog;
      const isPast = prog > 0;
      particleRef.current.scale.setScalar(isPast ? 0.07 : 0.12);
      particleRef.current.position.y = Math.sin(t * 12) * (isPast ? 0.08 : 0.25);
    }

    if (groupRef.current) {
      groupRef.current.rotation.y = -0.3 + Math.sin(t * 0.5) * 0.08 + state.pointer.x * 0.2;
      groupRef.current.rotation.x = 0.1 + -state.pointer.y * 0.15;
      groupRef.current.position.y = Math.sin(t * 0.7) * 0.08;
    }
  });

  if (opacity <= 0.01) return null;

  return (
    <group ref={groupRef} position={[2.2, 0, 0]} scale={[opacity, opacity, opacity]}>
      {/* Floating Dark Glass Slab Container */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[5.2, 3.2, 0.4]} />
        <meshPhysicalMaterial
          color="#061210"
          emissive="#064e3b"
          emissiveIntensity={0.2}
          roughness={0.1}
          metalness={0.1}
          transmission={0.88}
          thickness={1.2}
          ior={1.45}
          transparent
          opacity={0.85 * opacity}
        />
      </mesh>

      {/* Glass Frost Bevel Border */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[5.22, 3.22, 0.42]} />
        <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.25 * opacity} />
      </mesh>

      {/* Internal Quantum Potential Barrier */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.35, 2.2, 0.38]} />
        <meshPhysicalMaterial
          color="#f43f5e"
          emissive="#e11d48"
          emissiveIntensity={0.6}
          roughness={0.05}
          metalness={0.1}
          transmission={0.8}
          transparent
          opacity={0.85 * opacity}
        />
      </mesh>

      {/* Barrier Wireframe */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.36, 2.22, 0.39]} />
        <meshBasicMaterial color="#fda4af" wireframe transparent opacity={0.5 * opacity} />
      </mesh>

      {/* Wave-packet Line */}
      {/* @ts-expect-error Three line JSX type cast */}
      <line ref={waveRef} geometry={lineGeometry}>
        <lineBasicMaterial color="#38bdf8" linewidth={3} transparent opacity={0.95 * opacity} />
      </line>

      {/* Tunneling Particle */}
      <mesh ref={particleRef} position={[-1.8, 0, 0]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color="#fef08a"
          emissive="#eab308"
          emissiveIntensity={2}
          roughness={0.1}
        />
      </mesh>

      <pointLight position={[0, 0, 1]} color="#38bdf8" intensity={2 * opacity} distance={4} />
      <pointLight position={[0, 0, -1]} color="#f43f5e" intensity={1.5 * opacity} distance={4} />
    </group>
  );
}
