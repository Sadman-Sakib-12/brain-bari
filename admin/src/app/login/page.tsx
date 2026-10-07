"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"login" | "forgot-request" | "forgot-reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Forgot password states
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  // Timer for resend button
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const fillDemoCredentials = () => {
    setEmail("admin@brainbari.com");
    setPassword("admin123");
    toast.success("Demo credentials loaded!");
  };

  // 1. Standard Sign In
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error || "Invalid email or password.");
        setLoading(false);
        return;
      }

      const authUser = {
        name: email.split("@")[0].toUpperCase() === "ADMIN" ? "Brain Bari Lead Admin" : email.split("@")[0],
        email: email.trim(),
        role: "Super Admin",
        loggedAt: new Date().toISOString(),
      };
      localStorage.setItem("brainbari_admin_user", JSON.stringify(authUser));
      localStorage.setItem("brainbari_admin_auth", "true");
      document.cookie = "brainbari_admin_auth=true; path=/; max-age=2592000; SameSite=Lax";
      window.dispatchEvent(new Event("admin_auth_updated"));

      setLoading(false);
      toast.success("Welcome back! Redirecting to dashboard...");

      const searchParams = new URLSearchParams(window.location.search);
      const callback = searchParams.get("callbackUrl") || "/";
      router.push(callback);
    } catch (err: any) {
      setLoading(false);
      toast.error("Login failed: " + (err.message || "Unknown error"));
    }
  };

  // 2. Request Forgot Password OTP Email
  const handleSendForgotOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your admin email address.");
      return;
    }

    setLoading(true);
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.message || "Failed to send reset code.");
      }

      if (json?.data?.devOtp && !json?.data?.emailSent) {
        toast.warning(`SMTP Error: BadCredentials. Testing Reset Code: ${json.data.devOtp}`, {
          duration: 10000,
        });
        setForgotOtp(json.data.devOtp);
      } else {
        toast.success(`Password reset code sent to ${email.trim()}!`);
      }

      setViewMode("forgot-reset");
      setResendCountdown(60);
    } catch (err: any) {
      toast.error(err.message || "Failed to send reset code.");
    } finally {
      setLoading(false);
    }
  };

  // Resend Forgot Password OTP
  const handleResendForgotOtp = async () => {
    if (resendCountdown > 0) return;
    setLoading(true);
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to resend code.");

      if (json?.data?.devOtp && !json?.data?.emailSent) {
        toast.warning(`SMTP Error: BadCredentials. Testing Reset Code: ${json.data.devOtp}`, {
          duration: 10000,
        });
        setForgotOtp(json.data.devOtp);
      } else {
        toast.success("New reset code sent! Please check your inbox.");
      }
      setResendCountdown(60);
    } catch (err: any) {
      toast.error(err.message || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Reset Password with OTP & Auto Login
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!forgotOtp || forgotOtp.trim().length < 6) {
      toast.error("Please enter the 6-digit verification code.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          otp: forgotOtp.trim(),
          newPassword,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.message || "Password reset failed. Invalid or expired code.");
      }

      toast.success("Password reset successfully! Logging you in...");

      // Automatically sign in with newly set password
      const signInRes = await signIn("credentials", {
        email: email.trim(),
        password: newPassword,
        redirect: false,
      });

      if (!signInRes?.error) {
        const authUser = {
          name: email.split("@")[0].toUpperCase() === "ADMIN" ? "Brain Bari Lead Admin" : email.split("@")[0],
          email: email.trim(),
          role: "Super Admin",
          loggedAt: new Date().toISOString(),
        };
        localStorage.setItem("brainbari_admin_user", JSON.stringify(authUser));
        localStorage.setItem("brainbari_admin_auth", "true");
        document.cookie = "brainbari_admin_auth=true; path=/; max-age=2592000; SameSite=Lax";
        window.dispatchEvent(new Event("admin_auth_updated"));

        router.push("/");
      } else {
        // If signIn didn't immediately succeed, return to login screen
        setPassword(newPassword);
        setViewMode("login");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f6fa] flex flex-col justify-center items-center p-4 sm:p-6 relative">
      <div className="w-full max-w-[480px] z-10">
        <div className="bg-white border border-slate-200/90 rounded-[30px] p-8 sm:p-11 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          {/* Top Shield / Key Icon Badge */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#233876] text-white shadow-md shadow-[#233876]/20 mb-3.5">
              {viewMode === "login" ? (
                <ShieldCheck className="w-7 h-7 text-white stroke-[2.2]" />
              ) : (
                <KeyRound className="w-7 h-7 text-white stroke-[2.2]" />
              )}
            </div>
            <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight">
              {viewMode === "login" && "Admin Portal"}
              {viewMode === "forgot-request" && "Reset Password"}
              {viewMode === "forgot-reset" && "Set New Password"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {viewMode === "login" && "Enter your credentials to access the admin portal"}
              {viewMode === "forgot-request" && "Enter your email address to receive a verification OTP code"}
              {viewMode === "forgot-reset" && `Enter the 6-digit code sent to ${email} and set your new password`}
            </p>
          </div>

          {/* VIEW 1: Standard Sign In Form */}
          {viewMode === "login" && (
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
                    placeholder="admin@brainbari.com"
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
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Forgot Password Link Button */}
                <div className="flex justify-end pt-1.5">
                  <button
                    type="button"
                    onClick={() => setViewMode("forgot-request")}
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
          )}

          {/* VIEW 2: Request Forgot Password OTP */}
          {viewMode === "forgot-request" && (
            <form onSubmit={handleSendForgotOtp} className="space-y-4 text-left">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@brainbari.com"
                    className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/10 transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  A 6-digit OTP code will be dispatched to this address to verify your identity.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full bg-[#233876] hover:bg-[#1b2b5d] text-white font-semibold rounded-xl text-sm py-3.5 shadow-md shadow-[#233876]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <span>Send Verification Code</span>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setViewMode("login")}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>
              </div>
            </form>
          )}

          {/* VIEW 3: Enter OTP & Set New Password */}
          {viewMode === "forgot-reset" && (
            <form onSubmit={handleResetPassword} className="space-y-4 text-left">
              {/* 6-Digit OTP */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 text-center">
                  6-Digit Reset Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={forgotOtp}
                  onChange={(e) => setForgotOtp(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="123456"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 text-center text-xl font-bold tracking-[8px] text-slate-900 focus:bg-white focus:outline-none focus:border-[#233876] focus:ring-4 focus:ring-[#233876]/10 transition-all font-mono"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/10 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/10 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Reset Password & Login Button */}
              <button
                type="submit"
                disabled={loading || forgotOtp.length < 6 || !newPassword}
                className="w-full bg-[#233876] hover:bg-[#1b2b5d] text-white font-semibold rounded-xl text-sm py-3.5 shadow-md shadow-[#233876]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Reset Password & Login</span>
                  </>
                )}
              </button>

              {/* Resend & Back Row */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs sm:text-sm">
                <button
                  type="button"
                  onClick={() => setViewMode("login")}
                  className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-medium transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={handleResendForgotOtp}
                  disabled={resendCountdown > 0 || loading}
                  className="inline-flex items-center gap-1 text-[#233876] font-semibold hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>
                    {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : "Resend Code"}
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* Switch to Register (Only in login view) */}
          {viewMode === "login" && (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
