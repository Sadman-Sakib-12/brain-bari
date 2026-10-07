"use client";

import React from "react";
import {
  Users,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  Trash2,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
} from "lucide-react";
import { UserItem } from "../types";

interface UsersTableProps {
  users: UserItem[];
  onToggleRole: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onDeleteUser: (id: string, name: string) => void;
}

export default function UsersTable({
  users,
  onToggleRole,
  onToggleStatus,
  onDeleteUser,
}: UsersTableProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">User / Account</th>
              <th className="py-3.5 px-4">Contact Info</th>
              <th className="py-3.5 px-4">Company</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Joined</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-400">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  No matching user accounts found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Avatar + Name */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center font-bold text-xs text-slate-600 shrink-0">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : (
                          user.name
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 leading-tight">
                          {user.name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{user.email}</span>
                      </div>
                      {user.phone && user.phone !== "N/A" && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Phone className="w-3 h-3 text-slate-300" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Company */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-700">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[140px]">{user.company || "N/A"}</span>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => onToggleRole(user.id)}
                      title="Click to toggle role"
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-transform active:scale-95 cursor-pointer ${
                        user.role === "Admin"
                          ? "bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100"
                          : "bg-cyan-50 text-cyan-700 border border-cyan-200 hover:bg-cyan-100"
                      }`}
                    >
                      <ShieldCheck className="w-3 h-3" />
                      {user.role}
                    </button>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(user.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors cursor-pointer ${
                        user.status === "Active"
                          ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200"
                          : "text-rose-700 bg-rose-50 hover:bg-rose-100 border-rose-200"
                      }`}
                    >
                      {user.status === "Active" ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          Suspended
                        </>
                      )}
                    </button>
                  </td>

                  {/* Joined */}
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {user.joinedDate}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(user.id)}
                        title={user.status === "Active" ? "Suspend Account" : "Activate Account"}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                      >
                        {user.status === "Active" ? (
                          <UserX className="w-4 h-4" />
                        ) : (
                          <UserCheck className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteUser(user.id, user.name)}
                        title="Delete User"
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
