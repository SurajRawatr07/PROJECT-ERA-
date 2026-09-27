import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  FileCheck2, 
  ArrowRight,
  SlidersHorizontal,
  ExternalLink,
  Github,
  Globe,
  CheckCircle2,
  Users,
  Building2,
  GraduationCap
} from 'lucide-react';
import { ProjectItem } from '../../types';
import { ProjectStatusBadge } from './ProjectStatusBadge';

interface PublicExploreProjectsViewProps {
  projects: ProjectItem[];
  onSelectProject: (project: ProjectItem) => void;
  onOpenRegister?: () => void;
}

export const PublicExploreProjectsView: React.FC<PublicExploreProjectsViewProps> = ({
  projects,
  onSelectProject,
  onOpenRegister,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [selectedTech, setSelectedTech] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedInstitution, setSelectedInstitution] = useState<string>('ALL');
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // Derive unique options
  const domains = useMemo(() => {
    const set = new Set<string>();
    projects.forEach(p => { if (p.domain) set.add(p.domain); });
    return Array.from(set).sort();
  }, [projects]);

  const technologies = useMemo(() => {
    const set = new Set<string>();
    projects.forEach(p => p.techStack?.forEach(t => set.add(t)));
    return Array.from(set).sort();
  }, [projects]);

  const institutions = useMemo(() => {
    const set = new Set<string>();
    projects.forEach(p => { if (p.institution) set.add(p.institution); });
    return Array.from(set).sort();
  }, [projects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.tagline && p.tagline.toLowerCase().includes(q)) ||
          p.institution.toLowerCase().includes(q) ||
          p.techStack.some(t => t.toLowerCase().includes(q));
        if (!matches) return false;
      }

      if (selectedDomain !== 'ALL' && p.domain !== selectedDomain) return false;
      if (selectedTech !== 'ALL' && !p.techStack.includes(selectedTech)) return false;
      if (selectedDifficulty !== 'ALL' && p.difficulty !== selectedDifficulty) return false;
      if (selectedStatus !== 'ALL' && p.verificationStatus !== selectedStatus) return false;
      if (selectedInstitution !== 'ALL' && p.institution !== selectedInstitution) return false;

      return true;
    });
  }, [projects, searchQuery, selectedDomain, selectedTech, selectedDifficulty, selectedStatus, selectedInstitution]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDomain('ALL');
    setSelectedTech('ALL');
    setSelectedDifficulty('ALL');
    setSelectedStatus('ALL');
    setSelectedInstitution('ALL');
  };

  const hasActiveFilters = 
    searchQuery.trim() !== '' || 
    selectedDomain !== 'ALL' || 
    selectedTech !== 'ALL' || 
    selectedDifficulty !== 'ALL' || 
    selectedStatus !== 'ALL' ||
    selectedInstitution !== 'ALL';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-mono text-neutral-800 mb-4">
          <GraduationCap size={14} />
          <span>Cross-Campus Open Repository</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-neutral-900 tracking-tight">
          Explore Projects
        </h1>
        <p className="mt-3 text-base sm:text-lg text-neutral-600 max-w-2xl font-body leading-relaxed">
          Discover verified capstones, distributed systems, research prototypes, and open-source projects built by students, researchers, and alumni.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-4 sm:p-5 shadow-xs mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by project name, tech stack, keyword, or institution..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50/70 border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all font-body"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700 font-mono"
              >
                Clear
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="sm:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-medium text-neutral-800 bg-neutral-50"
          >
            <SlidersHorizontal size={15} />
            <span>Filters {hasActiveFilters && '•'}</span>
          </button>
        </div>

        {/* Filters Grid */}
        <div className={`${showMobileFilters ? 'grid' : 'hidden'} sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2 border-t border-neutral-100`}>
          {/* Domain */}
          <div>
            <label className="block text-[11px] font-mono text-neutral-500 uppercase tracking-wider mb-1">
              Domain
            </label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full p-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 focus:outline-none focus:border-neutral-900"
            >
              <option value="ALL">All Domains</option>
              {domains.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Technology */}
          <div>
            <label className="block text-[11px] font-mono text-neutral-500 uppercase tracking-wider mb-1">
              Technology
            </label>
            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              className="w-full p-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 focus:outline-none focus:border-neutral-900"
            >
              <option value="ALL">All Technologies</option>
              {technologies.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-[11px] font-mono text-neutral-500 uppercase tracking-wider mb-1">
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full p-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 focus:outline-none focus:border-neutral-900"
            >
              <option value="ALL">All Levels</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>

          {/* Verification Status */}
          <div>
            <label className="block text-[11px] font-mono text-neutral-500 uppercase tracking-wider mb-1">
              Verification
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 focus:outline-none focus:border-neutral-900"
            >
              <option value="ALL">All Statuses</option>
              <option value="VERIFIED">Academic Verified</option>
              <option value="PEER_REVIEWED">Peer / Expert Reviewed</option>
              <option value="PENDING">Community Project</option>
            </select>
          </div>

          {/* Institution */}
          <div>
            <label className="block text-[11px] font-mono text-neutral-500 uppercase tracking-wider mb-1">
              Institution
            </label>
            <select
              value={selectedInstitution}
              onChange={(e) => setSelectedInstitution(e.target.value)}
              className="w-full p-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 focus:outline-none focus:border-neutral-900"
            >
              <option value="ALL">All Institutions</option>
              {institutions.map(inst => (
                <option key={inst} value={inst}>{inst}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Reset button when filtered */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs text-neutral-500">
            <span>Showing {filteredProjects.length} of {projects.length} projects</span>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-neutral-800 hover:text-neutral-950 font-medium cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-neutral-200 bg-white space-y-4 my-8">
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-500 flex items-center justify-center mx-auto">
            <Search size={22} />
          </div>
          <h3 className="text-lg font-bold text-neutral-900 font-display">No projects found</h3>
          <p className="text-sm text-neutral-500 max-w-md mx-auto font-body">
            No projects matched your search criteria. Try removing or relaxing some of your filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-medium cursor-pointer hover:bg-neutral-800 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="group bg-white rounded-3xl border border-neutral-200/90 hover:border-neutral-900 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-lg cursor-pointer"
            >
              <div className="space-y-3">
                {/* Header row: Status & Type */}
                <div className="flex items-center justify-between gap-2">
                  <ProjectStatusBadge status={project.verificationStatus} />
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 border border-neutral-200/60 uppercase">
                    {project.difficulty}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 group-hover:text-neutral-950 font-display transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-neutral-500 font-mono mt-0.5 flex items-center gap-1.5">
                    <Building2 size={13} className="shrink-0 text-neutral-400" />
                    <span className="truncate">{project.institution}</span>
                  </p>
                </div>

                {/* Tagline / Description */}
                <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed font-body">
                  {project.tagline || project.description}
                </p>

                {/* Tech Stack Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.techStack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="text-[10.5px] font-mono px-2 py-0.5 rounded-md bg-neutral-100/90 text-neutral-700 border border-neutral-200/60"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 4 && (
                    <span className="text-[10.5px] font-mono px-1.5 py-0.5 text-neutral-400">
                      +{project.techStack.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer: Metadata & Details Action */}
              <div className="pt-5 mt-5 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="text-neutral-500 font-mono text-[11px]">
                  Batch {project.academicYear || '2025–26'}
                </span>

                <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-900 group-hover:underline">
                  <span>View Passport</span>
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom CTA for unregistered guests */}
      {onOpenRegister && (
        <div className="mt-16 p-8 rounded-3xl bg-neutral-900 text-white text-center space-y-3">
          <h2 className="text-xl sm:text-2xl font-display font-bold">
            Have a project or research to submit?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto font-body">
            Create your account to submit projects, request academic verification, connect with mentors, and preserve multi-year project lineage.
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenRegister}
              className="px-6 py-2.5 rounded-full bg-white text-neutral-900 text-xs sm:text-sm font-semibold hover:bg-neutral-100 transition-all cursor-pointer"
            >
              Get Started with ProjectVerse
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicExploreProjectsView;
