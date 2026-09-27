import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

export type PublicPage = 'home' | 'about' | 'how-it-works' | 'faq';

interface NavbarProps {
  currentPage?: PublicPage;
  onSelectPage: (page: PublicPage) => void;
  onOpenLogin?: () => void;
  onOpenRegister?: () => void;
  onOpenDemoAccounts?: () => void;
}

interface NavItem {
  id: PublicPage;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'faq', label: 'FAQ' },
];

/**
 * Clean BatchBro-style Navbar for ProjectVerse
 * - Brand ONLY says "ProjectVerse" (no separate PV icon/logo box)
 * - Navigation: Home, About, How It Works, Explore Projects, FAQ
 * - Right side: Sign In, Get Started
 * - Mobile Drawer with no horizontal overflow
 */
export const Navbar: React.FC<NavbarProps> = ({
  currentPage = 'home',
  onSelectPage,
  onOpenLogin,
  onOpenRegister,
  onOpenDemoAccounts,
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
    onSelectPage(id);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/95 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex h-[64px] w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          
          {/* LEFT: Wordmark ONLY (No separate PV box/logo) */}
          <div className="flex shrink-0 items-center">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left no-underline group focus:outline-none cursor-pointer"
              aria-label="ProjectVerse Home"
            >
              <span className="text-[19px] sm:text-[20px] font-display font-bold tracking-tight text-neutral-900 group-hover:text-neutral-700 transition-colors duration-200">
                ProjectVerse
              </span>
            </button>
          </div>

          {/* CENTER: Clean Public Nav Links */}
          <nav className="mx-auto hidden md:flex h-12 items-center gap-1 sm:gap-2">
            {NAV_ITEMS.map(({ id, label }) => {
              const isActive = currentPage === id;
              return (
                <button
                  key={id}
                  onClick={() => handleNavClick(id)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 relative group cursor-pointer ${
                    isActive
                      ? 'text-neutral-900 font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
                  }`}
                >
                  {label}
                  <span
                    className={`absolute bottom-1.5 left-4 right-4 h-0.5 bg-neutral-900 transition-transform duration-200 origin-center ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* RIGHT: Sign In & Get Started Buttons */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {onOpenLogin && (
              <button
                onClick={onOpenLogin}
                className="hidden sm:inline-flex px-3.5 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors duration-200 cursor-pointer"
              >
                Sign In
              </button>
            )}

            {onOpenRegister && (
              <button
                onClick={onOpenRegister}
                className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:bg-neutral-800 hover:shadow-md hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                Get Started
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-neutral-200 bg-white px-5 py-6 shadow-lg fixed top-[64px] left-0 right-0 z-40 max-h-[calc(100vh-64px)] overflow-y-auto"
          >
            <nav className="flex flex-col gap-2">
              {NAV_ITEMS.map(({ id, label }) => {
                const isActive = currentPage === id;
                return (
                  <button
                    key={id}
                    onClick={() => handleNavClick(id)}
                    className={`flex items-center justify-between p-3 rounded-xl text-left text-base font-medium transition-all ${
                      isActive
                        ? 'bg-neutral-100 text-neutral-900 font-semibold'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                    }`}
                  >
                    <span>{label}</span>
                    {isActive && <span className="h-2 w-2 rounded-full bg-neutral-900" />}
                  </button>
                );
              })}

              <div className="mt-4 pt-4 border-t border-neutral-200 flex flex-col gap-2.5">
                {onOpenLogin && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenLogin();
                    }}
                    className="w-full py-3 rounded-xl border border-neutral-300 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 cursor-pointer"
                  >
                    Sign In
                  </button>
                )}

                {onOpenRegister && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenRegister();
                    }}
                    className="w-full py-3 rounded-xl bg-neutral-900 text-sm font-semibold text-white shadow-xs hover:bg-neutral-800 cursor-pointer"
                  >
                    Get Started
                  </button>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
