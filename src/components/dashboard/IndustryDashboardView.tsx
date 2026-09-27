import React from 'react';
import { 
  Briefcase, 
  Award, 
  Users, 
  ShieldCheck, 
  PlusCircle, 
  Compass, 
  ChevronRight, 
  Building2,
  Trophy,
  CheckCircle2
} from 'lucide-react';
import { UserProfile, ProjectItem } from '../../types';
import { StatsCard } from '../common/StatsCard';
import { SAMPLE_PROJECTS } from '../../data/mockData';

interface IndustryDashboardViewProps {
  profile: UserProfile;
  onSelectProject?: (project: ProjectItem) => void;
  onSubmitNewProject?: () => void;
  onOpenPassport?: (passportId: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const IndustryDashboardView: React.FC<IndustryDashboardViewProps> = ({
  profile,
  onSelectProject,
  onSubmitNewProject,
  onOpenPassport,
  onNavigateTab
}) => {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-[#FBFBFA] rounded-3xl p-6 sm:p-8 border border-black/8 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono-code text-[#737373] uppercase font-semibold tracking-wider">
                Industry Partner & Enterprise Portal
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                Enterprise Verified
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl text-[#111111] mt-1 font-normal">
              Welcome, {profile.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-[#555555] mt-1 max-w-2xl leading-relaxed">
              {profile.currentJobRole || 'Principal Cloud Architect'} at {profile.currentOrganization || 'HyperCloud Enterprise'} • Industry Expert Reviewer
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onSubmitNewProject}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Industry Project</span>
            </button>
            <button
              onClick={() => onNavigateTab?.('directory')}
              className="px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-neutral-800 text-xs font-semibold hover:bg-neutral-50 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-neutral-600" />
              <span>Discover Projects</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enterprise Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Sponsored Challenges"
          value="4 Active"
          change="Real-world problem statements"
          isPositive={true}
          icon={Trophy}
        />
        <StatsCard
          title="Expert Reviews"
          value="32 Projects"
          change="Industry architectural audits"
          isPositive={true}
          icon={ShieldCheck}
        />
        <StatsCard
          title="Student Hires / Interns"
          value="6 Recruited"
          change="Through verified Proof of Work"
          isPositive={true}
          icon={Users}
        />
        <StatsCard
          title="Enterprise Rating"
          value="9.8 / 10"
          change="Top corporate mentor"
          isPositive={true}
          icon={Award}
        />
      </div>

      {/* Sponsored Industry Challenges & Projects */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-black/8 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-700" />
              Active Industrial Challenges & Problem Statements
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Enterprise challenge briefs posted to universities for academic capstones and proof-of-concept lineages.
            </p>
          </div>
          <button
            onClick={onSubmitNewProject}
            className="text-xs font-semibold text-neutral-800 hover:text-black flex items-center gap-1 cursor-pointer"
          >
            <span>Post New Challenge</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-900">Zero-Trust Service Mesh for Edge IoT Nodes</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                Open for Student Cohorts
              </span>
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              Sponsor: HyperCloud Enterprise • 3 University teams currently building prototypes
            </div>
          </div>
          <button 
            onClick={() => onNavigateTab?.('directory')}
            className="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer self-start sm:self-auto"
          >
            Manage Submissions
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndustryDashboardView;
