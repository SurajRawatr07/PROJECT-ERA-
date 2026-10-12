import React from 'react';
import { PublicPage } from './Navbar';
import { EraAccountType } from '../types/projectEra';
import { GITHUB_URL, LINKEDIN_URL } from '../config/social';

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
    <footer
      spellCheck={false}
      className="w-full bg-[#000000] text-[#FFFFFF] border-t border-[#27272A] no-underline"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-10 sm:pb-12">
        {/* Main Footer Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-12 gap-y-10 gap-x-6 sm:gap-8 lg:gap-6 pb-10 sm:pb-12 border-b border-[#27272A]">
          {/* 1. Brand Column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-4 space-y-3.5 pr-0 lg:pr-8">
            <button
              type="button"
              onClick={() => onSelectPage('home')}
              className="font-display text-xl font-bold tracking-tight text-[#FFFFFF] hover:opacity-90 transition-opacity cursor-pointer no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFFFFF]"
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
                  className="py-0.5 text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors duration-200 cursor-pointer text-left no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onMyProjectsClick}
                  className="py-0.5 text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors duration-200 cursor-pointer text-left no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
                >
                  My Projects
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onCreateProjectClick}
                  className="py-0.5 text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors duration-200 cursor-pointer text-left no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
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
                  className="py-0.5 text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors duration-200 cursor-pointer text-left no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
                >
                  Student
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectRoleInfo('FACULTY')}
                  className="py-0.5 text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors duration-200 cursor-pointer text-left no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
                >
                  Faculty
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectRoleInfo('HOD')}
                  className="py-0.5 text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors duration-200 cursor-pointer text-left no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
                >
                  HOD
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectRoleInfo('ALUMNI')}
                  className="py-0.5 text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors duration-200 cursor-pointer text-left no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
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
                  className="py-0.5 text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors duration-200 cursor-pointer text-left no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectPage('how-it-works')}
                  className="py-0.5 text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors duration-200 cursor-pointer text-left no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
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
                  className="py-0.5 text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors duration-200 cursor-pointer text-left no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
                >
                  Sign In
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenRegister()}
                  className="py-0.5 font-medium text-[#FFFFFF] hover:text-[#A1A1AA] transition-colors duration-200 cursor-pointer text-left no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
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

          {/* Creator Credit & Authentic Brand Social Links */}
          <div className="flex items-center gap-3.5 no-underline">
            <span className="text-xs sm:text-sm font-medium text-[#FFFFFF] tracking-wide no-underline">
              Built by Suraj Rawat
            </span>
            <div className="flex items-center gap-3">
              {/* GitHub */}
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Suraj Rawat on GitHub"
                className="inline-flex items-center justify-center rounded-sm text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors duration-200 no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFFFFF]"
              >
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className="w-[21px] h-[21px] shrink-0"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"
                  />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Suraj Rawat on LinkedIn"
                className="inline-flex items-center justify-center rounded-sm text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors duration-200 no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFFFFF]"
              >
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className="w-[21px] h-[21px] shrink-0"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
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
