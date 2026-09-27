import React, { useState } from 'react';
import { 
  FolderSync, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal, 
  BookOpen, 
  Milestone, 
  Lightbulb, 
  ShieldCheck, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  GitFork,
  FileText,
  Layers,
  Wrench,
  HelpCircle,
  Clock
} from 'lucide-react';
import { ProjectHandoverPackage, ProjectItem } from '../../types';

interface ProjectHandoverViewProps {
  handover: ProjectHandoverPackage;
  project?: ProjectItem;
  className?: string;
  onAcceptHandover?: (handover: ProjectHandoverPackage) => void;
}

export const ProjectHandoverView: React.FC<ProjectHandoverViewProps> = ({
  handover,
  project,
  className = '',
  onAcceptHandover
}) => {
  const [copied, setCopied] = useState(false);
  const [acceptedToast, setAcceptedToast] = useState(false);

  const handleCopySetup = () => {
    navigator.clipboard?.writeText(handover.setupInstructions.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAccept = () => {
    setAcceptedToast(true);
    if (onAcceptHandover) {
      onAcceptHandover(handover);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Handover Hero Bar */}
      <div className="rounded-3xl bg-white border border-black/10 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-black/8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#111111] text-white flex items-center justify-center">
              <FolderSync className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#737373]">
                Inter-Batch Transition System
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111]">
                Project Handover Package
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{handover.status}</span>
            </span>

            <button
              onClick={handleCopySetup}
              className="px-3.5 py-1.5 rounded-xl bg-[#F7F7F5] hover:bg-[#ECECE9] border border-black/8 text-xs font-medium text-[#111111] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Setup Copied' : 'Copy Quickstart'}</span>
            </button>
          </div>
        </div>

        {/* Transition Summary Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
          <div className="p-3.5 rounded-2xl bg-[#FBFBFA] border border-black/6">
            <span className="text-[10px] font-bold text-[#737373] uppercase tracking-wider block">
              Outgoing Batch
            </span>
            <span className="text-sm font-bold text-[#111111] mt-0.5 block">
              {handover.outgoingBatch}
            </span>
            <span className="text-xs text-[#737373] block truncate">
              Leads: {handover.outgoingLeads.join(', ')}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FBFBFA] border border-black/6">
            <span className="text-[10px] font-bold text-[#737373] uppercase tracking-wider block">
              Incoming Target Batch
            </span>
            <span className="text-sm font-bold text-[#111111] mt-0.5 block">
              {handover.targetIncomingBatch}
            </span>
            <span className="text-xs text-emerald-700 font-medium block">
              Direct Cohort Inheritance
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FBFBFA] border border-black/6">
            <span className="text-[10px] font-bold text-[#737373] uppercase tracking-wider block">
              Sealed Handover Date
            </span>
            <span className="text-sm font-bold text-[#111111] mt-0.5 block">
              {new Date(handover.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="text-xs text-[#737373] block">
              Package ID: {handover.id}
            </span>
          </div>
        </div>

        {/* Core Value Statement */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 leading-relaxed">
          <strong>Institutional Continuity Guarantee:</strong> The outgoing team has prepared this comprehensive dossier so incoming student engineers can understand, install, and extend the project without requiring synchronous contact with previous graduates.
        </div>
      </div>

      {/* Grid: What has been built + Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-3xl bg-white border border-black/10 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#737373]">
            <Layers className="w-4 h-4 text-[#111111]" />
            <span>1. What Has Been Built</span>
          </div>
          <p className="text-sm text-neutral-800 leading-relaxed">
            {handover.whatHasBeenBuilt}
          </p>
        </div>

        <div className="rounded-3xl bg-white border border-black/10 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#737373]">
            <Clock className="w-4 h-4 text-[#111111]" />
            <span>2. Current Project Status</span>
          </div>
          <p className="text-sm text-neutral-800 leading-relaxed">
            {handover.currentProjectStatus}
          </p>
        </div>
      </div>

      {/* Architecture & System Overview */}
      <div className="rounded-3xl bg-white border border-black/10 p-6 sm:p-7 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#737373]">
          <Wrench className="w-4 h-4 text-[#111111]" />
          <span>3. Architecture & Topology</span>
        </div>
        <p className="text-sm text-neutral-800 leading-relaxed font-mono text-xs bg-[#FBFBFA] p-4 rounded-2xl border border-black/6">
          {handover.architectureOverview}
        </p>
      </div>

      {/* Setup Instructions (Quickstart) */}
      <div className="rounded-3xl bg-white border border-black/10 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#737373]">
            <Terminal className="w-4 h-4 text-[#111111]" />
            <span>4. Local Setup & Quickstart Guide</span>
          </div>
          <button
            onClick={handleCopySetup}
            className="text-xs text-neutral-600 hover:text-black font-medium inline-flex items-center gap-1 cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span>Copy Commands</span>
          </button>
        </div>

        <div className="rounded-2xl bg-neutral-900 text-neutral-100 p-4 font-mono text-xs space-y-2 overflow-x-auto">
          {handover.setupInstructions.map((cmd, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-neutral-500 select-none">$</span>
              <span className="text-emerald-400 select-all">{cmd}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Known Bugs & Technical Debt */}
      <div className="rounded-3xl bg-white border border-black/10 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#737373]">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>5. Known Bugs & Edge Conditions ({handover.knownBugs.length})</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {handover.knownBugs.map((bug) => (
            <div key={bug.id} className="p-3.5 rounded-2xl bg-[#FBFBFA] border border-black/6 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#111111]">{bug.title}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  bug.severity === 'High' || bug.severity === 'Critical'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-900'
                }`}>
                  {bug.severity}
                </span>
              </div>
              <p className="text-xs text-[#555555]">{bug.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Tasks Backlog */}
      <div className="rounded-3xl bg-white border border-black/10 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#737373]">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>6. Pending Tasks For Next Cohort ({handover.pendingTasks.length})</span>
        </div>

        <div className="space-y-2">
          {handover.pendingTasks.map((t) => (
            <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-[#FBFBFA] border border-black/6 text-xs">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${t.completed ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span className={`font-medium ${t.completed ? 'line-through text-neutral-400' : 'text-[#111111]'}`}>
                  {t.title}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-neutral-100 text-[#555555] text-[10.5px] font-semibold">
                Priority: {t.priority}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Decisions (ADRs) */}
      <div className="rounded-3xl bg-white border border-black/10 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#737373]">
          <FileText className="w-4 h-4 text-[#111111]" />
          <span>7. Key Architecture Decision Records (ADRs)</span>
        </div>

        <div className="space-y-3">
          {handover.technicalDecisions.map((ad, i) => (
            <div key={i} className="p-4 rounded-2xl bg-[#FBFBFA] border border-black/6 space-y-1">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-[#111111]">{ad.decision}</span>
                <span className="text-[#737373] text-[11px] font-mono">{ad.date}</span>
              </div>
              <p className="text-xs text-[#555555] leading-relaxed">
                <strong>Rationale:</strong> {ad.rationale}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Things Next Team Should Know ("Gotchas" & Secrets) */}
      <div className="rounded-3xl bg-white border border-black/10 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <span>8. Things The Next Team Should Know (Gotchas & Pitfalls)</span>
        </div>

        <div className="space-y-2.5">
          {handover.thingsNextTeamShouldKnow.map((item, i) => (
            <div key={i} className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-950">
              <span className="font-bold text-amber-700 shrink-0">💡</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Future Roadmap & Required Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-3xl bg-white border border-black/10 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#737373]">
            <Milestone className="w-4 h-4 text-[#111111]" />
            <span>Future Roadmap</span>
          </div>
          <div className="space-y-2">
            {handover.futureRoadmap.map((r, i) => (
              <div key={i} className="p-3 rounded-xl bg-[#FBFBFA] border border-black/6 text-xs">
                <span className="font-bold text-[#111111] block">{r.phase} ({r.targetQuarter})</span>
                <p className="text-[#555555] mt-0.5">{r.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-black/10 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#737373]">
            <Wrench className="w-4 h-4 text-[#111111]" />
            <span>Required Skills for Next Batch</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {handover.requiredSkills.map((sk) => (
              <span key={sk} className="px-3 py-1.5 rounded-xl bg-[#FBFBFA] border border-black/8 text-xs font-mono text-[#111111]">
                {sk}
              </span>
            ))}
          </div>
          <div className="pt-3">
            <span className="text-[11px] font-bold text-[#737373] uppercase tracking-wider block mb-1">
              Recommended Improvements
            </span>
            <ul className="text-xs text-[#555555] space-y-1 list-disc pl-4">
              {handover.recommendedImprovements.map((imp, i) => (
                <li key={i}>{imp}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Accept & Claim Handover Action Bar */}
      <div className="rounded-3xl bg-[#111111] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block mb-1">
            Project Continuity Action
          </span>
          <h3 className="text-lg font-bold text-white">
            Accept Project Handover as Incoming Maintainer
          </h3>
          <p className="text-xs text-neutral-300 mt-1 max-w-xl">
            Accepting this package links your student profile to the project, authorizes you to push updates to the roadmap, and starts your official Project v2 lineage record.
          </p>
        </div>

        <button
          onClick={handleAccept}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white text-[#111111] font-semibold text-xs sm:text-sm hover:bg-neutral-100 transition-all duration-200 inline-flex items-center justify-center gap-2 cursor-pointer shadow-md shrink-0"
        >
          <GitFork className="w-4 h-4 text-[#111111]" />
          <span>{acceptedToast ? 'Handover Accepted ✓' : 'Accept Handover Package'}</span>
        </button>
      </div>
    </div>
  );
};
