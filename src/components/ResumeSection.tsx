import React, { useState } from 'react';
import { FileText, Download, ExternalLink, Calendar, CheckCircle2, Shield, Eye, X } from 'lucide-react';
import type { SiteSettings } from '../types.ts';
import { api } from '../lib/api.ts';

interface ResumeSectionProps {
  settings: SiteSettings;
  isOpenModal?: boolean;
  onCloseModal?: () => void;
}

export function ResumeSection({ settings, isOpenModal, onCloseModal }: ResumeSectionProps) {
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

  const resumeUrl = settings.resumeUrl || '';
  const hasResume = Boolean(resumeUrl);

  const handleDownload = () => {
    api.trackEvent('resume_download', '/resume', { action: 'download' });
    if (hasResume) {
      window.open(resumeUrl, '_blank');
    } else {
      // Fallback: trigger print or downloadable structured summary
      window.print();
    }
  };

  const content = (
    <div className="p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 backdrop-blur-sm max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-800/80">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
              CURRICULUM VITAE
            </span>
          </div>
          <h3 className="text-2xl font-bold text-neutral-100">
            {settings.name || 'Yash Gayake'} — Engineering Resume
          </h3>
          <p className="text-xs font-mono text-neutral-400 mt-1 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-neutral-500" />
            <span>Last Updated: {settings.resumeLastUpdated || 'September 2026'}</span>
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            id="resume-view-preview-btn"
            onClick={() => setShowPreviewModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold border border-neutral-800 transition-colors"
          >
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>View Resume</span>
          </button>

          <button
            id="resume-download-btn"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-semibold transition-all shadow-md shadow-cyan-500/20 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Structured Resume Summary Preview Card */}
      <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
          <h4 className="text-xs font-mono uppercase text-neutral-400 font-semibold mb-2 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Education</span>
          </h4>
          <p className="text-xs font-semibold text-neutral-200">Automation & Robotics Engineering</p>
          <p className="text-[11px] text-neutral-400 mt-0.5">B.Tech / Undergraduate Degree</p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
          <h4 className="text-xs font-mono uppercase text-neutral-400 font-semibold mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Core Strengths</span>
          </h4>
          <p className="text-xs text-neutral-300">Software Architecture, Embedded Systems, Linux Security, DevOps</p>
        </div>

        <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
          <h4 className="text-xs font-mono uppercase text-neutral-400 font-semibold mb-2 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Admin Managed</span>
          </h4>
          <p className="text-xs text-neutral-400">PDF document is securely stored and updated directly via Admin Dashboard</p>
        </div>
      </div>

      {/* Preview Modal if user clicks 'View Resume' */}
      {(showPreviewModal || isOpenModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Resume Document Preview</span>
              </h3>
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  if (onCloseModal) onCloseModal();
                }}
                className="p-1 text-neutral-400 hover:text-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-6 overflow-y-auto flex-1">
              {hasResume ? (
                <iframe
                  src={resumeUrl}
                  title="Resume Preview"
                  className="w-full h-96 rounded-lg border border-neutral-800"
                />
              ) : (
                <div className="p-8 rounded-xl bg-neutral-950 border border-neutral-800 text-center space-y-3">
                  <FileText className="w-12 h-12 text-cyan-400 mx-auto" />
                  <h4 className="text-sm font-semibold text-neutral-200">
                    PDF Document Ready for Admin Upload
                  </h4>
                  <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                    The resume file can be uploaded as a PDF in the Admin Dashboard under "Resume Settings". You can also print this live portfolio document directly.
                  </p>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-neutral-900 text-neutral-200 hover:text-cyan-400 text-xs font-mono border border-neutral-800"
                  >
                    Print Portfolio Summary
                  </button>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-neutral-800 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  if (onCloseModal) onCloseModal();
                }}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold hover:bg-neutral-700"
              >
                Close
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-neutral-950 text-xs font-semibold hover:bg-cyan-400"
              >
                Download File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isOpenModal) {
    return content;
  }

  return (
    <section id="resume" className="py-20 border-t border-neutral-900 bg-neutral-950/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content}
      </div>
    </section>
  );
}
