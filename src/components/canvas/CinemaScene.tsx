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
      const targetY = scrollProgress * 7.0;
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
      {/* 1. Interactive 3D Hero Object for Opening Frame (Tilts with cursor, disappears on scroll) */}
      <HeroInteractive3D scrollProgress={scrollProgress} />

      {/* 2. World Group that scrolls down through Projects */}
      <group ref={worldGroupRef} position={[0, 0, 0]}>
        {/* Organic 3D Curved S-Spline Thread (Begins at Projects, zero visibility in Hero) */}
        <CurvedThread3D scrollProgress={scrollProgress} />

        {/* Subtle Ambient Grid Plane */}
        <gridHelper args={[24, 48, '#064e3b', '#021812']} position={[0, -2.5, 0]} />
        <gridHelper args={[24, 48, '#064e3b', '#021812']} position={[0, -7.5, 0]} />
      </group>

      {/* 3. Magnetic Floating Hover Portal (Tracks cursor, only active on project hover!) */}
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
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#020605']} />

        {/* Studio Lighting */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[6, 9, 6]} intensity={2.5} color="#ecfdf5" />
        <directionalLight position={[-6, -4, -3]} intensity={1.8} color="#10b981" />
        <directionalLight position={[0, -6, 5]} intensity={1.2} color="#06b6d4" />

        {/* Floating Atmospheric Sparkles */}
        <Sparkles
          count={70}
          scale={[16, 18, 14]}
          size={1.4}
          speed={0.2}
          opacity={0.3}
          color="#34d399"
        />

        <SceneWorld scrollProgress={scrollProgress} hoveredProject={hoveredProject} />

        {/* Cinematic Post-Processing Bloom & Vignette */}
        <EffectComposer multisampling={4}>
          <Bloom
            luminanceThreshold={0.55}
            luminanceSmoothing={0.7}
            intensity={1.2}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.15} darkness={0.8} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
