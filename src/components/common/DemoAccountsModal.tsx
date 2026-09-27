import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, ShieldAlert, Sparkles, UserCheck, KeyRound } from 'lucide-react';
import { UserRole } from '../../types';

interface DemoAccount {
  role: UserRole;
  title: string;
  name: string;
  email: string;
  badge: string;
  description: string;
  credentialsHint: string;
  badgeColor: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: 'STUDENT',
    title: 'Student',
    name: 'Suraj Rawat',
    email: 'suraj@student.demo',
    badge: 'Undergraduate (GEHU CSE)',
    description: 'Enrolled BCA 4th-year student at Graphic Era Hill University with active capstone projects.',
    credentialsHint: 'Password: Student@123 • Demo OTP: 123456',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200'
  },
  {
    role: 'FACULTY',
    title: 'Faculty / Mentor',
    name: 'Dr. Ananya Sharma',
    email: 'faculty@demo.com',
    badge: 'Associate Professor (GEHU CSE)',
    description: 'Faculty mentor in Computer Science & Engineering reviewing capstones and rubric scoring.',
    credentialsHint: 'Password: Faculty@123 • Demo OTP: 123456',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  },
  {
    role: 'HOD',
    title: 'HOD — GEHU CSE',
    name: 'Dr. Rajesh Mehta',
    email: 'hod@demo.com',
    badge: 'Department Intelligence (GEHU CSE)',
    description: 'Head of CSE at Graphic Era Hill University. Read-only department analytics, students, faculty, and projects.',
    credentialsHint: 'Password: Hod@123 • Demo OTP: 123456',
    badgeColor: 'bg-amber-50 text-amber-900 border-amber-200'
  },
  {
    role: 'HOD',
    title: 'HOD — IIT Delhi CSE',
    name: 'Prof. Amitabha Bagchi',
    email: 'hod.iitd@demo.com',
    badge: 'Department Intelligence (IIT Delhi)',
    description: 'Head of CSE at IIT Delhi. Isolated department intelligence showing only IIT Delhi CSE records.',
    credentialsHint: 'Password: Hod@123 • Demo OTP: 123456',
    badgeColor: 'bg-amber-50 text-amber-900 border-amber-200'
  },
  {
    role: 'INSTITUTION',
    title: 'Institution A — Graphic Era',
    name: 'Graphic Era Hill University',
    email: 'institution@demo.com',
    badge: 'Institution Intelligence (GEHU)',
    description: 'University registry node managing GEHU departments, students, faculty, and university projects.',
    credentialsHint: 'Password: Institution@123 • Demo OTP: 123456',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300'
  },
  {
    role: 'INSTITUTION',
    title: 'Institution B — IIT Delhi',
    name: 'Indian Institute of Technology Delhi',
    email: 'institution.iitd@demo.com',
    badge: 'Institution Intelligence (IITD)',
    description: 'University registry node managing IIT Delhi departments, students, faculty, and university projects.',
    credentialsHint: 'Password: Institution@123 • Demo OTP: 123456',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300'
  },
  {
    role: 'DEVELOPER',
    title: 'Developer',
    name: 'Alex Chen',
    email: 'developer@demo.com',
    badge: 'Open Source',
    description: 'Full-stack systems developer contributing to open-source student repositories and toolchains.',
    credentialsHint: 'Password: Dev@123 • Demo OTP: 123456',
    badgeColor: 'bg-sky-50 text-sky-800 border-sky-200'
  },
  {
    role: 'RESEARCHER',
    title: 'Researcher',
    name: 'Dr. Elena Rostova',
    email: 'researcher@demo.com',
    badge: 'AI & Systems',
    description: 'Research scientist validating empirical methodologies, telemetry, and machine learning models.',
    credentialsHint: 'Password: Research@123 • Demo OTP: 123456',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200'
  },
  {
    role: 'ALUMNI',
    title: 'Alumni',
    name: 'Rohan Sharma',
    email: 'rohan.alumni@gehu.ac.in',
    badge: 'Autonomous Systems',
    description: 'Autonomous Vehicles Engineer & Alumni guiding cross-batch continuity proposals.',
    credentialsHint: 'Password: Alumni@123 • Demo OTP: 123456',
    badgeColor: 'bg-orange-50 text-orange-900 border-orange-200'
  },
  {
    role: 'INDUSTRY_PROFESSIONAL',
    title: 'Industry Professional',
    name: 'Vikram Singh',
    email: 'industry@demo.com',
    badge: 'Principal Architect',
    description: 'Enterprise tech lead evaluating production readiness and capstone sponsorship.',
    credentialsHint: 'Password: Industry@123 • Demo OTP: 123456',
    badgeColor: 'bg-teal-50 text-teal-800 border-teal-200'
  }
];

interface DemoAccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (account: DemoAccount) => void;
}

export const DemoAccountsModal: React.FC<DemoAccountsModalProps> = ({
  isOpen,
  onClose,
  onSelectAccount
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          onClick={onClose}
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl border border-black/10 shadow-2xl z-10 my-auto overflow-hidden max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center text-xs font-bold font-mono">
                <KeyRound size={15} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-neutral-900 font-display">
                  Demo Accounts
                </h3>
                <p className="text-xs text-neutral-500 font-body">
                  Pre-configured accounts for reviewing each workspace role
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Notice banner */}
          <div className="px-6 py-3 bg-amber-50/80 border-b border-amber-100 text-[12px] text-amber-900 flex items-center gap-2">
            <ShieldAlert size={14} className="shrink-0 text-amber-700" />
            <span>
              <strong>Note:</strong> Admin accounts are strictly system-controlled and never exposed for public self-registration.
            </span>
          </div>

          {/* List of accounts */}
          <div className="p-6 overflow-y-auto space-y-3">
            {DEMO_ACCOUNTS.map((acc) => (
              <div
                key={acc.email}
                className="p-4 rounded-2xl border border-neutral-200/90 hover:border-neutral-900 bg-white hover:bg-neutral-50/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-neutral-900 text-sm">{acc.name}</span>
                    <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-md border ${acc.badgeColor}`}>
                      {acc.title}
                    </span>
                    <span className="text-[11px] text-neutral-400 font-mono">({acc.email})</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed font-body">
                    {acc.description}
                  </p>
                  <p className="text-[11px] text-neutral-500 font-mono">
                    {acc.credentialsHint}
                  </p>
                </div>

                <button
                  onClick={() => onSelectAccount(acc)}
                  className="shrink-0 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition-all active:scale-95 cursor-pointer shadow-xs self-start sm:self-center"
                >
                  <span>Select</span>
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="px-6 py-3 border-t border-neutral-100 bg-neutral-50 text-[11px] text-neutral-500 font-body flex items-center justify-between">
            <span>Demo OTP for all verification steps is <strong>123456</strong></span>
            <button
              onClick={onClose}
              className="text-xs font-medium text-neutral-700 hover:text-neutral-900 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
