import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HealthcarePopUpProps {
  unfoldProgress: number;
}

export function HealthcarePopUp({ unfoldProgress }: HealthcarePopUpProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Group>(null);
  const ecgLineRef = useRef<THREE.Line>(null);
  const satelliteGroupRef = useRef<THREE.Group>(null);

  // Generate ECG waveform points
  const pointCount = 100;
  const ecgPoints = useMemo(() => {
    const pos = new Float32Array(pointCount * 3);
    for (let i = 0; i < pointCount; i++) {
      const x = (i / pointCount) * 3.6 - 1.8;
      let y = 0;
      if (x > -0.3 && x < -0.15) y = 0.15;
      else if (x >= -0.15 && x < -0.05) y = -0.15;
      else if (x >= -0.05 && x < 0.08) y = 0.8;
      else if (x >= 0.08 && x < 0.18) y = -0.3;
      else if (x >= 0.18 && x < 0.45) y = 0.25;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = 0;
    }
    return pos;
  }, []);

  const ecgGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(ecgPoints, 3));
    return geom;
  }, [ecgPoints]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (coreRef.current) {
      const beat = Math.pow(Math.sin(t * 3), 4) * 0.15 + 1;
      coreRef.current.scale.set(beat, beat, beat);
      coreRef.current.rotation.y = t * 0.8;
    }

    if (satelliteGroupRef.current) {
      satelliteGroupRef.current.rotation.y = -t * 0.6;
      satelliteGroupRef.current.rotation.x = Math.sin(t * 0.5) * 0.2;
    }

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.1;
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
          color="#181824"
          roughness={0.7}
          metalness={0.3}
          transparent
          opacity={0.8 * unfoldProgress}
        />
      </mesh>

      <gridHelper args={[4, 16, '#06b6d4', '#1e293b']} position={[0, 0.01, 0]} />

      {/* Central Holographic Heart / Medical Cross Core */}
      <group ref={coreRef} position={[0, 0.75, 0]}>
        <mesh>
          <boxGeometry args={[0.3, 0.9, 0.3]} />
          <meshPhysicalMaterial
            color="#06b6d4"
            emissive="#0891b2"
            emissiveIntensity={0.6}
            roughness={0.1}
            transmission={0.7}
            transparent
            opacity={0.9 * unfoldProgress}
          />
        </mesh>
        <mesh>
          <boxGeometry args={[0.9, 0.3, 0.3]} />
          <meshPhysicalMaterial
            color="#06b6d4"
            emissive="#0891b2"
            emissiveIntensity={0.6}
            roughness={0.1}
            transmission={0.7}
            transparent
            opacity={0.9 * unfoldProgress}
          />
        </mesh>
      </group>

      {/* Floating Orbiting Telemetry Satellites */}
      <group ref={satelliteGroupRef} position={[0, 0.75, 0]}>
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, i) => (
          <group
            key={i}
            position={[Math.cos(angle) * 1.3, Math.sin(angle * 2) * 0.3, Math.sin(angle) * 1.3]}
          >
            <mesh>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial
                color={i === 0 ? '#38bdf8' : i === 1 ? '#a855f7' : '#22c55e'}
                emissive={i === 0 ? '#0284c7' : i === 1 ? '#7e22ce' : '#16a34a'}
                emissiveIntensity={1}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* ECG Heartbeat Wavefront Line */}
      <group position={[0, 0.35, 0.4]}>
        {/* @ts-expect-error Three line JSX type cast */}
        <line ref={ecgLineRef} geometry={ecgGeometry}>
          <lineBasicMaterial color="#22c55e" linewidth={3} transparent opacity={0.95 * unfoldProgress} />
        </line>
      </group>

      <pointLight position={[0, 0.8, 0.5]} color="#06b6d4" intensity={1.8 * unfoldProgress} distance={3} />
    </group>
  );
}
