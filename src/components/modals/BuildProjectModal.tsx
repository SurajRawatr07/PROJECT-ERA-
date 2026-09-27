import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  UploadCloud, 
  CheckCircle2, 
  ArrowRight,
  FolderGit2, 
  FileText, 
  Image, 
  Users, 
  ShieldCheck, 
  Globe, 
  GraduationCap, 
  Code2, 
  FlaskConical, 
  Briefcase, 
  User, 
  Trash2, 
  Trophy,
  GitFork,
  BookOpen,
  Building2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { DOMAINS_LIST } from '../../data/mockData';
import { ProjectDomain, ProjectType, UserRole } from '../../types';
import { getCurrentSession, UserProfile } from '../../lib/authService';
import { canRoleSubmitProject, isOrganizationalAuthorityRole } from '../../lib/permissions';

interface BuildProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (projectData: any) => void;
  onRequireAuth?: () => void;
  currentRole?: UserRole;
  currentProfile?: UserProfile;
}

export const BuildProjectModal: React.FC<BuildProjectModalProps> = ({
  isOpen,
  onClose,
  onProjectCreated,
  onRequireAuth,
  currentRole,
  currentProfile
}) => {
  const session = getCurrentSession();
  const effectiveRole = currentRole || session?.user?.role || 'STUDENT';
  const effectiveProfile = currentProfile || session?.user;

  // Project Type
  const [projectType, setProjectType] = useState<ProjectType>(
    effectiveRole === 'RESEARCHER' ? 'RESEARCH' :
    effectiveRole === 'DEVELOPER' ? 'OPEN_SOURCE' :
    effectiveRole === 'INDUSTRY_PROFESSIONAL' ? 'INDUSTRY' : 'ACADEMIC'
  );

  // Common Fields
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [domain, setDomain] = useState<ProjectDomain>('Artificial Intelligence & ML');
  const [techInput, setTechInput] = useState('');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');

  // Links & Evidence
  const [projectLink, setProjectLink] = useState('');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [documentationUrl, setDocumentationUrl] = useState('');
  const [pptUrl, setPptUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  // Team & Collaboration
  const [skillsRequired, setSkillsRequired] = useState('');
  const [teamMembers, setTeamMembers] = useState('');
  const [mentor, setMentor] = useState('');
  const [collaborationStatus, setCollaborationStatus] = useState('Open for Contributors');
  const [continuationStatus, setContinuationStatus] = useState('Seeking Next Batch');

  // Role-Specific Autofill State
  // Academic / Student
  const [institution, setInstitution] = useState('');
  const [department, setDepartment] = useState('');
  const [course, setCourse] = useState('');
  const [academicYear, setAcademicYear] = useState('2025–2026');

  // Developer specific
  const [technicalChallenges, setTechnicalChallenges] = useState('');
  const [keyFeatures, setKeyFeatures] = useState('');
  const [openSourceStatus, setOpenSourceStatus] = useState('Public / MIT');

  // Researcher specific
  const [methodology, setMethodology] = useState('');
  const [researchStage, setResearchStage] = useState('Preprint / Peer Review');
  const [publicationLink, setPublicationLink] = useState('');
  const [researcherOrcid, setResearcherOrcid] = useState('');
  const [expectedOutcome, setExpectedOutcome] = useState('');

  // Alumni specific
  const [projectHistory, setProjectHistory] = useState('');
  const [graduationYear, setGraduationYear] = useState('');

  // Industry specific
  const [organization, setOrganization] = useState('');
  const [industryDomain, setIndustryDomain] = useState('');
  const [businessContext, setBusinessContext] = useState('');

  // Screenshots & Documents
  const [screenshotUrls, setScreenshotUrls] = useState<string[]>([]);
  const [screenshotInput, setScreenshotInput] = useState('');
  const [supportingDocs, setSupportingDocs] = useState<Array<{ name: string; size: string; type: string }>>([]);

  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedProjectName, setSubmittedProjectName] = useState('');

  // Smart Autofill effect: Fill known profile data once opened
  useEffect(() => {
    if (!isOpen) return;

    if (effectiveProfile) {
      if (effectiveRole === 'STUDENT') {
        setInstitution(effectiveProfile.institution || 'Graphic Era Hill University');
        setDepartment(effectiveProfile.department || 'Dept of Computer Science & Engineering');
        setCourse(effectiveProfile.course || effectiveProfile.program || 'BCA / B.Tech');
        setAcademicYear(effectiveProfile.batch || '2025–2026');
        if (effectiveProfile.skills?.length) {
          setTechInput(effectiveProfile.skills.slice(0, 4).join(', '));
        }
      } else if (effectiveRole === 'ALUMNI') {
        setInstitution(effectiveProfile.institution || 'Graphic Era Hill University');
        setGraduationYear(effectiveProfile.graduationYear || '2024');
        setOrganization(effectiveProfile.currentOrganization || '');
      } else if (effectiveRole === 'DEVELOPER') {
        if (effectiveProfile.githubUsername || effectiveProfile.githubHandle) {
          setRepositoryUrl(`https://github.com/${effectiveProfile.githubUsername || effectiveProfile.githubHandle}`);
        }
        if (effectiveProfile.skills?.length) {
          setTechInput(effectiveProfile.skills.join(', '));
        }
      } else if (effectiveRole === 'RESEARCHER') {
        setInstitution(effectiveProfile.institution || 'DeepMind / GEHU Research Node');
        setResearcherOrcid(effectiveProfile.googleScholarUrl || '0000-0002-1825-0097');
      } else if (effectiveRole === 'INDUSTRY_PROFESSIONAL') {
        setOrganization(effectiveProfile.currentOrganization || 'HyperCloud Enterprise');
        setIndustryDomain('Enterprise Cloud Infrastructure');
      } else if (effectiveRole === 'FACULTY') {
        setInstitution(effectiveProfile.institution || 'Graphic Era Hill University');
        setDepartment(effectiveProfile.department || 'Dept of Computer Science');
        setMentor(effectiveProfile.fullName || 'Dr. Ananya Sharma');
      }
    }
  }, [isOpen, effectiveRole, effectiveProfile]);

  if (!isOpen) return null;

  // Strict Permission Check: Organizational authority roles cannot submit normal projects
  const isAuthorityRole = isOrganizationalAuthorityRole(effectiveRole);

  const handleAddScreenshot = () => {
    if (screenshotInput.trim()) {
      setScreenshotUrls([...screenshotUrls, screenshotInput.trim()]);
      setScreenshotInput('');
    }
  };

  const handleRemoveScreenshot = (idx: number) => {
    setScreenshotUrls(screenshotUrls.filter((_, i) => i !== idx));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newDocs = files.map((file: File) => ({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.type || 'Document'
      }));
      setSupportingDocs([...supportingDocs, ...newDocs]);
    }
  };

  const handleRemoveDoc = (idx: number) => {
    setSupportingDocs(supportingDocs.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmittedProjectName(title);
    setIsSuccess(true);

    const newProject = {
      id: `proj-${Date.now()}`,
      passportId: `PV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      tagline: tagline || description.slice(0, 100),
      description,
      problem: problemStatement,
      projectType,
      domain,
      techStack: techInput.split(',').map((s) => s.trim()).filter(Boolean),
      skillsRequired: skillsRequired.split(',').map((s) => s.trim()).filter(Boolean),
      teamRequirements: teamMembers,
      projectUrl: projectLink,
      repositoryUrl,
      demoUrl,
      documentationUrl,
      pptUrl,
      videoUrl,
      screenshots: screenshotUrls,
      supportingDocuments: supportingDocs,
      institution: institution || 'Graphic Era Hill University',
      department: department || 'Dept of Computer Science',
      course,
      academicYear,
      difficulty,
      openRoles: teamMembers ? [teamMembers] : ['Frontend Engineer', 'Systems Researcher'],
      status: 'Under Review',
      reviewStatus: 'SUBMITTED',
      coverGradient: 'from-amber-600 via-orange-600 to-rose-700',
      contributors: [
        {
          name: effectiveProfile?.fullName || 'Project Author',
          role: effectiveRole === 'STUDENT' ? 'Student Lead' :
                effectiveRole === 'RESEARCHER' ? 'Principal Investigator' :
                effectiveRole === 'DEVELOPER' ? 'Lead Architect' :
                effectiveRole === 'ALUMNI' ? 'Alumni Lead' :
                effectiveRole === 'INDUSTRY_PROFESSIONAL' ? 'Industry Sponsor' : 'Faculty Lead',
          institution: institution || 'ProjectVerse Network',
          batch: academicYear || '2026',
          avatar: effectiveProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          githubHandle: effectiveProfile?.githubHandle || effectiveProfile?.githubUsername || 'author'
        }
      ],
      lineageBatchesCount: 1,
      githubCommits: 28,
      githubStars: 14,
      lineage: [
        {
          year: academicYear.slice(0, 4) || '2026',
          batchName: `Foundational Cohort`,
          institution: institution || 'Graphic Era Hill University',
          leadContributors: [effectiveProfile?.fullName || 'Project Author'],
          keyMilestones: ['Initial Architecture & Repository Setup', 'Project Passport Sealed'],
          commits: 28,
          pullRequests: 6,
          activeStatus: 'Current' as const,
          summary: description.slice(0, 140)
        }
      ],
      passport: {
        passportId: `PV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        qrHash: `pv_hash_${Date.now()}`,
        projectName: title,
        tagline: tagline || description.slice(0, 80),
        institution: institution || 'Graphic Era Hill University',
        department: department || 'Computer Science',
        academicYear,
        originalBatch: academicYear,
        currentBatch: academicYear,
        status: 'Under Review' as const,
        license: 'MIT Open Academic',
        techStack: techInput.split(',').map((s) => s.trim()).filter(Boolean),
        githubRepo: repositoryUrl || 'https://github.com/projectverse/new-project',
        totalCommits: 28,
        activeContributors: 1,
        mergedPRs: 6,
        codeHealthScore: 98,
        testCoverage: 94,
        stars: 14,
        forks: 3,
        facultyReviewer: {
          name: mentor || 'Dr. Ananya Sharma',
          designation: 'Assistant Professor & Reviewer',
          department: department || 'Computer Science',
          institution: institution || 'Graphic Era Hill University',
          score: 9.6,
          reviewText: 'Initial verification submitted. Repository audit and code rubrics pending peer sign-off.',
          verifiedAt: 'Just Now',
          signatureHash: `SIG-${Date.now().toString(16).toUpperCase()}`
        },
        institutionalValidationCode: `IVC-${Math.floor(100000 + Math.random() * 900000)}`,
        rubricScores: {
          novelty: 9,
          technicalRigor: 9,
          documentation: 9,
          continuityPotential: 10
        }
      }
    };

    setTimeout(() => {
      onProjectCreated(newProject);
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-black/10 overflow-hidden my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/8 bg-[#FBFBFA]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-neutral-900 text-white">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-neutral-900">
                  {effectiveRole === 'RESEARCHER' ? 'Submit Research Project & Abstract' :
                   effectiveRole === 'FACULTY' ? 'Submit Faculty-Led Academic Project' :
                   effectiveRole === 'INDUSTRY_PROFESSIONAL' ? 'Submit Industry Project / Challenge' :
                   effectiveRole === 'ALUMNI' ? 'Submit / Handover Project' :
                   'Submit Capstone / Open Project'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-[10px] font-mono font-semibold">
                  {effectiveRole}
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                {effectiveRole === 'FACULTY'
                  ? 'Faculty-led academic research and innovation cohorts.'
                  : 'Registers technical evidence, generates a Project Passport, and connects to Project Lineage.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-200/70 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice for Authority Roles (HOD & Institution) */}
        {isAuthorityRole ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Building2 className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-base font-bold text-neutral-900">
                Institutional Authority Notice
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                As an <strong>{effectiveRole}</strong>, your account governs departmental and institutional project registries, verifies academic compliance, and audits capstone lineages. Normal individual project submission is reserved for student builders, developers, researchers, and industry partners.
              </p>
            </div>
            <div className="pt-3 flex justify-center gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 cursor-pointer"
              >
                Return to Institutional Workspace
              </button>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Smart Autofill Notification */}
            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between text-xs text-emerald-900 font-mono">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Smart Autofill: Academic & profile metadata pre-populated from your verified account.</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-700 uppercase">Verified</span>
            </div>

            {/* Section 1: Project Identity */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">
                1. Project Identity & Domain
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">
                    {effectiveRole === 'RESEARCHER' ? 'Research / Project Title' :
                     effectiveRole === 'INDUSTRY_PROFESSIONAL' ? 'Industry Project / Challenge Title' :
                     'Project Name'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={
                      effectiveRole === 'RESEARCHER' ? 'e.g. Neuromorphic Spike-Timing Distributed Consensus' :
                      effectiveRole === 'DEVELOPER' ? 'e.g. HyperFlow — Async Raft Engine for Rust' :
                      'e.g. Autonomous Drone Swarm'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-hidden focus:border-neutral-900 transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">
                    Short Tagline <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="One-line elevator pitch highlighting the core innovation"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-hidden focus:border-neutral-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">
                    Domain / Field <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value as ProjectDomain)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 bg-white focus:outline-hidden focus:border-neutral-900 transition-colors"
                  >
                    {DOMAINS_LIST.filter(d => d !== 'All').map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">
                    Primary Tech Stack (comma separated) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="e.g. Rust, ROS 2, PyTorch, React, Docker"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-hidden focus:border-neutral-900 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Problem Statement & Architecture */}
            <div className="space-y-4 pt-2 border-t border-neutral-100">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">
                {effectiveRole === 'RESEARCHER' ? '2. Research Problem & Methodology' :
                 effectiveRole === 'DEVELOPER' ? '2. Architecture & Technical Challenges' :
                 '2. Problem Statement & Description'}
              </h3>

              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  Problem Statement <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  placeholder="What specific bottleneck, academic gap, or industrial problem does this solve?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-hidden focus:border-neutral-900 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1">
                  {effectiveRole === 'RESEARCHER' ? 'Methodology & Abstract' :
                   effectiveRole === 'DEVELOPER' ? 'Architecture Overview' :
                   'Full Description'} <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your design decisions, system components, benchmarks, and real-world results..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-hidden focus:border-neutral-900 transition-colors"
                />
              </div>

              {/* Developer specific challenges */}
              {effectiveRole === 'DEVELOPER' && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">
                    Technical Challenges & Trade-offs
                  </label>
                  <textarea
                    rows={2}
                    value={technicalChallenges}
                    onChange={(e) => setTechnicalChallenges(e.target.value)}
                    placeholder="Memory safety, latency constraints, consensus race conditions..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-hidden focus:border-neutral-900"
                  />
                </div>
              )}

              {/* Researcher specific publications */}
              {effectiveRole === 'RESEARCHER' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-800 mb-1">
                      Publication / Paper Preprint URL
                    </label>
                    <input
                      type="url"
                      value={publicationLink}
                      onChange={(e) => setPublicationLink(e.target.value)}
                      placeholder="https://arxiv.org/abs/..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-800 mb-1">
                      ORCID / Research Profile
                    </label>
                    <input
                      type="text"
                      value={researcherOrcid}
                      onChange={(e) => setResearcherOrcid(e.target.value)}
                      placeholder="0000-0002-1825-0097"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Smart Autofilled Academic / Organization Context */}
            <div className="space-y-4 pt-2 border-t border-neutral-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">
                  3. Academic & Organizational Attribution
                </h3>
                <span className="text-[11px] text-neutral-400">Pre-filled from profile</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">
                    {effectiveRole === 'INDUSTRY_PROFESSIONAL' ? 'Company / Sponsor' : 'Institution'}
                  </label>
                  <input
                    type="text"
                    value={effectiveRole === 'INDUSTRY_PROFESSIONAL' ? organization : institution}
                    onChange={(e) => effectiveRole === 'INDUSTRY_PROFESSIONAL' ? setOrganization(e.target.value) : setInstitution(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 bg-neutral-50/70"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">
                    {effectiveRole === 'INDUSTRY_PROFESSIONAL' ? 'Industry Sector' : 'Department'}
                  </label>
                  <input
                    type="text"
                    value={effectiveRole === 'INDUSTRY_PROFESSIONAL' ? industryDomain : department}
                    onChange={(e) => effectiveRole === 'INDUSTRY_PROFESSIONAL' ? setIndustryDomain(e.target.value) : setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 bg-neutral-50/70"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">
                    {effectiveRole === 'ALUMNI' ? 'Graduation Year' :
                     effectiveRole === 'FACULTY' ? 'Academic Year' :
                     'Academic Year / Batch'}
                  </label>
                  <input
                    type="text"
                    value={effectiveRole === 'ALUMNI' ? graduationYear : academicYear}
                    onChange={(e) => effectiveRole === 'ALUMNI' ? setGraduationYear(e.target.value) : setAcademicYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 bg-neutral-50/70"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Repository, Artifacts & Proof */}
            <div className="space-y-4 pt-2 border-t border-neutral-100">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">
                4. Codebase, Demo & Technical Evidence
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">
                    GitHub / Code Repository URL
                  </label>
                  <input
                    type="url"
                    value={repositoryUrl}
                    onChange={(e) => setRepositoryUrl(e.target.value)}
                    placeholder="https://github.com/org/repo"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">
                    Live Demo / Deployment URL
                  </label>
                  <input
                    type="url"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    placeholder="https://project.example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">
                    Documentation / Presentation Link (PPT)
                  </label>
                  <input
                    type="url"
                    value={documentationUrl}
                    onChange={(e) => setDocumentationUrl(e.target.value)}
                    placeholder="https://docs.google.com/presentation/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">
                    Continuation / Lineage Status
                  </label>
                  <select
                    value={continuationStatus}
                    onChange={(e) => setContinuationStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs bg-white"
                  >
                    <option value="Seeking Next Batch">Seeking Next Batch (Generational Lineage)</option>
                    <option value="Active Development">Active Development</option>
                    <option value="Completed / Archived">Completed / Archived</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSuccess}
                className="px-6 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                {isSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Passport Generated!</span>
                  </>
                ) : (
                  <>
                    <span>Submit & Generate Passport</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default BuildProjectModal;
