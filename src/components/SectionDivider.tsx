import React from 'react';
import { motion, type Variants } from 'motion/react';

interface SectionDividerProps {
  className?: string;
  accent?: 'cyan' | 'neutral';
}

const lineLeftVariants: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const lineRightVariants: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const centerNodeVariants: Variants = {
  hidden: { scale: 0, opacity: 0, rotate: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    rotate: 45,
    transition: {
      duration: 0.5,
      delay: 0.25,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export function SectionDivider({ className = '', accent = 'cyan' }: SectionDividerProps) {
  return (
    <div
      role="separator"
      aria-hidden="true"
      className={`relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pointer-events-none select-none overflow-hidden ${className}`}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5, margin: '0px 0px -40px 0px' }}
        className="relative flex items-center justify-center"
      >
        {/* Left hairline extending outwards from center */}
        <div className="relative flex-1 flex items-center justify-end overflow-hidden h-4">
          <motion.div
            variants={lineLeftVariants}
            className="w-full h-[1px] origin-right bg-gradient-to-r from-transparent via-neutral-800 to-cyan-500/30"
          />
          {/* Micro tick */}
          <span className="hidden sm:inline-block absolute left-4 text-[9px] font-mono text-neutral-700/60 select-none">
            +
          </span>
        </div>

        {/* Center technological node */}
        <div className="relative mx-3 flex items-center justify-center">
          {/* Subtle accent glow halo */}
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className={`absolute w-7 h-7 rounded-full blur-md ${
              accent === 'cyan' ? 'bg-cyan-500/15' : 'bg-neutral-600/20'
            }`}
          />

          {/* Micro circuit diamond */}
          <motion.div
            variants={centerNodeVariants}
            className={`relative w-1.5 h-1.5 rounded-[1px] ${
              accent === 'cyan'
                ? 'bg-cyan-400 border border-cyan-300/80 shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                : 'bg-neutral-400 border border-neutral-300 shadow-[0_0_6px_rgba(255,255,255,0.2)]'
            }`}
          />
        </div>

        {/* Right hairline extending outwards from center */}
        <div className="relative flex-1 flex items-center justify-start overflow-hidden h-4">
          <motion.div
            variants={lineRightVariants}
            className="w-full h-[1px] origin-left bg-gradient-to-l from-transparent via-neutral-800 to-cyan-500/30"
          />
          {/* Micro tick */}
          <span className="hidden sm:inline-block absolute right-4 text-[9px] font-mono text-neutral-700/60 select-none">
            +
          </span>
        </div>
      </motion.div>
    </div>
  );
}
