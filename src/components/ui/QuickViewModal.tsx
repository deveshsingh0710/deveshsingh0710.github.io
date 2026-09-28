import { X, CheckCircle2 } from 'lucide-react';
import { GithubIcon } from './Icons';
import { PROJECTS, DEVELOPER_BIO } from '../../data/projectsData';
import { sounds } from '../../utils/audio';

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToProject: (chapter: number) => void;
}

export function QuickViewModal({ isOpen, onClose, onJumpToProject }: QuickViewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div>
            <h3 className="text-lg font-bold font-serif-book text-slate-100">
              Executive Developer Summary — {DEVELOPER_BIO.name}
            </h3>
            <p className="text-xs font-mono-code text-amber-400">
              {DEVELOPER_BIO.title} • Fast Recruiter Overview
            </p>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Bio & Skills */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <h4 className="text-xs uppercase font-mono-code text-slate-400 mb-2">
              Engineering Focus
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed mb-4">
              {DEVELOPER_BIO.bio}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {DEVELOPER_BIO.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs font-mono-code rounded-md bg-slate-800 text-slate-300 border border-slate-700/60"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Project List */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-mono-code text-slate-400">
              Key Architectural Projects
            </h4>

            {PROJECTS.map((proj, idx) => (
              <div
                key={proj.id}
                className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono-code uppercase text-amber-400">
                      Chapter {proj.chapterNumber} • {proj.category}
                    </span>
                    <h5 className="text-lg font-bold text-slate-100 font-serif-book">
                      {proj.title}
                    </h5>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        sounds.playPageFlip();
                        onJumpToProject(idx + 2);
                      }}
                      className="px-3 py-1.5 text-xs font-mono-code rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 cursor-pointer"
                    >
                      View in 3D Book ↗
                    </button>
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 px-3 py-1.5 text-xs font-mono-code rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </a>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  {proj.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-400">
                  {proj.keyFeatures.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {proj.techStack.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 text-[10px] font-mono-code rounded bg-slate-800/80 text-amber-300/90"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/80">
          <span className="text-xs font-mono-code text-slate-400">
            GitHub: <a href="https://github.com/deveshsingh0710" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">github.com/deveshsingh0710</a>
          </span>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono-code text-xs font-semibold cursor-pointer"
          >
            Back to 3D Codex
          </button>
        </div>
      </div>
    </div>
  );
}
