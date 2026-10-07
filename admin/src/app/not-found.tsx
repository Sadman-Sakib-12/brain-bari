import React from "react";
import Link from "next/link";
import { FileQuestion, Home, ArrowLeft, Layers, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-6">
        {/* Icon Badge */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700">
          <FileQuestion className="w-8 h-8 text-slate-500 stroke-[1.5]" />
        </div>

        {/* Headings */}
        <div className="space-y-2">
          <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
            HTTP 404 &bull; Page Not Found
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Admin View Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            The page or management module you requested does not exist, has been moved, or may be under active development.
          </p>
        </div>

        {/* Quick Navigation suggestions */}
        <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-left space-y-2">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
            Suggested Destinations:
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Link
              href="/"
              className="flex items-center gap-1.5 p-2 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors text-slate-700 font-medium"
            >
              <Home className="w-3.5 h-3.5 text-slate-400" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/website/homepage"
              className="flex items-center gap-1.5 p-2 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors text-slate-700 font-medium"
            >
              <Compass className="w-3.5 h-3.5 text-slate-400" />
              <span>Website CMS</span>
            </Link>
            <Link
              href="/services"
              className="flex items-center gap-1.5 p-2 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors text-slate-700 font-medium"
            >
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>Services</span>
            </Link>
            <Link
              href="/projects"
              className="flex items-center gap-1.5 p-2 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors text-slate-700 font-medium"
            >
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>Projects</span>
            </Link>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-600 shadow-2xs transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
