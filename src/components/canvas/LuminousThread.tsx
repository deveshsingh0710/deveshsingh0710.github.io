import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LuminousThreadProps {
  scrollProgress: number; // 0.0 to 1.0
}

export function LuminousThread({ scrollProgress }: LuminousThreadProps) {
  const headRef = useRef<THREE.Mesh>(null);
  const headLightRef = useRef<THREE.PointLight>(null);

  // A long, elegant vertical 3D spine winding down from y = 0 to y = -15
  const curve = useMemo(() => {
    const points = [
      new THREE.Vector3(2.2, 0, 0),        // Top: Liquid Core
      new THREE.Vector3(0.5, -1.5, 0.4),   // Weave
      new THREE.Vector3(2.2, -3.0, 0),     // Station 1: Quantum
      new THREE.Vector3(0.8, -4.5, -0.4),  // Weave
      new THREE.Vector3(2.2, -6.0, 0),     // Station 2: LabelChecker
      new THREE.Vector3(0.6, -7.5, 0.4),   // Weave
      new THREE.Vector3(2.2, -9.0, 0),     // Station 3: Healthcare
      new THREE.Vector3(1.0, -10.5, -0.3), // Weave
      new THREE.Vector3(2.2, -12.0, 0),    // Station 4: Contact Core
    ];
    return new THREE.CatmullRomCurve3(points);
  }, []);

  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 260, 0.028, 12, false);
  }, [curve]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    const clampedProg = THREE.MathUtils.clamp(scrollProgress, 0, 0.999);
    const point = curve.getPointAt(clampedProg);

    if (headRef.current) {
      headRef.current.position.copy(point);
      const pulse = 1 + Math.sin(t * 8) * 0.25;
      headRef.current.scale.set(pulse, pulse, pulse);
    }

    if (headLightRef.current) {
      headLightRef.current.position.copy(point);
    }
  });

  return (
    <group>
      {/* The 3D Fiber-Optic Thread */}
      <mesh geometry={tubeGeometry}>
        <meshPhysicalMaterial
          color="#064e3b"
          emissive="#10b981"
          emissiveIntensity={1.2}
          roughness={0.2}
          metalness={0.8}
          transmission={0.5}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Outer Halo Glow */}
      <mesh geometry={tubeGeometry}>
        <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.2} />
      </mesh>

      {/* The Glowing Leading Head */}
      <mesh ref={headRef}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial
          color="#a7f3d0"
          emissive="#34d399"
          emissiveIntensity={3.5}
          roughness={0.1}
        />
      </mesh>

      <pointLight ref={headLightRef} color="#34d399" intensity={4} distance={4} />
    </group>
  );
}
