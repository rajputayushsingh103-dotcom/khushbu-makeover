import React, { useState } from 'react';
import {
  X, Mail, Lock, User, Phone, Sparkles, CheckCircle2,
  AlertCircle, ArrowRight, Eye, EyeOff, ShieldCheck, Heart,
  Calendar, Clock, LogOut, Check, ChevronRight
} from 'lucide-react';
import { AuthUser, Appointment, SalonInfo } from '../types';
import { salonService } from '../services/salonService';
import { SALON_INFO } from '../data/initialData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  authUser: AuthUser | null;
  onAuthSuccess: (user: AuthUser) => void;
  onLogout: () => void;
  salonInfo?: SalonInfo;
  userAppointments?: Appointment[];
  onOpenBooking?: () => void;
  initialMode?: 'signin' | 'signup' | 'profile';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  authUser,
  onAuthSuccess,
  onLogout,
  salonInfo = SALON_INFO,
  userAppointments = [],
  onOpenBooking,
  initialMode = 'signin'
}) => {
  const info = salonInfo || SALON_INFO;
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot' | 'google_select'>(
    initialMode === 'signup' ? 'signup' : 'signin'
  );

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status & errors
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // 1-Click Google Sign In
  const handleGoogleSignIn = async (selectedEmail?: string, selectedName?: string, photo?: string) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate Google OAuth response
      const profile = {
        name: selectedName || name || 'Aaradhya Sharma',
        email: selectedEmail || email || 'aaradhya.sharma@gmail.com',
        phone: phone || '+91 98201 54321',
        photoUrl: photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      };
      const user = await salonService.loginWithGoogle(profile);
      onAuthSuccess(user);
      setSuccessMsg(`Welcome to ${info.name}, ${user.name}!`);
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 1200);
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Email & Password Sign In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const user = await salonService.loginWithEmail(email, password);
      onAuthSuccess(user);
      setSuccessMsg(`Welcome back, ${user.name}!`);
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 1200);
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Email & Password Sign Up
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in your name, email and create a password.');
      return;
    }
    if (password.length < 6) {
      setError('Password should be at least 6 characters long.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const user = await salonService.registerWithEmail(name, email, password, phone);
      onAuthSuccess(user);
      setSuccessMsg(`Account created successfully! Welcome, ${user.name}!`);
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 1200);
    } catch (err: any) {
      setError(err?.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password handler
  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your registered email address.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg(`Password reset link has been sent to ${email}. Please check your inbox.`);
      setTimeout(() => {
        setMode('signin');
        setSuccessMsg(null);
      }, 3500);
    }, 1000);
  };

  // Filter user's bookings if logged in
  const myBookings = authUser
    ? userAppointments.filter(
        a =>
          a.email?.toLowerCase() === authUser.email.toLowerCase() ||
          (authUser.phone && a.phone && a.phone.includes(authUser.phone.slice(-8)))
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-[#181617] rounded-3xl border border-stone-200 dark:border-[#E0A96D]/30 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="relative p-6 bg-gradient-to-r from-[#1D1A1B] via-[#2A2426] to-[#1D1A1B] text-white border-b border-stone-800">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#B76E79] via-[#E0A96D] to-[#F3D1A5] p-0.5 shadow-md shrink-0">
              <div className="w-full h-full rounded-full bg-[#181617] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#E0A96D]" />
              </div>
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-white leading-tight">
                {authUser ? 'VIP Client Account' : info.name}
              </h3>
              <p className="text-xs text-[#E0A96D] tracking-wide">
                {authUser ? 'Personalized Beauty & Booking Portal' : 'Luxury Beauty & Bridal Portal'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* LOGGED IN USER PROFILE DASHBOARD */}
          {authUser ? (
            <div className="space-y-6">
              {/* User Profile Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FAF0E6]/80 via-white to-[#FAF0E6]/40 dark:from-stone-900 dark:via-stone-900/90 dark:to-stone-950 border border-[#E0A96D]/30 shadow-sm space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={authUser.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(authUser.name)}`}
                    alt={authUser.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#E0A96D] shadow-md shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif text-lg font-bold text-stone-900 dark:text-white truncate">
                        {authUser.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-[#E0A96D]/20 text-[#8C5E35] dark:text-[#E0A96D] text-[10px] font-bold shrink-0">
                        {authUser.vipStatus || 'VIP Member'}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 truncate mt-0.5">{authUser.email}</p>
                    {authUser.phone && (
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{authUser.phone}</p>
                    )}
                    <div className="flex items-center gap-1.5 text-[11px] text-[#8C5E35] dark:text-[#E0A96D] mt-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Signed in via {authUser.provider === 'google' ? 'Google Account' : 'Direct Email'}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-200 dark:border-stone-800 text-xs">
                  <div className="p-3 rounded-xl bg-white/70 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
                    <span className="text-stone-500 dark:text-stone-400 block text-[11px]">Total Bookings</span>
                    <span className="text-base font-bold text-stone-900 dark:text-white">{myBookings.length}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/70 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
                    <span className="text-stone-500 dark:text-stone-400 block text-[11px]">VIP Discount</span>
                    <span className="text-base font-bold text-[#8C5E35] dark:text-[#E0A96D]">10% Pre-Booking</span>
                  </div>
                </div>
              </div>

              {/* My Appointments List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-serif text-sm font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#E0A96D]" />
                    <span>My Studio Appointments</span>
                  </h5>
                  {onOpenBooking && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenBooking();
                      }}
                      className="text-xs text-[#8C5E35] dark:text-[#E0A96D] font-bold hover:underline"
                    >
                      + Book New Service
                    </button>
                  )}
                </div>

                {myBookings.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-dashed border-stone-300 dark:border-stone-800 text-center space-y-2">
                    <Sparkles className="w-6 h-6 text-[#E0A96D] mx-auto opacity-70" />
                    <p className="text-xs text-stone-600 dark:text-stone-400">
                      You don't have any appointments booked yet.
                    </p>
                    {onOpenBooking && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenBooking();
                        }}
                        className="px-4 py-2 rounded-xl bg-[#E0A96D] text-stone-950 text-xs font-bold hover:bg-[#C58F5E] transition-all inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Reserve Your First Slot</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                    {myBookings.map((apt) => (
                      <div
                        key={apt.id}
                        className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900 dark:text-white">{apt.serviceName}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                apt.status === 'confirmed'
                                  ? 'bg-emerald-500/15 text-emerald-600'
                                  : apt.status === 'pending'
                                  ? 'bg-amber-500/15 text-amber-600'
                                  : 'bg-stone-500/15 text-stone-500'
                              }`}
                            >
                              {apt.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-stone-500 dark:text-stone-400 text-[11px] flex items-center gap-2">
                            <span>📅 {apt.date}</span>
                            <span>⏰ {apt.timeSlot}</span>
                          </p>
                          <p className="text-stone-500 text-[10px]">Booking Code: {apt.bookingCode}</p>
                        </div>
                        <span className="font-bold text-[#8C5E35] dark:text-[#E0A96D]">₹{apt.totalPrice.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="flex-1 py-3 rounded-xl border border-rose-500/30 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-stone-900 dark:bg-stone-800 text-white font-semibold text-xs hover:bg-stone-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* NOT LOGGED IN: TABS */}
              <div className="flex rounded-2xl bg-stone-100 dark:bg-stone-900 p-1 border border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setError(null);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    mode === 'signin'
                      ? 'bg-white dark:bg-stone-800 text-[#8C5E35] dark:text-[#E0A96D] shadow-sm'
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  Sign In / Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    mode === 'signup'
                      ? 'bg-white dark:bg-stone-800 text-[#8C5E35] dark:text-[#E0A96D] shadow-sm'
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  New Client Sign Up
                </button>
              </div>

              {/* Notification Alerts */}
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* 1. DIRECT GOOGLE SIGN IN (BINA PASSWORD KE DIRECT LOGIN) */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleGoogleSignIn()}
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-2xl border-2 border-stone-300 dark:border-stone-700 hover:border-[#E0A96D] bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 font-semibold text-xs sm:text-sm shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 group"
                >
                  {/* Multicolored Google SVG */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google (1-Click Direct Login)</span>
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                    Or with Email & Password
                  </span>
                  <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800" />
                </div>
              </div>

              {/* 2. SIGN IN FORM */}
              {mode === 'signin' && (
                <form onSubmit={handleEmailSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="youremail@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-[#E0A96D]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[11px] text-[#8C5E35] dark:text-[#E0A96D] hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-[#E0A96D]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-stone-600 dark:text-stone-400">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-stone-300 text-[#E0A96D] focus:ring-[#E0A96D]"
                      />
                      <span>Remember me</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#B76E79] via-[#C58F5E] to-[#E0A96D] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#E0A96D]/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>Sign In to Your Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-center text-xs text-stone-500">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className="text-[#8C5E35] dark:text-[#E0A96D] font-bold hover:underline"
                    >
                      Create Free VIP Account
                    </button>
                  </p>
                </form>
              )}

              {/* 3. SIGN UP FORM */}
              {mode === 'signup' && (
                <form onSubmit={handleEmailSignUp} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Priya Kapoor"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-[#E0A96D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="youremail@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-[#E0A96D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Mobile / WhatsApp Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-[#E0A96D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Create Password (min 6 chars) *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        placeholder="Create strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-[#E0A96D]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#B76E79] via-[#C58F5E] to-[#E0A96D] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#E0A96D]/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>Create VIP Account & Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-center text-xs text-stone-500">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signin')}
                      className="text-[#8C5E35] dark:text-[#E0A96D] font-bold hover:underline"
                    >
                      Sign In here
                    </button>
                  </p>
                </form>
              )}

              {/* 4. FORGOT PASSWORD VIEW */}
              {mode === 'forgot' && (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-[#FAF0E6] dark:bg-stone-800 text-xs text-stone-700 dark:text-stone-300">
                    <p>
                      Enter your registered email address and we'll send you an instant link to reset your VIP account password.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Registered Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="youremail@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-[#E0A96D]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-[#E0A96D] text-stone-950 font-bold text-xs sm:text-sm hover:bg-[#C58F5E] transition-all flex items-center justify-center gap-2"
                  >
                    <span>Send Reset Instructions</span>
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setMode('signin')}
                      className="text-xs text-stone-500 hover:text-stone-900 dark:hover:text-white"
                    >
                      ← Back to Sign In
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
