import React, { useState, useEffect } from 'react';
import { 
  X, 
  GraduationCap, 
  Mail, 
  Lock, 
  User, 
  Award, 
  ShieldCheck, 
  LogOut, 
  Eye, 
  EyeOff, 
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Check,
  Phone,
  Key,
  ArrowLeft,
  Clock,
  Send
} from 'lucide-react';
import { useStudentAuth } from '../../context/StudentAuthContext.tsx';
import { useToast } from '../Toast.tsx';
import { validateEmail } from '../../utils/emailValidator.ts';

interface StudentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  intentPrompt?: string;
}

export function StudentAuthModal({ isOpen, onClose, onSuccess, intentPrompt }: StudentAuthModalProps) {
  const { 
    student, 
    loginStudent, 
    registerStudent, 
    logoutStudent, 
    loginWithGoogle,
    requestStudentPasswordResetOtp,
    verifyStudentOtpAndResetPassword
  } = useStudentAuth();
  
  const { success, error: toastError } = useToast();

  // Mode: 'signin' | 'signup' | 'forgot'
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  
  // Registration and login fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  // Student Forgot Password state
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [otpInfo, setOtpInfo] = useState<{ message: string; maskedContact: string; otpCode?: string; registeredEmail?: string } | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Countdown timer for OTP expiry
  useEffect(() => {
    if (timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerSeconds]);

  if (!isOpen) return null;

  const handleSwitchMode = (newMode: 'signin' | 'signup' | 'forgot') => {
    setMode(newMode);
    setFormError(null);
    setEmailSuggestion(null);
    setPassword('');
    setConfirmPassword('');
    if (newMode === 'forgot') {
      setForgotStep(1);
      setResetIdentifier(email || '');
      setOtpCode('');
      setNewPassword('');
      setConfirmNewPassword('');
      setOtpInfo(null);
    }
  };

  const handleEmailChange = (newVal: string) => {
    setEmail(newVal);
    if (formError) setFormError(null);
    if (emailSuggestion) setEmailSuggestion(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setEmailSuggestion(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Strict email validation checking domain typos
    const emailValidation = validateEmail(cleanEmail);
    if (!emailValidation.isValid) {
      const err = emailValidation.error || 'Please enter a valid email address (e.g. name@gmail.com)';
      if (emailValidation.suggestion) {
        setEmailSuggestion(emailValidation.suggestion);
      }
      setFormError(err);
      toastError(err);
      return;
    }

    if (!cleanPassword) {
      const err = 'Please enter your password';
      setFormError(err);
      toastError(err);
      return;
    }

    if (mode === 'signup') {
      const cleanName = name.trim();
      const cleanPhone = phone.trim().replace(/[^0-9+]/g, '');

      if (!cleanName || cleanName.length < 2) {
        const err = 'Please enter your full legal name for your verified certificates';
        setFormError(err);
        toastError(err);
        return;
      }

      if (!cleanPhone || cleanPhone.replace(/[^0-9]/g, '').length < 10) {
        const err = 'Please enter a valid 10-digit mobile number for account security & password reset.';
        setFormError(err);
        toastError(err);
        return;
      }

      if (cleanPassword.length < 6) {
        const err = 'Password must be at least 6 characters long';
        setFormError(err);
        toastError(err);
        return;
      }

      if (cleanPassword !== confirmPassword.trim()) {
        const err = 'Passwords do not match. Please re-enter your password';
        setFormError(err);
        toastError(err);
        return;
      }

      setIsSubmitting(true);
      try {
        await registerStudent(cleanName, cleanEmail, cleanPassword, cleanPhone);
        success(`Welcome, ${cleanName}! Your student profile has been created.`);
        if (onSuccess) onSuccess();
        onClose();
      } catch (err: any) {
        const msg = err.message || 'Registration failed. Please try again.';
        setFormError(msg);
        toastError(msg);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Sign In mode
      setIsSubmitting(true);
      try {
        await loginStudent(cleanEmail, cleanPassword);
        success(`Signed in successfully! Welcome back.`);
        if (onSuccess) onSuccess();
        onClose();
      } catch (err: any) {
        const msg = err.message || 'Authentication failed. Please verify your credentials.';
        setFormError(msg);
        toastError(msg);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setFormError(null);
    setIsGoogleSubmitting(true);
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        success('Verified successfully with Google!');
        if (onSuccess) onSuccess();
        onClose();
      } else if (res.error) {
        setFormError(res.error);
        toastError(res.error);
      }
    } catch (err: any) {
      const msg = err.message || 'Google sign-in was cancelled or failed.';
      setFormError(msg);
      toastError(msg);
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  // Handler: Request Student OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanInput = resetIdentifier.trim();
    if (!cleanInput) {
      setFormError('Please enter your registered email address or mobile number.');
      return;
    }

    setIsRequestingOtp(true);
    try {
      const res = await requestStudentPasswordResetOtp(cleanInput);
      setOtpInfo(res);
      setTimerSeconds(600); // 10 minutes
      setForgotStep(2);
      success('OTP successfully dispatched to your registered contact!');
    } catch (err: any) {
      setFormError(err.message || 'Failed to find student account. Please verify your details.');
    } finally {
      setIsRequestingOtp(false);
    }
  };

  // Handler: Verify Student OTP & Reset
  const handleVerifyStudentReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!otpCode.trim()) {
      setFormError('Please enter the 6-digit OTP code.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setFormError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setFormError('New password and confirm password do not match.');
      return;
    }

    setIsResetting(true);
    try {
      const res = await verifyStudentOtpAndResetPassword(resetIdentifier, otpCode, newPassword);
      success(res.message || 'Password successfully reset! You can now sign in.');
      // Transition back to Sign In
      if (otpInfo?.registeredEmail) {
        setEmail(otpInfo.registeredEmail);
      }
      setPassword(newPassword);
      setMode('signin');
      setForgotStep(1);
      setOtpInfo(null);
      setOtpCode('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setFormError(err.message || 'Failed to verify OTP or update password.');
    } finally {
      setIsResetting(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-fadeIn"
      id="student-auth-modal-backdrop"
    >
      <div 
        className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-auto"
        onClick={e => e.stopPropagation()}
        id="student-auth-modal-card"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {mode === 'forgot' ? <Key className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-100">
                {student 
                  ? 'Student Profile' 
                  : mode === 'forgot'
                    ? 'Reset Password'
                    : mode === 'signin' 
                      ? 'Student Sign In' 
                      : 'Create Student Account'
                }
              </h3>
              <p className="text-[11px] font-mono text-neutral-400">Student Portal & Verified Certifications</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
            id="close-student-auth-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Intent notification prompt if provided */}
        {intentPrompt && !student && (
          <div className="mt-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-cyan-400" />
            <span>{intentPrompt}</span>
          </div>
        )}

        {/* Logged in state view */}
        {student ? (
          <div className="pt-6 space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
              <img
                src={student.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(student.email)}`}
                alt={student.name}
                className="w-14 h-14 rounded-2xl bg-neutral-800 p-1 border border-neutral-700"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-neutral-100 truncate">{student.name}</h4>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-mono border border-cyan-500/20">
                    Active
                  </span>
                </div>
                <p className="text-xs text-neutral-400 font-mono truncate">{student.email}</p>
                {student.phone && (
                  <p className="text-[11px] text-neutral-500 font-mono mt-0.5 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-cyan-400" />
                    <span>{student.phone}</span>
                  </p>
                )}
                <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                  Joined {student.joinedDate}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
                <span className="text-xs font-mono text-neutral-400 block mb-1">Enrolled Courses</span>
                <span className="text-lg font-bold text-cyan-400">{student.enrolledCourseIds.length}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
                <span className="text-xs font-mono text-neutral-400 block mb-1">Certificates</span>
                <span className="text-lg font-bold text-amber-400">{student.certificates.length}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => {
                  logoutStudent();
                  success('Signed out of student account.');
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out Student Account</span>
              </button>
            </div>
          </div>
        ) : mode === 'forgot' ? (
          /* FORGOT PASSWORD VIEW FOR STUDENTS */
          <div className="pt-4 space-y-4">
            {/* Inline Error Alert Box */}
            {formError && (
              <div 
                className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <span className="font-semibold block mb-0.5">Verification Error</span>
                  <span>{formError}</span>
                </div>
              </div>
            )}

            {forgotStep === 1 ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-neutral-300 space-y-1.5">
                  <div className="font-semibold text-cyan-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Student Account Recovery</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Enter your registered email address or mobile number to receive a 6-digit OTP code to reset your student password.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    Registered Email or Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      <span className="text-neutral-700">/</span>
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      placeholder="student@gmail.com or 9876543210"
                      value={resetIdentifier}
                      onChange={e => {
                        setResetIdentifier(e.target.value);
                        if (formError) setFormError(null);
                      }}
                      required
                      className="w-full pl-16 pr-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/60 font-sans"
                    />
                  </div>
                  <p className="text-[10px] text-neutral-500 font-mono mt-1">
                    Must match the email or phone you provided during sign-up.
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('signin')}
                    className="py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Sign In</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isRequestingOtp}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isRequestingOtp ? 'Dispatching OTP...' : 'Send 6-Digit OTP'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyStudentReset} className="space-y-4">
                {/* OTP Info Display */}
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-neutral-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>OTP Sent Successfully</span>
                    </span>
                    {timerSeconds > 0 && (
                      <span className="font-mono text-[11px] text-amber-400 flex items-center gap-1 bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-500/30">
                        <Clock className="w-3 h-3" />
                        <span>Expires: {formatTimer(timerSeconds)}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-300 leading-relaxed">
                    A 6-digit OTP code has been dispatched to: <strong className="text-emerald-300 font-mono">{otpInfo?.maskedContact}</strong>
                  </p>

                  {/* Dev / Quick Access OTP badge */}
                  {otpInfo?.otpCode && (
                    <div className="pt-1.5 border-t border-emerald-500/20 flex items-center justify-between">
                      <span className="text-[10px] text-neutral-400 font-mono">OTP Verification Code:</span>
                      <button
                        type="button"
                        onClick={() => setOtpCode(otpInfo.otpCode || '')}
                        className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg font-mono font-bold tracking-widest text-xs transition-colors"
                        title="Click to auto-fill OTP"
                      >
                        {otpInfo.otpCode} <span className="text-[9px] font-normal underline ml-1">Auto-fill</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 6-Digit OTP Input */}
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    Enter 6-Digit OTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={e => {
                      setOtpCode(e.target.value.replace(/[^0-9]/g, ''));
                      if (formError) setFormError(null);
                    }}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-center tracking-[0.4em] font-mono text-base font-bold text-cyan-300 placeholder:text-neutral-700 focus:outline-none focus:border-cyan-500/60"
                    placeholder="••••••"
                  />
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={e => {
                        setNewPassword(e.target.value);
                        if (formError) setFormError(null);
                      }}
                      required
                      className="w-full pl-3 pr-10 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/60 font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(prev => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4 text-cyan-400" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Repeat new password"
                    value={confirmNewPassword}
                    onChange={e => {
                      setConfirmNewPassword(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    required
                    className={`w-full px-3 py-2 rounded-xl bg-neutral-950 border text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none font-sans ${
                      confirmNewPassword && newPassword !== confirmNewPassword
                        ? 'border-rose-500/60 focus:border-rose-500'
                        : 'border-neutral-800 focus:border-cyan-500/60'
                    }`}
                  />
                  {confirmNewPassword && newPassword !== confirmNewPassword && (
                    <p className="text-[10px] text-rose-400 font-mono mt-1">Passwords do not match</p>
                  )}
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotStep(1);
                      setFormError(null);
                    }}
                    className="py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change Contact</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isResetting}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>{isResetting ? 'Resetting Password...' : 'Verify OTP & Reset'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className="pt-4 space-y-4">
            {/* Mode switch */}
            <div className="flex rounded-xl bg-neutral-950 p-1 border border-neutral-800">
              <button
                type="button"
                onClick={() => handleSwitchMode('signin')}
                className={`flex-1 py-2 text-xs font-mono rounded-lg transition-colors ${
                  mode === 'signin' ? 'bg-neutral-800 text-neutral-100 font-bold shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
                }`}
                id="tab-student-signin"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleSwitchMode('signup')}
                className={`flex-1 py-2 text-xs font-mono rounded-lg transition-colors ${
                  mode === 'signup' ? 'bg-neutral-800 text-neutral-100 font-bold shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
                }`}
                id="tab-student-signup"
              >
                Create Account (New)
              </button>
            </div>

            {/* Inline Error Alert Box */}
            {formError && (
              <div 
                className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn"
                role="alert"
                id="auth-error-alert"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <span className="font-semibold block mb-0.5">Authentication Error</span>
                  <span>{formError}</span>
                </div>
              </div>
            )}

            {/* Google Fast Sign-In (Available only for Students, strictly not for Admin) */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleSubmitting || isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-mono transition-all flex items-center justify-center gap-2.5 shadow-sm hover:border-neutral-600 disabled:opacity-50"
              id="google-student-signin-btn"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9z" />
                <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z" />
              </svg>
              <span>{isGoogleSubmitting ? 'Authenticating with Google...' : 'Continue with Google'}</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-neutral-800 w-full"></div>
              <span className="bg-neutral-900 px-3 text-[10px] font-mono uppercase text-neutral-500 tracking-wider">
                Or with password
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5" id="student-auth-form">
              {/* Legal Name (Sign Up only) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    Your Full Legal Name <span className="text-cyan-400 font-semibold">(For Certificates)</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={e => {
                        setName(e.target.value);
                        if (formError) setFormError(null);
                      }}
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/60 font-sans"
                      id="student-name-input"
                    />
                  </div>
                  <p className="text-[10px] text-neutral-500 font-mono mt-1 flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-400" />
                    <span>This name will be printed on all your verified completion certificates.</span>
                  </p>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="student@gmail.com"
                    value={email}
                    onChange={e => handleEmailChange(e.target.value)}
                    required
                    className={`w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-950 border text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none font-sans ${
                      emailSuggestion || (formError && formError.toLowerCase().includes('email'))
                        ? 'border-amber-500/70 focus:border-amber-400'
                        : 'border-neutral-800 focus:border-cyan-500/60'
                    }`}
                    id="student-email-input"
                  />
                </div>
                {emailSuggestion && (
                  <div 
                    className="mt-1.5 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-200 animate-fadeIn"
                    id="email-suggestion-box"
                  >
                    <span className="text-[11px] truncate">
                      Did you mean <strong className="text-amber-300 font-semibold">{emailSuggestion}</strong>?
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail(emailSuggestion);
                        setEmailSuggestion(null);
                        setFormError(null);
                      }}
                      className="ml-2 px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-[10px] shrink-0 transition-colors flex items-center gap-1 shadow-sm"
                      id="apply-email-suggestion-btn"
                    >
                      <Check className="w-3 h-3" />
                      <span>Use @gmail.com</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile / Phone Number (Sign Up only) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    Mobile / Phone Number <span className="text-cyan-400 font-semibold">(For Password Recovery &amp; SMS)</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={e => {
                        setPhone(e.target.value);
                        if (formError) setFormError(null);
                      }}
                      required
                      maxLength={15}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/60 font-sans"
                      id="student-phone-input"
                    />
                  </div>
                  <p className="text-[10px] text-neutral-500 font-mono mt-1">
                    Used to verify your identity and send OTP if you ever forget your password.
                  </p>
                </div>
              )}

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-mono uppercase text-neutral-400">Password</label>
                  {mode === 'signup' ? (
                    <span className="text-[10px] font-mono text-neutral-500">Min. 6 characters</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSwitchMode('forgot')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-mono hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={mode === 'signup' ? 'Create a secure password' : 'Enter your password'}
                    value={password}
                    onChange={e => {
                      setPassword(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    required
                    className="w-full pl-9 pr-10 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/60 font-sans"
                    id="student-password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                    id="toggle-password-visibility-btn"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Sign Up only) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Repeat your password"
                      value={confirmPassword}
                      onChange={e => {
                        setConfirmPassword(e.target.value);
                        if (formError) setFormError(null);
                      }}
                      required
                      className={`w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-950 border text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none font-sans ${
                        confirmPassword && password !== confirmPassword 
                          ? 'border-rose-500/60 focus:border-rose-500' 
                          : 'border-neutral-800 focus:border-cyan-500/60'
                      }`}
                      id="student-confirm-password-input"
                    />
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-[10px] text-rose-400 font-mono mt-1">Passwords do not match</p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || isGoogleSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-bold transition-all shadow-md mt-2 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                id="student-auth-submit-btn"
              >
                {isSubmitting ? (
                  <span>{mode === 'signin' ? 'Verifying Password & Signing In...' : 'Registering Account & Profile...'}</span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    {mode === 'signin' ? 'Sign In to Learning Dashboard' : 'Create Profile & Start Learning'}
                  </span>
                )}
              </button>
            </form>

            <div className="text-[11px] text-neutral-500 text-center font-mono pt-2 border-t border-neutral-800/60">
              {mode === 'signup' ? (
                <p>
                  Already have a student account?{' '}
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('signin')}
                    className="text-cyan-400 hover:underline font-bold"
                  >
                    Sign In
                  </button>
                </p>
              ) : (
                <p>
                  New to Yash Gayake Academy?{' '}
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('signup')}
                    className="text-cyan-400 hover:underline font-bold"
                  >
                    Create an account
                  </button>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
