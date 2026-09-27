import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  GitFork, 
  Users, 
  GraduationCap, 
  CheckSquare, 
  FolderSync, 
  ExternalLink, 
  ArrowRight, 
  ShieldAlert, 
  Compass, 
  FileText,
  Search,
  Filter,
  CheckCircle2,
  RefreshCw,
  Archive
} from 'lucide-react';
import { ProjectItem } from '../../types';
import { ProjectStatusBadge } from '../common/ProjectStatusBadge';

interface ProjectContinuityCenterProps {
  projects: ProjectItem[];
  onSelectProject: (project: ProjectItem) => void;
  onOpenPassport: (project: ProjectItem) => void;
  onContinueProject: (project: ProjectItem) => void;
  onOpenHandover: (project: ProjectItem) => void;
  onFindContributors?: (project: ProjectItem) => void;
  onFindMentor?: (project: ProjectItem) => void;
}

export const ProjectContinuityCenter: React.FC<ProjectContinuityCenterProps> = ({
  projects,
  onSelectProject,
  onOpenPassport,
  onContinueProject,
  onOpenHandover,
  onFindContributors,
  onFindMentor
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'INACTIVE' | 'SEEKING' | 'NEEDS_HANDOVER' | 'CRITICAL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Filter projects by risk and continuity criteria
  const atRiskProjects = projects.filter((p) => {
    const isNav = p.id === 'proj-nav' || p.passportId === 'PV-2026-00124';
    const isSeeking = p.status === 'Seeking Next Batch';
    const isAtRisk = p.continuity?.isAtRisk || isNav || isSeeking;
    
    if (!isAtRisk) return false;

    if (filterType === 'INACTIVE') {
      return (p.continuity?.daysInactive || 0) >= 30 || isNav;
    }
    if (filterType === 'SEEKING') {
      return isSeeking || isNav;
    }
    if (filterType === 'NEEDS_HANDOVER') {
      return p.continuity?.handoverStatus !== 'Completed & Ready';
    }
    if (filterType === 'CRITICAL') {
      return p.continuity?.riskLevel === 'Critical Risk' || isNav;
    }

    return true;
  }).filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.institution.toLowerCase().includes(q) || p.domain.toLowerCase().includes(q);
  });

  const handleTriggerAction = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {actionFeedback && (
        <div className="p-4 rounded-2xl bg-neutral-900 text-white text-xs font-medium flex items-center justify-between shadow-lg">
          <span>{actionFeedback}</span>
          <button onClick={() => setActionFeedback(null)} className="text-neutral-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Hero Problem Statement */}
      <div className="rounded-3xl bg-white border border-black/10 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900 uppercase">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
              <span>Project Continuity Engine & Recovery Center</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
              Projects That Need Attention
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed font-body">
              Projects should not die when a student batch graduates. The Continuity Engine monitors activity decay, detect unassigned tasks, and triggers handover packages so incoming student cohorts can continue validated research.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-[#FBFBFA] border border-black/8 min-w-[130px]">
              <span className="text-[10px] font-bold text-[#737373] uppercase tracking-wider block">
                Flagged At Risk
              </span>
              <span className="text-2xl font-bold font-mono text-amber-600 block mt-1">
                {atRiskProjects.length}
              </span>
              <span className="text-[11px] text-[#737373] block">Across nodes</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FBFBFA] border border-black/8 min-w-[130px]">
              <span className="text-[10px] font-bold text-[#737373] uppercase tracking-wider block">
                Average Inactivity
              </span>
              <span className="text-2xl font-bold font-mono text-neutral-900 block mt-1">
                31 Days
              </span>
              <span className="text-[11px] text-[#737373] block">Cohort graduation</span>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 mt-6 border-t border-black/8">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'ALL', label: 'All Attention Needed' },
              { id: 'CRITICAL', label: 'Critical Risk (>30d)' },
              { id: 'SEEKING', label: 'Seeking Next Batch' },
              { id: 'INACTIVE', label: 'Inactive Codebases' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  filterType === tab.id
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'bg-[#F5F5F3] text-[#737373] hover:text-[#111111] hover:bg-[#EAEAEA]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" />
            <input
              type="text"
              placeholder="Search at-risk projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-black/10 bg-[#FBFBFA] text-xs focus:outline-none focus:border-black"
            />
          </div>
        </div>
      </div>

      {/* At-Risk Project Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {atRiskProjects.map((p) => {
          const daysInactive = p.continuity?.daysInactive || (p.id === 'proj-nav' ? 34 : 28);
          const reasons = p.continuity?.riskReasons || [
            `No meaningful activity for ${daysInactive} days`,
            'Original student batch has graduated',
            'Backlog tasks awaiting incoming maintainer'
          ];
          const hasHandover = Boolean(p.handover || p.continuity?.hasHandoverPackage);

          return (
            <div 
              key={p.id}
              className="rounded-3xl bg-white border border-amber-300/80 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
            >
              {/* Risk Banner Stripe */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500" />

              <div>
                {/* Header Row */}
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        <span>⚠ Inactive for {daysInactive} days</span>
                      </span>
                      <span className="text-xs font-mono text-[#737373]">
                        {p.passportId}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#111111] leading-snug">
                      {p.title}
                    </h3>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shrink-0">
                    AT RISK
                  </span>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                  {p.tagline || p.description}
                </p>

                {/* Institution & Domain */}
                <div className="p-3 rounded-2xl bg-[#FBFBFA] border border-black/6 text-xs text-neutral-700 mb-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[#737373]">Institution:</span>
                    <span className="font-semibold text-[#111111]">{p.institution}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#737373]">Department:</span>
                    <span className="text-[#111111]">{p.department}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#737373]">Domain:</span>
                    <span className="text-[#111111]">{p.domain}</span>
                  </div>
                </div>

                {/* Detected Risk Reasons */}
                <div className="mb-5 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 block">
                    Continuity Risk Diagnostics:
                  </span>
                  {reasons.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-neutral-700">
                      <span className="text-rose-600 font-bold shrink-0 mt-0.5">•</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Center Buttons */}
              <div className="pt-4 border-t border-black/8 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      onContinueProject(p);
                      handleTriggerAction(`Continuity initiated for ${p.title}. Handover package activated!`);
                    }}
                    className="btn-primary-black px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <GitFork className="w-3.5 h-3.5 text-white" />
                    <span>Continue Project</span>
                  </button>

                  <button
                    onClick={() => onOpenHandover(p)}
                    className="px-3.5 py-2 rounded-xl bg-[#F5F5F3] hover:bg-[#ECECE9] border border-black/8 text-xs font-medium text-[#111111] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <FolderSync className="w-3.5 h-3.5 text-[#111111]" />
                    <span>View Handover Package</span>
                  </button>

                  <button
                    onClick={() => onOpenPassport(p)}
                    className="px-3.5 py-2 rounded-xl bg-[#F5F5F3] hover:bg-[#ECECE9] border border-black/8 text-xs font-medium text-[#111111] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#111111]" />
                    <span>Open Passport</span>
                  </button>
                </div>

                {/* Secondary Tactical Actions */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#737373] pt-1">
                  {onFindContributors && (
                    <button
                      onClick={() => {
                        onFindContributors(p);
                        handleTriggerAction(`Finding student candidates matching ${p.title} DNA...`);
                      }}
                      className="hover:text-black inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Users className="w-3 h-3" />
                      <span>Find Contributors</span>
                    </button>
                  )}

                  {onFindMentor && (
                    <button
                      onClick={() => {
                        onFindMentor(p);
                        handleTriggerAction(`Broadcasting mentor request for ${p.title} to faculty network...`);
                      }}
                      className="hover:text-black inline-flex items-center gap-1 cursor-pointer"
                    >
                      <GraduationCap className="w-3 h-3" />
                      <span>Find Mentor</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleTriggerAction(`${p.title} open task board broadcast to student dashboard`)}
                    className="hover:text-black inline-flex items-center gap-1 cursor-pointer"
                  >
                    <CheckSquare className="w-3 h-3" />
                    <span>Open Tasks ({p.continuity?.openTasksCount || 4})</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {atRiskProjects.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-white border border-black/8">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#111111]">All Projects Are Currently Active</h3>
          <p className="text-xs text-[#737373] mt-1">
            No projects currently match the at-risk criteria. All cohorts have active maintainers or completed handovers.
          </p>
        </div>
      )}
    </div>
  );
};
