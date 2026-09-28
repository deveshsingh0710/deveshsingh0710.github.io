import { useState } from 'react';
import { Terminal, Copy, Check, ChevronDown, ChevronUp, Volume2, VolumeX, Sparkles, Send, ArrowUpRight, Cpu } from 'lucide-react';
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
  const [expandedCodeIndex, setExpandedCodeIndex] = useState<number | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [copiedCloneCmd, setCopiedCloneCmd] = useState(false);

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

  const handleCopyClone = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText("git clone https://github.com/deveshsingh0710.git");
    setCopiedCloneCmd(true);
    sounds.playClick();
    setTimeout(() => setCopiedCloneCmd(false), 2000);
  };

  const toggleCodeExpand = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    setExpandedCodeIndex(expandedCodeIndex === index ? null : index);
  };

  const handleCelebrate = () => {
    sounds.playPopUp();
    confetti({
      particleCount: 110,
      spread: 85,
      origin: { y: 0.8 },
      colors: ['#10b981', '#34d399', '#38bdf8', '#a7f3d0']
    });
  };

  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Dynamic Spotlight Card Cursor Physics (Apple / Linear style)
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  // Mini SVG Sparkline Generator
  const renderSparkline = (data: number[], color: string) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const width = 110;
    const height = 30;

    const points = data
      .map((val, idx) => {
        const x = (idx / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 6) - 3;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          className="drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]"
        />
        {data.length > 0 && (
          <circle
            cx={width}
            cy={height - ((data[data.length - 1] - min) / range) * (height - 6) - 3}
            r="3"
            fill={color}
            className="animate-ping"
          />
        )}
      </svg>
    );
  };

  return (
    <div className="relative z-10 w-full text-slate-100 pointer-events-auto">
      {/* Top Glass Header */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-14 py-3.5 bg-slate-950/75 border-b border-slate-800/60 backdrop-blur-xl">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono-code font-bold text-xs shadow-md shadow-emerald-500/10">
            DS
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase tracking-wider font-display font-bold text-slate-200">
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
            01 // Architectures
          </button>
          <button onClick={() => onScrollTo('about')} className="hover:text-emerald-400 transition-colors cursor-pointer">
            02 // Specialization
          </button>
          <button onClick={() => onScrollTo('contact')} className="hover:text-emerald-400 transition-colors cursor-pointer">
            03 // Transmission
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
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 backdrop-blur-md text-xs font-mono-code text-slate-200 transition-all hover:border-slate-700"
          >
            <GithubIcon className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </header>

      {/* ========================================================
          HERO SECTION (High-Credibility ML Engineer First Frame)
      ======================================================== */}
      <section id="hero" className="min-h-[92vh] flex items-center px-6 md:px-16 pt-24 pb-12">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live ML Telemetry Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono-code text-xs backdrop-blur-md shadow-lg shadow-emerald-500/5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-semibold">$ torch.cuda.is_available()</span>
              <span className="text-slate-400">→ True [TensorRT 10.2 • FP16]</span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black font-display text-slate-100 leading-none tracking-tight">
              DEVESH <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                SINGH.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-mono-code leading-relaxed max-w-xl">
              Machine Learning Engineer specialized in deep learning pipelines, computational physics PDE solvers, and low-latency computer vision architectures.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2.5 max-w-md pt-1">
              {DEVELOPER_BIO.stats.map((st, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-md">
                  <span className="block text-[9px] font-mono-code uppercase text-slate-400">{st.label}</span>
                  <span className="text-xs font-semibold font-mono-code text-slate-200 mt-0.5 block">{st.value}</span>
                </div>
              ))}
            </div>

            {/* Interactive CTA */}
            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-5">
              <button
                onClick={() => onScrollTo('projects')}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono-code text-xs transition-all shadow-xl shadow-emerald-500/25 hover:scale-105 cursor-pointer"
              >
                <span>Inspect Architectures</span>
                <ChevronDown className="w-4 h-4 animate-bounce" />
              </button>

              <span className="text-xs font-mono-code text-slate-400 flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hover project rows below to summon real-time 3D simulation</span>
              </span>
            </div>
          </div>

          {/* Right Hero Space (Open & Uncluttered for the 3D Holographic Quantum Core) */}
          <div className="hidden lg:flex lg:col-span-5 h-[380px] pointer-events-none" />
        </div>
      </section>

      {/* ========================================================
          PROJECTS SECTION (Apple/Linear Spotlight Glow + Pipelines)
      ======================================================== */}
      <section id="projects" className="px-6 md:px-16 py-16 max-w-5xl mx-auto space-y-8">
        <div className="border-b border-slate-800/80 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-mono-code text-emerald-400 uppercase tracking-widest">
              01 // PRODUCTION ARCHITECTURES
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-100 mt-1">
              Selected Systems.
            </h2>
          </div>
          <span className="text-xs font-mono-code text-slate-400">
            ✨ Hover over card to trigger 3D magnetic portal
          </span>
        </div>

        {/* Project 1: Quantum Tunneling */}
        {PROJECTS[0] && (
          <div
            onClick={() => openLink(PROJECTS[0].githubUrl)}
            onMouseMove={handleCardMouseMove}
            onMouseEnter={() => {
              sounds.playClick();
              onHoverProject('quantum');
            }}
            onMouseLeave={() => onHoverProject(null)}
            className="spotlight-card group relative p-6 md:p-8 rounded-2xl cursor-pointer shadow-2xl"
          >
            <div className="relative z-10 space-y-4">
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-mono-code text-emerald-400">
                      01 // {PROJECTS[0].category.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                      {PROJECTS[0].benchmarkBadge}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-100 group-hover:text-emerald-300 transition-colors mt-1">
                    {PROJECTS[0].title}
                  </h3>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <div className="hidden sm:block text-right">
                    <span className="text-[9px] font-mono-code text-slate-400 block uppercase">Convergence Loss</span>
                    {renderSparkline(PROJECTS[0].sparklineData, '#34d399')}
                  </div>
                  <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono-code text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                    <span>GitHub</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-mono-code">
                {PROJECTS[0].description}
              </p>

              {/* Visual Architecture Pipeline Flow */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <span className="text-[10px] font-mono-code text-slate-400 uppercase tracking-wider block mb-2">
                  System Architecture Pipeline:
                </span>
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono-code">
                  {PROJECTS[0].architecturePipeline.map((step, idx) => (
                    <div key={idx} className="flex items-center space-x-1.5">
                      <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700/80 text-slate-200">
                        {step}
                      </span>
                      {idx < PROJECTS[0].architecturePipeline.length - 1 && (
                        <span className="text-emerald-400 font-bold">➔</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Compact Specs Row */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-900">
                {PROJECTS[0].stats.map((s, i) => (
                  <div key={i} className="px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-800/80 text-[11px] font-mono-code">
                    <span className="text-slate-400 mr-1.5">{s.label}:</span>
                    <span className="font-semibold text-emerald-400">{s.value}</span>
                  </div>
                ))}

                <button
                  onClick={(e) => toggleCodeExpand(0, e)}
                  className="ml-auto flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono-code text-slate-300 transition-colors cursor-pointer"
                >
                  <Terminal className="w-3 h-3 text-emerald-400" />
                  <span>{expandedCodeIndex === 0 ? 'Hide Kernel' : 'View Kernel Code'}</span>
                  {expandedCodeIndex === 0 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              {/* Collapsible Code Snippet */}
              {expandedCodeIndex === 0 && (
                <div className="rounded-xl bg-slate-900/95 border border-slate-800 overflow-hidden font-mono-code text-[11px]">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950 border-b border-slate-800 text-slate-400">
                    <span>Schrödinger Dispersion Kernel (Split-Step FFT)</span>
                    <button
                      onClick={(e) => handleCopy(PROJECTS[0].codeSnippet, 0, e)}
                      className="flex items-center space-x-1 text-xs hover:text-slate-200 cursor-pointer"
                    >
                      {copiedIndex === 0 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedIndex === 0 ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-3 text-slate-300 overflow-x-auto text-[11px] leading-relaxed">
                    <code>{PROJECTS[0].codeSnippet}</code>
                  </pre>
                </div>
              )}

              {/* Tech Stack Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PROJECTS[0].techStack.map((tech, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 text-[11px] font-mono-code rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Project 2: LabelChecker AI */}
        {PROJECTS[1] && (
          <div
            onClick={() => openLink(PROJECTS[1].githubUrl)}
            onMouseMove={handleCardMouseMove}
            onMouseEnter={() => {
              sounds.playClick();
              onHoverProject('vision');
            }}
            onMouseLeave={() => onHoverProject(null)}
            className="spotlight-card group relative p-6 md:p-8 rounded-2xl cursor-pointer shadow-2xl"
          >
            <div className="relative z-10 space-y-4">
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-mono-code text-emerald-400">
                      02 // {PROJECTS[1].category.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                      {PROJECTS[1].benchmarkBadge}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-100 group-hover:text-emerald-300 transition-colors mt-1">
                    {PROJECTS[1].title}
                  </h3>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <div className="hidden sm:block text-right">
                    <span className="text-[9px] font-mono-code text-slate-400 block uppercase">Loss Convergence</span>
                    {renderSparkline(PROJECTS[1].sparklineData, '#34d399')}
                  </div>
                  <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono-code text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                    <span>GitHub</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-mono-code">
                {PROJECTS[1].description}
              </p>

              {/* Visual Architecture Pipeline Flow */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <span className="text-[10px] font-mono-code text-slate-400 uppercase tracking-wider block mb-2">
                  Computer Vision & OCR Pipeline:
                </span>
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono-code">
                  {PROJECTS[1].architecturePipeline.map((step, idx) => (
                    <div key={idx} className="flex items-center space-x-1.5">
                      <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700/80 text-slate-200">
                        {step}
                      </span>
                      {idx < PROJECTS[1].architecturePipeline.length - 1 && (
                        <span className="text-emerald-400 font-bold">➔</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Compact Specs Row */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-900">
                {PROJECTS[1].stats.map((s, i) => (
                  <div key={i} className="px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-800/80 text-[11px] font-mono-code">
                    <span className="text-slate-400 mr-1.5">{s.label}:</span>
                    <span className="font-semibold text-emerald-400">{s.value}</span>
                  </div>
                ))}

                <button
                  onClick={(e) => toggleCodeExpand(1, e)}
                  className="ml-auto flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono-code text-slate-300 transition-colors cursor-pointer"
                >
                  <Terminal className="w-3 h-3 text-emerald-400" />
                  <span>{expandedCodeIndex === 1 ? 'Hide Pipeline' : 'View Vision Pipeline'}</span>
                  {expandedCodeIndex === 1 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              {/* Collapsible Code Snippet */}
              {expandedCodeIndex === 1 && (
                <div className="rounded-xl bg-slate-900/95 border border-slate-800 overflow-hidden font-mono-code text-[11px]">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950 border-b border-slate-800 text-slate-400">
                    <span>YOLOv8 + Attention OCR Verification</span>
                    <button
                      onClick={(e) => handleCopy(PROJECTS[1].codeSnippet, 1, e)}
                      className="flex items-center space-x-1 text-xs hover:text-slate-200 cursor-pointer"
                    >
                      {copiedIndex === 1 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedIndex === 1 ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-3 text-slate-300 overflow-x-auto text-[11px] leading-relaxed">
                    <code>{PROJECTS[1].codeSnippet}</code>
                  </pre>
                </div>
              )}

              {/* Tech Stack Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PROJECTS[1].techStack.map((tech, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 text-[11px] font-mono-code rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Project 3: Healthcare System */}
        {PROJECTS[2] && (
          <div
            onClick={() => openLink(PROJECTS[2].githubUrl)}
            onMouseMove={handleCardMouseMove}
            onMouseEnter={() => {
              sounds.playClick();
              onHoverProject('healthcare');
            }}
            onMouseLeave={() => onHoverProject(null)}
            className="spotlight-card group relative p-6 md:p-8 rounded-2xl cursor-pointer shadow-2xl"
          >
            <div className="relative z-10 space-y-4">
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-mono-code text-cyan-400">
                      03 // {PROJECTS[2].category.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                      {PROJECTS[2].benchmarkBadge}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-100 group-hover:text-cyan-300 transition-colors mt-1">
                    {PROJECTS[2].title}
                  </h3>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <div className="hidden sm:block text-right">
                    <span className="text-[9px] font-mono-code text-slate-400 block uppercase">Kafka Latency</span>
                    {renderSparkline(PROJECTS[2].sparklineData, '#06b6d4')}
                  </div>
                  <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono-code text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all">
                    <span>GitHub</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-mono-code">
                {PROJECTS[2].description}
              </p>

              {/* Visual Architecture Pipeline Flow */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                <span className="text-[10px] font-mono-code text-slate-400 uppercase tracking-wider block mb-2">
                  Event-Driven Ingestion Stream:
                </span>
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono-code">
                  {PROJECTS[2].architecturePipeline.map((step, idx) => (
                    <div key={idx} className="flex items-center space-x-1.5">
                      <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700/80 text-slate-200">
                        {step}
                      </span>
                      {idx < PROJECTS[2].architecturePipeline.length - 1 && (
                        <span className="text-cyan-400 font-bold">➔</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Compact Specs Row */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-900">
                {PROJECTS[2].stats.map((s, i) => (
                  <div key={i} className="px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-800/80 text-[11px] font-mono-code">
                    <span className="text-slate-400 mr-1.5">{s.label}:</span>
                    <span className="font-semibold text-cyan-400">{s.value}</span>
                  </div>
                ))}

                <button
                  onClick={(e) => toggleCodeExpand(2, e)}
                  className="ml-auto flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono-code text-slate-300 transition-colors cursor-pointer"
                >
                  <Terminal className="w-3 h-3 text-cyan-400" />
                  <span>{expandedCodeIndex === 2 ? 'Hide Dispatcher' : 'View Dispatcher'}</span>
                  {expandedCodeIndex === 2 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              {/* Collapsible Code Snippet */}
              {expandedCodeIndex === 2 && (
                <div className="rounded-xl bg-slate-900/95 border border-slate-800 overflow-hidden font-mono-code text-[11px]">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950 border-b border-slate-800 text-slate-400">
                    <span>Transactional Telemetry Dispatcher</span>
                    <button
                      onClick={(e) => handleCopy(PROJECTS[2].codeSnippet, 2, e)}
                      className="flex items-center space-x-1 text-xs hover:text-slate-200 cursor-pointer"
                    >
                      {copiedIndex === 2 ? <Check className="w-3 h-3 text-cyan-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedIndex === 2 ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-3 text-slate-300 overflow-x-auto text-[11px] leading-relaxed">
                    <code>{PROJECTS[2].codeSnippet}</code>
                  </pre>
                </div>
              )}

              {/* Tech Stack Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PROJECTS[2].techStack.map((tech, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 text-[11px] font-mono-code rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================
          ABOUT & SPECIALIZATION (Clustered Engineering Matrix)
      ======================================================== */}
      <section id="about" className="px-6 md:px-16 py-16 max-w-5xl mx-auto">
        <div className="spotlight-card p-6 md:p-8 rounded-2xl shadow-xl space-y-6">
          <div className="border-b border-slate-800/80 pb-4">
            <span className="text-xs font-mono-code text-emerald-400 uppercase tracking-widest">
              02 // ENGINEERING PHILOSOPHY & TOOLCHAIN
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-100 mt-1">
              Precision Over Hype.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-mono-code leading-relaxed mt-2 max-w-3xl">
              {DEVELOPER_BIO.bio}
            </p>
          </div>

          {/* Clustered Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEVELOPER_BIO.skillClusters.map((cluster, cIdx) => (
              <div key={cIdx} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2.5">
                <span className="text-[11px] uppercase font-mono-code font-bold tracking-wider text-emerald-400 flex items-center space-x-1.5">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
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
                        className={`px-2.5 py-1 text-[11px] font-mono-code rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/30'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-300'
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

      {/* ========================================================
          CONTACT & CLI QUICK-TRANSMISSION
      ======================================================== */}
      <section id="contact" className="px-6 md:px-16 py-16 max-w-5xl mx-auto">
        <div className="spotlight-card p-6 md:p-8 rounded-2xl shadow-xl space-y-6 max-w-2xl mx-auto">
          <div>
            <span className="text-xs font-mono-code text-emerald-400 uppercase tracking-widest">
              03 // DIRECT TRANSMISSION
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-display text-slate-100 mt-1">
              Let's Build.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-mono-code leading-relaxed mt-2">
              Looking for a Machine Learning Engineer to design resilient deep learning models, high-performance vision pipelines, or distributed systems? Connect directly below.
            </p>
          </div>

          {/* Quick CLI Terminal Clone Command */}
          <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between font-mono-code text-xs">
            <div className="flex items-center space-x-2 text-slate-300 overflow-x-auto">
              <span className="text-emerald-400 font-bold">$</span>
              <span>git clone https://github.com/deveshsingh0710.git</span>
            </div>
            <button
              onClick={handleCopyClone}
              className="ml-3 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] shrink-0 flex items-center space-x-1 cursor-pointer"
            >
              {copiedCloneCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCloneCmd ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="space-y-2.5">
            <a
              href={DEVELOPER_BIO.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 transition-all text-xs font-mono-code group"
            >
              <div className="flex items-center space-x-3">
                <GithubIcon className="w-4 h-4 text-emerald-400" />
                <span>GitHub Repositories & Open Source</span>
              </div>
              <span className="text-slate-400 group-hover:text-emerald-400 flex items-center space-x-1">
                <span>@deveshsingh0710</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </a>

            <a
              href={DEVELOPER_BIO.links.email}
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 transition-all text-xs font-mono-code group"
            >
              <div className="flex items-center space-x-3">
                <Send className="w-4 h-4 text-emerald-400" />
                <span>Encrypted Email Transmission</span>
              </div>
              <span className="text-slate-400 group-hover:text-emerald-400 flex items-center space-x-1">
                <span>Send Direct Inquiry</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </a>
          </div>

          <div className="pt-2 flex items-center justify-center">
            <button
              onClick={handleCelebrate}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-mono-code transition-all cursor-pointer shadow-lg shadow-emerald-500/5 hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>Stamp Verification Seal (Celebrate)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6 text-center text-xs font-mono-code text-slate-500 border-t border-slate-800/60 bg-slate-950/80">
        <p>© 2026 Devesh Singh • Machine Learning Engineer • Deployed on GitHub Pages</p>
      </footer>
    </div>
  );
}
