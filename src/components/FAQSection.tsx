import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'What is ProjectVerse?',
    answer:
      'ProjectVerse is an open platform designed to make academic capstones, research projects, and developer prototypes permanently discoverable, verifiable, and continuable. Instead of student codebases disappearing upon graduation, ProjectVerse provides an immutable Project Passport, generational project lineage, and verified proofs of work across 140+ campuses.',
  },
  {
    question: 'Who can use ProjectVerse?',
    answer:
      'Anyone in the technical and academic ecosystem: undergraduate and graduate students, alumni in industry, faculty guides and advisors, department heads (HODs), as well as open-source developers and independent researchers.',
  },
  {
    question: 'What is Project Passport?',
    answer:
      'A Project Passport is a permanent, cryptographically signed digital identity issued to every project on ProjectVerse. It includes a unique persistent identifier (e.g. PV-2026-CS-8942), verified contributor attributions, faculty supervisor sign-offs, and live evidence links that can be verified by employers or graduate admissions committees.',
  },
  {
    question: 'What is Project Lineage?',
    answer:
      'Project Lineage is a generational continuation framework that allows incoming batches of students to fork, maintain, and upgrade projects completed by prior graduating classes. Original creators retain permanent citation and attribution, while new students tackle high-level challenges rather than reinventing the wheel each year.',
  },
  {
    question: 'How does verification work?',
    answer:
      'Verification utilizes a dual-key review workflow where official faculty advisors and department heads evaluate the project against standardized rubrics (technical feasibility, code quality, test coverage, and documentation). Once approved, a digital verification certificate and verification badge are attached to the project record.',
  },
  {
    question: 'Does ProjectVerse replace GitHub?',
    answer:
      'No. ProjectVerse complements GitHub, GitLab, and other code hosts. Your source code, commits, and pull requests remain on GitHub. ProjectVerse provides the academic attribution, inter-campus discovery, faculty evaluation, cross-batch inheritance, and institutional credential layer on top of your repositories.',
  },
  {
    question: 'Can students from different colleges collaborate?',
    answer:
      'Yes. ProjectVerse is completely borderless across institutions. Students from IITs, NITs, state universities, and private colleges can find one another through skill-based matching and form inter-collegiate teams on shared research initiatives.',
  },
  {
    question: 'Can alumni mentor students?',
    answer:
      'Absolutely. Alumni can register their industry expertise and mentor capstone teams from their alma mater or any other connected campus. They provide architectural reviews, production guidance, and can scout standout builders directly for engineering roles.',
  },
  {
    question: 'Who can academically verify a project?',
    answer:
      'Formal academic verification is performed exclusively by authorized faculty guides and Department Heads (HODs) who have verified institutional credentials. Industry mentors can also provide technical endorsements, but institutional verification requires designated academic authority.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="py-14 sm:py-18 lg:py-22 px-4 sm:px-6 lg:px-8 border-t border-neutral-200/80 bg-white">
      <div className="mx-auto max-w-3xl">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-neutral-100 px-3.5 py-1 text-xs font-semibold tracking-wide text-neutral-700 uppercase mb-3.5 shadow-2xs">
            Answers & Clarity
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-light text-neutral-900 tracking-tight leading-[1.15]">
            Frequently Asked{' '}
            <span className="relative inline-block">
              <em className="text-[#e8860a] not-italic font-normal">Questions</em>
              <span className="absolute bottom-1 left-0 right-0 h-[2.5px] rounded bg-[#fddfa0]"></span>
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed font-body">
            Everything you need to know about the ProjectVerse platform, verification system, and cross-batch collaboration.
          </p>
        </div>

        {/* BatchBro-style FAQ List */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-xl sm:rounded-2xl border border-neutral-200 bg-white transition-all duration-200 hover:border-neutral-300 shadow-2xs"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="flex w-full items-center justify-between gap-4 p-4 sm:p-5 text-left cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-[15px] sm:text-base md:text-[17px] font-medium text-neutral-900">
                    {item.question}
                  </span>
                  <div
                    className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
                      isOpen
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                    >
                      <div className="border-t border-neutral-100 p-4 sm:p-5 pt-3 sm:pt-3.5 text-xs sm:text-[13.5px] md:text-sm leading-relaxed text-neutral-600 font-body">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FAQSection;
