import { ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface BookNavigationProps {
  currentChapter: number;
  totalChapters: number;
  onNavigate: (chapter: number) => void;
}

const CHAPTER_LABELS = [
  'Cover',
  'I. Genesis',
  'II. Quantum',
  'III. Vision',
  'IV. Health',
  'V. Contact'
];

export function BookNavigation({ currentChapter, totalChapters, onNavigate }: BookNavigationProps) {
  const handlePrev = () => {
    if (currentChapter > 0) {
      sounds.playPageFlip();
      onNavigate(currentChapter - 1);
    }
  };

  const handleNext = () => {
    if (currentChapter < totalChapters - 1) {
      sounds.playPageFlip();
      onNavigate(currentChapter + 1);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 flex flex-col items-center pb-4 px-4 pointer-events-none">
      {/* Chapter Indicator Ribbon Tabs */}
      <div className="flex items-center space-x-1 sm:space-x-1.5 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-xl shadow-2xl pointer-events-auto">
        {/* Previous Page Button */}
        <button
          onClick={handlePrev}
          disabled={currentChapter === 0}
          className={`p-1.5 rounded-lg border transition-all ${
            currentChapter === 0
              ? 'opacity-30 border-transparent text-slate-600 cursor-not-allowed'
              : 'hover:bg-slate-800 text-slate-300 border-slate-800 cursor-pointer'
          }`}
          title="Previous Page (Left Arrow)"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Ribbon Bookmark Tabs */}
        {CHAPTER_LABELS.map((label, idx) => {
          const isActive = currentChapter === idx;
          return (
            <button
              key={idx}
              onClick={() => {
                if (currentChapter !== idx) {
                  sounds.playPageFlip();
                  onNavigate(idx);
                }
              }}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-mono-code transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {isActive && <Bookmark className="w-3 h-3 fill-slate-950" />}
              <span>{label}</span>
            </button>
          );
        })}

        {/* Next Page Button */}
        <button
          onClick={handleNext}
          disabled={currentChapter === totalChapters - 1}
          className={`p-1.5 rounded-lg border transition-all ${
            currentChapter === totalChapters - 1
              ? 'opacity-30 border-transparent text-slate-600 cursor-not-allowed'
              : 'hover:bg-slate-800 text-slate-300 border-slate-800 cursor-pointer'
          }`}
          title="Next Page (Right Arrow)"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Subtle Hint */}
      <span className="text-[10px] text-slate-500 font-mono-code mt-2 tracking-wide hidden sm:block">
        Use Mouse Wheel or Left/Right Arrow Keys to turn pages
      </span>
    </div>
  );
}
