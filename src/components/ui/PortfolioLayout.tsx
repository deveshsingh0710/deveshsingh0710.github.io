import { useState, useEffect } from 'react';
import {
  Volume2, VolumeX, Sparkles, Send, ArrowUpRight, Cpu, Copy, Check,
  ChevronDown, Code2, Globe, Layers, ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GithubIcon } from './Icons';
import { PROJECTS, DEVELOPER_BIO } from '../../data/projectsData';
import { sounds } from '../../utils/audio';
import { getActiveCheckpoint } from '../../utils/fluidSync';

interface PortfolioLayoutProps {
  scrollProgress: number;
  projectsProgress: number;
  isInsideProjects: boolean;
  onScrollTo: (id: string) => void;
  onHoverProject: (project: 'quantum' | 'vision' | 'healthcare' | null) => void;
}

export function PortfolioLayout({
  projectsProgress,
  isInsideProjects,
  onScrollTo,
  onHoverProject
}: PortfolioLayoutProps) {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [copiedCloneCmd, setCopiedCloneCmd] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

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

  return (
    <div className="relative z-10 w-full text-slate-100 pointer-events-auto">
      {/* ========================================================
          TOP NAVIGATION HEADER
      ======================================================== */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-14 py-3.5 bg-[#080B14]/80 border-b border-white/10 backdrop-blur-xl">
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

        {/* Navigation Links: Home, About, Projects, Skills, Contact */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-mono-code text-slate-400">
          <button onClick={() => onScrollTo('hero')} className="hover:text-cyan-400 transition-colors cursor-pointer">
            Home
          </button>
          <button onClick={() => onScrollTo('about')} className="hover:text-cyan-400 transition-colors cursor-pointer">
            About
          </button>
          <button onClick={() => onScrollTo('projects')} className="hover:text-cyan-400 transition-colors cursor-pointer text-cyan-400 font-semibold">
            Projects
          </button>
          <button onClick={() => onScrollTo('skills')} className="hover:text-cyan-400 transition-colors cursor-pointer">
            Skills
          </button>
          <button onClick={() => onScrollTo('contact')} className="hover:text-cyan-400 transition-colors cursor-pointer">
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
          01 // HERO SECTION (Matches Design System image)
      ======================================================== */}
      <section id="hero" className="min-h-screen flex items-center px-6 md:px-14 pt-24 pb-16">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
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

            {/* Action Buttons matching design */}
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
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#0052F2]/20 via-[#22D3EE]/20 to-[#8B5CF6]/20 rounded-3xl blur-2xl -z-10" />

            {/* Glass Code Editor Window */}
            <div className="spotlight-card w-full max-w-md p-4 sm:p-5 rounded-2xl border border-cyan-500/30 bg-[#0F172A]/90 backdrop-blur-2xl shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[10px] font-mono-code text-slate-400">developer.ts</span>
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
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
        <div className="absolute bottom-6 right-6 md:right-14 hidden sm:flex items-center space-x-2 text-xs font-mono-code text-slate-400">
          <ChevronDown className="w-4 h-4 text-cyan-400 animate-bounce" />
          <span>Scroll Down</span>
        </div>
      </section>

      {/* ========================================================
          02 // ABOUT SECTION
      ======================================================== */}
      <section id="about" className="py-24 px-6 md:px-14 border-t border-slate-800/80 bg-[#080B14]/60">
        <div className="w-full max-w-6xl mx-auto space-y-12">
          <div>
            <span className="text-xs font-mono-code uppercase tracking-widest text-cyan-400 block mb-1">
              01 // ABOUT ME
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-100">
              Passionate Builder. Problem Solver. Lifelong Learner.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Story Details */}
            <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-slate-300 font-mono-code leading-relaxed">
              <p>
                I am a Computer Science student and software engineer driven by an obsession with how code shapes intelligent, interactive systems. My work bridges the gap between deep mathematical theory (like PDE solvers and computational physics) and production-grade architectures.
              </p>
              <p>
                From architecting real-time computer vision inspection pipelines to crafting interactive 3D WebGL experiences, I thrive when tackling computationally dense challenges where milliseconds and precision matter.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[#22D3EE] font-bold block mb-1">01 / Algorithmic Core</span>
                  <span className="text-[11px] text-slate-400">Deep expertise in C++, Data Structures, and computational math.</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[#8B5CF6] font-bold block mb-1">02 / Applied AI</span>
                  <span className="text-[11px] text-slate-400">PyTorch, YOLOv8, and custom neural feature backbones.</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[#D8FF64] font-bold block mb-1">03 / Modern Systems</span>
                  <span className="text-[11px] text-slate-400">FastAPI, Docker, PostgreSQL, and low-latency microservices.</span>
                </div>
              </div>
            </div>

            {/* Code Showcase Card (from image design) */}
            <div className="lg:col-span-5">
              <div className="spotlight-card p-4 sm:p-5 rounded-2xl border border-cyan-500/30 bg-[#0F172A]/90 backdrop-blur-xl shadow-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[10px] font-mono-code text-cyan-400 uppercase tracking-wider">
                    // Code Showcase
                  </span>
                  <button
                    onClick={handleCopySnippet}
                    className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[10px] font-mono-code text-slate-300 border border-slate-700 cursor-pointer transition-all"
                  >
                    {copiedSnippet ? <Check className="w-3 h-3 text-cyan-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSnippet ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <pre className="text-xs font-mono-code text-slate-300 leading-relaxed overflow-x-auto">
                  <span className="text-[#8B5CF6]">const</span> <span className="text-[#22D3EE]">createAmazingThings</span> = () =&gt; &#123;{'\n'}
                  {'  '}<span className="text-[#8B5CF6]">return</span> &#123;{'\n'}
                  {'    '}<span className="text-slate-400">developer:</span> <span className="text-[#D8FF64]">"Devesh Singh Rathore"</span>,{'\n'}
                  {'    '}<span className="text-slate-400">focus:</span> [<span className="text-[#22D3EE]">"DSA"</span>, <span className="text-[#22D3EE]">"AI & ML"</span>, <span className="text-[#22D3EE]">"Web"</span>],{'\n'}
                  {'    '}<span className="text-slate-400">passion:</span> <span className="text-[#D8FF64]">"coding"</span>,{'\n'}
                  {'    '}<span className="text-slate-400">goal:</span> <span className="text-[#D8FF64]">"impact"</span>,{'\n'}
                  {'  '}&#125;;{'\n'}
                  &#125;;
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          03 // PROJECTS SECTION (THE 3D FLUID THREAD CONDUIT)
          - Exactly what user loved: 3 projects docking on the thread!
      ======================================================== */}
      <section id="projects" className="relative min-h-[280vh] border-t border-slate-800/80">
        {/* Real-time Telemetry HUD (Fixed top indicator while inside #projects) */}
        {isInsideProjects && (
          <div className="fixed top-20 left-6 md:left-14 z-30 flex items-center space-x-3 text-[11px] font-mono-code bg-slate-950/85 px-3.5 py-1.5 rounded-xl border border-cyan-500/30 backdrop-blur-xl shadow-lg">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-slate-400">FLUID CONDUIT:</span>
            <span className="text-cyan-300 font-bold">{(projectsProgress * 100).toFixed(0)}%</span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-400 font-semibold">
              {activeCheckpoint !== null ? `PROJECT 0${activeCheckpoint} DOCKED` : 'CONDUIT IN TRANSIT...'}
            </span>
          </div>
        )}

        {/* Section Intro Banner */}
        <div className="pt-20 px-6 md:px-14 max-w-6xl mx-auto">
          <span className="text-xs font-mono-code uppercase tracking-widest text-cyan-400 block mb-1">
            02 // FEATURED PROJECTS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-100">
            Interactive 3D Fluid Scrubbing Pipeline
          </h2>
          <p className="text-xs font-mono-code text-slate-400 mt-1 max-w-lg">
            Scroll down to scrub the fluid conduit. Projects dock at designated checkpoints with 3D simulation portals on hover.
          </p>
        </div>

        {/* ========================================================
            FIXED FLOATING HUD PROJECT CARD
            - Locked on left-6 md:left-14
            - Compact width max-w-[380px]
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
          04 // SKILLS SECTION (Matches Color Palette & Tags in image)
      ======================================================== */}
      <section id="skills" className="py-24 px-6 md:px-14 border-t border-slate-800/80 bg-[#080B14]">
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
                className="spotlight-card p-5 rounded-2xl border border-slate-800/80 bg-[#0F172A]/70 backdrop-blur-xl space-y-3"
              >
                <div className="flex items-center space-x-2">
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
                        className={`px-3 py-1.5 text-xs font-mono-code rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#0052F2] to-[#22D3EE] text-slate-950 font-bold border-cyan-300 shadow-md shadow-cyan-500/25'
                            : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300'
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
          05 // CONTACT SECTION (Form + Quick Connect Channels)
      ======================================================== */}
      <section id="contact" className="py-24 px-6 md:px-14 border-t border-slate-800/80 bg-[#080B14]/80">
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
            {/* Direct Connect Options */}
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
                    placeholder="Hi Devesh, let's collaborate on an AI/engineering project..."
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
          FOOTER
      ======================================================== */}
      <footer className="py-10 px-6 md:px-14 border-t border-slate-800/80 bg-[#080B14]/95 text-center text-xs font-mono-code text-slate-400 space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-6">
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
