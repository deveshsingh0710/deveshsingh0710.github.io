import { useState, useEffect, useRef, useCallback } from 'react';
import { Scene } from './components/canvas/Scene';
import { Header } from './components/ui/Header';
import { PageOverlay } from './components/ui/PageOverlay';
import { BookNavigation } from './components/ui/BookNavigation';
import { QuickViewModal } from './components/ui/QuickViewModal';
import { sounds } from './utils/audio';

const TOTAL_CHAPTERS = 6; // 0: Cover, 1: Genesis/Bio, 2: Quantum, 3: Vision, 4: Healthcare, 5: Epilogue

export function App() {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [flipProgress, setFlipProgress] = useState(0);
  const [isTurning, setIsTurning] = useState(false);
  const [isQuickView, setIsQuickView] = useState(false);

  const wheelThrottleRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);
  const touchStartXRef = useRef<number>(0);

  // Smooth page turn transition
  const navigateToChapter = useCallback((targetChapter: number) => {
    if (targetChapter === currentChapter || isTurning) return;
    if (targetChapter < 0 || targetChapter >= TOTAL_CHAPTERS) return;

    setIsTurning(true);
    setFlipProgress(0);

    const startTime = performance.now();
    const duration = 650; // 650ms smooth page turn

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth cubic easing
      const easeProgress = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      setFlipProgress(easeProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCurrentChapter(targetChapter);
        setFlipProgress(0);
        setIsTurning(false);
      }
    };

    requestAnimationFrame(animate);
  }, [currentChapter, isTurning]);

  // Wheel listener for smooth scrollytelling page turns
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isQuickView) return;

      const now = Date.now();
      if (now - wheelThrottleRef.current < 800) return; // 800ms debounce
      if (Math.abs(e.deltaY) < 25) return;

      if (e.deltaY > 0) {
        // Scroll down -> next chapter
        if (currentChapter < TOTAL_CHAPTERS - 1) {
          wheelThrottleRef.current = now;
          sounds.playPageFlip();
          navigateToChapter(currentChapter + 1);
        }
      } else {
        // Scroll up -> previous chapter
        if (currentChapter > 0) {
          wheelThrottleRef.current = now;
          sounds.playPageFlip();
          navigateToChapter(currentChapter - 1);
        }
      }
    };

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isQuickView) {
        if (e.key === 'Escape') setIsQuickView(false);
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        if (currentChapter < TOTAL_CHAPTERS - 1) {
          sounds.playPageFlip();
          navigateToChapter(currentChapter + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentChapter > 0) {
          sounds.playPageFlip();
          navigateToChapter(currentChapter - 1);
        }
      }
    };

    // Touch gesture swipe handling
    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
      touchStartXRef.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isQuickView) return;
      const deltaY = touchStartYRef.current - e.changedTouches[0].clientY;
      const deltaX = touchStartXRef.current - e.changedTouches[0].clientX;

      if (Math.abs(deltaY) > 50 || Math.abs(deltaX) > 50) {
        if (deltaY > 50 || deltaX > 50) {
          if (currentChapter < TOTAL_CHAPTERS - 1) {
            sounds.playPageFlip();
            navigateToChapter(currentChapter + 1);
          }
        } else {
          if (currentChapter > 0) {
            sounds.playPageFlip();
            navigateToChapter(currentChapter - 1);
          }
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentChapter, navigateToChapter, isQuickView]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#08090c] select-none">
      {/* 3D WebGL Canvas Scene */}
      <Scene
        currentChapter={currentChapter}
        flipProgress={flipProgress}
        isTurning={isTurning}
      />

      {/* Top Header */}
      <Header
        isQuickView={isQuickView}
        onToggleQuickView={() => setIsQuickView(!isQuickView)}
      />

      {/* Page Text & Interactive Overlay */}
      <PageOverlay
        currentChapter={currentChapter}
        onOpenBook={() => navigateToChapter(1)}
        onNavigateChapter={navigateToChapter}
      />

      {/* Bottom Bookmark Navigation */}
      <BookNavigation
        currentChapter={currentChapter}
        totalChapters={TOTAL_CHAPTERS}
        onNavigate={navigateToChapter}
      />

      {/* Recruiter Quick View Modal */}
      <QuickViewModal
        isOpen={isQuickView}
        onClose={() => setIsQuickView(false)}
        onJumpToProject={(chapter) => {
          setIsQuickView(false);
          navigateToChapter(chapter);
        }}
      />
    </div>
  );
}

export default App;
