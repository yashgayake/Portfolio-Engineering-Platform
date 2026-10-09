import React from 'react';
import { motion, type Variants } from 'motion/react';
import { 
  ArrowRight, 
  FileText, 
  Github, 
  Linkedin, 
  Bot, 
  Code2, 
  ShieldCheck, 
  Terminal,
  ChevronDown,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import type { SiteSettings } from '../types.ts';
import { api } from '../lib/api.ts';
import { Yash3DAvatar } from './Yash3DAvatar.tsx';

interface HeroProps {
  settings: SiteSettings;
  onViewProjects: () => void;
  onDownloadResume: () => void;
  onExploreMore: () => void;
  onOpenAcademy?: () => void;
}

const heroContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const cardsContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2
    }
  }
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
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

export function Hero({ settings, onViewProjects, onDownloadResume, onExploreMore, onOpenAcademy }: HeroProps) {
  const focusAreas = [
    {
      title: "Automation & Robotics",
      icon: Bot,
      desc: "Embedded systems, sensor fusion, and autonomous control architectures.",
      tag: "HARDWARE / FIRMWARE"
    },
    {
      title: "Software Development",
      icon: Code2,
      desc: "Full-stack web applications, type-safe APIs, and responsive interfaces.",
      tag: "FULL-STACK"
    },
    {
      title: "Cybersecurity",
      icon: ShieldCheck,
      desc: "Linux systems hardening, network diagnostics, and security fundamentals.",
      tag: "SYSTEM SECURITY"
    },
    {
      title: "DevOps",
      icon: Terminal,
      desc: "Containerization with Docker, automated CI pipelines, and Linux administration.",
      tag: "INFRASTRUCTURE"
    }
  ];

  return (
    <section id="home" className="relative min-h-[92vh] flex flex-col justify-center pt-28 pb-16 overflow-hidden">
      {/* Subtle technical background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370f_1px,transparent_1px),linear-gradient(to_bottom,#1f29370f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Subtle accent glow - very subdued */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        variants={heroContainerVariants}
        initial="hidden"
        animate="visible"
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
      >
        {/* Engineering Status Pill */}
        <motion.div variants={heroItemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900/80 border border-neutral-800/80 text-xs text-neutral-300 mb-6 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="font-mono text-[11px] text-neutral-400">STATUS:</span>
          <span className="font-medium text-neutral-200">Open to Technical Projects & Collaboration</span>
        </motion.div>

        {/* Hero Headlines and 3D Avatar Dual Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-6">
          <div className="lg:col-span-7">
            <motion.h2 variants={heroItemVariants} className="text-sm sm:text-base font-mono text-cyan-400 font-semibold tracking-wider uppercase mb-3">
              Hi, I'm {settings.name || 'Yash Gayake'}
            </motion.h2>

            <motion.h1 variants={heroItemVariants} className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-neutral-100 tracking-tight leading-[1.08] mb-6">
              {settings.professionalTitle || 'Automation & Robotics Student | Developer'}
            </motion.h1>

            <motion.p variants={heroItemVariants} className="text-base sm:text-xl text-neutral-400 font-normal leading-relaxed max-w-2xl mb-8">
              {settings.supportingText ||
                'Building with code, exploring robotics, and continuously learning modern technologies across software, automation, and cybersecurity.'}
            </motion.p>

            {/* Action CTAs */}
            <motion.div variants={heroItemVariants} className="flex flex-wrap items-center gap-4 mb-6">
              <button
                id="hero-view-projects-btn"
                onClick={() => {
                  api.trackEvent('page_view', '/#projects', { cta: 'view_projects' });
                  onViewProjects();
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-semibold text-sm transition-all duration-200 shadow-lg shadow-cyan-500/20 active:scale-[0.98]"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-download-resume-btn"
                onClick={() => {
                  api.trackEvent('resume_download', '/resume', { source: 'hero' });
                  onDownloadResume();
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 font-medium text-sm border border-neutral-800 hover:border-neutral-700 transition-all duration-200"
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Download Resume</span>
              </button>

              {/* Yash Gayake Academy CTA */}
              {onOpenAcademy && (
                <button
                  id="hero-open-academy-btn"
                  onClick={onOpenAcademy}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-rose-500/15 via-cyan-500/15 to-rose-500/15 hover:from-rose-500/25 hover:to-rose-500/25 text-rose-300 hover:text-white font-mono font-bold text-sm border border-rose-500/30 transition-all duration-200 shadow-md"
                >
                  <GraduationCap className="w-4 h-4 text-rose-400" />
                  <span>YouTube Courses & Notes</span>
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                </button>
              )}

              {/* Social Buttons */}
              <div className="flex items-center gap-2 sm:ml-2">
                {settings.githubUrl && (
                  <a
                    id="hero-github-btn"
                    href={settings.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => api.trackEvent('github_click', settings.githubUrl)}
                    aria-label="GitHub Profile"
                    className="p-3 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-100 border border-neutral-800 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}

                {settings.linkedinUrl && (
                  <a
                    id="hero-linkedin-btn"
                    href={settings.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => api.trackEvent('linkedin_click', settings.linkedinUrl)}
                    aria-label="LinkedIn Profile"
                    className="p-3 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-cyan-400 border border-neutral-800 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>

          {/* 3D Yash Interactive Avatar Hero Showcase */}
          <motion.div 
            variants={heroItemVariants}
            className="lg:col-span-5 flex flex-col items-center justify-center relative"
          >
            <div className="relative w-full max-w-[360px] sm:max-w-[420px] h-[430px] sm:h-[490px] rounded-3xl bg-gradient-to-b from-neutral-900/60 via-neutral-900/30 to-neutral-950/80 border border-neutral-800/90 shadow-2xl backdrop-blur-md overflow-hidden group">
              {/* Technical HUD Overlay Badges */}
              <div className="absolute top-3.5 left-4 z-10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800/50">
                  Yash 3D Model • Real-Time WebGL
                </span>
              </div>

              <div className="absolute top-3.5 right-4 z-10">
                <span className="text-[9px] font-mono text-neutral-500 bg-neutral-950/80 px-2 py-0.5 rounded border border-neutral-800">
                  Fixed Front • 3D View
                </span>
              </div>

              {/* 3D Canvas */}
              <Yash3DAvatar 
                className="w-full h-full"
                height="100%"
                autoRotate={false}
                interactive={true}
                showControls={true}
              />
            </div>
            <p className="text-[11px] font-mono text-neutral-500 mt-2 flex items-center gap-1.5 text-center">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Interactive Yash Gayake 3D Avatar (Facing front, fixed perspective)</span>
            </p>
          </motion.div>
        </div>

        {/* Currently Focused On Section */}
        <motion.div 
          variants={cardsContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-6 pt-10 border-t border-neutral-800/60"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                Currently Focused On
              </h3>
            </div>
            <span className="text-[11px] font-mono text-neutral-500">ENGINEERING VECTOR</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {focusAreas.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  variants={cardVariant}
                  id={`focus-card-${idx}`}
                  className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-700/80 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-cyan-400 group-hover:text-cyan-300 group-hover:border-cyan-500/30 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500 tracking-wider">
                      {item.tag}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-neutral-200 mb-1 group-hover:text-neutral-100 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div variants={heroItemVariants} className="mt-12 flex justify-center">
          <button
            id="hero-scroll-down-btn"
            onClick={onExploreMore}
            className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-300 transition-colors font-mono"
          >
            <span>EXPLORE PROFILE</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
