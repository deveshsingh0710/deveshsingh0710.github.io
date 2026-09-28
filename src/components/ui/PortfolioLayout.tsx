import { useState } from 'react';
import { ExternalLink, Terminal, Copy, Check, ChevronDown, Volume2, VolumeX, Sparkles, Send, ArrowUpRight } from 'lucide-react';
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
                ML Engineer
              </span>
            </div>
          </div>
        </div>

        {/* Section Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-xs font-mono-code text-slate-400">
          <button onClick={() => onScrollTo('hero')} className="hover:text-emerald-400 transition-colors cursor-pointer">
            00 // Pass ID
          </button>
          <button onClick={() => onScrollTo('quantum')} className="hover:text-emerald-400 transition-colors cursor-pointer">
            01 // Quantum
          </button>
          <button onClick={() => onScrollTo('vision')} className="hover:text-emerald-400 transition-colors cursor-pointer">
            02 // Vision
          </button>
          <button onClick={() => onScrollTo('healthcare')} className="hover:text-emerald-400 transition-colors cursor-pointer">
            03 // Health
          </button>
          <button onClick={() => onScrollTo('contact')} className="hover:text-emerald-400 transition-colors cursor-pointer">
            04 // Contact
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
          STAGE 1: OPENING FRAME (3D HOLOGRAPHIC PASS — NO PROJECTS YET!)
      ======================================================== */}
      <section id="hero" className="min-h-screen flex flex-col justify-between px-6 md:px-16 pt-32 pb-16">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono-code text-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>MACHINE LEARNING ENGINEER • VERIFIED ACCESS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-serif-book text-slate-100 leading-none">
            DEVESH <br />
            <span className="text-slate-400 font-normal">SINGH.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-mono-code leading-relaxed max-w-lg">
            Specialized in deep learning architectures, computer vision pipelines, high-performance scientific simulations, and distributed intelligence systems.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {DEVELOPER_BIO.skills.slice(0, 6).map((skill, idx) => (
              <span key={idx} className="px-2.5 py-1 text-xs font-mono-code rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Scroll Prompt */}
        <div className="pt-12 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => onScrollTo('quantum')}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold font-mono-code text-xs transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <span>Descend Thermometer Rail</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </button>

          <span className="text-xs font-mono-code text-slate-400 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Hover on 3D Pass above • Scroll to reach project milestones</span>
          </span>
        </div>
      </section>

      {/* ========================================================
          STAGE 2: PROJECT 01 (QUANTUM TUNNELING)
          Generous Scroll Distance: min-h-[140vh]
      ======================================================== */}
      <section id="quantum" className="min-h-[140vh] flex items-center px-6 md:px-16 py-24">
        {PROJECTS[0] && (
          <div
            onClick={() => openLink(PROJECTS[0].githubUrl)}
            onMouseEnter={() => {
              sounds.playClick();
              onHoverProject('quantum');
            }}
            onMouseLeave={() => onHoverProject(null)}
            className="group max-w-xl md:max-w-2xl space-y-5 bg-slate-950/80 hover:bg-slate-950/95 p-8 md:p-10 rounded-2xl border border-slate-800 hover:border-emerald-500/60 backdrop-blur-xl shadow-2xl transition-all duration-300 cursor-pointer hover:shadow-emerald-500/10 hover:shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-mono-code text-emerald-400">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">MILESTONE 01</span>
                <span>{PROJECTS[0].category.toUpperCase()}</span>
              </div>
              <span className="text-[11px] font-mono-code text-emerald-400/80 flex items-center space-x-1 group-hover:text-emerald-300">
                <span>Hover for 3D • Click for Repo</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold font-serif-book text-slate-100 group-hover:text-emerald-200 transition-colors">
              {PROJECTS[0].title}
            </h2>
            <p className="text-xs font-mono-code text-slate-400">{PROJECTS[0].subtitle}</p>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {PROJECTS[0].description}
            </p>

            {/* Benchmark Stats */}
            <div className="grid grid-cols-3 gap-2">
              {PROJECTS[0].stats.map((s, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-center">
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
                  onClick={(e) => handleCopy(PROJECTS[0].codeSnippet, 0, e)}
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
              <span className="inline-flex items-center space-x-2 text-xs font-mono-code text-emerald-400 underline underline-offset-4">
                <span>View Quantum Repo on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
              <span className="text-[11px] font-mono-code text-slate-500">✨ 3D Wave simulation activates on hover</span>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================
          STAGE 3: PROJECT 02 (LABELCHECKER AI)
          Generous Scroll Distance: min-h-[140vh]
      ======================================================== */}
      <section id="vision" className="min-h-[140vh] flex items-center px-6 md:px-16 py-24">
        {PROJECTS[1] && (
          <div
            onClick={() => openLink(PROJECTS[1].githubUrl)}
            onMouseEnter={() => {
              sounds.playClick();
              onHoverProject('vision');
            }}
            onMouseLeave={() => onHoverProject(null)}
            className="group max-w-xl md:max-w-2xl space-y-5 bg-slate-950/80 hover:bg-slate-950/95 p-8 md:p-10 rounded-2xl border border-slate-800 hover:border-emerald-500/60 backdrop-blur-xl shadow-2xl transition-all duration-300 cursor-pointer hover:shadow-emerald-500/10 hover:shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-mono-code text-emerald-400">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">MILESTONE 02</span>
                <span>{PROJECTS[1].category.toUpperCase()}</span>
              </div>
              <span className="text-[11px] font-mono-code text-emerald-400/80 flex items-center space-x-1 group-hover:text-emerald-300">
                <span>Hover for 3D • Click for Repo</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold font-serif-book text-slate-100 group-hover:text-emerald-200 transition-colors">
              {PROJECTS[1].title}
            </h2>
            <p className="text-xs font-mono-code text-slate-400">{PROJECTS[1].subtitle}</p>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {PROJECTS[1].description}
            </p>

            <div className="grid grid-cols-3 gap-2">
              {PROJECTS[1].stats.map((s, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-center">
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
                  onClick={(e) => handleCopy(PROJECTS[1].codeSnippet, 1, e)}
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
              <span className="inline-flex items-center space-x-2 text-xs font-mono-code text-emerald-400 underline underline-offset-4">
                <span>View LabelChecker Repo on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
              <span className="text-[11px] font-mono-code text-slate-500">✨ 3D Laser scanner activates on hover</span>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================
          STAGE 4: PROJECT 03 (HEALTHCARE ECOSYSTEM)
          Generous Scroll Distance: min-h-[140vh]
      ======================================================== */}
      <section id="healthcare" className="min-h-[140vh] flex items-center px-6 md:px-16 py-24">
        {PROJECTS[2] && (
          <div
            onClick={() => openLink(PROJECTS[2].githubUrl)}
            onMouseEnter={() => {
              sounds.playClick();
              onHoverProject('healthcare');
            }}
            onMouseLeave={() => onHoverProject(null)}
            className="group max-w-xl md:max-w-2xl space-y-5 bg-slate-950/80 hover:bg-slate-950/95 p-8 md:p-10 rounded-2xl border border-slate-800 hover:border-cyan-500/60 backdrop-blur-xl shadow-2xl transition-all duration-300 cursor-pointer hover:shadow-cyan-500/10 hover:shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-mono-code text-cyan-400">
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">MILESTONE 03</span>
                <span>{PROJECTS[2].category.toUpperCase()}</span>
              </div>
              <span className="text-[11px] font-mono-code text-cyan-400/80 flex items-center space-x-1 group-hover:text-cyan-300">
                <span>Hover for 3D • Click for Repo</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold font-serif-book text-slate-100 group-hover:text-cyan-200 transition-colors">
              {PROJECTS[2].title}
            </h2>
            <p className="text-xs font-mono-code text-slate-400">{PROJECTS[2].subtitle}</p>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {PROJECTS[2].description}
            </p>

            <div className="grid grid-cols-3 gap-2">
              {PROJECTS[2].stats.map((s, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-center">
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
                  onClick={(e) => handleCopy(PROJECTS[2].codeSnippet, 2, e)}
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
              <span className="inline-flex items-center space-x-2 text-xs font-mono-code text-cyan-400 underline underline-offset-4">
                <span>View Healthcare Repo on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
              <span className="text-[11px] font-mono-code text-slate-500">✨ 3D Cardiac telemetry activates on hover</span>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================
          STAGE 5: CONTACT & FINALE
      ======================================================== */}
      <section id="contact" className="min-h-screen flex items-center px-6 md:px-16 py-24">
        <div className="max-w-2xl space-y-6 bg-slate-950/80 p-8 md:p-10 rounded-2xl border border-slate-800/80 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center space-x-2 text-xs font-mono-code text-emerald-400">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">MILESTONE 04</span>
            <span>COMMUNICATIONS TERMINUS</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold font-serif-book text-slate-100">
            Thermometer Terminal Reached.
          </h2>

          <p className="text-sm text-slate-300 font-mono-code leading-relaxed">
            Ready to collaborate on machine learning engineering, computer vision pipelines, or high-throughput distributed systems.
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
                <span>Send Direct Inquiry</span>
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
