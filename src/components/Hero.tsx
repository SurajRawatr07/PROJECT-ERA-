import React from 'react';
import { ArrowRight } from 'lucide-react';
import { HeroAnimation } from './hero/HeroAnimation';

interface HeroProps {
  onGetStartedClick: () => void;
  onExploreHowItWorksClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onGetStartedClick,
  onExploreHowItWorksClick,
}) => {
  return (
    <section className="relative w-full overflow-hidden px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-[#faf9f6] border-b border-neutral-200/80">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
          {/* LEFT COLUMN: Project Era Hero Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="text-xs font-semibold tracking-widest uppercase text-neutral-600 mb-3">
              PROJECT ERA · Academic Project Workspace
            </div>

            <h1
              style={{ textWrap: 'balance' }}
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-normal text-neutral-900 tracking-tight leading-[1.12] max-w-2xl"
            >
              From Project Ideas to{' '}
              <span className="relative inline-block whitespace-nowrap">
                <em className="text-[#b45309] not-italic font-normal">Academic Impact.</em>
                <span className="absolute bottom-1.5 left-0 right-0 h-[3px] rounded bg-amber-200/90" />
              </span>
            </h1>

            <p className="mt-4 max-w-[600px] text-base sm:text-[17px] text-neutral-600 leading-[1.65] font-body">
              Plan college projects, collaborate with teammates, receive faculty guidance, and track your progress through one organized academic workspace.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="mt-7 flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onGetStartedClick}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 sm:px-7 py-3 text-sm sm:text-[15px] font-semibold text-white transition-all duration-150 hover:bg-neutral-800 cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={onExploreHowItWorksClick}
                className="inline-flex items-center justify-center rounded-xl bg-white border border-neutral-300 px-6 sm:px-7 py-3 text-sm sm:text-[15px] font-semibold text-neutral-800 transition-all duration-150 hover:border-neutral-400 hover:bg-neutral-50 cursor-pointer whitespace-nowrap shrink-0"
              >
                Explore How It Works
              </button>
            </div>

            {/* Clean unboxed metadata discipline */}
            <div className="mt-8 pt-5 border-t border-neutral-200/80 flex flex-wrap items-center gap-2 text-xs text-neutral-500 font-medium">
              <span>Built for College Communities</span>
              <span aria-hidden="true">·</span>
              <span>Students</span>
              <span aria-hidden="true">·</span>
              <span>Faculty</span>
              <span aria-hidden="true">·</span>
              <span>HODs</span>
              <span aria-hidden="true">·</span>
              <span>Alumni</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Preserved Original Homepage Animation */}
          <div className="lg:col-span-5 flex items-center justify-center w-full mt-2 lg:mt-0">
            <HeroAnimation />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
