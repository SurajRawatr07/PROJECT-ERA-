import React from 'react';
import { PublicPage } from './Navbar';
import { EraAccountType } from '../types/projectEra';

interface FooterProps {
  onSelectPage: (page: PublicPage) => void;
  onSelectRoleInfo: (role: EraAccountType) => void;
  onCreateProjectClick: () => void;
  onMyProjectsClick: () => void;
  onOpenLogin: (role?: EraAccountType) => void;
  onOpenRegister: (role?: EraAccountType) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectPage,
  onSelectRoleInfo,
  onCreateProjectClick,
  onMyProjectsClick,
  onOpenLogin,
  onOpenRegister
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-neutral-200 bg-[#faf9f6] text-neutral-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-10">
        {/* ProjectVerse-inspired multi-column footer grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 pb-10 border-b border-neutral-200/90">
          {/* 1. Brand Column */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-3 pr-0 lg:pr-8">
            <button
              type="button"
              onClick={() => onSelectPage('home')}
              className="font-display text-xl font-bold tracking-tight text-neutral-900 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
            >
              Project Era
            </button>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-sm">
              A home for academic projects, collaboration, and ideas that continue to grow.
            </p>
          </div>

          {/* 2. Platform Column */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
              Platform
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-600">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectPage('home')}
                  className="hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectPage('explore')}
                  className="hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  Explore Projects
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onCreateProjectClick}
                  className="hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  Create Project
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onMyProjectsClick}
                  className="hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  My Projects
                </button>
              </li>
            </ul>
          </div>

          {/* 3. Community Column */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
              Community
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-600">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectRoleInfo('STUDENT')}
                  className="hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  Student
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectRoleInfo('FACULTY')}
                  className="hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  Faculty
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectRoleInfo('HOD')}
                  className="hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  HOD
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectRoleInfo('ALUMNI')}
                  className="hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  Alumni
                </button>
              </li>
            </ul>
          </div>

          {/* 4. Resources Column */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
              Resources
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-600">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectPage('faq')}
                  className="hover:text-neutral-900 transition-colors cursor-pointer text-left"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectPage('how-it-works')}
                  className="hover:text-neutral-900 transition-colors cursor-pointer text-left"
                >
                  How It Works
                </button>
              </li>
            </ul>
          </div>

          {/* 5. Account Column */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
              Account
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-600">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLogin()}
                  className="hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenRegister()}
                  className="font-semibold text-neutral-900 hover:text-[#b45309] transition-colors cursor-pointer"
                >
                  Register
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-neutral-500">
          <span>© {currentYear} Project Era. All rights reserved.</span>
          <span>Open Academic Ecosystem · Student · Faculty · HOD · Alumni</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
