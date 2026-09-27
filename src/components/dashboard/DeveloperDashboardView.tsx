import React, { useState } from 'react';
import { 
  Code2, 
  FolderGit2, 
  GitBranch, 
  GitPullRequest, 
  CheckCircle2, 
  PlusCircle, 
  Compass, 
  Users, 
  Award, 
  ExternalLink,
  Flame,
  Terminal,
  Activity,
  Github
} from 'lucide-react';
import { UserProfile, ProjectItem } from '../../types';
import { StatsCard } from '../common/StatsCard';

interface DeveloperDashboardViewProps {
  profile: UserProfile;
  onSubmitNewProject?: () => void;
  onExploreProjects?: () => void;
  onSelectProject?: (project: ProjectItem) => void;
}

export const DeveloperDashboardView: React.FC<DeveloperDashboardViewProps> = ({
  profile,
  onSubmitNewProject,
  onExploreProjects,
  onSelectProject
}) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'contributions' | 'repos'>('projects');

  const openSourceProjects = [
    {
      id: 'dev-proj-1',
      title: 'ChronosDB — High-Throughput Time-Series Engine',
      stars: 480,
      forks: 72,
      commits: 214,
      tech: ['Rust', 'Wasm', 'Distributed Consensus'],
      status: 'Active Maintainer',
      role: 'Core Architect'
    },
    {
      id: 'dev-proj-2',
      title: 'VectorEdge — Low-Latency Embedding Indexer',
      stars: 310,
      forks: 44,
      commits: 98,
      tech: ['TypeScript', 'C++', 'SIMD'],
      status: 'Open Source',
      role: 'Author'
    }
  ];

  const recentCommits = [
    { repo: 'ChronosDB', hash: '8f2a9c1', msg: 'feat: add zero-copy WAL memory mapping', date: '3 hours ago' },
    { repo: 'VectorEdge', hash: '3e41b02', msg: 'perf: optimize SIMD cosine similarity loop', date: 'Yesterday' },
    { repo: 'ProjectVerse-Core', hash: '1a9b44c', msg: 'refactor: federated lineage graph traversal', date: '3 days ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#FBFBFA] rounded-3xl p-6 sm:p-8 border border-black/8 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#737373] uppercase font-semibold tracking-wider">
                Developer & Systems Architect
              </span>
              <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200 text-[10px] font-bold">
                Open Source Builder
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl text-[#111111] mt-1 font-normal">
              Welcome back, {profile.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-[#555555] mt-1 max-w-2xl leading-relaxed">
              Maintain open-source architectures, publish verifiable commit logs, and collaborate across technical lineages.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            {onSubmitNewProject && (
              <button
                onClick={onSubmitNewProject}
                className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Submit Project</span>
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
            { id: 'projects', label: 'My Repositories & Systems' },
            { id: 'contributions', label: 'Technical Contributions & Telemetry' },
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
          label="Open Repositories"
          value={openSourceProjects.length}
          note="Active codebases"
          icon={FolderGit2}
        />
        <StatsCard
          label="GitHub Commits"
          value="480+"
          note="Verified signed commits"
          icon={Code2}
        />
        <StatsCard
          label="Pull Requests Merged"
          value={34}
          note="Cross-project contributions"
          icon={GitPullRequest}
        />
        <StatsCard
          label="Proof of Work"
          value="100%"
          note="Cryptographic git integrity"
          icon={CheckCircle2}
        />
      </div>

      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {openSourceProjects.map(p => (
            <div key={p.id} className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs space-y-4 hover:border-black/20 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-neutral-900 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-neutral-600" />
                  {p.role}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                  {p.status}
                </span>
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-neutral-900 leading-snug">
                  {p.title}
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {p.tech.map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-mono text-[10px]">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-xs text-neutral-600">
                <span>★ {p.stars} stars</span>
                <span>{p.commits} commits</span>
                <span>{p.forks} forks</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'contributions' && (
        <div className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs space-y-4">
          <div className="pb-3 border-b border-neutral-100">
            <h3 className="font-display text-lg text-neutral-900 font-semibold">
              Live Git Commit & Telemetry Activity
            </h3>
            <p className="text-xs text-neutral-500">
              Verified cryptographic commit logs linked to your developer identity.
            </p>
          </div>
          <div className="space-y-3">
            {recentCommits.map((c, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-neutral-400">{c.hash}</span>
                  <span className="font-medium text-neutral-800">{c.msg}</span>
                  <span className="px-2 py-0.5 rounded bg-neutral-200/60 text-neutral-700 font-mono text-[10px]">{c.repo}</span>
                </div>
                <span className="text-neutral-400 font-mono text-[11px]">{c.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
