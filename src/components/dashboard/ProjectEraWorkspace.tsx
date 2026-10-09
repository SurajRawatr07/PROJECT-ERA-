import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  UserCircle,
  Settings,
  LogOut,
  Plus,
  Edit3,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  FileText,
  MessageSquare,
  Search,
  Award,
  Landmark,
  BookOpen,
  GraduationCap,
  Info
} from 'lucide-react';
import {
  EraAccountType,
  EraFacultyReview,
  EraMentoringRequest,
  EraProject,
  EraProjectStatus,
  EraReviewStatus,
  EraTaskStatus,
  EraUserProfile
} from '../../types/projectEra';
import {
  DEMO_USERS,
  DEPARTMENTS_LIST,
  PROJECT_STATUS_FLOW
} from '../../data/projectEraData';
import {
  ProjectEraDetailView,
  isTaskOverdue
} from '../projects/ProjectEraDetailView';
import { ProjectEraFormModal } from '../projects/ProjectEraFormModal';

interface ProjectEraWorkspaceProps {
  user: EraUserProfile;
  projects: EraProject[];
  mentoringRequests: EraMentoringRequest[];
  activeNav: 'dashboard' | 'projects' | 'project-details' | 'profile' | 'settings';
  selectedProjectId: string | null;
  onSelectNav: (nav: 'dashboard' | 'projects' | 'project-details' | 'profile' | 'settings') => void;
  onSelectProject: (projectId: string) => void;
  onUpdateProject: (updated: EraProject) => void;
  onCreateProject: (created: EraProject) => void;
  onUpdateUser: (updated: EraUserProfile) => void;
  onSwitchDemoRole: (role: EraAccountType) => void;
  onUpdateMentoringRequests: (updated: EraMentoringRequest[]) => void;
  onResetDemoData: () => void;
  onLogout: () => void;
}

export const ProjectEraWorkspace: React.FC<ProjectEraWorkspaceProps> = ({
  user,
  projects,
  mentoringRequests,
  activeNav,
  selectedProjectId,
  onSelectNav,
  onSelectProject,
  onUpdateProject,
  onCreateProject,
  onUpdateUser,
  onSwitchDemoRole,
  onUpdateMentoringRequests,
  onResetDemoData,
  onLogout
}) => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<EraProject | null>(null);

  // Filters for Projects Directory & HOD Overview
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Faculty Dashboard quick review state
  const [quickReviewProjectId, setQuickReviewProjectId] = useState<string>(
    projects[0]?.id || ''
  );
  const [quickReviewStatus, setQuickReviewStatus] = useState<EraReviewStatus>('Approved');
  const [quickReviewText, setQuickReviewText] = useState('');
  const [facultyFeedbackBanner, setFacultyFeedbackBanner] = useState<string | null>(null);

  // Alumni Dashboard new mentoring offer state
  const [mentorProjectId, setMentorProjectId] = useState<string>(projects[0]?.id || '');
  const [mentorTopic, setMentorTopic] = useState('');
  const [mentorMessage, setMentorMessage] = useState('');
  const [alumniSkillInput, setAlumniSkillInput] = useState('');

  // Profile Edit State
  const [profileFullName, setProfileFullName] = useState(user.fullName);
  const [profileDepartment, setProfileDepartment] = useState(user.department);
  const [profileInstitution, setProfileInstitution] = useState(user.institution);
  const [profileBio, setProfileBio] = useState(user.bio || '');
  const [profileSavedNotice, setProfileSavedNotice] = useState<string | null>(null);

  const selectedProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0] || null;

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (project: EraProject) => {
    setEditingProject(project);
    setIsFormModalOpen(true);
  };

  const handleSaveProjectModal = (saved: EraProject) => {
    const exists = projects.some((p) => p.id === saved.id);
    if (exists) {
      onUpdateProject(saved);
    } else {
      onCreateProject(saved);
    }
  };

  const handleQuickTaskStatus = (
    project: EraProject,
    taskId: string,
    newStatus: EraTaskStatus
  ) => {
    onUpdateProject({
      ...project,
      tasks: project.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
      updatedAt: '2026-03-20'
    });
  };

  const handleFacultyQuickReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickReviewText.trim()) return;
    const target = projects.find((p) => p.id === quickReviewProjectId);
    if (!target) return;

    const newRev: EraFacultyReview = {
      id: `rev-${Date.now()}`,
      projectId: target.id,
      projectTitle: target.title,
      reviewerName: user.fullName,
      reviewerRole: user.accountType === 'HOD' ? 'HOD' : 'Faculty',
      status: quickReviewStatus,
      feedback: quickReviewText.trim(),
      submittedAt: '2026-03-20'
    };

    onUpdateProject({
      ...target,
      status: quickReviewStatus === 'Completed' ? 'Completed' : target.status,
      reviews: [newRev, ...target.reviews],
      updatedAt: '2026-03-20'
    });

    setQuickReviewText('');
    setFacultyFeedbackBanner(
      `Feedback recorded for "${target.title}" with status "${quickReviewStatus}".`
    );
  };

  const handleCreateMentoringOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorTopic.trim() || !mentorMessage.trim()) return;
    const targetProject = projects.find((p) => p.id === mentorProjectId) || projects[0];
    if (!targetProject) return;

    const newReq: EraMentoringRequest = {
      id: `ment-${Date.now()}`,
      projectId: targetProject.id,
      projectTitle: targetProject.title,
      studentName: targetProject.leadStudentName,
      department: targetProject.department,
      alumniName: user.fullName,
      topic: mentorTopic.trim(),
      message: mentorMessage.trim(),
      status: 'Accepted',
      requestedAt: '2026-03-20'
    };

    onUpdateMentoringRequests([newReq, ...mentoringRequests]);
    setMentorTopic('');
    setMentorMessage('');
  };

  const handleMentoringStatusChange = (
    reqId: string,
    status: EraMentoringRequest['status']
  ) => {
    onUpdateMentoringRequests(
      mentoringRequests.map((r) => (r.id === reqId ? { ...r, status } : r))
    );
  };

  const handleAddAlumniSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alumniSkillInput.trim()) return;
    const existing = user.skills || [];
    if (!existing.includes(alumniSkillInput.trim())) {
      onUpdateUser({
        ...user,
        skills: [...existing, alumniSkillInput.trim()]
      });
    }
    setAlumniSkillInput('');
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDept = departmentFilter === 'ALL' || p.department === departmentFilter;
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const allReviews = projects.flatMap((p) => p.reviews);
  const allTasks = projects.flatMap((p) =>
    p.tasks.map((t) => ({ ...t, projectTitle: p.title, projectId: p.id, projectObj: p }))
  );
  const overdueTasks = allTasks.filter((t) => isTaskOverdue(t.dueDate, t.status));

  return (
    <div className="min-h-screen bg-[#faf9f6] text-neutral-900 flex flex-col">
      {/* TOP WORKSPACE HEADER */}
      <header className="sticky top-0 z-40 h-16 border-b border-neutral-200 bg-white px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => onSelectNav('dashboard')}
            className="font-display text-xl font-bold tracking-tight text-neutral-900 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Project Era
          </button>

          <div className="hidden md:flex items-center gap-2 text-xs text-neutral-500">
            <span>Workspace</span>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-neutral-900">
              {user.accountType === 'HOD'
                ? 'HOD Dashboard'
                : `${user.accountType.charAt(0)}${user.accountType.slice(1).toLowerCase()} Dashboard`}
            </span>
            <span aria-hidden="true">·</span>
            <span>Demonstration Mode</span>
          </div>
        </div>

        {/* Role Switcher & Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 text-xs">
            <span className="text-neutral-500">Demo Role:</span>
            <select
              value={user.accountType}
              onChange={(e) => onSwitchDemoRole(e.target.value as EraAccountType)}
              aria-label="Switch demonstration account role"
              className="rounded-lg border border-neutral-300 bg-[#faf9f6] px-2.5 py-1.5 text-xs font-semibold text-neutral-900 focus:border-neutral-900 focus:outline-none cursor-pointer"
            >
              <option value="STUDENT">Student</option>
              <option value="FACULTY">Faculty</option>
              <option value="HOD">HOD</option>
              <option value="ALUMNI">Alumni</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Project</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* WORKSPACE BODY: SIDEBAR + MAIN VIEWPORT */}
      <div className="flex-1 mx-auto w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 sm:px-6 lg:px-8 py-6">
        {/* LEFT SIDEBAR NAVIGATION */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-4">
            <div className="pb-3 border-b border-neutral-100">
              <div className="text-xs font-mono text-neutral-500">
                {user.accountType} ACCOUNT (DEMO)
              </div>
              <div className="font-display text-base font-semibold text-neutral-900 mt-0.5">
                {user.fullName}
              </div>
              <div className="text-xs text-neutral-500 truncate">{user.department}</div>
            </div>

            <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0">
              {[
                {
                  id: 'dashboard',
                  label: `${
                    user.accountType === 'HOD'
                      ? 'HOD'
                      : user.accountType.charAt(0) + user.accountType.slice(1).toLowerCase()
                  } Dashboard`,
                  icon: LayoutDashboard
                },
                { id: 'projects', label: 'All Projects', icon: FolderKanban },
                { id: 'profile', label: 'My Profile', icon: UserCircle },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((item) => {
                const Icon = item.icon;
                const isActive =
                  activeNav === item.id ||
                  (activeNav === 'project-details' && item.id === 'projects');
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectNav(item.id as typeof activeNav)}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-neutral-900 text-white font-semibold'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Mobile Role Switcher */}
          <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-2.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Switch Role Dashboard (Demo)
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {(['STUDENT', 'FACULTY', 'HOD', 'ALUMNI'] as EraAccountType[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => onSwitchDemoRole(r)}
                  className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                    user.accountType === r
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-[#faf9f6] text-neutral-700 border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  {r === 'HOD' ? 'HOD' : r.charAt(0) + r.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* MAIN VIEWPORT */}
        <main className="lg:col-span-9 space-y-6">
          {/* =============================================================== */}
          {/* VIEW 1: PROJECT DETAILS */}
          {/* =============================================================== */}
          {activeNav === 'project-details' && selectedProject && (
            <ProjectEraDetailView
              project={selectedProject}
              currentRole={user.accountType}
              currentUserName={user.fullName}
              onBack={() => onSelectNav('projects')}
              onEditProject={handleOpenEditModal}
              onUpdateProject={onUpdateProject}
            />
          )}

          {/* =============================================================== */}
          {/* VIEW 2: ALL PROJECTS DIRECTORY */}
          {/* =============================================================== */}
          {activeNav === 'projects' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-mono text-neutral-500">
                      Project Era · College Project Directory (Demonstration Data)
                    </div>
                    <h1 className="font-display text-2xl font-normal text-neutral-900">
                      Academic Projects
                    </h1>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenCreateModal}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer self-start"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Project</span>
                  </button>
                </div>

                {/* Search & Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search title, domain, tech..."
                      className="w-full rounded-xl border border-neutral-300 pl-9 pr-3 py-2 text-xs sm:text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                    />
                  </div>

                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs sm:text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                  >
                    <option value="ALL">All Departments</option>
                    {DEPARTMENTS_LIST.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs sm:text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                  >
                    <option value="ALL">All Lifecycle Statuses</option>
                    {PROJECT_STATUS_FLOW.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {filteredProjects.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white border border-neutral-200 text-center space-y-3">
                  <div className="text-sm font-semibold text-neutral-900">
                    No matching academic projects found
                  </div>
                  <p className="text-xs text-neutral-500">
                    Try clearing your search filters or create a new project workspace.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProjects.map((proj) => {
                    const overdue = proj.tasks.filter((t) =>
                      isTaskOverdue(t.dueDate, t.status)
                    ).length;
                    return (
                      <div
                        key={proj.id}
                        className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-400 transition-colors space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                              <span>{proj.department}</span>
                              <span aria-hidden="true">·</span>
                              <span>Status: <strong>{proj.status}</strong></span>
                              <span aria-hidden="true">·</span>
                              <span>Supervisor: {proj.supervisorName}</span>
                            </div>
                            <h2 className="mt-1 font-display text-xl font-semibold text-neutral-900">
                              {proj.title}
                            </h2>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(proj)}
                              className="px-3 py-1.5 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => onSelectProject(proj.id)}
                              className="px-4 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
                            >
                              Open Workspace
                            </button>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                          {proj.description}
                        </p>

                        <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500">
                          <div>
                            <span>Technologies: </span>
                            <span className="text-neutral-800 font-medium">
                              {proj.technologies.join(' · ')}
                            </span>
                          </div>
                          <div className="font-mono tabular-nums">
                            {proj.teamMembers.length} Members · {proj.tasks.length} Tasks
                            {overdue > 0 ? ` · ${overdue} Overdue` : ''}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* =============================================================== */}
          {/* VIEW 3: PROFILE */}
          {/* =============================================================== */}
          {activeNav === 'profile' && (
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200 space-y-6">
              <div>
                <div className="text-xs font-mono text-neutral-500">
                  Account Type: {user.accountType} · Demonstration Profile
                </div>
                <h1 className="font-display text-2xl font-normal text-neutral-900">
                  {user.fullName}
                </h1>
                <p className="text-xs text-neutral-500">{user.email}</p>
              </div>

              {profileSavedNotice && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>{profileSavedNotice}</span>
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onUpdateUser({
                    ...user,
                    fullName: profileFullName.trim() || user.fullName,
                    institution: profileInstitution.trim() || user.institution,
                    department: profileDepartment,
                    bio: profileBio.trim()
                  });
                  setProfileSavedNotice(
                    'Profile updated in your browser demonstration session.'
                  );
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileFullName}
                      onChange={(e) => setProfileFullName(e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 px-3.5 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Institution / College
                    </label>
                    <input
                      type="text"
                      value={profileInstitution}
                      onChange={(e) => setProfileInstitution(e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 px-3.5 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Department
                  </label>
                  <select
                    value={profileDepartment}
                    onChange={(e) => setProfileDepartment(e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                  >
                    {DEPARTMENTS_LIST.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Academic / Professional Bio
                  </label>
                  <textarea
                    rows={3}
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 px-3.5 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-neutral-900 text-white text-xs sm:text-sm font-semibold hover:bg-neutral-800 cursor-pointer"
                >
                  Save Profile Changes (Demo)
                </button>
              </form>
            </div>
          )}

          {/* =============================================================== */}
          {/* VIEW 4: SETTINGS */}
          {/* =============================================================== */}
          {activeNav === 'settings' && (
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200 space-y-6">
              <div>
                <div className="text-xs font-mono text-neutral-500">
                  Project Era · Workspace Preferences
                </div>
                <h1 className="font-display text-2xl font-normal text-neutral-900">
                  Workspace & Demonstration Settings
                </h1>
              </div>

              <div className="p-4 rounded-xl bg-[#faf9f6] border border-neutral-200 flex items-start gap-3 text-xs text-neutral-600">
                <Info className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-900">About Frontend-Only Mode:</strong> This Project Era workspace runs entirely in your browser using React and TypeScript. Changes to projects, tasks, reviews, and profiles are kept in local demonstration state so you can test all four college roles without a backend server.
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-semibold text-neutral-900">
                    Reset Demonstration Data
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Restore all sample projects, tasks, milestones, and reviews to their initial state.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onResetDemoData}
                  className="px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 cursor-pointer self-start"
                >
                  Reset Demo Workspace
                </button>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* VIEW 5: ROLE-SPECIFIC DASHBOARDS */}
          {/* =============================================================== */}
          {activeNav === 'dashboard' && (
            <>
              {/* ----------------------------------------------------------- */}
              {/* 5A. STUDENT DASHBOARD */}
              {/* ----------------------------------------------------------- */}
              {user.accountType === 'STUDENT' && (
                <div className="space-y-6">
                  {/* Welcome Section */}
                  <div className="p-6 rounded-2xl bg-white border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <GraduationCap className="w-4 h-4 text-neutral-800" />
                        <span>Student Dashboard · Demonstration Data</span>
                      </div>
                      <h1 className="mt-1 font-display text-2xl font-normal text-neutral-900">
                        Welcome, {user.fullName}
                      </h1>
                      <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
                        {user.course || 'B.Tech CSE'} · {user.batch || '2023–2027'} · {user.department}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenCreateModal}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-xs sm:text-sm font-semibold hover:bg-neutral-800 cursor-pointer self-start"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Project</span>
                    </button>
                  </div>

                  {/* Project Progress Summary */}
                  <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="font-display text-lg font-semibold text-neutral-900">
                        My Projects & Lifecycle Progress (Demo)
                      </h2>
                      <button
                        type="button"
                        onClick={() => onSelectNav('projects')}
                        className="text-xs font-semibold text-neutral-900 underline cursor-pointer"
                      >
                        View All Projects
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {projects.slice(0, 4).map((proj) => {
                        const stageIndex = PROJECT_STATUS_FLOW.indexOf(proj.status);
                        const percent = Math.round(
                          ((stageIndex + 1) / PROJECT_STATUS_FLOW.length) * 100
                        );
                        return (
                          <div
                            key={proj.id}
                            className="p-5 rounded-xl bg-[#faf9f6] border border-neutral-200 flex flex-col justify-between space-y-4"
                          >
                            <div>
                              <div className="flex items-center justify-between text-xs text-neutral-500">
                                <span>{proj.domain}</span>
                                <span className="font-mono font-semibold text-neutral-900">
                                  Stage: {proj.status}
                                </span>
                              </div>
                              <h3 className="mt-1 font-display text-base font-semibold text-neutral-900">
                                {proj.title}
                              </h3>
                              <p className="mt-1 text-xs text-neutral-600 line-clamp-2">
                                {proj.description}
                              </p>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
                                <span>Lifecycle Progress</span>
                                <span className="tabular-nums">{percent}%</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-neutral-200 overflow-hidden">
                                <div
                                  className="h-full bg-neutral-900"
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                              <div className="pt-2 flex items-center justify-between">
                                <span className="text-xs text-neutral-500">
                                  Supervisor: {proj.supervisorName}
                                </span>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditModal(proj)}
                                    className="text-xs font-medium text-neutral-600 hover:text-neutral-900 cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onSelectProject(proj.id)}
                                    className="text-xs font-semibold text-neutral-900 underline cursor-pointer"
                                  >
                                    Manage Project →
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tasks & Deadlines + Team Members Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Tasks and Deadlines */}
                    <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-neutral-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="font-display text-lg font-semibold text-neutral-900">
                            Tasks and Deadlines
                          </h2>
                          <p className="text-xs text-neutral-500">
                            Update task status directly or open a project to add new tasks.
                          </p>
                        </div>
                        <Clock className="w-4 h-4 text-neutral-600" />
                      </div>

                      <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-xl overflow-hidden">
                        {allTasks.slice(0, 5).map((task) => {
                          const overdue = isTaskOverdue(task.dueDate, task.status);
                          return (
                            <div
                              key={task.id}
                              className="p-3.5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                            >
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-xs sm:text-sm font-semibold text-neutral-900">
                                    {task.title}
                                  </span>
                                  {overdue && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700">
                                      <AlertTriangle className="w-3 h-3" />
                                      Overdue
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-neutral-500">
                                  {task.projectTitle} · Assignee: {task.assigneeName} ·{' '}
                                  <span className="font-mono tabular-nums">Due {task.dueDate}</span>
                                </div>
                              </div>

                              <select
                                value={task.status}
                                onChange={(e) =>
                                  handleQuickTaskStatus(
                                    task.projectObj,
                                    task.id,
                                    e.target.value as EraTaskStatus
                                  )
                                }
                                className="rounded-lg border border-neutral-300 bg-[#faf9f6] px-2.5 py-1 text-xs font-semibold text-neutral-800 focus:border-neutral-900 focus:outline-none self-start sm:self-center"
                              >
                                <option value="Todo">Todo</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                              </select>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Team Members & Pending Feedback */}
                    <div className="lg:col-span-5 space-y-6">
                      {/* Team Members */}
                      <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <h2 className="font-display text-lg font-semibold text-neutral-900">
                            Team Members
                          </h2>
                          <Users className="w-4 h-4 text-neutral-600" />
                        </div>
                        <div className="space-y-2.5">
                          {projects[0]?.teamMembers.map((tm) => (
                            <div
                              key={tm.id}
                              className="p-3 rounded-xl bg-[#faf9f6] border border-neutral-200 flex items-center justify-between text-xs"
                            >
                              <div>
                                <div className="font-semibold text-neutral-900">{tm.name}</div>
                                <div className="text-neutral-500">{tm.role}</div>
                              </div>
                              <span className="font-mono text-neutral-600">{tm.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pending Feedback & Recent Activity */}
                      <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-3">
                        <h2 className="font-display text-lg font-semibold text-neutral-900">
                          Recent Faculty Feedback & Activity
                        </h2>
                        <div className="space-y-2.5">
                          {allReviews.slice(0, 3).map((rev) => (
                            <div
                              key={rev.id}
                              className="p-3 rounded-xl bg-[#faf9f6] border border-neutral-200 space-y-1 text-xs"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-neutral-900">
                                  {rev.reviewerName}
                                </span>
                                <span className="font-mono text-neutral-500">{rev.status}</span>
                              </div>
                              <div className="text-neutral-500 truncate">{rev.projectTitle}</div>
                              <p className="text-neutral-700">{rev.feedback}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* 5B. FACULTY DASHBOARD */}
              {/* ----------------------------------------------------------- */}
              {user.accountType === 'FACULTY' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-white border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <BookOpen className="w-4 h-4 text-neutral-800" />
                        <span>Faculty Dashboard · Demonstration Data</span>
                      </div>
                      <h1 className="mt-1 font-display text-2xl font-normal text-neutral-900">
                        {user.fullName}
                      </h1>
                      <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
                        {user.designation || 'Faculty Supervisor'} · {user.department}
                      </p>
                    </div>
                  </div>

                  {/* Assigned Projects & Projects Awaiting Review */}
                  <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-display text-lg font-semibold text-neutral-900">
                          Assigned Projects & Student Progress
                        </h2>
                        <p className="text-xs text-neutral-500">
                          Monitor student milestone progress, pending submissions, and review statuses.
                        </p>
                      </div>
                    </div>

                    <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-xl overflow-hidden">
                      {projects.map((proj) => {
                        const avgProgress =
                          proj.milestones.length > 0
                            ? Math.round(
                                proj.milestones.reduce((acc, m) => acc + m.progress, 0) /
                                  proj.milestones.length
                              )
                            : 0;
                        return (
                          <div
                            key={proj.id}
                            className="p-4 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                                <span>Lead: {proj.leadStudentName}</span>
                                <span aria-hidden="true">·</span>
                                <span>Stage: <strong>{proj.status}</strong></span>
                                <span aria-hidden="true">·</span>
                                <span className="font-mono tabular-nums">
                                  Milestone Avg: {avgProgress}%
                                </span>
                              </div>
                              <div className="text-sm sm:text-base font-semibold text-neutral-900">
                                {proj.title}
                              </div>
                              <div className="text-xs text-neutral-500">
                                {proj.documents.length} Submissions · {proj.reviews.length} Reviews Recorded
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => onSelectProject(proj.id)}
                                className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
                              >
                                Review Project & Submissions
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Feedback Actions & Pending Submissions */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-6 p-6 rounded-2xl bg-white border border-neutral-200 space-y-4">
                      <h2 className="font-display text-lg font-semibold text-neutral-900">
                        Quick Feedback & Review Action
                      </h2>

                      {facultyFeedbackBanner && (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                          {facultyFeedbackBanner}
                        </div>
                      )}

                      <form onSubmit={handleFacultyQuickReview} className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            Select Student Project
                          </label>
                          <select
                            value={quickReviewProjectId}
                            onChange={(e) => setQuickReviewProjectId(e.target.value)}
                            className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs sm:text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                          >
                            {projects.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.title}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            Review Decision Status
                          </label>
                          <select
                            value={quickReviewStatus}
                            onChange={(e) =>
                              setQuickReviewStatus(e.target.value as EraReviewStatus)
                            }
                            className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs sm:text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                          >
                            <option value="Pending Review">Pending Review</option>
                            <option value="Revisions Requested">Revisions Requested</option>
                            <option value="Approved">Approved</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            Faculty Feedback Notes *
                          </label>
                          <textarea
                            required
                            rows={3}
                            value={quickReviewText}
                            onChange={(e) => setQuickReviewText(e.target.value)}
                            placeholder="Enter evaluation comments, rubric feedback, or required changes..."
                            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs sm:text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
                        >
                          Submit Faculty Review (Demo)
                        </button>
                      </form>
                    </div>

                    {/* Pending Submissions & Review History */}
                    <div className="lg:col-span-6 space-y-6">
                      <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-3">
                        <h2 className="font-display text-lg font-semibold text-neutral-900">
                          Recent Student Document Submissions
                        </h2>
                        <div className="space-y-2.5">
                          {projects
                            .flatMap((p) =>
                              p.documents.map((d) => ({ ...d, projectTitle: p.title, projectId: p.id }))
                            )
                            .slice(0, 4)
                            .map((doc) => (
                              <div
                                key={doc.id}
                                className="p-3 rounded-xl bg-[#faf9f6] border border-neutral-200 flex items-center justify-between gap-2 text-xs"
                              >
                                <div>
                                  <div className="font-semibold text-neutral-900">{doc.title}</div>
                                  <div className="text-neutral-500">
                                    {doc.projectTitle} · {doc.fileName} ({doc.fileSize})
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => onSelectProject(doc.projectId)}
                                  className="font-semibold text-neutral-900 underline shrink-0 cursor-pointer"
                                >
                                  Inspect
                                </button>
                              </div>
                            ))}
                        </div>
                      </div>

                      <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-3">
                        <h2 className="font-display text-lg font-semibold text-neutral-900">
                          Project Review History
                        </h2>
                        <div className="space-y-2.5">
                          {allReviews.map((rev) => (
                            <div
                              key={rev.id}
                              className="p-3 rounded-xl bg-[#faf9f6] border border-neutral-200 text-xs space-y-1"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-neutral-900">
                                  {rev.projectTitle}
                                </span>
                                <span className="font-mono text-neutral-600">{rev.status}</span>
                              </div>
                              <p className="text-neutral-600">{rev.feedback}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* 5C. HOD DASHBOARD */}
              {/* ----------------------------------------------------------- */}
              {user.accountType === 'HOD' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-white border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <Landmark className="w-4 h-4 text-neutral-800" />
                        <span>HOD Department Overview · Demonstration Data</span>
                      </div>
                      <h1 className="mt-1 font-display text-2xl font-normal text-neutral-900">
                        {user.fullName}
                      </h1>
                      <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
                        {user.designation || 'Head of Department'} · {user.department}
                      </p>
                    </div>
                  </div>

                  {/* Project Status Summary (Tabular Counts) */}
                  <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-4">
                    <h2 className="font-display text-lg font-semibold text-neutral-900">
                      Project Status Summary (Demonstration Metrics)
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {PROJECT_STATUS_FLOW.map((stage) => {
                        const count = projects.filter((p) => p.status === stage).length;
                        return (
                          <button
                            key={stage}
                            type="button"
                            onClick={() =>
                              setStatusFilter(statusFilter === stage ? 'ALL' : stage)
                            }
                            className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                              statusFilter === stage
                                ? 'bg-neutral-900 text-white border-neutral-900'
                                : 'bg-[#faf9f6] text-neutral-900 border-neutral-200 hover:border-neutral-400'
                            }`}
                          >
                            <div
                              className={`text-xs ${
                                statusFilter === stage ? 'text-neutral-300' : 'text-neutral-500'
                              }`}
                            >
                              {stage}
                            </div>
                            <div className="mt-1 text-2xl font-mono font-bold tabular-nums">
                              {count}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Department Projects Filter Table */}
                  <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <h2 className="font-display text-lg font-semibold text-neutral-900">
                        Department Projects Overview
                      </h2>

                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          value={departmentFilter}
                          onChange={(e) => setDepartmentFilter(e.target.value)}
                          className="rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 focus:border-neutral-900 focus:outline-none"
                        >
                          <option value="ALL">All Departments</option>
                          {DEPARTMENTS_LIST.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>

                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-800 focus:border-neutral-900 focus:outline-none"
                        >
                          <option value="ALL">All Statuses</option>
                          {PROJECT_STATUS_FLOW.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="overflow-x-auto border border-neutral-200 rounded-xl">
                      <table className="w-full text-left border-collapse text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-[#faf9f6] border-b border-neutral-200 text-neutral-600">
                            <th className="py-3 px-4 font-semibold">Project Title</th>
                            <th className="py-3 px-4 font-semibold">Department</th>
                            <th className="py-3 px-4 font-semibold">Supervisor</th>
                            <th className="py-3 px-4 font-semibold">Status</th>
                            <th className="py-3 px-4 font-semibold text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                          {filteredProjects.map((proj) => (
                            <tr key={proj.id} className="hover:bg-neutral-50">
                              <td className="py-3 px-4 font-semibold text-neutral-900">
                                {proj.title}
                              </td>
                              <td className="py-3 px-4 text-neutral-600">{proj.department}</td>
                              <td className="py-3 px-4 text-neutral-600">{proj.supervisorName}</td>
                              <td className="py-3 px-4 font-mono text-xs text-neutral-800">
                                {proj.status}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => onSelectProject(proj.id)}
                                  className="font-semibold text-neutral-900 underline cursor-pointer"
                                >
                                  Inspect
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Delayed Milestones & Pending Academic Reviews */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-3">
                      <h2 className="font-display text-lg font-semibold text-neutral-900">
                        Delayed Milestones & Overdue Tasks
                      </h2>
                      {overdueTasks.length === 0 ? (
                        <p className="text-xs text-neutral-500">
                          No overdue tasks across department projects.
                        </p>
                      ) : (
                        <div className="space-y-2.5">
                          {overdueTasks.map((t) => (
                            <div
                              key={t.id}
                              className="p-3.5 rounded-xl bg-red-50/70 border border-red-200 text-xs space-y-1"
                            >
                              <div className="flex items-center justify-between font-semibold text-red-900">
                                <span>{t.title}</span>
                                <span className="font-mono tabular-nums">Due {t.dueDate}</span>
                              </div>
                              <div className="text-red-800">
                                Project: {t.projectTitle} · Assignee: {t.assigneeName}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-3">
                      <h2 className="font-display text-lg font-semibold text-neutral-900">
                        Pending Academic Reviews & Activity
                      </h2>
                      <div className="space-y-2.5">
                        {allReviews.map((rev) => (
                          <div
                            key={rev.id}
                            className="p-3.5 rounded-xl bg-[#faf9f6] border border-neutral-200 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-neutral-900">
                                {rev.projectTitle}
                              </span>
                              <span className="font-mono text-neutral-600">{rev.status}</span>
                            </div>
                            <div className="text-neutral-500">
                              Reviewer: {rev.reviewerName} · {rev.submittedAt}
                            </div>
                            <p className="text-neutral-700">{rev.feedback}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* 5D. ALUMNI DASHBOARD */}
              {/* ----------------------------------------------------------- */}
              {user.accountType === 'ALUMNI' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-white border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <Award className="w-4 h-4 text-neutral-800" />
                        <span>Alumni Mentorship Dashboard · Demonstration Data</span>
                      </div>
                      <h1 className="mt-1 font-display text-2xl font-normal text-neutral-900">
                        {user.fullName}
                      </h1>
                      <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
                        Class of {user.graduationYear || '2022'} ·{' '}
                        {user.currentJobRole || 'Senior Systems Engineer'} at{' '}
                        {user.currentOrganization || 'CloudScale Systems'}
                      </p>
                    </div>
                  </div>

                  {/* Skills & Experience + Offer Mentoring */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-neutral-200 space-y-4">
                      <h2 className="font-display text-lg font-semibold text-neutral-900">
                        Alumni Profile & Skills
                      </h2>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        {user.bio ||
                          'Supporting undergraduate student teams with architecture reviews, system design guidance, and industry readiness.'}
                      </p>

                      <div>
                        <div className="text-xs font-semibold text-neutral-700 mb-2">
                          Areas of Mentoring Expertise:
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-800">
                          {(user.skills || ['TypeScript', 'React', 'System Design', 'IoT']).map(
                            (sk, i, arr) => (
                              <React.Fragment key={sk}>
                                <span className="font-medium">{sk}</span>
                                {i < arr.length - 1 && (
                                  <span aria-hidden="true" className="text-neutral-400">
                                    ·
                                  </span>
                                )}
                              </React.Fragment>
                            )
                          )}
                        </div>
                      </div>

                      <form onSubmit={handleAddAlumniSkill} className="pt-2 flex gap-2">
                        <input
                          type="text"
                          value={alumniSkillInput}
                          onChange={(e) => setAlumniSkillInput(e.target.value)}
                          placeholder="Add skill (e.g. Cloud Architecture)"
                          className="flex-1 rounded-xl border border-neutral-300 px-3 py-1.5 text-xs text-neutral-900 focus:border-neutral-900 focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
                        >
                          Add Skill
                        </button>
                      </form>
                    </div>

                    {/* Create Demonstration Mentoring Request / Offer */}
                    <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-neutral-200 space-y-4">
                      <h2 className="font-display text-lg font-semibold text-neutral-900">
                        Offer Mentoring / Create Guidance Session (Demo)
                      </h2>
                      <form onSubmit={handleCreateMentoringOffer} className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            Select Eligible Academic Project
                          </label>
                          <select
                            value={mentorProjectId}
                            onChange={(e) => setMentorProjectId(e.target.value)}
                            className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs sm:text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                          >
                            {projects.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.title} ({p.department})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            Mentoring Topic *
                          </label>
                          <input
                            type="text"
                            required
                            value={mentorTopic}
                            onChange={(e) => setMentorTopic(e.target.value)}
                            placeholder="e.g. Architecture Review & Deployment Checklist"
                            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs sm:text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            Guidance Note for Student Team *
                          </label>
                          <textarea
                            required
                            rows={2}
                            value={mentorMessage}
                            onChange={(e) => setMentorMessage(e.target.value)}
                            placeholder="Share technical pointers or proposed mentoring slots..."
                            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs sm:text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
                        >
                          Record Mentoring Offer (Demo)
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Student Collaboration Requests & Contribution History */}
                  <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-4">
                    <h2 className="font-display text-lg font-semibold text-neutral-900">
                      Student Collaboration & Mentoring Requests
                    </h2>

                    <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-xl overflow-hidden">
                      {mentoringRequests.map((req) => (
                        <div
                          key={req.id}
                          className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                              <span>Student: <strong>{req.studentName}</strong></span>
                              <span aria-hidden="true">·</span>
                              <span>{req.department}</span>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono">Status: {req.status}</span>
                            </div>
                            <div className="text-sm font-semibold text-neutral-900">
                              {req.topic} — {req.projectTitle}
                            </div>
                            <p className="text-xs text-neutral-600">{req.message}</p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {req.status === 'Pending' && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleMentoringStatusChange(req.id, 'Accepted')
                                }
                                className="px-3.5 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
                              >
                                Accept Request
                              </button>
                            )}
                            {req.status === 'Accepted' && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleMentoringStatusChange(req.id, 'Completed')
                                }
                                className="px-3.5 py-1.5 rounded-lg border border-neutral-300 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 cursor-pointer"
                              >
                                Mark Session Completed
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => onSelectProject(req.projectId)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-900 underline cursor-pointer"
                            >
                              View Project
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Create / Edit Project Modal */}
      <ProjectEraFormModal
        isOpen={isFormModalOpen}
        initialProject={editingProject}
        defaultLeadName={user.fullName}
        defaultInstitution={user.institution}
        defaultDepartment={user.department}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveProjectModal}
      />
    </div>
  );
};

export default ProjectEraWorkspace;
