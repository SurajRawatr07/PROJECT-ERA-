import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  MessageSquare, 
  Plus, 
  ExternalLink, 
  GitCommit, 
  FolderGit2, 
  FileText, 
  Activity, 
  Users, 
  Clock, 
  FolderSync, 
  CheckSquare, 
  Check, 
  X,
  AlertCircle
} from 'lucide-react';
import { ProjectItem, ProjectReviewActionItem, UserRole } from '../../types';
import { ProjectHealthCard } from '../health/ProjectHealthCard';
import { ContributionEvidenceView } from '../evidence/ContributionEvidenceView';
import { ProjectHandoverView } from '../handover/ProjectHandoverView';

interface FacultyReviewRoomProps {
  project: ProjectItem;
  currentRole: UserRole;
  facultyName?: string;
  onApproveProject: (projectId: string, rubricScore: number, feedback: string) => void;
  onRequestChanges: (projectId: string, feedback: string) => void;
  className?: string;
}

export const FacultyReviewRoom: React.FC<FacultyReviewRoomProps> = ({
  project,
  currentRole,
  facultyName = 'Dr. Anil Sharma',
  onApproveProject,
  onRequestChanges,
  className = ''
}) => {
  // Strict RBAC Enforcement: Only FACULTY or ALUMNI/MENTOR allowed
  const isAuthorizedReviewer = currentRole === 'FACULTY' || currentRole === 'ALUMNI' || currentRole === 'ADMIN';

  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'OVERVIEW' | 'HEALTH' | 'EVIDENCE' | 'HANDOVER' | 'ACTION_ITEMS'>('OVERVIEW');
  const [rubricScores, setRubricScores] = useState({
    novelty: 9.2,
    technicalRigor: 9.4,
    documentation: 9.0,
    continuityPotential: 9.8
  });
  const [commentText, setCommentText] = useState('');
  const [newActionItemTitle, setNewActionItemTitle] = useState('');
  const [actionItems, setActionItems] = useState<ProjectReviewActionItem[]>([
    {
      id: 'act-1',
      projectId: project.id,
      title: 'Conduct outdoor corridor beacon signal verification trial',
      description: 'Collect RSSI telemetry logs at 5m increments from elevator door.',
      status: 'PENDING',
      createdAt: '2026-09-20'
    },
    {
      id: 'act-2',
      projectId: project.id,
      title: 'Add WCAG accessible color contrast compliance report',
      description: 'Ensure turn-by-turn routing indicators meet AAA standard.',
      status: 'RESOLVED',
      createdAt: '2026-09-18',
      resolvedAt: '2026-09-22'
    }
  ]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isAuthorizedReviewer) {
    return (
      <div className="p-8 text-center rounded-3xl bg-white border border-rose-200">
        <AlertTriangle className="w-10 h-10 text-rose-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-neutral-900">Access Restricted: Faculty Review Room</h3>
        <p className="text-xs text-neutral-600 max-w-md mx-auto mt-1">
          Review room actions, rubric grading, and cryptographic passport seals are restricted to authorized Faculty and Academic Mentors. Institutional and HOD accounts hold read-only oversight permissions.
        </p>
      </div>
    );
  }

  const handleAddActionItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionItemTitle.trim()) return;
    const newItem: ProjectReviewActionItem = {
      id: `act-${Date.now()}`,
      projectId: project.id,
      title: newActionItemTitle.trim(),
      description: 'Assigned during Faculty Review Room session.',
      status: 'PENDING',
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setActionItems([...actionItems, newItem]);
    setNewActionItemTitle('');
    setToastMessage('New action item added to student backlog!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleActionItem = (id: string) => {
    setActionItems(actionItems.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'PENDING' ? 'RESOLVED' : 'PENDING';
        return {
          ...item,
          status: nextStatus,
          resolvedAt: nextStatus === 'RESOLVED' ? new Date().toISOString().slice(0, 10) : undefined
        };
      }
      return item;
    }));
  };

  const handleApprove = () => {
    const avgScore = Number(((rubricScores.novelty + rubricScores.technicalRigor + rubricScores.documentation + rubricScores.continuityPotential) / 4).toFixed(1));
    onApproveProject(project.id, avgScore, commentText || 'Project verified and signed off for academic lineage preservation.');
    setToastMessage(`Project ${project.title} approved and signed by ${facultyName}!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleChanges = () => {
    onRequestChanges(project.id, commentText || 'Revisions requested in action items before official passport seal publication.');
    setToastMessage('Changes requested notification dispatched to project team.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-neutral-900 text-white text-xs font-medium flex items-center justify-between shadow-lg">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-neutral-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Review Room Header */}
      <div className="rounded-3xl bg-white border border-black/10 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-5 border-b border-black/8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Authorized Faculty Review Room</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111111]">
              Academic Evaluation & Lineage Certification
            </h2>
            <p className="text-xs text-[#737373] mt-1">
              Reviewing: <strong>{project.title}</strong> ({project.passportId}) • Reviewer: {facultyName}
            </p>
          </div>

          {/* Quick Decision Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleChanges}
              className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold cursor-pointer transition-colors"
            >
              Request Changes
            </button>
            <button
              onClick={handleApprove}
              className="btn-primary-black px-5 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Approve & Sign Seal</span>
            </button>
          </div>
        </div>

        {/* Workspace Tab Strip */}
        <div className="flex flex-wrap items-center gap-2 pt-4">
          {[
            { id: 'OVERVIEW', label: 'Rubric & Passport' },
            { id: 'HEALTH', label: 'Project Health' },
            { id: 'EVIDENCE', label: 'Contribution Evidence' },
            { id: 'HANDOVER', label: 'Handover Package' },
            { id: 'ACTION_ITEMS', label: `Action Items (${actionItems.filter(a => a.status === 'PENDING').length} pending)` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveWorkspaceTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeWorkspaceTab === tab.id
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'bg-[#F5F5F3] text-[#737373] hover:text-[#111111]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Workspace Tab Contents */}
      {activeWorkspaceTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Rubric Evaluation (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-white border border-black/10 p-6 sm:p-7 shadow-xs space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#737373]">
              Capstone Academic Rubric Scoring (Out of 10.0)
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-[#111111] mb-1">
                  <span>Novelty & Problem Clarity</span>
                  <span className="font-mono text-emerald-700">{rubricScores.novelty} / 10.0</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="10"
                  step="0.1"
                  value={rubricScores.novelty}
                  onChange={(e) => setRubricScores({ ...rubricScores, novelty: parseFloat(e.target.value) })}
                  className="w-full accent-black cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#111111] mb-1">
                  <span>Technical Rigor & Code Quality</span>
                  <span className="font-mono text-emerald-700">{rubricScores.technicalRigor} / 10.0</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="10"
                  step="0.1"
                  value={rubricScores.technicalRigor}
                  onChange={(e) => setRubricScores({ ...rubricScores, technicalRigor: parseFloat(e.target.value) })}
                  className="w-full accent-black cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#111111] mb-1">
                  <span>Documentation & Setup Reproducibility</span>
                  <span className="font-mono text-emerald-700">{rubricScores.documentation} / 10.0</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="10"
                  step="0.1"
                  value={rubricScores.documentation}
                  onChange={(e) => setRubricScores({ ...rubricScores, documentation: parseFloat(e.target.value) })}
                  className="w-full accent-black cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#111111] mb-1">
                  <span>Continuity & Handover Potential</span>
                  <span className="font-mono text-emerald-700">{rubricScores.continuityPotential} / 10.0</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="10"
                  step="0.1"
                  value={rubricScores.continuityPotential}
                  onChange={(e) => setRubricScores({ ...rubricScores, continuityPotential: parseFloat(e.target.value) })}
                  className="w-full accent-black cursor-pointer"
                />
              </div>
            </div>

            {/* Faculty Comment Box */}
            <div className="pt-4 border-t border-black/6">
              <label className="text-xs font-bold uppercase tracking-wider text-[#737373] block mb-2">
                Official Review Sign-off Comments
              </label>
              <textarea
                rows={3}
                placeholder="Document your academic findings, architectural feedback, and handover guidance..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full p-3.5 rounded-2xl border border-black/10 bg-[#FBFBFA] text-xs focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Quick Technical Evidence Peek (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-white border border-black/10 p-6 sm:p-7 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#737373]">
              Project Technical Passport
            </h3>

            <div className="p-4 rounded-2xl bg-[#FBFBFA] border border-black/6 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#737373]">Repository:</span>
                <span className="font-mono text-[#111111] truncate max-w-[180px]">{project.passport?.githubRepo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737373]">Total Commits:</span>
                <span className="font-mono font-bold text-[#111111]">{project.githubCommits} commits</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737373]">Active Contributors:</span>
                <span className="font-semibold text-[#111111]">{project.contributors.length} builders</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737373]">Academic Year:</span>
                <span className="text-[#111111]">{project.academicYear}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#737373] block">Technologies Verified:</span>
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <span key={tech} className="px-2.5 py-1 rounded-lg bg-[#F5F5F3] border border-black/6 text-[11px] font-mono text-[#111111]">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeWorkspaceTab === 'HEALTH' && project.health && (
        <ProjectHealthCard health={project.health} projectTitle={project.title} />
      )}

      {activeWorkspaceTab === 'EVIDENCE' && project.evidences && (
        <ContributionEvidenceView evidences={project.evidences} projectTitle={project.title} />
      )}

      {activeWorkspaceTab === 'HANDOVER' && project.handover && (
        <ProjectHandoverView handover={project.handover} project={project} />
      )}

      {activeWorkspaceTab === 'ACTION_ITEMS' && (
        <div className="rounded-3xl bg-white border border-black/10 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#111111]">
                Review Room Action Items
              </h3>
              <p className="text-xs text-[#737373]">
                Specific technical conditions the student team must resolve prior to permanent passport verification.
              </p>
            </div>
          </div>

          {/* Add Item Form */}
          <form onSubmit={handleAddActionItem} className="flex gap-2">
            <input
              type="text"
              placeholder="Add required technical action item (e.g. Add offline cache test suite)..."
              value={newActionItemTitle}
              onChange={(e) => setNewActionItemTitle(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl border border-black/10 text-xs focus:outline-none focus:border-black"
            />
            <button
              type="submit"
              className="btn-primary-black px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </form>

          {/* Action Items List */}
          <div className="space-y-2.5">
            {actionItems.map((item) => (
              <div 
                key={item.id}
                className="flex items-start justify-between p-4 rounded-2xl bg-[#FBFBFA] border border-black/6 text-xs gap-3"
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleActionItem(item.id)}
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors mt-0.5 cursor-pointer ${
                      item.status === 'RESOLVED'
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-black/20 hover:border-black'
                    }`}
                  >
                    {item.status === 'RESOLVED' && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <div>
                    <h4 className={`font-semibold ${item.status === 'RESOLVED' ? 'line-through text-neutral-400' : 'text-[#111111]'}`}>
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#737373] mt-0.5">{item.description}</p>
                    <span className="text-[10px] text-[#888888] font-mono mt-1 block">
                      Added: {item.createdAt} {item.resolvedAt ? `• Resolved: ${item.resolvedAt}` : ''}
                    </span>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  item.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
