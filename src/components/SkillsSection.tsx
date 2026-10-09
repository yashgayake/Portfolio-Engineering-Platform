import React, { useState } from 'react';
import { motion, type Variants } from 'motion/react';
import { 
  Code, 
  Layers, 
  Wrench, 
  Server, 
  Bot, 
  ShieldCheck 
} from 'lucide-react';
import type { Skill, SkillCategory } from '../types.ts';

interface SkillsSectionProps {
  skills: Skill[];
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

const cardVariant: Variants = {
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

export function SkillsSection({ skills }: SkillsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories: { name: SkillCategory; icon: React.ElementType; description: string }[] = [
    { name: 'Programming', icon: Code, description: 'Core languages for algorithm implementation and systems logic' },
    { name: 'Development', icon: Layers, description: 'Modern web architectures, responsive interfaces, and API endpoints' },
    { name: 'Tools', icon: Wrench, description: 'Version control, developer tooling, and containerization' },
    { name: 'Systems', icon: Server, description: 'Operating system baselines, networking, and environment management' },
    { name: 'Automation & Robotics', icon: Bot, description: 'Microcontrollers, sensor telemetry, and robotics mechanisms' },
    { name: 'Cybersecurity', icon: ShieldCheck, description: 'Security fundamentals, Linux hardening, and network posture' }
  ];

  const filteredCategories = activeCategory === 'All'
    ? categories
    : categories.filter(c => c.name === activeCategory);

  return (
    <section id="skills" className="py-20 border-t border-neutral-900 bg-neutral-950/70">
      <motion.div 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <motion.div variants={headerVariant} className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
                TECHNICAL CAPABILITIES
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-100 tracking-tight">
              Categorized Skills
            </h2>
          </div>
          <p className="text-xs font-mono text-neutral-400 max-w-sm">
            Demonstrated engineering competencies across software engineering, automation hardware, and systems security.
          </p>
        </motion.div>

        {/* Filter Pills */}
        <motion.div variants={headerVariant} className="flex flex-wrap items-center gap-2 mb-8">
          <button
            id="skill-filter-all"
            onClick={() => setActiveCategory('All')}
            className={`px-3.5 py-1.5 text-xs font-mono rounded-lg transition-colors ${
              activeCategory === 'All'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-semibold'
                : 'bg-neutral-900/60 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
            }`}
          >
            All Disciplines
          </button>
          {categories.map(c => (
            <button
              key={c.name}
              id={`skill-filter-${c.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              onClick={() => setActiveCategory(c.name)}
              className={`px-3.5 py-1.5 text-xs font-mono rounded-lg transition-colors ${
                activeCategory === c.name
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-semibold'
                  : 'bg-neutral-900/60 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              {c.name}
            </button>
          ))}
        </motion.div>

        {/* Skills Grid by Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map(cat => {
            const CatIcon = cat.icon;
            const categorySkills = skills.filter(s => s.category === cat.name);

            return (
              <motion.div
                key={cat.name}
                variants={cardVariant}
                id={`skill-category-${cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                className="p-6 rounded-2xl bg-neutral-900/30 border border-neutral-800/80 hover:border-neutral-700/80 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-cyan-400">
                      <CatIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-100">
                        {cat.name}
                      </h3>
                      <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                        {categorySkills.length} SKILLS
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 mb-5 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {/* Skill Chips (Strictly NO fake percentages) */}
                <div className="flex flex-wrap gap-2 pt-3 border-t border-neutral-800/60">
                  {categorySkills.map(skill => (
                    <span
                      key={skill.id}
                      id={`skill-tag-${skill.id}`}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
                    >
                      {skill.name}
                    </span>
                  ))}
                  {categorySkills.length === 0 && (
                    <span className="text-xs text-neutral-500 italic">No skills listed in this category</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
