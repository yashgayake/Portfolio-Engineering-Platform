import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Zap, CreditCard, QrCode, Lock, Sparkles, User, Award } from 'lucide-react';
import type { Course, NoteResource } from '../../types.ts';
import { useStudentAuth } from '../../context/StudentAuthContext.tsx';
import { useToast } from '../Toast.tsx';

interface PurchaseModalProps {
  item: Course | NoteResource | null;
  type: 'course' | 'note';
  onClose: () => void;
  onSuccess: () => void;
  onNeedAuth?: () => void;
}

export function PurchaseModal({ item, type, onClose, onSuccess, onNeedAuth }: PurchaseModalProps) {
  const { enrollInCourse, purchaseNotes, student } = useStudentAuth();
  const { success, error: toastError } = useToast();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'free'>('upi');
  const [upiId, setUpiId] = useState('student@oksbi');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!item) return null;

  const isFree = item.price === 0;
  const course = type === 'course' ? (item as Course) : null;
  const note = type === 'note' ? (item as NoteResource) : null;

  const handleCompleteOrder = async () => {
    if (!student) {
      toastError('Please sign in or create an account first so your certificate can be issued in your name.');
      onClose();
      onNeedAuth?.();
      return;
    }

    setIsProcessing(true);
    try {
      if (type === 'course') {
        await enrollInCourse(item.id);
        success(`Enrolled in "${item.title}"! Course access unlocked for ${student.name}.`);
      } else {
        await purchaseNotes(item.id);
        success(`Purchased notes: "${item.title}"! Download unlocked for ${student.name}.`);
      }
      onSuccess();
    } catch (err: any) {
      toastError(err.message || 'Payment simulation failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Zap className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-neutral-100">
                {isFree ? 'Free Enrollment' : `Checkout & Unlock ${type === 'course' ? 'Course' : 'Notes'}`}
              </h3>
              <p className="text-[11px] font-mono text-neutral-400">Yash Gayake Learning Platform</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item Summary Card */}
        <div className="mt-5 p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {type === 'course' ? (course?.category || 'Course') : 'Lecture Notes & Guide'}
              </span>
              <h4 className="text-sm font-bold text-neutral-100 mt-1.5 line-clamp-2">
                {item.title}
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                Instructor: Yash Gayake • {type === 'course' ? `${course?.lectures.length} Lectures` : `${note?.pagesCount} Pages PDF`}
              </p>
            </div>

            <div className="text-right shrink-0">
              {isFree ? (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold text-xs">
                  FREE
                </span>
              ) : (
                <div>
                  <div className="text-lg font-extrabold text-neutral-100 font-mono">
                    ₹{item.price}
                  </div>
                  {course?.originalPrice && (
                    <div className="text-[11px] text-neutral-500 line-through font-mono">
                      ₹{course.originalPrice}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Benefits */}
          <div className="pt-3 border-t border-neutral-800/80 grid grid-cols-2 gap-2 text-[11px] font-mono text-neutral-300">
            <div className="flex items-center gap-1.5 text-neutral-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Lifetime Access</span>
            </div>
            {type === 'course' && (
              <div className="flex items-center gap-1.5 text-neutral-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>100% Verified Certificate</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-neutral-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Full Code & Lecture Notes</span>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Progress Tracking</span>
            </div>
          </div>
        </div>

        {/* Payment options if not free */}
        {!isFree ? (
          <div className="mt-5 space-y-4">
            <label className="block text-xs font-mono uppercase text-neutral-400">
              Select Payment Method
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all ${
                  paymentMethod === 'upi'
                    ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>UPI / QR Code</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Card / NetBanking</span>
              </button>
            </div>

            {paymentMethod === 'upi' ? (
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                <label className="block text-[11px] font-mono text-neutral-400">
                  Virtual Payment Address (UPI VPA)
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  placeholder="yourname@okhdfcbank"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-xs font-mono text-neutral-100 focus:outline-none focus:border-cyan-500/60"
                />
                <p className="text-[10px] text-neutral-500 font-mono">
                  Supported by Google Pay, PhonePe, Paytm, BHIM & all major UPI apps.
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="text-xs font-mono text-neutral-300">
                  Card Simulation (Instant Test Mode)
                </div>
                <div className="text-[11px] font-mono text-neutral-500">
                  Safe demo checkout simulated with test credentials.
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-3">
            <Sparkles className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold">Sponsored Education Initiative</p>
              <p className="text-[11px] opacity-90">This course is made freely available by Yash Gayake for all engineering students.</p>
            </div>
          </div>
        )}

        {/* Student info notification / Login required warning */}
        {student ? (
          <div className="mt-5 p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-neutral-100 truncate">{student.name}</p>
                <p className="text-[10px] font-mono text-neutral-400 truncate">{student.email}</p>
              </div>
            </div>
            <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0 flex items-center gap-1">
              <Award className="w-3 h-3" />
              <span>Cert Recipient</span>
            </span>
          </div>
        ) : (
          <div className="mt-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-neutral-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold font-mono">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Student Account Required</span>
            </div>
            <p className="text-[11px] text-neutral-300 font-sans leading-relaxed">
              Please sign in or register your student account first. Your courses, progress, and official certificates will be issued under your verified name.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onNeedAuth?.();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-bold font-mono transition-colors flex items-center justify-center gap-1.5 shadow-md"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In / Register First</span>
            </button>
          </div>
        )}

        {/* Checkout Button */}
        <div className="mt-6">
          <button
            onClick={handleCompleteOrder}
            disabled={isProcessing}
            className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <span>Securing Access & Registering...</span>
            ) : !student ? (
              <>
                <User className="w-4 h-4" />
                <span>Sign In to {isFree ? 'Enroll Free' : 'Purchase'}</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>
                  {isFree ? 'Claim Free Instant Access' : `Pay ₹${item.price} & Unlock Now`}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
