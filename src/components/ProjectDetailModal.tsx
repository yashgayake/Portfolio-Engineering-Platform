import React from 'react';
import { 
  X, 
  Github, 
  ExternalLink, 
  Tag, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  Lightbulb, 
  Layers
} from 'lucide-react';
import type { Project } from '../types.ts';
import { api } from '../lib/api.ts';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-neutral-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {project.category}
            </span>
            {project.featured && (
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium uppercase bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Featured
              </span>
            )}
          </div>

          <button
            id="modal-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
          {/* Title & Short Desc */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-100 mb-3 tracking-tight">
              {project.title}
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              {project.shortDescription}
            </p>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {project.githubUrl && (
              <a
                id="modal-github-link"
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => api.trackEvent('github_click', project.githubUrl, { projectId: project.id })}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors"
              >
                <Github className="w-4 h-4 text-cyan-400" />
                <span>View Source Code</span>
              </a>
            )}

            {project.liveDemoUrl && (
              <a
                id="modal-live-demo-link"
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => api.trackEvent('project_view', project.liveDemoUrl, { projectId: project.id })}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 transition-colors shadow-sm"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Live Demo</span>
              </a>
            )}
          </div>

          {/* Hero Image or Technical Placeholder */}
          {project.heroImage ? (
            <div className="rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 aspect-video w-full">
              <img
                src={project.heroImage}
                alt={project.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="rounded-xl p-8 border border-neutral-800 bg-neutral-950/60 flex flex-col items-center justify-center text-center">
              <Cpu className="w-10 h-10 text-cyan-400/80 mb-3" />
              <span className="text-xs font-mono text-neutral-400">
                SYSTEM ARCHITECTURE PREVIEW
              </span>
              <span className="text-xs text-neutral-500 mt-1">
                Screenshots & schematics can be uploaded through Admin
              </span>
            </div>
          )}

          {/* Problem & Solution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-neutral-950/40 border border-neutral-800/80">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-semibold uppercase mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Problem Statement</span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {project.problem || 'Defined technical bottleneck or engineering challenge targeted by this system.'}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-neutral-950/40 border border-neutral-800/80">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold uppercase mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Engineered Solution</span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {project.solution || 'Implementation design, software architecture, and algorithm strategy employed.'}
              </p>
            </div>
          </div>

          {/* System Architecture */}
          {project.architecture && (
            <div className="p-5 rounded-xl bg-neutral-950/50 border border-neutral-800/80">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold uppercase mb-2">
                <Layers className="w-4 h-4" />
                <span>System Architecture</span>
              </div>
              <p className="text-xs sm:text-sm font-mono text-neutral-200 bg-neutral-900 p-3 rounded-lg border border-neutral-800 leading-relaxed">
                {project.architecture}
              </p>
            </div>
          )}

          {/* Key Features */}
          {project.features && project.features.length > 0 && (
            <div>
              <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-3">
                Key Features & Capabilities
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {project.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300 bg-neutral-950/40 p-3 rounded-lg border border-neutral-800/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technologies Used */}
          <div>
            <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-cyan-400" />
              <span>Technology Stack</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-xs font-mono font-medium bg-neutral-950 border border-neutral-800 text-neutral-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Challenges & What I Learned */}
          {(project.challenges || project.whatILearned) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {project.challenges && (
                <div className="p-5 rounded-xl bg-neutral-950/40 border border-neutral-800">
                  <h5 className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
                    Key Challenges
                  </h5>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {project.challenges}
                  </p>
                </div>
              )}

              {project.whatILearned && (
                <div className="p-5 rounded-xl bg-neutral-950/40 border border-neutral-800">
                  <div className="flex items-center gap-1.5 text-amber-300 text-xs font-mono font-semibold uppercase mb-2">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>What I Learned</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {project.whatILearned}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-neutral-950 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
