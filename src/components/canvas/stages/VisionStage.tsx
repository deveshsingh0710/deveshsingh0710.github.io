import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RealisticFrame } from '../RealisticFrame';

interface VisionStageProps {
  opacity: number;
}

export function VisionStage({ opacity }: VisionStageProps) {
  const laserRef = useRef<THREE.Mesh>(null);
  const target1Ref = useRef<THREE.Group>(null);
  const target2Ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (laserRef.current) {
      laserRef.current.position.y = Math.sin(t * 2.5) * 1.1;
    }

    if (target1Ref.current) {
      const s = 1 + Math.sin(t * 6) * 0.04;
      target1Ref.current.scale.set(s, s, s);
    }

    if (target2Ref.current) {
      const s = 1 + Math.cos(t * 5) * 0.04;
      target2Ref.current.scale.set(s, s, s);
    }
  });

  return (
    <RealisticFrame
      title="02 // LABELCHECKER AI"
      tag="INSPECTION CAMERA"
      position={[2.2, 0, 0]}
      opacity={opacity}
    >
      <gridHelper args={[4.8, 16, '#047857', '#022419']} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.02]} />

      {/* Sweeping Active Emerald Laser */}
      <mesh ref={laserRef} position={[0, 0, 0.1]}>
        <planeGeometry args={[4.8, 0.04]} />
        <meshBasicMaterial color="#34d399" side={THREE.DoubleSide} transparent opacity={0.9 * opacity} />
      </mesh>

      {/* Target Bracket 1: OCR Text Box */}
      <group ref={target1Ref} position={[-0.8, 0.4, 0.1]}>
        <mesh>
          <planeGeometry args={[1.8, 0.6]} />
          <meshBasicMaterial color="#059669" transparent opacity={0.2 * opacity} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(1.8, 0.6)]} />
          <lineBasicMaterial color="#6ee7b7" linewidth={2} />
        </lineSegments>
      </group>

      {/* Target Bracket 2: Barcode Target */}
      <group ref={target2Ref} position={[1.1, -0.3, 0.1]}>
        <mesh>
          <planeGeometry args={[1.2, 0.9]} />
          <meshBasicMaterial color="#0284c7" transparent opacity={0.2 * opacity} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(1.2, 0.9)]} />
          <lineBasicMaterial color="#38bdf8" linewidth={2} />
        </lineSegments>

        {/* 3D Barcode Lines */}
        {[-0.35, -0.2, -0.05, 0.1, 0.25].map((xOff, idx) => (
          <mesh key={idx} position={[xOff, 0, 0.02]}>
            <planeGeometry args={[0.04, 0.6]} />
            <meshBasicMaterial color="#f8fafc" />
          </mesh>
        ))}
      </group>
    </RealisticFrame>
  );
}
