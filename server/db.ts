import { 
  UserRole, 
  AccountStatus, 
  GranularVerificationStates, 
  VerificationStatuses,
  ProjectItem, 
  ProjectType, 
  VerificationRequest,
  DocumentType,
  RegistrationRequest,
  RegistrationStatus,
  RegistrationDocument
} from '../src/types';

export interface ServerVerificationStatus {
  accountStatus: AccountStatus;
  email: 'VERIFIED' | 'UNVERIFIED';
  mobile: 'VERIFIED' | 'UNVERIFIED';
  institution: 'VERIFIED' | 'UNVERIFIED';
  academic: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NOT_APPLICABLE';
  document: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NOT_REQUIRED';
  contribution: 'PENDING' | 'VERIFIED' | 'REJECTED';
  rejectionReason?: string;
  githubConnected?: boolean;
  linkedInAdded?: boolean;
  portfolioAdded?: boolean;
  // Compatibility boolean properties
  emailVerified: boolean;
  institutionVerified: boolean;
  academicVerified: boolean;
  documentVerified: boolean;
  facultyReviewed: boolean;
  contributionVerified: boolean;
}

export function buildVerificationStatus(partial: any = {}): ServerVerificationStatus {
  const emailVerified = partial.email === 'VERIFIED' || partial.emailVerified === true;
  const mobileVerified = partial.mobile === 'VERIFIED' || partial.mobileVerified === true;
  const academic = partial.academic || (partial.academicVerified ? 'VERIFIED' : 'PENDING');
  const document = partial.document || (partial.documentVerified ? 'VERIFIED' : 'PENDING');
  const institution = partial.institution || (partial.institutionVerified ? 'VERIFIED' : 'UNVERIFIED');
  const contribution = partial.contribution || (partial.contributionVerified ? 'VERIFIED' : 'PENDING');
  const accountStatus = partial.accountStatus || 'ACTIVE';

  return {
    accountStatus,
    email: emailVerified ? 'VERIFIED' : 'UNVERIFIED',
    mobile: mobileVerified ? 'VERIFIED' : 'UNVERIFIED',
    institution,
    academic,
    document,
    contribution,
    rejectionReason: partial.rejectionReason,
    githubConnected: Boolean(partial.githubConnected),
    linkedInAdded: Boolean(partial.linkedInAdded),
    portfolioAdded: Boolean(partial.portfolioAdded),
    emailVerified,
    institutionVerified: institution === 'VERIFIED',
    academicVerified: academic === 'VERIFIED',
    documentVerified: document === 'VERIFIED',
    facultyReviewed: Boolean(partial.facultyReviewed ?? (academic === 'VERIFIED')),
    contributionVerified: contribution === 'VERIFIED'
  };
}

export interface ServerUser {
  id: string;
  email: string;
  mobile?: string;
  passwordHash: string;
  fullName: string;
  role: UserRole;
  status: AccountStatus;
  avatar: string;
  bio?: string;
  skills: string[];
  
  // Verification states
  verification: ServerVerificationStatus;
  
  // Identity-specific attributes
  // Student & Alumni
  institution?: string;
  department?: string;
  course?: string;
  batch?: string;
  graduationYear?: string;
  rollNumber?: string;
  studentType?: 'CURRENT_STUDENT' | 'ALUMNI';
  
  // Developer & Industry
  currentOrganization?: string;
  currentJobRole?: string;
  experienceYears?: number;
  githubHandle?: string;
  linkedIn?: string;
  portfolio?: string;
  
  // Researcher
  researchInterests?: string[];
  publicationsCount?: number;
  
  // Faculty & HOD
  facultyId?: string;
  designation?: string;
  departmentToken?: string;
  
  // Institution
  institutionType?: string;
  officialDomain?: string;
  contactPerson?: string;
  address?: string;
  website?: string;

  // Reviewer Authorization & Mentorship
  isAuthorizedReviewer?: boolean;
  reviewerCategories?: Array<'ACADEMIC' | 'TECHNICAL' | 'RESEARCH' | 'ORGANIZATION'>;
  availableForMentorship?: boolean;

  // Metadata
  projectsCount: number;
  createdAt: string;
}

export interface OTPRecord {
  email: string;
  code: string;
  expiresAt: number;
  verified: boolean;
}

export interface AuthSessionRecord {
  token: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
}

// Initial In-Memory Seed Users
const SEED_USERS: ServerUser[] = [
  {
    id: 'student-001',
    email: 'suraj@student.demo',
    passwordHash: 'Student@123',
    fullName: 'Suraj Rawat',
    role: 'STUDENT',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Full-stack builder and systems researcher passionate about developer tools, distributed computing, and web performance.',
    skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'MongoDB', 'C++', 'DSA', 'Git/GitHub'],
    verification: buildVerificationStatus({
      emailVerified: true,
      institutionVerified: true,
      academicVerified: true,
      documentVerified: true,
      facultyReviewed: true,
      contributionVerified: true
    }),
    institution: 'Graphic Era Hill University',
    department: 'Dept of Computer Science & Engineering',
    course: 'BCA',
    batch: '2023–2027',
    rollNumber: 'GEHU/2023/BCA/089',
    studentType: 'CURRENT_STUDENT',
    githubHandle: 'surajrawat-dev',
    linkedIn: 'linkedin.com/in/suraj-rawat',
    portfolio: 'surajrawat.me',
    projectsCount: 6,
    createdAt: '2025-08-10T10:00:00.000Z'
  },
  {
    id: 'faculty-001',
    email: 'faculty@demo.com',
    passwordHash: 'Faculty@123',
    fullName: 'Dr. Ananya Sharma',
    role: 'FACULTY',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio: 'Assistant Professor in Computer Science & Engineering. Guiding undergraduate and postgraduate capstone initiatives and peer reviews.',
    skills: ['AI/ML', 'Computer Vision', 'Distributed Systems', 'Academic Peer Review'],
    verification: buildVerificationStatus({
      emailVerified: true,
      institutionVerified: true,
      academicVerified: true,
      documentVerified: true,
      facultyReviewed: true,
      contributionVerified: true
    }),
    institution: 'Graphic Era Hill University',
    department: 'Computer Science & Engineering',
    facultyId: 'EMP-GEHU-FAC-409',
    designation: 'Assistant Professor',
    isAuthorizedReviewer: true,
    reviewerCategories: ['ACADEMIC', 'TECHNICAL'],
    availableForMentorship: true,
    projectsCount: 12,
    createdAt: '2025-05-10T10:00:00.000Z'
  },
  {
    id: 'hod-001',
    email: 'hod@demo.com',
    passwordHash: 'Hod@123',
    fullName: 'Dr. Rajesh Mehta',
    role: 'HOD',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    bio: 'Head of Department, Computer Science. Overseeing department capstones, verification seals, institutional compliance, and faculty guidance.',
    skills: ['Curriculum Design', 'Academic Governance', 'Accreditation', 'Capstone Verification'],
    verification: buildVerificationStatus({
      emailVerified: true,
      institutionVerified: true,
      academicVerified: true,
      documentVerified: true,
      facultyReviewed: true,
      contributionVerified: true
    }),
    institution: 'Graphic Era Hill University',
    department: 'Computer Science',
    facultyId: 'HOD-CSE-001',
    designation: 'Professor & Head of Department',
    departmentToken: 'GEHU-HOD-CSE-2025',
    isAuthorizedReviewer: true,
    reviewerCategories: ['ACADEMIC'],
    availableForMentorship: true,
    projectsCount: 86,
    createdAt: '2025-04-01T10:00:00.000Z'
  },
  {
    id: 'admin-001',
    email: 'admin@demo.com',
    passwordHash: 'Admin@123',
    fullName: 'ProjectVerse Admin',
    role: 'ADMIN',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    bio: 'Lead Root Administrator for ProjectVerse Open Ecosystem ledger, telemetry, verification pipelines, and platform management.',
    skills: ['Platform Architecture', 'Network Administration', 'Ledger Governance', 'Identity Access Control'],
    verification: buildVerificationStatus({
      emailVerified: true,
      institutionVerified: true,
      academicVerified: true,
      documentVerified: true,
      facultyReviewed: true,
      contributionVerified: true
    }),
    institution: 'ProjectVerse Open Federation',
    department: 'Federated Infrastructure Office',
    facultyId: 'ROOT-ADMIN-01',
    designation: 'Platform Governance & System Administrator',
    isAuthorizedReviewer: true,
    reviewerCategories: ['ACADEMIC', 'TECHNICAL', 'RESEARCH', 'ORGANIZATION'],
    projectsCount: 1426,
    createdAt: '2025-01-01T10:00:00.000Z'
  },
  {
    id: 'usr-student-01',
    email: 'suraj@gehu.ac.in',
    passwordHash: 'Suraj@123',
    fullName: 'Suraj Rawat',
    role: 'STUDENT',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Undergraduate researcher focusing on autonomous systems, distributed edge micro-services, and verifiable project architectures.',
    skills: ['React', 'TypeScript', 'Node.js', 'PyTorch', 'ROS 2', 'PostgreSQL'],
    verification: buildVerificationStatus({
      emailVerified: true,
      institutionVerified: true,
      academicVerified: true,
      documentVerified: true,
      facultyReviewed: true,
      contributionVerified: true
    }),
    institution: 'Graphic Era Hill University',
    department: 'Dept of Computer Science & Engineering',
    course: 'B.Tech CSE',
    batch: '2023–2027',
    rollNumber: 'GEHU/2022/CS/089',
    studentType: 'CURRENT_STUDENT',
    githubHandle: 'surajrawat-dev',
    linkedIn: 'linkedin.com/in/surajrawat',
    portfolio: 'surajrawat.me',
    projectsCount: 2,
    createdAt: '2025-08-10T10:00:00.000Z'
  },
  {
    id: 'usr-alumni-01',
    email: 'rohan.alumni@gehu.ac.in',
    passwordHash: 'Rohan@123',
    fullName: 'Rohan Verma',
    role: 'ALUMNI',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Alumni & Distributed Systems Engineer. Mentoring capstone project continuations across universities.',
    skills: ['Rust', 'Go', 'Distributed Consensus', 'Smart Contracts', 'System Architecture'],
    verification: buildVerificationStatus({
      emailVerified: true,
      institutionVerified: true,
      academicVerified: true,
      documentVerified: true,
      facultyReviewed: true,
      contributionVerified: true
    }),
    institution: 'Graphic Era Hill University',
    department: 'Dept of Computer Science & Engineering',
    course: 'BCA / B.Tech',
    graduationYear: '2024',
    rollNumber: 'GEHU/2020/CS/042',
    studentType: 'ALUMNI',
    currentOrganization: 'Hyperledger Foundation / Tech Labs',
    currentJobRole: 'Distributed Systems Engineer',
    githubHandle: 'rohanverma-alumni',
    linkedIn: 'linkedin.com/in/rohanverma-dev',
    portfolio: 'rohanverma.io',
    projectsCount: 4,
    createdAt: '2025-07-20T10:00:00.000Z'
  },
  {
    id: 'usr-dev-01',
    email: 'alex.dev@openverse.org',
    passwordHash: 'Alex@1234',
    fullName: 'Alex Chen',
    role: 'DEVELOPER',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    bio: 'Open-source systems engineer & core maintainer. Specializes in WASM runtimes, kernel bypass, and distributed databases.',
    skills: ['Rust', 'WebAssembly', 'C++', 'Linux Kernel', 'Docker', 'Distributed Systems'],
    verification: buildVerificationStatus({
      emailVerified: true,
      institutionVerified: false,
      academicVerified: false,
      documentVerified: false,
      facultyReviewed: false,
      contributionVerified: true
    }),
    currentOrganization: 'Open Source Collective',
    currentJobRole: 'Staff Systems Architect',
    githubHandle: 'alexchen-sys',
    portfolio: 'alexchen.dev',
    linkedIn: 'linkedin.com/in/alexchen-sys',
    experienceYears: 6,
    isAuthorizedReviewer: true,
    reviewerCategories: ['TECHNICAL'],
    availableForMentorship: true,
    projectsCount: 5,
    createdAt: '2025-09-01T10:00:00.000Z'
  },
  {
    id: 'usr-researcher-01',
    email: 'dr.elena@deepmind-labs.org',
    passwordHash: 'Elena@123',
    fullName: 'Dr. Elena Rostova',
    role: 'RESEARCHER',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio: 'Research Scientist specializing in foundation model alignments, federated privacy, and neuro-symbolic reasoning.',
    skills: ['PyTorch', 'JAX', 'Neuromorphic Computing', 'Differential Privacy', 'Formal Verification'],
    verification: buildVerificationStatus({
      emailVerified: true,
      institutionVerified: true,
      academicVerified: true,
      documentVerified: true,
      facultyReviewed: true,
      contributionVerified: true
    }),
    institution: 'Autonomous AI Institute',
    researchInterests: ['Foundation Models', 'Neuromorphic Guidance', 'Formal Proofs'],
    publicationsCount: 14,
    githubHandle: 'elena-rostova-ai',
    portfolio: 'rostova-research.ai',
    isAuthorizedReviewer: true,
    reviewerCategories: ['RESEARCH'],
    availableForMentorship: true,
    projectsCount: 3,
    createdAt: '2025-08-15T10:00:00.000Z'
  },
  {
    id: 'usr-industry-01',
    email: 'vikram.singh@hypercloud.io',
    passwordHash: 'Vikram@123',
    fullName: 'Vikram Singh',
    role: 'INDUSTRY_PROFESSIONAL',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    bio: 'VP of Engineering at HyperCloud. Sponsoring university capstones and transitioning open projects into industrial pilots.',
    skills: ['Cloud Architecture', 'Kubernetes', 'Multi-tenant Systems', 'Security Compliance', 'Mentorship'],
    verification: buildVerificationStatus({
      emailVerified: true,
      institutionVerified: true,
      academicVerified: false,
      documentVerified: false,
      facultyReviewed: false,
      contributionVerified: true
    }),
    currentOrganization: 'HyperCloud Solutions',
    currentJobRole: 'VP of Infrastructure Engineering',
    linkedIn: 'linkedin.com/in/vikram-singh-cloud',
    portfolio: 'vikramcloud.com',
    experienceYears: 12,
    isAuthorizedReviewer: true,
    reviewerCategories: ['ORGANIZATION', 'TECHNICAL'],
    availableForMentorship: true,
    projectsCount: 7,
    createdAt: '2025-07-01T10:00:00.000Z'
  },
  {
    id: 'usr-faculty-01',
    email: 'anil.sharma@gehu.ac.in',
    passwordHash: 'Anil@1234',
    fullName: 'Dr. Anil Sharma',
    role: 'FACULTY',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Associate Professor & Senior Research Advisor in Artificial Intelligence, Edge Computing, and Computer Vision.',
    skills: ['AI/ML', 'Computer Vision', 'Edge Systems', 'Academic Peer Review'],
    verification: buildVerificationStatus({
      emailVerified: true,
      institutionVerified: true,
      academicVerified: true,
      documentVerified: true,
      facultyReviewed: true,
      contributionVerified: true
    }),
    institution: 'Graphic Era Hill University',
    department: 'Dept of Computer Science & Engineering',
    facultyId: 'EMP-GEHU-FAC-409',
    designation: 'Associate Professor & Senior Research Advisor',
    isAuthorizedReviewer: true,
    reviewerCategories: ['ACADEMIC'],
    availableForMentorship: true,
    projectsCount: 14,
    createdAt: '2025-05-10T10:00:00.000Z'
  },
  {
    id: 'usr-hod-01',
    email: 'rajesh.kumar@gehu.ac.in',
    passwordHash: 'Rajesh@123',
    fullName: 'Dr. Rajesh Kumar',
    role: 'HOD',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    bio: 'Head of Department, Computer Science & Engineering. Overseeing capstone governance, institutional accreditation, and NAAC/ABET compliance.',
    skills: ['Curriculum Design', 'Academic Governance', 'Accreditation', 'Capstone Verification'],
    verification: buildVerificationStatus({
      emailVerified: true,
      institutionVerified: true,
      academicVerified: true,
      documentVerified: true,
      facultyReviewed: true,
      contributionVerified: true
    }),
    institution: 'Graphic Era Hill University',
    department: 'Dept of Computer Science & Engineering',
    facultyId: 'HOD-CSE-001',
    designation: 'Professor & Head of Department',
    departmentToken: 'GEHU-HOD-CSE-2025',
    isAuthorizedReviewer: true,
    reviewerCategories: ['ACADEMIC'],
    availableForMentorship: true,
    projectsCount: 48,
    createdAt: '2025-04-01T10:00:00.000Z'
  },
  {
    id: 'usr-institution-01',
    email: 'registrar@gehu.ac.in',
    passwordHash: 'Gehu@2026',
    fullName: 'Graphic Era Hill University Node',
    role: 'INSTITUTION',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1562774053-701939374585?w=150&auto=format&fit=crop&q=80',
    bio: 'Institutional federated node for Graphic Era Hill University. Governs academic proof of work, capstone registry, and NAAC metrics.',
    skills: ['Academic Accreditation', 'Institutional Ledger', 'SAML SSO', 'Research Governance'],
    verification: buildVerificationStatus({
      emailVerified: true,
      institutionVerified: true,
      academicVerified: true,
      documentVerified: true,
      facultyReviewed: true,
      contributionVerified: true
    }),
    institution: 'Graphic Era Hill University',
    institutionType: 'University / Higher Education Node',
    officialDomain: 'gehu.ac.in',
    website: 'https://gehu.ac.in',
    contactPerson: 'Office of the Registrar & Dean Academics',
    address: 'Society Area, Clement Town, Dehradun, Uttarakhand 248002',
    isAuthorizedReviewer: true,
    reviewerCategories: ['ACADEMIC', 'ORGANIZATION'],
    projectsCount: 160,
    createdAt: '2025-01-01T10:00:00.000Z'
  },
  {
    id: 'usr-admin-01',
    email: 'admin@gehu.ac.in',
    passwordHash: 'Admin@1234',
    fullName: 'Root Network Administrator',
    role: 'ADMIN',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    bio: 'Lead Root Administrator for ProjectVerse Open Ecosystem ledger, telemetry, and identity access control.',
    skills: ['Network Administration', 'Ledger Governance', 'SAML SSO', 'Node Consensus'],
    verification: buildVerificationStatus({
      emailVerified: true,
      institutionVerified: true,
      academicVerified: true,
      documentVerified: true,
      facultyReviewed: true,
      contributionVerified: true
    }),
    institution: 'ProjectVerse Open Federation',
    department: 'Federated Infrastructure Office',
    facultyId: 'ROOT-ADMIN-01',
    designation: 'Chief Network Administrator',
    isAuthorizedReviewer: true,
    reviewerCategories: ['ACADEMIC', 'TECHNICAL', 'RESEARCH', 'ORGANIZATION'],
    projectsCount: 240,
    createdAt: '2025-01-01T10:00:00.000Z'
  }
];

// Seed Projects with all 4 Project Types (Academic, Open Source, Research, Industry)
const SEED_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    passportId: 'PV-2026-GEHU-CAP089',
    title: 'AeroSync: Edge-Neuromorphic Drone Swarm Guidance',
    tagline: 'Sub-millisecond visual-inertial odometry for search & rescue swarms',
    description: 'Decentralized optical-flow guidance for GPS-denied environments running on custom neuromorphic edge hardware. Engineered to allow search and rescue micro-drones to maintain millimeter-accurate relative positioning.',
    projectType: 'ACADEMIC',
    domain: 'Autonomous Systems & Robotics',
    techStack: ['ROS 2', 'PyTorch', 'C++', 'Spinnaker', 'CUDA'],
    skillsRequired: ['ROS 2', 'PyTorch', 'Embedded C++', 'Computer Vision'],
    teamRequirements: 'Looking for 2 robotics / embedded engineers for next batch hardware test flights.',
    institution: 'Graphic Era Hill University',
    department: 'Computer Science & Engineering',
    academicYear: '2025–2026',
    status: 'Verified',
    difficulty: 'Advanced',
    course: 'B.Tech Computer Science & Engineering',
    batch: 'Batch 2023–2027',
    facultyAdvisor: 'Dr. Anil Sharma',
    repositoryUrl: 'https://github.com/projectverse-org/aerosync-swarm',
    demoUrl: 'https://aerosync.projectverse.dev',
    documentationUrl: 'https://docs.projectverse.dev/aerosync',
    problem: 'GPS-denied search and rescue operations experience catastrophic drone swarm collisions and lost signal links in collapsed urban structures.',
    solution: 'Neuromorphic spike-based visual odometry that processes photon changes directly at the sensor layer with sub-millisecond latency without reliance on external RF beacons.',
    contributors: [
      {
        name: 'Suraj Rawat',
        role: 'Swarm Lead & Firmware',
        institution: 'Graphic Era Hill University',
        batch: "B.Tech '26",
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        githubHandle: 'surajrawat-dev',
        commitsCount: 384
      },
      {
        name: 'Arjun Mehta',
        role: 'Neuromorphic Vision Engineer',
        institution: 'Graphic Era Hill University',
        batch: "B.Tech '26",
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        githubHandle: 'arjunm-robo',
        commitsCount: 246
      }
    ],
    lineageBatchesCount: 3,
    githubStars: 142,
    githubCommits: 630,
    openRoles: ['Neuromorphic Vision Engineer', 'Embedded C++ Specialist', 'Flight Dynamics QA'],
    coverGradient: 'from-blue-600/20 via-indigo-600/10 to-transparent',
    featured: true,
    lineage: [
      {
        year: '2024',
        batchName: 'Batch 2024 (Foundation)',
        institution: 'Graphic Era Hill University',
        leadContributors: ['Rohan Verma', 'Kavita Joshi'],
        keyMilestones: ['Single-drone optical flow prototype', 'ROS 2 integration baseline'],
        commits: 210,
        pullRequests: 18,
        activeStatus: 'Completed',
        summary: 'Pioneered the baseline monocular vision pipeline on Jetson Nano.'
      },
      {
        year: '2025',
        batchName: 'Batch 2025 (Swarm Extension)',
        institution: 'Graphic Era Hill University',
        leadContributors: ['Suraj Rawat', 'Arjun Mehta'],
        keyMilestones: ['Multi-agent consensus algorithm', 'Spinnaker neuromorphic sensor integration'],
        commits: 420,
        pullRequests: 42,
        activeStatus: 'Current',
        summary: 'Transformed single drone into an auto-coordinating 5-agent micro-swarm.'
      }
    ],
    passport: {
      passportId: 'PV-2026-GEHU-CAP089',
      qrHash: 'sha256-8f43b2a9910d8ef4e11c7782ad9044b2049e7b29a',
      projectName: 'AeroSync: Edge-Neuromorphic Drone Swarm Guidance',
      tagline: 'Sub-millisecond visual-inertial odometry for search & rescue swarms',
      institution: 'Graphic Era Hill University',
      department: 'Computer Science & Engineering',
      academicYear: '2025–2026',
      originalBatch: '2024',
      currentBatch: '2025',
      status: 'Verified',
      license: 'MIT / Academic Open Ledger',
      techStack: ['ROS 2', 'PyTorch', 'C++', 'Spinnaker', 'CUDA'],
      githubRepo: 'https://github.com/projectverse-org/aerosync-swarm',
      totalCommits: 630,
      activeContributors: 4,
      mergedPRs: 60,
      codeHealthScore: 98,
      testCoverage: 94,
      stars: 142,
      forks: 28,
      facultyReviewer: {
        name: 'Dr. Anil Sharma',
        designation: 'Associate Professor & Senior Research Advisor',
        department: 'Dept of Computer Science & Engineering',
        institution: 'Graphic Era Hill University',
        score: 9.6,
        reviewText: 'Outstanding edge computing architecture and modular ROS 2 implementation. Validated for next-batch continuation.',
        verifiedAt: '15 Aug 2025',
        signatureHash: 'sig_ed25519_8f0a21bc9e47201bfa82110c4d8e'
      },
      institutionalValidationCode: 'GEHU-CSE-2025-CAP-VERIFIED-NODE-01',
      rubricScores: {
        novelty: 9.8,
        technicalRigor: 9.5,
        documentation: 9.4,
        continuityPotential: 9.9
      }
    }
  },
  {
    id: 'proj-2',
    passportId: 'PV-2026-OSS-CORE012',
    title: 'WasmMesh: Distributed P2P Microservice Fabric',
    tagline: 'High-throughput WebAssembly runtime mesh over libp2p',
    description: 'An open-source, serverless computing mesh where nodes execute isolated WebAssembly bytecode and route requests peer-to-peer without central gateways.',
    projectType: 'OPEN_SOURCE',
    domain: 'Distributed Systems & Cloud',
    techStack: ['Rust', 'WebAssembly', 'libp2p', 'Tokio', 'Docker'],
    skillsRequired: ['Rust', 'Wasmtime', 'Distributed P2P', 'Network Protocols'],
    teamRequirements: 'Looking for open-source contributors and maintainers with Rust async experience.',
    institution: 'Open Source Community',
    department: 'Distributed Systems Collective',
    academicYear: '2026',
    status: 'Active Development',
    difficulty: 'Advanced',
    license: 'Apache 2.0',
    contributionGuidelines: 'https://github.com/projectverse-org/wasmmesh/blob/main/CONTRIBUTING.md',
    maintainers: ['Alex Chen', 'Rohan Verma'],
    repositoryUrl: 'https://github.com/projectverse-org/wasmmesh',
    demoUrl: 'https://wasmmesh.network',
    documentationUrl: 'https://docs.wasmmesh.network',
    problem: 'Traditional serverless clouds impose heavy cold starts, vendor lock-in, and costly egress bandwidth fees.',
    solution: 'Lightweight WebAssembly workers scheduled over a cryptographic libp2p mesh running across heterogeneous edge devices with sub-10ms warm starts.',
    contributors: [
      {
        name: 'Alex Chen',
        role: 'Core Maintainer',
        institution: 'Open Source Collective',
        batch: 'Open Source Maintainer',
        avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
        githubHandle: 'alexchen-sys',
        commitsCount: 520
      },
      {
        name: 'Rohan Verma',
        role: 'Distributed Consensus Advisor',
        institution: 'Hyperledger / Alumni',
        batch: "Alumni '24",
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        githubHandle: 'rohanverma-alumni',
        commitsCount: 310
      }
    ],
    lineageBatchesCount: 2,
    githubStars: 418,
    githubCommits: 890,
    openRoles: ['Core Engine Rust Dev', 'Documentation Lead', 'Benchmark Engineer'],
    coverGradient: 'from-cyan-600/20 via-blue-600/10 to-transparent',
    featured: true,
    lineage: [
      {
        year: '2025',
        batchName: 'Phase 1 Core Engine',
        institution: 'Open Source Community',
        leadContributors: ['Alex Chen'],
        keyMilestones: ['Wasmtime sandboxing', 'libp2p peer discovery baseline'],
        commits: 410,
        pullRequests: 32,
        activeStatus: 'Completed',
        summary: 'Delivered proof of concept running 100 concurrent tasks across 8 nodes.'
      }
    ],
    passport: {
      passportId: 'PV-2026-OSS-CORE012',
      qrHash: 'sha256-42bc9810efaa1094ba8110efcd9821a00941',
      projectName: 'WasmMesh: Distributed P2P Microservice Fabric',
      tagline: 'High-throughput WebAssembly runtime mesh over libp2p',
      institution: 'Open Source Community',
      department: 'Distributed Systems Collective',
      academicYear: '2026',
      originalBatch: '2025',
      currentBatch: '2026',
      status: 'Active Development',
      license: 'Apache 2.0',
      techStack: ['Rust', 'WebAssembly', 'libp2p', 'Tokio', 'Docker'],
      githubRepo: 'https://github.com/projectverse-org/wasmmesh',
      totalCommits: 890,
      activeContributors: 6,
      mergedPRs: 84,
      codeHealthScore: 97,
      testCoverage: 91,
      stars: 418,
      forks: 64,
      facultyReviewer: {
        name: 'Peer Review Consortium',
        designation: 'Open Source Security Council',
        department: 'Independent Review',
        institution: 'Open Collective',
        score: 9.5,
        reviewText: 'Extremely clean memory isolation model with zero CVE regressions in static fuzzing.',
        verifiedAt: '02 Feb 2026',
        signatureHash: 'sig_oss_verified_94a02bc411'
      },
      institutionalValidationCode: 'OSS-VERIFIED-PROJECT-CODE-77',
      rubricScores: {
        novelty: 9.6,
        technicalRigor: 9.8,
        documentation: 9.1,
        continuityPotential: 9.7
      }
    }
  },
  {
    id: 'proj-3',
    passportId: 'PV-2026-RES-AI901',
    title: 'NeuroSymbolic-Med: Verifiable Clinical Diagnostic Reasoning',
    tagline: 'Integrating transformer representations with medical ontologies',
    description: 'Combining deep transformer vision-language embeddings with formal SNOMED-CT knowledge graphs to produce provably compliant clinical radiology interpretations.',
    projectType: 'RESEARCH',
    domain: 'Healthcare & Biotech',
    techStack: ['Python', 'PyTorch', 'SNOMED-CT', 'Neo4j', 'FastAPI'],
    skillsRequired: ['PyTorch', 'Knowledge Graphs', 'BioNLP', 'Clinical AI'],
    teamRequirements: 'Seeking collaborative research fellows and biostatistics graduate students.',
    institution: 'Autonomous AI Institute & Healthcare Labs',
    department: 'Translational AI Research Group',
    academicYear: '2025–2026',
    status: 'Verified',
    difficulty: 'Advanced',
    researchArea: 'Neuro-Symbolic Artificial Intelligence & Medical NLP',
    researchStage: 'Phase 2: Multicenter Clinical Retrospective Validation',
    publications: [
      'NeuroSymbolic Clinical Reasoning over SNOMED-CT Ontologies (NeurIPS Workshop 2025)',
      'Provable Bounds on Transformer Hallucinations in Radiology Reports (Preprint 2026)'
    ],
    repositoryUrl: 'https://github.com/projectverse-org/neurosymbolic-med',
    demoUrl: 'https://neurosymbolic-med.ai',
    documentationUrl: 'https://research.neurosymbolic-med.ai',
    problem: 'Generative clinical AI models frequently hallucinate contraindicated medication dosages and ungrounded radiological conclusions.',
    solution: 'A formal neuro-symbolic filter that projects model activations into first-order logical constraints verified against medical ontological trees before clinical emission.',
    contributors: [
      {
        name: 'Dr. Elena Rostova',
        role: 'Lead Research Scientist',
        institution: 'Autonomous AI Institute',
        batch: 'Senior Researcher',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        githubHandle: 'elena-rostova-ai',
        commitsCount: 420
      }
    ],
    lineageBatchesCount: 2,
    githubStars: 289,
    githubCommits: 470,
    openRoles: ['Knowledge Graph Engineer', 'Clinical NLP Evaluator'],
    coverGradient: 'from-emerald-600/20 via-teal-600/10 to-transparent',
    featured: true,
    lineage: [],
    passport: {
      passportId: 'PV-2026-RES-AI901',
      qrHash: 'sha256-9938e10ab4859a0f0128471bcee81',
      projectName: 'NeuroSymbolic-Med: Verifiable Clinical Diagnostic Reasoning',
      tagline: 'Integrating transformer representations with medical ontologies',
      institution: 'Autonomous AI Institute',
      department: 'Translational AI Research Group',
      academicYear: '2025–2026',
      originalBatch: '2025',
      currentBatch: '2026',
      status: 'Verified',
      license: 'Open Science Research License (OSRL)',
      techStack: ['Python', 'PyTorch', 'SNOMED-CT', 'Neo4j', 'FastAPI'],
      githubRepo: 'https://github.com/projectverse-org/neurosymbolic-med',
      totalCommits: 470,
      activeContributors: 3,
      mergedPRs: 38,
      codeHealthScore: 99,
      testCoverage: 96,
      stars: 289,
      forks: 34,
      facultyReviewer: {
        name: 'Dr. Anil Sharma',
        designation: 'Visiting Research Fellow',
        department: 'AI Systems',
        institution: 'Graphic Era Hill University',
        score: 9.9,
        reviewText: 'Groundbreaking integration of deductive reasoning over medical graphs with empirical deep neural weights.',
        verifiedAt: '12 Jan 2026',
        signatureHash: 'sig_res_verified_elena_90281'
      },
      institutionalValidationCode: 'AI-RESEARCH-NODE-VERIFIED-99',
      rubricScores: {
        novelty: 9.9,
        technicalRigor: 9.8,
        documentation: 9.5,
        continuityPotential: 9.6
      }
    }
  },
  {
    id: 'proj-4',
    passportId: 'PV-2026-IND-GRID004',
    title: 'OmniVolt: Decentralized Industrial Microgrid Balancer',
    tagline: 'Real-time telemetry and sub-second battery arbitrage for factory hubs',
    description: 'An industrial IoT platform deploying edge Kalman filters and smart battery arbitrage algorithms to cut peak energy tariffs for renewable-powered industrial parks.',
    projectType: 'INDUSTRY',
    domain: 'Clean Energy & IoT',
    techStack: ['Go', 'TimescaleDB', 'MQTT', 'Modbus', 'React', 'Grafana'],
    skillsRequired: ['Go', 'Industrial IoT Protocols', 'Time-series DB', 'Power Grid Systems'],
    teamRequirements: 'Looking for industrial automation apprentices and Go backend engineers.',
    institution: 'HyperCloud CleanTech Division',
    organization: 'HyperCloud Energy Consortium',
    problemDomain: 'Industrial Renewable Grid Balancing & Carbon Optimization',
    projectStage: 'Pilot Deployment in 3 Manufacturing Facilities',
    evidenceUrl: 'https://evidence.omnivolt-energy.io',
    department: 'Smart Grid Systems',
    academicYear: '2026',
    status: 'Active Development',
    difficulty: 'Intermediate',
    repositoryUrl: 'https://github.com/projectverse-org/omnivolt-grid',
    demoUrl: 'https://omnivolt-energy.io',
    documentationUrl: 'https://docs.omnivolt-energy.io',
    problem: 'Manufacturing facilities face 4x peak demand surcharge tariffs during sudden solar intermittency drops.',
    solution: 'Sub-second edge energy dispatch using battery banks and automated variable-frequency chiller dampening.',
    contributors: [
      {
        name: 'Vikram Singh',
        role: 'Industry Sponsor & Architect',
        institution: 'HyperCloud Solutions',
        batch: 'Industry Lead',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        githubHandle: 'vikram-industry',
        commitsCount: 340
      }
    ],
    lineageBatchesCount: 1,
    githubStars: 176,
    githubCommits: 390,
    openRoles: ['Industrial Protocols Developer', 'Golang Telemetry Engineer'],
    coverGradient: 'from-amber-600/20 via-orange-600/10 to-transparent',
    featured: false,
    lineage: [],
    passport: {
      passportId: 'PV-2026-IND-GRID004',
      qrHash: 'sha256-0012847aef9213bc04918e772b',
      projectName: 'OmniVolt: Decentralized Industrial Microgrid Balancer',
      tagline: 'Real-time telemetry and sub-second battery arbitrage for factory hubs',
      institution: 'HyperCloud CleanTech',
      department: 'Smart Grid Systems',
      academicYear: '2026',
      originalBatch: '2026',
      currentBatch: '2026',
      status: 'Active Development',
      license: 'Proprietary Pilot / Open Telemetry SDK',
      techStack: ['Go', 'TimescaleDB', 'MQTT', 'Modbus', 'React'],
      githubRepo: 'https://github.com/projectverse-org/omnivolt-grid',
      totalCommits: 390,
      activeContributors: 3,
      mergedPRs: 28,
      codeHealthScore: 95,
      testCoverage: 88,
      stars: 176,
      forks: 18,
      facultyReviewer: {
        name: 'Industrial Audit Board',
        designation: 'Clean Energy Advisory',
        department: 'Smart Infrastructure',
        institution: 'HyperCloud Consortium',
        score: 9.3,
        reviewText: 'Compliant with IEEE 1547-2018 distributed energy interconnection guidelines.',
        verifiedAt: '18 Jan 2026',
        signatureHash: 'sig_ind_audit_omnivolt_881a'
      },
      institutionalValidationCode: 'IND-PILOT-NODE-VERIFIED-04',
      rubricScores: {
        novelty: 9.2,
        technicalRigor: 9.5,
        documentation: 9.0,
        continuityPotential: 9.8
      }
    }
  }
];

// Initial Verification Requests
const SEED_VERIFICATION_REQUESTS: VerificationRequest[] = [
  {
    id: 'req-ver-001',
    userId: 'usr-student-01',
    fullName: 'Suraj Rawat',
    email: 'suraj@gehu.ac.in',
    role: 'STUDENT',
    studentType: 'CURRENT_STUDENT',
    institution: 'Graphic Era Hill University',
    department: 'Dept of Computer Science & Engineering',
    course: 'B.Tech CSE',
    batch: '2023–2027',
    rollNumber: 'GEHU/2022/CS/089',
    documentType: 'Student ID Card',
    documentFileName: 'GEHU_Suraj_ID_Card.pdf',
    documentFileSize: '2.4 MB',
    documentUploadedAt: '2025-08-14T10:00:00.000Z',
    status: 'VERIFIED',
    reviewedBy: 'Dr. Anil Sharma (FACULTY)',
    reviewedAt: '2025-08-15T12:30:00.000Z'
  },
  {
    id: 'req-ver-002',
    userId: 'usr-alumni-01',
    fullName: 'Rohan Verma',
    email: 'rohan.alumni@gehu.ac.in',
    role: 'ALUMNI',
    studentType: 'ALUMNI',
    institution: 'Graphic Era Hill University',
    department: 'Dept of Computer Science & Engineering',
    course: 'BCA',
    graduationYear: '2024',
    rollNumber: 'GEHU/2020/CS/042',
    documentType: 'Degree Certificate / Marksheet',
    documentFileName: 'Official_Degree_Certificate.pdf',
    documentFileSize: '3.1 MB',
    documentUploadedAt: '2025-07-20T14:10:00.000Z',
    status: 'VERIFIED',
    reviewedBy: 'Dr. Rajesh Kumar (HOD)',
    reviewedAt: '2025-07-22T09:00:00.000Z'
  }
];

const SEED_REGISTRATION_REQUESTS: RegistrationRequest[] = [
  {
    id: 'reg-req-001',
    role: 'STUDENT',
    fullName: 'Ananya Gupta',
    email: 'ananya.gupta@gehu.ac.in',
    mobile: '+91 98123 45678',
    emailVerified: true,
    mobileVerified: true,
    institution: 'Graphic Era Hill University',
    department: 'Dept of Computer Science & Engineering',
    course: 'B.Tech CSE',
    batch: '2024–2028',
    rollNumber: 'GEHU/2024/CS/112',
    studentType: 'CURRENT_STUDENT',
    skills: ['Python', 'FastAPI', 'React', 'Machine Learning'],
    documents: [
      {
        id: 'doc-ananya-01',
        documentType: 'Student ID Card',
        fileName: 'Ananya_GEHU_Student_ID.pdf',
        fileSize: '1.8 MB',
        uploadedAt: '2026-09-15T09:30:00.000Z',
        status: 'PENDING'
      }
    ],
    status: 'PENDING',
    verificationStatus: 'PENDING',
    createdAt: '2026-09-15T09:30:00.000Z',
    updatedAt: '2026-09-15T09:30:00.000Z'
  },
  {
    id: 'reg-req-002',
    role: 'DEVELOPER',
    fullName: 'David Miller',
    email: 'david.miller@openkernel.org',
    mobile: '+1 415 555 0192',
    emailVerified: true,
    mobileVerified: true,
    githubHandle: 'davidm-rust',
    githubUsername: 'davidm-rust',
    linkedIn: 'linkedin.com/in/david-miller-dev',
    portfolio: 'davidmiller.tech',
    skills: ['Rust', 'WebAssembly', 'Linux Kernel', 'Distributed Systems'],
    experienceYears: 5,
    currentOrganization: 'Independent Open Core',
    currentJobRole: 'Systems Contributor',
    documents: [
      {
        id: 'doc-david-01',
        documentType: 'Identity Proof',
        fileName: 'David_Miller_Developer_Proof.pdf',
        fileSize: '2.1 MB',
        uploadedAt: '2026-09-16T11:20:00.000Z',
        status: 'PENDING'
      }
    ],
    status: 'PENDING',
    verificationStatus: 'PENDING',
    createdAt: '2026-09-16T11:20:00.000Z',
    updatedAt: '2026-09-16T11:20:00.000Z'
  },
  {
    id: 'reg-req-003',
    role: 'FACULTY',
    fullName: 'Dr. Meenakshi Sundaram',
    email: 'm.sundaram@iitr.ac.in',
    mobile: '+91 94120 78901',
    emailVerified: true,
    mobileVerified: true,
    institution: 'IIT Roorkee',
    department: 'Dept of Computer Science & Engineering',
    facultyId: 'EMP-IITR-CSE-501',
    designation: 'Associate Professor',
    researchAreas: ['Edge Computing', 'Federated Learning'],
    skills: ['PyTorch', 'Distributed Systems', 'Computer Networks'],
    documents: [
      {
        id: 'doc-meenakshi-01',
        documentType: 'Faculty Employment ID',
        fileName: 'IITR_Faculty_ID_Card.pdf',
        fileSize: '2.5 MB',
        uploadedAt: '2026-09-17T14:15:00.000Z',
        status: 'PENDING'
      }
    ],
    status: 'PENDING',
    verificationStatus: 'PENDING',
    createdAt: '2026-09-17T14:15:00.000Z',
    updatedAt: '2026-09-17T14:15:00.000Z'
  },
  {
    id: 'reg-req-004',
    role: 'STUDENT',
    fullName: 'Suraj Rawat',
    email: 'suraj@gehu.ac.in',
    mobile: '+91 98765 43210',
    emailVerified: true,
    mobileVerified: true,
    institution: 'Graphic Era Hill University',
    department: 'Dept of Computer Science & Engineering',
    course: 'B.Tech CSE',
    batch: '2023–2027',
    rollNumber: 'GEHU/2022/CS/089',
    studentType: 'CURRENT_STUDENT',
    skills: ['React', 'TypeScript', 'Node.js', 'PyTorch', 'ROS 2', 'PostgreSQL'],
    documents: [
      {
        id: 'doc-suraj-01',
        documentType: 'Student ID Card',
        fileName: 'GEHU_Suraj_ID_Card.pdf',
        fileSize: '2.4 MB',
        uploadedAt: '2025-08-14T10:00:00.000Z',
        status: 'VERIFIED'
      }
    ],
    status: 'APPROVED',
    userId: 'usr-student-01',
    profileId: 'prof-usr-student-01',
    accountActivated: true,
    reviewedBy: 'Dr. Anil Sharma (FACULTY)',
    reviewedAt: '2025-08-15T12:30:00.000Z',
    verificationStatus: 'VERIFIED',
    verifiedAt: '2025-08-15T12:30:00.000Z',
    createdAt: '2025-08-14T10:00:00.000Z',
    updatedAt: '2025-08-15T12:30:00.000Z'
  }
];

// In-Memory Database Stores
class InMemoryDatabase {
  private users: Map<string, ServerUser> = new Map();
  private projects: Map<string, ProjectItem> = new Map();
  private verificationRequests: Map<string, VerificationRequest> = new Map();
  private registrationRequests: Map<string, RegistrationRequest> = new Map();
  private otps: Map<string, OTPRecord> = new Map();
  private sessions: Map<string, AuthSessionRecord> = new Map();

  constructor() {
    // Seed initial users with full verification state structure
    for (const u of SEED_USERS) {
      this.users.set(u.id, {
        ...u,
        verification: buildVerificationStatus(u.verification)
      });
    }
    // Seed initial projects
    for (const p of SEED_PROJECTS) {
      this.projects.set(p.id, p);
    }
    // Seed verification requests
    for (const v of SEED_VERIFICATION_REQUESTS) {
      this.verificationRequests.set(v.id, v);
    }
    // Seed registration requests
    for (const r of SEED_REGISTRATION_REQUESTS) {
      this.registrationRequests.set(r.id, r);
    }

    // Default pre-authenticated sessions for convenience
    this.createSession('usr-student-01', 'pv_token_student_suraj');
    this.createSession('usr-faculty-01', 'pv_token_faculty_anil');
    this.createSession('usr-hod-01', 'pv_token_hod_rajesh');
    this.createSession('usr-admin-01', 'pv_token_admin_root');
  }

  // --- Users ---
  getUserById(id: string): ServerUser | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): ServerUser | undefined {
    const normalized = email.toLowerCase().trim();
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === normalized) {
        return user;
      }
    }
    // Check aliases
    if (normalized === 'suraj@student.demo' || normalized === 'student@student.demo' || normalized === 'student@demo.com') {
      return this.users.get('student-001') || this.getUserByEmail('suraj@gehu.ac.in');
    }
    if (normalized === 'faculty@demo.com' || normalized === 'faculty@gehu.ac.in') {
      return this.users.get('faculty-001') || this.getUserByEmail('anil.sharma@gehu.ac.in');
    }
    if (normalized === 'hod@demo.com' || normalized === 'hod@gehu.ac.in') {
      return this.users.get('hod-001') || this.getUserByEmail('rajesh.kumar@gehu.ac.in');
    }
    if (normalized === 'admin@demo.com' || normalized === 'admin@projectverse.org' || normalized === 'root@demo.com') {
      return this.users.get('admin-001') || this.getUserByEmail('admin@gehu.ac.in');
    }
    return undefined;
  }

  createUser(user: ServerUser): ServerUser {
    const normalizedUser: ServerUser = {
      ...user,
      isAuthorizedReviewer: user.isAuthorizedReviewer ?? false,
      reviewerCategories: user.reviewerCategories ?? [],
      availableForMentorship: user.availableForMentorship ?? false,
      verification: buildVerificationStatus(user.verification)
    };
    this.users.set(normalizedUser.id, normalizedUser);
    return normalizedUser;
  }

  updateUser(id: string, updates: Partial<ServerUser>): ServerUser | undefined {
    const existing = this.users.get(id);
    if (!existing) return undefined;
    const updated: ServerUser = { 
      ...existing, 
      ...updates,
      verification: updates.verification ? buildVerificationStatus({ ...existing.verification, ...updates.verification }) : existing.verification
    };
    this.users.set(id, updated);
    return updated;
  }

  listUsers(): ServerUser[] {
    return Array.from(this.users.values());
  }

  // --- Projects ---
  getProjects(filters?: {
    type?: string;
    domain?: string;
    tech?: string;
    status?: string;
    institution?: string;
    organization?: string;
    search?: string;
  }): ProjectItem[] {
    let result = Array.from(this.projects.values());

    if (!filters) return result;

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.institution.toLowerCase().includes(q) ||
          p.techStack.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filters.type && filters.type !== 'All') {
      result = result.filter((p) => p.projectType === filters.type);
    }

    if (filters.domain && filters.domain !== 'All') {
      result = result.filter((p) => p.domain === filters.domain);
    }

    if (filters.status && filters.status !== 'All') {
      result = result.filter((p) => p.status === filters.status);
    }

    if (filters.tech && filters.tech !== 'All') {
      result = result.filter((p) => p.techStack.includes(filters.tech!));
    }

    if (filters.institution && filters.institution !== 'All') {
      result = result.filter((p) => p.institution === filters.institution);
    }

    if (filters.organization && filters.organization !== 'All') {
      result = result.filter((p) => p.organization === filters.organization);
    }

    return result;
  }

  getProjectById(id: string): ProjectItem | undefined {
    return this.projects.get(id);
  }

  createProject(project: ProjectItem): ProjectItem {
    this.projects.set(project.id, project);
    return project;
  }

  updateProject(id: string, updates: Partial<ProjectItem>): ProjectItem | undefined {
    const existing = this.projects.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.projects.set(id, updated);
    return updated;
  }

  // --- OTP Verification Store ---
  createOTP(email: string): string {
    return this.createEmailOTP(email);
  }

  createEmailOTP(email: string): string {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.otps.set(email.toLowerCase().trim(), {
      email: email.toLowerCase().trim(),
      code,
      expiresAt: Date.now() + 1000 * 60 * 15, // 15 mins
      verified: false
    });
    return code;
  }

  verifyOTP(email: string, code: string): boolean {
    return this.verifyEmailOTP(email, code);
  }

  verifyEmailOTP(email: string, code: string): boolean {
    const record = this.otps.get(email.toLowerCase().trim());
    if (!record) return false;
    if (Date.now() > record.expiresAt) return false;
    // Allow matching exact code or demo bypass code '849201' for resilience in preview
    if (record.code === code.trim() || code.trim() === '849201') {
      record.verified = true;
      return true;
    }
    return false;
  }

  createMobileOTP(mobile: string): string {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const cleanMobile = mobile.replace(/[^0-9]/g, '');
    this.otps.set(`mob_${cleanMobile}`, {
      email: `mob_${cleanMobile}`,
      code,
      expiresAt: Date.now() + 1000 * 60 * 15,
      verified: false
    });
    return code;
  }

  verifyMobileOTP(mobile: string, code: string): boolean {
    const cleanMobile = mobile.replace(/[^0-9]/g, '');
    const record = this.otps.get(`mob_${cleanMobile}`);
    if (!record) return false;
    if (Date.now() > record.expiresAt) return false;
    if (record.code === code.trim() || code.trim() === '849201') {
      record.verified = true;
      return true;
    }
    return false;
  }

  // --- Session Management ---
  createSession(userId: string, customToken?: string): AuthSessionRecord {
    const token = customToken || `pv_sec_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const session: AuthSessionRecord = {
      token,
      userId,
      createdAt: Date.now(),
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7 // 7 days
    };
    this.sessions.set(token, session);
    return session;
  }

  getSession(token: string): AuthSessionRecord | undefined {
    const session = this.sessions.get(token);
    if (!session) return undefined;
    if (Date.now() > session.expiresAt) {
      this.sessions.delete(token);
      return undefined;
    }
    return session;
  }

  deleteSession(token: string): boolean {
    return this.sessions.delete(token);
  }

  // --- Verification Requests ---
  listVerificationRequests(): VerificationRequest[] {
    return Array.from(this.verificationRequests.values()).sort((a, b) => 
      new Date(b.documentUploadedAt).getTime() - new Date(a.documentUploadedAt).getTime()
    );
  }

  getVerificationRequestById(id: string): VerificationRequest | undefined {
    return this.verificationRequests.get(id);
  }

  createVerificationRequest(req: VerificationRequest): VerificationRequest {
    this.verificationRequests.set(req.id, req);
    return req;
  }

  updateVerificationRequest(id: string, updates: Partial<VerificationRequest>): VerificationRequest | undefined {
    const existing = this.verificationRequests.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.verificationRequests.set(id, updated);
    return updated;
  }

  // --- Registration Requests ---
  listRegistrationRequests(): RegistrationRequest[] {
    return Array.from(this.registrationRequests.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getRegistrationRequestById(id: string): RegistrationRequest | undefined {
    return this.registrationRequests.get(id);
  }

  getRegistrationRequestByEmail(email: string): RegistrationRequest | undefined {
    const clean = email.toLowerCase().trim();
    return Array.from(this.registrationRequests.values()).find(
      r => r.email.toLowerCase().trim() === clean
    );
  }

  getRegistrationRequestByUserId(userId: string): RegistrationRequest | undefined {
    return Array.from(this.registrationRequests.values()).find(
      r => r.userId === userId
    );
  }

  createRegistrationRequest(req: RegistrationRequest): RegistrationRequest {
    this.registrationRequests.set(req.id, req);
    return req;
  }

  updateRegistrationRequest(id: string, updates: Partial<RegistrationRequest>): RegistrationRequest | undefined {
    const existing = this.registrationRequests.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    this.registrationRequests.set(id, updated);
    return updated;
  }

  approveRegistrationRequest(
    requestId: string,
    reviewerName: string,
    reviewerRole: UserRole
  ): { success: boolean; request?: RegistrationRequest; user?: ServerUser; message: string } {
    const req = this.registrationRequests.get(requestId);
    if (!req) {
      return { success: false, message: 'Registration request not found.' };
    }

    // IDEMPOTENCY: Check if user already exists for this registration request or email
    let user: ServerUser | undefined;
    if (req.userId) {
      user = this.users.get(req.userId);
    }
    if (!user) {
      user = this.getUserByEmail(req.email);
    }

    if (user) {
      // Reuse existing User and permanent User ID!
      const updatedReq: RegistrationRequest = {
        ...req,
        status: 'APPROVED',
        userId: user.id,
        profileId: `prof-${user.id}`,
        accountActivated: true,
        reviewedBy: reviewerName,
        reviewerRole: reviewerRole,
        reviewedAt: req.reviewedAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.registrationRequests.set(req.id, updatedReq);
      return {
        success: true,
        request: updatedReq,
        user,
        message: 'Registration approved. Existing permanent User ID and Profile reused safely.'
      };
    }

    // Generate exactly ONE permanent User ID and ONE linked Profile ID
    const permanentUserId = `usr-${req.role.toLowerCase()}-${Date.now()}`;
    const profileId = `prof-${permanentUserId}`;
    const isInstEmail = req.email.endsWith('.edu') || req.email.endsWith('.ac.in') || req.email.includes('gehu.ac.in');

    const newUser: ServerUser = {
      id: permanentUserId,
      email: req.email.toLowerCase().trim(),
      mobile: req.mobile,
      passwordHash: req.passwordHash || 'ProjectVerse@2025',
      fullName: req.fullName.trim(),
      role: req.role,
      status: 'ACTIVE',
      avatar: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="64" fill="%23111111"/><text x="50%" y="54%" font-family="sans-serif" font-size="44" font-weight="700" fill="%23ffffff" dominant-baseline="middle" text-anchor="middle">${req.fullName.slice(0, 2).toUpperCase()}</text></svg>`,
      bio: req.role === 'STUDENT'
        ? `Student (${req.course || 'Engineering'}) at ${req.institution || 'University'}. Building verifiable projects.`
        : req.role === 'DEVELOPER'
        ? `Open ecosystem developer specializing in software systems.`
        : `${req.role} at ${req.institution || 'ProjectVerse'}.`,
      skills: req.skills || ['ProjectVerse', 'TypeScript', 'Node.js'],
      verification: buildVerificationStatus({
        accountStatus: 'ACTIVE',
        email: req.emailVerified ? 'VERIFIED' : 'UNVERIFIED',
        mobile: req.mobileVerified ? 'VERIFIED' : 'UNVERIFIED',
        institution: isInstEmail ? 'VERIFIED' : 'UNVERIFIED',
        academic: 'PENDING',
        document: req.documents.length > 0 ? 'PENDING' : 'NOT_REQUIRED',
        contribution: 'PENDING',
        emailVerified: Boolean(req.emailVerified),
        institutionVerified: isInstEmail,
        academicVerified: false,
        documentVerified: false,
        facultyReviewed: false,
        contributionVerified: false
      }),
      institution: req.institution,
      department: req.department,
      course: req.course,
      batch: req.batch,
      graduationYear: req.graduationYear,
      rollNumber: req.rollNumber,
      studentType: req.studentType,
      currentOrganization: req.currentOrganization,
      currentJobRole: req.currentJobRole,
      experienceYears: req.experienceYears,
      githubHandle: req.githubHandle || req.githubUsername,
      linkedIn: req.linkedIn,
      portfolio: req.portfolio,
      researchInterests: req.researchInterests,
      facultyId: req.facultyId,
      designation: req.designation,
      departmentToken: req.departmentToken,
      institutionType: req.institutionType,
      officialDomain: req.officialDomain,
      website: req.officialWebsite,
      address: req.address,
      contactPerson: req.contactPerson,
      projectsCount: 0,
      createdAt: new Date().toISOString()
    };

    this.createUser(newUser);

    // Update registration request
    const updatedReq: RegistrationRequest = {
      ...req,
      status: 'APPROVED',
      userId: permanentUserId,
      profileId,
      accountActivated: true,
      reviewedBy: reviewerName,
      reviewerRole: reviewerRole,
      reviewedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      verificationStatus: 'PENDING'
    };
    this.registrationRequests.set(req.id, updatedReq);

    // Enqueue role verification request for uploaded documents
    if (req.documents.length > 0) {
      const primaryDoc = req.documents[0];
      this.createVerificationRequest({
        id: `ver-req-${permanentUserId}`,
        userId: permanentUserId,
        fullName: req.fullName,
        email: req.email,
        role: req.role,
        studentType: req.studentType,
        institution: req.institution || 'Unspecified',
        department: req.department || 'Unspecified',
        course: req.course,
        batch: req.batch,
        graduationYear: req.graduationYear,
        rollNumber: req.rollNumber,
        documentType: (primaryDoc.documentType as DocumentType) || 'Identity Proof',
        documentFileName: primaryDoc.fileName,
        documentFileSize: primaryDoc.fileSize,
        documentUploadedAt: primaryDoc.uploadedAt,
        documentId: primaryDoc.id,
        status: 'PENDING_REVIEW'
      });
    }

    return {
      success: true,
      request: updatedReq,
      user: newUser,
      message: `Registration approved for ${req.fullName}. Permanent User ID ${permanentUserId} and Profile created. Account activated with Verification Pending.`
    };
  }

  rejectRegistrationRequest(
    requestId: string,
    reviewerName: string,
    reviewerRole: UserRole,
    reason: string
  ): { success: boolean; request?: RegistrationRequest; message: string } {
    const req = this.registrationRequests.get(requestId);
    if (!req) return { success: false, message: 'Registration request not found.' };

    const updated: RegistrationRequest = {
      ...req,
      status: 'REJECTED',
      reviewedBy: reviewerName,
      reviewerRole: reviewerRole,
      reviewedAt: new Date().toISOString(),
      rejectionReason: reason,
      updatedAt: new Date().toISOString()
    };
    this.registrationRequests.set(req.id, updated);
    return { success: true, request: updated, message: 'Registration rejected.' };
  }

  requestChangesForRegistration(
    requestId: string,
    reviewerName: string,
    reviewerRole: UserRole,
    notes: string
  ): { success: boolean; request?: RegistrationRequest; message: string } {
    const req = this.registrationRequests.get(requestId);
    if (!req) return { success: false, message: 'Registration request not found.' };

    const updated: RegistrationRequest = {
      ...req,
      status: 'NEEDS_RESUBMISSION',
      reviewedBy: reviewerName,
      reviewerRole: reviewerRole,
      reviewedAt: new Date().toISOString(),
      resubmissionNotes: notes,
      updatedAt: new Date().toISOString()
    };
    this.registrationRequests.set(req.id, updated);
    return { success: true, request: updated, message: 'Changes requested from applicant.' };
  }

  resubmitRegistrationRequest(
    requestId: string,
    updates: Partial<RegistrationRequest>
  ): RegistrationRequest | undefined {
    const existing = this.registrationRequests.get(requestId);
    if (!existing) return undefined;

    const mergedDocs = updates.documents && updates.documents.length > 0 
      ? updates.documents 
      : existing.documents;

    const updated: RegistrationRequest = {
      ...existing,
      ...updates,
      documents: mergedDocs,
      status: 'PENDING',
      verificationStatus: 'PENDING',
      rejectionReason: undefined,
      resubmissionNotes: undefined,
      updatedAt: new Date().toISOString()
    };
    this.registrationRequests.set(requestId, updated);
    return updated;
  }

  verifyUserIdentity(
    userId: string,
    reviewerName: string,
    reviewerRole: UserRole
  ): { success: boolean; user?: ServerUser; message: string } {
    const user = this.getUserById(userId);
    if (!user) return { success: false, message: 'User not found.' };

    const updatedVerification = buildVerificationStatus({
      ...user.verification,
      accountStatus: 'ACTIVE',
      academic: 'VERIFIED',
      document: 'VERIFIED',
      institution: 'VERIFIED',
      contribution: 'VERIFIED',
      academicVerified: true,
      documentVerified: true,
      institutionVerified: true,
      facultyReviewed: true,
      contributionVerified: true
    });

    const updatedUser = this.updateUser(userId, {
      verification: updatedVerification
    });

    // Update any linked verification requests
    for (const [id, req] of this.verificationRequests.entries()) {
      if (req.userId === userId) {
        this.verificationRequests.set(id, {
          ...req,
          status: 'VERIFIED',
          reviewedBy: `${reviewerName} (${reviewerRole})`,
          reviewedAt: new Date().toISOString()
        });
      }
    }

    // Update registration request
    const regReq = this.getRegistrationRequestByUserId(userId);
    if (regReq) {
      this.updateRegistrationRequest(regReq.id, {
        verificationStatus: 'VERIFIED',
        verifiedAt: new Date().toISOString()
      });
    }

    return {
      success: true,
      user: updatedUser,
      message: `All role-specific verification requirements approved for ${user.fullName}. ✓ Verified User badge assigned.`
    };
  }

  rejectUserVerification(
    userId: string,
    reviewerName: string,
    reviewerRole: UserRole,
    reason: string
  ): { success: boolean; user?: ServerUser; message: string } {
    const user = this.getUserById(userId);
    if (!user) return { success: false, message: 'User not found.' };

    const updatedVerification = buildVerificationStatus({
      ...user.verification,
      academic: 'REJECTED',
      document: 'REJECTED',
      rejectionReason: reason,
      academicVerified: false,
      documentVerified: false,
      facultyReviewed: true
    });

    const updatedUser = this.updateUser(userId, {
      verification: updatedVerification
    });

    for (const [id, req] of this.verificationRequests.entries()) {
      if (req.userId === userId) {
        this.verificationRequests.set(id, {
          ...req,
          status: 'REJECTED',
          rejectionReason: reason,
          reviewedBy: `${reviewerName} (${reviewerRole})`,
          reviewedAt: new Date().toISOString()
        });
      }
    }

    return {
      success: true,
      user: updatedUser,
      message: `Verification rejected for ${user.fullName}.`
    };
  }
}

// Global Singleton Instance
export const db = new InMemoryDatabase();

// Export convenient standalone accessors
export const getUserById = (id: string) => db.getUserById(id);
export const getUserByEmail = (email: string) => db.getUserByEmail(email);
export const createUser = (u: ServerUser) => db.createUser(u);
export const updateUser = (id: string, updates: Partial<ServerUser>) => db.updateUser(id, updates);
export const listUsers = () => db.listUsers();

export const getProjects = (f?: any) => db.getProjects(f);
export const getProjectById = (id: string) => db.getProjectById(id);
export const createProject = (p: ProjectItem) => db.createProject(p);
export const updateProject = (id: string, updates: Partial<ProjectItem>) => db.updateProject(id, updates);

export const createOTP = (email: string) => db.createOTP(email);
export const verifyOTP = (email: string, code: string) => db.verifyOTP(email, code);
export const createEmailOTP = (email: string) => db.createEmailOTP(email);
export const verifyEmailOTP = (email: string, code: string) => db.verifyEmailOTP(email, code);
export const createMobileOTP = (mobile: string) => db.createMobileOTP(mobile);
export const verifyMobileOTP = (mobile: string, code: string) => db.verifyMobileOTP(mobile, code);

export const createSession = (userId: string, customToken?: string) => db.createSession(userId, customToken);
export const getSession = (token: string) => db.getSession(token);
export const deleteSession = (token: string) => db.deleteSession(token);

export const listVerificationRequests = () => db.listVerificationRequests();
export const getVerificationRequestById = (id: string) => db.getVerificationRequestById(id);
export const createVerificationRequest = (r: VerificationRequest) => db.createVerificationRequest(r);
export const updateVerificationRequest = (id: string, updates: Partial<VerificationRequest>) => db.updateVerificationRequest(id, updates);

export const listRegistrationRequests = () => db.listRegistrationRequests();
export const getRegistrationRequestById = (id: string) => db.getRegistrationRequestById(id);
export const getRegistrationRequestByEmail = (email: string) => db.getRegistrationRequestByEmail(email);
export const getRegistrationRequestByUserId = (userId: string) => db.getRegistrationRequestByUserId(userId);
export const createRegistrationRequest = (r: RegistrationRequest) => db.createRegistrationRequest(r);
export const updateRegistrationRequest = (id: string, updates: Partial<RegistrationRequest>) => db.updateRegistrationRequest(id, updates);
export const approveRegistrationRequest = (requestId: string, reviewerName: string, reviewerRole: UserRole) => db.approveRegistrationRequest(requestId, reviewerName, reviewerRole);
export const rejectRegistrationRequest = (requestId: string, reviewerName: string, reviewerRole: UserRole, reason: string) => db.rejectRegistrationRequest(requestId, reviewerName, reviewerRole, reason);
export const requestChangesForRegistration = (requestId: string, reviewerName: string, reviewerRole: UserRole, notes: string) => db.requestChangesForRegistration(requestId, reviewerName, reviewerRole, notes);
export const resubmitRegistrationRequest = (requestId: string, updates: Partial<RegistrationRequest>) => db.resubmitRegistrationRequest(requestId, updates);
export const verifyUserIdentity = (userId: string, reviewerName: string, reviewerRole: UserRole) => db.verifyUserIdentity(userId, reviewerName, reviewerRole);
export const rejectUserVerification = (userId: string, reviewerName: string, reviewerRole: UserRole, reason: string) => db.rejectUserVerification(userId, reviewerName, reviewerRole, reason);
