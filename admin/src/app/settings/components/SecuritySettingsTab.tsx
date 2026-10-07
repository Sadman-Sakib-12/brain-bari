"use client";

import React from "react";
import { RefreshCw } from "lucide-react";
import Card from "@/components/ui/Card";
import { adminStore } from "@/lib/store";
import { toast } from "sonner";

interface SecuritySettingsTabProps {
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (v: boolean) => void;
}

export default function SecuritySettingsTab({
  twoFactorEnabled,
  setTwoFactorEnabled
}: SecuritySettingsTabProps) {
  return (
    <div className="space-y-6">
      <Card header={<h3 className="text-sm font-bold text-slate-900">Authentication &amp; Access Controls</h3>}>
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <h4 className="font-bold text-slate-900">Two-Factor Authentication (2FA)</h4>
              <p className="text-[11px] text-slate-500">Require an authenticator code when signing into admin console.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setTwoFactorEnabled(!twoFactorEnabled);
                toast.info(`2FA ${!twoFactorEnabled ? "enabled" : "disabled"}.`);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                twoFactorEnabled
                  ? "bg-emerald-600 text-white border-emerald-700"
                  : "bg-white text-slate-700 border-slate-200"
              }`}
            >
              {twoFactorEnabled ? "Active" : "Disabled"}
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <h4 className="font-bold text-slate-900">Purge Browser Local Storage &amp; Refresh</h4>
              <p className="text-[11px] text-slate-500">
                Purges all cached data from browser localStorage and loads directly from PostgreSQL database.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  try {
                    const keepKeys = new Set(["brainbari_admin_user", "brainbari_admin_auth", "admin_sidebar_collapsed"]);
                    const keysToRemove: string[] = [];
                    for (let i = 0; i < localStorage.length; i++) {
                      const k = localStorage.key(i);
                      if (k && !keepKeys.has(k)) {
                        keysToRemove.push(k);
                      }
                    }
                    keysToRemove.forEach((k) => localStorage.removeItem(k));
                  } catch {}
                }
                adminStore.clearCache();
                toast.success("LocalStorage data purged! Reloading from database...");
                setTimeout(() => window.location.reload(), 800);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Purge Storage</span>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
