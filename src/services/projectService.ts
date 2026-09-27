import { ProjectItem, LineageBatch } from '../types';
import { getEnrichedProjects, buildProjectDNA, computeProjectHealth, buildHandoverPackage, computeProjectContinuity, buildContributorEvidences } from '../lib/ecosystemData';
import { storageAdapter } from './storageAdapter';

const PROJECTS_STORAGE_KEY = 'pv_projects_data_v2';

class ProjectService {
  private projects: ProjectItem[] = [];
  private initialized = false;

  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized(): void {
    if (this.initialized) return;

    const stored = storageAdapter.getItem<ProjectItem[] | null>(PROJECTS_STORAGE_KEY, null);
    if (stored && Array.isArray(stored) && stored.length > 0) {
      this.projects = stored;
    } else {
      this.projects = getEnrichedProjects();
      storageAdapter.setItem(PROJECTS_STORAGE_KEY, this.projects);
    }
    this.initialized = true;
  }

  private persist(): void {
    storageAdapter.setItem(PROJECTS_STORAGE_KEY, this.projects);
  }

  async getAll(): Promise<ProjectItem[]> {
    this.ensureInitialized();
    return [...this.projects];
  }

  getAllSync(): ProjectItem[] {
    this.ensureInitialized();
    return [...this.projects];
  }

  async getById(projectId: string): Promise<ProjectItem | null> {
    this.ensureInitialized();
    const cleanId = (projectId || '').trim();
    const found = this.projects.find(
      (p) => p.id === cleanId || p.passportId?.toLowerCase() === cleanId.toLowerCase()
    );
    return found ? { ...found } : null;
  }

  async getByOwner(ownerNameOrId: string): Promise<ProjectItem[]> {
    this.ensureInitialized();
    const term = ownerNameOrId.toLowerCase();
    return this.projects.filter(
      (p) =>
        p.creator?.name.toLowerCase().includes(term) ||
        p.contributors.some((c) => c.name.toLowerCase().includes(term))
    );
  }

  async createProject(newProject: Partial<ProjectItem>): Promise<ProjectItem> {
    this.ensureInitialized();
    const id = newProject.id || `proj-${Date.now()}`;
    const project: ProjectItem = {
      id,
      passportId: newProject.passportId || `PV-${new Date().getFullYear()}-GEHU-${Date.now().toString().slice(-4)}`,
      title: newProject.title || 'Untitled Project',
      tagline: newProject.tagline || 'Project created on ProjectVerse.',
      description: newProject.description || 'Comprehensive open research and engineering project.',
      domain: newProject.domain || 'Developer Tools',
      techStack: newProject.techStack || ['React', 'TypeScript'],
      institution: newProject.institution || 'Graphic Era Hill University',
      department: newProject.department || 'Computer Science & Engineering',
      institution_id: newProject.institution_id || 'inst-gehu',
      department_id: newProject.department_id || 'dept-gehu-cse',
      academicYear: newProject.academicYear || `${new Date().getFullYear()}–${new Date().getFullYear() + 1}`,
      status: 'Verified',
      coverGradient: newProject.coverGradient || 'from-blue-900/60 via-indigo-950/40 to-slate-900',
      githubStars: 0,
      githubCommits: 1,
      lineageBatchesCount: 1,
      openRoles: newProject.openRoles || ['Core Contributor'],
      contributors: newProject.contributors || [],
      lineage: newProject.lineage || [],
      passport: newProject.passport as any,
      createdDate: new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
      lastActivityDate: 'Just now',
      ...newProject
    } as ProjectItem;

    project.dna = project.dna || buildProjectDNA(project);
    project.health = project.health || computeProjectHealth(project);
    project.handover = project.handover || buildHandoverPackage(project);
    project.continuity = project.continuity || computeProjectContinuity(project);
    project.evidences = project.evidences || buildContributorEvidences(project);

    this.projects.unshift(project);
    this.persist();
    return project;
  }

  /**
   * Seamless Continuity continuation:
   * Adds an incoming student batch milestone to the project lineage,
   * updates status to Active, resets the inactivity timer, and updates handover!
   */
  async continueProject(
    projectId: string, 
    contributorName: string, 
    batchName: string = "Batch 2026 Continuation",
    notes: string = "Accepted project handover and initialized Project v2 roadmap."
  ): Promise<ProjectItem | null> {
    this.ensureInitialized();
    const idx = this.projects.findIndex(p => p.id === projectId);
    if (idx === -1) return null;

    const proj = { ...this.projects[idx] };
    proj.status = 'Verified';
    proj.lastActivityDate = 'Just now';

    // Add new contributor if not already present
    if (!proj.contributors.some(c => c.name.toLowerCase() === contributorName.toLowerCase())) {
      proj.contributors.push({
        name: contributorName,
        role: 'Incoming Maintenance Lead (Continuation)',
        institution: proj.institution,
        batch: "B.Tech '26",
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        commitsCount: 12
      });
    }

    // Add Project v2 record to lineage
    const v2Lineage: LineageBatch = {
      year: '2026',
      version: 'v2.0.0 Active',
      batchName: `${batchName} (Active Maintainer)`,
      institution: proj.institution,
      leadContributors: [contributorName, ...proj.contributors.map(c => c.name).slice(0, 2)],
      majorChanges: [
        'Inherited validated codebase via ProjectVerse Handover Package',
        'Initialized sprint backlog for campus deployment',
        'Created new telemetry endpoints and unit test suite'
      ],
      technologies: proj.techStack,
      mentorName: proj.passport?.facultyReviewer?.name || 'Faculty Advisor',
      facultyReviewScore: 9.6,
      commits: 12,
      pullRequests: 2,
      activeStatus: 'Current',
      summary: notes,
      evidenceSummary: 'Active continuity handover accepted, repository forked/cloned, and initial commits merged.'
    };

    proj.lineage = [v2Lineage, ...proj.lineage.filter(l => l.activeStatus !== 'Current')];
    proj.lineageBatchesCount = proj.lineage.length;

    // Recalculate health & continuity
    proj.health = computeProjectHealth(proj);
    proj.continuity = {
      isAtRisk: false,
      daysInactive: 0,
      riskLevel: 'Healthy',
      riskReasons: [],
      openTasksCount: 2,
      activeContributorCount: proj.contributors.length,
      currentMentor: proj.passport?.facultyReviewer?.name,
      suggestedActions: ['Continue Project'],
      handoverStatus: 'Completed & Ready',
      hasHandoverPackage: true
    };

    this.projects[idx] = proj;
    this.persist();
    return proj;
  }
}

export const projectService = new ProjectService();
