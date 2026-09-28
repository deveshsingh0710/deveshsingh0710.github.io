import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HealthcareStageProps {
  opacity: number;
}

export function HealthcareStage({ opacity }: HealthcareStageProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Group>(null);
  const ecgRef = useRef<THREE.Line>(null);
  const orbitsRef = useRef<THREE.Group>(null);

  const pointCount = 120;
  const ecgPositions = useMemo(() => {
    const pos = new Float32Array(pointCount * 3);
    for (let i = 0; i < pointCount; i++) {
      const x = (i / pointCount) * 4.6 - 2.3;
      let y = 0;
      if (x > -0.4 && x < -0.2) y = 0.2;
      else if (x >= -0.2 && x < -0.08) y = -0.2;
      else if (x >= -0.08 && x < 0.1) y = 1.1; // R peak
      else if (x >= 0.1 && x < 0.22) y = -0.35;
      else if (x >= 0.22 && x < 0.5) y = 0.3;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = 0;
    }
    return pos;
  }, []);

  const ecgGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(ecgPositions, 3));
    return geom;
  }, [ecgPositions]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (coreRef.current) {
      const pulse = Math.pow(Math.sin(t * 3.2), 6) * 0.2 + 1;
      coreRef.current.scale.set(pulse, pulse, pulse);
      coreRef.current.rotation.y = t * 0.5;
    }

    if (orbitsRef.current) {
      orbitsRef.current.rotation.y = -t * 0.4;
      orbitsRef.current.rotation.z = Math.sin(t * 0.3) * 0.2;
    }

    if (groupRef.current) {
      groupRef.current.rotation.y = -0.25 + Math.sin(t * 0.4) * 0.08 + state.pointer.x * 0.2;
      groupRef.current.rotation.x = 0.08 - state.pointer.y * 0.15;
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.08;
    }
  });

  if (opacity <= 0.01) return null;

  return (
    <group ref={groupRef} position={[2.2, 0, 0]} scale={[opacity, opacity, opacity]}>
      {/* Floating Dark Glass Enclosure */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[5.2, 3.2, 0.3]} />
        <meshPhysicalMaterial
          color="#061214"
          emissive="#0891b2"
          emissiveIntensity={0.2}
          roughness={0.1}
          metalness={0.1}
          transmission={0.85}
          thickness={1.0}
          transparent
          opacity={0.88 * opacity}
        />
      </mesh>

      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[5.22, 3.22, 0.32]} />
        <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.25 * opacity} />
      </mesh>

      {/* Central Medical Cross Hub */}
      <group ref={coreRef} position={[0, 0.4, 0.1]}>
        <mesh>
          <boxGeometry args={[0.35, 1.2, 0.35]} />
          <meshPhysicalMaterial
            color="#06b6d4"
            emissive="#0891b2"
            emissiveIntensity={0.8}
            roughness={0.1}
            transmission={0.7}
          />
        </mesh>
        <mesh>
          <boxGeometry args={[1.2, 0.35, 0.35]} />
          <meshPhysicalMaterial
            color="#06b6d4"
            emissive="#0891b2"
            emissiveIntensity={0.8}
            roughness={0.1}
            transmission={0.7}
          />
        </mesh>
      </group>

      {/* Orbiting Telemetry Nodes */}
      <group ref={orbitsRef} position={[0, 0.4, 0.1]}>
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((ang, i) => (
          <group key={i} position={[Math.cos(ang) * 1.6, Math.sin(ang * 2) * 0.4, Math.sin(ang) * 1.6]}>
            <mesh>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial
                color={i === 0 ? '#38bdf8' : i === 1 ? '#a855f7' : '#22c55e'}
                emissive={i === 0 ? '#0284c7' : i === 1 ? '#7e22ce' : '#16a34a'}
                emissiveIntensity={1.2}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* ECG Cardiac Wavefront Line */}
      <group position={[0, -0.6, 0.18]}>
        {/* @ts-expect-error Three line JSX type cast */}
        <line ref={ecgRef} geometry={ecgGeometry}>
          <lineBasicMaterial color="#22c55e" linewidth={3} transparent opacity={0.95 * opacity} />
        </line>
      </group>

      <pointLight position={[0, 0.4, 0.8]} color="#06b6d4" intensity={2.2 * opacity} distance={4} />
    </group>
  );
}
