import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  Tag, 
  Search,
  Lock,
  X
} from 'lucide-react';
import type { NoteResource } from '../../types.ts';
import { useStudentAuth } from '../../context/StudentAuthContext.tsx';
import { useToast } from '../Toast.tsx';

interface NotesStoreProps {
  onPurchaseNote: (note: NoteResource) => void;
}

export function NotesStore({ onPurchaseNote }: NotesStoreProps) {
  const { notesStore, student } = useStudentAuth();
  const { success } = useToast();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewNote, setPreviewNote] = useState<NoteResource | null>(null);

  const categories = ['All', 'Python', 'Robotics', 'Linux & Security', 'Web Dev', 'DSA'];

  const filteredNotes = notesStore.filter(note => {
    const matchesCat = selectedCategory === 'All' || note.category === selectedCategory;
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleDownload = (note: NoteResource) => {
    success(`Downloading "${note.title}" PDF handbook!`);
  };

  return (
    <div className="space-y-8">
      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
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

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search notes & handbooks..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/60"
          />
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map(note => {
          const isPurchased = note.price === 0 || student?.purchasedNoteIds.includes(note.id);

          return (
            <div
              key={note.id}
              className="flex flex-col justify-between p-6 rounded-3xl bg-neutral-900/50 border border-neutral-800/80 hover:border-cyan-500/40 transition-all duration-300 shadow-lg"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-cyan-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold uppercase bg-neutral-950 text-cyan-400 border border-neutral-800">
                      {note.category}
                    </span>
                    <p className="text-[11px] font-mono text-neutral-500 mt-1">
                      {note.pagesCount} Pages PDF
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-neutral-100 line-clamp-2">
                    {note.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed line-clamp-3">
                    {note.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {note.tags.map(t => (
                    <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-950 text-neutral-400 border border-neutral-800">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action bar */}
              <div className="pt-6 mt-4 border-t border-neutral-800 flex items-center justify-between gap-3">
                <div>
                  {note.price === 0 ? (
                    <span className="text-xs font-bold font-mono text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      FREE
                    </span>
                  ) : (
                    <span className="text-base font-bold font-mono text-neutral-100">
                      ₹{note.price}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewNote(note)}
                    title="Preview Notes"
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {isPurchased ? (
                    <button
                      onClick={() => handleDownload(note)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onPurchaseNote(note)}
                      className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-mono font-bold transition-all shadow-md flex items-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Unlock Notes</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Snippet Modal */}
      {previewNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div 
            className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-neutral-100">{previewNote.title}</h3>
              </div>
              <button onClick={() => setPreviewNote(null)} className="p-1 text-neutral-400 hover:text-neutral-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono text-neutral-400 uppercase">Excerpt & Code Preview:</span>
              <pre className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-mono text-cyan-300 overflow-x-auto whitespace-pre-wrap">
                {previewNote.previewSnippet}
              </pre>
            </div>

            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-400">{previewNote.pagesCount} Pages Full Handbook</span>
              <button
                onClick={() => {
                  setPreviewNote(null);
                  onPurchaseNote(previewNote);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-bold font-mono"
              >
                {previewNote.price === 0 ? 'Download Free' : `Unlock Full PDF (₹${previewNote.price})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
