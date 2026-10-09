import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  Landmark,
  Award,
  Eye,
  EyeOff,
  ArrowLeft,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { EraAccountType, EraUserProfile } from '../../types/projectEra';
import { DEMO_USERS, DEPARTMENTS_LIST } from '../../data/projectEraData';

interface ProjectEraAuthPageProps {
  mode: 'login' | 'register';
  initialRole?: EraAccountType;
  onSwitchMode: (mode: 'login' | 'register') => void;
  onBackToHome: () => void;
  onAuthenticated: (user: EraUserProfile) => void;
}

const ACCOUNT_TYPE_OPTIONS: Array<{
  type: EraAccountType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    type: 'STUDENT',
    label: 'Student',
    description: 'Create projects, track milestones, collaborate, and submit documentation.',
    icon: GraduationCap
  },
  {
    type: 'FACULTY',
    label: 'Faculty',
    description: 'Guide assigned teams, review submissions, and provide structured feedback.',
    icon: BookOpen
  },
  {
    type: 'HOD',
    label: 'HOD',
    description: 'Monitor department projects, pending reviews, and milestone schedules.',
    icon: Landmark
  },
  {
    type: 'ALUMNI',
    label: 'Alumni',
    description: 'Mentor student teams, share industry experience, and support projects.',
    icon: Award
  }
];

export const ProjectEraAuthPage: React.FC<ProjectEraAuthPageProps> = ({
  mode,
  initialRole = 'STUDENT',
  onSwitchMode,
  onBackToHome,
  onAuthenticated
}) => {
  const [selectedRole, setSelectedRole] = useState<EraAccountType>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Common Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [institution, setInstitution] = useState('National Institute of Engineering & Technology');
  const [department, setDepartment] = useState(DEPARTMENTS_LIST[0]);

  // Student-Specific
  const [course, setCourse] = useState('B.Tech Computer Science');
  const [batch, setBatch] = useState('2023–2027');
  const [rollNumber, setRollNumber] = useState('');

  // Faculty & HOD-Specific
  const [designation, setDesignation] = useState('');
  const [areasOfExpertise, setAreasOfExpertise] = useState('');

  // Alumni-Specific
  const [graduationYear, setGraduationYear] = useState('2022');
  const [currentOrganization, setCurrentOrganization] = useState('');
  const [currentJobRole, setCurrentJobRole] = useState('');
  const [skills, setSkills] = useState('');
  const [linkedInOrPortfolio, setLinkedInOrPortfolio] = useState('');

  useEffect(() => {
    if (initialRole) {
      setSelectedRole(initialRole);
    }
  }, [initialRole]);

  // Pre-fill demo login email when switching roles in Login mode for convenience
  useEffect(() => {
    setErrorMessage(null);
    if (mode === 'login') {
      const demo = DEMO_USERS[selectedRole];
      setEmail(demo.email);
      setPassword('demo-session-pass');
    }
  }, [mode, selectedRole]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid college or institutional email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Please enter your password (minimum 6 characters).');
      return;
    }

    // Create safe frontend-only session profile (NEVER storing plain-text password)
    const presetDemo = DEMO_USERS[selectedRole];
    const authenticatedProfile: EraUserProfile = {
      ...presetDemo,
      email: email.trim().toLowerCase(),
      accountType: selectedRole
    };

    onAuthenticated(authenticatedProfile);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Full Name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Password and Confirm Password do not match.');
      return;
    }
    if (!institution.trim() || !department.trim()) {
      setErrorMessage('Institution/College and Department are required.');
      return;
    }

    if (selectedRole === 'STUDENT') {
      if (!course.trim() || !batch.trim() || !rollNumber.trim()) {
        setErrorMessage('Course, Academic Year/Batch, and Roll/Enrollment Number are required for Student accounts.');
        return;
      }
    } else if (selectedRole === 'FACULTY') {
      if (!designation.trim() || !areasOfExpertise.trim()) {
        setErrorMessage('Designation and Areas of Expertise are required for Faculty accounts.');
        return;
      }
    } else if (selectedRole === 'HOD') {
      if (!designation.trim()) {
        setErrorMessage('Designation is required for HOD accounts.');
        return;
      }
    } else if (selectedRole === 'ALUMNI') {
      if (!graduationYear.trim() || !course.trim()) {
        setErrorMessage('Graduation Year and Course are required for Alumni accounts.');
        return;
      }
    }

    // Construct clean user profile without storing password in browser storage
    const newProfile: EraUserProfile = {
      id: `era-${selectedRole.toLowerCase()}-${Date.now()}`,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      accountType: selectedRole,
      institution: institution.trim(),
      department: department.trim(),
      ...(selectedRole === 'STUDENT' && {
        course: course.trim(),
        batch: batch.trim(),
        rollNumber: rollNumber.trim()
      }),
      ...(selectedRole === 'FACULTY' && {
        designation: designation.trim(),
        areasOfExpertise: areasOfExpertise
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      }),
      ...(selectedRole === 'HOD' && {
        designation: designation.trim()
      }),
      ...(selectedRole === 'ALUMNI' && {
        graduationYear: graduationYear.trim(),
        course: course.trim(),
        currentOrganization: currentOrganization.trim() || undefined,
        currentJobRole: currentJobRole.trim() || undefined,
        skills: skills
          ? skills
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined,
        linkedInOrPortfolio: linkedInOrPortfolio.trim() || undefined
      })
    };

    onAuthenticated(newProfile);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-[#faf9f6] py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Top Back Button */}
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-600 hover:text-neutral-900 mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Project Era Home</span>
        </button>

        {/* Main Card */}
        <div className="rounded-2xl sm:rounded-3xl bg-white border border-neutral-200 p-6 sm:p-8 md:p-10 shadow-xs">
          {/* Header & Mode Switch */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                Project Era · Academic Portal
              </div>
              <h1 className="mt-1 font-display text-2xl sm:text-3xl font-normal text-neutral-900">
                {mode === 'login' ? 'Sign In to Your Workspace' : 'Create Your Project Era Account'}
              </h1>
            </div>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-[#faf9f6] border border-neutral-200 self-start">
              <button
                type="button"
                onClick={() => {
                  setForgotPasswordOpen(false);
                  onSwitchMode('login');
                }}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  mode === 'login'
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setForgotPasswordOpen(false);
                  onSwitchMode('register');
                }}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  mode === 'register'
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {/* Honest Demonstration Notice */}
          <div className="mt-5 p-3.5 rounded-xl bg-[#faf9f6] border border-neutral-200 flex items-start gap-3 text-xs text-neutral-600">
            <Info className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
            <div>
              <strong className="text-neutral-900">Frontend Demonstration Mode:</strong> Authentication and role selection operate locally in your browser for interactive demonstration until a backend server is connected. Passwords are never stored in browser storage.
            </div>
          </div>

          {/* 4 Account Types Selector */}
          <div className="mt-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-3">
              Select Account Type (4 Supported College Roles)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {ACCOUNT_TYPE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedRole === opt.type;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => setSelectedRole(opt.type)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white text-neutral-900 border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon
                        className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-neutral-800'}`}
                      />
                      <span
                        className={`text-[11px] font-mono ${
                          isSelected ? 'text-neutral-300' : 'text-neutral-400'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Role'}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{opt.label}</div>
                      <p
                        className={`mt-1 text-[11px] leading-snug ${
                          isSelected ? 'text-neutral-300' : 'text-neutral-500'
                        }`}
                      >
                        {opt.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {errorMessage && (
            <div className="mt-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-xs text-red-800 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* FORGOT PASSWORD INTERFACE */}
          {mode === 'login' && forgotPasswordOpen ? (
            <div className="mt-6 pt-6 border-t border-neutral-200 space-y-4">
              <h2 className="font-display text-lg font-semibold text-neutral-900">
                Reset Your Password (Demonstration)
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600">
                Enter your academic email address to preview the password reset workflow. In this frontend-only demonstration, no external emails are dispatched.
              </p>

              {forgotSubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-900 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>Demonstration Reset Initiated:</strong> If a backend mail service were connected, a reset link would be sent to <span className="font-mono">{forgotEmail}</span>. You can sign in directly using the demonstration login form.
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      Institutional Email Address
                    </label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="name@college.edu"
                      className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (!forgotEmail.includes('@')) {
                          setErrorMessage('Please enter a valid email address first.');
                          return;
                        }
                        setErrorMessage(null);
                        setForgotSubmitted(true);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-xs sm:text-sm font-semibold hover:bg-neutral-800 cursor-pointer"
                    >
                      Send Demo Reset Instructions
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotPasswordOpen(false);
                        setForgotSubmitted(false);
                      }}
                      className="px-4 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm font-medium text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                    >
                      Back to Login
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : mode === 'login' ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-xs font-semibold text-neutral-700 mb-1.5"
                >
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-semibold text-neutral-700"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setForgotSubmitted(false);
                      setForgotPasswordOpen(true);
                    }}
                    className="text-xs font-medium text-neutral-600 hover:text-neutral-900 underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-neutral-300 pl-3.5 pr-10 py-2.5 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-900 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="inline-flex items-center gap-2 text-xs text-neutral-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                  />
                  <span>Remember session in this browser (Demo)</span>
                </label>

                <span className="text-xs text-neutral-500">
                  Role: <strong className="text-neutral-900">{selectedRole}</strong>
                </span>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  className="w-full sm:flex-1 py-3 px-6 rounded-xl bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Login to {selectedRole === 'HOD' ? 'HOD' : selectedRole.charAt(0) + selectedRole.slice(1).toLowerCase()} Dashboard
                </button>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-600">
                <span>Don’t have a Project Era account yet?</span>
                <button
                  type="button"
                  onClick={() => onSwitchMode('register')}
                  className="font-semibold text-neutral-900 underline hover:text-[#b45309] cursor-pointer"
                >
                  Create an Account
                </button>
              </div>
            </form>
          ) : (
            /* REGISTRATION FORM WITH CONDITIONAL FIELDS PER ACCOUNT TYPE */
            <form onSubmit={handleRegisterSubmit} className="mt-6 space-y-5">
              {/* Common Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={
                      selectedRole === 'FACULTY'
                        ? 'Dr. Meera Krishnan'
                        : selectedRole === 'HOD'
                        ? 'Prof. Rajeshwar Verma'
                        : 'Aarav Sharma'
                    }
                    className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@college.edu"
                    className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full rounded-xl border border-neutral-300 pl-3.5 pr-10 py-2.5 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-900 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full rounded-xl border border-neutral-300 pl-3.5 pr-10 py-2.5 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-900 cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Institution & Department (shared across all 4 college account types) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Institution / College *
                  </label>
                  <input
                    type="text"
                    required
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="Enter college or university name"
                    className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Department *
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 bg-white focus:border-neutral-900 focus:outline-none"
                  >
                    {DEPARTMENTS_LIST.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* CONDITIONAL ROLE-SPECIFIC FIELDS */}
              {selectedRole === 'STUDENT' && (
                <div className="p-4 rounded-2xl bg-[#faf9f6] border border-neutral-200 space-y-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Student Academic Details
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Course *
                      </label>
                      <input
                        type="text"
                        required
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        placeholder="e.g. B.Tech CSE / BCA / MCA"
                        className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Academic Year or Batch *
                      </label>
                      <input
                        type="text"
                        required
                        value={batch}
                        onChange={(e) => setBatch(e.target.value)}
                        placeholder="e.g. 2023–2027"
                        className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Roll / Enrollment Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        placeholder="e.g. NIET/CSE/2023/042"
                        className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedRole === 'FACULTY' && (
                <div className="p-4 rounded-2xl bg-[#faf9f6] border border-neutral-200 space-y-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Faculty Details
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Designation *
                      </label>
                      <input
                        type="text"
                        required
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="e.g. Assistant Professor / Capstone Guide"
                        className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Areas of Expertise *
                      </label>
                      <input
                        type="text"
                        required
                        value={areasOfExpertise}
                        onChange={(e) => setAreasOfExpertise(e.target.value)}
                        placeholder="e.g. Machine Learning, IoT, Cloud Systems"
                        className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedRole === 'HOD' && (
                <div className="p-4 rounded-2xl bg-[#faf9f6] border border-neutral-200 space-y-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Head of Department (HOD) Details
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      Designation *
                    </label>
                    <input
                      type="text"
                      required
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="e.g. Professor & Head of Department"
                      className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {selectedRole === 'ALUMNI' && (
                <div className="p-4 rounded-2xl bg-[#faf9f6] border border-neutral-200 space-y-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Alumni Academic & Professional Details
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Graduation Year *
                      </label>
                      <input
                        type="text"
                        required
                        value={graduationYear}
                        onChange={(e) => setGraduationYear(e.target.value)}
                        placeholder="e.g. 2022"
                        className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Course *
                      </label>
                      <input
                        type="text"
                        required
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        placeholder="e.g. B.Tech Computer Science"
                        className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Current Organization (Optional)
                      </label>
                      <input
                        type="text"
                        value={currentOrganization}
                        onChange={(e) => setCurrentOrganization(e.target.value)}
                        placeholder="e.g. CloudScale Systems"
                        className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Current Job Role (Optional)
                      </label>
                      <input
                        type="text"
                        value={currentJobRole}
                        onChange={(e) => setCurrentJobRole(e.target.value)}
                        placeholder="e.g. Senior Systems Engineer"
                        className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Skills (Optional, comma-separated)
                      </label>
                      <input
                        type="text"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        placeholder="e.g. React, System Design, Embedded C"
                        className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        LinkedIn or Portfolio URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={linkedInOrPortfolio}
                        onChange={(e) => setLinkedInOrPortfolio(e.target.value)}
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-xl bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Create {selectedRole === 'HOD' ? 'HOD' : selectedRole.charAt(0) + selectedRole.slice(1).toLowerCase()} Account (Demo)
                </button>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-600">
                <span>Already registered on Project Era?</span>
                <button
                  type="button"
                  onClick={() => onSwitchMode('login')}
                  className="font-semibold text-neutral-900 underline hover:text-[#b45309] cursor-pointer"
                >
                  Sign In Here
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectEraAuthPage;
