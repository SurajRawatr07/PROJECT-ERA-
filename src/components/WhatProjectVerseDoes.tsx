import React from 'react';
import {
  FolderPlus,
  Layers,
  Users,
  Award,
  ShieldCheck,
  FolderSync,
  GitFork,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { PearlButton } from './ui/pearl-button';

interface Step {
  num: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  tag: string;
}

const STEPS: Step[] = [
  {
    num: '01',
    title: 'Create',
    desc: 'Register permanent Project Passport (PV-YYYY-XXXXX) with domain, tech stack, repository, and initial DNA.',
    icon: FolderPlus,
    tag: 'Passport Genesis'
  },
  {
    num: '02',
    title: 'Build',
    desc: 'Develop modular architecture, maintain Architecture Decision Records (ADRs), and push repository commits.',
    icon: Layers,
    tag: 'Technical Foundation'
  },
  {
    num: '03',
    title: 'Collaborate',
    desc: 'Connect with peers and cross-campus teammates through transparent, explainable smart matching.',
    icon: Users,
    tag: 'Team Synergies'
  },
  {
    num: '04',
    title: 'Prove',
    desc: 'Generate factual contribution evidence: verified commits, merged PRs, resolved issues, and task sign-offs.',
    icon: Award,
    tag: 'Proof of Work'
  },
  {
    num: '05',
    title: 'Review',
    desc: 'Faculty mentors evaluate rubrics, add action items, and cryptographically certify academic project passports.',
    icon: ShieldCheck,
    tag: 'Academic Verification'
  },
  {
    num: '06',
    title: 'Handover',
    desc: 'Outgoing graduating teams prepare comprehensive Handover Packages: architecture, setup, known bugs, and gotchas.',
    icon: FolderSync,
    tag: 'Batch Transition'
  },
  {
    num: '07',
    title: 'Continue',
    desc: 'Continuity Engine prevents project death. Incoming cohorts inherit validated foundations without starting from zero.',
    icon: GitFork,
    tag: 'Project Continuity'
  },
  {
    num: '08',
    title: 'Evolve',
    desc: 'Project v2 is recorded into generational lineage while permanently preserving original contributor credits.',
    icon: Sparkles,
    tag: 'Multi-Batch Evolution'
  }
];

interface WhatProjectVerseDoesProps {
  onGetStarted?: () => void;
}

export const WhatProjectVerseDoes: React.FC<WhatProjectVerseDoesProps> = ({
  onGetStarted,
}) => {
  return (
    <section
      id="how-it-works"
      className="relative w-full py-14 sm:py-18 lg:py-22 px-4 sm:px-6 lg:px-8 bg-[#faf9f6] border-t border-neutral-200/80"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3.5 py-1 text-xs font-semibold tracking-wide text-neutral-700 uppercase mb-3.5 shadow-2xs">
            Complete Project Lifecycle
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-normal text-neutral-900 tracking-tight leading-[1.15]">
            From Genesis to Generational{' '}
            <span className="relative inline-block">
              <em className="text-[#e8860a] not-italic font-normal">Evolution</em>
            </span>
          </h2>
          <div className="mt-3 px-3 py-1 bg-amber-50 rounded-full inline-block border border-amber-200 text-xs font-mono font-bold text-amber-950">
            GitHub stores the code. ProjectVerse stores the project journey.
          </div>
          <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed font-body">
            Create → Build → Collaborate → Prove → Review → Handover → Continue → Evolve
          </p>
        </div>

        {/* 8 Connected Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                id={`how-it-works-step-${step.num}`}
                onClick={onGetStarted}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onGetStarted?.();
                  }
                }}
                className="group relative p-5 sm:p-6 rounded-3xl bg-white border border-neutral-200 hover:border-neutral-400 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-neutral-900"
              >
                <div>
                  {/* Top Row: Step Number & Icon */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="font-display text-xl sm:text-2xl font-light text-neutral-400 group-hover:text-neutral-900 transition-colors">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#F5F5F3] text-neutral-900 group-hover:bg-[#111111] group-hover:text-white flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Tag */}
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50/70 px-2.5 py-0.5 rounded-full inline-block mb-1.5 border border-amber-200/60">
                    {step.tag}
                  </span>
                  <h3 className="font-display text-lg font-bold text-neutral-900 tracking-tight">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-xs text-neutral-600 leading-relaxed font-body">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400 group-hover:text-neutral-900 transition-colors">
                  <span className="font-mono text-[11px]">Phase {step.num}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-10 p-6 rounded-3xl bg-neutral-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div>
            <h4 className="text-base font-bold text-white">
              Ready to give your project generational longevity?
            </h4>
            <p className="text-xs text-neutral-300 mt-0.5">
              Submit your project passport or inherit an existing codebase from a graduating cohort.
            </p>
          </div>

          <button
            onClick={onGetStarted}
            className="px-6 py-2.5 rounded-2xl bg-white text-neutral-950 font-semibold text-xs hover:bg-neutral-100 transition-all cursor-pointer shadow-xs shrink-0"
          >
            Get Started on ProjectVerse
          </button>
        </div>
      </div>
    </section>
  );
};
