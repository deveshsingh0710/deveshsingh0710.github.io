import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RealisticFrame } from '../RealisticFrame';

interface QuantumStageProps {
  opacity: number;
}

export function QuantumStage({ opacity }: QuantumStageProps) {
  const waveRef = useRef<THREE.Line>(null);
  const particleRef = useRef<THREE.Mesh>(null);

  const pointCount = 120;
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
        let amp = 0.75 * Math.exp(-Math.pow(x + 0.9, 2) / 0.5);
        if (x > 0.15) {
          amp = 0.22 * Math.exp(-Math.pow(x - 1.1, 2) / 0.8);
        }

        array[i * 3 + 1] = Math.sin(x * 9 - t * 4) * amp;
        array[i * 3 + 2] = Math.cos(x * 9 - t * 4) * amp * 0.2;
      }
      posAttr.needsUpdate = true;
    }

    if (particleRef.current) {
      const prog = ((t * 0.9) % 3.6) - 1.8;
      particleRef.current.position.x = prog;
      const isPast = prog > 0;
      particleRef.current.scale.setScalar(isPast ? 0.08 : 0.12);
      particleRef.current.position.y = Math.sin(t * 12) * (isPast ? 0.08 : 0.25);
    }
  });

  return (
    <RealisticFrame
      title="01 // QUANTUM TUNNELING"
      tag="LAB SIMULATION"
      position={[2.2, 0, 0]}
      opacity={opacity}
    >
      {/* 2D Grid Background on Screen */}
      <gridHelper args={[4.8, 16, '#065f46', '#031c14']} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.02]} />

      {/* Potential Energy Barrier */}
      <mesh position={[0, 0, 0.1]}>
        <boxGeometry args={[0.3, 2.0, 0.2]} />
        <meshPhysicalMaterial
          color="#f43f5e"
          emissive="#e11d48"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.2}
          transmission={0.7}
          transparent
          opacity={0.85 * opacity}
        />
      </mesh>

      {/* Wave Line */}
      {/* @ts-expect-error Three line JSX type cast */}
      <line ref={waveRef} geometry={lineGeometry} position={[0, 0, 0.1]}>
        <lineBasicMaterial color="#38bdf8" linewidth={3} transparent opacity={0.95 * opacity} />
      </line>

      {/* Tunneling Particle */}
      <mesh ref={particleRef} position={[-1.8, 0, 0.1]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color="#fef08a"
          emissive="#eab308"
          emissiveIntensity={2.5}
        />
      </mesh>
    </RealisticFrame>
  );
}
