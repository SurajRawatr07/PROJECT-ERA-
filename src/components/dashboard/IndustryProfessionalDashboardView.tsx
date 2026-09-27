import React, { useState } from 'react';
import { 
  Briefcase, 
  FolderGit2, 
  CheckCircle2, 
  PlusCircle, 
  Compass, 
  Users, 
  Award, 
  ExternalLink,
  ShieldCheck,
  Target,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { UserProfile, ProjectItem } from '../../types';
import { StatsCard } from '../common/StatsCard';

interface IndustryProfessionalDashboardViewProps {
  profile: UserProfile;
  onSubmitNewProject?: () => void;
  onExploreProjects?: () => void;
  onSelectProject?: (project: ProjectItem) => void;
}

export const IndustryProfessionalDashboardView: React.FC<IndustryProfessionalDashboardViewProps> = ({
  profile,
  onSubmitNewProject,
  onExploreProjects,
  onSelectProject
}) => {
  const [activeTab, setActiveTab] = useState<'challenges' | 'reviews' | 'mentorship'>('challenges');

  const industryChallenges = [
    {
      id: 'ind-ch-1',
      title: 'Zero-Trust Distributed Session Ledger Benchmark',
      company: 'HyperCloud Enterprise Solutions',
      bounty: 'Sponsored Pilot & Mentorship',
      status: 'Active Cohort',
      studentTeams: 3,
      submissions: 5
    },
    {
      id: 'ind-ch-2',
      title: 'High-Throughput eBPF Observability Probe',
      company: 'HyperCloud Enterprise Solutions',
      bounty: 'Industry Grant & Fast-Track Interview',
      status: 'Under Evaluation',
      studentTeams: 2,
      submissions: 4
    }
  ];

  const pendingReviews = [
    { id: 'rev-1', title: 'Autonomous Drone Swarm Guidance', team: 'Suraj Rawat et al.', rubric: 'Engineering Scalability', score: '9.4/10' },
    { id: 'rev-2', title: 'Decentralized Microgrid Controller', team: 'Arjun Das et al.', rubric: 'Fault-Tolerance & Redundancy', score: '8.9/10' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#FBFBFA] rounded-3xl p-6 sm:p-8 border border-black/8 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#737373] uppercase font-semibold tracking-wider">
                Industry Partner & Enterprise Mentor
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                Industry Verified
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl text-[#111111] mt-1 font-normal">
              {profile.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-[#555555] mt-1 max-w-2xl leading-relaxed">
              {profile.currentJobRole || 'Principal Cloud Architect'} at {profile.currentOrganization || profile.currentCompany || 'HyperCloud Enterprise Solutions'} • Sponsoring academic capstones & reviewing real-world architectures.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            {onSubmitNewProject && (
              <button
                onClick={onSubmitNewProject}
                className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Post Industry Challenge</span>
              </button>
            )}
            {onExploreProjects && (
              <button
                onClick={onExploreProjects}
                className="px-4 py-2 rounded-xl bg-white border border-neutral-300 hover:bg-neutral-50 text-xs font-medium text-neutral-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Discover Projects</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="mt-6 pt-5 border-t border-black/8 flex flex-wrap items-center gap-2">
          {[
            { id: 'challenges', label: 'Sponsored Industry Challenges (2)' },
            { id: 'reviews', label: 'Expert Rubric Reviews (2)' },
            { id: 'mentorship', label: 'Mentorship & Capstone Sponsoring' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'bg-white border border-neutral-200/80 text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatsCard
          label="Active Challenges"
          value={industryChallenges.length}
          note="Sponsored student cohorts"
          icon={Target}
        />
        <StatsCard
          label="Expert Reviews"
          value={14}
          note="Architectural rubrics signed"
          icon={ShieldCheck}
        />
        <StatsCard
          label="Student Teams Guided"
          value={5}
          note="Production-bound teams"
          icon={Users}
        />
        <StatsCard
          label="Pilots Seeded"
          value={3}
          note="Enterprise technology pilots"
          icon={Sparkles}
        />
      </div>

      {activeTab === 'challenges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {industryChallenges.map(c => (
            <div key={c.id} className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs space-y-4 hover:border-black/20 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-neutral-900 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-neutral-600" />
                  {c.company}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                  {c.status}
                </span>
              </div>
              <h3 className="font-display text-base font-bold text-neutral-900 leading-snug">
                {c.title}
              </h3>
              <p className="text-xs text-neutral-500">
                Incentive: <strong className="text-neutral-900 font-semibold">{c.bounty}</strong>
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-xs text-neutral-600">
                <span>{c.studentTeams} teams participating</span>
                <span>{c.submissions} submitted milestones</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs space-y-4">
          <h3 className="font-display text-lg text-neutral-900 font-semibold">
            Industry Architectural Evaluations
          </h3>
          <p className="text-xs text-neutral-500">
            Provide expert industry feedback and evaluate real-world production readiness.
          </p>
          <div className="space-y-3">
            {pendingReviews.map(r => (
              <div key={r.id} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-neutral-900 text-sm">{r.title}</h4>
                  <p className="text-neutral-500 text-xs mt-0.5">{r.team} • Criterion: {r.rubric}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                    {r.score}
                  </span>
                  <button className="px-3 py-1.5 rounded-xl bg-white border border-neutral-300 text-xs font-medium text-neutral-800 hover:bg-neutral-50 cursor-pointer">
                    Inspect Rubric
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'mentorship' && (
        <div className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs space-y-4 text-center py-10">
          <Users className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
          <h3 className="font-display text-base font-bold text-neutral-900">
            Enterprise Mentorship & Office Hours
          </h3>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            You offer bi-weekly architectural office hours for university teams building distributed cloud and security capstones.
          </p>
        </div>
      )}
    </div>
  );
};
