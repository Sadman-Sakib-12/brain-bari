"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Briefcase, 
  ShieldCheck
} from "lucide-react";
import { toast } from "sonner";
import { adminStore } from "@/lib/store";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Admin");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
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

    setTimeout(() => {
      setLoading(false);

      // Save new user in adminStore users list
      try {
        const existingUsers = adminStore.getUsers();
        const newUser = {
          id: `usr-${Date.now()}`,
          name,
          email,
          role,
          phone: "+8801700000000",
          company: "Brain Bari",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
          joinedDate: new Date().toISOString().split("T")[0],
          status: "Active"
        };

        adminStore.setUsers([newUser, ...existingUsers]);

        // Automatically set active session
        const authSession = {
          name,
          email,
          role,
          token: "bb_session_" + Date.now(),
          loggedAt: new Date().toISOString()
        };
        localStorage.setItem("brainbari_admin_user", JSON.stringify(authSession));
        localStorage.setItem("brainbari_admin_auth", "true");
        window.dispatchEvent(new Event("admin_auth_updated"));
      } catch {
        // safe fallback
      }

      toast.success("Account created successfully! Redirecting to dashboard...");
      router.push("/");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#f3f6fa] flex flex-col justify-center items-center p-4 sm:p-6 relative">
      {/* Main Registration Card */}
      <div className="w-full max-w-[540px] z-10">
        <div className="bg-white border border-slate-200/90 rounded-[30px] p-8 sm:p-11 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          {/* Top Shield Icon Badge */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#233876] text-white shadow-md shadow-[#233876]/20 mb-3.5">
              <ShieldCheck className="w-7 h-7 text-white stroke-[2.2]" />
            </div>
            <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight">
              Create Admin Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Enter your credentials to register as an administrator
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-4 text-left">
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
                  <span>Registering...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

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
