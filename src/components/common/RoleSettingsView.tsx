import React, { useState } from 'react';
import { Shield, Bell, Key, Lock, CheckCircle2, User, Globe, Laptop } from 'lucide-react';
import { UserProfile, UserRole } from '../../types';
import { RoleBadge } from './RoleBadge';

interface RoleSettingsViewProps {
  role: UserRole;
  profile: UserProfile;
}

export const RoleSettingsView: React.FC<RoleSettingsViewProps> = ({ role, profile }) => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [digestAlerts, setDigestAlerts] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="font-display text-2xl text-[#111111] font-normal">
          Account & Workspace Settings
        </h2>
        <p className="text-xs text-[#555555]">
          Manage security credentials, notifications, and institutional authorization.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono-code flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Details summary */}
        <div className="bg-white rounded-2xl p-6 border border-black/8 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#111111] flex items-center gap-2">
              <User className="w-4 h-4 text-[#111111]" />
              Account Identity
            </h3>
            <RoleBadge role={role} size="sm" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono-code">
            <div>
              <span className="text-[#737373] text-[11px] block">Full Name</span>
              <span className="font-bold text-[#111111] block mt-0.5">{profile.fullName}</span>
            </div>
            <div>
              <span className="text-[#737373] text-[11px] block">Email Address</span>
              <span className="font-bold text-[#111111] block mt-0.5">{profile.email}</span>
            </div>
            <div>
              <span className="text-[#737373] text-[11px] block">Institution</span>
              <span className="font-bold text-[#111111] block mt-0.5">{profile.institution}</span>
            </div>
            <div>
              <span className="text-[#737373] text-[11px] block">Security Status</span>
              <span className="font-bold text-emerald-700 block mt-0.5">
                {profile.verifiedStatus || 'Verified (SAML SSO / Multi-Signal)'}
              </span>
            </div>
          </div>
        </div>

        {/* Notifications preferences */}
        <div className="bg-white rounded-2xl p-6 border border-black/8 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-[#111111] flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#111111]" />
            Notification Preferences
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#FBFBFA] border border-black/5 cursor-pointer">
              <div>
                <span className="font-bold text-[#111111] block">Instant Milestone & Review Alerts</span>
                <span className="text-[#555555] text-[11px]">Receive immediate notifications for verification requests and rubrics.</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={e => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 accent-black rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#FBFBFA] border border-black/5 cursor-pointer">
              <div>
                <span className="font-bold text-[#111111] block">Weekly Academic Summary Digest</span>
                <span className="text-[#555555] text-[11px]">Summary of repository commits, student progress, and department metrics.</span>
              </div>
              <input
                type="checkbox"
                checked={digestAlerts}
                onChange={e => setDigestAlerts(e.target.checked)}
                className="w-4 h-4 accent-black rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Security & Cryptographic Ledger Keys */}
        <div className="bg-white rounded-2xl p-6 border border-black/8 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-[#111111] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#111111]" />
            Security & Digital Verification Keys
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#FBFBFA] border border-black/5 cursor-pointer">
              <div>
                <span className="font-bold text-[#111111] block">Two-Factor Authentication (2FA)</span>
                <span className="text-[#555555] text-[11px]">Enforce time-based OTP for sensitive milestone signing.</span>
              </div>
              <input
                type="checkbox"
                checked={twoFactorAuth}
                onChange={e => setTwoFactorAuth(e.target.checked)}
                className="w-4 h-4 accent-black rounded cursor-pointer"
              />
            </label>

            <div className="p-3.5 rounded-xl bg-[#F7F7F5] border border-black/5 font-mono-code text-[11px] text-[#555555] space-y-1">
              <span className="text-[#737373] uppercase font-bold block text-[10px]">ECDSA Digital Signing Fingerprint</span>
              <p className="text-[#111111] break-all">
                SHA-256: 8f4e2a1b9c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#111111] hover:bg-black text-white text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};
