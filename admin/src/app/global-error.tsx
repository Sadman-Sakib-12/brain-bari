"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical Global Error caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-[#f8fafc] text-slate-900 min-h-screen flex items-center justify-center p-4 font-sans antialiased">
        <div className="w-full max-w-lg p-6 sm:p-8 bg-white border border-rose-200 rounded-2xl space-y-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                System Global Error
              </span>
              <h1 className="text-xl font-bold text-slate-900 mt-1">
                Critical workspace initialization error
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                The root application shell failed to render. Please attempt recovery.
              </p>
            </div>
          </div>

          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl font-mono text-xs text-rose-800 break-words">
            {error.message || "Root layout encountered an exception."}
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-600 shadow-2xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Application</span>
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 cursor-pointer"
            >
              <span>Reload Page</span>
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
