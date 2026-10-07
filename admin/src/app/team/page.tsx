"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Users,
  Plus,
  Save,
  Building2,
  Award
} from "lucide-react";
import { adminApi } from "@/lib/adminApi";
import PageHeader from "@/components/ui/PageHeader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { toast } from "sonner";

import MemberModal from "./components/MemberModal";
import IndustryExpertiseModal from "./components/IndustryExpertiseModal";
import TeamMembersTab from "./components/TeamMembersTab";
import DepartmentsTab from "./components/DepartmentsTab";
import IndustryExpertisesTab from "./components/IndustryExpertisesTab";

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

  const [activeTab, setActiveTab] = useState<TeamTab>(initialTab);
  const [mounted, setMounted] = useState(false);
  const [team, setTeam] = useState<any[]>([]);
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

  // Industry Expertises State
  const [expertises, setExpertises] = useState<any[]>([]);
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [editingExpIdx, setEditingExpIdx] = useState<number | null>(null);
  const [expTitle, setExpTitle] = useState("");
  const [expBg, setExpBg] = useState("#faf3e0");
  const [expPath, setExpPath] = useState("");
  const [deleteExpConfirmIdx, setDeleteExpConfirmIdx] = useState<number | null>(null);

  const loadData = async () => {
    try {
      const freshTeam = await adminApi.getContent("team");
      if (freshTeam && Array.isArray(freshTeam)) {
        setTeam(freshTeam);
      }
      const freshExp = await adminApi.getContent("industryExpertises");
      if (freshExp && Array.isArray(freshExp)) {
        setExpertises(freshExp);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

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

  useEffect(() => {
    const tab = searchParams.get("tab") as TeamTab;
    const action = searchParams.get("action");
    if (action === "add") {
      openAdd();
    } else if (tab && ["members", "departments", "expertises"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleSaveAll = async () => {
    try {
      await Promise.all([
        adminApi.saveContent("team", team),
        adminApi.saveContent("industryExpertises", expertises),
      ]);
      setSaved(true);
      toast.success("Team roster and Industry Expertises saved successfully to database!");
      setTimeout(() => setSaved(false), 2000);
    } catch {
      toast.error("Failed to save team data to database.");
    }
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
      adminApi.saveContent("team", updated);
      toast.success(`Member "${name}" updated in database.`);
    } else {
      const newMember = {
        id: `tm-${Date.now()}`,
        ...payload
      };
      const updated = [newMember, ...team];
      setTeam(updated);
      adminApi.saveContent("team", updated);
      toast.success(`Team member "${name}" added to database.`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteConfirmId) return;
    const updated = team.filter((m) => m.id !== deleteConfirmId);
    setTeam(updated);
    adminApi.saveContent("team", updated);
    toast.success("Team member removed from database.");
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
      toast.success(`Updated "${payload.title}" in database`);
    } else {
      updated = [...expertises, payload];
      toast.success(`Added "${payload.title}" to database`);
    }
    setExpertises(updated);
    adminApi.saveContent("industryExpertises", updated);
    setIsExpModalOpen(false);
  };

  const handleDeleteExp = () => {
    if (deleteExpConfirmIdx === null) return;
    const updated = expertises.filter((_, idx) => idx !== deleteExpConfirmIdx);
    setExpertises(updated);
    adminApi.saveContent("industryExpertises", updated);
    toast.success("Industry capability card removed from database.");
    setDeleteExpConfirmIdx(null);
  };

  const handleMoveExp = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= expertises.length) return;
    const updated = [...expertises];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setExpertises(updated);
    adminApi.saveContent("industryExpertises", updated);
    toast.success("Industry card order updated in database.");
  };

  const filteredTeam = team.filter((m) => {
    if (selectedDept === "All") return true;
    return (m.department || "").toLowerCase() === selectedDept.toLowerCase();
  });

  if (!mounted) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-10 bg-slate-100 rounded-xl w-1/3" />
        <div className="h-48 bg-slate-100 rounded-2xl" />
        <div className="h-64 bg-slate-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Enterprise CMS / Team & Industries"
        title="Team Members & Industry Capabilities"
        description="Manage staff directory and industry capabilities. Managed Frontend Sections: Resources → Team Page (/resources/team) • Industries Page (/industries) → Industry Capabilities Cards."
        actions={
          <div className="flex items-center gap-2">
            {activeTab === "expertises" ? (
              <button
                type="button"
                onClick={openAddExp}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-600 shadow-2xs cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Industry Card</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={openAdd}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-600 shadow-2xs cursor-pointer transition-colors"
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

      {/* TAB 1: TEAM MEMBERS */}
      {activeTab === "members" && (
        <TeamMembersTab
          departments={DEPARTMENTS}
          selectedDept={selectedDept}
          onSelectDept={setSelectedDept}
          filteredTeam={filteredTeam}
          onEdit={openEdit}
          onDelete={(id) => setDeleteConfirmId(id)}
        />
      )}

      {/* TAB 2: DEPARTMENTS */}
      {activeTab === "departments" && (
        <DepartmentsTab
          departments={DEPARTMENTS}
          team={team}
        />
      )}

      {/* TAB 3: INDUSTRY EXPERTISES */}
      {activeTab === "expertises" && (
        <IndustryExpertisesTab
          expertises={expertises}
          onAddExp={openAddExp}
          onEditExp={openEditExp}
          onDeleteExp={(idx) => setDeleteExpConfirmIdx(idx)}
          onMoveExp={handleMoveExp}
        />
      )}

      {/* ADD / EDIT MODAL FOR TEAM MEMBER */}
      <MemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingMember={editingMember}
        name={name}
        setName={setName}
        role={role}
        setRole={setRole}
        department={department}
        setDepartment={setDepartment}
        departments={DEPARTMENTS}
        experience={experience}
        setExperience={setExperience}
        bio={bio}
        setBio={setBio}
        fullBio={fullBio}
        setFullBio={setFullBio}
        skillsText={skillsText}
        setSkillsText={setSkillsText}
        email={email}
        setEmail={setEmail}
        linkedin={linkedin}
        setLinkedin={setLinkedin}
        github={github}
        setGithub={setGithub}
        avatar={avatar}
        setAvatar={setAvatar}
        onSave={handleSaveForm}
      />

      {/* ADD / EDIT MODAL FOR INDUSTRY EXPERTISE */}
      <IndustryExpertiseModal
        isOpen={isExpModalOpen}
        onClose={() => setIsExpModalOpen(false)}
        editingExpIdx={editingExpIdx}
        expTitle={expTitle}
        setExpTitle={setExpTitle}
        expBg={expBg}
        setExpBg={setExpBg}
        expPath={expPath}
        setExpPath={setExpPath}
        onSave={handleSaveExp}
      />

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
