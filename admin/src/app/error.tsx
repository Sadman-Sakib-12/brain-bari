"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home, RefreshCw } from "lucide-react";

export default function RootErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception to console / monitoring
    console.error("Next.js Error Boundary caught runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-xl p-6 sm:p-8 bg-white border border-rose-200 rounded-2xl space-y-5 text-slate-800">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                Application Error Boundary
              </span>
              {error.digest && (
                <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-2 py-0.2 rounded-full border border-slate-200">
                  ID: {error.digest}
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              An unhandled application error occurred
            </h1>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              The application encountered a problem while rendering this view. You can attempt to reset the route segment or return to the overview dashboard.
            </p>
          </div>
        </div>

        {/* Error Details */}
        <div className="p-3.5 bg-rose-50/60 border border-rose-100 rounded-xl space-y-1">
          <span className="text-[11px] font-bold text-rose-700">Diagnostic Message:</span>
          <p className="font-mono text-xs text-rose-900 break-words">
            {error.message || "An unknown exception was thrown."}
          </p>
        </div>

        {/* Action Controls */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-600 shadow-2xs cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Segment</span>
            </button>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Hard Reload</span>
            </button>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Dashboard Overview</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
