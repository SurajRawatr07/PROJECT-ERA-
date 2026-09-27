import React, { useState, useEffect, useRef } from 'react';
import { Mail, CheckCircle2, AlertCircle, ArrowLeft, RefreshCw, KeyRound } from 'lucide-react';
import { otpService } from '../../services/otpService';

interface OtpVerificationStepProps {
  email: string;
  onVerified: () => void;
  onBack: () => void;
  purpose?: 'REGISTRATION' | 'PASSWORD_RESET';
  initialDemoHint?: string;
}

export const OtpVerificationStep: React.FC<OtpVerificationStepProps> = ({
  email,
  onVerified,
  onBack,
  purpose = 'REGISTRATION',
  initialDemoHint
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [demoHint, setDemoHint] = useState<string | null>(initialDemoHint || null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [resendSuccessMsg, setResendSuccessMsg] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    setError(null);
    setResendSuccessMsg(null);

    // Handle multi-character paste into one box
    const cleanVal = value.replace(/\D/g, '');
    if (cleanVal.length > 1) {
      const pastedChars = cleanVal.slice(0, 6).split('');
      const newDigits = [...digits];
      pastedChars.forEach((ch, i) => {
        if (index + i < 6) {
          newDigits[index + i] = ch;
        }
      });
      setDigits(newDigits);
      const nextFocus = Math.min(index + pastedChars.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    const singleDigit = cleanVal.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = singleDigit;
    setDigits(newDigits);

    // Move to next input if filled
    if (singleDigit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pastedData[i] || '';
    }
    setDigits(newDigits);
    const nextFocus = Math.min(pastedData.length, 5);
    inputRefs.current[nextFocus]?.focus();
  };

  const fullCode = digits.join('');

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (fullCode.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    try {
      setIsVerifying(true);
      const result = await otpService.verifyOtp(email, fullCode);
      if (result.success) {
        onVerified();
      } else {
        setError(result.message || 'Invalid or expired code. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify OTP code.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;

    try {
      setIsResending(true);
      setError(null);
      const result = await otpService.sendOtp(email, purpose as 'REGISTRATION' | 'PASSWORD_RESET');
      if (result.success) {
        setResendCooldown(30);
        setResendSuccessMsg('A new verification code has been dispatched.');
        if (result.demoHint) {
          setDemoHint(result.demoHint);
        }
      } else {
        setError(result.message || 'Failed to resend code.');
      }
    } catch (err: any) {
      setError(err.message || 'Error resending code.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-[#F0F0ED] border border-black/10 flex items-center justify-center mx-auto mb-3 text-[#111111]">
          <KeyRound size={22} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
          Verify Email & Identity
        </h2>
        <p className="text-xs sm:text-sm text-[#666666] mt-2 leading-relaxed">
          Demo verification step for account:
        </p>
        <div className="flex items-center justify-center gap-1.5 mt-1">
          <span className="font-semibold text-xs sm:text-sm text-[#111111]">{email}</span>
        </div>
      </div>

      {/* Demo helper hint box */}
      <div className="mb-5 p-3 rounded-xl bg-amber-50/90 border border-amber-200/90 text-amber-950 text-xs flex items-start gap-2.5">
        <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-amber-600" />
        <div className="flex-1 leading-relaxed">
          <span className="font-bold">Demo OTP: 123456</span>
          <p className="text-[11px] text-amber-800/90 mt-0.5">
            Frontend mock verification active. Enter <span className="font-mono-code font-bold">123456</span> to complete verification and proceed.
          </p>
        </div>
      </div>

      {/* Success alert on resend */}
      {resendSuccessMsg && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
          <span>{resendSuccessMsg}</span>
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div
          role="alert"
          className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5"
        >
          <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
          <div className="flex-1 leading-relaxed">{error}</div>
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-6">
        {/* 6 Digit Input Boxes */}
        <div className="flex items-center justify-center gap-2 sm:gap-2.5" onPaste={handlePaste}>
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold bg-white text-[#111111] rounded-xl border border-[#D4D4D4] hover:border-[#A3A3A3] focus:border-[#111111] focus:ring-2 focus:ring-black/10 transition-all outline-none"
              autoComplete="one-time-code"
              aria-label={`Digit ${idx + 1}`}
            />
          ))}
        </div>

        {/* Resend Code Section */}
        <div className="flex items-center justify-between text-xs text-[#666666] pt-1">
          <span>Didn't receive the code?</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0 || isResending}
            className="font-semibold text-[#111111] hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
          >
            {isResending ? (
              <RefreshCw size={12} className="animate-spin" />
            ) : resendCooldown > 0 ? (
              `Resend in ${resendCooldown}s`
            ) : (
              'Resend Code'
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            disabled={isVerifying}
            className="flex-1 py-3 px-4 rounded-xl border border-[#D4D4D4] hover:bg-[#F5F5F3] text-[#222222] font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <ArrowLeft size={15} />
            <span>Back</span>
          </button>

          <button
            type="submit"
            disabled={isVerifying || fullCode.length !== 6}
            className="flex-1 py-3 px-4 rounded-xl bg-[#111111] hover:bg-[#222222] text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            {isVerifying ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 size={16} />
                <span>Verify OTP</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
