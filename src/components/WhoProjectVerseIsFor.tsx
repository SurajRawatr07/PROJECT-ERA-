import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  Code2,
  FlaskConical,
  Award,
  Briefcase,
  BookOpen,
  Landmark,
  Building2,
  CheckCircle2,
  Lock,
  ArrowRight,
  ChevronDown,
  X
} from 'lucide-react';
import { PearlButton } from './ui/pearl-button';

export type RoleId =
  | 'student'
  | 'developer'
  | 'researcher'
  | 'alumni'
  | 'industry'
  | 'faculty'
  | 'hod'
  | 'institution';

interface RoleData {
  id: RoleId;
  name: string;
  badge: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  description: string;
  capabilities: string[];
  requiresAuthNote?: string;
}

const ROLES: RoleData[] = [
  {
    id: 'student',
    name: 'Student',
    badge: 'Academic & Personal Projects',
    icon: GraduationCap,
    description:
      'Build academic and personal projects, document your work, connect with collaborators, and build a strong project portfolio.',
    capabilities: [
      'Submit projects',
      'Academic verification',
      'Find collaborators',
      'Request mentorship',
      'Build project history'
    ]
  },
  {
    id: 'developer',
    name: 'Developer',
    badge: 'Software & Open Source',
    icon: Code2,
    description:
      'Showcase software projects, open-source work, technical contributions, and collaborate with other builders.',
    capabilities: [
      'Submit projects',
      'Find technical collaborators',
      'Contribute to projects',
      'Showcase GitHub / portfolio evidence',
      'Offer or request mentorship'
    ]
  },
  {
    id: 'researcher',
    name: 'Researcher',
    badge: 'Research & Publications',
    icon: FlaskConical,
    description:
      'Share research-driven projects, technical work, documentation, publications, and collaborate with people in related domains.',
    capabilities: [
      'Submit research projects',
      'Add publications and documentation',
      'Find collaborators',
      'Connect with domain experts',
      'Build research/project credibility'
    ]
  },
  {
    id: 'alumni',
    name: 'Alumni',
    badge: 'Continuity & Mentorship',
    icon: Award,
    description:
      'Continue building, contribute to projects, mentor others, and maintain a long-term record of your work beyond college.',
    capabilities: [
      'Submit projects',
      'Contribute to projects',
      'Mentor students',
      'Collaborate',
      'Maintain project history'
    ]
  },
  {
    id: 'industry',
    name: 'Industry Professional',
    badge: 'Expertise & Real-world Work',
    icon: Briefcase,
    description:
      'Share professional expertise, contribute to projects, mentor builders, and collaborate with developers and researchers.',
    capabilities: [
      'Collaborate',
      'Offer mentorship',
      'Review relevant projects when authorized',
      'Share expertise',
      'Build professional contribution history'
    ]
  },
  {
    id: 'faculty',
    name: 'Faculty',
    badge: 'Academic Guidance & Review',
    icon: BookOpen,
    description:
      'Support academic projects, mentor students, and participate in authorized academic review and verification.',
    capabilities: [
      'Mentor students',
      'Review academic projects',
      'Academic verification',
      'Faculty contribution record',
      'Collaborate with institutions'
    ],
    requiresAuthNote:
      'Selecting Faculty during registration must NOT automatically grant reviewer/admin permissions.'
  },
  {
    id: 'hod',
    name: 'HOD',
    badge: 'Department Verification & Review',
    icon: Landmark,
    description:
      'Support department-level academic verification, project review, mentoring, and institutional collaboration.',
    capabilities: [
      'Academic verification',
      'Department-level review',
      'Mentor students',
      'Institutional collaboration'
    ],
    requiresAuthNote: 'HOD privileges require proper authorization.'
  },
  {
    id: 'institution',
    name: 'Institution',
    badge: 'Organizations & Universities',
    icon: Building2,
    description:
      'Create an institutional presence, support project verification, connect with contributors, and collaborate around projects.',
    capabilities: [
      'Institutional profile',
      'Authorized verification',
      'Project collaboration',
      'Organization/project representation',
      'Connect with students, developers and professionals'
    ]
  }
];

interface WhoProjectVerseIsForProps {
  onOpenRegister?: () => void;
}

export const WhoProjectVerseIsFor: React.FC<WhoProjectVerseIsForProps> = ({
  onOpenRegister,
}) => {
  // Initially null so users see compact role cards. Clicking a role toggles its expansion.
  const [activeRoleId, setActiveRoleId] = useState<RoleId | null>('student');

  const activeRole = ROLES.find((r) => r.id === activeRoleId) || null;

  const handleToggleRole = (id: RoleId) => {
    setActiveRoleId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="who-can-use"
      className="relative w-full py-14 sm:py-18 lg:py-22 px-4 sm:px-6 lg:px-8 border-t border-neutral-200/80 bg-white"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-neutral-100 px-3.5 py-1 text-xs font-semibold tracking-wide text-neutral-700 uppercase mb-3.5 shadow-2xs">
            Open Academic Ecosystem
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-light text-neutral-900 tracking-tight leading-[1.15]">
            Who Can Use{' '}
            <span className="relative inline-block">
              <em className="text-[#e8860a] not-italic font-normal">ProjectVerse?</em>
              <span className="absolute bottom-1 left-0 right-0 h-[2.5px] rounded bg-[#fddfa0]"></span>
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed font-body">
            One platform for people who build, research, contribute, mentor and support projects.
          </p>
          <p className="mt-2 text-[11px] sm:text-xs font-medium text-neutral-400 uppercase tracking-wider">
            Click any role below to view capabilities and scope
          </p>
        </div>

        {/* 8 BatchBro-style Role Selector Cards */}
        <div
          role="tablist"
          aria-label="Who can use ProjectVerse roles"
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
        >
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isSelected = activeRoleId === role.id;

            return (
              <button
                key={role.id}
                id={`role-btn-${role.id}`}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-expanded={isSelected}
                aria-controls={`role-panel-${role.id}`}
                onClick={() => handleToggleRole(role.id)}
                className={`group relative flex flex-col justify-between p-3.5 sm:p-4.5 rounded-xl sm:rounded-2xl text-left transition-all duration-200 cursor-pointer border ${
                  isSelected
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-md -translate-y-0.5'
                    : 'bg-white text-neutral-900 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/70 hover:-translate-y-0.5 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-white/15 text-white'
                        : 'bg-neutral-100 text-neutral-900 group-hover:bg-neutral-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                      isSelected
                        ? 'rotate-180 text-white'
                        : 'text-neutral-400 group-hover:text-neutral-900'
                    }`}
                  />
                </div>

                <div>
                  <div
                    className={`text-sm sm:text-base font-semibold leading-tight ${
                      isSelected ? 'text-white' : 'text-neutral-900'
                    }`}
                  >
                    {role.name}
                  </div>
                  <div
                    className={`text-xs mt-1 truncate ${
                      isSelected ? 'text-neutral-300' : 'text-neutral-500'
                    }`}
                  >
                    {role.badge}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Expanded Role Details Panel in BatchBro Card Styling */}
        <AnimatePresence mode="wait">
          {activeRole && (
            <motion.div
              key={activeRole.id}
              id={`role-panel-${activeRole.id}`}
              role="tabpanel"
              aria-labelledby={`role-btn-${activeRole.id}`}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="mt-6 overflow-hidden"
            >
              <div className="p-5 sm:p-7 md:p-8 rounded-2xl bg-[#faf9f6] border border-neutral-300/90 shadow-xs">
                {/* Header bar */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-200">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-neutral-900 text-white flex items-center justify-center shadow-xs shrink-0">
                      {React.createElement(activeRole.icon, { className: 'w-5 h-5' })}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-xl sm:text-2xl font-normal text-neutral-900 leading-tight">
                          {activeRole.name}
                        </h3>
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-white border border-neutral-200 text-xs font-semibold text-neutral-700">
                          {activeRole.badge}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveRoleId(null)}
                    aria-label="Close role details"
                    className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200/60 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Body Content */}
                <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-7 items-start">
                  {/* Left Column: Description & Action */}
                  <div className="md:col-span-6 space-y-4">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                        Overview
                      </div>
                      <p className="text-[15px] sm:text-base text-neutral-700 leading-relaxed font-body">
                        {activeRole.description}
                      </p>
                    </div>

                    {/* Authorization notice if applicable */}
                    {activeRole.requiresAuthNote && (
                      <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start gap-2.5 text-amber-900">
                        <Lock className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                        <div className="text-xs leading-relaxed font-medium">
                          <strong className="font-semibold">Important:</strong> {activeRole.requiresAuthNote}
                        </div>
                      </div>
                    )}

                    {onOpenRegister && (
                      <div className="pt-1">
                        <button
                          onClick={onOpenRegister}
                          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-md cursor-pointer"
                        >
                          <span>Create Account as {activeRole.name}</span>
                          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Capabilities */}
                  <div className="md:col-span-6 md:border-l md:border-neutral-200 md:pl-8">
                    <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
                      Capabilities & Role Scope:
                    </div>
                    <ul className="space-y-3">
                      {activeRole.capabilities.map((capability, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-sm text-neutral-800"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug font-medium">{capability}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default WhoProjectVerseIsFor;
