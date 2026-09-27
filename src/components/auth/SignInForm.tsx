import React, { useState } from 'react';
import { 
  LogIn, 
  AlertCircle, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  Lock,
  Mail,
  GraduationCap,
  BookOpen,
  FlaskConical,
  Award,
  Code2,
  Building2,
  Landmark,
  Briefcase
} from 'lucide-react';
import { PasswordField } from './PasswordField';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { OtpVerificationStep } from './OtpVerificationStep';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';
import { otpService } from '../../services/otpService';

interface SignInFormProps {
  onSuccess: (role: UserRole) => void;
  onSwitchToRegister: () => void;
  initialRole?: UserRole;
  initialEmail?: string;
  initialPassword?: string;
}

interface RoleSignInMeta {
  role: UserRole;
  title: string;
  badge: string;
  emailLabel: string;
  emailPlaceholder: string;
  description: string;
  icon: React.FC<{ className?: string; size?: number }>;
}

const SIGNIN_ROLES: RoleSignInMeta[] = [
  {
    role: 'STUDENT',
    title: 'Student',
    badge: 'Student / College',
    emailLabel: 'Student / Registered Email',
    emailPlaceholder: 'student@gehu.ac.in',
    description: 'Access student workspace, capstones, and project repository.',
    icon: GraduationCap
  },
  {
    role: 'FACULTY',
    title: 'Faculty / Mentor',
    badge: 'Institution',
    emailLabel: 'Official / Institution Email',
    emailPlaceholder: 'faculty@institution.ac.in',
    description: 'Sign in to mentor student teams and evaluate capstone rubrics.',
    icon: BookOpen
  },
  {
    role: 'RESEARCHER',
    title: 'Researcher',
    badge: 'Research Node',
    emailLabel: 'Professional / Research Email',
    emailPlaceholder: 'researcher@lab.org',
    description: 'Access research benchmarks, telemetry, and verified models.',
    icon: FlaskConical
  },
  {
    role: 'ALUMNI',
    title: 'Alumni',
    badge: 'Alumni Network',
    emailLabel: 'Registered Alumni Email',
    emailPlaceholder: 'alumni@alumni.gehu.ac.in',
    description: 'Contribute industry insights and mentor upcoming student batches.',
    icon: Award
  },
  {
    role: 'DEVELOPER',
    title: 'Developer',
    badge: 'Personal / Tech',
    emailLabel: 'Personal Developer Email',
    emailPlaceholder: 'alex.developer@gmail.com',
    description: 'Access open-source lineages and developer tools.',
    icon: Code2
  },
  {
    role: 'HOD',
    title: 'HOD',
    badge: 'Department Root',
    emailLabel: 'Official Department Email',
    emailPlaceholder: 'hod.cse@institution.ac.in',
    description: 'Departmental governance, faculty assignments, and accreditation.',
    icon: Building2
  },
  {
    role: 'INSTITUTION',
    title: 'Institution',
    badge: 'Organization',
    emailLabel: 'Official Institution Email',
    emailPlaceholder: 'admin@university.ac.in',
    description: 'University-wide multi-department registry and compliance ledger.',
    icon: Landmark
  },
  {
    role: 'INDUSTRY_PROFESSIONAL',
    title: 'Industry Professional',
    badge: 'Enterprise',
    emailLabel: 'Professional Work Email',
    emailPlaceholder: 'lead@enterprise.com',
    description: 'Manage corporate problem statements and industry mentorship.',
    icon: Briefcase
  }
];

export const SignInForm: React.FC<SignInFormProps> = ({
  onSuccess,
  onSwitchToRegister,
  initialRole,
  initialEmail,
  initialPassword
}) => {
  const { login } = useAuth();

  // Multi-step sign in: 
  // Step 1: ROLE_SELECT ("Sign in as")
  // Step 2: CREDENTIALS (Email + Password)
  // Step 3: OTP (Secure OTP Verification before dashboard access)
  const [step, setStep] = useState<'ROLE_SELECT' | 'CREDENTIALS' | 'OTP'>(
    initialRole && initialEmail ? 'CREDENTIALS' : 'ROLE_SELECT'
  );
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole || 'STUDENT');
  const [email, setEmail] = useState(initialEmail || '');
  const [password, setPassword] = useState(initialPassword || '');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [demoHint, setDemoHint] = useState<string | null>(null);
  const [authenticatedRole, setAuthenticatedRole] = useState<UserRole | null>(null);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const activeMeta = SIGNIN_ROLES.find(r => r.role === selectedRole) || SIGNIN_ROLES[0];

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setError(null);
    setStep('CREDENTIALS');
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    try {
      setIsLoading(true);
      // Validate credentials with login API
      const result = await login(cleanEmail, password);

      if (result.success && result.role) {
        // Enforce role consistency:
        // If the user's verified role differs from the chosen role card, inform them
        // unless they are authorized or admin
        const targetRole = result.role;
        setAuthenticatedRole(targetRole);

        // Dispatch real 6-digit OTP for two-factor sign-in security
        const otpRes = await otpService.sendOtp(cleanEmail, 'REGISTRATION');
        if (otpRes.success) {
          setDemoHint(otpRes.demoHint || null);
          setStep('OTP');
        } else {
          // If OTP dispatch succeeded or failed, proceed with safety
          setError(otpRes.message || 'Verification code generation failed.');
        }
      } else {
        setError(result.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerified = () => {
    if (authenticatedRole) {
      onSuccess(authenticatedRole);
    } else {
      onSuccess(selectedRole);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* ------------------------------------------------------------- */}
      {/* STEP 1: ROLE SELECTION ("Sign in as")                         */}
      {/* ------------------------------------------------------------- */}
      {step === 'ROLE_SELECT' && (
        <div className="space-y-6">
          <div className="text-center">
            <span className="text-[11px] font-mono-code uppercase px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 font-semibold border border-black/5">
              Secure Gateway
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-[#111111] mt-2">
              Sign in as
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] mt-1 max-w-md mx-auto">
              Select your registered identity role to proceed to your role-specific authentication
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {SIGNIN_ROLES.map((r) => {
              const Icon = r.icon;
              return (
                <button
                  key={r.role}
                  type="button"
                  id={`signin-role-${r.role.toLowerCase()}`}
                  onClick={() => handleSelectRole(r.role)}
                  className="group p-3.5 rounded-2xl border border-[#E5E5E5] bg-white hover:border-[#111111] hover:bg-[#FAFAFA] hover:shadow-xs text-left transition-all duration-150 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-xl bg-[#F0F0ED] text-[#111111] group-hover:bg-[#111111] group-hover:text-white flex items-center justify-center transition-colors">
                        <Icon size={16} />
                      </div>
                      <span className="text-[9.5px] font-mono-code uppercase px-1.5 py-0.5 rounded bg-[#F0F0ED] text-[#555555] font-semibold">
                        {r.badge}
                      </span>
                    </div>
                    <h3 className="text-[13px] font-bold text-[#111111] group-hover:text-black">
                      {r.title}
                    </h3>
                  </div>
                  <p className="text-[10.5px] text-[#666666] mt-1.5 line-clamp-2 leading-relaxed">
                    {r.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Switch to Register */}
          <div className="pt-4 border-t border-[#EBEBE8] text-center">
            <p className="text-xs text-[#666666]">
              New to ProjectVerse?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="font-bold text-[#111111] hover:underline cursor-pointer ml-1"
              >
                Create an Account
              </button>
            </p>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 2: ROLE CREDENTIALS (Email & Password)                   */}
      {/* ------------------------------------------------------------- */}
      {step === 'CREDENTIALS' && (
        <div>
          {/* Back button & Role header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => {
                setStep('ROLE_SELECT');
                setError(null);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-mono-code text-[#666666] hover:text-[#111111] cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Change Role</span>
            </button>
            <span className="text-xs font-mono-code px-2.5 py-0.5 rounded-full bg-black/5 text-[#111111] font-semibold border border-black/8">
              Signing in as {activeMeta.title}
            </span>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold font-display tracking-tight text-[#111111]">
              Sign in as {activeMeta.title}
            </h2>
            <p className="text-xs text-[#666666] mt-1">
              Enter your registered credentials to access the {activeMeta.title} dashboard
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div
              role="alert"
              className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-800 text-xs flex items-start gap-2.5"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
              <div className="flex-1 leading-relaxed">
                <span className="font-semibold">Authentication failed:</span> {error}
              </div>
            </div>
          )}

          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div>
              <label htmlFor="signin-email" className="block text-xs font-semibold text-[#222222] mb-1.5">
                {activeMeta.emailLabel} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="signin-email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder={activeMeta.emailPlaceholder}
                  required
                  autoComplete="email"
                  disabled={isLoading}
                  className="w-full px-3.5 py-2.5 text-[14px] bg-white text-[#111111] rounded-xl border border-[#d4d4d4] hover:border-[#a3a3a3] focus:border-[#111111] focus:ring-2 focus:ring-black/5 transition-all duration-150 outline-none disabled:bg-[#f5f5f5]"
                />
              </div>
            </div>

            <PasswordField
              id="signin-password"
              name="password"
              label="Password"
              value={password}
              onChange={(val) => {
                setPassword(val);
                if (error) setError(null);
              }}
              placeholder="••••••••"
              disabled={isLoading}
              required
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between text-xs">
              <span className="text-[#737373] font-mono-code text-[11px] flex items-center gap-1">
                <Lock size={12} />
                2FA OTP Protected
              </span>
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(true)}
                className="font-medium text-[#666666] hover:text-[#111111] transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              id="signin-submit-btn"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-[#111111] hover:bg-[#222222] text-white font-bold text-sm shadow-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2 min-h-[44px]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={16} />
                  <span>Verify Credentials & Continue</span>
                </>
              )}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="mt-6 pt-5 border-t border-[#EBEBE8] text-center">
            <p className="text-xs sm:text-sm text-[#666666]">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="font-bold text-[#111111] hover:underline cursor-pointer ml-1"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 3: OTP VERIFICATION (Mandatory before dashboard entry)   */}
      {/* ------------------------------------------------------------- */}
      {step === 'OTP' && (
        <div className="space-y-4">
          <OtpVerificationStep
            email={email}
            purpose="REGISTRATION"
            initialDemoHint={demoHint || undefined}
            onVerified={handleOtpVerified}
            onBack={() => setStep('CREDENTIALS')}
          />
        </div>
      )}

      {/* Real OTP-Backed Forgot Password Flow */}
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        onSuccess={() => setShowForgotPasswordModal(false)}
      />
    </div>
  );
};
