import React from 'react';
import { LucideIcon, FolderGit2, CheckCircle2, Users, FileCheck2, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionText?: string;
  onAction?: () => void;
  type?: 'projects' | 'reviews' | 'students' | 'verification' | 'general';
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: CustomIcon,
  actionText,
  onAction,
  type = 'general',
  className = ''
}) => {
  const defaultIcons = {
    projects: FolderGit2,
    reviews: CheckCircle2,
    students: Users,
    verification: FileCheck2,
    general: AlertCircle
  };

  const IconComponent = CustomIcon || defaultIcons[type] || AlertCircle;

  return (
    <div
      className={`p-8 sm:p-12 rounded-2xl bg-white border border-dashed border-black/15 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-6 ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-[#F5F5F3] border border-black/8 flex items-center justify-center text-[#555555] mb-4 shadow-2xs">
        <IconComponent className="w-6 h-6 text-[#111111]" />
      </div>

      <h3 className="font-display text-lg sm:text-xl font-normal text-[#111111] mb-1.5">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-[#555555] max-w-sm mb-5 leading-relaxed">
        {description}
      </p>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-xl bg-[#111111] hover:bg-black text-white text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
        >
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};
