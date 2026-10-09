import React from 'react';
import { motion, type Variants } from 'motion/react';
import { GraduationCap, Award, Calendar } from 'lucide-react';
import type { Education } from '../types.ts';

interface EducationSectionProps {
  educationList: Education[];
}

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

const eduCardVariant: Variants = {
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

export function EducationSection({ educationList }: EducationSectionProps) {
  return (
    <section id="education" className="py-20 border-t border-neutral-900 bg-neutral-950/60">
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
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
                ACADEMIC FOUNDATION
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-100 tracking-tight">
              Education & Coursework
            </h2>
          </div>
          <p className="text-xs font-mono text-neutral-400 max-w-sm">
            Formal engineering curriculum in Automation & Robotics, systems theory, and computer science.
          </p>
        </motion.div>

        {/* Education Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {educationList.map((edu, idx) => (
            <motion.div
              key={edu.id || idx}
              variants={eduCardVariant}
              id={`edu-card-${edu.id}`}
              className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-700/80 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded text-[11px] font-mono uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                    {edu.branch}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-mono text-neutral-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{edu.startYear} – {edu.endYear}</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-neutral-100 mb-1">
                  {edu.degree}
                </h3>

                <h4 className="text-sm font-semibold text-neutral-300 mb-4">
                  {edu.institution}
                </h4>

                <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                  {edu.description}
                </p>
              </div>

              {edu.achievements && edu.achievements.length > 0 && (
                <div className="pt-4 border-t border-neutral-800/60">
                  <h5 className="text-[11px] font-mono uppercase text-neutral-400 font-semibold mb-2 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Key Milestones & Focus</span>
                  </h5>
                  <ul className="space-y-1.5">
                    {edu.achievements.map((ach, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-neutral-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
