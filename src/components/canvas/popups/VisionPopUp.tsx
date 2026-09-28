import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VisionPopUpProps {
  unfoldProgress: number;
}

export function VisionPopUp({ unfoldProgress }: VisionPopUpProps) {
  const groupRef = useRef<THREE.Group>(null);
  const scanLaserRef = useRef<THREE.Mesh>(null);
  const box1Ref = useRef<THREE.Group>(null);
  const box2Ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Laser scanning beam sweep
    if (scanLaserRef.current) {
      scanLaserRef.current.position.y = (Math.sin(t * 2.5) * 0.7 + 0.7) * unfoldProgress;
    }

    // Gentle floating tilt
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.12;
      groupRef.current.rotation.x = Math.cos(t * 0.3) * 0.05;
    }

    // Pulse bounding boxes
    if (box1Ref.current) {
      const s = 1 + Math.sin(t * 5) * 0.03;
      box1Ref.current.scale.set(s, s, s);
    }
    if (box2Ref.current) {
      const s = 1 + Math.cos(t * 4) * 0.03;
      box2Ref.current.scale.set(s, s, s);
    }
  });

  return (
    <group
      ref={groupRef}
      scale={[unfoldProgress, unfoldProgress, unfoldProgress]}
      position={[0, unfoldProgress * 0.9, 0]}
    >
      {/* 3D Paper Stand / Industrial Platform */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.2, 2.4]} />
        <meshStandardMaterial
          color="#161b26"
          roughness={0.7}
          metalness={0.3}
          transparent
          opacity={0.8 * unfoldProgress}
        />
      </mesh>

      <gridHelper args={[4, 16, '#10b981', '#1e293b']} position={[0, 0.01, 0]} />

      {/* Main Inspection Target Screen (Floating Label Hologram) */}
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[2.6, 1.4, 0.08]} />
        <meshPhysicalMaterial
          color="#064e3b"
          emissive="#047857"
          emissiveIntensity={0.2}
          roughness={0.2}
          metalness={0.1}
          transmission={0.6}
          transparent
          opacity={0.85 * unfoldProgress}
        />
      </mesh>

      {/* Screen Outline */}
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[2.62, 1.42, 0.09]} />
        <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.6 * unfoldProgress} />
      </mesh>

      {/* 3D Laser Beam Sweeper */}
      <mesh ref={scanLaserRef} position={[0, 0.7, 0.06]}>
        <planeGeometry args={[2.7, 0.03]} />
        <meshBasicMaterial
          color="#10b981"
          side={THREE.DoubleSide}
          transparent
          opacity={0.9 * unfoldProgress}
        />
      </mesh>

      {/* Bounding Box 1: Text Target */}
      <group ref={box1Ref} position={[-0.4, 0.9, 0.08]}>
        <mesh>
          <planeGeometry args={[1.2, 0.35]} />
          <meshBasicMaterial color="#059669" transparent opacity={0.3 * unfoldProgress} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(1.2, 0.35)]} />
          <lineBasicMaterial color="#6ee7b7" linewidth={2} />
        </lineSegments>
      </group>

      {/* Bounding Box 2: Barcode / QR Target */}
      <group ref={box2Ref} position={[0.6, 0.5, 0.08]}>
        <mesh>
          <planeGeometry args={[0.7, 0.55]} />
          <meshBasicMaterial color="#0284c7" transparent opacity={0.3 * unfoldProgress} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(0.7, 0.55)]} />
          <lineBasicMaterial color="#38bdf8" linewidth={2} />
        </lineSegments>

        {/* Barcode Stripes */}
        {[-0.2, -0.1, 0, 0.08, 0.16, 0.24].map((xOffset, idx) => (
          <mesh key={idx} position={[xOffset, 0, 0.01]}>
            <planeGeometry args={[0.03, 0.4]} />
            <meshBasicMaterial color="#f8fafc" />
          </mesh>
        ))}
      </group>

      {/* Inspection Status Indicators */}
      <pointLight position={[0, 0.7, 0.4]} color="#10b981" intensity={1.5 * unfoldProgress} distance={2.5} />
    </group>
  );
}
