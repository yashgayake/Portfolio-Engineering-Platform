import React from 'react';
import { 
  Youtube, 
  Sparkles, 
  CheckCircle2, 
  Award, 
  BookOpen, 
  Play, 
  ArrowRight,
  TrendingUp,
  Download
} from 'lucide-react';

interface AcademyHeroProps {
  onExploreCourses: () => void;
  onExploreNotes: () => void;
}

export function AcademyHero({ onExploreCourses, onExploreNotes }: AcademyHeroProps) {
  return (
    <div className="relative overflow-hidden py-12 lg:py-16 border-b border-neutral-800 bg-neutral-950">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-64 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute top-10 right-10 w-48 h-48 bg-rose-500/10 blur-[80px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Heading & Value Proposition (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>ENGINEERING LECTURES & CERTIFICATION HUB</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-100 tracking-tight leading-[1.15]">
              Practical Engineering Lectures,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400">
                Robotics & Code Mastery
              </span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl">
              Welcome to the student learning platform. Watch comprehensive video lectures, download lecture notes and code blueprints, check off lectures as you complete them, and earn verified certificates of completion in your own name.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreCourses}
                id="hero-explore-courses-btn"
                className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs sm:text-sm font-bold font-mono transition-all shadow-lg hover:shadow-cyan-500/20 flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Browse All Courses</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreNotes}
                id="hero-explore-notes-btn"
                className="px-5 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 text-xs sm:text-sm font-mono transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>PDF Lecture Notes</span>
              </button>

              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 text-xs sm:text-sm font-mono transition-colors flex items-center gap-2"
              >
                <Youtube className="w-4 h-4" />
                <span>Subscribe on YouTube</span>
              </a>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-neutral-900">
              <div className="p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/80">
                <div className="text-xs font-bold text-neutral-100 flex items-center gap-1.5 mb-0.5">
                  <Play className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Free Demos</span>
                </div>
                <p className="text-[11px] text-neutral-400 font-mono">Curated video lectures</p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/80">
                <div className="text-xs font-bold text-neutral-100 flex items-center gap-1.5 mb-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tick Marks</span>
                </div>
                <p className="text-[11px] text-neutral-400 font-mono">Real-time progress %</p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/80">
                <div className="text-xs font-bold text-neutral-100 flex items-center gap-1.5 mb-0.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Certificates</span>
                </div>
                <p className="text-[11px] text-neutral-400 font-mono">Generated at 100%</p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/80">
                <div className="text-xs font-bold text-neutral-100 flex items-center gap-1.5 mb-0.5">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Fair Pricing</span>
                </div>
                <p className="text-[11px] text-neutral-400 font-mono">Free & Student rates</p>
              </div>
            </div>
          </div>

          {/* Right Column: YouTube & Student Card Preview (5 cols) */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-3xl bg-neutral-900/70 border border-neutral-800 shadow-2xl relative overflow-hidden backdrop-blur-sm space-y-4">
              {/* Channel Header */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <Youtube className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-100">
                    Yash Gayake Lectures
                  </h3>
                  <p className="text-xs font-mono text-neutral-400">
                    Robotics • Python Automation • Linux
                  </p>
                </div>
              </div>

              {/* Video Preview Card */}
              <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 aspect-video relative group">
                <img
                  src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80"
                  alt="Video thumbnail"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-neutral-950/40 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 right-2 p-2 rounded-xl bg-neutral-950/80 backdrop-blur-md border border-neutral-800 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-neutral-200 truncate">Python for Automation & Hardware</span>
                  <span className="text-cyan-400 font-bold shrink-0">FREE DEMO</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-mono text-neutral-400">
                <span>Free videos available now</span>
                <span className="text-emerald-400 font-semibold">● Instant Student Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
