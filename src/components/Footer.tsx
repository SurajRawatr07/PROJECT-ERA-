import React from 'react';
import { PublicPage } from './Navbar';
import { EraAccountType } from '../types/projectEra';

interface FooterProps {
  onSelectPage: (page: PublicPage) => void;
  onOpenLogin: (role?: EraAccountType) => void;
  onOpenRegister: (role?: EraAccountType) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectPage,
  onOpenLogin,
  onOpenRegister,
}) => {
  return (
    <footer className="w-full border-t border-neutral-200 bg-white py-10 px-4 sm:px-6 lg:px-8 text-neutral-900">
      <div className="mx-auto max-w-7xl flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-200/80">
          {/* Wordmark + One-line description */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => onSelectPage('home')}
              className="font-display text-lg font-bold tracking-tight text-neutral-900 cursor-pointer"
            >
              Project Era
            </button>
            <p className="text-xs sm:text-sm text-neutral-600">
              An organized academic workspace for college project planning, teamwork, and faculty reviews.
            </p>
          </div>

          {/* Single clean navigation & account link row */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm font-medium text-neutral-600">
            <button
              type="button"
              onClick={() => onSelectPage('home')}
              className="hover:text-neutral-900 transition-colors cursor-pointer whitespace-nowrap"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => onSelectPage('how-it-works')}
              className="hover:text-neutral-900 transition-colors cursor-pointer whitespace-nowrap"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => onSelectPage('faq')}
              className="hover:text-neutral-900 transition-colors cursor-pointer whitespace-nowrap"
            >
              FAQ
            </button>
            <button
              type="button"
              onClick={() => onOpenLogin()}
              className="hover:text-neutral-900 transition-colors cursor-pointer whitespace-nowrap"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => onOpenRegister()}
              className="font-semibold text-neutral-900 hover:text-[#b45309] transition-colors cursor-pointer whitespace-nowrap"
            >
              Register
            </button>
          </nav>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-neutral-500">
          <span>© 2026 Project Era. All rights reserved.</span>
          <span>Students · Faculty · HODs · Alumni</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
