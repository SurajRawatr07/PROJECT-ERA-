import React, { useState } from 'react';
import { 
  FolderGit2, 
  CheckCircle2, 
  Sparkles, 
  Users, 
  Github, 
  ArrowRight, 
  ExternalLink,
  Clock,
  Award,
  ChevronRight,
  PlusCircle,
  FileCheck2,
  Code2
} from 'lucide-react';
import { StudentDemoData } from '../../data/roleDemoData';
import { ProjectItem } from '../../types';
import { StatsCard } from '../common/StatsCard';
import { EmptyState } from '../common/EmptyState';
import { PearlButton } from '../ui/pearl-button';

interface StudentDashboardViewProps {
  data: StudentDemoData;
  onSelectProject?: (project: ProjectItem) => void;
  onSubmitNewProject?: () => void;
  onOpenPassport?: (passportId: string) => void;
  onOpenContinuity?: () => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  data,
  onSelectProject,
  onSubmitNewProject,
  onOpenPassport,
  onOpenContinuity
}) => {
  const [checklist, setChecklist] = useState(data.gettingStartedChecklist);
  const [projects, setProjects] = useState(data.projects);

  const toggleChecklist = (id: string) => {
    setChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Profile Completion */}
      <div className="bg-[#FBFBFA] rounded-3xl p-6 sm:p-8 border border-black/8 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono-code text-[#737373] uppercase font-semibold tracking-wider">
              Student Innovator Portal
            </span>
            <h1 className="font-display text-2xl sm:text-3xl text-[#111111] mt-1 font-normal">
              Welcome back, {data.profile.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-[#555555] mt-1 max-w-2xl leading-relaxed">
              {data.profile.institution} • {data.profile.course || 'B.Tech Computer Science'} (Batch {data.profile.batch || '2023–2027'})
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            {onSubmitNewProject && (
              <PearlButton
                onClick={onSubmitNewProject}
                variant="dark"
                size="sm"
                icon={<PlusCircle className="w-4 h-4" />}
                iconPosition="left"
                showSparkle={true}
                label="Submit Project"
              />
            )}
          </div>
        </div>

        {/* Profile Completion Bar */}
        <div className="mt-6 pt-5 border-t border-black/8">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-medium text-[#111111] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#111111]" />
              Profile Readiness & Verification Score
            </span>
            <span className="font-mono-code font-bold text-[#111111]">{data.stats.profileCompletion}%</span>
          </div>
          <div className="w-full h-2 bg-black/6 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#111111] rounded-full transition-all duration-500"
              style={{ width: `${data.stats.profileCompletion}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatsCard
          label="Projects"
          value={projects.length}
          note="Active academic repositories"
          icon={FolderGit2}
        />
        <StatsCard
          label="Verified Projects"
          value={data.stats.verifiedCount}
          note="Cryptographic passports"
          icon={FileCheck2}
          trend="+2 this semester"
          trendPositive={true}
        />
        <StatsCard
          label="Contributions"
          value={data.stats.contributionsCount}
          note="Merged pull requests"
          icon={Github}
        />
        <StatsCard
          label="Skills"
          value={data.profile.skills?.length || 12}
          note="Verified technical skills"
          icon={Code2}
        />
      </div>

      {/* Action Center & Continuity Alert (Requirement 7, 8, 18) */}
      <div className="bg-amber-50/80 rounded-3xl p-5 sm:p-6 border border-amber-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-900 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-amber-800">
                  Action Center • Project Continuity Alert
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                  34 Days Inactive
                </span>
              </div>
              <h3 className="text-base font-bold text-amber-950 mt-1">
                Smart Campus Navigation & Accessibility (GEHU) Needs Next-Batch Maintainers
              </h3>
              <p className="text-xs text-amber-900 mt-1 max-w-2xl leading-relaxed">
                The graduating Batch of 2024 left a complete Handover Package, architecture blueprints, and 4 sprint tasks. Your skill profile in React 19, TypeScript, and Web Workers is a 92% match!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenContinuity?.()}
              className="btn-primary-black px-4 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Review Handover & Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Getting Started Checklist (Specially relevant for new students) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-black/8 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg sm:text-xl text-[#111111] font-normal flex items-center gap-2">
            <Award className="w-4 h-4 text-[#111111]" />
            Getting Started with ProjectVerse
          </h2>
          <span className="text-[11px] font-mono-code text-[#737373]">
            {checklist.filter(c => c.completed).length} of {checklist.length} done
          </span>
        </div>

        <div className="space-y-2">
          {checklist.map(item => (
            <div
              key={item.id}
              onClick={() => toggleChecklist(item.id)}
              className={`p-3 rounded-xl border flex items-start gap-3 transition-all cursor-pointer ${
                item.completed
                  ? 'bg-[#FAFAFA] border-black/5 opacity-75'
                  : 'bg-white border-black/10 hover:border-black/20'
              }`}
            >
              <div
                className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center transition-colors shrink-0 ${
                  item.completed ? 'bg-emerald-600 text-white' : 'border border-black/30'
                }`}
              >
                {item.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>
              <div className="flex-1 min-w-0 text-xs">
                <p
                  className={`font-medium ${
                    item.completed ? 'line-through text-[#737373]' : 'text-[#111111]'
                  }`}
                >
                  {item.task}
                </p>
                <p className="text-[11px] text-[#737373] mt-0.5">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl text-[#111111] font-normal">
              My Academic Projects
            </h2>
            <p className="text-xs text-[#555555]">
              Documented capstones with verifiable tech stacks and cryptographic signatures.
            </p>
          </div>
          {onSubmitNewProject && (
            <button
              onClick={onSubmitNewProject}
              className="text-xs font-medium text-[#111111] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>+ Create Project</span>
            </button>
          )}
        </div>

        {projects.length === 0 ? (
          <EmptyState
            type="projects"
            title="No projects yet"
            description="Start by creating your first academic project passport to document your engineering work."
            actionText="Submit Project"
            onAction={onSubmitNewProject}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(proj => (
              <div
                key={proj.id}
                className="bg-white rounded-2xl p-5 border border-black/8 hover:border-black/20 transition-all shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#F5F5F3] text-[#555555] uppercase">
                      {proj.domain}
                    </span>
                    <span
                      className={`text-[10.5px] font-mono-code px-2 py-0.5 rounded-full font-medium ${
                        proj.status === 'Verified'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {proj.status}
                    </span>
                  </div>

                  <h3 className="font-display text-base font-normal text-[#111111] line-clamp-1 mb-1">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-[#555555] line-clamp-2 mb-3 leading-relaxed">
                    {proj.description || proj.tagline}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {proj.techStack.slice(0, 4).map(tech => (
                      <span
                        key={tech}
                        className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#F7F7F5] border border-black/5 text-[#333333]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-black/6 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[#737373] text-[11px]">
                    <Github className="w-3.5 h-3.5" />
                    <span>{proj.githubStars || 0} stars</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {proj.passport && onOpenPassport && (
                      <button
                        onClick={() => onOpenPassport(proj.passport!.passportId)}
                        className="text-[11px] font-mono-code text-blue-700 hover:underline cursor-pointer"
                      >
                        Passport
                      </button>
                    )}
                    {onSelectProject && (
                      <button
                        onClick={() => onSelectProject(proj)}
                        className="px-2.5 py-1 rounded-lg bg-[#F5F5F3] hover:bg-[#111111] hover:text-white text-[#111111] text-xs font-medium transition-all cursor-pointer"
                      >
                        View
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mentors & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mentors Card */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-black/8 shadow-2xs">
          <h3 className="font-display text-lg text-[#111111] font-normal mb-3">
            Advisory Mentors & Guides
          </h3>
          <div className="space-y-3">
            {data.mentors.map(men => (
              <div
                key={men.id}
                className="p-3 rounded-xl bg-[#FBFBFA] border border-black/5 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={men.avatar}
                    alt={men.name}
                    className="w-10 h-10 rounded-xl object-cover border border-black/10 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#111111] truncate">{men.name}</p>
                    <p className="text-[11px] text-[#555555] truncate">{men.title}</p>
                    <p className="text-[10px] font-mono-code text-[#737373] truncate">{men.domain}</p>
                  </div>
                </div>
                <span className="text-[10.5px] font-mono-code px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                  {men.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-black/8 shadow-2xs">
          <h3 className="font-display text-lg text-[#111111] font-normal mb-3">
            Recent Timeline Activity
          </h3>
          <div className="space-y-3">
            {data.recentActivity.map(act => (
              <div
                key={act.id}
                className="p-3 rounded-xl bg-[#FBFBFA] border border-black/5 flex items-start gap-3 text-xs"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-[#111111] truncate">{act.title}</p>
                    <span className="text-[10px] font-mono-code text-[#737373] shrink-0">{act.time}</span>
                  </div>
                  <p className="text-[11px] text-[#555555] mt-0.5 leading-relaxed">{act.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
