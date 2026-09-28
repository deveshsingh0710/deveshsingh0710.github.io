import { useState } from 'react';
import { CinemaScene } from './components/canvas/CinemaScene';
import { PortfolioLayout } from './components/ui/PortfolioLayout';
import { useSmoothScroll } from './hooks/useSmoothScroll';

export function App() {
  const { scrollProgress, projectsProgress, isInsideProjects, scrollToSection } = useSmoothScroll();
  const [hoveredProject, setHoveredProject] = useState<'quantum' | 'vision' | 'healthcare' | null>(null);

  return (
    <div className="relative w-full min-h-screen bg-[#080B14] text-slate-100 overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950">
      {/* Ambient Lighting Orbs (Vibrant Cosmic Feel matching design system) */}
      <div className="ambient-glow glow-top-right" />
      <div className="ambient-glow glow-bottom-left" />
      <div className="ambient-glow glow-center" />
      <div className="ambient-grid" />

      {/* 3D WebGL Canvas fixed in the background (Features Quantum Core, Liquid-Fill Conduit, and Hover Portal) */}
      <CinemaScene
        scrollProgress={scrollProgress}
        projectsProgress={projectsProgress}
        isInsideProjects={isInsideProjects}
        hoveredProject={hoveredProject}
      />

      {/* Complete Editorial & Modern Sections Architecture */}
      <PortfolioLayout
        scrollProgress={scrollProgress}
        projectsProgress={projectsProgress}
        isInsideProjects={isInsideProjects}
        onScrollTo={scrollToSection}
        onHoverProject={setHoveredProject}
      />
    </div>
  );
}

export default App;
