import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Github, 
  Linkedin, 
  FileText, 
  Sun, 
  Moon, 
  ShieldCheck, 
  Cpu,
  GraduationCap,
  Calendar,
  Terminal,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import type { SiteSettings } from '../types.ts';
import { Yash3DAvatar } from './Yash3DAvatar.tsx';
import { soundFx } from '../lib/soundFx.ts';

interface NavbarProps {
  settings: SiteSettings;
  activeSection?: string;
  unreadCount?: number;
  onNavigate?: (sectionId: string) => void;
  onOpenResume: () => void;
  onOpenAdmin: () => void;
  onOpenAcademy?: () => void;
  onOpenScheduler?: () => void;
  onOpenTerminal?: () => void;
}

export function Navbar({ 
  settings, 
  activeSection = 'home', 
  unreadCount = 0, 
  onNavigate, 
  onOpenResume, 
  onOpenAdmin, 
  onOpenAcademy,
  onOpenScheduler,
  onOpenTerminal
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(() => soundFx.getMuted());
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, isAdmin } = useAuth();

  const handleToggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleLinkClick = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-neutral-950/80 dark:bg-neutral-950/85 backdrop-blur-md border-b border-neutral-800/80 shadow-sm shadow-black/20 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Name with 3D Avatar */}
          <button
            id="nav-logo-btn"
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <div className="relative w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/40 group-hover:text-cyan-300 transition-colors overflow-hidden shadow-inner">
              <div className="w-full h-full scale-150 pointer-events-none">
                <Yash3DAvatar
                  className="w-full h-full"
                  height="100%"
                  autoRotate={false}
                  interactive={false}
                  showControls={false}
                  enableSpeech={false}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-tight text-neutral-100 group-hover:text-cyan-400 transition-colors">
                  {settings.name || 'Yash Gayake'}
                </span>
                <span className="px-1 py-0.2 rounded text-[8px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  3D
                </span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 tracking-wider">
                ROBOTICS & DEV
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav id="desktop-nav" className="hidden lg:flex items-center gap-1 bg-neutral-900/50 p-1.5 rounded-full border border-neutral-800/60 backdrop-blur-md">
            {navItems.map(item => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleLinkClick(item.id)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold'
                      : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* Direct Student Academy navigation tab */}
            {onOpenAcademy && (
              <button
                id="nav-link-student-academy"
                onClick={onOpenAcademy}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30 transition-all duration-200 ml-1"
                title="Open Student Academy"
              >
                <GraduationCap className="w-3.5 h-3.5 text-rose-400" />
                <span>Student Academy</span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              </button>
            )}
          </nav>

          {/* Right Actions: Socials, Resume, Theme, Admin */}
          <div className="hidden sm:flex items-center gap-2">
            {settings.githubUrl && (
              <a
                id="nav-github-link"
                href={settings.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub Profile"
                className="p-2 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            )}

            {settings.linkedinUrl && (
              <a
                id="nav-linkedin-link"
                href={settings.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn Profile"
                className="p-2 rounded-lg text-neutral-400 hover:text-cyan-400 hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}

            {/* Academy / YouTube Courses Button */}
            {onOpenAcademy && (
              <button
                id="nav-academy-btn"
                onClick={onOpenAcademy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold rounded-lg bg-gradient-to-r from-rose-500/15 via-cyan-500/15 to-rose-500/15 text-rose-400 hover:text-rose-300 border border-rose-500/30 transition-all hover:scale-105 shadow-sm"
                title="Visit Yash Gayake YouTube Teaching Academy & Student Courses"
              >
                <GraduationCap className="w-3.5 h-3.5 text-rose-400" />
                <span>Academy</span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              </button>
            )}

            {/* Sound & Yash 3D Voice Audio Toggle */}
            <button
              id="nav-speaker-btn"
              onClick={handleToggleSound}
              title={isMuted ? "Unmute Audio & Yash 3D Voice" : "Mute Audio & Stop Yash 3D Voice"}
              className={`p-2 rounded-lg border transition-colors ${
                !isMuted 
                  ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30 shadow-sm shadow-cyan-500/10' 
                  : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900 border-neutral-800'
              }`}
            >
              {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Recruiter 1-Click Scheduler */}
            {onOpenScheduler && (
              <button
                id="nav-scheduler-btn"
                onClick={() => {
                  soundFx.playClick();
                  onOpenScheduler();
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-semibold rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 transition-all hover:scale-105"
                title="Book 1-on-1 Interview Call with Yash"
              >
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden xl:inline">Book Call</span>
              </button>
            )}

            {/* Interactive Terminal */}
            {onOpenTerminal && (
              <button
                id="nav-terminal-btn"
                onClick={() => {
                  soundFx.playTerminalKey();
                  onOpenTerminal();
                }}
                className="p-2 rounded-lg text-neutral-400 hover:text-cyan-300 hover:bg-neutral-900 border border-neutral-800 hover:border-cyan-500/30 transition-colors"
                title="Open Interactive Developer Terminal (~ bash)"
              >
                <Terminal className="w-4 h-4" />
              </button>
            )}

            <button
              id="nav-resume-btn"
              onClick={onOpenResume}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/80 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Resume</span>
            </button>

            <button
              id="nav-theme-toggle-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="p-2 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600 animate-in spin-in-180 duration-300" />
              )}
            </button>

            <button
              id="nav-admin-portal-btn"
              onClick={onOpenAdmin}
              title={isAuthenticated ? `${user?.name || 'Admin'} (${isAdmin ? 'Admin' : 'Signed In'})` : 'Sign In / Admin'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
                isAuthenticated
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 border-neutral-800'
              }`}
            >
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.name} className="w-4 h-4 rounded-full" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              <span>{isAuthenticated ? (isAdmin ? 'Admin CMS' : (user?.name?.split(' ')[0] || 'Account')) : 'Sign In'}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-1 sm:hidden">
            <button
              id="mobile-theme-toggle-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="p-2 text-neutral-400 hover:text-neutral-100"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>
            <button
              id="mobile-resume-btn"
              onClick={onOpenResume}
              className="p-2 text-neutral-300 hover:text-cyan-400"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              id="mobile-admin-btn"
              onClick={onOpenAdmin}
              className={`p-2 ${isAuthenticated ? 'text-cyan-400' : 'text-neutral-400'}`}
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-400 hover:text-neutral-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="sm:hidden bg-neutral-950/95 border-b border-neutral-800/80 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 mt-2">
          {onOpenAcademy && (
            <button
              onClick={() => {
                onOpenAcademy();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-rose-500/20 via-cyan-500/15 to-rose-500/20 border border-rose-500/30 text-rose-300 font-mono text-xs font-bold mb-2 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-rose-400" />
                <span>Yash Gayake Academy (Courses & Notes)</span>
              </div>
              <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-rose-500/30 text-rose-200">
                New
              </span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-1.5">
            {navItems.map(item => (
              <button
                key={item.id}
                id={`mobile-nav-link-${item.id}`}
                onClick={() => handleLinkClick(item.id)}
                className={`text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'bg-cyan-500/10 text-cyan-400 font-semibold'
                    : 'text-neutral-300 hover:bg-neutral-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-neutral-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {settings.githubUrl && (
                <a
                  href={settings.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-neutral-900 text-neutral-300 hover:text-white"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {settings.linkedinUrl && (
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-neutral-900 text-neutral-300 hover:text-cyan-400"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Speaker Audio Toggle for Mobile */}
              <button
                onClick={handleToggleSound}
                title={isMuted ? "Unmute Sound & Yash 3D Voice" : "Mute Sound & Stop Yash 3D Voice"}
                className={`p-2 rounded-lg border transition-colors ${
                  !isMuted 
                    ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' 
                    : 'text-neutral-500 hover:text-neutral-300 bg-neutral-900 border-neutral-800'
                }`}
              >
                {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-neutral-900 text-neutral-300"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
              >
                {isAuthenticated ? (isAdmin ? 'Admin CMS' : 'Account') : 'Sign In'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
