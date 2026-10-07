"use client";

import React from "react";
import Card from "@/components/ui/Card";
import FormField from "@/components/ui/FormField";

interface EmailSettingsTabProps {
  smtpHost: string;
  setSmtpHost: (v: string) => void;
  smtpPort: string;
  setSmtpPort: (v: string) => void;
  senderEmail: string;
  setSenderEmail: (v: string) => void;
  notifyEmail: string;
  setNotifyEmail: (v: string) => void;
  onSendTestEmail: () => void;
}

export default function EmailSettingsTab({
  smtpHost,
  setSmtpHost,
  smtpPort,
  setSmtpPort,
  senderEmail,
  setSenderEmail,
  notifyEmail,
  setNotifyEmail,
  onSendTestEmail
}: EmailSettingsTabProps) {
  return (
    <div className="space-y-6">
      <Card
        header={
          <div className="flex items-center justify-between w-full">
            <h3 className="text-sm font-bold text-slate-900">SMTP &amp; Inbound Dispatch</h3>
            <button
              type="button"
              onClick={onSendTestEmail}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              Send Test Email
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <FormField label="SMTP Host Server">
            <input
              type="text"
              value={smtpHost}
              onChange={(e) => setSmtpHost(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px]"
            />
          </FormField>

          <FormField label="SMTP Port">
            <input
              type="text"
              value={smtpPort}
              onChange={(e) => setSmtpPort(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
            />
          </FormField>

          <FormField label="System Sender Email">
            <input
              type="email"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
            />
          </FormField>

          <FormField label="Admin Notification Recipient">
            <input
              type="email"
              value={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
            />
          </FormField>
        </div>
      </Card>
    </div>
  );
}
