import React from 'react';
import { ProjectVerseWordmark } from './ProjectVerseWordmark';

export interface ProjectVerseBrandProps {
  /** Size in pixels (compatibility prop) */
  logoSize?: number;
  /** Custom class for the container */
  className?: string;
  /** Color theme: 'light' (dark text), 'dark' (white text), or 'auto' (theme reactive) */
  theme?: 'light' | 'dark' | 'auto';
  /** Display mode (compatibility prop) */
  variant?: 'full' | 'logo-only' | 'wordmark-only';
  /** Collapsed sidebar mode */
  collapsed?: boolean;
  /** Custom text sizing class for wordmark */
  textSizeClassName?: string;
  /** Whether to apply interactive hover transitions */
  interactive?: boolean;
  /** Custom color override */
  color?: string;
  /** Custom letter-spacing override */
  tracking?: string;
  /** Custom font-weight override */
  weight?: string;
  /** Custom word-spacing override */
  wordSpacing?: string;
  /** Gap class (compatibility prop) */
  gapClassName?: string;
}

/**
 * Premium Project Verse Brand Identity Component
 *
 * Renders the editorial display serif wordmark:
 * "Project Verse" (DM Serif Display)
 *
 * - Zero logos, icons, or decorative symbols
 * - Modern high-contrast display serif typography
 * - Natural space between Project and Verse
 * - Never wraps across lines (whitespace-nowrap)
 */
export const ProjectVerseBrand: React.FC<ProjectVerseBrandProps> = ({
  className = '',
  theme = 'light',
  interactive = false,
  textSizeClassName,
  color,
  tracking,
  weight,
  wordSpacing,
}) => {
  return (
    <div
      className={`inline-flex items-center select-none whitespace-nowrap align-middle ${
        interactive ? 'transition-opacity duration-200 ease-out hover:opacity-75 cursor-pointer' : ''
      } ${className}`}
    >
      <ProjectVerseWordmark
        theme={theme}
        color={color}
        interactiveHover={false}
        fontSize={textSizeClassName}
        tracking={tracking}
        weight={weight}
        wordSpacing={wordSpacing}
      />
    </div>
  );
};

export default ProjectVerseBrand;
