import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  GitCommit, 
  GitPullRequest, 
  GitBranch, 
  ShieldCheck, 
  FileCheck2, 
  ExternalLink, 
  Printer, 
  Share2, 
  Check, 
  Copy,
  Calendar,
  Sparkles,
  Building2,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { ProofOfWorkTimelineEvent } from '../../types';
import { PassportQRCode } from '../common/PassportQRCode';

interface ProofOfWorkViewProps {
  userProfile: any;
  className?: string;
  onOpenProject?: (projectId: string) => void;
}

export const ProofOfWorkView: React.FC<ProofOfWorkViewProps> = ({
  userProfile,
  className = '',
  onOpenProject
}) => {
  const [copiedTranscript, setCopiedTranscript] = useState(false);

  const fullName = userProfile?.fullName || 'Suraj Rawat';
  const role = userProfile?.role || 'STUDENT';
  const institution = userProfile?.institution || 'Graphic Era Hill University';
  const department = userProfile?.department || 'Dept of Computer Science & Engineering';
  const credentialId = `PV-CRED-${(userProfile?.id || 'usr-01').toUpperCase()}-2026`;
  const signatureHash = '0x8f2a9b4c7d1e8a9301c48f2a9b4c7d1e8a9301c4';

  const stats = {
    projectsCreated: 2,
    projectsJoined: 6,
    totalContributions: 23,
    completedTasks: 38,
    facultyReviewsReceived: 4,
    mentorshipSessions: 3,
    verifiedSkillsCount: 6,
    githubCommitsCount: userProfile?.commitsCount || 384,
    lineageContributionsCount: 5
  };

  const verifiedSkills = [
    'React 19 & PWA',
    'TypeScript (Strict Mode)',
    'Distributed Graph Routing',
    'Bluetooth Low Energy (BLE)',
    'Vector Mapping (Leaflet / GeoJSON)',
    'Architecture Decision Records (ADR)'
  ];

  // Chronological Proof of Work timeline strictly fulfilling Requirement 12
  const timelineEvents: ProofOfWorkTimelineEvent[] = [
    {
      id: 'pow-6',
      type: 'CONTINUED_PROJECT',
      title: 'Inherited Smart Campus Navigation & Started v2.0 Roadmap',
      projectTitle: 'Smart Campus Navigation & Accessibility System',
      projectId: 'proj-nav',
      timestamp: 'September 2026',
      details: 'Accepted project handover from graduating Batch 2024. Initiated elevator telemetry integration and multi-floor pathfinding graph.',
      verified: true,
      hash: '0x99281a0bfe48'
    },
    {
      id: 'pow-5',
      type: 'MENTORED',
      title: 'Conducted Architecture Peer Review for Junior Capstone Cohort',
      projectTitle: 'VoltaGrid Peer Energy Market',
      projectId: 'proj-3',
      timestamp: 'August 2026',
      details: 'Mentored incoming electrical engineering batch on MQTT event brokering and state synchronization.',
      verified: true,
      hash: '0x1928374901ac'
    },
    {
      id: 'pow-4',
      type: 'FACULTY_REVIEWED',
      title: 'Academic Milestone Certification Signed by HOD',
      projectTitle: 'AeroSync: Edge-Neuromorphic Drone Guidance',
      projectId: 'proj-1',
      timestamp: 'June 2026',
      details: 'Dr. Anil Sharma certified sub-millisecond odometry benchmark with rubric score of 9.4/10.0.',
      verified: true,
      hash: '0x8f2d1e90bca4'
    },
    {
      id: 'pow-3',
      type: 'COMPLETED_TASK',
      title: 'Resolved Critical RSSI Bluetooth Triangulation Drift Bug',
      projectTitle: 'Smart Campus Navigation & Accessibility System',
      projectId: 'proj-nav',
      timestamp: 'April 2026',
      details: 'Implemented Kalman filter smoothing algorithm reducing corridor location jitter from 4.2m to 1.1m.',
      verified: true,
      hash: '0x3c71a9e88d01'
    },
    {
      id: 'pow-2',
      type: 'CONTRIBUTED',
      title: 'Merged 42 Commits into Core Swarm Mesh Pipeline',
      projectTitle: 'AeroSync: Edge-Neuromorphic Drone Guidance',
      projectId: 'proj-1',
      timestamp: 'January 2026',
      details: 'Ported visual odometry sensor node to ROS 2 Humble C++20 with zero-copy shared memory.',
      verified: true,
      hash: '0x1209384bca71'
    },
    {
      id: 'pow-1',
      type: 'CREATED_PROJECT',
      title: 'Registered Project Passport & Architecture Blueprint',
      projectTitle: 'Campus Autonomous Delivery Rover',
      projectId: 'proj-rover',
      timestamp: 'September 2025',
      details: 'Initial project registration with open contributor roles and permanent passport PV-2025-GEHU-CS089.',
      verified: true,
      hash: '0x772819401283'
    }
  ];

  const handleCopyTranscript = () => {
    navigator.clipboard?.writeText(
      `ProjectVerse Verified Proof of Work Transcript for ${fullName} (${institution}) - ID: ${credentialId}`
    );
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2500);
  };

  const getEventBadge = (type: ProofOfWorkTimelineEvent['type']) => {
    switch (type) {
      case 'CREATED_PROJECT':
        return <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-neutral-900 text-white">Created Project</span>;
      case 'CONTRIBUTED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-blue-100 text-blue-900">Contributed Code</span>;
      case 'COMPLETED_TASK':
        return <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-purple-100 text-purple-900">Completed Task</span>;
      case 'FACULTY_REVIEWED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-100 text-emerald-900">Faculty Reviewed</span>;
      case 'MENTORED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-100 text-amber-900">Mentored Cohort</span>;
      case 'CONTINUED_PROJECT':
        return <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-indigo-100 text-indigo-900">Continued Project</span>;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Official Certificate Style Banner */}
      <div className="rounded-3xl bg-white border border-black/10 p-6 sm:p-8 md:p-9 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-black/8">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#111111] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Award className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Academic Proof of Work</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#111111]">
                {fullName}
              </h1>
              <p className="text-xs text-[#737373] mt-0.5">
                {institution} • {department}
              </p>
            </div>
          </div>

          {/* QR Code and Actions */}
          <div className="flex items-center gap-4">
            <PassportQRCode value={`https://projectverse.dev/pow/${credentialId}`} size={84} />
            <div className="space-y-1.5 no-print">
              <button
                onClick={handleCopyTranscript}
                className="w-full px-3.5 py-1.5 rounded-xl bg-[#F7F7F5] hover:bg-[#ECECE9] border border-black/8 text-xs font-medium text-[#111111] inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                {copiedTranscript ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTranscript ? 'Transcript Copied' : 'Copy Credential'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="w-full px-3.5 py-1.5 rounded-xl bg-[#111111] hover:bg-black text-white text-xs font-medium inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Certificate</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Metric Headline Pillars (Strict Requirement 12) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
          <div className="p-4 rounded-2xl bg-[#FBFBFA] border border-black/6">
            <span className="text-[10px] font-bold text-[#737373] uppercase tracking-wider block">
              Projects Involved
            </span>
            <span className="text-2xl font-bold font-mono text-[#111111] block mt-0.5">
              8 Projects
            </span>
            <span className="text-[11px] text-[#737373] block">
              {stats.projectsCreated} Created • {stats.projectsJoined} Joined
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FBFBFA] border border-black/6">
            <span className="text-[10px] font-bold text-[#737373] uppercase tracking-wider block">
              Technical Evidence
            </span>
            <span className="text-2xl font-bold font-mono text-emerald-700 block mt-0.5">
              23 Contributions
            </span>
            <span className="text-[11px] text-[#737373] block">
              {stats.githubCommitsCount} Commits • {stats.completedTasks} Tasks
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FBFBFA] border border-black/6">
            <span className="text-[10px] font-bold text-[#737373] uppercase tracking-wider block">
              Verified Capabilities
            </span>
            <span className="text-2xl font-bold font-mono text-indigo-700 block mt-0.5">
              4 Verified Skills
            </span>
            <span className="text-[11px] text-[#737373] block">
              Peer & Faculty Validated
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FBFBFA] border border-black/6">
            <span className="text-[10px] font-bold text-[#737373] uppercase tracking-wider block">
              Continuity & Mentorship
            </span>
            <span className="text-2xl font-bold font-mono text-amber-700 block mt-0.5">
              3 Mentorships
            </span>
            <span className="text-[11px] text-[#737373] block">
              5 Lineage Batches
            </span>
          </div>
        </div>

        {/* Verified Skills Badges */}
        <div className="pt-4 border-t border-black/6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#737373] block mb-2">
            Verified Skill Sign-offs
          </span>
          <div className="flex flex-wrap gap-2">
            {verifiedSkills.map((sk) => (
              <span
                key={sk}
                className="px-3 py-1.5 rounded-xl bg-[#F7F7F5] border border-black/8 text-xs font-mono font-medium text-[#111111] inline-flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>{sk}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Chronological Proof of Work Timeline */}
      <div className="rounded-3xl bg-white border border-black/10 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#737373]">
            Verified Career Evidence
          </span>
          <h3 className="text-lg font-bold text-[#111111]">
            Chronological Proof of Work Progression
          </h3>
          <p className="text-xs text-neutral-600 mt-0.5">
            Every step in the student's journey is cryptographically hashed: Created Project → Contributed → Completed Task → Faculty Reviewed → Mentored → Continued Project.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-dashed border-neutral-300 space-y-6 ml-2 sm:ml-4">
          {timelineEvents.map((ev) => (
            <div key={ev.id} className="relative group">
              {/* Dot icon indicator */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white border-2 border-black flex items-center justify-center text-[10px] font-bold">
                ✓
              </div>

              {/* Event Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF9F6] border border-black/8 hover:bg-white hover:border-black/20 transition-all space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getEventBadge(ev.type)}
                    <span className="text-xs text-[#737373] font-medium">{ev.timestamp}</span>
                  </div>
                  <span className="font-mono text-[10.5px] text-[#737373]">
                    Block: {ev.hash}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#111111]">
                  {ev.title}
                </h4>

                <p className="text-xs text-neutral-700 leading-relaxed">
                  {ev.details}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-black/4 text-xs">
                  <span className="text-[#737373]">
                    Associated Project: <strong>{ev.projectTitle}</strong>
                  </span>
                  {onOpenProject && (
                    <button
                      onClick={() => onOpenProject(ev.projectId)}
                      className="text-xs font-semibold text-[#111111] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Passport</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cryptographic Signature Seal */}
        <div className="pt-4 border-t border-black/8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#737373] font-mono">
          <span>Immutable Ledger Hash: {signatureHash}</span>
          <span className="text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-bold">
            All 6 Events Verified on ProjectVerse
          </span>
        </div>
      </div>
    </div>
  );
};
