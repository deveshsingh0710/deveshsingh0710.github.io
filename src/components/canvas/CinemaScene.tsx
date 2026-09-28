import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
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
    // Camera descends along the precision thermometer line
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, currentCameraY, 0.08);
    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      6.6 + Math.sin(scrollProgress * Math.PI) * 0.35,
      0.08
    );
  });

  return (
    <>
      {/* 1. Stage 1 Opening Frame: 3D Holographic Machine Learning Engineer Pass (at top y = 0) */}
      <group position={[0, 0, 0]}>
        <DevPass3D />
      </group>

      {/* 2. Precision Luminous Thermometer Rail (Running from y = -1.35 to y = -25.35) */}
      <ThermometerThread scrollProgress={scrollProgress} />

      {/* 3. Hover-Triggered 3D Visual Preview (Only appears on cursor hover!) */}
      <Hover3DPreview hoveredProject={hoveredProject} cameraY={currentCameraY} />

      {/* Deep Horizon Grids across the descent */}
      <gridHelper args={[40, 80, '#064e3b', '#021812']} position={[0, -2.4, 0]} />
      <gridHelper args={[40, 80, '#064e3b', '#021812']} position={[0, -26.4, 0]} />
    </>
  );
}

export function CinemaScene({ scrollProgress, hoveredProject }: CinemaSceneProps) {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 6.8], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#020605']} />

        {/* Cinematic Studio Lighting */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[6, 9, 6]} intensity={2.5} color="#ecfdf5" />
        <directionalLight position={[-6, -4, -3]} intensity={2.0} color="#10b981" />
        <directionalLight position={[0, -6, 5]} intensity={1.4} color="#38bdf8" />

        {/* Volumetric Floating Particles */}
        <Sparkles
          count={90}
          scale={[16, 30, 14]}
          size={1.5}
          speed={0.2}
          opacity={0.3}
          color="#34d399"
        />

        <SceneCameraAndWorld scrollProgress={scrollProgress} hoveredProject={hoveredProject} />

        {/* AAA Cinematic Post-Processing Pipeline */}
        <EffectComposer multisampling={4}>
          {/* Authentic optical bloom on emissive lights and lasers */}
          <Bloom
            luminanceThreshold={0.55}
            luminanceSmoothing={0.7}
            intensity={1.2}
            mipmapBlur
          />
          {/* Subtle cinematic lens vignette */}
          <Vignette eskil={false} offset={0.15} darkness={0.8} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
