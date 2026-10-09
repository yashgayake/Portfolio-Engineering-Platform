import React from 'react';
import { motion, type Variants } from 'motion/react';
import { Github, Linkedin, FileText, ArrowUp, Cpu, ShieldCheck } from 'lucide-react';
import type { SiteSettings } from '../types.ts';

interface FooterProps {
  settings: SiteSettings;
  onNavigate: (sectionId: string) => void;
  onOpenResume: () => void;
  onOpenAdmin: () => void;
}

const footerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export function Footer({ settings, onNavigate, onOpenResume, onOpenAdmin }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="site-footer" className="bg-neutral-950 border-t border-neutral-800/80 text-neutral-400 py-12 transition-colors">
      <motion.div 
        variants={footerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-cyan-400">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-neutral-100 tracking-tight">
                {settings.name || 'Yash Gayake'}
              </span>
            </div>
            <p className="text-sm text-cyan-400/90 font-medium">
              {settings.professionalTitle || 'Automation & Robotics Student | Developer'}
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-md">
              {settings.supportingText ||
                'Building with code, exploring robotics, and continuously learning modern technologies across software, automation, and cybersecurity.'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider font-mono">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  id="footer-link-home"
                  onClick={() => onNavigate('home')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  id="footer-link-about"
                  onClick={() => onNavigate('about')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  id="footer-link-projects"
                  onClick={() => onNavigate('projects')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Projects
                </button>
              </li>
              <li>
                <button
                  id="footer-link-blog"
                  onClick={() => onNavigate('blog')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Blog
                </button>
              </li>
              <li>
                <button
                  id="footer-link-contact"
                  onClick={() => onNavigate('contact')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Social & Resources */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider font-mono">
              Connect & Resume
            </h3>
            <div className="flex flex-col gap-2.5 text-sm">
              {settings.githubUrl && (
                <a
                  id="footer-github-link"
                  href={settings.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              )}
              {settings.linkedinUrl && (
                <a
                  id="footer-linkedin-link"
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
              )}
              <button
                id="footer-resume-btn"
                onClick={onOpenResume}
                className="flex items-center gap-2 hover:text-cyan-400 transition-colors text-left"
              >
                <FileText className="w-4 h-4" />
                <span>Resume</span>
              </button>
              <button
                id="footer-admin-btn"
                onClick={onOpenAdmin}
                className="flex items-center gap-2 text-xs text-neutral-600 hover:text-neutral-400 transition-colors pt-2 text-left"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-neutral-500">
            © {currentYear} {settings.name || 'Yash Gayake'}. All rights reserved.
          </p>

          <button
            id="footer-back-to-top-btn"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-100 border border-neutral-800 transition-colors"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Back to top</span>
          </button>
        </div>
      </motion.div>
    </footer>
  );
}
