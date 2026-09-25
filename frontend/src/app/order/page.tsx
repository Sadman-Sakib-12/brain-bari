"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { 
  User, 
  Mail, 
  Phone, 
  Check, 
  CheckCircle2, 
  ArrowRight,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Clock
} from "lucide-react";

const baseServices = [
  "Ai Chatbot",
  "Ai Saas",
  "Custom Ai Assistant",
  "Ai & 3d website/apps",
  "AI Health Chatbot",
  "Custom Website Chatbot",
  "Social Media Chatbot",
  "Auto Order Chatbot",
  "Web & Mobile Development",
  "Cloud & DevOps Solutions",
  "AI & Automation",
  "Consultancy",
];

const slugToNameMap: Record<string, string> = {
  "ai-chatbot": "Ai Chatbot",
  "ai-saas": "Ai Saas",
  "custom-ai": "Custom Ai Assistant",
  "ai-3d": "Ai & 3d website/apps",
  "ai-health-chatbot": "AI Health Chatbot",
  "custom-website-chatbot": "Custom Website Chatbot",
  "social-media-chatbot": "Social Media Chatbot",
  "auto-order-chatbot": "Auto Order Chatbot",
  "enterprise-cyber-security-audit": "Consultancy",
};

function OrderForm() {
  const searchParams = useSearchParams();
  const rawQuery = searchParams.get("service") || searchParams.get("bot") || "";
  const resolvedService = slugToNameMap[rawQuery.toLowerCase().trim()] || rawQuery || "Ai Chatbot";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([resolvedService]);
  const [message, setMessage] = useState(
    rawQuery ? `Order inquiry for: ${resolvedService}` : ""
  );
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ensure current selected service is always available
  const availableServices = Array.from(new Set([...baseServices, resolvedService]));

  const toggleService = (svc: string) => {
    if (selectedServices.includes(svc)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s !== svc));
      } else {
        toast.info("Please keep at least one service selected");
      }
    } else {
      setSelectedServices([...selectedServices, svc]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast.error("Please fill in your name, email and phone number");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          selectedServices,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      setSubmitted(true);
      toast.success("Order placed successfully! We will contact you within 24 hours.");
    } catch (err: any) {
      console.error("Order submit error:", err);
      toast.error(err.message || "Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="max-w-[760px] mx-auto px-4 sm:px-6">
        
        {/* Main Single Centered Card */}
        <div className="bg-white dark:bg-[#121927] rounded-[28px] sm:rounded-[32px] p-6 sm:p-10 md:p-12 shadow-[0_15px_45px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-white/10 transition-all duration-300">
          
          {submitted ? (
            /* Success Confirmation State */
            <div className="text-center py-10 sm:py-14 space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-18 h-18 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-9 h-9 animate-bounce" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  Order Successfully Placed!
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="font-bold text-gray-900 dark:text-white">{name}</span>. Our engineering team has received your order for <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedServices.join(", ")}</span> and will reach out shortly.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setName("");
                    setEmail("");
                    setPhone("");
                    setMessage("");
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-full border border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-800 dark:text-gray-200 text-sm font-semibold transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Place Another Order</span>
                </button>

                <Link
                  href="/"
                  className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#5c2406] hover:bg-[#431a04] text-white text-sm font-bold shadow-md transition-all inline-flex items-center justify-center gap-1.5"
                >
                  <span>Return to Home</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            /* Active Clean Centered Form */
            <div>
              {/* Form Title */}
              <div className="text-center mb-8 sm:mb-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Custom Quote &amp; Booking</span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-[34px] font-extrabold text-gray-900 dark:text-white tracking-tight">
                  Place Your Order
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-2 max-w-md mx-auto">
                  Fill in your details below and our team will get in touch with an itemized project scope.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Name */}
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-0.5">
                    Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/70 dark:bg-slate-800/60 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                    />
                  </div>
                </div>

                {/* 2. Email */}
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-0.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/70 dark:bg-slate-800/60 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                    />
                  </div>
                </div>

                {/* 3. Phone */}
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-0.5">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="+880 1700-000000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/70 dark:bg-slate-800/60 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                    />
                  </div>
                </div>

                {/* 4. Services: Interactive Chips Grid (Replacing old plain checkboxes) */}
                <div>
                  <div className="flex items-center justify-between mb-2.5 ml-0.5">
                    <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300">
                      Services:
                    </label>
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {selectedServices.length} selected
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {availableServices.map((svc) => {
                      const isSelected = selectedServices.includes(svc);
                      return (
                        <button
                          type="button"
                          key={svc}
                          onClick={() => toggleService(svc)}
                          className={`group p-2.5 sm:p-3 rounded-xl border text-left transition-all duration-150 flex items-center justify-between gap-2 cursor-pointer select-none active:scale-[0.98] ${
                            isSelected
                              ? "bg-blue-50/90 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-200 font-semibold shadow-2xs"
                              : "bg-gray-50/80 dark:bg-slate-800/50 border-gray-200/90 dark:border-slate-700/80 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-slate-600 hover:bg-gray-100/70"
                          }`}
                        >
                          <span className="text-xs sm:text-[12.5px] truncate">
                            {svc}
                          </span>
                          
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                            isSelected 
                              ? "bg-blue-600 text-white" 
                              : "border border-gray-300 dark:border-slate-600 group-hover:border-gray-400"
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Message / Order Details */}
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-0.5">
                    Message / Order Details
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your project needs, business goals, or timeline..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/70 dark:bg-slate-800/60 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all resize-none leading-relaxed"
                  />
                </div>

                {/* 6. Submit Button: BotBari Signature Dark Brown Pill Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-[#5c2406] hover:bg-[#431a04] active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed text-white font-bold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Submitting Your Order...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Your Order</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Trust Footer */}
                <div className="flex items-center justify-center gap-6 pt-3 text-xs text-gray-400 dark:text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>100% Confidential</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>Response within 24 Hours</span>
                  </div>
                </div>

              </form>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}

export default function OrderPage() {
  return (
    <div className="min-h-screen bg-[#fcfbfe] dark:bg-[#090d16] font-sans pt-20 transition-colors duration-300">
      {/* Sticky Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="w-full py-4 px-6 bg-white/70 dark:bg-[#090d16]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/10 flex items-center justify-start sticky top-[80px] z-30 transition-colors"
      >
        <div className="max-w-[1200px] mx-auto w-full flex items-center gap-2 text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>
          <div className="flex items-center gap-2">
            <svg className="w-3 h-3 text-gray-300 dark:text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 dark:text-white font-bold max-w-[200px] truncate" aria-current="page">
              Order Service
            </span>
          </div>
        </div>
      </nav>

      <Suspense fallback={<div className="py-24 text-center text-sm text-gray-400">Loading order form...</div>}>
        <OrderForm />
      </Suspense>
    </div>
  );
}
