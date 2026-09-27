import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  FolderGit2, 
  ExternalLink, 
  BookOpen, 
  FileText, 
  Users, 
  Sparkles, 
  ArrowUpRight,
  Download,
  Building2,
  GraduationCap,
  Briefcase,
  FlaskConical,
  Code2,
  User,
  Layers,
  FileCheck2,
  FolderSync,
  GitBranch
} from 'lucide-react';
import { ProjectItem } from '../../types';
import { PearlButton } from '../ui/pearl-button';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onJoinClick?: (project: ProjectItem) => void;
  onAddReview?: (projectId: string, review: any) => void;
  onOpenPassport?: (project: ProjectItem) => void;
  onOpenHandover?: (project: ProjectItem) => void;
  onContinueProject?: (project: ProjectItem) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onJoinClick,
  onAddReview,
  onOpenPassport,
  onOpenHandover,
  onContinueProject
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRole, setReviewerRole] = useState('Authorized Reviewer');
  const [reviewComments, setReviewComments] = useState('');
  const [reviewDecision, setReviewDecision] = useState<'VERIFIED' | 'REVIEWED' | 'UNDER REVIEW'>('VERIFIED');
  const [rubricScore, setRubricScore] = useState<number>(9.2);

  if (!project) return null;

  const getStatusBadge = (reviewStatus?: string, status?: string) => {
    const s = (reviewStatus || status || '').toUpperCase();
    if (s.includes('VERIF')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified Project</span>
        </span>
      );
    }
    if (s.includes('UNDER') || s.includes('REVIEW')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Under Review</span>
        </span>
      );
    }
    if (s.includes('SUBMIT')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>Submitted (Pending Review)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200">
        <span>Active</span>
      </span>
    );
  };

  const getProjectTypeLabel = (type?: string) => {
    switch (type) {
      case 'OPEN_SOURCE':
        return 'Open Source';
      case 'RESEARCH':
        return 'Research';
      case 'INDUSTRY':
        return 'Industry';
      case 'PERSONAL':
        return 'Personal';
      case 'ACADEMIC':
      default:
        return 'Academic';
    }
  };

  const repoLink = project.repositoryUrl || (project.passport?.githubRepo ? `https://github.com/${project.passport.githubRepo}` : undefined);
  const demoLink = project.demoUrl;
  const docsLink = project.documentationUrl;

  const creatorName = project.creator?.name || project.contributors?.[0]?.name || 'Project Author';
  const creatorRole = project.creator?.role || project.contributors?.[0]?.role || 'Creator';
  const creatorAvatar = project.creator?.avatar || project.contributors?.[0]?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
  const institutionOrOrg = project.organization || project.institution || '';

  // Screenshots collection
  const screenshots = project.screenshots && project.screenshots.length > 0 
    ? project.screenshots 
    : [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80'
      ];

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !reviewComments) return;

    if (onAddReview) {
      onAddReview(project.id, {
        reviewerName,
        reviewerRole,
        comments: reviewComments,
        verified: reviewDecision === 'VERIFIED',
        date: 'Today',
        rubricScore
      });
    }
    setShowReviewForm(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/45 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 16 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl p-6 sm:p-10 border border-black/[0.1] shadow-2xl text-[#111111] font-sans"
        >
          {/* Top Row: Type, Status, Close button */}
          <div className="flex items-center justify-between gap-3 pb-5 border-b border-black/[0.08]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider  bg-[#F5F5F3] text-[#333333] border border-black/[0.06]">
                {getProjectTypeLabel(project.projectType)}
              </span>
              {getStatusBadge(project.reviewStatus, project.status)}
              {institutionOrOrg && (
                <span className="text-xs text-[#666666] hidden sm:inline">
                  {institutionOrOrg}
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F5F5F3] hover:bg-black hover:text-white flex items-center justify-center text-[#555555] transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Project Title & Tagline */}
          <div className="pt-6 pb-4">
            <h1 className="font-serif text-[28px] sm:text-[36px] md:text-[40px] text-[#111111] font-normal leading-tight tracking-[-0.015em]">
              {project.title}
            </h1>
            <p className="text-base sm:text-lg text-[#555555] font-sans mt-2 leading-relaxed">
              {project.tagline || project.description}
            </p>
          </div>

          {/* Action Links Bar */}
          <div className="flex flex-wrap items-center gap-2.5 py-4 border-y border-black/[0.06] my-4 ">
            {repoLink && (
              <a
                href={repoLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F7F7F5] hover:bg-[#111111] hover:text-white text-xs font-semibold text-[#111111] border border-black/[0.08] transition-colors"
              >
                <FolderGit2 className="w-4 h-4" />
                <span>Source Repository</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            )}
            {demoLink && (
              <a
                href={demoLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#111111] hover:bg-black text-white text-xs font-semibold shadow-2xs transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Demo</span>
              </a>
            )}
            {docsLink && (
              <a
                href={docsLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F7F7F5] hover:bg-[#111111] hover:text-white text-xs font-semibold text-[#111111] border border-black/[0.08] transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Documentation</span>
              </a>
            )}
            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F7F7F5] hover:bg-[#111111] hover:text-white text-xs font-semibold text-[#111111] border border-black/[0.08] transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Project Website</span>
              </a>
            )}

            {onOpenPassport && (
              <button
                type="button"
                onClick={() => onOpenPassport(project)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-colors cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4 text-amber-700" />
                <span>Project Passport ({project.passportId || 'PV-ID'})</span>
              </button>
            )}

            {onOpenHandover && (
              <button
                type="button"
                onClick={() => onOpenHandover(project)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F7F7F5] hover:bg-[#111111] hover:text-white text-xs font-semibold text-[#111111] border border-black/[0.08] transition-colors cursor-pointer"
              >
                <FolderSync className="w-4 h-4" />
                <span>Handover Package</span>
              </button>
            )}

            {onContinueProject && (project.status === 'Seeking Next Batch' || project.continuity?.isAtRisk || project.id === 'proj-nav') && (
              <button
                type="button"
                onClick={() => onContinueProject(project)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <GitBranch className="w-4 h-4" />
                <span>Continue Project (v2.0)</span>
              </button>
            )}
          </div>

          {/* Grid Layout: Main Details + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
            {/* Main Content (2 columns) */}
            <div className="lg:col-span-2 space-y-7">
              {/* Description */}
              <div>
                <h3 className="text-xs font-bold  uppercase tracking-wider text-[#737373] mb-2.5">
                  About the Project
                </h3>
                <div className="text-sm text-[#333333] leading-relaxed space-y-3 font-sans">
                  <p>{project.description}</p>
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <h3 className="text-xs font-bold  uppercase tracking-wider text-[#737373] mb-2.5">
                  Technologies & Tools
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg bg-[#F7F7F5] border border-black/[0.08] text-xs font-mono text-[#111111]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Screenshots Gallery */}
              {screenshots.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold  uppercase tracking-wider text-[#737373] mb-2.5">
                    Screenshots & Visuals
                  </h3>
                  <div className="rounded-2xl overflow-hidden border border-black/[0.08] bg-[#F7F7F5] mb-2">
                    <img
                      src={screenshots[activeImageIndex]}
                      alt={`${project.title} screenshot`}
                      referrerPolicy="no-referrer"
                      className="w-full h-64 sm:h-80 object-cover"
                    />
                  </div>
                  {screenshots.length > 1 && (
                    <div className="flex gap-2">
                      {screenshots.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`w-16 h-12 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                            activeImageIndex === idx ? 'border-black ring-2 ring-black/10' : 'border-black/[0.1] opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Supporting Documents & Evidence */}
              <div>
                <h3 className="text-xs font-bold  uppercase tracking-wider text-[#737373] mb-2.5">
                  Supporting Documents & Evidence
                </h3>
                <div className="space-y-2">
                  {(project.supportingDocuments && project.supportingDocuments.length > 0) ? (
                    project.supportingDocuments.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-[#FAFAF8] border border-black/[0.06] text-xs"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <FileText className="w-4 h-4 text-[#111111] shrink-0" />
                          <span className="font-semibold text-[#111111] truncate">{doc.name}</span>
                          {doc.size && <span className="text-[#737373]">({doc.size})</span>}
                        </div>
                        <a
                          href={doc.url || '#'}
                          download
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#111111] hover:underline"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </a>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-xl bg-[#FAFAF8] border border-black/[0.06] text-xs text-[#666666]">
                      No additional documents uploaded. Standard repository and demo references provide direct evidence.
                    </div>
                  )}
                </div>
              </div>

              {/* Verification & Review Feedback Section */}
              <div className="pt-4 border-t border-black/[0.08]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold  uppercase tracking-wider text-[#737373]">
                    Reviews & Verification Feedback
                  </h3>
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="text-xs font-semibold  text-[#111111] hover:underline cursor-pointer"
                  >
                    {showReviewForm ? 'Cancel Review' : '+ Add Review (Authorized)'}
                  </button>
                </div>

                {/* Optional Review Form for Authorized reviewers */}
                {showReviewForm && (
                  <form onSubmit={handleReviewSubmit} className="p-4 rounded-2xl bg-[#FAFAF8] border border-black/[0.1] space-y-3 mb-4 text-xs font-sans">
                    <h4 className="font-bold text-[#111111] ">
                      Submit Formal Review or Verification
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#4A4A4A] mb-1">Reviewer Name *</label>
                        <input
                          type="text"
                          required
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          placeholder="e.g. Dr. Siddharth Anand or Lead Reviewer"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-black/[0.1] text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[#4A4A4A] mb-1">Reviewer Role *</label>
                        <input
                          type="text"
                          required
                          value={reviewerRole}
                          onChange={(e) => setReviewerRole(e.target.value)}
                          placeholder="e.g. Faculty / Department Head / OSS Reviewer"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-black/[0.1] text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#4A4A4A] mb-1">Evaluation Comments *</label>
                      <textarea
                        required
                        rows={2}
                        value={reviewComments}
                        onChange={(e) => setReviewComments(e.target.value)}
                        placeholder="Provide rigorous feedback on architecture, evidence validity, and execution..."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-black/[0.1] text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[#4A4A4A] mb-1">Decision</label>
                        <select
                          value={reviewDecision}
                          onChange={(e) => setReviewDecision(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-black/[0.1] text-xs"
                        >
                          <option value="VERIFIED">Verify Project (Verified Badge)</option>
                          <option value="REVIEWED">Reviewed (Feedback Recorded)</option>
                          <option value="UNDER REVIEW">Request Changes / Under Review</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[#4A4A4A] mb-1">Rubric Score (out of 10)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="1"
                          max="10"
                          value={rubricScore}
                          onChange={(e) => setRubricScore(parseFloat(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-black/[0.1] text-xs"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#111111] text-white font-semibold  text-xs cursor-pointer"
                    >
                      Publish Verification
                    </button>
                  </form>
                )}

                {/* Existing Reviews */}
                {project.passport?.facultyReviewer ? (
                  <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-black/[0.08] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-xs text-[#111111]">
                          {project.passport.facultyReviewer.name}
                        </span>
                        <span className="text-[11px] text-[#737373]">
                          ({project.passport.facultyReviewer.designation})
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                        Score: {project.passport.facultyReviewer.score}/10
                      </span>
                    </div>
                    <p className="text-xs text-[#4A4A4A] leading-relaxed italic">
                      "{project.passport.facultyReviewer.reviewText}"
                    </p>
                    <div className="text-[10px] text-[#737373]">
                      Verified: {project.passport.facultyReviewer.verifiedAt}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-black/[0.06] text-xs text-[#666666]">
                    This project has been submitted and is currently awaiting review by authorized evaluators.
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar (1 column): Creator, Team, Roles */}
            <div className="space-y-6">
              {/* Creator Card */}
              <div className="p-5 rounded-2xl bg-[#FAFAF8] border border-black/[0.08]">
                <h4 className="text-xs font-bold  uppercase tracking-wider text-[#737373] mb-3">
                  Project Creator
                </h4>
                <div className="flex items-center gap-3">
                  <img
                    src={creatorAvatar}
                    alt={creatorName}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover border border-black/10"
                  />
                  <div>
                    <div className="font-bold text-sm text-[#111111] ">
                      {creatorName}
                    </div>
                    <div className="text-xs text-[#666666]">{creatorRole}</div>
                    {institutionOrOrg && (
                      <div className="text-xs text-[#737373] mt-0.5">{institutionOrOrg}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Contributors / Team Members */}
              {project.contributors && project.contributors.length > 0 && (
                <div className="p-5 rounded-2xl bg-[#FAFAF8] border border-black/[0.08]">
                  <h4 className="text-xs font-bold  uppercase tracking-wider text-[#737373] mb-3">
                    Team & Contributors ({project.contributors.length})
                  </h4>
                  <div className="space-y-2.5">
                    {project.contributors.map((c, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs">
                        <img
                          src={c.avatar}
                          alt={c.name}
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded-full object-cover border border-black/10"
                        />
                        <div className="truncate">
                          <div className="font-semibold text-[#111111] truncate">{c.name}</div>
                          <div className="text-[11px] text-[#737373] truncate">{c.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Open Collaborator Needs */}
              {project.openRoles && project.openRoles.length > 0 && (
                <div className="p-5 rounded-2xl bg-[#FAFAF8] border border-black/[0.08]">
                  <h4 className="text-xs font-bold  uppercase tracking-wider text-[#737373] mb-2">
                    Open Collaborations
                  </h4>
                  <p className="text-xs text-[#666666] mb-3">
                    Looking for contributors with skills in:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.openRoles.map((role) => (
                      <span
                        key={role}
                        className="px-2.5 py-1 rounded-lg bg-white border border-black/[0.08] text-xs font-medium text-[#111111]"
                      >
                        {role}
                      </span>
                    ))}
                  </div>

                  {onJoinClick && (
                    <div className="mt-4">
                      <PearlButton
                        onClick={() => onJoinClick(project)}
                        variant="dark"
                        size="sm"
                        showSparkle={true}
                        label="Connect with Team"
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProjectDetailModal;
