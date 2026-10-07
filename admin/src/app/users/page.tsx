"use client";

import { useEffect, useState } from "react";
import { adminStore } from "@/lib/store";
import { adminApi } from "@/lib/adminApi";
import { toast } from "sonner";
import { Users, UserPlus, Search } from "lucide-react";
import { UserItem } from "./types";
import CreateUserDrawer from "./components/CreateUserDrawer";
import UsersTable from "./components/UsersTable";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export type { UserItem };

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [filterRole, setFilterRole] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const [newUser, setNewUser] = useState<Omit<UserItem, "id" | "joinedDate">>({
    name: "",
    email: "",
    role: "Client",
    phone: "",
    company: "",
    avatar: "",
    status: "Active",
  });

  const loadData = () => {
    adminApi
      .getUsers()
      .then((res) => {
        if (res && res.length > 0) {
          setUsers(
            res.map((u: any) => ({
              id: u.id,
              name: u.name,
              email: u.email,
              role: u.role === "ADMIN" ? "Admin" : "Client",
              phone: u.phone || "N/A",
              company: u.company || "N/A",
              avatar: u.avatar || "",
              status: "Active",
              joinedDate: u.createdAt ? u.createdAt.split("T")[0] : new Date().toISOString().split("T")[0],
            }))
          );
        } else {
          setUsers([]);
        }
      })
      .catch(() => {
        setUsers([]);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesRole = filterRole === "ALL" || u.role.toUpperCase() === filterRole;
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleToggleRole = async (id: string) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;
    const nextRole = target.role === "Admin" ? "CLIENT" : "ADMIN";
    try {
      await adminApi.updateUserRole(id, nextRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: nextRole === "ADMIN" ? "Admin" : "Client" } : u))
      );
      toast.info(`Changed ${target.name}'s role to ${nextRole === "ADMIN" ? "Admin" : "Client"}`);
    } catch (err: any) {
      toast.error("Failed to update role in backend: " + (err.message || "Unknown error"));
    }
  };

  const handleToggleStatus = (id: string) => {
    const updated = users.map((u) => {
      if (u.id === id) {
        const nextStatus = u.status === "Active" ? "Suspended" : "Active";
        toast.success(`Account status for ${u.name} set to ${nextStatus}`);
        return { ...u, status: nextStatus };
      }
      return u;
    });
    setUsers(updated);
  };

  const handleDeleteUser = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminApi.deleteUser(deleteTarget.id);
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      toast.success(`User ${deleteTarget.name} removed.`);
    } catch (err: any) {
      toast.error("Failed to delete user in backend: " + (err.message || "Unknown error"));
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) {
      toast.error("Name and email are required.");
      return;
    }

    try {
      await adminApi.createUser({
        name: newUser.name.trim(),
        email: newUser.email.trim(),
        role: newUser.role === "Admin" ? "ADMIN" : "CLIENT",
        phone: newUser.phone,
        company: newUser.company,
        avatar: newUser.avatar,
      });

      toast.success(`User account "${newUser.name}" created successfully!`);
      setIsAddModalOpen(false);
      setNewUser({
        name: "",
        email: "",
        role: "Client",
        phone: "",
        company: "",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
        status: "Active",
      });
      loadData();
    } catch (err: any) {
      toast.error("Failed to create user: " + (err.response?.data?.message || err.message || "Unknown error"));
    }
  };

  const adminCount = users.filter((u) => u.role === "Admin").length;
  const clientCount = users.filter((u) => u.role === "Client").length;
  const activeCount = users.filter((u) => u.status === "Active").length;

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-indigo-600" />
            Users &amp; Client Accounts
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Managed Entity: PostgreSQL / NeonDB User Accounts. Controls administrative permissions and client portal credentials.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 shadow-2xs text-white border border-slate-800 transition-all cursor-pointer self-start md:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          Add User / Client
        </button>
      </div>

      {/* Stats KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Total Registered</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{users.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">System Admins</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{adminCount}</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Enterprise Clients</p>
          <p className="text-2xl font-bold text-cyan-600 mt-1">{clientCount}</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Active Status</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{activeCount}</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search users by name, email, company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-slate-800 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 p-1 rounded-xl">
          {["ALL", "ADMIN", "CLIENT"].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setFilterRole(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterRole === role
                  ? "bg-white text-slate-900 shadow-2xs font-bold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {role === "ALL" ? "All Users" : role === "ADMIN" ? "Admins" : "Clients"}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <UsersTable
        users={filteredUsers}
        onToggleRole={handleToggleRole}
        onToggleStatus={handleToggleStatus}
        onDeleteUser={handleDeleteUser}
      />

      {/* Add User Slide-over Drawer */}
      <CreateUserDrawer
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        newUser={newUser}
        setNewUser={setNewUser}
        onSubmit={handleCreateUser}
      />

      {/* Delete User Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Remove User Account"
        message={`Are you sure you want to remove user "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Remove User"
        cancelLabel="Cancel"
        isDestructive={true}
      />
    </div>
  );
}
