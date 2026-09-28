import { useState } from 'react';
import { Terminal, Copy, Check, ChevronDown, Volume2, VolumeX, Sparkles, Send, ArrowUpRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GithubIcon } from './Icons';
import { PROJECTS, DEVELOPER_BIO } from '../../data/projectsData';
import { sounds } from '../../utils/audio';

interface PortfolioLayoutProps {
  onScrollTo: (id: string) => void;
  onHoverProject: (project: 'quantum' | 'vision' | 'healthcare' | null) => void;
}

export function PortfolioLayout({ onScrollTo, onHoverProject }: PortfolioLayoutProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const toggleSound = () => {
    sounds.enabled = !sounds.enabled;
    setIsMuted(!sounds.enabled);
    if (sounds.enabled) sounds.playClick();
  };

  const handleCopy = (code: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    sounds.playClick();
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCelebrate = () => {
    sounds.playPopUp();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.8 },
      colors: ['#10b981', '#34d399', '#38bdf8', '#fbbf24']
    });
  };

  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative z-10 w-full text-slate-100 pointer-events-auto">
      {/* Top Glass Header */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 bg-slate-950/70 border-b border-slate-800/60 backdrop-blur-xl">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono-code font-bold text-xs shadow-lg shadow-emerald-500/10">
            DS
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase tracking-widest font-mono-code font-semibold text-slate-200">
                {DEVELOPER_BIO.name}
              </span>
              <span className="text-[10px] uppercase font-mono-code px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                ML Engineer
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-mono-code text-slate-400">
          <button onClick={() => onScrollTo('hero')} className="hover:text-emerald-400 transition-colors cursor-pointer">
            00 // Origin
          </button>
          <button onClick={() => onScrollTo('projects')} className="hover:text-emerald-400 transition-colors cursor-pointer">
            01 // Projects
          </button>
          <button onClick={() => onScrollTo('about')} className="hover:text-emerald-400 transition-colors cursor-pointer">
            02 // About
          </button>
          <button onClick={() => onScrollTo('contact')} className="hover:text-emerald-400 transition-colors cursor-pointer">
            03 // Contact
          </button>
        </nav>

        <div className="flex items-center space-x-3">
          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800/80 backdrop-blur-md transition-all cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <a
            href={DEVELOPER_BIO.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 backdrop-blur-md text-xs font-mono-code text-slate-200 transition-all hover:border-slate-700"
          >
            <GithubIcon className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </header>

      {/* ========================================================
          HERO SECTION
      ======================================================== */}
      <section id="hero" className="min-h-screen flex flex-col justify-center px-6 md:px-20 pt-28 pb-16">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono-code text-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>MACHINE LEARNING ENGINEER • SYSTEMS ARCHITECTURE</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight font-serif-book text-slate-100 leading-none">
            DEVESH <br />
            <span className="text-slate-500 font-normal">SINGH.</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 font-mono-code leading-relaxed max-w-2xl">
            Designing deep learning pipelines, computational physics models, and low-latency computer vision systems.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 max-w-lg">
            {DEVELOPER_BIO.stats.slice(0, 3).map((st, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-md">
                <span className="block text-[9px] font-mono-code uppercase text-slate-400">{st.label}</span>
                <span className="text-xs font-semibold text-slate-200 mt-0.5 block">{st.value}</span>
              </div>
            ))}
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-5">
            <button
              onClick={() => onScrollTo('projects')}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold font-mono-code text-xs transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <span>Explore Selected Work</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </button>

            <span className="text-xs font-mono-code text-slate-400 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Hover on project titles below to summon real-time 3D simulation</span>
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================
          PROJECTS SECTION (Awwwards Style Editorial Index)
      ======================================================== */}
      <section id="projects" className="min-h-screen px-6 md:px-20 py-24 space-y-24">
        <div className="border-b border-slate-800/80 pb-6">
          <span className="text-xs font-mono-code text-emerald-400 uppercase tracking-widest">
            FEATURED ENGINEERING REPOSITORIES
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-serif-book text-slate-100 mt-2">
            Selected Architectures.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-mono-code mt-1">
            ✨ Hover over any project row to summon its magnetic 3D viewport. Click to launch GitHub.
          </p>
        </div>

        {/* Project 1: Quantum Tunneling */}
        {PROJECTS[0] && (
          <div
            onClick={() => openLink(PROJECTS[0].githubUrl)}
            onMouseEnter={() => {
              sounds.playClick();
              onHoverProject('quantum');
            }}
            onMouseLeave={() => onHoverProject(null)}
            className="group relative p-8 md:p-12 rounded-3xl bg-slate-950/70 hover:bg-slate-950/95 border border-slate-800/80 hover:border-emerald-500/60 backdrop-blur-xl transition-all duration-300 cursor-pointer max-w-4xl"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
              <div>
                <span className="text-xs font-mono-code text-emerald-400">
                  01 // {PROJECTS[0].category.toUpperCase()}
                </span>
                <h3 className="text-3xl sm:text-4xl font-bold font-serif-book text-slate-100 group-hover:text-emerald-300 transition-colors mt-1">
                  {PROJECTS[0].title}
                </h3>
                <p className="text-xs font-mono-code text-slate-400 mt-1">{PROJECTS[0].subtitle}</p>
              </div>

              <div className="flex items-center space-x-2 text-xs font-mono-code text-emerald-400 group-hover:translate-x-1 transition-transform shrink-0">
                <span>View Repository</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mt-6 max-w-2xl font-mono-code">
              {PROJECTS[0].description}
            </p>

            <div className="grid grid-cols-3 gap-3 my-6 max-w-lg">
              {PROJECTS[0].stats.map((s, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 text-center">
                  <span className="block text-[9px] font-mono-code text-slate-400 uppercase">{s.label}</span>
                  <span className="text-xs font-bold font-mono-code text-emerald-400">{s.value}</span>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-slate-900/90 border border-slate-800 overflow-hidden font-mono-code text-[11px] max-w-2xl">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-950/80 border-b border-slate-800 text-slate-400">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Schrödinger Wave Dispersion Kernel</span>
                </div>
                <button
                  onClick={(e) => handleCopy(PROJECTS[0].codeSnippet, 0, e)}
                  className="flex items-center space-x-1 hover:text-slate-200 cursor-pointer"
                >
                  {copiedIndex === 0 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIndex === 0 ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 text-slate-300 overflow-x-auto leading-relaxed text-[11px]">
                <code>{PROJECTS[0].codeSnippet}</code>
              </pre>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              {PROJECTS[0].techStack.map((tech, idx) => (
                <span key={idx} className="px-3 py-1 text-xs font-mono-code rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Project 2: LabelChecker AI */}
        {PROJECTS[1] && (
          <div
            onClick={() => openLink(PROJECTS[1].githubUrl)}
            onMouseEnter={() => {
              sounds.playClick();
              onHoverProject('vision');
            }}
            onMouseLeave={() => onHoverProject(null)}
            className="group relative p-8 md:p-12 rounded-3xl bg-slate-950/70 hover:bg-slate-950/95 border border-slate-800/80 hover:border-emerald-500/60 backdrop-blur-xl transition-all duration-300 cursor-pointer max-w-4xl"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
              <div>
                <span className="text-xs font-mono-code text-emerald-400">
                  02 // {PROJECTS[1].category.toUpperCase()}
                </span>
                <h3 className="text-3xl sm:text-4xl font-bold font-serif-book text-slate-100 group-hover:text-emerald-300 transition-colors mt-1">
                  {PROJECTS[1].title}
                </h3>
                <p className="text-xs font-mono-code text-slate-400 mt-1">{PROJECTS[1].subtitle}</p>
              </div>

              <div className="flex items-center space-x-2 text-xs font-mono-code text-emerald-400 group-hover:translate-x-1 transition-transform shrink-0">
                <span>View Repository</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mt-6 max-w-2xl font-mono-code">
              {PROJECTS[1].description}
            </p>

            <div className="grid grid-cols-3 gap-3 my-6 max-w-lg">
              {PROJECTS[1].stats.map((s, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 text-center">
                  <span className="block text-[9px] font-mono-code text-slate-400 uppercase">{s.label}</span>
                  <span className="text-xs font-bold font-mono-code text-emerald-400">{s.value}</span>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-slate-900/90 border border-slate-800 overflow-hidden font-mono-code text-[11px] max-w-2xl">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-950/80 border-b border-slate-800 text-slate-400">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Computer Vision & OCR Pipeline</span>
                </div>
                <button
                  onClick={(e) => handleCopy(PROJECTS[1].codeSnippet, 1, e)}
                  className="flex items-center space-x-1 hover:text-slate-200 cursor-pointer"
                >
                  {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIndex === 1 ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 text-slate-300 overflow-x-auto leading-relaxed text-[11px]">
                <code>{PROJECTS[1].codeSnippet}</code>
              </pre>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              {PROJECTS[1].techStack.map((tech, idx) => (
                <span key={idx} className="px-3 py-1 text-xs font-mono-code rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Project 3: Healthcare System */}
        {PROJECTS[2] && (
          <div
            onClick={() => openLink(PROJECTS[2].githubUrl)}
            onMouseEnter={() => {
              sounds.playClick();
              onHoverProject('healthcare');
            }}
            onMouseLeave={() => onHoverProject(null)}
            className="group relative p-8 md:p-12 rounded-3xl bg-slate-950/70 hover:bg-slate-950/95 border border-slate-800/80 hover:border-cyan-500/60 backdrop-blur-xl transition-all duration-300 cursor-pointer max-w-4xl"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
              <div>
                <span className="text-xs font-mono-code text-cyan-400">
                  03 // {PROJECTS[2].category.toUpperCase()}
                </span>
                <h3 className="text-3xl sm:text-4xl font-bold font-serif-book text-slate-100 group-hover:text-cyan-300 transition-colors mt-1">
                  {PROJECTS[2].title}
                </h3>
                <p className="text-xs font-mono-code text-slate-400 mt-1">{PROJECTS[2].subtitle}</p>
              </div>

              <div className="flex items-center space-x-2 text-xs font-mono-code text-cyan-400 group-hover:translate-x-1 transition-transform shrink-0">
                <span>View Repository</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mt-6 max-w-2xl font-mono-code">
              {PROJECTS[2].description}
            </p>

            <div className="grid grid-cols-3 gap-3 my-6 max-w-lg">
              {PROJECTS[2].stats.map((s, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 text-center">
                  <span className="block text-[9px] font-mono-code text-slate-400 uppercase">{s.label}</span>
                  <span className="text-xs font-bold font-mono-code text-cyan-400">{s.value}</span>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-slate-900/90 border border-slate-800 overflow-hidden font-mono-code text-[11px] max-w-2xl">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-950/80 border-b border-slate-800 text-slate-400">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Transactional Telemetry Dispatcher</span>
                </div>
                <button
                  onClick={(e) => handleCopy(PROJECTS[2].codeSnippet, 2, e)}
                  className="flex items-center space-x-1 hover:text-slate-200 cursor-pointer"
                >
                  {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIndex === 2 ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 text-slate-300 overflow-x-auto leading-relaxed text-[11px]">
                <code>{PROJECTS[2].codeSnippet}</code>
              </pre>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              {PROJECTS[2].techStack.map((tech, idx) => (
                <span key={idx} className="px-3 py-1 text-xs font-mono-code rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ========================================================
          ABOUT & TOOLCHAIN SECTION
      ======================================================== */}
      <section id="about" className="min-h-screen flex items-center px-6 md:px-20 py-24">
        <div className="max-w-3xl space-y-6 bg-slate-950/75 p-8 md:p-12 rounded-3xl border border-slate-800/80 backdrop-blur-xl shadow-2xl">
          <span className="text-xs font-mono-code text-emerald-400 uppercase tracking-widest">
            02 // BACKGROUND & SPECIALIZATION
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif-book text-slate-100">
            Precision Over Hype.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-mono-code leading-relaxed">
            {DEVELOPER_BIO.bio}
          </p>

          <div className="space-y-4 pt-4">
            <h4 className="text-xs uppercase font-mono-code tracking-wider text-slate-400">
              Technical Stack Matrix
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {DEVELOPER_BIO.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 text-xs font-mono-code rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          CONTACT & FOOTER
      ======================================================== */}
      <section id="contact" className="min-h-screen flex items-center px-6 md:px-20 py-24">
        <div className="max-w-2xl space-y-6 bg-slate-950/80 p-8 md:p-12 rounded-3xl border border-slate-800/80 backdrop-blur-xl shadow-2xl">
          <span className="text-xs font-mono-code text-emerald-400 uppercase tracking-widest">
            03 // DIRECT TRANSMISSION
          </span>

          <h2 className="text-4xl sm:text-6xl font-bold font-serif-book text-slate-100">
            Let's Build.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-mono-code leading-relaxed">
            Looking for a Machine Learning Engineer to build robust AI models, computer vision systems, or high-performance simulations? Connect directly below.
          </p>

          <div className="space-y-3.5 pt-2">
            <a
              href={DEVELOPER_BIO.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 transition-all text-sm font-mono-code"
            >
              <div className="flex items-center space-x-3">
                <GithubIcon className="w-5 h-5 text-emerald-400" />
                <span>GitHub Repositories</span>
              </div>
              <span className="text-slate-400 flex items-center space-x-1">
                <span>@deveshsingh0710</span>
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </a>

            <a
              href={DEVELOPER_BIO.links.email}
              className="flex items-center justify-between p-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 transition-all text-sm font-mono-code"
            >
              <div className="flex items-center space-x-3">
                <Send className="w-5 h-5 text-emerald-400" />
                <span>Email Transmission</span>
              </div>
              <span className="text-slate-400 flex items-center space-x-1">
                <span>Send Direct Inquiry</span>
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </a>
          </div>

          <div className="pt-4 flex items-center justify-center">
            <button
              onClick={handleCelebrate}
              className="flex items-center space-x-2 px-6 py-3 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-mono-code transition-all cursor-pointer shadow-lg shadow-emerald-500/5 hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>Stamp Verification Seal (Celebrate)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-xs font-mono-code text-slate-500 border-t border-slate-800/60 bg-slate-950/80">
        <p>© 2026 Devesh Singh • Machine Learning Engineer • Hosted on GitHub Pages</p>
      </footer>
    </div>
  );
}
