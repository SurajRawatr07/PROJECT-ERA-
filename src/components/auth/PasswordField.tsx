import React, { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { validatePassword } from '../../utils/password';

interface PasswordFieldProps {
  id?: string;
  name?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showStrengthMeter?: boolean;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  id = 'password-input',
  name = 'password',
  label = 'Password',
  value,
  onChange,
  placeholder = '••••••••',
  showStrengthMeter = false,
  error,
  disabled = false,
  required = true,
  autoComplete = 'current-password'
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const validation = validatePassword(value);

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor={id} className="block text-xs font-semibold text-[#222222]">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        </div>
      )}

      <div className="relative">
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          className={`w-full px-3.5 py-2.5 pr-11 text-[14px] bg-white text-[#111111] rounded-xl border transition-all duration-150 outline-none focus:ring-2 disabled:bg-[#f5f5f5] disabled:cursor-not-allowed ${
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10'
              : 'border-[#d4d4d4] hover:border-[#a3a3a3] focus:border-[#111111] focus:ring-black/5'
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#737373] hover:text-[#111111] transition-colors cursor-pointer rounded-md focus:outline-none"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {error && <p className="mt-1.5 text-xs text-rose-600 font-medium">{error}</p>}

      {showStrengthMeter && value.length > 0 && (
        <div className="mt-2.5 p-3 rounded-xl bg-[#F9F9F8] border border-[#EBEBE8] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#555555]">Password strength</span>
            <span
              className={`text-[11px] font-bold ${
                validation.score <= 2
                  ? 'text-rose-600'
                  : validation.score <= 3
                  ? 'text-amber-600'
                  : 'text-emerald-600'
              }`}
            >
              {validation.strengthLabel}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 h-1">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <div
                key={lvl}
                className={`h-full rounded-full transition-all ${
                  lvl <= validation.score
                    ? validation.score <= 2
                      ? 'bg-rose-500'
                      : validation.score <= 3
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                    : 'bg-[#E5E5E5]'
                }`}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1 text-[11px]">
            <span
              className={`flex items-center gap-1.5 ${
                validation.hasMinLength ? 'text-emerald-600 font-medium' : 'text-[#737373]'
              }`}
            >
              {validation.hasMinLength ? <Check size={12} /> : <X size={12} />} 8+ characters
            </span>
            <span
              className={`flex items-center gap-1.5 ${
                validation.hasUpperCase ? 'text-emerald-600 font-medium' : 'text-[#737373]'
              }`}
            >
              {validation.hasUpperCase ? <Check size={12} /> : <X size={12} />} Uppercase
            </span>
            <span
              className={`flex items-center gap-1.5 ${
                validation.hasLowerCase ? 'text-emerald-600 font-medium' : 'text-[#737373]'
              }`}
            >
              {validation.hasLowerCase ? <Check size={12} /> : <X size={12} />} Lowercase
            </span>
            <span
              className={`flex items-center gap-1.5 ${
                validation.hasNumber ? 'text-emerald-600 font-medium' : 'text-[#737373]'
              }`}
            >
              {validation.hasNumber ? <Check size={12} /> : <X size={12} />} Number
            </span>
            <span
              className={`flex items-center gap-1.5 col-span-2 ${
                validation.hasSpecialChar ? 'text-emerald-600 font-medium' : 'text-[#737373]'
              }`}
            >
              {validation.hasSpecialChar ? <Check size={12} /> : <X size={12} />} Special character (!@#$%...)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
