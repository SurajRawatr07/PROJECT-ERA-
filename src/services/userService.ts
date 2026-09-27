import { AuthUser, RegisterData, UserRole } from '../types/auth';
import { storageAdapter } from './storageAdapter';
import { normalizeEmail } from '../utils/validation';
import { DEMO_USERS } from '../data/demoUsers';

const USERS_STORAGE_KEY = 'pv_user_accounts';

function getInitialsAvatarSvg(name: string, role: UserRole): string {
  const cleanName = (name || 'User').trim();
  const parts = cleanName.split(' ').filter(Boolean);
  const initials = parts.length > 1
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : cleanName.slice(0, 2).toUpperCase();

  const bg = role === 'ADMIN' ? '%23111111' : role === 'HOD' ? '%231E1E1E' : role === 'FACULTY' ? '%232C2C2C' : '%23F0F0ED';
  const textFill = role === 'ADMIN' || role === 'HOD' || role === 'FACULTY' ? '%23FFFFFF' : '%23111111';

  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="64" fill="${bg}"/><text x="50%" y="54%" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="44" font-weight="700" fill="${textFill}" dominant-baseline="middle" text-anchor="middle">${initials}</text></svg>`;
}

// Built-in seed accounts (includes system-provisioned Admin and starter records)
const DEFAULT_SEEDED_USERS: AuthUser[] = [
  {
    id: 'student-001',
    name: 'Suraj Rawat',
    email: 'suraj@student.demo',
    password: 'Student@123',
    role: 'STUDENT',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    profile: {
      institution: 'Graphic Era Hill University',
      program: 'BCA',
      course: 'BCA',
      academicYear: "2023–2027",
      batch: "BCA '27",
      rollNumber: 'GEHU/2023/BCA/089',
      accountType: 'CURRENT_STUDENT',
      location: 'Haldwani, Uttarakhand',
      skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'MongoDB', 'C++', 'DSA', 'Git/GitHub', 'Tailwind CSS', 'Docker', 'Express'],
      bio: 'Full-stack builder and systems researcher passionate about developer tools, distributed computing, and web performance.',
      github: 'https://github.com/suraj-rawat-dev',
      githubHandle: 'suraj-rawat-dev',
      linkedin: 'https://linkedin.com/in/suraj-rawat-dev',
      verifiedStatus: 'Verified',
      projectsCount: 6,
      commitsCount: 340,
      rubricScore: 9.8,
      verifiedProjectsCount: 4
    },
    createdAt: '2025-01-10T09:00:00.000Z'
  },
  {
    id: 'faculty-001',
    name: 'Dr. Ananya Sharma',
    email: 'faculty@demo.com',
    password: 'Faculty@123',
    role: 'FACULTY',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    profile: {
      institution: 'Graphic Era Hill University',
      department: 'Computer Science & Engineering',
      designation: 'Assistant Professor',
      employeeId: 'EMP-GEHU-FAC-409',
      location: 'Dehradun, Uttarakhand',
      skills: ['AI/ML', 'Computer Vision', 'Distributed Systems', 'Academic Peer Review'],
      bio: 'Assistant Professor in Computer Science & Engineering. Guiding undergraduate and postgraduate capstone initiatives, research cohorts, and peer reviews.',
      github: 'https://github.com/ananya-sharma-gehu',
      githubHandle: 'ananya-sharma-gehu',
      linkedin: 'https://linkedin.com/in/ananya-sharma-gehu',
      verifiedStatus: 'Verified',
      projectsCount: 12,
      rubricScore: 9.9
    },
    createdAt: '2025-01-05T09:00:00.000Z'
  },
  {
    id: 'hod-001',
    name: 'Dr. Rajesh Mehta',
    email: 'hod@demo.com',
    password: 'Hod@123',
    role: 'HOD',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    profile: {
      institution: 'Graphic Era Hill University',
      department: 'Computer Science',
      designation: 'Professor & Head of Department',
      employeeId: 'HOD-CSE-001',
      location: 'Dehradun, Uttarakhand',
      skills: ['Curriculum Design', 'Academic Governance', 'Accreditation', 'Capstone Verification'],
      bio: 'Head of Computer Science. Overseeing department capstones, verification seals, institutional compliance, and faculty guidance.',
      verifiedStatus: 'Verified',
      projectsCount: 86
    },
    createdAt: '2025-01-01T09:00:00.000Z'
  },
  {
    id: 'admin-001',
    name: 'ProjectVerse Admin',
    email: 'admin@demo.com',
    password: 'Admin@123',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    profile: {
      institution: 'ProjectVerse Open Federation',
      department: 'Federated Infrastructure Office',
      designation: 'Platform Governance & System Administrator',
      employeeId: 'ROOT-ADMIN-01',
      location: 'Central Platform Hub',
      skills: ['Platform Architecture', 'Network Administration', 'Ledger Governance', 'Identity Access Control'],
      bio: 'Lead Root Administrator for ProjectVerse Open Ecosystem ledger, telemetry, verification pipelines, and platform management.',
      verifiedStatus: 'Verified',
      projectsCount: 1426
    },
    createdAt: '2025-01-01T00:00:00.000Z'
  }
];

class UserService {
  private users: AuthUser[] = [];
  private initialized = false;

  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized(): void {
    if (this.initialized) return;

    const stored = storageAdapter.getItem<AuthUser[] | null>(USERS_STORAGE_KEY, null);
    if (stored && Array.isArray(stored) && stored.length > 0) {
      this.users = stored;
      // Ensure seeded admin always exists
      const hasAdmin = this.users.some(u => u.role === 'ADMIN');
      if (!hasAdmin) {
        this.users.push(DEFAULT_SEEDED_USERS[3]);
        storageAdapter.setItem(USERS_STORAGE_KEY, this.users);
      }
    } else {
      this.users = [...DEFAULT_SEEDED_USERS];
      storageAdapter.setItem(USERS_STORAGE_KEY, this.users);
    }
    this.initialized = true;
  }

  private persist(): void {
    storageAdapter.setItem(USERS_STORAGE_KEY, this.users);
  }

  getAll(): AuthUser[] {
    this.ensureInitialized();
    return [...this.users];
  }

  getById(id: string): AuthUser | null {
    this.ensureInitialized();
    const user = this.users.find(u => u.id === id);
    return user ? { ...user } : null;
  }

  getByEmail(email: string): AuthUser | null {
    this.ensureInitialized();
    const normalized = normalizeEmail(email);
    if (!normalized) return null;

    // Check primary email
    const user = this.users.find(u => normalizeEmail(u.email) === normalized);
    if (user) return { ...user };

    // Check aliases in demo data if any
    const demo = DEMO_USERS.find(d => 
      normalizeEmail(d.email) === normalized || 
      d.aliases?.some(a => normalizeEmail(a) === normalized)
    );
    if (demo) {
      const match = this.users.find(u => u.id === demo.id);
      if (match) return { ...match };
    }

    return null;
  }

  emailExists(email: string): boolean {
    return this.getByEmail(email) !== null;
  }

  createUserFromRegistration(data: RegisterData): AuthUser {
    this.ensureInitialized();
    const normalized = normalizeEmail(data.email);

    if (this.emailExists(normalized)) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }

    const userId = `usr_${data.role.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const avatar = getInitialsAvatarSvg(data.name, data.role);

    let profileData: Record<string, any> = {};

    if (data.role === 'STUDENT') {
      const sp = data.studentProfile || {
        institution: 'Graphic Era Hill University',
        course: 'B.Tech Computer Science',
        branch: 'CSE',
        currentYearSemester: '3rd Year',
        rollNumber: 'GEHU/2024/CS/001',
        accountType: 'CURRENT_STUDENT',
        skills: ['React', 'TypeScript', 'Node.js']
      };

      profileData = {
        institution: sp.institution || 'Graphic Era Hill University',
        program: sp.course || 'B.Tech CSE',
        course: sp.course || 'B.Tech CSE',
        branch: sp.branch,
        academicYear: sp.currentYearSemester || '2024–2028',
        batch: sp.currentYearSemester || '2024–2028',
        rollNumber: sp.rollNumber,
        accountType: sp.accountType || 'CURRENT_STUDENT',
        skills: sp.skills && sp.skills.length > 0 ? sp.skills : ['React', 'TypeScript', 'Node.js'],
        bio: sp.bio || data.bio || 'Student builder developing verifiable academic projects and capstones.',
        github: sp.github || '',
        githubHandle: sp.github ? sp.github.split('/').filter(Boolean).pop() : '',
        linkedin: sp.linkedin || '',
        verifiedStatus: 'Pending Verification',
        projectsCount: 0,
        commitsCount: 0,
        rubricScore: 9.0,
        verifiedProjectsCount: 0
      };
    } else if (data.role === 'FACULTY') {
      const fp = data.facultyProfile || {
        institution: 'Graphic Era Hill University',
        department: 'Computer Science & Engineering',
        designation: 'Assistant Professor',
        employeeId: `FAC-${Date.now().toString().slice(-4)}`,
        skills: ['Distributed Systems', 'Academic Peer Review']
      };

      profileData = {
        institution: fp.institution || 'Graphic Era Hill University',
        department: fp.department || 'Computer Science & Engineering',
        designation: fp.designation || 'Assistant Professor',
        employeeId: fp.employeeId,
        facultyId: fp.employeeId,
        skills: fp.skills && fp.skills.length > 0 ? fp.skills : ['Software Engineering', 'Academic Peer Review'],
        bio: fp.bio || data.bio || 'Faculty mentor advising undergraduate and postgraduate capstone cohorts.',
        github: fp.github || '',
        githubHandle: fp.github ? fp.github.split('/').filter(Boolean).pop() : '',
        linkedin: fp.linkedin || '',
        verifiedStatus: 'Pending Verification',
        projectsCount: 0,
        rubricScore: 9.5
      };
    } else if (data.role === 'RESEARCHER') {
      const rp = data.researcherProfile || {
        institution: 'GEHU Research Node',
        researchDomain: 'Machine Learning & Systems',
        designation: 'Research Scholar',
        skills: ['AI/ML', 'Distributed Computing']
      };

      profileData = {
        institution: rp.institution || 'Research Institute',
        researchDomain: rp.researchDomain,
        designation: rp.designation,
        researcherIdOrcid: rp.researcherIdOrcid,
        googleScholarUrl: rp.googleScholarUrl,
        skills: rp.skills && rp.skills.length > 0 ? rp.skills : ['Machine Learning', 'Research Systems'],
        bio: rp.bio || data.bio || 'Researcher benchmarking systems architecture and domain intelligence.',
        github: rp.github || '',
        githubHandle: rp.github ? rp.github.split('/').filter(Boolean).pop() : '',
        linkedin: rp.linkedin || '',
        verifiedStatus: 'Pending Verification',
        projectsCount: 0
      };
    } else if (data.role === 'ALUMNI') {
      const ap = data.alumniProfile || {
        previousInstitution: 'Graphic Era Hill University',
        degreeCourse: 'B.Tech Computer Science',
        graduationYear: '2024',
        skills: ['Software Engineering', 'Mentorship']
      };

      profileData = {
        institution: ap.previousInstitution,
        course: ap.degreeCourse,
        graduationYear: ap.graduationYear,
        currentOrganization: ap.currentOrganization || 'Tech Industry',
        currentJobRole: ap.currentJobRole || 'Software Engineer',
        skills: ap.skills && ap.skills.length > 0 ? ap.skills : ['Industry Systems', 'Mentorship'],
        bio: ap.bio || data.bio || 'Alumni mentor contributing real-world industry architecture insights.',
        github: ap.github || '',
        githubHandle: ap.github ? ap.github.split('/').filter(Boolean).pop() : '',
        linkedin: ap.linkedin || '',
        verifiedStatus: 'Pending Verification',
        projectsCount: 0
      };
    } else if (data.role === 'DEVELOPER') {
      const dp = data.developerProfile || {
        specialization: 'Full-Stack Software Engineer',
        skills: ['TypeScript', 'React', 'Node.js', 'Distributed Systems'],
        experienceLevel: 'Mid-Level (2-4 yrs)',
        github: ''
      };

      profileData = {
        specialization: dp.specialization,
        skills: dp.skills && dp.skills.length > 0 ? dp.skills : ['TypeScript', 'Go', 'Rust'],
        experienceLevel: dp.experienceLevel,
        bio: dp.bio || data.bio || 'Open ecosystem developer contributing software systems.',
        github: dp.github || '',
        githubHandle: dp.github ? dp.github.split('/').filter(Boolean).pop() : '',
        githubVerified: Boolean(dp.githubVerified),
        linkedin: dp.linkedin || '',
        portfolio: dp.portfolio || '',
        verifiedStatus: 'Pending Verification',
        projectsCount: 0
      };
    } else if (data.role === 'HOD') {
      const hp = data.hodProfile || {
        institution: 'Graphic Era Hill University',
        department: 'Computer Science',
        designation: 'Professor & Head of Department',
        employeeId: `HOD-${Date.now().toString().slice(-4)}`
      };

      profileData = {
        institution: hp.institution || 'Graphic Era Hill University',
        department: hp.department || 'Computer Science',
        designation: hp.designation || 'Professor & Head of Department',
        employeeId: hp.employeeId,
        facultyId: hp.employeeId,
        bio: hp.bio || data.bio || 'Department Head overseeing academic governance, capstone review, and institutional validation.',
        verifiedStatus: 'Pending Verification',
        projectsCount: 0
      };
    } else if (data.role === 'INSTITUTION') {
      const ip = data.institutionProfile || {
        institutionName: 'Academic Institution',
        institutionType: 'Autonomous University',
        website: 'https://university.ac.in',
        address: 'Campus Address',
        representativeName: data.name,
        representativeDesignation: 'Registrar',
        contactNumber: data.mobile || '',
        officialEmail: data.email
      };

      profileData = {
        institution: ip.institutionName,
        institutionType: ip.institutionType,
        website: ip.website,
        address: ip.address,
        representativeName: ip.representativeName,
        representativeDesignation: ip.representativeDesignation,
        contactPerson: ip.representativeName,
        bio: ip.bio || data.bio || 'Verified academic institution maintaining student cohorts and faculty review registries.',
        verifiedStatus: 'Pending Verification',
        projectsCount: 0
      };
    } else if (data.role === 'INDUSTRY_PROFESSIONAL') {
      const indp = data.industryProfile || {
        company: 'Enterprise Solutions',
        jobTitle: 'Principal Engineer',
        industry: 'Software Engineering',
        experienceYears: '5+ Years',
        skills: ['Enterprise Architecture', 'Cloud Infrastructure'],
        linkedin: ''
      };

      profileData = {
        currentOrganization: indp.company,
        currentJobRole: indp.jobTitle,
        industry: indp.industry,
        experienceYears: indp.experienceYears,
        skills: indp.skills && indp.skills.length > 0 ? indp.skills : ['Enterprise Architecture'],
        bio: indp.bio || data.bio || 'Industry professional sponsoring capstone problem statements and mentoring teams.',
        linkedin: indp.linkedin || '',
        github: indp.github || '',
        portfolio: indp.portfolio || '',
        verifiedStatus: 'Pending Verification',
        projectsCount: 0
      };
    }

    const newUser: AuthUser = {
      id: userId,
      name: data.name.trim(),
      email: normalized,
      password: data.password,
      role: data.role,
      avatar,
      profile: profileData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.users.push(newUser);
    this.persist();

    // Also sync to legacy/shared pv_user_database_v4 for AuthAppView & resolver
    try {
      const dbUsers = storageAdapter.getItem<any[]>('pv_user_database_v4', []);
      const userProfileEntry = {
        id: userId,
        email: normalized,
        passwordHash: data.password,
        fullName: data.name.trim(),
        role: data.role,
        avatar,
        studentType: data.role === 'STUDENT' ? profileData.accountType : undefined,
        institution: profileData.institution,
        department: profileData.department,
        course: profileData.course,
        batch: profileData.batch,
        rollNumber: profileData.rollNumber,
        designation: profileData.designation,
        facultyId: profileData.employeeId || profileData.facultyId,
        skills: profileData.skills || [],
        bio: profileData.bio || '',
        github: profileData.github,
        githubHandle: profileData.githubHandle,
        linkedIn: profileData.linkedin,
        verifiedStatus: 'Pending Verification',
        verificationSignals: {
          emailVerified: true,
          institutionalDomain: Boolean(profileData.institution),
          idProofVerified: Boolean(data.documents && data.documents.length > 0),
          nodeApproval: data.role === 'HOD' || data.role === 'INSTITUTION'
        },
        projectsCount: 0,
        commitsCount: 0,
        rubricScore: 9.0
      };
      const existingIdx = dbUsers.findIndex((u: any) => u.email.toLowerCase() === normalized);
      if (existingIdx !== -1) {
        dbUsers[existingIdx] = userProfileEntry;
      } else {
        dbUsers.push(userProfileEntry);
      }
      storageAdapter.setItem('pv_user_database_v4', dbUsers);
    } catch {
      // ignore
    }

    // Also register in Registration Requests store for audit and reviewer visibility
    try {
      const regRequests = storageAdapter.getItem<any[]>('pv_registration_requests_v4', []);
      const newRegRecord = {
        id: `reg-${Date.now()}`,
        userId,
        role: data.role,
        fullName: data.name.trim(),
        email: normalized,
        mobile: data.mobile || '',
        passwordHash: data.password,
        institution: profileData.institution || '',
        department: profileData.department || '',
        course: profileData.course || '',
        rollNumber: profileData.rollNumber || '',
        documents: (data.documents || []).map(d => ({
          id: d.id,
          fileName: d.fileName,
          fileSize: d.fileSize,
          documentType: d.documentType,
          uploadedAt: d.uploadedAt
        })),
        emailVerified: true,
        mobileVerified: Boolean(data.mobile),
        status: 'PENDING',
        verificationStatus: 'PENDING',
        createdAt: new Date().toISOString()
      };
      regRequests.unshift(newRegRecord);
      storageAdapter.setItem('pv_registration_requests_v4', regRequests);
    } catch {
      // ignore
    }

    return newUser;
  }

  updateUser(id: string, updates: Partial<AuthUser>): AuthUser | null {
    this.ensureInitialized();
    const idx = this.users.findIndex(u => u.id === id);
    if (idx === -1) return null;

    const existing = this.users[idx];
    const updated: AuthUser = {
      ...existing,
      ...updates,
      profile: {
        ...existing.profile,
        ...(updates.profile || {})
      },
      updatedAt: new Date().toISOString()
    };

    this.users[idx] = updated;
    this.persist();
    return { ...updated };
  }
}

export const userService = new UserService();
