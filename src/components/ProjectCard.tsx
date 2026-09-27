import React, { memo } from 'react';
import { motion } from 'motion/react';
import { 
  GitBranch, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Building2,
  FolderGit2
} from 'lucide-react';
import { ProjectItem } from '../types';
import { PearlButton } from './ui/pearl-button';

interface ProjectCardProps {
  project: ProjectItem;
  onViewProject?: (project: ProjectItem) => void;
  onSelect?: (project: ProjectItem) => void;
  onJoinProject?: (project: ProjectItem) => void;
  onJoin?: (project: ProjectItem) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = memo(({
  project,
  onViewProject,
  onSelect,
  onJoinProject,
  onJoin,
}) => {
  const handleView = () => {
    if (onViewProject) {
      onViewProject(project);
    } else if (onSelect) {
      onSelect(project);
    }
  };
  const getReviewBadge = (status?: string, reviewStatus?: string) => {
    const s = (reviewStatus || status || '').toUpperCase();
    if (s.includes('VERIF')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Verified</span>
        </span>
      );
    }
    if (s.includes('UNDER') || s.includes('REVIEW')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
          <ShieldCheck className="w-3 h-3 text-blue-600" />
          <span>Under Review</span>
        </span>
      );
    }
    if (s.includes('SUBMIT')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
          <Clock className="w-3 h-3 text-amber-600" />
          <span>Submitted</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
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

  const creatorName = project.creator?.name || project.contributors?.[0]?.name || 'Project Creator';
  const creatorAvatar = project.creator?.avatar || project.contributors?.[0]?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
  const orgOrInst = project.organization || project.institution || '';

  return (
    <motion.div
      id={`project-card-${project.id}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl p-5 sm:p-6 flex flex-col justify-between bg-white border border-black/[0.08] shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:border-black/25 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-200 group select-none"
    >
      <div>
        {/* Top Header: Type & Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1 text-[12px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F5F5F3] text-[#333333] border border-black/[0.06]">
            {getProjectTypeLabel(project.projectType)}
          </span>
          {getReviewBadge(project.status, project.reviewStatus)}
        </div>

        {/* Project Name */}
        <h3 
          onClick={handleView}
          className="text-[18px] font-bold text-[#111111] group-hover:text-black transition-colors leading-snug line-clamp-1 cursor-pointer"
          title={project.title}
        >
          {project.title}
        </h3>

        {/* Short Description */}
        <p className="text-[#555555] text-[14.5px] leading-relaxed mt-1.5 mb-4 line-clamp-2">
          {project.tagline || project.description}
        </p>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.techStack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="text-[12px] font-medium px-2 py-0.5 rounded-md bg-[#F7F7F5] text-[#333333] border border-black/[0.06]"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 3 && (
            <span className="text-[12px] font-medium px-1.5 py-0.5 rounded-md bg-[#F7F7F5] text-[#666666]">
              +{project.techStack.length - 3}
            </span>
          )}
        </div>

        {/* Creator & Institution / Organization */}
        <div className="flex items-center gap-2.5 py-2.5 border-t border-black/[0.05] text-[13px] text-[#555555]">
          <img
            src={creatorAvatar}
            alt={creatorName}
            referrerPolicy="no-referrer"
            className="w-5 h-5 rounded-full object-cover border border-black/10 shrink-0"
          />
          <div className="truncate flex items-center gap-1.5">
            <span className="font-semibold text-[#111111] truncate">{creatorName}</span>
            {orgOrInst && (
              <>
                <span className="text-black/30">·</span>
                <span className="truncate text-[#666666]">{orgOrInst}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer: Links & View Project CTA */}
      <div className="pt-3 border-t border-black/[0.05] flex items-center justify-between gap-3">
        {/* Repository / Demo indicator if available */}
        <div className="flex items-center gap-2.5 text-xs text-[#737373]">
          {project.repositoryUrl && (
            <span className="inline-flex items-center gap-1" title="Repository Available">
              <FolderGit2 className="w-3.5 h-3.5 text-[#333333]" />
              <span className="hidden sm:inline text-[12px]">Repo</span>
            </span>
          )}
          {project.demoUrl && (
            <span className="inline-flex items-center gap-1" title="Live Demo Available">
              <ExternalLink className="w-3.5 h-3.5 text-[#333333]" />
              <span className="hidden sm:inline text-[12px]">Demo</span>
            </span>
          )}
        </div>

        {/* CTA: View Project */}
        <PearlButton
          id={`view-project-btn-${project.id}`}
          onClick={handleView}
          variant="dark"
          size="sm"
          icon={<ArrowRight className="w-3 h-3 text-white" />}
          iconPosition="right"
          label="View Project"
        />
      </div>
    </motion.div>
  );
});

export default ProjectCard;
