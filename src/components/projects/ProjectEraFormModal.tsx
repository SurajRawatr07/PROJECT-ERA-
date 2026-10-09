import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { EraProject, EraProjectStatus } from '../../types/projectEra';
import { DEPARTMENTS_LIST, PROJECT_STATUS_FLOW } from '../../data/projectEraData';

interface ProjectEraFormModalProps {
  isOpen: boolean;
  initialProject?: EraProject | null;
  defaultLeadName: string;
  defaultInstitution: string;
  defaultDepartment: string;
  onClose: () => void;
  onSave: (project: EraProject) => void;
}

export const ProjectEraFormModal: React.FC<ProjectEraFormModalProps> = ({
  isOpen,
  initialProject,
  defaultLeadName,
  defaultInstitution,
  defaultDepartment,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('Web Application & Algorithms');
  const [technologiesText, setTechnologiesText] = useState('React, TypeScript, Tailwind CSS');
  const [status, setStatus] = useState<EraProjectStatus>('Planning');
  const [academicSession, setAcademicSession] = useState('2025–2026 (Even Semester)');
  const [department, setDepartment] = useState(defaultDepartment || DEPARTMENTS_LIST[0]);
  const [supervisorName, setSupervisorName] = useState('Dr. Meera Krishnan');
  const [supervisorEmail, setSupervisorEmail] = useState('meera.krishnan@college.edu');

  useEffect(() => {
    if (initialProject) {
      setTitle(initialProject.title);
      setDescription(initialProject.description);
      setDomain(initialProject.domain);
      setTechnologiesText(initialProject.technologies.join(', '));
      setStatus(initialProject.status);
      setAcademicSession(initialProject.academicSession);
      setDepartment(initialProject.department);
      setSupervisorName(initialProject.supervisorName);
      setSupervisorEmail(initialProject.supervisorEmail);
    } else {
      setTitle('');
      setDescription('');
      setDomain('Web Application & Algorithms');
      setTechnologiesText('React, TypeScript, Tailwind CSS');
      setStatus('Planning');
      setAcademicSession('2025–2026 (Even Semester)');
      setDepartment(defaultDepartment || DEPARTMENTS_LIST[0]);
      setSupervisorName('Dr. Meera Krishnan');
      setSupervisorEmail('meera.krishnan@college.edu');
    }
  }, [initialProject, defaultDepartment, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const technologies = technologiesText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const today = new Date().toISOString().split('T')[0];

    if (initialProject) {
      onSave({
        ...initialProject,
        title: title.trim(),
        description: description.trim(),
        domain: domain.trim(),
        technologies: technologies.length > 0 ? technologies : ['TypeScript'],
        status,
        academicSession: academicSession.trim(),
        department,
        supervisorName: supervisorName.trim(),
        supervisorEmail: supervisorEmail.trim(),
        updatedAt: today
      });
    } else {
      const newProject: EraProject = {
        id: `proj-era-${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        domain: domain.trim(),
        technologies: technologies.length > 0 ? technologies : ['TypeScript'],
        status,
        academicSession: academicSession.trim(),
        institution: defaultInstitution || 'National Institute of Engineering & Technology',
        department,
        supervisorName: supervisorName.trim(),
        supervisorEmail: supervisorEmail.trim(),
        leadStudentName: defaultLeadName,
        updatedAt: today,
        teamMembers: [
          {
            id: `tm-${Date.now()}`,
            name: defaultLeadName,
            email: 'student@college.edu',
            role: 'Project Lead',
            responsibility: 'Project planning, architecture, and milestone coordination',
            status: 'Active'
          }
        ],
        tasks: [
          {
            id: `task-${Date.now()}`,
            title: 'Complete initial project synopsis and milestone schedule',
            assigneeName: defaultLeadName,
            responsibility: 'Project Synopsis',
            dueDate: '2026-04-15',
            status: 'Todo',
            milestoneTitle: 'Phase 1: Problem Definition & Synopsis'
          }
        ],
        milestones: [
          {
            id: `ms-${Date.now()}`,
            title: 'Phase 1: Problem Definition & Synopsis',
            dueDate: '2026-04-20',
            progress: 10,
            status: 'On Track'
          }
        ],
        documents: [],
        reviews: []
      };
      onSave(newProject);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-neutral-200 p-6 sm:p-8 shadow-xl my-auto max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
          <div>
            <div className="text-xs font-mono text-neutral-500">
              Project Era · Demonstration Workspace
            </div>
            <h2 className="font-display text-xl font-semibold text-neutral-900">
              {initialProject ? 'Edit Academic Project' : 'Create New Academic Project'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Smart Campus Energy & Classroom Occupancy Monitor"
              className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Project Description & Problem Statement *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the academic problem, objectives, and expected outcomes..."
              className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Domain *
              </label>
              <input
                type="text"
                required
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="e.g. IoT & Embedded Systems"
                className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Technologies (comma-separated) *
              </label>
              <input
                type="text"
                required
                value={technologiesText}
                onChange={(e) => setTechnologiesText(e.target.value)}
                placeholder="React, TypeScript, Python, MQTT"
                className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Project Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as EraProjectStatus)}
                className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 bg-white focus:border-neutral-900 focus:outline-none"
              >
                {PROJECT_STATUS_FLOW.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Academic Session
              </label>
              <input
                type="text"
                required
                value={academicSession}
                onChange={(e) => setAcademicSession(e.target.value)}
                placeholder="2025–2026 (Even Semester)"
                className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 bg-white focus:border-neutral-900 focus:outline-none"
              >
                {DEPARTMENTS_LIST.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Faculty Supervisor Name *
              </label>
              <input
                type="text"
                required
                value={supervisorName}
                onChange={(e) => setSupervisorName(e.target.value)}
                placeholder="Dr. Meera Krishnan"
                className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Supervisor Email *
              </label>
              <input
                type="email"
                required
                value={supervisorEmail}
                onChange={(e) => setSupervisorEmail(e.target.value)}
                placeholder="supervisor@college.edu"
                className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm font-medium text-neutral-700 hover:bg-neutral-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-neutral-900 text-white text-xs sm:text-sm font-semibold hover:bg-neutral-800 cursor-pointer"
            >
              {initialProject ? 'Save Project Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectEraFormModal;
