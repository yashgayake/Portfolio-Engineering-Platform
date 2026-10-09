import React from 'react';
import { motion, type Variants } from 'motion/react';

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (custom = 0) => ({
    opacity: 1,
    transition: {
      delayChildren: custom,
      staggerChildren: 0.12,
      when: 'beforeChildren'
    }
  })
};

export const slideUpVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 28 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1] // Apple-grade smooth cubic bezier
    },
    transitionEnd: {
      transform: 'none'
    }
  }
};

export const cardItemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20, 
    scale: 0.98 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1]
    },
    transitionEnd: {
      transform: 'none'
    }
  }
};

export function SectionReveal({ children, className = '', delay = 0, id }: SectionRevealProps) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.08, margin: '0px 0px -40px 0px' }}
      variants={containerVariants}
      custom={delay}
      className={className}
    >
      <motion.div variants={slideUpVariants} className="w-full">
        {children}
      </motion.div>
    </motion.section>
  );
}

export function MotionStaggerContainer({ 
  children, 
  className = '', 
  stagger = 0.08 
}: { 
  children: React.ReactNode; 
  className?: string; 
  stagger?: number;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: stagger
          }
        }
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MotionStaggerItem({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <motion.div variants={cardItemVariants} className={className}>
      {children}
    </motion.div>
  );
}
