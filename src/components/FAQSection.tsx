import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'what-is-project-era',
    question: 'What is Project Era?',
    answer:
      'Project Era is a platform for organizing, discovering, sharing, and continuing academic projects within a college community.'
  },
  {
    id: 'who-can-use-project-era',
    question: 'Who can use Project Era?',
    answer:
      "The platform supports Student, Faculty, HOD, and Alumni roles, with access determined by the application's permissions."
  },
  {
    id: 'upload-without-review',
    question: 'Can I upload a project without faculty review?',
    answer:
      'Yes. Project upload and publishing must not require faculty review. Review is optional and must not block a project from being submitted or published.'
  },
  {
    id: 'explore-other-projects',
    question: 'Can I explore projects created by other users?',
    answer:
      'Yes, users can explore projects made available through the platform, subject to existing access and privacy rules.'
  },
  {
    id: 'collaborate-existing-project',
    question: 'Can I collaborate on an existing project?',
    answer:
      'Collaboration is available where supported by project membership and permission controls.'
  },
  {
    id: 'what-happens-when-graduates',
    question: 'What happens when a student graduates?',
    answer:
      'Project documentation and handover information can help future contributors continue a project, provided the relevant records remain available and authorized access is maintained.'
  },
  {
    id: 'replace-github',
    question: 'Does Project Era replace GitHub?',
    answer:
      'No. GitHub can continue to host source code. Project Era focuses on project discovery, academic context, collaboration, and project continuity.'
  },
  {
    id: 'how-to-get-started',
    question: 'How do I get started?',
    answer:
      'Register or sign in, complete your profile, and begin exploring or publishing projects.'
  }
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section
      id="faq"
      className="py-14 sm:py-18 lg:py-22 px-4 sm:px-6 lg:px-8 bg-white"
    >
      <div className="mx-auto max-w-3xl">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-2.5">
            Answers & Clarity
          </div>
          <h2
            style={{ textWrap: 'balance' }}
            className="font-display text-2xl sm:text-3xl md:text-4xl font-normal text-neutral-900 tracking-tight leading-[1.15]"
          >
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed">
            Everything you need to know about Project Era, project publishing, collaboration, and academic project continuity.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            const panelId = `faq-panel-${item.id}`;
            const buttonId = `faq-btn-${item.id}`;

            return (
              <div
                key={item.id}
                className="rounded-xl border border-neutral-200 bg-white transition-colors hover:border-neutral-300"
              >
                <button
                  id={buttonId}
                  type="button"
                  onClick={() => toggleFAQ(idx)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full items-center justify-between gap-4 p-4 sm:p-5 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 rounded-xl"
                >
                  <span className="font-display text-sm sm:text-base font-medium text-neutral-900">
                    {item.question}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                      isOpen
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="h-3.5 w-3.5" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" />
                    )}
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="border-t border-neutral-100 px-4 sm:px-5 pb-4 sm:pb-5 pt-3.5 text-xs sm:text-sm leading-relaxed text-neutral-600"
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
