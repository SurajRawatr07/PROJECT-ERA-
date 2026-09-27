import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  Building2, 
  FileCheck2, 
  Share2, 
  GitFork, 
  Check, 
  ArrowDown, 
  Users,
  Copy,
  Printer,
  QrCode,
  Calendar,
  Activity,
  Award,
  Layers,
  Code2,
  FolderGit2,
  BookOpen,
  Eye,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { ProjectItem } from '../../types';
import { PassportQRCode } from '../common/PassportQRCode';
import { ProjectHealthCard } from '../health/ProjectHealthCard';
import { ContributionEvidenceView } from '../evidence/ContributionEvidenceView';
import { ProjectLineageView } from '../lineage/ProjectLineageView';

interface ProjectPassportModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onContinueProject?: (project: ProjectItem) => void;
  onOpenHandover?: (project: ProjectItem) => void;
}

export const ProjectPassportModal: React.FC<ProjectPassportModalProps> = ({
  project,
  onClose,
  onContinueProject,
  onOpenHandover
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'IDENTITY' | 'HEALTH' | 'LINEAGE' | 'EVIDENCE'>('IDENTITY');
  const [showPrintView, setShowPrintView] = useState(false);
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);

  if (!project) return null;

  const passport = project.passport || ({} as any);
  const passportId = passport.passportId || project.passportId || 'PV-2026-00124';
  const qrHash = passport.qrHash || '0x9b4c7d1e8a9301c48f2a9b4c7d1e8a9301c47721';
  const difficulty = project.difficulty || passport.difficulty || 'Intermediate';
  const stage = project.currentStage || passport.currentStage || 'Production';
  const createdDate = project.createdDate || passport.createdDate || 'February 2024';
  const lastActivity = project.lastActivityDate || passport.lastActivityDate || 'Recently';
  const creator = project.creator?.name || project.contributors?.[0]?.name || 'Lead Creator';
  const mentor = passport.mentorName || passport.facultyReviewer?.name || 'Assigned Faculty Mentor';

  const handleCopyId = () => {
    navigator.clipboard?.writeText(passportId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/project/${project.id}`;
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Dialog Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.2 }}
          className={`relative z-10 w-full ${showPrintView ? 'max-w-4xl' : 'max-w-3xl'} max-h-[92vh] overflow-y-auto bg-white rounded-3xl border border-black/15 shadow-2xl p-5 sm:p-8 md:p-9 text-[#111111]`}
        >
          {/* Close & Print Buttons */}
          <div className="absolute top-4 right-4 sm:top-5 sm:right-5 flex items-center gap-1.5 no-print">
            <button
              onClick={() => setShowPrintView(!showPrintView)}
              className="px-3 py-1.5 rounded-full bg-[#F5F5F3] hover:bg-[#ECECE9] border border-black/8 text-xs font-semibold text-[#111111] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Toggle Certificate Print View"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{showPrintView ? 'Interactive View' : 'Printable Transcript'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F5F5F3] hover:bg-black hover:text-white border border-black/8 flex items-center justify-center text-[#4A4A4A] transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Official Sealed Document Header */}
          <div className="pb-5 mb-5 border-b border-black/10">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F5F3] border border-black/8 text-[11px] font-bold text-[#111111] uppercase tracking-wider">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Project Passport</span>
              </div>

              {/* Passport Permanent ID with Copy Button */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#737373]">Permanent Passport ID:</span>
                <button
                  onClick={handleCopyId}
                  className="px-3 py-1 rounded-lg bg-[#111111] text-white text-xs font-bold font-mono tracking-wider inline-flex items-center gap-1.5 hover:bg-black cursor-pointer shadow-2xs"
                  title="Click to copy Passport ID"
                >
                  <span>{passportId}</span>
                  {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-neutral-300" />}
                </button>
              </div>
            </div>

            {/* Title & Tagline */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="max-w-xl">
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#111111] leading-tight">
                  {project.title}
                </h1>
                <p className="text-sm text-neutral-600 font-body mt-2 leading-relaxed">
                  {project.tagline || project.description}
                </p>
              </div>

              {/* Vector Scannable SVG QR Code */}
              <div className="shrink-0 flex flex-col items-center">
                <PassportQRCode value={`https://projectverse.dev/passport/${passportId}`} size={92} />
                <span className="text-[9.5px] font-mono text-[#737373] mt-1">Scan for Ledger</span>
              </div>
            </div>

            {/* Utility Bar: Share, QR Expand, Stage */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-4 mt-4 border-t border-black/6 text-xs no-print">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="px-3 py-1.5 rounded-xl bg-[#F7F7F5] hover:bg-[#ECECE9] border border-black/8 font-medium text-[#111111] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Link Copied' : 'Share Public Passport'}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-xl bg-[#F7F7F5] hover:bg-[#ECECE9] border border-black/8 font-medium text-[#111111] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Download / Print</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                  {project.status || 'Verified'}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-800 text-[11px] font-semibold">
                  Stage: {stage}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 pb-4 mb-6 border-b border-black/8 no-print">
            {[
              { id: 'IDENTITY', label: 'Identity Matrix' },
              { id: 'HEALTH', label: 'Project Health' },
              { id: 'LINEAGE', label: `Generational Lineage (${project.lineage?.length || 1})` },
              { id: 'EVIDENCE', label: `Evidence Signals (${project.contributors?.length || 1})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'bg-[#F5F5F3] text-[#737373] hover:text-[#111111]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: IDENTITY MATRIX */}
          {(activeTab === 'IDENTITY' || showPrintView) && (
            <div className="space-y-6">
              {/* Core Field Matrix Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-[#FBFBFA] border border-black/6">
                  <span className="text-[10px] font-bold text-[#737373] uppercase tracking-wider block">
                    Lead Creator
                  </span>
                  <span className="text-xs font-bold text-[#111111] mt-0.5 block truncate">
                    {creator}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-[#FBFBFA] border border-black/6">
                  <span className="text-[10px] font-bold text-[#737373] uppercase tracking-wider block">
                    Institution
                  </span>
                  <span className="text-xs font-bold text-[#111111] mt-0.5 block truncate">
                    {project.institution}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-[#FBFBFA] border border-black/6">
                  <span className="text-[10px] font-bold text-[#737373] uppercase tracking-wider block">
                    Department
                  </span>
                  <span className="text-xs font-bold text-[#111111] mt-0.5 block truncate">
                    {project.department}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-[#FBFBFA] border border-black/6">
                  <span className="text-[10px] font-bold text-[#737373] uppercase tracking-wider block">
                    Domain
                  </span>
                  <span className="text-xs font-bold text-[#111111] mt-0.5 block truncate">
                    {project.domain}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-[#FBFBFA] border border-black/6">
                  <span className="text-[10px] font-bold text-[#737373] uppercase tracking-wider block">
                    Difficulty Level
                  </span>
                  <span className="text-xs font-bold text-[#111111] mt-0.5 block">
                    {difficulty}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-[#FBFBFA] border border-black/6">
                  <span className="text-[10px] font-bold text-[#737373] uppercase tracking-wider block">
                    Current Stage
                  </span>
                  <span className="text-xs font-bold text-[#111111] mt-0.5 block">
                    {stage}
                  </span>
                </div>
              </div>

              {/* Technologies */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#737373] block mb-2">
                  Verified Tech Stack
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-xl bg-[#F7F7F5] border border-black/8 text-xs font-mono text-[#111111]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* External Artifacts Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href={passport.githubRepo ? `https://github.com/${passport.githubRepo}` : '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 rounded-2xl bg-[#FBFBFA] border border-black/8 hover:border-black flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-[#111111]" />
                    <span className="text-xs font-bold text-[#111111]">GitHub Repository</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#737373]" />
                </a>

                {passport.liveDemoUrl && (
                  <a
                    href={passport.liveDemoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 rounded-2xl bg-[#111111] text-white flex items-center justify-between hover:bg-black transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white">Live Demo</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                  </a>
                )}

                {passport.documentationUrl && (
                  <a
                    href={passport.documentationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 rounded-2xl bg-[#FBFBFA] border border-black/8 hover:border-black flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#111111]" />
                      <span className="text-xs font-bold text-[#111111]">Documentation</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#737373]" />
                  </a>
                )}
              </div>

              {/* Faculty Review & Academic Mentor Seal */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FBFBFA] border border-black/8 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-bold text-[#111111]">
                      Faculty Academic Verification & Endorsement
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Rubric Score: {passport.facultyReviewer?.score || 9.4} / 10.0
                  </span>
                </div>
                <p className="text-xs text-neutral-700 italic">
                  "{passport.facultyReviewer?.reviewText || 'Project verified for academic rigor and multi-batch continuity.'}"
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 text-[10.5px] text-[#737373] pt-1">
                  <span>Reviewer: <strong>{passport.facultyReviewer?.name || mentor}</strong> ({passport.facultyReviewer?.institution || project.institution})</span>
                  <span className="font-mono">Verification Seal: {passport.facultyReviewer?.signatureHash || 'SIG-VERIFIED-PV-2026'}</span>
                </div>
              </div>

              {/* Contributors Grid */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#737373] mb-2.5">
                  Permanent Contributor Roster ({project.contributors?.length || 0})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {project.contributors?.map((c) => (
                    <div key={c.name} className="flex items-center gap-3 p-3 rounded-2xl bg-[#FBFBFA] border border-black/6">
                      <img src={c.avatar} alt={c.name} className="w-9 h-9 rounded-xl object-cover border border-black/10" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#111111] truncate">{c.name}</p>
                        <p className="text-[11px] text-[#737373] truncate">{c.role} • {c.batch}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timestamps & Immutable Ledger Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-black/6 text-[11px] text-[#737373] font-mono">
                <div>Created: <span className="text-[#111111]">{createdDate}</span></div>
                <div>Last Activity: <span className="text-[#111111]">{lastActivity}</span></div>
                <div>Commits: <span className="text-[#111111]">{project.githubCommits}</span></div>
                <div>Stars: <span className="text-[#111111]">{project.githubStars}</span></div>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECT HEALTH */}
          {activeTab === 'HEALTH' && project.health && (
            <ProjectHealthCard health={project.health} projectTitle={project.title} />
          )}

          {/* TAB 3: PROJECT LINEAGE */}
          {activeTab === 'LINEAGE' && (
            <ProjectLineageView project={project} onContinueProject={onContinueProject} />
          )}

          {/* TAB 4: CONTRIBUTION EVIDENCE */}
          {activeTab === 'EVIDENCE' && project.evidences && (
            <ContributionEvidenceView evidences={project.evidences} projectTitle={project.title} />
          )}

          {/* Bottom Action Footer */}
          <div className="pt-6 mt-6 border-t border-black/10 flex flex-wrap items-center justify-between gap-3 no-print">
            <div className="flex items-center gap-2">
              {onOpenHandover && (
                <button
                  onClick={() => {
                    onOpenHandover(project);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-[#F7F7F5] hover:bg-[#ECECE9] border border-black/8 text-xs font-semibold text-[#111111] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Handover Package</span>
                </button>
              )}
            </div>

            {onContinueProject && (
              <button
                onClick={() => {
                  onContinueProject(project);
                  onClose();
                }}
                className="btn-primary-black px-6 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Continue This Project</span>
                <GitFork className="w-3.5 h-3.5 text-white" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
