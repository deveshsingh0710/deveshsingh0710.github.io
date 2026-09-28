import { useState } from 'react';
import { ExternalLink, Terminal, Copy, Check, ChevronDown, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { GithubIcon } from './Icons';
import { PROJECTS, DEVELOPER_BIO } from '../../data/projectsData';
import { sounds } from '../../utils/audio';

interface CinemaOverlayProps {
  scrollProgress: number;
  activeStage: number;
  onJumpToStage: (stage: number) => void;
}

export function CinemaOverlay({ scrollProgress, activeStage, onJumpToStage }: CinemaOverlayProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const toggleSound = () => {
    sounds.enabled = !sounds.enabled;
    setIsMuted(!sounds.enabled);
    if (sounds.enabled) sounds.playClick();
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    sounds.playClick();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getStageVisibility = (stageIndex: number) => {
    const center = stageIndex * 0.25;
    const dist = Math.abs(scrollProgress - center);
    if (dist > 0.16) return 0;
    return (Math.cos((dist / 0.16) * Math.PI) + 1) / 2;
  };

  const opacities = [0, 1, 2, 3, 4].map(getStageVisibility);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 select-none overflow-hidden text-slate-100">
      {/* Top High-Tech Status Header */}
      <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-5 pointer-events-auto">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono-code font-bold text-xs shadow-lg shadow-emerald-500/10">
            00
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase tracking-widest font-mono-code font-semibold text-slate-200">
                {DEVELOPER_BIO.name}
              </span>
              <span className="text-[10px] uppercase font-mono-code px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                Luminous Core
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono-code flex items-center space-x-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Real-time Fluid Dynamics • 60/120 FPS</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800/80 backdrop-blur-md transition-all cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          <a
            href={DEVELOPER_BIO.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 backdrop-blur-md text-xs font-mono-code text-slate-200 transition-all hover:border-slate-700"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">github.com/deveshsingh0710</span>
          </a>
        </div>
      </header>

      {/* Right-Side Stage Scrubber Navigation */}
      <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center space-y-4 pointer-events-auto">
        {['00 // SINGULARITY', '01 // QUANTUM', '02 // VISION', '03 // HEALTH', '04 // CONNECT'].map((label, idx) => {
          const isActive = activeStage === idx;
          return (
            <button
              key={idx}
              onClick={() => {
                sounds.playClick();
                onJumpToStage(idx);
              }}
              className="group flex items-center space-x-3 cursor-pointer"
            >
              <span
                className={`text-[10px] font-mono-code transition-all opacity-0 group-hover:opacity-100 ${
                  isActive ? 'text-emerald-400 font-semibold' : 'text-slate-400'
                }`}
              >
                {label}
              </span>
              <div
                className={`w-2 h-2 rounded-full border transition-all ${
                  isActive
                    ? 'w-3 h-3 bg-emerald-400 border-emerald-300 shadow-md shadow-emerald-400/50'
                    : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                }`}
              />
            </button>
          );
        })}
      </nav>

      {/* STAGE 0: FRAME 1 HOOK (NO PROJECTS — PURE VISUAL HOOK & LIQUID CURSOR REACTION) */}
      <section
        style={{ opacity: opacities[0], pointerEvents: opacities[0] > 0.4 ? 'auto' : 'none' }}
        className="fixed inset-0 flex flex-col justify-center px-8 md:px-20 max-w-3xl transition-opacity duration-300"
      >
        <div className="space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono-code text-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>HUMAN INFRASTRUCTURE FOR THE COMPUTATIONAL ERA</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight font-serif-book text-slate-100 leading-none">
            DEVESH <br />
            <span className="text-slate-400 font-normal">SINGH.</span>
          </h1>

          <p className="text-base md:text-lg text-slate-300 font-mono-code max-w-xl leading-relaxed">
            Move your cursor across the liquid obsidian core to distort light caustics. Scroll downward to ignite the luminous thread and traverse project architectures.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 max-w-lg">
            {DEVELOPER_BIO.stats.slice(0, 3).map((st, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-md">
                <span className="block text-[9px] font-mono-code uppercase text-slate-400">{st.label}</span>
                <span className="text-xs font-semibold text-slate-200 mt-0.5 block">{st.value}</span>
              </div>
            ))}
          </div>

          <div className="pt-6 flex items-center space-x-2 text-xs font-mono-code text-emerald-400/90">
            <ChevronDown className="w-4 h-4 text-emerald-400 animate-bounce" />
            <span>Scroll downward to ignite the luminous 3D thread ↓</span>
          </div>
        </div>
      </section>

      {/* STAGE 1: QUANTUM TUNNELING */}
      {PROJECTS[0] && (
        <section
          style={{ opacity: opacities[1], pointerEvents: opacities[1] > 0.4 ? 'auto' : 'none' }}
          className="fixed inset-0 flex flex-col justify-center px-8 md:px-20 max-w-2xl transition-opacity duration-300"
        >
          <div className="space-y-4 bg-slate-950/70 p-6 md:p-8 rounded-2xl border border-slate-800/80 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center space-x-2 text-xs font-mono-code text-emerald-400">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">01</span>
              <span>{PROJECTS[0].category.toUpperCase()}</span>
              <span className="text-slate-500">• Hover on 3D frame to inspect</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold font-serif-book text-slate-100">
              {PROJECTS[0].title}
            </h2>
            <p className="text-xs font-mono-code text-slate-400">{PROJECTS[0].subtitle}</p>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {PROJECTS[0].description}
            </p>

            <div className="grid grid-cols-3 gap-2">
              {PROJECTS[0].stats.map((s, i) => (
                <div key={i} className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
                  <span className="block text-[9px] font-mono-code text-slate-400">{s.label}</span>
                  <span className="text-xs font-bold font-mono-code text-emerald-400">{s.value}</span>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-slate-900/90 border border-slate-800 overflow-hidden font-mono-code text-[10px]">
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950/80 border-b border-slate-800 text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <Terminal className="w-3 h-3 text-emerald-400" />
                  <span>Spectral Split-Step Fourier Engine</span>
                </div>
                <button
                  onClick={() => handleCopy(PROJECTS[0].codeSnippet)}
                  className="flex items-center space-x-1 hover:text-slate-200 cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-3 text-slate-300 overflow-x-auto leading-relaxed">
                <code>{PROJECTS[0].codeSnippet}</code>
              </pre>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <a
                href={PROJECTS[0].githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono-code font-semibold text-xs transition-all shadow-lg shadow-emerald-500/20"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>View Quantum Repo on GitHub</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* STAGE 2: LABELCHECKER */}
      {PROJECTS[1] && (
        <section
          style={{ opacity: opacities[2], pointerEvents: opacities[2] > 0.4 ? 'auto' : 'none' }}
          className="fixed inset-0 flex flex-col justify-center px-8 md:px-20 max-w-2xl transition-opacity duration-300"
        >
          <div className="space-y-4 bg-slate-950/70 p-6 md:p-8 rounded-2xl border border-slate-800/80 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center space-x-2 text-xs font-mono-code text-emerald-400">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">02</span>
              <span>{PROJECTS[1].category.toUpperCase()}</span>
              <span className="text-slate-500">• Hover on 3D frame to inspect</span>
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
                <div key={i} className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
                  <span className="block text-[9px] font-mono-code text-slate-400">{s.label}</span>
                  <span className="text-xs font-bold font-mono-code text-emerald-400">{s.value}</span>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-slate-900/90 border border-slate-800 overflow-hidden font-mono-code text-[10px]">
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950/80 border-b border-slate-800 text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <Terminal className="w-3 h-3 text-emerald-400" />
                  <span>Computer Vision & OCR Pipeline</span>
                </div>
                <button
                  onClick={() => handleCopy(PROJECTS[1].codeSnippet)}
                  className="flex items-center space-x-1 hover:text-slate-200 cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-3 text-slate-300 overflow-x-auto leading-relaxed">
                <code>{PROJECTS[1].codeSnippet}</code>
              </pre>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <a
                href={PROJECTS[1].githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono-code font-semibold text-xs transition-all shadow-lg shadow-emerald-500/20"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>Explore LabelChecker Repo</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* STAGE 3: HEALTHCARE PLATFORM */}
      {PROJECTS[2] && (
        <section
          style={{ opacity: opacities[3], pointerEvents: opacities[3] > 0.4 ? 'auto' : 'none' }}
          className="fixed inset-0 flex flex-col justify-center px-8 md:px-20 max-w-2xl transition-opacity duration-300"
        >
          <div className="space-y-4 bg-slate-950/70 p-6 md:p-8 rounded-2xl border border-slate-800/80 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center space-x-2 text-xs font-mono-code text-cyan-400">
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">03</span>
              <span>{PROJECTS[2].category.toUpperCase()}</span>
              <span className="text-slate-500">• Hover on 3D frame to inspect</span>
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
                <div key={i} className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
                  <span className="block text-[9px] font-mono-code text-slate-400">{s.label}</span>
                  <span className="text-xs font-bold font-mono-code text-cyan-400">{s.value}</span>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-slate-900/90 border border-slate-800 overflow-hidden font-mono-code text-[10px]">
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950/80 border-b border-slate-800 text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <Terminal className="w-3 h-3 text-cyan-400" />
                  <span>Transactional Telemetry Dispatcher</span>
                </div>
                <button
                  onClick={() => handleCopy(PROJECTS[2].codeSnippet)}
                  className="flex items-center space-x-1 hover:text-slate-200 cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-cyan-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-3 text-slate-300 overflow-x-auto leading-relaxed">
                <code>{PROJECTS[2].codeSnippet}</code>
              </pre>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <a
                href={PROJECTS[2].githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono-code font-semibold text-xs transition-all shadow-lg shadow-cyan-500/20"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>Explore Healthcare Repo</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* STAGE 4: CONNECT / OUTRO */}
      <section
        style={{ opacity: opacities[4], pointerEvents: opacities[4] > 0.4 ? 'auto' : 'none' }}
        className="fixed inset-0 flex flex-col justify-center px-8 md:px-20 max-w-2xl transition-opacity duration-300"
      >
        <div className="space-y-6 bg-slate-950/70 p-6 md:p-8 rounded-2xl border border-slate-800/80 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center space-x-2 text-xs font-mono-code text-emerald-400">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">04</span>
            <span>COMMUNICATIONS DOCK</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold font-serif-book text-slate-100">
            Initiate Connection.
          </h2>

          <p className="text-sm text-slate-300 font-mono-code leading-relaxed">
            Interested in high-throughput systems, computer vision verification, or cutting-edge WebGL experiences? Let's connect and build something exceptional.
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
              <span className="text-slate-400">@deveshsingh0710 ↗</span>
            </a>

            <a
              href={DEVELOPER_BIO.links.email}
              className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all text-sm font-mono-code"
            >
              <div className="flex items-center space-x-3">
                <span className="text-emerald-400 font-bold">@</span>
                <span>Direct Email Inquiries</span>
              </div>
              <span className="text-slate-400">Send Transmission ↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* Bottom Progress Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 px-6 py-4 flex items-center justify-between pointer-events-auto bg-gradient-to-t from-[#030907] to-transparent">
        <div className="flex items-center space-x-3 text-[11px] font-mono-code text-slate-400">
          <span>JOURNEY</span>
          <div className="w-32 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 transition-all duration-75"
              style={{ width: `${Math.round(scrollProgress * 100)}%` }}
            />
          </div>
          <span>{Math.round(scrollProgress * 100)}%</span>
        </div>

        <span className="text-[10px] text-slate-500 font-mono-code hidden sm:inline">
          Move mouse to interact with 3D elements • Scroll to traverse thread
        </span>
      </footer>
    </div>
  );
}
