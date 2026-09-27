import React from 'react';
import { UserRole } from '../../types';

interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showBrackets?: boolean;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({
  role,
  size = 'md',
  className = '',
  showBrackets = true
}) => {
  const roleStyles: Record<string, { bg: string; text: string; border: string }> = {
    STUDENT: {
      bg: 'bg-blue-50',
      text: 'text-blue-900',
      border: 'border-blue-200'
    },
    FACULTY: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-900',
      border: 'border-emerald-200'
    },
    RESEARCHER: {
      bg: 'bg-purple-50',
      text: 'text-purple-900',
      border: 'border-purple-200'
    },
    ALUMNI: {
      bg: 'bg-amber-50',
      text: 'text-amber-950',
      border: 'border-amber-200'
    },
    DEVELOPER: {
      bg: 'bg-sky-50',
      text: 'text-sky-900',
      border: 'border-sky-200'
    },
    HOD: {
      bg: 'bg-rose-50',
      text: 'text-rose-950',
      border: 'border-rose-200'
    },
    INSTITUTION: {
      bg: 'bg-slate-100',
      text: 'text-slate-900',
      border: 'border-slate-300'
    },
    INDUSTRY_PROFESSIONAL: {
      bg: 'bg-teal-50',
      text: 'text-teal-900',
      border: 'border-teal-200'
    },
    ADMIN: {
      bg: 'bg-violet-50',
      text: 'text-violet-950',
      border: 'border-violet-200'
    }
  };

  const currentStyle = roleStyles[role] || roleStyles.STUDENT;

  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5 tracking-wider',
    md: 'text-[11px] px-2.5 py-1 tracking-widest',
    lg: 'text-xs px-3 py-1.5 tracking-widest'
  };

  const formattedRole = role.replace(/_/g, ' ');

  return (
    <span
      id={`role-badge-${role.toLowerCase()}`}
      className={`inline-flex items-center font-mono-code font-bold uppercase rounded-md border transition-all ${currentStyle.bg} ${currentStyle.text} ${currentStyle.border} ${sizeStyles[size]} ${className}`}
    >
      {showBrackets ? `[ ${formattedRole} ]` : formattedRole}
    </span>
  );
};
