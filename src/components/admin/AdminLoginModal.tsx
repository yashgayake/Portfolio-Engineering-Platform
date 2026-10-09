import React, { useState, useEffect } from 'react';
import { Lock, X, Shield, Eye, EyeOff, AlertCircle, Phone, Mail, ArrowLeft, CheckCircle, Key, Send, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useToast } from '../Toast.tsx';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AUTHORIZED_ADMIN_EMAIL = 'yashgayake900@gmail.com';
const AUTHORIZED_ADMIN_PHONE = '9975246071';

export function AdminLoginModal({ isOpen, onClose, onSuccess }: AdminLoginModalProps) {
  const { login } = useAuth();
  const { success, error: toastError } = useToast();

  // Mode: 'login' | 'forgot'
  const [view, setView] = useState<'login' | 'forgot'>('login');
  
  // Login form state
  const [email, setEmail] = useState(AUTHORIZED_ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Forgot password form state
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [resetIdentifier, setResetIdentifier] = useState(AUTHORIZED_ADMIN_EMAIL);
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [otpInfo, setOtpInfo] = useState<{ message: string; maskedEmail?: string; maskedPhone?: string; otpCode?: string } | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Timer countdown
  useEffect(() => {
    if (timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerSeconds]);

  if (!isOpen) return null;

  const handleClose = () => {
    setView('login');
    setForgotStep(1);
    setErrorMsg('');
    setOtpInfo(null);
    onClose();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail !== AUTHORIZED_ADMIN_EMAIL) {
      setErrorMsg(`Access Denied: Only the sole administrator (${AUTHORIZED_ADMIN_EMAIL}) is permitted to access this panel.`);
      toastError('Unauthorized: Access restricted to Yash Gayake');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your administrator password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await login(cleanEmail, password);
      if (res.success) {
        success('Welcome back, Yash! Authenticated as sole Administrator.');
        onSuccess();
      } else {
        setErrorMsg(res.error || 'Invalid administrator password. Please try again or use "Forgot Password".');
        toastError('Authentication failed');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login encountered an unexpected error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanInput = resetIdentifier.trim().toLowerCase();
    const digitsOnly = cleanInput.replace(/[^0-9]/g, '');

    const isEmail = cleanInput === AUTHORIZED_ADMIN_EMAIL;
    const isPhone = digitsOnly.endsWith(AUTHORIZED_ADMIN_PHONE);

    if (!isEmail && !isPhone) {
      setErrorMsg(`Access Denied: Only the registered administrator email (${AUTHORIZED_ADMIN_EMAIL}) or mobile number (+91 ${AUTHORIZED_ADMIN_PHONE}) can reset admin credentials.`);
      return;
    }

    setIsRequestingOtp(true);

    try {
      const response = await fetch('/api/auth/admin/forgot-password/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: cleanInput })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setOtpInfo({
          message: data.message,
          maskedEmail: data.maskedEmail,
          maskedPhone: data.maskedPhone,
          otpCode: data.otpCode
        });
        setTimerSeconds(600); // 10 minutes
        setForgotStep(2);
        success(`OTP generated and sent to ${AUTHORIZED_ADMIN_EMAIL}!`);
      } else {
        setErrorMsg(data.error || 'Failed to request OTP. Please verify your contact information.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error while requesting OTP.');
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!otpCode.trim()) {
      setErrorMsg('Please enter the 6-digit OTP code.');
      return;
    }

    if (!newPassword || newPassword.length < 5) {
      setErrorMsg('New password must be at least 5 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirm password do not match.');
      return;
    }

    setIsResettingPassword(true);

    try {
      const response = await fetch('/api/auth/admin/forgot-password/verify-and-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          otp: otpCode.trim(),
          newPassword: newPassword.trim()
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        success('Password successfully reset! You can now sign in with your new password.');
        setPassword(newPassword.trim());
        setView('login');
        setForgotStep(1);
        setOtpInfo(null);
        setOtpCode('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setErrorMsg(data.error || 'Failed to reset password. Please check your OTP code.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error while resetting password.');
    } finally {
      setIsResettingPassword(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md">
      <div 
        className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
          aria-label="Close admin login modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            {view === 'login' ? <Shield className="w-6 h-6" /> : <Key className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-100">
              {view === 'login' ? 'Admin Portal' : 'Reset Admin Password'}
            </h3>
            <p className="text-xs text-neutral-400 font-mono">
              Yash Gayake — Sole Administrator
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="flex items-start gap-2 p-3 mb-5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* VIEW 1: LOGIN FORM */}
        {view === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Admin Email */}
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5 tracking-wider">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/60 transition-colors"
                placeholder="yashgayake900@gmail.com"
              />
              <p className="text-[11px] font-mono text-neutral-500 mt-1">
                Restricted to: <span className="text-cyan-400 font-semibold">{AUTHORIZED_ADMIN_EMAIL}</span>
              </p>
            </div>

            {/* Password with View / Hide Icon */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono uppercase text-neutral-300 tracking-wider">
                  Administrator Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setView('forgot');
                    setErrorMsg('');
                  }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-mono hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full pl-4 pr-11 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/60 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-neutral-400 hover:text-neutral-200 focus:outline-none transition-colors rounded-lg hover:bg-neutral-800"
                  title={showPassword ? 'Hide password' : 'View password'}
                  aria-label={showPassword ? 'Hide password' : 'View password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-neutral-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-semibold transition-all shadow-md shadow-cyan-500/20 active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Authenticating...' : 'Sign In as Administrator'}</span>
              </button>
            </div>
          </form>
        )}

        {/* VIEW 2: FORGOT PASSWORD / OTP FLOW */}
        {view === 'forgot' && (
          <div>
            {forgotStep === 1 ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-neutral-300 space-y-1.5">
                  <div className="font-semibold text-cyan-400 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Identity Verification</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    To reset administrator access, enter your registered administrator email or phone number. A 6-digit OTP will be dispatched.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5 tracking-wider">
                    Registered Email or Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      <span className="text-neutral-700">/</span>
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      value={resetIdentifier}
                      onChange={e => setResetIdentifier(e.target.value)}
                      required
                      className="w-full pl-16 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/60 transition-colors"
                      placeholder="yashgayake900@gmail.com or 9975246071"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px] font-mono text-neutral-500 mt-2">
                    <span>Authorized:</span>
                    <span className="text-cyan-400">{AUTHORIZED_ADMIN_EMAIL}</span>
                    <span>or</span>
                    <span className="text-cyan-400">+91 {AUTHORIZED_ADMIN_PHONE}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setView('login');
                      setErrorMsg('');
                    }}
                    className="py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Login</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isRequestingOtp}
                    className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-semibold transition-all shadow-md shadow-cyan-500/20 active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isRequestingOtp ? 'Dispatching OTP...' : 'Send 6-Digit OTP'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyAndReset} className="space-y-4">
                {/* OTP Info Display Banner */}
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-neutral-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" />
                      <span>OTP Dispatched</span>
                    </span>
                    {timerSeconds > 0 && (
                      <span className="font-mono text-[11px] text-amber-400 flex items-center gap-1 bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-500/30">
                        <Clock className="w-3 h-3" />
                        <span>Expires: {formatTimer(timerSeconds)}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-300 leading-relaxed">
                    A 6-digit OTP has been sent to your registered Gmail (<span className="text-emerald-300 font-mono">{AUTHORIZED_ADMIN_EMAIL}</span>) and phone (+91 {AUTHORIZED_ADMIN_PHONE}).
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
                  <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5 tracking-wider">
                    Enter 6-Digit OTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-center tracking-[0.4em] font-mono text-base font-bold text-cyan-300 placeholder:text-neutral-700 focus:outline-none focus:border-cyan-500/60"
                    placeholder="••••••"
                  />
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5 tracking-wider">
                    New Administrator Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Enter at least 5 characters"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required
                      className="w-full pl-4 pr-11 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/60 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(prev => !prev)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-neutral-400 hover:text-neutral-200"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4 text-cyan-400" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-300 mb-1.5 tracking-wider">
                    Confirm New Password
                  </label>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    className={`w-full px-4 py-2 rounded-xl bg-neutral-950 border text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none transition-colors ${
                      confirmPassword && newPassword !== confirmPassword
                        ? 'border-rose-500/60 focus:border-rose-500'
                        : 'border-neutral-800 focus:border-cyan-500/60'
                    }`}
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-[10px] text-rose-400 font-mono mt-1">Passwords do not match</p>
                  )}
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotStep(1);
                      setErrorMsg('');
                    }}
                    className="py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change Contact</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isResettingPassword}
                    className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-semibold transition-all shadow-md shadow-cyan-500/20 active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>{isResettingPassword ? 'Resetting Password...' : 'Verify OTP & Reset'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-neutral-800/80 text-center">
          <p className="text-[11px] font-mono text-neutral-500 flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Encrypted credentials check against server &amp; database</span>
          </p>
        </div>
      </div>
    </div>
  );
}
