import React from 'react';
import { Github, Linkedin, ExternalLink } from 'lucide-react';
import { PublicPage } from './Navbar';

interface FooterProps {
  onSelectPage: (page: PublicPage) => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

const GITHUB_URL = 'https://github.com/SurajRawatr07';
const LINKEDIN_URL = 'https://www.linkedin.com/in/suraj-rawat-30513b340/';

export const Footer: React.FC<FooterProps> = ({
  onSelectPage,
  onOpenLogin,
  onOpenRegister,
}) => {
  return (
    <footer className="w-full border-t border-neutral-200/80 bg-[#faf9f6] pt-16 pb-12 px-5 sm:px-6 lg:px-8 text-neutral-900">
      <div className="mx-auto max-w-7xl">
        
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-neutral-200/80">
          
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-4 flex flex-col items-start pr-0 md:pr-6">
            <div className="mb-3">
              <span className="font-display text-xl font-bold tracking-tight text-neutral-900">
                ProjectVerse
              </span>
            </div>

            <p className="text-sm text-neutral-600 leading-relaxed max-w-sm mb-5 font-body">
              Connecting student projects across campuses. An open platform for discovering, building, verifying, and continuing academic work.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-300 bg-white text-neutral-800 transition-all hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-300 bg-white text-neutral-800 transition-all hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-display text-xs font-bold tracking-wider text-neutral-900 uppercase mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-600">
              <li>
                <a href="#how-it-works" className="hover:text-neutral-900 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#project-passport" className="hover:text-neutral-900 transition-colors">
                  Project Passport
                </a>
              </li>
              <li>
                <a href="#project-lineage" className="hover:text-neutral-900 transition-colors">
                  Project Lineage
                </a>
              </li>
              <li>
                <a href="#proof-of-work" className="hover:text-neutral-900 transition-colors">
                  Proof of Work
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-neutral-900 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Platform Links */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-display text-xs font-bold tracking-wider text-neutral-900 uppercase mb-4">
              Ecosystem
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-600">
              <li>
                <a href="#who-can-use" className="hover:text-neutral-900 transition-colors">
                  Students
                </a>
              </li>
              <li>
                <a href="#who-can-use" className="hover:text-neutral-900 transition-colors">
                  Developers
                </a>
              </li>
              <li>
                <a href="#who-can-use" className="hover:text-neutral-900 transition-colors">
                  Researchers
                </a>
              </li>
              <li>
                <a href="#who-can-use" className="hover:text-neutral-900 transition-colors">
                  Faculty & HOD
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation Links */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-display text-xs font-bold tracking-wider text-neutral-900 uppercase mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-600">
              <li>
                <button
                  onClick={() => onSelectPage('home')}
                  className="hover:text-neutral-900 transition-colors text-left cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectPage('about')}
                  className="hover:text-neutral-900 transition-colors text-left cursor-pointer"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectPage('how-it-works')}
                  className="hover:text-neutral-900 transition-colors text-left cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectPage('faq')}
                  className="hover:text-neutral-900 transition-colors text-left cursor-pointer"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-display text-xs font-bold tracking-wider text-neutral-900 uppercase mb-4">
              Account
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-600">
              <li>
                <button
                  onClick={onOpenLogin}
                  className="hover:text-neutral-900 transition-colors text-left cursor-pointer font-medium text-neutral-900"
                >
                  Login
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenRegister}
                  className="hover:text-neutral-900 transition-colors text-left cursor-pointer font-semibold text-neutral-900"
                >
                  Get Started
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex flex-wrap items-center gap-4">
            <span>© 2026 ProjectVerse. All rights reserved.</span>
            <span className="hidden sm:inline text-neutral-300">|</span>
            <span className="text-neutral-500">Cross-Campus Academic Continuity</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span>Built by</span>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-neutral-900 hover:text-[#e8860a] transition-colors underline decoration-neutral-300 hover:decoration-[#e8860a]"
            >
              Suraj Rawat
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
