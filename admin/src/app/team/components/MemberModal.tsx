"use client";

import React from "react";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";
import ImageUpload from "@/components/ui/ImageUpload";

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingMember: any | null;
  name: string;
  setName: (v: string) => void;
  role: string;
  setRole: (v: string) => void;
  department: string;
  setDepartment: (v: string) => void;
  departments: string[];
  experience: string;
  setExperience: (v: string) => void;
  bio: string;
  setBio: (v: string) => void;
  fullBio: string;
  setFullBio: (v: string) => void;
  skillsText: string;
  setSkillsText: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  linkedin: string;
  setLinkedin: (v: string) => void;
  github: string;
  setGithub: (v: string) => void;
  avatar: string;
  setAvatar: (v: string) => void;
  onSave: () => void;
}

export default function MemberModal({
  isOpen,
  onClose,
  editingMember,
  name,
  setName,
  role,
  setRole,
  department,
  setDepartment,
  departments,
  experience,
  setExperience,
  bio,
  setBio,
  fullBio,
  setFullBio,
  skillsText,
  setSkillsText,
  email,
  setEmail,
  linkedin,
  setLinkedin,
  github,
  setGithub,
  avatar,
  setAvatar,
  onSave
}: MemberModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingMember ? "Edit Team Member" : "Add Team Member"}
      subtitle="Manage contact information, department assignment, and technical skills."
      maxWidth="2xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-600 shadow-2xs rounded-xl cursor-pointer"
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
              {departments.map((d) => (
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

        <ImageUpload
          label="Avatar Photo"
          category="Team & Avatars"
          value={avatar}
          onChange={setAvatar}
          helpText="Member profile photo."
          compact={true}
        />
      </div>
    </Modal>
  );
}
