"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as HotToaster } from "react-hot-toast";
import { Toaster as SonnerToaster } from "sonner";
import { ThemeProvider } from "@/context/ThemeContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        {/* react-hot-toast */}
        <HotToaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "var(--background, #ffffff)",
              color: "var(--foreground, #1f2937)",
              borderRadius: "12px",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.12)",
              fontSize: "13px",
              fontWeight: 500,
            },
          }}
        />
        {/* sonner toast */}
        <SonnerToaster position="top-right" richColors theme="system" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
