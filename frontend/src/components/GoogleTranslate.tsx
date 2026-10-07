"use client";

import React, { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

export function switchLanguage(langCode: string) {
  if (typeof window === "undefined") return;

  // 1. Store preference in localStorage
  localStorage.setItem("user_lang", langCode);

  // 2. Set googtrans cookie for Google Translate
  const target = langCode === "en" ? "/auto/en" : `/auto/${langCode}`;
  const d = new Date();
  d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();

  if (langCode === "en") {
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    document.cookie = `googtrans=/auto/en; ${expires}; path=/;`;
    document.cookie = `googtrans=/auto/en; ${expires}; path=/; domain=${window.location.hostname};`;
  } else {
    document.cookie = `googtrans=${target}; ${expires}; path=/;`;
    document.cookie = `googtrans=${target}; ${expires}; path=/; domain=${window.location.hostname};`;
  }

  // 3. Set RTL for Arabic & Urdu
  if (["ar", "ur"].includes(langCode)) {
    document.documentElement.setAttribute("dir", "rtl");
  } else {
    document.documentElement.setAttribute("dir", "ltr");
  }

  // 4. Trigger Google Translate combo if already initialized
  const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (select) {
    select.value = langCode;
    select.dispatchEvent(new Event("change"));
  } else {
    window.location.reload();
  }
}

export default function GoogleTranslate() {
  useEffect(() => {
    // Check initial user_lang and set RTL if needed
    const saved = localStorage.getItem("user_lang");
    if (saved && ["ar", "ur"].includes(saved)) {
      document.documentElement.setAttribute("dir", "rtl");
    }

    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages:
              "en,bn,ar,es,fr,de,zh,ja,ko,hi,pt,ru,it,tr,nl,id,ms,vi,ur,sv",
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };
  }, []);

  return (
    <>
      <div id="google_translate_element" className="hidden" style={{ display: "none" }} />
      <Script
        id="google-translate-script"
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  );
}
