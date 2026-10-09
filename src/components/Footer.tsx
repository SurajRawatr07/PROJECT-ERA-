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
    <footer className="w-full border-t border-neutral-200 bg-white pt-14 pb-10 px-4 sm:px-6 lg:px-8 text-neutral-900">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 pb-10 border-b border-neutral-200">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-5 flex flex-col items-start pr-0 md:pr-6">
            <span className="font-display text-xl font-bold tracking-tight text-neutral-900">
              Project Era
            </span>

            <p className="mt-3 text-sm text-neutral-600 leading-relaxed max-w-sm">
              An academic project workspace for college communities—organizing project planning, teamwork, milestones, documentation, and faculty feedback in one place.
            </p>

            <p className="mt-4 text-xs text-neutral-500">
              Frontend Demonstration Environment · Client-side interactive preview
            </p>
          </div>

          {/* Account Types */}
          <div className="col-span-1 md:col-span-3">
            <h4 className="font-display text-xs font-bold tracking-wider text-neutral-900 uppercase mb-3.5">
              Account Types
            </h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenRegister('STUDENT')}
                  className="hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  Student Workspace
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenRegister('FACULTY')}
                  className="hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  Faculty Review Portal
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenRegister('HOD')}
                  className="hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  HOD Department Overview
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenRegister('ALUMNI')}
                  className="hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  Alumni Mentorship
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-display text-xs font-bold tracking-wider text-neutral-900 uppercase mb-3.5">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-neutral-600">
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
                  onClick={() => onSelectPage('features')}
                  className="hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectPage('how-it-works')}
                  className="hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
            </ul>
          </div>

          {/* Access */}
          <div className="col-span-2 sm:col-span-1 md:col-span-2">
            <h4 className="font-display text-xs font-bold tracking-wider text-neutral-900 uppercase mb-3.5">
              Access
            </h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLogin()}
                  className="hover:text-neutral-900 transition-colors font-medium text-neutral-900 cursor-pointer"
                >
                  Login
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenRegister()}
                  className="hover:text-neutral-900 transition-colors font-semibold text-neutral-900 cursor-pointer"
                >
                  Get Started
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex flex-wrap items-center gap-2">
            <span>© 2026 Project Era. All rights reserved.</span>
            <span aria-hidden="true">·</span>
            <span>College Academic Project Platform</span>
          </div>
          <div>
            <span>Demonstration Mode — No server-side persistence claimed</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
