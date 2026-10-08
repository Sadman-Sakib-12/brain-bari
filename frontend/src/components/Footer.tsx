"use client";

import React from "react";
import Link from "next/link";
import { Moon, Sun, Globe, Check, ChevronDown, Search, X } from "lucide-react";
import { useSiteSettings, useCmsContent } from "@/hooks/useApi";
import { switchLanguage } from "@/components/GoogleTranslate";
import { useTheme } from "@/context/ThemeContext";

export default function Footer() {
  const { theme, toggleTheme, mounted } = useTheme();
  const [selectedLang, setSelectedLang] = React.useState<any>(null);
  const [isLangOpen, setIsLangOpen] = React.useState(false);
  const [langSearch, setLangSearch] = React.useState("");
  const langDropdownRef = React.useRef<HTMLDivElement>(null);

  const { data: rawSettings } = useSiteSettings();
  const siteSettings: any = rawSettings || {};
  const { data: cmsLanguages } = useCmsContent<any[]>("footer-languages");

  const availableLanguages: any[] = React.useMemo(() => {
    return Array.isArray(cmsLanguages) ? cmsLanguages : [];
  }, [cmsLanguages]);

  React.useEffect(() => {
    if (availableLanguages.length > 0) {
      const saved = localStorage.getItem("user_lang");
      if (saved) {
        const match = availableLanguages.find((l: any) => l.code === saved);
        setSelectedLang(match || availableLanguages[0]);
      } else {
        setSelectedLang(availableLanguages[0]);
      }
    }
  }, [availableLanguages]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredLanguages = availableLanguages.filter((l: any) =>
    l.name?.toLowerCase().includes(langSearch.toLowerCase()) ||
    l.nativeName?.toLowerCase().includes(langSearch.toLowerCase()) ||
    l.code?.toLowerCase().includes(langSearch.toLowerCase())
  );

  const siteName = siteSettings?.siteName || "Brain Bari";
  const rawWhatsapp =
    siteSettings?.contact?.whatsapp ||
    siteSettings?.whatsapp ||
    siteSettings?.phone ||
    "";
  const whatsappUrl =
    siteSettings?.contact?.whatsappUrl ||
    (rawWhatsapp
      ? `https://wa.me/${rawWhatsapp.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(siteName)}`
      : "/contact");

  const contact = {
    email: siteSettings?.email || siteSettings?.contact?.email || "",
    phone: siteSettings?.phone || siteSettings?.contact?.phone || "",
    phoneFormatted: siteSettings?.phone || siteSettings?.contact?.phoneFormatted || siteSettings?.contact?.phone || "",
    whatsappUrl,
  };

  const socials = (siteSettings?.socialLinks as any) || siteSettings?.socials || {};

  const footerCopy = siteSettings?.footer?.copyright || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`;

  return (
    <footer className="bg-black text-white py-16 relative">
      <div className="max-w-[1200px] mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
          
          {/* Left Column: Let's talk */}
          <div className="text-left mb-10 md:mb-0 max-w-md">
            <h2 className="text-[36px] md:text-[44px] font-bold font-sans mb-3 tracking-tight">
              {siteSettings?.footer?.headline || "Let's talk"}
            </h2>
            {siteSettings?.footer?.aboutText && (
              <p className="text-gray-400 text-xs sm:text-sm mb-4 leading-relaxed font-light">
                {siteSettings.footer.aboutText}
              </p>
            )}
            {contact.email && (
              <p className="text-white text-[15px] mb-2 font-medium">
                Email:{" "}
                <a 
                  href={`mailto:${contact.email}`} 
                  className="hover:text-gray-300 transition-colors"
                >
                  {contact.email}
                </a>
              </p>
            )}
            {contact.phone && (
              <p className="text-white text-[15px] font-medium">
                Phone:{" "}
                <a 
                  href={`tel:${contact.phone}`} 
                  className="hover:text-gray-300 transition-colors"
                >
                  {contact.phoneFormatted || contact.phone}
                </a>
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition-all border border-white/15"
              >
                <span>Contact Us</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white text-xs font-semibold transition-all border border-white/10"
              >
                <span>Blog &amp; Insights</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Socials & Quick Links */}
          <div className="flex flex-col items-start md:items-end gap-6">
            
            {/* Social Icons */}
            <div className="flex justify-center gap-5 items-center">
              {socials.linkedin && (
                <a 
                  href={socials.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-gray-300 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-[20px] h-[20px]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              )}

              {socials.upwork && (
                <a 
                  href={socials.upwork} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-gray-300 transition-colors"
                  aria-label="Upwork"
                >
                  <span className="font-bold text-[20px] leading-none tracking-tighter block font-serif italic pr-1">
                    Up
                  </span>
                </a>
              )}

              {socials.twitter && (
                <a 
                  href={socials.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-gray-300 transition-colors"
                  aria-label="X (Twitter)"
                >
                  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}

              {socials.facebook && (
                <a 
                  href={socials.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-gray-300 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-[22px] h-[22px]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </a>
              )}

              {socials.instagram && (
                <a 
                  href={socials.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-gray-300 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              )}

              {socials.youtube && (
                <a 
                  href={socials.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-gray-300 transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-[24px] h-[24px]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </a>
              )}
            </div>

            {/* Page Navigation */}
            <div className="flex flex-wrap justify-center md:justify-end gap-6 text-[15px] font-medium">
              {Array.isArray(siteSettings?.footer?.links) && siteSettings.footer.links.length > 0 ? (
                siteSettings.footer.links.map((link: any, i: number) => (
                  <Link
                    key={link.id || i}
                    className="hover:text-gray-300 transition-colors"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                ))
              ) : (
                <>
                  <Link className="hover:text-gray-300 transition-colors" href="/new-work">Our Work</Link>
                  <Link className="hover:text-gray-300 transition-colors" href="/about">About Us</Link>
                  <Link className="hover:text-gray-300 transition-colors" href="/industries">Industries</Link>
                  <Link className="hover:text-gray-300 transition-colors" href="/product">Product</Link>
                  <Link className="hover:text-white transition-colors text-indigo-300 font-semibold" href="/blog">Blog</Link>
                  <Link className="hover:text-white transition-colors text-indigo-300 font-semibold" href="/contact">Contact</Link>
                </>
              )}
            </div>

            {/* Legal Tags & Language Selector */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-5 sm:gap-6 text-[14px] font-medium text-white/70 mt-2">
              <Link
                href="/terms"
                className="hover:text-white transition-colors underline underline-offset-4 decoration-white/30"
              >
                Terms &amp; Conditions
              </Link>
              <Link
                href="/privacy"
                className="hover:text-white transition-colors underline underline-offset-4 decoration-white/30"
              >
                Privacy Policy
              </Link>

              {/* Language Selector Component */}
              <div className="relative inline-block text-left" ref={langDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white text-[13px] font-medium transition-all duration-200 cursor-pointer shadow-sm hover:border-purple-400/50"
                  aria-label="Select Language"
                  title="Change Language"
                >
                  <Globe className="w-3.5 h-3.5 text-indigo-300" />
                  <span>{selectedLang?.flag || "🌐"}</span>
                  <span className="hidden sm:inline">{selectedLang?.name || "Language"}</span>
                  <ChevronDown className={`w-3 h-3 text-white/60 transition-transform duration-200 ${isLangOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu (Opens upwards) */}
                {isLangOpen && (
                  <div className="absolute right-0 bottom-full mb-3 w-[280px] sm:w-[320px] bg-[#121927]/98 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-3 z-[999] animate-in fade-in zoom-in-95 duration-200">
                    {/* Dropdown Header */}
                    <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-white/10">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-white/90">
                        <Globe className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Select Language ({availableLanguages.length})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsLangOpen(false)}
                        className="text-white/50 hover:text-white p-0.5 rounded-md transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Search Filter input */}
                    <div className="relative mb-2 px-0.5">
                      <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={langSearch}
                        onChange={(e) => setLangSearch(e.target.value)}
                        placeholder="Search language..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-indigo-400 transition-colors"
                        autoFocus
                      />
                    </div>

                    {/* Language Scrollable List */}
                    <div className="max-h-[220px] overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                      {filteredLanguages.map((lang) => {
                        const isSelected = selectedLang?.code === lang.code;
                        return (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => {
                              setSelectedLang(lang);
                              setIsLangOpen(false);
                              switchLanguage(lang.code);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                              isSelected
                                ? "bg-indigo-600/30 text-white font-semibold border border-indigo-500/40"
                                : "text-white/80 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-base leading-none">{lang.flag}</span>
                              <div>
                                <span className="block leading-tight text-white">{lang.name}</span>
                                <span className="text-[10.5px] text-white/50">{lang.nativeName}</span>
                              </div>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                          </button>
                        );
                      })}
                      {filteredLanguages.length === 0 && (
                        <div className="py-4 text-center text-xs text-white/40">
                          No language found
                        </div>
                      )}
                    </div>

                    {/* Hint footer */}
                    <div className="pt-2 mt-2 border-t border-white/10 text-[10.5px] text-white/40 text-center">
                      Current: <span className="text-white/90 font-medium">{selectedLang.name} ({selectedLang.nativeName})</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Copyright */}
        <div className="text-center text-[13px] text-white/80 border-t border-gray-900 pt-8">
          {footerCopy}
        </div>

      </div>

      {/* Floating Action Buttons: WhatsApp on top, Dark/Light mode toggle below */}
      <aside aria-label="Quick Actions" className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3.5 select-none">
        
        {/* WhatsApp Button (Upore) */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-[0_4px_18px_rgba(37,211,102,0.45)] hover:shadow-[0_6px_25px_rgba(37,211,102,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 relative group cursor-pointer"
        >
          <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-white" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.842-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          <span className="absolute right-[calc(100%+14px)] px-3.5 py-1.5 rounded-full bg-gray-900/95 dark:bg-slate-800/95 text-white text-[13px] font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 -translate-x-1.5 group-hover:translate-x-0 transition-all duration-200 shadow-xl border border-white/10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span>Chat with us on WhatsApp</span>
          </span>
        </a>

        {/* Dark / Light Toggle Button (Niche) */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white dark:bg-slate-800 text-gray-800 dark:text-amber-400 border border-gray-200 dark:border-slate-700 flex items-center justify-center shadow-[0_4px_18px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_25px_rgba(0,0,0,0.25)] hover:scale-110 active:scale-95 transition-all duration-300 relative group cursor-pointer"
        >
          {mounted && theme === "dark" ? (
            <Sun className="w-6 h-6 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-90" />
          ) : (
            <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700 transition-transform duration-300 -rotate-12 hover:rotate-0" />
          )}
          <span className="absolute right-[calc(100%+12px)] px-2.5 py-1 rounded-lg bg-gray-900 dark:bg-slate-800 text-white text-[12px] font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-md border dark:border-slate-700">
            {mounted && theme === "dark" ? "Light Mode" : "Dark Mode"}
          </span>
        </button>

      </aside>
    </footer>
  );
}
