import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Play, 
  Award, 
  FileText, 
  Download, 
  ExternalLink, 
  Sparkles, 
  Youtube,
  BookOpen,
  Share2,
  Clock,
  ChevronRight,
  Code2,
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import type { Course, Lecture } from '../../types.ts';
import { useStudentAuth } from '../../context/StudentAuthContext.tsx';
import { useToast } from '../Toast.tsx';
import { InteractiveCodePlayground } from './InteractiveCodePlayground.tsx';
import { StudentQuizModal } from './StudentQuizModal.tsx';
import { LectureDiscussionForum } from './LectureDiscussionForum.tsx';
import { soundFx } from '../../lib/soundFx.ts';

interface CoursePlayerViewProps {
  course: Course;
  onBack: () => void;
  onOpenCertificate: () => void;
}

export function CoursePlayerView({ course, onBack, onOpenCertificate }: CoursePlayerViewProps) {
  const { 
    isLectureCompleted, 
    toggleLectureCompletion, 
    getCourseProgress,
    student
  } = useStudentAuth();
  const { success, error: toastError } = useToast();

  const [activeLectureId, setActiveLectureId] = useState<string>(
    course.lectures[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'overview' | 'playground' | 'notes' | 'resources' | 'discussion'>('overview');
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const progress = getCourseProgress(course.id);
  const activeLecture = course.lectures.find(l => l.id === activeLectureId) || course.lectures[0];

  const handleToggleCurrent = () => {
    soundFx.playClick();
    if (!student) {
      toastError('Please sign in or create an account to save progress and earn your certificate in your name.');
      onOpenCertificate();
      return;
    }
    if (!activeLecture) return;
    const wasCompleted = isLectureCompleted(course.id, activeLecture.id);
    toggleLectureCompletion(course.id, activeLecture.id);
    if (!wasCompleted) {
      soundFx.playSuccess();
      success(`Marked "${activeLecture.title}" as completed!`);
    }
  };

  const handleNextLecture = () => {
    soundFx.playClick();
    const currentIndex = course.lectures.findIndex(l => l.id === activeLectureId);
    if (currentIndex < course.lectures.length - 1) {
      setActiveLectureId(course.lectures[currentIndex + 1].id);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 pb-16">
      {/* Top Learning Navigation Bar */}
      <div className="sticky top-0 z-30 bg-neutral-950/90 border-b border-neutral-800 backdrop-blur-md px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Back button & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              id="player-back-btn"
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-100 border border-neutral-800 transition-colors flex items-center gap-1.5 text-xs font-mono"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">All Courses</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {course.category}
                </span>
                <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
                  Taught by {course.instructorName}
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-neutral-100 line-clamp-1 mt-0.5">
                {course.title}
              </h1>
            </div>
          </div>

          {/* Real-time Progress Bar & Certificate CTA */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-neutral-400">Course Progress:</span>
                <span className={`font-bold ${progress.isComplete ? 'text-emerald-400' : 'text-cyan-400'}`}>
                  {progress.percentage}%
                </span>
                <span className="text-neutral-500 text-[11px]">
                  ({progress.completedCount}/{progress.totalCount} completed)
                </span>
              </div>
              <div className="w-40 sm:w-56 h-2 rounded-full bg-neutral-900 overflow-hidden mt-1 border border-neutral-800">
                <div 
                  className={`h-full transition-all duration-500 ${
                    progress.isComplete 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                  }`}
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </div>

            {/* Certificate Button (Active or unlocked) */}
            {progress.isComplete ? (
              <button
                onClick={onOpenCertificate}
                id="player-claim-cert-btn"
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(251,191,36,0.35)] animate-pulse"
              >
                <Award className="w-4 h-4" />
                <span>View Certificate</span>
              </button>
            ) : (
              <button
                onClick={onOpenCertificate}
                title="Complete all lectures to unlock verified certificate"
                className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200 text-xs font-mono transition-colors flex items-center gap-1.5"
              >
                <Award className="w-4 h-4 text-neutral-500" />
                <span className="hidden sm:inline">Certificate ({progress.percentage}%)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 100% Completion Milestone Banner */}
      {progress.isComplete && (
        <div className="bg-gradient-to-r from-emerald-950/80 via-cyan-950/60 to-emerald-950/80 border-b border-emerald-500/30 py-3.5 px-4 animate-in fade-in">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-100">
                  🎉 100% Course Completed! Congratulations, {student?.name || 'Learner'}!
                </p>
                <p className="text-xs text-neutral-300 font-mono">
                  You have successfully finished all video lectures and technical milestones.
                </p>
              </div>
            </div>
            <button
              onClick={onOpenCertificate}
              className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-neutral-950 text-xs font-bold font-mono transition-all shadow-md shrink-0"
            >
              Open & Print Certificate
            </button>
          </div>
        </div>
      )}

      {/* Main Classroom Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Responsive Video Player (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* 16:9 Video Frame */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl">
              {activeLecture ? (
                <iframe
                  key={activeLecture.youtubeVideoId}
                  src={`https://www.youtube-nocookie.com/embed/${activeLecture.youtubeVideoId}?rel=0&autoplay=0&enablejsapi=1`}
                  title={activeLecture.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                  <Play className="w-12 h-12 text-cyan-400/50 mb-2" />
                  <p className="text-xs font-mono text-neutral-400">Select a lecture to begin streaming</p>
                </div>
              )}
            </div>

            {/* Lecture Action Toolbar */}
            {activeLecture && (
              <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-1">
                    <span className="text-cyan-400 font-bold">Lecture #{activeLecture.orderIndex}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {activeLecture.durationMinutes} mins
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-neutral-100">
                    {activeLecture.title}
                  </h2>
                </div>

                {/* Tick Mark & Next Lecture Controls */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={handleToggleCurrent}
                    id={`toggle-complete-btn-${activeLecture.id}`}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono border transition-all ${
                      isLectureCompleted(course.id, activeLecture.id)
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25'
                        : 'bg-neutral-800/80 border-neutral-700 text-neutral-300 hover:border-cyan-500/60 hover:text-cyan-400'
                    }`}
                  >
                    {isLectureCompleted(course.id, activeLecture.id) ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
                        <span>Completed (Tick Mark)</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4 text-neutral-400" />
                        <span>Mark as Complete</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleNextLecture}
                    id="player-next-lecture-btn"
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors"
                    title="Next Lecture"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Lecture Tabs: Overview / Code Simulator / Notes / Resources / Q&A Discussion */}
            <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800">
              <div className="flex border-b border-neutral-800 gap-2 sm:gap-4 mb-4 overflow-x-auto pb-1">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setActiveTab('overview');
                  }}
                  className={`pb-2.5 text-xs font-mono uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
                    activeTab === 'overview'
                      ? 'border-cyan-400 text-cyan-400 font-bold'
                      : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setActiveTab('playground');
                  }}
                  className={`pb-2.5 text-xs font-mono uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'playground'
                      ? 'border-cyan-400 text-cyan-400 font-bold'
                      : 'border-transparent text-cyan-400/70 hover:text-cyan-300'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Code Simulator</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                </button>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setActiveTab('notes');
                  }}
                  className={`pb-2.5 text-xs font-mono uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
                    activeTab === 'notes'
                      ? 'border-cyan-400 text-cyan-400 font-bold'
                      : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Notes & Diagrams
                </button>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setActiveTab('resources');
                  }}
                  className={`pb-2.5 text-xs font-mono uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${
                    activeTab === 'resources'
                      ? 'border-cyan-400 text-cyan-400 font-bold'
                      : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Cheat-Sheets ({course.notes.length})
                </button>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setActiveTab('discussion');
                  }}
                  className={`pb-2.5 text-xs font-mono uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'discussion'
                      ? 'border-cyan-400 text-cyan-400 font-bold'
                      : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Doubt Forum</span>
                </button>
              </div>

              {/* Tab Contents */}
              {activeTab === 'overview' && (
                <div className="space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  <p>{activeLecture?.description || course.description}</p>
                  
                  {/* Assessment Banner */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-neutral-900 to-cyan-950/40 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-100 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-cyan-400" />
                        <span>Ready for Knowledge Assessment?</span>
                      </h4>
                      <p className="text-xs font-mono text-neutral-400 mt-0.5">
                        Take the 5-question robotics test to verify your skills and unlock distinction honors.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        setIsQuizOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs font-mono transition-all flex items-center gap-1.5 shrink-0 shadow-lg shadow-cyan-500/20 active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Take 5-Question Quiz</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 text-xs font-mono space-y-2">
                    <p className="text-cyan-400 font-semibold uppercase">Student Learning Tip:</p>
                    <p className="text-neutral-400">
                      Open the <strong className="text-cyan-300">Code Simulator</strong> tab above to run Arduino, Python 3, and C++ PID algorithms in real-time while watching the lecture.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'playground' && (
                <div className="pt-1">
                  <InteractiveCodePlayground />
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 whitespace-pre-wrap text-neutral-200 leading-relaxed">
                    {activeLecture?.notesMarkdown || '# Lecture Notes\nCode snippets, sensor diagrams, and pinout schematics are included with this lecture.'}
                  </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="space-y-3">
                  {course.notes.map(noteItem => (
                    <div 
                      key={noteItem.id}
                      className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-neutral-100">{noteItem.title}</h4>
                          <p className="text-[11px] font-mono text-neutral-400">{noteItem.pagesCount} Pages PDF Reference Guide</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          soundFx.playSuccess();
                          success('Starting download for course notes PDF...');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-cyan-400 text-xs font-mono border border-neutral-800 transition-colors flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'discussion' && (
                <div className="pt-1">
                  <LectureDiscussionForum lectureTitle={activeLecture?.title || course.title} />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Lecture Playlist with Tick Marks (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 overflow-hidden">
              {/* Playlist Header */}
              <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-neutral-100">
                    Course Syllabus
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-neutral-400">
                  {progress.completedCount}/{course.lectures.length} Done
                </span>
              </div>

              {/* Playlist items */}
              <div className="divide-y divide-neutral-800/80 max-h-[600px] overflow-y-auto">
                {course.lectures.map((lecture, idx) => {
                  const completed = isLectureCompleted(course.id, lecture.id);
                  const isCurrent = lecture.id === activeLectureId;

                  return (
                    <div
                      key={lecture.id}
                      id={`playlist-item-${lecture.id}`}
                      className={`p-3.5 transition-colors flex items-start gap-3 cursor-pointer ${
                        isCurrent 
                          ? 'bg-cyan-500/10 border-l-2 border-cyan-400' 
                          : 'hover:bg-neutral-800/40'
                      }`}
                      onClick={() => setActiveLectureId(lecture.id)}
                    >
                      {/* Checkbox / Tick Mark Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLectureCompletion(course.id, lecture.id);
                        }}
                        title={completed ? 'Completed (Click to uncheck)' : 'Click to mark complete'}
                        className="mt-0.5 shrink-0 text-neutral-400 hover:text-emerald-400 transition-colors"
                      >
                        {completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
                        ) : (
                          <Circle className="w-4 h-4 text-neutral-600 hover:text-cyan-400" />
                        )}
                      </button>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className={`text-[10px] font-mono ${isCurrent ? 'text-cyan-400 font-bold' : 'text-neutral-500'}`}>
                            Lecture #{idx + 1}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {lecture.durationMinutes}m
                          </span>
                        </div>
                        <h4 className={`text-xs font-semibold line-clamp-2 leading-snug ${
                          isCurrent ? 'text-cyan-300 font-bold' : (completed ? 'text-neutral-400 line-through' : 'text-neutral-200')
                        }`}>
                          {lecture.title}
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Course YouTube Channel Link */}
              <div className="p-3.5 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs font-mono">
                <a
                  href={course.youtubePlaylistUrl || 'https://www.youtube.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-colors"
                >
                  <Youtube className="w-4 h-4" />
                  <span>Subscribe on YouTube</span>
                </a>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Student Quiz Assessment Modal */}
      <StudentQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        courseTitle={course.title}
        onPassQuiz={(score, total) => {
          if (score >= 4) {
            success(`Quiz passed with ${score}/${total}! Generating certificate...`);
            setTimeout(() => {
              setIsQuizOpen(false);
              onOpenCertificate();
            }, 1200);
          }
        }}
      />
    </div>
  );
}
