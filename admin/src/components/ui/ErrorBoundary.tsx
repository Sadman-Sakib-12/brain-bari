"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  sectionName?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isDev = process.env.NODE_ENV !== "production";

      return (
        <div className="w-full max-w-2xl mx-auto my-8 p-6 sm:p-8 bg-white border border-rose-200 rounded-2xl space-y-5 text-slate-800">
          {/* Header */}
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                {this.props.sectionName || "Section Runtime"} Error Boundary
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                Something went wrong rendering this component
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                An unexpected exception was safely intercepted by the Error Boundary. Other sections of the admin workspace remain intact.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {this.state.error && (
            <div className="p-3.5 bg-rose-50/50 border border-rose-100 rounded-xl space-y-1">
              <span className="text-[11px] font-bold text-rose-700">Error Message:</span>
              <p className="font-mono text-xs text-rose-800 break-words">
                {this.state.error.message || String(this.state.error)}
              </p>
            </div>
          )}

          {/* Stack trace details in dev mode */}
          {isDev && this.state.errorInfo && (
            <details className="text-xs border border-slate-200 rounded-xl p-3 bg-slate-50/70">
              <summary className="font-semibold text-slate-700 cursor-pointer select-none">
                View Component Stack Trace
              </summary>
              <pre className="mt-2 text-[11px] font-mono text-slate-600 whitespace-pre-wrap overflow-x-auto max-h-48 leading-relaxed">
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}

          {/* Action Recovery Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-600 shadow-2xs cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                <span>Reload Window</span>
              </button>
            </div>

            <Link
              href="/"
              onClick={this.handleReset}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
