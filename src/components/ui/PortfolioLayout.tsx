import { useState, useEffect, useRef } from 'react';
import {
  Volume2, VolumeX, Sparkles, Send, ArrowUpRight, Cpu, Copy, Check,
  ChevronDown, Code2, Globe, Layers, ArrowRight, Terminal as TerminalIcon,
  Play, Activity
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GithubIcon } from './Icons';
import { PROJECTS, DEVELOPER_BIO } from '../../data/projectsData';
import { sounds } from '../../utils/audio';
import { getActiveCheckpoint } from '../../utils/fluidSync';
import type { SectionId } from '../../hooks/useSmoothScroll';

interface PortfolioLayoutProps {
  scrollProgress: number;
  projectsProgress: number;
  isInsideProjects: boolean;
  activeSection: SectionId;
  onScrollTo: (id: string) => void;
  onHoverProject: (project: 'quantum' | 'vision' | 'healthcare' | null) => void;
}

export function PortfolioLayout({
  projectsProgress,
  isInsideProjects,
  activeSection,
  onScrollTo,
  onHoverProject
}: PortfolioLayoutProps) {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [copiedCloneCmd, setCopiedCloneCmd] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  // Interactive Live Terminal State
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "Devesh AI Environment v2.4 initialized.",
    "Type 'help' to inspect available system commands."
  ]);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Fluid checkpoint calculation strictly within #projects
  const activeCheckpoint = isInsideProjects ? getActiveCheckpoint(projectsProgress) : null;

  // Keep track of last active checkpoint to enable smooth CSS fade-outs
  const [lastCheckpoint, setLastCheckpoint] = useState<number>(1);
  useEffect(() => {
    if (activeCheckpoint !== null) {
      setLastCheckpoint(activeCheckpoint);
    }
  }, [activeCheckpoint]);

  const displayedCheckpoint = activeCheckpoint !== null ? activeCheckpoint : lastCheckpoint;
  const isCardVisible = isInsideProjects && activeCheckpoint !== null;

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

  const handleCopySnippet = () => {
    const code = `const createAmazingThings = () => {
  return {
    developer: "Devesh Singh Rathore",
    focus: ["DSA", "AI & ML", "Interactive Web"],
    passion: "coding",
    goal: "impact",
  };
};`;
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    sounds.playClick();
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleCelebrate = () => {
    sounds.playPopUp();
    confetti({
      particleCount: 110,
      spread: 85,
      origin: { y: 0.8 },
      colors: ['#00e5ff', '#22d3ee', '#8b5cf6', '#d8ff64', '#0052f2']
    });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playPopUp();
    setContactSubmitted(true);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', email: '', message: '' });
    }, 4000);
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    sounds.playClick();

    let reply = '';
    if (cmd === 'help') {
      reply = "Commands: 'skills', 'projects', 'bio', 'status', 'clear'";
    } else if (cmd === 'skills') {
      reply = "Core: C++, Python, DSA | AI: PyTorch, OpenCV, YOLOv8 | Web: React, FastAPI, Node";
    } else if (cmd === 'projects') {
      reply = "01: Quantum-Tunneling (PINN) | 02: LabelChecker (Vision) | 03: Telemetry Engine";
    } else if (cmd === 'bio') {
      reply = "Devesh Singh Rathore • CSE Student & ML Builder • Focused on low-latency AI & PDEs.";
    } else if (cmd === 'status') {
      reply = "TensorRT 10.2: ACTIVE • WebGL Conduit: 60 FPS • Unitarity: 99.8%";
    } else if (cmd === 'clear') {
      setTerminalLogs([]);
      setTerminalInput('');
      return;
    } else if (cmd === '') {
      return;
    } else {
      reply = `Command not recognized: '${cmd}'. Type 'help' for options.`;
    }

    setTerminalLogs((prev) => [...prev, `$ ${terminalInput}`, reply]);
    setTerminalInput('');
    setTimeout(() => {
      terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
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

  const currentProject = PROJECTS[displayedCheckpoint - 1] || PROJECTS[0];

  const getNavLinkClass = (section: SectionId) => {
    const isActive = activeSection === section;
    return `px-3 py-1 rounded-full text-xs font-mono-code transition-all cursor-pointer ${
      isActive
        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold shadow-sm shadow-cyan-500/20'
        : 'text-slate-400 hover:text-cyan-300'
    }`;
  };

  return (
    <div className="relative z-10 w-full text-slate-100 pointer-events-auto">
      {/* ========================================================
          TOP NAVIGATION HEADER (With Dynamic ScrollSpy)
      ======================================================== */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 py-3 bg-[#080B14]/90 border-b border-white/[0.08] backdrop-blur-xl">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onScrollTo('hero')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0052F2] to-[#22D3EE] p-[1px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#080B14] rounded-lg flex items-center justify-center text-cyan-300 font-mono-code font-bold text-xs">
              DS
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase tracking-wider font-display font-bold text-slate-200">
                {DEVELOPER_BIO.name}
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-mono-code px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                Builder
              </span>
            </div>
          </div>
        </div>

        {/* ScrollSpy Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-900/70 p-1 rounded-full border border-white/[0.06]">
          <button onClick={() => onScrollTo('hero')} className={getNavLinkClass('hero')}>
            Home
          </button>
          <button onClick={() => onScrollTo('about')} className={getNavLinkClass('about')}>
            About
          </button>
          <button onClick={() => onScrollTo('projects')} className={getNavLinkClass('projects')}>
            Projects
          </button>
          <button onClick={() => onScrollTo('skills')} className={getNavLinkClass('skills')}>
            Skills
          </button>
          <button onClick={() => onScrollTo('contact')} className={getNavLinkClass('contact')}>
            Contact
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
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#0052F2]/15 hover:bg-[#0052F2]/30 border border-[#0052F2]/40 backdrop-blur-md text-xs font-mono-code text-cyan-300 transition-all shadow-md shadow-blue-500/10 hover:border-cyan-400"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>View on GitHub</span>
          </a>
        </div>
      </header>

      {/* ========================================================
          01 // HERO SECTION (Strictly aligned to max-w-6xl)
      ======================================================== */}
      <section id="hero" className="min-h-screen flex items-center px-6 md:px-12 pt-24 pb-16">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono-code text-xs backdrop-blur-md shadow-lg shadow-cyan-500/10">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="text-slate-400">Hi, I'm</span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black font-display text-slate-100 leading-none tracking-tight">
              Devesh Singh <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#22D3EE] to-[#0052F2]">
                Rathore
              </span>
            </h1>

            <div className="inline-block text-xs sm:text-sm font-mono-code font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1 rounded-lg">
              {DEVELOPER_BIO.roleTitle}
            </div>

            <p className="text-sm sm:text-base text-slate-300 font-mono-code leading-relaxed max-w-xl">
              {DEVELOPER_BIO.bio}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onScrollTo('projects')}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0052F2] to-[#8B5CF6] hover:from-[#0040D0] hover:to-[#7C3AED] text-white font-bold font-mono-code text-xs transition-all shadow-xl shadow-blue-500/25 hover:scale-105 cursor-pointer"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onScrollTo('contact')}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-mono-code text-xs transition-all hover:border-cyan-400/50 cursor-pointer"
              >
                <span>Contact Me</span>
              </button>
            </div>

            {/* Quick Metrics from design */}
            <div className="grid grid-cols-3 gap-3 max-w-sm pt-4 border-t border-slate-800/80">
              {DEVELOPER_BIO.statsSummary.map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="block text-xl font-bold font-display text-cyan-300">{item.number}</span>
                  <span className="block text-[10px] font-mono-code uppercase text-slate-400 mt-0.5">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Hero Visual: Floating Glass Code Window + Badge */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            {/* Ambient Backlight Ribbon */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#0052F2]/15 via-[#22D3EE]/15 to-[#8B5CF6]/15 rounded-3xl blur-2xl -z-10" />

            {/* Glass Code Editor Window */}
            <div className="spotlight-card w-full max-w-md p-4 sm:p-5 rounded-2xl border border-cyan-500/30 bg-[#0F172A]/90 backdrop-blur-2xl shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono-code text-slate-400">developer.ts</span>
                  <button
                    onClick={handleCopySnippet}
                    className="flex items-center space-x-1 text-[10px] font-mono-code text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                    title="Copy code"
                  >
                    {copiedSnippet ? <Check className="w-3 h-3 text-cyan-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <pre className="text-xs font-mono-code text-slate-300 leading-relaxed overflow-x-auto">
                <span className="text-[#8B5CF6]">const</span> <span className="text-[#22D3EE]">developer</span> = &#123;{'\n'}
                {'  '}<span className="text-slate-400">name:</span> <span className="text-[#D8FF64]">"Devesh"</span>,{'\n'}
                {'  '}<span className="text-slate-400">role:</span> <span className="text-[#D8FF64]">"CSE Student"</span>,{'\n'}
                {'  '}<span className="text-slate-400">skills:</span> [<span className="text-[#22D3EE]">"C++"</span>, <span className="text-[#22D3EE]">"DSA"</span>, <span className="text-[#22D3EE]">"Web"</span>, <span className="text-[#22D3EE]">"AI"</span>],{'\n'}
                {'  '}<span className="text-slate-400">passion:</span> <span className="text-[#D8FF64]">"Building"</span>,{'\n'}
                &#125;;
              </pre>
            </div>

            {/* Floating Glass Pill Card */}
            <div className="mt-4 self-end sm:mr-4 p-3.5 rounded-xl bg-slate-900/90 border border-[#8B5CF6]/40 backdrop-blur-xl shadow-xl flex items-center space-x-3 text-xs font-mono-code">
              <div className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse" />
              <div>
                <div className="font-bold text-slate-100 flex items-center gap-1">
                  <span>Build • Learn • Grow</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#22D3EE]" />
                </div>
                <div className="text-[10px] text-slate-400">Always shipping code</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-6 right-6 md:right-12 hidden sm:flex items-center space-x-2 text-xs font-mono-code text-slate-400">
          <ChevronDown className="w-4 h-4 text-cyan-400 animate-bounce" />
          <span>Scroll Down</span>
        </div>
      </section>

      {/* Smooth Subtle Gradient Transition */}
      <div className="w-full max-w-6xl mx-auto px-6 md:px-12">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      </div>

      {/* ========================================================
          02 // ABOUT & INTERACTIVE WORKSTATION SECTION
      ======================================================== */}
      <section id="about" className="py-24 px-6 md:px-12">
        <div className="w-full max-w-6xl mx-auto space-y-12">
          <div>
            <span className="text-xs font-mono-code uppercase tracking-widest text-cyan-400 block mb-1">
              01 // ABOUT ME
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-100">
              Passionate Builder. Problem Solver. Lifelong Learner.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Story Details & Pillars */}
            <div className="lg:col-span-6 space-y-4 text-xs sm:text-sm text-slate-300 font-mono-code leading-relaxed">
              <p>
                I am a Computer Science student and software engineer driven by an obsession with how code shapes intelligent, interactive systems. My work bridges the gap between deep mathematical theory (like PDE solvers and computational physics) and production-grade architectures.
              </p>
              <p>
                From architecting real-time computer vision inspection pipelines to crafting interactive 3D WebGL experiences, I thrive when tackling computationally dense challenges where milliseconds and precision matter.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[#22D3EE] font-bold block mb-1">01 / Algorithmic</span>
                  <span className="text-[11px] text-slate-400">Deep expertise in C++, Data Structures, and math.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[#8B5CF6] font-bold block mb-1">02 / Applied AI</span>
                  <span className="text-[11px] text-slate-400">PyTorch, YOLOv8, and custom neural backbones.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[#D8FF64] font-bold block mb-1">03 / Modern Web</span>
                  <span className="text-[11px] text-slate-400">FastAPI, Docker, PostgreSQL, and low latency.</span>
                </div>
              </div>
            </div>

            {/* Interactive Live Terminal Box (destroys generic AI template look!) */}
            <div className="lg:col-span-6">
              <div className="spotlight-card p-4 sm:p-5 rounded-2xl border border-cyan-500/30 bg-[#0F172A]/90 backdrop-blur-xl shadow-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center space-x-2">
                    <TerminalIcon className="w-4 h-4 text-cyan-400" />
                    <span className="text-[11px] font-mono-code text-cyan-300 font-bold uppercase tracking-wider">
                      Interactive Shell Runtime
                    </span>
                  </div>
                  <span className="text-[9px] font-mono-code px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Live
                  </span>
                </div>

                {/* Terminal Console Output */}
                <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800/80 font-mono-code text-[11px] h-44 overflow-y-auto space-y-1.5 text-slate-300">
                  {terminalLogs.map((log, index) => (
                    <div key={index} className={log.startsWith('$') ? 'text-cyan-400 font-bold' : 'text-slate-300'}>
                      {log}
                    </div>
                  ))}
                  <div ref={terminalBottomRef} />
                </div>

                {/* Terminal Command Input */}
                <form onSubmit={handleTerminalSubmit} className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 font-mono-code text-xs font-bold">$</span>
                    <input
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      placeholder="Try typing: skills, projects, bio, status..."
                      className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-400 text-xs font-mono-code text-slate-200 outline-none transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono-code transition-all cursor-pointer flex items-center space-x-1"
                  >
                    <Play className="w-3 h-3 fill-current" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smooth Subtle Gradient Transition */}
      <div className="w-full max-w-6xl mx-auto px-6 md:px-12">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      </div>

      {/* ========================================================
          03 // PROJECTS SECTION (THE 3D FLUID THREAD CONDUIT)
          - Thread is 100% INVISIBLE before this section!
          - Card is locked in max-w-6xl column! Zero jump!
      ======================================================== */}
      <section id="projects" className="relative min-h-[280vh]">
        {/* Section Intro Banner inside max-w-6xl */}
        <div className="pt-20 px-6 md:px-12 max-w-6xl mx-auto">
          <span className="text-xs font-mono-code uppercase tracking-widest text-cyan-400 block mb-1">
            02 // FEATURED PROJECTS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-100">
            Interactive 3D Fluid Scrubbing Pipeline
          </h2>
          <p className="text-xs font-mono-code text-slate-400 mt-1 max-w-lg">
            Scroll down to scrub fluid through the capillary conduit. Projects dock at designated checkpoints with 3D simulation portals on hover.
          </p>
        </div>

        {/* Real-time Telemetry HUD (Fixed top indicator while inside #projects) */}
        {isInsideProjects && (
          <div className="fixed top-20 left-6 md:left-12 z-30 flex items-center space-x-3 text-[11px] font-mono-code bg-[#080B14]/90 px-3.5 py-1.5 rounded-xl border border-cyan-500/30 backdrop-blur-xl shadow-lg">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-slate-400">CONDUIT FLUID:</span>
            <span className="text-cyan-300 font-bold">{(projectsProgress * 100).toFixed(0)}%</span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-400 font-semibold">
              {activeCheckpoint !== null ? `PROJECT 0${activeCheckpoint} DOCKED` : 'CONDUIT IN TRANSIT...'}
            </span>
          </div>
        )}

        {/* Fixed HUD Project Card Container - Aligned strictly with max-w-6xl! */}
        <div className="fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full max-w-6xl px-6 md:px-12 z-30 pointer-events-none">
          <div
            className={`w-full max-w-[420px] transition-all duration-300 ease-out ${
              isCardVisible
                ? 'opacity-100 scale-100 pointer-events-auto translate-y-0'
                : 'opacity-0 scale-95 pointer-events-none translate-y-3'
            }`}
          >
            {/* Visual Pipeline Stage Stepper Bar */}
            <div className="flex items-center space-x-2 text-[10px] font-mono-code mb-2.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 backdrop-blur-xl">
              <span
                className={`px-2 py-0.5 rounded-lg border transition-all ${
                  displayedCheckpoint === 1
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold shadow-sm shadow-cyan-500/30'
                    : 'text-slate-500 border-slate-800'
                }`}
              >
                01 Quantum
              </span>
              <span className="text-slate-600">➔</span>
              <span
                className={`px-2 py-0.5 rounded-lg border transition-all ${
                  displayedCheckpoint === 2
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold shadow-sm shadow-cyan-500/30'
                    : 'text-slate-500 border-slate-800'
                }`}
              >
                02 Vision
              </span>
              <span className="text-slate-600">➔</span>
              <span
                className={`px-2 py-0.5 rounded-lg border transition-all ${
                  displayedCheckpoint === 3
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold shadow-sm shadow-cyan-500/30'
                    : 'text-slate-500 border-slate-800'
                }`}
              >
                03 Telemetry
              </span>
            </div>

            {/* Spotlight Project Card */}
            {currentProject && (
              <div
                onMouseMove={handleCardMouseMove}
                className="spotlight-card w-full p-4 sm:p-5 shadow-2xl border border-cyan-500/30 bg-[#0F172A]/95 backdrop-blur-2xl rounded-2xl space-y-3"
              >
                {/* Header Row */}
                <div className="border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono-code text-cyan-400 font-bold uppercase tracking-wider flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      <span>CHECKPOINT 0{displayedCheckpoint} // {currentProject.category}</span>
                    </span>
                    <span className="text-[9px] font-mono-code px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                      {currentProject.benchmarkBadge}
                    </span>
                  </div>

                  {/* Project Title (Hover summons 3D simulation) */}
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
                      className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-500 hover:text-slate-950 border border-slate-700/60 text-[10px] font-mono-code text-slate-300 transition-all cursor-pointer shrink-0"
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
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[10px] font-mono-code">
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

                {/* Interactive Sparkline Loss/Accuracy Visualizer */}
                <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-between text-[10px] font-mono-code text-slate-400">
                  <span className="flex items-center space-x-1 text-slate-400">
                    <Activity className="w-3 h-3 text-cyan-400" />
                    <span>Convergence Curve:</span>
                  </span>
                  <div className="flex items-end space-x-1 h-4">
                    {currentProject.sparklineData.map((val, idx) => (
                      <div
                        key={idx}
                        style={{ height: `${Math.min(Math.max((val / 100) * 16, 3), 16)}px` }}
                        className="w-1 bg-cyan-400/80 rounded-t-sm"
                      />
                    ))}
                  </div>
                </div>

                {/* Specs Row */}
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

            {/* Quick Dock Navigation Shortcuts */}
            <div className="mt-2.5 flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[10px] font-mono-code text-slate-400 backdrop-blur-md">
              <span className="text-slate-500">Fast Dock:</span>
              <div className="flex items-center space-x-2">
                <button onClick={() => onScrollTo('p1')} className="hover:text-cyan-400 cursor-pointer">P1</button>
                <span className="text-slate-700">•</span>
                <button onClick={() => onScrollTo('p2')} className="hover:text-cyan-400 cursor-pointer">P2</button>
                <span className="text-slate-700">•</span>
                <button onClick={() => onScrollTo('p3')} className="hover:text-cyan-400 cursor-pointer">P3</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smooth Subtle Gradient Transition */}
      <div className="w-full max-w-6xl mx-auto px-6 md:px-12">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      </div>

      {/* ========================================================
          04 // SKILLS SECTION (Strictly aligned to max-w-6xl)
      ======================================================== */}
      <section id="skills" className="py-24 px-6 md:px-12">
        <div className="w-full max-w-6xl mx-auto space-y-12">
          <div>
            <span className="text-xs font-mono-code uppercase tracking-widest text-cyan-400 block mb-1">
              03 // TECHNICAL ARSENAL
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-100">
              Technologies, Frameworks & Core Foundations
            </h2>
            <p className="text-xs font-mono-code text-slate-400 mt-1 max-w-lg">
              Modern, clean, aesthetic stack used to build high-performance systems and intelligent models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DEVELOPER_BIO.skillClusters.map((cluster, cIdx) => (
              <div
                key={cIdx}
                onMouseMove={handleCardMouseMove}
                className="spotlight-card p-5 sm:p-6 rounded-2xl border border-slate-800/80 bg-[#0F172A]/70 backdrop-blur-xl space-y-3.5"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    {cIdx === 0 && <Code2 className="w-4 h-4" />}
                    {cIdx === 1 && <Cpu className="w-4 h-4" />}
                    {cIdx === 2 && <Globe className="w-4 h-4" />}
                    {cIdx === 3 && <Layers className="w-4 h-4" />}
                  </div>
                  <h3 className="text-sm font-bold font-mono-code text-slate-100 uppercase tracking-wider">
                    {cluster.category}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {cluster.skills.map((skill, sIdx) => {
                    const isSelected = selectedSkill === skill;
                    return (
                      <button
                        key={sIdx}
                        onClick={() => {
                          sounds.playClick();
                          setSelectedSkill(isSelected ? null : skill);
                        }}
                        className={`px-3 py-1.5 text-xs font-mono-code rounded-lg border transition-all cursor-pointer flex items-center space-x-1.5 ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#0052F2] to-[#22D3EE] text-slate-950 font-bold border-cyan-300 shadow-md shadow-cyan-500/25'
                            : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            cIdx === 0 ? 'bg-[#0052F2]' : cIdx === 1 ? 'bg-[#22D3EE]' : cIdx === 2 ? 'bg-[#8B5CF6]' : 'bg-[#D8FF64]'
                          }`}
                        />
                        <span>{skill}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Smooth Subtle Gradient Transition */}
      <div className="w-full max-w-6xl mx-auto px-6 md:px-12">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      </div>

      {/* ========================================================
          05 // CONTACT SECTION (Strictly aligned to max-w-6xl)
      ======================================================== */}
      <section id="contact" className="py-24 px-6 md:px-12">
        <div className="w-full max-w-6xl mx-auto space-y-12">
          <div>
            <span className="text-xs font-mono-code uppercase tracking-widest text-cyan-400 block mb-1">
              04 // DIRECT TRANSMISSION
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-100">
              Let's Build Something Exceptional.
            </h2>
            <p className="text-xs font-mono-code text-slate-400 mt-1 max-w-lg">
              Have an exciting opportunity, project collaboration, or question? Send a message directly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Direct Connect Channels */}
            <div className="lg:col-span-6 space-y-4">
              {/* Quick Clone Terminal */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between font-mono-code text-xs">
                <div className="flex items-center space-x-2 text-slate-300 text-xs">
                  <span className="text-cyan-400 font-bold">$</span>
                  <span>git clone https://github.com/deveshsingh0710.git</span>
                </div>
                <button
                  onClick={handleCopyClone}
                  className="ml-2 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[10px] shrink-0 flex items-center space-x-1 cursor-pointer transition-all"
                >
                  {copiedCloneCmd ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCloneCmd ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* GitHub Card */}
              <a
                href={DEVELOPER_BIO.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 transition-all text-xs font-mono-code group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <GithubIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-100">GitHub Repositories</div>
                    <div className="text-[10px] text-slate-400">Explore open-source models & codebase</div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
              </a>

              {/* Direct Email Card */}
              <a
                href={DEVELOPER_BIO.links.email}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 transition-all text-xs font-mono-code group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-100">Direct Email Transmission</div>
                    <div className="text-[10px] text-slate-400">deveshsingh0710@gmail.com</div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
              </a>

              {/* Celebrate Button */}
              <div className="pt-2">
                <button
                  onClick={handleCelebrate}
                  className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-mono-code transition-all cursor-pointer shadow-lg shadow-cyan-500/10 hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
                  <span>Stamp Verification Seal (Celebrate)</span>
                </button>
              </div>
            </div>

            {/* Interactive Transmission Form */}
            <div className="lg:col-span-6">
              <form
                onSubmit={handleContactSubmit}
                className="spotlight-card p-5 sm:p-6 rounded-2xl border border-cyan-500/30 bg-[#0F172A]/90 backdrop-blur-xl shadow-2xl space-y-4"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-mono-code uppercase tracking-wider text-slate-400">Your Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-400 text-xs font-mono-code text-slate-200 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono-code uppercase tracking-wider text-slate-400">Your Email</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="alex@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-400 text-xs font-mono-code text-slate-200 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono-code uppercase tracking-wider text-slate-400">Message / Inquiry</label>
                  <textarea
                    rows={4}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Hi Devesh, let's collaborate on an engineering project..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-400 text-xs font-mono-code text-slate-200 outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0052F2] to-[#8B5CF6] hover:from-[#0040D0] hover:to-[#7C3AED] text-white font-bold font-mono-code text-xs transition-all shadow-xl shadow-blue-500/25 cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{contactSubmitted ? 'Message Sent Successfully!' : 'Send Direct Message'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          FOOTER (Strictly aligned to max-w-6xl)
      ======================================================== */}
      <footer className="py-10 px-6 md:px-12 border-t border-slate-800/80 bg-[#080B14]/95 text-center text-xs font-mono-code text-slate-400 space-y-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-6">
          <button onClick={() => onScrollTo('hero')} className="hover:text-cyan-400 transition-colors cursor-pointer">
            Home
          </button>
          <button onClick={() => onScrollTo('about')} className="hover:text-cyan-400 transition-colors cursor-pointer">
            About
          </button>
          <button onClick={() => onScrollTo('projects')} className="hover:text-cyan-400 transition-colors cursor-pointer">
            Projects
          </button>
          <button onClick={() => onScrollTo('skills')} className="hover:text-cyan-400 transition-colors cursor-pointer">
            Skills
          </button>
          <button onClick={() => onScrollTo('contact')} className="hover:text-cyan-400 transition-colors cursor-pointer">
            Contact
          </button>
          <a
            href={DEVELOPER_BIO.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition-colors"
          >
            GitHub
          </a>
        </div>

        <p className="text-[10px] text-slate-500">
          © 2026 Devesh Singh Rathore • CSE Student | Developer | Builder • Deployed on GitHub Pages
        </p>
      </footer>
    </div>
  );
}
