import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Landmark,
  Award,
  ArrowRight
} from 'lucide-react';
import { EraAccountType, EraProjectStatus } from '../../types/projectEra';
import { FAQSection } from '../FAQSection';

interface HomeSectionsProps {
  onGetStarted: (role?: EraAccountType) => void;
  onExploreStage?: (stage: EraProjectStatus) => void;
}

const FIVE_WORKFLOW_STEPS = [
  { num: '01', label: 'Create Project' },
  { num: '02', label: 'Organize Team' },
  { num: '03', label: 'Build & Document' },
  { num: '04', label: 'Get Feedback' },
  { num: '05', label: 'Complete Project' }
];

const FOUR_ROLES: Array<{
  role: EraAccountType;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    role: 'STUDENT',
    title: 'Student — Build & Deliver',
    description: 'Manage projects, tasks, teammates, and deadlines.',
    icon: GraduationCap
  },
  {
    role: 'FACULTY',
    title: 'Faculty — Guide & Review',
    description: 'Review assigned projects and provide actionable feedback.',
    icon: BookOpen
  },
  {
    role: 'HOD',
    title: 'HOD — Monitor & Oversee',
    description: 'Track department projects and pending academic reviews.',
    icon: Landmark
  },
  {
    role: 'ALUMNI',
    title: 'Alumni — Mentor & Contribute',
    description: 'Share experience and support student projects.',
    icon: Award
  }
];

const LIFECYCLE_STAGES: Record<
  EraProjectStatus,
  { summary: string; sample: string; deliverable: string }
> = {
  Idea: {
    summary: 'Define the problem statement, domain, and faculty supervisor.',
    sample: 'Campus Shuttle Live ETA & Route Optimizer',
    deliverable: 'Initial Topic Proposal'
  },
  Planning: {
    summary: 'Structure team roles, system architecture, and semester milestones.',
    sample: 'Braille & Audio Textbook Companion',
    deliverable: 'Project Synopsis & Schedule'
  },
  Development: {
    summary: 'Execute assigned tasks, log progress, and attach technical documentation.',
    sample: 'Smart Campus Energy & Occupancy Monitor',
    deliverable: 'Working Prototype & Test Logs'
  },
  Review: {
    summary: 'Submit milestone reports for faculty evaluation and revision feedback.',
    sample: 'Automated Lab Attendance & Timetable Resolver',
    deliverable: 'Faculty Rubric Evaluation'
  },
  Completed: {
    summary: 'Finalize approved reports and complete the academic submission.',
    sample: 'Solar Micro-Inverter Telemetry Logger',
    deliverable: 'Approved Final Capstone Report'
  }
};

export const ProjectEraSections: React.FC<HomeSectionsProps> = ({
  onGetStarted,
  onExploreStage
}) => {
  const [selectedStage, setSelectedStage] = useState<EraProjectStatus>('Development');
  const stageDetail = LIFECYCLE_STAGES[selectedStage];

  return (
    <>
      {/* 1. HOW IT WORKS (5-Step Horizontal / Responsive Workflow) */}
      <section
        id="how-it-works"
        className="w-full py-14 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-neutral-200/80"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-xl mb-10">
            <h2
              style={{ textWrap: 'balance' }}
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-normal text-neutral-900 tracking-tight"
            >
              From Idea to Completion.
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-neutral-600">
              A clear five-step progression from project creation to final submission.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
            {FIVE_WORKFLOW_STEPS.map((step, idx) => (
              <React.Fragment key={step.num}>
                <div className="flex-1 p-4 sm:p-5 rounded-2xl border border-neutral-200 bg-white flex items-center gap-3.5">
                  <span className="text-xs font-mono font-bold text-neutral-400 tabular-nums shrink-0">
                    {step.num}
                  </span>
                  <span className="font-display text-sm sm:text-base font-semibold text-neutral-900 whitespace-nowrap">
                    {step.label}
                  </span>
                </div>

                {idx < FIVE_WORKFLOW_STEPS.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="flex items-center justify-center text-neutral-300 font-mono text-sm select-none py-0.5 lg:py-0"
                  >
                    <span className="hidden lg:inline">→</span>
                    <span className="lg:hidden">↓</span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* 2. FOUR ACCOUNT TYPES — ROLE BENEFITS */}
      <section
        id="roles"
        className="w-full py-14 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-neutral-200/80"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-xl mb-10">
            <h2
              style={{ textWrap: 'balance' }}
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-normal text-neutral-900 tracking-tight"
            >
              Built for Every Role in Your Department.
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-neutral-600">
              Dedicated workspaces for Students, Faculty, HODs, and Alumni.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {FOUR_ROLES.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.role}
                  className="p-5 sm:p-6 rounded-2xl bg-white border border-neutral-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900 mb-4">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-display text-base font-semibold text-neutral-900">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-neutral-100">
                    <button
                      type="button"
                      onClick={() => onGetStarted(item.role)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 hover:text-[#b45309] transition-colors cursor-pointer"
                    >
                      <span>Get Started</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. PROJECT WORKFLOW / LIFECYCLE */}
      <section
        id="lifecycle"
        className="w-full py-14 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-neutral-200/80"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-xl mb-8">
            <h2
              style={{ textWrap: 'balance' }}
              className="font-display text-2xl sm:text-3xl font-normal text-neutral-900 tracking-tight"
            >
              Project Lifecycle Stages.
            </h2>
            <p className="mt-2 text-sm sm:text-base text-neutral-600">
              Select a stage to preview how academic progress is tracked across the semester.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-neutral-100 border border-neutral-200">
            {(['Idea', 'Planning', 'Development', 'Review', 'Completed'] as EraProjectStatus[]).map(
              (stage) => {
                const isSelected = selectedStage === stage;
                return (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => setSelectedStage(stage)}
                    className={`flex-1 min-w-[110px] py-2 px-3.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-700 hover:bg-white/80'
                    }`}
                  >
                    {stage}
                  </button>
                );
              }
            )}
          </div>

          <div className="mt-4 p-5 sm:p-6 rounded-2xl bg-white border border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs text-neutral-500">
                <span>Stage: {selectedStage}</span>
                <span aria-hidden="true"> · </span>
                <span>Key Deliverable: {stageDetail.deliverable}</span>
              </div>
              <div className="font-display text-base sm:text-lg font-semibold text-neutral-900">
                {stageDetail.summary}
              </div>
              <div className="text-xs text-neutral-500">
                Demo Project Example: {stageDetail.sample}
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                onExploreStage ? onExploreStage(selectedStage) : onGetStarted('STUDENT')
              }
              className="self-start md:self-center px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Open in Demo Workspace
            </button>
          </div>
        </div>
      </section>

      {/* 4. FAQ SECTION */}
      <FAQSection />
    </>
  );
};

export default ProjectEraSections;
