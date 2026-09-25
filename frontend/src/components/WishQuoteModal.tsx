"use client";

import React, { useState } from "react";
import { X, Send, CheckCircle2 } from "lucide-react";

interface WishQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  wish: string;
}

export default function WishQuoteModal({
  isOpen,
  onClose,
  wish,
}: WishQuoteModalProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() && !phone.trim()) return;
    
    // Simulate submission
    setSubmitted(true);
    setTimeout(() => {
      // Auto close after 2.5 seconds on success
      setTimeout(() => {
        setSubmitted(false);
        setEmail("");
        setPhone("");
        onClose();
      }, 2000);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity duration-300">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div className="relative w-full max-w-[460px] bg-white dark:bg-[#121927] rounded-[28px] p-7 sm:p-9 shadow-2xl z-10 overflow-hidden border border-gray-100 dark:border-white/10 transform transition-all animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full border border-pink-200 dark:border-pink-800/60 text-pink-400 hover:text-pink-600 hover:border-pink-300 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-8 flex flex-col items-center text-center">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mb-3 animate-bounce" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Your request has been received!
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[280px]">
              We will prepare your custom quote for &ldquo;{wish}&rdquo; and contact you shortly.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-[22px] sm:text-[25px] font-bold text-gray-900 dark:text-white tracking-tight leading-snug">
                Your wish is almost granted!
              </h2>
              <p className="text-[13px] sm:text-[13.5px] text-gray-500 dark:text-gray-400 mt-2 max-w-[320px] mx-auto leading-relaxed">
                Share your email and we&apos;ll send you a custom quote for your project.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Your wish:
                </label>
                <div className="w-full rounded-xl border border-dashed border-gray-300 dark:border-slate-700 px-4 py-3 text-[14px] text-gray-600 dark:text-gray-300 italic bg-gray-50/60 dark:bg-slate-800/60">
                  &ldquo;{wish || "AI Solutions"}&rdquo;
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="masuma.pc62@gmail.com"
                  className="w-full rounded-xl border border-purple-200 dark:border-slate-700 bg-transparent dark:bg-slate-800/80 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/30 px-4 py-3 text-[14px] text-gray-800 dark:text-gray-100 placeholder-gray-400 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Phone number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+8801700000000"
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent dark:bg-slate-800/80 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/30 px-4 py-3 text-[14px] text-gray-800 dark:text-gray-100 placeholder-gray-400 outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-6 py-3.5 rounded-xl bg-[#e5a0e0] hover:bg-[#dc8ed7] active:scale-[0.98] text-white font-medium text-[15px] flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 transform rotate-12" />
                <span>Send</span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
