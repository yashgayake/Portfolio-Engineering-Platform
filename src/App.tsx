import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { SkillsSection } from './components/SkillsSection.tsx';
import { ProjectGrid } from './components/ProjectGrid.tsx';
import { GitHubActivitySection } from './components/GitHubActivitySection.tsx';
import { ExperienceSection } from './components/ExperienceSection.tsx';
import { EducationSection } from './components/EducationSection.tsx';
import { CertificationsSection } from './components/CertificationsSection.tsx';
import { AchievementsSection } from './components/AchievementsSection.tsx';
import { BlogSection } from './components/BlogSection.tsx';
import { ResumeSection } from './components/ResumeSection.tsx';
import { ContactForm } from './components/ContactForm.tsx';
import { Footer } from './components/Footer.tsx';
import { SectionReveal } from './components/SectionReveal.tsx';
import { SectionDivider } from './components/SectionDivider.tsx';
import { Chatbot } from './components/Chatbot.tsx';
import { AdminLoginModal } from './components/admin/AdminLoginModal.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { ToastProvider } from './components/Toast.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { StudentAuthProvider } from './context/StudentAuthContext.tsx';
import { AcademyPage } from './components/academy/AcademyPage.tsx';
import { InterviewSchedulerModal } from './components/recruiter/InterviewSchedulerModal.tsx';
import { InteractiveTerminalModal } from './components/recruiter/InteractiveTerminalModal.tsx';
import { DynamicResumeBuilderModal } from './components/recruiter/DynamicResumeBuilderModal.tsx';
import { api } from './lib/api.ts';
import type { PortfolioData } from './types.ts';
import { Cpu } from 'lucide-react';

function PortfolioMain() {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isDynamicResumeOpen, setIsDynamicResumeOpen] = useState(false);

  // Active view: Always start on main portfolio when opening the website
  const [activeView, setActiveView] = useState<'portfolio' | 'academy'>('portfolio');

  useEffect(() => {
    // If user opens the website fresh, keep them on portfolio by default unless they specifically have #academy
    if (window.location.hash === '#academy') {
      setActiveView('academy');
    } else {
      setActiveView('portfolio');
    }

    const handleHashChange = () => {
      if (window.location.hash === '#academy') {
        setActiveView('academy');
      } else {
        setActiveView('portfolio');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOpenAcademy = () => {
    setActiveView('academy');
    window.location.hash = '#academy';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToPortfolio = () => {
    setActiveView('portfolio');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchPortfolioData = async () => {
    try {
      const res = await api.getPortfolio();
      setData(res);
    } catch (err: any) {
      console.error('Failed to load portfolio data:', err);
      setError('Failed to connect to portfolio database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioData();
    // Track initial page view telemetry
    api.trackEvent('page_view', window.location.pathname || '/');
  }, []);

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAdmin = () => {
    if (isAuthenticated) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-cyan-400 animate-pulse">
            <Cpu className="w-6 h-6 animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-neutral-200 tracking-wider">
              YASH GAYAKE
            </p>
            <p className="text-xs font-mono text-cyan-400/80 mt-0.5">
              Initializing systems & telemetry...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
        <div className="max-w-md p-6 rounded-2xl bg-neutral-900 border border-neutral-800 text-center space-y-4">
          <div className="text-rose-400 font-mono text-sm font-bold">SYSTEM ALERT</div>
          <p className="text-xs text-neutral-300">{error || 'Unable to load portfolio data.'}</p>
          <button
            onClick={() => {
              setLoading(true);
              fetchPortfolioData();
            }}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-neutral-950 text-xs font-semibold"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (activeView === 'academy') {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
        <AcademyPage onBackToPortfolio={handleBackToPortfolio} />
        {/* Interactive AI Chatbot (Gemini) */}
        <Chatbot />
      </div>
    );
  }

  const githubUsername = data.settings.githubUsername || 'yashgayake';

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Sticky Navbar */}
      <Navbar
        settings={data.settings}
        unreadCount={data.messages?.filter(m => !m.read).length || 0}
        onNavigate={handleNavigate}
        onOpenAdmin={handleOpenAdmin}
        onOpenResume={() => setIsResumeModalOpen(true)}
        onOpenAcademy={handleOpenAcademy}
        onOpenScheduler={() => setIsSchedulerOpen(true)}
        onOpenTerminal={() => setIsTerminalOpen(true)}
      />

      {/* Main Sections Flow */}
      <main>
        {/* 1. Hero Section */}
        <SectionReveal>
          <Hero
            settings={data.settings}
            onViewProjects={() => handleNavigate('projects')}
            onDownloadResume={() => setIsDynamicResumeOpen(true)}
            onExploreMore={() => handleNavigate('about')}
            onOpenAcademy={handleOpenAcademy}
          />
        </SectionReveal>

        <SectionDivider />

        {/* 2. About Yash Gayake */}
        <SectionReveal>
          <AboutSection
            settings={data.settings}
            educationList={data.education}
            onContactClick={() => handleNavigate('contact')}
          />
        </SectionReveal>

        <SectionDivider />

        {/* 3. Categorized Skills (no fake %) */}
        <SectionReveal>
          <SkillsSection skills={data.skills} />
        </SectionReveal>

        <SectionDivider />

        {/* 4. Projects Showcase & Deep Dive Modal */}
        <SectionReveal>
          <ProjectGrid projects={data.projects} />
        </SectionReveal>

        <SectionDivider />

        {/* 5. GitHub Activity with Official REST API */}
        <SectionReveal>
          <GitHubActivitySection username={githubUsername} />
        </SectionReveal>

        <SectionDivider />

        {/* 6. Engineering Experience & Activity */}
        <SectionReveal>
          <ExperienceSection experienceList={data.experience} />
        </SectionReveal>

        <SectionDivider />

        {/* 7. Academic Foundation / Education */}
        <SectionReveal>
          <EducationSection educationList={data.education} />
        </SectionReveal>

        <SectionDivider />

        {/* 8. Certifications & Credentials */}
        <SectionReveal>
          <CertificationsSection certifications={data.certifications} />
        </SectionReveal>

        <SectionDivider />

        {/* 9. Achievements & Milestones */}
        <SectionReveal>
          <AchievementsSection achievements={data.achievements} />
        </SectionReveal>

        <SectionDivider />

        {/* 10. Technical Blog & Markdown Reader */}
        <SectionReveal>
          <BlogSection articles={data.articles} />
        </SectionReveal>

        <SectionDivider />

        {/* 11. Resume Section */}
        <SectionReveal>
          <ResumeSection
            settings={data.settings}
            isOpenModal={isResumeModalOpen}
            onCloseModal={() => setIsResumeModalOpen(false)}
          />
        </SectionReveal>

        <SectionDivider />

        {/* 12. Contact Form with Spam Protection & Backend Persistence */}
        <SectionReveal>
          <ContactForm settings={data.settings} />
        </SectionReveal>
      </main>

      {/* Footer */}
      <Footer
        settings={data.settings}
        onNavigate={handleNavigate}
        onOpenResume={() => setIsResumeModalOpen(true)}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setIsAdminLoginOpen(false);
          setIsAdminDashboardOpen(true);
        }}
      />

      {/* Admin CMS & Analytics Dashboard */}
      {isAdminDashboardOpen && (
        <AdminDashboard
          isOpen={isAdminDashboardOpen}
          onClose={() => setIsAdminDashboardOpen(false)}
          data={data}
          onDataRefresh={fetchPortfolioData}
        />
      )}

      {/* Recruiter 1-Click Interview Scheduler Modal */}
      <InterviewSchedulerModal
        isOpen={isSchedulerOpen}
        onClose={() => setIsSchedulerOpen(false)}
        yashEmail={data.settings.email}
      />

      {/* Interactive Developer Terminal Modal */}
      <InteractiveTerminalModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        onNavigateSection={handleNavigate}
        onOpenResume={() => setIsResumeModalOpen(true)}
      />

      {/* Dynamic Recruiter-Tailored Resume Builder */}
      <DynamicResumeBuilderModal
        isOpen={isDynamicResumeOpen}
        onClose={() => setIsDynamicResumeOpen(false)}
        settings={data.settings}
        projects={data.projects}
        skills={data.skills}
      />

      {/* Interactive AI Chatbot (Gemini) */}
      <Chatbot />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StudentAuthProvider>
          <ToastProvider>
            <PortfolioMain />
          </ToastProvider>
        </StudentAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
