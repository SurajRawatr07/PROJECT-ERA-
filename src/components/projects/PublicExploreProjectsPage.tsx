import React, { useState } from 'react';
import {
  Search,
  Plus,
  ArrowLeft,
  Users,
  FileText,
  CheckSquare,
  MessageSquare,
  Info
} from 'lucide-react';
import { EraProject } from '../../types/projectEra';
import { DEPARTMENTS_LIST, PROJECT_STATUS_FLOW } from '../../data/projectEraData';

interface PublicExploreProjectsPageProps {
  projects: EraProject[];
  isAuthenticated: boolean;
  onBackToHome: () => void;
  onCreateProjectClick: () => void;
  onOpenProjectInWorkspace: (projectId: string) => void;
}

export const PublicExploreProjectsPage: React.FC<PublicExploreProjectsPageProps> = ({
  projects,
  isAuthenticated,
  onBackToHome,
  onCreateProjectClick,
  onOpenProjectInWorkspace
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDept = departmentFilter === 'ALL' || p.department === departmentFilter;
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const selectedProject =
    projects.find((p) => p.id === selectedProjectId) || null;

  return (
    <div className="w-full bg-white py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Top Bar & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
          <div>
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            <div className="text-xs font-mono text-neutral-500">
              Project Era · Open Academic Project Directory
            </div>
            <h1 className="mt-1 font-display text-2xl sm:text-3xl font-normal text-neutral-900">
              Explore Projects
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-neutral-600">
              Discover academic projects across departments, inspect technical progress, or publish your own work.
            </p>
          </div>

          <button
            type="button"
            onClick={onCreateProjectClick}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-neutral-800 transition-colors cursor-pointer self-start sm:self-center shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isAuthenticated ? 'Create & Publish Project' : 'Sign In to Publish Project'}</span>
          </button>
        </div>

        {/* Optional Review Policy Banner */}
        <div className="p-4 rounded-xl bg-[#faf9f6] border border-neutral-200 flex items-start gap-3 text-xs text-neutral-600">
          <Info className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
          <div>
            <strong className="text-neutral-900">Direct Publishing Policy:</strong> Projects on Project Era are published immediately upon creation. Faculty review is optional and is shown separately only when requested or available.
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#faf9f6] border border-neutral-200">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, domain, or technology..."
              aria-label="Search academic projects"
              className="w-full rounded-xl border border-neutral-300 bg-white pl-9 pr-3 py-2.5 text-xs sm:text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
            />
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            aria-label="Filter by department"
            className="rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
          >
            <option value="ALL">All Departments</option>
            {DEPARTMENTS_LIST.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by project stage"
            className="rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
          >
            <option value="ALL">All Project Stages</option>
            {PROJECT_STATUS_FLOW.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Project Preview Panel (if inspected) */}
        {selectedProject && (
          <div className="p-5 sm:p-6 rounded-2xl bg-[#faf9f6] border border-neutral-300 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-neutral-200">
              <div>
                <div className="text-xs text-neutral-500">
                  <span>{selectedProject.department}</span>
                  <span aria-hidden="true"> · </span>
                  <span>{selectedProject.academicSession}</span>
                  <span aria-hidden="true"> · </span>
                  <span>Stage: {selectedProject.status}</span>
                </div>
                <h2 className="mt-1 font-display text-xl sm:text-2xl font-semibold text-neutral-900">
                  {selectedProject.title}
                </h2>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onOpenProjectInWorkspace(selectedProject.id)}
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
                >
                  Open Full Project Workspace
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProjectId(null)}
                  className="px-3 py-2 rounded-xl border border-neutral-300 bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>

            <p className="text-sm text-neutral-700 leading-relaxed">
              {selectedProject.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white border border-neutral-200">
                <div className="text-neutral-500">Project Lead & Team</div>
                <div className="font-semibold text-neutral-900 mt-1">
                  {selectedProject.leadStudentName} ({selectedProject.teamMembers.length} members)
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-neutral-200">
                <div className="text-neutral-500">Technologies</div>
                <div className="font-semibold text-neutral-900 mt-1">
                  {selectedProject.technologies.join(' · ')}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-neutral-200">
                <div className="text-neutral-500">Optional Review Status</div>
                <div className="font-semibold text-neutral-900 mt-1">
                  {selectedProject.reviews.length > 0
                    ? `${selectedProject.reviews[0].status} (${selectedProject.reviews.length} feedback record${selectedProject.reviews.length > 1 ? 's' : ''})`
                    : 'Published · No Review Requested'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Project Cards List */}
        {filteredProjects.length === 0 ? (
          <div className="p-10 rounded-2xl bg-white border border-neutral-200 text-center space-y-3">
            <div className="font-display text-base font-semibold text-neutral-900">
              No matching academic projects found
            </div>
            <p className="text-xs sm:text-sm text-neutral-500">
              Try adjusting your search or department filter, or publish a new project.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {filteredProjects.map((proj) => {
              const hasReviews = proj.reviews.length > 0;
              return (
                <article
                  key={proj.id}
                  className="p-5 sm:p-6 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-400 transition-colors flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    {/* Unboxed Metadata Row */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500">
                      <span>{proj.department}</span>
                      <span aria-hidden="true">·</span>
                      <span>Stage: <strong className="text-neutral-800">{proj.status}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {hasReviews
                          ? `Review: ${proj.reviews[0].status}`
                          : 'Published (Review Optional)'}
                      </span>
                    </div>

                    <h2 className="font-display text-lg sm:text-xl font-semibold text-neutral-900 leading-snug">
                      {proj.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-neutral-100">
                    <div className="text-xs text-neutral-500">
                      <span>Tech Stack: </span>
                      <span className="font-medium text-neutral-800">
                        {proj.technologies.join(' · ')}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500">
                      <div className="flex items-center gap-3 font-mono tabular-nums">
                        <span className="inline-flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {proj.teamMembers.length}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <CheckSquare className="w-3.5 h-3.5" />
                          {proj.tasks.length}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" />
                          {proj.documents.length}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          {proj.reviews.length}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedProjectId(
                              selectedProjectId === proj.id ? null : proj.id
                            )
                          }
                          className="px-3 py-1.5 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 cursor-pointer"
                        >
                          {selectedProjectId === proj.id ? 'Hide Summary' : 'Preview'}
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenProjectInWorkspace(proj.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
                        >
                          Open Project
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicExploreProjectsPage;
