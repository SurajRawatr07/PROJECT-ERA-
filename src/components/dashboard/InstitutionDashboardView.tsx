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
  Landmark,
  ShieldCheck,
  TrendingUp,
  Globe,
  MapPin
} from 'lucide-react';
import { UserProfile, ProjectItem } from '../../types';
import { 
  resolveUserInstitutionId, 
  getInstitutionAnalytics,
  getInstitutionById,
  getIsolatedDepartments,
  getIsolatedProjects,
  getIsolatedStudents,
  getIsolatedFaculty,
  getIsolatedHODs
} from '../../data/isolatedData';
import { StatsCard } from '../common/StatsCard';

interface InstitutionDashboardViewProps {
  userProfile?: UserProfile;
  profile?: UserProfile;
  onSelectProject?: (project: ProjectItem) => void;
  onOpenPassport?: (passportId: string) => void;
  onNavigateTab?: (tabId: string) => void;
}

export const InstitutionDashboardView: React.FC<InstitutionDashboardViewProps> = ({
  userProfile,
  profile,
  onSelectProject,
  onOpenPassport,
  onNavigateTab
}) => {
  const activeProfile = userProfile || profile;
  const institutionId = resolveUserInstitutionId(activeProfile);

  const institution = getInstitutionById(institutionId);
  const analytics = getInstitutionAnalytics(institutionId);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('ALL');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'overview' | 'departments' | 'projects' | 'analytics'>('overview');

  const departments = analytics.departments;
  const projects = analytics.projectsList;
  const students = analytics.studentsList;
  const faculty = analytics.facultyList;
  const hods = analytics.hodsList;

  // Filter projects by search, department, and domain
  const filteredProjects = projects.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.facultyGuide && p.facultyGuide.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.contributors.some(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDept = selectedDeptFilter === 'ALL' || p.department_id === selectedDeptFilter;
    const matchesDomain = selectedDomainFilter === 'ALL' || p.domain === selectedDomainFilter;

    return matchesSearch && matchesDept && matchesDomain;
  });

  return (
    <div className="space-y-6">
      {/* Institution Intelligence Authority Banner */}
      <div className="bg-[#FBFBFA] rounded-3xl p-6 sm:p-8 border border-black/8 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <img 
              src={institution.logo} 
              alt={institution.name} 
              className="w-16 h-16 rounded-2xl object-cover border border-black/10 shadow-xs shrink-0" 
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold uppercase tracking-wider bg-neutral-900 text-white">
                  Read-Only Institution Intelligence
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code bg-emerald-100 text-emerald-800 font-semibold">
                  Node: {institution.id}
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl text-neutral-900 font-bold tracking-tight">
                {institution.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-neutral-400" />
                  {institution.location}
                </span>
                <a 
                  href={institution.website} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-1 text-neutral-700 hover:text-neutral-900 underline font-mono-code"
                >
                  <Globe className="w-3 h-3 text-neutral-400" />
                  {institution.website.replace('https://', '')}
                </a>
                <span className="font-medium text-emerald-700">
                  {institution.accreditationTier}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <div className="px-3 py-2 rounded-2xl bg-white border border-black/8 shadow-2xs text-right">
              <span className="text-[10px] font-mono-code text-neutral-400 block uppercase">Node Type</span>
              <span className="text-xs font-bold text-neutral-900 block">{institution.type}</span>
            </div>
            <div className="px-3 py-2 rounded-2xl bg-blue-50 border border-blue-200/80 text-right">
              <span className="text-[10px] font-mono-code text-blue-700 block uppercase">Isolated Departments</span>
              <span className="text-xs font-bold text-blue-900 block font-mono-code">{departments.length} Units</span>
            </div>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-neutral-200/60 overflow-x-auto">
          <button
            onClick={() => setViewMode('overview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'overview'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            Campus Overview
          </button>
          <button
            onClick={() => setViewMode('departments')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'departments'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            Departments ({departments.length})
          </button>
          <button
            onClick={() => setViewMode('projects')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'projects'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            Institution Projects ({projects.length})
          </button>
          <button
            onClick={() => setViewMode('analytics')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'analytics'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            Institution Analytics
          </button>
        </div>
      </div>

      {/* Primary KPI Stats Cards (Strictly Institution-Wide Isolated) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <StatsCard
          title="Departments"
          value={departments.length}
          subtitle="Accredited Academic Units"
          icon={Layers}
        />
        <StatsCard
          title="Total Students"
          value={analytics.totalStudents}
          subtitle={`Enrolled across ${institution.shortName}`}
          icon={Users}
        />
        <StatsCard
          title="Total Faculty"
          value={analytics.totalFaculty}
          subtitle="Professors & Mentors"
          icon={UserCheck}
        />
        <StatsCard
          title="Department HODs"
          value={hods.length}
          subtitle="Department Heads"
          icon={GraduationCap}
        />
        <StatsCard
          title="Campus Projects"
          value={projects.length}
          subtitle={`${projects.filter(p => p.status === 'Verified').length} Verified`}
          icon={FolderGit2}
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* VIEW: OVERVIEW */}
      {/* ------------------------------------------------------------- */}
      {viewMode === 'overview' && (
        <div className="space-y-6">
          {/* Department Cards Grid */}
          <div className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-bold text-neutral-900">
                  Academic Departments in {institution.name}
                </h3>
                <p className="text-xs text-neutral-500">
                  All departments strictly registered under this institutional node.
                </p>
              </div>
              <button
                onClick={() => setViewMode('departments')}
                className="text-xs font-semibold text-neutral-700 hover:text-neutral-900 flex items-center gap-1 cursor-pointer"
              >
                <span>View All Details</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map((dept) => (
                <div key={dept.id} className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/70 hover:border-neutral-300 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-neutral-900 text-white">
                        {dept.code}
                      </span>
                      <span className="text-[10px] font-mono-code text-neutral-500">
                        {dept.id}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-neutral-900 mb-1">{dept.name}</h4>
                    <p className="text-xs text-neutral-600 mb-3">
                      HOD: <span className="font-semibold text-neutral-900">{dept.hodName}</span>
                    </p>

                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-white border border-neutral-200/60 text-center">
                      <div>
                        <span className="text-[10px] font-mono-code text-neutral-400 block uppercase">Students</span>
                        <span className="text-xs font-bold text-neutral-900">{dept.studentCount}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono-code text-neutral-400 block uppercase">Faculty</span>
                        <span className="text-xs font-bold text-neutral-900">{dept.facultyCount}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono-code text-neutral-400 block uppercase">Projects</span>
                        <span className="text-xs font-bold text-neutral-900">{dept.projectCount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-neutral-200/50 flex flex-wrap gap-1">
                    {dept.domains.slice(0, 2).map((dom) => (
                      <span key={dom} className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-[10px] text-neutral-600">
                        {dom}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Campus Projects Spotlight */}
          <div className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-bold text-neutral-900">
                  Institution Project Highlights
                </h3>
                <p className="text-xs text-neutral-500">
                  Projects authored by students and faculty from {institution.shortName}.
                </p>
              </div>
              <button
                onClick={() => setViewMode('projects')}
                className="text-xs font-semibold text-neutral-700 hover:text-neutral-900 flex items-center gap-1 cursor-pointer"
              >
                <span>View All Projects</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectProject && onSelectProject(p)}
                  className="p-4 rounded-2xl bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-200/70 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-neutral-900 text-white">
                        {p.department}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code font-semibold bg-emerald-100 text-emerald-800">
                        {p.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-neutral-900 leading-snug">{p.title}</h4>
                    <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">{p.tagline}</p>

                    <div className="flex flex-wrap items-center gap-1 mt-2.5">
                      {p.techStack.slice(0, 4).map((tech) => (
                        <span key={tech} className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-[10px] font-mono-code text-neutral-600">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-neutral-200/60 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-neutral-500">
                      Advisor: <strong className="text-neutral-800">{p.facultyGuide || 'Faculty Guide'}</strong>
                    </span>
                    <span className="text-[11px] font-mono-code text-neutral-400">
                      {p.githubCommits} commits
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* VIEW: DEPARTMENTS LIST & HOD DIRECTORY */}
      {/* ------------------------------------------------------------- */}
      {viewMode === 'departments' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs space-y-4">
            <div>
              <h3 className="font-display text-lg font-bold text-neutral-900">
                Departmental Intelligence Directory
              </h3>
              <p className="text-xs text-neutral-500">
                Detailed roster of departments, appointed Heads of Department (HODs), and academic capacity for {institution.name}.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 text-[11px] font-mono-code uppercase text-neutral-500 bg-neutral-50/70">
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Code / ID</th>
                    <th className="py-3 px-4">Head of Department (HOD)</th>
                    <th className="py-3 px-4 text-center">Students</th>
                    <th className="py-3 px-4 text-center">Faculty</th>
                    <th className="py-3 px-4 text-center">Projects</th>
                    <th className="py-3 px-4">Focus Domains</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs">
                  {departments.map((dept) => (
                    <tr key={dept.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-neutral-900">
                        {dept.name}
                      </td>
                      <td className="py-3.5 px-4 font-mono-code text-neutral-500">
                        <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 font-bold">
                          {dept.code}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-neutral-900 block">{dept.hodName}</span>
                        <span className="text-[10px] text-neutral-400 font-mono-code">{dept.hodEmail}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-neutral-800">
                        {dept.studentCount}
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-neutral-800">
                        {dept.facultyCount}
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-neutral-800">
                        {dept.projectCount}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {dept.domains.slice(0, 2).map((dom) => (
                            <span key={dom} className="px-1.5 py-0.5 rounded bg-neutral-100 text-[10px] text-neutral-600">
                              {dom}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  Institution Projects Repository
                </h3>
                <p className="text-xs text-neutral-500">
                  Strictly showing {projects.length} projects registered under {institution.name}.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-neutral-200 text-xs bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black w-44 sm:w-56"
                  />
                </div>

                <select
                  value={selectedDeptFilter}
                  onChange={(e) => setSelectedDeptFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-neutral-200 text-xs bg-neutral-50 text-neutral-700 cursor-pointer"
                >
                  <option value="ALL">All Departments</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.code} - {d.name}</option>
                  ))}
                </select>

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
                <p className="text-xs font-semibold text-neutral-700">No projects match the criteria</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">Try changing the department or domain filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onSelectProject && onSelectProject(p)}
                    className="p-5 rounded-2xl bg-neutral-50 hover:bg-neutral-100/90 border border-neutral-200/80 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-neutral-900 text-white">
                          {p.department}
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
      {/* VIEW: INSTITUTION ANALYTICS & TRENDS */}
      {/* ------------------------------------------------------------- */}
      {viewMode === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-black/8 shadow-xs space-y-6">
            <div>
              <h3 className="font-display text-lg font-bold text-neutral-900">
                Institution-Wide Intelligence & Domain Analytics
              </h3>
              <p className="text-xs text-neutral-500">
                Cross-departmental technological trends, research domains, and academic throughput for {institution.name}.
              </p>
            </div>

            {/* Cross-Department Domain Distribution */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-neutral-700 font-mono-code uppercase">Research Domains Distribution</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {analytics.domainBreakdown.map((item) => (
                  <div key={item.domain} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 text-center">
                    <span className="text-2xl font-bold text-neutral-900 block">{item.count}</span>
                    <span className="text-xs text-neutral-600 font-medium block mt-1">{item.domain}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technology Trends Across All Departments */}
            <div className="space-y-3 pt-4 border-t border-neutral-100">
              <h4 className="text-xs font-bold text-neutral-700 font-mono-code uppercase">Top Technologies in Use Across Departments</h4>
              <div className="flex flex-wrap gap-2">
                {analytics.topTechTrends.map(([tech, count]) => (
                  <div key={tech} className="px-3 py-1.5 rounded-xl bg-neutral-50 border border-neutral-200/70 text-xs font-mono-code text-neutral-800 flex items-center gap-2">
                    <span className="font-semibold">{tech}</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-neutral-200 text-neutral-700 text-[10px] font-bold">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Institution Activity Stream */}
            <div className="space-y-3 pt-4 border-t border-neutral-100">
              <h4 className="text-xs font-bold text-neutral-700 font-mono-code uppercase">Institutional Activity Ledger</h4>
              <div className="space-y-2">
                {analytics.institutionActivity.map((act) => (
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

export default InstitutionDashboardView;
