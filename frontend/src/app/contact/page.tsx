"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useFaqs, useSiteSettings } from "@/hooks/useApi";
import { useServices } from "@/hooks/useApi";

export default function ContactPage() {
  const { data: siteSettings } = useSiteSettings();
  const { data: liveFaqs = [] } = useFaqs();
  const faqs = (liveFaqs || []).map((f: any) => ({
    q: f.question || f.q,
    a: f.answer || f.a
  }));
  const { data: services = [] } = useServices();
  const serviceHelpOptions = (services || []).map((s: any) => s.title).filter(Boolean);
  const contactPhone = siteSettings?.phone || (siteSettings as any)?.contact?.phone || "";
  const contactPhoneFormatted = (siteSettings as any)?.contact?.phoneFormatted || contactPhone;
  const contactEmail = siteSettings?.email || (siteSettings as any)?.contact?.email || "";
  const twitterUrl = (siteSettings?.socialLinks as any)?.twitter || (siteSettings as any)?.socials?.twitter || "";
  const officeAddress = (siteSettings as any)?.contact?.address || siteSettings?.address || "";
  const workingHours = (siteSettings as any)?.contact?.workingHours || "";
  const mapEmbedUrl = (siteSettings as any)?.contact?.mapEmbedUrl ||
    (officeAddress ? `https://maps.google.com/maps?q=${encodeURIComponent(officeAddress)}&t=&z=14&ie=UTF8&iwloc=&output=embed` : null);
  const rawWhatsapp = (siteSettings as any)?.contact?.whatsapp || siteSettings?.phone || "";
  const whatsappUrl = (siteSettings as any)?.contact?.whatsappUrl ||
    (rawWhatsapp ? `https://wa.me/${rawWhatsapp.replace(/[^0-9]/g, "")}` : "#");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(1); // 2nd FAQ open by default
  const [isSending, setIsSending] = useState(false);

  const toggleService = (svc: string) => {
    if (selectedServices.includes(svc)) {
      setSelectedServices(selectedServices.filter((s) => s !== svc));
    } else {
      setSelectedServices([...selectedServices, svc]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in your name, email, and message");
      return;
    }

    setIsSending(true);
    try {
      await api.post("/cms/contact", {
        name,
        email,
        phone,
        message,
        selectedServices,
      });

      toast.success("Thank you! Your message has been received. We'll contact you within 24 hours.");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setSelectedServices([]);
    } catch (err: any) {
      console.error("Contact submit error:", err);
      toast.error(err.message || "Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#090d16] font-sans text-gray-800 dark:text-gray-200 flex flex-col pt-20 transition-colors duration-300">
      {/* Sticky Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="w-full py-4 px-6 bg-white/70 dark:bg-[#090d16]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/10 flex items-center justify-start sticky top-[80px] z-30"
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
              Contact
            </span>
          </div>
        </div>
      </nav>

      <div className="flex-grow pt-8 md:pt-10">
        {/* Title */}
        <div className="text-center pb-12 px-6">
          <h1 className="text-[34px] md:text-[40px] font-bold text-[#333] dark:text-white tracking-wide mb-3 font-sans">
            Contact us
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-[15px]">
            Got questions? Reach out-we&apos;re just a tap away!
          </p>
        </div>

        {/* 2-Column Section */}
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-24">
          {/* Left Form */}
          <div className="bg-[#f8f7ff] dark:bg-[#121626] p-5 sm:p-8 md:p-12 rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-purple-50/50 dark:border-white/10 transition-colors">
            <h2 className="text-lg sm:text-[22px] md:text-[24px] font-bold text-gray-900 dark:text-white mb-3 leading-snug font-sans">
              Have a project in mind? We&apos;d love to discuss how we can help bring your ideas to life.
            </h2>
            <p className="text-[14px] sm:text-[15px] text-gray-500 dark:text-gray-400 mb-10">
              Tell us more about yourself and what you&apos;ve got in mind.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[15px] font-semibold text-gray-700 dark:text-gray-300 mb-1 ml-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Md. Abul Kalam Azad"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50/50 dark:bg-slate-800/80 border border-gray-400/80 dark:border-slate-700 rounded-full px-6 py-4 text-[15px] text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                />
              </div>

              <div>
                <label className="block text-[15px] font-semibold text-gray-700 dark:text-gray-300 mb-1 ml-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="azad.example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50/50 dark:bg-slate-800/80 border border-gray-400/80 dark:border-slate-700 rounded-full px-6 py-4 text-[15px] text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                />
              </div>

              <div>
                <label className="block text-[15px] font-semibold text-gray-700 dark:text-gray-300 mb-1 ml-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+8801500000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-50/50 dark:bg-slate-800/80 border border-gray-400/80 dark:border-slate-700 rounded-full px-6 py-4 text-[15px] text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
                />
              </div>

              <div>
                <label className="block text-[15px] font-semibold text-gray-700 dark:text-gray-300 mb-1 ml-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us a little about your project..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-gray-50/50 dark:bg-slate-800/80 border border-gray-400/80 dark:border-slate-700 rounded-[28px] px-6 py-4 text-[15px] text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all resize-none"
                ></textarea>
              </div>

              <div className="pt-3">
                <label className="block text-[15px] font-bold text-gray-900 dark:text-white mb-3 ml-1">
                  How can we help?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {serviceHelpOptions.map((opt) => {
                    const isSelected = selectedServices.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleService(opt)}
                        className={`px-4 py-3 rounded-2xl border text-left text-[13px] sm:text-[14px] font-bold tracking-wide transition-all duration-300 flex items-center justify-between cursor-pointer w-full select-none ${
                          isSelected
                            ? "bg-purple-50 dark:bg-purple-950/40 border-[#b57be4] text-[#b57be4] dark:text-purple-300"
                            : "bg-white dark:bg-slate-800/80 border-gray-300 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:border-[#b57be4] hover:text-[#b57be4]"
                        }`}
                      >
                        <span className="leading-snug pr-2">{opt}</span>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
                            isSelected
                              ? "border-[#b57be4] bg-[#b57be4]"
                              : "border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-blue-600 text-white font-bold text-[16px] py-4 px-8 rounded-full hover:bg-blue-700 disabled:opacity-75 disabled:cursor-not-allowed hover:shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Cards */}
          <div className="flex flex-col space-y-6">
            <h2 className="text-lg sm:text-[24px] font-bold text-gray-900 dark:text-white mb-2 px-1 font-sans">
              Let&apos;s build something amazing together
            </h2>

            {/* Chat with us */}
            <div className="bg-white dark:bg-[#121626] rounded-[32px] p-5 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-white/10 hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)] transition-all duration-300 group">
              <h3 className="font-bold text-[18px] text-gray-900 dark:text-white mb-2">Chat with us</h3>
              <p className="text-[13px] sm:text-[14px] text-gray-500 dark:text-gray-400 mb-6">
                Speak to our friendly team via live chat.
              </p>
              <ul className="space-y-4 text-[15px] text-blue-600 dark:text-blue-400 font-semibold">
                <li>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-white/10 group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    Start a live chat
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="flex items-center gap-4 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-white/10 group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    {contactEmail}
                  </a>
                </li>
                <li>
                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-white/10 group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </div>
                    Message us on X
                  </a>
                </li>
              </ul>
            </div>

            {/* Call us */}
            <div className="bg-white dark:bg-[#121626] rounded-[32px] p-5 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-white/10 hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)] transition-all duration-300 group">
              <h3 className="font-bold text-[18px] text-gray-900 dark:text-white mb-2">Call us</h3>
              <p className="text-[13px] sm:text-[14px] text-gray-500 dark:text-gray-400 mb-6">
                {workingHours}
              </p>
              <div className="text-[15px] text-blue-600 dark:text-blue-400 font-semibold">
                <a
                  href={`tel:${contactPhone}`}
                  className="flex items-center gap-4 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-white/10 group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  {contactPhoneFormatted}
                </a>
              </div>
            </div>

            {/* Visit us with Google Maps */}
            <div className="bg-white dark:bg-[#121626] rounded-[32px] p-5 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-white/10 hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)] transition-all duration-300 group">
              <h3 className="font-bold text-[18px] text-gray-900 dark:text-white mb-2">Visit us</h3>
              <p className="text-[13px] sm:text-[14px] text-gray-500 dark:text-gray-400 mb-6">
                Come say hello at our office HQ.
              </p>
              <div className="text-[15px] text-blue-600 dark:text-blue-400 font-semibold mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-white/10 group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  {officeAddress}
                </div>
              </div>
              {mapEmbedUrl ? (
                <div className="w-full h-[220px] bg-gray-200 dark:bg-slate-800 rounded-[20px] overflow-hidden relative shadow-inner">
                  <iframe
                    src={mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Brain Bari Office Location"
                  ></iframe>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        {faqs.length > 0 && (
          <div className="max-w-[800px] mx-auto px-6 pb-24">
            <h2 className="text-[22px] font-bold text-center text-[#333] dark:text-white mb-8 font-sans">
              Frequently asked question
            </h2>
            <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="flex flex-col">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className={`w-full flex items-center justify-between text-left px-5 py-4 bg-white dark:bg-[#121626] border rounded-[8px] transition-colors cursor-pointer ${
                      isOpen
                        ? "border-gray-800 dark:border-purple-400"
                        : "border-gray-300 dark:border-white/10 hover:border-gray-800 dark:hover:border-purple-400"
                    }`}
                  >
                    <span className="text-[15px] text-[#333] dark:text-white font-medium font-sans">
                      {faq.q}
                    </span>
                    <span className="text-gray-800 dark:text-gray-200 shrink-0 ml-4">
                      {isOpen ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      )}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="mt-2 p-5 bg-white dark:bg-[#151c2d] border border-gray-200 dark:border-white/10 rounded-[8px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] text-[14px] text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
