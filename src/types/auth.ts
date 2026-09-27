export type UserRole = 
  | 'STUDENT'
  | 'FACULTY'
  | 'RESEARCHER'
  | 'ALUMNI'
  | 'DEVELOPER'
  | 'HOD'
  | 'INSTITUTION'
  | 'INDUSTRY_PROFESSIONAL'
  | 'ADMIN';

export type RegistrationRole = 
  | 'STUDENT'
  | 'FACULTY'
  | 'RESEARCHER'
  | 'ALUMNI'
  | 'DEVELOPER'
  | 'HOD'
  | 'INSTITUTION'
  | 'INDUSTRY_PROFESSIONAL';

export type StudentAccountType = 'CURRENT_STUDENT' | 'ALUMNI' | 'PASS_OUT';

export interface StudentRegisterProfile {
  institution: string;
  course?: string;
  program?: string;
  branch?: string;
  academicYear?: string;
  currentYearSemester?: string;
  rollNumber: string;
  studentEmail?: string;
  personalEmail?: string;
  accountType?: StudentAccountType;
  skills: string[];
  bio?: string;
  github?: string;
  linkedin?: string;
}

export interface FacultyRegisterProfile {
  institution: string;
  department: string;
  designation: string;
  employeeId: string;
  bio?: string;
  skills: string[];
  github?: string;
  linkedin?: string;
}

export interface ResearcherRegisterProfile {
  institution: string;
  researchDomain: string;
  designation: string;
  researcherIdOrcid?: string;
  googleScholarUrl?: string;
  skills: string[];
  bio?: string;
  github?: string;
  linkedin?: string;
}

export interface AlumniRegisterProfile {
  previousInstitution: string;
  degreeCourse: string;
  graduationYear: string;
  alumniId?: string;
  currentOrganization?: string;
  currentJobRole?: string;
  skills: string[];
  bio?: string;
  github?: string;
  linkedin?: string;
}

export interface DeveloperRegisterProfile {
  specialization: string;
  skills: string[];
  experienceLevel: string;
  bio?: string;
  github: string;
  githubVerified?: boolean;
  githubProfileData?: any;
  linkedin?: string;
  portfolio?: string;
}

export interface HodRegisterProfile {
  institution: string;
  department: string;
  designation: string;
  employeeId: string;
  bio?: string;
  linkedin?: string;
}

export interface InstitutionRegisterProfile {
  institutionName: string;
  institutionType: string;
  website: string;
  address: string;
  representativeName: string;
  representativeDesignation: string;
  contactNumber: string;
  officialEmail: string;
  linkedin?: string;
  bio?: string;
}

export interface IndustryProfessionalRegisterProfile {
  company: string;
  jobTitle: string;
  industry: string;
  experienceYears: string;
  skills: string[];
  bio?: string;
  linkedin: string;
  github?: string;
  portfolio?: string;
}

export interface UploadedDocMetadata {
  id: string;
  fileName: string;
  fileSize: string;
  documentType: string;
  fileData?: string;
  rawFile?: any;
  uploadedAt: string;
  verificationStatus: 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'RESUBMIT_REQUIRED';
}

export interface RegisterData {
  name: string;
  email: string;
  mobile?: string;
  password: string;
  role: RegistrationRole;
  location?: string;
  bio?: string;
  avatar?: string;
  // Role-specific profiles
  studentProfile?: StudentRegisterProfile;
  facultyProfile?: FacultyRegisterProfile;
  researcherProfile?: ResearcherRegisterProfile;
  alumniProfile?: AlumniRegisterProfile;
  developerProfile?: DeveloperRegisterProfile;
  hodProfile?: HodRegisterProfile;
  institutionProfile?: InstitutionRegisterProfile;
  industryProfile?: IndustryProfessionalRegisterProfile;
  // Document metadata
  documents?: UploadedDocMetadata[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  profile: {
    institution?: string;
    department?: string;
    designation?: string;
    program?: string;
    course?: string;
    academicYear?: string;
    batch?: string;
    rollNumber?: string;
    accountType?: StudentAccountType;
    employeeId?: string;
    skills?: string[];
    bio?: string;
    github?: string;
    githubHandle?: string;
    linkedin?: string;
    portfolio?: string;
    location?: string;
    verifiedStatus?: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface SessionData {
  userId: string;
  role: UserRole;
  token: string;
  user?: any;
  createdAt: number;
  expiresAt: number;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  role?: UserRole;
  token?: string;
  error?: string;
  message?: string;
}

export interface AuthServiceContract {
  register(data: RegisterData): Promise<AuthResult>;
  login(email: string, password: string): Promise<AuthResult>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
}
