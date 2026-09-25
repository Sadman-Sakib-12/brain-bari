"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck
} from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@brainbari.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const fillDemoCredentials = () => {
    setEmail("admin@brainbari.com");
    setPassword("admin123");
    toast.success("Demo credentials loaded!");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      try {
        const authUser = {
          name: email.split("@")[0].toUpperCase() === "ADMIN" ? "Brain Bari Lead Admin" : email.split("@")[0],
          email,
          role: "Super Admin",
          token: "bb_session_" + Date.now(),
          loggedAt: new Date().toISOString()
        };
        localStorage.setItem("brainbari_admin_user", JSON.stringify(authUser));
        localStorage.setItem("brainbari_admin_auth", "true");
        window.dispatchEvent(new Event("admin_auth_updated"));
      } catch {
        // safe fallback
      }

      toast.success("Welcome back! Redirecting to dashboard...");
      router.push("/");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#f3f6fa] flex flex-col justify-center items-center p-4 sm:p-6 relative">
      {/* Main Authentication Card */}
      <div className="w-full max-w-[480px] z-10">
        <div className="bg-white border border-slate-200/90 rounded-[30px] p-8 sm:p-11 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          {/* Top Shield Icon Badge */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#233876] text-white shadow-md shadow-[#233876]/20 mb-3.5">
              <ShieldCheck className="w-7 h-7 text-white stroke-[2.2]" />
            </div>
            <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight">
              Admin Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Enter your credentials to access
            </p>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            {/* Email Address */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@unseengadget.com"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/10 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-11 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/10 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Forgot Password Right Aligned */}
              <div className="flex justify-end pt-1.5">
                <button
                  type="button"
                  onClick={() => {
                    fillDemoCredentials();
                    toast.info("Demo credentials restored: admin@brainbari.com / admin123");
                  }}
                  className="text-xs font-semibold text-[#233876] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#233876] hover:bg-[#1b2b5d] text-white font-semibold rounded-xl text-sm py-3.5 shadow-md shadow-[#233876]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="pt-1 text-center text-xs sm:text-sm text-slate-500">
            <span>Don't have an account? </span>
            <Link 
              href="/register" 
              className="font-bold text-[#233876] hover:underline ml-1"
            >
              Create Account
            </Link>
          </div>

          {/* Quick Demo Fill hint */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-[11px] text-slate-400 hover:text-[#233876] transition-colors cursor-pointer"
            >
              Quick Demo Fill: admin@brainbari.com
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
