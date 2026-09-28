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
  scrollProgress: number; // 0.0 to 1.0 (real page scroll)
}

function SceneCameraAndWorld({ scrollProgress }: { scrollProgress: number }) {
  useFrame((state) => {
    // Camera smoothly descends along the vertical spine from y = 0 to y = -12.0
    const targetY = -scrollProgress * 12.0;
    const targetZ = 6.8 + Math.sin(scrollProgress * Math.PI) * 0.6;
    const targetRotX = (state.pointer.y * 0.1);
    const targetRotY = (state.pointer.x * 0.15);

    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.08);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.08);
    state.camera.rotation.x = THREE.MathUtils.lerp(state.camera.rotation.x, targetRotX, 0.05);
    state.camera.rotation.y = THREE.MathUtils.lerp(state.camera.rotation.y, targetRotY, 0.05);
  });

  return (
    <>
      {/* Continuous 3D Luminous Fiber Thread running through the entire height */}
      <LuminousThread scrollProgress={scrollProgress} />

      {/* 3D Stations physically positioned down the Y axis */}
      <group position={[0, 0, 0]}>
        {/* y = 0 : Frame 1 Liquid Obsidian Core */}
        <group position={[0, 0, 0]}>
          <LiquidCore opacity={1} />
        </group>

        {/* y = -3.0 : Project 1 Quantum Tunneling */}
        <group position={[0, -3.0, 0]}>
          <QuantumStage opacity={1} />
        </group>

        {/* y = -6.0 : Project 2 LabelChecker AI */}
        <group position={[0, -6.0, 0]}>
          <VisionStage opacity={1} />
        </group>

        {/* y = -9.0 : Project 3 Healthcare System */}
        <group position={[0, -9.0, 0]}>
          <HealthcareStage opacity={1} />
        </group>

        {/* y = -12.0 : Terminal / Contact Core */}
        <group position={[0, -12.0, 0]}>
          <TerminalStage opacity={1} />
        </group>
      </group>

      {/* Multi-tier Horizon Grids across the descent */}
      <gridHelper args={[40, 80, '#064e3b', '#021812']} position={[0, -2.2, 0]} />
      <gridHelper args={[40, 80, '#064e3b', '#021812']} position={[0, -14.2, 0]} />
    </>
  );
}

export function CinemaScene({ scrollProgress }: CinemaSceneProps) {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-auto z-0">
      <Canvas
        camera={{ position: [0, 0, 7.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#030907']} />

        {/* Studio Lighting */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[6, 9, 6]} intensity={2.5} color="#ecfdf5" />
        <directionalLight position={[-6, -4, -3]} intensity={1.8} color="#10b981" />
        <directionalLight position={[0, -6, 5]} intensity={1.2} color="#06b6d4" />

        {/* Floating Atmospheric Sparkles */}
        <Sparkles
          count={90}
          scale={[16, 24, 14]}
          size={1.8}
          speed={0.2}
          opacity={0.35}
          color="#34d399"
        />

        <SceneCameraAndWorld scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
