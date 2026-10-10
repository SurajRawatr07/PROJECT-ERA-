import {
  EraAccountType,
  EraMentoringRequest,
  EraProject,
  EraUserProfile
} from '../types/projectEra';

export interface EraBootstrapResponse {
  success: boolean;
  source: 'mongodb' | 'local';
  currentUser: EraUserProfile | null;
  projects: EraProject[];
  mentoringRequests: EraMentoringRequest[];
}

export async function fetchEraBootstrap(): Promise<EraBootstrapResponse | null> {
  try {
    const res = await fetch('/api/era/bootstrap', {
      method: 'GET',
      credentials: 'include',
      headers: { Accept: 'application/json' }
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.success) {
      return data as EraBootstrapResponse;
    }
    return null;
  } catch {
    return null;
  }
}

export async function apiLoginEraUser(payload: {
  email?: string;
  password?: string;
  accountType?: EraAccountType;
  quickRoleSwitch?: boolean;
}): Promise<{ user: EraUserProfile; fromBackend: boolean } | null> {
  try {
    const res = await fetch('/api/era/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.success && data.user) {
      return { user: data.user as EraUserProfile, fromBackend: true };
    }
    return null;
  } catch {
    return null;
  }
}

export async function apiRegisterEraUser(
  payload: Partial<EraUserProfile> & { password?: string }
): Promise<{ user: EraUserProfile; fromBackend: boolean } | null> {
  try {
    const res = await fetch('/api/era/auth/register', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.success && data.user) {
      return { user: data.user as EraUserProfile, fromBackend: true };
    }
    return null;
  } catch {
    return null;
  }
}

export async function apiLogoutEraUser(): Promise<void> {
  try {
    await fetch('/api/era/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
  } catch {
    // Ignore network error on logout
  }
}

export async function apiUpdateEraProfile(
  profile: EraUserProfile
): Promise<EraUserProfile | null> {
  try {
    const res = await fetch('/api/era/profile', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.success ? (data.user as EraUserProfile) : null;
  } catch {
    return null;
  }
}

export async function apiCreateEraProject(
  project: EraProject
): Promise<EraProject | null> {
  try {
    const res = await fetch('/api/era/projects', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.success ? (data.project as EraProject) : null;
  } catch {
    return null;
  }
}

export async function apiUpdateEraProject(
  project: EraProject
): Promise<EraProject | null> {
  try {
    const res = await fetch(`/api/era/projects/${encodeURIComponent(project.id)}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.success ? (data.project as EraProject) : null;
  } catch {
    return null;
  }
}

export async function apiCreateEraMentoring(
  request: EraMentoringRequest
): Promise<EraMentoringRequest | null> {
  try {
    const res = await fetch('/api/era/mentoring', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.success ? (data.mentoringRequest as EraMentoringRequest) : null;
  } catch {
    return null;
  }
}

export async function apiUpdateEraMentoringStatus(
  id: string,
  status: EraMentoringRequest['status']
): Promise<EraMentoringRequest | null> {
  try {
    const res = await fetch(`/api/era/mentoring/${encodeURIComponent(id)}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.success ? (data.mentoringRequest as EraMentoringRequest) : null;
  } catch {
    return null;
  }
}

export async function apiResetEraWorkspace(): Promise<{
  projects: EraProject[];
  mentoringRequests: EraMentoringRequest[];
} | null> {
  try {
    const res = await fetch('/api/era/reset', {
      method: 'POST',
      credentials: 'include'
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.success) {
      return {
        projects: data.projects,
        mentoringRequests: data.mentoringRequests
      };
    }
    return null;
  } catch {
    return null;
  }
}
