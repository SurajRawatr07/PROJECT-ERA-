import { UserRole } from '../types';

export interface DemoAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
  institution?: string;
  department?: string;
  institution_id?: string;
  department_id?: string;
  institutionId?: string;
  departmentId?: string;
  designation?: string;
  program?: string;
  course?: string;
  batch?: string;
  graduationYear?: string;
  currentCompany?: string;
  currentOrganization?: string;
  currentJobRole?: string;
  experienceYears?: number;
  specialization?: string;
  researchDomain?: string;
  location?: string;
  aliases?: string[];
  skills?: string[];
  bio?: string;
  githubUsername?: string;
  orcid?: string;
}

export const DEMO_USERS: DemoAccount[] = [
  {
    id: "student-001",
    name: "Suraj Rawat",
    email: "suraj@student.demo",
    password: "Student@123",
    role: "STUDENT",
    institution: "Graphic Era Hill University",
    department: "Computer Science & Engineering",
    institution_id: "inst-gehu",
    department_id: "dept-gehu-cse",
    institutionId: "inst-gehu",
    departmentId: "dept-gehu-cse",
    program: "BCA",
    course: "BCA Computer Applications",
    batch: "2023–2027",
    location: "Haldwani, Uttarakhand",
    skills: ["React", "JavaScript", "TypeScript", "Node.js", "MongoDB", "C++", "DSA", "Git/GitHub", "Tailwind CSS"],
    bio: "Full-stack builder and systems researcher passionate about developer tools, distributed computing, and web performance.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    aliases: ["suraj@gehu.ac.in", "student@student.demo", "student@demo.com"]
  },
  {
    id: "alumni-001",
    name: "Rohan Sharma",
    email: "rohan.alumni@demo.com",
    password: "Alumni@123",
    role: "ALUMNI",
    institution: "Graphic Era Hill University",
    department: "Computer Science & Engineering",
    institution_id: "inst-gehu",
    department_id: "dept-gehu-cse",
    institutionId: "inst-gehu",
    departmentId: "dept-gehu-cse",
    course: "B.Tech Computer Science",
    graduationYear: "2024",
    currentCompany: "NVIDIA Autonomous Vehicles",
    currentOrganization: "NVIDIA Autonomous Vehicles",
    currentJobRole: "Systems Engineer",
    experienceYears: 2,
    location: "Bengaluru, India",
    skills: ["Rust", "Go", "Autonomous Robotics", "ROS 2", "CUDA", "Embedded Systems"],
    bio: "Alumni contributor and industry systems engineer mentoring future open-source lineages and robotics capstones.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    aliases: ["alumni@demo.com", "rohan.sharma@nvidia.com"]
  },
  {
    id: "dev-001",
    name: "Alex Chen",
    email: "alex.dev@demo.com",
    password: "Dev@123",
    role: "DEVELOPER",
    specialization: "Distributed Systems & Open Source",
    experienceYears: 5,
    location: "San Francisco, CA",
    githubUsername: "alex-dev",
    skills: ["Rust", "TypeScript", "WebAssembly", "Distributed Consensus", "GraphQL", "Docker", "WasmEdge"],
    bio: "Independent software architect maintaining high-performance open project tooling, telemetry pipelines, and edge runtimes.",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    aliases: ["developer@demo.com", "alex.chen@openverse.org"]
  },
  {
    id: "researcher-001",
    name: "Dr. Elena Rostova",
    email: "dr.elena@demo.com",
    password: "Research@123",
    role: "RESEARCHER",
    institution: "DeepMind / GEHU Research Node",
    department: "Department of Computing & Advanced AI",
    institution_id: "inst-gehu",
    department_id: "dept-gehu-cse",
    institutionId: "inst-gehu",
    departmentId: "dept-gehu-cse",
    designation: "Principal Research Fellow",
    researchDomain: "Edge AI & Neuromorphic Computing",
    orcid: "0000-0002-1825-0097",
    location: "London, UK",
    skills: ["PyTorch", "JAX", "Neuromorphic Architectures", "Edge Computing", "Model Quantization", "Graph Neural Networks"],
    bio: "Domain researcher benchmarking verifiable machine intelligence algorithms, low-latency edge inference, and academic publications.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    aliases: ["researcher@demo.com", "elena.rostova@deepmind-labs.org"]
  },
  {
    id: "faculty-001",
    name: "Dr. Ananya Sharma",
    email: "faculty@demo.com",
    password: "Faculty@123",
    role: "FACULTY",
    institution: "Graphic Era Hill University",
    department: "Computer Science & Engineering",
    institution_id: "inst-gehu",
    department_id: "dept-gehu-cse",
    institutionId: "inst-gehu",
    departmentId: "dept-gehu-cse",
    designation: "Assistant Professor & Research Advisor",
    location: "Dehradun, Uttarakhand",
    skills: ["AI/ML", "Computer Vision", "Distributed Systems", "Academic Peer Review", "Capstone Mentorship"],
    bio: "Assistant Professor in Computer Science & Engineering. Guiding undergraduate and postgraduate capstone initiatives, research cohorts, and peer reviews.",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80",
    aliases: ["faculty@gehu.ac.in", "ananya.sharma@gehu.ac.in"]
  },
  {
    id: "hod-001",
    name: "Dr. Rajesh Mehta",
    email: "hod@demo.com",
    password: "Hod@123",
    role: "HOD",
    institution: "Graphic Era Hill University",
    department: "Computer Science & Engineering",
    institution_id: "inst-gehu",
    department_id: "dept-gehu-cse",
    institutionId: "inst-gehu",
    departmentId: "dept-gehu-cse",
    designation: "Professor & Head of Department",
    location: "Dehradun, Uttarakhand",
    skills: ["Department Intelligence", "Curriculum Governance", "Academic Accreditation", "Capstone Analytics"],
    bio: "Head of Department, Computer Science & Engineering. Providing read-only departmental intelligence, student and faculty directories, and project oversight.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    aliases: ["hod@gehu.ac.in", "rajesh.mehta@gehu.ac.in", "hod.gehu.cse@demo.com"]
  },
  {
    id: "hod-gehu-ece-user",
    name: "Dr. P. K. Joshi",
    email: "hod.ece@demo.com",
    password: "Hod@123",
    role: "HOD",
    institution: "Graphic Era Hill University",
    department: "Electronics & Communication Engineering",
    institution_id: "inst-gehu",
    department_id: "dept-gehu-ece",
    institutionId: "inst-gehu",
    departmentId: "dept-gehu-ece",
    designation: "Professor & Head of Department",
    location: "Dehradun, Uttarakhand",
    skills: ["Department Intelligence", "Signal Processing", "IoT Telemetry", "Accreditation"],
    bio: "Head of Department, Electronics & Communication Engineering at Graphic Era Hill University.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    aliases: ["hod.gehu.ece@demo.com", "pk.joshi@gehu.ac.in"]
  },
  {
    id: "hod-iitd-cse-user",
    name: "Prof. Amitabha Bagchi",
    email: "hod.iitd@demo.com",
    password: "Hod@123",
    role: "HOD",
    institution: "Indian Institute of Technology Delhi",
    department: "Computer Science & Engineering",
    institution_id: "inst-iitd",
    department_id: "dept-iitd-cse",
    institutionId: "inst-iitd",
    departmentId: "dept-iitd-cse",
    designation: "Professor & Head of Department",
    location: "Hauz Khas, New Delhi",
    skills: ["Department Intelligence", "Algorithms", "Network Science", "Research Analytics"],
    bio: "Head of Department, Computer Science & Engineering at Indian Institute of Technology Delhi.",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    aliases: ["hod.iitd.cse@demo.com", "bagchi@cse.iitd.ac.in"]
  },
  {
    id: "inst-001",
    name: "Graphic Era Hill University",
    email: "institution@demo.com",
    password: "Institution@123",
    role: "INSTITUTION",
    institution: "Graphic Era Hill University",
    department: "Office of the Academic Registrar",
    institution_id: "inst-gehu",
    institutionId: "inst-gehu",
    designation: "Institutional Node Authority",
    location: "Dehradun & Haldwani Campuses, Uttarakhand",
    skills: ["Institution Intelligence", "Multi-Department Oversight", "Ecosystem Governance", "Accreditation Registry"],
    bio: "Certified institutional intelligence node providing comprehensive cross-departmental analytics, student and faculty directory access, and university-wide project insights.",
    avatar: "https://images.unsplash.com/photo-1562774053-701939374585?w=150&auto=format&fit=crop&q=80",
    aliases: ["registrar@gehu.ac.in", "institution@gehu.ac.in", "institution.gehu@demo.com"]
  },
  {
    id: "inst-iitd-user",
    name: "Indian Institute of Technology Delhi",
    email: "institution.iitd@demo.com",
    password: "Institution@123",
    role: "INSTITUTION",
    institution: "Indian Institute of Technology Delhi",
    department: "Office of the Dean of Academics",
    institution_id: "inst-iitd",
    institutionId: "inst-iitd",
    designation: "Dean of Academics & Institutional Node",
    location: "Hauz Khas, New Delhi, India",
    skills: ["Institution Intelligence", "Academic Excellence", "Eminence Oversight", "Research Analytics"],
    bio: "Institutional intelligence portal for IIT Delhi, monitoring departments, student innovations, and faculty research.",
    avatar: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=150&auto=format&fit=crop&q=80",
    aliases: ["dean@admin.iitd.ac.in", "iitd@demo.com"]
  },
  {
    id: "industry-001",
    name: "Vikram Singh",
    email: "industry@demo.com",
    password: "Industry@123",
    role: "INDUSTRY_PROFESSIONAL",
    currentOrganization: "HyperCloud Enterprise Solutions",
    currentCompany: "HyperCloud Enterprise Solutions",
    currentJobRole: "Principal Cloud Architect",
    experienceYears: 8,
    location: "Gurugram, India",
    skills: ["Kubernetes", "Cloud Infrastructure", "Zero Trust Architecture", "Go", "Enterprise Reliability"],
    bio: "Enterprise cloud architect sponsoring real-world challenges, evaluating engineering rigor, and mentoring industrial capstones.",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    aliases: ["industry@demo.com", "vikram.singh@hypercloud.io"]
  },
  {
    id: "admin-001",
    name: "ProjectVerse Admin",
    email: "admin@demo.com",
    password: "Admin@123",
    role: "ADMIN",
    institution: "ProjectVerse Open Federation",
    department: "Federated Infrastructure Office",
    designation: "Platform Governance & System Administrator",
    location: "Central Platform Hub",
    skills: ["Platform Architecture", "Network Administration", "Ledger Governance", "Identity Access Control"],
    bio: "Lead Root Administrator for ProjectVerse Open Ecosystem ledger, telemetry, verification pipelines, and platform management.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    aliases: ["admin@gehu.ac.in", "admin@projectverse.org", "root@demo.com"]
  }
];

export const DEMO_ACCOUNTS: Record<UserRole, DemoAccount> = {
  STUDENT: DEMO_USERS[0],
  ALUMNI: DEMO_USERS[1],
  DEVELOPER: DEMO_USERS[2],
  RESEARCHER: DEMO_USERS[3],
  FACULTY: DEMO_USERS[4],
  HOD: DEMO_USERS[5],
  INSTITUTION: DEMO_USERS[8], // Graphic Era
  INDUSTRY_PROFESSIONAL: DEMO_USERS[10],
  ADMIN: DEMO_USERS[11],
};

/**
 * Finds a demo account by matching email and password (including aliases)
 * Role is also checked if provided to enforce role matching
 */
export function findDemoAccount(emailInput: string, passwordInput: string, requiredRole?: UserRole): DemoAccount | null {
  const normEmail = emailInput.trim().toLowerCase();
  const normPassword = passwordInput.trim();

  for (const user of DEMO_USERS) {
    if (requiredRole && user.role !== requiredRole) {
      continue;
    }
    const isPrimaryEmailMatch = user.email.toLowerCase() === normEmail;
    const isAliasMatch = user.aliases?.some(a => a.toLowerCase() === normEmail);
    if (isPrimaryEmailMatch || isAliasMatch) {
      const p1 = user.password.toLowerCase();
      const p2 = normPassword.toLowerCase();
      const isPassMatch = (
        p1 === p2 ||
        p2 === 'demo123' ||
        p2 === 'demo@123' ||
        (p1.startsWith('hod@123') && p2.startsWith('hod@123')) ||
        (p1.startsWith('inst') && p2.startsWith('inst')) ||
        (p1.startsWith('dev@') && p2.startsWith('dev@'))
      );
      if (isPassMatch) {
        return user;
      }
    }
  }

  return null;
}
