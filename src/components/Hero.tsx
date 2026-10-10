import React from 'react';
import { ArrowRight, Compass, FolderGit2, Users, BookOpen } from 'lucide-react';

interface HeroProps {
  onExploreProjectsClick: () => void;
  onGetStartedClick: () => void;
  isAuthenticated?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreProjectsClick,
  onGetStartedClick,
  isAuthenticated = false
}) => {
  return (
    <section className="relative w-full overflow-hidden px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-24 bg-white border-b border-neutral-200/80">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* LEFT COLUMN: Welcome to Project Era Copy & Primary Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
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
                <span className="absolute bottom-1 left-0 right-0 h-[3px] rounded bg-amber-200/90" />
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

            {/* Functional Buttons: Explore Projects & Get Started */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onExploreProjectsClick}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 sm:px-7 py-3.5 text-sm sm:text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-neutral-800 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
              >
                <Compass className="w-4 h-4 shrink-0" />
                <span>Explore Projects</span>
              </button>

              <button
                type="button"
                onClick={onGetStartedClick}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-neutral-300 px-6 sm:px-7 py-3.5 text-sm sm:text-[15px] font-semibold text-neutral-900 transition-colors duration-150 hover:border-neutral-400 hover:bg-neutral-50 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
              >
                <span>{isAuthenticated ? 'Go to Dashboard' : 'Get Started'}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>

            {/* Quiet Academic Continuity Summary */}
            <div className="mt-8 pt-6 border-t border-neutral-200/80 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-500">
              <span>Students · Faculty · HOD · Alumni</span>
              <span aria-hidden="true">·</span>
              <span>Immediate Project Publishing</span>
              <span aria-hidden="true">·</span>
              <span>Optional Faculty Review</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Clean Structured Academic Project Record Preview (No GIFs, No Floating Icons) */}
          <div className="lg:col-span-5 w-full">
            <div className="rounded-2xl bg-[#faf9f6] border border-neutral-200/90 p-5 sm:p-6 space-y-5">
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-neutral-200">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                    Academic Project Record
                  </div>
                  <h2 className="mt-1 font-display text-lg sm:text-xl font-semibold text-neutral-900 leading-snug">
                    Smart Campus Energy & Occupancy Monitor
                  </h2>
                  <div className="mt-1 text-xs text-neutral-500">
                    Computer Science & Engineering · 2025–2026
                  </div>
                </div>
              </div>

              {/* Core Project Pillars */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-white border border-neutral-200/90 flex items-start gap-3">
                  <FolderGit2 className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <div className="font-semibold text-neutral-900">
                      Publish Without Waiting for Approval
                    </div>
                    <p className="text-neutral-600 mt-0.5 leading-relaxed">
                      Create and publish projects directly. Faculty review is optional and tracked separately when requested.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-neutral-200/90 flex items-start gap-3">
                  <Users className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <div className="font-semibold text-neutral-900">
                      Team Collaboration & Role Scope
                    </div>
                    <p className="text-neutral-600 mt-0.5 leading-relaxed">
                      Organize teammates, responsibilities, milestones, and alumni mentorship in one shared record.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-neutral-200/90 flex items-start gap-3">
                  <BookOpen className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <div className="font-semibold text-neutral-900">
                      Handover & Generational Continuity
                    </div>
                    <p className="text-neutral-600 mt-0.5 leading-relaxed">
                      Preserve architecture notes and documentation so future cohorts can continue and evolve your work.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer link inside preview card */}
              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-neutral-500 font-mono">
                  Create → Build → Handover → Evolve
                </span>
                <button
                  type="button"
                  onClick={onExploreProjectsClick}
                  className="font-semibold text-neutral-900 hover:text-[#b45309] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Browse Directory →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
