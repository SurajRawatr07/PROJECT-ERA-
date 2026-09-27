import React, { useState } from 'react';
import { 
  GitBranch, 
  CheckCircle2, 
  Clock, 
  GitCommit, 
  GitPullRequest, 
  Sparkles, 
  Users, 
  ChevronRight, 
  ExternalLink, 
  Award, 
  ShieldCheck,
  ArrowDown
} from 'lucide-react';
import { LineageBatch, ProjectItem } from '../../types';

interface ProjectLineageViewProps {
  project: ProjectItem;
  className?: string;
  onContinueProject?: (project: ProjectItem) => void;
}

export const ProjectLineageView: React.FC<ProjectLineageViewProps> = ({
  project,
  className = '',
  onContinueProject
}) => {
  const [selectedBatchIndex, setSelectedBatchIndex] = useState<number>(0);
  const lineage = project.lineage || [];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Narrative Header */}
      <div className="rounded-3xl bg-white border border-black/10 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#111111] text-white flex items-center justify-center">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#111111]">
                Generational Project Lineage
              </h3>
              <p className="text-xs text-[#737373]">
                {lineage.length} Recorded Cohorts • Permanent Contributor Attribution
              </p>
            </div>
          </div>

          <div className="text-xs font-mono text-[#737373] bg-[#F5F5F3] px-3 py-1 rounded-full border border-black/8">
            Lineage ID: {project.passportId || 'PV-LINEAGE'}
          </div>
        </div>

        <p className="text-sm text-neutral-600 leading-relaxed font-body mt-2">
          When a student batch graduates, their technical decisions, architecture, and evidence remain permanently sealed in ProjectVerse. Incoming student batches inherit validated foundations and record the next version in the lineage ledger.
        </p>
      </div>

      {/* Visual Timeline Ribbon */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-dashed border-neutral-300 space-y-8 sm:space-y-10 my-4 ml-4 sm:ml-6">
        {lineage.map((batch, idx) => {
          const isSelected = selectedBatchIndex === idx;
          const isCompleted = batch.activeStatus === 'Completed';
          const isCurrent = batch.activeStatus === 'Current';
          const isUpcoming = batch.activeStatus === 'Upcoming Roadmap' || batch.activeStatus === 'Seeking Next Batch' || batch.activeStatus === 'Continuity Ready';

          return (
            <div 
              key={`${batch.year}-${idx}`}
              className="relative group cursor-pointer"
              onClick={() => setSelectedBatchIndex(idx)}
            >
              {/* Timeline Node Icon Indicator */}
              <div 
                className={`absolute -left-[35px] sm:-left-[43px] top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompleted
                    ? 'bg-neutral-900 border-neutral-900 text-white'
                    : isCurrent
                    ? 'bg-emerald-600 border-emerald-600 text-white ring-4 ring-emerald-100'
                    : 'bg-white border-amber-500 text-amber-600 ring-4 ring-amber-50'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isCurrent ? (
                  <Sparkles className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
              </div>

              {/* Node Card */}
              <div 
                className={`rounded-3xl p-5 sm:p-6 transition-all duration-200 border ${
                  isSelected
                    ? 'bg-white border-[#111111] shadow-md ring-1 ring-black/5'
                    : 'bg-[#FAF9F6] border-black/8 hover:border-black/20 hover:bg-white shadow-2xs'
                }`}
              >
                {/* Year & Version Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#111111] text-white text-xs font-bold font-mono tracking-wider">
                      {batch.year}
                    </span>
                    {batch.version && (
                      <span className="px-2.5 py-0.5 rounded-full bg-neutral-200 text-neutral-800 text-[11px] font-mono font-semibold">
                        {batch.version}
                      </span>
                    )}
                    <h4 className="text-sm sm:text-base font-bold text-[#111111]">
                      {batch.batchName}
                    </h4>
                  </div>

                  <div>
                    {isCompleted && (
                      <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800 text-[11px] font-semibold">
                        Archived & Verified
                      </span>
                    )}
                    {isCurrent && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                        Active Generation
                      </span>
                    )}
                    {isUpcoming && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold animate-pulse">
                        Open for Continuity
                      </span>
                    )}
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed mb-4">
                  {batch.summary}
                </p>

                {/* Milestone Bullet Points */}
                {batch.keyMilestones && batch.keyMilestones.length > 0 && (
                  <div className="mb-4 space-y-1.5 p-3.5 rounded-2xl bg-white border border-black/6">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#737373] block mb-1">
                      Key Milestone Deliverables
                    </span>
                    {batch.keyMilestones.map((milestone, mIdx) => (
                      <div key={mIdx} className="flex items-start gap-2 text-xs text-neutral-800">
                        <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                        <span>{milestone}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Major Changes & Technologies */}
                {batch.majorChanges && batch.majorChanges.length > 0 && (
                  <div className="mb-4 space-y-1.5 p-3.5 rounded-2xl bg-white border border-black/6">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#737373] block mb-1">
                      Major Architectural Changes
                    </span>
                    {batch.majorChanges.map((change, cIdx) => (
                      <div key={cIdx} className="flex items-start gap-2 text-xs text-neutral-800">
                        <span className="text-indigo-600 font-bold shrink-0 mt-0.5">→</span>
                        <span>{change}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Contributor Credits & Telemetry */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-black/6 text-xs">
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#737373]" />
                    <span className="text-[#737373]">Contributors:</span>
                    <span className="font-semibold text-[#111111]">
                      {batch.leadContributors.join(', ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-[#737373]">
                    <span className="flex items-center gap-1">
                      <GitCommit className="w-3.5 h-3.5" />
                      {batch.commits} Commits
                    </span>
                    <span className="flex items-center gap-1">
                      <GitPullRequest className="w-3.5 h-3.5" />
                      {batch.pullRequests} Merged PRs
                    </span>
                  </div>
                </div>

                {/* Faculty Mentor & Review Seal */}
                {(batch.mentorName || batch.facultyReviewScore) && (
                  <div className="mt-3 pt-2 flex items-center justify-between text-[11px] text-[#737373] bg-[#F5F5F3] px-3 py-1.5 rounded-xl">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                      Mentor: <strong className="text-[#111111]">{batch.mentorName || 'Faculty Advisor'}</strong>
                    </span>
                    {batch.facultyReviewScore && (
                      <span className="font-mono font-bold text-emerald-800">
                        Academic Score: {batch.facultyReviewScore} / 10.0
                      </span>
                    )}
                  </div>
                )}

                {/* Continuity Call-To-Action if node is open */}
                {isUpcoming && onContinueProject && (
                  <div className="mt-4 pt-3 flex items-center justify-between">
                    <span className="text-xs text-amber-900 font-medium">
                      Ready to become the next lead for this project?
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onContinueProject(project);
                      }}
                      className="btn-primary-black px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Continue This Project</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
