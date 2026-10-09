import React, { useState } from 'react';
import { 
  BookOpen, 
  Play, 
  Award, 
  FileText, 
  Download, 
  CheckCircle2, 
  ArrowRight,
  GraduationCap,
  Sparkles,
  FolderGit2,
  Plus,
  ExternalLink,
  Github,
  Clock,
  MessageSquare,
  ShieldCheck,
  CheckCircle
} from 'lucide-react';
import type { Course, Certificate, NoteResource, StudentWork } from '../../types.ts';
import { useStudentAuth } from '../../context/StudentAuthContext.tsx';
import { SubmitWorkModal } from './SubmitWorkModal.tsx';
import { CertificateVerificationModal } from './CertificateVerificationModal.tsx';

interface MyLearningViewProps {
  onSelectCourse: (course: Course) => void;
  onOpenCertificate: (certificate: Certificate) => void;
  onExploreCourses: () => void;
  onOpenAuth: () => void;
}

export function MyLearningView({
  onSelectCourse,
  onOpenCertificate,
  onExploreCourses,
  onOpenAuth
}: MyLearningViewProps) {
  const { student, courses, notesStore, studentWorks, getCourseProgress } = useStudentAuth();
  const [activeSubTab, setActiveSubTab] = useState<'courses' | 'works' | 'certificates' | 'notes'>('courses');
  const [isSubmitWorkOpen, setIsSubmitWorkOpen] = useState(false);
  const [isVerifyCertOpen, setIsVerifyCertOpen] = useState(false);

  // If user is not logged in, show student authentication gate
  if (!student) {
    return (
      <div className="py-8 sm:py-16 max-w-3xl mx-auto space-y-8 animate-fadeIn text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto shadow-inner">
            <GraduationCap className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              STUDENT LEARNING & CERTIFICATION PORTAL
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight mt-2">
              Sign In to Access Your Learning Hub
            </h2>
            <p className="text-sm text-neutral-400 max-w-lg mx-auto leading-relaxed font-sans">
              Create your student profile or sign in to track lecture progress, access purchased course notes, submit engineering assignments, and earn verified certificates issued in your own name.
            </p>
          </div>

          {/* 3 Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-4 border-t border-neutral-800/80">
            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 space-y-1">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs font-mono">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Video Progress</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-snug">
                Tick off lectures and watch your real-time progress bar climb to 100%.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs font-mono">
                <Award className="w-4 h-4 shrink-0" />
                <span>Your Name on Cert</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-snug">
                Verified certificate automatically generated in your legal name upon 100% completion.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono">
                <FolderGit2 className="w-4 h-4 shrink-0" />
                <span>Project Reviews</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-snug">
                Submit your GitHub project works for direct grading and feedback from Yash.
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenAuth}
              id="student-gate-auth-btn"
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold font-mono text-xs transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Sign In / Create Student Account</span>
            </button>
            <button
              onClick={onExploreCourses}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-neutral-300 font-mono text-xs border border-neutral-800 transition-colors"
            >
              Browse Course Catalog
            </button>
          </div>
        </div>

        {/* Certificate verification widget for public visitors */}
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-neutral-400">
          <span>Already have a certificate?</span>
          <button
            onClick={() => setIsVerifyCertOpen(true)}
            className="text-cyan-400 hover:underline font-bold flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verify Credential Code</span>
          </button>
        </div>

        <CertificateVerificationModal
          isOpen={isVerifyCertOpen}
          onClose={() => setIsVerifyCertOpen(false)}
        />
      </div>
    );
  }

  const enrolledCourses = courses.filter(c => student.enrolledCourseIds.includes(c.id));
  const purchasedNotes = notesStore.filter(n => student.purchasedNoteIds.includes(n.id) || n.price === 0);
  const certificates = student.certificates || [];

  return (
    <div className="space-y-10">
      {/* Student Portal Master Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4 sm:gap-5">
          <img
            src={student?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${student?.email || 'default'}`}
            alt={student?.name || 'Student'}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-cyan-500/30 bg-neutral-950 object-cover shadow-inner"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 tracking-tight">
                {student?.name || 'Student Learner'}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                STUDENT PORTAL
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                FIRESTORE CONNECTED
              </span>
            </div>
            <p className="text-xs font-mono text-neutral-400">{student?.email || 'student@example.com'}</p>
            <p className="text-[11px] font-mono text-neutral-500">
              Enrolled since {student?.joinedDate || 'September 2026'} • Student ID: <span className="text-neutral-300 font-bold">{student?.id || 'std-8371'}</span>
            </p>
          </div>
        </div>

        {/* Portal Summary Counters & Quick Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 border-t lg:border-t-0 lg:border-l border-neutral-800 pt-4 lg:pt-0 lg:pl-6">
          <div className="grid grid-cols-4 gap-2.5 text-center shrink-0">
            <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
              <div className="text-base sm:text-lg font-bold font-mono text-neutral-100">{enrolledCourses.length}</div>
              <div className="text-[9px] font-mono text-neutral-400 uppercase">Courses</div>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
              <div className="text-base sm:text-lg font-bold font-mono text-cyan-400">{studentWorks.length}</div>
              <div className="text-[9px] font-mono text-neutral-400 uppercase">Works</div>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
              <div className="text-base sm:text-lg font-bold font-mono text-amber-400">{certificates.length}</div>
              <div className="text-[9px] font-mono text-neutral-400 uppercase">Certs</div>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
              <div className="text-base sm:text-lg font-bold font-mono text-emerald-400">{purchasedNotes.length}</div>
              <div className="text-[9px] font-mono text-neutral-400 uppercase">Notes</div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => setIsSubmitWorkOpen(true)}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold font-mono text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit Work</span>
            </button>
            <button
              onClick={() => setIsVerifyCertOpen(true)}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 font-bold font-mono text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Verify ID</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Switcher */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('courses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-colors whitespace-nowrap ${
            activeSubTab === 'courses'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Enrolled Courses ({enrolledCourses.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('works')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-colors whitespace-nowrap ${
            activeSubTab === 'works'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>My Projects & Works ({studentWorks.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('certificates')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-colors whitespace-nowrap ${
            activeSubTab === 'certificates'
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Certificates ({certificates.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('notes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-colors whitespace-nowrap ${
            activeSubTab === 'notes'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Lecture Notes ({purchasedNotes.length})</span>
        </button>
      </div>

      {/* SUB-TAB 1: ENROLLED COURSES */}
      {activeSubTab === 'courses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <span>Current Course Curriculum</span>
            </h3>
            <span className="text-xs font-mono text-neutral-400">
              Interactive tickmark progress stored in database
            </span>
          </div>

          {enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map(course => {
                const progress = getCourseProgress(course.id);

                return (
                  <div
                    key={course.id}
                    className="rounded-3xl bg-neutral-900/50 border border-neutral-800 overflow-hidden flex flex-col justify-between hover:border-neutral-700 transition-colors shadow-sm"
                  >
                    <div>
                      <div className="relative aspect-video w-full bg-neutral-950">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-950/90 text-cyan-400 border border-neutral-800 backdrop-blur-md">
                          {course.category}
                        </div>
                        {progress.isComplete && (
                          <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/90 text-neutral-950 font-bold backdrop-blur-md flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>100% COMPLETE</span>
                          </div>
                        )}
                      </div>

                      <div className="p-5 space-y-3">
                        <h4 className="text-sm font-bold text-neutral-100 line-clamp-2">
                          {course.title}
                        </h4>

                        {/* Progress bar */}
                        <div className="space-y-1.5 p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-neutral-400">Course Progress</span>
                            <span className={`font-bold ${progress.isComplete ? 'text-emerald-400' : 'text-cyan-400'}`}>
                              {progress.percentage}%
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-neutral-900 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${
                                progress.isComplete ? 'bg-emerald-400' : 'bg-cyan-400'
                              }`}
                              style={{ width: `${progress.percentage}%` }}
                            />
                          </div>
                          <p className="text-[10px] font-mono text-neutral-500">
                            {progress.completedCount} of {progress.totalCount} lectures ticked off
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-neutral-800/80 mt-2">
                      <button
                        onClick={() => onSelectCourse(course)}
                        className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-colors ${
                          progress.isComplete
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950'
                            : 'bg-cyan-500 hover:bg-cyan-400 text-neutral-950'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{progress.isComplete ? 'Review Course Videos' : 'Continue Video Lecture'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-10 text-center rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-4">
              <GraduationCap className="w-10 h-10 text-neutral-500 mx-auto" />
              <h4 className="text-base font-bold text-neutral-200">No courses enrolled yet</h4>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto font-mono">
                Enroll in free and premium courses by Yash Gayake to start building hands-on projects.
              </p>
              <button
                onClick={onExploreCourses}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 text-neutral-950 text-xs font-bold font-mono hover:bg-cyan-400 transition-colors"
              >
                Browse Course Catalog
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: MY PROJECT WORKS & SUBMISSIONS (FIRESTORE PERSISTENT) */}
      {activeSubTab === 'works' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-cyan-400" />
                <span>My Project Works & Practical Submissions</span>
              </h3>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">
                Every project is saved in Firestore database and reviewed directly by Yash Gayake.
              </p>
            </div>

            <button
              onClick={() => setIsSubmitWorkOpen(true)}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold font-mono text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit Project Work</span>
            </button>
          </div>

          {studentWorks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studentWorks.map(work => (
                <div
                  key={work.id}
                  className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-4 flex flex-col justify-between hover:border-neutral-700 transition-colors shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                          {work.courseTitle}
                        </span>
                        <h4 className="text-base font-bold text-neutral-100 mt-1">
                          {work.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {work.status === 'approved' && (
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>APPROVED</span>
                          </span>
                        )}
                        {work.status === 'reviewed' && (
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>REVIEWED</span>
                          </span>
                        )}
                        {work.status === 'submitted' && (
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-neutral-800 text-neutral-400 border border-neutral-700 font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>SUBMITTED</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-neutral-300 line-clamp-3">
                      {work.description}
                    </p>

                    {/* Instructor Feedback Box */}
                    {work.instructorFeedback && (
                      <div className="p-3.5 rounded-2xl bg-neutral-950 border border-cyan-500/30 text-xs font-mono space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Instructor Feedback (Yash Gayake)</span>
                          </span>
                          {work.grade && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                              Grade: {work.grade}
                            </span>
                          )}
                        </div>
                        <p className="text-neutral-300 italic">
                          "{work.instructorFeedback}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Links & metadata footer */}
                  <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-3 text-xs font-mono">
                    <span className="text-[11px] text-neutral-500">
                      Submitted {new Date(work.submittedAt).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-2">
                      {work.repoUrl && (
                        <a
                          href={work.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
                          title="View GitHub Repository"
                        >
                          <Github className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {work.projectUrl && (
                        <a
                          href={work.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-4">
              <FolderGit2 className="w-10 h-10 text-neutral-500 mx-auto" />
              <h4 className="text-base font-bold text-neutral-200">No project works submitted yet</h4>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto font-mono">
                Build practical applications following the YouTube lectures, then submit your GitHub repository or live link here for instructor feedback!
              </p>
              <button
                onClick={() => setIsSubmitWorkOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 text-neutral-950 text-xs font-bold font-mono hover:bg-cyan-400 transition-colors"
              >
                Submit Your First Project
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: CERTIFICATES */}
      {activeSubTab === 'certificates' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>Earned Certificates of Completion</span>
              </h3>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">
                Automatically issued and saved to Firestore when you finish 100% of lectures.
              </p>
            </div>

            <button
              onClick={() => setIsVerifyCertOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold font-mono text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verify Any Certificate</span>
            </button>
          </div>

          {certificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.map(cert => (
                <div
                  key={cert.id}
                  className="p-5 rounded-2xl bg-neutral-900/60 border border-amber-500/30 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-neutral-100">{cert.courseTitle}</h4>
                      <p className="text-[11px] font-mono text-neutral-400">
                        Issued to {cert.studentName} on {cert.issuedAt}
                      </p>
                      <span className="text-[10px] font-mono text-cyan-400">
                        Verification Code: <span className="font-bold text-amber-300">{cert.verificationCode}</span>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenCertificate(cert)}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-mono font-bold transition-colors shrink-0 shadow-sm"
                  >
                    View Credential
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-4">
              <Award className="w-10 h-10 text-neutral-500 mx-auto" />
              <h4 className="text-base font-bold text-neutral-200">No certificates earned yet</h4>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto font-mono">
                Tick off all lecture videos in any course to automatically generate your official verified completion certificate.
              </p>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: NOTES */}
      {activeSubTab === 'notes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <span>Unlocked Handbooks & Technical Notes</span>
            </h3>
            <span className="text-xs font-mono text-neutral-400">
              PDF cheat sheets & design patterns
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {purchasedNotes.map(n => (
              <div
                key={n.id}
                className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-xs font-bold text-neutral-100 line-clamp-1">{n.title}</h4>
                  <p className="text-[11px] font-mono text-neutral-400">{n.pagesCount} Pages PDF Handbook</p>
                </div>
                <button
                  onClick={() => alert(`Downloading handbook for "${n.title}"...`)}
                  className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-cyan-400 transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Work Modal */}
      <SubmitWorkModal
        isOpen={isSubmitWorkOpen}
        onClose={() => setIsSubmitWorkOpen(false)}
        courses={courses}
      />

      {/* Certificate Verification Modal */}
      <CertificateVerificationModal
        isOpen={isVerifyCertOpen}
        onClose={() => setIsVerifyCertOpen(false)}
        onViewCertificate={cert => onOpenCertificate(cert)}
      />
    </div>
  );
}
