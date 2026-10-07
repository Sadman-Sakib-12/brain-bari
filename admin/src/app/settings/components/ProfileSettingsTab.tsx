"use client";

import React from "react";
import Card from "@/components/ui/Card";
import FormField from "@/components/ui/FormField";

interface ProfileSettingsTabProps {
  profileName: string;
  setProfileName: (v: string) => void;
  profileEmail: string;
  setProfileEmail: (v: string) => void;
  profileRole: string;
  newPassword: string;
  setNewPassword: (v: string) => void;
}

export default function ProfileSettingsTab({
  profileName,
  setProfileName,
  profileEmail,
  setProfileEmail,
  profileRole,
  newPassword,
  setNewPassword
}: ProfileSettingsTabProps) {
  return (
    <Card header={<h3 className="text-sm font-bold text-slate-900">Administrator Profile</h3>}>
      <div className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Full Name" required>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>

          <FormField label="Admin Email" required>
            <input
              type="email"
              value={profileEmail}
              onChange={(e) => setProfileEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
            />
          </FormField>
        </div>

        <FormField label="Role / Authorization Level">
          <input
            type="text"
            value={profileRole}
            readOnly
            className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-700"
          />
        </FormField>

        <div className="pt-3 border-t border-slate-100">
          <FormField label="Change Administrator Password (Optional)">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password to update..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
            />
          </FormField>
        </div>
      </div>
    </Card>
  );
}
