"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  CheckCircle2,
  Mail,
  Globe,
  Tag,
  Building2,
  Award,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Layers
} from "lucide-react";
import { adminStore } from "@/lib/store";
import initialTeam from "@/data/team.json";
import initialIndustryExpertises from "@/data/industryExpertises.json";
import PageHeader from "@/components/ui/PageHeader";

// Inline brand SVGs since Lucide does not export brand logos
const GithubIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
  </svg>
);
import StatusBadge from "@/components/ui/StatusBadge";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import FormField from "@/components/ui/FormField";
import { toast } from "sonner";

type TeamTab = "members" | "departments" | "expertises";

const DEPARTMENTS = [
  "Executive Advisory",
  "Executive Leadership",
  "Founding Leadership",
  "Frontend Engineering",
  "Backend Systems",
  "Artificial Intelligence",
  "Data & Analytics",
  "Product Design",
  "Engineering & AI R&D",
  "Client Operations & Delivery"
];

function TeamContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get("tab") as TeamTab) || "members";
  const initialAction = searchParams.get("action");

  const [activeTab, setActiveTab] = useState<TeamTab>(initialTab);
  const [team, setTeam] = useState<any[]>(initialTeam);
  const [selectedDept, setSelectedDept] = useState("All");
  const [saved, setSaved] = useState(false);

  // Edit / Add Modal for Team Member
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form fields for Member
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("Frontend Engineering");
  const [experience, setExperience] = useState("3+ Years");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [status, setStatus] = useState("Active Staff");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [bio, setBio] = useState("");
  const [fullBio, setFullBio] = useState("");

  // Industry Expertises State (industryExpertises.json)
  const [expertises, setExpertises] = useState<any[]>(initialIndustryExpertises);
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [editingExpIdx, setEditingExpIdx] = useState<number | null>(null);
  const [expTitle, setExpTitle] = useState("");
  const [expBg, setExpBg] = useState("#faf3e0");
  const [expPath, setExpPath] = useState("");
  const [deleteExpConfirmIdx, setDeleteExpConfirmIdx] = useState<number | null>(null);

  const loadData = () => {
    try {
      const stored = adminStore.getTeam();
      if (stored && stored.length > 0) setTeam(stored);
      const storedExp = adminStore.getIndustryExpertises();
      if (storedExp && storedExp.length > 0) setExpertises(storedExp);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("admin_store_updated", loadData);
    return () => window.removeEventListener("admin_store_updated", loadData);
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab") as TeamTab;
    const action = searchParams.get("action");
    if (action === "add") {
      openAdd();
    } else if (tab && ["members", "departments", "expertises"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleSaveAll = () => {
    adminStore.setTeam(team);
    adminStore.setIndustryExpertises(expertises);
    setSaved(true);
    toast.success("Team roster and Industry Expertises saved successfully!", {
      description: "Frontend /resources/team page updated live."
    });
    setTimeout(() => setSaved(false), 2000);
  };

  const openAdd = () => {
    setEditingMember(null);
    setName("");
    setRole("Web Developer");
    setDepartment("Frontend Engineering");
    setExperience("3+ Years");
    setEmail("");
    setAvatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80");
    setSkillsText("React / Next.js, TypeScript, TailwindCSS");
    setStatus("Active Staff");
    setLinkedin("https://linkedin.com");
    setGithub("https://github.com");
    setBio("");
    setFullBio("");
    setIsModalOpen(true);
  };

  const openEdit = (member: any) => {
    setEditingMember(member);
    setName(member.name || "");
    setRole(member.role || member.position || "");
    setDepartment(member.department || "Frontend Engineering");
    setExperience(member.experience || "3+ Years");
    setEmail(member.email || "");
    setAvatar(member.avatar || "");
    setSkillsText(Array.isArray(member.skills) ? member.skills.join(", ") : "");
    setStatus(member.status || "Active Staff");
    setLinkedin(member.linkedin || "");
    setGithub(member.github || "");
    setBio(member.bio || "");
    setFullBio(member.fullBio || member.bio || "");
    setIsModalOpen(true);
  };

  const handleSaveForm = () => {
    if (!name.trim()) {
      toast.error("Member name is required");
      return;
    }

    const skills = skillsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name,
      role,
      position: role,
      department,
      experience,
      email,
      avatar,
      skills,
      status,
      linkedin,
      github,
      bio,
      fullBio
    };

    if (editingMember) {
      const updated = team.map((m) => {
        if (m.id === editingMember.id) {
          return {
            ...m,
            ...payload
          };
        }
        return m;
      });
      setTeam(updated);
      adminStore.setTeam(updated);
      toast.success(`Member "${name}" updated.`);
    } else {
      const newMember = {
        id: `tm-${Date.now()}`,
        ...payload
      };
      const updated = [newMember, ...team];
      setTeam(updated);
      adminStore.setTeam(updated);
      toast.success(`Team member "${name}" added.`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteConfirmId) return;
    const updated = team.filter((m) => m.id !== deleteConfirmId);
    setTeam(updated);
    adminStore.setTeam(updated);
    toast.success("Team member removed.");
    setDeleteConfirmId(null);
  };

  // Industry Expertises Handlers
  const openAddExp = () => {
    setEditingExpIdx(null);
    setExpTitle("");
    setExpBg("#faf3e0");
    setExpPath("M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4");
    setIsExpModalOpen(true);
  };

  const openEditExp = (idx: number) => {
    const item = expertises[idx];
    if (!item) return;
    setEditingExpIdx(idx);
    setExpTitle(item.title || "");
    setExpBg(item.bg || "#faf3e0");
    setExpPath(item.path || "");
    setIsExpModalOpen(true);
  };

  const handleSaveExp = () => {
    if (!expTitle.trim()) {
      toast.error("Industry title is required");
      return;
    }
    const payload = {
      title: expTitle.trim(),
      bg: expBg.trim() || "#f5f5f5",
      path: expPath.trim() || "M12 4v16m8-8H4"
    };

    let updated: any[];
    if (editingExpIdx !== null) {
      updated = [...expertises];
      updated[editingExpIdx] = payload;
      toast.success(`Updated "${payload.title}"`);
    } else {
      updated = [...expertises, payload];
      toast.success(`Added "${payload.title}"`);
    }
    setExpertises(updated);
    adminStore.setIndustryExpertises(updated);
    setIsExpModalOpen(false);
  };

  const handleDeleteExp = () => {
    if (deleteExpConfirmIdx === null) return;
    const updated = expertises.filter((_, idx) => idx !== deleteExpConfirmIdx);
    setExpertises(updated);
    adminStore.setIndustryExpertises(updated);
    toast.success("Industry capability card removed.");
    setDeleteExpConfirmIdx(null);
  };

  const handleMoveExp = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= expertises.length) return;
    const updated = [...expertises];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setExpertises(updated);
    adminStore.setIndustryExpertises(updated);
    toast.success("Industry card order updated.");
  };

  const filteredTeam = team.filter((m) => {
    if (selectedDept === "All") return true;
    return (m.department || "").toLowerCase() === selectedDept.toLowerCase();
  });

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Enterprise CMS / Team"
        title="Team Members &amp; Departments"
        description="Manage specialists, lead engineers, research scientists, and organizational departments showcased to clients."
        actions={
          <div className="flex items-center gap-2">
            {activeTab === "expertises" ? (
              <button
                type="button"
                onClick={openAddExp}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-[#0f172a] hover:bg-slate-800 border border-slate-800 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Industry Card</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={openAdd}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-[#0f172a] hover:bg-slate-800 border border-slate-800 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Member</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleSaveAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 cursor-pointer transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-slate-400" />
              <span>{saved ? "Saved!" : "Save All"}</span>
            </button>
          </div>
        }
      >
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mt-2 -mb-2 overflow-x-auto no-scrollbar">
          {[
            { id: "members", label: "Team Members", icon: Users, count: team.length },
            { id: "departments", label: "Departments", icon: Building2, count: DEPARTMENTS.length },
            { id: "expertises", label: "Industry Expertises", icon: Award, count: expertises.length }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as TeamTab);
                  router.push(tab.id === "members" ? "/team" : `/team?tab=${tab.id}`);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                  isActive
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-slate-100 text-slate-600">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </PageHeader>

      {/* TAB 1: TEAM MEMBERS (MEMBER CARDS PATTERN) */}
      {activeTab === "members" && (
        <div className="space-y-5">
          {/* Department Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {["All", ...DEPARTMENTS].map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                  selectedDept === dept
                    ? "bg-[#0f172a] text-white border-slate-800"
                    : "bg-white text-slate-600 hover:text-slate-900 border-slate-200"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Member Profile Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTeam.map((m) => (
              <div
                key={m.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                <div className="p-5 space-y-4">
                  {/* Header: Avatar, Name, Dept */}
                  <div className="flex items-start gap-3.5">
                    {m.avatar ? (
                      <img
                        src={m.avatar}
                        alt={m.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold shrink-0">
                        {m.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="text-sm font-bold text-slate-900 truncate">{m.name}</h3>
                        <StatusBadge status={m.status || "Active"} size="sm" />
                      </div>
                      <p className="text-xs text-indigo-600 font-medium truncate">{m.role || m.position}</p>
                      <span className="inline-block text-[10px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 mt-1">
                        {m.department}
                      </span>
                    </div>
                  </div>

                  {/* Bio Preview */}
                  {m.bio && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {m.bio}
                    </p>
                  )}

                  {/* Skills Pills */}
                  {Array.isArray(m.skills) && m.skills.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {m.skills.slice(0, 3).map((skill: string, idx: number) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium truncate max-w-[120px]"
                        >
                          {skill}
                        </span>
                      ))}
                      {m.skills.length > 3 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-400 font-medium">
                          +{m.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* FullBio Indicator */}
                  {m.fullBio && (
                    <div className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50/70 px-2 py-1 rounded-lg border border-emerald-100">
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                      <span className="truncate">Full biography configured</span>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400">
                    {m.email && (
                      <a href={`mailto:${m.email}`} title={m.email} className="hover:text-slate-600">
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {m.linkedin && (
                      <a href={m.linkedin} target="_blank" rel="noreferrer" title="LinkedIn" className="hover:text-slate-600">
                        <LinkedinIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {m.github && (
                      <a href={m.github} target="_blank" rel="noreferrer" title="GitHub" className="hover:text-slate-600">
                        <GithubIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(m)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                      title="Edit Member"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(m.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors"
                      title="Delete Member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DEPARTMENTS */}
      {activeTab === "departments" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEPARTMENTS.map((dept, idx) => (
            <div key={idx} className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">{dept}</h3>
                <span className="text-xs text-slate-500 font-mono bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
                  {team.filter((m) => (m.department || "").toLowerCase() === dept.toLowerCase()).length} Members
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Core organizational unit responsible for architecture, deliverable milestones, and production releases.
              </p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: INDUSTRY EXPERTISES (industryExpertises.json) */}
      {activeTab === "expertises" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Industry Capability Cards ({expertises.length})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Rendered as asymmetrical pastel cards under "Our Industry Expertises" on the frontend Team page (/resources/team).
              </p>
            </div>
            <button
              type="button"
              onClick={openAddExp}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-[#0f172a] hover:bg-slate-800 border border-slate-800 cursor-pointer transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Capability Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {expertises.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-300 transition-all space-y-4"
              >
                {/* Visual Preview Box */}
                <div className="py-2 flex items-center justify-center">
                  <div
                    style={{ backgroundColor: item.bg || "#faf3e0" }}
                    className="flex flex-col items-center justify-center text-center w-[145px] h-[95px] shadow-xs border border-gray-100/60 rounded-tl-[28px] rounded-br-[28px] rounded-tr-[4px] rounded-bl-[4px] transition-transform hover:scale-105"
                  >
                    <div className="mb-2 text-gray-700">
                      <svg
                        className="w-7 h-7 text-gray-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d={item.path} />
                      </svg>
                    </div>
                    <span className="text-[11px] font-bold text-gray-700 px-2 leading-tight">
                      {item.title}
                    </span>
                  </div>
                </div>

                {/* Card Meta & Controls */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-3.5 h-3.5 rounded-md border border-slate-300 shrink-0"
                      style={{ backgroundColor: item.bg }}
                    />
                    <code className="text-[10px] text-slate-500 font-mono">{item.bg}</code>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Reorder Buttons */}
                    <button
                      type="button"
                      onClick={() => handleMoveExp(idx, "up")}
                      disabled={idx === 0}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                      title="Move card earlier"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveExp(idx, "down")}
                      disabled={idx === expertises.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                      title="Move card later"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditExp(idx)}
                      className="p-1 text-slate-400 hover:text-indigo-600 cursor-pointer ml-1"
                      title="Edit Card"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteExpConfirmIdx(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                      title="Delete Card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMember ? "Edit Team Member" : "Add Team Member"}
        subtitle="Manage contact information, department assignment, and technical skills."
        maxWidth="2xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveForm}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0f172a] hover:bg-slate-800 border border-slate-800 rounded-xl cursor-pointer"
            >
              {editingMember ? "Save Changes" : "Create Member"}
            </button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Full Name" required>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sweet Mia"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </FormField>

            <FormField label="Position / Role" required>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Lead AI Architect"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Department">
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Experience Level">
              <input
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="e.g. 5+ Years"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </FormField>
          </div>

          <FormField label="Overview / Short Bio">
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Guiding enterprise strategy, AI adoption roadmaps, and business expansion."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>

          <FormField label="Full Biography (fullBio)" hint="Detailed professional background displayed in the frontend team member modal when a visitor clicks their card.">
            <textarea
              rows={4}
              value={fullBio}
              onChange={(e) => setFullBio(e.target.value)}
              placeholder="e.g. Sweet mia serves as the Senior Strategic Advisor at Brain Bari. With over a decade of cross-industry expertise..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </FormField>

          <FormField label="Technical Skills (Comma separated)">
            <input
              type="text"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="Python, PyTorch, LangChain, Next.js, WebSockets"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px]"
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@brainbari.com"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </FormField>

            <FormField label="LinkedIn URL">
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-[11px]"
              />
            </FormField>

            <FormField label="GitHub URL">
              <input
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-[11px]"
              />
            </FormField>
          </div>

          <FormField label="Avatar Image URL">
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-[11px]"
            />
          </FormField>
        </div>
      </Modal>

      {/* ADD / EDIT MODAL FOR INDUSTRY EXPERTISE */}
      <Modal
        isOpen={isExpModalOpen}
        onClose={() => setIsExpModalOpen(false)}
        title={editingExpIdx !== null ? "Edit Industry Capability Card" : "Add Industry Capability Card"}
        subtitle="Manage the pastel capability cards rendered under 'Our Industry Expertises' on the frontend Team page."
        maxWidth="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsExpModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveExp}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0f172a] hover:bg-slate-800 border border-slate-800 rounded-xl cursor-pointer"
            >
              {editingExpIdx !== null ? "Save Changes" : "Create Card"}
            </button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          {/* Real-time preview */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Preview</span>
            <div
              style={{ backgroundColor: expBg || "#faf3e0" }}
              className="flex flex-col items-center justify-center text-center w-[145px] h-[95px] shadow-xs border border-gray-100/60 rounded-tl-[28px] rounded-br-[28px] rounded-tr-[4px] rounded-bl-[4px]"
            >
              <div className="mb-2 text-gray-700">
                <svg
                  className="w-7 h-7 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={expPath || "M12 4v16m8-8H4"} />
                </svg>
              </div>
              <span className="text-[11px] font-bold text-gray-700 px-2 leading-tight">
                {expTitle || "Industry Title"}
              </span>
            </div>
          </div>

          <FormField label="Industry Title / Sector Name" required>
            <input
              type="text"
              value={expTitle}
              onChange={(e) => setExpTitle(e.target.value)}
              placeholder="e.g. Finance & Banking, E-commerce, Telecom"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium"
            />
          </FormField>

          <FormField label="Card Background Color (Pastel Hex)">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={expBg}
                  onChange={(e) => setExpBg(e.target.value)}
                  className="w-9 h-9 p-0.5 rounded-lg border border-slate-200 cursor-pointer bg-white"
                />
                <input
                  type="text"
                  value={expBg}
                  onChange={(e) => setExpBg(e.target.value)}
                  placeholder="#faf3e0"
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl font-mono text-xs"
                />
              </div>
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[10px] text-slate-400 font-semibold mr-1">Palettes:</span>
                {[
                  "#faf3e0", "#e3f2fd", "#fffde7", "#ffebe6",
                  "#f5f5f5", "#fcf8e3", "#e8f5e9", "#fff3e0",
                  "#eceff1", "#e0f7fa", "#fbe9e7", "#e0f2f1"
                ].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setExpBg(color)}
                    style={{ backgroundColor: color }}
                    className={`w-6 h-6 rounded-md border transition-transform cursor-pointer ${
                      expBg.toLowerCase() === color.toLowerCase() ? "border-slate-900 scale-110 shadow-xs" : "border-slate-300 hover:scale-105"
                    }`}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </FormField>

          <FormField label="SVG Icon Path (d attribute)" hint="SVG path used with 24x24 viewBox stroke.">
            <textarea
              rows={3}
              value={expPath}
              onChange={(e) => setExpPath(e.target.value)}
              placeholder="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px]"
            />
          </FormField>
        </div>
      </Modal>

      {/* DELETE CONFIRM */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Team Member"
        message="Are you sure you want to remove this member from the team roster?"
        confirmLabel="Delete Member"
        isDestructive={true}
      />

      {/* DELETE CONFIRM FOR INDUSTRY EXPERTISE */}
      <ConfirmDialog
        isOpen={deleteExpConfirmIdx !== null}
        onClose={() => setDeleteExpConfirmIdx(null)}
        onConfirm={handleDeleteExp}
        title="Delete Industry Card"
        message="Are you sure you want to remove this industry capability card from the team page?"
        confirmLabel="Delete Card"
        isDestructive={true}
      />
    </div>
  );
}

export default function TeamPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Team...</div>}>
      <TeamContent />
    </Suspense>
  );
}
