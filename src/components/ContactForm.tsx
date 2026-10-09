import React, { useState } from 'react';
import { motion, type Variants } from 'motion/react';
import { 
  Mail, 
  Send, 
  Linkedin, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck,
  MessageSquareText,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import type { SiteSettings } from '../types.ts';
import { api } from '../lib/api.ts';
import { useToast } from './Toast.tsx';
import { validateEmail } from '../utils/emailValidator.ts';

// Strict RFC 5322 compliant regex for email validation ensuring username@domain.tld with valid 2-24 char alphabetic TLD
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,24}$/;

interface ContactFormProps {
  settings: SiteSettings;
}

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

const headerVariant: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const colVariant: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const CATEGORIES = [
  { id: 'feedback', label: 'Feedback & Review', icon: MessageSquareText },
  { id: 'general', label: 'General Message', icon: Mail },
  { id: 'robotics', label: 'Robotics & Automation', icon: Sparkles },
  { id: 'collaboration', label: 'Hiring / Collaboration', icon: ExternalLink }
] as const;

export function ContactForm({ settings }: ContactFormProps) {
  const { success, error: toastError } = useToast();

  const [category, setCategory] = useState<string>('Feedback & Review');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '' // anti-spam
  });

  const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState<{
    name: string;
    email: string;
    subject: string;
    message: string;
  } | null>(null);

  const handleEmailChange = (val: string) => {
    setFormData(prev => ({ ...prev, email: val }));
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
    const clean = val.trim().toLowerCase();
    if (!clean) {
      setEmailSuggestion(null);
      return;
    }
    const validation = validateEmail(clean);
    if (!validation.isValid && validation.suggestion) {
      setEmailSuggestion(validation.suggestion);
    } else {
      setEmailSuggestion(null);
    }
  };

  const applyEmailSuggestion = () => {
    if (emailSuggestion) {
      setFormData(prev => ({ ...prev, email: emailSuggestion }));
      setEmailSuggestion(null);
      setErrors(prev => {
        const next = { ...prev };
        delete next.email;
        return next;
      });
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Please provide your name (at least 2 characters).';
    }

    const cleanEmail = formData.email.trim();
    if (!cleanEmail) {
      errs.email = 'Please provide an email address.';
    } else if (!EMAIL_REGEX.test(cleanEmail)) {
      // Regex check failed
      const validation = validateEmail(cleanEmail);
      errs.email = validation.error || 'Please provide a properly formatted email address (e.g. name@domain.com).';
      if (validation.suggestion) {
        setEmailSuggestion(validation.suggestion);
      }
    } else {
      // Passed base regex, check deeper domain/typo rules
      const emailValidation = validateEmail(cleanEmail);
      if (!emailValidation.isValid) {
        errs.email = emailValidation.error || 'Please provide a valid email address.';
        if (emailValidation.suggestion) {
          setEmailSuggestion(emailValidation.suggestion);
        }
      }
    }

    if (!formData.subject.trim() || formData.subject.trim().length < 2) {
      errs.subject = 'Please provide a subject.';
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters long.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        category
      };

      const res = await api.submitContact(payload);
      if (res.success) {
        setLastSubmitted({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        });
        setIsSubmitted(true);
        success('Message sent & forwarded to yashgayake900@gmail.com!');
        setFormData({ name: '', email: '', subject: '', message: '', honeypot: '' });
        setEmailSuggestion(null);
      }
    } catch (err: any) {
      toastError(err.message || 'Failed to transmit message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const mailtoBackupUrl = lastSubmitted
    ? `mailto:yashgayake900@gmail.com?subject=${encodeURIComponent(`[${category}] ${lastSubmitted.subject}`)}&body=${encodeURIComponent(
        `Hi Yash,\n\nName: ${lastSubmitted.name}\nEmail: ${lastSubmitted.email}\nCategory: ${category}\n\nMessage:\n${lastSubmitted.message}\n\nSent from Portfolio Contact Channel`
      )}`
    : `mailto:yashgayake900@gmail.com`;

  return (
    <section id="contact" className="py-20 border-t border-neutral-900 bg-neutral-950">
      <motion.div 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <motion.div variants={headerVariant} className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
                COMMUNICATION CHANNEL
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-100 tracking-tight">
              Get in Touch &amp; Feedback
            </h2>
          </div>
          <p className="text-xs font-mono text-neutral-400 max-w-sm">
            Leave feedback, discuss robotics and software projects, or inquire about engineering collaboration.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left info column (5 cols) */}
          <motion.div variants={colVariant} className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-neutral-900/30 border border-neutral-800/80 space-y-5">
              <h3 className="text-base font-bold text-neutral-100">
                Direct Contact &amp; Alerts
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Messages and feedback submitted here are dispatched immediately to Yash's personal Gmail (<span className="text-cyan-400 font-mono">yashgayake900@gmail.com</span>) and logged securely in the portfolio admin inbox.
              </p>

              <div className="space-y-4 pt-2">
                <a 
                  href="mailto:yashgayake900@gmail.com"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-neutral-800/50 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-cyan-400 shrink-0 group-hover:border-cyan-500/50 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-neutral-500 uppercase flex items-center gap-1.5">
                      Direct Email
                      <span className="text-[10px] text-cyan-400 px-1.5 py-0.2 rounded bg-cyan-950/60 border border-cyan-800/50">
                        Immediate Alert
                      </span>
                    </span>
                    <p className="text-xs font-mono text-neutral-200 group-hover:text-cyan-400 transition-colors">
                      yashgayake900@gmail.com
                    </p>
                  </div>
                </a>

                <div className="flex items-start gap-3 px-2.5">
                  <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-cyan-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-neutral-500 uppercase">Location</span>
                    <p className="text-xs text-neutral-200">{settings.location || 'India'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 px-2.5">
                  <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-cyan-400 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-neutral-500 uppercase">Response Window</span>
                    <p className="text-xs text-neutral-200">Typically within 24–48 hours</p>
                  </div>
                </div>
              </div>

              {/* LinkedIn Professional Callout */}
              {settings.linkedinUrl && (
                <div className="pt-4 border-t border-neutral-800/80">
                  <a
                    id="contact-linkedin-callout"
                    href={settings.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => api.trackEvent('linkedin_click', settings.linkedinUrl)}
                    className="group flex items-center justify-between p-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-cyan-500/40 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-neutral-950 transition-colors">
                        <Linkedin className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-neutral-200 group-hover:text-cyan-400 transition-colors">
                          Connect with me professionally
                        </span>
                        <p className="text-[11px] text-neutral-500 font-mono">
                          LinkedIn Profile
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-cyan-400 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                      →
                    </span>
                  </a>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right form column (7 cols) */}
          <motion.div variants={colVariant} className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 backdrop-blur-sm">
              {isSubmitted ? (
                <div className="py-10 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-100">
                      Message &amp; Feedback Sent Successfully!
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto mt-2 leading-relaxed">
                      Thank you for reaching out! A direct email alert has been dispatched to <strong className="text-cyan-400 font-mono">yashgayake900@gmail.com</strong>, and your submission has been safely logged in Yash's inbox.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 max-w-md mx-auto text-left space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                      <span>Delivered To:</span>
                      <span className="text-cyan-400 font-semibold">yashgayake900@gmail.com</span>
                    </div>
                    {lastSubmitted && (
                      <div className="text-[11px] font-mono text-neutral-400">
                        <span>Subject: </span>
                        <span className="text-neutral-200">{lastSubmitted.subject}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <a
                      href={mailtoBackupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-mono border border-cyan-500/30 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Open in Gmail / Email App</span>
                    </a>

                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-mono text-neutral-300 border border-neutral-800 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Category Selector */}
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-2">
                      Topic / Category
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {CATEGORIES.map(cat => {
                        const Icon = cat.icon;
                        const isSelected = category === cat.label;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setCategory(cat.label)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left ${
                              isSelected
                                ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300 shadow-sm shadow-cyan-500/10'
                                : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Honeypot for spam bots */}
                  <input
                    type="text"
                    name="honeypot"
                    value={formData.honeypot}
                    onChange={e => setFormData({ ...formData, honeypot: e.target.value })}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-mono text-neutral-300 uppercase tracking-wider mb-1.5">
                        Your Name *
                      </label>
                      <input
                        id="contact-name-input"
                        type="text"
                        placeholder="Ada Lovelace"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-4 py-2.5 rounded-xl bg-neutral-950 border text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none transition-colors ${
                          errors.name ? 'border-rose-500/80 focus:border-rose-500' : 'border-neutral-800 focus:border-cyan-500/60'
                        }`}
                      />
                      {errors.name && <p className="text-[11px] text-rose-400 mt-1">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-mono text-neutral-300 uppercase tracking-wider mb-1.5">
                        Email Address *
                      </label>
                      <input
                        id="contact-email-input"
                        type="email"
                        placeholder="you@gmail.com"
                        value={formData.email}
                        onChange={e => handleEmailChange(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl bg-neutral-950 border text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none transition-colors ${
                          errors.email ? 'border-rose-500/80 focus:border-rose-500' : 'border-neutral-800 focus:border-cyan-500/60'
                        }`}
                      />
                      {emailSuggestion && (
                        <div className="mt-1.5 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-[11px] text-amber-300 animate-in fade-in">
                          <span className="truncate">
                            Did you mean <strong>{emailSuggestion}</strong>?
                          </span>
                          <button
                            type="button"
                            onClick={applyEmailSuggestion}
                            className="ml-2 shrink-0 px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold border border-amber-500/40 transition-colors"
                          >
                            Fix
                          </button>
                        </div>
                      )}
                      {errors.email && !emailSuggestion && (
                        <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-mono text-neutral-300 uppercase tracking-wider mb-1.5">
                      Subject *
                    </label>
                    <input
                      id="contact-subject-input"
                      type="text"
                      placeholder={category === 'Feedback & Review' ? 'Website feedback / suggestions' : 'Robotics project / Engineering inquiry'}
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl bg-neutral-950 border text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none transition-colors ${
                        errors.subject ? 'border-rose-500/80 focus:border-rose-500' : 'border-neutral-800 focus:border-cyan-500/60'
                      }`}
                    />
                    {errors.subject && <p className="text-[11px] text-rose-400 mt-1">{errors.subject}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-mono text-neutral-300 uppercase tracking-wider mb-1.5">
                      Message / Feedback *
                    </label>
                    <textarea
                      id="contact-message-input"
                      rows={5}
                      placeholder={category === 'Feedback & Review' ? 'Share your feedback, impressions, or recommendations for Yash...' : 'Detail your inquiry, project scope, or technical question...'}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl bg-neutral-950 border text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none transition-colors resize-none ${
                        errors.message ? 'border-rose-500/80 focus:border-rose-500' : 'border-neutral-800 focus:border-cyan-500/60'
                      }`}
                    />
                    {errors.message && <p className="text-[11px] text-rose-400 mt-1">{errors.message}</p>}
                  </div>

                  {/* Submit button & Delivery note */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-[11px] font-mono text-neutral-500 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Forwarding to <strong className="text-neutral-300">yashgayake900@gmail.com</strong></span>
                    </span>

                    <button
                      id="contact-submit-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-semibold text-xs transition-all shadow-md shadow-cyan-500/10 active:scale-95 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Transmitting...' : 'Send Message & Feedback'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

