import { useState } from 'react';
import { Volume2, VolumeX, FileText } from 'lucide-react';
import { GithubIcon } from './Icons';
import { sounds } from '../../utils/audio';

interface HeaderProps {
  onToggleQuickView: () => void;
  isQuickView: boolean;
}

export function Header({ onToggleQuickView, isQuickView }: HeaderProps) {
  const [isMuted, setIsMuted] = useState(false);

  const toggleSound = () => {
    sounds.enabled = !sounds.enabled;
    setIsMuted(!sounds.enabled);
    if (sounds.enabled) {
      sounds.playClick();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4 pointer-events-none">
      {/* Brand & Status */}
      <div className="flex items-center space-x-3 pointer-events-auto">
        <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif-book font-bold shadow-lg shadow-amber-500/5">
          DS
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-sm font-semibold tracking-wider uppercase text-slate-100 font-serif-book">
              Devesh Singh
            </h1>
            <span className="text-[10px] uppercase font-mono-code px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium">
              Dev Codex Vol. I
            </span>
          </div>
          <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 font-mono-code">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Real-time WebGL Engine Active</span>
          </div>
        </div>
      </div>

      {/* Quick Action Controls */}
      <div className="flex items-center space-x-2 pointer-events-auto">
        {/* Quick View (Recruiter Mode) */}
        <button
          onClick={() => {
            sounds.playClick();
            onToggleQuickView();
          }}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-code border transition-all ${
            isQuickView
              ? 'bg-amber-500 text-slate-950 border-amber-400 font-semibold shadow-lg shadow-amber-500/20'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700/60 backdrop-blur-md'
          }`}
          title="Toggle 1-page fast overview for recruiters"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Recruiter Summary</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 backdrop-blur-md transition-all"
          title={isMuted ? 'Turn Sound On' : 'Mute Sound'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-slate-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {/* GitHub Link */}
        <a
          href="https://github.com/deveshsingh0710"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 backdrop-blur-md transition-all hover:border-slate-500"
        >
          <GithubIcon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-xs font-mono-code">github.com/deveshsingh0710</span>
        </a>
      </div>
    </header>
  );
}
