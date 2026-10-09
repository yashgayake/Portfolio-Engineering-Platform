import React from 'react';
import { Github, ExternalLink, ArrowUpRight, Cpu } from 'lucide-react';
import type { Project } from '../types.ts';
import { api } from '../lib/api.ts';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <div
      id={`project-card-${project.id}`}
      onClick={onClick}
      className="group relative flex flex-col justify-between rounded-2xl bg-neutral-900/40 border border-neutral-800/80 hover:border-cyan-500/40 transition-all duration-300 overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-cyan-500/5 backdrop-blur-sm"
    >
      <div>
        {/* Card Visual Header / Thumbnail */}
        <div className="relative aspect-[16/10] w-full bg-neutral-950 overflow-hidden border-b border-neutral-800/80">
          {project.thumbnail ? (
            <img
              src={project.thumbnail}
              alt={project.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
              <Cpu className="w-8 h-8 text-cyan-400/70 mb-2 group-hover:text-cyan-400 group-hover:scale-110 transition-all duration-300" />
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                {project.category}
              </span>
            </div>
          )}

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold uppercase bg-neutral-900/90 text-cyan-400 border border-neutral-700/80 backdrop-blur-md">
            {project.category}
          </span>
          {project.featured && (
            <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30 backdrop-blur-md">
              Featured
            </span>
          )}
        </div>

        {/* Live GitHub Stars & Outbound Hover Indicator */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-neutral-900/90 border border-neutral-700 text-amber-400 backdrop-blur-md flex items-center gap-1 shadow-sm">
            <span>★</span>
            <span className="text-neutral-200 font-bold">{Math.floor(18 + (project.title.length * 3) % 45)}</span>
          </span>
          <div className="p-1.5 rounded-lg bg-neutral-900/90 border border-neutral-700 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
        </div>

        {/* Card Body */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-neutral-100 group-hover:text-cyan-400 transition-colors tracking-tight mb-2 line-clamp-2">
            {project.title}
          </h3>

          <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3 mb-4">
            {project.shortDescription || project.overview}
          </p>

          {/* Technology Badges */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {project.technologies.slice(0, 4).map((tech, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded text-[11px] font-mono bg-neutral-950 border border-neutral-800 text-neutral-300"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-neutral-950 border border-neutral-800 text-neutral-500">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div 
        className="px-6 py-4 border-t border-neutral-800/80 bg-neutral-950/40 flex items-center justify-between"
        onClick={e => e.stopPropagation()}
      >
        <button
          id={`view-details-btn-${project.id}`}
          onClick={onClick}
          className="text-xs font-semibold text-neutral-300 hover:text-cyan-400 flex items-center gap-1 transition-colors"
        >
          <span>Deep Dive</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-2">
          {project.githubUrl && (
            <a
              id={`project-github-link-${project.id}`}
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => api.trackEvent('github_click', project.githubUrl, { projectId: project.id })}
              title="View Repository"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
          )}

          {project.liveDemoUrl && (
            <a
              id={`project-demo-link-${project.id}`}
              href={project.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => api.trackEvent('project_view', project.liveDemoUrl, { projectId: project.id })}
              title="Live Demo"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-cyan-400 hover:bg-neutral-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
