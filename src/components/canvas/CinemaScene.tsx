import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { HeroStage } from './stages/HeroStage';
import { QuantumStage } from './stages/QuantumStage';
import { VisionStage } from './stages/VisionStage';
import { HealthcareStage } from './stages/HealthcareStage';
import { TerminalStage } from './stages/TerminalStage';

interface CinemaSceneProps {
  scrollProgress: number; // 0.0 to 1.0
}

function SceneCameraAndStages({ scrollProgress }: { scrollProgress: number }) {
  // Helper to calculate smooth bell curve opacity for each stage
  // Centers: 0.0, 0.25, 0.50, 0.75, 1.0
  const getStageOpacity = (center: number, width: number = 0.22) => {
    const dist = Math.abs(scrollProgress - center);
    if (dist > width) return 0;
    // Cosine smoothing from 1 at center to 0 at width
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
    const targetY = -scrollProgress * 2.0;
    const targetZ = 6.8 + Math.sin(scrollProgress * Math.PI) * 0.8;
    const targetRotX = scrollProgress * 0.15;

    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.08);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.08);
    state.camera.rotation.x = THREE.MathUtils.lerp(state.camera.rotation.x, targetRotX, 0.08);
  });

  return (
    <>
      {/* Dynamic Stages positioned along the scrollytelling path */}
      <group position={[0, 0, 0]}>
        <HeroStage opacity={opacities[0]} />
        <QuantumStage opacity={opacities[1]} />
        <VisionStage opacity={opacities[2]} />
        <HealthcareStage opacity={opacities[3]} />
        <TerminalStage opacity={opacities[4]} />
      </group>

      {/* Infinite Horizon Floor Grid with subtle fade */}
      <gridHelper
        args={[30, 60, '#064e3b', '#031a14']}
        position={[0, -2.2, 0]}
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
        {/* Deep emerald-obsidian atmospheric background tone */}
        <color attach="background" args={['#040a08']} />

        {/* Studio Ambient & Directional Lighting */}
        <ambientLight intensity={0.6} />

        <directionalLight position={[5, 8, 5]} intensity={2.2} color="#ecfdf5" />
        <directionalLight position={[-6, -4, -3]} intensity={1.5} color="#10b981" />
        <directionalLight position={[0, -6, 4]} intensity={1.0} color="#06b6d4" />

        {/* Ambient Floating Dust Motes */}
        <Sparkles
          count={70}
          scale={[14, 10, 12]}
          size={1.6}
          speed={0.3}
          opacity={0.35}
          color="#34d399"
        />

        <SceneCameraAndStages scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
