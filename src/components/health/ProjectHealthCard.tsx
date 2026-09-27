import React from 'react';
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  GitCommit, 
  Users, 
  FileText, 
  CheckSquare, 
  ExternalLink,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { ProjectHealthScore } from '../../types';

interface ProjectHealthCardProps {
  health: ProjectHealthScore;
  projectTitle?: string;
  className?: string;
  compact?: boolean;
}

export const ProjectHealthCard: React.FC<ProjectHealthCardProps> = ({
  health,
  projectTitle,
  className = '',
  compact = false
}) => {
  const isHealthy = health.overallScore >= 80;
  const isAtRisk = health.status === 'At Risk' || health.overallScore < 55;
  const isAttention = health.status === 'Needs Attention' || (health.overallScore >= 55 && health.overallScore < 80);

  const getStatusBadge = () => {
    if (isAtRisk) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          <span>At Risk ({health.lastActivityDays}d inactive)</span>
        </span>
      );
    }
    if (isAttention) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>Needs Attention</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>Active & Healthy</span>
      </span>
    );
  };

  const getScoreColor = () => {
    if (isAtRisk) return 'text-rose-600';
    if (isAttention) return 'text-amber-600';
    return 'text-emerald-700';
  };

  const getBarColor = () => {
    if (isAtRisk) return 'bg-rose-500';
    if (isAttention) return 'bg-amber-500';
    return 'bg-emerald-600';
  };

  if (compact) {
    return (
      <div className={`p-3.5 rounded-2xl bg-white border border-black/8 shadow-2xs ${className}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#737373]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#737373]">
              Project Health
            </span>
          </div>
          {getStatusBadge()}
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-bold font-mono ${getScoreColor()}`}>
            {health.overallScore}
          </span>
          <span className="text-xs text-[#737373]">/ 100</span>
        </div>
        <div className="w-full h-1.5 bg-neutral-100 rounded-full mt-2 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
            style={{ width: `${health.overallScore}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-3xl bg-white border border-black/10 p-5 sm:p-6 shadow-xs ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-black/8">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#111111] text-white flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#111111]">
              Project Health Engine
            </h3>
          </div>
          <p className="text-xs text-[#737373] mt-1">
            Explainable telemetry signals across repository, contributors, documentation, and tasks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="flex items-baseline gap-1">
              <span className={`text-3xl font-extrabold font-mono tracking-tight ${getScoreColor()}`}>
                {health.overallScore}
              </span>
              <span className="text-xs text-[#737373] font-semibold">/ 100</span>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="pt-4 pb-5">
        <div className="flex items-center justify-between text-xs text-[#737373] mb-1.5 font-medium">
          <span>Explainable Index</span>
          <span>{health.status} Status</span>
        </div>
        <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
            style={{ width: `${health.overallScore}%` }}
          />
        </div>
      </div>

      {/* 4 Metric Signal Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 text-xs">
        <div className="p-3 rounded-xl bg-[#FBFBFA] border border-black/6">
          <div className="flex items-center gap-1.5 text-[#737373] mb-1">
            <GitCommit className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">Codebase</span>
          </div>
          <p className="text-sm font-bold text-[#111111]">{health.recentCommitsCount} recent commits</p>
          <span className="text-[10.5px] text-[#737373]">Activity Index {health.repositoryActivityScore}%</span>
        </div>

        <div className="p-3 rounded-xl bg-[#FBFBFA] border border-black/6">
          <div className="flex items-center gap-1.5 text-[#737373] mb-1">
            <Users className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">Contributors</span>
          </div>
          <p className="text-sm font-bold text-[#111111]">{health.activeContributorsCount} builders</p>
          <span className="text-[10.5px] text-[#737373]">{health.activeContributorsCount > 1 ? 'Collaborative' : 'Single maintainer'}</span>
        </div>

        <div className="p-3 rounded-xl bg-[#FBFBFA] border border-black/6">
          <div className="flex items-center gap-1.5 text-[#737373] mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">Docs & Specs</span>
          </div>
          <p className="text-sm font-bold text-[#111111]">{health.documentationScore}% complete</p>
          <span className="text-[10.5px] text-[#737373]">Architecture Specs</span>
        </div>

        <div className="p-3 rounded-xl bg-[#FBFBFA] border border-black/6">
          <div className="flex items-center gap-1.5 text-[#737373] mb-1">
            <CheckSquare className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">Task Backlog</span>
          </div>
          <p className="text-sm font-bold text-[#111111]">{health.openTasksCount} open tasks</p>
          <span className="text-[10.5px] text-[#737373]">Next cohort backlog</span>
        </div>
      </div>

      {/* Positive and Warning Signals Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-black/6">
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 mb-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Positive Signals ({health.positiveSignals.length})
          </h4>
          <ul className="space-y-1.5">
            {health.positiveSignals.map((sig, i) => (
              <li key={i} className="text-xs text-neutral-700 flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                <span>{sig}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-800 mb-2 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Attention & Risk Signals ({health.warningSignals.length})
          </h4>
          {health.warningSignals.length === 0 ? (
            <p className="text-xs text-neutral-500 italic">No critical risk signals flagged.</p>
          ) : (
            <ul className="space-y-1.5">
              {health.warningSignals.map((sig, i) => (
                <li key={i} className="text-xs text-neutral-700 flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold shrink-0">⚠</span>
                  <span>{sig}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Anti-Slop Disclaimer */}
      <p className="text-[11px] text-[#888888] italic mt-4 pt-3 border-t border-black/4">
        Notice: Project Health Score is an automated heuristic computed from repository telemetry and task milestones. It is an operational indicator, not an absolute evaluation of project novelty or academic quality.
      </p>
    </div>
  );
};
