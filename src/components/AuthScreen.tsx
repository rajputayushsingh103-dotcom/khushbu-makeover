import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Mail, Lock, User, Phone, Eye, EyeOff, KeyRound, ArrowRight, ShieldCheck, RefreshCw, Sparkles, Heart, Shield } from 'lucide-react';

interface Props {
  onLoginSuccess: (user: any) => void;
}

type AuthMode = 'login' | 'register' | 'otp_request' | 'otp_verify';

export const AuthScreen: React.FC<Props> = ({ onLoginSuccess }) => {
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
  
  // OTP States
  const [otpTarget, setOtpTarget] = useState<'email' | 'phone'>('email');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [otpSentTo, setOtpSentTo] = useState<string>('');

  // 👉 Yahan apni Google Client ID dalein:
  const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

  // Google Login Handler
  const handleGoogleSuccess = (credentialResponse: any) => {
    try {
      if (credentialResponse.credential) {
        const decoded: any = jwtDecode(credentialResponse.credential);
        const userData = {
          name: decoded.name,
          email: decoded.email,
          phone: '',
          picture: decoded.picture,
        };

        localStorage.setItem('km_user', JSON.stringify(userData));
        onLoginSuccess(userData);
      }
    } catch (err) {
      setError("Google Login fail hua. Kripya dobara try karein.");
    }
  };

  // Password Login & Registration Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const savedUsers = JSON.parse(localStorage.getItem('km_registered_users') || '[]');

    if (authMode === 'register') {
      // REGISTRATION
      if (!name || !email || !password) {
        setError("Kripya Naam, Email aur Password zaroor bharein!");
        return;
      }

      const existingUser = savedUsers.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase() || (phone && u.phone === phone)
      );

      if (existingUser) {
        setError("Is Email ya Phone se account pehle se bana hai! Kripya Login karein.");
        return;
      }

      const newUser = {
        name,
        email,
        phone,
        password,
        picture: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=b76e79,e0a96d`,
      };

      savedUsers.push(newUser);
      localStorage.setItem('km_registered_users', JSON.stringify(savedUsers));
      localStorage.setItem('km_user', JSON.stringify(newUser));

      setSuccessMsg("Account successfully ban gaya! Studio me swagat hai.");
      setTimeout(() => onLoginSuccess(newUser), 600);

    } else if (authMode === 'login') {
      // PASSWORD LOGIN (By Email OR Phone)
      if (!identifier || !password) {
        setError("Email/Phone aur Password dono bharein!");
        return;
      }

      const cleanId = identifier.trim().toLowerCase();
      const foundUser = savedUsers.find(
        (u: any) => (u.email?.toLowerCase() === cleanId || u.phone === cleanId) && u.password === password
      );

      if (!foundUser) {
        setError("Galat Details! Agar password bhool gaye hain to 'OTP se Login karein' chunein.");
        return;
      }

      localStorage.setItem('km_user', JSON.stringify(foundUser));
      onLoginSuccess(foundUser);
    }
  };

  // Send OTP Handler (Gmail ya Phone par)
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError(`Kripya apna ${otpTarget === 'email' ? 'Gmail / Email' : 'Mobile Phone Number'} daalein!`);
      return;
    }

    // 6-Digit OTP generate
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setOtpSentTo(identifier.trim());
    setAuthMode('otp_verify');
    setSuccessMsg(`OTP safaltapoorvak bhej diya gaya hai! (Verification Code: ${randomOtp})`);
  };

  // Verify OTP Handler
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otpInput.trim() === generatedOtp) {
      const savedUsers = JSON.parse(localStorage.getItem('km_registered_users') || '[]');
      let user = savedUsers.find(
        (u: any) => u.email?.toLowerCase() === otpSentTo.toLowerCase() || u.phone === otpSentTo
      );

      if (!user) {
        user = {
          name: otpSentTo.includes('@') ? otpSentTo.split('@')[0] : 'Client ' + otpSentTo.slice(-4),
          email: otpSentTo.includes('@') ? otpSentTo : `${otpSentTo}@salonclient.com`,
          phone: !otpSentTo.includes('@') ? otpSentTo : '',
          picture: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(otpSentTo)}&backgroundColor=b76e79,e0a96d`,
        };
        savedUsers.push(user);
        localStorage.setItem('km_registered_users', JSON.stringify(savedUsers));
      }

      localStorage.setItem('km_user', JSON.stringify(user));
      setSuccessMsg("OTP Verified! Login successful.");
      setTimeout(() => onLoginSuccess(user), 600);
    } else {
      setError("Galat OTP! Kripya sahi 6-digit code daalein.");
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen w-full bg-[#121011] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        
        {/* Glowing Background Orbs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#E0A96D]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#B76E79]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Center Card */}
        <div className="bg-[#1C191A] border border-[#E0A96D]/30 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
          
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#B76E79] via-[#E0A96D] to-[#F3D1A5] p-0.5 shadow-xl mx-auto mb-2.5">
              <div className="w-full h-full rounded-full bg-[#161415] flex items-center justify-center">
                <span className="font-serif text-xl font-bold text-[#E0A96D]">KM</span>
              </div>
            </div>
            <h1 className="text-2xl font-serif font-bold text-[#FAF7F5] tracking-tight">
              Khushboo Makeover
            </h1>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#E0A96D] font-semibold mt-0.5">
              Luxury Bridal Studio & Salon
            </p>
          </div>

          {/* Mode Switch Tabs (Login / OTP / Register) */}
          <div className="flex bg-[#141213] p-1 rounded-2xl border border-stone-800 mb-5">
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setError(null); setSuccessMsg(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                authMode === 'login' ? 'bg-[#E0A96D] text-[#121011] font-bold shadow-md' : 'text-stone-400 hover:text-white'
              }`}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('otp_request'); setError(null); setSuccessMsg(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                authMode === 'otp_request' || authMode === 'otp_verify' ? 'bg-[#E0A96D] text-[#121011] font-bold shadow-md' : 'text-stone-400 hover:text-white'
              }`}
            >
              OTP Login
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('register'); setError(null); setSuccessMsg(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                authMode === 'register' ? 'bg-[#E0A96D] text-[#121011] font-bold shadow-md' : 'text-stone-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="mb-4 p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-300 text-center">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-xs text-emerald-300 text-center">
              {successMsg}
            </div>
          )}

          {/* --- CASE 1: PASSWORD LOGIN OR REGISTRATION --- */}
          {(authMode === 'login' || authMode === 'register') && (
            <form onSubmit={handleSubmit} className="space-y-3">
              {authMode === 'register' && (
                <>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#E0A96D] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="Aapka Poora Naam (Full Name)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#141213] border border-stone-800 focus:border-[#E0A96D] text-[#FAF7F5] placeholder-stone-500 text-xs rounded-2xl pl-10 pr-4 py-3 outline-none"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#E0A96D] absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      placeholder="Phone Number (Mobile No.)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#141213] border border-stone-800 focus:border-[#E0A96D] text-[#FAF7F5] placeholder-stone-500 text-xs rounded-2xl pl-10 pr-4 py-3 outline-none"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#E0A96D] absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      placeholder="Gmail / Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#141213] border border-stone-800 focus:border-[#E0A96D] text-[#FAF7F5] placeholder-stone-500 text-xs rounded-2xl pl-10 pr-4 py-3 outline-none"
                    />
                  </div>
                </>
              )}

              {authMode === 'login' && (
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#E0A96D] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="Email ID ya Mobile Phone Number"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full bg-[#141213] border border-stone-800 focus:border-[#E0A96D] text-[#FAF7F5] placeholder-stone-500 text-xs rounded-2xl pl-10 pr-4 py-3 outline-none"
                    required
                  />
                </div>
              )}

              {/* Password */}
              <div className="relative">
                <Lock className="w-4 h-4 text-[#E0A96D] absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#141213] border border-stone-800 focus:border-[#E0A96D] text-[#FAF7F5] placeholder-stone-500 text-xs rounded-2xl pl-10 pr-10 py-3 outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-stone-500 hover:text-stone-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {authMode === 'login' && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('otp_request'); setError(null); }}
                    className="text-[11px] text-[#E0A96D] hover:underline"
                  >
                    Password bhool gaye? OTP se Login karein →
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#B76E79] via-[#C58F5E] to-[#E0A96D] text-[#121011] font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 flex items-center justify-center gap-2 mt-2"
              >
                <span>{authMode === 'register' ? 'Register & Continue' : 'Sign In with Password'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* --- CASE 2: SEND OTP REQUEST --- */}
          {authMode === 'otp_request' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="text-left">
                <label className="text-xs text-stone-300 font-medium block mb-2">OTP Kahan Mangwana Hai?</label>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setOtpTarget('email')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 ${
                      otpTarget === 'email' ? 'border-[#E0A96D] bg-[#E0A96D]/15 text-[#E0A96D]' : 'border-stone-800 text-stone-400'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Gmail / Email</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOtpTarget('phone')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 ${
                      otpTarget === 'phone' ? 'border-[#E0A96D] bg-[#E0A96D]/15 text-[#E0A96D]' : 'border-stone-800 text-stone-400'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Phone SMS</span>
                  </button>
                </div>

                <div className="relative">
                  {otpTarget === 'email' ? (
                    <Mail className="w-4 h-4 text-[#E0A96D] absolute left-3.5 top-3.5" />
                  ) : (
                    <Phone className="w-4 h-4 text-[#E0A96D] absolute left-3.5 top-3.5" />
                  )}
                  <input
                    type={otpTarget === 'email' ? 'email' : 'tel'}
                    placeholder={otpTarget === 'email' ? 'Apna Gmail Address daalein' : 'Apna 10-digit Mobile No. daalein'}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full bg-[#141213] border border-stone-800 focus:border-[#E0A96D] text-[#FAF7F5] placeholder-stone-500 text-xs rounded-2xl pl-10 pr-4 py-3 outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#B76E79] via-[#C58F5E] to-[#E0A96D] text-[#121011] font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 flex items-center justify-center gap-2"
              >
                <span>Send 6-Digit OTP</span>
                <KeyRound className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* --- CASE 3: VERIFY OTP --- */}
          {authMode === 'otp_verify' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center p-3 rounded-2xl bg-[#141213] border border-stone-800">
                <p className="text-xs text-stone-400">OTP bhej diya gaya hai:</p>
                <p className="text-sm font-bold text-[#E0A96D] mt-0.5">{otpSentTo}</p>
              </div>

              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#E0A96D] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-Digit OTP"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="w-full bg-[#141213] border border-stone-800 focus:border-[#E0A96D] text-[#FAF7F5] tracking-[0.3em] font-bold text-center text-base rounded-2xl py-3 outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#B76E79] via-[#C58F5E] to-[#E0A96D] text-[#121011] font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify OTP & Sign In</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthMode('otp_request')}
                  className="text-xs text-stone-400 hover:text-[#E0A96D] flex items-center justify-center gap-1 mx-auto"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Number / Email badalna hai?</span>
                </button>
              </div>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-5 flex items-center justify-center">
            <div className="border-t border-stone-800 w-full" />
            <span className="bg-[#1C191A] px-3 text-[10px] text-stone-500 uppercase tracking-widest absolute">
              OR 1-Click Login
            </span>
          </div>

          {/* Google Sign In */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google login me error aayi.")}
              shape="pill"
              theme="filled_black"
              size="medium"
              text="continue_with"
              width="280"
            />
          </div>

          <p className="text-[10px] text-center text-stone-500 mt-5">
            Khushboo Makeover • Verified Client Protection & Privacy
          </p>

        </div>
      </div>
    </GoogleOAuthProvider>
  );
};