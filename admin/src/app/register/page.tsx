"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Briefcase,
  ShieldCheck,
  KeyRound,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "otp">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Admin");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  // Countdown timer for resending OTP
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  // Step 1: Send Registration OTP to Email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please verify.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password should be at least 6 characters.");
      return;
    }

    if (!agreeTerms) {
      toast.error("Please accept the security & workspace policy.");
      return;
    }

    setLoading(true);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://brain-bari-production.up.railway.app/api";
    try {
      const res = await fetch(`${API_BASE}/auth/register-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          role: role.toUpperCase() === "ADMIN" ? "ADMIN" : "CLIENT",
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.message || "Failed to send verification code.");
      }

      if (json?.data?.devOtp && !json?.data?.emailSent) {
        toast.warning(`SMTP Error: BadCredentials. Testing OTP: ${json.data.devOtp}`, {
          duration: 10000,
        });
        setOtp(json.data.devOtp);
      } else {
        toast.success(`Verification code sent to ${email.trim()}! Please check your inbox.`);
      }

      setStep("otp");
      setResendCountdown(60);
    } catch (err: any) {
      toast.error(err.message || "Failed to send verification code.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCountdown > 0) return;
    setLoading(true);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://brain-bari-production.up.railway.app/api";
    try {
      const res = await fetch(`${API_BASE}/auth/register-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          role: role.toUpperCase() === "ADMIN" ? "ADMIN" : "CLIENT",
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to resend code.");

      if (json?.data?.devOtp && !json?.data?.emailSent) {
        toast.warning(`SMTP Error: BadCredentials. Testing OTP: ${json.data.devOtp}`, {
          duration: 10000,
        });
        setOtp(json.data.devOtp);
      } else {
        toast.success("A new verification code has been sent!");
      }
      setResendCountdown(60);
    } catch (err: any) {
      toast.error(err.message || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP, Create Account & Auto Login
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp.trim() || otp.trim().length < 6) {
      toast.error("Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://brain-bari-production.up.railway.app/api";
    try {
      // 1. Verify OTP with backend
      const res = await fetch(`${API_BASE}/auth/verify-register-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          otp: otp.trim(),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.message || "Invalid or expired verification code.");
      }

      const token = json?.data?.token || "bb_session_" + Date.now();

      // 2. Establish NextAuth session automatically
      await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      // 3. Sync client-side session metadata
      const authSession = {
        name: name.trim(),
        email: email.trim(),
        role,
        token,
        loggedAt: new Date().toISOString(),
      };
      localStorage.setItem("brainbari_admin_user", JSON.stringify(authSession));
      localStorage.setItem("brainbari_admin_auth", "true");
      document.cookie = "brainbari_admin_auth=true; path=/; max-age=2592000; SameSite=Lax";
      window.dispatchEvent(new Event("admin_auth_updated"));

      toast.success("Account verified successfully! Welcome to Brain Bari.");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f6fa] flex flex-col justify-center items-center p-4 sm:p-6 relative">
      <div className="w-full max-w-[540px] z-10">
        <div className="bg-white border border-slate-200/90 rounded-[30px] p-8 sm:p-11 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          {/* Top Shield Icon Badge */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#233876] text-white shadow-md shadow-[#233876]/20 mb-3.5">
              {step === "otp" ? (
                <KeyRound className="w-7 h-7 text-white stroke-[2.2]" />
              ) : (
                <ShieldCheck className="w-7 h-7 text-white stroke-[2.2]" />
              )}
            </div>
            <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight">
              {step === "otp" ? "Verify Email Address" : "Create Admin Account"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {step === "otp" ? (
                <span>
                  We sent a 6-digit code to{" "}
                  <strong className="text-slate-700">{email}</strong>
                </span>
              ) : (
                "Enter your credentials to register as an administrator"
              )}
            </p>
          </div>

          {step === "form" ? (
            /* STEP 1: Registration Form */
            <form onSubmit={handleSendOtp} className="space-y-4 text-left">
              {/* Full Name & Work Email Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Tanvir Ahmed"
                      className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/10 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@brainbari.com"
                      className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Assigned Role */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                  Assigned Role
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/10 transition-all cursor-pointer"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-9 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/10 transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-3.5 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/10 transition-all font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Terms Agreement Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#233876] focus:ring-[#233876] cursor-pointer"
                  />
                  <span className="text-xs text-slate-500 font-medium leading-relaxed">
                    I agree to follow the Brain Bari internal workspace security protocols and role authorization rules.
                  </span>
                </label>
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
                    <span>Sending Verification Code...</span>
                  </>
                ) : (
                  <span>Continue with Email Verification</span>
                )}
              </button>
            </form>
          ) : (
            /* STEP 2: Enter OTP Verification Code */
            <form onSubmit={handleVerifyOtp} className="space-y-5 text-left">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 text-center">
                  6-Digit Verification Code (OTP)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={6}
                    required
                    autoFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="123456"
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3.5 text-center text-2xl font-bold tracking-[10px] text-slate-900 focus:bg-white focus:outline-none focus:border-[#233876] focus:ring-4 focus:ring-[#233876]/10 transition-all font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-400 text-center mt-2">
                  Please check your inbox and spam folder for the code sent from Brain Bari.
                </p>
              </div>

              {/* Verify & Login Button */}
              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full bg-[#233876] hover:bg-[#1b2b5d] text-white font-semibold rounded-xl text-sm py-3.5 shadow-md shadow-[#233876]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying & Logging In...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify & Login</span>
                  </>
                )}
              </button>

              {/* Resend & Back Action Row */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs sm:text-sm">
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-medium transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Email</span>
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCountdown > 0 || loading}
                  className="inline-flex items-center gap-1 text-[#233876] font-semibold hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>
                    {resendCountdown > 0 ? `Resend code in ${resendCountdown}s` : "Resend Code"}
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* Switch to Login */}
          <div className="pt-1 text-center text-xs sm:text-sm text-slate-500">
            <span>Already have an account? </span>
            <Link
              href="/login"
              className="font-bold text-[#233876] hover:underline ml-1"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

