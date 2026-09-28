import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LuminousThreadProps {
  scrollProgress: number; // 0.0 to 1.0
}

export function LuminousThread({ scrollProgress }: LuminousThreadProps) {
  const headRef = useRef<THREE.Mesh>(null);
  const headLightRef = useRef<THREE.PointLight>(null);

  // 3D Path connecting Origin -> Quantum -> Vision -> Healthcare -> Terminal
  const curve = useMemo(() => {
    const points = [
      new THREE.Vector3(2.4, 0, 0),        // Origin (Liquid Core)
      new THREE.Vector3(1.2, -0.6, 0.4),   // Transition down
      new THREE.Vector3(2.2, -1.2, 0),     // Station 1: Quantum
      new THREE.Vector3(1.0, -1.8, -0.4),  // Transition
      new THREE.Vector3(2.2, -2.4, 0),     // Station 2: Vision
      new THREE.Vector3(1.2, -3.0, 0.4),   // Transition
      new THREE.Vector3(2.2, -3.6, 0),     // Station 3: Healthcare
      new THREE.Vector3(1.5, -4.2, -0.2),  // Transition
      new THREE.Vector3(2.2, -4.8, 0),     // Station 4: Terminal
    ];
    return new THREE.CatmullRomCurve3(points);
  }, []);

  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 180, 0.025, 12, false);
  }, [curve]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Position of the glowing pulse head along the thread
    const clampedProg = THREE.MathUtils.clamp(scrollProgress, 0, 0.999);
    const point = curve.getPointAt(clampedProg);

    if (headRef.current) {
      headRef.current.position.copy(point);
      const pulse = 1 + Math.sin(t * 8) * 0.2;
      headRef.current.scale.set(pulse, pulse, pulse);
    }

    if (headLightRef.current) {
      headLightRef.current.position.copy(point);
    }
  });

  return (
    <group>
      {/* The Optical Fiber Thread */}
      <mesh geometry={tubeGeometry}>
        <meshPhysicalMaterial
          color="#064e3b"
          emissive="#10b981"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.8}
          transmission={0.4}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Outer Glow Halo on the Thread */}
      <mesh geometry={tubeGeometry}>
        <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.15} />
      </mesh>

      {/* The Glowing Traveling Energy Head */}
      <mesh ref={headRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#a7f3d0"
          emissive="#34d399"
          emissiveIntensity={3.0}
          roughness={0.1}
        />
      </mesh>

      {/* Dynamic Traveling Light along the thread */}
      <pointLight ref={headLightRef} color="#34d399" intensity={3.5} distance={3.5} />
    </group>
  );
}
