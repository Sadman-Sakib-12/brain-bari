"use client";

import React, { useEffect } from "react";
import { DefaultErrorFallback } from "@/components/ErrorBoundary";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log route-level errors for observability
    console.error("[Route Error]", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <DefaultErrorFallback
        error={error}
        resetErrorBoundary={reset}
        title="Something went wrong!"
        subtitle="We encountered an unexpected issue while loading this page. Please try again."
      />
    </div>
  );
}
