import { ProjectItem, ProjectDomain, Contributor, VerificationStatus } from '../types';
import { getInitialsAvatar } from '../lib/authService';

export interface DepartmentEntity {
  id: string;
  institution_id: string;
  name: string;
  code: string;
  hodName: string;
  hodDesignation: string;
  hodEmail: string;
  hodId: string;
  studentCount: number;
  facultyCount: number;
  projectCount: number;
  verifiedProjectsCount: number;
  domains: string[];
}

export interface InstitutionEntity {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  location: string;
  website: string;
  type: string;
  accreditationTier: string;
  departments: DepartmentEntity[];
}

export interface StudentEntity {
  id: string;
  institution_id: string;
  department_id: string;
  institutionName: string;
  departmentName: string;
  name: string;
  email: string;
  rollNumber: string;
  course: string;
  batch: string;
  skills: string[];
  avatar: string;
  projectTitles: string[];
  verifiedStatus: string;
}

export interface FacultyEntity {
  id: string;
  institution_id: string;
  department_id: string;
  institutionName: string;
  departmentName: string;
  name: string;
  email: string;
  facultyId: string;
  designation: string;
  specialization: string;
  avatar: string;
  adviseesCount: number;
  projectsCount: number;
  projectTitles: string[];
}

export interface HODEntity {
  id: string;
  institution_id: string;
  department_id: string;
  institutionName: string;
  departmentName: string;
  name: string;
  email: string;
  designation: string;
  avatar: string;
  studentCount: number;
  facultyCount: number;
  projectCount: number;
}

// ============================================================================
// 1. INSTITUTIONS DEFINITION (GEHU & IIT DELHI)
// ============================================================================

export const INSTITUTIONS: InstitutionEntity[] = [
  {
    id: 'inst-gehu',
    name: 'Graphic Era Hill University',
    shortName: 'GEHU',
    logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=150&auto=format&fit=crop&q=80',
    location: 'Dehradun & Haldwani, Uttarakhand, India',
    website: 'https://gehu.ac.in',
    type: 'State Private University / Academic Node',
    accreditationTier: 'NAAC A+ / NBA Accredited',
    departments: [
      {
        id: 'dept-gehu-cse',
        institution_id: 'inst-gehu',
        name: 'Computer Science & Engineering',
        code: 'CSE',
        hodName: 'Dr. Rajesh Mehta',
        hodDesignation: 'Professor & Head of Department',
        hodEmail: 'hod@demo.com',
        hodId: 'hod-gehu-cse',
        studentCount: 820,
        facultyCount: 38,
        projectCount: 86,
        verifiedProjectsCount: 78,
        domains: ['Autonomous Systems & Robotics', 'AI & Machine Learning', 'Web3 & Distributed Ledgers', 'Cloud & Edge Computing']
      },
      {
        id: 'dept-gehu-ece',
        institution_id: 'inst-gehu',
        name: 'Electronics & Communication Engineering',
        code: 'ECE',
        hodName: 'Dr. P. K. Joshi',
        hodDesignation: 'Professor & Head of Department',
        hodEmail: 'hod.ece@demo.com',
        hodId: 'hod-gehu-ece',
        studentCount: 510,
        facultyCount: 24,
        projectCount: 48,
        verifiedProjectsCount: 42,
        domains: ['IoT & Embedded Telemetry', 'Signal Processing', 'Wireless Communications']
      },
      {
        id: 'dept-gehu-me',
        institution_id: 'inst-gehu',
        name: 'Mechanical & Robotics Engineering',
        code: 'ME',
        hodName: 'Dr. S. R. Verma',
        hodDesignation: 'Professor & Head of Department',
        hodEmail: 'sr.verma@gehu.ac.in',
        hodId: 'hod-gehu-me',
        studentCount: 440,
        facultyCount: 22,
        projectCount: 36,
        verifiedProjectsCount: 31,
        domains: ['Biomechatronics & Exoskeletons', 'CAD/CAM & FEA', 'Autonomous Drones']
      }
    ]
  },
  {
    id: 'inst-iitd',
    name: 'Indian Institute of Technology Delhi',
    shortName: 'IIT Delhi',
    logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=150&auto=format&fit=crop&q=80',
    location: 'Hauz Khas, New Delhi, 110016, India',
    website: 'https://home.iitd.ac.in',
    type: 'Institute of National Importance (INI)',
    accreditationTier: 'NIRF Top 2 / Institution of Eminence',
    departments: [
      {
        id: 'dept-iitd-cse',
        institution_id: 'inst-iitd',
        name: 'Computer Science & Engineering',
        code: 'CSE',
        hodName: 'Prof. Amitabha Bagchi',
        hodDesignation: 'Professor & Head of Department',
        hodEmail: 'hod.iitd@demo.com',
        hodId: 'hod-iitd-cse',
        studentCount: 650,
        facultyCount: 32,
        projectCount: 74,
        verifiedProjectsCount: 70,
        domains: ['Distributed Systems', 'Theoretical Computer Science', 'Computational Biology', 'AI & Deep Learning']
      },
      {
        id: 'dept-iitd-ee',
        institution_id: 'inst-iitd',
        name: 'Electrical Engineering',
        code: 'EE',
        hodName: 'Prof. Nilanjan Senroy',
        hodDesignation: 'Professor & Head of Department',
        hodEmail: 'nsenroy@ee.iitd.ac.in',
        hodId: 'hod-iitd-ee',
        studentCount: 580,
        facultyCount: 28,
        projectCount: 62,
        verifiedProjectsCount: 58,
        domains: ['Smart Grid & EV Drives', 'Power Electronics', 'High-Speed Integrated Photonics']
      }
    ]
  }
];

// ============================================================================
// 2. STUDENTS (STRICTLY ASSOCIATED WITH INSTITUTION & DEPARTMENT)
// ============================================================================

export const ISOLATED_STUDENTS: StudentEntity[] = [
  // GEHU CSE
  {
    id: 'stu-gehu-cse-1',
    institution_id: 'inst-gehu',
    department_id: 'dept-gehu-cse',
    institutionName: 'Graphic Era Hill University',
    departmentName: 'Computer Science & Engineering',
    name: 'Suraj Rawat',
    email: 'suraj@student.demo',
    rollNumber: 'GEHU/2023/BCA/089',
    course: 'BCA (Computer Applications)',
    batch: '2023–2027',
    skills: ['React', 'TypeScript', 'Node.js', 'ROS 2', 'PyTorch'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    projectTitles: ['AeroSync: Edge-Neuromorphic Drone Swarm Guidance', 'Zero-Knowledge Credential Oracle'],
    verifiedStatus: 'Verified'
  },
  {
    id: 'stu-gehu-cse-2',
    institution_id: 'inst-gehu',
    department_id: 'dept-gehu-cse',
    institutionName: 'Graphic Era Hill University',
    departmentName: 'Computer Science & Engineering',
    name: 'Rohan Verma',
    email: 'rohan.verma@gehu.ac.in',
    rollNumber: 'GEHU/2023/CS/302',
    course: 'B.Tech CSE',
    batch: '2023–2027',
    skills: ['Python', 'C++', 'PyTorch', 'Computer Vision'],
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    projectTitles: ['AeroSync: Edge-Neuromorphic Drone Swarm Guidance'],
    verifiedStatus: 'Verified'
  },
  {
    id: 'stu-gehu-cse-3',
    institution_id: 'inst-gehu',
    department_id: 'dept-gehu-cse',
    institutionName: 'Graphic Era Hill University',
    departmentName: 'Computer Science & Engineering',
    name: 'Aditi Pant',
    email: 'aditi.pant@gehu.ac.in',
    rollNumber: 'GEHU/2024/CS/114',
    course: 'B.Tech CSE',
    batch: '2024–2028',
    skills: ['Go', 'Distributed Systems', 'Solidity'],
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    projectTitles: ['Distributed Ledger Pipeline for Capstones'],
    verifiedStatus: 'Verified'
  },
  {
    id: 'stu-gehu-cse-4',
    institution_id: 'inst-gehu',
    department_id: 'dept-gehu-cse',
    institutionName: 'Graphic Era Hill University',
    departmentName: 'Computer Science & Engineering',
    name: 'Ayush Joshi',
    email: 'ayush.joshi@gehu.ac.in',
    rollNumber: 'GEHU/2023/CS/208',
    course: 'B.Tech CSE',
    batch: '2023–2027',
    skills: ['Kubernetes', 'Docker', 'Linux Internals', 'Golang'],
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    projectTitles: ['Cloud-Native Autonomous Telemetry Aggregator'],
    verifiedStatus: 'Verified'
  },

  // GEHU ECE
  {
    id: 'stu-gehu-ece-1',
    institution_id: 'inst-gehu',
    department_id: 'dept-gehu-ece',
    institutionName: 'Graphic Era Hill University',
    departmentName: 'Electronics & Communication Engineering',
    name: 'Kavita Negi',
    email: 'kavita.ece@gehu.ac.in',
    rollNumber: 'GEHU/2023/ECE/045',
    course: 'B.Tech ECE',
    batch: '2023–2027',
    skills: ['Embedded C', 'VLSI', 'MATLAB', 'IoT Telemetry'],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    projectTitles: ['Smart Substation IoT Telemetry & Fault Isolation'],
    verifiedStatus: 'Verified'
  },
  {
    id: 'stu-gehu-ece-2',
    institution_id: 'inst-gehu',
    department_id: 'dept-gehu-ece',
    institutionName: 'Graphic Era Hill University',
    departmentName: 'Electronics & Communication Engineering',
    name: 'Deepak Bhatt',
    email: 'deepak.ece@gehu.ac.in',
    rollNumber: 'GEHU/2023/ECE/112',
    course: 'B.Tech ECE',
    batch: '2023–2027',
    skills: ['LoRaWAN', 'PCB Design', 'ESP32', 'FreeRTOS'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    projectTitles: ['Low-Power LoRaWAN Environmental Gateway'],
    verifiedStatus: 'Verified'
  },

  // GEHU ME
  {
    id: 'stu-gehu-me-1',
    institution_id: 'inst-gehu',
    department_id: 'dept-gehu-me',
    institutionName: 'Graphic Era Hill University',
    departmentName: 'Mechanical & Robotics Engineering',
    name: 'Tarun Mehra',
    email: 'tarun.me@gehu.ac.in',
    rollNumber: 'GEHU/2023/ME/078',
    course: 'B.Tech ME',
    batch: '2023–2027',
    skills: ['SolidWorks', 'ANSYS', 'Actuator Kinematics', 'Mechatronics'],
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    projectTitles: ['Bipedal Robotic Exoskeleton Gait Stabilizer'],
    verifiedStatus: 'Verified'
  },

  // IIT DELHI CSE
  {
    id: 'stu-iitd-cse-1',
    institution_id: 'inst-iitd',
    department_id: 'dept-iitd-cse',
    institutionName: 'Indian Institute of Technology Delhi',
    departmentName: 'Computer Science & Engineering',
    name: 'Aarav Mathur',
    email: 'aarav.iitd@student.demo',
    rollNumber: '2023CS10234',
    course: 'B.Tech CSE',
    batch: '2023–2027',
    skills: ['Rust', 'Distributed Systems', 'C++', 'Raft Consensus'],
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    projectTitles: ['Distributed Consensus & Fault-Tolerant Raft Engine'],
    verifiedStatus: 'Verified'
  },
  {
    id: 'stu-iitd-cse-2',
    institution_id: 'inst-iitd',
    department_id: 'dept-iitd-cse',
    institutionName: 'Indian Institute of Technology Delhi',
    departmentName: 'Computer Science & Engineering',
    name: 'Diya Bansal',
    email: 'diya.bansal@cse.iitd.ac.in',
    rollNumber: '2023CS10567',
    course: 'B.Tech CSE',
    batch: '2023–2027',
    skills: ['PyTorch Geometric', 'Graph Neural Networks', 'Python', 'Biopython'],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    projectTitles: ['Graph Neural Network for Molecular Discovery'],
    verifiedStatus: 'Verified'
  },
  {
    id: 'stu-iitd-cse-3',
    institution_id: 'inst-iitd',
    department_id: 'dept-iitd-cse',
    institutionName: 'Indian Institute of Technology Delhi',
    departmentName: 'Computer Science & Engineering',
    name: 'Kunal Kapoor',
    email: 'kunal.kapoor@cse.iitd.ac.in',
    rollNumber: '2024CS50112',
    course: 'M.Tech CSE',
    batch: '2024–2026',
    skills: ['CUDA', 'GPU Computing', 'C++', 'High Performance Computing'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    projectTitles: ['High-Throughput Stream Compaction on GPU'],
    verifiedStatus: 'Verified'
  },

  // IIT DELHI EE
  {
    id: 'stu-iitd-ee-1',
    institution_id: 'inst-iitd',
    department_id: 'dept-iitd-ee',
    institutionName: 'Indian Institute of Technology Delhi',
    departmentName: 'Electrical Engineering',
    name: 'Priya Saxena',
    email: 'priya.ee@iitd.ac.in',
    rollNumber: '2023EE10128',
    course: 'B.Tech EE',
    batch: '2023–2027',
    skills: ['Power Electronics', 'Simulink', 'DSP', 'GaN Inverters'],
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    projectTitles: ['Bidirectional DC-DC EV Supercharger Controller'],
    verifiedStatus: 'Verified'
  },
  {
    id: 'stu-iitd-ee-2',
    institution_id: 'inst-iitd',
    department_id: 'dept-iitd-ee',
    institutionName: 'Indian Institute of Technology Delhi',
    departmentName: 'Electrical Engineering',
    name: 'Varun Reddy',
    email: 'varun.reddy@ee.iitd.ac.in',
    rollNumber: '2023EE10344',
    course: 'B.Tech EE',
    batch: '2023–2027',
    skills: ['Smart Grid', 'FPGA', 'Verilog', 'Microgrid Protection'],
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    projectTitles: ['Photovoltaic Grid-Tied Inverter Telemetry'],
    verifiedStatus: 'Verified'
  }
];

// ============================================================================
// 3. FACULTY (STRICTLY ASSOCIATED WITH INSTITUTION & DEPARTMENT)
// ============================================================================

export const ISOLATED_FACULTY: FacultyEntity[] = [
  // GEHU CSE
  {
    id: 'fac-gehu-cse-1',
    institution_id: 'inst-gehu',
    department_id: 'dept-gehu-cse',
    institutionName: 'Graphic Era Hill University',
    departmentName: 'Computer Science & Engineering',
    name: 'Dr. Ananya Sharma',
    email: 'faculty@demo.com',
    facultyId: 'EMP-GEHU-FAC-409',
    designation: 'Assistant Professor & Research Advisor',
    specialization: 'AI/ML & Distributed Systems',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    adviseesCount: 8,
    projectsCount: 6,
    projectTitles: ['AeroSync: Edge-Neuromorphic Drone Swarm Guidance', 'Zero-Knowledge Credential Oracle']
  },
  {
    id: 'fac-gehu-cse-2',
    institution_id: 'inst-gehu',
    department_id: 'dept-gehu-cse',
    institutionName: 'Graphic Era Hill University',
    departmentName: 'Computer Science & Engineering',
    name: 'Dr. Naveen Chandra',
    email: 'naveen.chandra@gehu.ac.in',
    facultyId: 'EMP-GEHU-FAC-312',
    designation: 'Associate Professor',
    specialization: 'Cloud & Network Security',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    adviseesCount: 6,
    projectsCount: 4,
    projectTitles: ['Cloud-Native Autonomous Telemetry Aggregator']
  },
  {
    id: 'fac-gehu-cse-3',
    institution_id: 'inst-gehu',
    department_id: 'dept-gehu-cse',
    institutionName: 'Graphic Era Hill University',
    departmentName: 'Computer Science & Engineering',
    name: 'Dr. Shalini Bisht',
    email: 'shalini.bisht@gehu.ac.in',
    facultyId: 'EMP-GEHU-FAC-502',
    designation: 'Assistant Professor',
    specialization: 'Distributed Ledgers & NLP',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    adviseesCount: 5,
    projectsCount: 3,
    projectTitles: ['Distributed Ledger Pipeline for Capstones']
  },

  // GEHU ECE
  {
    id: 'fac-gehu-ece-1',
    institution_id: 'inst-gehu',
    department_id: 'dept-gehu-ece',
    institutionName: 'Graphic Era Hill University',
    departmentName: 'Electronics & Communication Engineering',
    name: 'Dr. Sunita Negi',
    email: 'sunita.negi@gehu.ac.in',
    facultyId: 'EMP-GEHU-FAC-201',
    designation: 'Associate Professor',
    specialization: 'Embedded Systems & IoT Telemetry',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    adviseesCount: 7,
    projectsCount: 5,
    projectTitles: ['Smart Substation IoT Telemetry & Fault Isolation', 'Low-Power LoRaWAN Environmental Gateway']
  },
  {
    id: 'fac-gehu-ece-2',
    institution_id: 'inst-gehu',
    department_id: 'dept-gehu-ece',
    institutionName: 'Graphic Era Hill University',
    departmentName: 'Electronics & Communication Engineering',
    name: 'Dr. P. K. Joshi',
    email: 'pk.joshi@gehu.ac.in',
    facultyId: 'EMP-GEHU-FAC-102',
    designation: 'Professor',
    specialization: 'Signal Processing & Communication Systems',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    adviseesCount: 9,
    projectsCount: 7,
    projectTitles: ['Smart Substation IoT Telemetry & Fault Isolation']
  },

  // GEHU ME
  {
    id: 'fac-gehu-me-1',
    institution_id: 'inst-gehu',
    department_id: 'dept-gehu-me',
    institutionName: 'Graphic Era Hill University',
    departmentName: 'Mechanical & Robotics Engineering',
    name: 'Dr. S. R. Verma',
    email: 'sr.verma@gehu.ac.in',
    facultyId: 'EMP-GEHU-FAC-108',
    designation: 'Professor',
    specialization: 'Robotics, Biomechatronics & Kinematics',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    adviseesCount: 8,
    projectsCount: 6,
    projectTitles: ['Bipedal Robotic Exoskeleton Gait Stabilizer']
  },

  // IIT DELHI CSE
  {
    id: 'fac-iitd-cse-1',
    institution_id: 'inst-iitd',
    department_id: 'dept-iitd-cse',
    institutionName: 'Indian Institute of Technology Delhi',
    departmentName: 'Computer Science & Engineering',
    name: 'Prof. Chetan Arora',
    email: 'faculty.iitd@demo.com',
    facultyId: 'IITD-FAC-CS-01',
    designation: 'Professor & Chair of Systems',
    specialization: 'Computer Vision & Deep Learning',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    adviseesCount: 10,
    projectsCount: 8,
    projectTitles: ['Distributed Consensus & Fault-Tolerant Raft Engine']
  },
  {
    id: 'fac-iitd-cse-2',
    institution_id: 'inst-iitd',
    department_id: 'dept-iitd-cse',
    institutionName: 'Indian Institute of Technology Delhi',
    departmentName: 'Computer Science & Engineering',
    name: 'Prof. Maya Raman',
    email: 'maya.raman@iitd.ac.in',
    facultyId: 'IITD-FAC-CS-02',
    designation: 'Associate Professor',
    specialization: 'Graph Neural Networks & Computational Biology',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    adviseesCount: 7,
    projectsCount: 5,
    projectTitles: ['Graph Neural Network for Molecular Discovery', 'High-Throughput Stream Compaction on GPU']
  },

  // IIT DELHI EE
  {
    id: 'fac-iitd-ee-1',
    institution_id: 'inst-iitd',
    department_id: 'dept-iitd-ee',
    institutionName: 'Indian Institute of Technology Delhi',
    departmentName: 'Electrical Engineering',
    name: 'Prof. Nilanjan Senroy',
    email: 'nsenroy@ee.iitd.ac.in',
    facultyId: 'IITD-FAC-EE-01',
    designation: 'Professor',
    specialization: 'Power Systems & Microgrid Stability',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    adviseesCount: 9,
    projectsCount: 7,
    projectTitles: ['Bidirectional DC-DC EV Supercharger Controller']
  },
  {
    id: 'fac-iitd-ee-2',
    institution_id: 'inst-iitd',
    department_id: 'dept-iitd-ee',
    institutionName: 'Indian Institute of Technology Delhi',
    departmentName: 'Electrical Engineering',
    name: 'Prof. Sukumar Mishra',
    email: 'smishra@ee.iitd.ac.in',
    facultyId: 'IITD-FAC-EE-02',
    designation: 'Professor',
    specialization: 'Renewable Power Electronics & Solar Inverters',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    adviseesCount: 8,
    projectsCount: 6,
    projectTitles: ['Photovoltaic Grid-Tied Inverter Telemetry']
  }
];

// ============================================================================
// 4. HODs (STRICTLY ASSOCIATED WITH INSTITUTION & DEPARTMENT)
// ============================================================================

export const ISOLATED_HODS: HODEntity[] = [
  // GEHU CSE
  {
    id: 'hod-gehu-cse',
    institution_id: 'inst-gehu',
    department_id: 'dept-gehu-cse',
    institutionName: 'Graphic Era Hill University',
    departmentName: 'Computer Science & Engineering',
    name: 'Dr. Rajesh Mehta',
    email: 'hod@demo.com',
    designation: 'Professor & Head of Department',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    studentCount: 820,
    facultyCount: 38,
    projectCount: 86
  },
  // GEHU ECE
  {
    id: 'hod-gehu-ece',
    institution_id: 'inst-gehu',
    department_id: 'dept-gehu-ece',
    institutionName: 'Graphic Era Hill University',
    departmentName: 'Electronics & Communication Engineering',
    name: 'Dr. P. K. Joshi',
    email: 'hod.ece@demo.com',
    designation: 'Professor & Head of Department',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    studentCount: 510,
    facultyCount: 24,
    projectCount: 48
  },
  // GEHU ME
  {
    id: 'hod-gehu-me',
    institution_id: 'inst-gehu',
    department_id: 'dept-gehu-me',
    institutionName: 'Graphic Era Hill University',
    departmentName: 'Mechanical & Robotics Engineering',
    name: 'Dr. S. R. Verma',
    email: 'sr.verma@gehu.ac.in',
    designation: 'Professor & Head of Department',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    studentCount: 440,
    facultyCount: 22,
    projectCount: 36
  },

  // IIT DELHI CSE
  {
    id: 'hod-iitd-cse',
    institution_id: 'inst-iitd',
    department_id: 'dept-iitd-cse',
    institutionName: 'Indian Institute of Technology Delhi',
    departmentName: 'Computer Science & Engineering',
    name: 'Prof. Amitabha Bagchi',
    email: 'hod.iitd@demo.com',
    designation: 'Professor & Head of Department',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    studentCount: 650,
    facultyCount: 32,
    projectCount: 74
  },
  // IIT DELHI EE
  {
    id: 'hod-iitd-ee',
    institution_id: 'inst-iitd',
    department_id: 'dept-iitd-ee',
    institutionName: 'Indian Institute of Technology Delhi',
    departmentName: 'Electrical Engineering',
    name: 'Prof. Nilanjan Senroy',
    email: 'nsenroy@ee.iitd.ac.in',
    designation: 'Professor & Head of Department',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    studentCount: 580,
    facultyCount: 28,
    projectCount: 62
  }
];

// ============================================================================
// 5. PROJECTS (STRICTLY ASSOCIATED WITH INSTITUTION & DEPARTMENT)
// ============================================================================

export const ISOLATED_PROJECTS: ProjectItem[] = [
  // GEHU CSE PROJECTS
  {
    id: 'proj-gehu-cse-1',
    passportId: 'PV-GEHU-CSE-2025-01',
    title: 'AeroSync: Edge-Neuromorphic Drone Swarm Guidance',
    tagline: 'Sub-millisecond visual-inertial odometry for collaborative search swarms without GPS.',
    description: 'An open academic framework for collaborative multi-agent micro-UAV navigation in GPS-denied disaster environments. Developed at Graphic Era Hill University CSE Robotics Lab.',
    domain: 'Autonomous Systems & Robotics',
    techStack: ['C++', 'ROS 2', 'PyTorch', 'NVIDIA Jetson', 'PX4 Autopilot', 'CUDA'],
    institution: 'Graphic Era Hill University',
    department: 'Computer Science & Engineering',
    institution_id: 'inst-gehu',
    department_id: 'dept-gehu-cse',
    institutionId: 'inst-gehu',
    departmentId: 'dept-gehu-cse',
    academicYear: '2025 – 2026',
    status: 'Verified',
    coverGradient: 'from-blue-900/60 via-indigo-950/40 to-slate-900',
    featured: true,
    githubStars: 342,
    githubCommits: 840,
    lineageBatchesCount: 3,
    openRoles: ['Perception Engineer', 'SLAM Specialist'],
    facultyGuide: 'Dr. Ananya Sharma',
    lastUpdated: '2 hours ago',
    contributors: [
      {
        name: 'Suraj Rawat',
        role: 'Team Lead & SLAM Pipeline',
        institution: 'Graphic Era Hill University',
        batch: 'BCA \'27',
        avatar: getInitialsAvatar('Suraj Rawat', 'STUDENT'),
        githubHandle: 'surajrawat-dev',
        commitsCount: 384
      },
      {
        name: 'Rohan Verma',
        role: 'Edge AI & Spiking Neural Nets',
        institution: 'Graphic Era Hill University',
        batch: 'B.Tech \'27',
        avatar: getInitialsAvatar('Rohan Verma', 'STUDENT'),
        githubHandle: 'rohan-snns',
        commitsCount: 260
      }
    ],
    lineage: [],
    passport: {
      passportId: 'PV-GEHU-CSE-2025-01',
      qrHash: 'aerosync-gehu-cse-01',
      projectName: 'AeroSync: Edge-Neuromorphic Drone Swarm Guidance',
      tagline: 'Sub-millisecond visual-inertial odometry for search swarms without GPS.',
      institution: 'Graphic Era Hill University',
      department: 'Computer Science & Engineering',
      academicYear: '2025 – 2026',
      originalBatch: '2024 Alpha',
      currentBatch: '2025 Beta',
      status: 'Verified',
      license: 'Apache 2.0',
      techStack: ['C++', 'ROS 2', 'PyTorch', 'Jetson'],
      githubRepo: 'https://github.com/gehu-cse/aerosync',
      totalCommits: 840,
      activeContributors: 2,
      mergedPRs: 42,
      codeHealthScore: 98,
      testCoverage: 94,
      stars: 342,
      forks: 58,
      facultyReviewer: {
        name: 'Dr. Ananya Sharma',
        title: 'Assistant Professor & Advisor',
        department: 'Computer Science & Engineering',
        institution: 'Graphic Era Hill University',
        score: 9.8,
        reviewText: 'Outstanding implementation of real-time SLAM odometry verified on physical hardware testbeds.',
        verifiedAt: '2025-08-15',
        signatureHash: 'sig-gehu-fac-409-aerosync'
      },
      institutionalValidationCode: 'GEHU-CSE-2025-PASSPORT-01',
      rubricScores: { novelty: 9.8, technicalRigor: 9.7, documentation: 9.5, continuityPotential: 9.9 }
    }
  },
  {
    id: 'proj-gehu-cse-2',
    passportId: 'PV-GEHU-CSE-2025-02',
    title: 'Zero-Knowledge Credential Oracle',
    tagline: 'Privacy-preserving verification of academic degrees and verifiable credentials.',
    description: 'Cryptographic zero-knowledge proof circuit generating verifiable academic attestations without exposing student PII to third-party employers.',
    domain: 'Web3 & Distributed Ledgers',
    techStack: ['Circom', 'SnarkJS', 'Solidity', 'TypeScript', 'Next.js'],
    institution: 'Graphic Era Hill University',
    department: 'Computer Science & Engineering',
    institution_id: 'inst-gehu',
    department_id: 'dept-gehu-cse',
    institutionId: 'inst-gehu',
    departmentId: 'dept-gehu-cse',
    academicYear: '2025 – 2026',
    status: 'Verified',
    coverGradient: 'from-emerald-950 via-teal-900 to-slate-900',
    featured: false,
    githubStars: 184,
    githubCommits: 312,
    lineageBatchesCount: 2,
    openRoles: ['ZK Circuit Auditor'],
    facultyGuide: 'Dr. Ananya Sharma',
    lastUpdated: '1 day ago',
    contributors: [
      {
        name: 'Suraj Rawat',
        role: 'ZK Circuit Architect',
        institution: 'Graphic Era Hill University',
        batch: 'BCA \'27',
        avatar: getInitialsAvatar('Suraj Rawat', 'STUDENT'),
        githubHandle: 'surajrawat-dev',
        commitsCount: 210
      }
    ],
    lineage: [],
    passport: {
      passportId: 'PV-GEHU-CSE-2025-02',
      qrHash: 'zk-oracle-gehu-cse-02',
      projectName: 'Zero-Knowledge Credential Oracle',
      tagline: 'Privacy-preserving verification of academic credentials.',
      institution: 'Graphic Era Hill University',
      department: 'Computer Science & Engineering',
      academicYear: '2025 – 2026',
      originalBatch: '2025 Genesis',
      currentBatch: '2025 Stable',
      status: 'Verified',
      license: 'MIT',
      techStack: ['Circom', 'Solidity', 'TypeScript'],
      githubRepo: 'https://github.com/gehu-cse/zk-academic-oracle',
      totalCommits: 312,
      activeContributors: 1,
      mergedPRs: 24,
      codeHealthScore: 96,
      testCoverage: 91,
      stars: 184,
      forks: 32,
      facultyReviewer: {
        name: 'Dr. Ananya Sharma',
        title: 'Assistant Professor & Advisor',
        department: 'Computer Science & Engineering',
        institution: 'Graphic Era Hill University',
        score: 9.6,
        reviewText: 'Rigorous cryptographic circuit verification with robust gas-optimized verification contracts.',
        verifiedAt: '2025-09-02',
        signatureHash: 'sig-gehu-fac-409-zk'
      },
      institutionalValidationCode: 'GEHU-CSE-2025-PASSPORT-02',
      rubricScores: { novelty: 9.6, technicalRigor: 9.8, documentation: 9.2, continuityPotential: 9.4 }
    }
  },
  {
    id: 'proj-gehu-cse-3',
    passportId: 'PV-GEHU-CSE-2025-03',
    title: 'Distributed Ledger Pipeline for Capstones',
    tagline: 'High-throughput immutable log for university capstone evaluation and rubric consensus.',
    description: 'Byzantine fault-tolerant consensus pipeline recording faculty grading milestones with cryptographic tamper resistance.',
    domain: 'Web3 & Distributed Ledgers',
    techStack: ['Go', 'gRPC', 'PostgreSQL', 'Docker', 'Raft'],
    institution: 'Graphic Era Hill University',
    department: 'Computer Science & Engineering',
    institution_id: 'inst-gehu',
    department_id: 'dept-gehu-cse',
    institutionId: 'inst-gehu',
    departmentId: 'dept-gehu-cse',
    academicYear: '2024 – 2025',
    status: 'Verified',
    coverGradient: 'from-purple-950 via-indigo-900 to-slate-900',
    featured: false,
    githubStars: 142,
    githubCommits: 290,
    lineageBatchesCount: 1,
    openRoles: ['Go Core Developer'],
    facultyGuide: 'Dr. Shalini Bisht',
    lastUpdated: '3 days ago',
    contributors: [
      {
        name: 'Aditi Pant',
        role: 'Lead Backend Systems',
        institution: 'Graphic Era Hill University',
        batch: 'B.Tech \'28',
        avatar: getInitialsAvatar('Aditi Pant', 'STUDENT'),
        githubHandle: 'aditipant-dev',
        commitsCount: 190
      }
    ],
    lineage: [],
    passport: {
      passportId: 'PV-GEHU-CSE-2025-03',
      qrHash: 'ledger-gehu-cse-03',
      projectName: 'Distributed Ledger Pipeline for Capstones',
      tagline: 'High-throughput immutable log for capstone milestones.',
      institution: 'Graphic Era Hill University',
      department: 'Computer Science & Engineering',
      academicYear: '2024 – 2025',
      originalBatch: '2024 Genesis',
      currentBatch: '2024 Release',
      status: 'Verified',
      license: 'Apache 2.0',
      techStack: ['Go', 'Raft', 'gRPC'],
      githubRepo: 'https://github.com/gehu-cse/capstone-ledger',
      totalCommits: 290,
      activeContributors: 1,
      mergedPRs: 18,
      codeHealthScore: 94,
      testCoverage: 89,
      stars: 142,
      forks: 21,
      facultyReviewer: {
        name: 'Dr. Shalini Bisht',
        title: 'Assistant Professor',
        department: 'Computer Science & Engineering',
        institution: 'Graphic Era Hill University',
        score: 9.4,
        reviewText: 'Impressive Raft consensus benchmark results reaching 24k transactions/sec on local cluster.',
        verifiedAt: '2025-04-18',
        signatureHash: 'sig-gehu-fac-502-ledger'
      },
      institutionalValidationCode: 'GEHU-CSE-2025-PASSPORT-03',
      rubricScores: { novelty: 9.2, technicalRigor: 9.6, documentation: 9.1, continuityPotential: 9.5 }
    }
  },

  // GEHU ECE PROJECTS
  {
    id: 'proj-gehu-ece-1',
    passportId: 'PV-GEHU-ECE-2025-01',
    title: 'Smart Substation IoT Telemetry & Fault Isolation',
    tagline: 'Real-time phase-angle monitoring and transient arc detection using edge microcontrollers.',
    description: 'High-speed analog sampling and LoRa telemetry system deployed in campus substations to predict transformer thermal overload.',
    domain: 'Cybersecurity & Infrastructure',
    techStack: ['Embedded C', 'FreeRTOS', 'LoRaWAN', 'STM32', 'Python', 'InfluxDB'],
    institution: 'Graphic Era Hill University',
    department: 'Electronics & Communication Engineering',
    institution_id: 'inst-gehu',
    department_id: 'dept-gehu-ece',
    institutionId: 'inst-gehu',
    departmentId: 'dept-gehu-ece',
    academicYear: '2025 – 2026',
    status: 'Verified',
    coverGradient: 'from-amber-950 via-orange-900 to-slate-900',
    featured: true,
    githubStars: 210,
    githubCommits: 450,
    lineageBatchesCount: 2,
    openRoles: ['Firmware Engineer'],
    facultyGuide: 'Dr. Sunita Negi',
    lastUpdated: '1 day ago',
    contributors: [
      {
        name: 'Kavita Negi',
        role: 'Embedded Systems Lead',
        institution: 'Graphic Era Hill University',
        batch: 'B.Tech \'27',
        avatar: getInitialsAvatar('Kavita Negi', 'STUDENT'),
        githubHandle: 'kavitanegi-ece',
        commitsCount: 290
      }
    ],
    lineage: [],
    passport: {
      passportId: 'PV-GEHU-ECE-2025-01',
      qrHash: 'substation-gehu-ece-01',
      projectName: 'Smart Substation IoT Telemetry & Fault Isolation',
      tagline: 'Real-time phase-angle monitoring on STM32.',
      institution: 'Graphic Era Hill University',
      department: 'Electronics & Communication Engineering',
      academicYear: '2025 – 2026',
      originalBatch: '2024 Stage 1',
      currentBatch: '2025 Field Trial',
      status: 'Verified',
      license: 'MIT',
      techStack: ['Embedded C', 'STM32', 'LoRaWAN'],
      githubRepo: 'https://github.com/gehu-ece/smart-substation-iot',
      totalCommits: 450,
      activeContributors: 1,
      mergedPRs: 31,
      codeHealthScore: 95,
      testCoverage: 88,
      stars: 210,
      forks: 35,
      facultyReviewer: {
        name: 'Dr. Sunita Negi',
        title: 'Associate Professor',
        department: 'Electronics & Communication Engineering',
        institution: 'Graphic Era Hill University',
        score: 9.5,
        reviewText: 'Hardware deployed on campus 11kV step-down transformer showing sub-second fault detection.',
        verifiedAt: '2025-07-20',
        signatureHash: 'sig-gehu-fac-201-substation'
      },
      institutionalValidationCode: 'GEHU-ECE-2025-PASSPORT-01',
      rubricScores: { novelty: 9.4, technicalRigor: 9.6, documentation: 9.3, continuityPotential: 9.7 }
    }
  },

  // GEHU ME PROJECTS
  {
    id: 'proj-gehu-me-1',
    passportId: 'PV-GEHU-ME-2025-01',
    title: 'Bipedal Robotic Exoskeleton Gait Stabilizer',
    tagline: 'Pneumatic assistive torque generation with dynamic center-of-mass balancing.',
    description: 'Custom wearable lower-limb orthosis using closed-loop IMU feedback and series elastic actuators for paraplegic mobility assistance.',
    domain: 'Healthcare & Biotechnology',
    techStack: ['SolidWorks', 'MATLAB', 'Arduino Mega', 'CAN Bus', 'Series Elastic Actuators'],
    institution: 'Graphic Era Hill University',
    department: 'Mechanical & Robotics Engineering',
    institution_id: 'inst-gehu',
    department_id: 'dept-gehu-me',
    institutionId: 'inst-gehu',
    departmentId: 'dept-gehu-me',
    academicYear: '2025 – 2026',
    status: 'Verified',
    coverGradient: 'from-rose-950 via-red-900 to-slate-900',
    featured: false,
    githubStars: 195,
    githubCommits: 380,
    lineageBatchesCount: 2,
    openRoles: ['Biomechanics Modeler'],
    facultyGuide: 'Dr. S. R. Verma',
    lastUpdated: '4 days ago',
    contributors: [
      {
        name: 'Tarun Mehra',
        role: 'Mechanical Design Lead',
        institution: 'Graphic Era Hill University',
        batch: 'B.Tech \'27',
        avatar: getInitialsAvatar('Tarun Mehra', 'STUDENT'),
        githubHandle: 'tarunmehra-me',
        commitsCount: 240
      }
    ],
    lineage: [],
    passport: {
      passportId: 'PV-GEHU-ME-2025-01',
      qrHash: 'exoskeleton-gehu-me-01',
      projectName: 'Bipedal Robotic Exoskeleton Gait Stabilizer',
      tagline: 'Pneumatic assistive torque generation for mobility assistance.',
      institution: 'Graphic Era Hill University',
      department: 'Mechanical & Robotics Engineering',
      academicYear: '2025 – 2026',
      originalBatch: '2024 Prototype',
      currentBatch: '2025 Human Trials',
      status: 'Verified',
      license: 'CERN Open Hardware',
      techStack: ['SolidWorks', 'MATLAB', 'CAN Bus'],
      githubRepo: 'https://github.com/gehu-me/exoskeleton-gait',
      totalCommits: 380,
      activeContributors: 1,
      mergedPRs: 22,
      codeHealthScore: 92,
      testCoverage: 84,
      stars: 195,
      forks: 28,
      facultyReviewer: {
        name: 'Dr. S. R. Verma',
        title: 'Professor & Head',
        department: 'Mechanical & Robotics Engineering',
        institution: 'Graphic Era Hill University',
        score: 9.7,
        reviewText: 'FEA stress simulations verified alongside 3D-printed torque testing bench.',
        verifiedAt: '2025-06-12',
        signatureHash: 'sig-gehu-fac-108-exo'
      },
      institutionalValidationCode: 'GEHU-ME-2025-PASSPORT-01',
      rubricScores: { novelty: 9.7, technicalRigor: 9.8, documentation: 9.0, continuityPotential: 9.6 }
    }
  },

  // IIT DELHI CSE PROJECTS
  {
    id: 'proj-iitd-cse-1',
    passportId: 'PV-IITD-CSE-2025-01',
    title: 'Distributed Consensus & Fault-Tolerant Raft Engine',
    tagline: 'Zero-allocation asynchronous Raft state machine in modern Rust with formal TLA+ specifications.',
    description: 'An open-source distributed coordination engine powering high-throughput partitioned databases. Formally verified using TLA+ model checking at IIT Delhi Computer Science Department.',
    domain: 'Distributed Systems & Cloud',
    techStack: ['Rust', 'Tokio', 'TLA+', 'gRPC', 'SIMD', 'Linux io_uring'],
    institution: 'Indian Institute of Technology Delhi',
    department: 'Computer Science & Engineering',
    institution_id: 'inst-iitd',
    department_id: 'dept-iitd-cse',
    institutionId: 'inst-iitd',
    departmentId: 'dept-iitd-cse',
    academicYear: '2025 – 2026',
    status: 'Verified',
    coverGradient: 'from-cyan-950 via-sky-900 to-slate-900',
    featured: true,
    githubStars: 680,
    githubCommits: 1140,
    lineageBatchesCount: 4,
    openRoles: ['TLA+ Verification Engineer', 'Rust Kernel Optimizer'],
    facultyGuide: 'Prof. Chetan Arora',
    lastUpdated: '3 hours ago',
    contributors: [
      {
        name: 'Aarav Mathur',
        role: 'Systems Architect',
        institution: 'Indian Institute of Technology Delhi',
        batch: 'B.Tech \'27',
        avatar: getInitialsAvatar('Aarav Mathur', 'STUDENT'),
        githubHandle: 'aarav-rust',
        commitsCount: 620
      },
      {
        name: 'Kunal Kapoor',
        role: 'Async Core Developer',
        institution: 'Indian Institute of Technology Delhi',
        batch: 'M.Tech \'26',
        avatar: getInitialsAvatar('Kunal Kapoor', 'STUDENT'),
        githubHandle: 'kunal-hpc',
        commitsCount: 380
      }
    ],
    lineage: [],
    passport: {
      passportId: 'PV-IITD-CSE-2025-01',
      qrHash: 'raft-iitd-cse-01',
      projectName: 'Distributed Consensus & Fault-Tolerant Raft Engine',
      tagline: 'Zero-allocation Raft engine with formal TLA+ verification.',
      institution: 'Indian Institute of Technology Delhi',
      department: 'Computer Science & Engineering',
      academicYear: '2025 – 2026',
      originalBatch: '2023 Research Foundation',
      currentBatch: '2025 High-Throughput v2',
      status: 'Verified',
      license: 'Apache 2.0',
      techStack: ['Rust', 'Tokio', 'io_uring', 'TLA+'],
      githubRepo: 'https://github.com/iitd-cse/raft-engine-rs',
      totalCommits: 1140,
      activeContributors: 2,
      mergedPRs: 88,
      codeHealthScore: 99,
      testCoverage: 97,
      stars: 680,
      forks: 142,
      facultyReviewer: {
        name: 'Prof. Chetan Arora',
        title: 'Professor & Chair',
        department: 'Computer Science & Engineering',
        institution: 'Indian Institute of Technology Delhi',
        score: 9.9,
        reviewText: 'Formally proven safety properties verified with TLC model checker with zero deadlocks found.',
        verifiedAt: '2025-09-10',
        signatureHash: 'sig-iitd-fac-01-raft'
      },
      institutionalValidationCode: 'IITD-CSE-2025-PASSPORT-01',
      rubricScores: { novelty: 9.9, technicalRigor: 10.0, documentation: 9.8, continuityPotential: 9.9 }
    }
  },
  {
    id: 'proj-iitd-cse-2',
    passportId: 'PV-IITD-CSE-2025-02',
    title: 'Graph Neural Network for Molecular Discovery',
    tagline: 'Message-passing GNN predicting binding affinity for SARS-CoV-2 protease inhibitors.',
    description: 'High-throughput geometric deep learning platform predicting small-molecule pharmacokinetic properties and protein-ligand docking interactions.',
    domain: 'Healthcare & Biotechnology',
    techStack: ['PyTorch Geometric', 'RDKit', 'OpenMM', 'Python', 'Jupyter', 'CUDA'],
    institution: 'Indian Institute of Technology Delhi',
    department: 'Computer Science & Engineering',
    institution_id: 'inst-iitd',
    department_id: 'dept-iitd-cse',
    institutionId: 'inst-iitd',
    departmentId: 'dept-iitd-cse',
    academicYear: '2025 – 2026',
    status: 'Verified',
    coverGradient: 'from-violet-950 via-purple-900 to-slate-900',
    featured: false,
    githubStars: 412,
    githubCommits: 670,
    lineageBatchesCount: 2,
    openRoles: ['Cheminformatics Researcher'],
    facultyGuide: 'Prof. Maya Raman',
    lastUpdated: '1 day ago',
    contributors: [
      {
        name: 'Diya Bansal',
        role: 'GNN Pipeline Lead',
        institution: 'Indian Institute of Technology Delhi',
        batch: 'B.Tech \'27',
        avatar: getInitialsAvatar('Diya Bansal', 'STUDENT'),
        githubHandle: 'diyabansal-gnn',
        commitsCount: 420
      }
    ],
    lineage: [],
    passport: {
      passportId: 'PV-IITD-CSE-2025-02',
      qrHash: 'gnn-mol-iitd-cse-02',
      projectName: 'Graph Neural Network for Molecular Discovery',
      tagline: 'Geometric deep learning predicting ligand binding affinity.',
      institution: 'Indian Institute of Technology Delhi',
      department: 'Computer Science & Engineering',
      academicYear: '2025 – 2026',
      originalBatch: '2024 In Silico',
      currentBatch: '2025 Benchmark v2',
      status: 'Verified',
      license: 'MIT',
      techStack: ['PyTorch Geometric', 'RDKit', 'CUDA'],
      githubRepo: 'https://github.com/iitd-cse/gnn-molecular-discovery',
      totalCommits: 670,
      activeContributors: 1,
      mergedPRs: 46,
      codeHealthScore: 96,
      testCoverage: 91,
      stars: 412,
      forks: 78,
      facultyReviewer: {
        name: 'Prof. Maya Raman',
        title: 'Associate Professor',
        department: 'Computer Science & Engineering',
        institution: 'Indian Institute of Technology Delhi',
        score: 9.8,
        reviewText: 'State-of-the-art benchmark on PDBbind dataset outperforming traditional docking by 3.2x.',
        verifiedAt: '2025-08-28',
        signatureHash: 'sig-iitd-fac-02-gnn'
      },
      institutionalValidationCode: 'IITD-CSE-2025-PASSPORT-02',
      rubricScores: { novelty: 9.8, technicalRigor: 9.7, documentation: 9.4, continuityPotential: 9.6 }
    }
  },

  // IIT DELHI EE PROJECTS
  {
    id: 'proj-iitd-ee-1',
    passportId: 'PV-IITD-EE-2025-01',
    title: 'Bidirectional DC-DC EV Supercharger Controller',
    tagline: 'Silicon Carbide (SiC) based 800V fast-charging converter with 98.7% peak efficiency.',
    description: 'High-frequency isolated bidirectional power converter for vehicle-to-grid (V2G) and ultra-fast charging stations developed at IIT Delhi Power Electronics Lab.',
    domain: 'Energy & Clean Tech',
    techStack: ['DSP TMS320F28379D', 'SiC MOSFETs', 'MATLAB Simulink', 'Altium', 'CAN Open'],
    institution: 'Indian Institute of Technology Delhi',
    department: 'Electrical Engineering',
    institution_id: 'inst-iitd',
    department_id: 'dept-iitd-ee',
    institutionId: 'inst-iitd',
    departmentId: 'dept-iitd-ee',
    academicYear: '2025 – 2026',
    status: 'Verified',
    coverGradient: 'from-emerald-950 via-teal-900 to-slate-900',
    featured: true,
    githubStars: 320,
    githubCommits: 520,
    lineageBatchesCount: 2,
    openRoles: ['Power Electronics Hardware Designer'],
    facultyGuide: 'Prof. Nilanjan Senroy',
    lastUpdated: '2 days ago',
    contributors: [
      {
        name: 'Priya Saxena',
        role: 'Converter Hardware Lead',
        institution: 'Indian Institute of Technology Delhi',
        batch: 'B.Tech \'27',
        avatar: getInitialsAvatar('Priya Saxena', 'STUDENT'),
        githubHandle: 'priyasaxena-ee',
        commitsCount: 340
      }
    ],
    lineage: [],
    passport: {
      passportId: 'PV-IITD-EE-2025-01',
      qrHash: 'ev-charger-iitd-ee-01',
      projectName: 'Bidirectional DC-DC EV Supercharger Controller',
      tagline: '800V fast-charging converter with 98.7% peak efficiency.',
      institution: 'Indian Institute of Technology Delhi',
      department: 'Electrical Engineering',
      academicYear: '2025 – 2026',
      originalBatch: '2024 Lab Bench',
      currentBatch: '2025 50kW Pilot',
      status: 'Verified',
      license: 'Apache 2.0',
      techStack: ['DSP C2000', 'SiC MOSFETs', 'Simulink'],
      githubRepo: 'https://github.com/iitd-ee/ev-supercharger-controller',
      totalCommits: 520,
      activeContributors: 1,
      mergedPRs: 38,
      codeHealthScore: 97,
      testCoverage: 92,
      stars: 320,
      forks: 64,
      facultyReviewer: {
        name: 'Prof. Nilanjan Senroy',
        title: 'Professor',
        department: 'Electrical Engineering',
        institution: 'Indian Institute of Technology Delhi',
        score: 9.8,
        reviewText: 'Hardware bench validation showed sustained 50kW power transfer with thermal rise under 24°C.',
        verifiedAt: '2025-07-15',
        signatureHash: 'sig-iitd-fac-01-ev'
      },
      institutionalValidationCode: 'IITD-EE-2025-PASSPORT-01',
      rubricScores: { novelty: 9.8, technicalRigor: 9.9, documentation: 9.5, continuityPotential: 9.7 }
    }
  },
  {
    id: 'proj-iitd-ee-2',
    passportId: 'PV-IITD-EE-2025-02',
    title: 'Photovoltaic Grid-Tied Inverter Telemetry',
    tagline: 'Wide-area phase measurement and active damping for high-penetration solar grids.',
    description: 'FPGA-accelerated synchrophasor PMU computing frequency drift and sub-synchronous resonance on 132kV solar transmission feeds.',
    domain: 'Energy & Clean Tech',
    techStack: ['Xilinx Zynq', 'VHDL', 'Python', 'IEC 61850', 'MATLAB'],
    institution: 'Indian Institute of Technology Delhi',
    department: 'Electrical Engineering',
    institution_id: 'inst-iitd',
    department_id: 'dept-iitd-ee',
    institutionId: 'inst-iitd',
    departmentId: 'dept-iitd-ee',
    academicYear: '2025 – 2026',
    status: 'Verified',
    coverGradient: 'from-amber-950 via-yellow-900 to-slate-900',
    featured: false,
    githubStars: 280,
    githubCommits: 410,
    lineageBatchesCount: 1,
    openRoles: ['FPGA Design Engineer'],
    facultyGuide: 'Prof. Sukumar Mishra',
    lastUpdated: '5 days ago',
    contributors: [
      {
        name: 'Varun Reddy',
        role: 'FPGA DSP Architect',
        institution: 'Indian Institute of Technology Delhi',
        batch: 'B.Tech \'27',
        avatar: getInitialsAvatar('Varun Reddy', 'STUDENT'),
        githubHandle: 'varunreddy-ee',
        commitsCount: 280
      }
    ],
    lineage: [],
    passport: {
      passportId: 'PV-IITD-EE-2025-02',
      qrHash: 'pmu-solar-iitd-ee-02',
      projectName: 'Photovoltaic Grid-Tied Inverter Telemetry',
      tagline: 'FPGA-accelerated synchrophasor PMU for solar grids.',
      institution: 'Indian Institute of Technology Delhi',
      department: 'Electrical Engineering',
      academicYear: '2025 – 2026',
      originalBatch: '2025 Genesis',
      currentBatch: '2025 Release',
      status: 'Verified',
      license: 'MIT',
      techStack: ['VHDL', 'Xilinx Zynq', 'IEC 61850'],
      githubRepo: 'https://github.com/iitd-ee/solar-pmu-telemetry',
      totalCommits: 410,
      activeContributors: 1,
      mergedPRs: 29,
      codeHealthScore: 94,
      testCoverage: 90,
      stars: 280,
      forks: 45,
      facultyReviewer: {
        name: 'Prof. Sukumar Mishra',
        title: 'Professor',
        department: 'Electrical Engineering',
        institution: 'Indian Institute of Technology Delhi',
        score: 9.6,
        reviewText: 'Sub-millisecond synchrophasor computation meeting IEEE C37.118 compliance standard.',
        verifiedAt: '2025-08-04',
        signatureHash: 'sig-iitd-fac-02-pmu'
      },
      institutionalValidationCode: 'IITD-EE-2025-PASSPORT-02',
      rubricScores: { novelty: 9.5, technicalRigor: 9.8, documentation: 9.2, continuityPotential: 9.5 }
    }
  }
];

// ============================================================================
// 6. STRICT DATA ISOLATION QUERY UTILITIES
// ============================================================================

/**
 * Resolves the authenticated user's institution_id
 */
export function resolveUserInstitutionId(profile?: {
  institution_id?: string;
  institutionId?: string;
  institution?: string;
  email?: string;
}): string {
  if (profile?.institution_id) return profile.institution_id;
  if (profile?.institutionId) return profile.institutionId;

  const email = (profile?.email || '').toLowerCase();
  if (email.includes('iitd') || email.includes('delhi')) return 'inst-iitd';

  const inst = (profile?.institution || '').toLowerCase();
  if (inst.includes('delhi') || inst.includes('iitd') || inst.includes('indian institute of technology')) {
    return 'inst-iitd';
  }
  return 'inst-gehu'; // Default university node
}

/**
 * Resolves the authenticated user's department_id
 */
export function resolveUserDepartmentId(profile?: {
  department_id?: string;
  departmentId?: string;
  department?: string;
  email?: string;
}): string {
  if (profile?.department_id) return profile.department_id;
  if (profile?.departmentId) return profile.departmentId;

  const instId = resolveUserInstitutionId(profile);
  const dept = (profile?.department || '').toLowerCase();
  const email = (profile?.email || '').toLowerCase();

  if (instId === 'inst-iitd') {
    if (dept.includes('electr') || dept.includes('ee') || email.includes('.ee.')) {
      return 'dept-iitd-ee';
    }
    return 'dept-iitd-cse';
  }

  // inst-gehu
  if (dept.includes('electron') || dept.includes('ece') || email.includes('.ece.')) {
    return 'dept-gehu-ece';
  }
  if (dept.includes('mech') || dept.includes('robot') || dept.includes('me') || email.includes('.me.')) {
    return 'dept-gehu-me';
  }
  return 'dept-gehu-cse';
}

/**
 * Get Institution metadata by ID
 */
export function getInstitutionById(institutionId: string): InstitutionEntity {
  const found = INSTITUTIONS.find(i => i.id === institutionId);
  return found || INSTITUTIONS[0];
}

/**
 * Get Department metadata by ID
 */
export function getDepartmentById(departmentId: string): DepartmentEntity | undefined {
  for (const inst of INSTITUTIONS) {
    const d = inst.departments.find(dept => dept.id === departmentId);
    if (d) return d;
  }
  return undefined;
}

/**
 * STRICT ISOLATION: Get departments belonging ONLY to user's institution
 */
export function getIsolatedDepartments(institutionId: string): DepartmentEntity[] {
  const inst = getInstitutionById(institutionId);
  return inst.departments;
}

/**
 * STRICT ISOLATION: Get students strictly filtered by institution and optionally department
 */
export function getIsolatedStudents(institutionId: string, departmentId?: string): StudentEntity[] {
  return ISOLATED_STUDENTS.filter(s => {
    if (s.institution_id !== institutionId) return false;
    if (departmentId && s.department_id !== departmentId) return false;
    return true;
  });
}

/**
 * STRICT ISOLATION: Get faculty strictly filtered by institution and optionally department
 */
export function getIsolatedFaculty(institutionId: string, departmentId?: string): FacultyEntity[] {
  return ISOLATED_FACULTY.filter(f => {
    if (f.institution_id !== institutionId) return false;
    if (departmentId && f.department_id !== departmentId) return false;
    return true;
  });
}

/**
 * STRICT ISOLATION: Get HODs strictly filtered by institution and optionally department
 */
export function getIsolatedHODs(institutionId: string, departmentId?: string): HODEntity[] {
  return ISOLATED_HODS.filter(h => {
    if (h.institution_id !== institutionId) return false;
    if (departmentId && h.department_id !== departmentId) return false;
    return true;
  });
}

/**
 * STRICT ISOLATION: Get projects strictly filtered by institution and optionally department
 */
export function getIsolatedProjects(institutionId: string, departmentId?: string): ProjectItem[] {
  return ISOLATED_PROJECTS.filter(p => {
    if (p.institution_id !== institutionId) return false;
    if (departmentId && p.department_id !== departmentId) return false;
    return true;
  });
}

/**
 * Get Department Intelligence Analytics for HOD
 */
export function getDepartmentAnalytics(institutionId: string, departmentId: string) {
  const dept = getDepartmentById(departmentId);
  const students = getIsolatedStudents(institutionId, departmentId);
  const faculty = getIsolatedFaculty(institutionId, departmentId);
  const projects = getIsolatedProjects(institutionId, departmentId);

  // Domains count
  const domainCounts: Record<string, number> = {};
  projects.forEach(p => {
    domainCounts[p.domain] = (domainCounts[p.domain] || 0) + 1;
  });

  // Tech stack frequency
  const techCounts: Record<string, number> = {};
  projects.forEach(p => {
    p.techStack.forEach(t => {
      techCounts[t] = (techCounts[t] || 0) + 1;
    });
  });

  return {
    department: dept,
    totalStudents: dept?.studentCount || (students.length > 0 ? students.length * 180 : 820),
    totalFaculty: dept?.facultyCount || (faculty.length > 0 ? faculty.length * 8 : 38),
    totalProjects: dept?.projectCount || projects.length,
    verifiedProjects: dept?.verifiedProjectsCount || projects.filter(p => p.status === 'Verified').length,
    studentsList: students,
    facultyList: faculty,
    projectsList: projects,
    domainBreakdown: Object.entries(domainCounts).map(([domain, count]) => ({ domain, count })),
    topTechStack: Object.entries(techCounts).sort((a, b) => b[1] - a[1]).slice(0, 8),
    recentActivity: [
      { id: 'act-1', text: `${projects[0]?.title || 'Capstone'} verified on department ledger with 9.8/10 rubric score`, time: '2 hours ago' },
      { id: 'act-2', text: `${faculty[0]?.name || 'Faculty Guide'} guiding 2 incoming research capstone cohorts`, time: '1 day ago' },
      { id: 'act-3', text: `Annual NAAC criterion milestone telemetry compiled for ${dept?.name || 'Department'}`, time: '3 days ago' }
    ]
  };
}

/**
 * Get Institution Intelligence Analytics for Institution Node
 */
export function getInstitutionAnalytics(institutionId: string) {
  const inst = getInstitutionById(institutionId);
  const depts = getIsolatedDepartments(institutionId);
  const students = getIsolatedStudents(institutionId);
  const faculty = getIsolatedFaculty(institutionId);
  const hods = getIsolatedHODs(institutionId);
  const projects = getIsolatedProjects(institutionId);

  const totalStudents = depts.reduce((acc, d) => acc + d.studentCount, 0);
  const totalFaculty = depts.reduce((acc, d) => acc + d.facultyCount, 0);
  const totalProjects = depts.reduce((acc, d) => acc + d.projectCount, 0);
  const verifiedProjects = depts.reduce((acc, d) => acc + d.verifiedProjectsCount, 0);

  // Cross-department domain breakdown
  const domainCounts: Record<string, number> = {};
  projects.forEach(p => {
    domainCounts[p.domain] = (domainCounts[p.domain] || 0) + 1;
  });

  // Cross-department tech trends
  const techCounts: Record<string, number> = {};
  projects.forEach(p => {
    p.techStack.forEach(t => {
      techCounts[t] = (techCounts[t] || 0) + 1;
    });
  });

  return {
    institution: inst,
    totalDepartments: depts.length,
    totalStudents,
    totalFaculty,
    totalHODs: hods.length,
    totalProjects,
    verifiedProjects,
    departments: depts,
    projectsList: projects,
    studentsList: students,
    facultyList: faculty,
    hodsList: hods,
    domainBreakdown: Object.entries(domainCounts).map(([domain, count]) => ({ domain, count })),
    topTechTrends: Object.entries(techCounts).sort((a, b) => b[1] - a[1]).slice(0, 10),
    institutionActivity: [
      { id: 'ia-1', text: `${depts[0]?.name} completed review cycle for ${depts[0]?.projectCount} departmental projects`, time: '1 hour ago' },
      { id: 'ia-2', text: `Institutional Node synchronized with Central Academic Accreditation Depository`, time: '4 hours ago' },
      { id: 'ia-3', text: `Cross-departmental capstone exhibition verified for ${projects.length} university projects`, time: '2 days ago' }
    ]
  };
}
