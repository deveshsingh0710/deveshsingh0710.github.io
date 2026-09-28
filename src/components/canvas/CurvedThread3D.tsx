import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DOCK_POSITIONS } from '../../utils/fluidSync';

interface CurvedThread3DProps {
  projectsProgress: number; // 0.0 to 1.0 strictly within #projects
  isInsideProjects: boolean;
}

export function CurvedThread3D({ projectsProgress, isInsideProjects }: CurvedThread3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const fluidMeshRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const headLightRef = useRef<THREE.PointLight>(null);
  const outerGlassMatRef = useRef<THREE.MeshPhysicalMaterial>(null);

  // 3 Project Junction dock refs along the conduit
  const dock1Ref = useRef<THREE.Mesh>(null);
  const dock2Ref = useRef<THREE.Mesh>(null);
  const dock3Ref = useRef<THREE.Mesh>(null);

  // High-precision organic curved glass conduit positioned in the right visual gutter
  const curve = useMemo(() => {
    const points = [
      new THREE.Vector3(1.8, -1.2, 0.2),   // Starts at top of projects runway
      new THREE.Vector3(1.3, -2.6, -0.15), // Point 1: Project 1 (Quantum)
      new THREE.Vector3(2.1, -4.2, 0.25),  // Point 2: Project 2 (Vision)
      new THREE.Vector3(1.4, -6.0, -0.1),  // Point 3: Project 3 (Healthcare)
      new THREE.Vector3(1.7, -7.4, 0.1),   // Terminal finish
    ];
    return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);
  }, []);

  // 1. Outer Transparent Glass Conduit Pipe
  const glassGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 220, 0.038, 16, false);
  }, [curve]);

  // 2. Inner Neon Liquid Fluid Core (Rendered dynamically via setDrawRange)
  const fluidGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 220, 0.024, 16, false);
  }, [curve]);

  // Total indices in the fluid tube geometry
  const totalIndices = useMemo(() => {
    return fluidGeometry.index ? fluidGeometry.index.count : 220 * 16 * 6;
  }, [fluidGeometry]);

  // 3 Junction dock positions matching DOCK_POSITIONS
  const dockPositions = useMemo(() => {
    return [
      curve.getPointAt(DOCK_POSITIONS.PROJECT_1), // 0.22
      curve.getPointAt(DOCK_POSITIONS.PROJECT_2), // 0.55
      curve.getPointAt(DOCK_POSITIONS.PROJECT_3), // 0.85
    ];
  }, [curve]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (outerGlassMatRef.current) {
      outerGlassMatRef.current.opacity = THREE.MathUtils.lerp(
        outerGlassMatRef.current.opacity,
        isInsideProjects ? 0.45 : 0.1,
        0.08
      );
    }

    // Dynamic fluid fill factor computed directly from projectsProgress
    const fluidProgress = THREE.MathUtils.clamp(projectsProgress, 0, 1);

    // Update draw range on fluid geometry to physically fill/drain the liquid
    if (fluidGeometry) {
      const drawCount = Math.floor(totalIndices * fluidProgress);
      const safeDrawCount = Math.floor(drawCount / 6) * 6;
      fluidGeometry.setDrawRange(0, safeDrawCount);
    }

    // Position of the fluid meniscus leading droplet
    if (headRef.current) {
      const sampleT = Math.max(0.001, Math.min(fluidProgress, 0.999));
      const pos = curve.getPointAt(sampleT);
      headRef.current.position.copy(pos);

      // Droplet pulses with liquid tension
      const isFlowing = fluidProgress > 0.005 && isInsideProjects;
      const pulse = (1 + Math.sin(t * 9) * 0.25) * (isFlowing ? 1.0 : 0);
      headRef.current.scale.set(pulse, pulse, pulse);
    }

    if (headLightRef.current) {
      const sampleT = Math.max(0.001, Math.min(fluidProgress, 0.999));
      const pos = curve.getPointAt(sampleT);
      headLightRef.current.position.copy(pos);
      const isFlowing = fluidProgress > 0.005 && isInsideProjects;
      headLightRef.current.intensity = (4.0 + Math.sin(t * 8) * 1.5) * (isFlowing ? 1.0 : 0);
    }

    // Animate Junction Dock Port Rings
    const updateDock = (mesh: THREE.Mesh | null, dockT: number) => {
      if (!mesh) return;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (!mat) return;

      const isCurrentActive = Math.abs(fluidProgress - dockT) < 0.07 && isInsideProjects;
      const isPassed = fluidProgress >= dockT && isInsideProjects;

      if (isCurrentActive) {
        // High-energy pulsing beacon when fluid is actively docked
        mat.emissiveIntensity = 3.8 + Math.sin(t * 8) * 1.2;
      } else if (isPassed) {
        // Latched illuminated state
        mat.emissiveIntensity = 1.3;
      } else {
        // Standby state
        mat.emissiveIntensity = 0.2;
      }
    };

    updateDock(dock1Ref.current, DOCK_POSITIONS.PROJECT_1);
    updateDock(dock2Ref.current, DOCK_POSITIONS.PROJECT_2);
    updateDock(dock3Ref.current, DOCK_POSITIONS.PROJECT_3);
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

      {/* 4. 3 Project Junction Docking Rings along the pipe */}
      <mesh ref={dock1Ref} position={dockPositions[0]}>
        <torusGeometry args={[0.065, 0.014, 16, 32]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.2} metalness={0.9} />
      </mesh>

      <mesh ref={dock2Ref} position={dockPositions[1]}>
        <torusGeometry args={[0.065, 0.014, 16, 32]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.2} metalness={0.9} />
      </mesh>

      <mesh ref={dock3Ref} position={dockPositions[2]}>
        <torusGeometry args={[0.065, 0.014, 16, 32]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.2} metalness={0.9} />
      </mesh>
    </group>
  );
}
