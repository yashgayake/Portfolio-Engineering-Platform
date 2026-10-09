import React from 'react';
import { motion, type Variants } from 'motion/react';
import { Trophy, Calendar, FileCheck } from 'lucide-react';
import type { Achievement } from '../types.ts';

interface AchievementsSectionProps {
  achievements: Achievement[];
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

const achCardVariant: Variants = {
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

export function AchievementsSection({ achievements }: AchievementsSectionProps) {
  if (!achievements || achievements.length === 0) return null;

  return (
    <section id="achievements" className="py-16 border-t border-neutral-900 bg-neutral-950/40">
      <motion.div 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div variants={headerVariant}>
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
              HONORS & MILESTONES
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-100 tracking-tight mb-8">
            Recognitions & Milestones
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((ach, idx) => (
            <motion.div
              key={ach.id || idx}
              variants={achCardVariant}
              id={`ach-card-${ach.id}`}
              className="p-5 rounded-xl bg-neutral-900/30 border border-neutral-800/80 hover:border-neutral-700/80 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-neutral-400">{ach.organization}</span>
                  <span className="flex items-center gap-1 text-[11px] font-mono text-neutral-500">
                    <Calendar className="w-3 h-3" />
                    <span>{ach.date}</span>
                  </span>
                </div>
                <h3 className="text-sm font-bold text-neutral-100 mb-2">{ach.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">{ach.description}</p>
              </div>

              {ach.evidenceUrl && (
                <div className="pt-3 mt-4 border-t border-neutral-800/60 flex justify-end">
                  <a
                    href={ach.evidenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-mono"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>View Evidence</span>
                  </a>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
