import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CurvedThread3DProps {
  scrollProgress: number; // 0.0 to 1.0
}

export function CurvedThread3D({ scrollProgress }: CurvedThread3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const fluidMeshRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const headLightRef = useRef<THREE.PointLight>(null);
  const outerGlassMatRef = useRef<THREE.MeshPhysicalMaterial>(null);

  // Junction node refs for projects
  const dock1Ref = useRef<THREE.Mesh>(null);
  const dock2Ref = useRef<THREE.Mesh>(null);
  const dock3Ref = useRef<THREE.Mesh>(null);

  // High-precision organic curved glass conduit positioned in the right visual gutter
  const curve = useMemo(() => {
    const points = [
      new THREE.Vector3(1.8, -1.4, 0.2),   // Starts at top of Projects section
      new THREE.Vector3(1.3, -2.8, -0.15), // Curves toward Project 1 (Quantum)
      new THREE.Vector3(2.1, -4.3, 0.25),  // Curves toward Project 2 (Vision)
      new THREE.Vector3(1.4, -5.9, -0.1),  // Curves toward Project 3 (Healthcare)
      new THREE.Vector3(1.8, -7.2, 0.1),   // Terminal finish
      new THREE.Vector3(1.6, -8.2, 0.0),   // Bottom anchor
    ];
    return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);
  }, []);

  // 1. Outer Transparent Glass Conduit Pipe
  const glassGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 220, 0.038, 16, false);
  }, [curve]);

  // 2. Inner Neon Liquid Fluid Core (Rendered dynamically via setDrawRange)
  const fluidGeometry = useMemo(() => {
    const geo = new THREE.TubeGeometry(curve, 220, 0.024, 16, false);
    return geo;
  }, [curve]);

  // Total indices in the fluid tube geometry
  const totalIndices = useMemo(() => {
    return fluidGeometry.index ? fluidGeometry.index.count : 220 * 16 * 6;
  }, [fluidGeometry]);

  // Junction dock positions
  const dockPositions = useMemo(() => {
    return [
      curve.getPointAt(0.24), // Project 1 dock
      curve.getPointAt(0.56), // Project 2 dock
      curve.getPointAt(0.85), // Project 3 dock
    ];
  }, [curve]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Fade in visibility as we scroll from Hero into Projects (0.05 to 0.15)
    const visibility = THREE.MathUtils.clamp((scrollProgress - 0.04) / 0.1, 0, 1);

    if (outerGlassMatRef.current) {
      outerGlassMatRef.current.opacity = visibility * 0.45;
    }

    // Dynamic fluid fill factor: 0.0 at top of projects, 1.0 at bottom
    // When user scrolls down, fluid fills; when scrolling up, fluid drains!
    const fluidProgress = THREE.MathUtils.clamp((scrollProgress - 0.06) / 0.84, 0, 1);

    // Update draw range on fluid geometry to physically fill/drain the liquid
    if (fluidGeometry) {
      const drawCount = Math.floor(totalIndices * fluidProgress);
      // Tube faces are sets of 3 indices, align to multiples of 6
      const safeDrawCount = Math.floor(drawCount / 6) * 6;
      fluidGeometry.setDrawRange(0, safeDrawCount);
    }

    // Position of the fluid meniscus leading droplet
    if (headRef.current) {
      const sampleT = Math.max(0.001, Math.min(fluidProgress, 0.999));
      const pos = curve.getPointAt(sampleT);
      headRef.current.position.copy(pos);

      // Droplet pulses with liquid tension and fades if empty
      const isFlowing = fluidProgress > 0.01;
      const pulse = (1 + Math.sin(t * 9) * 0.25) * (isFlowing ? visibility : 0);
      headRef.current.scale.set(pulse, pulse, pulse);
    }

    if (headLightRef.current) {
      const sampleT = Math.max(0.001, Math.min(fluidProgress, 0.999));
      const pos = curve.getPointAt(sampleT);
      headLightRef.current.position.copy(pos);
      const isFlowing = fluidProgress > 0.01;
      headLightRef.current.intensity = (4.0 + Math.sin(t * 8) * 1.5) * (isFlowing ? visibility : 0);
    }

    // Animate Junction Dock Port Rings
    const updateDock = (mesh: THREE.Mesh | null, threshold: number) => {
      if (!mesh) return;
      const isReached = fluidProgress >= threshold;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = isReached ? 2.5 + Math.sin(t * 5) * 0.8 : 0.4;
      }
    };

    updateDock(dock1Ref.current, 0.24);
    updateDock(dock2Ref.current, 0.56);
    updateDock(dock3Ref.current, 0.85);
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 1. Outer Transparent Glass Capillary Conduit */}
      <mesh geometry={glassGeometry}>
        <meshPhysicalMaterial
          ref={outerGlassMatRef}
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.6}
          roughness={0.08}
          metalness={0.2}
          transmission={0.88}
          thickness={0.5}
          transparent
          opacity={0}
        />
      </mesh>

      {/* 2. Inner Glowing Neon Liquid Fluid Core (Fills / Drains with Scroll!) */}
      <mesh ref={fluidMeshRef} geometry={fluidGeometry}>
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={3.2}
          roughness={0.15}
          metalness={0.4}
        />
      </mesh>

      {/* 3. Fluid Leading Edge Droplet / Meniscus */}
      <mesh ref={headRef}>
        <sphereGeometry args={[0.075, 20, 20]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#67e8f9"
          emissiveIntensity={4.8}
          roughness={0.1}
        />
      </mesh>

      <pointLight ref={headLightRef} color="#00e5ff" intensity={0} distance={5} />

      {/* 4. Project Junction Docking Rings along the pipe */}
      <mesh ref={dock1Ref} position={dockPositions[0]}>
        <torusGeometry args={[0.065, 0.014, 16, 32]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.4} metalness={0.9} />
      </mesh>

      <mesh ref={dock2Ref} position={dockPositions[1]}>
        <torusGeometry args={[0.065, 0.014, 16, 32]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.4} metalness={0.9} />
      </mesh>

      <mesh ref={dock3Ref} position={dockPositions[2]}>
        <torusGeometry args={[0.065, 0.014, 16, 32]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.4} metalness={0.9} />
      </mesh>
    </group>
  );
}
