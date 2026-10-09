import {
  EraAccountType,
  EraMentoringRequest,
  EraProject,
  EraUserProfile
} from '../types/projectEra';

export const DEMO_USERS: Record<EraAccountType, EraUserProfile> = {
  STUDENT: {
    id: 'demo-student-1',
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@college.edu',
    accountType: 'STUDENT',
    institution: 'National Institute of Engineering & Technology',
    department: 'Computer Science & Engineering',
    course: 'B.Tech Computer Science',
    batch: '2023–2027',
    rollNumber: 'NIET/CSE/2023/042',
    bio: 'Final-year undergraduate focused on distributed systems, embedded campus IoT, and accessible academic tools.'
  },
  FACULTY: {
    id: 'demo-faculty-1',
    fullName: 'Dr. Meera Krishnan',
    email: 'meera.krishnan@college.edu',
    accountType: 'FACULTY',
    institution: 'National Institute of Engineering & Technology',
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor & Capstone Coordinator',
    areasOfExpertise: ['Distributed Systems', 'Machine Learning', 'Software Architecture', 'Database Systems'],
    bio: 'Supervising undergraduate and postgraduate academic projects in Computer Science with a focus on practical software engineering.'
  },
  HOD: {
    id: 'demo-hod-1',
    fullName: 'Prof. Rajeshwar Verma',
    email: 'hod.cse@college.edu',
    accountType: 'HOD',
    institution: 'National Institute of Engineering & Technology',
    department: 'Computer Science & Engineering',
    designation: 'Head of Department — CSE',
    areasOfExpertise: ['Academic Governance', 'Cloud Computing', 'Cybersecurity'],
    bio: 'Overseeing department curriculum, capstone milestones, and faculty evaluation schedules across all undergraduate batches.'
  },
  ALUMNI: {
    id: 'demo-alumni-1',
    fullName: 'Rohan Deshmukh',
    email: 'rohan.deshmukh@alumni.college.edu',
    accountType: 'ALUMNI',
    institution: 'National Institute of Engineering & Technology',
    department: 'Computer Science & Engineering',
    course: 'B.Tech Computer Science',
    graduationYear: '2022',
    currentOrganization: 'CloudScale Systems',
    currentJobRole: 'Senior Systems Engineer',
    skills: ['TypeScript', 'React', 'System Design', 'Docker', 'PostgreSQL', 'IoT Protocols'],
    linkedInOrPortfolio: 'https://linkedin.com/in/rohan-deshmukh-demo',
    bio: 'Class of 2022 alumnus mentoring student teams on system architecture, code quality, and final project readiness.'
  }
};

export const INITIAL_DEMO_PROJECTS: EraProject[] = [
  {
    id: 'proj-era-101',
    title: 'Smart Campus Energy & Classroom Occupancy Monitor',
    description:
      'An academic IoT and web dashboard project that monitors classroom occupancy and HVAC energy usage across campus blocks to reduce idle electricity consumption during off-peak lecture hours.',
    domain: 'IoT & Embedded Systems',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'MQTT', 'ESP32', 'Chart.js'],
    status: 'Development',
    academicSession: '2025–2026 (Even Semester)',
    institution: 'National Institute of Engineering & Technology',
    department: 'Computer Science & Engineering',
    supervisorName: 'Dr. Meera Krishnan',
    supervisorEmail: 'meera.krishnan@college.edu',
    leadStudentName: 'Aarav Sharma',
    updatedAt: '2026-03-18',
    teamMembers: [
      {
        id: 'tm-1',
        name: 'Aarav Sharma',
        email: 'aarav.sharma@college.edu',
        role: 'Project Lead & Frontend',
        responsibility: 'Dashboard UI, real-time sensor charts, and milestone documentation',
        status: 'Active'
      },
      {
        id: 'tm-2',
        name: 'Priya Nair',
        email: 'priya.nair@college.edu',
        role: 'Embedded Firmware Lead',
        responsibility: 'ESP32 sensor calibration and MQTT payload formatting',
        status: 'Active'
      },
      {
        id: 'tm-3',
        name: 'Kabir Mehta',
        email: 'kabir.mehta@college.edu',
        role: 'Data & Testing',
        responsibility: 'Threshold alerting logic and lab validation logs',
        status: 'Active'
      },
      {
        id: 'tm-4',
        name: 'Ananya Gupta',
        email: 'ananya.gupta@college.edu',
        role: 'Documentation & QA',
        responsibility: 'Weekly progress reports and test case verification',
        status: 'Pending Request'
      }
    ],
    tasks: [
      {
        id: 'task-101',
        title: 'Complete circuit schematic and sensor wiring diagram',
        assigneeName: 'Priya Nair',
        responsibility: 'Hardware schematic & pinout table',
        dueDate: '2026-02-15',
        status: 'Completed',
        milestoneTitle: 'Phase 1: Problem Definition & Synopsis'
      },
      {
        id: 'task-102',
        title: 'Build responsive classroom occupancy view in React',
        assigneeName: 'Aarav Sharma',
        responsibility: 'Frontend dashboard views',
        dueDate: '2026-03-10',
        status: 'In Progress',
        milestoneTitle: 'Phase 2: Core Prototype & Architecture'
      },
      {
        id: 'task-103',
        title: 'Submit mid-semester energy benchmark report PDF',
        assigneeName: 'Kabir Mehta',
        responsibility: 'Lab testing report',
        dueDate: '2026-03-01',
        status: 'Todo',
        milestoneTitle: 'Phase 2: Core Prototype & Architecture'
      },
      {
        id: 'task-104',
        title: 'Prepare faculty rubric presentation and demo script',
        assigneeName: 'Aarav Sharma',
        responsibility: 'Review presentation deck',
        dueDate: '2026-04-20',
        status: 'Todo',
        milestoneTitle: 'Phase 3: Faculty Review & Final Submission'
      }
    ],
    milestones: [
      {
        id: 'ms-1',
        title: 'Phase 1: Problem Definition & Synopsis',
        dueDate: '2026-02-20',
        progress: 100,
        status: 'Completed'
      },
      {
        id: 'ms-2',
        title: 'Phase 2: Core Prototype & Architecture',
        dueDate: '2026-03-25',
        progress: 65,
        status: 'On Track'
      },
      {
        id: 'ms-3',
        title: 'Phase 3: Faculty Review & Final Submission',
        dueDate: '2026-04-30',
        progress: 15,
        status: 'On Track'
      }
    ],
    documents: [
      {
        id: 'doc-1',
        title: 'Project Synopsis & Literature Survey',
        fileName: 'Campus_Energy_Synopsis_v1.pdf',
        fileSize: '1.4 MB',
        mimeType: 'application/pdf',
        category: 'Proposal',
        uploadedBy: 'Aarav Sharma',
        uploadedAt: '2026-02-12'
      },
      {
        id: 'doc-2',
        title: 'System Architecture & Sensor Block Diagram',
        fileName: 'Architecture_Specification_v2.pdf',
        fileSize: '2.8 MB',
        mimeType: 'application/pdf',
        category: 'Architecture & Design',
        uploadedBy: 'Priya Nair',
        uploadedAt: '2026-03-04'
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        projectId: 'proj-era-101',
        projectTitle: 'Smart Campus Energy & Classroom Occupancy Monitor',
        reviewerName: 'Dr. Meera Krishnan',
        reviewerRole: 'Faculty',
        status: 'Approved',
        feedback:
          'Synopsis and sensor block diagram are well-structured. Ensure the mid-semester benchmark report includes false-positive motion sensor readings.',
        submittedAt: '2026-03-06'
      }
    ]
  },
  {
    id: 'proj-era-102',
    title: 'Automated Lab Attendance & Timetable Conflict Resolver',
    description:
      'A department scheduling assistant that detects overlapping lab allocations, tracks student lab attendance sheets, and generates conflict-free weekly timetables for academic coordinators.',
    domain: 'Web Application & Algorithms',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Constraint Solver'],
    status: 'Review',
    academicSession: '2025–2026 (Even Semester)',
    institution: 'National Institute of Engineering & Technology',
    department: 'Computer Science & Engineering',
    supervisorName: 'Dr. Meera Krishnan',
    supervisorEmail: 'meera.krishnan@college.edu',
    leadStudentName: 'Aarav Sharma',
    updatedAt: '2026-03-19',
    teamMembers: [
      {
        id: 'tm-201',
        name: 'Aarav Sharma',
        email: 'aarav.sharma@college.edu',
        role: 'Algorithm & UI Developer',
        responsibility: 'Timetable conflict detection and constraint grid UI',
        status: 'Active'
      },
      {
        id: 'tm-202',
        name: 'Devika Joshi',
        email: 'devika.joshi@college.edu',
        role: 'Documentation & Verification',
        responsibility: 'Department dataset formatting and user manual',
        status: 'Active'
      }
    ],
    tasks: [
      {
        id: 'task-201',
        title: 'Design timetable conflict matrix interface',
        assigneeName: 'Aarav Sharma',
        responsibility: 'Interactive conflict table',
        dueDate: '2026-02-28',
        status: 'Completed',
        milestoneTitle: 'Phase 1: Scheduling Engine & UI'
      },
      {
        id: 'task-202',
        title: 'Address faculty review comments on room capacity constraints',
        assigneeName: 'Devika Joshi',
        responsibility: 'Constraint validation rules',
        dueDate: '2026-03-05',
        status: 'In Progress',
        milestoneTitle: 'Phase 2: Pre-Submission Faculty Review'
      }
    ],
    milestones: [
      {
        id: 'ms-201',
        title: 'Phase 1: Scheduling Engine & UI',
        dueDate: '2026-02-28',
        progress: 100,
        status: 'Completed'
      },
      {
        id: 'ms-202',
        title: 'Phase 2: Pre-Submission Faculty Review',
        dueDate: '2026-03-12',
        progress: 85,
        status: 'Delayed'
      }
    ],
    documents: [
      {
        id: 'doc-201',
        title: 'Software Requirements Specification (SRS)',
        fileName: 'Lab_Timetable_SRS_Document.pdf',
        fileSize: '1.9 MB',
        mimeType: 'application/pdf',
        category: 'Architecture & Design',
        uploadedBy: 'Devika Joshi',
        uploadedAt: '2026-02-25'
      },
      {
        id: 'doc-202',
        title: 'Pre-Final Milestone Submission Report',
        fileName: 'Timetable_Resolver_Milestone_Report.pdf',
        fileSize: '3.1 MB',
        mimeType: 'application/pdf',
        category: 'Milestone Report',
        uploadedBy: 'Aarav Sharma',
        uploadedAt: '2026-03-14'
      }
    ],
    reviews: [
      {
        id: 'rev-201',
        projectId: 'proj-era-102',
        projectTitle: 'Automated Lab Attendance & Timetable Conflict Resolver',
        reviewerName: 'Dr. Meera Krishnan',
        reviewerRole: 'Faculty',
        status: 'Pending Review',
        feedback: 'Awaiting evaluation of the updated room capacity constraint handling.',
        submittedAt: '2026-03-15'
      }
    ]
  },
  {
    id: 'proj-era-103',
    title: 'Braille & Audio Textbook Companion for Visually Impaired Students',
    description:
      'Converts structured college lecture notes and syllabus PDFs into synchronized audio chapters and refreshable Braille display outputs for accessible study.',
    domain: 'Accessibility & Assistive Tech',
    technologies: ['TypeScript', 'Web Speech API', 'React', 'PDF Parser'],
    status: 'Planning',
    academicSession: '2025–2026 (Even Semester)',
    institution: 'National Institute of Engineering & Technology',
    department: 'Information Technology',
    supervisorName: 'Prof. Vikramaditya Sen',
    supervisorEmail: 'vikram.sen@college.edu',
    leadStudentName: 'Neha Kulkarni',
    updatedAt: '2026-03-16',
    teamMembers: [
      {
        id: 'tm-301',
        name: 'Neha Kulkarni',
        email: 'neha.kulkarni@college.edu',
        role: 'Team Lead',
        responsibility: 'Accessibility UX and audio navigation controls',
        status: 'Active'
      },
      {
        id: 'tm-302',
        name: 'Siddharth Rao',
        email: 'siddharth.rao@college.edu',
        role: 'Document Parser Developer',
        responsibility: 'Heading hierarchy extraction and phonetic glossary',
        status: 'Active'
      }
    ],
    tasks: [
      {
        id: 'task-301',
        title: 'Define keyboard-only navigation shortcuts for chapter skipping',
        assigneeName: 'Neha Kulkarni',
        responsibility: 'Accessibility specification',
        dueDate: '2026-03-28',
        status: 'In Progress',
        milestoneTitle: 'Phase 1: Accessibility Specification'
      }
    ],
    milestones: [
      {
        id: 'ms-301',
        title: 'Phase 1: Accessibility Specification',
        dueDate: '2026-03-30',
        progress: 45,
        status: 'On Track'
      }
    ],
    documents: [
      {
        id: 'doc-301',
        title: 'Initial Project Proposal',
        fileName: 'Braille_Companion_Proposal.pdf',
        fileSize: '940 KB',
        mimeType: 'application/pdf',
        category: 'Proposal',
        uploadedBy: 'Neha Kulkarni',
        uploadedAt: '2026-03-02'
      }
    ],
    reviews: [
      {
        id: 'rev-301',
        projectId: 'proj-era-103',
        projectTitle: 'Braille & Audio Textbook Companion for Visually Impaired Students',
        reviewerName: 'Prof. Vikramaditya Sen',
        reviewerRole: 'Faculty',
        status: 'Revisions Requested',
        feedback:
          'Please include mathematical formula pronunciation rules in your Phase 1 architecture document before proceeding to implementation.',
        submittedAt: '2026-03-11'
      }
    ]
  },
  {
    id: 'proj-era-104',
    title: 'Solar Micro-Inverter Telemetry & Fault Logger',
    description:
      'Captures voltage, current, and panel temperature curves from rooftop solar installations in the engineering block to identify shading faults.',
    domain: 'Clean Energy & Instrumentation',
    technologies: ['Embedded C', 'React', 'TypeScript', 'Serial Web API'],
    status: 'Completed',
    academicSession: '2025–2026 (Odd Semester)',
    institution: 'National Institute of Engineering & Technology',
    department: 'Electronics & Communication',
    supervisorName: 'Dr. Anirban Chatterjee',
    supervisorEmail: 'anirban.c@college.edu',
    leadStudentName: 'Vikramjit Gill',
    updatedAt: '2026-01-20',
    teamMembers: [
      {
        id: 'tm-401',
        name: 'Vikramjit Gill',
        email: 'vikramjit.gill@college.edu',
        role: 'Hardware & Telemetry Lead',
        responsibility: 'Data logger firmware and final thesis report',
        status: 'Active'
      }
    ],
    tasks: [
      {
        id: 'task-401',
        title: 'Final thesis report and department viva presentation',
        assigneeName: 'Vikramjit Gill',
        responsibility: 'Final submission package',
        dueDate: '2026-01-15',
        status: 'Completed',
        milestoneTitle: 'Final Defense & Archival'
      }
    ],
    milestones: [
      {
        id: 'ms-401',
        title: 'Final Defense & Archival',
        dueDate: '2026-01-18',
        progress: 100,
        status: 'Completed'
      }
    ],
    documents: [
      {
        id: 'doc-401',
        title: 'Final Approved Capstone Report',
        fileName: 'Solar_Telemetry_Final_Report.pdf',
        fileSize: '4.6 MB',
        mimeType: 'application/pdf',
        category: 'Final Submission',
        uploadedBy: 'Vikramjit Gill',
        uploadedAt: '2026-01-14'
      }
    ],
    reviews: [
      {
        id: 'rev-401',
        projectId: 'proj-era-104',
        projectTitle: 'Solar Micro-Inverter Telemetry & Fault Logger',
        reviewerName: 'Dr. Anirban Chatterjee',
        reviewerRole: 'Faculty',
        status: 'Completed',
        feedback: 'All hardware calibration benchmarks and final thesis documentation approved.',
        submittedAt: '2026-01-18'
      }
    ]
  },
  {
    id: 'proj-era-105',
    title: 'Campus Shuttle Live ETA & Route Optimizer',
    description:
      'Early-stage concept for tracking campus shuttle buses between hostels and academic blocks with crowd-sourced stop wait times.',
    domain: 'Mobile & Campus Utility',
    technologies: ['React', 'TypeScript', 'Geolocation API', 'Tailwind CSS'],
    status: 'Idea',
    academicSession: '2025–2026 (Even Semester)',
    institution: 'National Institute of Engineering & Technology',
    department: 'Computer Science & Engineering',
    supervisorName: 'Dr. Meera Krishnan',
    supervisorEmail: 'meera.krishnan@college.edu',
    leadStudentName: 'Riya Kapoor',
    updatedAt: '2026-03-19',
    teamMembers: [
      {
        id: 'tm-501',
        name: 'Riya Kapoor',
        email: 'riya.kapoor@college.edu',
        role: 'Concept Creator',
        responsibility: 'Route mapping survey and initial proposal',
        status: 'Active'
      }
    ],
    tasks: [
      {
        id: 'task-501',
        title: 'Draft initial project synopsis and route survey',
        assigneeName: 'Riya Kapoor',
        responsibility: 'Project proposal',
        dueDate: '2026-04-05',
        status: 'Todo',
        milestoneTitle: 'Phase 1: Idea Pitch & Team Formation'
      }
    ],
    milestones: [
      {
        id: 'ms-501',
        title: 'Phase 1: Idea Pitch & Team Formation',
        dueDate: '2026-04-10',
        progress: 20,
        status: 'On Track'
      }
    ],
    documents: [],
    reviews: []
  }
];

export const INITIAL_MENTORING_REQUESTS: EraMentoringRequest[] = [
  {
    id: 'ment-1',
    projectId: 'proj-era-101',
    projectTitle: 'Smart Campus Energy & Classroom Occupancy Monitor',
    studentName: 'Aarav Sharma',
    department: 'Computer Science & Engineering',
    alumniName: 'Rohan Deshmukh',
    topic: 'MQTT Broker Reliability & Reconnection Handling',
    message:
      'Hi Rohan, we are experiencing dropped sensor packets when the classroom Wi-Fi resets. Would love 20 minutes of guidance on buffering payloads on ESP32.',
    status: 'Pending',
    requestedAt: '2026-03-17'
  },
  {
    id: 'ment-2',
    projectId: 'proj-era-102',
    projectTitle: 'Automated Lab Attendance & Timetable Conflict Resolver',
    studentName: 'Devika Joshi',
    department: 'Computer Science & Engineering',
    alumniName: 'Rohan Deshmukh',
    topic: 'Optimizing Constraint Solver Performance in TypeScript',
    message:
      'Looking for advice on structuring our conflict-checking loop so it runs smoothly in the browser without blocking the UI thread.',
    status: 'Accepted',
    requestedAt: '2026-03-10'
  }
];

export const DEPARTMENTS_LIST = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering'
];

export const PROJECT_STATUS_FLOW: EraProject['status'][] = [
  'Idea',
  'Planning',
  'Development',
  'Review',
  'Completed'
];
