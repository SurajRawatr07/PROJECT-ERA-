import React, { useState } from 'react';

export const HeroAnimation: React.FC = () => {
  const [useFallbackGif, setUseFallbackGif] = useState(false);

  return (
    <div
      role="img"
      aria-label="Project Era animated academic collaboration illustration"
      className="relative w-full max-w-[480px] mx-auto select-none bg-transparent flex items-center justify-center"
    >
      {!useFallbackGif ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/assets/flexy-team-brainstorming.webp"
          onError={() => setUseFallbackGif(true)}
          className="w-full h-auto max-h-[300px] sm:max-h-[340px] object-contain bg-transparent mix-blend-multiply"
        >
          <source src="/assets/flexy-team-brainstorming.webm" type="video/webm" />
          <source src="/assets/flexy-team-brainstorming.mp4" type="video/mp4" />
          <img
            src="/assets/flexy-team-brainstorming.gif"
            alt="Team collaborating on an academic project"
            className="w-full h-auto max-h-[300px] sm:max-h-[340px] object-contain bg-transparent mix-blend-multiply"
            loading="eager"
          />
        </video>
      ) : (
        <img
          src="/assets/flexy-team-brainstorming.gif"
          alt="Team collaborating on an academic project"
          className="w-full h-auto max-h-[300px] sm:max-h-[340px] object-contain bg-transparent mix-blend-multiply"
          loading="eager"
        />
      )}
    </div>
  );
};

export default HeroAnimation;
