import React, { useState } from 'react';
import {
  FileQuestion,
  Users,
  Clock,
  FileWarning,
  MessageSquareWarning,
  Compass,
  CheckSquare,
  FileText,
  MessageSquareCode,
  ArrowRight,
  GraduationCap,
  BookOpen,
  Landmark,
  Award,
  CheckCircle2,
  FolderPlus,
  UserPlus,
  Calendar,
  Code,
  ClipboardCheck
} from 'lucide-react';
import { EraAccountType, EraProjectStatus } from '../../types/projectEra';

interface HomeSectionsProps {
  onGetStarted: (role?: EraAccountType) => void;
  onExploreStage?: (stage: EraProjectStatus) => void;
}

const PROBLEMS = [
  {
    title: 'Scattered Documents',
    description:
      'Project proposals, architecture diagrams, and reports end up split across chat threads, personal drives, and email attachments.',
    icon: FileQuestion
  },
  {
    title: 'Unclear Responsibilities',
    description:
      'Without explicit task ownership, team members duplicate work or leave critical deliverables unassigned.',
    icon: Users
  },
  {
    title: 'Missed Deadlines',
    description:
      'Semester milestones slip when due dates and dependencies are not tracked in a shared academic calendar.',
    icon: Clock
  },
  {
    title: 'Inconsistent Documentation',
    description:
      'Last-minute report compilation leads to missing specifications, incomplete test logs, and formatting gaps.',
    icon: FileWarning
  },
  {
    title: 'Delayed Feedback',
    description:
      'Waiting until end-of-semester evaluations to receive faculty input leaves little time to address architectural issues.',
    icon: MessageSquareWarning
  }
];

const CAPABILITIES = [
  {
    num: '01',
    title: 'Project Planning',
    description:
      'Define your problem statement, academic session, domain, technologies, and supervisor details in a structured project workspace.',
    outcome: 'Clear project scope from week one',
    icon: Compass,
    colSpan: 'lg:col-span-7'
  },
  {
    num: '02',
    title: 'Team Collaboration',
    description:
      'Coordinate student teammates, assign clear project roles, and manage collaboration requests transparently.',
    outcome: 'Defined ownership for every contributor',
    icon: Users,
    colSpan: 'lg:col-span-5'
  },
  {
    num: '03',
    title: 'Tasks and Milestones',
    description:
      'Break semester goals into actionable tasks with due dates, assignees, and automatic overdue tracking.',
    outcome: 'Real-time milestone progress visibility',
    icon: CheckSquare,
    colSpan: 'lg:col-span-4'
  },
  {
    num: '04',
    title: 'Documentation and Submissions',
    description:
      'Organize proposals, architecture specifications, milestone reports, and final submissions in one central ledger.',
    outcome: 'Submission-ready academic records',
    icon: FileText,
    colSpan: 'lg:col-span-4'
  },
  {
    num: '05',
    title: 'Faculty Feedback and Reviews',
    description:
      'Receive structured faculty evaluations, track requested revisions, and maintain a complete review history.',
    outcome: 'Continuous academic guidance',
    icon: MessageSquareCode,
    colSpan: 'lg:col-span-4'
  }
];

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Create Project',
    description: 'Set up your project title, domain, technologies, academic session, and supervisor.',
    icon: FolderPlus
  },
  {
    step: '02',
    title: 'Build Your Team',
    description: 'Add student collaborators and assign clear technical and documentation roles.',
    icon: UserPlus
  },
  {
    step: '03',
    title: 'Plan Milestones',
    description: 'Structure semester phases, assign tasks, and set target completion dates.',
    icon: Calendar
  },
  {
    step: '04',
    title: 'Develop & Document',
    description: 'Update task statuses and attach proposals, diagrams, and milestone reports.',
    icon: Code
  },
  {
    step: '05',
    title: 'Receive Feedback',
    description: 'Submit work for faculty review and address revision notes early.',
    icon: ClipboardCheck
  },
  {
    step: '06',
    title: 'Complete Your Project',
    description: 'Finalize deliverables and complete your academic submission with full records.',
    icon: CheckCircle2
  }
];

const ROLE_CARDS: Array<{
  role: EraAccountType;
  heading: string;
  subtitle: string;
  description: string;
  points: string[];
  note?: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    role: 'STUDENT',
    heading: 'Students — Build and Deliver',
    subtitle: 'Undergraduate & Postgraduate Teams',
    description:
      'Organize projects, coordinate teammates, manage deadlines, maintain documentation, and track feedback.',
    points: [
      'Create and update academic projects',
      'Assign tasks and monitor milestone deadlines',
      'Prepare documentation and view faculty feedback'
    ],
    icon: GraduationCap
  },
  {
    role: 'FACULTY',
    heading: 'Faculty — Guide and Review',
    subtitle: 'Supervisors & Capstone Coordinators',
    description:
      'View assigned projects, provide feedback, monitor progress, and review student submissions.',
    points: [
      'Track assigned student project teams',
      'Evaluate submissions and post structured feedback',
      'Update review statuses as teams address revisions'
    ],
    icon: BookOpen
  },
  {
    role: 'HOD',
    heading: 'HODs — Monitor and Oversee',
    subtitle: 'Department Leadership',
    description:
      'View department-level projects, monitor progress, identify pending reviews, and explore department summaries.',
    points: [
      'Filter projects by department and lifecycle status',
      'Identify delayed milestones and pending faculty reviews',
      'Monitor overall semester completion progress'
    ],
    icon: Landmark
  },
  {
    role: 'ALUMNI',
    heading: 'Alumni — Mentor and Contribute',
    subtitle: 'Graduated Mentors & Industry Advisors',
    description:
      'Share experience, support student teams, offer guidance, and contribute to eligible academic projects.',
    points: [
      'Showcase industry skills and mentoring availability',
      'Respond to student mentoring and technical guidance requests',
      'Support teams with architecture and career insights'
    ],
    note: 'Alumni accounts provide mentorship and collaboration support and do not automatically receive faculty or HOD evaluation privileges.',
    icon: Award
  }
];

const LIFECYCLE_DETAILS: Record<
  EraProjectStatus,
  {
    stageNumber: string;
    summary: string;
    keyDeliverables: string[];
    activeRoleFocus: string;
    sampleProjectTitle: string;
    sampleTask: string;
  }
> = {
  Idea: {
    stageNumber: 'Stage 01',
    summary:
      'Teams formulate their core problem statement, propose a technical direction, and identify a faculty supervisor.',
    keyDeliverables: ['Problem Statement Draft', 'Initial Literature Survey', 'Team Roster'],
    activeRoleFocus: 'Students draft concept; Faculty reviews topic feasibility.',
    sampleProjectTitle: 'Campus Shuttle Live ETA & Route Optimizer',
    sampleTask: 'Draft initial project synopsis and route survey'
  },
  Planning: {
    stageNumber: 'Stage 02',
    summary:
      'Requirements, system architecture, milestone schedule, and individual team responsibilities are finalized.',
    keyDeliverables: ['Project Synopsis PDF', 'System Architecture Diagram', 'Milestone Timeline'],
    activeRoleFocus: 'Students assign tasks; Faculty approves synopsis.',
    sampleProjectTitle: 'Braille & Audio Textbook Companion for Visually Impaired Students',
    sampleTask: 'Define keyboard-only navigation shortcuts for chapter skipping'
  },
  Development: {
    stageNumber: 'Stage 03',
    summary:
      'Active implementation of hardware/software modules alongside continuous task tracking and milestone updates.',
    keyDeliverables: ['Working Prototype Modules', 'Mid-Semester Progress Report', 'Test Logs'],
    activeRoleFocus: 'Students build & log progress; Alumni offer technical mentorship.',
    sampleProjectTitle: 'Smart Campus Energy & Classroom Occupancy Monitor',
    sampleTask: 'Build responsive classroom occupancy view in React'
  },
  Review: {
    stageNumber: 'Stage 04',
    summary:
      'Faculty supervisors evaluate submitted documentation and prototypes, providing structured feedback or requesting revisions.',
    keyDeliverables: ['Pre-Final Submission Report', 'Faculty Evaluation Rubric', 'Revision Action Items'],
    activeRoleFocus: 'Faculty & HOD review submissions and record feedback.',
    sampleProjectTitle: 'Automated Lab Attendance & Timetable Conflict Resolver',
    sampleTask: 'Address faculty review comments on room capacity constraints'
  },
  Completed: {
    stageNumber: 'Stage 05',
    summary:
      'All milestones, final reports, and faculty sign-offs are complete and archived within the academic workspace.',
    keyDeliverables: ['Approved Final Thesis Report', 'Completed Milestone Checklist', 'Final Review Record'],
    activeRoleFocus: 'Completed academic record available across department overview.',
    sampleProjectTitle: 'Solar Micro-Inverter Telemetry & Fault Logger',
    sampleTask: 'Final thesis report and department viva presentation'
  }
};

export const ProjectEraSections: React.FC<HomeSectionsProps> = ({
  onGetStarted,
  onExploreStage
}) => {
  const [selectedLifecycle, setSelectedLifecycle] = useState<EraProjectStatus>('Development');
  const activeStage = LIFECYCLE_DETAILS[selectedLifecycle];

  return (
    <>
      {/* 1. PROBLEM SECTION */}
      <section className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-neutral-200/80">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-2">
              Academic Workflow Challenges
            </div>
            <h2
              style={{ textWrap: 'balance' }}
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-normal text-neutral-900 tracking-tight"
            >
              Great Projects Need More Than Ideas.
            </h2>
            <p className="mt-3 text-base text-neutral-600 leading-relaxed">
              Even promising student projects lose momentum when teams rely on disconnected tools to manage a semester-long academic effort.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
            {PROBLEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-5 rounded-2xl bg-[#faf9f6] border border-neutral-200/90 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-900 mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-display text-base font-semibold text-neutral-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. SOLUTION SECTION (Features) */}
      <section
        id="features"
        className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#faf9f6] border-b border-neutral-200/80"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-2">
              Unified Academic Workspace
            </div>
            <h2
              style={{ textWrap: 'balance' }}
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-normal text-neutral-900 tracking-tight"
            >
              Everything Your Project Needs, In One Place.
            </h2>
            <p className="mt-3 text-base text-neutral-600 leading-relaxed">
              Five core capabilities designed specifically for college project teams, faculty supervisors, department heads, and alumni mentors.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-5">
            {CAPABILITIES.map((cap) => {
              const Icon = cap.icon;
              return (
                <div
                  key={cap.num}
                  className={`${cap.colSpan} p-6 sm:p-7 rounded-2xl bg-white border border-neutral-200 flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-5">
                      <span className="text-xs font-mono font-semibold text-neutral-500">
                        {cap.num}. Capability
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-[#faf9f6] border border-neutral-200 flex items-center justify-center text-neutral-900">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-neutral-900">
                      {cap.title}
                    </h3>
                    <p className="mt-2.5 text-sm sm:text-[15px] text-neutral-600 leading-relaxed">
                      {cap.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                    <span>Outcome: {cap.outcome}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section
        id="how-it-works"
        className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-neutral-200/80"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-2">
              Step-by-Step Workflow
            </div>
            <h2
              style={{ textWrap: 'balance' }}
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-normal text-neutral-900 tracking-tight"
            >
              How Project Era Works
            </h2>
            <p className="mt-3 text-base text-neutral-600 leading-relaxed">
              A structured six-step progression from initial project registration to final faculty sign-off.
            </p>
          </div>

          {/* Responsive Flow Bar */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {WORKFLOW_STEPS.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="relative p-5 rounded-2xl bg-[#faf9f6] border border-neutral-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold text-neutral-500">
                        Step {item.step}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-neutral-900">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="font-display text-base font-semibold text-neutral-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {index < WORKFLOW_STEPS.length - 1 && (
                    <div className="hidden lg:flex items-center justify-end mt-4 pt-2 border-t border-neutral-200/60 text-[11px] font-mono text-neutral-400">
                      <span>Next →</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. ROLE BENEFITS */}
      <section className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#faf9f6] border-b border-neutral-200/80">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-2">
              Tailored for Every Academic Role
            </div>
            <h2
              style={{ textWrap: 'balance' }}
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-normal text-neutral-900 tracking-tight"
            >
              Four Dedicated Experiences Across the College Ecosystem
            </h2>
            <p className="mt-3 text-base text-neutral-600 leading-relaxed">
              Project Era supports four distinct account types with role-appropriate tools and dashboards.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {ROLE_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.role}
                  className="p-6 sm:p-7 rounded-2xl bg-white border border-neutral-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs font-medium text-neutral-500">
                          {card.subtitle}
                        </div>
                        <h3 className="mt-1 font-display text-xl font-semibold text-neutral-900">
                          {card.heading}
                        </h3>
                      </div>
                      <div className="w-11 h-11 rounded-xl bg-[#faf9f6] border border-neutral-200 flex items-center justify-center text-neutral-900 shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                      {card.description}
                    </p>

                    <ul className="mt-4 space-y-2 border-t border-neutral-100 pt-4">
                      {card.points.map((pt) => (
                        <li
                          key={pt}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>

                    {card.note && (
                      <p className="mt-4 text-xs text-neutral-500 bg-[#faf9f6] p-3 rounded-xl border border-neutral-200">
                        Note: {card.note}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => onGetStarted(card.role)}
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-900 hover:text-[#b45309] transition-colors cursor-pointer"
                    >
                      <span>Register as {card.role === 'HOD' ? 'HOD' : card.role.charAt(0) + card.role.slice(1).toLowerCase()}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. PROJECT LIFECYCLE INTERACTIVE EXPLORER */}
      <section className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-neutral-200/80">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <div className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-2">
                Interactive Lifecycle Preview · Demonstration Content
              </div>
              <h2
                style={{ textWrap: 'balance' }}
                className="font-display text-2xl sm:text-3xl lg:text-4xl font-normal text-neutral-900 tracking-tight"
              >
                Track Every Stage from Idea to Completed Submission
              </h2>
              <p className="mt-2 text-sm sm:text-base text-neutral-600">
                Select any project status below to inspect how Project Era organizes deliverables and reviews at that stage.
              </p>
            </div>
          </div>

          {/* Interactive Status Selector Bar: Idea -> Planning -> Development -> Review -> Completed */}
          <div className="mt-8 flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#faf9f6] border border-neutral-200">
            {(['Idea', 'Planning', 'Development', 'Review', 'Completed'] as EraProjectStatus[]).map(
              (stage, idx, arr) => {
                const isSelected = selectedLifecycle === stage;
                return (
                  <React.Fragment key={stage}>
                    <button
                      type="button"
                      onClick={() => setSelectedLifecycle(stage)}
                      className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? 'bg-neutral-900 text-white shadow-xs'
                          : 'text-neutral-700 hover:bg-neutral-200/60'
                      }`}
                    >
                      {stage}
                    </button>
                    {idx < arr.length - 1 && (
                      <span className="hidden lg:inline text-neutral-400 font-mono text-xs select-none">
                        →
                      </span>
                    )}
                  </React.Fragment>
                );
              }
            )}
          </div>

          {/* Interactive Stage Preview Panel */}
          <div className="mt-6 p-6 sm:p-8 rounded-2xl bg-[#faf9f6] border border-neutral-200 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
                <span>{activeStage.stageNumber}</span>
                <span aria-hidden="true">·</span>
                <span>Status: {selectedLifecycle}</span>
                <span aria-hidden="true">·</span>
                <span>Interactive Demo Preview</span>
              </div>

              <h3 className="font-display text-2xl font-normal text-neutral-900">
                {selectedLifecycle} Stage Workspace
              </h3>

              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                {activeStage.summary}
              </p>

              <div className="pt-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                  Expected Deliverables in {selectedLifecycle}:
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-700">
                  {activeStage.keyDeliverables.map((deliv, i) => (
                    <React.Fragment key={deliv}>
                      <span className="font-medium text-neutral-900">{deliv}</span>
                      {i < activeStage.keyDeliverables.length - 1 && (
                        <span aria-hidden="true" className="text-neutral-400">
                          ·
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 p-5 rounded-xl bg-white border border-neutral-200 space-y-3">
              <div className="text-xs font-mono text-neutral-500">
                Sample Demo Project in “{selectedLifecycle}”
              </div>
              <div className="font-display text-base font-semibold text-neutral-900">
                {activeStage.sampleProjectTitle}
              </div>
              <div className="text-xs text-neutral-600">
                <strong className="text-neutral-800">Current Task:</strong> {activeStage.sampleTask}
              </div>
              <div className="text-xs text-neutral-600">
                <strong className="text-neutral-800">Role Interaction:</strong> {activeStage.activeRoleFocus}
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() =>
                    onExploreStage ? onExploreStage(selectedLifecycle) : onGetStarted('STUDENT')
                  }
                  className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Explore “{selectedLifecycle}” Projects in Demo Workspace
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA SECTION */}
      <section className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#faf9f6]">
        <div className="mx-auto max-w-5xl">
          <div className="p-8 sm:p-12 rounded-3xl bg-neutral-900 text-white text-center flex flex-col items-center">
            <h2
              style={{ textWrap: 'balance' }}
              className="font-display text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight max-w-xl"
            >
              Make Every College Project Count.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-neutral-300 max-w-xl leading-relaxed">
              Bring your ideas, teammates, documentation, and academic guidance together with Project Era.
            </p>
            <div className="mt-7">
              <button
                type="button"
                onClick={() => onGetStarted()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm sm:text-[15px] font-semibold text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProjectEraSections;
