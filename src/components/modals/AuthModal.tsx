import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { UserRole } from '../../types';
import { SignInForm } from '../auth/SignInForm';
import { RegisterForm } from '../auth/RegisterForm';
import { ProjectVerseBrand } from '../ProjectVerseBrand';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  initialRole?: UserRole;
  initialEmail?: string;
  initialPassword?: string;
  onClose: () => void;
  onAuthenticated: (role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  initialRole,
  initialEmail,
  initialPassword,
  onClose,
  onAuthenticated
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-xl bg-white rounded-3xl border border-black/10 shadow-2xl z-10 my-auto overflow-hidden max-h-[92vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="px-5 sm:px-6 py-4 border-b border-[#EBEBE8] flex items-center justify-between bg-[#FBFBFA] shrink-0">
            <ProjectVerseBrand
              theme="light"
              textSizeClassName="text-[16px] sm:text-[17px]"
              wordSpacing="normal"
              interactive={false}
            />

            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#666666] hover:text-[#111111] hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-7 overflow-y-auto">
            {mode === 'login' ? (
              <SignInForm
                initialRole={initialRole}
                initialEmail={initialEmail}
                initialPassword={initialPassword}
                onSuccess={(role) => {
                  onAuthenticated(role);
                  onClose();
                }}
                onSwitchToRegister={() => setMode('register')}
              />
            ) : (
              <RegisterForm
                initialRole={initialRole}
                onSuccess={(role) => {
                  onAuthenticated(role);
                  onClose();
                }}
                onSwitchToSignIn={() => setMode('login')}
              />
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
