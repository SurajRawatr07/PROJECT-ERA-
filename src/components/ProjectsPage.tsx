import React, { useState, useMemo } from 'react';
import { Search, X, PlusCircle, Filter } from 'lucide-react';
import { ProjectItem, ProjectDomain } from '../types';
import { ProjectCard } from './ProjectCard';
import { DOMAINS_LIST } from '../data/mockData';
import { PearlButton } from './ui/pearl-button';

interface ProjectsPageProps {
  projects: ProjectItem[];
  onSelectProject: (project: ProjectItem) => void;
  onJoinProject?: (project: ProjectItem) => void;
  onSubmitProjectClick: () => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  onSelectProject,
  onJoinProject,
  onSubmitProjectClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedDomain, setSelectedDomain] = useState<ProjectDomain>('All');

  const projectTypes = ['All', 'Academic', 'Open Source', 'Research', 'Industry', 'Personal'];

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.techStack.some((t) => t.toLowerCase().includes(q)) ||
        (project.institution && project.institution.toLowerCase().includes(q)) ||
        (project.organization && project.organization.toLowerCase().includes(q));

      const matchesType =
        selectedType === 'All' ||
        project.projectType.toLowerCase().replace('_', ' ') === selectedType.toLowerCase() ||
        (selectedType === 'Open Source' && project.projectType === 'OPEN_SOURCE');

      const matchesDomain =
        selectedDomain === 'All' || project.domain === selectedDomain;

      return matchesSearch && matchesType && matchesDomain;
    });
  }, [projects, searchQuery, selectedType, selectedDomain]);

  return (
    <div className="w-full min-h-[85vh] bg-white pt-24 sm:pt-28 pb-16 px-4 sm:px-6 select-none">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-6 border-b border-black/[0.08] pb-6">
          <div>
            <h1 className="text-[36px] sm:text-[44px] md:text-[50px] font-bold text-[#111111] tracking-[-0.02em] leading-tight">
              Projects
            </h1>
            <p className="text-[16px] sm:text-[17px] text-[#555555] mt-2 max-w-xl">
              Explore projects across engineering, open source, research, and industry.
            </p>
          </div>

          <PearlButton
            id="projects-page-submit-btn"
            onClick={onSubmitProjectClick}
            variant="dark"
            size="md"
            icon={<PlusCircle size={16} />}
            iconPosition="left"
            showSparkle={true}
            label="Submit a Project"
            className="self-start md:self-end"
          />
        </div>

        {/* Search & Filters */}
        <div className="bg-[#FAFAF8] rounded-2xl p-4 sm:p-5 mb-8 border border-black/[0.08]">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
              <input
                id="projects-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, tech stack (e.g. PyTorch, React, Rust), author, or organization..."
                className="w-full pl-11 pr-10 py-2.5 rounded-xl bg-white border border-black/[0.1] text-[#111111] placeholder-[#8E8E8E] text-[15px] focus:outline-none focus:border-black transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#111111] cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Domain Dropdown */}
            <div className="w-full md:w-auto shrink-0 flex items-center gap-2">
              <Filter size={15} className="text-[#666666] hidden md:block" />
              <select
                id="projects-domain-filter"
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value as ProjectDomain)}
                className="w-full md:w-auto px-3.5 py-2.5 rounded-xl bg-white border border-black/[0.1] text-[#111111] text-[14.5px] focus:outline-none focus:border-black cursor-pointer"
              >
                <option value="All">All Domains</option>
                {DOMAINS_LIST.filter((d) => d !== 'All').map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Type Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-3 mt-3 border-t border-black/[0.05]">
            <span className="text-[13px] text-[#666666] font-semibold mr-1 shrink-0">
              Type:
            </span>
            {projectTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 rounded-full text-[13.5px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedType === type
                    ? 'bg-[#111111] text-white'
                    : 'bg-white text-[#444444] border border-black/[0.08] hover:bg-[#F2F2F0] hover:text-[#111111]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-[14px] text-[#666666]">
          <div>
            Showing <strong className="text-[#111111]">{filteredProjects.length}</strong> {filteredProjects.length === 1 ? 'project' : 'projects'}
          </div>

          {(searchQuery || selectedType !== 'All' || selectedDomain !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('All');
                setSelectedDomain('All');
              }}
              className="text-[#111111] underline hover:text-black cursor-pointer font-semibold"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onViewProject={() => onSelectProject(project)}
                onSelect={() => onSelectProject(project)}
                onJoinProject={() => onJoinProject && onJoinProject(project)}
                onJoin={() => onJoinProject && onJoinProject(project)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-[#FAFAF8] rounded-2xl border border-black/[0.08] my-8">
            <h3 className="text-[18px] font-bold text-[#111111] mb-2">No projects found</h3>
            <p className="text-[15px] text-[#666666] max-w-md mx-auto mb-5">
              No projects match your current filter criteria. Try adjusting your search query or reset the filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('All');
                setSelectedDomain('All');
              }}
              className="px-4 py-2 rounded-full bg-[#111111] text-white text-[14px] font-semibold cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
