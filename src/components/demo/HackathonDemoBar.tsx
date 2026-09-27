import React, { useState } from 'react';
import { 
  Play, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  CheckCircle2, 
  X, 
  RotateCcw,
  Compass,
  FileCheck2,
  Activity,
  ShieldCheck,
  Award,
  GitBranch,
  AlertTriangle,
  FolderSync,
  UserCheck,
  Check
} from 'lucide-react';
import { ProjectItem } from '../../types';

export interface DemoStep {
  id: number;
  title: string;
  desc: string;
  actionText: string;
  icon: any;
  targetView: 'directory' | 'passport' | 'health' | 'evidence' | 'proof-of-work' | 'lineage' | 'continuity' | 'handover' | 'matching' | 'review' | 'lineage-v2';
}

export const HACKATHON_DEMO_STEPS: DemoStep[] = [
  {
    id: 1,
    title: '1. Discover Existing Project',
    desc: 'Student discovers Smart Campus Navigation & Accessibility (GEHU), developed by the graduating 2024 cohort.',
    actionText: 'Open Project Directory',
    icon: Compass,
    targetView: 'directory'
  },
  {
    id: 2,
    title: '2. Open Project Passport',
    desc: 'Permanent identity PV-2026-00124 with scannable QR, immutable ledger hash, and multi-tenant credentials.',
    actionText: 'View Project Passport',
    icon: FileCheck2,
    targetView: 'passport'
  },
  {
    id: 3,
    title: '3. Check Project Health',
    desc: 'Explainable health score (48/100) breaks down repository commits, contributor status, and documentation decay.',
    actionText: 'Inspect Health Breakdown',
    icon: Activity,
    targetView: 'health'
  },
  {
    id: 4,
    title: '4. View Factual Evidence',
    desc: 'Verified repository commits, merged PRs, and task sign-offs with strict distinction: Evidence ≠ Faculty Verification.',
    actionText: 'Review Contributor Evidence',
    icon: ShieldCheck,
    targetView: 'evidence'
  },
  {
    id: 5,
    title: '5. Proof of Work Transcript',
    desc: 'Career proof-of-work transcript with 6-stage chronological progression and verifiable credential QR.',
    actionText: 'Open Proof of Work',
    icon: Award,
    targetView: 'proof-of-work'
  },
  {
    id: 6,
    title: '6. Generational Project Lineage',
    desc: 'Multi-batch evolution timeline preserving past contributors and architectural milestones.',
    actionText: 'View Project Lineage',
    icon: GitBranch,
    targetView: 'lineage'
  },
  {
    id: 7,
    title: '7. Continuity Engine Detects Risk',
    desc: 'Engine flags project as At Risk (34 days without activity; 4 unassigned backlog tasks; original team graduated).',
    actionText: 'Open Recovery Center',
    icon: AlertTriangle,
    targetView: 'continuity'
  },
  {
    id: 8,
    title: '8. Access Project Handover',
    desc: 'Outgoing team documents architecture, BLE setup, known bugs, ADRs, and things the next team should know.',
    actionText: 'Inspect Handover Package',
    icon: FolderSync,
    targetView: 'handover'
  },
  {
    id: 9,
    title: '9. Smart Match New Contributor',
    desc: 'Explainable matching connects incoming student Suraj Rawat (92% match) based on React 19, BLE, and GeoJSON skills.',
    actionText: 'View Candidate Match',
    icon: Sparkles,
    targetView: 'matching'
  },
  {
    id: 10,
    title: '10. New Student Joins & Continues',
    desc: 'Student claims maintenance, accepts handover package, and unlocks v2.0 development sprint.',
    actionText: 'Continue Project As Lead',
    icon: UserCheck,
    targetView: 'handover'
  },
  {
    id: 11,
    title: '11. Project v2 Recorded in Lineage',
    desc: 'Incoming Batch 2026 milestone recorded into permanent evolutionary timeline without overwriting original creators.',
    actionText: 'Inspect v2 in Lineage',
    icon: GitBranch,
    targetView: 'lineage'
  },
  {
    id: 12,
    title: '12. Contributor Receives Proof of Work',
    desc: 'New contributor profile instantly updated with immutable CONTINUED_PROJECT credential and updated transcript.',
    actionText: 'Verify Updated Credential',
    icon: CheckCircle2,
    targetView: 'proof-of-work'
  }
];

interface HackathonDemoBarProps {
  onStepSelect: (step: DemoStep) => void;
  className?: string;
}

export const HackathonDemoBar: React.FC<HackathonDemoBarProps> = ({
  onStepSelect,
  className = ''
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  const currentStep = HACKATHON_DEMO_STEPS[currentStepIndex];
  const StepIcon = currentStep.icon;

  const handleNext = () => {
    const nextIdx = (currentStepIndex + 1) % HACKATHON_DEMO_STEPS.length;
    setCurrentStepIndex(nextIdx);
    onStepSelect(HACKATHON_DEMO_STEPS[nextIdx]);
  };

  const handlePrev = () => {
    const prevIdx = currentStepIndex === 0 ? HACKATHON_DEMO_STEPS.length - 1 : currentStepIndex - 1;
    setCurrentStepIndex(prevIdx);
    onStepSelect(HACKATHON_DEMO_STEPS[prevIdx]);
  };

  const handleJump = (idx: number) => {
    setCurrentStepIndex(idx);
    onStepSelect(HACKATHON_DEMO_STEPS[idx]);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 bg-[#111111] text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 hover:bg-neutral-800 transition-all cursor-pointer border border-white/20"
      >
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span>Hackathon Story Tour ({currentStepIndex + 1}/12)</span>
      </button>
    );
  }

  return (
    <div className={`w-full bg-[#111111] text-white border-b border-white/10 px-4 py-2.5 z-40 relative ${className}`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Indicator & Step Title */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <StepIcon className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                Hackathon Demo Flow (Step {currentStep.id} of 12)
              </span>
              <span className="text-white/40">•</span>
              <span className="text-xs font-bold text-white truncate">
                {currentStep.title}
              </span>
            </div>
            <p className="text-[11px] text-neutral-300 truncate max-w-xl hidden sm:block">
              {currentStep.desc}
            </p>
          </div>
        </div>

        {/* Center: Step Navigator Dots */}
        <div className="hidden lg:flex items-center gap-1">
          {HACKATHON_DEMO_STEPS.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => handleJump(idx)}
              className={`w-6 h-6 rounded-md text-[10px] font-bold font-mono transition-all cursor-pointer ${
                currentStepIndex === idx
                  ? 'bg-amber-400 text-[#111111] scale-110 shadow-xs'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
              title={s.title}
            >
              {s.id}
            </button>
          ))}
        </div>

        {/* Right: Action Trigger & Arrows */}
        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
          <button
            onClick={() => onStepSelect(currentStep)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <span>{currentStep.actionText}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1 pl-1 border-l border-white/10">
            <button
              onClick={handlePrev}
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 cursor-pointer"
              title="Previous Step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 cursor-pointer"
              title="Next Step"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/50 hover:text-white cursor-pointer ml-1"
              title="Minimize Tour"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
