import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  FolderGit2, 
  CheckCircle2, 
  BarChart3, 
  Search, 
  ExternalLink,
  GraduationCap,
  Layers,
  Sparkles,
  UserCheck,
  ShieldAlert,
  Calendar,
  Clock,
  Code2
} from 'lucide-react';
import { UserProfile, ProjectItem } from '../../types';
import { 
  resolveUserInstitutionId, 
  resolveUserDepartmentId, 
  getDepartmentAnalytics,
  getIsolatedProjects,
  getIsolatedStudents,
  getIsolatedFaculty,
  getInstitutionById
} from '../../data/isolatedData';
import { StatsCard } from '../common/StatsCard';

interface HODDashboardViewProps {
  userProfile?: UserProfile;
  data?: any;
  onSelectProject?: (project: ProjectItem) => void;
  onOpenPassport?: (passportId: string) => void;
  onOpenProjectDetail?: (project: ProjectItem) => void;
  onNavigateTab?: (tabId: string) => void;
}

export const HODDashboardView: React.FC<HODDashboardViewProps> = ({
  userProfile,
  onSelectProject,
  onOpenPassport,
  onOpenProjectDetail,
  onNavigateTab
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'overview' | 'projects' | 'associations' | 'analytics'>('overview');

  // Strict Data Isolation: Resolve logged-in HOD's own institution and department
  const institutionId = resolveUserInstitutionId(userProfile);
  const departmentId = resolveUserDepartmentId(userProfile);

  const institution = getInstitutionById(institutionId);
  const analytics = getDepartmentAnalytics(institutionId, departmentId);
  const department = analytics.department;

  const departmentProjects = getIsolatedProjects(institutionId, departmentId);
  const departmentStudents = getIsolatedStudents(institutionId, departmentId);
  const departmentFaculty = getIsolatedFaculty(institutionId, departmentId);

  // Filter projects by search query and domain
  const filteredProjects = departmentProjects.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.facultyGuide && p.facultyGuide.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.contributors.some(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDomain = selectedDomainFilter === 'ALL' || p.domain === selectedDomainFilter;
    return matchesSearch && matchesDomain;
  });

  const handleProjectClick = (project: ProjectItem) => {
    if (onSelectProject) onSelectProject(project);
    else if (onOpenProjectDetail) onOpenProjectDetail(project);
  };

  return (
    <div className="space-y-6">
      {/* Department Intelligence Banner */}
      <div className="bg-[#FBFBFA] rounded-3xl p-6 sm:p-8 border border-black/8 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold uppercase tracking-wider bg-neutral-900 text-white">
                Read-Only Department Intelligence
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code text-neutral-600 bg-neutral-200/60 font-semibold">
                {institution.shortName} • {department?.code || 'DEPT'}
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl text-neutral-900 font-bold tracking-tight">
              {department?.name || 'Academic Department'}
            </h1>
            <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
              Real-time departmental oversight for {institution.name}. View student progress, faculty guidance rosters, technical project telemetry, and curriculum analytics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-2 rounded-2xl bg-white border border-black/8 shadow-2xs text-right">
              <span className="text-[10px] font-mono-code text-neutral-400 block uppercase">Department Head</span>
              <span className="text-xs font-bold text-neutral-900 block">{department?.hodName || userProfile?.fullName || 'HOD'}</span>
            </div>
            <div className="px-3 py-2 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-right">
              <span className="text-[10px] font-mono-code text-emerald-700 block uppercase">Data Isolation</span>
              <span className="text-xs font-bold text-emerald-900 block font-mono-code">
                {departmentId}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Switcher between Department Intelligence Sub-Views */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-neutral-200/60 overflow-x-auto">
          <button
            onClick={() => setViewMode('overview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'overview'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            Department Overview
          </button>
          <button
            onClick={() => setViewMode('projects')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'projects'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            Department Projects ({departmentProjects.length})
          </button>
          <button
            onClick={() => setViewMode('associations')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'associations'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            Student & Faculty Associations
          </button>
          <button
            onClick={() => setViewMode('analytics')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'analytics'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            Analytics & Trends
          </button>
        </div>
      </div>

      {/* Primary KPI Stats Cards (Strictly Department Isolated) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Department Students"
          value={department?.studentCount || departmentStudents.length}
          subtitle={`Enrolled in ${department?.code || 'Department'}`}
          icon={Users}
        />
        <StatsCard
          title="Department Faculty"
          value={department?.facultyCount || departmentFaculty.length}
          subtitle="Professors & Mentors"
          icon={UserCheck}
        />
        <StatsCard
          title="Department Projects"
          value={departmentProjects.length}
          subtitle={`${department?.verifiedProjectsCount || departmentProjects.filter(p => p.status === 'Verified').length} Verified`}
          icon={FolderGit2}
        />
        <StatsCard
          title="Research Domains"
          value={analytics.domainBreakdown.length}
          subtitle="Active specializations"
          icon={BarChart3}
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* VIEW: OVERVIEW */}
      {/* ------------------------------------------------------------- */}
      {viewMode === 'overview' && (
        <div className="space-y-6">
          {/* Quick Department Intelligence Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Projects Spotlight */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-black/8 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-neutral-900">
                    Active Department Projects
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Showing projects strictly belonging to {department?.name}.
                  </p>
                </div>
                <button
                  onClick={() => setViewMode('projects')}
                  className="text-xs font-semibold text-neutral-700 hover:text-neutral-900 flex items-center gap-1 cursor-pointer"
                >
                  <span>View All</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3">
                {departmentProjects.slice(0, 3).map((proj) => (
                  <div 
                    key={proj.id}
                    onClick={() => handleProjectClick(proj)}
                    className="p-4 rounded-2xl bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-200/60 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-neutral-900 text-white">
                          {proj.passportId}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code bg-emerald-100 text-emerald-800 font-semibold">
                          {proj.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-neutral-900">{proj.title}</h4>
                      <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">{proj.tagline}</p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {proj.techStack.slice(0, 4).map((tech) => (
                          <span key={tech} className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-[10px] font-mono-code text-neutral-600">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right sm:shrink-0 text-xs">
                      <span className="text-[10px] text-neutral-400 block font-mono-code">Faculty Guide</span>
                      <span className="font-semibold text-neutral-800 block">{proj.facultyGuide || 'Advisor'}</span>
                      <span className="text-[10px] text-neutral-400 mt-1 block">
                        {proj.githubCommits} Commits • {proj.contributors.length} Students
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 1 Col: Department Faculty Snapshot */}
            <div className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-neutral-900">
                    Faculty Guides
                  </h3>
                  <p className="text-xs text-neutral-500">{departmentFaculty.length} department professors</p>
                </div>
                {onNavigateTab && (
                  <button
                    onClick={() => onNavigateTab('faculty')}
                    className="text-xs font-semibold text-neutral-700 hover:text-neutral-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Roster</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {departmentFaculty.slice(0, 3).map((fac) => (
                  <div key={fac.id} className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/60 flex items-center gap-3">
                    <img src={fac.avatar} alt={fac.name} className="w-10 h-10 rounded-xl object-cover border border-neutral-200" />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-neutral-900 truncate">{fac.name}</h4>
                      <p className="text-[11px] text-neutral-500 truncate">{fac.designation}</p>
                      <span className="text-[10px] font-mono-code text-neutral-400 block">{fac.specialization}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-neutral-800 block">{fac.projectsCount}</span>
                      <span className="text-[10px] text-neutral-400 block font-mono-code">Projects</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* VIEW: PROJECTS (READ-ONLY) */}
      {/* ------------------------------------------------------------- */}
      {viewMode === 'projects' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-lg font-bold text-neutral-900">
                  Department Projects Catalog
                </h3>
                <p className="text-xs text-neutral-500">
                  Strictly showing {departmentProjects.length} projects registered under {department?.name}.
                </p>
              </div>

              {/* Search & Domain Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search department projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-neutral-200 text-xs bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black w-48 sm:w-60"
                  />
                </div>

                <select
                  value={selectedDomainFilter}
                  onChange={(e) => setSelectedDomainFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-neutral-200 text-xs bg-neutral-50 text-neutral-700 cursor-pointer"
                >
                  <option value="ALL">All Domains</option>
                  {analytics.domainBreakdown.map(d => (
                    <option key={d.domain} value={d.domain}>{d.domain}</option>
                  ))}
                </select>
              </div>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="p-8 text-center bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
                <FolderGit2 className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-neutral-700">No projects found</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">Try clearing the search query or domain filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleProjectClick(p)}
                    className="p-5 rounded-2xl bg-neutral-50 hover:bg-neutral-100/90 border border-neutral-200/80 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-neutral-900 text-white">
                          {p.passportId}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code font-semibold bg-emerald-100 text-emerald-800">
                          {p.status}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-neutral-900 leading-snug">{p.title}</h4>
                      <p className="text-xs text-neutral-500 line-clamp-2 mt-1">{p.tagline}</p>

                      <div className="flex flex-wrap items-center gap-1.5 my-3">
                        {p.techStack.map((tech) => (
                          <span key={tech} className="px-2 py-0.5 rounded-md bg-white border border-neutral-200/80 text-[10px] font-mono-code text-neutral-700">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-200/60 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-neutral-400 block font-mono-code">Faculty Guide</span>
                        <span className="font-semibold text-neutral-800">{p.facultyGuide || 'Advisor'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {onOpenPassport && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenPassport(p.passport?.passportId || p.passportId);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-100 text-[11px] font-semibold text-neutral-700 cursor-pointer shadow-2xs"
                          >
                            Passport
                          </button>
                        )}
                        <span className="text-[11px] font-mono-code text-neutral-400">
                          {p.githubCommits} commits
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* VIEW: ASSOCIATIONS (STUDENT-PROJECT & FACULTY-PROJECT) */}
      {/* ------------------------------------------------------------- */}
      {viewMode === 'associations' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Faculty to Project Guidance Associations */}
          <div className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs space-y-4">
            <div>
              <h3 className="font-display text-base font-bold text-neutral-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-neutral-800" />
                <span>Faculty-Project Guidance Load</span>
              </h3>
              <p className="text-xs text-neutral-500">
                Department faculty members and projects actively under their supervision.
              </p>
            </div>

            <div className="space-y-3">
              {departmentFaculty.map((fac) => (
                <div key={fac.id} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={fac.avatar} alt={fac.name} className="w-8 h-8 rounded-lg object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900">{fac.name}</h4>
                        <span className="text-[10px] text-neutral-500 font-mono-code">{fac.facultyId} • {fac.designation}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-neutral-200 text-neutral-800">
                      {fac.projectsCount} Projects
                    </span>
                  </div>

                  <div className="pt-2 border-t border-neutral-200/50">
                    <span className="text-[10px] font-mono-code uppercase text-neutral-400 block mb-1">Guided Projects:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {fac.projectTitles.map((title) => (
                        <span key={title} className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-[11px] text-neutral-800">
                          {title}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student to Project Contribution Associations */}
          <div className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs space-y-4">
            <div>
              <h3 className="font-display text-base font-bold text-neutral-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-neutral-800" />
                <span>Student-Project Contributions</span>
              </h3>
              <p className="text-xs text-neutral-500">
                Enrolled department students and their active repository contributions.
              </p>
            </div>

            <div className="space-y-3">
              {departmentStudents.map((stu) => (
                <div key={stu.id} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={stu.avatar} alt={stu.name} className="w-8 h-8 rounded-lg object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900">{stu.name}</h4>
                        <span className="text-[10px] text-neutral-500 font-mono-code">{stu.rollNumber} • {stu.course}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-emerald-100 text-emerald-800">
                      {stu.batch}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-neutral-200/50">
                    <span className="text-[10px] font-mono-code uppercase text-neutral-400 block mb-1">Associated Projects:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {stu.projectTitles.map((title) => (
                        <span key={title} className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-[11px] text-neutral-800 font-medium">
                          {title}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* VIEW: ANALYTICS & DOMAIN TRENDS */}
      {/* ------------------------------------------------------------- */}
      {viewMode === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs space-y-6">
            <div>
              <h3 className="font-display text-lg font-bold text-neutral-900">
                Department Intelligence Analytics
              </h3>
              <p className="text-xs text-neutral-500">
                Accreditation metrics, domain distribution, and technology adoption for {department?.name}.
              </p>
            </div>

            {/* Domain Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-neutral-700 font-mono-code uppercase">Research & Project Domains</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {analytics.domainBreakdown.map((item) => (
                  <div key={item.domain} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 text-center">
                    <span className="text-2xl font-bold text-neutral-900 block">{item.count}</span>
                    <span className="text-xs text-neutral-600 font-medium block mt-1">{item.domain}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Technologies */}
            <div className="space-y-3 pt-4 border-t border-neutral-100">
              <h4 className="text-xs font-bold text-neutral-700 font-mono-code uppercase">Top Technologies in Department</h4>
              <div className="flex flex-wrap gap-2">
                {analytics.topTechStack.map(([tech, count]) => (
                  <div key={tech} className="px-3 py-1.5 rounded-xl bg-neutral-50 border border-neutral-200/70 text-xs font-mono-code text-neutral-800 flex items-center gap-2">
                    <span className="font-semibold">{tech}</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-neutral-200 text-neutral-700 text-[10px] font-bold">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Department Activity Stream */}
            <div className="space-y-3 pt-4 border-t border-neutral-100">
              <h4 className="text-xs font-bold text-neutral-700 font-mono-code uppercase">Department Activity Log</h4>
              <div className="space-y-2">
                {analytics.recentActivity.map((act) => (
                  <div key={act.id} className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/50 flex items-center justify-between text-xs">
                    <span className="text-neutral-800 font-medium">{act.text}</span>
                    <span className="text-[11px] text-neutral-400 font-mono-code shrink-0 ml-3">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HODDashboardView;
