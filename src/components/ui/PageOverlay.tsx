import { useState } from 'react';
import { ExternalLink, Terminal, Copy, Check, Sparkles, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GithubIcon } from './Icons';
import { PROJECTS, DEVELOPER_BIO } from '../../data/projectsData';
import { sounds } from '../../utils/audio';

interface PageOverlayProps {
  currentChapter: number;
  onOpenBook: () => void;
  onNavigateChapter: (chapter: number) => void;
}

export function PageOverlay({ currentChapter, onOpenBook, onNavigateChapter }: PageOverlayProps) {
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    sounds.playClick();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleWaxSealPress = () => {
    sounds.playPopUp();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#eab308', '#f59e0b', '#38bdf8', '#10b981']
    });
  };

  // COVER CHAPTER (Chapter 0)
  if (currentChapter === 0) {
    return (
      <div className="fixed inset-0 z-20 flex flex-col items-center justify-center pointer-events-none p-6 text-center">
        <div className="pointer-events-auto max-w-xl mx-auto flex flex-col items-center bg-slate-950/70 p-8 rounded-2xl border border-amber-500/20 backdrop-blur-xl shadow-2xl shadow-black/80">
          <span className="text-xs uppercase tracking-widest font-mono-code text-amber-400 mb-3 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
            Interactive 3D Portfolio
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold font-serif-book text-slate-100 mb-3 tracking-wide">
            THE DEV CODEX
          </h1>
          <p className="text-sm md:text-base text-slate-300 font-serif-book tracking-widest uppercase mb-2 text-amber-200/80">
            VOLUME I — BY DEVESH SINGH
          </p>
          <p className="text-xs md:text-sm text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
            A scrollytelling chronicle of computational physics, computer vision pipelines, and full-stack distributed systems.
          </p>

          <button
            onClick={() => {
              sounds.playPageFlip();
              onOpenBook();
            }}
            className="group flex items-center space-x-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold font-mono-code text-sm shadow-xl shadow-amber-500/20 hover:scale-105 hover:from-amber-400 hover:to-amber-500 transition-all cursor-pointer"
          >
            <span>OPEN CODEX</span>
            <span className="text-xs transition-transform group-hover:translate-x-1">→</span>
          </button>

          <div className="mt-6 flex items-center space-x-4 text-[11px] text-slate-500 font-mono-code">
            <span>Scroll wheel or click bookmark to turn pages</span>
          </div>
        </div>
      </div>
    );
  }

  // CHAPTER 1: DEVELOPER GENESIS
  if (currentChapter === 1) {
    return (
      <div className="fixed inset-y-0 left-0 right-auto z-20 w-full lg:w-[48%] flex items-center pointer-events-none p-4 md:p-12 overflow-y-auto">
        <div className="pointer-events-auto w-full max-w-lg bg-slate-950/85 p-6 md:p-8 rounded-2xl border border-slate-800 backdrop-blur-xl shadow-2xl space-y-5 animate-fadeIn">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono-code text-amber-400 mb-1">
              <span>CHAPTER I</span>
              <span>•</span>
              <span className="uppercase">Genesis & Architecture</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-serif-book text-slate-100">
              {DEVELOPER_BIO.name}
            </h2>
            <p className="text-xs md:text-sm text-amber-200/90 font-mono-code mt-0.5">
              {DEVELOPER_BIO.title}
            </p>
          </div>

          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            {DEVELOPER_BIO.bio}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2">
            {DEVELOPER_BIO.stats.map((stat, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                <span className="block text-[10px] font-mono-code uppercase text-slate-400">
                  {stat.label}
                </span>
                <span className="text-xs font-semibold text-slate-200 mt-0.5 block">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          {/* Core Skills Badges */}
          <div>
            <h4 className="text-[11px] uppercase font-mono-code tracking-wider text-slate-400 mb-2">
              Primary Toolchain
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {DEVELOPER_BIO.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-[11px] font-mono-code rounded bg-slate-800/80 text-slate-300 border border-slate-700/60"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono-code">
              👉 Rotate 3D astrolabe on the right page
            </span>
            <button
              onClick={() => onNavigateChapter(2)}
              className="text-xs font-mono-code text-amber-400 hover:text-amber-300 flex items-center space-x-1 cursor-pointer"
            >
              <span>Next Project</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PROJECT CHAPTERS (Chapters 2, 3, 4)
  const projectIndex = currentChapter - 2;
  const project = PROJECTS[projectIndex];

  if (project) {
    return (
      <div className="fixed inset-y-0 left-0 right-auto z-20 w-full lg:w-[48%] flex items-center pointer-events-none p-4 md:p-12 overflow-y-auto">
        <div className="pointer-events-auto w-full max-w-lg bg-slate-950/85 p-6 md:p-8 rounded-2xl border border-slate-800 backdrop-blur-xl shadow-2xl space-y-4 animate-fadeIn">
          {/* Chapter & Category */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-mono-code text-amber-400">
              <span>CHAPTER {project.chapterNumber}</span>
              <span>•</span>
              <span className="uppercase">{project.category}</span>
            </div>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-xs font-mono-code text-slate-400 hover:text-slate-100 transition-colors"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>Repository</span>
            </a>
          </div>

          {/* Project Title */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-serif-book text-slate-100">
              {project.title}
            </h2>
            <p className="text-xs md:text-sm text-slate-400 font-mono-code mt-0.5">
              {project.subtitle}
            </p>
          </div>

          {/* Description */}
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            {project.description}
          </p>

          {/* Key Metrics / Stats */}
          <div className="grid grid-cols-3 gap-2">
            {project.stats.map((s, idx) => (
              <div key={idx} className="p-2 rounded bg-slate-900/60 border border-slate-800/80 text-center">
                <span className="block text-[9px] font-mono-code uppercase text-slate-400">
                  {s.label}
                </span>
                <span className="text-xs font-bold font-mono-code text-amber-300">
                  {s.value}
                </span>
              </div>
            ))}
          </div>

          {/* Code Terminal Snippet */}
          <div className="rounded-lg bg-slate-900/90 border border-slate-800 overflow-hidden font-mono-code text-[11px]">
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950/70 border-b border-slate-800 text-slate-400">
              <div className="flex items-center space-x-1.5">
                <Terminal className="w-3 h-3 text-amber-400" />
                <span>Architecture Kernel</span>
              </div>
              <button
                onClick={() => handleCopyCode(project.codeSnippet)}
                className="flex items-center space-x-1 hover:text-slate-200 transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span className="text-[10px]">{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 text-slate-300 overflow-x-auto text-[10px] md:text-[11px] leading-relaxed">
              <code>{project.codeSnippet}</code>
            </pre>
          </div>

          {/* Tech Stack Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.techStack.map((tech, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-[10px] font-mono-code rounded bg-amber-500/10 text-amber-300 border border-amber-500/20"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono-code font-semibold text-xs transition-all shadow-md shadow-amber-500/10"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>Explore Code on GitHub</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>

            <button
              onClick={() => onNavigateChapter(currentChapter + 1)}
              className="text-xs font-mono-code text-slate-400 hover:text-amber-400 flex items-center space-x-1 cursor-pointer"
            >
              <span>Next Page</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CHAPTER 5: EPILOGUE & CONTACT
  return (
    <div className="fixed inset-y-0 left-0 right-auto z-20 w-full lg:w-[48%] flex items-center pointer-events-none p-4 md:p-12 overflow-y-auto">
      <div className="pointer-events-auto w-full max-w-lg bg-slate-950/85 p-6 md:p-8 rounded-2xl border border-slate-800 backdrop-blur-xl shadow-2xl space-y-5 animate-fadeIn">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono-code text-amber-400 mb-1">
            <span>CHAPTER V</span>
            <span>•</span>
            <span className="uppercase">Epilogue & Inquiries</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-serif-book text-slate-100">
            Let's Build Together
          </h2>
          <p className="text-xs md:text-sm text-slate-400 font-mono-code mt-0.5">
            Open for Engineering Opportunities & Collaborations
          </p>
        </div>

        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          You've reached the final seal of the Dev Codex. Whether you want to discuss low-latency architecture, computer vision pipelines, or high-performance WebGL web apps, feel free to connect.
        </p>

        {/* Contact Links */}
        <div className="space-y-2.5">
          <a
            href={DEVELOPER_BIO.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 transition-all text-slate-200 text-xs font-mono-code"
          >
            <div className="flex items-center space-x-2.5">
              <GithubIcon className="w-4 h-4 text-amber-400" />
              <span>GitHub Profile</span>
            </div>
            <span className="text-slate-400">@deveshsingh0710 ↗</span>
          </a>

          <a
            href={DEVELOPER_BIO.links.email}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 transition-all text-slate-200 text-xs font-mono-code"
          >
            <div className="flex items-center space-x-2.5">
              <Send className="w-4 h-4 text-emerald-400" />
              <span>Send Direct Message</span>
            </div>
            <span className="text-slate-400">Email Inquiry ↗</span>
          </a>
        </div>

        {/* Interactive Wax Seal */}
        <div className="pt-2 flex flex-col items-center">
          <button
            onClick={handleWaxSealPress}
            className="group relative flex items-center space-x-2 px-5 py-2.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-mono-code transition-all cursor-pointer shadow-lg shadow-amber-500/5 hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Stamp Codex Wax Seal (Celebrate)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
