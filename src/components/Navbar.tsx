import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export type PublicPage = 'home' | 'features' | 'how-it-works' | 'login' | 'register';

interface NavbarProps {
  currentPage?: PublicPage;
  onSelectPage: (page: PublicPage) => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

interface NavItem {
  id: PublicPage;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'features', label: 'Features' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'login', label: 'Login' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentPage = 'home',
  onSelectPage,
  onOpenLogin,
  onOpenRegister,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [mobileMenuOpen]);

  const handleNavClick = (id: PublicPage) => {
    setMobileMenuOpen(false);
    if (id === 'login') {
      onOpenLogin();
      return;
    }
    if (id === 'register') {
      onOpenRegister();
      return;
    }
    onSelectPage(id);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="text-xl font-display font-bold tracking-tight text-neutral-900 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
          >
            Project Era
          </button>

          {/* Zone 2: 4 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600">
            {NAV_ITEMS.map(({ id, label }) => {
              const isActive = currentPage === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleNavClick(id)}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                    isActive
                      ? 'text-neutral-900 font-semibold border-neutral-900'
                      : 'text-neutral-600 border-transparent hover:text-neutral-900 hover:border-neutral-300'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenRegister}
              className="rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-neutral-800 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Get Started
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-200 bg-white px-5 py-5 shadow-lg fixed top-16 left-0 right-0 z-40">
          <nav className="flex flex-col gap-1.5">
            {NAV_ITEMS.map(({ id, label }) => {
              const isActive = currentPage === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleNavClick(id)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-left text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-neutral-100 text-neutral-900 font-semibold'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  <span>{label}</span>
                </button>
              );
            })}

            <div className="mt-3 pt-3 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRegister();
                }}
                className="w-full py-3 rounded-xl bg-neutral-900 text-sm font-semibold text-white hover:bg-neutral-800 cursor-pointer"
              >
                Get Started
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;
