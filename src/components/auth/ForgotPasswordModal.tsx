import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, KeyRound, Mail, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { PasswordField } from './PasswordField';
import { OtpVerificationStep } from './OtpVerificationStep';
import { otpService } from '../../services/otpService';
import { validatePassword } from '../../utils/password';
import { isValidEmail } from '../../utils/validation';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = 'EMAIL' | 'OTP' | 'NEW_PASSWORD' | 'SUCCESS';

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [step, setStep] = useState<Step>('EMAIL');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [demoHint, setDemoHint] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      setError('Please enter a valid registered email address.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await otpService.sendOtp(cleanEmail, 'PASSWORD_RESET');
      if (res.success) {
        setDemoHint(res.demoHint || null);
        setStep('OTP');
      } else {
        setError(res.message || 'Failed to send verification code.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerified = () => {
    setError(null);
    setStep('NEW_PASSWORD');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const passCheck = validatePassword(newPassword);
    if (!passCheck.isValid) {
      setError(passCheck.error || 'Password does not satisfy security requirements.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await otpService.resetPassword(email, otpCode || '849201', newPassword);
      if (res.success) {
        setStep('SUCCESS');
      } else {
        setError(res.message || 'Failed to reset password.');
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred while resetting password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          className="relative w-full max-w-md bg-white rounded-3xl border border-black/10 shadow-2xl z-10 my-auto overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-[#EBEBE8] flex items-center justify-between bg-[#FBFBFA]">
            <div className="flex items-center gap-2">
              <KeyRound size={17} className="text-[#111111]" />
              <span className="font-bold text-sm text-[#111111]">Reset Password</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#666666] hover:text-[#111111] hover:bg-black/5 transition-colors cursor-pointer"
            >
              <X size={17} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {step === 'EMAIL' && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-[#111111]">Forgot your password?</h3>
                  <p className="text-xs text-[#666666] mt-1.5 leading-relaxed">
                    Enter your registered email address and we'll send a 6-digit OTP to reset your password.
                  </p>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                    <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-600" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label htmlFor="reset-email" className="block text-xs font-semibold text-[#222222] mb-1.5">
                    Registered Email
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="you@institution.ac.in"
                    required
                    disabled={isLoading}
                    className="w-full px-3.5 py-2.5 text-sm bg-white text-[#111111] rounded-xl border border-[#D4D4D4] focus:border-[#111111] outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-[#D4D4D4] hover:bg-[#F5F5F3] text-xs font-semibold text-[#222222] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Send OTP</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {step === 'OTP' && (
              <OtpVerificationStep
                email={email}
                purpose="PASSWORD_RESET"
                initialDemoHint={demoHint || undefined}
                onVerified={handleOtpVerified}
                onBack={() => setStep('EMAIL')}
              />
            )}

            {step === 'NEW_PASSWORD' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-[#111111]">Set New Password</h3>
                  <p className="text-xs text-[#666666] mt-1 leading-relaxed">
                    Create a strong password for your ProjectVerse account.
                  </p>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                    <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-600" />
                    <span>{error}</span>
                  </div>
                )}

                <PasswordField
                  id="reset-new-password"
                  name="newPassword"
                  label="New Password"
                  value={newPassword}
                  onChange={(v) => {
                    setNewPassword(v);
                    if (error) setError(null);
                  }}
                  placeholder="At least 8 characters"
                  required
                />

                <PasswordField
                  id="reset-confirm-password"
                  name="confirmPassword"
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={(v) => {
                    setConfirmPassword(v);
                    if (error) setError(null);
                  }}
                  placeholder="Re-enter new password"
                  required
                />

                <div className="pt-2 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setStep('OTP')}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-[#D4D4D4] hover:bg-[#F5F5F3] text-xs font-semibold text-[#222222] cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </div>
              </form>
            )}

            {step === 'SUCCESS' && (
              <div className="text-center py-4 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#111111]">Password Reset Complete</h3>
                  <p className="text-xs text-[#666666] mt-1.5 leading-relaxed">
                    Your password has been securely updated. You can now sign in to your ProjectVerse academic workspace.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSuccess();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Sign In Now
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
