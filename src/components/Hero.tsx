import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { HeroAnimation } from './hero/HeroAnimation';

interface HeroProps {
  onGetStartedClick: () => void;
  onLoginClick?: () => void;
}

/**
 * Premium SaaS-style Hero for ProjectVerse
 * - Left column: Refined typography hierarchy, value proposition, and CTA buttons
 * - Right column: ProjectVerse collaboration & lineage animated illustration (40-45% width)
 * - Mobile responsive: Content cleanly stacks with animation positioned smoothly below
 * - Strict typography guidelines: Headline clamp(2.25rem, 4vw, 3.75rem), paragraph 16-18px
 */
export const Hero: React.FC<HeroProps> = ({
  onGetStartedClick,
  onLoginClick,
}) => {
  return (
    <section className="relative w-full overflow-hidden px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-[#faf9f6] border-b border-neutral-200/70">
      <div className="relative z-10 mx-auto max-w-7xl">
        
        {/* Responsive Grid: Left (55-58%) & Right (42-45%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
          
          {/* LEFT COLUMN: Hero Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Eyebrow Label Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-300/80 bg-white px-3.5 py-1 text-xs font-semibold tracking-wide text-neutral-700 uppercase shadow-2xs mb-4">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Institutional Project Memory & Generational Lineage</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-normal text-neutral-900 tracking-tight leading-[1.14] max-w-2xl">
              Projects Should Not Die When a Student Batch{' '}
              <span className="relative inline-block whitespace-nowrap">
                <em className="text-[#e8860a] not-italic font-normal">Graduates.</em>
                <span className="absolute bottom-1.5 left-0 right-0 h-[3px] rounded bg-[#fddfa0]"></span>
              </span>
            </h1>

            {/* Core Value Statement */}
            <div className="mt-3.5 px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs font-mono font-bold text-amber-950 inline-block">
              GitHub stores the code. ProjectVerse stores the project journey.
            </div>

            {/* Supporting Description */}
            <p className="mt-3 max-w-[620px] text-base sm:text-[17px] text-neutral-600 leading-[1.65] font-body">
              ProjectVerse preserves project knowledge, contributions, factual evidence, faculty reviews, and multi-batch lineage so future student cohorts can inherit validated foundations and continue the work.
            </p>

            {/* Lifecycle Flow Ribbon */}
            <div className="mt-4 flex flex-wrap items-center gap-1.5 text-[11px] font-mono font-semibold text-neutral-700 bg-white p-2.5 rounded-2xl border border-neutral-200/80 max-w-2xl">
              <span className="text-[#737373] text-[10px] uppercase font-bold mr-1">Lifecycle:</span>
              {['Create', 'Build', 'Collaborate', 'Prove', 'Review', 'Handover', 'Continue', 'Evolve'].map((st, i, arr) => (
                <React.Fragment key={st}>
                  <span className="px-2 py-0.5 rounded-md bg-[#FBFBFA] border border-black/6 text-neutral-900">
                    {st}
                  </span>
                  {i < arr.length - 1 && <span className="text-[#888888] select-none">→</span>}
                </React.Fragment>
              ))}
            </div>

            {/* Clean SaaS CTA Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
              <button
                onClick={onGetStartedClick}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 sm:px-7 py-3 text-sm sm:text-[15px] font-semibold text-white shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-md active:scale-98 cursor-pointer"
              >
                <span>Explore Ecosystem</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              {onLoginClick && (
                <button
                  onClick={onLoginClick}
                  className="inline-flex items-center justify-center rounded-xl bg-white border border-neutral-300 px-6 sm:px-7 py-3 text-sm sm:text-[15px] font-semibold text-neutral-800 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-400 hover:bg-neutral-50 active:scale-98 cursor-pointer"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Subtle Platform Proof Highlights */}
            <div className="mt-7 pt-4 border-t border-neutral-200/80 flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-medium text-neutral-600">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                Permanent Passports
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                Generational Lineage
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                Project Handover Packages
              </span>
            </div>

          </div>

          {/* RIGHT COLUMN: ProjectVerse Animated Illustration (42-45%) */}
          <div className="lg:col-span-5 flex items-center justify-center w-full mt-2 lg:mt-0">
            <HeroAnimation />
          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;
