import React from 'react';
import { ArrowRight } from 'lucide-react';
import { HeroAnimation } from './hero/HeroAnimation';

interface HeroProps {
  onGetStartedClick: () => void;
  isAuthenticated?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  onGetStartedClick,
  isAuthenticated = false
}) => {
  return (
    <section className="relative w-full overflow-hidden px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-22 bg-white border-b border-neutral-200/80">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT COLUMN: Welcome to Project Era Copy & Primary CTA */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <div className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-3">
              ACADEMIC PROJECT PLATFORM
            </div>

            <h1
              style={{ textWrap: 'balance' }}
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-normal text-neutral-900 tracking-tight leading-[1.12]"
            >
              Welcome to{' '}
              <span className="relative inline-block whitespace-nowrap">
                <em className="text-[#b45309] not-italic font-normal">Project Era</em>
              </span>
            </h1>

            <div className="mt-5 max-w-xl space-y-3.5 text-base sm:text-[17px] text-neutral-600 leading-[1.65] font-body">
              <p>
                Your space to create, share, and grow academic projects.
              </p>
              <p>
                Bring your ideas, teammates, and technical work together in one place—and let every project become a foundation for what comes next.
              </p>
            </div>

            {/* Primary Hero CTA: Get Started */}
            <div className="mt-8 flex items-center w-full sm:w-auto">
              <button
                type="button"
                onClick={onGetStartedClick}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-neutral-900 px-7 py-3.5 text-sm sm:text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-neutral-800 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
              >
                <span>{isAuthenticated ? 'Go to Dashboard' : 'Get Started'}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Animated Developer Team Hero Illustration */}
          <div className="lg:col-span-6 w-full flex items-center justify-center">
            <HeroAnimation />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
