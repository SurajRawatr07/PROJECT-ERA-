import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Export all Mongoose models
export * from './models/User';
export * from './models/Project';
export * from './models/ProjectLineage';
export * from './models/ProjectMember';
export * from './models/ProjectReview';
export * from './models/CollaborationRequest';
export * from './models/VerificationRequest';
export * from './models/Institution';
export * from './models/Notification';

import UserModel, { IUser } from './models/User';
import ProjectModel, { IProject } from './models/Project';
import ProjectLineageModel from './models/ProjectLineage';
import InstitutionModel from './models/Institution';
import VerificationRequestModel from './models/VerificationRequest';

let mongoMemoryServerInstance: any = null;

/**
 * Connect to MongoDB using Mongoose.
 * Prioritizes MONGODB_URI from environment variables.
 * If MONGODB_URI is not provided, launches a local in-memory MongoDB instance for development & testing.
 */
export async function connectDB(): Promise<typeof mongoose> {
  const rawUri = process.env.MONGODB_URI;
  const cleanUri = (rawUri || '').trim().replace(/^['"]|['"]$/g, '');

  const hasValidScheme =
    cleanUri.startsWith('mongodb://') || cleanUri.startsWith('mongodb+srv://');

  if (cleanUri.length > 0) {
    if (hasValidScheme) {
      try {
        console.log('[MongoDB] Connecting to database via MONGODB_URI...');
        await mongoose.connect(cleanUri, {
          serverSelectionTimeoutMS: 8000
        });
        console.log('[MongoDB] Connected successfully to remote MongoDB cluster.');
        await seedDatabaseIfEmpty();
        return mongoose;
      } catch (err: any) {
        console.error('[MongoDB] Connection error with provided MONGODB_URI:', err.message);
        if (process.env.STRICT_MONGODB_URI === 'true') {
          throw new Error(`Failed to connect to MongoDB at provided MONGODB_URI: ${err.message}`);
        }
        console.warn(
          '[MongoDB] Remote cluster connection failed. Initializing local MongoDB engine so server remains operational...'
        );
      }
    } else {
      console.warn(
        `\n================================================================================\n` +
        `[MongoDB] Warning: The provided MONGODB_URI ("${cleanUri}") is not a valid MongoDB URI.\n` +
        `Connection strings must start with "mongodb://" or "mongodb+srv://".\n` +
        `Example Atlas URI: mongodb+srv://<user>:<password>@cluster0.abcde.mongodb.net/projectverse\n` +
        `================================================================================\n`
      );
      if (process.env.STRICT_MONGODB_URI === 'true') {
        throw new Error(
          `Invalid MONGODB_URI scheme: expected string to start with "mongodb://" or "mongodb+srv://", received "${cleanUri}"`
        );
      }
    }
  }

  // If MONGODB_URI is missing or invalid, fail clearly only if strict mode is configured
  if (process.env.STRICT_MONGODB_URI === 'true') {
    throw new Error(
      'FATAL: Valid MONGODB_URI environment variable is missing. Please configure MONGODB_URI in your .env file or environment.'
    );
  }

  // Automatic local development MongoDB instance using MongoMemoryServer
  console.warn(
    '\n================================================================================\n' +
    '[MongoDB] Notice: Valid MONGODB_URI not available in environment.\n' +
    '[MongoDB] Initializing local MongoDB engine for full-stack persistence & testing...\n' +
    '================================================================================\n'
  );

  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongoMemoryServerInstance = await MongoMemoryServer.create();
    const localUri = mongoMemoryServerInstance.getUri();
    console.log(`[MongoDB] Local MongoDB engine active at ${localUri}`);

    await mongoose.connect(localUri);
    console.log('[MongoDB] Mongoose successfully connected to local engine.');
    await seedDatabaseIfEmpty();
    return mongoose;
  } catch (memErr: any) {
    console.error('[MongoDB] Failed to start local MongoDB engine:', memErr.message);
    throw new Error(
      `MongoDB connection failed. Please provide a valid MONGODB_URI in your environment or .env file: ${memErr.message}`
    );
  }
}

/**
 * Seed initial baseline data into MongoDB if the database collections are currently empty
 */
async function seedDatabaseIfEmpty(): Promise<void> {
  try {
    const userCount = await UserModel.countDocuments().exec();
    if (userCount > 0) {
      console.log(`[MongoDB] Database already populated with ${userCount} users. Skipping seed.`);
      return;
    }

    console.log('[MongoDB] First run detected. Seeding baseline users, projects, institutions, and lineage into MongoDB...');

    // 1. Seed Institutions
    await InstitutionModel.create([
      {
        name: 'Graphic Era Hill University',
        code: 'GEHU',
        domain: 'gehu.ac.in',
        institutionType: 'University / Higher Education Node',
        departments: [
          'Dept of Computer Science & Engineering',
          'Dept of Information Technology',
          'Dept of Electronics & Communication'
        ],
        verificationStatus: 'VERIFIED',
        contactEmail: 'registrar@gehu.ac.in',
        website: 'https://gehu.ac.in',
        address: 'Society Area, Clement Town, Dehradun, Uttarakhand 248002'
      },
      {
        name: 'Autonomous AI Institute',
        code: 'AAII',
        domain: 'deepmind-labs.org',
        institutionType: 'Research Laboratory',
        departments: ['Translational AI Research Group', 'Foundation Models Lab'],
        verificationStatus: 'VERIFIED',
        contactEmail: 'contact@deepmind-labs.org',
        website: 'https://autonomous-ai.org'
      },
      {
        name: 'Open Source Community',
        code: 'OSS',
        domain: 'openverse.org',
        institutionType: 'Open Source Collective',
        departments: ['Distributed Systems Collective', 'Core Architecture'],
        verificationStatus: 'VERIFIED',
        website: 'https://openverse.org'
      }
    ]);

    // 2. Hash default seed passwords
    const studentPass = bcryptjs.hashSync('Student@123', 10);
    const facultyPass = bcryptjs.hashSync('Faculty@123', 10);
    const hodPass = bcryptjs.hashSync('Hod@123', 10);
    const adminPass = bcryptjs.hashSync('Admin@123', 10);
    const rohanPass = bcryptjs.hashSync('Rohan@123', 10);
    const alexPass = bcryptjs.hashSync('Alex@1234', 10);
    const elenaPass = bcryptjs.hashSync('Elena@123', 10);
    const vikramPass = bcryptjs.hashSync('Vikram@123', 10);

    const fullVerified = {
      accountStatus: 'ACTIVE' as const,
      email: 'VERIFIED' as const,
      mobile: 'VERIFIED' as const,
      institution: 'VERIFIED' as const,
      academic: 'VERIFIED' as const,
      document: 'VERIFIED' as const,
      contribution: 'VERIFIED' as const,
      githubConnected: true,
      linkedInAdded: true,
      portfolioAdded: true,
      emailVerified: true,
      institutionVerified: true,
      academicVerified: true,
      documentVerified: true,
      facultyReviewed: true,
      contributionVerified: true
    };

    // Seed Users
    const studentUser = await UserModel.create({
      fullName: 'Suraj Rawat',
      email: 'suraj@student.demo',
      passwordHash: studentPass,
      role: 'STUDENT',
      accountType: 'STUDENT',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'Full-stack builder and systems researcher passionate about developer tools, distributed computing, and web performance.',
      skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'MongoDB', 'C++', 'DSA', 'Git/GitHub'],
      institution: 'Graphic Era Hill University',
      department: 'Dept of Computer Science & Engineering',
      course: 'BCA',
      batch: '2023–2027',
      rollNumber: 'GEHU/2023/BCA/089',
      studentType: 'CURRENT_STUDENT',
      githubHandle: 'surajrawat-dev',
      linkedIn: 'linkedin.com/in/suraj-rawat',
      portfolio: 'surajrawat.me',
      projectsCount: 2,
      verificationStatus: 'VERIFIED',
      verification: fullVerified
    });

    const facultyUser = await UserModel.create({
      fullName: 'Dr. Ananya Sharma',
      email: 'faculty@demo.com',
      passwordHash: facultyPass,
      role: 'FACULTY',
      accountType: 'FACULTY',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      bio: 'Assistant Professor in Computer Science & Engineering. Guiding undergraduate capstone initiatives and peer reviews.',
      skills: ['AI/ML', 'Computer Vision', 'Distributed Systems', 'Academic Peer Review'],
      institution: 'Graphic Era Hill University',
      department: 'Computer Science & Engineering',
      facultyId: 'EMP-GEHU-FAC-409',
      designation: 'Assistant Professor',
      isAuthorizedReviewer: true,
      reviewerCategories: ['ACADEMIC', 'TECHNICAL'],
      availableForMentorship: true,
      projectsCount: 12,
      verificationStatus: 'VERIFIED',
      verification: fullVerified
    });

    const hodUser = await UserModel.create({
      fullName: 'Dr. Rajesh Mehta',
      email: 'hod@demo.com',
      passwordHash: hodPass,
      role: 'HOD',
      accountType: 'HOD',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      bio: 'Head of Department, Computer Science. Overseeing department capstones, verification seals, and institutional compliance.',
      skills: ['Curriculum Design', 'Academic Governance', 'Accreditation', 'Capstone Verification'],
      institution: 'Graphic Era Hill University',
      department: 'Computer Science',
      facultyId: 'HOD-CSE-001',
      designation: 'Professor & Head of Department',
      departmentToken: 'GEHU-HOD-CSE-2025',
      isAuthorizedReviewer: true,
      reviewerCategories: ['ACADEMIC'],
      availableForMentorship: true,
      projectsCount: 86,
      verificationStatus: 'VERIFIED',
      verification: fullVerified
    });

    await UserModel.create({
      fullName: 'ProjectVerse Admin',
      email: 'admin@demo.com',
      passwordHash: adminPass,
      role: 'ADMIN',
      accountType: 'ADMIN',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      bio: 'Root Administrator for ProjectVerse Open Ecosystem ledger, telemetry, and platform management.',
      skills: ['Platform Architecture', 'Network Administration', 'Ledger Governance', 'Identity Access Control'],
      institution: 'ProjectVerse Open Federation',
      department: 'Federated Infrastructure Office',
      facultyId: 'ROOT-ADMIN-01',
      designation: 'Platform Governance & System Administrator',
      isAuthorizedReviewer: true,
      reviewerCategories: ['ACADEMIC', 'TECHNICAL', 'RESEARCH', 'ORGANIZATION'],
      projectsCount: 1426,
      verificationStatus: 'VERIFIED',
      verification: fullVerified
    });

    const alumniUser = await UserModel.create({
      fullName: 'Rohan Verma',
      email: 'rohan.alumni@gehu.ac.in',
      passwordHash: rohanPass,
      role: 'STUDENT',
      accountType: 'ALUMNI',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bio: 'Alumni & Distributed Systems Engineer. Mentoring capstone project continuations across universities.',
      skills: ['Rust', 'Go', 'Distributed Consensus', 'Smart Contracts', 'System Architecture'],
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
      verificationStatus: 'VERIFIED',
      verification: fullVerified
    });

    const devUser = await UserModel.create({
      fullName: 'Alex Chen',
      email: 'alex.dev@openverse.org',
      passwordHash: alexPass,
      role: 'STUDENT',
      accountType: 'DEVELOPER',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
      bio: 'Open-source systems engineer & core maintainer. Specializes in WASM runtimes, kernel bypass, and distributed databases.',
      skills: ['Rust', 'WebAssembly', 'C++', 'Linux Kernel', 'Docker', 'Distributed Systems'],
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
      verificationStatus: 'VERIFIED',
      verification: {
        ...fullVerified,
        institution: 'UNVERIFIED',
        academic: 'NOT_APPLICABLE',
        document: 'NOT_REQUIRED',
        institutionVerified: false,
        academicVerified: false,
        documentVerified: false
      }
    });

    const researcherUser = await UserModel.create({
      fullName: 'Dr. Elena Rostova',
      email: 'dr.elena@deepmind-labs.org',
      passwordHash: elenaPass,
      role: 'STUDENT',
      accountType: 'RESEARCHER',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      bio: 'Research Scientist specializing in foundation model alignments, federated privacy, and neuro-symbolic reasoning.',
      skills: ['PyTorch', 'JAX', 'Neuromorphic Computing', 'Differential Privacy', 'Formal Verification'],
      institution: 'Autonomous AI Institute',
      researchInterests: ['Foundation Models', 'Neuromorphic Guidance', 'Formal Proofs'],
      publicationsCount: 14,
      githubHandle: 'elena-rostova-ai',
      portfolio: 'rostova-research.ai',
      isAuthorizedReviewer: true,
      reviewerCategories: ['RESEARCH'],
      availableForMentorship: true,
      projectsCount: 3,
      verificationStatus: 'VERIFIED',
      verification: fullVerified
    });

    const industryUser = await UserModel.create({
      fullName: 'Vikram Singh',
      email: 'vikram.singh@hypercloud.io',
      passwordHash: vikramPass,
      role: 'STUDENT',
      accountType: 'INDUSTRY_PROFESSIONAL',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      bio: 'VP of Engineering at HyperCloud. Sponsoring university capstones and transitioning open projects into industrial pilots.',
      skills: ['Cloud Architecture', 'Kubernetes', 'Multi-tenant Systems', 'Security Compliance', 'Mentorship'],
      currentOrganization: 'HyperCloud Solutions',
      currentJobRole: 'VP of Infrastructure Engineering',
      linkedIn: 'linkedin.com/in/vikram-singh-cloud',
      portfolio: 'vikramcloud.com',
      experienceYears: 12,
      isAuthorizedReviewer: true,
      reviewerCategories: ['ORGANIZATION', 'TECHNICAL'],
      availableForMentorship: true,
      projectsCount: 7,
      verificationStatus: 'VERIFIED',
      verification: fullVerified
    });

    // 3. Seed Projects
    // Project 1: Academic Project (AeroSync)
    const project1 = await ProjectModel.create({
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
      facultyAdvisor: 'Dr. Ananya Sharma',
      repositoryUrl: 'https://github.com/projectverse-org/aerosync-swarm',
      demoUrl: 'https://aerosync.projectverse.dev',
      documentationUrl: 'https://docs.projectverse.dev/aerosync',
      problem: 'GPS-denied search and rescue operations experience catastrophic drone swarm collisions and lost signal links in collapsed urban structures.',
      solution: 'Neuromorphic spike-based visual odometry that processes photon changes directly at the sensor layer with sub-millisecond latency without reliance on external RF beacons.',
      owner: studentUser._id,
      contributors: [
        {
          user: studentUser._id,
          name: 'Suraj Rawat',
          role: 'Swarm Lead & Firmware',
          institution: 'Graphic Era Hill University',
          batch: "B.Tech '26",
          avatar: studentUser.avatar,
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
      lineageBatchesCount: 2,
      githubStars: 142,
      githubCommits: 630,
      githubStatus: 'GITHUB_LINKED',
      openRoles: ['Neuromorphic Vision Engineer', 'Embedded C++ Specialist', 'Flight Dynamics QA'],
      coverGradient: 'from-blue-600/20 via-indigo-600/10 to-transparent',
      featured: true,
      verificationStatus: 'Verified',
      reviewStatus: 'VERIFIED',
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
          name: 'Dr. Ananya Sharma',
          designation: 'Assistant Professor & Senior Research Advisor',
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
    });

    // Project 2: Open Source Project (WasmMesh)
    const project2 = await ProjectModel.create({
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
      owner: devUser._id,
      contributors: [
        {
          user: devUser._id,
          name: 'Alex Chen',
          role: 'Core Maintainer',
          institution: 'Open Source Collective',
          batch: 'Maintainer',
          avatar: devUser.avatar,
          githubHandle: 'alexchen-sys',
          commitsCount: 520
        },
        {
          user: alumniUser._id,
          name: 'Rohan Verma',
          role: 'Distributed Consensus Advisor',
          institution: 'Hyperledger / Alumni',
          batch: "Alumni '24",
          avatar: alumniUser.avatar,
          githubHandle: 'rohanverma-alumni',
          commitsCount: 310
        }
      ],
      lineageBatchesCount: 2,
      githubStars: 418,
      githubCommits: 890,
      githubStatus: 'GITHUB_LINKED',
      openRoles: ['Core Engine Rust Dev', 'Documentation Lead', 'Benchmark Engineer'],
      coverGradient: 'from-cyan-600/20 via-blue-600/10 to-transparent',
      featured: true,
      verificationStatus: 'Active Development',
      reviewStatus: 'VERIFIED',
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
    });

    // Project 3: Research Project (NeuroSymbolic-Med)
    const project3 = await ProjectModel.create({
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
      owner: researcherUser._id,
      contributors: [
        {
          user: researcherUser._id,
          name: 'Dr. Elena Rostova',
          role: 'Lead Research Scientist',
          institution: 'Autonomous AI Institute',
          batch: 'Senior Researcher',
          avatar: researcherUser.avatar,
          githubHandle: 'elena-rostova-ai',
          commitsCount: 420
        }
      ],
      lineageBatchesCount: 1,
      githubStars: 289,
      githubCommits: 470,
      githubStatus: 'GITHUB_LINKED',
      openRoles: ['Knowledge Graph Engineer', 'Clinical NLP Evaluator'],
      coverGradient: 'from-emerald-600/20 via-teal-600/10 to-transparent',
      featured: true,
      verificationStatus: 'Verified',
      reviewStatus: 'VERIFIED',
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
          name: 'Dr. Ananya Sharma',
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
    });

    // Project 4: Industry Project (OmniVolt)
    await ProjectModel.create({
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
      owner: industryUser._id,
      contributors: [
        {
          user: industryUser._id,
          name: 'Vikram Singh',
          role: 'Industry Sponsor & Architect',
          institution: 'HyperCloud Solutions',
          batch: 'Industry Lead',
          avatar: industryUser.avatar,
          githubHandle: 'vikram-industry',
          commitsCount: 340
        }
      ],
      lineageBatchesCount: 1,
      githubStars: 176,
      githubCommits: 390,
      githubStatus: 'GITHUB_LINKED',
      openRoles: ['Industrial Protocols Developer', 'Golang Telemetry Engineer'],
      coverGradient: 'from-amber-600/20 via-orange-600/10 to-transparent',
      featured: false,
      verificationStatus: 'Active Development',
      reviewStatus: 'VERIFIED',
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
    });

    // 4. Seed Project Lineage (Continuity)
    await ProjectLineageModel.create([
      {
        projectId: project1._id,
        year: '2024',
        batchName: 'Batch 2024 (Foundation)',
        version: 'v1.0-alpha',
        institution: 'Graphic Era Hill University',
        leadContributors: ['Rohan Verma', 'Kavita Joshi'],
        previousContributors: [],
        currentContributors: ['Rohan Verma', 'Kavita Joshi'],
        keyMilestones: ['Single-drone optical flow prototype', 'ROS 2 integration baseline'],
        majorChanges: ['Implemented monocular optical-flow feature tracker on Jetson Nano.'],
        technologies: ['ROS 2', 'C++', 'OpenCV', 'Jetson Nano'],
        commits: 210,
        pullRequests: 18,
        activeStatus: 'Completed',
        summary: 'Pioneered the baseline monocular vision pipeline on Jetson Nano.',
        handoverNotes: 'Hardware baseline validated with 3DR Iris quadcopters. Ready for multi-agent swarm extension.'
      },
      {
        projectId: project1._id,
        year: '2025',
        batchName: 'Batch 2025 (Swarm Extension)',
        version: 'v2.0-beta',
        institution: 'Graphic Era Hill University',
        leadContributors: ['Suraj Rawat', 'Arjun Mehta'],
        previousContributors: ['Rohan Verma', 'Kavita Joshi'],
        currentContributors: ['Suraj Rawat', 'Arjun Mehta'],
        keyMilestones: ['Multi-agent consensus algorithm', 'Spinnaker neuromorphic sensor integration'],
        majorChanges: [
          'Transformed single drone prototype into 5-agent micro-swarm.',
          'Sub-millisecond spike processing with Spinnaker neuromorphic vision.'
        ],
        technologies: ['ROS 2', 'PyTorch', 'C++', 'Spinnaker', 'CUDA'],
        commits: 420,
        pullRequests: 42,
        activeStatus: 'Current',
        summary: 'Transformed single drone into an auto-coordinating 5-agent micro-swarm.',
        handoverNotes: 'Tested in indoor flight arena with GPS disabled. Looking for 2026 batch contributors to extend battery management.'
      },
      {
        projectId: project2._id,
        year: '2025',
        batchName: 'Phase 1 Core Engine',
        version: 'v0.1.0',
        institution: 'Open Source Community',
        leadContributors: ['Alex Chen'],
        previousContributors: [],
        currentContributors: ['Alex Chen'],
        keyMilestones: ['Wasmtime sandboxing', 'libp2p peer discovery baseline'],
        majorChanges: ['Baseline sandboxing running WASM bytecode with sub-10ms warm starts.'],
        technologies: ['Rust', 'WebAssembly', 'libp2p', 'Tokio'],
        commits: 410,
        pullRequests: 32,
        activeStatus: 'Completed',
        summary: 'Delivered proof of concept running 100 concurrent tasks across 8 nodes.',
        handoverNotes: 'Standardized wasm memory isolation model. Ready for community RFC submissions.'
      }
    ]);

    // 5. Seed Verification Requests
    await VerificationRequestModel.create([
      {
        userId: studentUser._id,
        fullName: 'Suraj Rawat',
        email: 'suraj@student.demo',
        role: 'STUDENT',
        studentType: 'CURRENT_STUDENT',
        institution: 'Graphic Era Hill University',
        department: 'Dept of Computer Science & Engineering',
        course: 'BCA',
        batch: '2023–2027',
        rollNumber: 'GEHU/2023/BCA/089',
        documentType: 'Student ID Card',
        documentFileName: 'GEHU_Suraj_ID_Card.pdf',
        documentFileSize: '2.4 MB',
        status: 'VERIFIED',
        reviewedBy: 'Dr. Ananya Sharma (FACULTY)',
        reviewedAt: new Date()
      },
      {
        userId: alumniUser._id,
        fullName: 'Rohan Verma',
        email: 'rohan.alumni@gehu.ac.in',
        role: 'STUDENT',
        studentType: 'ALUMNI',
        institution: 'Graphic Era Hill University',
        department: 'Dept of Computer Science & Engineering',
        course: 'BCA',
        graduationYear: '2024',
        rollNumber: 'GEHU/2020/CS/042',
        documentType: 'Degree Certificate / Marksheet',
        documentFileName: 'Official_Degree_Certificate.pdf',
        documentFileSize: '3.1 MB',
        status: 'VERIFIED',
        reviewedBy: 'Dr. Rajesh Mehta (HOD)',
        reviewedAt: new Date()
      }
    ]);

    console.log('[MongoDB] Baseline seeding completed successfully!');
  } catch (seedErr: any) {
    console.error('[MongoDB] Error seeding initial baseline data:', seedErr);
  }
}
