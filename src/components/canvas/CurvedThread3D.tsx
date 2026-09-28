import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CurvedThread3DProps {
  scrollProgress: number; // 0.0 to 1.0
}

export function CurvedThread3D({ scrollProgress }: CurvedThread3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const headLightRef = useRef<THREE.PointLight>(null);
  const splineMeshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const wireMatRef = useRef<THREE.MeshBasicMaterial>(null);

  // A sleek organic S-spline that begins strictly AT the projects section,
  // NOT in the hero frame, weaving alongside the projects.
  const curve = useMemo(() => {
    const points = [
      new THREE.Vector3(1.2, -1.6, 0.2),   // Starts at the beginning of Projects section
      new THREE.Vector3(-1.2, -2.8, -0.2), // Curve left (Project 1)
      new THREE.Vector3(1.4, -4.2, 0.25),  // Curve right (Project 2)
      new THREE.Vector3(-1.1, -5.6, -0.2), // Curve left (Project 3)
      new THREE.Vector3(0.5, -7.0, 0.1),   // Graceful finish
      new THREE.Vector3(0, -8.0, 0),       // End terminal
    ];
    return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);
  }, []);

  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 180, 0.022, 12, false);
  }, [curve]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // 1. Thread ONLY becomes visible when scrolling out of the Hero into Projects
    // Hero is [0.0 to 0.10]. Thread fades in between 0.08 and 0.20
    const visibility = THREE.MathUtils.clamp((scrollProgress - 0.06) / 0.12, 0, 1);

    if (matRef.current) {
      matRef.current.opacity = visibility * 0.75;
      matRef.current.emissiveIntensity = visibility * 1.2;
    }
    if (wireMatRef.current) {
      wireMatRef.current.opacity = visibility * 0.15;
    }

    // 2. Pulse head travels down as user scrolls through projects
    // Map scrollProgress [0.10 to 0.90] to curve [0 to 1]
    const threadProgress = THREE.MathUtils.clamp((scrollProgress - 0.08) / 0.82, 0, 0.999);
    const pos = curve.getPointAt(threadProgress);

    if (headRef.current) {
      headRef.current.position.copy(pos);
      const pulse = (1 + Math.sin(t * 8) * 0.25) * visibility;
      headRef.current.scale.set(pulse, pulse, pulse);
    }

    if (headLightRef.current) {
      headLightRef.current.position.copy(pos);
      headLightRef.current.intensity = (3.5 + Math.sin(t * 8) * 1.0) * visibility;
    }

    // Subtle gentle wave oscillation
    if (splineMeshRef.current) {
      splineMeshRef.current.rotation.y = Math.sin(t * 0.35) * 0.04;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 1. Translucent Curved Fiber Outer Guide */}
      <mesh ref={splineMeshRef} geometry={tubeGeometry}>
        <meshPhysicalMaterial
          ref={matRef}
          color="#064e3b"
          emissive="#10b981"
          emissiveIntensity={1.2}
          roughness={0.1}
          metalness={0.8}
          transmission={0.6}
          thickness={0.4}
          transparent
          opacity={0}
        />
      </mesh>

      {/* 2. Outer Halo Glow Wireframe */}
      <mesh geometry={tubeGeometry}>
        <meshBasicMaterial ref={wireMatRef} color="#34d399" wireframe transparent opacity={0} />
      </mesh>

      {/* 3. Traveling Optical Energy Spark Head */}
      <mesh ref={headRef}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#6ee7b7"
          emissiveIntensity={4.5}
          roughness={0.1}
        />
      </mesh>

      <pointLight ref={headLightRef} color="#34d399" intensity={0} distance={4} />
    </group>
  );
}
