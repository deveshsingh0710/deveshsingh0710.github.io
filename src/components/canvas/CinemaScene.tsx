import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { CurvedThread3D } from './CurvedThread3D';
import { FloatingHoverPortal } from './FloatingHoverPortal';
import { HeroInteractive3D } from './HeroInteractive3D';

interface CinemaSceneProps {
  scrollProgress: number; // 0.0 to 1.0 (real page scroll)
  hoveredProject: 'quantum' | 'vision' | 'healthcare' | null;
}

function SceneWorld({ scrollProgress, hoveredProject }: CinemaSceneProps) {
  const worldGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    // Thread & world descends smoothly with scroll progress
    if (worldGroupRef.current) {
      const targetY = scrollProgress * 7.2;
      worldGroupRef.current.position.y = THREE.MathUtils.lerp(worldGroupRef.current.position.y, targetY, 0.08);

      // Subtle mouse parallax on the world
      worldGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        worldGroupRef.current.rotation.y,
        state.pointer.x * 0.08,
        0.05
      );
    }
  });

  return (
    <>
      {/* 1. Interactive 3D Hero Object for Opening Frame */}
      <HeroInteractive3D scrollProgress={scrollProgress} />

      {/* 2. World Group that scrolls down through Projects */}
      <group ref={worldGroupRef} position={[0, 0, 0]}>
        {/* Dynamic Liquid Fluid-Fill 3D Thread with project junction docking ports */}
        <CurvedThread3D scrollProgress={scrollProgress} />

        {/* Ambient Spatial Grids */}
        <gridHelper args={[32, 64, '#06b6d4', '#1e293b']} position={[0, -2.4, 0]} />
        <gridHelper args={[32, 64, '#06b6d4', '#1e293b']} position={[0, -7.2, 0]} />
      </group>

      {/* 3. Magnetic Floating Hover Portal (Tracks cursor, only active on project name hover!) */}
      <FloatingHoverPortal hoveredProject={hoveredProject} />
    </>
  );
}

export function CinemaScene({ scrollProgress, hoveredProject }: CinemaSceneProps) {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.35,
        }}
        dpr={[1, 2]}
      >
        {/* Transparent background so CSS cosmic glowing orbs and cyber grid show through */}

        {/* Cinematic Studio Lighting */}
        <ambientLight intensity={1.2} />
        <directionalLight position={[6, 9, 6]} intensity={3.5} color="#e0f2fe" />
        <directionalLight position={[-6, -4, -3]} intensity={2.6} color="#00e5ff" />
        <directionalLight position={[0, -6, 5]} intensity={2.0} color="#818cf8" />

        {/* Floating Atmospheric Cyber Sparkles */}
        <Sparkles
          count={100}
          scale={[20, 22, 16]}
          size={1.8}
          speed={0.3}
          opacity={0.45}
          color="#00e5ff"
        />

        <SceneWorld scrollProgress={scrollProgress} hoveredProject={hoveredProject} />

        {/* High-End Post-Processing: Soft Selective Bloom & Subtle Vignette */}
        <EffectComposer multisampling={4}>
          <Bloom
            luminanceThreshold={0.48}
            luminanceSmoothing={0.8}
            intensity={1.4}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.08} darkness={0.65} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
