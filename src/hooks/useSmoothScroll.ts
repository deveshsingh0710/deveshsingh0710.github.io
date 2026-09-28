import { useState, useEffect, useRef } from 'react';

export function useSmoothScroll() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const isAnimating = useRef(false);
  const animId = useRef<number | null>(null);

  useEffect(() => {
    const updateLoop = () => {
      const diff = targetProgress.current - currentProgress.current;

      if (Math.abs(diff) < 0.0004) {
        currentProgress.current = targetProgress.current;
        setScrollProgress(targetProgress.current);
        isAnimating.current = false;
        animId.current = null;
        return; // Settle and stop loop to save CPU & GPU cycles
      }

      currentProgress.current += diff * 0.12;
      setScrollProgress(currentProgress.current);
      animId.current = requestAnimationFrame(updateLoop);
    };

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        targetProgress.current = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      }

      if (!isAnimating.current) {
        isAnimating.current = true;
        animId.current = requestAnimationFrame(updateLoop);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial sync
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animId.current !== null) {
        cancelAnimationFrame(animId.current);
      }
    };
  }, []);

  const scrollToProgress = (progress: number) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll > 0) {
      window.scrollTo({ top: progress * maxScroll, behavior: 'smooth' });
    }
  };

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (sectionId === 'p1' || sectionId === 'quantum' || sectionId === 'projects') {
      scrollToProgress(0.24);
    } else if (sectionId === 'p2' || sectionId === 'vision') {
      scrollToProgress(0.56);
    } else if (sectionId === 'p3' || sectionId === 'telemetry') {
      scrollToProgress(0.86);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return { scrollProgress, scrollToSection, scrollToProgress };
}
