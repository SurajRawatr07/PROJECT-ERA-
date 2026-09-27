import React from 'react';
import { Compass, ArrowRight, ShieldCheck, Layers, GitFork } from 'lucide-react';

interface ExploreEcosystemBannerProps {
  onExploreClick: () => void;
}

/**
 * Editorial Ecosystem Preview Banner for ProjectVerse Homepage
 * BatchBro design styling:
 * - Generous spacing, warm white background, subtle border
 * - Clean cards highlighting ecosystem capabilities
 * - Contextual CTA "Explore the Project Ecosystem" that opens deliberate auth prompt
 */
export const ExploreEcosystemBanner: React.FC<ExploreEcosystemBannerProps> = ({
  onExploreClick,
}) => {
  return (
    <section className="relative w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-[#faf9f6] border-t border-neutral-200/80">
      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-2xl sm:rounded-3xl bg-white border border-neutral-200/90 p-6 sm:p-8 md:p-10 shadow-xs overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-[#faf9f6] px-3.5 py-1 text-xs font-semibold tracking-wide text-neutral-700 uppercase mb-3 shadow-2xs">
                <Compass className="w-3.5 h-3.5 text-neutral-800" />
                Discovery & Continuity
              </div>
              <h3 className="font-display text-2xl sm:text-3xl md:text-[34px] font-light text-neutral-900 tracking-tight leading-tight">
                Explore the Project{' '}
                <span className="relative inline-block">
                  <em className="text-[#e8860a] not-italic font-normal">Ecosystem</em>
                  <span className="absolute bottom-1 left-0 right-0 h-[2.5px] rounded bg-[#fddfa0]"></span>
                </span>
              </h3>
              <p className="mt-3 text-xs sm:text-sm md:text-[14.5px] text-neutral-600 leading-relaxed font-body">
                Browse verified capstones, multi-institutional research archives, and active open-source repositories. Connect with developers, mentors, and faculty leaders building the next generation of solutions.
              </p>

              {/* Ecosystem Metrics / Highlights */}
              <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs text-neutral-600 font-medium">
                <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-[#faf9f6] border border-neutral-200 text-[11px] sm:text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  Academic Verification
                </span>
                <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-[#faf9f6] border border-neutral-200 text-[11px] sm:text-xs">
                  <Layers className="w-3.5 h-3.5 text-neutral-700" />
                  Structured Passports
                </span>
                <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-[#faf9f6] border border-neutral-200 text-[11px] sm:text-xs">
                  <GitFork className="w-3.5 h-3.5 text-neutral-700" />
                  Project Lineage
                </span>
              </div>
            </div>

            {/* Clear Contextual CTA Button */}
            <div className="shrink-0 w-full md:w-auto">
              <button
                onClick={onExploreClick}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 px-6 py-3 text-sm sm:text-[15px] font-semibold text-white shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group active:scale-98"
              >
                <span>Explore the Project Ecosystem</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreEcosystemBanner;
