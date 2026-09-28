import { useState, useEffect, useRef } from 'react';

export function useSmoothScroll() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [projectsProgress, setProjectsProgress] = useState(0);
  const [isInsideProjects, setIsInsideProjects] = useState(false);

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

      // Check projects section scroll progress
      const projectsEl = document.getElementById('projects');
      if (projectsEl) {
        const top = projectsEl.offsetTop;
        const height = projectsEl.offsetHeight - window.innerHeight;
        if (height > 0) {
          const p = Math.min(Math.max((window.scrollY - top) / height, 0), 1);
          setProjectsProgress(p);
          setIsInsideProjects(window.scrollY >= top - 80 && window.scrollY <= top + height + 80);
        }
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

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'hero' || sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'p1' || sectionId === 'p2' || sectionId === 'p3') {
      const projectsEl = document.getElementById('projects');
      if (projectsEl) {
        const top = projectsEl.offsetTop;
        const height = projectsEl.offsetHeight - window.innerHeight;
        const dockMap: Record<string, number> = { p1: 0.22, p2: 0.55, p3: 0.85 };
        const dock = dockMap[sectionId] ?? 0;
        window.scrollTo({ top: top + dock * height, behavior: 'smooth' });
      }
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return { scrollProgress, projectsProgress, isInsideProjects, scrollToSection };
}
