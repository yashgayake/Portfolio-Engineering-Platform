import React, { useRef, useState, useEffect } from 'react';
import { X, Calendar, Clock, Tag, Share2, ArrowLeft } from 'lucide-react';
import Markdown from 'react-markdown';
import type { Article } from '../types.ts';
import { useToast } from './Toast.tsx';

interface ArticleViewModalProps {
  article: Article | null;
  onClose: () => void;
}

export function ArticleViewModal({ article, onClose }: ArticleViewModalProps) {
  const { success } = useToast();
  const readerRef = useRef<HTMLDivElement>(null);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    setReadingProgress(0);
  }, [article?.id]);

  const handleScroll = () => {
    if (!readerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = readerRef.current;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 0) {
      setReadingProgress(100);
      return;
    }
    const current = Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
    setReadingProgress(current);
  };

  if (!article) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      success('Article link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-neutral-950/85 backdrop-blur-md overflow-y-auto">
      {/* Top viewport scroll progress indicator during active article reading */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-neutral-900/60 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-teal-300 shadow-[0_0_12px_rgba(6,182,212,0.8)] transition-[width] duration-100 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
        {readingProgress > 0 && readingProgress < 100 && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_10px_#38bdf8] -ml-1 transition-[left] duration-100 ease-out"
            style={{ left: `${readingProgress}%` }}
          />
        )}
      </div>

      <div 
        className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Navigation top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-neutral-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Articles</span>
            </button>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {Math.round(readingProgress)}% Read
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              title="Share article"
              className="p-2 rounded-lg text-neutral-400 hover:text-cyan-400 hover:bg-neutral-800 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Reader */}
        <div 
          ref={readerRef}
          onScroll={handleScroll}
          className="p-6 sm:p-10 overflow-y-auto space-y-8"
        >
          {/* Category & Metadata */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-md text-xs font-mono font-semibold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {article.category}
              </span>
              <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{article.publishedDate}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400/80" />
                  <span>{article.readingTimeMinutes} min read</span>
                </span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-100 tracking-tight leading-tight">
              {article.title}
            </h1>

            <p className="text-base text-neutral-300 italic border-l-2 border-cyan-500/40 pl-4 py-1 leading-relaxed">
              {article.excerpt}
            </p>
          </div>

          {/* Cover image if available */}
          {article.coverImage && (
            <div className="rounded-xl overflow-hidden border border-neutral-800 aspect-[21/9] w-full bg-neutral-950">
              <img
                src={article.coverImage}
                alt={article.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Body Rendered with React-Markdown */}
          <div className="pt-4 border-t border-neutral-800/80">
            <div className="markdown-body prose prose-invert max-w-none text-neutral-300 text-sm sm:text-base leading-relaxed space-y-4">
              <Markdown>
                {article.content}
              </Markdown>
            </div>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-6 border-t border-neutral-800/80">
              <div className="flex items-center gap-2 mb-3 text-xs font-mono text-neutral-400 uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5 text-cyan-400" />
                <span>Article Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-xs font-mono bg-neutral-950 border border-neutral-800 text-neutral-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
