import { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Send, ArrowUpRight, Cpu, Copy, Check, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GithubIcon } from './Icons';
import { PROJECTS, DEVELOPER_BIO } from '../../data/projectsData';
import { sounds } from '../../utils/audio';

interface PortfolioLayoutProps {
  scrollProgress: number;
  onScrollTo: (id: string) => void;
  onHoverProject: (project: 'quantum' | 'vision' | 'healthcare' | null) => void;
}

export function PortfolioLayout({ scrollProgress, onScrollTo, onHoverProject }: PortfolioLayoutProps) {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [copiedCloneCmd, setCopiedCloneCmd] = useState(false);

  // Synchronized fluid progress
  const fluidProgress = Math.min(Math.max((scrollProgress - 0.05) / 0.75, 0), 1);

  // Exact Checkpoint Windows for the 3 Projects:
  // Dock 1: fluidProgress around 0.24 -> Active window: 0.18 to 0.35
  // Dock 2: fluidProgress around 0.56 -> Active window: 0.48 to 0.65
  // Dock 3: fluidProgress around 0.85 -> Active window: 0.74 to 0.88
  // Outside these windows, activeIndex is NULL (card completely vanishes / "hat jaye")
  // Past scrollProgress >= 0.78, projects phase is COMPLETELY finished so it NEVER overlaps About/Contact!
  let activeIndex: number | null = null;
  if (scrollProgress < 0.76) {
    if (fluidProgress >= 0.18 && fluidProgress <= 0.35) {
      activeIndex = 0; // Project 1: Quantum Tunneling
    } else if (fluidProgress >= 0.48 && fluidProgress <= 0.65) {
      activeIndex = 1; // Project 2: LabelChecker AI
    } else if (fluidProgress >= 0.74 && fluidProgress <= 0.88) {
      activeIndex = 2; // Project 3: Healthcare Telemetry
    }
  }

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
      particleCount: 110,
      spread: 85,
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

  const activeProject = activeIndex !== null ? PROJECTS[activeIndex] : null;

  return (
    <div className="relative z-10 w-full text-slate-100 pointer-events-auto">
      {/* Top Glass Header */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-14 py-3.5 bg-slate-950/70 border-b border-white/10 backdrop-blur-xl">
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

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-mono-code text-slate-400">
          <button onClick={() => onScrollTo('hero')} className="hover:text-cyan-400 transition-colors cursor-pointer">
            00 // Origin
          </button>
          <button onClick={() => onScrollTo('projects-scroll-track')} className="hover:text-cyan-400 transition-colors cursor-pointer">
            01 // Architectures
          </button>
          <button onClick={() => onScrollTo('about')} className="hover:text-cyan-400 transition-colors cursor-pointer">
            02 // Specialization
          </button>
          <button onClick={() => onScrollTo('contact')} className="hover:text-cyan-400 transition-colors cursor-pointer">
            03 // Transmission
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
          HERO SECTION
      ======================================================== */}
      <section id="hero" className="min-h-[88vh] flex items-center px-6 md:px-14 pt-24 pb-12">
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
                onClick={() => onScrollTo('projects-scroll-track')}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono-code text-xs transition-all shadow-xl shadow-cyan-500/25 hover:scale-105 cursor-pointer"
              >
                <span>Scrub Pipeline Stages</span>
                <ChevronDown className="w-4 h-4 animate-bounce" />
              </button>

              <span className="text-xs font-mono-code text-slate-400 flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Scroll down: cards reveal ONLY at thread checkpoints</span>
              </span>
            </div>
          </div>

          <div className="hidden lg:flex lg:col-span-5 h-[380px] pointer-events-none" />
        </div>
      </section>

      {/* ========================================================
          PROJECTS SCROLL RUNWAY
          Spacious height so fluid smoothly scrubs across the 3 checkpoints.
      ======================================================== */}
      <section id="projects-scroll-track" className="relative min-h-[220vh]">
        {/* Real-time Telemetry HUD (Fixed top indicator while scrubbing projects) */}
        {scrollProgress > 0.08 && scrollProgress < 0.76 && (
          <div className="fixed top-20 left-6 md:left-14 z-30 flex items-center space-x-3 text-[11px] font-mono-code bg-slate-950/85 px-3.5 py-1.5 rounded-xl border border-cyan-500/30 backdrop-blur-xl shadow-lg">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-slate-400">FLUID PIPELINE:</span>
            <span className="text-cyan-300 font-bold">{(fluidProgress * 100).toFixed(0)}%</span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-400 font-semibold">
              {activeIndex !== null ? `CHECKPOINT 0${activeIndex + 1} ONLINE` : 'CONDUIT IN TRANSIT...'}
            </span>
          </div>
        )}

        {/* ========================================================
            FIXED FLOATING HUD PROJECT CARD (CENTER-LEFT)
            - Locked in viewport: NEVER gets cut off!
            - Ultra-compact footprint (max-w-[400px])
            - APPEARS ONLY AT CHECKPOINTS!
            - DISAPPEARS IN-BETWEEN AND BEFORE ABOUT SECTION!
        ======================================================== */}
        {scrollProgress < 0.76 && (
          <div
            className={`fixed left-6 md:left-14 top-1/2 -translate-y-1/2 z-30 w-full max-w-[400px] transition-all duration-300 ${
              activeProject !== null
                ? 'opacity-100 scale-100 pointer-events-auto translate-y-0'
                : 'opacity-0 scale-95 pointer-events-none translate-y-4'
            }`}
          >
            {activeProject && (
              <div
                onMouseMove={handleCardMouseMove}
                className="spotlight-card w-full p-4 sm:p-5 shadow-2xl border border-cyan-500/30 bg-slate-900/90 backdrop-blur-2xl rounded-2xl space-y-3"
              >
                {/* Header Row */}
                <div className="border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono-code text-cyan-400 font-bold uppercase tracking-wider">
                      ◈ CHECKPOINT 0{(activeIndex ?? 0) + 1} // {activeProject.category}
                    </span>
                    <span className="text-[9px] font-mono-code px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                      {activeProject.benchmarkBadge}
                    </span>
                  </div>

                  {/* Project Title (Hover strictly here summons 3D simulation) */}
                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <h3
                      onMouseEnter={() => {
                        sounds.playClick();
                        onHoverProject(activeProject.id === 'quantum-tunneling' ? 'quantum' : activeProject.id === 'labelchecker' ? 'vision' : 'healthcare');
                      }}
                      onMouseLeave={() => onHoverProject(null)}
                      className="text-lg font-black font-display text-slate-100 hover:text-cyan-300 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <span>{activeProject.title}</span>
                      <span className="text-[9px] font-mono-code px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                        3D SIM ↗
                      </span>
                    </h3>

                    <button
                      onClick={() => openLink(activeProject.githubUrl)}
                      className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-slate-900 hover:bg-cyan-500 hover:text-slate-950 border border-slate-700/60 text-[11px] font-mono-code text-slate-300 transition-all cursor-pointer shrink-0"
                    >
                      <span>Repo</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Concise 2-line Description */}
                <p className="text-xs text-slate-300 leading-relaxed font-mono-code line-clamp-2">
                  {activeProject.description}
                </p>

                {/* Compact Architecture Pipeline */}
                <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 text-[10px] font-mono-code">
                  <span className="text-slate-400 block mb-1 uppercase tracking-wider text-[9px]">
                    Pipeline Flow:
                  </span>
                  <div className="flex items-center space-x-1 text-slate-200 overflow-x-auto">
                    {activeProject.architecturePipeline.slice(0, 3).map((step, idx) => (
                      <span key={idx} className="flex items-center space-x-1 shrink-0">
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700/60 text-[10px]">
                          {step}
                        </span>
                        {idx < 2 && <span className="text-cyan-400 font-bold text-[10px]">➔</span>}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Compact Specs Row */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px] font-mono-code">
                  <div className="flex items-center space-x-2">
                    {activeProject.stats.slice(0, 2).map((s, i) => (
                      <div key={i} className="text-slate-400">
                        <span>{s.label}: </span>
                        <span className="text-cyan-300 font-bold">{s.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center space-x-1">
                    {activeProject.techStack.slice(0, 2).map((tech, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[9px]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ========================================================
          ABOUT & CONTACT DESTINATION (Aligned neatly on the Left)
          - Left-aligned (md:ml-14) matching the project card column!
          - Compact width (max-w-xl) so right side fluid thread remains 100% visible!
          - ZERO collision with project cards!
      ======================================================== */}
      <div className="relative z-20 px-6 md:px-14 pb-24 space-y-14 max-w-xl">
        {/* About Section */}
        <section id="about" className="pt-6">
          <div className="spotlight-card p-5 sm:p-6 rounded-2xl shadow-xl space-y-4">
            <div className="border-b border-slate-800/80 pb-3">
              <span className="text-[10px] font-mono-code text-cyan-400 uppercase tracking-widest block">
                02 // ENGINEERING PHILOSOPHY & TOOLCHAIN
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold font-display text-slate-100 mt-1">
                Precision Over Hype.
              </h2>
              <p className="text-xs text-slate-300 font-mono-code leading-relaxed mt-2">
                {DEVELOPER_BIO.bio}
              </p>
            </div>

            {/* Compact Clustered Skills Grid */}
            <div className="space-y-3">
              {DEVELOPER_BIO.skillClusters.map((cluster, cIdx) => (
                <div key={cIdx} className="space-y-1.5">
                  <span className="text-[10px] uppercase font-mono-code font-bold tracking-wider text-cyan-400 flex items-center space-x-1">
                    <Cpu className="w-3 h-3 text-cyan-400" />
                    <span>{cluster.category}</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cluster.skills.map((skill, sIdx) => {
                      const isSelected = selectedSkill === skill;
                      return (
                        <button
                          key={sIdx}
                          onClick={() => {
                            sounds.playClick();
                            setSelectedSkill(isSelected ? null : skill);
                          }}
                          className={`px-2 py-0.5 text-[10px] font-mono-code rounded border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md shadow-cyan-500/30'
                              : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300'
                          }`}
                        >
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact">
          <div className="spotlight-card p-5 sm:p-6 rounded-2xl shadow-xl space-y-4">
            <div>
              <span className="text-[10px] font-mono-code text-cyan-400 uppercase tracking-widest block">
                03 // DIRECT TRANSMISSION
              </span>
              <h2 className="text-xl sm:text-3xl font-black font-display text-slate-100 mt-1">
                Let's Build.
              </h2>
              <p className="text-xs text-slate-300 font-mono-code leading-relaxed mt-1.5">
                Looking for a Machine Learning Engineer to design resilient deep learning models, high-performance vision pipelines, or distributed systems? Connect directly below.
              </p>
            </div>

            {/* Compact CLI Terminal Clone Command */}
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/70 flex items-center justify-between font-mono-code text-xs">
              <div className="flex items-center space-x-2 text-slate-200 overflow-x-auto text-[11px]">
                <span className="text-cyan-400 font-bold">$</span>
                <span>git clone https://github.com/deveshsingh0710.git</span>
              </div>
              <button
                onClick={handleCopyClone}
                className="ml-2 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[10px] shrink-0 flex items-center space-x-1 cursor-pointer"
              >
                {copiedCloneCmd ? <Check className="w-3 h-3 text-cyan-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCloneCmd ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="space-y-2">
              <a
                href={DEVELOPER_BIO.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 transition-all text-xs font-mono-code group"
              >
                <div className="flex items-center space-x-2.5">
                  <GithubIcon className="w-4 h-4 text-cyan-400" />
                  <span>GitHub Repositories & Open Source</span>
                </div>
                <span className="text-slate-400 group-hover:text-cyan-400 flex items-center space-x-1">
                  <span>@deveshsingh0710</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </a>

              <a
                href={DEVELOPER_BIO.links.email}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 transition-all text-xs font-mono-code group"
              >
                <div className="flex items-center space-x-2.5">
                  <Send className="w-4 h-4 text-cyan-400" />
                  <span>Encrypted Email Transmission</span>
                </div>
                <span className="text-slate-400 group-hover:text-cyan-400 flex items-center space-x-1">
                  <span>Send Direct Inquiry</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </a>
            </div>

            <div className="pt-1 flex items-center justify-center">
              <button
                onClick={handleCelebrate}
                className="flex items-center space-x-2 px-5 py-2 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-mono-code transition-all cursor-pointer shadow-lg shadow-cyan-500/10 hover:scale-105"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
                <span>Stamp Verification Seal (Celebrate)</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="py-6 px-6 text-center text-xs font-mono-code text-slate-500 border-t border-slate-800/60 bg-slate-950/80">
        <p>© 2026 Devesh Singh • Machine Learning Engineer • Deployed on GitHub Pages</p>
      </footer>
    </div>
  );
}
