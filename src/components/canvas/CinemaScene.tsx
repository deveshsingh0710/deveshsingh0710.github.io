import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { DevPass3D } from './DevPass3D';
import { ThermometerThread } from './ThermometerThread';
import { Hover3DPreview } from './Hover3DPreview';

interface CinemaSceneProps {
  scrollProgress: number; // 0.0 to 1.0 (real page scroll)
  hoveredProject: 'quantum' | 'vision' | 'healthcare' | null;
}

const TOTAL_SCENE_DEPTH = 24.0;

function SceneCameraAndWorld({ scrollProgress, hoveredProject }: CinemaSceneProps) {
  const currentCameraY = -scrollProgress * TOTAL_SCENE_DEPTH;

  useFrame((state) => {
    // Camera descends along the vertical thermometer line
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, currentCameraY, 0.08);
    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      6.8 + Math.sin(scrollProgress * Math.PI) * 0.4,
      0.08
    );
  });

  return (
    <>
      {/* 1. Stage 1 Opening Frame: 3D Holographic Machine Learning Engineer Pass (at top y = 0) */}
      <group position={[0, 0, 0]}>
        <DevPass3D />
      </group>

      {/* 2. Vertical Luminous Thermometer Rail (Running from y = -1.2 to y = -25.2) */}
      <ThermometerThread scrollProgress={scrollProgress} />

      {/* 3. Hover-Triggered 3D Visual Preview (Only appears on cursor hover!) */}
      <Hover3DPreview hoveredProject={hoveredProject} cameraY={currentCameraY} />

      {/* Horizon Grid Lines across the depth */}
      <gridHelper args={[40, 80, '#064e3b', '#021812']} position={[0, -2.4, 0]} />
      <gridHelper args={[40, 80, '#064e3b', '#021812']} position={[0, -26.4, 0]} />
    </>
  );
}

export function CinemaScene({ scrollProgress, hoveredProject }: CinemaSceneProps) {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 7.0], fov: 45 }}
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
          count={80}
          scale={[16, 30, 14]}
          size={1.6}
          speed={0.2}
          opacity={0.35}
          color="#34d399"
        />

        <SceneCameraAndWorld scrollProgress={scrollProgress} hoveredProject={hoveredProject} />
      </Canvas>
    </div>
  );
}
