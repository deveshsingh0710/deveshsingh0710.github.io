import { CinemaScene } from './components/canvas/CinemaScene';
import { CinemaOverlay } from './components/ui/CinemaOverlay';
import { useSmoothScroll } from './hooks/useSmoothScroll';

export function App() {
  const { scrollProgress, activeStage, scrollToStage } = useSmoothScroll(5);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#030806] select-none">
      {/* Background Radial Glow (Matching Zero University's velvety depth) */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 70% 50%, rgba(6, 46, 32, 0.45) 0%, rgba(3, 16, 12, 0.8) 55%, #020705 100%)',
        }}
      />

      {/* Real-time 3D WebGL Canvas */}
      <CinemaScene scrollProgress={scrollProgress} />

      {/* High-End Editorial Scrollytelling HUD */}
      <CinemaOverlay
        scrollProgress={scrollProgress}
        activeStage={activeStage}
        onJumpToStage={scrollToStage}
      />
    </div>
  );
}

export default App;
