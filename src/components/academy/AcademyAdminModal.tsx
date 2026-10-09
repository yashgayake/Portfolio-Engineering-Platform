import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Youtube, 
  DollarSign, 
  BookOpen, 
  CheckCircle2, 
  ShieldCheck,
  Video
} from 'lucide-react';
import type { Course, Lecture } from '../../types.ts';
import { useStudentAuth } from '../../context/StudentAuthContext.tsx';
import { useToast } from '../Toast.tsx';

interface AcademyAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AcademyAdminModal({ isOpen, onClose }: AcademyAdminModalProps) {
  const { courses, updateCourse, addCourse, deleteCourse } = useStudentAuth();
  const { success, error: toastError } = useToast();

  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');

  // Form state for creating a new course
  const [newTitle, setNewTitle] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newCategory, setNewCategory] = useState<Course['category']>('Robotics & Automation');
  const [newPrice, setNewPrice] = useState<number>(499);
  const [newOriginalPrice, setNewOriginalPrice] = useState<number>(1499);
  const [newYoutubeVideoId, setNewYoutubeVideoId] = useState('gfDE2a7MKjA'); // default sample
  const [newThumbnail, setNewThumbnail] = useState('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80');

  // Editing existing course
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editYoutubeVideoId, setEditYoutubeVideoId] = useState<string>('');
  const [editTitle, setEditTitle] = useState<string>('');

  if (!isOpen) return null;

  const handleStartEdit = (c: Course) => {
    setEditingCourseId(c.id);
    setEditPrice(c.price);
    setEditYoutubeVideoId(c.previewYoutubeVideoId);
    setEditTitle(c.title);
  };

  const handleSaveEdit = (c: Course) => {
    updateCourse({
      ...c,
      title: editTitle,
      price: Number(editPrice),
      previewYoutubeVideoId: editYoutubeVideoId
    });
    setEditingCourseId(null);
    success(`Updated course details for "${editTitle}"!`);
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toastError('Course title is required');
      return;
    }

    const created: Course = {
      id: `course-${Date.now()}`,
      title: newTitle.trim(),
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      tagline: newTagline || 'Hands-on technical curriculum taught by Yash Gayake.',
      description: 'Comprehensive video lectures and downloadable reference notes.',
      instructorName: 'Yash Gayake',
      instructorTitle: 'Automation & Robotics Student',
      category: newCategory,
      level: 'All Levels',
      price: Number(newPrice),
      originalPrice: Number(newOriginalPrice),
      thumbnail: newThumbnail || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      previewYoutubeVideoId: newYoutubeVideoId || 'gfDE2a7MKjA',
      youtubePlaylistUrl: 'https://www.youtube.com',
      tags: [newCategory, 'Engineering', 'Tutorials'],
      featured: true,
      studentsCount: 1,
      rating: 5.0,
      reviewsCount: 1,
      certificateOffered: true,
      updatedAt: 'September 2026',
      notes: [],
      lectures: [
        {
          id: `lec-${Date.now()}-01`,
          title: '01. Introduction & Environment Setup',
          durationMinutes: 20,
          youtubeVideoId: newYoutubeVideoId || 'gfDE2a7MKjA',
          orderIndex: 1,
          freePreview: true
        }
      ]
    };

    addCourse(created);
    success(`Course "${created.title}" successfully published!`);
    setActiveTab('list');
    setNewTitle('');
    setNewTagline('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-100">
                Course & Pricing Administration
              </h3>
              <p className="text-[11px] font-mono text-neutral-400">
                Manage YouTube video tutorials, set prices, and configure course curriculum
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 pt-4 shrink-0">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-colors ${
              activeTab === 'list'
                ? 'bg-neutral-800 text-cyan-400 font-bold border border-neutral-700'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Manage Courses ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono transition-colors ${
              activeTab === 'add'
                ? 'bg-neutral-800 text-cyan-400 font-bold border border-neutral-700'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Course</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="py-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'list' ? (
            <div className="space-y-4">
              {courses.map(course => {
                const isEditing = editingCourseId === course.id;

                return (
                  <div
                    key={course.id}
                    className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editTitle}
                            onChange={e => setEditTitle(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs font-bold text-neutral-100 mb-2"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                              {course.category}
                            </span>
                            <h4 className="text-sm font-bold text-neutral-100">{course.title}</h4>
                          </div>
                        )}
                        <p className="text-xs text-neutral-400 mt-1 font-mono">
                          {course.lectures.length} Lectures • YouTube Demo ID: <span className="text-cyan-400">{course.previewYoutubeVideoId}</span>
                        </p>
                      </div>

                      {/* Pricing & Actions */}
                      <div className="flex items-center gap-3 shrink-0">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 bg-neutral-900 px-2 py-1 rounded-lg border border-neutral-700">
                              <span className="text-xs text-neutral-400 font-mono">₹</span>
                              <input
                                type="number"
                                value={editPrice}
                                onChange={e => setEditPrice(Number(e.target.value))}
                                className="w-16 bg-transparent text-xs font-mono text-neutral-100 focus:outline-none"
                              />
                            </div>
                            <button
                              onClick={() => handleSaveEdit(course)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500 text-neutral-950 text-xs font-mono font-bold flex items-center gap-1"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Save</span>
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-mono font-bold text-neutral-200">
                              {course.price === 0 ? 'FREE' : `₹${course.price}`}
                            </span>
                            <button
                              onClick={() => handleStartEdit(course)}
                              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 transition-colors"
                              title="Edit price and YouTube video"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete course "${course.title}"?`)) {
                                  deleteCourse(course.id);
                                  success('Course removed.');
                                }
                              }}
                              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-rose-400 transition-colors"
                              title="Delete Course"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Edit Video ID if active */}
                    {isEditing && (
                      <div className="pt-3 border-t border-neutral-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                        <div>
                          <label className="block text-[11px] text-neutral-400 mb-1">
                            YouTube Video ID (e.g. from YouTube URL):
                          </label>
                          <input
                            type="text"
                            value={editYoutubeVideoId}
                            onChange={e => setEditYoutubeVideoId(e.target.value)}
                            placeholder="gfDE2a7MKjA"
                            className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-neutral-100"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Add Course Form */
            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 uppercase mb-1">Course Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arduino & Microcontrollers Masterclass"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-cyan-500/60"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 uppercase mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-cyan-500/60"
                  >
                    <option value="Robotics & Automation">Robotics & Automation</option>
                    <option value="Python">Python</option>
                    <option value="Linux & DevOps">Linux & DevOps</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="DSA">DSA</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 uppercase mb-1">Tagline</label>
                <input
                  type="text"
                  placeholder="Master sensors, motor control and autonomous algorithms."
                  value={newTagline}
                  onChange={e => setNewTagline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-cyan-500/60"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-400 uppercase mb-1">Price (₹ INR, 0 for Free)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={e => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-cyan-500/60"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 uppercase mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={newOriginalPrice}
                    onChange={e => setNewOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-cyan-500/60"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 uppercase mb-1">Demo YouTube Video ID</label>
                  <input
                    type="text"
                    placeholder="gfDE2a7MKjA"
                    value={newYoutubeVideoId}
                    onChange={e => setNewYoutubeVideoId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-cyan-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 uppercase mb-1">Cover Image / Thumbnail URL</label>
                <input
                  type="text"
                  value={newThumbnail}
                  onChange={e => setNewThumbnail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-cyan-500/60"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-bold font-mono transition-all shadow-md"
                >
                  Publish New Course
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
