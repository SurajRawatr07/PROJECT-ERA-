import React from 'react';
import { 
  GitCommit, 
  GitPullRequest, 
  AlertCircle, 
  CheckCircle2, 
  FileCode2, 
  CheckSquare, 
  Calendar, 
  ShieldCheck, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { ContributorEvidence, EvidenceConfidenceLevel } from '../../types';

interface ContributionEvidenceViewProps {
  evidences: ContributorEvidence[];
  projectTitle?: string;
  className?: string;
}

export const ContributionEvidenceView: React.FC<ContributionEvidenceViewProps> = ({
  evidences,
  projectTitle,
  className = ''
}) => {
  const getBadgeForLevel = (level: EvidenceConfidenceLevel) => {
    switch (level) {
      case 'Strong':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Strong Evidence</span>
          </span>
        );
      case 'Moderate':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Moderate Evidence</span>
          </span>
        );
      case 'Limited':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Limited Evidence</span>
          </span>
        );
      case 'No evidence available':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-700 border border-neutral-300">
            <AlertCircle className="w-3.5 h-3.5 text-neutral-500" />
            <span>No Evidence Available</span>
          </span>
        );
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Distinction Header Banner */}
      <div className="rounded-2xl bg-amber-50/80 border border-amber-200 p-4 sm:p-5 flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <div className="text-xs space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-amber-950 uppercase tracking-wider text-[11px]">
              Platform Transparency Standard
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold text-[10px]">
              Evidence ≠ Faculty Verification
            </span>
          </div>
          <p className="text-amber-900 leading-relaxed">
            Contribution evidence is derived strictly from observable repository actions (commits, merged pull requests, closed issues, and assigned sprint tasks). It represents verifiable technical labor, but does not replace formal academic rubric evaluation performed by authorized faculty mentors.
          </p>
        </div>
      </div>

      {/* Contributor Evidence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {evidences.map((ev, index) => (
          <div 
            key={`${ev.contributorName}-${index}`}
            className="rounded-3xl bg-white border border-black/10 p-5 shadow-xs hover:border-black/20 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Contributor Row */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={ev.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'} 
                    alt={ev.contributorName}
                    className="w-11 h-11 rounded-2xl object-cover border border-black/10 shadow-2xs"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-[#111111]">{ev.contributorName}</h4>
                    <p className="text-xs text-[#737373]">{ev.role}</p>
                    {ev.institution && (
                      <p className="text-[11px] text-[#737373] truncate max-w-[200px]">
                        {ev.institution} {ev.batch ? `• ${ev.batch}` : ''}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  {getBadgeForLevel(ev.evidenceLevel)}
                </div>
              </div>

              {/* Verified Metrics Matrix */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#FBFBFA] border border-black/6 mb-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 text-[#737373] mb-0.5">
                    <GitCommit className="w-3 h-3" />
                    <span className="text-[10px] font-semibold uppercase">Commits</span>
                  </div>
                  <span className="text-sm font-bold text-[#111111] font-mono">{ev.commitsCount}</span>
                </div>

                <div>
                  <div className="flex items-center justify-center gap-1 text-[#737373] mb-0.5">
                    <GitPullRequest className="w-3 h-3" />
                    <span className="text-[10px] font-semibold uppercase">PRs Merged</span>
                  </div>
                  <span className="text-sm font-bold text-[#111111] font-mono">{ev.pullRequestsMerged}</span>
                </div>

                <div>
                  <div className="flex items-center justify-center gap-1 text-[#737373] mb-0.5">
                    <FileCode2 className="w-3 h-3" />
                    <span className="text-[10px] font-semibold uppercase">Files Diff</span>
                  </div>
                  <span className="text-sm font-bold text-[#111111] font-mono">{ev.filesChanged}</span>
                </div>
              </div>

              {/* Task & Activity Details */}
              <div className="space-y-2 text-xs text-neutral-700">
                <div className="flex items-center justify-between py-1 border-b border-black/4">
                  <span className="text-[#737373] flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                    Completed Tasks
                  </span>
                  <span className="font-semibold text-[#111111]">{ev.completedTasksCount} of {ev.assignedTasksCount} tasks</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-black/4">
                  <span className="text-[#737373] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#737373]" />
                    Contribution Timeline
                  </span>
                  <span className="font-medium text-[#111111]">{ev.timelineRange}</span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-[#737373] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Faculty Sign-offs
                  </span>
                  <span className="font-medium text-[#111111]">{ev.facultyReviewCount} verified review</span>
                </div>
              </div>
            </div>

            {/* Individual Disclaimer note */}
            <div className="pt-3 mt-3 border-t border-black/6 text-[10.5px] text-[#888888] italic">
              {ev.disclaimer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
