import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Users, 
  Code2, 
  GraduationCap, 
  ArrowRight, 
  ChevronRight, 
  Info,
  Sliders,
  FolderGit2
} from 'lucide-react';
import { ProjectItem, SmartMatchResult } from '../../types';
import { computeSmartMatch } from '../../lib/ecosystemData';
import { getInitialsAvatar } from '../../lib/authService';

interface ExplainableMatchingViewProps {
  projects: ProjectItem[];
  currentUserProfile?: any;
  onSelectProject?: (project: ProjectItem) => void;
  onConnectCandidate?: (candidateName: string, projectTitle: string) => void;
}

export const ExplainableMatchingView: React.FC<ExplainableMatchingViewProps> = ({
  projects,
  currentUserProfile,
  onSelectProject,
  onConnectCandidate
}) => {
  const [matchType, setMatchType] = useState<'STUDENT_TO_PROJECT' | 'PROJECT_TO_DEVELOPER' | 'PROJECT_TO_MENTOR'>('STUDENT_TO_PROJECT');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || 'proj-nav');
  const [connectToast, setConnectToast] = useState<string | null>(null);

  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  // Candidates for smart matching
  const candidatePool = [
    {
      id: 'cand-1',
      name: 'Suraj Rawat',
      role: 'Frontend / PWA Architect',
      skills: ['React 19', 'TypeScript', 'Tailwind CSS', 'Leaflet', 'GeoJSON'],
      domain: 'Web & Mobile Apps',
      availabilityHours: 15,
      avatar: getInitialsAvatar('Suraj Rawat', 'STUDENT')
    },
    {
      id: 'cand-2',
      name: 'Elena Rostova',
      role: 'Cryptographic Engineer',
      skills: ['Rust', 'Circom', 'ZK-SNARKs', 'Python', 'FastAPI'],
      domain: 'Healthcare & Biotech',
      availabilityHours: 12,
      avatar: getInitialsAvatar('Elena Rostova', 'STUDENT')
    },
    {
      id: 'cand-3',
      name: 'Devansh Kulkarni',
      role: 'Robotics & SLAM Specialist',
      skills: ['C++', 'ROS 2', 'PyTorch', 'NVIDIA Jetson', 'CUDA'],
      domain: 'Autonomous Systems & Robotics',
      availabilityHours: 20,
      avatar: getInitialsAvatar('Devansh Kulkarni', 'STUDENT')
    },
    {
      id: 'cand-4',
      name: 'Dr. Kimberly Vance',
      role: 'Research Advisor & Privacy Chair',
      skills: ['Zero-Knowledge Cryptography', 'Bioinformatics', 'Research Governance'],
      domain: 'Healthcare & Biotech',
      availabilityHours: 8,
      avatar: getInitialsAvatar('Dr. Kimberly Vance', 'FACULTY')
    }
  ];

  // Compute explainable match results for active project
  const matchResults: SmartMatchResult[] = candidatePool.map(cand =>
    computeSmartMatch(cand, activeProject)
  ).sort((a, b) => b.overallMatchPercentage - a.overallMatchPercentage);

  const handleConnect = (candName: string) => {
    setConnectToast(`Collaboration invite sent to ${candName} for ${activeProject.title}!`);
    if (onConnectCandidate) {
      onConnectCandidate(candName, activeProject.title);
    }
    setTimeout(() => setConnectToast(null), 3500);
  };

  const projectDNA = activeProject?.dna;

  return (
    <div className="space-y-6">
      {connectToast && (
        <div className="p-4 rounded-2xl bg-neutral-900 text-white text-xs font-medium flex items-center justify-between shadow-lg">
          <span>{connectToast}</span>
          <button onClick={() => setConnectToast(null)} className="text-neutral-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Header and Project DNA Showcase */}
      <div className="rounded-3xl bg-white border border-black/10 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-black/8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111111] text-white text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Explainable Smart Matching</span>
            </div>
            <h2 className="text-2xl font-bold text-[#111111]">
              Project DNA & Candidate Compatibility
            </h2>
            <p className="text-xs text-[#737373] mt-1 max-w-2xl">
              Matching is grounded in explicit criteria: skill overlap, domain alignment, required role fit, and sprint milestone availability. No black-box percentages.
            </p>
          </div>

          {/* Project Switcher */}
          <div className="w-full lg:w-72">
            <label className="text-[11px] font-bold text-[#737373] uppercase tracking-wider block mb-1.5">
              Select Target Project
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-black/10 bg-[#FBFBFA] text-xs font-medium text-[#111111] focus:outline-none focus:border-black"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Structured Project DNA Breakdown */}
        {projectDNA && (
          <div className="pt-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#737373] block mb-3">
              Target Project DNA Attributes
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-[#FBFBFA] border border-black/6">
                <span className="text-[10px] text-[#737373] block uppercase font-bold">Domain</span>
                <span className="text-xs font-bold text-[#111111] mt-0.5 block truncate">{projectDNA.domain}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#FBFBFA] border border-black/6">
                <span className="text-[10px] text-[#737373] block uppercase font-bold">Difficulty</span>
                <span className="text-xs font-bold text-[#111111] mt-0.5 block">{projectDNA.difficulty}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#FBFBFA] border border-black/6">
                <span className="text-[10px] text-[#737373] block uppercase font-bold">Project Stage</span>
                <span className="text-xs font-bold text-[#111111] mt-0.5 block">{projectDNA.projectStage}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#FBFBFA] border border-black/6">
                <span className="text-[10px] text-[#737373] block uppercase font-bold">Required Roles</span>
                <span className="text-xs font-bold text-[#111111] mt-0.5 block truncate">{projectDNA.requiredRoles.join(', ')}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-3">
              <span className="text-[11px] font-semibold text-[#737373] mr-1">Required Tech Stack:</span>
              {projectDNA.technologies.map((t) => (
                <span key={t} className="px-2.5 py-0.5 rounded-lg bg-[#F5F5F3] border border-black/6 text-[11px] font-mono text-[#111111]">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Match Results List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#737373] px-1">
          Ranked Candidate Matches for {activeProject.title} ({matchResults.length})
        </h3>

        {matchResults.map((result) => (
          <div 
            key={result.candidateId}
            className="rounded-3xl bg-white border border-black/10 p-5 sm:p-7 shadow-xs hover:border-black/20 transition-all space-y-4"
          >
            {/* Top Candidate Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src={result.candidateAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'} 
                  alt={result.candidateName}
                  className="w-12 h-12 rounded-2xl object-cover border border-black/10 shadow-2xs"
                />
                <div>
                  <h4 className="text-base font-bold text-[#111111]">{result.candidateName}</h4>
                  <p className="text-xs text-[#737373]">{result.candidateRole}</p>
                </div>
              </div>

              {/* Big Score Badge */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs font-semibold text-[#737373] block uppercase tracking-wider">
                    Compatibility Index
                  </span>
                  <div className="flex items-baseline gap-1 justify-end">
                    <span className="text-3xl font-extrabold font-mono text-[#111111]">
                      {result.overallMatchPercentage}%
                    </span>
                    <span className="text-xs text-emerald-700 font-bold">Match</span>
                  </div>
                </div>

                <button
                  onClick={() => handleConnect(result.candidateName)}
                  className="btn-primary-black px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                >
                  <span>Connect</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Explainable Factor Breakdown (Strict requirement 10) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2">
              {result.breakdown.map((f, fIdx) => (
                <div key={fIdx} className="p-3 rounded-2xl bg-[#FBFBFA] border border-black/6 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-bold text-[#737373] uppercase truncate">
                      {f.criteria}
                    </span>
                    <span className="text-emerald-700 font-mono font-bold text-xs">
                      +{f.scoreContribution}% ✓
                    </span>
                  </div>
                  <p className="text-[11px] text-[#555555] leading-snug">
                    {f.details}
                  </p>
                </div>
              ))}
            </div>

            {/* Human Readable Explanation Statement */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-xs text-emerald-950 flex items-start gap-2">
              <span className="font-bold text-emerald-700 shrink-0">✓</span>
              <p>
                <strong>Why this candidate matches:</strong> {result.explanation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
