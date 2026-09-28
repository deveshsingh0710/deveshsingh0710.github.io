import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Send, ArrowUpRight, Copy, Check, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GithubIcon } from './Icons';
import { PROJECTS, DEVELOPER_BIO } from '../../data/projectsData';
import { sounds } from '../../utils/audio';
import { getFluidProgress, getActiveCheckpoint } from '../../utils/fluidSync';

interface PortfolioLayoutProps {
  scrollProgress: number;
  onScrollTo: (id: string) => void;
  onHoverProject: (project: 'quantum' | 'vision' | 'healthcare' | null) => void;
}

export function PortfolioLayout({ scrollProgress, onScrollTo, onHoverProject }: PortfolioLayoutProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [copiedCloneCmd, setCopiedCloneCmd] = useState(false);

  // Synchronized fluid progress computed via single source of truth
  const fluidProgress = getFluidProgress(scrollProgress);
  const activeCheckpoint = getActiveCheckpoint(scrollProgress);

  // Keep track of last active checkpoint to enable smooth CSS fade-outs
  const [lastCheckpoint, setLastCheckpoint] = useState<number>(1);
  useEffect(() => {
    if (activeCheckpoint !== null) {
      setLastCheckpoint(activeCheckpoint);
    }
  }, [activeCheckpoint]);

  const displayedCheckpoint = activeCheckpoint !== null ? activeCheckpoint : lastCheckpoint;
  const isCardVisible = activeCheckpoint !== null;

  const toggleSound = () => {
    sounds.enabled = !sounds.enabled;
    setIsMuted(!sounds.enabled);
    if (sounds.enabled) sounds.playClick();
  };

  const handleCopyClone = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText("git clone https://github.com/deveshsingh0710.git");
    setCopiedCloneCmd(true);
    sounds.playClick();
    setTimeout(() => setCopiedCloneCmd(false), 2000);
  };

  const handleCelebrate = () => {
    sounds.playPopUp();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.8 },
      colors: ['#00e5ff', '#38bdf8', '#8a5cff', '#10b981']
    });
  };

  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Dynamic Spotlight Card Cursor Physics
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  // Current active project
  const currentProject = PROJECTS[displayedCheckpoint - 1] || PROJECTS[0];

  return (
    <div className="relative z-10 w-full text-slate-100 pointer-events-auto">
      {/* Top Glass Header */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-14 py-3.5 bg-slate-950/75 border-b border-white/10 backdrop-blur-xl">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono-code font-bold text-xs shadow-md shadow-cyan-500/10">
            DS
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase tracking-wider font-display font-bold text-slate-200">
                {DEVELOPER_BIO.name}
              </span>
              <span className="text-[10px] uppercase font-mono-code px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                ML Engineer
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links - Direct to 3 Project Docks */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-mono-code text-slate-400">
          <button onClick={() => onScrollTo('hero')} className="hover:text-cyan-400 transition-colors cursor-pointer">
            00 // Origin
          </button>
          <button onClick={() => onScrollTo('p1')} className="hover:text-cyan-400 transition-colors cursor-pointer">
            01 // Quantum PDE
          </button>
          <button onClick={() => onScrollTo('p2')} className="hover:text-cyan-400 transition-colors cursor-pointer">
            02 // Vision AI
          </button>
          <button onClick={() => onScrollTo('p3')} className="hover:text-cyan-400 transition-colors cursor-pointer">
            03 // Telemetry Engine
          </button>
        </nav>

        <div className="flex items-center space-x-3">
          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 backdrop-blur-md transition-all cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          <a
            href={DEVELOPER_BIO.links.email}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-mono-code transition-all"
          >
            <Send className="w-3.5 h-3.5 text-cyan-400" />
            <span>Contact</span>
          </a>

          <a
            href={DEVELOPER_BIO.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 backdrop-blur-md text-xs font-mono-code text-slate-200 transition-all hover:border-slate-600"
          >
            <GithubIcon className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </header>

      {/* ========================================================
          00 // HERO ORIGIN SECTION
      ======================================================== */}
      <section id="hero" className="min-h-[90vh] flex items-center px-6 md:px-14 pt-24 pb-12">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono-code text-xs backdrop-blur-md shadow-lg shadow-cyan-500/10">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="font-semibold">$ torch.cuda.is_available()</span>
              <span className="text-slate-400">→ True [TensorRT 10.2 • FP16]</span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black font-display text-slate-100 leading-none tracking-tight">
              DEVESH <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
                SINGH.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-mono-code leading-relaxed max-w-xl">
              Machine Learning Engineer specialized in deep learning pipelines, computational physics PDE solvers, and low-latency computer vision architectures.
            </p>

            <div className="grid grid-cols-3 gap-2.5 max-w-md pt-1">
              {DEVELOPER_BIO.stats.map((st, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/70 border border-slate-700/50 backdrop-blur-md">
                  <span className="block text-[9px] font-mono-code uppercase text-slate-400">{st.label}</span>
                  <span className="text-xs font-semibold font-mono-code text-slate-200 mt-0.5 block">{st.value}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-5">
              <button
                onClick={() => onScrollTo('p1')}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono-code text-xs transition-all shadow-xl shadow-cyan-500/25 hover:scale-105 cursor-pointer"
              >
                <span>Scrub Projects Conduit</span>
                <ChevronDown className="w-4 h-4 animate-bounce" />
              </button>

              <span className="text-xs font-mono-code text-slate-400 flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Projects reveal ONLY at fluid checkpoints</span>
              </span>
            </div>
          </div>

          <div className="hidden lg:flex lg:col-span-5 h-[380px] pointer-events-none" />
        </div>
      </section>

      {/* ========================================================
          PROJECTS SCROLL RUNWAY
          Spacious height so fluid smoothly scrubs across the 3 project checkpoints.
      ======================================================== */}
      <section id="projects-scroll-track" className="relative min-h-[300vh]">
        {/* Real-time Telemetry HUD (Fixed top indicator while scrubbing) */}
        {scrollProgress > 0.05 && (
          <div className="fixed top-20 left-6 md:left-14 z-30 flex items-center space-x-3 text-[11px] font-mono-code bg-slate-950/85 px-3.5 py-1.5 rounded-xl border border-cyan-500/30 backdrop-blur-xl shadow-lg">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-slate-400">FLUID CONDUIT:</span>
            <span className="text-cyan-300 font-bold">{(fluidProgress * 100).toFixed(0)}%</span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-400 font-semibold">
              {activeCheckpoint !== null ? `PROJECT 0${activeCheckpoint} DOCKED` : 'CONDUIT IN TRANSIT...'}
            </span>
          </div>
        )}

        {/* ========================================================
            SINGLE EXCLUSIVE FIXED PROJECT HUD CARD
            - Sits left-aligned at left-6 md:left-14 top-1/2
            - Compact width max-w-[380px]
            - STRICTLY ONLY PROJECTS!
            - APPEARS ONLY AT DOCK CHECKPOINTS!
            - DISAPPEARS ("HAT JATA HAI") WHEN SCROLLING BETWEEN POINTS!
            - ZERO OVERLAPPING EVER!
        ======================================================== */}
        <div
          className={`fixed left-6 md:left-14 top-1/2 -translate-y-1/2 z-30 w-full max-w-[380px] transition-all duration-300 ease-out ${
            isCardVisible
              ? 'opacity-100 scale-100 pointer-events-auto translate-y-0'
              : 'opacity-0 scale-95 pointer-events-none translate-y-3'
          }`}
        >
          {currentProject && (
            <div
              onMouseMove={handleCardMouseMove}
              className="spotlight-card w-full p-4 sm:p-4.5 shadow-2xl border border-cyan-500/30 bg-slate-900/95 backdrop-blur-2xl rounded-2xl space-y-2.5"
            >
              {/* Header Row */}
              <div className="border-b border-slate-800/80 pb-2">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-mono-code text-cyan-400 font-bold uppercase tracking-wider">
                    ◈ PROJECT 0{displayedCheckpoint} // {currentProject.category}
                  </span>
                  <span className="text-[9px] font-mono-code px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                    {currentProject.benchmarkBadge}
                  </span>
                </div>

                {/* Project Title (Hover strictly here summons 3D simulation) */}
                <div className="flex items-center justify-between gap-2 pt-0.5">
                  <h3
                    onMouseEnter={() => {
                      sounds.playClick();
                      onHoverProject(currentProject.id === 'quantum-tunneling' ? 'quantum' : currentProject.id === 'labelchecker' ? 'vision' : 'healthcare');
                    }}
                    onMouseLeave={() => onHoverProject(null)}
                    className="text-base sm:text-lg font-black font-display text-slate-100 hover:text-cyan-300 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>{currentProject.title}</span>
                    <span className="text-[8px] font-mono-code px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                      3D SIM ↗
                    </span>
                  </h3>

                  <button
                    onClick={() => openLink(currentProject.githubUrl)}
                    className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-slate-900 hover:bg-cyan-500 hover:text-slate-950 border border-slate-700/60 text-[10px] font-mono-code text-slate-300 transition-all cursor-pointer shrink-0"
                  >
                    <span>Repo</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Concise 2-line Description */}
              <p className="text-xs text-slate-300 leading-relaxed font-mono-code line-clamp-2">
                {currentProject.description}
              </p>

              {/* Compact Architecture Pipeline */}
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 text-[10px] font-mono-code">
                <span className="text-slate-400 block mb-1 uppercase tracking-wider text-[8px]">
                  Pipeline Flow:
                </span>
                <div className="flex items-center space-x-1 text-slate-200 overflow-x-auto">
                  {currentProject.architecturePipeline.slice(0, 3).map((step, idx) => (
                    <span key={idx} className="flex items-center space-x-1 shrink-0">
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700/60 text-[9px]">
                        {step}
                      </span>
                      {idx < 2 && <span className="text-cyan-400 font-bold text-[9px]">➔</span>}
                    </span>
                  ))}
                </div>
              </div>

              {/* Compact Specs Row */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px] font-mono-code">
                <div className="flex items-center space-x-2">
                  {currentProject.stats.slice(0, 2).map((s, i) => (
                    <div key={i} className="text-slate-400">
                      <span>{s.label}: </span>
                      <span className="text-cyan-300 font-bold">{s.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center space-x-1">
                  {currentProject.techStack.slice(0, 2).map((tech, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[8px]">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          CLEAN MINIMAL TRANSMISSION FOOTER (At the end of the page)
      ======================================================== */}
      <footer className="relative z-20 py-10 px-6 md:px-14 border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Quick Clone Terminal */}
          <div className="w-full md:w-auto p-2 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between font-mono-code text-xs">
            <div className="flex items-center space-x-1.5 text-slate-300 text-[10px]">
              <span className="text-cyan-400 font-bold">$</span>
              <span>git clone https://github.com/deveshsingh0710.git</span>
            </div>
            <button
              onClick={handleCopyClone}
              className="ml-2 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[9px] shrink-0 flex items-center space-x-1 cursor-pointer"
            >
              {copiedCloneCmd ? <Check className="w-3 h-3 text-cyan-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCloneCmd ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Social Links & Celebrate */}
          <div className="flex items-center space-x-4 text-xs font-mono-code">
            <a
              href={DEVELOPER_BIO.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center space-x-1"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>@deveshsingh0710</span>
            </a>

            <a
              href={DEVELOPER_BIO.links.email}
              className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center space-x-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Email</span>
            </a>

            <button
              onClick={handleCelebrate}
              className="px-3 py-1 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[10px] transition-all cursor-pointer flex items-center space-x-1"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Celebrate</span>
            </button>
          </div>
        </div>

        <div className="text-center mt-6 text-[10px] font-mono-code text-slate-500">
          © 2026 Devesh Singh • Machine Learning Engineer • Deployed on GitHub Pages
        </div>
      </footer>
    </div>
  );
}
