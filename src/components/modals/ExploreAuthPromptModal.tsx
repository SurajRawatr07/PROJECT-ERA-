import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, X, ArrowRight, ShieldCheck, FolderGit2, Users } from 'lucide-react';

interface ExploreAuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: () => void;
  onCreateAccount: () => void;
}

/**
 * Deliberate, friction-free authentication prompt for Project Discovery.
 * Follows the BatchBro design system:
 * - Crisp white card, subtle borders, restrained shadows
 * - Editorial typography
 * - Clear, welcoming product messaging explaining why accounts are required
 */
export const ExploreAuthPromptModal: React.FC<ExploreAuthPromptModalProps> = ({
  isOpen,
  onClose,
  onSignIn,
  onCreateAccount,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg bg-white rounded-3xl p-7 sm:p-9 border border-neutral-200/90 shadow-2xl z-10 font-body text-neutral-900 overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Compass Icon Badge */}
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-neutral-100 border border-neutral-200/80 text-neutral-900 mb-5">
            <Compass className="w-6 h-6 stroke-[1.75]" />
          </div>

          {/* Title & Description strictly matching requirement */}
          <h3 className="font-display text-2xl sm:text-3xl font-light tracking-tight text-neutral-900">
            Sign in to Explore Projects
          </h3>
          <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed font-body">
            ProjectVerse keeps project discovery and collaboration connected to verified user accounts.
          </p>

          {/* Feature Highlights Grid */}
          <div className="mt-6 pt-6 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-neutral-600">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#faf9f6] border border-neutral-200/60">
              <FolderGit2 className="w-4 h-4 text-neutral-700 shrink-0" />
              <span>Project Passports & Lineage</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#faf9f6] border border-neutral-200/60">
              <Users className="w-4 h-4 text-neutral-700 shrink-0" />
              <span>Verified Collaborators</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#faf9f6] border border-neutral-200/60">
              <ShieldCheck className="w-4 h-4 text-neutral-700 shrink-0" />
              <span>Evidence Verification</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onSignIn();
              }}
              className="w-full sm:w-1/2 py-3 px-5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                onClose();
                onCreateAccount();
              }}
              className="w-full sm:w-1/2 py-3 px-5 rounded-full bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 hover:border-neutral-400 text-sm font-semibold transition-all flex items-center justify-center cursor-pointer active:scale-98"
            >
              Create Account
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-neutral-400">
            Select any of the 8 academic or builder roles during registration
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
