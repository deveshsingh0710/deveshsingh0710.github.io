import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { LiquidCore } from './stages/LiquidCore';
import { LuminousThread } from './LuminousThread';
import { QuantumStage } from './stages/QuantumStage';
import { VisionStage } from './stages/VisionStage';
import { HealthcareStage } from './stages/HealthcareStage';
import { TerminalStage } from './stages/TerminalStage';

interface CinemaSceneProps {
  scrollProgress: number; // 0.0 to 1.0
}

function SceneCameraAndStages({ scrollProgress }: { scrollProgress: number }) {
  // Helper to calculate smooth bell curve opacity for each stage
  const getStageOpacity = (center: number, width: number = 0.22) => {
    const dist = Math.abs(scrollProgress - center);
    if (dist > width) return 0;
    return (Math.cos((dist / width) * Math.PI) + 1) / 2;
  };

  const opacities = [
    getStageOpacity(0.0, 0.22),
    getStageOpacity(0.25, 0.22),
    getStageOpacity(0.50, 0.22),
    getStageOpacity(0.75, 0.22),
    getStageOpacity(1.0, 0.22)
  ];

  useFrame((state) => {
    // Cinematic camera travel along scroll progress
    const targetY = -scrollProgress * 2.2;
    const targetZ = 6.8 + Math.sin(scrollProgress * Math.PI) * 0.8;
    const targetRotX = scrollProgress * 0.12;

    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.08);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.08);
    state.camera.rotation.x = THREE.MathUtils.lerp(state.camera.rotation.x, targetRotX, 0.08);
  });

  return (
    <>
      {/* The 3D Luminous Fiber Thread connecting all stages */}
      <LuminousThread scrollProgress={scrollProgress} />

      {/* Dynamic Stages along the thread */}
      <group position={[0, 0, 0]}>
        {/* Frame 1: Pure Liquid Obsidian Core (Cursor-reactive, NO early projects) */}
        <LiquidCore opacity={opacities[0]} />

        {/* Project Stations inside Realistic Hardware Frames */}
        <QuantumStage opacity={opacities[1]} />
        <VisionStage opacity={opacities[2]} />
        <HealthcareStage opacity={opacities[3]} />
        <TerminalStage opacity={opacities[4]} />
      </group>

      {/* Infinite Horizon Floor Grid with subtle fade */}
      <gridHelper
        args={[36, 72, '#064e3b', '#021812']}
        position={[0, -2.4, 0]}
      />
    </>
  );
}

export function CinemaScene({ scrollProgress }: CinemaSceneProps) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 7.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#030907']} />

        {/* Studio Lighting Rig */}
        <ambientLight intensity={0.7} />

        <directionalLight position={[6, 9, 6]} intensity={2.5} color="#ecfdf5" />
        <directionalLight position={[-6, -4, -3]} intensity={1.8} color="#10b981" />
        <directionalLight position={[0, -6, 5]} intensity={1.2} color="#06b6d4" />

        {/* Volumetric Floating Dust Particles */}
        <Sparkles
          count={80}
          scale={[14, 12, 12]}
          size={1.6}
          speed={0.25}
          opacity={0.35}
          color="#34d399"
        />

        <SceneCameraAndStages scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
