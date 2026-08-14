import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Mail, Lock, User, Phone, Eye, EyeOff, KeyRound, ArrowRight, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';

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

export const AuthScreen: React.FC<Props> = ({ onLoginSuccess }) => {
  // ==========================================
  // 🎨 Background: 'light' | 'dark' | 'image'
  const BG_THEME: 'light' | 'dark' | 'image' = 'light';
  // ==========================================

  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form Fields
  const [identifier, setIdentifier] = useState(''); // Email or Phone
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

  // Helper to normalize strings
  const cleanPhone = (val: string) => (val || '').replace(/\D/g, '').slice(-10);
  const cleanEmail = (val: string) => (val || '').trim().toLowerCase();

  // Helper to get registered database
  const getRegisteredUsers = (): RegisteredUser[] => {
    try {
      return JSON.parse(localStorage.getItem('km_registered_users') || '[]');
    } catch {
      return [];
    }
  };

  // 🔍 UNIFIED USER FINDER (Finds user by Phone OR Email)
  const findUnifiedUser = (idOrEmailOrPhone: string): RegisteredUser | undefined => {
    const savedUsers = getRegisteredUsers();
    const cleanId = idOrEmailOrPhone.trim().toLowerCase();
    const cleanP = cleanPhone(idOrEmailOrPhone);

    return savedUsers.find((u) => {
      const uEmail = cleanEmail(u.email);
      const uPhone = cleanPhone(u.phone);
      
      // Match by exact email
      if (cleanId.includes('@') && uEmail === cleanId) return true;
      // Match by exact 10-digit phone
      if (cleanP.length === 10 && uPhone === cleanP) return true;
      // Match by general input
      return uEmail === cleanId || uPhone === cleanId;
    });
  };

  // 1. REGISTRATION SUBMIT
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const trimmedName = name.trim();
    const normalizedEmail = cleanEmail(email);
    const normalizedPhone = cleanPhone(phone);

    if (!trimmedName) {
      setError("Kripya apna poora Naam (Full Name) bharein!");
      return;
    }
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      setError("Kripya sahi Email address bharein!");
      return;
    }
    if (!normalizedPhone || normalizedPhone.length !== 10) {
      setError("Kripya sahi 10-digit Mobile Number bharein!");
      return;
    }
    if (!password || password.length < 4) {
      setError("Password kam se kam 4 characters ka hona chahiye!");
      return;
    }

    const savedUsers = getRegisteredUsers();

    // Check duplicate email
    if (savedUsers.some((u) => cleanEmail(u.email) === normalizedEmail)) {
      setError("Is Email ID se account pehle se bana hua hai! Kripya Sign In karein.");
      return;
    }

    // Check duplicate phone
    if (savedUsers.some((u) => cleanPhone(u.phone) === normalizedPhone)) {
      setError("Is Mobile Number se account pehle se bana hua hai! Kripya Sign In karein.");
      return;
    }

    // Create Single Unified User
    const newUser: RegisteredUser = {
      id: 'usr_' + Date.now(),
      name: trimmedName,
      email: normalizedEmail,
      phone: normalizedPhone,
      password: password,
      picture: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(trimmedName)}&backgroundColor=b76e79,e0a96d`,
      createdAt: new Date().toISOString(),
    };

    savedUsers.push(newUser);
    localStorage.setItem('km_registered_users', JSON.stringify(savedUsers));
    localStorage.setItem('km_user', JSON.stringify(newUser));

    setSuccessMsg(`Account ban gaya! Swagat hai, ${newUser.name}`);
    setTimeout(() => onLoginSuccess(newUser), 400);
  };

  // 2. PASSWORD LOGIN SUBMIT (By Email OR Phone)
  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const inputVal = identifier.trim();
    if (!inputVal) {
      setError("Kripya apna registered Email ya Mobile Number daalein!");
      return;
    }
    if (!password) {
      setError("Kripya Password daalein!");
      return;
    }

    const foundUser = findUnifiedUser(inputVal);

    // ❌ USER NOT REGISTERED
    if (!foundUser) {
      setError("User does not exist! Is details se koi account nahi mila. Pehle Register karein.");
      return;
    }

    // ❌ WRONG PASSWORD
    if (foundUser.password !== password) {
      setError("Galat Password! Kripya sahi password daalein ya 'OTP Login' karein.");
      return;
    }

    // ✅ LOGIN SUCCESS (Unified Master Record)
    localStorage.setItem('km_user', JSON.stringify(foundUser));
    setSuccessMsg(`Welcome, ${foundUser.name}!`);
    setTimeout(() => onLoginSuccess(foundUser), 300);
  };

  // 3. SEND OTP (Checks unified user first)
  const handleSendOtp = (e: React.FormEvent) => {
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
      setError("User does not exist! Is number/email se koi account registered nahi hai. Pehle Register karein.");
      return;
    }

    // Generate OTP
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setMatchedUser(foundUser);
    setAuthMode('otp_verify');
    setSuccessMsg(`OTP bhej diya gaya hai! (Verification Code: ${randomOtp})`);
  };

  // 4. VERIFY OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!matchedUser) {
      setError("Session expired. Kripya dobara try karein.");
      setAuthMode('otp_request');
      return;
    }

    if (otpInput.trim() === generatedOtp) {
      localStorage.setItem('km_user', JSON.stringify(matchedUser));
      setSuccessMsg(`Verified! Welcome back, ${matchedUser.name}!`);
      setTimeout(() => onLoginSuccess(matchedUser), 300);
    } else {
      setError("Galat OTP! Kripya sahi 6-digit code daalein.");
    }
  };

  // 5. GOOGLE LOGIN (Unified with Registered Profile)
  const handleGoogleSuccess = (credentialResponse: any) => {
    try {
      if (credentialResponse.credential) {
        const decoded: any = jwtDecode(credentialResponse.credential);
        const googleEmail = cleanEmail(decoded.email);
        const savedUsers = getRegisteredUsers();

        // 🔗 Check if this Google email matches ANY existing registered account
        let user = savedUsers.find((u) => cleanEmail(u.email) === googleEmail);

        if (user) {
          // If registered user exists, KEEP their existing name, phone, and update photo
          user.picture = decoded.picture || user.picture;
          localStorage.setItem('km_registered_users', JSON.stringify(savedUsers));
        } else {
          // New User via Google
          user = {
            id: 'usr_g_' + Date.now(),
            name: decoded.name,
            email: googleEmail,
            phone: '',
            password: '',
            picture: decoded.picture,
            createdAt: new Date().toISOString(),
          };
          savedUsers.push(user);
          localStorage.setItem('km_registered_users', JSON.stringify(savedUsers));
        }

        // Always log in with the exact linked profile
        localStorage.setItem('km_user', JSON.stringify(user));
        onLoginSuccess(user);
      }
    } catch {
      setError("Google Login me error aayi.");
    }
  };

  const isLight = BG_THEME === 'light';

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div
        className={`min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden font-sans transition-all duration-300 ${
          isLight
            ? 'bg-gradient-to-br from-[#FFF9F5] via-[#FBF2EC] to-[#F5E6DD]'
            : 'bg-gradient-to-br from-[#1A1617] via-[#120F10] to-[#0A0909]'
        }`}
      >
        {/* Glow Spheres */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#E0A96D]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#B76E79]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Center Card */}
        <div
          className={`w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 border transition-all ${
            isLight
              ? 'bg-white/95 backdrop-blur-md border-[#E0A96D]/40 text-stone-900 shadow-stone-300/50'
              : 'bg-[#1C191A]/95 backdrop-blur-md border-[#E0A96D]/30 text-[#FAF7F5]'
          }`}
        >
          {/* Logo Header */}
          <div className="text-center mb-5">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#B76E79] via-[#E0A96D] to-[#F3D1A5] p-0.5 shadow-xl mx-auto mb-2.5">
              <div className={`w-full h-full rounded-full flex items-center justify-center ${isLight ? 'bg-white' : 'bg-[#161415]'}`}>
                <span className="font-serif text-xl font-bold text-[#B76E79]">KM</span>
              </div>
            </div>
            <h1 className={`text-2xl font-serif font-bold tracking-tight ${isLight ? 'text-stone-900' : 'text-[#FAF7F5]'}`}>
              Khushboo Makeover
            </h1>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#B76E79] font-bold mt-0.5">
              Luxury Bridal Studio & Salon
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div className={`flex p-1 rounded-2xl border mb-5 ${isLight ? 'bg-stone-100 border-stone-200' : 'bg-[#141213] border-stone-800'}`}>
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setError(null); setSuccessMsg(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                authMode === 'login' ? 'bg-[#E0A96D] text-white font-bold shadow-md' : isLight ? 'text-stone-600 hover:text-black' : 'text-stone-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('otp_request'); setError(null); setSuccessMsg(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                authMode === 'otp_request' || authMode === 'otp_verify' ? 'bg-[#E0A96D] text-white font-bold shadow-md' : isLight ? 'text-stone-600 hover:text-black' : 'text-stone-400 hover:text-white'
              }`}
            >
              OTP Login
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('register'); setError(null); setSuccessMsg(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                authMode === 'register' ? 'bg-[#E0A96D] text-white font-bold shadow-md' : isLight ? 'text-stone-600 hover:text-black' : 'text-stone-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800/80 rounded-xl text-xs text-center flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 rounded-xl text-xs text-center">
              {successMsg}
            </div>
          )}

          {/* 1️⃣ REGISTRATION FORM */}
          {authMode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="relative">
                <User className="w-4 h-4 text-[#B76E79] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Aapka Poora Naam (Full Name)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full text-xs rounded-2xl pl-10 pr-4 py-3 outline-none border transition-all ${
                    isLight ? 'bg-stone-50 border-stone-200 text-stone-900 focus:border-[#E0A96D]' : 'bg-[#141213] border-stone-800 text-[#FAF7F5] focus:border-[#E0A96D]'
                  }`}
                  required
                />
              </div>

              <div className="relative">
                <Phone className="w-4 h-4 text-[#B76E79] absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="10-digit Mobile Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full text-xs rounded-2xl pl-10 pr-4 py-3 outline-none border transition-all ${
                    isLight ? 'bg-stone-50 border-stone-200 text-stone-900 focus:border-[#E0A96D]' : 'bg-[#141213] border-stone-800 text-[#FAF7F5] focus:border-[#E0A96D]'
                  }`}
                  required
                />
              </div>

              <div className="relative">
                <Mail className="w-4 h-4 text-[#B76E79] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  placeholder="Gmail / Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full text-xs rounded-2xl pl-10 pr-4 py-3 outline-none border transition-all ${
                    isLight ? 'bg-stone-50 border-stone-200 text-stone-900 focus:border-[#E0A96D]' : 'bg-[#141213] border-stone-800 text-[#FAF7F5] focus:border-[#E0A96D]'
                  }`}
                  required
                />
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-[#B76E79] absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full text-xs rounded-2xl pl-10 pr-10 py-3 outline-none border transition-all ${
                    isLight ? 'bg-stone-50 border-stone-200 text-stone-900 focus:border-[#E0A96D]' : 'bg-[#141213] border-stone-800 text-[#FAF7F5] focus:border-[#E0A96D]'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#B76E79] via-[#C58F5E] to-[#E0A96D] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 flex items-center justify-center gap-2 mt-2"
              >
                <span>Register & Create Unified Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* 2️⃣ PASSWORD LOGIN FORM */}
          {authMode === 'login' && (
            <form onSubmit={handlePasswordLogin} className="space-y-3">
              <div className="relative">
                <User className="w-4 h-4 text-[#B76E79] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Registered Email ID ya Mobile Number"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className={`w-full text-xs rounded-2xl pl-10 pr-4 py-3 outline-none border transition-all ${
                    isLight ? 'bg-stone-50 border-stone-200 text-stone-900 focus:border-[#E0A96D]' : 'bg-[#141213] border-stone-800 text-[#FAF7F5] focus:border-[#E0A96D]'
                  }`}
                  required
                />
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-[#B76E79] absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full text-xs rounded-2xl pl-10 pr-10 py-3 outline-none border transition-all ${
                    isLight ? 'bg-stone-50 border-stone-200 text-stone-900 focus:border-[#E0A96D]' : 'bg-[#141213] border-stone-800 text-[#FAF7F5] focus:border-[#E0A96D]'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => { setAuthMode('otp_request'); setError(null); }}
                  className="text-[11px] text-[#B76E79] hover:underline font-medium"
                >
                  Password bhool gaye? OTP se Login karein →
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#B76E79] via-[#C58F5E] to-[#E0A96D] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 flex items-center justify-center gap-2 mt-2"
              >
                <span>Sign In to Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* 3️⃣ OTP REQUEST FORM */}
          {authMode === 'otp_request' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="text-left">
                <label className="text-xs font-semibold block mb-2 opacity-80">OTP Kahan Mangwana Hai?</label>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setOtpTarget('email')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 ${
                      otpTarget === 'email' ? 'border-[#E0A96D] bg-[#E0A96D]/15 text-[#B76E79] font-bold' : 'border-stone-300 opacity-60'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Registered Email</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOtpTarget('phone')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 ${
                      otpTarget === 'phone' ? 'border-[#E0A96D] bg-[#E0A96D]/15 text-[#B76E79] font-bold' : 'border-stone-300 opacity-60'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Registered Phone</span>
                  </button>
                </div>

                <div className="relative">
                  {otpTarget === 'email' ? <Mail className="w-4 h-4 text-[#B76E79] absolute left-3.5 top-3.5" /> : <Phone className="w-4 h-4 text-[#B76E79] absolute left-3.5 top-3.5" />}
                  <input
                    type={otpTarget === 'email' ? 'email' : 'tel'}
                    placeholder={otpTarget === 'email' ? 'Registered Email Address daalein' : 'Registered 10-digit Mobile No.'}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className={`w-full text-xs rounded-2xl pl-10 pr-4 py-3 outline-none border ${
                      isLight ? 'bg-stone-50 border-stone-200 text-stone-900' : 'bg-[#141213] border-stone-800 text-[#FAF7F5]'
                    }`}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#B76E79] via-[#C58F5E] to-[#E0A96D] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 flex items-center justify-center gap-2"
              >
                <span>Send 6-Digit OTP</span>
                <KeyRound className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* 4️⃣ OTP VERIFY FORM */}
          {authMode === 'otp_verify' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className={`text-center p-3 rounded-2xl border ${isLight ? 'bg-stone-50 border-stone-200' : 'bg-[#141213] border-stone-800'}`}>
                <p className="text-xs opacity-70">OTP Registered User ko bheja gaya:</p>
                <p className="text-sm font-bold text-[#B76E79] mt-0.5">{matchedUser?.name} ({matchedUser?.phone || matchedUser?.email})</p>
              </div>

              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#B76E79] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-Digit OTP"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className={`w-full tracking-[0.3em] font-bold text-center text-base rounded-2xl py-3 outline-none border ${
                    isLight ? 'bg-stone-50 border-stone-200 text-stone-900' : 'bg-[#141213] border-stone-800 text-[#FAF7F5]'
                  }`}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#B76E79] via-[#C58F5E] to-[#E0A96D] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify OTP & Open Profile</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthMode('otp_request')}
                  className="text-xs opacity-70 hover:opacity-100 flex items-center justify-center gap-1 mx-auto"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Number / Email badalna hai?</span>
                </button>
              </div>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-5 flex items-center justify-center">
            <div className={`border-t w-full ${isLight ? 'border-stone-200' : 'border-stone-800'}`} />
            <span className={`px-3 text-[10px] uppercase tracking-widest absolute font-medium ${isLight ? 'bg-white text-stone-400' : 'bg-[#1C191A] text-stone-500'}`}>
              OR 1-Click Login
            </span>
          </div>

          {/* Google Sign In */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google login me error aayi.")}
              shape="pill"
              theme={isLight ? "outline" : "filled_black"}
              size="medium"
              text="continue_with"
              width="280"
            />
          </div>

          <p className="text-[10px] text-center opacity-60 mt-5">
            Khushboo Makeover • Unified Account & Profile Protection
          </p>

        </div>
      </div>
    </GoogleOAuthProvider>
  );
};