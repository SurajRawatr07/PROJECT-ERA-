import React, { useState } from 'react';
import { 
  FlaskConical, 
  FolderGit2, 
  BookOpen, 
  PlusCircle, 
  Compass, 
  Users, 
  Award, 
  ExternalLink,
  FileText,
  Search,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { UserProfile, ProjectItem } from '../../types';
import { StatsCard } from '../common/StatsCard';

interface ResearcherDashboardViewProps {
  profile: UserProfile;
  onSubmitNewProject?: () => void;
  onExploreProjects?: () => void;
  onSelectProject?: (project: ProjectItem) => void;
}

export const ResearcherDashboardView: React.FC<ResearcherDashboardViewProps> = ({
  profile,
  onSubmitNewProject,
  onExploreProjects,
  onSelectProject
}) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'publications' | 'collaborations'>('projects');

  const researchProjects = [
    {
      id: 'res-proj-1',
      title: 'Decentralized Federated Learning for Edge Diagnostics',
      domain: 'Healthcare & Biotech',
      stage: 'Pre-print & Evaluation',
      lab: 'DeepMind / GEHU Research Node',
      citations: 18,
      status: 'Peer Reviewed',
      dataset: '12.4 GB Telemetry'
    },
    {
      id: 'res-proj-2',
      title: 'Neuromorphic Spike-Timing Computation for Sensor Networks',
      domain: 'Autonomous Systems & Robotics',
      stage: 'Active Experimentation',
      lab: 'Neuromorphic Systems Lab',
      citations: 9,
      status: 'In Progress',
      dataset: 'Open Benchmark'
    }
  ];

  const publications = [
    { title: 'Privacy-Preserving Consensus in Multi-Institutional Health Networks', journal: 'IEEE Transactions on Network Science', year: '2025', doi: '10.1109/TNS.2025.3401' },
    { title: 'Sub-milliwatt Neuromorphic Object Tracking on Micro-UAVs', journal: 'ACM Journal on Autonomous Systems', year: '2025', doi: '10.1145/3699102.37012' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#FBFBFA] rounded-3xl p-6 sm:p-8 border border-black/8 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#737373] uppercase font-semibold tracking-wider">
                Research Node & Investigator
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-bold">
                ORCID Verified
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl text-[#111111] mt-1 font-normal">
              {profile.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-[#555555] mt-1 max-w-2xl leading-relaxed">
              {profile.designation || 'Principal Research Fellow'} • {profile.department || 'Department of Computing & Advanced AI'} • {profile.institution || 'GEHU Research Node'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            {onSubmitNewProject && (
              <button
                onClick={onSubmitNewProject}
                className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Submit Research Project</span>
              </button>
            )}
            {onExploreProjects && (
              <button
                onClick={onExploreProjects}
                className="px-4 py-2 rounded-xl bg-white border border-neutral-300 hover:bg-neutral-50 text-xs font-medium text-neutral-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Explore Research</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="mt-6 pt-5 border-t border-black/8 flex flex-wrap items-center gap-2">
          {[
            { id: 'projects', label: 'Research Projects & Artifacts' },
            { id: 'publications', label: 'Peer Publications & Preprints' },
            { id: 'collaborations', label: 'Cross-Lab Collaborations' },
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
          label="Research Artifacts"
          value={researchProjects.length}
          note="Active experimental pipelines"
          icon={FlaskConical}
        />
        <StatsCard
          label="Peer Publications"
          value={8}
          note="Indexed journals & conferences"
          icon={BookOpen}
        />
        <StatsCard
          label="Citations"
          value="42+"
          note="Academic peer references"
          icon={Award}
        />
        <StatsCard
          label="Lab Collaborators"
          value={12}
          note="Cross-institutional fellows"
          icon={Users}
        />
      </div>

      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {researchProjects.map(p => (
            <div key={p.id} className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs space-y-4 hover:border-black/20 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-neutral-900 flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5 text-neutral-600" />
                  {p.domain}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-bold">
                  {p.status}
                </span>
              </div>
              <h3 className="font-display text-base font-bold text-neutral-900 leading-snug">
                {p.title}
              </h3>
              <p className="text-xs text-neutral-500">
                Lab: {p.lab} • {p.stage}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-xs text-neutral-600">
                <span>{p.dataset}</span>
                <span className="font-semibold text-purple-900">{p.citations} citations</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'publications' && (
        <div className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs space-y-4">
          <div className="pb-3 border-b border-neutral-100">
            <h3 className="font-display text-lg text-neutral-900 font-semibold">
              Published Papers & Research Indices
            </h3>
            <p className="text-xs text-neutral-500">
              Verified papers connected to ProjectVerse research passports and DOI hashes.
            </p>
          </div>
          <div className="space-y-3">
            {publications.map((pub, i) => (
              <div key={i} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-neutral-900 text-sm">{pub.title}</h4>
                  <p className="text-neutral-500 text-xs mt-0.5">{pub.journal} • {pub.year}</p>
                </div>
                <span className="font-mono text-neutral-500 text-[11px]">{pub.doi}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'collaborations' && (
        <div className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs space-y-4 text-center py-10">
          <Users className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
          <h3 className="font-display text-base font-bold text-neutral-900">
            Connected Research Fellowships
          </h3>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            You are currently collaborating with 3 university labs across distributed edge intelligence and robotics.
          </p>
        </div>
      )}
    </div>
  );
};
