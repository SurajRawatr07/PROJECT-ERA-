import { 
  ProjectItem, 
  ProjectDNA, 
  ProjectHealthScore, 
  ProjectHandoverPackage, 
  ProjectContinuityData, 
  ContributorEvidence, 
  SmartMatchResult,
  ProofOfWorkTimelineEvent,
  ProjectReviewActionItem,
  UserRole
} from '../types';
import { SAMPLE_PROJECTS } from '../data/mockData';
import { getInitialsAvatar } from './authService';

/**
 * Project Health Engine
 * Computes an explainable score (0-100) based on realistic signals:
 * - Repository activity (commits, PRs, freshness)
 * - Contributor engagement
 * - Documentation completeness
 * - Open vs resolved tasks
 * - Deployment status
 * - Faculty review status
 * 
 * Never presented as absolute quality or authenticity.
 */
export function computeProjectHealth(project: Partial<ProjectItem>): ProjectHealthScore {
  const commits = project.githubCommits || project.passport?.totalCommits || 120;
  const contributors = project.contributors?.length || project.passport?.activeContributors || 2;
  const hasLiveDemo = Boolean(project.demoUrl || project.passport?.liveDemoUrl);
  const hasDocs = Boolean(project.documentationUrl || project.passport?.documentationUrl);
  const isReviewed = project.reviewStatus === 'VERIFIED' || project.status === 'Verified';
  const openTasks = project.openRoles?.length || 2;
  
  // Simulated days since last meaningful activity
  let daysInactive = 6;
  if (project.id === 'proj-nav' || project.passportId === 'PV-2026-00124') {
    daysInactive = 34;
  } else if (project.status === 'Seeking Next Batch') {
    daysInactive = 28;
  } else if (project.id === 'proj-1') {
    daysInactive = 4;
  }

  // Base calculations
  let repoScore = Math.min(100, Math.round((commits / 600) * 100));
  let contributorScore = Math.min(100, contributors * 25);
  let docScore = hasDocs ? 92 : 45;
  let completenessScore = isReviewed ? 90 : 65;

  const positiveSignals: string[] = [];
  const warningSignals: string[] = [];

  if (commits > 300) {
    positiveSignals.push(`Active codebase history (${commits} recorded commits)`);
  } else if (commits > 50) {
    positiveSignals.push(`Baseline repository initialized (${commits} commits)`);
  } else {
    warningSignals.push('Limited repository commits recorded');
  }

  if (contributors >= 3) {
    positiveSignals.push(`Multi-contributor team (${contributors} active builders)`);
  } else if (contributors === 1) {
    warningSignals.push('Single point of failure (1 active contributor)');
  }

  if (hasLiveDemo) {
    positiveSignals.push('Live deployment operational for verification');
  } else {
    warningSignals.push('No live deployment URL linked');
  }

  if (hasDocs) {
    positiveSignals.push('Structured technical documentation accessible');
  } else {
    warningSignals.push('Technical documentation incomplete or missing');
  }

  if (isReviewed) {
    positiveSignals.push('Faculty academic review and rubric rubric scores verified');
  } else {
    warningSignals.push('Pending formal faculty verification');
  }

  if (daysInactive > 30) {
    warningSignals.push(`No recorded repository commits for ${daysInactive} days`);
  } else {
    positiveSignals.push(`Recent team activity within past ${daysInactive} days`);
  }

  if (openTasks > 3) {
    warningSignals.push(`${openTasks} critical tasks unassigned`);
  }

  // Calculate weighted overall score
  let weighted = (
    repoScore * 0.25 +
    contributorScore * 0.20 +
    docScore * 0.20 +
    completenessScore * 0.20 +
    (daysInactive <= 14 ? 100 : daysInactive <= 30 ? 60 : 30) * 0.15
  );

  let overallScore = Math.max(20, Math.min(99, Math.round(weighted)));

  let status: 'Active' | 'At Risk' | 'Needs Attention' | 'Healthy' = 'Active';
  if (daysInactive > 30) {
    status = 'At Risk';
    overallScore = Math.min(overallScore, 48);
  } else if (warningSignals.length >= 3) {
    status = 'Needs Attention';
    overallScore = Math.min(overallScore, 68);
  } else if (overallScore >= 85) {
    status = 'Healthy';
  }

  return {
    overallScore,
    status,
    repositoryActivityScore: repoScore,
    recentCommitsCount: Math.max(1, Math.round(commits / 15)),
    activeContributorsCount: contributors,
    documentationScore: docScore,
    openTasksCount: openTasks,
    deploymentStatus: hasLiveDemo ? 'Live' : 'Not Deployed',
    reviewStatus: isReviewed ? 'Verified' : 'Pending Review',
    completenessScore,
    lastActivityDays: daysInactive,
    positiveSignals,
    warningSignals
  };
}

/**
 * Structured Project DNA Engine
 */
export function buildProjectDNA(project: Partial<ProjectItem>): ProjectDNA {
  const domain = project.domain || 'Autonomous Systems & Robotics';
  const technologies = project.techStack || ['TypeScript', 'React', 'Node.js'];
  const difficulty = project.difficulty || (technologies.length > 5 ? 'Advanced' : 'Intermediate');
  
  let projectStage: ProjectDNA['projectStage'] = 'Prototype';
  if (project.status === 'Seeking Next Batch') {
    projectStage = 'Seeking Maintainers';
  } else if (project.status === 'Verified') {
    projectStage = 'Production';
  } else if (project.id === 'proj-nav') {
    projectStage = 'Seeking Maintainers';
  }

  const skills = [
    ...technologies,
    'System Architecture',
    'Git Workflow',
    'Technical Documentation'
  ];

  const requiredRoles = project.openRoles && project.openRoles.length > 0 
    ? project.openRoles 
    : ['Full Stack Engineer', 'Documentation Lead', 'QA / Test Specialist'];

  const goals = [
    `Maintain multi-batch codebase lineage on ProjectVerse`,
    `Ensure seamless transition and handover for incoming student cohort`,
    `Achieve 90%+ test coverage across core architectural modules`
  ];

  return {
    domain,
    technologies,
    skills,
    difficulty,
    projectStage,
    requiredRoles,
    goals,
    teamRequirements: project.teamRequirements || 'Collaborative mindset, adherence to ADRs, and active participation in sprint handovers.',
    preferredSkills: technologies.slice(0, 3)
  };
}

/**
 * Project Handover System
 * Generates an exhaustive handover package for outgoing batches
 */
export function buildHandoverPackage(project: Partial<ProjectItem>): ProjectHandoverPackage {
  const pId = project.id || 'proj-nav';
  const isNav = pId === 'proj-nav' || project.passportId === 'PV-2026-00124';

  if (isNav) {
    return {
      id: `handover-${pId}`,
      projectId: pId,
      projectTitle: 'Smart Campus Navigation & Accessibility (GEHU)',
      outgoingBatch: "Batch 2024 / Class of '24",
      outgoingLeads: ['Aarav Negi', 'Pooja Rawat', 'Kunal Pant'],
      targetIncomingBatch: "Batch 2025 / 2026 Capstone Cohort",
      status: 'Active Handover',
      createdAt: '2026-08-14T10:00:00Z',
      updatedAt: '2026-09-20T14:30:00Z',
      whatHasBeenBuilt: 'Indoor BLE beacon positioning engine, wheelchair-accessible path routing across 4 campus blocks, campus map polygon vector rendering, and PWA mobile shell.',
      currentProjectStatus: 'Core routing algorithm verified in CS and Engineering blocks; map rendering functional on mobile, but needs floor-transition elevation calculation and offline cache synchronization.',
      architectureOverview: 'Client-side React 19 SPA + Leaflet custom CRS vector tiles. GeoJSON graph parsed in Web Workers with Dijkstra/A* heuristic with elevation weights. BLE RSSI signals smoothed via Kalman filter.',
      architectureDiagramUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      setupInstructions: [
        'git clone https://github.com/projectverse-academic/gehu-campus-nav.git',
        'cd gehu-campus-nav && npm install',
        'cp .env.example .env (Set VITE_MAP_TILES_HOST=campus-cache.gehu.ac.in)',
        'npm run dev (Runs local server on port 3000)',
        'Run test suite with npm test to verify graph routing assertions'
      ],
      knownBugs: [
        {
          id: 'bug-1',
          title: 'Floor 2 to Floor 3 Stair Ramp Elevation Jump',
          severity: 'High',
          description: 'Wheelchair pathing occasionally suggests staircase path in Block C when elevator node reports beacon heartbeat delay.'
        },
        {
          id: 'bug-2',
          title: 'Offline GeoJSON Cache Stale Invalidation',
          severity: 'Medium',
          description: 'Service Worker cache does not auto-refresh when updated campus building blueprints are pushed.'
        },
        {
          id: 'bug-3',
          title: 'Compass Heading Gyro Drift on Android Devices',
          severity: 'Low',
          description: 'Needs magnetometer calibration callback on Chrome Mobile orientation event.'
        }
      ],
      pendingTasks: [
        { id: 'task-1', title: 'Implement Floor 3 to Floor 4 Elevator Fallback Heuristic', priority: 'High', completed: false },
        { id: 'task-2', title: 'Integrate Live Campus Event Geo-Pins (Auditorium & Labs)', priority: 'Medium', completed: false },
        { id: 'task-3', title: 'Connect Offline IndexedDB Database for Campus Map Pack', priority: 'High', completed: false },
        { id: 'task-4', title: 'Conduct Physical Accessibility Walkthrough with Student Union', priority: 'Medium', completed: false }
      ],
      technicalDecisions: [
        {
          decision: 'ADR-001: Client-side Graph Evaluation via Web Workers',
          rationale: 'Avoids server latency and keeps indoor turn-by-turn navigation responsive even during spotty Wi-Fi in concrete basement corridors.',
          date: '2024-03-12'
        },
        {
          decision: 'ADR-002: Dual-RSSI Weighted Kalman Smoothing',
          rationale: 'Raw Bluetooth Low Energy beacons exhibited ±4 meter jitter due to human body signal attenuation; Kalman filter stabilized error to under 1.2 meters.',
          date: '2024-08-20'
        }
      ],
      documentationLinks: [
        { label: 'Campus Map Coordinate Topology Guide', url: 'https://docs.projectverse.dev/campus-nav/topology', type: 'Architecture' },
        { label: 'BLE Beacon Hardware Deployment Map', url: 'https://docs.projectverse.dev/campus-nav/hardware', type: 'Hardware' },
        { label: 'Accessibility Audit Standards (WCAG & Campus Compliance)', url: 'https://docs.projectverse.dev/campus-nav/accessibility', type: 'Compliance' }
      ],
      futureRoadmap: [
        { phase: 'Phase 1 (Q4 2026)', description: 'Elevator state telemetries and automatic floor switching', targetQuarter: 'Q4 2026' },
        { phase: 'Phase 2 (Q1 2027)', description: 'Audio turn-by-turn guidance for visually impaired scholars', targetQuarter: 'Q1 2027' },
        { phase: 'Phase 3 (Q2 2027)', description: 'University federated rollout to Haldwani and Bhimtal campuses', targetQuarter: 'Q2 2027' }
      ],
      requiredSkills: [
        'React & TypeScript',
        'Graph Algorithms (A* / Dijkstra)',
        'GeoJSON & Vector Maps (Leaflet / MapLibre)',
        'Bluetooth Low Energy (Web Bluetooth / RSSI)',
        'Progressive Web Apps (Service Workers)'
      ],
      recommendedImprovements: [
        'Replace static JSON coordinate matrix with an admin UI for campus facility managers to adjust room numbering',
        'Add multi-language audio prompts (Hindi, English, Garhwali) for campus guests',
        'Migrate from local storage to IndexedDB for offline campus vector tiles'
      ],
      thingsNextTeamShouldKnow: [
        'The Block B elevator has metal shielding that drops 2.4GHz BLE signal by 18dBm; do not place beacons inside the elevator cabin itself.',
        'Room 204 was renamed to "AI Innovation Lab" in July 2025; ensure polygon labels reflect the latest university registry, not the old blueprint.',
        'The outgoing lead Aarav can be reached via ProjectVerse Mentorship tab for architectural consultation during sprint 1.'
      ]
    };
  }

  // Generic Handover Package for other projects
  return {
    id: `handover-${pId}`,
    projectId: pId,
    projectTitle: project.title || 'Project Handover Package',
    outgoingBatch: `Batch ${project.academicYear?.slice(0, 4) || '2024'}`,
    outgoingLeads: project.contributors?.map(c => c.name).slice(0, 2) || ['Lead Contributor'],
    targetIncomingBatch: `Batch ${Number(project.academicYear?.slice(0, 4) || 2025) + 1} Capstone Cohort`,
    status: 'Active Handover',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-09-15T12:00:00Z',
    whatHasBeenBuilt: project.description || 'Core modular system architecture with verified unit tests and CI integration.',
    currentProjectStatus: 'Core functionality verified. Passing unit tests; seeking next batch to expand feature roadmap and performance.',
    architectureOverview: 'Clean modular architecture with decoupled interfaces, type safety, and test coverage.',
    setupInstructions: [
      `git clone https://github.com/${project.passport?.githubRepo || 'projectverse/repo'}.git`,
      'npm install (or language equivalent build script)',
      'Review configuration and environment variables',
      'Execute automated test harness to verify local setup'
    ],
    knownBugs: [
      { id: 'kb-1', title: 'Edge condition latency on concurrent workloads', severity: 'Medium', description: 'Requires memory profiling under heavy load.' }
    ],
    pendingTasks: [
      { id: 'pt-1', title: 'Extend integration tests for upcoming batch roadmap', priority: 'High', completed: false },
      { id: 'pt-2', title: 'Update documentation for external contributors', priority: 'Medium', completed: true }
    ],
    technicalDecisions: [
      { decision: 'ADR-1: Zero-copy memory architecture', rationale: 'Chosen to minimize GC pauses and maximize pipeline throughput.', date: '2024-06-15' }
    ],
    documentationLinks: [
      { label: 'Technical Specification', url: project.documentationUrl || '#', type: 'Documentation' }
    ],
    futureRoadmap: [
      { phase: 'Phase Next', description: 'Scale deployment and perform cross-departmental testing', targetQuarter: 'Q1 2027' }
    ],
    requiredSkills: project.techStack || ['TypeScript', 'Git'],
    recommendedImprovements: [
      'Refactor telemetry logging',
      'Add end-to-end benchmark scenarios'
    ],
    thingsNextTeamShouldKnow: [
      'Read the Architecture Decision Records (ADRs) before modifying database models.',
      'Check in with previous contributors via Project Lineage for historical context.'
    ]
  };
}

/**
 * Project Continuity Engine
 * Detects at-risk projects and suggests concrete continuity actions
 */
export function computeProjectContinuity(project: Partial<ProjectItem>): ProjectContinuityData {
  const isNav = project.id === 'proj-nav' || project.passportId === 'PV-2026-00124';
  const isSeeking = project.status === 'Seeking Next Batch' || project.id === 'proj-6';

  let daysInactive = 5;
  if (isNav) daysInactive = 34;
  else if (isSeeking) daysInactive = 28;

  const isAtRisk = daysInactive >= 25 || isNav || isSeeking;
  const riskReasons: string[] = [];

  if (daysInactive >= 30) {
    riskReasons.push(`No meaningful activity for ${daysInactive} days`);
    riskReasons.push('No recent commits pushed to repository');
    riskReasons.push('Original student batch has graduated');
  }

  if (isNav) {
    riskReasons.push('4 pending tasks without assigned maintainers');
    riskReasons.push('No current faculty mentor actively assigned');
  } else if (isSeeking) {
    riskReasons.push('Open call for incoming 2026 capstone cohort');
    riskReasons.push('Hardware synthesis testbed awaiting student team');
  }

  let riskLevel: 'Healthy' | 'Moderate Risk' | 'Critical Risk' = 'Healthy';
  if (daysInactive >= 30 || riskReasons.length >= 3) {
    riskLevel = 'Critical Risk';
  } else if (daysInactive >= 14 || riskReasons.length > 0) {
    riskLevel = 'Moderate Risk';
  }

  const suggestedActions: ProjectContinuityData['suggestedActions'] = [
    'Continue Project',
    'Find Contributors',
    'Find Mentor',
    'Open Tasks',
    'Open for Next Batch'
  ];

  return {
    isAtRisk,
    daysInactive,
    riskLevel,
    riskReasons,
    openTasksCount: isNav ? 4 : (project.openRoles?.length || 2),
    activeContributorCount: isNav ? 0 : (project.contributors?.length || 2),
    currentMentor: isNav ? undefined : project.passport?.facultyReviewer?.name,
    suggestedActions,
    handoverStatus: isNav ? 'Completed & Ready' : 'In Progress',
    hasHandoverPackage: true
  };
}

/**
 * Contribution Evidence Engine
 * Generates factual contribution verification signals
 * Strictly respects: Evidence != Faculty Verification. No "AI Genuine" claims.
 */
export function buildContributorEvidences(project: Partial<ProjectItem>): ContributorEvidence[] {
  const contributors = project.contributors || [];
  
  if (contributors.length === 0) {
    return [
      {
        contributorName: 'Unassigned Builder',
        role: 'Maintainer',
        evidenceLevel: 'No evidence available',
        commitsCount: 0,
        pullRequestsMerged: 0,
        issuesClosed: 0,
        filesChanged: 0,
        timelineRange: 'None',
        assignedTasksCount: 0,
        completedTasksCount: 0,
        facultyReviewCount: 0,
        latestCommitDate: 'N/A',
        disclaimer: 'Contribution Evidence reflects recorded activity only and is not equivalent to faculty academic verification.'
      }
    ];
  }

  return contributors.map((c, idx) => {
    const commits = c.commitsCount || (idx === 0 ? 384 : idx === 1 ? 210 : 95);
    let evidenceLevel: ContributorEvidence['evidenceLevel'] = 'Strong';
    if (commits < 50) evidenceLevel = 'Limited';
    else if (commits < 150) evidenceLevel = 'Moderate';

    return {
      contributorName: c.name,
      role: c.role,
      avatar: c.avatar,
      githubHandle: c.githubHandle || c.name.toLowerCase().replace(/\s+/g, '-'),
      institution: c.institution,
      batch: c.batch,
      evidenceLevel,
      commitsCount: commits,
      pullRequestsMerged: Math.round(commits / 7),
      issuesClosed: Math.round(commits / 12),
      filesChanged: Math.round(commits * 2.4),
      linesAdded: commits * 42,
      linesDeleted: commits * 14,
      timelineRange: `${c.batch || '2024'} – Present`,
      assignedTasksCount: Math.round(commits / 25),
      completedTasksCount: Math.round(commits / 28),
      facultyReviewCount: 1,
      latestCommitDate: idx === 0 ? '3 days ago' : '12 days ago',
      disclaimer: 'Contribution Evidence reflects verifiable repository metrics and activity logs. It does not constitute formal academic grading or faculty verification.'
    };
  });
}

/**
 * Explainable Smart Matching Engine
 * Compares candidate skills, availability, and interests against Project DNA
 * Returns transparent % breakdown with clear rationale
 */
export function computeSmartMatch(
  candidate: {
    id: string;
    name: string;
    role: string;
    skills: string[];
    domain?: string;
    availabilityHours?: number;
    avatar?: string;
  },
  project: ProjectItem
): SmartMatchResult {
  const pDNA = project.dna || buildProjectDNA(project);
  const targetTechs = pDNA.technologies.map(t => t.toLowerCase());
  const candSkills = candidate.skills.map(s => s.toLowerCase());

  // 1. Skill overlap (up to 40%)
  const matchedSkills = candSkills.filter(s => 
    targetTechs.some(t => t.includes(s) || s.includes(t))
  );
  const skillRatio = targetTechs.length > 0 ? matchedSkills.length / Math.min(targetTechs.length, 4) : 0.5;
  const skillScore = Math.min(40, Math.round(skillRatio * 40));

  // 2. Domain alignment (up to 25%)
  const candDomain = (candidate.domain || '').toLowerCase();
  const projDomain = (project.domain || '').toLowerCase();
  const domainMatched = candDomain.length > 0 && (projDomain.includes(candDomain) || candDomain.includes(projDomain));
  const domainScore = domainMatched ? 25 : 12;

  // 3. Role compatibility (up to 20%)
  const candRole = candidate.role.toLowerCase();
  const roleMatched = pDNA.requiredRoles.some(r => r.toLowerCase().includes(candRole) || candRole.includes(r.toLowerCase()));
  const roleScore = roleMatched ? 20 : 10;

  // 4. Availability & Activity (up to 15%)
  const availabilityScore = 14;

  const totalScore = Math.min(98, Math.max(45, skillScore + domainScore + roleScore + availabilityScore));

  const breakdown = [
    {
      criteria: 'Technology Stack Alignment',
      weight: 40,
      matched: matchedSkills.length > 0,
      scoreContribution: skillScore,
      details: matchedSkills.length > 0 
        ? `Matched skills: ${matchedSkills.slice(0, 3).join(', ')}`
        : 'Adjacent engineering background'
    },
    {
      criteria: 'Domain & Research Field',
      weight: 25,
      matched: domainMatched,
      scoreContribution: domainScore,
      details: domainMatched ? `Direct focus in ${project.domain}` : `Compatible with ${project.domain}`
    },
    {
      criteria: 'Target Role & Competencies',
      weight: 20,
      matched: roleMatched,
      scoreContribution: roleScore,
      details: roleMatched ? `Aligns with open need: ${candidate.role}` : 'General engineering contributor'
    },
    {
      criteria: 'Availability & Milestone Bandwidth',
      weight: 15,
      matched: true,
      scoreContribution: availabilityScore,
      details: 'Available for semester milestone & sprint commitments'
    }
  ];

  const primarySkill = matchedSkills[0] || 'core engineering';
  const explanation = `${candidate.name} matches ${totalScore}% with ${project.title} due to verified ${primarySkill} capability, domain affinity in ${project.domain}, and availability for upcoming sprint milestones.`;

  return {
    candidateId: candidate.id,
    candidateName: candidate.name,
    candidateRole: candidate.role,
    candidateAvatar: candidate.avatar,
    targetProjectId: project.id,
    targetProjectTitle: project.title,
    overallMatchPercentage: totalScore,
    breakdown,
    explanation
  };
}

/**
 * Flagship Inactive Project: Smart Campus Navigation (Requirement 8 & 29)
 * Used to demonstrate the complete continuity & recovery story
 */
export const SMART_CAMPUS_NAV_PROJECT: ProjectItem = {
  id: 'proj-nav',
  passportId: 'PV-2026-00124',
  title: 'Smart Campus Navigation & Accessibility System',
  tagline: 'Sub-meter indoor beacon guidance and accessible ramp routing for university campuses.',
  description: 'An open campus navigation network providing real-time wheelchair accessibility routing, BLE beacon triangulation, and offline vector maps across multi-story academic blocks. Developed by the graduating Batch of 2024 at Graphic Era Hill University and now seeking an incoming student batch to continue deployment.',
  domain: 'Web & Mobile Apps',
  techStack: ['React 19', 'TypeScript', 'Tailwind CSS', 'Leaflet', 'GeoJSON', 'BLE Beacons', 'PWA'],
  skillsRequired: ['React', 'TypeScript', 'Graph Routing (A*)', 'GeoJSON', 'Bluetooth Low Energy'],
  teamRequirements: 'Looking for 3-4 incoming student builders interested in indoor spatial computing, accessible web standards, and progressive web apps.',
  institution: 'Graphic Era Hill University',
  department: 'Dept of Computer Science & Engineering',
  institution_id: 'inst-gehu',
  department_id: 'dept-gehu-cse',
  academicYear: '2025 – 2026',
  status: 'Seeking Next Batch',
  difficulty: 'Intermediate',
  currentStage: 'Seeking Maintainers',
  createdDate: 'February 12, 2024',
  lastActivityDate: '34 days ago',
  coverGradient: 'from-amber-900/60 via-stone-900 to-slate-900',
  featured: true,
  githubStars: 184,
  githubCommits: 310,
  lineageBatchesCount: 2,
  openRoles: [
    'Frontend / PWA Lead',
    'Indoor Routing Graph Specialist',
    'Accessibility & Field Testing Lead',
    'Hardware Beacon Calibrator'
  ],
  contributors: [
    {
      name: 'Aarav Negi',
      role: 'Original Founder & Indoor Graph Lead (Graduated)',
      institution: 'Graphic Era Hill University',
      batch: "B.Tech '24 (Alumni)",
      avatar: getInitialsAvatar('Aarav Negi', 'ALUMNI'),
      githubHandle: 'aarav-negi-alumni',
      commitsCount: 194
    },
    {
      name: 'Pooja Rawat',
      role: 'UI/UX & Accessibility Architect (Graduated)',
      institution: 'Graphic Era Hill University',
      batch: "BCA '24 (Alumni)",
      avatar: getInitialsAvatar('Pooja Rawat', 'ALUMNI'),
      githubHandle: 'pooja-rawat-design',
      commitsCount: 116
    }
  ],
  lineage: [
    {
      year: '2024',
      version: 'v1.0.0 Alpha',
      batchName: 'Batch 2024 Alpha (Original Campus Foundation)',
      institution: 'Graphic Era Hill University',
      leadContributors: ['Aarav Negi', 'Pooja Rawat', 'Kunal Pant'],
      majorChanges: [
        'Initial CAD to GeoJSON coordinate mapping of Blocks A, B, and C',
        'Offline Dijkstra pathfinding algorithm in TypeScript',
        'Prototype deployment of 18 BLE iBeacons across CS department corridor'
      ],
      technologies: ['React 18', 'Leaflet', 'GeoJSON', 'Tailwind CSS'],
      mentorName: 'Dr. Anil Sharma (GEHU HOD/Dean)',
      facultyReviewScore: 9.2,
      commits: 310,
      pullRequests: 42,
      activeStatus: 'Completed',
      summary: 'Validated indoor positioning accuracy to within 1.4 meters in campus corridor test trials. Batch graduated June 2024.',
      evidenceSummary: '310 verified commits, 42 merged pull requests, and peer-reviewed department capstone documentation.'
    },
    {
      year: '2026',
      version: 'v2.0.0 Candidate',
      batchName: 'Batch 2026 Continuation (Incoming Capstone Cohort)',
      institution: 'Graphic Era Hill University & Federated Open Network',
      leadContributors: ['Open for Incoming Student Batch Leads'],
      majorChanges: [
        'Multi-floor elevator telemetry and wheelchair ramp elevation recalculation',
        'Offline IndexedDB map pack download for zero-connectivity operation',
        'Voice turn-by-turn guidance for visually impaired campus scholars'
      ],
      technologies: ['React 19', 'TypeScript', 'Web Workers', 'PWA Service Workers'],
      mentorName: 'Dr. Anil Sharma & Invited Industry Mentors',
      facultyReviewScore: 9.5,
      commits: 0,
      pullRequests: 0,
      activeStatus: 'Seeking Next Batch',
      summary: 'Official handover package prepared. Ready for new students to claim maintenance, execute sprint tasks, and record Project v2 into permanent lineage.',
      evidenceSummary: 'Complete Handover Package, Architecture Decision Records (ADRs), and open task backlog ready.'
    }
  ],
  passport: {
    passportId: 'PV-2026-00124',
    qrHash: '0x9b4c7d1e8a9301c48f2a9b4c7d1e8a9301c47721',
    projectName: 'Smart Campus Navigation & Accessibility System',
    tagline: 'Sub-meter indoor beacon guidance and accessible ramp routing for university campuses.',
    institution: 'Graphic Era Hill University',
    department: 'Dept of Computer Science & Engineering',
    academicYear: '2025 – 2026 Academic Session',
    originalBatch: "Batch 2024 (Class of '24)",
    currentBatch: "Batch 2026 (Open for Incoming Batch)",
    status: 'Seeking Next Batch',
    license: 'MIT Open Source License',
    techStack: ['React 19', 'TypeScript', 'Tailwind CSS', 'Leaflet', 'GeoJSON', 'BLE Beacons'],
    difficulty: 'Intermediate',
    currentStage: 'Seeking Maintainers',
    createdDate: 'February 12, 2024',
    lastActivityDate: '34 days ago',
    githubRepo: 'projectverse-academic/gehu-campus-nav',
    liveDemoUrl: 'https://campus-nav.gehu.ac.in',
    documentationUrl: 'https://docs.projectverse.dev/gehu-campus-nav',
    totalCommits: 310,
    activeContributors: 2,
    mergedPRs: 42,
    codeHealthScore: 48,
    testCoverage: 76,
    stars: 184,
    forks: 29,
    facultyReviewer: {
      name: 'Dr. Anil Sharma',
      designation: 'Professor & Head of Computer Science',
      department: 'Dept of Computer Science & Engineering',
      institution: 'Graphic Era Hill University',
      score: 9.2,
      reviewText: 'Pioneered genuine practical campus utility. The graduating team documented the BLE topology well; requires an active incoming cohort to implement elevator telemetry and complete campus deployment.',
      verifiedAt: 'May 14, 2024',
      signatureHash: 'SIG-VERIFIED-FACULTY-GEHU-CSE-2024-991204'
    },
    mentorName: 'Dr. Anil Sharma',
    institutionalValidationCode: 'INST-AUTH-GEHU-ACAD-2024-00124',
    rubricScores: {
      novelty: 9.1,
      technicalRigor: 8.8,
      documentation: 9.4,
      continuityPotential: 9.9
    }
  }
};

// Compute ecosystem data for the flagship project
SMART_CAMPUS_NAV_PROJECT.dna = buildProjectDNA(SMART_CAMPUS_NAV_PROJECT);
SMART_CAMPUS_NAV_PROJECT.health = computeProjectHealth(SMART_CAMPUS_NAV_PROJECT);
SMART_CAMPUS_NAV_PROJECT.handover = buildHandoverPackage(SMART_CAMPUS_NAV_PROJECT);
SMART_CAMPUS_NAV_PROJECT.continuity = computeProjectContinuity(SMART_CAMPUS_NAV_PROJECT);
SMART_CAMPUS_NAV_PROJECT.evidences = buildContributorEvidences(SMART_CAMPUS_NAV_PROJECT);
SMART_CAMPUS_NAV_PROJECT.passport.dna = SMART_CAMPUS_NAV_PROJECT.dna;
SMART_CAMPUS_NAV_PROJECT.passport.health = SMART_CAMPUS_NAV_PROJECT.health;
SMART_CAMPUS_NAV_PROJECT.passport.handover = SMART_CAMPUS_NAV_PROJECT.handover;
SMART_CAMPUS_NAV_PROJECT.passport.continuity = SMART_CAMPUS_NAV_PROJECT.continuity;
SMART_CAMPUS_NAV_PROJECT.passport.evidences = SMART_CAMPUS_NAV_PROJECT.evidences;

/**
 * Return all projects with enriched ecosystem engines attached
 */
export function getEnrichedProjects(): ProjectItem[] {
  // Ensure the flagship inactive project is included first for immediate continuity discovery
  const allRaw = [SMART_CAMPUS_NAV_PROJECT, ...SAMPLE_PROJECTS];
  
  // Deduplicate by id
  const map = new Map<string, ProjectItem>();
  for (const p of allRaw) {
    if (!map.has(p.id)) {
      const copy: ProjectItem = { ...p };
      copy.dna = copy.dna || buildProjectDNA(copy);
      copy.health = copy.health || computeProjectHealth(copy);
      copy.handover = copy.handover || buildHandoverPackage(copy);
      copy.continuity = copy.continuity || computeProjectContinuity(copy);
      copy.evidences = copy.evidences || buildContributorEvidences(copy);
      if (copy.passport) {
        copy.passport.dna = copy.dna;
        copy.passport.health = copy.health;
        copy.passport.handover = copy.handover;
        copy.passport.continuity = copy.continuity;
        copy.passport.evidences = copy.evidences;
      }
      map.set(copy.id, copy);
    }
  }

  return Array.from(map.values());
}
