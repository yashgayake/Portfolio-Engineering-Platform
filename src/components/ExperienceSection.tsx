import React, { useState } from 'react';
import { motion, type Variants } from 'motion/react';
import { Briefcase, Calendar, ExternalLink, FileCheck, Layers } from 'lucide-react';
import type { Experience, ExperienceCategory } from '../types.ts';

interface ExperienceSectionProps {
  experienceList: Experience[];
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

const itemVariant: Variants = {
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

export function ExperienceSection({ experienceList }: ExperienceSectionProps) {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const categories: ('All' | ExperienceCategory)[] = [
    'All',
    'Internship',
    'Competition',
    'Project/Activity',
    'Other'
  ];

  const filtered = activeFilter === 'All'
    ? experienceList
    : experienceList.filter(e => e.category === activeFilter);

  return (
    <section id="experience" className="py-20 border-t border-neutral-900 bg-neutral-950">
      <motion.div 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <motion.div variants={headerVariant} className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
                EXPERIENCE & ACTIVITIES
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-100 tracking-tight">
              Engineering Experience
            </h2>
          </div>
          <p className="text-xs font-mono text-neutral-400 max-w-sm">
            Internships, robotics competitions, engineering project teams, and technical activities.
          </p>
        </motion.div>

        {/* Filter Pills */}
        <motion.div variants={headerVariant} className="flex flex-wrap items-center gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              id={`exp-filter-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              onClick={() => setActiveFilter(cat)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors ${
                activeFilter === cat
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-semibold'
                  : 'bg-neutral-900/60 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Timeline List */}
        <div className="space-y-6">
          {filtered.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              variants={itemVariant}
              id={`exp-item-${item.id}`}
              className="p-6 rounded-2xl bg-neutral-900/30 border border-neutral-800/80 hover:border-neutral-700/80 transition-all flex flex-col md:flex-row md:items-start justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase bg-neutral-900 text-cyan-400 border border-neutral-800 font-semibold">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-bold text-neutral-100">
                    {item.position}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-neutral-400">
                  <span className="text-cyan-400/90 font-semibold">{item.organization}</span>
                  <span className="flex items-center gap-1 font-mono text-neutral-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.startDate} — {item.current ? 'Present' : item.endDate}</span>
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-3xl">
                  {item.description}
                </p>

                {item.technologies && item.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {item.technologies.map((t, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-950 border border-neutral-800 text-neutral-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions: link or document */}
              <div className="flex md:flex-col items-center md:items-end gap-2 shrink-0">
                {item.organizationUrl && (
                  <a
                    href={item.organizationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-900 text-neutral-300 hover:text-cyan-400 text-xs font-mono border border-neutral-800 transition-colors"
                  >
                    <span>Organization</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                {item.documentUrl && (
                  <a
                    href={item.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-900 text-neutral-300 hover:text-cyan-400 text-xs font-mono border border-neutral-800 transition-colors"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Evidence / Doc</span>
                  </a>
                )}
              </div>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="p-8 rounded-xl bg-neutral-900/20 border border-neutral-800 text-center text-xs text-neutral-500">
              No entries recorded in this category yet. You can add entries via the Admin Dashboard.
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
