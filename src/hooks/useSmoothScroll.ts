import { useState, useEffect, useRef } from 'react';

export function useSmoothScroll(totalStages: number = 5) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(0);

  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const touchStartY = useRef(0);

  useEffect(() => {
    let animId: number;

    const updateLoop = () => {
      // Exponential smoothing (damping / lerp)
      const diff = targetProgress.current - currentProgress.current;
      currentProgress.current += diff * 0.075; // Butter-smooth easing

      setScrollProgress(currentProgress.current);

      // Determine active stage (0 to totalStages - 1)
      const stage = Math.min(
        Math.max(Math.round(currentProgress.current * (totalStages - 1)), 0),
        totalStages - 1
      );
      setActiveStage(stage);

      animId = requestAnimationFrame(updateLoop);
    };

    animId = requestAnimationFrame(updateLoop);

    // Mouse wheel handler with normalized delta
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * 0.0006;
      targetProgress.current = Math.min(Math.max(targetProgress.current + delta, 0), 1);
    };

    // Touch gesture handler
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const delta = (touchStartY.current - e.touches[0].clientY) * 0.0012;
      touchStartY.current = e.touches[0].clientY;
      targetProgress.current = Math.min(Math.max(targetProgress.current + delta, 0), 1);
    };

    // Keyboard arrow keys
    const handleKeyDown = (e: KeyboardEvent) => {
      const step = 1 / (totalStages - 1);
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        targetProgress.current = Math.min(targetProgress.current + step, 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        targetProgress.current = Math.max(targetProgress.current - step, 0);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [totalStages]);

  const scrollToStage = (stageIndex: number) => {
    const target = stageIndex / (totalStages - 1);
    targetProgress.current = Math.min(Math.max(target, 0), 1);
  };

  return { scrollProgress, activeStage, scrollToStage };
}
