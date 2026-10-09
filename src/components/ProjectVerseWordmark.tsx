import React from 'react';

export interface ProjectVerseWordmarkProps {
  height?: number;
  width?: number;
  theme?: 'light' | 'dark' | 'auto';
  color?: string;
  className?: string;
  interactiveHover?: boolean;
  id?: string;
  fontSize?: string;
  tracking?: string;
  weight?: string;
  wordSpacing?: string;
}

/**
 * Project Verse — Premium Editorial Serif Brand Wordmark
 *
 * Implements a modern display serif typography:
 * - Text: "Project Verse" (Title Case, natural space)
 * - font-family: 'DM Serif Display', Georgia, serif
 * - Visually strong, refined contrast, deep ink (#111111)
 * - Compact navbar sizing (16-18px mobile, 17-18px tablet, 18-20px desktop)
 * - Zero graphical logo icons or symbols
 * - Never wraps across lines (whitespace-nowrap)
 */
export const ProjectVerseWordmark: React.FC<ProjectVerseWordmarkProps> = ({
  color,
  className = '',
  interactiveHover = false,
  id = 'projectverse-wordmark',
  fontSize,
  wordSpacing = 'normal',
  tracking,
  weight,
}) => {
  const textColor = color || 'text-[#111111]';

  return (
    <span
      id={id}
      data-brand-display="true"
      style={{
        fontFamily: "'Fraunces', Georgia, serif",
        fontStyle: 'normal',
        wordSpacing,
        letterSpacing: tracking || '-0.02em',
        textRendering: 'optimizeLegibility',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        lineHeight: 1.1,
      }}
      className={`font-display inline-flex items-center select-none whitespace-nowrap leading-none antialiased subpixel-antialiased ${weight || 'font-normal'} ${textColor || 'text-[#1a2744]'} ${
        fontSize || 'text-[17px] min-[375px]:text-[18px] sm:text-[19px] md:text-[20px] lg:text-[21px]'
      } ${
        interactiveHover ? 'transition-colors duration-200 ease-out hover:text-[#e8860a] cursor-pointer' : ''
      } ${className}`}
      role="img"
      aria-label="Project Era"
    >
      Project Era
    </span>
  );
};

export default ProjectVerseWordmark;

