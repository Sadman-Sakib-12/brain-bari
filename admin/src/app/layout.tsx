import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import AdminShell from "@/components/AdminShell";

export const metadata: Metadata = {
  title: "Brain Bari Admin Panel – Enterprise Console",
  description: "Enterprise CMS and management console for Brain Bari AI & Software Solutions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-[#f8fafc]">
      <body className="bg-[#f8fafc] text-slate-900 min-h-screen antialiased flex flex-col font-sans">
        {/* Sonner Toaster for instant visual alerts */}
        <Toaster position="top-right" richColors theme="light" />

        {/* Responsive Shell with Header, Sidebar, and Main Area */}
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
