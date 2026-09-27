import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  UploadCloud, 
  X,
  Building2,
  Lock,
  Mail,
  Phone,
  User,
  MapPin,
  Sparkles
} from 'lucide-react';
import { RoleSelector } from './RoleSelector';
import { PasswordField } from './PasswordField';
import { OtpVerificationStep } from './OtpVerificationStep';
import { SocialVerificationSection } from './SocialVerificationSection';
import { DocumentUploadDropzone } from '../verification/DocumentUploadDropzone';
import { useAuth } from '../../context/AuthContext';
import { 
  RegistrationRole, 
  UserRole, 
  RegisterData, 
  UploadedDocMetadata 
} from '../../types/auth';
import { DocumentType } from '../../types';
import { otpService } from '../../services/otpService';
import { validatePassword } from '../../utils/password';
import { isValidEmail, normalizeEmail } from '../../utils/validation';

interface RegisterFormProps {
  onSuccess: (role: UserRole) => void;
  onSwitchToSignIn: () => void;
}

type RegistrationStep = 'ROLE' | 'BASIC_DETAILS' | 'ROLE_DETAILS' | 'DOCUMENTS' | 'OTP' | 'COMPLETED';

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onSwitchToSignIn
}) => {
  const { register } = useAuth();

  // Progress state
  const [step, setStep] = useState<RegistrationStep>('ROLE');
  const [selectedRole, setSelectedRole] = useState<RegistrationRole>('STUDENT');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [demoHint, setDemoHint] = useState<string | null>(null);

  // Common Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');

  // Role-Specific Fields
  // Student
  const [studentCollege, setStudentCollege] = useState('');
  const [studentCourse, setStudentCourse] = useState('');
  const [studentBranch, setStudentBranch] = useState('');
  const [studentYearSem, setStudentYearSem] = useState('');
  const [studentId, setStudentId] = useState('');
  const [studentPersonalEmail, setStudentPersonalEmail] = useState('');
  const [studentType, setStudentType] = useState<'CURRENT_STUDENT' | 'ALUMNI'>('CURRENT_STUDENT');

  // Faculty & Mentor
  const [facultyInstitution, setFacultyInstitution] = useState('');
  const [facultyDepartment, setFacultyDepartment] = useState('');
  const [facultyDesignation, setFacultyDesignation] = useState('');
  const [facultyId, setFacultyId] = useState('');

  // Researcher
  const [researcherInstitution, setResearcherInstitution] = useState('');
  const [researchDomain, setResearchDomain] = useState('');
  const [researcherDesignation, setResearcherDesignation] = useState('');
  const [researcherOrcid, setResearcherOrcid] = useState('');
  const [googleScholarUrl, setGoogleScholarUrl] = useState('');

  // Alumni
  const [alumniPrevCollege, setAlumniPrevCollege] = useState('');
  const [alumniDegreeCourse, setAlumniDegreeCourse] = useState('');
  const [alumniGradYear, setAlumniGradYear] = useState('');
  const [alumniId, setAlumniId] = useState('');
  const [alumniCurrentCompany, setAlumniCurrentCompany] = useState('');
  const [alumniCurrentRole, setAlumniCurrentRole] = useState('');

  // Developer
  const [devSpecialization, setDevSpecialization] = useState('Full-Stack Engineer');
  const [devSkills, setDevSkills] = useState('TypeScript, React, Node.js, Distributed Systems');
  const [devExpLevel, setDevExpLevel] = useState('Mid-Level (2-4 yrs)');

  // HOD
  const [hodInstitution, setHodInstitution] = useState('');
  const [hodDepartment, setHodDepartment] = useState('');
  const [hodDesignation, setHodDesignation] = useState('Professor & Head of Department');
  const [hodEmployeeId, setHodEmployeeId] = useState('');

  // Institution Account
  const [instName, setInstName] = useState('');
  const [instType, setInstType] = useState('Autonomous University');
  const [instWebsite, setInstWebsite] = useState('');
  const [instAddress, setInstAddress] = useState('');
  const [instRepName, setInstRepName] = useState('');
  const [instRepDesignation, setInstRepDesignation] = useState('Registrar / Director');
  const [instContactNumber, setInstContactNumber] = useState('');

  // Industry Professional
  const [indCompany, setIndCompany] = useState('');
  const [indJobTitle, setIndJobTitle] = useState('');
  const [indIndustry, setIndIndustry] = useState('Software Engineering');
  const [indExperience, setIndExperience] = useState('5+ Years');

  // Social & Proof Links
  const [githubUrl, setGithubUrl] = useState('');
  const [isGithubVerified, setIsGithubVerified] = useState(false);
  const [githubData, setGithubData] = useState<any>(null);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  // Uploaded Documents
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocMetadata[]>([]);

  // -------------------------------------------------------------
  // Validation Helpers
  // -------------------------------------------------------------
  const handleProceedFromRole = () => {
    setError(null);
    setStep('BASIC_DETAILS');
  };

  const handleProceedFromBasicDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || fullName.trim().length < 2) {
      setError('Please provide your full name (at least 2 characters).');
      return;
    }

    const cleanEmail = normalizeEmail(email);
    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!mobile.trim() || mobile.trim().length < 7) {
      setError('Please provide a valid mobile / contact number.');
      return;
    }

    const passCheck = validatePassword(password);
    if (!passCheck.isValid) {
      setError(passCheck.error || 'Password does not meet security requirements.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    setStep('ROLE_DETAILS');
  };

  const handleProceedFromRoleDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate role-specific requirements
    if (selectedRole === 'STUDENT') {
      if (!studentCollege.trim()) { setError('College / University name is required.'); return; }
      if (!studentCourse.trim()) { setError('Course (e.g., B.Tech, BCA, MCA) is required.'); return; }
      if (!studentBranch.trim()) { setError('Branch / Department is required.'); return; }
      if (!studentYearSem.trim()) { setError('Current Year / Semester is required.'); return; }
      if (!studentId.trim()) { setError('Student ID / Enrollment Number is required.'); return; }
    } else if (selectedRole === 'FACULTY') {
      if (!facultyInstitution.trim()) { setError('Institution / College name is required.'); return; }
      if (!facultyDepartment.trim()) { setError('Department is required.'); return; }
      if (!facultyDesignation.trim()) { setError('Faculty Designation is required.'); return; }
      if (!facultyId.trim()) { setError('Faculty / Employee ID is required.'); return; }
    } else if (selectedRole === 'RESEARCHER') {
      if (!researcherInstitution.trim()) { setError('Institution or Research Organization is required.'); return; }
      if (!researchDomain.trim()) { setError('Research Domain / Specialization is required.'); return; }
      if (!researcherDesignation.trim()) { setError('Designation / Research Title is required.'); return; }
    } else if (selectedRole === 'ALUMNI') {
      if (!alumniPrevCollege.trim()) { setError('Previous College / University is required.'); return; }
      if (!alumniDegreeCourse.trim()) { setError('Degree / Course completed is required.'); return; }
      if (!alumniGradYear.trim()) { setError('Graduation Year is required.'); return; }
    } else if (selectedRole === 'DEVELOPER') {
      if (!devSpecialization.trim()) { setError('Specialization or Current Role is required.'); return; }
      if (!devSkills.trim()) { setError('Skills are required.'); return; }
      if (!githubUrl.trim()) { setError('GitHub Profile is required for Developer verification.'); return; }
    } else if (selectedRole === 'HOD') {
      if (!hodInstitution.trim()) { setError('Institution name is required.'); return; }
      if (!hodDepartment.trim()) { setError('Department is required.'); return; }
      if (!hodEmployeeId.trim()) { setError('Employee / Faculty ID is required.'); return; }
    } else if (selectedRole === 'INSTITUTION') {
      if (!instName.trim()) { setError('Institution name is required.'); return; }
      if (!instWebsite.trim()) { setError('Official Website URL is required.'); return; }
      if (!instAddress.trim()) { setError('Physical Campus Address is required.'); return; }
      if (!instRepName.trim()) { setError('Authorized Representative Name is required.'); return; }
      if (!instRepDesignation.trim()) { setError('Representative Designation is required.'); return; }
    } else if (selectedRole === 'INDUSTRY_PROFESSIONAL') {
      if (!indCompany.trim()) { setError('Company / Organization name is required.'); return; }
      if (!indJobTitle.trim()) { setError('Job Title is required.'); return; }
      if (!linkedinUrl.trim()) { setError('LinkedIn Profile is required for Industry Professional verification.'); return; }
    }

    setStep('DOCUMENTS');
  };

  const handleProceedFromDocuments = async () => {
    setError(null);

    // Document validation per role
    const requiresDocs = ['STUDENT', 'FACULTY', 'HOD', 'INSTITUTION', 'RESEARCHER'].includes(selectedRole);
    if (requiresDocs && uploadedDocs.length === 0) {
      setError('Please upload at least one valid identity or institution verification document to proceed.');
      return;
    }

    // Dispatch real OTP to the email
    try {
      setIsLoading(true);
      const cleanEmail = normalizeEmail(email);
      const otpRes = await otpService.sendOtp(cleanEmail, 'REGISTRATION');
      if (otpRes.success) {
        setDemoHint(otpRes.demoHint || null);
        setStep('OTP');
      } else {
        setError(otpRes.message || 'Failed to dispatch verification code. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerified = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const registerPayload: RegisterData = {
        name: fullName.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        password,
        role: selectedRole,
        location: location.trim(),
        bio: bio.trim(),
        documents: uploadedDocs,
        studentProfile: selectedRole === 'STUDENT' ? {
          institution: studentCollege.trim(),
          course: studentCourse.trim(),
          branch: studentBranch.trim(),
          currentYearSemester: studentYearSem.trim(),
          rollNumber: studentId.trim(),
          studentEmail: email.trim(),
          personalEmail: studentPersonalEmail.trim(),
          accountType: studentType,
          skills: ['React', 'TypeScript', 'Node.js', 'DSA'],
          bio: bio.trim(),
          github: githubUrl.trim(),
          linkedin: linkedinUrl.trim()
        } : undefined,
        facultyProfile: selectedRole === 'FACULTY' ? {
          institution: facultyInstitution.trim(),
          department: facultyDepartment.trim(),
          designation: facultyDesignation.trim(),
          employeeId: facultyId.trim(),
          bio: bio.trim(),
          skills: ['Academic Mentorship', 'Curriculum', 'Distributed Systems'],
          github: githubUrl.trim(),
          linkedin: linkedinUrl.trim()
        } : undefined,
        researcherProfile: selectedRole === 'RESEARCHER' ? {
          institution: researcherInstitution.trim(),
          researchDomain: researchDomain.trim(),
          designation: researcherDesignation.trim(),
          researcherIdOrcid: researcherOrcid.trim(),
          googleScholarUrl: googleScholarUrl.trim(),
          skills: ['Machine Learning', 'Research Systems', 'Peer Review'],
          bio: bio.trim(),
          github: githubUrl.trim(),
          linkedin: linkedinUrl.trim()
        } : undefined,
        alumniProfile: selectedRole === 'ALUMNI' ? {
          previousInstitution: alumniPrevCollege.trim(),
          degreeCourse: alumniDegreeCourse.trim(),
          graduationYear: alumniGradYear.trim(),
          alumniId: alumniId.trim(),
          currentOrganization: alumniCurrentCompany.trim(),
          currentJobRole: alumniCurrentRole.trim(),
          skills: ['Industry Architecture', 'Mentorship'],
          bio: bio.trim(),
          github: githubUrl.trim(),
          linkedin: linkedinUrl.trim()
        } : undefined,
        developerProfile: selectedRole === 'DEVELOPER' ? {
          specialization: devSpecialization.trim(),
          skills: devSkills.split(',').map(s => s.trim()).filter(Boolean),
          experienceLevel: devExpLevel,
          bio: bio.trim(),
          github: githubUrl.trim(),
          githubVerified: isGithubVerified,
          githubProfileData: githubData,
          linkedin: linkedinUrl.trim(),
          portfolio: portfolioUrl.trim()
        } : undefined,
        hodProfile: selectedRole === 'HOD' ? {
          institution: hodInstitution.trim(),
          department: hodDepartment.trim(),
          designation: hodDesignation.trim(),
          employeeId: hodEmployeeId.trim(),
          bio: bio.trim(),
          linkedin: linkedinUrl.trim()
        } : undefined,
        institutionProfile: selectedRole === 'INSTITUTION' ? {
          institutionName: instName.trim(),
          institutionType: instType.trim(),
          website: instWebsite.trim(),
          address: instAddress.trim(),
          representativeName: instRepName.trim(),
          representativeDesignation: instRepDesignation.trim(),
          contactNumber: instContactNumber.trim() || mobile.trim(),
          officialEmail: email.trim(),
          linkedin: linkedinUrl.trim(),
          bio: bio.trim()
        } : undefined,
        industryProfile: selectedRole === 'INDUSTRY_PROFESSIONAL' ? {
          company: indCompany.trim(),
          jobTitle: indJobTitle.trim(),
          industry: indIndustry.trim(),
          experienceYears: indExperience.trim(),
          skills: ['Enterprise Systems', 'Cloud Architecture'],
          bio: bio.trim(),
          linkedin: linkedinUrl.trim(),
          github: githubUrl.trim(),
          portfolio: portfolioUrl.trim()
        } : undefined
      };

      const result = await register(registerPayload);

      if (result.success && result.role) {
        setStep('COMPLETED');
        setTimeout(() => {
          onSuccess(result.role!);
        }, 1200);
      } else {
        setError(result.error || 'Failed to complete registration.');
        setStep('ROLE_DETAILS');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during account creation.');
      setStep('ROLE_DETAILS');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentSelected = (docData: {
    documentType: DocumentType;
    fileName: string;
    fileSize: string;
    rawFile?: File;
  }) => {
    const newDoc: UploadedDocMetadata = {
      id: `doc-${Date.now()}`,
      fileName: docData.fileName,
      fileSize: docData.fileSize,
      documentType: docData.documentType,
      uploadedAt: new Date().toISOString(),
      verificationStatus: 'UNDER_REVIEW'
    };
    setUploadedDocs(prev => [...prev, newDoc]);
    setError(null);
  };

  const handleRemoveDoc = (id: string) => {
    setUploadedDocs(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Stepper */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-[11px] font-mono-code uppercase font-semibold text-[#737373] mb-2">
          <span>Registration Gateway</span>
          <span>
            {step === 'ROLE' && 'Step 1 of 4: Role'}
            {step === 'BASIC_DETAILS' && 'Step 2 of 4: Basic Info'}
            {step === 'ROLE_DETAILS' && 'Step 3 of 4: Role Verification'}
            {step === 'DOCUMENTS' && 'Step 4 of 4: Document Verification'}
            {step === 'OTP' && 'Two-Factor OTP Security'}
            {step === 'COMPLETED' && 'Verification Complete'}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 h-1.5 bg-[#EBEBE8] rounded-full overflow-hidden">
          <div className={`h-full transition-all ${['ROLE', 'BASIC_DETAILS', 'ROLE_DETAILS', 'DOCUMENTS', 'OTP', 'COMPLETED'].includes(step) ? 'bg-[#111111]' : 'bg-transparent'}`} />
          <div className={`h-full transition-all ${['BASIC_DETAILS', 'ROLE_DETAILS', 'DOCUMENTS', 'OTP', 'COMPLETED'].includes(step) ? 'bg-[#111111]' : 'bg-transparent'}`} />
          <div className={`h-full transition-all ${['ROLE_DETAILS', 'DOCUMENTS', 'OTP', 'COMPLETED'].includes(step) ? 'bg-[#111111]' : 'bg-transparent'}`} />
          <div className={`h-full transition-all ${['DOCUMENTS', 'OTP', 'COMPLETED'].includes(step) ? 'bg-[#111111]' : 'bg-transparent'}`} />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          role="alert"
          className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-800 text-xs flex items-start gap-2.5"
        >
          <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
          <div className="flex-1 leading-relaxed">
            <span className="font-semibold">Registration notice:</span> {error}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 1: ROLE SELECTION                                        */}
      {/* ------------------------------------------------------------- */}
      {step === 'ROLE' && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-[#111111]">
              Select Your Role
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] mt-1.5 max-w-lg mx-auto">
              Every role in ProjectVerse is backed by tailored verification workflows, governance permissions, and workspaces.
            </p>
          </div>

          <RoleSelector
            selectedRole={selectedRole}
            onSelectRole={(r) => {
              setSelectedRole(r);
              setError(null);
            }}
          />

          <div className="flex items-center justify-between pt-4 border-t border-[#EBEBE8]">
            <button
              type="button"
              onClick={onSwitchToSignIn}
              className="text-xs font-semibold text-[#666666] hover:text-[#111111] cursor-pointer"
            >
              Already have an account? Sign in
            </button>
            <button
              type="button"
              id="role-continue-btn"
              onClick={handleProceedFromRole}
              className="px-6 py-2.5 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all hover:-translate-y-0.5"
            >
              <span>Continue with {selectedRole.replace('_', ' ')}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 2: BASIC DETAILS                                         */}
      {/* ------------------------------------------------------------- */}
      {step === 'BASIC_DETAILS' && (
        <form onSubmit={handleProceedFromBasicDetails} className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => { setStep('ROLE'); setError(null); }}
              className="inline-flex items-center gap-1.5 text-xs font-mono-code text-[#666666] hover:text-[#111111] cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Change Role</span>
            </button>
            <span className="text-xs font-mono-code px-2.5 py-0.5 rounded-full bg-black/5 text-[#111111] font-semibold border border-black/8">
              Registering as {selectedRole.replace('_', ' ')}
            </span>
          </div>

          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold font-display tracking-tight text-[#111111]">
              Basic Information
            </h2>
            <p className="text-xs text-[#666666] mt-1">
              Provide your primary contact and security credentials
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] hover:border-[#a3a3a3] focus:border-[#111111] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    selectedRole === 'STUDENT' ? 'student@university.ac.in' :
                    selectedRole === 'FACULTY' || selectedRole === 'HOD' ? 'faculty@institution.ac.in' :
                    selectedRole === 'INSTITUTION' ? 'office@university.ac.in' :
                    selectedRole === 'DEVELOPER' ? 'developer@gmail.com' : 'you@company.com'
                  }
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] hover:border-[#a3a3a3] focus:border-[#111111] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91 98765 43210"
                required
                className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] hover:border-[#a3a3a3] focus:border-[#111111] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                Location <span className="text-[#888888] font-normal">(City, Country)</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Dehradun, India"
                className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] hover:border-[#a3a3a3] focus:border-[#111111] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PasswordField
              id="reg-password"
              name="password"
              label="Password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              required
            />
            <PasswordField
              id="reg-confirm-password"
              name="confirmPassword"
              label="Confirm Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#222222] mb-1.5">
              Short Bio <span className="text-[#888888] font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief summary of your background, research interests, or technical stack..."
              className="w-full px-3.5 py-2 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] hover:border-[#a3a3a3] focus:border-[#111111] outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#EBEBE8]">
            <button
              type="button"
              onClick={() => setStep('ROLE')}
              className="text-xs font-semibold text-[#666666] hover:text-[#111111] cursor-pointer"
            >
              Back to Role
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>Continue to Role Fields</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </form>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 3: DYNAMIC ROLE-SPECIFIC VERIFICATION FIELDS             */}
      {/* ------------------------------------------------------------- */}
      {step === 'ROLE_DETAILS' && (
        <form onSubmit={handleProceedFromRoleDetails} className="space-y-5">
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => { setStep('BASIC_DETAILS'); setError(null); }}
              className="inline-flex items-center gap-1.5 text-xs font-mono-code text-[#666666] hover:text-[#111111] cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to Basic Info</span>
            </button>
            <span className="text-xs font-mono-code px-2.5 py-0.5 rounded-full bg-black/5 text-[#111111] font-semibold border border-black/8">
              {selectedRole} Verification
            </span>
          </div>

          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold font-display tracking-tight text-[#111111]">
              {selectedRole.replace('_', ' ')} Details
            </h2>
            <p className="text-xs text-[#666666] mt-1">
              Provide your role verification credentials and professional profiles
            </p>
          </div>

          {/* Student Fields */}
          {selectedRole === 'STUDENT' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    College / University <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={studentCollege}
                    onChange={(e) => setStudentCollege(e.target.value)}
                    placeholder="e.g. Graphic Era Hill University"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Course / Degree <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={studentCourse}
                    onChange={(e) => setStudentCourse(e.target.value)}
                    placeholder="e.g. B.Tech Computer Science & Engineering"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Branch / Dept <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={studentBranch}
                    onChange={(e) => setStudentBranch(e.target.value)}
                    placeholder="e.g. CSE / IT"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Current Year / Sem <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={studentYearSem}
                    onChange={(e) => setStudentYearSem(e.target.value)}
                    placeholder="e.g. 3rd Year / 6th Sem"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Student / Roll No <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. GEHU/2023/CS/104"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                  Personal Email <span className="text-[#888888] font-normal">(Optional Backup)</span>
                </label>
                <input
                  type="email"
                  value={studentPersonalEmail}
                  onChange={(e) => setStudentPersonalEmail(e.target.value)}
                  placeholder="personal@gmail.com"
                  className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                />
              </div>
            </div>
          )}

          {/* Faculty Fields */}
          {selectedRole === 'FACULTY' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Institution / College <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={facultyInstitution}
                    onChange={(e) => setFacultyInstitution(e.target.value)}
                    placeholder="e.g. Graphic Era Hill University"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={facultyDepartment}
                    onChange={(e) => setFacultyDepartment(e.target.value)}
                    placeholder="e.g. Computer Science & Engineering"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Designation <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={facultyDesignation}
                    onChange={(e) => setFacultyDesignation(e.target.value)}
                    placeholder="e.g. Associate Professor / Mentor"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Faculty / Employee ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={facultyId}
                    onChange={(e) => setFacultyId(e.target.value)}
                    placeholder="e.g. EMP-GEHU-FAC-409"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Researcher Fields */}
          {selectedRole === 'RESEARCHER' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Institution / Research Lab <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={researcherInstitution}
                    onChange={(e) => setResearcherInstitution(e.target.value)}
                    placeholder="e.g. DeepMind / GEHU Research Node"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Research Domain <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={researchDomain}
                    onChange={(e) => setResearchDomain(e.target.value)}
                    placeholder="e.g. Machine Learning, Edge AI, Distributed Systems"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Designation <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={researcherDesignation}
                    onChange={(e) => setResearcherDesignation(e.target.value)}
                    placeholder="e.g. Postdoctoral Fellow"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    ORCID / Researcher ID <span className="text-[#888888] font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={researcherOrcid}
                    onChange={(e) => setResearcherOrcid(e.target.value)}
                    placeholder="0000-0002-1825-0097"
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Google Scholar URL <span className="text-[#888888] font-normal">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    value={googleScholarUrl}
                    onChange={(e) => setGoogleScholarUrl(e.target.value)}
                    placeholder="https://scholar.google.com/citations..."
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Alumni Fields */}
          {selectedRole === 'ALUMNI' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Previous College / University <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={alumniPrevCollege}
                    onChange={(e) => setAlumniPrevCollege(e.target.value)}
                    placeholder="e.g. Graphic Era Hill University"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Degree / Course Completed <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={alumniDegreeCourse}
                    onChange={(e) => setAlumniDegreeCourse(e.target.value)}
                    placeholder="e.g. B.Tech Computer Science"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Graduation Year <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={alumniGradYear}
                    onChange={(e) => setAlumniGradYear(e.target.value)}
                    placeholder="e.g. 2024"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Current Company
                  </label>
                  <input
                    type="text"
                    value={alumniCurrentCompany}
                    onChange={(e) => setAlumniCurrentCompany(e.target.value)}
                    placeholder="e.g. Google / Microsoft"
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Job Role
                  </label>
                  <input
                    type="text"
                    value={alumniCurrentRole}
                    onChange={(e) => setAlumniCurrentRole(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Developer Fields */}
          {selectedRole === 'DEVELOPER' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Specialization / Primary Role <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={devSpecialization}
                    onChange={(e) => setDevSpecialization(e.target.value)}
                    placeholder="e.g. Backend Architect, Full-Stack Engineer"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Experience Level <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={devExpLevel}
                    onChange={(e) => setDevExpLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  >
                    <option value="Junior (0-2 yrs)">Junior (0-2 yrs)</option>
                    <option value="Mid-Level (2-5 yrs)">Mid-Level (2-5 yrs)</option>
                    <option value="Senior (5+ yrs)">Senior (5+ yrs)</option>
                    <option value="Staff / Principal Architect">Staff / Principal Architect</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                  Core Skills & Technologies <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={devSkills}
                  onChange={(e) => setDevSkills(e.target.value)}
                  placeholder="React, TypeScript, Go, Rust, Distributed Systems"
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                />
              </div>
            </div>
          )}

          {/* HOD Fields */}
          {selectedRole === 'HOD' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Institution / University <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={hodInstitution}
                    onChange={(e) => setHodInstitution(e.target.value)}
                    placeholder="e.g. Graphic Era Hill University"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={hodDepartment}
                    onChange={(e) => setHodDepartment(e.target.value)}
                    placeholder="e.g. Dept of Computer Science & Engineering"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Designation <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={hodDesignation}
                    onChange={(e) => setHodDesignation(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Employee / Faculty ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={hodEmployeeId}
                    onChange={(e) => setHodEmployeeId(e.target.value)}
                    placeholder="e.g. HOD-CSE-001"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Institution Fields */}
          {selectedRole === 'INSTITUTION' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Institution / University Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={instName}
                    onChange={(e) => setInstName(e.target.value)}
                    placeholder="e.g. Graphic Era Hill University"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Institution Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={instType}
                    onChange={(e) => setInstType(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  >
                    <option value="State University">State University</option>
                    <option value="Central University">Central University</option>
                    <option value="Deemed University">Deemed University</option>
                    <option value="Autonomous University">Autonomous University</option>
                    <option value="Private Engineering Institute">Private Engineering Institute</option>
                    <option value="Research Institute">Research Institute</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Official Website <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={instWebsite}
                    onChange={(e) => setInstWebsite(e.target.value)}
                    placeholder="https://gehu.ac.in"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Campus Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={instAddress}
                    onChange={(e) => setInstAddress(e.target.value)}
                    placeholder="Bell Road, Clement Town, Dehradun"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Authorized Representative <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={instRepName}
                    onChange={(e) => setInstRepName(e.target.value)}
                    placeholder="Full name of registrar / officer"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Representative Designation <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={instRepDesignation}
                    onChange={(e) => setInstRepDesignation(e.target.value)}
                    placeholder="e.g. Dean of Academics"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Industry Professional Fields */}
          {selectedRole === 'INDUSTRY_PROFESSIONAL' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Company / Organization <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={indCompany}
                    onChange={(e) => setIndCompany(e.target.value)}
                    placeholder="e.g. Google, NVIDIA, Stripe"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Job Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={indJobTitle}
                    onChange={(e) => setIndJobTitle(e.target.value)}
                    placeholder="e.g. Principal Cloud Architect"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Industry Domain <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={indIndustry}
                    onChange={(e) => setIndIndustry(e.target.value)}
                    placeholder="e.g. Autonomous Vehicles, FinTech"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Total Experience <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={indExperience}
                    onChange={(e) => setIndExperience(e.target.value)}
                    placeholder="e.g. 7 Years"
                    required
                    className="w-full px-3.5 py-2.5 text-xs bg-white text-[#111111] rounded-xl border border-[#d4d4d4] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Social Proof & Profiles */}
          <SocialVerificationSection
            role={selectedRole}
            githubUrl={githubUrl}
            linkedinUrl={linkedinUrl}
            portfolioUrl={portfolioUrl}
            isGithubRequired={selectedRole === 'DEVELOPER' || selectedRole === 'STUDENT'}
            onGithubChange={(url, verified, data) => {
              setGithubUrl(url);
              setIsGithubVerified(verified);
              setGithubData(data);
            }}
            onLinkedinChange={setLinkedinUrl}
            onPortfolioChange={setPortfolioUrl}
          />

          <div className="flex items-center justify-between pt-4 border-t border-[#EBEBE8]">
            <button
              type="button"
              onClick={() => setStep('BASIC_DETAILS')}
              className="text-xs font-semibold text-[#666666] hover:text-[#111111] cursor-pointer"
            >
              Back to Basic Info
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>Continue to Documents</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </form>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 4: DOCUMENT UPLOAD & VERIFICATION                        */}
      {/* ------------------------------------------------------------- */}
      {step === 'DOCUMENTS' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => { setStep('ROLE_DETAILS'); setError(null); }}
              className="inline-flex items-center gap-1.5 text-xs font-mono-code text-[#666666] hover:text-[#111111] cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to Role Details</span>
            </button>
            <span className="text-xs font-mono-code px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
              Document Verification
            </span>
          </div>

          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold font-display tracking-tight text-[#111111]">
              Document Verification
            </h2>
            <p className="text-xs text-[#666666] mt-1">
              Upload your official academic, employment, or organization credentials (PDF, JPG, PNG)
            </p>
          </div>

          <DocumentUploadDropzone
            role={selectedRole as any}
            studentType={studentType}
            onFileSelected={handleDocumentSelected}
          />

          {/* Uploaded Documents List */}
          {uploadedDocs.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-mono-code uppercase font-semibold text-[#737373] block">
                Queued Verification Documents ({uploadedDocs.length})
              </span>
              <div className="space-y-2">
                {uploadedDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-xl bg-white border border-black/10 flex items-center justify-between text-xs font-mono-code"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText size={16} className="text-[#111111] shrink-0" />
                      <div className="min-w-0">
                        <p className="font-bold text-[#111111] truncate">{doc.fileName}</p>
                        <p className="text-[10px] text-[#737373]">
                          {doc.documentType} • {doc.fileSize} • Status: <strong className="text-amber-700">Under Review</strong>
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDoc(doc.id)}
                      className="text-[#737373] hover:text-rose-600 p-1 rounded-lg cursor-pointer"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-[#FBFBFA] border border-black/8 text-[11px] text-[#666666] leading-relaxed">
            <ShieldCheck size={14} className="inline mr-1 text-emerald-700" />
            <strong>Institutional Trust Guard:</strong> Documents are stored in an encrypted vault accessible strictly by designated institutional reviewers. File formats are verified against digital signatures.
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#EBEBE8]">
            <button
              type="button"
              onClick={() => setStep('ROLE_DETAILS')}
              className="text-xs font-semibold text-[#666666] hover:text-[#111111] cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={handleProceedFromDocuments}
              className="px-6 py-2.5 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Dispatch Email OTP</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 5: REAL OTP VERIFICATION                                 */}
      {/* ------------------------------------------------------------- */}
      {step === 'OTP' && (
        <div className="space-y-4">
          <OtpVerificationStep
            email={email}
            purpose="REGISTRATION"
            initialDemoHint={demoHint || undefined}
            onVerified={handleOtpVerified}
            onBack={() => setStep('DOCUMENTS')}
          />
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 6: REGISTRATION COMPLETED                                */}
      {/* ------------------------------------------------------------- */}
      {step === 'COMPLETED' && (
        <div className="text-center py-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-bold font-display tracking-tight text-[#111111]">
            Registration Successful!
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] max-w-md mx-auto">
            Your {selectedRole} account and verification documents have been authenticated. Redirecting to your dashboard...
          </p>
          <div className="w-6 h-6 border-2 border-black/20 border-t-[#111111] rounded-full animate-spin mx-auto mt-4" />
        </div>
      )}
    </div>
  );
};
