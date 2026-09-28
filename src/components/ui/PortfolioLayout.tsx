import { useState } from 'react';
import { ExternalLink, Terminal, Copy, Check, ChevronDown, Volume2, VolumeX, Sparkles, Send, ArrowUpRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GithubIcon } from './Icons';
import { PROJECTS, DEVELOPER_BIO } from '../../data/projectsData';
import { sounds } from '../../utils/audio';

interface PortfolioLayoutProps {
  onScrollTo: (id: string) => void;
}

export function PortfolioLayout({ onScrollTo }: PortfolioLayoutProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const toggleSound = () => {
    sounds.enabled = !sounds.enabled;
    setIsMuted(!sounds.enabled);
    if (sounds.enabled) sounds.playClick();
  };

  const handleCopy = (code: string, index: number) => {
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

  return (
    <div className="relative z-10 w-full text-slate-100 pointer-events-auto">
      {/* Top Fixed Header */}
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
                Portfolio
              </span>
            </div>
          </div>
        </div>

        {/* Section Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-xs font-mono-code text-slate-400">
          <button onClick={() => onScrollTo('hero')} className="hover:text-emerald-400 transition-colors cursor-pointer">
            00 // Origin
          </button>
          <button onClick={() => onScrollTo('about')} className="hover:text-emerald-400 transition-colors cursor-pointer">
            01 // About
          </button>
          <button onClick={() => onScrollTo('projects')} className="hover:text-emerald-400 transition-colors cursor-pointer">
            02 // Projects
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
          SECTION 0: HERO (FRAME 1 HOOK — NO PROJECTS DUMPED)
      ======================================================== */}
      <section id="hero" className="min-h-screen flex items-center px-6 md:px-16 pt-24 pb-12">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono-code text-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>SOFTWARE ENGINEER • SYSTEMS & GRAPHICS</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight font-serif-book text-slate-100 leading-none">
            DEVESH <br />
            <span className="text-slate-400 font-normal">SINGH.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-mono-code leading-relaxed">
            Building high-concurrency microservices, quantum physics simulations, and computer vision pipelines.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 max-w-lg">
            {DEVELOPER_BIO.stats.slice(0, 3).map((st, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-md">
                <span className="block text-[9px] font-mono-code uppercase text-slate-400">{st.label}</span>
                <span className="text-xs font-semibold text-slate-200 mt-0.5 block">{st.value}</span>
              </div>
            ))}
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => onScrollTo('projects')}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold font-mono-code text-xs transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <span>Explore Projects</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono-code text-slate-400 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Scroll down to follow the luminous 3D thread</span>
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 1: ABOUT & SYSTEMS PHILOSOPHY
      ======================================================== */}
      <section id="about" className="min-h-screen flex items-center px-6 md:px-16 py-24">
        <div className="max-w-3xl space-y-6 bg-slate-950/75 p-8 md:p-10 rounded-2xl border border-slate-800/80 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center space-x-2 text-xs font-mono-code text-emerald-400">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">01</span>
            <span>ENGINEERING PHILOSOPHY & TOOLCHAIN</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold font-serif-book text-slate-100">
            Architecture Over Hype. Precision Over Friction.
          </h2>

          <p className="text-sm md:text-base text-slate-300 font-mono-code leading-relaxed">
            {DEVELOPER_BIO.bio}
          </p>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs uppercase font-mono-code tracking-wider text-slate-400">
              Core Technical Stack & Toolchain
            </h4>
            <div className="flex flex-wrap gap-2">
              {DEVELOPER_BIO.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs font-mono-code rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-emerald-500/40 hover:text-emerald-300 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-800/80 text-xs font-mono-code text-slate-400">
            <span>Specialization: High-throughput Backend & Physics Simulation</span>
            <button
              onClick={() => onScrollTo('projects')}
              className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 cursor-pointer"
            >
              <span>Traverse Featured Projects</span>
              <span>↓</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          PROJECT 1: QUANTUM TUNNELING
      ======================================================== */}
      <section id="projects" className="min-h-screen flex items-center px-6 md:px-16 py-24">
        {PROJECTS[0] && (
          <div className="max-w-2xl space-y-5 bg-slate-950/75 p-8 md:p-10 rounded-2xl border border-slate-800/80 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center space-x-2 text-xs font-mono-code text-emerald-400">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">PROJECT 01</span>
              <span>{PROJECTS[0].category.toUpperCase()}</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold font-serif-book text-slate-100">
              {PROJECTS[0].title}
            </h2>
            <p className="text-xs font-mono-code text-slate-400">{PROJECTS[0].subtitle}</p>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {PROJECTS[0].description}
            </p>

            {/* Benchmark Stats */}
            <div className="grid grid-cols-3 gap-2">
              {PROJECTS[0].stats.map((s, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
                  <span className="block text-[9px] font-mono-code text-slate-400">{s.label}</span>
                  <span className="text-xs font-bold font-mono-code text-emerald-400">{s.value}</span>
                </div>
              ))}
            </div>

            {/* Code Snippet Terminal */}
            <div className="rounded-lg bg-slate-900/90 border border-slate-800 overflow-hidden font-mono-code text-[11px]">
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950/80 border-b border-slate-800 text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Spectral Split-Step Fourier Engine</span>
                </div>
                <button
                  onClick={() => handleCopy(PROJECTS[0].codeSnippet, 0)}
                  className="flex items-center space-x-1 hover:text-slate-200 cursor-pointer"
                >
                  {copiedIndex === 0 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedIndex === 0 ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-3 text-slate-300 overflow-x-auto leading-relaxed text-[11px]">
                <code>{PROJECTS[0].codeSnippet}</code>
              </pre>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              {PROJECTS[0].techStack.map((tech, idx) => (
                <span key={idx} className="px-2.5 py-0.5 text-[10px] font-mono-code rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {tech}
                </span>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <a
                href={PROJECTS[0].githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono-code font-semibold text-xs transition-all shadow-lg shadow-emerald-500/20"
              >
                <GithubIcon className="w-4 h-4" />
                <span>Explore Code on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
              </a>
              <span className="text-[11px] font-mono-code text-slate-400">👉 3D frame active on right</span>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================
          PROJECT 2: LABELCHECKER AI
      ======================================================== */}
      <section className="min-h-screen flex items-center px-6 md:px-16 py-24">
        {PROJECTS[1] && (
          <div className="max-w-2xl space-y-5 bg-slate-950/75 p-8 md:p-10 rounded-2xl border border-slate-800/80 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center space-x-2 text-xs font-mono-code text-emerald-400">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">PROJECT 02</span>
              <span>{PROJECTS[1].category.toUpperCase()}</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold font-serif-book text-slate-100">
              {PROJECTS[1].title}
            </h2>
            <p className="text-xs font-mono-code text-slate-400">{PROJECTS[1].subtitle}</p>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {PROJECTS[1].description}
            </p>

            <div className="grid grid-cols-3 gap-2">
              {PROJECTS[1].stats.map((s, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
                  <span className="block text-[9px] font-mono-code text-slate-400">{s.label}</span>
                  <span className="text-xs font-bold font-mono-code text-emerald-400">{s.value}</span>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-slate-900/90 border border-slate-800 overflow-hidden font-mono-code text-[11px]">
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950/80 border-b border-slate-800 text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Computer Vision & OCR Pipeline</span>
                </div>
                <button
                  onClick={() => handleCopy(PROJECTS[1].codeSnippet, 1)}
                  className="flex items-center space-x-1 hover:text-slate-200 cursor-pointer"
                >
                  {copiedIndex === 1 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedIndex === 1 ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-3 text-slate-300 overflow-x-auto leading-relaxed text-[11px]">
                <code>{PROJECTS[1].codeSnippet}</code>
              </pre>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              {PROJECTS[1].techStack.map((tech, idx) => (
                <span key={idx} className="px-2.5 py-0.5 text-[10px] font-mono-code rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {tech}
                </span>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <a
                href={PROJECTS[1].githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono-code font-semibold text-xs transition-all shadow-lg shadow-emerald-500/20"
              >
                <GithubIcon className="w-4 h-4" />
                <span>Explore LabelChecker Code</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
              </a>
              <span className="text-[11px] font-mono-code text-slate-400">👉 Laser frame active on right</span>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================
          PROJECT 3: HEALTHCARE SYSTEM
      ======================================================== */}
      <section className="min-h-screen flex items-center px-6 md:px-16 py-24">
        {PROJECTS[2] && (
          <div className="max-w-2xl space-y-5 bg-slate-950/75 p-8 md:p-10 rounded-2xl border border-slate-800/80 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center space-x-2 text-xs font-mono-code text-cyan-400">
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">PROJECT 03</span>
              <span>{PROJECTS[2].category.toUpperCase()}</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold font-serif-book text-slate-100">
              {PROJECTS[2].title}
            </h2>
            <p className="text-xs font-mono-code text-slate-400">{PROJECTS[2].subtitle}</p>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {PROJECTS[2].description}
            </p>

            <div className="grid grid-cols-3 gap-2">
              {PROJECTS[2].stats.map((s, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
                  <span className="block text-[9px] font-mono-code text-slate-400">{s.label}</span>
                  <span className="text-xs font-bold font-mono-code text-cyan-400">{s.value}</span>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-slate-900/90 border border-slate-800 overflow-hidden font-mono-code text-[11px]">
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950/80 border-b border-slate-800 text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Transactional Telemetry Dispatcher</span>
                </div>
                <button
                  onClick={() => handleCopy(PROJECTS[2].codeSnippet, 2)}
                  className="flex items-center space-x-1 hover:text-slate-200 cursor-pointer"
                >
                  {copiedIndex === 2 ? <Check className="w-3 h-3 text-cyan-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedIndex === 2 ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-3 text-slate-300 overflow-x-auto leading-relaxed text-[11px]">
                <code>{PROJECTS[2].codeSnippet}</code>
              </pre>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              {PROJECTS[2].techStack.map((tech, idx) => (
                <span key={idx} className="px-2.5 py-0.5 text-[10px] font-mono-code rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {tech}
                </span>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <a
                href={PROJECTS[2].githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono-code font-semibold text-xs transition-all shadow-lg shadow-cyan-500/20"
              >
                <GithubIcon className="w-4 h-4" />
                <span>Explore Healthcare Code</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
              </a>
              <span className="text-[11px] font-mono-code text-slate-400">👉 ECG core active on right</span>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================
          SECTION 5: CONTACT & FINALE
      ======================================================== */}
      <section id="contact" className="min-h-screen flex items-center px-6 md:px-16 py-24">
        <div className="max-w-2xl space-y-6 bg-slate-950/75 p-8 md:p-10 rounded-2xl border border-slate-800/80 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center space-x-2 text-xs font-mono-code text-emerald-400">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">04</span>
            <span>LET'S COLLABORATE</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold font-serif-book text-slate-100">
            Initiate Connection.
          </h2>

          <p className="text-sm text-slate-300 font-mono-code leading-relaxed">
            Whether you want to discuss low-latency architecture, quantum wave simulations, computer vision verification, or cutting-edge WebGL experiences, my inbox is open.
          </p>

          <div className="space-y-3 pt-2">
            <a
              href={DEVELOPER_BIO.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all text-sm font-mono-code"
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
              className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all text-sm font-mono-code"
            >
              <div className="flex items-center space-x-3">
                <Send className="w-5 h-5 text-emerald-400" />
                <span>Email Transmission</span>
              </div>
              <span className="text-slate-400 flex items-center space-x-1">
                <span>Send Message</span>
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </a>
          </div>

          <div className="pt-4 flex items-center justify-center">
            <button
              onClick={handleCelebrate}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-mono-code transition-all cursor-pointer shadow-lg shadow-emerald-500/5 hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>Stamp Developer Seal (Celebrate)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-xs font-mono-code text-slate-500 border-t border-slate-800/60 bg-slate-950/80">
        <p>© 2026 Devesh Singh • Engineered with React 19, Three.js & Tailwind CSS • Hosted on GitHub Pages</p>
      </footer>
    </div>
  );
}
