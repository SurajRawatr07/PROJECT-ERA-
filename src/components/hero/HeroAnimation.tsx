import React, { useEffect, useState } from 'react';

export const HeroAnimation: React.FC = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div
      className="relative w-full flex items-center justify-center bg-transparent select-none overflow-hidden"
      aria-label="Project Era academic collaboration illustration"
    >
      <div className="relative w-full max-w-[460px] sm:max-w-[500px] lg:max-w-[540px] flex items-center justify-center bg-transparent">
        {prefersReducedMotion ? (
          <img
            src="/assets/flexy-team-brainstorming.webp"
            alt="Students and teammates collaborating on an academic project"
            className="w-full h-auto object-contain bg-transparent mix-blend-multiply"
            loading="eager"
          />
        ) : (
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/assets/flexy-team-brainstorming.webp"
            className="w-full h-auto object-contain bg-transparent mix-blend-multiply pointer-events-none"
          >
            <source src="/assets/flexy-team-brainstorming.webm" type="video/webm" />
            <source src="/assets/flexy-team-brainstorming.mp4" type="video/mp4" />
            <img
              src="/assets/flexy-team-brainstorming.gif"
              alt="Students and teammates collaborating on an academic project"
              className="w-full h-auto object-contain bg-transparent mix-blend-multiply"
            />
          </video>
        )}
      </div>
    </div>
  );
};

export default HeroAnimation;
