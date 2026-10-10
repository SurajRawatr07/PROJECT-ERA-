import React from 'react';
import { HeroAnimation } from './hero/HeroAnimation';

interface HeroProps {
  onGetStartedClick: () => void;
  onHowItWorksClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onGetStartedClick,
  onHowItWorksClick,
}) => {
  return (
    <section className="relative w-full overflow-hidden px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-white border-b border-neutral-200/80">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
          {/* LEFT COLUMN: Concise Hero Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-3">
              PROJECT ERA
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

            <p className="mt-4 max-w-[540px] text-base sm:text-[17px] text-neutral-600 leading-[1.6] font-body">
              Plan college projects, work with your team, receive faculty guidance, and track progress in one organized workspace.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="mt-7 flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onGetStartedClick}
                className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-6 sm:px-7 py-3 text-sm sm:text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-neutral-800 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
              >
                Get Started
              </button>

              <button
                type="button"
                onClick={onHowItWorksClick}
                className="inline-flex items-center justify-center rounded-xl bg-white border border-neutral-300 px-6 sm:px-7 py-3 text-sm sm:text-[15px] font-semibold text-neutral-800 transition-colors duration-150 hover:border-neutral-400 hover:bg-neutral-50 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
              >
                How It Works
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Clean Side Animation (Zero Text, Zero Icons) */}
          <div className="lg:col-span-5 flex items-center justify-center w-full mt-2 lg:mt-0 bg-transparent">
            <HeroAnimation />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
