import React, { useState } from 'react';
import { 
  Search, 
  Play, 
  Award, 
  Clock, 
  BookOpen, 
  Users, 
  Star, 
  CheckCircle2, 
  Sparkles,
  Zap,
  Filter
} from 'lucide-react';
import type { Course } from '../../types.ts';
import { useStudentAuth } from '../../context/StudentAuthContext.tsx';

interface CourseCatalogProps {
  onSelectCourse: (course: Course) => void;
  onEnrollCourse: (course: Course) => void;
}

export function CourseCatalog({ onSelectCourse, onEnrollCourse }: CourseCatalogProps) {
  const { courses, student, getCourseProgress } = useStudentAuth();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [pricingFilter, setPricingFilter] = useState<'All' | 'Free' | 'Paid'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Python', 'Robotics & Automation', 'Linux & DevOps', 'Web Development'];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesPricing = 
      pricingFilter === 'All' ||
      (pricingFilter === 'Free' && course.price === 0) ||
      (pricingFilter === 'Paid' && course.price > 0);
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesPricing && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 font-bold'
                  : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Pricing toggle & Search */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-neutral-950 p-1 border border-neutral-800 shrink-0">
            {(['All', 'Free', 'Paid'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPricingFilter(p)}
                className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-colors ${
                  pricingFilter === p ? 'bg-neutral-800 text-neutral-100 font-bold' : 'text-neutral-400'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search lectures & topics..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/60 font-sans"
            />
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => {
          const isEnrolled = student?.enrolledCourseIds.includes(course.id);
          const progress = getCourseProgress(course.id);
          const totalDuration = course.lectures.reduce((acc, l) => acc + l.durationMinutes, 0);

          return (
            <div
              key={course.id}
              className="group relative flex flex-col justify-between rounded-3xl bg-neutral-900/50 border border-neutral-800/80 hover:border-cyan-500/40 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-cyan-500/5 flex-1"
            >
              <div>
                {/* Thumbnail & Video Badge */}
                <div 
                  className="relative aspect-video w-full bg-neutral-950 overflow-hidden cursor-pointer"
                  onClick={() => onSelectCourse(course)}
                >
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />

                  {/* Overlays */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold uppercase bg-neutral-950/90 text-cyan-400 border border-neutral-700/80 backdrop-blur-md">
                      {course.category}
                    </span>
                    {course.featured && (
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-semibold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-neutral-300">
                    <span className="flex items-center gap-1 bg-neutral-950/80 px-2 py-0.5 rounded border border-neutral-800 backdrop-blur-sm">
                      <BookOpen className="w-3 h-3 text-cyan-400" />
                      {course.lectures.length} Lectures
                    </span>
                    <span className="flex items-center gap-1 bg-neutral-950/80 px-2 py-0.5 rounded border border-neutral-800 backdrop-blur-sm">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {Math.round(totalDuration / 60)}h {totalDuration % 60}m
                    </span>
                  </div>

                  {/* Hover play icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-950/30">
                    <div className="p-3 rounded-full bg-cyan-400 text-neutral-950 shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs font-mono">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-bold">{course.rating}</span>
                      <span className="text-neutral-500 text-[10px]">({course.reviewsCount})</span>
                    </div>
                    <span className="text-neutral-500 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {course.studentsCount} Students
                    </span>
                  </div>

                  <h3 
                    onClick={() => onSelectCourse(course)}
                    className="text-base font-bold text-neutral-100 group-hover:text-cyan-400 transition-colors line-clamp-2 cursor-pointer"
                  >
                    {course.title}
                  </h3>

                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {course.tagline}
                  </p>

                  {/* Progress bar if enrolled */}
                  {isEnrolled && (
                    <div className="p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-neutral-400">Your Progress</span>
                        <span className={`font-bold ${progress.isComplete ? 'text-emerald-400' : 'text-cyan-400'}`}>
                          {progress.percentage}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-neutral-900 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            progress.isComplete ? 'bg-emerald-400' : 'bg-cyan-400'
                          }`}
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Certificate indicator */}
                  {course.certificateOffered && (
                    <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400/90 pt-1">
                      <Award className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Verified Certificate on Completion</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer: Price & Enroll CTA */}
              <div className="p-6 pt-0 border-t border-neutral-800/80 mt-4 flex items-center justify-between gap-3">
                <div>
                  {course.price === 0 ? (
                    <span className="text-sm font-bold font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      FREE
                    </span>
                  ) : (
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-bold font-mono text-neutral-100">
                        ₹{course.price}
                      </span>
                      {course.originalPrice && (
                        <span className="text-xs font-mono text-neutral-500 line-through">
                          ₹{course.originalPrice}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {isEnrolled ? (
                  <button
                    onClick={() => onSelectCourse(course)}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-md"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{progress.percentage > 0 ? 'Resume Course' : 'Start Learning'}</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectCourse(course)}
                      className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono transition-colors"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => onEnrollCourse(course)}
                      className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-bold font-mono transition-all shadow-md"
                    >
                      {course.price === 0 ? 'Enroll Free' : 'Enroll Now'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-3">
          <BookOpen className="w-10 h-10 text-neutral-500 mx-auto" />
          <h3 className="text-base font-bold text-neutral-200">No courses match your filter</h3>
          <p className="text-xs text-neutral-400 font-mono">Try searching with a different keyword or topic.</p>
        </div>
      )}
    </div>
  );
}
