import { useState } from 'react';
import { CinemaScene } from './components/canvas/CinemaScene';
import { PortfolioLayout } from './components/ui/PortfolioLayout';
import { useSmoothScroll } from './hooks/useSmoothScroll';

export function App() {
  const { scrollProgress, scrollToSection } = useSmoothScroll();
  const [hoveredProject, setHoveredProject] = useState<'quantum' | 'vision' | 'healthcare' | null>(null);

  return (
    <div className="relative w-full min-h-screen bg-[#07090e] text-slate-100 overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950">
      {/* Ambient Lighting Orbs (Vibrant Cosmic Feel) */}
      <div className="ambient-glow glow-top-right" />
      <div className="ambient-glow glow-bottom-left" />
      <div className="ambient-glow glow-center" />
      <div className="ambient-grid" />

      {/* 3D WebGL Canvas fixed in the background (Features Quantum Core, Liquid-Fill Conduit, and Hover Portal) */}
      <CinemaScene scrollProgress={scrollProgress} hoveredProject={hoveredProject} />

      {/* Clean Editorial Layout with Single Sticky Card synchronized to fluid thread limits */}
      <PortfolioLayout
        scrollProgress={scrollProgress}
        onScrollTo={scrollToSection}
        onHoverProject={setHoveredProject}
      />
    </div>
  );
}

export default App;
