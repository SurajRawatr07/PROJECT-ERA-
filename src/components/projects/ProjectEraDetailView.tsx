import React, { useState } from 'react';
import {
  ArrowLeft,
  Edit3,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Upload,
  Users,
  CheckSquare,
  MessageSquare,
  Info
} from 'lucide-react';
import {
  EraAccountType,
  EraDocumentRecord,
  EraFacultyReview,
  EraProject,
  EraProjectStatus,
  EraReviewStatus,
  EraTask,
  EraTaskStatus,
  EraTeamMember
} from '../../types/projectEra';
import { PROJECT_STATUS_FLOW } from '../../data/projectEraData';

interface ProjectEraDetailViewProps {
  project: EraProject;
  currentRole: EraAccountType;
  currentUserName: string;
  onBack: () => void;
  onEditProject: (project: EraProject) => void;
  onUpdateProject: (updated: EraProject) => void;
}

const REFERENCE_TODAY = '2026-03-20';

export function isTaskOverdue(dueDate: string, status: EraTaskStatus): boolean {
  if (status === 'Completed') return false;
  return dueDate < REFERENCE_TODAY;
}

export const ProjectEraDetailView: React.FC<ProjectEraDetailViewProps> = ({
  project,
  currentRole,
  currentUserName,
  onBack,
  onEditProject,
  onUpdateProject
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'tasks' | 'team' | 'documentation' | 'reviews'
  >('overview');

  // Task creation state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState(
    project.teamMembers[0]?.name || currentUserName
  );
  const [newTaskResponsibility, setNewTaskResponsibility] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('2026-04-10');
  const [newTaskMilestone, setNewTaskMilestone] = useState(
    project.milestones[0]?.title || 'Phase 1: Problem Definition & Synopsis'
  );

  // Team member creation state
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newMemberResponsibility, setNewMemberResponsibility] = useState('');

  // Documentation file selection & validation state
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<EraDocumentRecord['category']>('Milestone Report');
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    sizeFormatted: string;
    mimeType: string;
  } | null>(null);
  const [docFeedback, setDocFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Faculty review form state
  const [reviewStatus, setReviewStatus] = useState<EraReviewStatus>('Approved');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewNotice, setReviewNotice] = useState<string | null>(null);

  const handleStatusChange = (newStatus: EraProjectStatus) => {
    onUpdateProject({
      ...project,
      status: newStatus,
      updatedAt: REFERENCE_TODAY
    });
  };

  // Tasks handlers
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const task: EraTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      assigneeName: newTaskAssignee.trim() || currentUserName,
      responsibility: newTaskResponsibility.trim() || 'Module Deliverable',
      dueDate: newTaskDueDate || '2026-04-15',
      status: 'Todo',
      milestoneTitle: newTaskMilestone
    };

    onUpdateProject({
      ...project,
      tasks: [...project.tasks, task],
      updatedAt: REFERENCE_TODAY
    });

    setNewTaskTitle('');
    setNewTaskResponsibility('');
  };

  const handleTaskStatusChange = (taskId: string, status: EraTaskStatus) => {
    const updatedTasks = project.tasks.map((t) => (t.id === taskId ? { ...t, status } : t));
    onUpdateProject({
      ...project,
      tasks: updatedTasks,
      updatedAt: REFERENCE_TODAY
    });
  };

  const handleDeleteTask = (taskId: string) => {
    onUpdateProject({
      ...project,
      tasks: project.tasks.filter((t) => t.id !== taskId),
      updatedAt: REFERENCE_TODAY
    });
  };

  const handleMilestoneProgressChange = (milestoneId: string, progress: number) => {
    const updatedMilestones = project.milestones.map((m) =>
      m.id === milestoneId
        ? {
            ...m,
            progress,
            status: (progress === 100 ? 'Completed' : m.status === 'Completed' ? 'On Track' : m.status) as EraProject['milestones'][0]['status']
          }
        : m
    );
    onUpdateProject({
      ...project,
      milestones: updatedMilestones,
      updatedAt: REFERENCE_TODAY
    });
  };

  // Team collaboration handlers
  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberRole.trim()) return;

    const member: EraTeamMember = {
      id: `tm-${Date.now()}`,
      name: newMemberName.trim(),
      email: newMemberEmail.trim() || `${newMemberName.trim().toLowerCase().replace(/\s+/g, '.')}@college.edu`,
      role: newMemberRole.trim(),
      responsibility: newMemberResponsibility.trim() || 'Project module development & testing',
      status: 'Active'
    };

    onUpdateProject({
      ...project,
      teamMembers: [...project.teamMembers, member],
      updatedAt: REFERENCE_TODAY
    });

    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberRole('');
    setNewMemberResponsibility('');
  };

  const handleRemoveTeamMember = (memberId: string) => {
    onUpdateProject({
      ...project,
      teamMembers: project.teamMembers.filter((m) => m.id !== memberId),
      updatedAt: REFERENCE_TODAY
    });
  };

  const handleApproveMemberRequest = (memberId: string) => {
    onUpdateProject({
      ...project,
      teamMembers: project.teamMembers.map((m) =>
        m.id === memberId ? { ...m, status: 'Active' } : m
      ),
      updatedAt: REFERENCE_TODAY
    });
  };

  // Documentation file selection & client-side validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocFeedback(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedExtensions = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.png', '.jpg', '.jpeg'];
    const lowerName = file.name.toLowerCase();
    const isAllowedExt = allowedExtensions.some((ext) => lowerName.endsWith(ext));

    if (!isAllowedExt) {
      setSelectedFile(null);
      setDocFeedback({
        type: 'error',
        message: 'Invalid file format. Allowed formats: PDF, DOC, DOCX, PPTX, PNG, JPG.'
      });
      e.target.value = '';
      return;
    }

    const maxBytes = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxBytes) {
      setSelectedFile(null);
      setDocFeedback({
        type: 'error',
        message: 'File exceeds the 10 MB limit. Please select a smaller document.'
      });
      e.target.value = '';
      return;
    }

    const sizeKB = file.size / 1024;
    const sizeFormatted =
      sizeKB >= 1024 ? `${(sizeKB / 1024).toFixed(2)} MB` : `${Math.max(1, Math.round(sizeKB))} KB`;

    setSelectedFile({
      name: file.name,
      sizeFormatted,
      mimeType: file.type || 'application/octet-stream'
    });
    if (!docTitle.trim()) {
      setDocTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
    }
  };

  const handleAddDocumentRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setDocFeedback({
        type: 'error',
        message: 'Please select a valid document file before adding the record.'
      });
      return;
    }

    const newDoc: EraDocumentRecord = {
      id: `doc-${Date.now()}`,
      title: docTitle.trim() || selectedFile.name,
      fileName: selectedFile.name,
      fileSize: selectedFile.sizeFormatted,
      mimeType: selectedFile.mimeType,
      category: docCategory,
      uploadedBy: currentUserName,
      uploadedAt: REFERENCE_TODAY
    };

    onUpdateProject({
      ...project,
      documents: [newDoc, ...project.documents],
      updatedAt: REFERENCE_TODAY
    });

    setSelectedFile(null);
    setDocTitle('');
    setDocFeedback({
      type: 'success',
      message: `Added "${newDoc.fileName}" (${newDoc.fileSize}) to the client-side demonstration list. Note: Files are not uploaded to a remote server in this frontend-only preview.`
    });
  };

  const handleRemoveDocumentRecord = (docId: string) => {
    onUpdateProject({
      ...project,
      documents: project.documents.filter((d) => d.id !== docId),
      updatedAt: REFERENCE_TODAY
    });
  };

  // Faculty Review handler
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const newRev: EraFacultyReview = {
      id: `rev-${Date.now()}`,
      projectId: project.id,
      projectTitle: project.title,
      reviewerName: currentUserName,
      reviewerRole: currentRole === 'HOD' ? 'HOD' : 'Faculty',
      status: reviewStatus,
      feedback: reviewComment.trim(),
      submittedAt: REFERENCE_TODAY
    };

    onUpdateProject({
      ...project,
      status: reviewStatus === 'Completed' ? 'Completed' : project.status,
      reviews: [newRev, ...project.reviews],
      updatedAt: REFERENCE_TODAY
    });

    setReviewComment('');
    setReviewNotice(`Demonstration review recorded with status "${reviewStatus}".`);
  };

  const overdueCount = project.tasks.filter((t) => isTaskOverdue(t.dueDate, t.status)).length;

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-200">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </button>
          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
            <span>{project.department}</span>
            <span aria-hidden="true">·</span>
            <span>{project.academicSession}</span>
            <span aria-hidden="true">·</span>
            <span>Supervisor: {project.supervisorName}</span>
          </div>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-normal text-neutral-900">
            {project.title}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-neutral-600">Lifecycle:</label>
            <select
              value={project.status}
              onChange={(e) => handleStatusChange(e.target.value as EraProjectStatus)}
              className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 focus:border-neutral-900 focus:outline-none"
            >
              {PROJECT_STATUS_FLOW.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => onEditProject(project)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-neutral-300 bg-white text-xs font-semibold text-neutral-800 hover:bg-neutral-50 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Project Info</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white border border-neutral-200">
        {[
          { id: 'overview', label: 'Project Overview' },
          { id: 'tasks', label: `Tasks & Milestones (${project.tasks.length})` },
          { id: 'team', label: `Team Collaboration (${project.teamMembers.length})` },
          { id: 'documentation', label: `Documentation (${project.documents.length})` },
          { id: 'reviews', label: `Faculty Reviews (${project.reviews.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-4">
              <h2 className="font-display text-lg font-semibold text-neutral-900">
                Project Summary & Objectives
              </h2>
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                {project.description}
              </p>

              <div className="pt-4 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <div className="text-xs text-neutral-500">Domain</div>
                  <div className="font-semibold text-neutral-900 mt-0.5">{project.domain}</div>
                </div>
                <div>
                  <div className="text-xs text-neutral-500">Technologies</div>
                  <div className="font-semibold text-neutral-900 mt-0.5">
                    {project.technologies.join(' · ')}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-neutral-500">Academic Session</div>
                  <div className="font-semibold text-neutral-900 mt-0.5">
                    {project.academicSession}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-neutral-500">Institution</div>
                  <div className="font-semibold text-neutral-900 mt-0.5">{project.institution}</div>
                </div>
              </div>
            </div>

            {/* Milestone Progress Summary */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-neutral-900">
                  Milestone Progress
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('tasks')}
                  className="text-xs font-semibold text-neutral-900 underline cursor-pointer"
                >
                  Manage Tasks & Milestones
                </button>
              </div>

              <div className="space-y-4">
                {project.milestones.map((ms) => (
                  <div key={ms.id} className="p-4 rounded-xl bg-[#faf9f6] border border-neutral-200">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-neutral-900">{ms.title}</span>
                      <span className="font-mono tabular-nums text-neutral-600">
                        Due {ms.dueDate} · {ms.status} · {ms.progress}%
                      </span>
                    </div>
                    <div className="mt-2 w-full h-2 rounded-full bg-neutral-200 overflow-hidden">
                      <div
                        className="h-full bg-neutral-900 transition-all"
                        style={{ width: `${ms.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-4">
              <h2 className="font-display text-lg font-semibold text-neutral-900">
                Academic Supervision
              </h2>
              <div className="space-y-2 text-xs sm:text-sm">
                <div>
                  <div className="text-neutral-500">Faculty Supervisor</div>
                  <div className="font-semibold text-neutral-900">{project.supervisorName}</div>
                </div>
                <div>
                  <div className="text-neutral-500">Supervisor Contact</div>
                  <div className="font-mono text-neutral-700">{project.supervisorEmail}</div>
                </div>
                <div>
                  <div className="text-neutral-500">Student Project Lead</div>
                  <div className="font-semibold text-neutral-900">{project.leadStudentName}</div>
                </div>
                <div>
                  <div className="text-neutral-500">Last Updated</div>
                  <div className="font-mono tabular-nums text-neutral-700">{project.updatedAt}</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-3">
              <h2 className="font-display text-lg font-semibold text-neutral-900">
                Workspace Summary (Demo)
              </h2>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#faf9f6] border border-neutral-200">
                  <div className="text-neutral-500">Team Members</div>
                  <div className="mt-1 text-lg font-mono font-bold tabular-nums text-neutral-900">
                    {project.teamMembers.length}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#faf9f6] border border-neutral-200">
                  <div className="text-neutral-500">Overdue Tasks</div>
                  <div
                    className={`mt-1 text-lg font-mono font-bold tabular-nums ${
                      overdueCount > 0 ? 'text-red-600' : 'text-neutral-900'
                    }`}
                  >
                    {overdueCount}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#faf9f6] border border-neutral-200">
                  <div className="text-neutral-500">Documents</div>
                  <div className="mt-1 text-lg font-mono font-bold tabular-nums text-neutral-900">
                    {project.documents.length}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#faf9f6] border border-neutral-200">
                  <div className="text-neutral-500">Faculty Reviews</div>
                  <div className="mt-1 text-lg font-mono font-bold tabular-nums text-neutral-900">
                    {project.reviews.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TASKS AND MILESTONES */}
      {activeTab === 'tasks' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-display text-lg font-semibold text-neutral-900">
                    Project Tasks & Deadlines
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Tasks with due dates prior to {REFERENCE_TODAY} that are not marked Completed are flagged as overdue.
                  </p>
                </div>
                <CheckSquare className="w-5 h-5 text-neutral-700" />
              </div>

              {project.tasks.length === 0 ? (
                <div className="p-6 rounded-xl bg-[#faf9f6] border border-neutral-200 text-center text-sm text-neutral-600">
                  No tasks added yet. Use the form on the right to assign the first project task.
                </div>
              ) : (
                <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-xl overflow-hidden">
                  {project.tasks.map((task) => {
                    const overdue = isTaskOverdue(task.dueDate, task.status);
                    return (
                      <div
                        key={task.id}
                        className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`text-sm font-semibold ${
                                task.status === 'Completed'
                                  ? 'line-through text-neutral-400'
                                  : 'text-neutral-900'
                              }`}
                            >
                              {task.title}
                            </span>
                            {overdue && (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                Overdue
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-neutral-500">
                            <span>Assignee: {task.assigneeName}</span>
                            <span aria-hidden="true"> · </span>
                            <span>Responsibility: {task.responsibility}</span>
                            <span aria-hidden="true"> · </span>
                            <span className="font-mono tabular-nums">Due: {task.dueDate}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                          <select
                            value={task.status}
                            onChange={(e) =>
                              handleTaskStatusChange(task.id, e.target.value as EraTaskStatus)
                            }
                            className="rounded-lg border border-neutral-300 bg-[#faf9f6] px-2.5 py-1.5 text-xs font-semibold text-neutral-800 focus:border-neutral-900 focus:outline-none"
                          >
                            <option value="Todo">Todo</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => handleDeleteTask(task.id)}
                            aria-label="Remove task"
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Interactive Milestone Sliders */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-4">
              <h2 className="font-display text-lg font-semibold text-neutral-900">
                Milestone Progress Tracker
              </h2>
              <div className="space-y-4">
                {project.milestones.map((ms) => (
                  <div
                    key={ms.id}
                    className="p-4 rounded-xl bg-[#faf9f6] border border-neutral-200 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-neutral-900">{ms.title}</span>
                      <span className="font-mono tabular-nums text-neutral-600">
                        Target: {ms.dueDate} · {ms.status} · {ms.progress}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={ms.progress}
                      onChange={(e) =>
                        handleMilestoneProgressChange(ms.id, Number(e.target.value))
                      }
                      className="w-full accent-neutral-900 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add Task Form */}
          <div className="lg:col-span-4">
            <form
              onSubmit={handleAddTask}
              className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-4"
            >
              <h3 className="font-display text-base font-semibold text-neutral-900">
                Add New Task
              </h3>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Complete sensor calibration log"
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs sm:text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Assign To
                </label>
                <input
                  type="text"
                  value={newTaskAssignee}
                  onChange={(e) => setNewTaskAssignee(e.target.value)}
                  placeholder="Team member name"
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs sm:text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Responsibility / Deliverable
                </label>
                <input
                  type="text"
                  value={newTaskResponsibility}
                  onChange={(e) => setNewTaskResponsibility(e.target.value)}
                  placeholder="e.g. Backend API & test dataset"
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs sm:text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs sm:text-sm font-mono text-neutral-900 focus:border-neutral-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Milestone Phase
                </label>
                <input
                  type="text"
                  value={newTaskMilestone}
                  onChange={(e) => setNewTaskMilestone(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs sm:text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Task to Project</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: TEAM COLLABORATION */}
      {activeTab === 'team' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-semibold text-neutral-900">
                    Team Roster & Responsibilities
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Manage demonstration team members, project roles, and collaboration requests.
                  </p>
                </div>
                <Users className="w-5 h-5 text-neutral-700" />
              </div>

              <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-xl overflow-hidden">
                {project.teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-neutral-900">
                          {member.name}
                        </span>
                        <span className="text-xs text-neutral-500">· {member.role}</span>
                        <span className="text-xs font-mono text-neutral-500">
                          [{member.status}]
                        </span>
                      </div>
                      <div className="text-xs text-neutral-600">
                        Responsibility: {member.responsibility}
                      </div>
                      <div className="text-xs font-mono text-neutral-400">{member.email}</div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {member.status === 'Pending Request' && (
                        <button
                          type="button"
                          onClick={() => handleApproveMemberRequest(member.id)}
                          className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
                        >
                          Accept Request
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveTeamMember(member.id)}
                        className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-medium text-neutral-700 hover:text-red-600 hover:border-red-200 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <form
              onSubmit={handleAddTeamMember}
              className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-4"
            >
              <h3 className="font-display text-base font-semibold text-neutral-900">
                Add Demo Team Member
              </h3>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Student Name *
                </label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g. Rohan Verma"
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs sm:text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  College Email
                </label>
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="rohan.verma@college.edu"
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs sm:text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Role in Project *
                </label>
                <input
                  type="text"
                  required
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  placeholder="e.g. Backend & Database Lead"
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs sm:text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Assigned Responsibilities
                </label>
                <input
                  type="text"
                  value={newMemberResponsibility}
                  onChange={(e) => setNewMemberResponsibility(e.target.value)}
                  placeholder="e.g. API schema design and integration tests"
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs sm:text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Member to Team</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: DOCUMENTATION & SUBMISSIONS */}
      {activeTab === 'documentation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-semibold text-neutral-900">
                    Project Documentation Records
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Proposals, architecture specs, milestone reports, and final submissions.
                  </p>
                </div>
                <FileText className="w-5 h-5 text-neutral-700" />
              </div>

              {project.documents.length === 0 ? (
                <div className="p-6 rounded-xl bg-[#faf9f6] border border-neutral-200 text-center text-sm text-neutral-600">
                  No documentation records attached yet. Select a file on the right to preview adding a record.
                </div>
              ) : (
                <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-xl overflow-hidden">
                  {project.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="text-sm font-semibold text-neutral-900">{doc.title}</div>
                        <div className="text-xs text-neutral-500">
                          <span className="font-mono">{doc.fileName}</span>
                          <span aria-hidden="true"> · </span>
                          <span className="font-mono tabular-nums">{doc.fileSize}</span>
                          <span aria-hidden="true"> · </span>
                          <span>{doc.category}</span>
                        </div>
                        <div className="text-xs text-neutral-400">
                          Added by {doc.uploadedBy} on {doc.uploadedAt}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveDocumentRecord(doc.id)}
                        className="self-start sm:self-center px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-medium text-neutral-700 hover:text-red-600 hover:border-red-200 cursor-pointer"
                      >
                        Remove Record
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <form
              onSubmit={handleAddDocumentRecord}
              className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-4"
            >
              <h3 className="font-display text-base font-semibold text-neutral-900">
                Select & Validate Project Document
              </h3>

              <div className="p-3 rounded-xl bg-[#faf9f6] border border-neutral-200 flex items-start gap-2.5 text-xs text-neutral-600">
                <Info className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
                <span>
                  <strong>Client-Side Validation Only:</strong> Selected files are validated for format and size in your browser and added as demonstration records. Files are not uploaded to a remote server.
                </span>
              </div>

              {docFeedback && (
                <div
                  className={`p-3.5 rounded-xl border text-xs font-medium ${
                    docFeedback.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  {docFeedback.message}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. Phase 2 System Architecture Report"
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs sm:text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Document Category
                </label>
                <select
                  value={docCategory}
                  onChange={(e) =>
                    setDocCategory(e.target.value as EraDocumentRecord['category'])
                  }
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs sm:text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                >
                  <option value="Proposal">Proposal</option>
                  <option value="Architecture & Design">Architecture & Design</option>
                  <option value="Milestone Report">Milestone Report</option>
                  <option value="Final Submission">Final Submission</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Choose File (PDF, DOCX, PPTX, PNG, JPG · Max 10 MB)
                </label>
                <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-neutral-300 rounded-xl bg-[#faf9f6] hover:border-neutral-500 transition-colors cursor-pointer text-center">
                  <Upload className="w-5 h-5 text-neutral-600 mb-1.5" />
                  <span className="text-xs font-semibold text-neutral-800">
                    Click to select a file from your device
                  </span>
                  <span className="text-[11px] text-neutral-500 mt-0.5">
                    Validates extension and file size locally
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {selectedFile && (
                <div className="p-3.5 rounded-xl bg-[#faf9f6] border border-neutral-200 flex items-center justify-between gap-2 text-xs">
                  <div>
                    <div className="font-mono font-semibold text-neutral-900">
                      {selectedFile.name}
                    </div>
                    <div className="text-neutral-500 font-mono tabular-nums">
                      Size: {selectedFile.sizeFormatted}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="px-2.5 py-1 rounded-lg border border-neutral-300 text-neutral-700 hover:text-red-600 cursor-pointer"
                  >
                    Remove File
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
              >
                Add Document Record (Demo)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 5: FACULTY REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-semibold text-neutral-900">
                    Faculty Feedback & Review History
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Chronological evaluation notes and review statuses for this project.
                  </p>
                </div>
                <MessageSquare className="w-5 h-5 text-neutral-700" />
              </div>

              {project.reviews.length === 0 ? (
                <div className="p-6 rounded-xl bg-[#faf9f6] border border-neutral-200 text-center text-sm text-neutral-600">
                  No faculty reviews recorded for this project yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {project.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-xl bg-[#faf9f6] border border-neutral-200 space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-neutral-900">
                          {rev.reviewerName} ({rev.reviewerRole})
                        </span>
                        <span className="font-mono text-neutral-600">
                          Status: <strong>{rev.status}</strong> · {rev.submittedAt}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                        {rev.feedback}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <form
              onSubmit={handleAddReview}
              className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-4"
            >
              <h3 className="font-display text-base font-semibold text-neutral-900">
                Add Demonstration Review / Feedback
              </h3>
              <p className="text-xs text-neutral-500">
                Submit faculty or supervisor evaluation feedback and update the demonstration review status.
              </p>

              {reviewNotice && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{reviewNotice}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Demonstration Review Status
                </label>
                <select
                  value={reviewStatus}
                  onChange={(e) => setReviewStatus(e.target.value as EraReviewStatus)}
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
                  Evaluation Feedback & Action Items *
                </label>
                <textarea
                  required
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Provide specific academic guidance, rubric observations, or required revisions..."
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs sm:text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
              >
                Record Review Feedback (Demo)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectEraDetailView;
