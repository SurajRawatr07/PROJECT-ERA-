import React from 'react';

/**
 * StaticBackground
 * 
 * Permanent Pure White Theme Background (#ffffff)
 * - 100% static: No Three.js, no WebGL, no canvas, no shaders, no animations.
 * - Pure white base (#ffffff).
 * - Barely visible, extremely subtle neutral micro-grid.
 * - Positioned fixed behind all content (-z-10, pointer-events-none).
 */
export const StaticBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none bg-[#fdfaf4]"
    >
      {/* Subtle warm micro-grid on BatchBro ivory background */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(26, 39, 68, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(26, 39, 68, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  );
};

export default StaticBackground;
