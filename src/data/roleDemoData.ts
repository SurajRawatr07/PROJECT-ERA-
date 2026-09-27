import { UserRole, ProjectItem, UserProfile } from '../types';

export interface StudentDemoData {
  profile: UserProfile;
  stats: {
    projectsCount: number;
    verifiedCount: number;
    contributionsCount: number;
    mentorsCount: number;
    profileCompletion: number;
  };
  projects: any[];
  mentors: {
    id: string;
    name: string;
    title: string;
    department: string;
    institution: string;
    avatar: string;
    domain: string;
    status: string;
  }[];
  collaborators: {
    id: string;
    name: string;
    role: string;
    institution: string;
    avatar: string;
    project: string;
  }[];
  recentActivity: {
    id: string;
    title: string;
    time: string;
    type: 'project' | 'verification' | 'collaboration' | 'passport';
    description: string;
  }[];
  notifications: {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type: string;
  }[];
  gettingStartedChecklist: {
    id: string;
    task: string;
    completed: boolean;
    description: string;
  }[];
}

export interface FacultyDemoData {
  profile: UserProfile;
  stats: {
    projectsMentored: number;
    studentsGuided: number;
    pendingReviews: number;
    verifiedProjects: number;
    profileCompletion: number;
  };
  projectsUnderGuidance: {
    id: string;
    title: string;
    studentLead: string;
    team: string[];
    domain: string;
    techStack: string[];
    status: 'Verified' | 'In Review' | 'Changes Requested' | 'Pending Sign-off';
    academicYear: string;
    batch: string;
    lastUpdated: string;
    score?: number;
  }[];
  studentsGuided: {
    id: string;
    name: string;
    rollNumber: string;
    course: string;
    projectTitle: string;
    progress: number;
    status: 'On Track' | 'Needs Review' | 'Completed';
    avatar: string;
    email: string;
  }[];
  pendingReviews: {
    id: string;
    projectId: string;
    projectTitle: string;
    studentLead: string;
    submittedAt: string;
    milestone: string;
    deliverables: string;
    priority: 'High' | 'Medium' | 'Normal';
  }[];
  recentReviews: {
    id: string;
    projectTitle: string;
    studentLead: string;
    evaluatedOn: string;
    score: number;
    verdict: 'Approved' | 'Changes Requested';
    feedback: string;
  }[];
  mentorshipActivity: {
    id: string;
    time: string;
    action: string;
    target: string;
    detail: string;
  }[];
  notifications: {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
  }[];
  gettingStartedChecklist: {
    id: string;
    task: string;
    completed: boolean;
    description: string;
  }[];
}

export interface HODDemoData {
  profile: UserProfile;
  stats: {
    totalStudents: number;
    totalProjects: number;
    verifiedProjects: number;
    pendingApprovals: number;
    facultyCount: number;
    accreditationScore: string;
    profileCompletion: number;
  };
  departmentProjects: {
    id: string;
    title: string;
    studentLead: string;
    facultyGuide: string;
    domain: string;
    techStack: string[];
    academicYear: string;
    batch: string;
    status: 'Approved' | 'Pending HOD Seal' | 'Under Faculty Review' | 'Flagged';
    naacCompliance: 'Compliant' | 'Pending' | 'Exemplary';
  }[];
  pendingApprovals: {
    id: string;
    projectId?: string;
    projectTitle: string;
    facultyGuide: string;
    facultyMentor?: string;
    studentTeam: string;
    teamLead?: string;
    domain?: string;
    submittedDate: string;
    departmentToken: string;
    recommendation: string;
    complianceCheck?: string;
  }[];
  facultyMembers: {
    id: string;
    name: string;
    designation: string;
    specialization: string;
    activeAdvisees: number;
    pendingReviews: number;
    averageScore: number;
    email: string;
    avatar: string;
  }[];
  complianceStats: {
    continuationRate: number;
    duplicationBlockedCases: number;
    industrySponsored: number;
    accreditationTier: string;
  };
  domainDistribution: {
    domain: string;
    count: number;
  }[];
  facultyActivity: {
    id: string;
    name: string;
    designation: string;
    activeProjects: number;
    studentsGuided: number;
    verificationSpeed: string;
    status: 'Active' | 'Review Due' | 'On Leave';
    avatar: string;
  }[];
  projectDistribution: {
    domain: string;
    count: number;
    percentage: number;
  }[];
  recentInnovationActivity: {
    id: string;
    title: string;
    type: 'Patent' | 'Paper Publication' | 'National Hackathon' | 'Industry Transfer';
    team: string;
    date: string;
    badge: string;
  }[];
  notifications: {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
  }[];
  gettingStartedChecklist: {
    id: string;
    task: string;
    completed: boolean;
    description: string;
  }[];
}

export interface AdminDemoData {
  profile: UserProfile;
  stats: {
    totalUsers: number;
    students: number;
    faculty: number;
    hods: number;
    institutions: number;
    projects: number;
    verifiedProjects: number;
    pendingReports: number;
    systemHealth: string;
    profileCompletion: number;
  };
  systemProjects: {
    id: string;
    title: string;
    domain: string;
    lead: string;
    institution: string;
    node: string;
    status: string;
    lineage?: string;
  }[];
  recentUsers: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    institution: string;
    joinedDate: string;
    joined?: string;
    status: 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION' | 'Active';
    verified: boolean;
  }[];
  recentProjects: {
    id: string;
    title: string;
    institution: string;
    leadAuthor: string;
    domain: string;
    submittedDate: string;
    status: 'Verified' | 'Pending' | 'Flagged';
  }[];
  verificationQueue: {
    id: string;
    targetName: string;
    type: 'Institutional Node' | 'Faculty Identity' | 'Student Roll Proof' | 'Research Seal';
    institution: string;
    submittedTime: string;
    status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  }[];
  reportedContent: {
    id: string;
    contentTitle: string;
    type: 'Plagiarism Suspect' | 'Invalid Academic Proof' | 'License Infringement';
    reportedBy: string;
    date: string;
    severity: 'High' | 'Medium' | 'Low';
    status: 'Open' | 'Investigating' | 'Resolved';
  }[];
  platformActivity: {
    id: string;
    action: string;
    actor: string;
    target: string;
    timestamp: string;
    status: 'SUCCESS' | 'WARNING' | 'INFO';
  }[];
  systemOverview: {
    activeNodes: number;
    totalConsensusTransactions: number;
    averageLatencyMs: number;
    samlIntegrations: number;
    storageUsedGb: number;
    uptimePercent: number;
  };
  notifications: {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
  }[];
  gettingStartedChecklist: {
    id: string;
    task: string;
    completed: boolean;
    description: string;
  }[];
}

// ---------------------------------------------------------------------------
// 1. STUDENT DEMO DATA (Suraj Rawat)
// ---------------------------------------------------------------------------
export const STUDENT_DEMO_DATA: StudentDemoData = {
  profile: {
    id: 'student-001',
    fullName: 'Suraj Rawat',
    email: 'suraj@student.demo',
    role: 'STUDENT',
    studentType: 'CURRENT_STUDENT',
    institution: 'Graphic Era Hill University',
    department: 'Dept of Computer Science & Engineering',
    course: 'BCA',
    batch: '2023–2027',
    rollNumber: 'GEHU/2023/BCA/089',
    bio: 'Full-stack builder and systems researcher passionate about developer tools, distributed computing, and web performance. Haldwani, Uttarakhand.',
    skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'MongoDB', 'C++', 'DSA', 'Git/GitHub', 'Tailwind CSS', 'Docker', 'Express', 'REST APIs'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    verifiedStatus: 'Verified',
    githubVerified: true,
    githubUsername: 'suraj-rawat-dev',
    linkedinUrl: 'https://linkedin.com/in/suraj-rawat',
    portfolioUrl: 'https://surajrawat.me',
    projectsCount: 6,
    verifiedProjectsCount: 4,
    contributionsCount: 38
  },
  stats: {
    projectsCount: 6,
    verifiedCount: 4,
    contributionsCount: 38,
    mentorsCount: 2,
    profileCompletion: 94
  },
  projects: [
    {
      id: 'proj-stud-1',
      passportId: 'PV-2025-GEHU-CS104-01',
      title: 'ProjectVerse: Decentralized Academic Capstone Repository',
      tagline: 'Cryptographically sealed project passports, institutional verification pipelines, and lineage inheritance.',
      description: 'A national academic project repository platform ensuring student capstones are permanently archived with verified lineage and anti-duplication mechanisms.',
      domain: 'Distributed Systems & Cloud',
      techStack: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Docker'],
      institution: 'Graphic Era Hill University',
      department: 'Dept of Computer Science & Engineering',
      academicYear: '2024 – 2025',
      status: 'Verified',
      verificationStatus: 'Verified',
      stars: 128,
      commits: 340,
      facultyGuide: 'Dr. Ananya Sharma (Assistant Professor)',
      lastUpdated: '2 hours ago',
      coverGradient: 'from-zinc-800 via-neutral-900 to-stone-950',
      featured: true,
      githubStars: 128,
      githubCommits: 340,
      lineageBatchesCount: 2,
      contributors: [
        {
          name: 'Suraj Rawat',
          role: 'Lead Architect & Full-Stack',
          institution: 'Graphic Era Hill University',
          batch: '2023–2027',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          githubHandle: 'suraj-rawat-dev',
          commitsCount: 280
        },
        {
          name: 'Priya Sharma',
          role: 'Frontend & Verification UX',
          institution: 'Graphic Era Hill University',
          batch: '2023–2027',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          githubHandle: 'priya-sharma',
          commitsCount: 60
        }
      ],
      passport: {
        passportId: 'PV-2025-GEHU-CS104-01',
        originInstitution: 'Graphic Era Hill University',
        governingDepartment: 'Dept of Computer Science & Engineering',
        initialBatchYear: '2024',
        currentLifecyclePhase: 'Institutional Sign-off Complete',
        cryptographicProofHash: '0x8f3c71a92e4b6d015c99e4f2a71b3e8c9d0a1b2c',
        rubricAssessmentScore: '9.8 / 10',
        facultySupervisorSignature: 'Dr. Ananya Sharma (Assistant Professor)',
        hodConsensusSealed: true
      }
    },
    {
      id: 'proj-stud-2',
      passportId: 'PV-2025-GEHU-CS104-02',
      title: 'Resume Craft: Intelligent Semantic Resume Engine',
      tagline: 'ATS-optimized markdown resume builder with real-time typography styling and PDF vector export.',
      description: 'An open-source resume generator tailored for engineering students to create high-impact, applicant-tracking-system compliant technical profiles.',
      domain: 'Developer Tools',
      techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Canvas API'],
      institution: 'Graphic Era Hill University',
      department: 'Dept of Computer Science & Engineering',
      academicYear: '2024 – 2025',
      status: 'Verified',
      verificationStatus: 'Verified',
      stars: 84,
      commits: 195,
      facultyGuide: 'Dr. Ananya Sharma',
      lastUpdated: '1 day ago',
      coverGradient: 'from-slate-800 via-neutral-900 to-zinc-900',
      featured: false,
      githubStars: 84,
      githubCommits: 195,
      lineageBatchesCount: 1,
      contributors: [
        {
          name: 'Suraj Rawat',
          role: 'Creator & Maintainer',
          institution: 'Graphic Era Hill University',
          batch: '2023–2027',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          githubHandle: 'suraj-rawat-dev',
          commitsCount: 195
        }
      ],
      passport: {
        passportId: 'PV-2025-GEHU-CS104-02',
        originInstitution: 'Graphic Era Hill University',
        governingDepartment: 'Dept of Computer Science & Engineering',
        initialBatchYear: '2024',
        currentLifecyclePhase: 'Faculty Verified',
        cryptographicProofHash: '0x3a9e1d8f2c7b4e056a81c2d3e4f5a6b7c8d9e0f1',
        rubricAssessmentScore: '9.4 / 10',
        facultySupervisorSignature: 'Dr. Ananya Sharma',
        hodConsensusSealed: true
      }
    },
    {
      id: 'proj-stud-3',
      passportId: 'PV-2025-GEHU-CS104-03',
      title: 'ONE IDE: In-Browser WebAssembly Sandboxed Runtime',
      tagline: 'Zero-latency multi-language compiler with WebAssembly workers and offline state syncing.',
      description: 'A browser-based development environment enabling students to run C++, Python, and Rust code without server dependencies using WebAssembly containers.',
      domain: 'Distributed Systems & Cloud',
      techStack: ['C++', 'Rust', 'WebAssembly', 'TypeScript', 'Web Workers'],
      institution: 'Graphic Era Hill University',
      department: 'Dept of Computer Science & Engineering',
      academicYear: '2024 – 2025',
      status: 'Verified',
      verificationStatus: 'Verified',
      stars: 62,
      commits: 112,
      facultyGuide: 'Dr. Ananya Sharma',
      lastUpdated: '3 days ago',
      coverGradient: 'from-zinc-900 via-stone-900 to-neutral-950',
      featured: false,
      githubStars: 62,
      githubCommits: 112,
      lineageBatchesCount: 1,
      contributors: [
        {
          name: 'Suraj Rawat',
          role: 'Core Systems Developer',
          institution: 'Graphic Era Hill University',
          batch: '2023–2027',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          githubHandle: 'suraj-rawat-dev',
          commitsCount: 112
        }
      ],
      passport: {
        passportId: 'PV-2025-GEHU-CS104-03',
        originInstitution: 'Graphic Era Hill University',
        governingDepartment: 'Dept of Computer Science & Engineering',
        initialBatchYear: '2024',
        currentLifecyclePhase: 'Faculty Verified',
        cryptographicProofHash: '0x9b4f2c8d1e0a7f3b5c6e8d2a4f0b1c3e5d7a9b0c',
        rubricAssessmentScore: '9.5 / 10',
        facultySupervisorSignature: 'Dr. Ananya Sharma',
        hodConsensusSealed: true
      }
    },
    {
      id: 'proj-stud-4',
      passportId: 'PV-2025-GEHU-CS104-04',
      title: 'Smart Education Platform',
      tagline: 'Interactive peer-learning management system with AI tutoring workflows and cohort telemetry.',
      description: 'An integrated academic learning ecosystem featuring real-time lab assessments, automated rubric calculations, and collaborative study halls.',
      domain: 'EdTech & Web Systems',
      techStack: ['React', 'Node.js', 'MongoDB', 'Express', 'WebSockets', 'Tailwind CSS'],
      institution: 'Graphic Era Hill University',
      department: 'Dept of Computer Science & Engineering',
      academicYear: '2024 – 2025',
      status: 'Verified',
      verificationStatus: 'Verified',
      stars: 48,
      commits: 140,
      facultyGuide: 'Dr. Ananya Sharma',
      lastUpdated: '5 days ago',
      coverGradient: 'from-blue-900 via-neutral-900 to-zinc-950',
      featured: false,
      githubStars: 48,
      githubCommits: 140,
      lineageBatchesCount: 1,
      contributors: [
        {
          name: 'Suraj Rawat',
          role: 'Full-Stack Developer',
          institution: 'Graphic Era Hill University',
          batch: '2023–2027',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          githubHandle: 'suraj-rawat-dev',
          commitsCount: 140
        }
      ],
      passport: {
        passportId: 'PV-2025-GEHU-CS104-04',
        originInstitution: 'Graphic Era Hill University',
        governingDepartment: 'Dept of Computer Science & Engineering',
        initialBatchYear: '2024',
        currentLifecyclePhase: 'Institutional Sign-off Complete',
        cryptographicProofHash: '0x4d8a1c9e2b0f7a3d6e5c8b1a9f0e2d4c7b8a0e1f',
        rubricAssessmentScore: '9.2 / 10',
        facultySupervisorSignature: 'Dr. Ananya Sharma',
        hodConsensusSealed: true
      }
    },
    {
      id: 'proj-stud-5',
      passportId: 'PV-2025-GEHU-CS104-05',
      title: 'Campus Collaboration System',
      tagline: 'Multi-tenant student team coordination portal with sprint tracking and document proof-of-work.',
      description: 'A dedicated team collaboration suite designed for interdisciplinary academic capstones with real-time Git commit synchronization.',
      domain: 'Productivity & Collaboration',
      techStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker'],
      institution: 'Graphic Era Hill University',
      department: 'Dept of Computer Science & Engineering',
      academicYear: '2024 – 2025',
      status: 'Under Review',
      verificationStatus: 'Under Review',
      stars: 35,
      commits: 98,
      facultyGuide: 'Dr. Ananya Sharma',
      lastUpdated: '1 week ago',
      coverGradient: 'from-emerald-950 via-neutral-900 to-black',
      featured: false,
      githubStars: 35,
      githubCommits: 98,
      lineageBatchesCount: 1,
      contributors: [
        {
          name: 'Suraj Rawat',
          role: 'Backend Architect',
          institution: 'Graphic Era Hill University',
          batch: '2023–2027',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          githubHandle: 'suraj-rawat-dev',
          commitsCount: 98
        }
      ],
      passport: {
        passportId: 'PV-2025-GEHU-CS104-05',
        originInstitution: 'Graphic Era Hill University',
        governingDepartment: 'Dept of Computer Science & Engineering',
        initialBatchYear: '2024',
        currentLifecyclePhase: 'Under Faculty Review',
        cryptographicProofHash: '0x7e2b9c0d1a4f8e3b5d6c7a9f0e1b2d4c8a9e0f3b',
        rubricAssessmentScore: 'Pending',
        facultySupervisorSignature: 'Dr. Ananya Sharma',
        hodConsensusSealed: false
      }
    },
    {
      id: 'proj-stud-6',
      passportId: 'PV-2025-GEHU-CS104-06',
      title: 'Developer Portfolio',
      tagline: 'High-performance personal engineering portfolio with interactive terminal and live WebGL showcases.',
      description: 'A minimalist, dark-mode personal portfolio showcasing open-source contributions, technical publications, and benchmark visualizations.',
      domain: 'Frontend & Creative Dev',
      techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Three.js', 'Vite'],
      institution: 'Graphic Era Hill University',
      department: 'Dept of Computer Science & Engineering',
      academicYear: '2024 – 2025',
      status: 'In Progress',
      verificationStatus: 'In Progress',
      stars: 52,
      commits: 86,
      facultyGuide: 'Dr. Ananya Sharma',
      lastUpdated: '2 weeks ago',
      coverGradient: 'from-stone-900 via-neutral-900 to-zinc-900',
      featured: false,
      githubStars: 52,
      githubCommits: 86,
      lineageBatchesCount: 1,
      contributors: [
        {
          name: 'Suraj Rawat',
          role: 'Sole Author',
          institution: 'Graphic Era Hill University',
          batch: '2023–2027',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          githubHandle: 'suraj-rawat-dev',
          commitsCount: 86
        }
      ],
      passport: {
        passportId: 'PV-2025-GEHU-CS104-06',
        originInstitution: 'Graphic Era Hill University',
        governingDepartment: 'Dept of Computer Science & Engineering',
        initialBatchYear: '2024',
        currentLifecyclePhase: 'Development Draft',
        cryptographicProofHash: '0x1c3e5a7b9d0f2e4a6c8b0d1e3f5a7c9b2d4e6f8a',
        rubricAssessmentScore: 'In Progress',
        facultySupervisorSignature: 'Dr. Ananya Sharma',
        hodConsensusSealed: false
      }
    }
  ],
  mentors: [
    {
      id: 'men-1',
      name: 'Dr. Anil Sharma',
      title: 'Associate Professor & Research Advisor',
      department: 'Dept of Computer Science & Engineering',
      institution: 'Graphic Era Hill University',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      domain: 'Distributed Systems & AI',
      status: 'Active Advisor'
    },
    {
      id: 'men-2',
      name: 'Dr. Meenakshi Sundaram',
      title: 'Professor & Systems Lab Director',
      department: 'Dept of Computer Science & Engineering',
      institution: 'Graphic Era Hill University',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      domain: 'Edge Computing & Networking',
      status: 'Secondary Advisor'
    }
  ],
  collaborators: [
    {
      id: 'col-1',
      name: 'Devansh Kulkarni',
      role: 'Perception Lead',
      institution: 'IIT Bombay',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      project: 'AeroSync Swarm'
    },
    {
      id: 'col-2',
      name: 'Priya Sharma',
      role: 'Frontend Co-developer',
      institution: 'Graphic Era Hill University',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      project: 'ProjectVerse'
    },
    {
      id: 'col-3',
      name: 'Marcus Vance',
      role: 'Firmware Integrator',
      institution: 'BITS Pilani',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      project: 'ONE IDE Wasm Runner'
    }
  ],
  recentActivity: [
    {
      id: 'act-1',
      title: 'Capstone Verification Sealed',
      time: '2 hours ago',
      type: 'verification',
      description: 'ProjectVerse passport received cryptographic seal from Dr. Anil Sharma.'
    },
    {
      id: 'act-2',
      title: 'Submitted Milestone: ONE IDE',
      time: 'Yesterday',
      type: 'project',
      description: 'Uploaded WebAssembly engine demo build for Phase 2 rubric review.'
    },
    {
      id: 'act-3',
      title: 'Collaborative Pull Request Merged',
      time: '3 days ago',
      type: 'collaboration',
      description: 'Merged PR #14 from Priya Sharma into ProjectVerse repository.'
    }
  ],
  notifications: [
    {
      id: 'notif-1',
      title: 'Faculty Verification Approved',
      message: 'Dr. Anil Sharma has evaluated ProjectVerse and awarded 9.8 / 10 rubric score.',
      time: '2 hours ago',
      read: false,
      type: 'success'
    },
    {
      id: 'notif-2',
      title: 'New Collaboration Request',
      message: 'Devansh Kulkarni invited you to test AeroSync ROS 2 integration nodes.',
      time: '1 day ago',
      read: false,
      type: 'info'
    },
    {
      id: 'notif-3',
      title: 'Identity Verification Confirmed',
      message: 'Your Graphic Era Hill University student ID was verified by Department Registry.',
      time: '3 days ago',
      read: true,
      type: 'system'
    }
  ],
  gettingStartedChecklist: [
    { id: 'chk-1', task: 'Complete Profile Details', completed: true, description: 'Add your department, academic batch, and skills.' },
    { id: 'chk-2', task: 'Verify Institutional Email', completed: true, description: 'Confirm your institutional address (@gehu.ac.in).' },
    { id: 'chk-3', task: 'Connect GitHub Account', completed: true, description: 'Link your developer profile to verify commit lineage.' },
    { id: 'chk-4', task: 'Publish First Project Passport', completed: true, description: 'Document your capstone architecture and tech stack.' },
    { id: 'chk-5', task: 'Request Faculty Verification', completed: false, description: 'Invite your guide to evaluate your project deliverables.' }
  ]
};

// ---------------------------------------------------------------------------
// 2. FACULTY DEMO DATA (Dr. Ananya Sharma)
// ---------------------------------------------------------------------------
export const FACULTY_DEMO_DATA: FacultyDemoData = {
  profile: {
    id: 'faculty-001',
    fullName: 'Dr. Ananya Sharma',
    email: 'faculty@demo.com',
    role: 'FACULTY',
    institution: 'Graphic Era Hill University',
    department: 'Computer Science & Engineering',
    designation: 'Assistant Professor',
    facultyId: 'EMP-GEHU-FAC-409',
    bio: 'Assistant Professor in Computer Science & Engineering. Guiding undergraduate and postgraduate capstone initiatives, research cohorts, and peer reviews.',
    researchAreas: ['Artificial Intelligence', 'Edge Computing', 'Distributed Systems', 'Computer Vision'],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    verifiedStatus: 'Verified',
    projectsCount: 12,
    rubricScore: 9.9
  },
  stats: {
    projectsMentored: 12,
    studentsGuided: 34,
    pendingReviews: 5,
    verifiedProjects: 18,
    profileCompletion: 92
  },
  projectsUnderGuidance: [
    {
      id: 'f-proj-1',
      title: 'ProjectVerse',
      studentLead: 'Suraj Rawat',
      team: ['Suraj Rawat', 'Priya Sharma'],
      domain: 'Web & Distributed Systems',
      techStack: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Docker'],
      status: 'Verified',
      academicYear: '2024 – 2025',
      batch: '2023–2027',
      lastUpdated: 'Today, 11:30 AM',
      score: 9.8
    },
    {
      id: 'f-proj-2',
      title: 'AI Study Assistant',
      studentLead: 'Priya Desai',
      team: ['Priya Desai', 'Aarav Sharma'],
      domain: 'Artificial Intelligence & NLP',
      techStack: ['Python', 'FastAPI', 'PyTorch', 'React'],
      status: 'In Review',
      academicYear: '2024 – 2025',
      batch: '2023–2027',
      lastUpdated: 'Yesterday, 04:15 PM'
    },
    {
      id: 'f-proj-3',
      title: 'Campus Connect',
      studentLead: 'Rohan Verma',
      team: ['Rohan Verma', 'Kavita Joshi'],
      domain: 'Campus Collaboration & Mobile',
      techStack: ['React Native', 'Node.js', 'PostgreSQL', 'WebSockets'],
      status: 'Verified',
      academicYear: '2024 – 2025',
      batch: '2022–2026',
      lastUpdated: '2 days ago',
      score: 9.5
    },
    {
      id: 'f-proj-4',
      title: 'Smart Attendance',
      studentLead: 'Sneha Gupta',
      team: ['Sneha Gupta', 'Naveen Bhatt'],
      domain: 'Computer Vision & IoT',
      techStack: ['OpenCV', 'Python', 'Raspberry Pi', 'Firebase'],
      status: 'Verified',
      academicYear: '2024 – 2025',
      batch: '2022–2026',
      lastUpdated: '4 days ago',
      score: 9.4
    },
    {
      id: 'f-proj-5',
      title: 'Research Collaboration Platform',
      studentLead: 'Vikram Roy',
      team: ['Vikram Roy', 'Divya Pant'],
      domain: 'Distributed Research & Academic Tools',
      techStack: ['Next.js', 'TypeScript', 'GraphQL', 'Prisma'],
      status: 'In Review',
      academicYear: '2024 – 2025',
      batch: '2023–2027',
      lastUpdated: '5 days ago'
    }
  ],
  studentsGuided: [
    {
      id: 'st-1',
      name: 'Suraj Rawat',
      rollNumber: 'GEHU/2023/BCA/089',
      course: 'BCA',
      projectTitle: 'ProjectVerse',
      progress: 98,
      status: 'Completed',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      email: 'suraj@student.demo'
    },
    {
      id: 'st-2',
      name: 'Aarav Sharma',
      rollNumber: 'GEHU/2023/CS/042',
      course: 'B.Tech CSE',
      projectTitle: 'Smart Campus Navigator',
      progress: 82,
      status: 'Needs Review',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      email: 'aarav.sharma@gehu.ac.in'
    },
    {
      id: 'st-3',
      name: 'Priya Desai',
      rollNumber: 'GEHU/2023/CS/194',
      course: 'B.Tech CSE',
      projectTitle: 'AI Study Assistant',
      progress: 85,
      status: 'Needs Review',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      email: 'priya.desai@gehu.ac.in'
    },
    {
      id: 'st-4',
      name: 'Sneha Gupta',
      rollNumber: 'GEHU/2022/CS/108',
      course: 'B.Tech CSE',
      projectTitle: 'Smart Attendance',
      progress: 100,
      status: 'Completed',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      email: 'sneha.gupta@gehu.ac.in'
    }
  ],
  pendingReviews: [
    {
      id: 'pr-1',
      projectId: 'f-proj-rev-1',
      projectTitle: 'Smart Campus Navigator',
      studentLead: 'Aarav Sharma',
      submittedAt: 'Today, 09:30 AM',
      milestone: 'Phase 2: Indoor Graph Navigation & AR Waypoints',
      deliverables: 'Unity WebGL bundle, benchmark report, GitHub PR #19',
      priority: 'High'
    },
    {
      id: 'pr-2',
      projectId: 'f-proj-rev-2',
      projectTitle: 'AI Study Assistant',
      studentLead: 'Priya Desai',
      submittedAt: 'Yesterday, 04:15 PM',
      milestone: 'Transformer Model Quantization & Semantic Indexing',
      deliverables: 'Quantized ONNX weights, evaluation metrics log',
      priority: 'High'
    },
    {
      id: 'pr-3',
      projectId: 'f-proj-rev-3',
      projectTitle: 'Neural Edge Detector',
      studentLead: 'Rohan Patel',
      submittedAt: '2 days ago',
      milestone: 'Edge TPU Benchmark & Precision Verification',
      deliverables: 'Latency benchmark sheets, edge camera stream test',
      priority: 'Medium'
    },
    {
      id: 'pr-4',
      projectId: 'f-proj-rev-4',
      projectTitle: 'Distributed Log Engine',
      studentLead: 'Vikram Roy',
      submittedAt: '3 days ago',
      milestone: 'Raft Consensus Protocol Fuzz Testing',
      deliverables: 'Jepsen test logs, cluster failover traces',
      priority: 'Medium'
    },
    {
      id: 'pr-5',
      projectId: 'f-proj-rev-5',
      projectTitle: 'Cloud Native Compiler',
      studentLead: 'Sneha Gupta',
      submittedAt: '4 days ago',
      milestone: 'LLVM Backend Intermediate Representation Generator',
      deliverables: 'Compiler test suite, IR optimization dump',
      priority: 'Normal'
    }
  ],
  recentReviews: [
    {
      id: 'rr-1',
      projectTitle: 'ProjectVerse: Decentralized Capstone Repository',
      studentLead: 'Suraj Rawat',
      evaluatedOn: 'Today, 10:15 AM',
      score: 9.8,
      verdict: 'Approved',
      feedback: 'Outstanding architectural integrity. Multi-role authentication, responsive UI, and verified project passports adhere to NAAC standards.'
    },
    {
      id: 'rr-2',
      projectTitle: 'AgriSense: IoT Hyper-Local Soil Predictor',
      studentLead: 'Karan Joshi',
      evaluatedOn: 'Last week',
      score: 9.5,
      verdict: 'Approved',
      feedback: 'Impressive power efficiency on ESP32 microcontroller with micro-quantized neural weights.'
    },
    {
      id: 'rr-3',
      projectTitle: 'CyberGuard: Real-Time BGP Hijack Detector',
      studentLead: 'Vikram Rao',
      evaluatedOn: 'Oct 14, 2025',
      score: 7.6,
      verdict: 'Changes Requested',
      feedback: 'Packet dropping observed under 10 Gbps simulated traffic. Please optimize memory buffer pooling in Go runtime.'
    }
  ],
  mentorshipActivity: [
    {
      id: 'ma-1',
      time: 'Today, 10:15 AM',
      action: 'Digitally Signed Passport',
      target: 'ProjectVerse (Suraj Rawat)',
      detail: 'Generated ECDSA academic seal with 9.8 / 10 rubric score.'
    },
    {
      id: 'ma-2',
      time: 'Yesterday, 03:00 PM',
      action: 'Conducted Milestone Review',
      target: 'AeroSync Drone Swarm',
      detail: 'Reviewed ROS 2 visual odometry latency benchmarks on NVIDIA Jetson.'
    },
    {
      id: 'ma-3',
      time: '2 days ago',
      action: 'Approved Thesis Proposal',
      target: 'MedChain (Priya Sharma)',
      detail: 'Confirmed research alignment with IEEE Standards for Health Informatics.'
    }
  ],
  notifications: [
    {
      id: 'fn-1',
      title: 'Capstone Review Milestone Submitted',
      message: 'Devansh Kulkarni submitted AeroSync ROS 2 Humble test suite for evaluation.',
      time: 'Yesterday, 04:15 PM',
      read: false
    },
    {
      id: 'fn-2',
      title: 'HOD Consensus Seal Triggered',
      message: 'Dr. Rajesh Kumar counter-signed ProjectVerse capstone after your review.',
      time: 'Today, 11:45 AM',
      read: false
    },
    {
      id: 'fn-3',
      title: 'New Student Mentorship Request',
      message: 'Rohan Mehra requested mentorship for QuantumKey TLS accelerator capstone.',
      time: '2 days ago',
      read: true
    }
  ],
  gettingStartedChecklist: [
    { id: 'fc-1', task: 'Verify Academic Faculty ID', completed: true, description: 'Matched with university payroll and domain records.' },
    { id: 'fc-2', task: 'Set Research Specializations', completed: true, description: 'Added AI, Edge Computing, and Distributed Systems.' },
    { id: 'fc-3', task: 'Review Pending Capstones', completed: false, description: 'Evaluate 5 pending project milestones.' },
    { id: 'fc-4', task: 'Assign Rubric Scores', completed: true, description: 'Score projects based on NAAC criterion.' },
    { id: 'fc-5', task: 'Configure Mentorship Capacity', completed: true, description: 'Set current availability to 15 student teams.' }
  ]
};

// ---------------------------------------------------------------------------
// 3. HOD DEMO DATA (Dr. Rajesh Mehta)
// ---------------------------------------------------------------------------
export const HOD_DEMO_DATA: HODDemoData = {
  profile: {
    id: 'hod-001',
    fullName: 'Dr. Rajesh Mehta',
    email: 'hod@demo.com',
    role: 'HOD',
    institution: 'Graphic Era Hill University',
    department: 'Computer Science',
    designation: 'Professor & Head of Department',
    facultyId: 'HOD-CSE-001',
    departmentToken: 'GEHU-HOD-CSE-2025',
    bio: 'Head of Computer Science. Overseeing department capstones, verification seals, institutional compliance, and faculty guidance.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    verifiedStatus: 'Verified',
    projectsCount: 86
  },
  stats: {
    totalStudents: 248,
    totalProjects: 86,
    verifiedProjects: 61,
    pendingApprovals: 9,
    facultyCount: 24,
    accreditationScore: 'A++ Tier (NAAC / ABET)',
    profileCompletion: 95
  },
  departmentProjects: [
    {
      id: 'hod-p-1',
      title: 'ProjectVerse: National Capstone Repository',
      studentLead: 'Suraj Rawat (GEHU/2023/CS/104)',
      facultyGuide: 'Dr. Anil Sharma',
      domain: 'Web & Distributed Systems',
      techStack: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Docker'],
      academicYear: '2024 – 2025',
      batch: '2023–2027',
      status: 'Approved',
      naacCompliance: 'Exemplary'
    },
    {
      id: 'hod-p-2',
      title: 'MedChain: FHIR-Compliant Federated Health Vault',
      studentLead: 'Priya Sharma (GEHU/2023/CS/194)',
      facultyGuide: 'Dr. Anil Sharma',
      domain: 'Healthcare & Cryptography',
      techStack: ['Solidity', 'IPFS', 'Next.js', 'ZK-Rollups'],
      academicYear: '2024 – 2025',
      batch: '2023–2027',
      status: 'Pending HOD Seal',
      naacCompliance: 'Compliant'
    },
    {
      id: 'hod-p-3',
      title: 'AgriSense: IoT Hyper-Local Soil Predictor',
      studentLead: 'Karan Joshi (GEHU/2021/CS/042)',
      facultyGuide: 'Dr. Meenakshi Sundaram',
      domain: 'IoT & Embedded Systems',
      techStack: ['ESP32', 'TensorFlow Lite', 'MicroPython'],
      academicYear: '2023 – 2024',
      batch: '2021–2025',
      status: 'Approved',
      naacCompliance: 'Exemplary'
    },
    {
      id: 'hod-p-4',
      title: 'Autonomous Multi-Terrain Rover Guidance',
      studentLead: 'Abhishek Nautiyal (GEHU/2022/CS/088)',
      facultyGuide: 'Dr. Vikramaditya Pant',
      domain: 'Robotics & Automation',
      techStack: ['ROS 2', 'LiDAR', 'SLAM', 'C++'],
      academicYear: '2024 – 2025',
      batch: '2022–2026',
      status: 'Under Faculty Review',
      naacCompliance: 'Pending'
    },
    {
      id: 'hod-p-5',
      title: 'BioSeq: Distributed Genomic Alignment Engine',
      studentLead: 'Shreya Tiwari (GEHU/2022/CS/112)',
      facultyGuide: 'Dr. Neha Kapoor',
      domain: 'Bioinformatics & Cloud',
      techStack: ['Apache Spark', 'Python', 'AWS EMR', 'Rust'],
      academicYear: '2024 – 2025',
      batch: '2022–2026',
      status: 'Approved',
      naacCompliance: 'Compliant'
    }
  ],
  pendingApprovals: [
    {
      id: 'hpa-1',
      projectId: 'hpa-1',
      projectTitle: 'MedChain: FHIR-Compliant Federated Health Vault',
      facultyGuide: 'Dr. Anil Sharma',
      facultyMentor: 'Dr. Anil Sharma',
      studentTeam: 'Priya Sharma & Kavita Joshi',
      teamLead: 'Priya Sharma',
      domain: 'Healthcare & Cryptography',
      submittedDate: 'Yesterday, 06:00 PM',
      departmentToken: 'GEHU-HOD-CSE-2025',
      recommendation: 'Faculty recommendation: 9.6 / 10. Ready for institutional archive seal.',
      complianceCheck: 'HIPAA & FHIR Standard Validated'
    },
    {
      id: 'hpa-2',
      projectId: 'hpa-2',
      projectTitle: 'Autonomous Multi-Terrain Rover Guidance',
      facultyGuide: 'Dr. Vikramaditya Pant',
      facultyMentor: 'Dr. Vikramaditya Pant',
      studentTeam: 'Abhishek Nautiyal & Team',
      teamLead: 'Abhishek Nautiyal',
      domain: 'Robotics & Autonomous Systems',
      submittedDate: '2 days ago',
      departmentToken: 'GEHU-HOD-CSE-2025',
      recommendation: 'Hardware safety and obstacle avoidance verified in departmental lab.',
      complianceCheck: 'Lab Telemetry & Hardware Safety Cleared'
    },
    {
      id: 'hpa-3',
      projectId: 'hpa-3',
      projectTitle: 'NeuralCodec: Ultra-Low Bandwidth Speech Synthesizer',
      facultyGuide: 'Dr. Meenakshi Sundaram',
      facultyMentor: 'Dr. Meenakshi Sundaram',
      studentTeam: 'Rohit Negi',
      teamLead: 'Rohit Negi',
      domain: 'Speech Processing & Edge ML',
      submittedDate: '3 days ago',
      departmentToken: 'GEHU-HOD-CSE-2025',
      recommendation: 'MOS perceptual listening test results attached (4.38 rating).',
      complianceCheck: 'Perceptual Rubric & Benchmark Passed'
    }
  ],
  facultyMembers: [
    {
      id: 'fm-1',
      name: 'Dr. Anil Sharma',
      designation: 'Associate Professor',
      specialization: 'Distributed Systems & Blockchain',
      activeAdvisees: 6,
      pendingReviews: 2,
      averageScore: 9.2,
      email: 'anil.sharma@gehu.ac.in',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'fm-2',
      name: 'Dr. Meenakshi Sundaram',
      designation: 'Professor & Lab Director',
      specialization: 'IoT & Embedded Intelligence',
      activeAdvisees: 5,
      pendingReviews: 1,
      averageScore: 9.5,
      email: 'm.sundaram@gehu.ac.in',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'fm-3',
      name: 'Dr. Vikramaditya Pant',
      designation: 'Assistant Professor',
      specialization: 'Robotics & Autonomous Systems',
      activeAdvisees: 4,
      pendingReviews: 3,
      averageScore: 8.9,
      email: 'v.pant@gehu.ac.in',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'fm-4',
      name: 'Dr. Neha Kapoor',
      designation: 'Associate Professor',
      specialization: 'Bioinformatics & Machine Learning',
      activeAdvisees: 5,
      pendingReviews: 1,
      averageScore: 9.3,
      email: 'neha.kapoor@gehu.ac.in',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
    }
  ],
  complianceStats: {
    continuationRate: 88,
    duplicationBlockedCases: 14,
    industrySponsored: 12,
    accreditationTier: 'Tier-1 NAAC A++'
  },
  domainDistribution: [
    { domain: 'AI & Machine Learning', count: 32 },
    { domain: 'Systems & Cloud', count: 21 },
    { domain: 'Web & Distributed', count: 18 },
    { domain: 'Cybersecurity', count: 15 },
    { domain: 'IoT & Embedded', count: 11 },
    { domain: 'Healthcare', count: 9 }
  ],
  facultyActivity: [
    {
      id: 'fa-1',
      name: 'Dr. Anil Sharma',
      designation: 'Associate Professor',
      activeProjects: 6,
      studentsGuided: 18,
      verificationSpeed: '1.2 days avg',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'fa-2',
      name: 'Dr. Meenakshi Sundaram',
      designation: 'Professor & Lab Director',
      activeProjects: 5,
      studentsGuided: 15,
      verificationSpeed: '0.8 days avg',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'fa-3',
      name: 'Dr. Vikramaditya Pant',
      designation: 'Assistant Professor',
      activeProjects: 4,
      studentsGuided: 12,
      verificationSpeed: '2.4 days avg',
      status: 'Review Due',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'fa-4',
      name: 'Dr. Neha Kapoor',
      designation: 'Associate Professor',
      activeProjects: 5,
      studentsGuided: 14,
      verificationSpeed: '1.5 days avg',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
    }
  ],
  projectDistribution: [
    { domain: 'Artificial Intelligence & Machine Learning', count: 32, percentage: 37 },
    { domain: 'Systems, Cloud & IoT', count: 21, percentage: 24 },
    { domain: 'Web & Distributed Systems', count: 18, percentage: 21 },
    { domain: 'Cybersecurity & Cryptography', count: 15, percentage: 18 }
  ],
  recentInnovationActivity: [
    {
      id: 'ria-1',
      title: 'Indian Patent Filed: Anti-Duplication Capstone Ledger',
      type: 'Patent',
      team: 'ProjectVerse Core Team & Dept of CSE',
      date: 'Oct 2025',
      badge: 'Intellectual Property'
    },
    {
      id: 'ria-2',
      title: 'First Prize: National Smart India Hackathon',
      type: 'National Hackathon',
      team: 'AeroSync Drone Swarm (GEHU + IITB Chapter)',
      date: 'Sept 2025',
      badge: 'Govt of India'
    },
    {
      id: 'ria-3',
      title: 'IEEE Trans. on Industrial Informatics Publication',
      type: 'Paper Publication',
      team: 'AgriSense IoT Micro-Model',
      date: 'Aug 2025',
      badge: 'Q1 Ranked'
    }
  ],
  notifications: [
    {
      id: 'hn-1',
      title: 'Institutional NAAC Review Cycle Opened',
      message: '86 department capstones compiled for the upcoming ABET / NAAC Criterion 2 audit.',
      time: 'Today, 09:00 AM',
      read: false
    },
    {
      id: 'hn-2',
      title: 'New Project Awaiting HOD Endorsement',
      message: 'MedChain (Priya Sharma) has completed faculty review and awaits your sign-off.',
      time: 'Yesterday, 06:00 PM',
      read: false
    },
    {
      id: 'hn-3',
      title: 'Annual Department Allocation Complete',
      message: '35 faculty guides matched with 248 final-year capstone students.',
      time: '3 days ago',
      read: true
    }
  ],
  gettingStartedChecklist: [
    { id: 'hc-1', task: 'Department Authorization Token', completed: true, description: 'GEHU-HOD-CSE-2025 registered on ledger.' },
    { id: 'hc-2', task: 'Verify Department Faculty Registry', completed: true, description: '35 faculty guides registered and mapped.' },
    { id: 'hc-3', task: 'Setup Capstone Evaluation Rubrics', completed: true, description: '10-point NAAC criteria rubric activated.' },
    { id: 'hc-4', task: 'Review Pending Capstone Seals', completed: false, description: '9 projects waiting for executive approval.' },
    { id: 'hc-5', task: 'Export Accreditation Summary', completed: false, description: 'Generate annual capstone audit report.' }
  ]
};

// ---------------------------------------------------------------------------
// 4. ADMIN DEMO DATA (ProjectVerse Admin)
// ---------------------------------------------------------------------------
export const ADMIN_DEMO_DATA: AdminDemoData = {
  profile: {
    id: 'admin-001',
    fullName: 'ProjectVerse Admin',
    email: 'admin@demo.com',
    role: 'ADMIN',
    institution: 'ProjectVerse Open Federation',
    department: 'Federated Infrastructure Office',
    designation: 'Platform Governance & System Administrator',
    bio: 'Lead Root Administrator for ProjectVerse Open Ecosystem ledger, telemetry, verification pipelines, and platform management.',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    verifiedStatus: 'Verified',
    projectsCount: 1426
  },
  stats: {
    totalUsers: 2840,
    students: 2310,
    faculty: 320,
    hods: 82,
    institutions: 48,
    projects: 1426,
    verifiedProjects: 984,
    pendingReports: 7,
    systemHealth: '99.98% Uptime',
    profileCompletion: 100
  },
  systemProjects: [
    {
      id: 'sp-1',
      title: 'ProjectVerse: National Capstone Ecosystem',
      domain: 'Distributed Systems & Cloud',
      lead: 'Suraj Rawat',
      institution: 'Graphic Era Hill University',
      node: 'NODE-GEHU-01',
      status: 'Verified',
      lineage: '2 Inherited Batches'
    },
    {
      id: 'sp-2',
      title: 'AeroSync: Edge-Neuromorphic Drone Guidance',
      domain: 'Autonomous Systems & Robotics',
      lead: 'Devansh Kulkarni',
      institution: 'IIT Bombay',
      node: 'NODE-IITB-04',
      status: 'In Review',
      lineage: '1 Inherited Batch'
    },
    {
      id: 'sp-3',
      title: 'QuantumKey: Post-Quantum TLS 1.3 Handshake',
      domain: 'Cybersecurity & Cryptography',
      lead: 'Rohan Verma',
      institution: 'BITS Pilani',
      node: 'NODE-BITS-02',
      status: 'Verified',
      lineage: '3 Inherited Batches'
    },
    {
      id: 'sp-4',
      title: 'MedChain: FHIR-Compliant Federated Health Vault',
      domain: 'Healthcare & Biotech',
      lead: 'Priya Sharma',
      institution: 'Graphic Era Hill University',
      node: 'NODE-GEHU-01',
      status: 'In Review',
      lineage: '1 Inherited Batch'
    },
    {
      id: 'sp-5',
      title: 'AgriSense: IoT Hyper-Local Soil Predictor',
      domain: 'Clean Energy & IoT',
      lead: 'Karan Joshi',
      institution: 'Graphic Era Hill University',
      node: 'NODE-GEHU-01',
      status: 'Verified',
      lineage: '2 Inherited Batches'
    }
  ],
  recentUsers: [
    {
      id: 'u-101',
      name: 'Suraj Rawat',
      email: 'suraj@gehu.ac.in',
      role: 'STUDENT',
      institution: 'Graphic Era Hill University',
      joinedDate: '2024-08-15',
      joined: '2024-08-15',
      status: 'ACTIVE',
      verified: true
    },
    {
      id: 'u-102',
      name: 'Dr. Anil Sharma',
      email: 'anil.sharma@gehu.ac.in',
      role: 'FACULTY',
      institution: 'Graphic Era Hill University',
      joinedDate: '2022-06-10',
      joined: '2022-06-10',
      status: 'ACTIVE',
      verified: true
    },
    {
      id: 'u-103',
      name: 'Dr. Rajesh Kumar',
      email: 'rajesh.kumar@gehu.ac.in',
      role: 'HOD',
      institution: 'Graphic Era Hill University',
      joinedDate: '2020-01-20',
      joined: '2020-01-20',
      status: 'ACTIVE',
      verified: true
    },
    {
      id: 'u-104',
      name: 'Priya Sharma',
      email: 'priya.sharma@gehu.ac.in',
      role: 'STUDENT',
      institution: 'Graphic Era Hill University',
      joinedDate: '2024-09-01',
      joined: '2024-09-01',
      status: 'ACTIVE',
      verified: true
    },
    {
      id: 'u-105',
      name: 'Dr. Ramesh Sundaram',
      email: 'r.sundaram@iitd.ac.in',
      role: 'FACULTY',
      institution: 'IIT Delhi',
      joinedDate: '2023-04-12',
      joined: '2023-04-12',
      status: 'ACTIVE',
      verified: true
    },
    {
      id: 'u-106',
      name: 'Dr. Alok Verma',
      email: 'a.verma@nitk.ac.in',
      role: 'HOD',
      institution: 'NIT Karnataka',
      joinedDate: '2023-11-05',
      joined: '2023-11-05',
      status: 'ACTIVE',
      verified: true
    },
    {
      id: 'u-107',
      name: 'Rohan Mehra',
      email: 'rohan.mehra@bits-pilani.ac.in',
      role: 'STUDENT',
      institution: 'BITS Pilani',
      joinedDate: '2024-02-18',
      joined: '2024-02-18',
      status: 'PENDING_VERIFICATION',
      verified: false
    }
  ],
  recentProjects: [
    {
      id: 'adm-p-1',
      title: 'ProjectVerse: National Capstone Ecosystem',
      institution: 'Graphic Era Hill University',
      leadAuthor: 'Suraj Rawat',
      domain: 'Web & Distributed Systems',
      submittedDate: 'Today, 10:15 AM',
      status: 'Verified'
    },
    {
      id: 'adm-p-2',
      title: 'AeroSync: Edge-Neuromorphic Drone Guidance',
      institution: 'IIT Bombay',
      leadAuthor: 'Devansh Kulkarni',
      domain: 'Autonomous Systems & Robotics',
      submittedDate: 'Yesterday, 04:15 PM',
      status: 'Pending'
    },
    {
      id: 'adm-p-3',
      title: 'QuantumKey: Post-Quantum TLS 1.3 Handshake',
      institution: 'BITS Pilani',
      leadAuthor: 'Rohan Verma',
      domain: 'Cryptography & Security',
      submittedDate: 'Oct 15, 2025',
      status: 'Verified'
    },
    {
      id: 'adm-p-4',
      title: 'MedChain: FHIR-Compliant Health Vault',
      institution: 'Graphic Era Hill University',
      leadAuthor: 'Priya Sharma',
      domain: 'Healthcare & Cryptography',
      submittedDate: 'Oct 14, 2025',
      status: 'Pending'
    }
  ],
  verificationQueue: [
    {
      id: 'vq-1',
      targetName: 'Graphic Era Hill University (Dehradun Campus)',
      type: 'Institutional Node',
      institution: 'Graphic Era Hill University',
      submittedTime: 'Today, 08:30 AM',
      status: 'VERIFIED'
    },
    {
      id: 'vq-2',
      targetName: 'Dr. Ramesh Sundaram (EMP-IITD-894)',
      type: 'Faculty Identity',
      institution: 'IIT Delhi',
      submittedTime: 'Yesterday, 02:40 PM',
      status: 'VERIFIED'
    },
    {
      id: 'vq-3',
      targetName: 'Rohan Mehra (ID Proof: BITS/2023/CS/19)',
      type: 'Student Roll Proof',
      institution: 'BITS Pilani',
      submittedTime: 'Yesterday, 05:10 PM',
      status: 'PENDING'
    },
    {
      id: 'vq-4',
      targetName: 'IIIT Hyderabad Autonomous Vehicles Lab Node',
      type: 'Research Seal',
      institution: 'IIIT Hyderabad',
      submittedTime: '2 days ago',
      status: 'PENDING'
    }
  ],
  reportedContent: [
    {
      id: 'rep-1',
      contentTitle: 'Smart Traffic Controller Using YOLOv3',
      type: 'Plagiarism Suspect',
      reportedBy: 'Faculty Reviewer (IIT Roorkee)',
      date: 'Today, 11:20 AM',
      severity: 'High',
      status: 'Investigating'
    },
    {
      id: 'rep-2',
      contentTitle: 'Cloud Storage Micro-Architecture',
      type: 'License Infringement',
      reportedBy: 'System Automated Linter',
      date: 'Yesterday',
      severity: 'Medium',
      status: 'Open'
    },
    {
      id: 'rep-3',
      contentTitle: 'CryptoWallet Alpha v1.0',
      type: 'Invalid Academic Proof',
      reportedBy: 'Dept Registry (GEHU)',
      date: 'Oct 12, 2025',
      severity: 'Low',
      status: 'Resolved'
    }
  ],
  platformActivity: [
    {
      id: 'pact-1',
      action: 'ECDSA Root Key Rotated',
      actor: 'System Admin',
      target: 'Anchor Node GEHU-01',
      timestamp: 'Today, 04:00 AM',
      status: 'SUCCESS'
    },
    {
      id: 'pact-2',
      action: 'Institutional SAML Bridge Synced',
      actor: 'Identity Federation Worker',
      target: '48 Partner Universities',
      timestamp: 'Today, 07:15 AM',
      status: 'SUCCESS'
    },
    {
      id: 'pact-3',
      action: 'Anti-Duplication Hash Match Triggered',
      actor: 'Lineage Inspector',
      target: 'Project ID #893 vs #104',
      timestamp: 'Yesterday, 09:30 PM',
      status: 'WARNING'
    },
    {
      id: 'pact-4',
      action: 'Automated Snapshot Archival',
      actor: 'Backup Daemon',
      target: 'AWS S3 Glacier Deep Archive',
      timestamp: 'Yesterday, 11:59 PM',
      status: 'SUCCESS'
    }
  ],
  systemOverview: {
    activeNodes: 48,
    totalConsensusTransactions: 184520,
    averageLatencyMs: 14.2,
    samlIntegrations: 48,
    storageUsedGb: 142.8,
    uptimePercent: 99.98
  },
  notifications: [
    {
      id: 'an-1',
      title: 'Institutional Federation Milestone',
      message: '48 universities actively validating project lineage through federated ledger.',
      time: 'Today, 07:15 AM',
      read: false
    },
    {
      id: 'an-2',
      title: 'Plagiarism Flag Under Investigation',
      message: 'High priority flag raised on repository #893 awaiting administrator resolution.',
      time: 'Today, 11:20 AM',
      read: false
    },
    {
      id: 'an-3',
      title: 'Daily Cryptographic Root Verification Passed',
      message: 'Zero hash discrepancies detected across 1,426 registered project passports.',
      time: 'Today, 04:00 AM',
      read: true
    }
  ],
  gettingStartedChecklist: [
    { id: 'ac-1', task: 'Root Key Management', completed: true, description: 'ECDSA primary signing certificate active.' },
    { id: 'ac-2', task: 'Institutional SSO Bridges', completed: true, description: '48 national university SAML endpoints online.' },
    { id: 'ac-3', task: 'Review Flagged Submissions', completed: false, description: 'Resolve 2 active content reports.' },
    { id: 'ac-4', task: 'Audit Verification Queue', completed: false, description: '2 pending institutional identity applications.' },
    { id: 'ac-5', task: 'Backup & Disaster Recovery Drill', completed: true, description: 'Verified immutable snapshot replication.' }
  ]
};

// ---------------------------------------------------------------------------
// CENTRAL DEMO DATA RESOLVER FOR ANY ROLE & NEW USER ACCOUNTS
// ---------------------------------------------------------------------------

export const ROLE_DEMO_DATA = {
  STUDENT: STUDENT_DEMO_DATA,
  FACULTY: FACULTY_DEMO_DATA,
  HOD: HOD_DEMO_DATA,
  ADMIN: ADMIN_DEMO_DATA
};

/**
 * Returns structured demo data for a given role.
 * If user profile exists, overlays their actual profile fields so their name/email/department
 * are accurately shown without losing the rich dashboard content.
 */
export function getRoleDemoData(role: UserRole, userProfile?: UserProfile | null) {
  // Normalize roles to the primary 4:
  let effectiveRole: 'STUDENT' | 'FACULTY' | 'HOD' | 'ADMIN' = 'STUDENT';
  if (role === 'FACULTY') effectiveRole = 'FACULTY';
  else if (role === 'HOD') effectiveRole = 'HOD';
  else if (role === 'ADMIN') effectiveRole = 'ADMIN';
  else effectiveRole = 'STUDENT';

  const baseData = ROLE_DEMO_DATA[effectiveRole];

  if (!userProfile) {
    return { ...baseData };
  }

  // Merge profile information seamlessly
  const mergedProfile: UserProfile = {
    ...baseData.profile,
    ...userProfile,
    fullName: userProfile.fullName || baseData.profile.fullName,
    email: userProfile.email || baseData.profile.email,
    institution: userProfile.institution || baseData.profile.institution,
    department: userProfile.department || baseData.profile.department,
    role: effectiveRole,
    verifiedStatus: userProfile.verifiedStatus || baseData.profile.verifiedStatus || 'Verified'
  };

  return {
    ...baseData,
    profile: mergedProfile
  };
}

/**
 * New user starter state (used when account was freshly registered)
 */
export function getNewUserStarterState(role: UserRole, name: string) {
  switch (role) {
    case 'FACULTY':
      return {
        completion: 40,
        badge: 'Faculty Advisor',
        welcomeSubtitle: 'Your faculty advisory desk is set up. You can now review student project passports, guide capstone cohorts, and issue academic verification seals.',
        checklist: [
          { id: '1', task: 'Complete Faculty Profile', completed: true, desc: 'Add research specializations and office hours.' },
          { id: '2', task: 'Review Verification Queue', completed: false, desc: 'Evaluate student capstone submissions awaiting signature.' },
          { id: '3', task: 'Set Up Mentorship Capacity', completed: false, desc: 'Specify available slots for upcoming capstone batches.' }
        ]
      };
    case 'HOD':
      return {
        completion: 35,
        badge: 'HOD Executive Portal',
        welcomeSubtitle: 'Your departmental governance node is active. Monitor department-wide project metrics, approve capstone submissions, and track NAAC compliance.',
        checklist: [
          { id: '1', task: 'Confirm Department Token', completed: true, desc: 'Institutional authorization key verified.' },
          { id: '2', task: 'Review Faculty Guides', completed: false, desc: 'Assign mentors to incoming final-year capstone batches.' },
          { id: '3', task: 'Approve Pending Seals', completed: false, desc: 'Sign off on faculty-evaluated project passports.' }
        ]
      };
    case 'ADMIN':
      return {
        completion: 100,
        badge: 'System Administrator',
        welcomeSubtitle: 'Root governance access active. Monitor institutional nodes, audit verification workflows, and manage cross-campus credentials.',
        checklist: [
          { id: '1', task: 'Verify Institutional Node Health', completed: true, desc: 'All 48 federated campus nodes synchronized.' },
          { id: '2', task: 'Review Verification Queue', completed: false, desc: 'Approve new faculty and student identity requests.' },
          { id: '3', task: 'Check Flagged Content Reports', completed: false, desc: 'Review automated plagiarism and license notices.' }
        ]
      };
    case 'STUDENT':
    default:
      return {
        completion: 35,
        badge: 'Student Innovator',
        welcomeSubtitle: 'Welcome to ProjectVerse. Build verified project passports, collaborate with peers across institutions, and preserve your engineering lineage.',
        checklist: [
          { id: '1', task: 'Profile Initialized', completed: true, desc: 'Academic details recorded.' },
          { id: '2', task: 'Publish First Project Passport', completed: false, desc: 'Document your capstone architecture and tech stack.' },
          { id: '3', task: 'Request Faculty Verification', completed: false, desc: 'Submit your project to your advisor for evaluation.' }
        ]
      };
  }
}
