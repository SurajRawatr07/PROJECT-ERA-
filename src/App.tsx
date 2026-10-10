import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, PublicPage } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProjectEraSections } from './components/home/ProjectEraSections';
import { Footer } from './components/Footer';
import { ProjectEraAuthPage } from './components/auth/ProjectEraAuthPage';
import { ProjectEraWorkspace } from './components/dashboard/ProjectEraWorkspace';
import {
  EraAccountType,
  EraMentoringRequest,
  EraProject,
  EraProjectStatus,
  EraUserProfile
} from './types/projectEra';
import {
  DEMO_USERS,
  INITIAL_DEMO_PROJECTS,
  INITIAL_MENTORING_REQUESTS
} from './data/projectEraData';

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

  const [publicPage, setPublicPage] = useState<PublicPage>('home');
  const [authRolePreselect, setAuthRolePreselect] = useState<EraAccountType>('STUDENT');

  // Workspace navigation state
  const [workspaceNav, setWorkspaceNav] = useState<
    'dashboard' | 'projects' | 'project-details' | 'profile' | 'settings'
  >('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    INITIAL_DEMO_PROJECTS[0]?.id || null
  );

  // Sync demo projects & mentoring requests to localStorage for local demonstration convenience
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

    if (path === 'login') {
      setPublicPage('login');
      return;
    }
    if (path === 'register') {
      setPublicPage('register');
      return;
    }
    if (path === 'how-it-works') {
      setPublicPage('how-it-works');
      setTimeout(() => {
        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
      return;
    }
    if (path === 'faq') {
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
          setWorkspaceNav('dashboard');
          return;
        }
      }
      if (path === 'projects') {
        setWorkspaceNav('projects');
        return;
      }
      if (path.startsWith('projects/')) {
        const pid = window.location.pathname.split('/')[2];
        if (pid) {
          setSelectedProjectId(pid);
          setWorkspaceNav('project-details');
          return;
        }
      }
      if (path === 'profile') {
        setWorkspaceNav('profile');
        return;
      }
      if (path === 'settings') {
        setWorkspaceNav('settings');
        return;
      }
    }
  }, [currentUser]);

  useEffect(() => {
    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, [syncFromUrl]);

  const handleSelectPublicPage = (page: PublicPage) => {
    setPublicPage(page);

    if (page === 'home') {
      window.history.pushState(null, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleOpenLogin = (role?: EraAccountType) => {
    if (role) setAuthRolePreselect(role);
    setPublicPage('login');
    window.history.pushState(null, '', '/login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenRegister = (role?: EraAccountType) => {
    if (role) setAuthRolePreselect(role);
    setPublicPage('register');
    window.history.pushState(null, '', '/register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthenticated = (userProfile: EraUserProfile) => {
    setCurrentUser(userProfile);
    try {
      sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userProfile));
    } catch {
      // Ignore storage error
    }
    setWorkspaceNav('dashboard');
    window.history.pushState(
      null,
      '',
      `/dashboard/${userProfile.accountType.toLowerCase()}`
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreStageInDemo = (_stage: EraProjectStatus) => {
    const demoStudent = DEMO_USERS.STUDENT;
    setCurrentUser(demoStudent);
    try {
      sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(demoStudent));
    } catch {
      // Ignore storage error
    }
    setWorkspaceNav('projects');
    window.history.pushState(null, '', '/projects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      sessionStorage.removeItem(STORAGE_KEYS.USER);
    } catch {
      // Ignore
    }
    setPublicPage('home');
    window.history.pushState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwitchDemoRole = (role: EraAccountType) => {
    const nextUser = DEMO_USERS[role];
    setCurrentUser(nextUser);
    try {
      sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(nextUser));
    } catch {
      // Ignore
    }
    setWorkspaceNav('dashboard');
    window.history.pushState(null, '', `/dashboard/${role.toLowerCase()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectWorkspaceNav = (
    nav: 'dashboard' | 'projects' | 'project-details' | 'profile' | 'settings'
  ) => {
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
    setWorkspaceNav('project-details');
    window.history.pushState(null, '', `/projects/${projectId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateProject = (updated: EraProject) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleCreateProject = (created: EraProject) => {
    setProjects((prev) => [created, ...prev]);
    setSelectedProjectId(created.id);
    setWorkspaceNav('project-details');
    window.history.pushState(null, '', `/projects/${created.id}`);
  };

  const handleResetDemoData = () => {
    setProjects(INITIAL_DEMO_PROJECTS);
    setMentoringRequests(INITIAL_MENTORING_REQUESTS);
    try {
      localStorage.removeItem(STORAGE_KEYS.PROJECTS);
      localStorage.removeItem(STORAGE_KEYS.MENTORING);
    } catch {
      // Ignore
    }
    setWorkspaceNav('dashboard');
  };

  // =========================================================================
  // AUTHENTICATED DEMONSTRATION WORKSPACE (STUDENT, FACULTY, HOD, ALUMNI)
  // =========================================================================
  if (currentUser) {
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
        onUpdateUser={(updated) => {
          setCurrentUser(updated);
          try {
            sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
          } catch {
            // Ignore
          }
        }}
        onSwitchDemoRole={handleSwitchDemoRole}
        onUpdateMentoringRequests={setMentoringRequests}
        onResetDemoData={handleResetDemoData}
        onLogout={handleLogout}
      />
    );
  }

  // =========================================================================
  // PUBLIC WEBSITE & AUTHENTICATION PAGES
  // =========================================================================
  return (
    <div className="min-h-screen bg-white text-neutral-900 relative overflow-x-hidden font-body selection:bg-neutral-900 selection:text-white flex flex-col">
      <Navbar
        currentPage={publicPage}
        onSelectPage={handleSelectPublicPage}
        onOpenLogin={() => handleOpenLogin()}
        onOpenRegister={() => handleOpenRegister()}
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
      ) : (
        <main className="flex-1 w-full bg-white">
          {/* Hero with Clean Side Animation (Zero Text, Zero Icons) */}
          <Hero
            onGetStartedClick={() => handleOpenRegister('STUDENT')}
            onHowItWorksClick={() => handleSelectPublicPage('how-it-works')}
          />

          {/* 5-Step How It Works, 4 Roles, Lifecycle, FAQ */}
          <ProjectEraSections
            onGetStarted={(role) => handleOpenRegister(role || 'STUDENT')}
            onExploreStage={handleExploreStageInDemo}
          />
        </main>
      )}

      <Footer
        onSelectPage={handleSelectPublicPage}
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
      />
    </div>
  );
}
