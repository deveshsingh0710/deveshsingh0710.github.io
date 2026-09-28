import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CurvedThread3DProps {
  scrollProgress: number; // 0.0 to 1.0
}

export function CurvedThread3D({ scrollProgress }: CurvedThread3DProps) {
  const headRef = useRef<THREE.Mesh>(null);
  const headLightRef = useRef<THREE.PointLight>(null);
  const splineMeshRef = useRef<THREE.Mesh>(null);

  // A continuous, organic S-curve snaking downwards through 3D space
  const curve = useMemo(() => {
    const points = [
      new THREE.Vector3(0, 2.5, 0),        // Top start
      new THREE.Vector3(1.8, 1.0, 0.4),    // Curve right
      new THREE.Vector3(-1.2, -1.0, -0.2), // Curve left
      new THREE.Vector3(2.0, -3.2, 0.3),   // Curve right (Quantum)
      new THREE.Vector3(-1.5, -5.5, -0.3), // Curve left (Vision)
      new THREE.Vector3(1.6, -7.8, 0.2),   // Curve right (Healthcare)
      new THREE.Vector3(0, -10.0, 0),      // Bottom dock
    ];
    return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);
  }, []);

  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 220, 0.024, 12, false);
  }, [curve]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // The pulse head travels along the curved spline as user scrolls
    const clamped = THREE.MathUtils.clamp(scrollProgress, 0, 0.999);
    const pos = curve.getPointAt(clamped);

    if (headRef.current) {
      headRef.current.position.copy(pos);
      const pulse = 1 + Math.sin(t * 10) * 0.25;
      headRef.current.scale.set(pulse, pulse, pulse);
    }

    if (headLightRef.current) {
      headLightRef.current.position.copy(pos);
      headLightRef.current.intensity = 3.5 + Math.sin(t * 8) * 1.0;
    }

    // Subtle gentle wave animation on the thread
    if (splineMeshRef.current) {
      splineMeshRef.current.rotation.y = Math.sin(t * 0.4) * 0.05;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Translucent Curved Outer Guide */}
      <mesh ref={splineMeshRef} geometry={tubeGeometry}>
        <meshPhysicalMaterial
          color="#064e3b"
          emissive="#10b981"
          emissiveIntensity={1.2}
          roughness={0.1}
          metalness={0.8}
          transmission={0.6}
          thickness={0.4}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* 2. Outer Halo Glow Wireframe */}
      <mesh geometry={tubeGeometry}>
        <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.15} />
      </mesh>

      {/* 3. Traveling Optical Energy Spark Head */}
      <mesh ref={headRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#6ee7b7"
          emissiveIntensity={4.5}
          roughness={0.1}
        />
      </mesh>

      <pointLight ref={headLightRef} color="#34d399" intensity={3.5} distance={4} />
    </group>
  );
}
