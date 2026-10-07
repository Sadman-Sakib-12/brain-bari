"use client";

import React, { useState, useEffect, Suspense } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

interface AdminShellProps {
  children: React.ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("admin_sidebar_collapsed");
      if (saved !== null) {
        setIsCollapsed(saved === "true");
      }

      // Sync auth session to cookie for middleware / proxy guard
      const isAuthLocal = localStorage.getItem("brainbari_admin_auth") === "true";
      if (isAuthLocal) {
        if (!document.cookie.includes("brainbari_admin_auth=true")) {
          document.cookie = "brainbari_admin_auth=true; path=/; max-age=2592000; SameSite=Lax";
        }
      } else if (!isAuthPage) {
        window.location.href = `/login?callbackUrl=${encodeURIComponent(pathname)}`;
      }
    } catch {
      // safe fallback
    }
  }, [isAuthPage, pathname]);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("admin_sidebar_collapsed", String(next));
      } catch {
        // safe fallback
      }
      return next;
    });
  };

  if (isAuthPage) {
    return <main className="flex-1 w-full min-h-screen">{children}</main>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 relative selection:bg-blue-600 selection:text-white transition-colors duration-200">
      {/* Subtle top ambient glow */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 dark:from-blue-950/20 via-slate-50/20 dark:via-slate-900/10 to-transparent pointer-events-none -z-10" />
      {/* Responsive Admin Sidebar */}
      <Suspense fallback={null}>
        <AdminSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          mounted={mounted}
        />
      </Suspense>

      {/* Main Content Area with smooth transition when rail / drawer toggles */}
      <div
        className={`flex flex-col flex-1 min-w-0 ${
          mounted ? "transition-all duration-200 ease-in-out" : ""
        } ${isCollapsed ? "md:pl-[72px]" : "md:pl-[280px]"}`}
      >
        <AdminHeader
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
          onOpenMobile={() => setMobileOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          <ErrorBoundary sectionName="Admin Workspace">
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
