import React, { useState } from 'react';
import { X, Send, FolderGit2, Globe, FileCode2, Sparkles, AlertCircle } from 'lucide-react';
import { useStudentAuth } from '../../context/StudentAuthContext.tsx';
import type { Course } from '../../types.ts';

interface SubmitWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onWorkSubmitted?: () => void;
}

export function SubmitWorkModal({
  isOpen,
  onClose,
  courses,
  onWorkSubmitted
}: SubmitWorkModalProps) {
  const { student, submitStudentWork } = useStudentAuth();
  
  const [courseId, setCourseId] = useState<string>(courses[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMsg('Please provide a project title and description.');
      return;
    }

    const selectedCourse = courses.find(c => c.id === courseId);
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await submitStudentWork({
        courseId: selectedCourse?.id || 'general-engineering',
        courseTitle: selectedCourse?.title || 'General Engineering Project',
        title: title.trim(),
        description: description.trim(),
        projectUrl: projectUrl.trim() || undefined,
        repoUrl: repoUrl.trim() || undefined,
        previewImageUrl: previewImageUrl.trim() || undefined
      });

      setSuccessMsg('Project work submitted successfully to Yash Gayake for review!');
      if (onWorkSubmitted) onWorkSubmitted();
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
        setTitle('');
        setDescription('');
        setProjectUrl('');
        setRepoUrl('');
        setPreviewImageUrl('');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit work. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
      <div 
        id="submit-work-modal"
        className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-100">Submit Project Work</h3>
              <p className="text-xs text-neutral-400 font-mono">
                Stored in Firestore & reviewed by Yash Gayake
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div>
            <label className="block text-neutral-300 mb-1 font-semibold">
              Associated Course *
            </label>
            <select
              value={courseId}
              onChange={e => setCourseId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-cyan-500 transition-colors"
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-neutral-300 mb-1 font-semibold">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Autonomous Maze Solving Robot or Python Network Scanner"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-300 mb-1 font-semibold flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Live Demo URL</span>
              </label>
              <input
                type="url"
                value={projectUrl}
                onChange={e => setProjectUrl(e.target.value)}
                placeholder="https://myproject.app"
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-neutral-300 mb-1 font-semibold flex items-center gap-1.5">
                <FileCode2 className="w-3.5 h-3.5 text-amber-400" />
                <span>GitHub Repository URL</span>
              </label>
              <input
                type="url"
                value={repoUrl}
                onChange={e => setRepoUrl(e.target.value)}
                placeholder="https://github.com/user/repo"
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-300 mb-1 font-semibold">
              Project Screenshot / Cover Image URL (Optional)
            </label>
            <input
              type="url"
              value={previewImageUrl}
              onChange={e => setPreviewImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/... or image link"
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-neutral-300 mb-1 font-semibold">
              Project Description & Implementation Details *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Explain how you built this, key hardware/software tools used, and what challenges you overcame..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Saving to Database...' : 'Submit to Yash'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
