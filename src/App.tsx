import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, PublicPage } from './components/Navbar';
import { Hero } from './components/Hero';
import { WhoProjectVerseIsFor } from './components/WhoProjectVerseIsFor';
import { WhatProjectVerseDoes } from './components/WhatProjectVerseDoes';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { StaticBackground } from './components/common/StaticBackground';
import { DemoAccountsModal } from './components/common/DemoAccountsModal';
import { ExploreAuthPromptModal } from './components/modals/ExploreAuthPromptModal';
import { ExploreEcosystemBanner } from './components/ExploreEcosystemBanner';

// Authenticated Application Workspace
import { AuthAppView, UserRole } from './components/AuthAppView';
import { getCurrentSession, clearSession, resolveProfileWithPrivacy } from './lib/authService';

// Interactive Modals
import { ProjectDetailModal } from './components/modals/ProjectDetailModal';
import { BuildProjectModal } from './components/modals/BuildProjectModal';
import { JoinProjectModal } from './components/modals/JoinProjectModal';
import { AuthModal } from './components/modals/AuthModal';
import { ProofOfWorkModal } from './components/modals/ProofOfWorkModal';
import { ProjectPassportModal } from './components/modals/ProjectPassportModal';

import { ProjectItem } from './types';
import { SAMPLE_PROJECTS } from './data/mockData';

// List of protected routes that strictly require authentication
const PROTECTED_ROUTES = [
  'explore',
  'explore-projects',
  'projects',
  'project',
  'submit',
  'submit-project',
  'dashboard',
  'profile',
  'collaboration',
  'mentorship',
  'notifications',
  'verification',
  'settings',
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('STUDENT');
  const [currentPage, setCurrentPage] = useState<PublicPage>('home');
  const [projects, setProjects] = useState<ProjectItem[]>(SAMPLE_PROJECTS);
  const [initialAppTab, setInitialAppTab] = useState<string>('dashboard');
  const [isExploreAuthPromptOpen, setIsExploreAuthPromptOpen] = useState(false);

  // Modal states
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isBuildModalOpen, setIsBuildModalOpen] = useState(false);
  const [joinProjectTarget, setJoinProjectTarget] = useState<ProjectItem | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authInitialRole, setAuthInitialRole] = useState<UserRole | undefined>(undefined);
  const [authInitialEmail, setAuthInitialEmail] = useState<string | undefined>(undefined);
  const [authInitialPassword, setAuthInitialPassword] = useState<string | undefined>(undefined);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isProofOfWorkOpen, setIsProofOfWorkOpen] = useState(false);
  const [selectedPassportProject, setSelectedPassportProject] = useState<ProjectItem | null>(null);

  // Store intent for post-login redirection
  const [pendingProtectedTarget, setPendingProtectedTarget] = useState<string | null>(null);

  // Protected route evaluator & guard
  const evaluateRoute = useCallback((authed: boolean, roleParam?: UserRole) => {
    const rawPath = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
    const rawHash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    const target = rawPath || rawHash;

    const isExplicitlyProtected = PROTECTED_ROUTES.some(
      (route) => target === route || target.startsWith(`${route}/`)
    );

    if (isExplicitlyProtected) {
      if (!authed) {
        setPendingProtectedTarget(target);
        if (target.startsWith('explore') || target.startsWith('projects') || target.startsWith('project')) {
          setIsExploreAuthPromptOpen(true);
        } else {
          setAuthMode('login');
          setIsAuthModalOpen(true);
        }
        setCurrentPage('home');
        return;
      }

      if (target.startsWith('dashboard/')) {
        const routeRole = target.split('/')[1]?.toUpperCase() as UserRole;
        const validRoles: UserRole[] = [
          'STUDENT', 'FACULTY', 'HOD', 'DEVELOPER', 'RESEARCHER', 'ALUMNI', 'INSTITUTION', 'INDUSTRY_PROFESSIONAL'
        ];
        if (validRoles.includes(routeRole)) {
          setCurrentRole(routeRole);
          setInitialAppTab('dashboard');
        }
        return;
      } else if (target === 'explore' || target === 'explore-projects' || target === 'projects') {
        setInitialAppTab('directory');
        return;
      }
    }

    if (authed && (!target || target === 'home' || target === 'dashboard')) {
      const activeUserRole = roleParam || currentRole;
      const expectedDashboardPath = `dashboard/${activeUserRole.toLowerCase()}`;
      window.history.replaceState(null, '', `/${expectedDashboardPath}`);
      setInitialAppTab('dashboard');
      return;
    }

    // Public Route Handling
    if (target === 'login') {
      setAuthMode('login');
      setIsAuthModalOpen(true);
      setCurrentPage('home');
    } else if (target === 'register' || target === 'get-started') {
      setAuthMode('register');
      setIsAuthModalOpen(true);
      setCurrentPage('home');
    } else if (target === 'who-can-use' || target === 'who-its-for') {
      setCurrentPage('home');
      setTimeout(() => {
        const el = document.getElementById('who-can-use');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (target === 'how-it-works' || target === 'howitworks') {
      setCurrentPage('how-it-works');
      setTimeout(() => {
        const el = document.getElementById('how-it-works');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (target === 'faq') {
      setCurrentPage('faq');
      setTimeout(() => {
        const el = document.getElementById('faq');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      setCurrentPage('home');
    }
  }, [currentRole]);

  // Check existing session on mount
  useEffect(() => {
    const session = getCurrentSession();
    const hasValidSession = Boolean(session && session.user);
    if (hasValidSession && session) {
      const resolved = resolveProfileWithPrivacy(session.token, 'me');
      const verifiedRole = resolved.success && resolved.profile ? resolved.profile.role : session.user.role;
      setCurrentRole(verifiedRole);
      setIsAuthenticated(true);
      evaluateRoute(true, verifiedRole);
    } else {
      setIsAuthenticated(false);
      evaluateRoute(false);
    }

    const handlePopState = () => {
      const activeSession = getCurrentSession();
      if (activeSession && activeSession.user) {
        const resolved = resolveProfileWithPrivacy(activeSession.token, 'me');
        const verifiedRole = resolved.success && resolved.profile ? resolved.profile.role : activeSession.user.role;
        evaluateRoute(true, verifiedRole);
      } else {
        evaluateRoute(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, [evaluateRoute]);

  // Authentication Open Handlers
  const handleOpenLogin = (role?: UserRole, email?: string, pass?: string) => {
    setAuthMode('login');
    setAuthInitialRole(role);
    setAuthInitialEmail(email);
    setAuthInitialPassword(pass);
    setIsAuthModalOpen(true);
    if (window.location.pathname !== '/login') {
      window.history.pushState(null, '', '/login');
    }
  };

  const handleOpenRegister = (role?: UserRole) => {
    setAuthMode('register');
    setAuthInitialRole(role);
    setAuthInitialEmail(undefined);
    setAuthInitialPassword(undefined);
    setIsAuthModalOpen(true);
    if (window.location.pathname !== '/register') {
      window.history.pushState(null, '', '/register');
    }
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthInitialRole(undefined);
    setAuthInitialEmail(undefined);
    setAuthInitialPassword(undefined);
    if (window.location.pathname === '/login' || window.location.pathname === '/register') {
      window.history.replaceState(null, '', '/');
    }
  };

  const handleAuthenticated = (role: UserRole) => {
    setCurrentRole(role);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    setIsExploreAuthPromptOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (pendingProtectedTarget && !pendingProtectedTarget.startsWith('dashboard')) {
      const target = pendingProtectedTarget;
      setPendingProtectedTarget(null);

      if (target.startsWith('projects') || target.startsWith('project') || target.startsWith('explore')) {
        setInitialAppTab('directory');
      } else if (target === 'submit' || target === 'submit-project') {
        setIsBuildModalOpen(true);
      } else if (target === 'collaboration') {
        setInitialAppTab('collaboration');
      } else if (target === 'mentorship') {
        setInitialAppTab('mentors');
      } else if (target === 'notifications') {
        setInitialAppTab('notifications');
      } else if (target === 'profile') {
        setInitialAppTab('profile');
      } else if (target === 'settings') {
        setInitialAppTab('settings');
      } else if (target === 'verification') {
        setInitialAppTab('proof-of-work');
      }
      window.history.replaceState(null, '', `/${target}`);
    } else {
      setPendingProtectedTarget(null);
      setInitialAppTab('dashboard');
      window.history.replaceState(null, '', `/dashboard/${role.toLowerCase()}`);
    }
  };

  const handleLogout = () => {
    clearSession();
    setIsAuthenticated(false);
    setCurrentPage('home');
    setPendingProtectedTarget(null);
    window.history.replaceState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Public Navigation Link Handler
  const handleSelectPage = (page: PublicPage) => {
    setCurrentPage(page);

    if (page === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.location.pathname !== '/') {
        window.history.pushState(null, '', '/');
      }
      return;
    }

    if (page === 'about') {
      const el = document.getElementById('who-can-use');
      if (el) {
        const yOffset = -70;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
      if (window.location.pathname !== '/about') {
        window.history.pushState(null, '', '/about');
      }
      return;
    }

    if (page === 'how-it-works') {
      const el = document.getElementById('how-it-works');
      if (el) {
        const yOffset = -70;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
      if (window.location.pathname !== '/how-it-works') {
        window.history.pushState(null, '', '/how-it-works');
      }
      return;
    }

    if (page === 'faq') {
      const el = document.getElementById('faq');
      if (el) {
        const yOffset = -70;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
      if (window.location.pathname !== '/faq') {
        window.history.pushState(null, '', '/faq');
      }
      return;
    }
  };

  // Scroll-spy to synchronize navbar active indicator when on landing page
  useEffect(() => {
    if (isAuthenticated) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const handleScroll = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        timeoutId = null;
        const scrollPosition = window.scrollY + 120;
        const faqEl = document.getElementById('faq');
        const howItWorksEl = document.getElementById('how-it-works');
        const whoCanUseEl = document.getElementById('who-can-use');

        if (faqEl && scrollPosition >= faqEl.offsetTop) {
          setCurrentPage('faq');
        } else if (howItWorksEl && scrollPosition >= howItWorksEl.offsetTop) {
          setCurrentPage('how-it-works');
        } else if (whoCanUseEl && scrollPosition >= whoCanUseEl.offsetTop) {
          setCurrentPage('about');
        } else {
          setCurrentPage('home');
        }
      }, 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isAuthenticated]);

  const handleProjectCreated = (newProject?: any) => {
    setIsBuildModalOpen(false);
    if (newProject && newProject.title) {
      setProjects((prev) => [newProject, ...prev]);
    }
    setInitialAppTab('directory');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDemoAccount = (acc: any) => {
    setIsDemoModalOpen(false);
    handleOpenLogin(acc.role, acc.email, acc.credentialsHint.split('Password: ')[1]?.split(' ')[0]);
  };

  // =========================================================================
  // AUTHENTICATED APPLICATION WORKSPACE
  // =========================================================================
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fdfaf4] text-[#1a2744] relative overflow-x-hidden font-body selection:bg-[#1a2744] selection:text-white">
        <StaticBackground />
        <AuthAppView
          initialRole={currentRole}
          initialTab={initialAppTab}
          onLogout={handleLogout}
          onOpenProjectDetail={(project) => setSelectedProject(project)}
          onOpenBuildProject={() => setIsBuildModalOpen(true)}
          onOpenJoinProject={(project) => setJoinProjectTarget(project)}
          onOpenProofOfWork={() => setIsProofOfWorkOpen(true)}
        />

        {/* Authenticated Interactive Modals */}
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onJoinClick={(project) => setJoinProjectTarget(project)}
        />

        <BuildProjectModal
          isOpen={isBuildModalOpen}
          onClose={() => setIsBuildModalOpen(false)}
          onProjectCreated={handleProjectCreated}
          onRequireAuth={handleOpenLogin}
        />

        <JoinProjectModal
          project={joinProjectTarget}
          onClose={() => setJoinProjectTarget(null)}
        />

        <ProofOfWorkModal
          isOpen={isProofOfWorkOpen}
          onClose={() => setIsProofOfWorkOpen(false)}
        />
      </div>
    );
  }

  // =========================================================================
  // PUBLIC WEBSITE (BATCHBRO-STYLED PROJECTVERSE MARKETING LAYER)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#fdfaf4] text-[#1a2744] relative overflow-x-hidden font-body selection:bg-[#1a2744] selection:text-white">
      {/* Static Background */}
      <StaticBackground />

      {/* 1. BatchBro-style Clean Public Navbar */}
      <Navbar
        currentPage={currentPage}
        onSelectPage={handleSelectPage}
        onOpenLogin={() => handleOpenLogin()}
        onOpenRegister={() => handleOpenRegister()}
        onOpenDemoAccounts={() => setIsDemoModalOpen(true)}
      />

      <main className="w-full">
        {/* 1. Hero Landing Banner */}
        <Hero
          onGetStartedClick={() => handleOpenRegister()}
          onLoginClick={() => handleOpenLogin()}
        />

        {/* 2. Who Can Use ProjectVerse? */}
        <WhoProjectVerseIsFor onOpenRegister={() => handleOpenRegister()} />

        {/* 3. Contextual Explore the Project Ecosystem Banner */}
        <ExploreEcosystemBanner
          onExploreClick={() => {
            setPendingProtectedTarget('explore');
            setIsExploreAuthPromptOpen(true);
          }}
        />

        {/* 4. How It Works Section */}
        <WhatProjectVerseDoes onGetStarted={() => handleOpenRegister()} />

        {/* 5. Frequently Asked Questions */}
        <FAQSection />
      </main>

      {/* 5. BatchBro-style Footer */}
      <Footer
        onSelectPage={handleSelectPage}
        onOpenLogin={() => handleOpenLogin()}
        onOpenRegister={() => handleOpenRegister()}
      />

      {/* Public Authentication Modal (Login / Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        initialRole={authInitialRole}
        initialEmail={authInitialEmail}
        initialPassword={authInitialPassword}
        onClose={handleCloseAuthModal}
        onAuthenticated={handleAuthenticated}
      />

      {/* Deliberate Explore Projects Auth Prompt */}
      <ExploreAuthPromptModal
        isOpen={isExploreAuthPromptOpen}
        onClose={() => setIsExploreAuthPromptOpen(false)}
        onSignIn={() => {
          setPendingProtectedTarget('explore');
          handleOpenLogin();
        }}
        onCreateAccount={() => {
          setPendingProtectedTarget('explore');
          handleOpenRegister();
        }}
      />

      {/* Demo Accounts Modal */}
      <DemoAccountsModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onSelectAccount={handleSelectDemoAccount}
      />

      {/* Public Project Details / Passport Preview */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenPassport={(project) => {
          setSelectedProject(null);
          setSelectedPassportProject(project);
        }}
        onJoinClick={() => {
          setPendingProtectedTarget('explore');
          setIsExploreAuthPromptOpen(true);
        }}
      />

      {/* Public Project Passport Modal */}
      <ProjectPassportModal
        project={selectedPassportProject}
        onClose={() => setSelectedPassportProject(null)}
        onContinueProject={(project) => {
          setSelectedPassportProject(null);
          setPendingProtectedTarget('continuity');
          setIsExploreAuthPromptOpen(true);
        }}
        onOpenHandover={(project) => {
          setSelectedPassportProject(null);
          setPendingProtectedTarget('handover');
          setIsExploreAuthPromptOpen(true);
        }}
      />
    </div>
  );
}
