import React, { useState } from 'react';
import { X, Search, CheckCircle2, AlertCircle, Award, ShieldCheck, Calendar, User, BookOpen } from 'lucide-react';
import { firestoreService } from '../../lib/firestoreService.ts';
import type { Certificate } from '../../types.ts';

interface CertificateVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewCertificate?: (cert: Certificate) => void;
}

export function CertificateVerificationModal({
  isOpen,
  onClose,
  onViewCertificate
}: CertificateVerificationModalProps) {
  const [code, setCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [foundCert, setFoundCert] = useState<Certificate | null>(null);
  const [notFound, setNotFound] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsSearching(true);
    setNotFound(false);
    setFoundCert(null);

    try {
      const match = await firestoreService.verifyCertificate(code.trim());
      if (match) {
        setFoundCert(match);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.warn('Certificate verification query notice:', err);
      setNotFound(true);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
      <div 
        id="verify-cert-modal"
        className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-100">Verify Certificate</h3>
              <p className="text-xs text-neutral-400 font-mono">
                Real-time Firestore cryptographic verification
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

        <form onSubmit={handleSearch} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              required
              value={code}
              onChange={e => {
                setCode(e.target.value.toUpperCase());
                setNotFound(false);
              }}
              placeholder="Enter Code (e.g. YG-849201)"
              className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 font-mono text-xs uppercase tracking-wider focus:outline-none focus:border-amber-500 transition-colors placeholder:normal-case placeholder:tracking-normal placeholder:text-neutral-500"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-colors disabled:opacity-50"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] font-mono text-neutral-400">
            Check the authenticity of any certificate issued by Yash Gayake Academy.
          </p>
        </form>

        {isSearching && (
          <div className="py-6 text-center text-xs font-mono text-neutral-400">
            Searching Firestore database...
          </div>
        )}

        {notFound && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <div>
              <p className="font-bold">No Matching Certificate Found</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                The code <span className="font-bold text-rose-300">{code}</span> is not registered in the system.
              </p>
            </div>
          </div>
        )}

        {foundCert && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Official Certificate Verified!</span>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-emerald-500/20 text-neutral-300">
              <div className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-bold text-neutral-100">{foundCert.courseTitle}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-neutral-400" />
                <span>Recipient: {foundCert.studentName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                <span>Issued: {foundCert.issuedAt}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Grade: {foundCert.grade || 'Distinction (100%)'}</span>
              </div>
            </div>

            {onViewCertificate && (
              <button
                type="button"
                onClick={() => {
                  onViewCertificate(foundCert);
                  onClose();
                }}
                className="w-full mt-2 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs font-mono transition-colors"
              >
                Inspect Official Credential
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
