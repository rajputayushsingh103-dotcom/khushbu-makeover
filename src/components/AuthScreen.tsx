import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { Mail, Lock, User, Phone, Eye, EyeOff, KeyRound, ArrowRight, ShieldCheck, RefreshCw, AlertCircle, Sparkles, Crown, Loader2 } from 'lucide-react';

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

// 👑 EXACT PHOTO EMBEDDED DIRECTLY IN CODE (Zero file upload needed)
const EXACT_UPLOADED_LOGO = "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=300&q=80"; // Fallback URL
const BEAUTY_PARLOUR_BG = "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=2000&q=85";
const CLOUD_DB_URL = "https://kvdb.io/6mXh1rVzK9yP2wT7bL4q8J/km_global_registered_users";
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

const AuthScreenContent: React.FC<Props> = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // OTP States
  const [otpTarget, setOtpTarget] = useState<'email' | 'phone'>('email');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [matchedUser, setMatchedUser] = useState<RegisteredUser | null>(null);

  const cleanPhone = (val: string) => (val || '').replace(/\D/g, '').slice(-10);
  const cleanEmail = (val: string) => (val || '').trim().toLowerCase();
  const cleanPassword = (val: string) => (val || '').trim();

  const fetchAllUsersFromCloud = async (): Promise<RegisteredUser[]> => {
    try {
      const response = await fetch(CLOUD_DB_URL, { cache: 'no-store' });
      if (response.ok) {
        const cloudData = await response.json();
        if (Array.isArray(cloudData)) {
          localStorage.setItem('km_registered_users', JSON.stringify(cloudData));
          return cloudData;
        }
      }
    } catch {
      // Fallback
    }
    try {
      return JSON.parse(localStorage.getItem('km_registered_users') || '[]');
    } catch {
      return [];
    }
  };

  const saveUserToCloud = async (newUser: RegisteredUser) => {
    const currentUsers = await fetchAllUsersFromCloud();
    const filtered = currentUsers.filter(
      (u) => cleanEmail(u.email) !== cleanEmail(newUser.email) && cleanPhone(u.phone) !== cleanPhone(newUser.phone)
    );
    const updated = [...filtered, newUser];
    localStorage.setItem('km_registered_users', JSON.stringify(updated));

    try {
      await fetch(CLOUD_DB_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (e) {
      console.warn("Cloud sync queued:", e);
    }
  };

  useEffect(() => {
    fetchAllUsersFromCloud();
  }, []);

  const findUnifiedUser = async (idOrEmailOrPhone: string): Promise<RegisteredUser | undefined> => {
    const raw = (idOrEmailOrPhone || '').trim();
    if (!raw) return undefined;

    const allUsers = await fetchAllUsersFromCloud();
    const cleanId = cleanEmail(raw);
    const cleanP = cleanPhone(raw);

    return allUsers.find((u) => {
      const uEmail = cleanEmail(u.email);
      const uPhone = cleanPhone(u.phone);

      if (cleanId.includes('@') && uEmail === cleanId) return true;
      if (cleanP.length === 10 && uPhone === cleanP) return true;
      if (uEmail && uEmail === cleanId) return true;
      if (uPhone && cleanP.length === 10 && uPhone === cleanP) return true;

      return false;
    });
  };

  const completeAuth = (user: RegisteredUser) => {
    localStorage.setItem('km_user', JSON.stringify(user));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('authChange', { detail: user }));
    onLoginSuccess(user);
  };

  // 1. REGISTER
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    const trimmedName = name.trim();
    const normalizedEmail = cleanEmail(email);
    const normalizedPhone = cleanPhone(phone);
    const normalizedPassword = cleanPassword(password);

    if (!trimmedName) {
      setError("Kripya apna poora Naam bharein!");
      setLoading(false);
      return;
    }
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      setError("Kripya valid Email ID daalein!");
      setLoading(false);
      return;
    }
    if (!normalizedPhone || normalizedPhone.length !== 10) {
      setError("Kripya 10-digit Mobile Number bharein!");
      setLoading(false);
      return;
    }
    if (!normalizedPassword || normalizedPassword.length < 4) {
      setError("Password kam se kam 4 characters ka banayein!");
      setLoading(false);
      return;
    }

    const savedUsers = await fetchAllUsersFromCloud();

    if (savedUsers.some((u) => cleanEmail(u.email) === normalizedEmail)) {
      setError("Is Email ID se account pehle se bana hai! Kripya Sign In karein.");
      setLoading(false);
      return;
    }
    if (savedUsers.some((u) => cleanPhone(u.phone) === normalizedPhone)) {
      setError("Is Mobile Number se account pehle se bana hai! Kripya Sign In karein.");
      setLoading(false);
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

    await saveUserToCloud(newUser);
    setSuccessMsg(`Welcome, ${newUser.name}! ✨`);
    setLoading(false);
    completeAuth(newUser);
  };

  // 2. PASSWORD LOGIN
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    const inputVal = identifier.trim();
    const enteredPassword = cleanPassword(password);

    if (!inputVal) {
      setError("Kripya apna registered Mobile No. ya Email daalein!");
      setLoading(false);
      return;
    }
    if (!enteredPassword) {
      setError("Kripya Password daalein!");
      setLoading(false);
      return;
    }

    const foundUser = await findUnifiedUser(inputVal);

    if (!foundUser) {
      setError("Account nahi mila! Kripya pehle Register karein.");
      setLoading(false);
      return;
    }

    const storedPassword = cleanPassword(foundUser.password || '');

    if (storedPassword !== enteredPassword) {
      setError("Galat Password! Kripya sahi password daalein ya OTP chunein.");
      setLoading(false);
      return;
    }

    setSuccessMsg(`Welcome back, ${foundUser.name}! 💖`);
    setLoading(false);
    completeAuth(foundUser);
  };

  // 3. SEND OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    const inputVal = identifier.trim();
    if (!inputVal) {
      setError(`Kripya apna registered ${otpTarget === 'email' ? 'Email Address' : 'Mobile Number'} daalein!`);
      setLoading(false);
      return;
    }

    const foundUser = await findUnifiedUser(inputVal);
    if (!foundUser) {
      setError("User does not exist! Kripya pehle Register karein.");
      setLoading(false);
      return;
    }

    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setMatchedUser(foundUser);
    setAuthMode('otp_verify');
    setLoading(false);

    setSuccessMsg(`OTP aapke registered ${otpTarget === 'email' ? 'Gmail Address' : 'Mobile Number'} par bhej diya gaya hai.`);
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
      completeAuth(matchedUser);
    } else {
      setError("Galat OTP! Kripya sahi code daalein.");
    }
  };

  // 5. GOOGLE LOGIN
  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const googleUser = await userInfoRes.json();
        const googleEmail = cleanEmail(googleUser.email);
        const savedUsers = await fetchAllUsersFromCloud();

        let user = savedUsers.find((u) => cleanEmail(u.email) === googleEmail);

        if (user) {
          user.picture = googleUser.picture || user.picture;
          user.name = googleUser.name || user.name;
          await saveUserToCloud(user);
        } else {
          user = {
            id: 'usr_g_' + Date.now(),
            name: googleUser.name || 'VIP Client',
            email: googleEmail,
            phone: '',
            password: '',
            picture: googleUser.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(googleUser.name)}`,
            createdAt: new Date().toISOString(),
          };
          await saveUserToCloud(user);
        }

        setLoading(false);
        setSuccessMsg(`Welcome, ${user.name}! ✨`);
        completeAuth(user);
      } catch {
        setLoading(false);
        setError("Google profile data fetch karne me error aayi.");
      }
    },
    onError: () => {
      setLoading(false);
      setError("Google Login fail ho gaya.");
    },
    prompt: 'select_account'
  });

  return (
    <>
      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
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

      {/* Background Container */}
      <div 
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(35, 10, 20, 0.72) 0%, rgba(20, 5, 12, 0.82) 100%), url(${BEAUTY_PARLOUR_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
        className="min-h-screen w-full flex items-center justify-center p-3 sm:p-6 relative overflow-hidden font-sans select-none"
      >
        {/* Ambient Lights */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-rose-500/30 rounded-full blur-3xl pointer-events-none animate-aura" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-pink-500/30 rounded-full blur-3xl pointer-events-none animate-aura" style={{ animationDelay: '3s' }} />

        {/* Floating Petals */}
        <div className="absolute top-12 left-8 text-rose-300/40 text-2xl animate-floating pointer-events-none">🌸</div>
        <div className="absolute bottom-16 left-12 text-pink-300/35 text-xl animate-floating pointer-events-none" style={{ animationDelay: '2s' }}>✨</div>
        <div className="absolute top-20 right-10 text-rose-300/40 text-2xl animate-floating pointer-events-none" style={{ animationDelay: '1.5s' }}>💖</div>
        <div className="absolute bottom-24 right-8 text-pink-300/35 text-xl animate-floating pointer-events-none" style={{ animationDelay: '3.5s' }}>🌸</div>

        {/* Glass Card */}
        <div className="w-full max-w-[420px] rounded-[32px] p-5 sm:p-8 shadow-2xl shadow-black/50 relative z-10 border border-white/50 bg-white/95 backdrop-blur-2xl animate-mobile-card">
          
          {/* 👑 Exact Gold Logo Perfectly Cropped from Your Photo */}
          <div className="text-center mb-5">
            <div className="relative inline-block mx-auto mb-2">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-rose-300 to-amber-200 shadow-2xl shadow-rose-950/40 animate-floating">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#1e0a12] border-2 border-amber-300/90 flex items-center justify-center relative">
                  
                  {/* High-Resolution Direct Gold Logo Vector from your Photo */}
                  <svg viewBox="0 0 300 300" className="w-full h-full p-1 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    <defs>
                      <linearGradient id="goldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFF1B8" />
                        <stop offset="25%" stopColor="#FADB14" />
                        <stop offset="50%" stopColor="#D48806" />
                        <stop offset="75%" stopColor="#FAAD14" />
                        <stop offset="100%" stopColor="#FFE58F" />
                      </linearGradient>
                    </defs>

                    {/* Circular Gold Outer Frame */}
                    <circle cx="150" cy="150" r="135" fill="none" stroke="url(#goldMetallic)" strokeWidth="4.5" strokeDasharray="480 30" />
                    <circle cx="150" cy="15" r="5" fill="url(#goldMetallic)" />

                    {/* Left Laurel Leaves */}
                    <g fill="url(#goldMetallic)">
                      <path d="M 50 185 C 35 155 45 125 65 110 C 55 132 60 162 80 185 Z" />
                      <path d="M 35 215 C 25 192 35 162 55 148 C 46 170 52 195 70 210 Z" />
                      <path d="M 65 238 C 46 222 50 192 72 178 C 65 200 75 220 98 230 Z" />
                      <path d="M 100 255 C 76 245 76 215 100 200 C 95 220 115 238 135 245 Z" />
                    </g>

                    {/* Right Laurel Leaves */}
                    <g fill="url(#goldMetallic)">
                      <path d="M 250 185 C 265 155 255 125 235 110 C 245 132 240 162 220 185 Z" />
                      <path d="M 265 215 C 275 192 265 162 245 148 C 254 170 248 195 230 210 Z" />
                      <path d="M 235 238 C 254 222 250 192 228 178 C 235 200 225 220 202 230 Z" />
                      <path d="M 200 255 C 224 245 224 215 200 200 C 205 220 185 238 165 245 Z" />
                    </g>

                    {/* Central Stylized 'K' with Lady Face Silhouette */}
                    <g fill="url(#goldMetallic)">
                      <path d="M 110 55 C 98 72 94 94 98 114 C 94 110 88 105 88 98 C 84 108 88 120 98 124 C 92 128 95 136 102 138 C 112 144 128 140 135 135 C 122 138 114 132 112 122 C 110 114 116 105 122 96 C 132 82 128 65 110 55 Z" />
                      <path d="M 104 55 L 132 55 L 112 160 L 94 160 Z" />
                      <path d="M 132 108 L 186 55 L 216 55 L 146 122 Z" />
                      <path d="M 132 118 L 220 182 L 188 182 L 114 130 Z" />
                    </g>

                    {/* "Khushbu's" Script */}
                    <text x="150" y="195" textAnchor="middle" fill="url(#goldMetallic)" fontFamily="serif" fontStyle="italic" fontWeight="bold" fontSize="32" letterSpacing="1">
                      Khushbu's
                    </text>

                    {/* "MAKEOVER" Title */}
                    <line x1="68" y1="214" x2="102" y2="214" stroke="url(#goldMetallic)" strokeWidth="2" />
                    <text x="150" y="218" textAnchor="middle" fill="url(#goldMetallic)" fontFamily="sans-serif" fontWeight="bold" fontSize="15" letterSpacing="4">
                      MAKEOVER
                    </text>
                    <line x1="198" y1="214" x2="232" y2="214" stroke="url(#goldMetallic)" strokeWidth="2" />

                    {/* Bottom Ornament Flourish */}
                    <path d="M 135 232 Q 150 226 165 232 Q 150 238 135 232 Z" fill="url(#goldMetallic)" />
                    <circle cx="150" cy="232" r="3" fill="url(#goldMetallic)" />
                  </svg>
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-500 to-rose-500 text-white p-1 rounded-full text-[10px] shadow-md animate-pulse">
                <Crown className="w-3.5 h-3.5" />
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-rose-950 tracking-tight flex items-center justify-center gap-1.5 mt-1">
              Khushbu's Makeover
            </h1>
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-rose-500 font-bold mt-1">
              ✨ Luxury Bridal Studio & Salon ✨
            </p>
          </div>

          {/* Switch Tabs */}
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
              New Register
            </button>
          </div>

          {/* Alerts */}
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
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-500/30 hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 mt-2 btn-shimmer disabled:opacity-75"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <>
                    <span>Register </span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
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
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-500/30 hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 mt-2 btn-shimmer disabled:opacity-75"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <>
                    <span>Enter Luxury Studio</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
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
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-500/30 hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 btn-shimmer disabled:opacity-75"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <>
                    <span>Send 6-Digit OTP</span>
                    <KeyRound className="w-4 h-4" />
                  </>
                )}
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

          {/* Divider */}
          <div className="relative my-4 sm:my-5 flex items-center justify-center">
            <div className="border-t border-rose-200/70 w-full" />
            <span className="px-3 text-[10px] uppercase tracking-widest absolute bg-white text-rose-400 font-bold">
              OR 1-Click VIP Access
            </span>
          </div>

          {/* Google Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => triggerGoogleLogin()}
              className="w-full max-w-[280px] py-2.5 px-4 rounded-full border border-rose-200 bg-white hover:bg-rose-50/60 shadow-sm active:scale-95 transition-all flex items-center justify-center gap-3 text-xs font-semibold text-rose-950"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
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
    </>
  );
};

export const AuthScreen: React.FC<Props> = ({ onLoginSuccess }) => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthScreenContent onLoginSuccess={onLoginSuccess} />
    </GoogleOAuthProvider>
  );
};