import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  Search,
  PlusCircle,
  ShieldCheck,
  Award,
  GitBranch,
  Sparkles,
  Users,
  GraduationCap,
  Building2,
  FileCheck2,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  LogOut,
  Bell,
  Settings,
  Filter,
  BarChart3,
  BookOpen,
  Send,
  Sliders,
  Compass,
  ArrowRight,
  UserCheck,
  FileSpreadsheet,
  Cpu,
  Clock,
  Briefcase,
  UserPlus,
  RefreshCw,
  Eye,
  Lock,
  FolderGit2,
  Check,
  AlertTriangle,
  Github,
  Mail,
  FileText,
  UploadCloud,
  X,
  AlertCircle,
  MessageSquare,
  Heart,
  Bookmark,
  TrendingUp,
  Activity,
  Code2,
  Network,
  FolderSync,
  GitFork
} from 'lucide-react';
import { ProjectItem, ProjectDomain, DocumentType, ProjectFeedback, StudentNotification, UserRole } from '../types';
import { SAMPLE_PROJECTS, DOMAINS_LIST, SAMPLE_PEERS, SAMPLE_MENTORS } from '../data/mockData';
import { ProjectVerseBrand } from './ProjectVerseBrand';
import { getCurrentSession, resolveProfileWithPrivacy, UserProfile, submitVerificationDocument, getInitialsAvatar } from '../lib/authService';
import { uploadAcademicDocument } from '../lib/documentService';
import { StudentVerificationManager } from './verification/StudentVerificationManager';
import { DocumentUploadDropzone } from './verification/DocumentUploadDropzone';
import { ProjectLineageView } from './lineage/ProjectLineageView';
import { ProjectHandoverView } from './handover/ProjectHandoverView';
import { ContributionEvidenceView } from './evidence/ContributionEvidenceView';
import { ProjectHealthCard } from './health/ProjectHealthCard';
import { ProjectContinuityCenter } from './continuity/ProjectContinuityCenter';
import { ExplainableMatchingView } from './matching/ExplainableMatchingView';
import { ProjectKnowledgeGraph } from './graph/ProjectKnowledgeGraph';
import { FacultyReviewRoom } from './review/FacultyReviewRoom';
import { ProofOfWorkView } from './proof/ProofOfWorkView';
import { HackathonDemoBar, HACKATHON_DEMO_STEPS, DemoStep } from './demo/HackathonDemoBar';
import { projectService } from '../services/projectService';
import { SMART_CAMPUS_NAV_PROJECT, getEnrichedProjects, buildHandoverPackage } from '../lib/ecosystemData';
import {
  submitProjectFeedbackFrontend,
  getFeedbacksForProject,
  getNotificationsForStudent,
  markNotificationAsReadFrontend,
  getFeedbackById,
  getAllFeedbacks
} from '../lib/feedbackService';
import { ProjectStatusBadge } from './common/ProjectStatusBadge';
import { ProjectDashboardModal } from './modals/ProjectDashboardModal';
import { ProjectPassportModal } from './modals/ProjectPassportModal';
import { CollaborationRequestModal } from './modals/CollaborationRequestModal';
import { GlobalSearchModal } from './search/GlobalSearchModal';
import { NotificationDropdown } from './notifications/NotificationDropdown';
import { NotificationCenterView } from './notifications/NotificationCenterView';
import { AdvancedProjectDiscovery } from './discovery/AdvancedProjectDiscovery';
import { SavedProjectsView } from './saved/SavedProjectsView';
import { RecentlyViewedSection } from './recent/RecentlyViewedSection';
import { CollaborationRequestsView } from './collaboration/CollaborationRequestsView';
import { FacultyAnalyticsDashboard } from './analytics/FacultyAnalyticsDashboard';
import { HODDepartmentDashboard } from './hod/HODDepartmentDashboard';
import { AdminManagementDashboard } from './admin/AdminManagementDashboard';
import { AIMatchingDashboard } from './matching/AIMatchingDashboard';
import { recordProjectView } from '../lib/recentlyViewedService';
import { 
  getAllNotifications, 
  getUnreadCount, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification 
} from '../lib/notificationService';
import { getRoleDemoData, StudentDemoData, FacultyDemoData, HODDemoData, AdminDemoData } from '../data/roleDemoData';
import { RoleBadge } from './common/RoleBadge';
import { RoleProfileView } from './common/RoleProfileView';
import { RoleSettingsView } from './common/RoleSettingsView';
import { StudentDashboardView } from './dashboard/StudentDashboardView';
import { FacultyDashboardView } from './dashboard/FacultyDashboardView';
import { HODDashboardView } from './dashboard/HODDashboardView';
import { AdminDashboardView } from './dashboard/AdminDashboardView';
import { InstitutionDashboardView } from './dashboard/InstitutionDashboardView';
import { DeveloperDashboardView } from './dashboard/DeveloperDashboardView';
import { ResearcherDashboardView } from './dashboard/ResearcherDashboardView';
import { AlumniDashboardView } from './dashboard/AlumniDashboardView';
import { IndustryProfessionalDashboardView } from './dashboard/IndustryProfessionalDashboardView';
import { EditProfileModal } from './common/EditProfileModal';
import { canRoleSubmitProject, getSubmitProjectButtonLabel } from '../lib/permissions';
import { StatsCard } from './common/StatsCard';
import { EmptyState } from './common/EmptyState';
import { 
  resolveUserInstitutionId, 
  resolveUserDepartmentId, 
  getInstitutionById, 
  getDepartmentAnalytics, 
  getInstitutionAnalytics, 
  getIsolatedDepartments, 
  getIsolatedProjects, 
  getIsolatedStudents, 
  getIsolatedFaculty, 
  getIsolatedHODs 
} from '../data/isolatedData';

export type { UserRole };

export const FALLBACK_PROFILES: Record<UserRole, UserProfile> = {
  STUDENT: {
    id: 'student-001',
    email: 'suraj@student.demo',
    fullName: 'Suraj Rawat',
    role: 'STUDENT',
    institution: 'Graphic Era Hill University',
    department: 'Dept of Computer Science & Engineering',
    course: 'BCA',
    batch: "BCA '27",
    rollNumber: 'GEHU/2023/BCA/089',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    githubHandle: 'suraj-rawat-dev',
    verifiedStatus: 'Verified',
    verificationSignals: {
      emailVerified: true,
      institutionalDomain: true,
      idProofVerified: true,
      nodeApproval: true
    },
    projectsCount: 6,
    commitsCount: 340,
    rubricScore: 9.8,
    bio: 'Full-stack builder and systems researcher passionate about developer tools, distributed computing, and web performance. Haldwani, Uttarakhand.',
    skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'MongoDB', 'C++', 'DSA', 'Git/GitHub', 'Tailwind CSS', 'Docker', 'Express', 'REST APIs']
  },
  ALUMNI: {
    id: 'usr-alumni-01',
    email: 'rohan.alumni@gehu.ac.in',
    fullName: 'Rohan Sharma',
    role: 'ALUMNI',
    institution: 'Graphic Era Hill University',
    department: 'Dept of Computer Science & Engineering',
    batch: "B.Tech '24",
    rollNumber: 'GEHU/2020/CS/042',
    graduationYear: '2024',
    currentOrganization: 'NVIDIA Autonomous Vehicles',
    currentJobRole: 'Systems Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    verifiedStatus: 'Verified',
    verificationSignals: {
      emailVerified: true,
      institutionalDomain: true,
      idProofVerified: true,
      nodeApproval: true
    },
    projectsCount: 4,
    bio: 'Alumni contributor and industry systems engineer mentoring future open-source lineages.',
    skills: ['Rust', 'Go', 'Autonomous Robotics', 'ROS 2']
  },
  DEVELOPER: {
    id: 'usr-dev-01',
    email: 'alex.dev@openverse.org',
    fullName: 'Alex Chen',
    role: 'DEVELOPER',
    githubUsername: 'alex-dev',
    primaryTechStack: ['Rust', 'TypeScript', 'Distributed Systems'],
    experienceYears: 4,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    verifiedStatus: 'Verified',
    verificationSignals: {
      emailVerified: true,
      institutionalDomain: false,
      idProofVerified: true,
      nodeApproval: true
    },
    projectsCount: 6,
    bio: 'Independent software architect maintaining high-performance open project tooling.',
    skills: ['Rust', 'TypeScript', 'WebAssembly', 'Distributed Consensus']
  },
  RESEARCHER: {
    id: 'usr-researcher-01',
    email: 'dr.elena@deepmind-labs.org',
    fullName: 'Dr. Elena Rostova',
    role: 'RESEARCHER',
    institution: 'DeepMind / GEHU Research Node',
    researchInterests: ['Edge AI', 'Neuromorphic Computing'],
    publicationsCount: 8,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    verifiedStatus: 'Verified',
    verificationSignals: {
      emailVerified: true,
      institutionalDomain: true,
      idProofVerified: true,
      nodeApproval: true
    },
    projectsCount: 12,
    bio: 'Domain researcher benchmarking verifiable machine intelligence algorithms.',
    skills: ['PyTorch', 'JAX', 'Neuromorphic Architectures', 'Edge Computing']
  },
  INDUSTRY_PROFESSIONAL: {
    id: 'usr-industry-01',
    email: 'vikram.singh@hypercloud.io',
    fullName: 'Vikram Singh',
    role: 'INDUSTRY_PROFESSIONAL',
    currentOrganization: 'HyperCloud Enterprise Solutions',
    currentJobRole: 'Principal Cloud Architect',
    experienceYears: 6,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    verifiedStatus: 'Verified',
    verificationSignals: {
      emailVerified: true,
      institutionalDomain: true,
      idProofVerified: true,
      nodeApproval: true
    },
    projectsCount: 8,
    bio: 'Enterprise cloud architect sponsoring real-world challenges and verification rubrics.',
    skills: ['Kubernetes', 'Cloud Infrastructure', 'Zero Trust Architecture']
  },
  FACULTY: {
    id: 'faculty-001',
    email: 'faculty@demo.com',
    fullName: 'Dr. Ananya Sharma',
    role: 'FACULTY',
    institution: 'Graphic Era Hill University',
    department: 'Computer Science & Engineering',
    facultyId: 'EMP-GEHU-FAC-409',
    designation: 'Assistant Professor',
    researchAreas: ['Artificial Intelligence', 'Edge Computing', 'Computer Vision'],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    verifiedStatus: 'Verified',
    verificationSignals: {
      emailVerified: true,
      institutionalDomain: true,
      idProofVerified: true,
      nodeApproval: true
    },
    projectsCount: 12,
    rubricScore: 9.9,
    bio: 'Assistant Professor in Computer Science & Engineering. Guiding undergraduate and postgraduate capstone initiatives, research cohorts, and peer reviews.',
    skills: ['AI/ML', 'Computer Vision', 'Edge Systems', 'Academic Peer Review']
  },
  HOD: {
    id: 'hod-001',
    email: 'hod@demo.com',
    fullName: 'Dr. Rajesh Mehta',
    role: 'HOD',
    institution: 'Graphic Era Hill University',
    department: 'Computer Science & Engineering',
    institution_id: 'inst-gehu',
    department_id: 'dept-gehu-cse',
    institutionId: 'inst-gehu',
    departmentId: 'dept-gehu-cse',
    facultyId: 'HOD-CSE-001',
    designation: 'Professor & Head of Department',
    departmentToken: 'GEHU-HOD-CSE-2025',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    verifiedStatus: 'Verified',
    verificationSignals: {
      emailVerified: true,
      institutionalDomain: true,
      idProofVerified: true,
      nodeApproval: true
    },
    projectsCount: 86,
    bio: 'Head of Computer Science. Overseeing department capstones, verification seals, institutional compliance, and faculty guidance.',
    skills: ['Curriculum Design', 'Academic Governance', 'Accreditation', 'Capstone Verification']
  },
  INSTITUTION: {
    id: 'usr-inst-01',
    email: 'registrar@gehu.ac.in',
    fullName: 'Graphic Era Registrar Node',
    role: 'INSTITUTION',
    institution: 'Graphic Era Hill University',
    department: 'Institutional Academic Council',
    institution_id: 'inst-gehu',
    institutionId: 'inst-gehu',
    avatar: 'https://images.unsplash.com/photo-1562774053-701939374585?w=150&auto=format&fit=crop&q=80',
    verifiedStatus: 'Verified',
    verificationSignals: {
      emailVerified: true,
      institutionalDomain: true,
      idProofVerified: true,
      nodeApproval: true
    },
    projectsCount: 240,
    bio: 'Certified institutional node managing capstone registries and accredited project lineages.',
    skills: ['Accreditation', 'Ecosystem Governance', 'Cross-Node Federated Consensus']
  },
  ADMIN: {
    id: 'admin-001',
    email: 'admin@demo.com',
    fullName: 'ProjectVerse Admin',
    role: 'ADMIN',
    institution: 'ProjectVerse Open Federation',
    department: 'Federated Infrastructure Office',
    facultyId: 'ROOT-ADMIN-01',
    designation: 'Platform Governance & System Administrator',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    verifiedStatus: 'Verified',
    verificationSignals: {
      emailVerified: true,
      institutionalDomain: true,
      idProofVerified: true,
      nodeApproval: true
    },
    projectsCount: 1426,
    bio: 'Lead Root Administrator for ProjectVerse Open Ecosystem ledger, telemetry, verification pipelines, and platform management.',
    skills: ['Network Administration', 'Ledger Governance', 'Platform Security', 'Node Consensus']
  }
};

interface AuthAppViewProps {
  initialRole: UserRole;
  initialTab?: string;
  onLogout: () => void;
  onOpenProjectDetail: (project: ProjectItem) => void;
  onOpenBuildProject: () => void;
  onOpenJoinProject: (project: ProjectItem) => void;
  onOpenProofOfWork: () => void;
}

export const AuthAppView: React.FC<AuthAppViewProps> = ({
  initialRole,
  initialTab,
  onLogout,
  onOpenProjectDetail,
  onOpenBuildProject,
  onOpenJoinProject,
  onOpenProofOfWork
}) => {
  const [activeRole, setActiveRole] = useState<UserRole>(initialRole);
  const [activeTab, setActiveTab] = useState<string>(initialTab || 'dashboard');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<ProjectDomain>('All');
  
  // Current authenticated profile
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  // Faculty review simulation state
  const [reviewingProject, setReviewingProject] = useState<ProjectItem | null>(null);
  const [reviewModalTab, setReviewModalTab] = useState<'rubric' | 'feedback'>('rubric');
  const [facultyFeedbackText, setFacultyFeedbackText] = useState('');
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);
  const [projectFeedbacks, setProjectFeedbacks] = useState<ProjectFeedback[]>([]);

  // Notifications state
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [viewingFeedbackDetail, setViewingFeedbackDetail] = useState<{
    notif: StudentNotification;
    project?: ProjectItem;
    feedbackMessage: string;
    facultyName: string;
  } | null>(null);

  const [rubricScores, setRubricScores] = useState({
    novelty: 9.5,
    technicalRigor: 9.4,
    documentation: 9.2,
    continuityPotential: 9.8
  });
  const [reviewFeedback, setReviewFeedback] = useState('Outstanding edge computing architecture and modular ROS 2 implementation. Validated for next-batch continuation.');
  const [verifiedList, setVerifiedList] = useState<string[]>(['proj-1', 'proj-2', 'proj-3']);
  const [approvalToast, setApprovalToast] = useState<string | null>(null);

  // Sync active role and profile data on load
  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      const resolved = resolveProfileWithPrivacy(session.token, 'me');
      if (resolved.success && resolved.profile) {
        setCurrentProfile(resolved.profile);
        setActiveRole(resolved.profile.role);
        return;
      }
      if (session.user) {
        setCurrentProfile(session.user);
        setActiveRole(session.user.role);
        return;
      }
    }

    // Also check active session from sessionService as fallback
    try {
      const stored = localStorage.getItem('pv_auth_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.user) {
          setCurrentProfile(parsed.user);
          setActiveRole(parsed.role || initialRole);
          return;
        }
      }
    } catch {
      // ignore
    }

    setCurrentProfile(FALLBACK_PROFILES[initialRole]);
    setActiveRole(initialRole);
  }, [initialRole]);

  // Ecosystem Projects Repository State
  const [allProjects, setAllProjects] = useState<ProjectItem[]>(() => projectService.getAllSync());
  const [activeHandoverProject, setActiveHandoverProject] = useState<ProjectItem>(() => {
    const syncProjects = projectService.getAllSync();
    return syncProjects.find(p => p.id === 'proj-nav') || syncProjects[0] || SMART_CAMPUS_NAV_PROJECT;
  });

  const handleContinueProject = async (p: ProjectItem) => {
    const studentName = currentProfile?.fullName || 'Suraj Rawat';
    const updated = await projectService.continueProject(p.id, studentName);
    if (updated) {
      setAllProjects(prev => prev.map(item => item.id === updated.id ? updated : item));
      setSelectedPassportProject(updated);
      setActiveHandoverProject(updated);
      setApprovalToast(`Congratulations! You have inherited ${p.title}. Project v2 active lineage recorded!`);
      setTimeout(() => setApprovalToast(null), 4000);
    }
  };

  const handleDemoStepSelect = (step: DemoStep) => {
    const navProj = allProjects.find(p => p.id === 'proj-nav') || SMART_CAMPUS_NAV_PROJECT;
    if (step.id === 1) {
      setActiveTab('directory');
    } else if (step.id === 2) {
      setSelectedPassportProject(navProj);
    } else if (step.id === 3) {
      setSelectedPassportProject(navProj);
    } else if (step.id === 4) {
      setSelectedPassportProject(navProj);
    } else if (step.id === 5) {
      setActiveTab('proof-of-work');
    } else if (step.id === 6) {
      setActiveTab('lineage');
    } else if (step.id === 7) {
      setActiveTab('continuity');
    } else if (step.id === 8) {
      setActiveHandoverProject(navProj);
      setActiveTab('handover');
    } else if (step.id === 9) {
      setActiveTab('matching');
    } else if (step.id === 10) {
      handleContinueProject(navProj);
    } else if (step.id === 11) {
      setActiveTab('lineage');
    } else if (step.id === 12) {
      setActiveTab('proof-of-work');
    }
  };

  // Filter projects for discovery tab
  const filteredProjects = allProjects.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.institution.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDomain = selectedDomain === 'All' || p.domain === selectedDomain;
    return matchSearch && matchDomain;
  });

  // Document upload modal state for Student
  const [isDocUploadModalOpen, setIsDocUploadModalOpen] = useState(false);
  const [pendingUploadDoc, setPendingUploadDoc] = useState<{ 
    documentType: DocumentType; 
    fileName: string; 
    fileSize: string; 
    rawFile?: File; 
  } | null>(null);
  const [isSubmittingDoc, setIsSubmittingDoc] = useState(false);
  const [docUploadError, setDocUploadError] = useState<string | null>(null);

  // New Modal and Feature states for ProjectVerse
  const [activeDashboardProject, setActiveDashboardProject] = useState<ProjectItem | null>(null);
  const [selectedPassportProject, setSelectedPassportProject] = useState<ProjectItem | null>(null);
  const [collaboratingProject, setCollaboratingProject] = useState<ProjectItem | null>(null);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);

  const handleOpenProjectModal = (p: ProjectItem) => {
    recordProjectView(p);
    setActiveDashboardProject(p);
  };

  const handleOpenPassportModal = (p: ProjectItem) => {
    recordProjectView(p);
    setSelectedPassportProject(p);
  };

  const handleOpenCollaborateModal = (p: ProjectItem) => {
    setCollaboratingProject(p);
  };

  // Keyboard shortcut Cmd+K / Ctrl+K for Global Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Role navigation tabs configuration strictly matching Section 24
  const roleTabs: Record<UserRole, { id: string; label: string; icon: any }[]> = {
    STUDENT: [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
      { id: 'directory', label: 'Explore Projects', icon: Compass },
      { id: 'continuity', label: 'Recovery Center', icon: AlertTriangle },
      { id: 'my-projects', label: 'My Projects', icon: FolderGit2 },
      { id: 'lineage', label: 'Project Lineage', icon: GitBranch },
      { id: 'handover', label: 'Project Handover', icon: FolderSync },
      { id: 'matching', label: 'Smart Matching', icon: Sparkles },
      { id: 'knowledge-graph', label: 'Knowledge Graph', icon: Network },
      { id: 'proof-of-work', label: 'Proof of Work', icon: Award },
      { id: 'collaboration', label: 'Collaboration', icon: Users },
      { id: 'mentors', label: 'Mentorship', icon: BookOpen },
      { id: 'profile', label: 'Profile', icon: UserCheck },
      { id: 'settings', label: 'Settings', icon: Settings }
    ],
    ALUMNI: [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
      { id: 'directory', label: 'Explore Projects', icon: Compass },
      { id: 'continuity', label: 'Recovery Center', icon: AlertTriangle },
      { id: 'my-projects', label: 'Projects', icon: FolderGit2 },
      { id: 'lineage', label: 'Project Lineage', icon: GitBranch },
      { id: 'handover', label: 'Project Handover', icon: FolderSync },
      { id: 'mentorship', label: 'Mentorship', icon: Users },
      { id: 'proof-of-work', label: 'Proof of Work', icon: Award },
      { id: 'profile', label: 'Profile', icon: UserCheck },
      { id: 'settings', label: 'Settings', icon: Settings }
    ],
    DEVELOPER: [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
      { id: 'directory', label: 'Explore Projects', icon: Compass },
      { id: 'continuity', label: 'Recovery Center', icon: AlertTriangle },
      { id: 'my-projects', label: 'My Projects', icon: FolderGit2 },
      { id: 'lineage', label: 'Project Lineage', icon: GitBranch },
      { id: 'matching', label: 'Smart Matching', icon: Sparkles },
      { id: 'knowledge-graph', label: 'Knowledge Graph', icon: Network },
      { id: 'contributions', label: 'Contributions', icon: Code2 },
      { id: 'proof-of-work', label: 'Proof of Work', icon: Award },
      { id: 'profile', label: 'Profile', icon: UserCheck },
      { id: 'settings', label: 'Settings', icon: Settings }
    ],
    RESEARCHER: [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
      { id: 'directory', label: 'Explore Research', icon: Compass },
      { id: 'continuity', label: 'Recovery Center', icon: AlertTriangle },
      { id: 'my-projects', label: 'Research Projects', icon: FolderGit2 },
      { id: 'lineage', label: 'Project Lineage', icon: GitBranch },
      { id: 'matching', label: 'Smart Matching', icon: Sparkles },
      { id: 'reviews', label: 'Reviews', icon: ShieldCheck },
      { id: 'mentorship', label: 'Mentorship', icon: Users },
      { id: 'profile', label: 'Profile', icon: UserCheck },
      { id: 'settings', label: 'Settings', icon: Settings }
    ],
    FACULTY: [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
      { id: 'directory', label: 'Explore Projects', icon: Compass },
      { id: 'reviews', label: 'Review Room', icon: ShieldCheck },
      { id: 'continuity', label: 'Recovery Center', icon: AlertTriangle },
      { id: 'verification', label: 'Verification', icon: FileCheck2 },
      { id: 'students', label: 'Students', icon: Users },
      { id: 'mentorship', label: 'Mentorship', icon: BookOpen },
      { id: 'profile', label: 'Profile', icon: UserCheck },
      { id: 'settings', label: 'Settings', icon: Settings }
    ],
    HOD: [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
      { id: 'students', label: 'Students', icon: Users },
      { id: 'faculty', label: 'Faculty', icon: UserCheck },
      { id: 'department-projects', label: 'Department Projects', icon: FolderGit2 },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'profile', label: 'Profile', icon: UserCheck }
    ],
    INSTITUTION: [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
      { id: 'students', label: 'Students', icon: Users },
      { id: 'faculty', label: 'Faculty', icon: UserCheck },
      { id: 'hods', label: 'HODs', icon: GraduationCap },
      { id: 'departments', label: 'Departments', icon: Layers },
      { id: 'institution-projects', label: 'Institution Projects', icon: FolderGit2 },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'profile', label: 'Profile', icon: UserCheck }
    ],
    INDUSTRY_PROFESSIONAL: [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
      { id: 'directory', label: 'Discover Projects', icon: Compass },
      { id: 'my-projects', label: 'Industry Projects', icon: FolderGit2 },
      { id: 'challenges', label: 'Challenges', icon: Award },
      { id: 'reviews', label: 'Expert Reviews', icon: ShieldCheck },
      { id: 'mentorship', label: 'Mentorship', icon: Users },
      { id: 'collaboration', label: 'Collaboration', icon: Sparkles },
      { id: 'profile', label: 'Profile', icon: UserCheck },
      { id: 'settings', label: 'Settings', icon: Settings }
    ],
    ADMIN: [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
      { id: 'directory', label: 'Explore Projects', icon: Compass },
      { id: 'users', label: 'Users', icon: Users },
      { id: 'projects', label: 'Projects', icon: FolderGit2 },
      { id: 'verification-queue', label: 'Verification Queue', icon: FileCheck2 },
      { id: 'system', label: 'System', icon: Cpu },
      { id: 'profile', label: 'Profile', icon: UserCheck },
      { id: 'settings', label: 'Settings', icon: Settings }
    ]
  };

  const currentTabs = roleTabs[activeRole] || roleTabs.STUDENT;

  // Real, role-specific demo data tailored to current profile
  const studentDemoData = getRoleDemoData('STUDENT', currentProfile) as StudentDemoData;
  const facultyDemoData = getRoleDemoData('FACULTY', currentProfile) as FacultyDemoData;
  const hodDemoData = getRoleDemoData('HOD', currentProfile) as HODDemoData;
  const adminDemoData = getRoleDemoData('ADMIN', currentProfile) as AdminDemoData;

  const handleSignVerification = (projectId: string) => {
    if (!verifiedList.includes(projectId)) {
      setVerifiedList([...verifiedList, projectId]);
    }
    setReviewingProject(null);
    setApprovalToast(`Academic Verification and Cryptographic Passport Seal published for ${projectId}!`);
    setTimeout(() => setApprovalToast(null), 4000);
  };

  const loadNotifications = () => {
    setIsLoadingNotifications(true);
    try {
      const studentId = currentProfile?.id || 'usr-student-01';
      const notifs = getNotificationsForStudent(studentId);
      setNotifications(notifs);
    } catch {
      // ignore
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [activeRole, activeTab, currentProfile?.id]);

  useEffect(() => {
    if (reviewingProject) {
      const fbs = getFeedbacksForProject(reviewingProject.id);
      setProjectFeedbacks(fbs);
      setFacultyFeedbackText('');
      setFeedbackError(null);
      setFeedbackSuccess(null);
    }
  }, [reviewingProject]);

  const handleSubmitFeedback = () => {
    if (!reviewingProject) return;

    const trimmed = facultyFeedbackText.trim();
    if (!trimmed) {
      setFeedbackError('Feedback cannot be empty.');
      return;
    }

    if (trimmed.length > 2000) {
      setFeedbackError('Feedback cannot exceed 2000 characters.');
      return;
    }

    setFeedbackError(null);
    setFeedbackSuccess(null);

    const studentId = (reviewingProject as any).studentId || 'usr-student-01';
    const facultyId = currentProfile?.id || 'usr-faculty-01';
    const facultyName = currentProfile?.fullName || 'Dr. Anil Sharma';

    const res = submitProjectFeedbackFrontend({
      projectId: reviewingProject.id,
      projectTitle: reviewingProject.title,
      studentId,
      facultyId,
      facultyName,
      facultyDesignation: currentProfile?.designation || 'Associate Professor & Research Advisor',
      facultyAvatar: currentProfile?.avatar,
      message: trimmed
    });

    if (!res.success) {
      setFeedbackError(res.error || 'Failed to submit feedback.');
      return;
    }

    setFeedbackSuccess('Feedback submitted successfully.');
    setFacultyFeedbackText('');
    if (res.feedback) {
      setProjectFeedbacks((prev) => [res.feedback!, ...prev]);
    }
    setApprovalToast(`Feedback submitted for ${reviewingProject.title}`);
    setTimeout(() => setApprovalToast(null), 4000);
    loadNotifications();
  };

  const handleViewFeedback = (notif: StudentNotification) => {
    if (!notif.read) {
      markNotificationAsReadFrontend(notif.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
      );
    }

    const matchedProject = SAMPLE_PROJECTS.find((p) => p.id === notif.projectId) || SAMPLE_PROJECTS[0];
    const storedFeedback = notif.feedbackId ? getFeedbackById(notif.feedbackId) : null;

    setViewingFeedbackDetail({
      notif: { ...notif, read: true },
      project: matchedProject,
      feedbackMessage: storedFeedback?.message || notif.feedbackMessage || notif.message,
      facultyName: storedFeedback?.facultyName || notif.facultyName || 'Dr. Anil Sharma'
    });
  };

  const formatTimeAgo = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
      if (diffSec < 60) return 'just now';
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
      return `${Math.floor(diffSec / 86400)}d ago`;
    } catch {
      return dateStr;
    }
  };

  const handleStudentDocumentSubmit = async () => {
    if (!pendingUploadDoc) return;
    setIsSubmittingDoc(true);
    setDocUploadError(null);

    const session = getCurrentSession();
    // Frontend-only MVP: Local document staging without network requests
    const storedDocId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    if (session) {
      const res = submitVerificationDocument(session.user.id, {
        documentType: pendingUploadDoc.documentType,
        documentFileName: pendingUploadDoc.fileName,
        documentFileSize: pendingUploadDoc.fileSize,
        documentId: storedDocId
      });
      if (res.success && res.updatedProfile) {
        setCurrentProfile(res.updatedProfile);
      }
    } else if (currentProfile) {
      setCurrentProfile({
        ...currentProfile,
        verifiedStatus: 'Pending',
        documentStatus: 'PENDING_REVIEW',
        documentType: pendingUploadDoc.documentType,
        documentName: pendingUploadDoc.fileName,
        documentSize: pendingUploadDoc.fileSize,
        documentId: storedDocId,
        documentSubmittedAt: 'Just now'
      });
    }

    setIsSubmittingDoc(false);
    setIsDocUploadModalOpen(false);
    setPendingUploadDoc(null);
    setDocUploadError(null);
    setApprovalToast('Academic document ready and submitted for verification (Pending Review).');
    setTimeout(() => setApprovalToast(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#111111] flex flex-col font-body">
      {/* Hackathon Interactive Story Tour Bar */}
      <HackathonDemoBar onStepSelect={handleDemoStepSelect} />

      {/* Top Application Workspace Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e5e5e5] px-4 sm:px-8 py-3 flex items-center justify-between shadow-2xs">
        {/* Brand & Application Links */}
        <div className="flex items-center gap-6 md:gap-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center focus:outline-none cursor-pointer"
            aria-label="ProjectVerse Home"
          >
            <ProjectVerseBrand
              theme="light"
              textSizeClassName="text-[24px] sm:text-[28px]"
              interactive={true}
            />
          </button>

          {/* Authenticated Primary Navigation Links strictly adaptive to role */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto max-w-xl">
            {currentTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`auth-top-nav-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#F2F2F0] text-[#111111] font-bold shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]'
                      : 'text-[#555555] hover:text-[#111111] hover:bg-[#F8F8F6]'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
            {canRoleSubmitProject(activeRole) && (
              <button
                id="auth-nav-submit-project"
                onClick={onOpenBuildProject}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-neutral-900 text-white hover:bg-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Submit</span>
              </button>
            )}
          </nav>
        </div>

        {/* Right Side: Search, Notifications, Profile Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Search Button */}
          <button
            id="navbar-global-search-btn"
            onClick={() => setIsGlobalSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F7F7F5] hover:bg-[#EBEBE8] border border-black/8 text-[#737373] hover:text-[#111111] transition-all cursor-pointer text-xs"
            title="Search projects, peers, tech... (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5 text-[#111111]" />
            <span className="hidden sm:inline text-xs text-[#4A4A4A]">Search...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-white text-[10px] font-mono-code text-[#737373] border border-black/10 shadow-2xs">
              ⌘K
            </kbd>
          </button>

          {/* Quick Submit Project CTA (Mobile/Compact - CREATOR ROLES ONLY) */}
          {canRoleSubmitProject(activeRole) && (
            <button
              id="auth-nav-quick-submit"
              onClick={onOpenBuildProject}
              className="lg:hidden p-2 rounded-xl bg-[#111111] text-white hover:bg-black transition-colors cursor-pointer"
              title="Submit Project"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
          )}

          {/* Notification Bell with Dropdown */}
          <div className="relative">
            <button
              id="navbar-notifications-bell-btn"
              onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
              className="relative p-2 rounded-xl bg-[#F7F7F5] hover:bg-[#EBEBE8] border border-black/8 text-[#111111] transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {notifications.filter((n) => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-amber-500 text-white font-mono-code font-bold text-[10px] flex items-center justify-center px-1 shadow-xs">
                  {notifications.filter((n) => !n.read).length}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            <NotificationDropdown
              isOpen={isNotificationDropdownOpen}
              onClose={() => setIsNotificationDropdownOpen(false)}
              notifications={notifications}
              onMarkAsRead={(id) => {
                markNotificationAsRead(id);
                loadNotifications();
              }}
              onMarkAllAsRead={() => {
                markAllNotificationsAsRead();
                loadNotifications();
              }}
              onDeleteNotification={(id) => {
                deleteNotification(id);
                loadNotifications();
              }}
              onViewNotificationDetail={(notif) => {
                setIsNotificationDropdownOpen(false);
                handleViewFeedback(notif);
              }}
              onViewAllNotifications={() => {
                setIsNotificationDropdownOpen(false);
                setActiveTab('notifications');
              }}
            />
          </div>

          {/* Authenticated User Identity: [ROLE] [Avatar] User Name [Sign Out] */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="relative">
              <button
                id="auth-nav-profile-btn"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-[#F7F7F5] hover:bg-[#EBEBE8] border border-black/8 transition-colors cursor-pointer"
                aria-label="User Profile Menu"
                aria-expanded={isProfileDropdownOpen}
              >
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold tracking-wider uppercase bg-[#111111] text-white">
                  {activeRole}
                </span>
                <img
                  src={currentProfile?.avatar || getInitialsAvatar(currentProfile?.fullName || 'User', activeRole)}
                  alt={currentProfile?.fullName || 'User'}
                  className="w-6 h-6 rounded-full object-cover border border-black/10"
                />
                <span className="text-xs font-semibold text-[#111111] max-w-[130px] truncate hidden sm:inline">
                  {currentProfile?.fullName || 'User'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#737373] transition-transform duration-150 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Menu */}
              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-24px)] bg-white rounded-2xl border border-black/[0.09] shadow-xl py-2 z-50 overflow-hidden"
                    >
                      {/* User Identity Header */}
                      <div className="px-4 py-3 border-b border-black/[0.06] bg-[#FBFBFA]">
                        <p className="text-[13px] font-bold text-[#111111] truncate">
                          {currentProfile?.fullName || 'User'}
                        </p>
                        <p className="text-[11px] text-[#666666] truncate font-mono-code mt-0.5">
                          {currentProfile?.email || 'user@projectverse.dev'}
                        </p>
                        <div className="mt-2.5">
                          <RoleBadge role={activeRole} size="sm" />
                        </div>
                      </div>

                      {/* Navigation Items */}
                      <div className="py-1">
                        <button
                          id="profile-dropdown-profile"
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            setActiveTab('profile');
                          }}
                          className="w-full px-4 py-2.5 text-left text-xs font-medium text-[#222222] hover:bg-[#F5F5F3] flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <UserCheck className="w-4 h-4 text-[#666666]" />
                          <span>Profile</span>
                        </button>

                        <button
                          id="profile-dropdown-settings"
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            setActiveTab('settings');
                          }}
                          className="w-full px-4 py-2.5 text-left text-xs font-medium text-[#222222] hover:bg-[#F5F5F3] flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <Settings className="w-4 h-4 text-[#666666]" />
                          <span>Settings</span>
                        </button>
                      </div>

                      {/* Divider & Sign Out */}
                      <div className="border-t border-black/[0.06] pt-1 mt-1">
                        <button
                          id="profile-dropdown-sign-out"
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            onLogout();
                          }}
                          className="w-full px-4 py-2.5 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-rose-600" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Direct Sign Out Button */}
            <button
              id="auth-header-direct-sign-out"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-neutral-700 hover:text-rose-600 hover:bg-rose-50 border border-black/8 hover:border-rose-200 transition-all cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Grid: Sidebar + Canvas */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-[#FBFBFA] border-b md:border-b-0 md:border-r border-black/8 p-3 sm:p-4 shrink-0">
          <div className="mb-3 px-3 py-2 rounded-xl bg-white border border-black/8 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-mono-code text-[#737373] uppercase">Identity Role</p>
              <p className="text-xs font-medium text-[#111111]">{activeRole} Workspace</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
            {currentTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#111111] text-white shadow-xs font-medium'
                      : 'text-[#4A4A4A] hover:text-[#111111] hover:bg-[#F0F0EE] border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#737373]'}`} />
                  <span className="whitespace-nowrap">{tab.label}</span>
                  {tab.id === 'notifications' && notifications.filter((n) => !n.read).length > 0 && (
                    <span className={`ml-auto text-[10px] font-mono-code px-1.5 py-0.2 rounded-full font-medium ${
                      isActive ? 'bg-white text-black' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {notifications.filter((n) => !n.read).length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Workspace Canvas Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto bg-white">
          {/* Toast Notification if any */}
          {approvalToast && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2.5 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">{approvalToast}</span>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* ========================================================================= */}
          {/* STUDENT & BUILDER ROLES VIEWS (Student, Alumni, Developer, Researcher, Industry, Institution) */}
          {/* ========================================================================= */}
          {(activeRole === 'STUDENT' || activeRole === 'ALUMNI' || activeRole === 'DEVELOPER' || activeRole === 'RESEARCHER' || activeRole === 'INDUSTRY_PROFESSIONAL' || activeRole === 'INSTITUTION') && (
            <div>
              {activeTab === 'dashboard' && (
                <StudentDashboardView
                  data={studentDemoData}
                  onSelectProject={handleOpenProjectModal}
                  onSubmitNewProject={onOpenBuildProject}
                  onOpenPassport={(passportId) => {
                    const p = SAMPLE_PROJECTS.find(x => x.passport?.passportId === passportId || x.passportId === passportId) || SAMPLE_PROJECTS[0];
                    handleOpenPassportModal(p);
                  }}
                />
              )}

              {/* Discover / Directory Projects Tab */}
              {(activeTab === 'directory' || activeTab === 'discover' || activeTab === 'explore' || activeTab === 'explore-projects') && (
                <div className="space-y-6">
                  <AdvancedProjectDiscovery
                    projects={SAMPLE_PROJECTS}
                    onSelectProject={handleOpenProjectModal}
                    onOpenPassport={handleOpenPassportModal}
                    onOpenCollaborate={handleOpenCollaborateModal}
                    currentRole={activeRole}
                  />
                </div>
              )}

              {/* Explorer / AI Matches Tab */}
              {(activeTab === 'explorer' || activeTab === 'ai-matches') && (
                <div className="space-y-6">
                  <AIMatchingDashboard
                    onSelectProject={handleOpenProjectModal}
                    onOpenPassport={handleOpenPassportModal}
                  />
                </div>
              )}

              {/* My Projects */}
              {activeTab === 'my-projects' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="font-display text-2xl text-[#111111] font-normal">My Academic Projects</h2>
                      <p className="text-xs text-[#4A4A4A]">Repositories you are currently leading or contributing to.</p>
                    </div>
                    <button
                      onClick={onOpenBuildProject}
                      className="btn-primary-black px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Submit New Project</span>
                    </button>
                  </div>

                  {studentDemoData.projects.length === 0 ? (
                    <EmptyState
                      title="No Projects Registered Yet"
                      description="You haven't submitted any projects. Submit your first capstone or repository to generate a verifiable Academic Passport."
                      actionLabel="Submit First Project"
                      onAction={onOpenBuildProject}
                      icon={FolderGit2}
                    />
                  ) : (
                    <div className="space-y-4">
                      {studentDemoData.projects.map((p) => {
                        const sampleMatch = SAMPLE_PROJECTS.find(sp => sp.id === p.id) || SAMPLE_PROJECTS[0];
                        return (
                          <div key={p.id} className="bg-white rounded-2xl p-6 border border-black/8 shadow-xs hover:border-black/20 transition-all">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono-code text-[#737373] uppercase font-medium">{p.passportId}</span>
                                  <span className={`text-[10px] font-mono-code px-2 py-0.5 rounded-full font-medium ${
                                    p.verificationStatus === 'Verified'
                                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                                  }`}>
                                    {p.verificationStatus}
                                  </span>
                                </div>
                                <h3 className="text-lg font-bold text-[#111111] mt-1">{p.title}</h3>
                                <p className="text-xs text-[#4A4A4A] mt-0.5">{p.description}</p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  onClick={() => handleOpenProjectModal(sampleMatch)}
                                  className="px-3.5 py-1.5 rounded-xl bg-[#F7F7F5] hover:bg-[#EBEBE8] border border-black/8 text-xs text-[#111111] font-medium cursor-pointer"
                                >
                                  View Details
                                </button>
                                <button
                                  onClick={() => handleOpenPassportModal(sampleMatch)}
                                  className="btn-primary-black px-3.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer"
                                >
                                  Passport
                                </button>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {p.techStack.map((tech) => (
                                <span key={tech} className="px-2.5 py-0.5 bg-[#F5F5F3] text-[#333333] text-[11px] font-mono-code rounded-md border border-black/5">
                                  {tech}
                                </span>
                              ))}
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono-code text-[#737373] pt-3 border-t border-black/8">
                              <div>Stars: <span className="text-[#111111] font-medium">{p.stars}</span></div>
                              <div>Commits: <span className="text-[#111111] font-medium">{p.commits}</span></div>
                              <div>Faculty Guide: <span className="text-[#111111] font-medium">{p.facultyGuide}</span></div>
                              <div>Last Update: <span className="text-[#111111] font-medium">{p.lastUpdated}</span></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Student Profile Tab */}
              {activeTab === 'profile' && (
                <RoleProfileView
                  role="STUDENT"
                  profile={currentProfile || studentDemoData.profile}
                  onEditProfile={() => setActiveTab('settings')}
                />
              )}

              {/* Student Settings Tab */}
              {activeTab === 'settings' && (
                <RoleSettingsView
                  role="STUDENT"
                  profile={currentProfile || studentDemoData.profile}
                  onSave={() => {
                    setApprovalToast('Profile settings saved successfully!');
                    setTimeout(() => setApprovalToast(null), 3000);
                  }}
                />
              )}

              {/* Mentors Directory */}
              {activeTab === 'mentors' && (
                <div className="space-y-4">
                  <h2 className="font-display text-2xl text-[#111111] font-normal">Institutional Mentors Directory</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {SAMPLE_MENTORS.map((m, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-5 border border-black/8 flex items-start gap-4 shadow-xs">
                        <img src={m.avatar} alt={m.name} className="w-12 h-12 rounded-xl object-cover border border-black/10" />
                        <div>
                          <h3 className="text-base font-bold text-[#111111]">{m.name}</h3>
                          <p className="text-xs text-[#4A4A4A]">{m.title}</p>
                          <p className="text-xs text-[#737373] font-mono-code mt-0.5">{m.institution}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {m.domains.map((d) => (
                              <span key={d} className="text-[10px] px-2 py-0.5 rounded bg-[#F7F7F5] border border-black/5 text-[#4A4A4A]">
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Collaboration Hub */}
              {activeTab === 'collaboration' && (
                <div className="space-y-4">
                  <CollaborationRequestsView
                    currentUserId={currentProfile?.id}
                    onOpenProject={(id) => {
                      const p = SAMPLE_PROJECTS.find(x => x.id === id);
                      if (p) handleOpenProjectModal(p);
                    }}
                  />
                </div>
              )}

              {/* Project Passport Tab */}
              {activeTab === 'passport' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="font-display text-2xl text-[#111111] font-normal">Project Passport Ledger</h2>
                      <p className="text-xs text-[#4A4A4A]">Immutable institutional record of identity, credentials, evidence, health, and lineage.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={activeHandoverProject.id}
                        onChange={(e) => {
                          const found = allProjects.find(p => p.id === e.target.value);
                          if (found) setActiveHandoverProject(found);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white border border-black/10 text-xs font-medium text-[#111111] cursor-pointer"
                      >
                        {allProjects.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.title} ({p.passportId || 'PV-ID'})
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleOpenPassportModal(activeHandoverProject)}
                        className="btn-primary-black px-4 py-2 rounded-xl text-xs font-medium cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                      >
                        <FileCheck2 className="w-3.5 h-3.5" />
                        <span>Inspect Full Passport</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <div className="rounded-3xl bg-white border border-black/10 p-6 shadow-xs space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-black/8">
                          <span className="font-mono-code text-xs text-[#737373]">
                            PASSPORT_ID: <strong className="text-[#111111]">{activeHandoverProject.passportId || 'PV-2026-00124'}</strong>
                          </span>
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {activeHandoverProject.status}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-[#111111]">{activeHandoverProject.title}</h3>
                        <p className="text-xs text-[#4A4A4A] leading-relaxed">{activeHandoverProject.description}</p>
                        
                        <div className="flex flex-wrap gap-2 pt-2">
                          {activeHandoverProject.techStack.map(t => (
                            <span key={t} className="px-2.5 py-1 rounded-lg bg-[#F5F5F3] border border-black/6 text-xs font-mono-code">
                              {t}
                            </span>
                          ))}
                        </div>

                        <div className="pt-4 border-t border-black/8 flex gap-3">
                          <button
                            onClick={() => handleOpenPassportModal(activeHandoverProject)}
                            className="btn-primary-black px-4 py-2 rounded-xl text-xs font-medium cursor-pointer"
                          >
                            Open Passport Modal (with QR & Print)
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab('handover');
                            }}
                            className="px-4 py-2 rounded-xl bg-[#F5F5F3] hover:bg-[#EBEBE8] border border-black/8 text-xs font-medium text-[#111111] cursor-pointer"
                          >
                            View Handover Package
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <ProjectHealthCard 
                        health={activeHandoverProject.health || {
                          score: 82,
                          status: 'ACTIVE',
                          repoActivityScore: 85,
                          contributorActivityScore: 80,
                          documentationCompleteness: 90,
                          openTasksCount: 2,
                          deploymentStatus: 'DEPLOYED',
                          reviewStatus: 'VERIFIED',
                          positiveSignals: ['Active repository commits', '2 verified contributors'],
                          warningSignals: ['Upcoming batch milestone due']
                        }} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Project Lineage Tab */}
              {activeTab === 'lineage' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="font-display text-2xl text-[#111111] font-normal">Generational Project Lineage</h2>
                      <p className="text-xs text-[#4A4A4A]">Multi-batch evolution timeline preserving past contributions, architectural decisions, and version milestones.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-[#737373] hidden sm:inline">Active Project:</label>
                      <select
                        value={activeHandoverProject.id}
                        onChange={(e) => {
                          const found = allProjects.find(p => p.id === e.target.value);
                          if (found) setActiveHandoverProject(found);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white border border-black/10 text-xs font-medium text-[#111111] cursor-pointer"
                      >
                        {allProjects.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <ProjectLineageView 
                    project={activeHandoverProject} 
                    onContinueProject={handleContinueProject} 
                  />
                </div>
              )}

              {/* Project Handover System */}
              {activeTab === 'handover' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="font-display text-2xl text-[#111111] font-normal">Inter-Cohort Handover System</h2>
                      <p className="text-xs text-[#4A4A4A]">
                        Outgoing teams document architecture, setup, known bugs, ADRs, and roadmap so incoming cohorts can immediately continue.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-[#737373] hidden sm:inline">Project:</label>
                      <select
                        value={activeHandoverProject.id}
                        onChange={(e) => {
                          const found = allProjects.find(p => p.id === e.target.value);
                          if (found) setActiveHandoverProject(found);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white border border-black/10 text-xs font-medium text-[#111111] cursor-pointer"
                      >
                        {allProjects.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <ProjectHandoverView 
                    handover={activeHandoverProject.handover || buildHandoverPackage(activeHandoverProject)} 
                    project={activeHandoverProject}
                    onAcceptHandover={() => handleContinueProject(activeHandoverProject)}
                  />
                </div>
              )}

              {/* Project Continuity Center & Recovery Center */}
              {activeTab === 'continuity' && (
                <div className="space-y-6">
                  <ProjectContinuityCenter
                    projects={allProjects}
                    onSelectProject={handleOpenProjectModal}
                    onOpenPassport={handleOpenPassportModal}
                    onContinueProject={handleContinueProject}
                    onOpenHandover={(p) => {
                      setActiveHandoverProject(p);
                      setActiveTab('handover');
                    }}
                    onFindContributors={() => setActiveTab('matching')}
                    onFindMentor={() => setActiveTab('mentors')}
                  />
                </div>
              )}

              {/* Smart Matching Engine */}
              {activeTab === 'matching' && (
                <div className="space-y-6">
                  <ExplainableMatchingView 
                    projects={allProjects}
                    currentUserProfile={currentProfile}
                    onSelectProject={handleOpenProjectModal}
                    onConnectCandidate={(candidate, proj) => {
                      setApprovalToast(`Match notification dispatched to ${candidate} for ${proj}!`);
                      setTimeout(() => setApprovalToast(null), 3500);
                    }}
                  />
                </div>
              )}

              {/* Knowledge Graph Tab */}
              {activeTab === 'knowledge-graph' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="font-display text-2xl text-[#111111] font-normal">Project Ecosystem Knowledge Graph</h2>
                      <p className="text-xs text-[#4A4A4A]">Explore semantic linkages across projects, skills, mentors, institutions, and cohorts.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={activeHandoverProject.id}
                        onChange={(e) => {
                          const found = allProjects.find(p => p.id === e.target.value);
                          if (found) setActiveHandoverProject(found);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white border border-black/10 text-xs font-medium text-[#111111] cursor-pointer"
                      >
                        {allProjects.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <ProjectKnowledgeGraph project={activeHandoverProject} />
                </div>
              )}

              {/* Proof-of-Work Tab */}
              {activeTab === 'proof-of-work' && (
                <div className="space-y-6">
                  <ProofOfWorkView
                    userProfile={currentProfile || studentDemoData.profile}
                    onOpenProject={(id) => {
                      const p = allProjects.find(x => x.id === id || x.passportId === id) || allProjects[0];
                      handleOpenProjectModal(p);
                    }}
                  />
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  <NotificationCenterView
                    notifications={notifications}
                    onMarkAsRead={(id) => {
                      markNotificationAsRead(id);
                      loadNotifications();
                    }}
                    onMarkAllAsRead={() => {
                      markAllNotificationsAsRead();
                      loadNotifications();
                    }}
                    onDeleteNotification={(id) => {
                      deleteNotification(id);
                      loadNotifications();
                    }}
                    onSelectNotification={handleViewFeedback}
                  />
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* FACULTY ROLE VIEWS */}
          {/* ========================================================================= */}
          {activeRole === 'FACULTY' && (
            <div className="space-y-6">
              {/* Faculty Main Dashboard */}
              {activeTab === 'dashboard' && (
                <FacultyDashboardView
                  data={facultyDemoData}
                  onOpenReview={(projId) => {
                    const p = SAMPLE_PROJECTS.find(pr => pr.id === projId) || SAMPLE_PROJECTS[0];
                    setReviewingProject(p);
                    setReviewModalTab('rubric');
                  }}
                  onOpenProjectDetail={onOpenProjectDetail}
                />
              )}

              {/* Mentored Projects Tab */}
              {(activeTab === 'mentored-projects' || activeTab === 'projects') && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="font-display text-2xl text-[#111111] font-normal">Mentored Capstone Projects</h2>
                      <p className="text-xs text-[#4A4A4A]">Active undergraduate and postgraduate engineering repositories under your academic guidance.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono-code font-medium">
                        {facultyDemoData.stats.projectsMentored} Advised Capstones
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {facultyDemoData.projectsUnderGuidance.map((p) => (
                      <div key={p.id} className="bg-white rounded-2xl p-5 border border-black/8 shadow-xs flex flex-col justify-between hover:border-black/20 transition-all">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[10px] font-mono-code text-[#737373] uppercase">{p.academicYear} • Batch {p.batch}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium font-mono-code ${
                              p.status === 'Verified' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                              p.status === 'In Review' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                              'bg-blue-50 text-blue-800 border border-blue-200'
                            }`}>
                              {p.status.toUpperCase()}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-[#111111]">{p.title}</h3>
                          <p className="text-xs text-[#4A4A4A] mt-1 font-mono-code">Lead: {p.studentLead}</p>
                          <p className="text-[11px] text-[#737373] mt-0.5">Team: {p.team.join(', ')}</p>

                          <div className="flex flex-wrap gap-1 mt-3">
                            {p.techStack.map((tech) => (
                              <span key={tech} className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#F7F7F5] border border-black/5 text-[#4A4A4A]">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 mt-4 border-t border-black/6">
                          <span className="text-[10px] text-[#737373] font-mono-code">Updated {p.lastUpdated}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                const sample = SAMPLE_PROJECTS.find(x => x.title.toLowerCase().includes(p.title.toLowerCase().slice(0, 5))) || SAMPLE_PROJECTS[0];
                                onOpenProjectDetail(sample);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-[#F7F7F5] hover:bg-[#EBEBE8] border border-black/8 text-xs text-[#111111] font-medium cursor-pointer"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => {
                                const sample = SAMPLE_PROJECTS.find(x => x.title.toLowerCase().includes(p.title.toLowerCase().slice(0, 5))) || SAMPLE_PROJECTS[0];
                                setReviewingProject(sample);
                                setReviewModalTab('rubric');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-[#111111] hover:bg-black text-xs font-medium text-white cursor-pointer shadow-xs"
                            >
                              Rubric Review
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews & Academic Verifications Tab */}
              {(activeTab === 'reviews' || activeTab === 'verification-queue') && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="font-display text-2xl text-[#111111] font-normal">Academic Evaluation & Review Queue</h2>
                      <p className="text-xs text-[#4A4A4A]">Evaluate capstone deliverables, rubric scores, and verify student academic identity proofs.</p>
                    </div>
                  </div>

                  {/* Student Identity Verifications Queue */}
                  <StudentVerificationManager reviewerRole="FACULTY" />

                  {/* Project Verification Deliverables Queue */}
                  <div className="space-y-4">
                    <h3 className="font-display text-lg text-[#111111] font-normal">Capstone Deliverables Awaiting Sign-Off</h3>
                    <div className="space-y-3">
                      {facultyDemoData.pendingReviews.map((rev) => (
                        <div key={rev.id} className="bg-white rounded-2xl p-5 border border-black/8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                                {rev.priority} PRIORITY
                              </span>
                              <span className="text-[11px] font-mono-code text-[#737373]">{rev.submittedAt}</span>
                            </div>
                            <h4 className="text-base font-bold text-[#111111] mt-1">{rev.projectTitle}</h4>
                            <p className="text-xs text-[#4A4A4A]">Lead: {rev.studentLead} • Milestone: <span className="font-medium text-[#111111]">{rev.milestone}</span></p>
                            <p className="text-[11px] text-[#737373] mt-1">Deliverables: {rev.deliverables}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => {
                                const sample = SAMPLE_PROJECTS.find(x => x.id === rev.projectId) || SAMPLE_PROJECTS[0];
                                setReviewingProject(sample);
                                setReviewModalTab('feedback');
                              }}
                              className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F5F5F3] border border-black/10 text-xs font-medium text-[#111111] flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-[#111111]" />
                              <span>Feedback</span>
                            </button>
                            <button
                              onClick={() => {
                                const sample = SAMPLE_PROJECTS.find(x => x.id === rev.projectId) || SAMPLE_PROJECTS[0];
                                setReviewingProject(sample);
                                setReviewModalTab('rubric');
                              }}
                              className="px-4 py-2 rounded-xl bg-[#111111] hover:bg-black text-xs font-medium text-white cursor-pointer shadow-xs"
                            >
                              Grade Rubric
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Deep Analytics Dashboard */}
                  <FacultyAnalyticsDashboard
                    projects={SAMPLE_PROJECTS}
                    onSelectProject={handleOpenProjectModal}
                  />
                </div>
              )}

              {/* Advised Students Tab */}
              {activeTab === 'students' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display text-2xl text-[#111111] font-normal">Advised Students & Research Scholars</h2>
                    <p className="text-xs text-[#4A4A4A]">Track academic milestones, capstone progress, and research deliverables for your advisees.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {facultyDemoData.studentsGuided.map((s) => (
                      <div key={s.id} className="bg-white rounded-2xl p-5 border border-black/8 shadow-xs flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <img src={s.avatar} alt={s.name} className="w-12 h-12 rounded-xl object-cover border border-black/10" />
                            <div>
                              <h4 className="text-sm font-bold text-[#111111]">{s.name}</h4>
                              <p className="text-[11px] text-[#737373] font-mono-code">{s.rollNumber}</p>
                              <span className="text-[10px] text-[#4A4A4A]">{s.course}</span>
                            </div>
                          </div>
                          <div className="p-3 rounded-xl bg-[#FBFBFA] border border-black/6 mb-3">
                            <span className="text-[10px] font-mono-code text-[#737373] uppercase block">Assigned Capstone</span>
                            <span className="text-xs font-medium text-[#111111] line-clamp-1 mt-0.5">{s.projectTitle}</span>
                          </div>
                          <div>
                            <div className="flex items-center justify-between text-[11px] mb-1">
                              <span className="text-[#737373]">Progress</span>
                              <span className="font-mono-code font-bold text-[#111111]">{s.progress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-[#EBEBE8] rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${s.progress}%` }} />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 mt-4 border-t border-black/6">
                          <span className={`text-[10px] font-mono-code px-2 py-0.5 rounded-full font-medium ${
                            s.status === 'Completed' ? 'bg-emerald-50 text-emerald-800' :
                            s.status === 'On Track' ? 'bg-blue-50 text-blue-800' :
                            'bg-amber-50 text-amber-800'
                          }`}>
                            {s.status}
                          </span>
                          <span className="text-[11px] text-[#737373] font-mono-code">{s.email}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Directory Tab for Faculty */}
              {(activeTab === 'directory' || activeTab === 'discover' || activeTab === 'explore') && (
                <div className="space-y-6">
                  <AdvancedProjectDiscovery
                    projects={SAMPLE_PROJECTS}
                    onSelectProject={handleOpenProjectModal}
                    onOpenPassport={handleOpenPassportModal}
                    onOpenCollaborate={handleOpenCollaborateModal}
                    currentRole={activeRole}
                  />
                </div>
              )}

              {/* Profile Tab for Faculty */}
              {activeTab === 'profile' && (
                <RoleProfileView
                  profile={currentProfile || FALLBACK_PROFILES.FACULTY}
                  role="FACULTY"
                  onEditProfile={() => {
                    setApprovalToast("Profile update mode enabled");
                    setTimeout(() => setApprovalToast(null), 3000);
                  }}
                />
              )}

              {/* Settings Tab for Faculty */}
              {activeTab === 'settings' && (
                <RoleSettingsView
                  role="FACULTY"
                  profile={currentProfile}
                />
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* HOD ROLE VIEWS */}
          {/* ========================================================================= */}
          {activeRole === 'HOD' && (
            <div className="space-y-6">
              {/* HOD Main Executive Dashboard */}
              {activeTab === 'dashboard' && (
                <HODDashboardView
                  data={hodDemoData}
                  onOpenProjectDetail={(p) => {
                    const pr = SAMPLE_PROJECTS.find(x => x.id === p.id) || SAMPLE_PROJECTS[0];
                    onOpenProjectDetail(pr);
                  }}
                  onApproveProject={(id) => {
                    setApprovalToast(`Project ${id} sign-off approved and registered on departmental ledger!`);
                    setTimeout(() => setApprovalToast(null), 4000);
                  }}
                />
              )}

              {/* Department Projects Tab */}
              {activeTab === 'department-projects' && (
                <div className="space-y-6">
                  <HODDepartmentDashboard
                    projects={SAMPLE_PROJECTS}
                    onSelectProject={handleOpenProjectModal}
                  />
                </div>
              )}

              {/* Explore Projects Tab for HOD */}
              {(activeTab === 'directory' || activeTab === 'discover' || activeTab === 'explore') && (
                <div className="space-y-6">
                  <AdvancedProjectDiscovery
                    projects={SAMPLE_PROJECTS}
                    onSelectProject={handleOpenProjectModal}
                    onOpenPassport={handleOpenPassportModal}
                    onOpenCollaborate={handleOpenCollaborateModal}
                    currentRole={activeRole}
                  />
                </div>
              )}

              {/* Approvals & Academic Sign-off Tab */}
              {(activeTab === 'approvals' || activeTab === 'student-verifications') && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="font-display text-2xl text-[#111111] font-normal">Departmental Approvals & Verification Sign-Offs</h2>
                      <p className="text-xs text-[#4A4A4A]">Executive accreditation sign-offs, faculty-verified capstones, and academic student credentials.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono-code font-medium">
                        {hodDemoData.pendingApprovals.length} Capstones Awaiting Sign-Off
                      </span>
                    </div>
                  </div>

                  {/* Student Identity Verifications Queue for HOD */}
                  <StudentVerificationManager reviewerRole="HOD" />

                  {/* Pending Capstone Approvals */}
                  <div className="bg-white rounded-2xl p-6 border border-black/8 shadow-xs space-y-4">
                    <h3 className="font-display text-lg text-[#111111] font-normal">Faculty-Evaluated Capstones Awaiting HOD Seal</h3>
                    <div className="space-y-3">
                      {hodDemoData.pendingApprovals.map((appr) => (
                        <div key={appr.id} className="p-4 rounded-xl bg-[#FBFBFA] border border-black/6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-medium">
                                EVALUATED • {appr.submittedDate}
                              </span>
                              <span className="text-xs font-mono-code text-[#737373]">Faculty Guide: {appr.facultyMentor}</span>
                            </div>
                            <h4 className="text-sm font-bold text-[#111111]">{appr.projectTitle}</h4>
                            <p className="text-xs text-[#4A4A4A]">Team: {appr.teamLead} • Domain: {appr.domain}</p>
                            <p className="text-[11px] text-[#737373] mt-1">Compliance: {appr.complianceCheck}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => {
                                const sample = SAMPLE_PROJECTS.find(x => x.id === appr.projectId) || SAMPLE_PROJECTS[0];
                                onOpenProjectDetail(sample);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F5F5F3] border border-black/10 text-xs text-[#111111] font-medium cursor-pointer shadow-xs"
                            >
                              Inspect Repo
                            </button>
                            <button
                              onClick={() => {
                                setApprovalToast(`HOD Seal approved and published for ${appr.projectTitle}!`);
                                setTimeout(() => setApprovalToast(null), 4000);
                              }}
                              className="px-4 py-1.5 rounded-xl bg-[#111111] hover:bg-black text-xs font-medium text-white cursor-pointer shadow-xs"
                            >
                              Approve & Seal
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Department Faculty Roster Tab */}
              {activeTab === 'faculty' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="font-display text-2xl text-[#111111] font-normal">Department Faculty Directory & Mentorship Capacity</h2>
                      <p className="text-xs text-[#4A4A4A]">Academic workload distribution, capstone guidance load, and evaluation metrics across CSE faculty.</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono-code font-medium">
                      {hodDemoData.facultyMembers.length} Active Guides
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {hodDemoData.facultyMembers.map((fac) => (
                      <div key={fac.id} className="bg-white rounded-2xl p-5 border border-black/8 shadow-xs flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <img src={fac.avatar} alt={fac.name} className="w-12 h-12 rounded-xl object-cover border border-black/10" />
                            <div>
                              <h4 className="text-sm font-bold text-[#111111]">{fac.name}</h4>
                              <p className="text-xs text-[#737373]">{fac.designation}</p>
                              <span className="text-[10px] font-mono-code text-[#4A4A4A]">{fac.specialization}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 my-3 p-3 rounded-xl bg-[#FBFBFA] border border-black/6">
                            <div>
                              <span className="text-[10px] font-mono-code text-[#737373] uppercase">Advised</span>
                              <p className="text-sm font-bold text-[#111111]">{fac.activeAdvisees} Projects</p>
                            </div>
                            <div>
                              <span className="text-[10px] font-mono-code text-[#737373] uppercase">Pending Reviews</span>
                              <p className="text-sm font-bold text-amber-700">{fac.pendingReviews} Queued</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-black/6 text-xs">
                          <span className="text-[#737373] font-mono-code">{fac.email}</span>
                          <span className="text-emerald-700 font-medium font-mono-code">Score: {fac.averageScore}/10</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Department Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display text-2xl text-[#111111] font-normal">Departmental Accreditation & Capstone Analytics</h2>
                    <p className="text-xs text-[#4A4A4A]">NAAC Criterion 3, ABET Outcome metrics, project continuation rates, and research domain distribution.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-black/8 shadow-xs">
                      <span className="text-[11px] font-mono-code text-[#737373] uppercase font-medium">Continuation Rate</span>
                      <p className="text-2xl font-bold text-emerald-700 mt-1">{hodDemoData.complianceStats.continuationRate}%</p>
                      <span className="text-xs text-[#737373]">Inherited by successor cohorts</span>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-black/8 shadow-xs">
                      <span className="text-[11px] font-mono-code text-[#737373] uppercase font-medium">Duplication Blocked</span>
                      <p className="text-2xl font-bold text-[#111111] mt-1">{hodDemoData.complianceStats.duplicationBlockedCases} Instances</p>
                      <span className="text-xs text-[#737373]">Semantically flagged by AI</span>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-black/8 shadow-xs">
                      <span className="text-[11px] font-mono-code text-[#737373] uppercase font-medium">Industry Partnerships</span>
                      <p className="text-2xl font-bold text-[#111111] mt-1">{hodDemoData.complianceStats.industrySponsored} Sponsored</p>
                      <span className="text-xs text-[#737373]">External industry stakeholders</span>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-black/8 shadow-xs">
                      <span className="text-[11px] font-mono-code text-[#737373] uppercase font-medium">Accreditation Tier</span>
                      <p className="text-2xl font-bold text-blue-700 mt-1">{hodDemoData.complianceStats.accreditationTier}</p>
                      <span className="text-xs text-[#737373]">Full compliance achieved</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-black/8 shadow-xs space-y-4">
                    <h3 className="font-display text-lg text-[#111111] font-normal">Domain Breakdown</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                      {hodDemoData.domainDistribution.map((item) => (
                        <div key={item.domain} className="p-4 rounded-xl bg-[#FBFBFA] border border-black/6 text-center">
                          <span className="text-xl font-bold text-[#111111] block">{item.count}</span>
                          <span className="text-xs font-mono-code text-[#737373] mt-0.5 block">{item.domain}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* HOD Profile Tab */}
              {activeTab === 'profile' && (
                <RoleProfileView
                  profile={currentProfile || FALLBACK_PROFILES.HOD}
                  role="HOD"
                  onEditProfile={() => {
                    setApprovalToast("HOD profile settings opened");
                    setTimeout(() => setApprovalToast(null), 3000);
                  }}
                />
              )}

              {/* HOD Settings Tab */}
              {activeTab === 'settings' && (
                <RoleSettingsView
                  role="HOD"
                  profile={currentProfile}
                />
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* ADMIN ROLE VIEWS */}
          {/* ========================================================================= */}
          {activeRole === 'ADMIN' && (
            <div className="space-y-6">
              {/* Admin Main Executive Dashboard */}
              {activeTab === 'dashboard' && (
                <AdminDashboardView
                  data={adminDemoData}
                  onOpenUserDetail={(uId) => {
                    setApprovalToast(`User ${uId} administrative record opened`);
                    setTimeout(() => setApprovalToast(null), 3000);
                  }}
                  onOpenProjectDetail={(pId) => {
                    const pr = SAMPLE_PROJECTS.find(x => x.id === pId) || SAMPLE_PROJECTS[0];
                    onOpenProjectDetail(pr);
                  }}
                />
              )}

              {/* Explore Projects Tab for Admin */}
              {(activeTab === 'directory' || activeTab === 'discover' || activeTab === 'explore') && (
                <div className="space-y-6">
                  <AdvancedProjectDiscovery
                    projects={SAMPLE_PROJECTS}
                    onSelectProject={handleOpenProjectModal}
                    onOpenPassport={handleOpenPassportModal}
                    onOpenCollaborate={handleOpenCollaborateModal}
                    currentRole={activeRole}
                  />
                </div>
              )}

              {/* User Directory & RBAC Governance Tab */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="font-display text-2xl text-[#111111] font-normal">Cross-Institutional Identity & User Directory</h2>
                      <p className="text-xs text-[#4A4A4A]">Manage student innovators, verified faculty advisors, department heads, and SAML credentials.</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono-code font-medium">
                      {adminDemoData.recentUsers.length} Active System Identities
                    </span>
                  </div>

                  <div className="bg-white rounded-2xl border border-black/8 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-black/8 bg-[#FBFBFA] text-[11px] font-mono-code uppercase text-[#737373]">
                            <th className="py-3 px-4">User</th>
                            <th className="py-3 px-4">Role</th>
                            <th className="py-3 px-4">Institution</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Joined</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-black/6 text-xs">
                          {adminDemoData.recentUsers.map((u) => (
                            <tr key={u.id} className="hover:bg-[#FAFAFA] transition-colors">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-xs">
                                    {u.name.charAt(0)}
                                  </div>
                                  <div>
                                    <span className="font-bold text-[#111111] block">{u.name}</span>
                                    <span className="text-[11px] text-[#737373] font-mono-code">{u.email}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <RoleBadge role={u.role as UserRole} size="sm" />
                              </td>
                              <td className="py-3 px-4 text-[#4A4A4A]">{u.institution}</td>
                              <td className="py-3 px-4">
                                <span className={`text-[10px] font-mono-code px-2 py-0.5 rounded-full font-medium ${
                                  u.status === 'Active' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                                  'bg-amber-50 text-amber-800 border border-amber-200'
                                }`}>
                                  {u.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-[#737373] font-mono-code">{u.joined}</td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  onClick={() => {
                                    setApprovalToast(`User record for ${u.name} refreshed`);
                                    setTimeout(() => setApprovalToast(null), 3000);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-[#F7F7F5] hover:bg-[#EBEBE8] text-[11px] font-medium text-[#111111] border border-black/8 cursor-pointer"
                                >
                                  Audit
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Network Projects Ledger Tab */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="font-display text-2xl text-[#111111] font-normal">Network Repository & Capstone Registry</h2>
                      <p className="text-xs text-[#4A4A4A]">Global distributed ledger of academic capstones across federated institutional nodes.</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-black/8 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-black/8 bg-[#FBFBFA] text-[11px] font-mono-code uppercase text-[#737373]">
                            <th className="py-3 px-4">Project Passport</th>
                            <th className="py-3 px-4">Lead & Institution</th>
                            <th className="py-3 px-4">Campus Node</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4">Lineage</th>
                            <th className="py-3 px-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-black/6 text-xs">
                          {adminDemoData.systemProjects.map((p) => (
                            <tr key={p.id} className="hover:bg-[#FAFAFA] transition-colors">
                              <td className="py-3 px-4">
                                <span className="font-bold text-[#111111] block">{p.title}</span>
                                <span className="text-[10px] font-mono-code text-[#737373]">{p.domain}</span>
                              </td>
                              <td className="py-3 px-4">
                                <span className="text-[#111111] block font-medium">{p.lead}</span>
                                <span className="text-[11px] text-[#737373]">{p.institution}</span>
                              </td>
                              <td className="py-3 px-4 font-mono-code text-[11px] text-[#737373]">{p.node}</td>
                              <td className="py-3 px-4">
                                <span className={`text-[10px] font-mono-code px-2 py-0.5 rounded-full font-medium ${
                                  p.status === 'Verified' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                                  p.status === 'In Review' ? 'bg-blue-50 text-blue-800 border border-blue-200' :
                                  'bg-amber-50 text-amber-800 border border-amber-200'
                                }`}>
                                  {p.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-mono-code text-[11px] text-emerald-700">{p.lineage}</td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  onClick={() => {
                                    const sample = SAMPLE_PROJECTS.find(x => x.title.toLowerCase().includes(p.title.toLowerCase().slice(0, 5))) || SAMPLE_PROJECTS[0];
                                    onOpenProjectDetail(sample);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-[#F7F7F5] hover:bg-[#EBEBE8] text-[11px] font-medium text-[#111111] border border-black/8 cursor-pointer"
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
                </div>
              )}

              {/* Verification Queue Tab */}
              {(activeTab === 'verification-queue' || activeTab === 'student-verifications') && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display text-2xl text-[#111111] font-normal">Institutional Verification & KYC Audit Queue</h2>
                    <p className="text-xs text-[#4A4A4A]">Super-admin override and verification management for student and faculty credentials.</p>
                  </div>
                  <StudentVerificationManager reviewerRole="ADMIN" />
                </div>
              )}

              {/* System Node Governance Tab */}
              {activeTab === 'system' && (
                <div className="space-y-6">
                  <AdminManagementDashboard />
                </div>
              )}

              {/* Admin Profile Tab */}
              {activeTab === 'profile' && (
                <RoleProfileView
                  profile={currentProfile || FALLBACK_PROFILES.ADMIN}
                  role="ADMIN"
                  onEditProfile={() => {
                    setApprovalToast("Admin profile settings opened");
                    setTimeout(() => setApprovalToast(null), 3000);
                  }}
                />
              )}

              {/* Admin Settings Tab */}
              {activeTab === 'settings' && (
                <RoleSettingsView
                  role="ADMIN"
                  profile={currentProfile}
                />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Student/Alumni Academic Document Proof Upload Modal */}
      {isDocUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-black/10 shadow-2xl text-[#111111] max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-[#111111]" />
                <h3 className="font-display text-2xl text-[#111111] font-normal">
                  {currentProfile?.studentType === 'ALUMNI' ? 'Alumni Academic Proof' : 'Student Identity Verification'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsDocUploadModalOpen(false);
                  setPendingUploadDoc(null);
                }}
                className="w-7 h-7 rounded-full bg-[#F5F5F3] hover:bg-[#EBEBE8] border border-black/8 flex items-center justify-center text-[#4A4A4A] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <p className="text-xs text-[#4A4A4A] mb-4">
              Upload your valid academic document (Student ID card, Degree Certificate, Provisional Pass Certificate, or Official Enrollment Letter) for verification. Handled locally on client in this MVP.
            </p>

            <DocumentUploadDropzone
              studentType={currentProfile?.studentType || 'CURRENT_STUDENT'}
              externalError={docUploadError}
              onFileSelected={(data) => {
                setDocUploadError(null);
                setPendingUploadDoc(data);
              }}
              onFileRemoved={() => {
                setPendingUploadDoc(null);
                setDocUploadError(null);
              }}
            />

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/8 mt-4">
              <button
                type="button"
                disabled={isSubmittingDoc}
                onClick={() => {
                  setIsDocUploadModalOpen(false);
                  setPendingUploadDoc(null);
                  setDocUploadError(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#F5F5F3] hover:bg-[#EBEBE8] text-xs text-[#4A4A4A] font-medium cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStudentDocumentSubmit}
                disabled={!pendingUploadDoc || isSubmittingDoc}
                className="btn-primary-black px-5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{isSubmittingDoc ? 'Submitting...' : 'Submit for Verification'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Faculty Project Review Modal (Rubric & Feedback) in Clean White Visual System */}
      {reviewingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-black/10 shadow-2xl text-[#111111] max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-2xl text-[#111111] font-normal">Faculty Project Review</h3>
              <button
                onClick={() => setReviewingProject(null)}
                className="w-7 h-7 rounded-full bg-[#F5F5F3] hover:bg-[#EBEBE8] border border-black/8 flex items-center justify-center text-[#4A4A4A] cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-[#737373] mb-4">{reviewingProject.title}</p>

            {/* Modal Navigation Tabs: Rubric vs Feedback */}
            <div className="flex items-center gap-1 bg-[#F7F7F5] p-1 rounded-xl border border-black/8 text-xs font-medium mb-5">
              <button
                type="button"
                id="review-tab-rubric-btn"
                onClick={() => setReviewModalTab('rubric')}
                className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                  reviewModalTab === 'rubric'
                    ? 'bg-[#111111] text-white shadow-xs font-medium'
                    : 'text-[#4A4A4A] hover:text-[#111111]'
                }`}
              >
                Rubric Evaluation
              </button>
              <button
                type="button"
                id="review-tab-feedback-btn"
                onClick={() => setReviewModalTab('feedback')}
                className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                  reviewModalTab === 'feedback'
                    ? 'bg-[#111111] text-white shadow-xs font-medium'
                    : 'text-[#4A4A4A] hover:text-[#111111]'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Feedback</span>
                {projectFeedbacks.length > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono-code ${
                    reviewModalTab === 'feedback' ? 'bg-white/20 text-white' : 'bg-black/8 text-[#111111]'
                  }`}>
                    {projectFeedbacks.length}
                  </span>
                )}
              </button>
            </div>

            {reviewModalTab === 'feedback' ? (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-medium text-[#111111] mb-1">
                    Feedback
                  </label>
                  <p className="text-[11px] text-[#737373] mb-2">
                    Write practical improvement suggestions, corrections, and next steps for the student team.
                  </p>
                  <textarea
                    id="faculty-feedback-input"
                    rows={5}
                    maxLength={2000}
                    placeholder="Write your feedback..."
                    value={facultyFeedbackText}
                    onChange={(e) => {
                      setFacultyFeedbackText(e.target.value);
                      if (feedbackError) setFeedbackError(null);
                    }}
                    className="w-full p-3 rounded-xl bg-[#F7F7F5] border border-black/10 text-[#111111] text-xs placeholder:text-[#888888] focus:outline-none focus:border-black focus:bg-white resize-y"
                  />
                  <div className="flex items-center justify-between text-[11px] text-[#737373] mt-1">
                    <span>Constructive academic guidance</span>
                    <span className="font-mono-code">{facultyFeedbackText.length}/2000</span>
                  </div>
                </div>

                {feedbackError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{feedbackError}</span>
                  </div>
                )}

                {feedbackSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{feedbackSuccess}</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="button"
                    id="submit-feedback-btn"
                    onClick={handleSubmitFeedback}
                    disabled={!facultyFeedbackText.trim()}
                    className="btn-primary-black w-full py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Feedback</span>
                  </button>
                </div>

                {projectFeedbacks.length > 0 && (
                  <div className="pt-4 border-t border-black/8 space-y-3">
                    <h4 className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#737373]" />
                      <span>Previous Feedback History ({projectFeedbacks.length})</span>
                    </h4>
                    <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                      {projectFeedbacks.map((fb) => (
                        <div
                          key={fb.id}
                          className="p-3 rounded-xl bg-[#FBFBFA] border border-black/8 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-medium text-[#111111]">{fb.facultyName}</span>
                            <span className="text-[#737373] font-mono-code">{formatTimeAgo(fb.createdAt)}</span>
                          </div>
                          <p className="text-[#4A4A4A] whitespace-pre-wrap">{fb.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 text-xs mb-6">
                <div>
                  <div className="flex justify-between text-[#111111] mb-1 font-medium">
                    <span>Technical Rigor & Code Architecture</span>
                    <span className="font-mono-code font-bold">{rubricScores.technicalRigor}/10</span>
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
                  <div className="flex justify-between text-[#111111] mb-1 font-medium">
                    <span>Novelty & Innovation</span>
                    <span className="font-mono-code font-bold">{rubricScores.novelty}/10</span>
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
                  <div className="flex justify-between text-[#111111] mb-1 font-medium">
                    <span>Documentation & Reproduction Potential</span>
                    <span className="font-mono-code font-bold">{rubricScores.documentation}/10</span>
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
                  <div className="flex justify-between text-[#111111] mb-1 font-medium">
                    <span>Continuity & Next-Batch Readiness</span>
                    <span className="font-mono-code font-bold">{rubricScores.continuityPotential}/10</span>
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

                <div>
                  <label className="block text-[#111111] font-medium mb-1">Qualitative Endorsement</label>
                  <textarea
                    rows={2}
                    value={reviewFeedback}
                    onChange={(e) => setReviewFeedback(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#F7F7F5] border border-black/10 text-[#111111] text-xs focus:outline-none focus:border-black focus:bg-white"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-black/8">
              <button
                onClick={() => setReviewingProject(null)}
                className="px-4 py-2 rounded-xl bg-[#F5F5F3] hover:bg-[#EBEBE8] text-xs text-[#4A4A4A] font-medium cursor-pointer"
              >
                Close
              </button>
              {reviewModalTab === 'rubric' && (
                <button
                  onClick={() => handleSignVerification(reviewingProject.id)}
                  className="btn-primary-black px-5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Publish Cryptographic Signature</span>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Student Viewing Feedback Detail Modal */}
      {viewingFeedbackDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-black/10 shadow-2xl text-[#111111] max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display text-xl text-[#111111] font-normal">Faculty Review Feedback</h3>
                  <p className="text-[11px] text-[#737373] font-mono-code">
                    {formatTimeAgo(viewingFeedbackDetail.notif.createdAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingFeedbackDetail(null)}
                className="w-7 h-7 rounded-full bg-[#F5F5F3] hover:bg-[#EBEBE8] border border-black/8 flex items-center justify-center text-[#4A4A4A] cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>

            {viewingFeedbackDetail.project && (
              <div className="mb-4 p-3.5 rounded-2xl bg-[#FBFBFA] border border-black/8">
                <span className="text-[10px] font-mono-code text-[#737373] uppercase tracking-wider">PROJECT</span>
                <h4 className="text-sm font-bold text-[#111111] mt-0.5">{viewingFeedbackDetail.project.title}</h4>
                <p className="text-xs text-[#4A4A4A] mt-0.5 line-clamp-2">{viewingFeedbackDetail.project.tagline}</p>
              </div>
            )}

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#737373]">Reviewed by:</span>
                <span className="font-medium text-[#111111]">{viewingFeedbackDetail.facultyName}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Faculty Advisor
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#111111] mb-1.5">Feedback & Actionable Next Steps</label>
                <div className="p-4 rounded-2xl bg-[#F7F7F5] border border-black/10 text-xs text-[#111111] whitespace-pre-wrap leading-relaxed">
                  {viewingFeedbackDetail.feedbackMessage}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/8">
              {viewingFeedbackDetail.project && (
                <button
                  onClick={() => {
                    const p = viewingFeedbackDetail.project!;
                    setViewingFeedbackDetail(null);
                    onOpenProjectDetail(p);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#F5F5F3] hover:bg-[#EBEBE8] text-xs text-[#111111] font-medium cursor-pointer"
                >
                  Open Project Details
                </button>
              )}
              <button
                onClick={() => setViewingFeedbackDetail(null)}
                className="btn-primary-black px-5 py-2 rounded-xl text-xs font-medium cursor-pointer shadow-xs"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Project Passport Deep Inspection Modal (QR, Health, Lineage, Evidence, Print) */}
      <ProjectPassportModal
        project={selectedPassportProject}
        onClose={() => setSelectedPassportProject(null)}
        onContinueProject={(p) => {
          handleContinueProject(p);
        }}
        onOpenHandover={(p) => {
          setActiveHandoverProject(p);
          setSelectedPassportProject(null);
          setActiveTab('handover');
        }}
      />

      {/* Complete Project Dashboard & Evidence Modal */}
      <ProjectDashboardModal
        project={activeDashboardProject}
        onClose={() => setActiveDashboardProject(null)}
        onOpenPassport={(p) => {
          setActiveDashboardProject(null);
          handleOpenPassportModal(p);
        }}
        onOpenCollaborate={(p) => {
          setActiveDashboardProject(null);
          handleOpenCollaborateModal(p);
        }}
        currentUserRole={activeRole}
        currentUserId={currentProfile?.id}
        currentUserName={currentProfile?.fullName}
        currentUserAvatar={currentProfile?.avatar}
      />

      {/* Collaboration Proposal Modal */}
      <CollaborationRequestModal
        project={collaboratingProject}
        onClose={() => setCollaboratingProject(null)}
        onSuccess={() => {
          setApprovalToast('Collaboration proposal sent to project creator and team leads.');
          setTimeout(() => setApprovalToast(null), 3500);
        }}
        currentUser={currentProfile ? {
          id: currentProfile.id,
          fullName: currentProfile.fullName,
          avatar: currentProfile.avatar,
          institution: currentProfile.institution
        } : undefined}
      />

      {/* Global Search Modal (Cmd+K) */}
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        onSelectProject={(p) => {
          setIsGlobalSearchOpen(false);
          handleOpenProjectModal(p);
        }}
      />
    </div>
  );
};
