import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'What is Project Era?',
    answer:
      'Project Era is an academic project workspace for college communities that brings project planning, team coordination, task deadlines, documentation records, and faculty feedback into one organized platform.',
  },
  {
    question: 'Who can use Project Era?',
    answer:
      'Project Era is designed for four academic roles: Students, Faculty supervisors, Heads of Department (HODs), and Alumni mentors.',
  },
  {
    question: 'How do students manage their projects?',
    answer:
      'Students can create projects, define domains and technologies, add teammates with clear responsibilities, break milestones into tasks with due dates, and attach documentation records for review.',
  },
  {
    question: 'How can faculty review student projects?',
    answer:
      'Faculty members can view assigned student projects, inspect submitted documentation and milestone progress, post structured feedback, and update review statuses such as Approved or Revisions Requested.',
  },
  {
    question: 'What can HODs monitor?',
    answer:
      'HODs can view department-wide project summaries across every lifecycle stage, filter projects by department and status, identify delayed milestones or overdue tasks, and monitor pending academic reviews.',
  },
  {
    question: 'Can alumni support student teams?',
    answer:
      'Yes. Alumni can share their industry skills, offer technical mentoring sessions on active projects, and respond to student collaboration and guidance requests without receiving faculty grading privileges.',
  },
  {
    question: 'Is Project Era free to use?',
    answer:
      'This frontend preview of Project Era is freely accessible in your browser to explore role-specific dashboards and academic project workflows.',
  },
  {
    question: 'How do I create an account?',
    answer:
      'Click "Get Started" in the navigation bar, select your role (Student, Faculty, HOD, or Alumni), and complete the role-specific registration form.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section
      id="faq"
      className="py-14 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white"
    >
      <div className="mx-auto max-w-3xl">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2
            style={{ textWrap: 'balance' }}
            className="font-display text-2xl sm:text-3xl lg:text-4xl font-normal text-neutral-900 tracking-tight"
          >
            Frequently Asked Questions
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-neutral-600">
            Clear answers about roles, project workflows, and academic reviews on Project Era.
          </p>
        </div>

        <div className="space-y-2.5">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.question}
                className="rounded-xl border border-neutral-200 bg-white transition-colors hover:border-neutral-300"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(idx)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-4 sm:p-5 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 rounded-xl"
                >
                  <span className="font-display text-sm sm:text-base font-medium text-neutral-900">
                    {item.question}
                  </span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                      isOpen
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-neutral-100 px-4 sm:px-5 pb-4 sm:pb-5 pt-3 text-xs sm:text-sm leading-relaxed text-neutral-600">
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
