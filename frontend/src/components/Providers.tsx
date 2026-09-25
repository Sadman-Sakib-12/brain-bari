"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as HotToaster } from "react-hot-toast";
import { Toaster as SonnerToaster } from "sonner";

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
    <QueryClientProvider client={queryClient}>
      {children}
      {/* react-hot-toast */}
      <HotToaster 
        position="top-right" 
        toastOptions={{
          duration: 4000,
          style: {
            background: "#ffffff",
            color: "#1f2937",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
            fontSize: "13px",
            fontWeight: 500,
          },
        }} 
      />
      {/* sonner toast */}
      <SonnerToaster position="top-right" richColors />
    </QueryClientProvider>
  );
}
