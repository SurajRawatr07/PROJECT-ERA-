import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, PublicPage } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProjectEraSections } from './components/home/ProjectEraSections';
import { Footer } from './components/Footer';
import { ProjectEraAuthPage } from './components/auth/ProjectEraAuthPage';
import { ProjectEraWorkspace } from './components/dashboard/ProjectEraWorkspace';
import { PublicExploreProjectsPage } from './components/projects/PublicExploreProjectsPage';
import { ProjectEraFormModal } from './components/projects/ProjectEraFormModal';
import {
  EraAccountType,
  EraMentoringRequest,
  EraProject,
  EraUserProfile
} from './types/projectEra';
import {
  DEMO_USERS,
  INITIAL_DEMO_PROJECTS,
  INITIAL_MENTORING_REQUESTS
} from './data/projectEraData';
import {
  apiCreateEraMentoring,
  apiCreateEraProject,
  apiLoginEraUser,
  apiLogoutEraUser,
  apiRegisterEraUser,
  apiResetEraWorkspace,
  apiUpdateEraMentoringStatus,
  apiUpdateEraProfile,
  apiUpdateEraProject,
  fetchEraBootstrap
} from './services/eraApiService';

const STORAGE_KEYS = {
  USER: 'project_era_demo_user_v1',
  PROJECTS: 'project_era_demo_projects_v1',
  MENTORING: 'project_era_demo_mentoring_v1'
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<EraUserProfile | null>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [projects, setProjects] = useState<EraProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return saved ? JSON.parse(saved) : INITIAL_DEMO_PROJECTS;
    } catch {
      return INITIAL_DEMO_PROJECTS;
    }
  });

  const [mentoringRequests, setMentoringRequests] = useState<EraMentoringRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MENTORING);
      return saved ? JSON.parse(saved) : INITIAL_MENTORING_REQUESTS;
    } catch {
      return INITIAL_MENTORING_REQUESTS;
    }
  });

  // View mode: 'public' shows landing page / public explore / auth; 'workspace' shows role dashboard
  const [viewMode, setViewMode] = useState<'public' | 'workspace'>(() => {
    const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
    if (
      path.startsWith('dashboard/') ||
      path === 'projects' ||
      path.startsWith('projects/') ||
      path === 'profile' ||
      path === 'settings'
    ) {
      return 'workspace';
    }
    return 'public';
  });

  const [publicPage, setPublicPage] = useState<PublicPage>('home');
  const [authRolePreselect, setAuthRolePreselect] = useState<EraAccountType>('STUDENT');
  const [selectedRoleOnLanding, setSelectedRoleOnLanding] = useState<EraAccountType | null>(
    'STUDENT'
  );
  const [isPublicCreateModalOpen, setIsPublicCreateModalOpen] = useState(false);

  // Workspace navigation state
  const [workspaceNav, setWorkspaceNav] = useState<
    'dashboard' | 'projects' | 'project-details' | 'profile' | 'settings'
  >('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    INITIAL_DEMO_PROJECTS[0]?.id || null
  );

  // Hydrate from real backend (/api/era/bootstrap) when available
  useEffect(() => {
    let mounted = true;
    fetchEraBootstrap().then((data) => {
      if (!mounted || !data) return;
      if (Array.isArray(data.projects) && data.projects.length > 0) {
        setProjects(data.projects);
      }
      if (Array.isArray(data.mentoringRequests) && data.mentoringRequests.length > 0) {
        setMentoringRequests(data.mentoringRequests);
      }
      if (data.currentUser) {
        setCurrentUser(data.currentUser);
        try {
          sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.currentUser));
        } catch {
          // Ignore storage error
        }
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Sync projects & mentoring requests to localStorage as fallback cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch {
      // Ignore storage quota errors
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MENTORING, JSON.stringify(mentoringRequests));
    } catch {
      // Ignore storage quota errors
    }
  }, [mentoringRequests]);

  // Sync URL path on load and popstate
  const syncFromUrl = useCallback(() => {
    const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();

    if (!path || path === 'home') {
      setViewMode('public');
      setPublicPage('home');
      return;
    }
    if (path === 'explore') {
      setViewMode('public');
      setPublicPage('explore');
      return;
    }
    if (path === 'login') {
      setViewMode('public');
      setPublicPage('login');
      return;
    }
    if (path === 'register') {
      setViewMode('public');
      setPublicPage('register');
      return;
    }
    if (path === 'who-can-use') {
      setViewMode('public');
      setPublicPage('home');
      setTimeout(() => {
        document.getElementById('who-can-use')?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
      return;
    }
    if (path === 'how-it-works') {
      setViewMode('public');
      setPublicPage('how-it-works');
      setTimeout(() => {
        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
      return;
    }
    if (path === 'faq') {
      setViewMode('public');
      setPublicPage('faq');
      setTimeout(() => {
        document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
      return;
    }

    if (currentUser) {
      if (path.startsWith('dashboard/')) {
        const rolePart = path.split('/')[1]?.toUpperCase() as EraAccountType;
        if (['STUDENT', 'FACULTY', 'HOD', 'ALUMNI'].includes(rolePart)) {
          if (rolePart !== currentUser.accountType) {
            const switched = DEMO_USERS[rolePart];
            setCurrentUser(switched);
            sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(switched));
          }
          setViewMode('workspace');
          setWorkspaceNav('dashboard');
          return;
        }
      }
      if (path === 'projects') {
        setViewMode('workspace');
        setWorkspaceNav('projects');
        return;
      }
      if (path.startsWith('projects/')) {
        const pid = window.location.pathname.split('/')[2];
        if (pid) {
          setSelectedProjectId(pid);
          setViewMode('workspace');
          setWorkspaceNav('project-details');
          return;
        }
      }
      if (path === 'profile') {
        setViewMode('workspace');
        setWorkspaceNav('profile');
        return;
      }
      if (path === 'settings') {
        setViewMode('workspace');
        setWorkspaceNav('settings');
        return;
      }
    } else if (path === 'projects' || path.startsWith('projects/')) {
      setViewMode('public');
      setPublicPage('explore');
    }
  }, [currentUser]);

  useEffect(() => {
    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, [syncFromUrl]);

  const handleSelectPublicPage = (page: PublicPage) => {
    setViewMode('public');
    setPublicPage(page);

    if (page === 'home') {
      window.history.pushState(null, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (page === 'explore') {
      window.history.pushState(null, '', '/explore');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (page === 'who-can-use') {
      window.history.pushState(null, '', '/who-can-use');
      setTimeout(() => {
        document.getElementById('who-can-use')?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
      return;
    }

    if (page === 'how-it-works') {
      window.history.pushState(null, '', '/how-it-works');
      setTimeout(() => {
        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
      return;
    }

    if (page === 'faq') {
      window.history.pushState(null, '', '/faq');
      setTimeout(() => {
        document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
      return;
    }

    if (page === 'login') {
      window.history.pushState(null, '', '/login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (page === 'register') {
      window.history.pushState(null, '', '/register');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectRoleInfo = (role: EraAccountType) => {
    setSelectedRoleOnLanding(role);
    setViewMode('public');
    setPublicPage('home');
    window.history.pushState(null, '', '/who-can-use');
    setTimeout(() => {
      document.getElementById('who-can-use')?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  };

  const handleOpenLogin = (role?: EraAccountType) => {
    if (currentUser) {
      setViewMode('workspace');
      setWorkspaceNav('dashboard');
      window.history.pushState(
        null,
        '',
        `/dashboard/${currentUser.accountType.toLowerCase()}`
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (role) setAuthRolePreselect(role);
    setViewMode('public');
    setPublicPage('login');
    window.history.pushState(null, '', '/login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenRegister = (role?: EraAccountType) => {
    // If visitor is already authenticated, direct them to the appropriate application page instead of asking them to register again
    if (currentUser) {
      if (role && role !== currentUser.accountType) {
        handleSwitchDemoRole(role);
        return;
      }
      setViewMode('workspace');
      setWorkspaceNav('dashboard');
      window.history.pushState(
        null,
        '',
        `/dashboard/${currentUser.accountType.toLowerCase()}`
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (role) setAuthRolePreselect(role);
    setViewMode('public');
    setPublicPage('register');
    window.history.pushState(null, '', '/register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthenticated = async (userProfile: EraUserProfile) => {
    setCurrentUser(userProfile);
    try {
      sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userProfile));
    } catch {
      // Ignore storage error
    }
    setViewMode('workspace');
    setWorkspaceNav('dashboard');
    window.history.pushState(
      null,
      '',
      `/dashboard/${userProfile.accountType.toLowerCase()}`
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Sync with backend API
    if (publicPage === 'register') {
      await apiRegisterEraUser(userProfile);
    } else {
      await apiLoginEraUser({
        email: userProfile.email,
        password: 'ProjectEra@2026',
        accountType: userProfile.accountType
      });
    }
  };

  const handleLogout = async () => {
    setCurrentUser(null);
    try {
      sessionStorage.removeItem(STORAGE_KEYS.USER);
    } catch {
      // Ignore
    }
    setViewMode('public');
    setPublicPage('home');
    window.history.pushState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    await apiLogoutEraUser();
  };

  const handleSwitchDemoRole = async (role: EraAccountType) => {
    const nextUser = DEMO_USERS[role];
    setCurrentUser(nextUser);
    try {
      sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(nextUser));
    } catch {
      // Ignore
    }
    setViewMode('workspace');
    setWorkspaceNav('dashboard');
    window.history.pushState(null, '', `/dashboard/${role.toLowerCase()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    await apiLoginEraUser({ accountType: role, quickRoleSwitch: true });
  };

  const handleSelectWorkspaceNav = (
    nav: 'dashboard' | 'projects' | 'project-details' | 'profile' | 'settings'
  ) => {
    setViewMode('workspace');
    setWorkspaceNav(nav);
    if (nav === 'dashboard' && currentUser) {
      window.history.pushState(
        null,
        '',
        `/dashboard/${currentUser.accountType.toLowerCase()}`
      );
    } else if (nav === 'projects') {
      window.history.pushState(null, '', '/projects');
    } else if (nav === 'profile') {
      window.history.pushState(null, '', '/profile');
    } else if (nav === 'settings') {
      window.history.pushState(null, '', '/settings');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    if (!currentUser) {
      const defaultStudent = DEMO_USERS.STUDENT;
      setCurrentUser(defaultStudent);
      try {
        sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(defaultStudent));
      } catch {
        // Ignore
      }
    }
    setViewMode('workspace');
    setWorkspaceNav('project-details');
    window.history.pushState(null, '', `/projects/${projectId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateProject = async (updated: EraProject) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    await apiUpdateEraProject(updated);
  };

  const handleCreateProject = async (created: EraProject) => {
    setProjects((prev) => [created, ...prev]);
    setSelectedProjectId(created.id);
    if (!currentUser) {
      const defaultStudent = DEMO_USERS.STUDENT;
      setCurrentUser(defaultStudent);
      try {
        sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(defaultStudent));
      } catch {
        // Ignore
      }
    }
    setViewMode('workspace');
    setWorkspaceNav('project-details');
    window.history.pushState(null, '', `/projects/${created.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    await apiCreateEraProject(created);
  };

  const handleUpdateMentoringRequests = async (updated: EraMentoringRequest[]) => {
    const prevIds = new Set(mentoringRequests.map((m) => m.id));
    const newlyAdded = updated.find((m) => !prevIds.has(m.id));
    setMentoringRequests(updated);

    if (newlyAdded) {
      await apiCreateEraMentoring(newlyAdded);
    } else {
      for (const item of updated) {
        const prevItem = mentoringRequests.find((m) => m.id === item.id);
        if (prevItem && prevItem.status !== item.status) {
          await apiUpdateEraMentoringStatus(item.id, item.status);
        }
      }
    }
  };

  const handleResetDemoData = async () => {
    setProjects(INITIAL_DEMO_PROJECTS);
    setMentoringRequests(INITIAL_MENTORING_REQUESTS);
    try {
      localStorage.removeItem(STORAGE_KEYS.PROJECTS);
      localStorage.removeItem(STORAGE_KEYS.MENTORING);
    } catch {
      // Ignore
    }
    setWorkspaceNav('dashboard');
    const resetRes = await apiResetEraWorkspace();
    if (resetRes) {
      setProjects(resetRes.projects);
      setMentoringRequests(resetRes.mentoringRequests);
    }
  };

  const handleFooterCreateProject = () => {
    if (currentUser) {
      setIsPublicCreateModalOpen(true);
    } else {
      handleOpenRegister('STUDENT');
    }
  };

  const handleFooterMyProjects = () => {
    if (currentUser) {
      handleSelectWorkspaceNav('projects');
    } else {
      handleOpenLogin('STUDENT');
    }
  };

  // =========================================================================
  // AUTHENTICATED WORKSPACE (STUDENT, FACULTY, HOD, ALUMNI)
  // =========================================================================
  if (currentUser && viewMode === 'workspace') {
    return (
      <ProjectEraWorkspace
        user={currentUser}
        projects={projects}
        mentoringRequests={mentoringRequests}
        activeNav={workspaceNav}
        selectedProjectId={selectedProjectId}
        onSelectNav={handleSelectWorkspaceNav}
        onSelectProject={handleSelectProject}
        onUpdateProject={handleUpdateProject}
        onCreateProject={handleCreateProject}
        onUpdateUser={async (updated) => {
          setCurrentUser(updated);
          try {
            sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
          } catch {
            // Ignore
          }
          await apiUpdateEraProfile(updated);
        }}
        onSwitchDemoRole={handleSwitchDemoRole}
        onUpdateMentoringRequests={handleUpdateMentoringRequests}
        onResetDemoData={handleResetDemoData}
        onLogout={handleLogout}
      />
    );
  }

  // =========================================================================
  // PUBLIC WEBSITE, EXPLORE PROJECTS & AUTHENTICATION PAGES
  // =========================================================================
  return (
    <div className="min-h-screen bg-white text-neutral-900 relative overflow-x-hidden font-body selection:bg-neutral-900 selection:text-white flex flex-col">
      <Navbar
        currentPage={publicPage}
        isAuthenticated={Boolean(currentUser)}
        onSelectPage={handleSelectPublicPage}
        onOpenLogin={() => handleOpenLogin()}
        onOpenRegister={() => handleOpenRegister()}
        onOpenWorkspace={() => {
          setViewMode('workspace');
          setWorkspaceNav('dashboard');
          if (currentUser) {
            window.history.pushState(
              null,
              '',
              `/dashboard/${currentUser.accountType.toLowerCase()}`
            );
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {publicPage === 'login' || publicPage === 'register' ? (
        <main className="flex-1 bg-white">
          <ProjectEraAuthPage
            mode={publicPage === 'login' ? 'login' : 'register'}
            initialRole={authRolePreselect}
            onSwitchMode={(newMode) => handleSelectPublicPage(newMode)}
            onBackToHome={() => handleSelectPublicPage('home')}
            onAuthenticated={handleAuthenticated}
          />
        </main>
      ) : publicPage === 'explore' ? (
        <main className="flex-1 bg-white">
          <PublicExploreProjectsPage
            projects={projects}
            isAuthenticated={Boolean(currentUser)}
            onBackToHome={() => handleSelectPublicPage('home')}
            onCreateProjectClick={() => setIsPublicCreateModalOpen(true)}
            onOpenProjectInWorkspace={handleSelectProject}
          />
        </main>
      ) : (
        <main className="flex-1 w-full bg-white">
          {/* 2. Welcome to Project Era Hero Section */}
          <Hero
            isAuthenticated={Boolean(currentUser)}
            onExploreProjectsClick={() => handleSelectPublicPage('explore')}
            onGetStartedClick={() => handleOpenRegister('STUDENT')}
          />

          {/* 3. Open Academic Ecosystem, 4. Complete Project Lifecycle, 5. Answers & Clarity FAQ */}
          <ProjectEraSections
            selectedRoleFromNav={selectedRoleOnLanding}
            isAuthenticated={Boolean(currentUser)}
            onGetStarted={(role) => handleOpenRegister(role || 'STUDENT')}
            onExploreProjects={() => handleSelectPublicPage('explore')}
          />
        </main>
      )}

      {/* 6. ProjectVerse-Inspired Professional Footer */}
      <Footer
        onSelectPage={handleSelectPublicPage}
        onSelectRoleInfo={handleSelectRoleInfo}
        onCreateProjectClick={handleFooterCreateProject}
        onMyProjectsClick={handleFooterMyProjects}
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
      />

      {/* Direct Project Creation Modal (Review Optional) */}
      <ProjectEraFormModal
        isOpen={isPublicCreateModalOpen}
        initialProject={null}
        defaultLeadName={currentUser?.fullName || DEMO_USERS.STUDENT.fullName}
        defaultInstitution={
          currentUser?.institution || DEMO_USERS.STUDENT.institution
        }
        defaultDepartment={
          currentUser?.department || DEMO_USERS.STUDENT.department
        }
        onClose={() => setIsPublicCreateModalOpen(false)}
        onSave={handleCreateProject}
      />
    </div>
  );
}
