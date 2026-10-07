import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AppErrorBoundary from "@/components/ErrorBoundary";
import Providers from "@/components/Providers";
import GoogleTranslate from "@/components/GoogleTranslate";

export const metadata: Metadata = {
  title: "Brain Bari – AI & Software Solutions Company in Bangladesh",
  description: "Brain Bari is an AI and software solutions company in Bangladesh specializing in conversational AI chatbots, SaaS development, custom software, and innovative digital products.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark)) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#fcfbfe] dark:bg-[#090d16] text-gray-900 dark:text-gray-100 selection:bg-amber-100 selection:text-amber-900 transition-colors duration-300">
        <Providers>
          <Navbar />
          <main className="flex-1">
            <AppErrorBoundary>
              {children}
            </AppErrorBoundary>
          </main>
          <Footer />
          <GoogleTranslate />
        </Providers>
      </body>
    </html>
  );
}
