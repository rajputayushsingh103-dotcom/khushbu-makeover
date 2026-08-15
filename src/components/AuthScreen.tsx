import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Mail, Lock, User, Phone, Eye, EyeOff, KeyRound, ArrowRight, ShieldCheck, RefreshCw, AlertCircle, Sparkles, Heart, Crown } from 'lucide-react';

interface Props {
  onLoginSuccess: (user: any) => void;
}

type AuthMode = 'login' | 'register' | 'otp_request' | 'otp_verify';

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  picture: string;
  createdAt: string;
}

let memoryUsersBackup: RegisteredUser[] = [];

export const AuthScreen: React.FC<Props> = ({ onLoginSuccess }) => {
  const BEAUTY_PARLOUR_BG = "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=2000&q=85";

  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form Fields
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // OTP Verification States
  const [otpTarget, setOtpTarget] = useState<'email' | 'phone'>('email');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [matchedUser, setMatchedUser] = useState<RegisteredUser | null>(null);

  const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

  // 🛡️ Data Cleaners
  const cleanPhone = (val: string) => {
    if (!val) return '';
    const digits = val.replace(/\D/g, '');
    return digits.length >= 10 ? digits.slice(-10) : digits;
  };
  
  const cleanEmail = (val: string) => (val || '').trim().toLowerCase();
  const cleanPassword = (val: string) => (val || '').trim();

  const getRegisteredUsers = (): RegisteredUser[] => {
    try {
      const stored = localStorage.getItem('km_registered_users');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          memoryUsersBackup = parsed;
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return memoryUsersBackup;
  };

  const saveRegisteredUsers = (users: RegisteredUser[]) => {
    memoryUsersBackup = users;
    try {
      localStorage.setItem('km_registered_users', JSON.stringify(users));
    } catch (e) {
      console.warn("Storage save error:", e);
    }
  };

  // ⚡ Instant Dashboard Switch Trigger (No manual page refresh needed)
  const completeAuth = (user: RegisteredUser) => {
    try {
      localStorage.setItem('km_user', JSON.stringify(user));
      // Dispatch browser events taaki parent app turant re-render ho jaye
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('authChange', { detail: user }));
    } catch (err) {
      console.error(err);
    }
    // Callback to parent component instantly
    onLoginSuccess(user);
  };

  const findUnifiedUser = (idOrEmailOrPhone: string): RegisteredUser | undefined => {
    const raw = (idOrEmailOrPhone || '').trim();
    if (!raw) return undefined;

    const savedUsers = getRegisteredUsers();
    const cleanId = cleanEmail(raw);
    const cleanP = cleanPhone(raw);

    return savedUsers.find((u) => {
      const uEmail = cleanEmail(u.email);
      const uPhone = cleanPhone(u.phone);

      if (cleanId.includes('@') && uEmail === cleanId) return true;
      if (cleanP.length === 10 && uPhone === cleanP) return true;
      if (uEmail && uEmail === cleanId) return true;
      if (uPhone && cleanP.length === 10 && uPhone === cleanP) return true;

      return false;
    });
  };

  // 1. REGISTER
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const trimmedName = name.trim();
    const normalizedEmail = cleanEmail(email);
    const normalizedPhone = cleanPhone(phone);
    const normalizedPassword = cleanPassword(password);

    if (!trimmedName) {
      setError("Kripya apna poora Naam bharein!");
      return;
    }
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      setError("Kripya valid Email ID daalein!");
      return;
    }
    if (!normalizedPhone || normalizedPhone.length !== 10) {
      setError("Kripya 10-digit Mobile Number bharein!");
      return;
    }
    if (!normalizedPassword || normalizedPassword.length < 4) {
      setError("Password kam se kam 4 characters ka banayein!");
      return;
    }

    const savedUsers = getRegisteredUsers();

    if (savedUsers.some((u) => cleanEmail(u.email) === normalizedEmail)) {
      setError("Is Email ID se account pehle se bana hai! Kripya Sign In karein.");
      return;
    }
    if (savedUsers.some((u) => cleanPhone(u.phone) === normalizedPhone)) {
      setError("Is Mobile Number se account pehle se bana hai! Kripya Sign In karein.");
      return;
    }

    const newUser: RegisteredUser = {
      id: 'usr_' + Date.now(),
      name: trimmedName,
      email: normalizedEmail,
      phone: normalizedPhone,
      password: normalizedPassword,
      picture: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(trimmedName)}&backgroundColor=f43f5e,fb7185,fda4af`,
      createdAt: new Date().toISOString(),
    };

    const updatedList = [...savedUsers, newUser];
    saveRegisteredUsers(updatedList);
    setSuccessMsg(`Welcome gorgeous, ${newUser.name}! ✨`);
    
    // Switch to dashboard immediately
    completeAuth(newUser);
  };

  // 2. PASSWORD LOGIN
  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const inputVal = identifier.trim();
    const enteredPassword = cleanPassword(password);

    if (!inputVal) {
      setError("Kripya apna registered Mobile No. ya Email daalein!");
      return;
    }
    if (!enteredPassword) {
      setError("Kripya Password daalein!");
      return;
    }

    const foundUser = findUnifiedUser(inputVal);

    if (!foundUser) {
      setError("Account nahi mila! Kripya pehle Register karein.");
      return;
    }

    const storedPassword = cleanPassword(foundUser.password || '');

    if (storedPassword !== enteredPassword) {
      setError("Galat Password! Kripya sahi password daalein ya OTP chunein.");
      return;
    }

    setSuccessMsg(`Welcome back, ${foundUser.name}! 💖`);
    
    // Switch to dashboard immediately
    completeAuth(foundUser);
  };

  // 3. SEND OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const inputVal = identifier.trim();
    if (!inputVal) {
      setError(`Kripya apna registered ${otpTarget === 'email' ? 'Email Address' : 'Mobile Number'} daalein!`);
      return;
    }

    const foundUser = findUnifiedUser(inputVal);
    if (!foundUser) {
      setError("User does not exist! Kripya pehle Register karein.");
      return;
    }

    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setMatchedUser(foundUser);
    setAuthMode('otp_verify');

    setSuccessMsg(`OTP aapke registered ${otpTarget === 'email' ? 'Gmail Address' : 'Mobile Number'} par bhej diya gaya hai. Kripya check karein!`);
  };

  // 4. VERIFY OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!matchedUser) {
      setError("Session expired. Dobara koshish karein.");
      setAuthMode('otp_request');
      return;
    }

    if (otpInput.trim() === generatedOtp) {
      setSuccessMsg(`Verified! Welcome, ${matchedUser.name}! ✨`);
      // Switch to dashboard immediately
      completeAuth(matchedUser);
    } else {
      setError("Galat OTP! Kripya sahi code daalein.");
    }
  };

  // 5. GOOGLE LOGIN
  const handleGoogleSuccess = (credentialResponse: any) => {
    try {
      if (credentialResponse.credential) {
        const decoded: any = jwtDecode(credentialResponse.credential);
        const googleEmail = cleanEmail(decoded.email);
        const savedUsers = getRegisteredUsers();

        let user = savedUsers.find((u) => cleanEmail(u.email) === googleEmail);

        if (user) {
          user.picture = decoded.picture || user.picture;
          saveRegisteredUsers(savedUsers);
        } else {
          user = {
            id: 'usr_g_' + Date.now(),
            name: decoded.name,
            email: googleEmail,
            phone: '',
            password: '',
            picture: decoded.picture,
            createdAt: new Date().toISOString(),
          };
          saveRegisteredUsers([...savedUsers, user]);
        }

        completeAuth(user);
      }
    } catch {
      setError("Google Login me error aayi.");
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {/* 🌸 Custom Hardware-Accelerated Mobile Keyframe Animations */}
      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(5deg); }
        }
        @keyframes mobileEntrance {
          0% { opacity: 0; transform: translateY(30px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmerGlow {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulseAura {
          0%, 100% { transform: scale(1); opacity: 0.35; }
          50% { transform: scale(1.15); opacity: 0.55; }
        }
        .animate-mobile-card {
          animation: mobileEntrance 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-floating {
          animation: floatSlow 5s ease-in-out infinite;
        }
        .animate-aura {
          animation: pulseAura 7s ease-in-out infinite;
        }
        .btn-shimmer {
          background-size: 200% 100%;
          animation: shimmerGlow 4s infinite linear;
        }
      `}</style>

      {/* 🌸 Mobile-Optimized Background Container */}
      <div 
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(35, 10, 20, 0.7) 0%, rgba(20, 5, 12, 0.8) 100%), url(${BEAUTY_PARLOUR_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
        className="min-h-screen w-full flex items-center justify-center p-3 sm:p-6 relative overflow-hidden font-sans select-none"
      >
        {/* Floating Ambient Light Rings (Active on Mobile & Desktop) */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-rose-500/30 rounded-full blur-3xl pointer-events-none animate-aura" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-pink-500/30 rounded-full blur-3xl pointer-events-none animate-aura" style={{ animationDelay: '3s' }} />

        {/* Floating Decorative Petals for Mobile Aesthetics */}
        <div className="absolute top-12 left-8 text-rose-300/40 text-2xl animate-floating pointer-events-none">🌸</div>
        <div className="absolute bottom-16 left-12 text-pink-300/35 text-xl animate-floating pointer-events-none" style={{ animationDelay: '2s' }}>✨</div>
        <div className="absolute top-20 right-10 text-rose-300/40 text-2xl animate-floating pointer-events-none" style={{ animationDelay: '1.5s' }}>💖</div>
        <div className="absolute bottom-24 right-8 text-pink-300/35 text-xl animate-floating pointer-events-none" style={{ animationDelay: '3.5s' }}>🌸</div>

        {/* 💖 Animated Mobile Glass Card */}
        <div className="w-full max-w-[420px] rounded-[32px] p-5 sm:p-8 shadow-2xl shadow-black/50 relative z-10 border border-white/50 bg-white/95 backdrop-blur-2xl animate-mobile-card">
          
          {/* Brand Header */}
          <div className="text-center mb-5">
            <div className="relative inline-block mx-auto mb-2.5">
              <div className="w-15 h-15 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#F43F5E] via-[#FB7185] to-[#FDA4AF] p-0.5 shadow-lg shadow-rose-500/35 animate-floating">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <span className="font-serif text-2xl font-bold bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
                    KM
                  </span>
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white p-1 rounded-full text-[10px] shadow-md animate-pulse">
                <Crown className="w-3 h-3" />
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-rose-950 tracking-tight flex items-center justify-center gap-1.5">
              Khushboo Makeover
            </h1>
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-rose-500 font-bold mt-1">
              ✨ Luxury Bridal Studio & Salon ✨
            </p>
          </div>

          {/* Pretty Rose Switch Tabs (Touch-Optimized) */}
          <div className="flex bg-rose-100/70 p-1.5 rounded-2xl border border-rose-200/80 mb-5 shadow-inner">
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setError(null); setSuccessMsg(null); }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 active:scale-95 ${
                authMode === 'login'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-400/40 scale-[1.02]'
                  : 'text-rose-800/70 hover:text-rose-950'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('otp_request'); setError(null); setSuccessMsg(null); }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 active:scale-95 ${
                authMode === 'otp_request' || authMode === 'otp_verify'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-400/40 scale-[1.02]'
                  : 'text-rose-800/70 hover:text-rose-950'
              }`}
            >
              OTP Login
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('register'); setError(null); setSuccessMsg(null); }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 active:scale-95 ${
                authMode === 'register'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-400/40 scale-[1.02]'
                  : 'text-rose-800/70 hover:text-rose-950'
              }`}
            >
              Join VIP
            </button>
          </div>

          {/* Animated Alerts */}
          {error && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 text-center flex items-center justify-center gap-2 shadow-sm animate-mobile-card">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 animate-bounce" />
              <span>{error}</span>
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3.5 bg-pink-50 border border-pink-200 rounded-2xl text-xs text-rose-800 text-center shadow-sm font-medium animate-mobile-card">
              {successMsg}
            </div>
          )}

          {/* 🌸 1. REGISTRATION FORM */}
          {authMode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="relative">
                <User className="w-4 h-4 text-rose-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs rounded-2xl pl-10 pr-4 py-3.5 outline-none border border-rose-200/80 bg-rose-50/50 text-rose-950 placeholder-rose-400/70 focus:border-rose-400 focus:ring-4 focus:ring-rose-200/40 transition-all font-medium"
                  required
                />
              </div>

              <div className="relative">
                <Phone className="w-4 h-4 text-rose-400 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="10-Digit Mobile Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs rounded-2xl pl-10 pr-4 py-3.5 outline-none border border-rose-200/80 bg-rose-50/50 text-rose-950 placeholder-rose-400/70 focus:border-rose-400 focus:ring-4 focus:ring-rose-200/40 transition-all font-medium"
                  required
                />
              </div>

              <div className="relative">
                <Mail className="w-4 h-4 text-rose-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  placeholder="Gmail / Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs rounded-2xl pl-10 pr-4 py-3.5 outline-none border border-rose-200/80 bg-rose-50/50 text-rose-950 placeholder-rose-400/70 focus:border-rose-400 focus:ring-4 focus:ring-rose-200/40 transition-all font-medium"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-rose-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs rounded-2xl pl-10 pr-10 py-3.5 outline-none border border-rose-200/80 bg-rose-50/50 text-rose-950 placeholder-rose-400/70 focus:border-rose-400 focus:ring-4 focus:ring-rose-200/40 transition-all font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-rose-400 hover:text-rose-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-500/30 hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 mt-2 btn-shimmer"
              >
                <span>Register & Join VIP Club</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* 🌸 2. PASSWORD LOGIN FORM */}
          {authMode === 'login' && (
            <form onSubmit={handlePasswordLogin} className="space-y-3.5">
              <div className="relative">
                <User className="w-4 h-4 text-rose-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Registered Mobile No. ya Gmail ID"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full text-xs rounded-2xl pl-10 pr-4 py-3.5 outline-none border border-rose-200/80 bg-rose-50/50 text-rose-950 placeholder-rose-400/70 focus:border-rose-400 focus:ring-4 focus:ring-rose-200/40 transition-all font-medium"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-rose-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs rounded-2xl pl-10 pr-10 py-3.5 outline-none border border-rose-200/80 bg-rose-50/50 text-rose-950 placeholder-rose-400/70 focus:border-rose-400 focus:ring-4 focus:ring-rose-200/40 transition-all font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-rose-400 hover:text-rose-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => { setAuthMode('otp_request'); setError(null); }}
                  className="text-[11px] text-rose-600 hover:text-rose-800 hover:underline font-semibold"
                >
                  Password bhool gaye? OTP se Login karein →
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-500/30 hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 mt-2 btn-shimmer"
              >
                <span>Enter Luxury Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* 🌸 3. OTP REQUEST FORM */}
          {authMode === 'otp_request' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="text-left">
                <label className="text-xs font-bold text-rose-900 block mb-2">OTP Kahan Mangwana Hai?</label>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setOtpTarget('email')}
                    className={`py-2.5 px-3 rounded-2xl text-xs font-bold border flex items-center justify-center gap-2 transition-all active:scale-95 ${
                      otpTarget === 'email'
                        ? 'border-rose-400 bg-rose-100 text-rose-800 shadow-sm'
                        : 'border-rose-200/80 bg-rose-50/40 text-rose-600'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Gmail Address</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOtpTarget('phone')}
                    className={`py-2.5 px-3 rounded-2xl text-xs font-bold border flex items-center justify-center gap-2 transition-all active:scale-95 ${
                      otpTarget === 'phone'
                        ? 'border-rose-400 bg-rose-100 text-rose-800 shadow-sm'
                        : 'border-rose-200/80 bg-rose-50/40 text-rose-600'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Mobile SMS</span>
                  </button>
                </div>

                <div className="relative">
                  {otpTarget === 'email' ? <Mail className="w-4 h-4 text-rose-400 absolute left-3.5 top-3.5" /> : <Phone className="w-4 h-4 text-rose-400 absolute left-3.5 top-3.5" />}
                  <input
                    type={otpTarget === 'email' ? 'email' : 'tel'}
                    placeholder={otpTarget === 'email' ? 'Registered Gmail Address daalein' : 'Registered 10-Digit Mobile No.'}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full text-xs rounded-2xl pl-10 pr-4 py-3.5 outline-none border border-rose-200/80 bg-rose-50/50 text-rose-950 placeholder-rose-400/70 focus:border-rose-400 focus:ring-4 focus:ring-rose-200/40 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-500/30 hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 btn-shimmer"
              >
                <span>Send 6-Digit OTP</span>
                <KeyRound className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* 🌸 4. OTP VERIFY FORM */}
          {authMode === 'otp_verify' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center p-3.5 rounded-2xl border border-rose-200 bg-rose-50/70 animate-pulse">
                <p className="text-xs text-rose-700 font-medium">OTP Dispatch to Registered Client:</p>
                <p className="text-sm font-bold text-rose-950 mt-0.5">{matchedUser?.name} ({matchedUser?.phone || matchedUser?.email})</p>
              </div>

              <div className="relative">
                <KeyRound className="w-4 h-4 text-rose-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-Digit OTP"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="w-full tracking-[0.35em] font-bold text-center text-base rounded-2xl py-3.5 outline-none border border-rose-200 bg-rose-50/50 text-rose-950 focus:border-rose-400 focus:ring-4 focus:ring-rose-200/40 transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-500/30 hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 btn-shimmer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify OTP & Unlock Profile</span>
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setAuthMode('otp_request')}
                  className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center justify-center gap-1 mx-auto active:scale-95 transition-transform"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Number / Email badalna hai?</span>
                </button>
              </div>
            </form>
          )}

          {/* Decorative Divider */}
          <div className="relative my-4 sm:my-5 flex items-center justify-center">
            <div className="border-t border-rose-200/70 w-full" />
            <span className="px-3 text-[10px] uppercase tracking-widest absolute bg-white text-rose-400 font-bold">
              OR 1-Click VIP Access
            </span>
          </div>

          {/* Google Sign In Button */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google login me error aayi.")}
              shape="pill"
              theme="outline"
              size="medium"
              text="continue_with"
              width="280"
            />
          </div>

          {/* Footer Badges */}
          <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-rose-100 flex items-center justify-center gap-3 sm:gap-4 text-[9px] sm:text-[10px] font-semibold text-rose-700/80">
            <span className="flex items-center gap-1">🌸 HD Airbrush</span>
            <span>•</span>
            <span className="flex items-center gap-1">💖 100% Privacy</span>
            <span>•</span>
            <span className="flex items-center gap-1">✨ VIP Suite</span>
          </div>

        </div>
      </div>
    </GoogleOAuthProvider>
  );
};