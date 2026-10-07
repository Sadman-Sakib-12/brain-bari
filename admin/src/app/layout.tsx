import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import AdminShell from "@/components/AdminShell";
import AdminProviders from "@/components/Providers";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('admin_theme');
                  if (t === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-[#f8fafc] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 min-h-screen antialiased flex flex-col transition-colors duration-200" suppressHydrationWarning>
        {/* Sonner Toaster for instant visual alerts */}
        <Toaster position="top-right" richColors theme="system" />

        {/* Providers with Theme and React Query */}
        <AdminProviders>
          {/* Responsive Shell with Header, Sidebar, and Main Area */}
          <AdminShell>{children}</AdminShell>
        </AdminProviders>
      </body>
    </html>
  );
}
