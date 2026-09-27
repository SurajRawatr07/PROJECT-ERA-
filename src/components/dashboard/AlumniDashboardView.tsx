import React, { useState } from 'react';
import { 
  Award, 
  FolderGit2, 
  GitFork, 
  Users, 
  PlusCircle, 
  Compass, 
  CheckCircle2, 
  ExternalLink,
  Briefcase,
  GitBranch,
  BookOpen
} from 'lucide-react';
import { UserProfile, ProjectItem } from '../../types';
import { StatsCard } from '../common/StatsCard';

interface AlumniDashboardViewProps {
  profile: UserProfile;
  onSubmitNewProject?: () => void;
  onExploreProjects?: () => void;
  onSelectProject?: (project: ProjectItem) => void;
}

export const AlumniDashboardView: React.FC<AlumniDashboardViewProps> = ({
  profile,
  onSubmitNewProject,
  onExploreProjects,
  onSelectProject
}) => {
  const [activeTab, setActiveTab] = useState<'lineage' | 'mentees' | 'history'>('lineage');

  const lineageProjects = [
    {
      id: 'alumni-p1',
      title: 'Neuromorphic Edge Vision Pipeline',
      originalBatch: 'Batch 2024 (Founder)',
      currentBatch: 'Batch 2026 (Gen 3 Active)',
      juniorLeads: 'Suraj Rawat, Akshat K.',
      status: 'Active Evolution',
      commitsSinceGrad: 142
    },
    {
      id: 'alumni-p2',
      title: 'Decentralized Drone Telemetry Broker',
      originalBatch: 'Batch 2023',
      currentBatch: 'Batch 2025 (Gen 2)',
      juniorLeads: 'Priya N.',
      status: 'In Production',
      commitsSinceGrad: 88
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#FBFBFA] rounded-3xl p-6 sm:p-8 border border-black/8 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#737373] uppercase font-semibold tracking-wider">
                Alumni Mentorship & Project Lineage
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                Class of {profile.graduationYear || '2024'}
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl text-[#111111] mt-1 font-normal">
              Welcome back, {profile.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-[#555555] mt-1 max-w-2xl leading-relaxed">
              {profile.currentJobRole || 'Systems Engineer'} at {profile.currentOrganization || profile.currentCompany || 'NVIDIA Autonomous Vehicles'} • Alumnus of {profile.institution || 'Graphic Era Hill University'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            {onSubmitNewProject && (
              <button
                onClick={onSubmitNewProject}
                className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Continue / Submit Project</span>
              </button>
            )}
            {onExploreProjects && (
              <button
                onClick={onExploreProjects}
                className="px-4 py-2 rounded-xl bg-white border border-neutral-300 hover:bg-neutral-50 text-xs font-medium text-neutral-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Explore Projects</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="mt-6 pt-5 border-t border-black/8 flex flex-wrap items-center gap-2">
          {[
            { id: 'lineage', label: 'Inherited Project Lineages (2)' },
            { id: 'mentees', label: 'Junior Cohort Mentees (6)' },
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
          label="Past Capstones"
          value={4}
          note="Graduated repositories"
          icon={Award}
        />
        <StatsCard
          label="Active Lineages"
          value={2}
          note="Currently evolved by juniors"
          icon={GitFork}
        />
        <StatsCard
          label="Students Mentored"
          value={6}
          note="Active undergraduate advisees"
          icon={Users}
        />
        <StatsCard
          label="Verified Proof of Work"
          value="100%"
          note="Cryptographic lineage seals"
          icon={CheckCircle2}
        />
      </div>

      {activeTab === 'lineage' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lineageProjects.map(p => (
            <div key={p.id} className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs space-y-4 hover:border-black/20 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-700 flex items-center gap-1.5 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <GitFork className="w-3.5 h-3.5" />
                  Lineage Chain
                </span>
                <span className="text-[10px] font-mono text-neutral-500 font-medium">
                  {p.status}
                </span>
              </div>
              <h3 className="font-display text-base font-bold text-neutral-900 leading-snug">
                {p.title}
              </h3>
              <div className="space-y-1.5 text-xs text-neutral-600 font-sans">
                <p>Origin: <strong className="text-neutral-900">{p.originalBatch}</strong></p>
                <p>Evolution: <strong className="text-neutral-900">{p.currentBatch}</strong></p>
                <p>Current Student Leads: <strong className="text-neutral-900">{p.juniorLeads}</strong></p>
              </div>
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                <span>{p.commitsSinceGrad} commits post-grad</span>
                <span className="text-emerald-700 font-semibold">Active Lineage Passports</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'mentees' && (
        <div className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs space-y-4">
          <h3 className="font-display text-lg text-neutral-900 font-semibold">
            Undergraduate Mentees Guided
          </h3>
          <p className="text-xs text-neutral-500">
            Current students building on your open-source lineage or seeking industry mentorship.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: 'Suraj Rawat', role: 'Lead Architect', proj: 'Autonomous Drone Swarm Guidance', batch: '2027' },
              { name: 'Akshat Kumar', role: 'Systems Engineer', proj: 'Neuromorphic Edge Vision Pipeline', batch: '2026' }
            ].map((m, i) => (
              <div key={i} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 text-xs space-y-1">
                <span className="font-bold text-neutral-900 text-sm block">{m.name}</span>
                <span className="text-neutral-500 block">{m.role} • Batch {m.batch}</span>
                <span className="font-mono text-emerald-800 text-[11px] block mt-1">{m.proj}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
