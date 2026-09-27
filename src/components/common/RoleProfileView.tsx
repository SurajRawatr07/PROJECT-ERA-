import React from 'react';
import { 
  CheckCircle2, 
  Building2, 
  Mail, 
  Github, 
  Linkedin, 
  Globe, 
  ShieldCheck, 
  BookOpen, 
  Users, 
  FolderGit2, 
  Award, 
  Layers, 
  Sparkles, 
  ExternalLink,
  Code2,
  FlaskConical,
  Briefcase,
  Landmark,
  FileCheck2,
  GraduationCap,
  Calendar,
  MapPin,
  Edit3,
  GitBranch,
  Terminal,
  Activity,
  FileText,
  UserCheck,
  BarChart3
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types';
import { RoleBadge } from './RoleBadge';
import { 
  resolveUserInstitutionId, 
  resolveUserDepartmentId, 
  getInstitutionById, 
  getDepartmentAnalytics, 
  getInstitutionAnalytics 
} from '../../data/isolatedData';

interface RoleProfileViewProps {
  profile: UserProfile;
  role: UserRole;
  onEditProfile?: () => void;
}

export const RoleProfileView: React.FC<RoleProfileViewProps> = ({
  profile,
  role,
  onEditProfile
}) => {
  // Resolve isolated institution and department identifiers
  const institutionId = resolveUserInstitutionId(profile);
  const departmentId = resolveUserDepartmentId(profile);
  const institution = getInstitutionById(institutionId);

  // =========================================================================
  // 1. HOD PROFILE (STRICTLY REQUIRED FIELDS ONLY)
  // Name, Designation, Institution, Department, Department student count, 
  // Faculty count, Project count, Department activity, Department analytics
  // =========================================================================
  if (role === 'HOD') {
    const hodAnalytics = getDepartmentAnalytics(institutionId, departmentId);
    const departmentName = hodAnalytics.department?.name || profile.department || 'Computer Science & Engineering';
    const hodName = profile.fullName || hodAnalytics.department?.hodName || 'Dr. Rajesh Mehta';
    const designation = profile.designation || hodAnalytics.department?.hodDesignation || 'Professor & Head of Department';

    return (
      <div className="space-y-6 max-w-5xl mx-auto font-sans">
        {/* HOD Profile Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-black/8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <img
                src={
                  profile.avatar ||
                  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
                }
                alt={hodName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-black/10 shadow-xs"
              />

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold font-display text-neutral-900">
                    {hodName}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold uppercase tracking-wider bg-neutral-900 text-white">
                    HOD • Department Intelligence
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified HOD
                  </span>
                </div>

                <p className="text-sm font-medium text-neutral-700">
                  {designation}
                </p>

                <p className="text-xs text-neutral-500 flex flex-wrap items-center gap-2 pt-0.5">
                  <span className="font-semibold text-neutral-800 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                    {institution.name}
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-neutral-800 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-neutral-400" />
                    {departmentName}
                  </span>
                </p>
              </div>
            </div>

            {onEditProfile && (
              <button
                onClick={onEditProfile}
                className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0 self-start sm:self-auto"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {/* Department Counts & Core Metrics */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-neutral-500" />
                <span className="text-[11px] font-mono-code text-neutral-500 uppercase font-semibold">
                  Department Students
                </span>
              </div>
              <p className="text-2xl font-bold text-neutral-900">
                {hodAnalytics.totalStudents}
              </p>
              <span className="text-[11px] text-neutral-400">Enrolled in {departmentName}</span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60">
              <div className="flex items-center gap-2 mb-1">
                <UserCheck className="w-4 h-4 text-neutral-500" />
                <span className="text-[11px] font-mono-code text-neutral-500 uppercase font-semibold">
                  Department Faculty
                </span>
              </div>
              <p className="text-2xl font-bold text-neutral-900">
                {hodAnalytics.totalFaculty}
              </p>
              <span className="text-[11px] text-neutral-400">Active professors & guides</span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60">
              <div className="flex items-center gap-2 mb-1">
                <FolderGit2 className="w-4 h-4 text-neutral-500" />
                <span className="text-[11px] font-mono-code text-neutral-500 uppercase font-semibold">
                  Department Projects
                </span>
              </div>
              <p className="text-2xl font-bold text-neutral-900">
                {hodAnalytics.totalProjects}
              </p>
              <span className="text-[11px] text-neutral-400">{hodAnalytics.verifiedProjects} verified capstones</span>
            </div>
          </div>
        </div>

        {/* Department Activity & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Analytics */}
          <div className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs space-y-4">
            <div>
              <h3 className="font-display text-base font-bold text-neutral-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-neutral-700" />
                <span>Department Analytics</span>
              </h3>
              <p className="text-xs text-neutral-500">Domain distribution and technological specializations.</p>
            </div>

            <div className="space-y-2">
              {hodAnalytics.domainBreakdown.map((item) => (
                <div key={item.domain} className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/50 flex items-center justify-between text-xs">
                  <span className="font-medium text-neutral-800">{item.domain}</span>
                  <span className="font-mono-code font-bold text-neutral-900 px-2 py-0.5 rounded bg-white border border-neutral-200">
                    {item.count} projects
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <span className="text-[10px] font-mono-code uppercase text-neutral-400 block mb-1.5">Top Tech Stack:</span>
              <div className="flex flex-wrap gap-1.5">
                {hodAnalytics.topTechStack.map(([tech, count]) => (
                  <span key={tech} className="px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-200 text-[11px] font-mono-code text-neutral-700">
                    {tech} ({count})
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Department Activity */}
          <div className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs space-y-4">
            <div>
              <h3 className="font-display text-base font-bold text-neutral-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-neutral-700" />
                <span>Department Activity</span>
              </h3>
              <p className="text-xs text-neutral-500">Recent departmental ledger milestones.</p>
            </div>

            <div className="space-y-3">
              {hodAnalytics.recentActivity.map((act) => (
                <div key={act.id} className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/50 text-xs">
                  <p className="font-medium text-neutral-800 leading-snug">{act.text}</p>
                  <span className="text-[10px] font-mono-code text-neutral-400 mt-1 block">{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. INSTITUTION PROFILE (STRICTLY REQUIRED FIELDS ONLY)
  // Institution name, Logo, Location, Website, Departments, Student count,
  // Faculty count, HOD count, Project count, Project activity, Institution analytics
  // =========================================================================
  if (role === 'INSTITUTION') {
    const instAnalytics = getInstitutionAnalytics(institutionId);

    return (
      <div className="space-y-6 max-w-5xl mx-auto font-sans">
        {/* Institution Profile Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-black/8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <img
                src={institution.logo}
                alt={institution.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-black/10 shadow-xs"
              />

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold font-display text-neutral-900">
                    {institution.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold uppercase tracking-wider bg-neutral-900 text-white">
                    Institution Intelligence Node
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified Institution
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-600 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    {institution.location}
                  </span>
                  <a
                    href={institution.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-neutral-700 hover:text-neutral-900 underline font-mono-code"
                  >
                    <Globe className="w-3.5 h-3.5 text-neutral-400" />
                    {institution.website}
                  </a>
                  <span className="font-semibold text-emerald-700">
                    {institution.accreditationTier}
                  </span>
                </div>
              </div>
            </div>

            {onEditProfile && (
              <button
                onClick={onEditProfile}
                className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0 self-start sm:self-auto"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {/* Counts: Student count, Faculty count, HOD count, Project count */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-neutral-500" />
                <span className="text-[11px] font-mono-code text-neutral-500 uppercase font-semibold">
                  Student Count
                </span>
              </div>
              <p className="text-2xl font-bold text-neutral-900">
                {instAnalytics.totalStudents}
              </p>
              <span className="text-[11px] text-neutral-400">Total campus enrollment</span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60">
              <div className="flex items-center gap-2 mb-1">
                <UserCheck className="w-4 h-4 text-neutral-500" />
                <span className="text-[11px] font-mono-code text-neutral-500 uppercase font-semibold">
                  Faculty Count
                </span>
              </div>
              <p className="text-2xl font-bold text-neutral-900">
                {instAnalytics.totalFaculty}
              </p>
              <span className="text-[11px] text-neutral-400">Professors & guides</span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60">
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap className="w-4 h-4 text-neutral-500" />
                <span className="text-[11px] font-mono-code text-neutral-500 uppercase font-semibold">
                  HOD Count
                </span>
              </div>
              <p className="text-2xl font-bold text-neutral-900">
                {instAnalytics.totalHODs}
              </p>
              <span className="text-[11px] text-neutral-400">Department leaders</span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60">
              <div className="flex items-center gap-2 mb-1">
                <FolderGit2 className="w-4 h-4 text-neutral-500" />
                <span className="text-[11px] font-mono-code text-neutral-500 uppercase font-semibold">
                  Project Count
                </span>
              </div>
              <p className="text-2xl font-bold text-neutral-900">
                {instAnalytics.totalProjects}
              </p>
              <span className="text-[11px] text-neutral-400">{instAnalytics.verifiedProjects} verified passports</span>
            </div>
          </div>
        </div>

        {/* Departments Roster */}
        <div className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-bold text-neutral-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-neutral-800" />
                <span>Departments ({instAnalytics.departments.length})</span>
              </h3>
              <p className="text-xs text-neutral-500">
                All academic departments strictly registered under {institution.name}.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {instAnalytics.departments.map((dept) => (
              <div key={dept.id} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-neutral-900 text-white">
                    {dept.code}
                  </span>
                  <span className="text-[11px] text-neutral-500 font-mono-code">{dept.projectCount} Projects</span>
                </div>
                <h4 className="text-xs font-bold text-neutral-900">{dept.name}</h4>
                <p className="text-[11px] text-neutral-600">HOD: <strong className="text-neutral-800">{dept.hodName}</strong></p>
                <div className="flex items-center justify-between pt-2 border-t border-neutral-200/50 text-[10px] text-neutral-500 font-mono-code">
                  <span>{dept.studentCount} Students</span>
                  <span>{dept.facultyCount} Faculty</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Activity & Institution Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Institution Analytics */}
          <div className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs space-y-4">
            <div>
              <h3 className="font-display text-base font-bold text-neutral-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-neutral-700" />
                <span>Institution Analytics</span>
              </h3>
              <p className="text-xs text-neutral-500">Cross-departmental technological intelligence.</p>
            </div>

            <div className="space-y-2">
              {instAnalytics.domainBreakdown.map((item) => (
                <div key={item.domain} className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/50 flex items-center justify-between text-xs">
                  <span className="font-medium text-neutral-800">{item.domain}</span>
                  <span className="font-mono-code font-bold text-neutral-900 px-2 py-0.5 rounded bg-white border border-neutral-200">
                    {item.count} projects
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <span className="text-[10px] font-mono-code uppercase text-neutral-400 block mb-1.5">Top Tech Trends:</span>
              <div className="flex flex-wrap gap-1.5">
                {instAnalytics.topTechTrends.slice(0, 6).map(([tech, count]) => (
                  <span key={tech} className="px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-200 text-[11px] font-mono-code text-neutral-700">
                    {tech} ({count})
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Project Activity */}
          <div className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs space-y-4">
            <div>
              <h3 className="font-display text-base font-bold text-neutral-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-neutral-700" />
                <span>Project Activity</span>
              </h3>
              <p className="text-xs text-neutral-500">Institutional depository transactions.</p>
            </div>

            <div className="space-y-3">
              {instAnalytics.institutionActivity.map((act) => (
                <div key={act.id} className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/50 text-xs">
                  <p className="font-medium text-neutral-800 leading-snug">{act.text}</p>
                  <span className="text-[10px] font-mono-code text-neutral-400 mt-1 block">{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. OTHER ROLES PROFILE (Student, Alumni, Developer, Researcher, Faculty, Industry)
  // Preserved exactly as existing!
  // =========================================================================
  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* 1. Universal Professional Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-black/8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={
                profile.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
              }
              alt={profile.fullName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-black/10 shadow-xs"
            />

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h1 className="text-xl sm:text-2xl font-bold font-display text-[#111111]">
                  {profile.fullName}
                </h1>
                <RoleBadge role={role} size="sm" />
                <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {profile.verifiedStatus || 'Active Member'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-neutral-600 mb-2 leading-relaxed">
                {role === 'STUDENT' && (
                  <span>
                    {profile.course || 'BCA / B.Tech'} • {profile.department || 'Computer Science & Engineering'} • {profile.institution || 'Graphic Era Hill University'}
                  </span>
                )}
                {role === 'ALUMNI' && (
                  <span>
                    {profile.currentJobRole || 'Systems Engineer'} at {profile.currentOrganization || profile.currentCompany || 'NVIDIA Autonomous Vehicles'} • Alumnus of {profile.institution || 'Graphic Era Hill University'}
                  </span>
                )}
                {role === 'DEVELOPER' && (
                  <span>
                    Independent Software Architect • {profile.primaryTechStack?.join(', ') || 'Rust, TypeScript, Distributed Systems'}
                  </span>
                )}
                {role === 'RESEARCHER' && (
                  <span>
                    {profile.designation || 'Principal Research Fellow'} • {profile.researchAreas?.[0] || 'Edge AI & Neuromorphic Computing'} • {profile.institution || 'GEHU Research Node'}
                  </span>
                )}
                {role === 'FACULTY' && (
                  <span>
                    {profile.designation || 'Assistant Professor & Research Guide'} • {profile.department || 'Department of Computer Science'} • {profile.institution || 'Graphic Era Hill University'}
                  </span>
                )}
                {role === 'INDUSTRY_PROFESSIONAL' && (
                  <span>
                    {profile.currentJobRole || 'Principal Cloud Architect'} at {profile.currentOrganization || profile.currentCompany || 'HyperCloud Enterprise Solutions'} • Industry Mentor
                  </span>
                )}
              </p>

              <p className="text-xs text-neutral-700 max-w-2xl leading-relaxed">
                {profile.bio || 'Active contributor to verified project passports and academic lineages.'}
              </p>
            </div>
          </div>

          {onEditProfile && (
            <button
              onClick={onEditProfile}
              className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0 self-start sm:self-auto"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {/* Quick Social & Contact Bar */}
        <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-neutral-600 font-mono">
          <span className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-neutral-400" />
            {profile.email}
          </span>
          {profile.githubUsername && (
            <span className="flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5 text-neutral-400" />
              github.com/{profile.githubUsername}
            </span>
          )}
          {profile.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              {profile.location}
            </span>
          )}
        </div>
      </div>

      {/* 2. ROLE-SPECIFIC PROFILE BODY */}
      {/* STUDENT PROFILE */}
      {role === 'STUDENT' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs space-y-3">
            <h3 className="font-display text-base font-bold text-neutral-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-neutral-700" />
              Academic Credentials
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                <span className="text-neutral-500 block text-[10px]">Institution</span>
                <span className="font-bold text-neutral-900 block mt-0.5">{profile.institution}</span>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                <span className="text-neutral-500 block text-[10px]">Course / Program</span>
                <span className="font-bold text-neutral-900 block mt-0.5">{profile.course || 'BCA'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                <span className="text-neutral-500 block text-[10px]">Batch Year</span>
                <span className="font-bold text-neutral-900 block mt-0.5">{profile.batch || '2023–2027'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                <span className="text-neutral-500 block text-[10px]">Roll Number</span>
                <span className="font-bold text-neutral-900 block mt-0.5">{profile.rollNumber || 'GEHU/2023/BCA/089'}</span>
              </div>
            </div>
          </div>

          {/* Skills & Tech Stack */}
          <div className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs space-y-3">
            <h3 className="font-display text-base font-bold text-neutral-900 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-neutral-700" />
              Technical Skills & Proficiencies
            </h3>
            <div className="flex flex-wrap gap-2">
              {(profile.skills || ['React', 'TypeScript', 'Node.js', 'MongoDB', 'C++', 'DSA', 'Git/GitHub']).map((skill) => (
                <span key={skill} className="px-3 py-1.5 rounded-xl bg-neutral-100 border border-neutral-200 text-xs font-mono text-neutral-800">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ALUMNI PROFILE */}
      {role === 'ALUMNI' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs space-y-3">
            <h3 className="font-display text-base font-bold text-neutral-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-neutral-700" />
              Professional Career & Mentorship Track
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                <span className="text-neutral-500 block text-[10px]">Current Company</span>
                <span className="font-bold text-neutral-900 block mt-0.5">{profile.currentOrganization || profile.currentCompany || 'NVIDIA Autonomous Vehicles'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                <span className="text-neutral-500 block text-[10px]">Job Role</span>
                <span className="font-bold text-neutral-900 block mt-0.5">{profile.currentJobRole || 'Systems Engineer'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                <span className="text-neutral-500 block text-[10px]">Graduation Year</span>
                <span className="font-bold text-neutral-900 block mt-0.5">{profile.graduationYear || '2024'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DEVELOPER PROFILE */}
      {role === 'DEVELOPER' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs space-y-3">
            <h3 className="font-display text-base font-bold text-neutral-900 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-neutral-700" />
              Software Engineering Profile
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                <span className="text-neutral-500 block text-[10px]">Specialization</span>
                <span className="font-bold text-neutral-900 block mt-0.5">Distributed Systems & Runtimes</span>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                <span className="text-neutral-500 block text-[10px]">Experience</span>
                <span className="font-bold text-neutral-900 block mt-0.5">{profile.experienceYears || 5} Years</span>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                <span className="text-neutral-500 block text-[10px]">GitHub Profile</span>
                <span className="font-bold text-neutral-900 block mt-0.5">@{profile.githubUsername || 'alex-dev'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESEARCHER PROFILE */}
      {role === 'RESEARCHER' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs space-y-3">
            <h3 className="font-display text-base font-bold text-neutral-900 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-neutral-700" />
              Research Domain & Academic Output
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                <span className="text-neutral-500 block text-[10px]">Research Domain</span>
                <span className="font-bold text-neutral-900 block mt-0.5">Edge AI & Neuromorphic Computing</span>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                <span className="text-neutral-500 block text-[10px]">ORCID</span>
                <span className="font-bold text-neutral-900 block mt-0.5">0000-0002-1825-0097</span>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                <span className="text-neutral-500 block text-[10px]">Publications</span>
                <span className="font-bold text-neutral-900 block mt-0.5">14 Peer-Reviewed Papers</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FACULTY PROFILE */}
      {role === 'FACULTY' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs space-y-3">
            <h3 className="font-display text-base font-bold text-neutral-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-neutral-700" />
              Faculty Credentials & Academic Department
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                <span className="text-neutral-500 block text-[10px]">Faculty ID</span>
                <span className="font-bold text-neutral-900 block mt-0.5">{profile.facultyId || 'EMP-GEHU-FAC-409'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                <span className="text-neutral-500 block text-[10px]">Department</span>
                <span className="font-bold text-neutral-900 block mt-0.5">{profile.department || 'Computer Science & Engineering'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                <span className="text-neutral-500 block text-[10px]">Institution</span>
                <span className="font-bold text-neutral-900 block mt-0.5">{profile.institution || 'Graphic Era Hill University'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INDUSTRY PROFESSIONAL PROFILE */}
      {role === 'INDUSTRY_PROFESSIONAL' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs space-y-3">
            <h3 className="font-display text-base font-bold text-neutral-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-700" />
              Enterprise & Corporate Affiliation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                <span className="text-neutral-500 block text-[10px]">Company</span>
                <span className="font-bold text-neutral-900 block mt-0.5">{profile.currentOrganization || profile.currentCompany || 'HyperCloud'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                <span className="text-neutral-500 block text-[10px]">Industry Domain</span>
                <span className="font-bold text-neutral-900 block mt-0.5">Cloud Infrastructure & Security</span>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                <span className="text-neutral-500 block text-[10px]">Experience</span>
                <span className="font-bold text-neutral-900 block mt-0.5">{profile.experienceYears || 8} Years</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleProfileView;
