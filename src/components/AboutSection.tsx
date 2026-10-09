import React from 'react';
import { motion, type Variants } from 'motion/react';
import { User, GraduationCap, Compass, BookOpen, Layers, Terminal, Sparkles } from 'lucide-react';
import type { SiteSettings, Education } from '../types.ts';
import { Yash3DAvatar } from './Yash3DAvatar.tsx';

interface AboutSectionProps {
  settings: SiteSettings;
  educationList: Education[];
  onContactClick: () => void;
}

const sectionContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

const slideUpItemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export function AboutSection({ settings, educationList, onContactClick }: AboutSectionProps) {
  const primaryEdu = educationList[0] || {
    institution: "Automation & Robotics Department",
    degree: "B.Tech / B.E. in Automation & Robotics",
    branch: "Undergraduate Program",
    startYear: "2023",
    endYear: "2027",
    description: "Coursework across Control Systems, Embedded C++, Kinematics, Robotics Operating System (ROS), and Computing.",
    achievements: []
  };

  const technicalInterests = settings.technicalInterests || [
    "Software Development",
    "Automation & Robotics",
    "Cybersecurity",
    "DevOps",
    "AI/ML",
    "Blockchain"
  ];

  return (
    <section id="about" className="py-20 border-t border-neutral-900 bg-neutral-950">
      <motion.div 
        variants={sectionContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Section Header */}
        <motion.div variants={slideUpItemVariants} className="flex flex-col mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
              ENGINEERING IDENTITY
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-100 tracking-tight">
            About Yash Gayake
          </h2>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Col: Profile visual & quick facts (4 cols) */}
          <motion.div variants={slideUpItemVariants} className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 backdrop-blur-sm">
              {/* Profile Image / 3D Avatar Model */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 mb-6 flex flex-col items-center justify-center group shadow-inner">
                {settings.profileImage ? (
                  <img
                    src={settings.profileImage}
                    alt={settings.name || 'Yash Gayake'}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
                    <Yash3DAvatar
                      className="w-full h-full"
                      height="100%"
                      autoRotate={true}
                      interactive={true}
                      showControls={false}
                      enableSpeech={false}
                    />
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <span className="text-[9px] font-mono text-cyan-400 bg-neutral-950/80 px-2 py-0.5 rounded-full border border-cyan-500/30 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>3D MODEL</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Identity Tags */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-2 border-b border-neutral-800/60">
                  <span className="text-neutral-400">Primary Track</span>
                  <span className="font-mono text-neutral-200 font-medium">Automation & Robotics</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-neutral-800/60">
                  <span className="text-neutral-400">Engineering Role</span>
                  <span className="font-mono text-cyan-400 font-medium">Developer</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-neutral-800/60">
                  <span className="text-neutral-400">Location</span>
                  <span className="font-mono text-neutral-200">{settings.location || 'India'}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-neutral-400">Contact Email</span>
                  <span className="font-mono text-neutral-200 truncate max-w-[150px]">{settings.email}</span>
                </div>
              </div>
            </div>

            {/* Quick Education Card */}
            <div className="p-5 rounded-2xl bg-neutral-900/30 border border-neutral-800/70">
              <div className="flex items-center gap-2 mb-3 text-cyan-400">
                <GraduationCap className="w-4 h-4" />
                <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300">
                  Education Background
                </h4>
              </div>
              <h5 className="text-sm font-semibold text-neutral-100">{primaryEdu.degree}</h5>
              <p className="text-xs text-cyan-400/90 font-medium mt-0.5">{primaryEdu.institution}</p>
              <div className="flex items-center gap-2 mt-2 text-[11px] font-mono text-neutral-400">
                <span>{primaryEdu.branch}</span>
                <span>•</span>
                <span>{primaryEdu.startYear} – {primaryEdu.endYear}</span>
              </div>
            </div>
          </motion.div>

          {/* Right Col: Deep Story, Technical Direction, Learning Areas (8 cols) */}
          <motion.div variants={slideUpItemVariants} className="lg:col-span-8 space-y-8">
            {/* Core Narrative */}
            <div className="p-7 rounded-2xl bg-neutral-900/30 border border-neutral-800/70 space-y-4">
              <div className="flex items-center gap-2 text-neutral-300">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-mono uppercase tracking-wider text-neutral-200 font-semibold">
                  Engineering Overview
                </h3>
              </div>

              <div className="text-sm sm:text-base text-neutral-300 leading-relaxed space-y-3">
                <p>
                  {settings.bio ||
                    "I am an Automation & Robotics engineering student and developer passionate about creating robust systems where hardware meets intelligent software. My focus spans software development, robotics architectures, Linux systems security, and automated deployment pipelines."}
                </p>
                <p className="text-neutral-400 text-sm">
                  Rather than viewing software and hardware as isolated silos, I bridge both domains: writing firmware and sensor routines in C/C++ and Arduino on one end, and architecting modern, typed web platforms, secure APIs, and automated tools with TypeScript and Python on the other.
                </p>
              </div>
            </div>

            {/* Structured Engineering Progression */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Technical Interests */}
              <div className="p-5 rounded-2xl bg-neutral-900/30 border border-neutral-800/70">
                <div className="flex items-center gap-2 mb-3 text-cyan-400">
                  <Layers className="w-4 h-4" />
                  <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-200">
                    Core Technical Interests
                  </h4>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {technicalInterests.map((interest, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-xs font-mono rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Current Learning Areas */}
              <div className="p-5 rounded-2xl bg-neutral-900/30 border border-neutral-800/70">
                <div className="flex items-center gap-2 mb-3 text-cyan-400">
                  <BookOpen className="w-4 h-4" />
                  <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-200">
                    Current Learning Areas
                  </h4>
                </div>
                <ul className="space-y-2 text-xs text-neutral-300">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>ROS2 nodes, kinematic transforms, and embedded control loops</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>Linux kernel security baselines, network traffic inspection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>Full-stack scalable cloud microservices & container orchestration</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Professional Direction */}
            <div className="p-6 rounded-2xl bg-neutral-900/20 border border-neutral-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Compass className="w-4 h-4" />
                  <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-200">
                    Professional Direction
                  </h4>
                </div>
                <p className="text-xs text-neutral-400 max-w-xl leading-relaxed">
                  Targeting engineering roles that leverage rigorous problem-solving across automation systems, full-stack software architecture, and systems reliability.
                </p>
              </div>

              <button
                id="about-connect-btn"
                onClick={onContactClick}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 hover:border-cyan-500/40 text-xs font-medium transition-all duration-200 whitespace-nowrap self-start sm:self-center"
              >
                Connect With Me
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
