import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import GoogleSignInButton from "./GoogleSignInButton";
import { HiOutlineVideoCamera } from "react-icons/hi2";

export default function AuthPage() {
  const { loginWithGoogle, error } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HiOutlineVideoCamera className="w-12 h-12 text-green-500" />
            <h1 className="text-4xl font-bold text-white font-mono">
              Founder OS
            </h1>
          </div>
          <p className="text-gray-400 text-sm font-mono">
            Content Pipeline Dashboard
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-8">
          <h2 className="text-xl font-semibold text-white mb-2 text-center">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-sm mb-6 text-center">
            Sign in to access your content pipeline across all devices
          </p>

          {/* Google Sign In Button */}
          <GoogleSignInButton onClick={handleGoogleSignIn} loading={loading} />

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-[#1a1a1a]">
            <p className="text-gray-600 text-xs mb-3 text-center uppercase tracking-wide">
              Features
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Cloud sync across all devices
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Automatic localStorage migration
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Real-time updates
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-6">
          Secure authentication powered by Firebase
        </p>
      </div>
    </div>
  );
}
