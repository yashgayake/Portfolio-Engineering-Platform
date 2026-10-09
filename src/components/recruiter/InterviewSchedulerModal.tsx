import React, { useState } from 'react';
import { Calendar, Clock, Video, CheckCircle2, User, Mail, Sparkles, X, ChevronRight, Globe } from 'lucide-react';
import { soundFx } from '../../lib/soundFx.ts';
import { useToast } from '../Toast.tsx';

interface InterviewSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  yashEmail?: string;
}

const AVAILABLE_SLOTS = [
  '10:00 AM - 10:30 AM',
  '11:30 AM - 12:00 PM',
  '02:00 PM - 02:30 PM',
  '04:30 PM - 05:00 PM',
  '06:00 PM - 06:30 PM'
];

export function InterviewSchedulerModal({ isOpen, onClose, yashEmail = 'yashgayake900@gmail.com' }: InterviewSchedulerModalProps) {
  const { success } = useToast();
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState<string>(AVAILABLE_SLOTS[0]);
  const [interviewType, setInterviewType] = useState<'recruiter' | 'technical' | 'project'>('recruiter');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [notes, setNotes] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    soundFx.playSuccess();
    setIsBooked(true);
    success(`Interview request sent for ${selectedDate} at ${selectedSlot}! Calendar invite dispatched.`);
  };

  const handleReset = () => {
    setIsBooked(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-neutral-900 border border-cyan-500/40 shadow-2xl shadow-cyan-950/40 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 bg-neutral-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                <span>Schedule 1-on-1 Technical Call</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  Google Meet
                </span>
              </h3>
              <p className="text-xs font-mono text-neutral-400">Directly with Yash Gayake • 30 mins</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {!isBooked ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
            {/* Interview Type Selector */}
            <div>
              <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
                Discussion Topic / Purpose
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'recruiter', label: 'HR / Recruiter Screening' },
                  { id: 'technical', label: 'Robotics / Tech Deep Dive' },
                  { id: 'project', label: 'Freelance / Collaboration' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setInterviewType(item.id as any);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-mono transition-all text-center leading-snug ${
                      interviewType === item.id
                        ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 font-bold'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Time Slot Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Select Date</span>
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-200 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Time Slot (IST / UTC+5:30)</span>
                </label>
                <select
                  value={selectedSlot}
                  onChange={e => setSelectedSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-200 focus:outline-none focus:border-cyan-500"
                >
                  {AVAILABLE_SLOTS.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Recruiter Details */}
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Connor"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-cyan-500 placeholder-neutral-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. Tesla / Google / Startup"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-cyan-500 placeholder-neutral-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Work Email Address *</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-cyan-500 placeholder-neutral-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Optional Agenda / Job Role Link</label>
                <textarea
                  rows={2}
                  placeholder="Share job description, questions, or project specs..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-cyan-500 placeholder-neutral-600 resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-neutral-800">
              <span className="text-[11px] font-mono text-neutral-500 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Instant Confirmation & Calendar Invite</span>
              </span>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs font-mono flex items-center gap-1.5 transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
              >
                <span>Confirm Call</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation State */
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-neutral-100">Meeting Confirmed!</h3>
              <p className="text-xs font-mono text-neutral-400 mt-1">
                Google Meet link and calendar invitation sent to <span className="text-cyan-400 font-bold">{email}</span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-left font-mono text-xs space-y-1.5 max-w-sm mx-auto">
              <div className="flex justify-between text-neutral-400">
                <span>Date:</span>
                <span className="text-neutral-200 font-bold">{selectedDate}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Time:</span>
                <span className="text-neutral-200 font-bold">{selectedSlot}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Host:</span>
                <span className="text-cyan-400 font-bold">Yash Gayake</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Platform:</span>
                <span className="text-neutral-200">Google Meet (Encrypted Video)</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 text-neutral-950 font-bold text-xs font-mono hover:bg-cyan-400"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
