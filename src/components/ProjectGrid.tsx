import React, { useState } from 'react';
import { motion, type Variants } from 'motion/react';
import { Search, FolderGit2 } from 'lucide-react';
import type { Project, ProjectCategory } from '../types.ts';
import { ProjectCard } from './ProjectCard.tsx';
import { ProjectDetailModal } from './ProjectDetailModal.tsx';
import { api } from '../lib/api.ts';

interface ProjectGridProps {
  projects: Project[];
}

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

const headerVariant: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const projectCardVariant: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export function ProjectGrid({ projects }: ProjectGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const categories: ('All' | ProjectCategory)[] = [
    'All',
    'Development',
    'AI/ML',
    'Blockchain',
    'Automation',
    'Robotics',
    'Cybersecurity'
  ];

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const handleOpenProject = (project: Project) => {
    setActiveProject(project);
    api.trackEvent('project_view', `/project/${project.slug}`, { projectId: project.id, title: project.title });
  };

  return (
    <section id="projects" className="py-20 border-t border-neutral-900 bg-neutral-950">
      <motion.div 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <motion.div variants={headerVariant} className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
                SYSTEMS & CODE
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-100 tracking-tight">
              Featured Engineering Projects
            </h2>
          </div>
          <p className="text-xs font-mono text-neutral-400 max-w-sm">
            End-to-end architectures spanning robotics testbeds, systems security scripts, and typed web applications.
          </p>
        </motion.div>

        {/* Filters & Search Toolbar */}
        <motion.div variants={headerVariant} className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0">
            {categories.map(cat => {
              const count = cat === 'All' 
                ? projects.length 
                : projects.filter(p => p.category === cat).length;

              return (
                <button
                  key={cat}
                  id={`project-cat-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    selectedCategory === cat
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-semibold'
                      : 'bg-neutral-900/60 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                  }`}
                >
                  <span>{cat}</span>
                  <span className="text-[10px] opacity-60">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px] sm:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="project-search-input"
              type="text"
              placeholder="Search by technology or keyword..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        </motion.div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <motion.div key={project.id} variants={projectCardVariant}>
                <ProjectCard
                  project={project}
                  onClick={() => handleOpenProject(project)}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-2xl bg-neutral-900/20 border border-neutral-800/80 text-center">
            <FolderGit2 className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-neutral-300 mb-1">
              No matching projects found
            </h4>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-4">
              Try adjusting your category filter or search query. New projects can also be published via the Admin Dashboard.
            </p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 text-xs text-cyan-400 border border-neutral-800"
            >
              Reset Filters
            </button>
          </div>
        )}
      </motion.div>

      {/* Modal View */}
      <ProjectDetailModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </section>
  );
}
