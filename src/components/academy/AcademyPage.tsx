import React, { useState } from 'react';
import type { Course, NoteResource, Certificate } from '../../types.ts';
import { AcademyNavbar } from './AcademyNavbar.tsx';
import { AcademyHero } from './AcademyHero.tsx';
import { CourseCatalog } from './CourseCatalog.tsx';
import { NotesStore } from './NotesStore.tsx';
import { MyLearningView } from './MyLearningView.tsx';
import { CoursePlayerView } from './CoursePlayerView.tsx';
import { CertificateModal } from './CertificateModal.tsx';
import { StudentAuthModal } from './StudentAuthModal.tsx';
import { PurchaseModal } from './PurchaseModal.tsx';
import { useStudentAuth } from '../../context/StudentAuthContext.tsx';

interface AcademyPageProps {
  onBackToPortfolio: () => void;
}

export function AcademyPage({ onBackToPortfolio }: AcademyPageProps) {
  const { student, courses } = useStudentAuth();

  const [currentTab, setCurrentTab] = useState<'courses' | 'notes' | 'my-learning'>('courses');
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  // Modals & Auth state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authIntentPrompt, setAuthIntentPrompt] = useState<string>('');
  const [pendingItem, setPendingItem] = useState<{
    item: Course | NoteResource;
    type: 'course' | 'note';
  } | null>(null);
  const [purchasingItem, setPurchasingItem] = useState<{
    item: Course | NoteResource;
    type: 'course' | 'note';
  } | null>(null);
  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);

  // If a student selects a course to watch
  const handleSelectCourse = (course: Course) => {
    setActiveCourse(course);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnrollCourse = (course: Course) => {
    if (!student) {
      setPendingItem({ item: course, type: 'course' });
      setAuthIntentPrompt(`Please sign in or create a student account to enroll in "${course.title}" and earn your certificate in your name.`);
      setIsAuthModalOpen(true);
      return;
    }
    setPurchasingItem({ item: course, type: 'course' });
  };

  const handlePurchaseNote = (note: NoteResource) => {
    if (!student) {
      setPendingItem({ item: note, type: 'note' });
      setAuthIntentPrompt(`Please sign in or create a student account to unlock and download "${note.title}".`);
      setIsAuthModalOpen(true);
      return;
    }
    setPurchasingItem({ item: note, type: 'note' });
  };

  const handleAuthSuccess = () => {
    if (pendingItem) {
      setPurchasingItem(pendingItem);
      setPendingItem(null);
    }
  };

  // If student is inside the classroom video player
  if (activeCourse) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
        <CoursePlayerView
          course={activeCourse}
          onBack={() => setActiveCourse(null)}
          onOpenCertificate={() => {
            if (!student) {
              setAuthIntentPrompt('Please sign in or create an account to claim your verified certificate in your name.');
              setIsAuthModalOpen(true);
              return;
            }
            const cert = student.certificates.find(c => c.courseId === activeCourse.id);
            if (cert) {
              setActiveCertificate(cert);
            } else {
              // Create instant verified certificate in student's real name
              setActiveCertificate({
                id: `CERT-${Date.now().toString(36).toUpperCase()}`,
                courseId: activeCourse.id,
                courseTitle: activeCourse.title,
                studentName: student.name,
                studentEmail: student.email,
                issuedAt: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
                verificationCode: `YG-${Math.floor(100000 + Math.random() * 900000)}`,
                grade: 'Distinction (100%)'
              });
            }
          }}
        />

        {/* Certificate Modal */}
        <CertificateModal
          certificate={activeCertificate}
          onClose={() => setActiveCertificate(null)}
        />

        <StudentAuthModal
          isOpen={isAuthModalOpen}
          intentPrompt={authIntentPrompt}
          onClose={() => {
            setIsAuthModalOpen(false);
            setAuthIntentPrompt('');
          }}
          onSuccess={handleAuthSuccess}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Academy Top Header */}
      <AcademyNavbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onBackToPortfolio={onBackToPortfolio}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Hero Banner (visible on courses and notes tabs) */}
      {currentTab !== 'my-learning' && (
        <AcademyHero
          onExploreCourses={() => {
            setCurrentTab('courses');
            window.scrollTo({ top: 400, behavior: 'smooth' });
          }}
          onExploreNotes={() => {
            setCurrentTab('notes');
            window.scrollTo({ top: 400, behavior: 'smooth' });
          }}
        />
      )}

      {/* Main Content Sections */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {currentTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
                  CURRICULUM & LECTURES
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-neutral-100 mt-1 tracking-tight">
                  Explore Engineering Courses
                </h2>
              </div>
              <p className="text-xs font-mono text-neutral-400 max-w-sm">
                Practical videos with code repositories, real-time checklist progress, and certificates on 100% completion.
              </p>
            </div>

            <CourseCatalog
              onSelectCourse={handleSelectCourse}
              onEnrollCourse={handleEnrollCourse}
            />
          </div>
        )}

        {currentTab === 'notes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
                  STUDY MATERIALS & CHEATSHEETS
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-neutral-100 mt-1 tracking-tight">
                  Handbooks & Technical Notes
                </h2>
              </div>
              <p className="text-xs font-mono text-neutral-400 max-w-sm">
                Curated PDF references with code snippets, circuit pinouts, and system design patterns.
              </p>
            </div>

            <NotesStore onPurchaseNote={handlePurchaseNote} />
          </div>
        )}

        {currentTab === 'my-learning' && (
          <MyLearningView
            onSelectCourse={handleSelectCourse}
            onOpenCertificate={cert => setActiveCertificate(cert)}
            onExploreCourses={() => setCurrentTab('courses')}
            onOpenAuth={() => {
              setAuthIntentPrompt('Sign in or create your student profile to access your learning dashboard and certificates in your own name.');
              setIsAuthModalOpen(true);
            }}
          />
        )}
      </main>

      {/* Modals */}
      <StudentAuthModal
        isOpen={isAuthModalOpen}
        intentPrompt={authIntentPrompt}
        onClose={() => {
          setIsAuthModalOpen(false);
          setAuthIntentPrompt('');
        }}
        onSuccess={handleAuthSuccess}
      />

      <PurchaseModal
        item={purchasingItem?.item || null}
        type={purchasingItem?.type || 'course'}
        onClose={() => setPurchasingItem(null)}
        onNeedAuth={() => {
          setAuthIntentPrompt(`Please sign in or register to complete your enrollment and issue your certificate in your name.`);
          setIsAuthModalOpen(true);
        }}
        onSuccess={() => {
          if (purchasingItem?.type === 'course') {
            const course = purchasingItem.item as Course;
            setPurchasingItem(null);
            handleSelectCourse(course);
          } else {
            setPurchasingItem(null);
          }
        }}
      />

      <CertificateModal
        certificate={activeCertificate}
        onClose={() => setActiveCertificate(null)}
      />
    </div>
  );
}
