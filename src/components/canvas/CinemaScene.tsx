import { useRef, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { CurvedThread3D } from './CurvedThread3D';
import { FloatingHoverPortal } from './FloatingHoverPortal';
import { HeroInteractive3D } from './HeroInteractive3D';

interface CinemaSceneProps {
  scrollProgress: number; // 0.0 to 1.0 (real page scroll)
  projectsProgress: number; // 0.0 to 1.0 (inside projects section)
  isInsideProjects: boolean;
  hoveredProject: 'quantum' | 'vision' | 'healthcare' | null;
}

function SceneWorld({ scrollProgress, projectsProgress, isInsideProjects, hoveredProject }: CinemaSceneProps) {
  const worldGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    // Thread descends strictly when inside projects section
    if (worldGroupRef.current) {
      const targetY = isInsideProjects ? projectsProgress * 6.6 : 0;
      worldGroupRef.current.position.y = THREE.MathUtils.lerp(worldGroupRef.current.position.y, targetY, 0.1);

      // Subtle gentle pointer parallax
      worldGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        worldGroupRef.current.rotation.y,
        state.pointer.x * 0.04,
        0.05
      );
    }
  });

  return (
    <>
      {/* 1. Interactive 3D Hero Object for Opening Frame */}
      <HeroInteractive3D scrollProgress={scrollProgress} />

      {/* 2. World Group for Projects (Only visible when active in projects) */}
      <group ref={worldGroupRef} position={[0, 0, 0]}>
        <CurvedThread3D projectsProgress={projectsProgress} isInsideProjects={isInsideProjects} />
      </group>

      {/* 3. Magnetic Floating Hover Portal (Tracks cursor, only active on project name hover!) */}
      <FloatingHoverPortal hoveredProject={hoveredProject} />
    </>
  );
}

export const CinemaScene = memo(function CinemaScene({
  scrollProgress,
  projectsProgress,
  isInsideProjects,
  hoveredProject
}: CinemaSceneProps) {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        dpr={[1, 1.5]}
      >
        {/* Balanced, Sophisticated Studio Lighting (No harsh blinding overexposure) */}
        <ambientLight intensity={0.45} />
        <directionalLight position={[5, 8, 5]} intensity={1.4} color="#e0f2fe" />
        <directionalLight position={[-5, -3, -2]} intensity={0.9} color="#00e5ff" />

        {/* Lightweight subtle atmospheric particles */}
        <Sparkles
          count={25}
          scale={[18, 18, 14]}
          size={1.4}
          speed={0.2}
          opacity={0.3}
          color="#22d3ee"
        />

        <SceneWorld
          scrollProgress={scrollProgress}
          projectsProgress={projectsProgress}
          isInsideProjects={isInsideProjects}
          hoveredProject={hoveredProject}
        />

        {/* High-Performance Bloom: Selective, crisp, non-blurry glow strictly on emissive nodes */}
        <EffectComposer multisampling={0}>
          <Bloom
            luminanceThreshold={0.82}
            luminanceSmoothing={0.7}
            intensity={1.1}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.1} darkness={0.5} />
        </EffectComposer>
      </Canvas>
    </div>
  );
});
