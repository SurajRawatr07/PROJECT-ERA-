import React, { useState } from 'react';

/**
 * ProjectVerse Hero Animation
 * Exact Icons8 Flexy animation: "Team of developers brainstorming at laptop"
 * Reference: https://icons8.com/illustrations/illustration/flexy-team-of-developers-brainstorming-at-laptop--animated
 *
 * Implements high-performance, stutter-free playback with:
 * - Optimized WebM / MP4 video sources for 60fps vector-crisp rendering
 * - High-fidelity animated GIF fallback
 * - Clean BatchBro-inspired container with subtle border and restrained shadow
 * - Full responsive scaling on desktop, tablet, and mobile
 */
export const HeroAnimation: React.FC = () => {
  const [useFallbackGif, setUseFallbackGif] = useState(false);

  return (
    <div
      role="img"
      aria-label="Flexy: Team of developers brainstorming at laptop - animated illustration from Icons8"
      className="relative w-full max-w-[500px] sm:max-w-[540px] lg:max-w-[560px] mx-auto select-none"
    >
      {/* Subtle ambient warm backdrop glow */}
      <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-tr from-amber-500/10 via-orange-500/5 to-indigo-500/5 rounded-3xl blur-2xl pointer-events-none opacity-70" />

      {/* Main Container Card matching BatchBro aesthetic */}
      <div className="relative rounded-2xl sm:rounded-3xl border border-neutral-200/90 bg-white p-3.5 sm:p-5 shadow-xs backdrop-blur-xs overflow-hidden">
        
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(#111 1px, transparent 1px), radial-gradient(#111 1px, #fff 1px)',
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px',
          }}
        />

        {/* Top Mini Window Bar */}
        <div className="relative z-10 flex items-center justify-between border-b border-neutral-100 pb-2.5 mb-3 sm:mb-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-rose-400/90" />
            <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-amber-400/90" />
            <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-emerald-400/90" />
            <span className="ml-2 text-[10px] sm:text-[11px] font-mono font-medium text-neutral-400 tracking-wider">
              projectera://collaborate
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-[9px] sm:text-[10px] font-semibold text-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active Team</span>
          </div>
        </div>

        {/* Animation Display */}
        <div className="relative z-10 w-full flex items-center justify-center rounded-xl bg-neutral-50/50 overflow-hidden min-h-[260px] sm:min-h-[300px]">
          {!useFallbackGif ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              poster="/assets/flexy-team-brainstorming.webp"
              onError={() => setUseFallbackGif(true)}
              className="w-full h-auto max-h-[340px] sm:max-h-[380px] object-contain transition-transform duration-300"
            >
              <source src="/assets/flexy-team-brainstorming.webm" type="video/webm" />
              <source src="/assets/flexy-team-brainstorming.mp4" type="video/mp4" />
              {/* Fallback img tag inside video */}
              <img
                src="/assets/flexy-team-brainstorming.gif"
                alt="Flexy: Team of developers brainstorming at laptop"
                className="w-full h-auto max-h-[340px] sm:max-h-[380px] object-contain"
                loading="eager"
              />
            </video>
          ) : (
            <img
              src="/assets/flexy-team-brainstorming.gif"
              alt="Flexy: Team of developers brainstorming at laptop"
              className="w-full h-auto max-h-[340px] sm:max-h-[380px] object-contain"
              loading="eager"
            />
          )}
        </div>

        {/* Caption bar */}
        <div className="relative z-10 mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#e8860a]" />
            Brainstorm • Build • Ship
          </span>
          <span className="text-[10px] font-mono text-neutral-400">
            Icons8 Flexy
          </span>
        </div>

      </div>
    </div>
  );
};

export default HeroAnimation;
