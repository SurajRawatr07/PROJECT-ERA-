import { ProjectItem, LineageBatch } from '../types';
import {
  getEnrichedProjects,
  buildProjectDNA,
  computeProjectHealth,
  buildHandoverPackage,
  computeProjectContinuity,
  buildContributorEvidences
} from '../lib/ecosystemData';
import { storageAdapter } from './storageAdapter';
import { sessionService } from './sessionService';

const PROJECTS_STORAGE_KEY = 'pv_projects_data_v2';

function enrichProject(project: ProjectItem): ProjectItem {
  project.dna = project.dna || buildProjectDNA(project);
  project.health = project.health || computeProjectHealth(project);
  project.handover = project.handover || buildHandoverPackage(project);
  project.continuity = project.continuity || computeProjectContinuity(project);
  project.evidences = project.evidences || buildContributorEvidences(project);
  return project;
}

function getAuthHeaders(): HeadersInit {
  const session = sessionService.getSession();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (session && session.token) {
    headers['Authorization'] = `Bearer ${session.token}`;
  }
  return headers;
}

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
      this.projects = stored.map(enrichProject);
    } else {
      this.projects = getEnrichedProjects();
      storageAdapter.setItem(PROJECTS_STORAGE_KEY, this.projects);
    }
    this.initialized = true;
  }

  private persist(): void {
    storageAdapter.setItem(PROJECTS_STORAGE_KEY, this.projects);
  }

  /**
   * Fetch all projects from real MongoDB REST API
   */
  async getAll(): Promise<ProjectItem[]> {
    try {
      const res = await fetch('/api/projects', {
        headers: getAuthHeaders()
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.projects)) {
          const enriched = data.projects.map(enrichProject);
          this.projects = enriched;
          this.persist();
          return [...this.projects];
        }
      }
    } catch (err) {
      console.warn('[ProjectService] Fetching from API failed, using cached store:', err);
    }

    this.ensureInitialized();
    return [...this.projects];
  }

  getAllSync(): ProjectItem[] {
    this.ensureInitialized();
    return [...this.projects];
  }

  /**
   * Fetch project by ID from real MongoDB REST API
   */
  async getById(projectId: string): Promise<ProjectItem | null> {
    const cleanId = (projectId || '').trim();
    if (!cleanId) return null;

    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(cleanId)}`, {
        headers: getAuthHeaders()
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.project) {
          const enriched = enrichProject(data.project);
          // Update in local cache
          const idx = this.projects.findIndex(p => p.id === cleanId || p.passportId === cleanId);
          if (idx !== -1) {
            this.projects[idx] = enriched;
          } else {
            this.projects.unshift(enriched);
          }
          this.persist();
          return enriched;
        }
      }
    } catch (err) {
      console.warn('[ProjectService] Fetching project by id failed:', err);
    }

    this.ensureInitialized();
    const found = this.projects.find(
      (p) => p.id === cleanId || p.passportId?.toLowerCase() === cleanId.toLowerCase()
    );
    return found ? { ...found } : null;
  }

  async getByOwner(ownerNameOrId: string): Promise<ProjectItem[]> {
    const all = await this.getAll();
    const term = ownerNameOrId.toLowerCase();
    return all.filter(
      (p) =>
        p.creator?.name.toLowerCase().includes(term) ||
        p.contributors.some((c) => c.name.toLowerCase().includes(term))
    );
  }

  /**
   * Create a project in MongoDB via POST /api/projects
   */
  async createProject(newProject: Partial<ProjectItem>): Promise<ProjectItem> {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newProject)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.project) {
          const enriched = enrichProject(data.project);
          this.projects.unshift(enriched);
          this.persist();
          return enriched;
        }
      }
    } catch (err) {
      console.warn('[ProjectService] API creation failed, falling back to local:', err);
    }

    // Fallback if offline
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

    const enriched = enrichProject(project);
    this.projects.unshift(enriched);
    this.persist();
    return enriched;
  }

  /**
   * Project Lineage & Continuity continuation:
   * Adds an incoming student batch milestone to the project lineage in MongoDB!
   */
  async continueProject(
    projectId: string,
    contributorName: string,
    batchName: string = "Batch 2026 Continuation",
    notes: string = "Accepted project handover and initialized Project v2 roadmap."
  ): Promise<ProjectItem | null> {
    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(projectId)}/lineage`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          year: new Date().getFullYear().toString(),
          batchName,
          summary: notes,
          leadContributors: [contributorName],
          version: 'v2.0 Active'
        })
      });

      if (res.ok) {
        // Re-fetch project to get updated lineage
        const updated = await this.getById(projectId);
        if (updated) return updated;
      }
    } catch (err) {
      console.warn('[ProjectService] Lineage extension API call failed, using local fallback:', err);
    }

    this.ensureInitialized();
    const idx = this.projects.findIndex(p => p.id === projectId || p.passportId === projectId);
    if (idx === -1) return null;

    const proj = { ...this.projects[idx] };
    proj.status = 'Verified';
    proj.lastActivityDate = 'Just now';

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

    const v2Lineage: LineageBatch = {
      year: new Date().getFullYear().toString(),
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
    enrichProject(proj);

    this.projects[idx] = proj;
    this.persist();
    return proj;
  }
}

export const projectService = new ProjectService();
