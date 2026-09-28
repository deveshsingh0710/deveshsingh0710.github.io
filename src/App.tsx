import { CinemaScene } from './components/canvas/CinemaScene';
import { PortfolioLayout } from './components/ui/PortfolioLayout';
import { useSmoothScroll } from './hooks/useSmoothScroll';

export function App() {
  const { scrollProgress, scrollToSection } = useSmoothScroll();

  return (
    <div className="relative w-full min-h-screen bg-[#030806] text-slate-100 overflow-x-hidden">
      {/* Background Radial Glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 75% 45%, rgba(6, 46, 32, 0.4) 0%, rgba(3, 16, 12, 0.75) 55%, #020705 100%)',
        }}
      />

      {/* 3D WebGL Canvas fixed in the background */}
      <CinemaScene scrollProgress={scrollProgress} />

      {/* Real Vertical Portfolio Content (Natural Scrolling with Zero Overlap!) */}
      <PortfolioLayout onScrollTo={scrollToSection} />
    </div>
  );
}

export default App;
