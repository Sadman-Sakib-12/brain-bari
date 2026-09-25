import React from "react";
import Link from "next/link";
import { Bot, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfbfe] px-4 py-32 text-center">
      <div className="max-w-md mx-auto space-y-6">
        
        <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto shadow-inner">
          <Bot className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-6xl font-black text-amber-900 font-mono block">404</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-950">
            Page Not Found
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            The page you are looking for might have been moved, renamed, or is temporarily unavailable.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-900 hover:bg-amber-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return To Home</span>
          </Link>

          <Link
            href="/services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-gray-300 text-gray-800 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore Services</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
