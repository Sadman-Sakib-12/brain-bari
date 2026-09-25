"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ErrorBoundary as ReactErrorBoundary,
  useErrorBoundary,
  withErrorBoundary,
  type FallbackProps,
  type ErrorBoundaryPropsWithComponent,
  type ErrorBoundaryPropsWithFallback,
  type ErrorBoundaryPropsWithRender,
} from "react-error-boundary";
import { AlertTriangle, RotateCcw, Home, ChevronDown, ChevronUp } from "lucide-react";

export interface DefaultErrorFallbackProps extends FallbackProps {
  title?: string;
  subtitle?: string;
}

export function DefaultErrorFallback({
  error,
  resetErrorBoundary,
  title = "Something went wrong",
  subtitle = "An unexpected error occurred in this section. You can try refreshing or heading back home.",
}: DefaultErrorFallbackProps) {
  const [showDetails, setShowDetails] = useState(false);
  const errorMessage = error instanceof Error ? error.message : String(error ?? "Unknown error");
  const errorStack = error instanceof Error ? error.stack : null;

  return (
    <div className="w-full py-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 text-center space-y-6">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200/60 flex items-center justify-center mx-auto shadow-inner">
          <AlertTriangle className="w-8 h-8" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            {title}
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => resetErrorBoundary()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-900 hover:bg-amber-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return To Home</span>
          </Link>
        </div>

        {/* Technical Error Details Accordion */}
        {errorMessage && (
          <div className="pt-2 text-left border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowDetails((prev) => !prev)}
              className="w-full flex items-center justify-between text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors py-1 cursor-pointer"
            >
              <span>Error Details</span>
              {showDetails ? (
                <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              )}
            </button>

            {showDetails && (
              <div className="mt-2.5 p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-left overflow-hidden">
                <p className="text-xs font-mono font-semibold text-rose-600 break-words">
                  {errorMessage}
                </p>
                {errorStack && (
                  <pre className="mt-2 text-[10px] sm:text-[11px] font-mono text-gray-600 overflow-x-auto whitespace-pre-wrap max-h-40 p-2 bg-gray-100/80 rounded-lg">
                    {errorStack}
                  </pre>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export interface AppErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  fallbackRender?: (props: FallbackProps) => React.ReactNode;
  FallbackComponent?: React.ComponentType<FallbackProps>;
  onReset?: () => void;
  onError?: (error: unknown, info: React.ErrorInfo) => void;
  resetKeys?: unknown[];
}

export function AppErrorBoundary({
  children,
  fallback,
  fallbackRender,
  FallbackComponent,
  onReset,
  onError,
  resetKeys,
}: AppErrorBoundaryProps) {
  const handleError = (error: unknown, info: React.ErrorInfo) => {
    console.error("[AppErrorBoundary] Caught an error:", error, info);
    onError?.(error, info);
  };

  if (fallback) {
    return (
      <ReactErrorBoundary
        fallback={fallback}
        onReset={onReset}
        onError={handleError}
        resetKeys={resetKeys}
      >
        {children}
      </ReactErrorBoundary>
    );
  }

  if (fallbackRender) {
    return (
      <ReactErrorBoundary
        fallbackRender={fallbackRender}
        onReset={onReset}
        onError={handleError}
        resetKeys={resetKeys}
      >
        {children}
      </ReactErrorBoundary>
    );
  }

  return (
    <ReactErrorBoundary
      FallbackComponent={FallbackComponent || DefaultErrorFallback}
      onReset={onReset}
      onError={handleError}
      resetKeys={resetKeys}
    >
      {children}
    </ReactErrorBoundary>
  );
}

export { useErrorBoundary, withErrorBoundary };
export default AppErrorBoundary;
