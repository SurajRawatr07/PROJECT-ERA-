import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  Landmark,
  Award,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  FolderPlus,
  Layers,
  Users,
  FileCheck2,
  MessageSquare,
  FolderSync,
  GitFork,
  TrendingUp,
  X
} from 'lucide-react';
import { EraAccountType } from '../../types/projectEra';
import { FAQSection } from '../FAQSection';

interface HomeSectionsProps {
  selectedRoleFromNav?: EraAccountType | null;
  isAuthenticated?: boolean;
  onGetStarted: (role?: EraAccountType) => void;
  onExploreProjects: () => void;
}

interface RoleCardData {
  id: EraAccountType;
  name: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  summary: string;
  capabilities: string[];
  scopeNote: string;
}

const FOUR_ROLES: RoleCardData[] = [
  {
    id: 'STUDENT',
    name: 'Student',
    subtitle: 'Build, Publish & Collaborate',
    icon: GraduationCap,
    summary:
      'Create academic projects, coordinate with teammates, record technical progress, and publish work without waiting for mandatory approval.',
    capabilities: [
      'Create and publish academic projects.',
      'Discover projects and explore technologies.',
      'Collaborate with teammates.',
      'Maintain a project portfolio and share progress.'
    ],
    scopeNote:
      'Students can upload and publish projects directly. Faculty review is optional and never blocks project creation or publishing.'
  },
  {
    id: 'FACULTY',
    name: 'Faculty',
    subtitle: 'Guide, Mentor & Review',
    icon: BookOpen,
    summary:
      'Explore student projects across departments, offer academic guidance, and provide structured feedback when review is requested or supported.',
    capabilities: [
      'Discover student projects.',
      'Provide guidance and feedback where supported.',
      'Participate in academic collaboration.'
    ],
    scopeNote:
      'Faculty accounts support academic mentoring and optional project feedback. Selecting Faculty does not automatically grant administrative access.'
  },
  {
    id: 'HOD',
    name: 'HOD',
    subtitle: 'Department Academic Overview',
    icon: Landmark,
    summary:
      'View authorized department-level project records, monitor academic participation across cohorts, and support departmental initiatives.',
    capabilities: [
      'Access authorized department-level project information.',
      'Explore project participation and progress where available.',
      'Support departmental academic initiatives.'
    ],
    scopeNote:
      'HOD accounts provide department-scoped academic visibility where supported and do not automatically receive platform-wide administrative access.'
  },
  {
    id: 'ALUMNI',
    name: 'Alumni',
    subtitle: 'Mentor & Support Continuity',
    icon: Award,
    summary:
      'Stay connected with your college community, discover student work, share industry experience, and help continuing projects evolve.',
    capabilities: [
      'Discover projects and student work.',
      'Share knowledge and mentor where supported.',
      'Contribute to continuing project development.'
    ],
    scopeNote:
      'Alumni accounts focus on mentorship and project continuity within authorized project permissions.'
  }
];

interface LifecycleStep {
  num: string;
  name: string;
  description: string;
  isOptional?: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

const LIFECYCLE_STEPS: LifecycleStep[] = [
  {
    num: '01',
    name: 'Create',
    description: 'Introduce a project and its goals.',
    icon: FolderPlus
  },
  {
    num: '02',
    name: 'Build',
    description: 'Develop the project and its implementation.',
    icon: Layers
  },
  {
    num: '03',
    name: 'Collaborate',
    description: 'Work with teammates and contributors.',
    icon: Users
  },
  {
    num: '04',
    name: 'Prove',
    description: 'Record project details, contributions, and supporting evidence.',
    icon: FileCheck2
  },
  {
    num: '05',
    name: 'Review',
    description: 'Receive feedback when a review is requested or available.',
    isOptional: true,
    icon: MessageSquare
  },
  {
    num: '06',
    name: 'Handover',
    description: 'Document knowledge and prepare the project for others.',
    icon: FolderSync
  },
  {
    num: '07',
    name: 'Continue',
    description: 'Let future contributors build on previous work.',
    icon: GitFork
  },
  {
    num: '08',
    name: 'Evolve',
    description: 'Improve and extend the project over time.',
    icon: TrendingUp
  }
];

export const ProjectEraSections: React.FC<HomeSectionsProps> = ({
  selectedRoleFromNav,
  isAuthenticated = false,
  onGetStarted,
  onExploreProjects
}) => {
  const [activeRole, setActiveRole] = useState<EraAccountType | null>('STUDENT');

  useEffect(() => {
    if (selectedRoleFromNav) {
      setActiveRole(selectedRoleFromNav);
    }
  }, [selectedRoleFromNav]);

  const activeRoleData = FOUR_ROLES.find((r) => r.id === activeRole) || null;

  const handleToggleRole = (roleId: EraAccountType) => {
    setActiveRole((prev) => (prev === roleId ? null : roleId));
  };

  return (
    <>
      {/* =================================================================== */}
      {/* SECTION 4: OPEN ACADEMIC ECOSYSTEM — WHO CAN USE PROJECT ERA?       */}
      {/* =================================================================== */}
      <section
        id="who-can-use"
        className="w-full py-14 sm:py-18 lg:py-22 px-4 sm:px-6 lg:px-8 bg-white border-b border-neutral-200/80"
      >
        <div className="mx-auto max-w-6xl">
          {/* Section Heading & Supporting Copy */}
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <div className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-2.5">
              Open Academic Ecosystem
            </div>
            <h2
              style={{ textWrap: 'balance' }}
              className="font-display text-2xl sm:text-3xl md:text-4xl font-normal text-neutral-900 tracking-tight leading-[1.15]"
            >
              Who Can Use{' '}
              <span className="relative inline-block">
                <em className="text-[#b45309] not-italic font-normal">Project Era?</em>
                <span className="absolute bottom-1 left-0 right-0 h-[2.5px] rounded bg-amber-200/90" />
              </span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed font-body">
              One platform for students, faculty, alumni, and academic communities to build, contribute, mentor, and support projects.
            </p>
            <p className="mt-2 text-xs font-medium text-neutral-500">
              Select a role below to explore its capabilities and scope.
            </p>
          </div>

          {/* Four Interactive Role Cards */}
          <div
            role="tablist"
            aria-label="Who can use Project Era roles"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4"
          >
            {FOUR_ROLES.map((role) => {
              const Icon = role.icon;
              const isSelected = activeRole === role.id;

              return (
                <button
                  key={role.id}
                  id={`era-role-tab-${role.id.toLowerCase()}`}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-expanded={isSelected}
                  aria-controls={`era-role-panel-${role.id.toLowerCase()}`}
                  onClick={() => handleToggleRole(role.id)}
                  className={`group flex flex-col justify-between p-4 sm:p-5 rounded-2xl text-left transition-colors duration-150 cursor-pointer border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 ${
                    isSelected
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-neutral-900 border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50/70'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3.5">
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
                      className={`h-4 w-4 shrink-0 transition-transform duration-150 ${
                        isSelected
                          ? 'rotate-180 text-white'
                          : 'text-neutral-400 group-hover:text-neutral-900'
                      }`}
                    />
                  </div>

                  <div>
                    <div
                      className={`font-display text-base sm:text-lg font-semibold leading-snug ${
                        isSelected ? 'text-white' : 'text-neutral-900'
                      }`}
                    >
                      {role.name}
                    </div>
                    <div
                      className={`text-xs mt-1 ${
                        isSelected ? 'text-neutral-300' : 'text-neutral-500'
                      }`}
                    >
                      {role.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Expandable Role Capabilities Panel */}
          {activeRoleData && (
            <div
              id={`era-role-panel-${activeRoleData.id.toLowerCase()}`}
              role="tabpanel"
              aria-labelledby={`era-role-tab-${activeRoleData.id.toLowerCase()}`}
              className="mt-5 p-5 sm:p-7 rounded-2xl bg-[#faf9f6] border border-neutral-300/90 transition-opacity duration-150"
            >
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0">
                    {React.createElement(activeRoleData.icon, { className: 'w-5 h-5' })}
                  </div>
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl font-normal text-neutral-900">
                      {activeRoleData.name}
                    </h3>
                    <div className="text-xs text-neutral-500">{activeRoleData.subtitle}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveRole(null)}
                  aria-label="Close role details"
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Left Column: Summary, Scope Note & Action */}
                <div className="md:col-span-6 space-y-4">
                  <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                    {activeRoleData.summary}
                  </p>

                  <div className="p-3.5 rounded-xl bg-white border border-neutral-200 text-xs text-neutral-600 leading-relaxed">
                    <strong className="text-neutral-900">Permissions & Scope: </strong>
                    {activeRoleData.scopeNote}
                  </div>

                  <div className="pt-1 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onGetStarted(activeRoleData.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      <span>
                        {isAuthenticated
                          ? `Open ${activeRoleData.name} Workspace`
                          : `Get Started as ${activeRoleData.name}`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={onExploreProjects}
                      className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
                    >
                      Explore Projects
                    </button>
                  </div>
                </div>

                {/* Right Column: Exact Role Capabilities List */}
                <div className="md:col-span-6 md:border-l md:border-neutral-200 md:pl-7">
                  <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">
                    {activeRoleData.name} Capabilities
                  </div>
                  <ul className="space-y-2.5">
                    {activeRoleData.capabilities.map((cap) => (
                      <li
                        key={cap}
                        className="flex items-start gap-2.5 text-sm text-neutral-800"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <span className="leading-snug font-medium">{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 5: COMPLETE PROJECT LIFECYCLE                               */}
      {/* =================================================================== */}
      <section
        id="how-it-works"
        className="w-full py-14 sm:py-18 lg:py-22 px-4 sm:px-6 lg:px-8 bg-[#faf9f6] border-b border-neutral-200/80"
      >
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <div className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-2.5">
              Complete Project Lifecycle
            </div>
            <h2
              style={{ textWrap: 'balance' }}
              className="font-display text-2xl sm:text-3xl md:text-4xl font-normal text-neutral-900 tracking-tight leading-[1.15]"
            >
              From Genesis to Generational{' '}
              <span className="relative inline-block">
                <em className="text-[#b45309] not-italic font-normal">Evolution</em>
                <span className="absolute bottom-1 left-0 right-0 h-[2.5px] rounded bg-amber-200/90" />
              </span>
            </h2>
            <p className="mt-3 text-sm sm:text-base font-medium text-neutral-800">
              GitHub stores the code. Project Era brings the project journey together.
            </p>
            <p className="mt-2 text-xs sm:text-sm font-mono text-neutral-600">
              Create → Build → Collaborate → Prove → Review → Handover → Continue → Evolve
            </p>
          </div>

          {/* Connected Horizontal Sequence on Desktop / Responsive Timeline on Mobile */}
          <div
            role="list"
            aria-label="Project Era eight-stage project lifecycle"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4"
          >
            {LIFECYCLE_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  role="listitem"
                  className="relative p-5 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-400 transition-colors duration-150 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold tabular-nums text-neutral-400">
                          {step.num}
                        </span>
                        {step.isOptional && (
                          <span className="text-[11px] font-medium text-[#b45309]">
                            · Optional
                          </span>
                        )}
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <h3 className="font-display text-base sm:text-lg font-semibold text-neutral-900">
                      {step.name}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                    <span>Stage {step.num} of 08</span>
                    {index < LIFECYCLE_STEPS.length - 1 ? (
                      <span aria-hidden="true">→ {LIFECYCLE_STEPS[index + 1].name}</span>
                    ) : (
                      <span>Generational Continuity</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* SECTION 6: ANSWERS & CLARITY — FREQUENTLY ASKED QUESTIONS           */}
      {/* =================================================================== */}
      <FAQSection />
    </>
  );
};

export default ProjectEraSections;
