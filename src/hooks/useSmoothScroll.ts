import { useState, useEffect, useRef } from 'react';

export function useSmoothScroll() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);

  useEffect(() => {
    let animId: number;

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        targetProgress.current = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      }
    };

    const updateLoop = () => {
      // Butter-smooth lerp damping
      const diff = targetProgress.current - currentProgress.current;
      currentProgress.current += diff * 0.08;

      setScrollProgress(currentProgress.current);
      animId = requestAnimationFrame(updateLoop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    animId = requestAnimationFrame(updateLoop);

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return { scrollProgress, scrollToSection };
}
