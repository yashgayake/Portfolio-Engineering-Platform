import React from 'react';
import { 
  ArrowLeft, 
  GraduationCap, 
  BookOpen, 
  FileText, 
  Award, 
  Youtube, 
  Sun, 
  Moon, 
  User 
} from 'lucide-react';
import { useStudentAuth } from '../../context/StudentAuthContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';

interface AcademyNavbarProps {
  currentTab: 'courses' | 'notes' | 'my-learning';
  onSelectTab: (tab: 'courses' | 'notes' | 'my-learning') => void;
  onBackToPortfolio: () => void;
  onOpenAuth: () => void;
}

export function AcademyNavbar({
  currentTab,
  onSelectTab,
  onBackToPortfolio,
  onOpenAuth
}: AcademyNavbarProps) {
  const { student } = useStudentAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/90 border-b border-neutral-800 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Back Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToPortfolio}
            id="academy-back-portfolio-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-cyan-400 border border-neutral-800 text-xs font-mono transition-colors"
            title="Return to main personal portfolio"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Portfolio</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-neutral-100 tracking-tight">
                  Student Academy
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 uppercase">
                  PORTAL
                </span>
              </div>
              <p className="text-[10px] font-mono text-neutral-400 hidden sm:block">
                Courses, Notes & Verified Certifications
              </p>
            </div>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-neutral-900/60 p-1 rounded-xl border border-neutral-800">
          <button
            id="tab-btn-courses"
            onClick={() => onSelectTab('courses')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              currentTab === 'courses'
                ? 'bg-neutral-800 text-cyan-400 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Courses</span>
          </button>

          <button
            id="tab-btn-notes"
            onClick={() => onSelectTab('notes')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              currentTab === 'notes'
                ? 'bg-neutral-800 text-cyan-400 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Lecture Notes</span>
          </button>

          <button
            id="tab-btn-mylearning"
            onClick={() => onSelectTab('my-learning')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              currentTab === 'my-learning'
                ? 'bg-neutral-800 text-cyan-400 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>My Learning</span>
            {student && student.enrolledCourseIds.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-cyan-500 text-neutral-950 text-[10px] font-bold flex items-center justify-center">
                {student.enrolledCourseIds.length}
              </span>
            )}
          </button>
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center gap-2.5">
          {/* YouTube Channel link */}
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono transition-colors"
          >
            <Youtube className="w-4 h-4" />
            <span>YouTube Channel</span>
          </a>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            id="academy-theme-toggle-btn"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900 border border-neutral-800 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* Student Profile / Sign In */}
          <button
            onClick={onOpenAuth}
            id="academy-student-auth-btn"
            className={`flex items-center gap-2.5 transition-all ${
              student 
                ? 'p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-neutral-900/90 hover:bg-neutral-800 border border-cyan-500/30 hover:border-cyan-400 text-neutral-100 text-xs font-mono shadow-sm group'
                : 'px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-bold font-mono shadow-md'
            }`}
          >
            {student ? (
              <>
                <div className="relative shrink-0">
                  <img
                    src={student.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${student.email}`}
                    alt={student.name}
                    className="w-7 h-7 rounded-xl object-cover border border-cyan-500/40 bg-neutral-950"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-neutral-900" />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-neutral-100 text-xs max-w-[120px] truncate group-hover:text-cyan-400 transition-colors">
                      {student.name}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                      {student.enrolledCourseIds.length} Enrolled
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400 block max-w-[140px] truncate font-sans">
                    {student.email}
                  </span>
                </div>
              </>
            ) : (
              <>
                <User className="w-4 h-4" />
                <span>Student Sign In</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex md:hidden items-center justify-around border-t border-neutral-800/80 px-2 py-2 bg-neutral-950 text-xs font-mono">
        <button
          onClick={() => onSelectTab('courses')}
          className={`flex items-center gap-1.5 py-1 px-3 rounded-lg ${
            currentTab === 'courses' ? 'text-cyan-400 font-bold bg-neutral-900' : 'text-neutral-400'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Courses</span>
        </button>
        <button
          onClick={() => onSelectTab('notes')}
          className={`flex items-center gap-1.5 py-1 px-3 rounded-lg ${
            currentTab === 'notes' ? 'text-cyan-400 font-bold bg-neutral-900' : 'text-neutral-400'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Notes</span>
        </button>
        <button
          onClick={() => onSelectTab('my-learning')}
          className={`flex items-center gap-1.5 py-1 px-3 rounded-lg ${
            currentTab === 'my-learning' ? 'text-cyan-400 font-bold bg-neutral-900' : 'text-neutral-400'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>My Learning</span>
        </button>
      </div>
    </header>
  );
}
