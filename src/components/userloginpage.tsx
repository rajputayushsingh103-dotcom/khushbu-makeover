import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

interface UserProfile {
  name: string;
  email: string;
  picture: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const UserLoginPage: React.FC<Props> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // 👉 Yahan apni Google Client ID dalein (Google Cloud Console se):
  const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

  const handleGoogleSuccess = (credentialResponse: any) => {
    try {
      if (credentialResponse.credential) {
        const decoded: any = jwtDecode(credentialResponse.credential);
        const userData: UserProfile = {
          name: decoded.name,
          email: decoded.email,
          picture: decoded.picture,
        };

        // Save to localStorage
        localStorage.setItem('km_user', JSON.stringify(userData));
        onLoginSuccess(userData);
        onClose();
      }
    } catch (err) {
      console.error(err);
      setError("Login fail ho gaya. Kripya dobara try karein.");
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
        
        {/* Main Card */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-white flex items-center justify-center font-bold text-lg transition-all"
          >
            ✕
          </button>

          {/* Top Decorative Header */}
          <div className="relative p-8 text-center bg-gradient-to-b from-amber-500/15 via-rose-500/10 to-transparent border-b border-stone-200/60 dark:border-stone-800">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 text-white text-2xl font-serif shadow-lg mb-3">
              KM
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
              Khushboo Makeover
            </h2>
            <p className="text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
              Luxury Bridal Studio & Academy
            </p>
          </div>

          {/* Body Content */}
          <div className="p-8 pt-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200">
                Welcome to Luxury Beauty
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Apne Google account se login karein aur apni sabhi bookings ek jagah dekhein.
              </p>
            </div>

            {/* Error Message if any */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-600 text-center">
                {error}
              </div>
            )}

            {/* Google Sign In Button Center */}
            <div className="flex justify-center my-6">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google sign-in fail hua.")}
                shape="pill"
                theme="filled_black"
                size="large"
                text="continue_with"
                width="300"
              />
            </div>

            {/* Benefits List */}
            <div className="mt-8 pt-6 border-t border-stone-100 dark:border-stone-800/80 space-y-2.5">
              <div className="flex items-center gap-3 text-xs text-stone-600 dark:text-stone-400">
                <span className="text-amber-500 text-base">✨</span>
                <span>Apni sabhi past & upcoming bookings track karein</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-stone-600 dark:text-stone-400">
                <span className="text-rose-500 text-base">👑</span>
                <span>Exclusive bridal discounts aur offers receive karein</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-stone-600 dark:text-stone-400">
                <span className="text-amber-500 text-base">💄</span>
                <span>AI Bridal Styling & pre-event skin care prescriptions</span>
              </div>
            </div>

            {/* Terms / Privacy */}
            <p className="text-[10px] text-center text-stone-400 mt-6">
              Login karke aap Khushboo Makeover ke terms & booking policies se sehmat hote hain.
            </p>
          </div>

        </div>
      </div>
    </GoogleOAuthProvider>
  );
};