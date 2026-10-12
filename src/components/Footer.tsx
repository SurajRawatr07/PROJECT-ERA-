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
    <footer className="w-full bg-[#000000] text-[#FFFFFF] border-t border-[#27272A]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-10 sm:pb-12">
        {/* Main Footer Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-12 gap-y-10 gap-x-6 sm:gap-8 lg:gap-6 pb-10 sm:pb-12 border-b border-[#27272A]">
          {/* 1. Brand Column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-4 space-y-3.5 pr-0 lg:pr-8">
            <button
              type="button"
              onClick={() => onSelectPage('home')}
              className="font-display text-xl font-bold tracking-tight text-[#FFFFFF] hover:opacity-90 transition-opacity cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFFFFF]"
            >
              Project Era
            </button>
            <p className="text-sm text-[#A1A1AA] leading-relaxed max-w-sm">
              A home for academic projects, collaboration, and ideas that continue to grow.
            </p>
          </div>

          {/* 2. Platform Column */}
          <div className="col-span-1 lg:col-span-2 space-y-3.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#FFFFFF]">
              Platform
            </h3>
            <ul className="space-y-2.5 text-sm text-[#A1A1AA]">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectPage('home')}
                  className="py-0.5 text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors duration-200 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onMyProjectsClick}
                  className="py-0.5 text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors duration-200 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
                >
                  My Projects
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onCreateProjectClick}
                  className="py-0.5 text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors duration-200 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
                >
                  Create Project
                </button>
              </li>
            </ul>
          </div>

          {/* 3. Community Column */}
          <div className="col-span-1 lg:col-span-2 space-y-3.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#FFFFFF]">
              Community
            </h3>
            <ul className="space-y-2.5 text-sm text-[#A1A1AA]">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectRoleInfo('STUDENT')}
                  className="py-0.5 text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors duration-200 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
                >
                  Student
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectRoleInfo('FACULTY')}
                  className="py-0.5 text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors duration-200 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
                >
                  Faculty
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectRoleInfo('HOD')}
                  className="py-0.5 text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors duration-200 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
                >
                  HOD
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectRoleInfo('ALUMNI')}
                  className="py-0.5 text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors duration-200 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
                >
                  Alumni
                </button>
              </li>
            </ul>
          </div>

          {/* 4. Resources Column */}
          <div className="col-span-1 lg:col-span-2 space-y-3.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#FFFFFF]">
              Resources
            </h3>
            <ul className="space-y-2.5 text-sm text-[#A1A1AA]">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectPage('faq')}
                  className="py-0.5 text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors duration-200 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectPage('how-it-works')}
                  className="py-0.5 text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors duration-200 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
                >
                  How It Works
                </button>
              </li>
            </ul>
          </div>

          {/* 5. Account Column */}
          <div className="col-span-1 lg:col-span-2 space-y-3.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#FFFFFF]">
              Account
            </h3>
            <ul className="space-y-2.5 text-sm text-[#A1A1AA]">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLogin()}
                  className="py-0.5 text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors duration-200 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
                >
                  Sign In
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenRegister()}
                  className="py-0.5 font-medium text-[#FFFFFF] hover:text-[#A1A1AA] transition-colors duration-200 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
                >
                  Register
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#A1A1AA]">
          <span className="text-center md:text-left">
            © {currentYear} Project Era. All rights reserved.
          </span>

          <span className="text-center text-[#A1A1AA]">
            Open Academic Ecosystem
          </span>

          {/* Creator Credit & Social Media Icons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3.5">
            <span className="text-xs font-medium text-[#FFFFFF] tracking-wide">
              Made by Roshan
            </span>
            <div className="flex items-center gap-1">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/roshan_patil_12?igsh=MXZ1dDg5MWpzbG0wMQ=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Roshan's Instagram"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[#A1A1AA] hover:text-[#FFFFFF] hover:bg-[#27272A]/50 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/roshan-patil-a70261251?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Roshan's LinkedIn"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[#A1A1AA] hover:text-[#FFFFFF] hover:bg-[#27272A]/50 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/Roshan1224"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Roshan's GitHub"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[#A1A1AA] hover:text-[#FFFFFF] hover:bg-[#27272A]/50 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
