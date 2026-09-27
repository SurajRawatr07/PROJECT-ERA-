import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Building2, 
  FlaskConical, 
  Award, 
  Code2, 
  Landmark, 
  Briefcase 
} from 'lucide-react';
import { RegistrationRole } from '../../types/auth';

interface RoleSelectorProps {
  selectedRole: RegistrationRole;
  onSelectRole: (role: RegistrationRole) => void;
}

export interface RoleOption {
  id: RegistrationRole;
  title: string;
  badge: string;
  description: string;
  icon: React.FC<{ className?: string; size?: number }>;
  color: string;
}

export const ALL_ROLES: RoleOption[] = [
  {
    id: 'STUDENT',
    title: 'Student',
    badge: 'Academic',
    description: 'Build projects, collaborate, find mentors and create proof of work.',
    icon: GraduationCap,
    color: 'from-blue-500/10 to-indigo-500/5'
  },
  {
    id: 'ALUMNI',
    title: 'Alumni',
    badge: 'Graduate',
    description: 'Continue projects, mentor students and contribute expertise.',
    icon: Award,
    color: 'from-amber-500/10 to-yellow-500/5'
  },
  {
    id: 'DEVELOPER',
    title: 'Developer',
    badge: 'Technical',
    description: 'Build, contribute, collaborate and showcase technical work.',
    icon: Code2,
    color: 'from-sky-500/10 to-cyan-500/5'
  },
  {
    id: 'RESEARCHER',
    title: 'Researcher',
    badge: 'Research',
    description: 'Share research, collaborate and review technical/research projects.',
    icon: FlaskConical,
    color: 'from-purple-500/10 to-fuchsia-500/5'
  },
  {
    id: 'FACULTY',
    title: 'Faculty / Mentor',
    badge: 'Academic Guide',
    description: 'Mentor students, review projects and provide academic guidance.',
    icon: BookOpen,
    color: 'from-emerald-500/10 to-teal-500/5'
  },
  {
    id: 'HOD',
    title: 'HOD',
    badge: 'Department Authority',
    description: 'Manage department-level project and innovation activity.',
    icon: Building2,
    color: 'from-rose-500/10 to-orange-500/5'
  },
  {
    id: 'INSTITUTION',
    title: 'Institution',
    badge: 'Organization',
    description: 'Manage institution-level ecosystem, departments, students and projects.',
    icon: Landmark,
    color: 'from-slate-500/10 to-gray-500/5'
  },
  {
    id: 'INDUSTRY_PROFESSIONAL',
    title: 'Industry Professional',
    badge: 'Enterprise Expert',
    description: 'Mentor, review, collaborate and participate in industry projects/challenges.',
    icon: Briefcase,
    color: 'from-emerald-500/10 to-lime-500/5'
  }
];

export const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onSelectRole }) => {
  return (
    <div className="w-full space-y-4">
      <div className="text-left">
        <h3 className="text-lg sm:text-xl font-bold font-display text-[#111111]">
          How will you use ProjectVerse?
        </h3>
        <p className="text-xs sm:text-sm text-[#666666] mt-1">
          Select your primary identity to customize your registration, profile, permissions, and workspace experience.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
        {ALL_ROLES.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;

          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onSelectRole(role.id)}
              className={`text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-[#111111] bg-neutral-50/90 shadow-xs ring-1 ring-[#111111]'
                  : 'border-neutral-200/90 bg-white hover:border-neutral-300 hover:bg-neutral-50/40'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-[#111111] text-white'
                        : 'bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#111111] leading-tight">
                      {role.title}
                    </h4>
                    <span className="text-[10px] font-mono font-medium text-neutral-600 uppercase tracking-wider">
                      {role.badge}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                    isSelected
                      ? 'border-[#111111] bg-[#111111]'
                      : 'border-neutral-300 bg-white'
                  }`}
                >
                  {isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
              </div>

              <p className="text-[12px] text-neutral-600 leading-relaxed font-body">
                {role.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
