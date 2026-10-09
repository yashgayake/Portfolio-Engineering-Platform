import React from 'react';
import { X, Award, CheckCircle2, Download, Printer, ShieldCheck, Share2 } from 'lucide-react';
import type { Certificate } from '../../types.ts';
import { useToast } from '../Toast.tsx';

interface CertificateModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

export function CertificateModal({ certificate, onClose }: CertificateModalProps) {
  const { success } = useToast();

  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(certificate.verificationCode);
    success('Verification credential copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden my-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Controls */}
        <div className="flex items-center justify-between pb-6 border-b border-neutral-800/80 print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-neutral-100">Official Certificate of Completion</h3>
              <p className="text-[11px] font-mono text-neutral-400">Yash Gayake Engineering Academy</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              id="cert-print-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              id="cert-close-btn"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Frame */}
        <div className="mt-6 relative p-8 sm:p-12 rounded-2xl border-2 border-amber-500/30 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-center overflow-hidden shadow-inner">
          {/* Decorative Corner Accents */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-400/60" />
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-400/60" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-amber-400/60" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-amber-400/60" />

          {/* Golden Seal */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400/20 via-amber-500/10 to-transparent border border-amber-400/40 flex items-center justify-center mx-auto mb-5 text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.15)]">
            <Award className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-cyan-400 font-bold block mb-2">
            CERTIFICATE OF COMPLETION
          </span>

          <p className="text-xs text-neutral-400 italic font-serif mb-4">
            This document certifies that
          </p>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight mb-4 font-serif">
            {certificate.studentName}
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto leading-relaxed mb-4">
            has successfully completed 100% of all lectures, code projects, and technical requirements for the curriculum of
          </p>

          <div className="py-2.5 px-5 rounded-xl bg-neutral-900/80 border border-neutral-800 inline-block mb-6">
            <span className="text-base sm:text-lg font-bold text-cyan-400 tracking-tight">
              {certificate.courseTitle}
            </span>
          </div>

          {/* Footer of the certificate */}
          <div className="pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-neutral-400">
            {/* Instructor Signature */}
            <div className="text-left space-y-1">
              <div className="font-serif italic text-base text-neutral-200 tracking-wide">
                Yash Gayake
              </div>
              <p className="text-[11px] font-mono text-cyan-400/80">Instructor & Creator</p>
              <p className="text-[10px] text-neutral-500">Automation & Robotics Engineering</p>
            </div>

            {/* Verification Metadata */}
            <div className="sm:text-right space-y-1 font-mono text-[11px]">
              <div>
                <span className="text-neutral-500">Issued On: </span>
                <span className="text-neutral-200 font-semibold">{certificate.issuedAt}</span>
              </div>
              <div className="flex items-center sm:justify-end gap-1.5">
                <span className="text-neutral-500">Credential ID: </span>
                <button
                  onClick={handleCopyCode}
                  title="Click to copy ID"
                  className="text-cyan-400 font-bold hover:underline"
                >
                  {certificate.verificationCode}
                </button>
              </div>
              <div className="flex items-center sm:justify-end gap-1 text-[10px] text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified 100% Complete</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-800 print:hidden">
          <p className="text-xs text-neutral-400 font-mono">
            Showcase this certificate on LinkedIn, GitHub, or your resume.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono transition-colors"
            >
              Copy Verification ID
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-bold transition-all shadow-md"
            >
              Download PDF / Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
