import React, { forwardRef } from 'react';

export type PearlButtonVariant = 'primary' | 'dark' | 'pearl' | 'light' | 'secondary';
export type PearlButtonSize = 'sm' | 'md' | 'lg';

export interface PearlButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  children?: React.ReactNode;
  variant?: PearlButtonVariant;
  size?: PearlButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  showSparkle?: boolean;
  sparklePosition?: 'left' | 'right';
  className?: string;
}

export interface PearlLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  label?: string;
  children?: React.ReactNode;
  variant?: PearlButtonVariant;
  size?: PearlButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  showSparkle?: boolean;
  sparklePosition?: 'left' | 'right';
  className?: string;
}

/**
 * Interactive ✧ → ✦ sparkle transition element.
 * Smoothly morphs from hollow star (✧) to solid star (✦) on container hover.
 */
export const PearlSparkle: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex items-center justify-center w-3.5 h-3.5 select-none shrink-0 transition-transform duration-300 group-hover:scale-110 ${className}`}
    >
      <span className="absolute inset-0 flex items-center justify-center transition-all duration-200 opacity-100 group-hover:opacity-0 group-hover:scale-50 text-[13px] leading-none select-none font-sans">
        ✧
      </span>
      <span className="absolute inset-0 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 group-hover:scale-100 text-[13px] leading-none select-none font-sans">
        ✦
      </span>
    </span>
  );
};

const getVariantClass = (variant?: PearlButtonVariant | string): string => {
  switch (variant) {
    case 'dark':
    case 'primary':
      return 'pearl-btn-dark';
    case 'pearl':
    case 'light':
      return 'pearl-btn-light';
    case 'secondary':
      return 'pearl-btn-secondary';
    default:
      return 'pearl-btn-dark';
  }
};

const getSizeClass = (size?: PearlButtonSize | string): string => {
  switch (size) {
    case 'sm':
      return 'px-3.5 py-1.5 min-h-[34px] text-[12.5px] sm:text-[13px] gap-1.5';
    case 'lg':
      return 'px-6 py-3 sm:px-7 sm:py-3.5 min-h-[48px] text-[15px] sm:text-[16px] gap-2.5';
    case 'md':
    default:
      return 'px-5 py-2.5 min-h-[42px] text-[14px] sm:text-[14.5px] gap-2';
  }
};

/**
 * PearlButton: Reusable 3D glass/pearl interactive button with glossy highlights,
 * inner depth shadows, active press compression, and ✧ → ✦ sparkle transition.
 */
export const PearlButton = forwardRef<HTMLButtonElement, PearlButtonProps>(
  (
    {
      label,
      children,
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'right',
      showSparkle = false,
      sparklePosition = 'right',
      className = '',
      type = 'button',
      ...restProps
    },
    ref
  ) => {
    const variantClass = getVariantClass(variant);
    const sizeClass = getSizeClass(size);

    return (
      <button
        ref={ref}
        type={type}
        className={`group pearl-btn ${variantClass} ${sizeClass} ${className}`}
        {...restProps}
      >
        {/* Specular gloss highlight reflection */}
        <span className="pearl-gloss" aria-hidden="true" />

        {/* Content Container */}
        <span className="relative z-10 inline-flex items-center justify-center gap-2">
          {/* Left Sparkle if enabled */}
          {showSparkle && sparklePosition === 'left' && <PearlSparkle />}

          {/* Left Icon if specified */}
          {icon && iconPosition === 'left' && (
            <span className="shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5">
              {icon}
            </span>
          )}

          {/* Text Content: supports label or children */}
          <span>{label || children}</span>

          {/* Right Icon if specified */}
          {icon && iconPosition === 'right' && (
            <span className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">
              {icon}
            </span>
          )}

          {/* Right Sparkle if enabled */}
          {showSparkle && sparklePosition === 'right' && <PearlSparkle />}
        </span>
      </button>
    );
  }
);

PearlButton.displayName = 'PearlButton';

/**
 * PearlLink: Reusable semantic <a> anchor styled with the PearlButton
 * 3D luster and glass interaction system.
 */
export const PearlLink = forwardRef<HTMLAnchorElement, PearlLinkProps>(
  (
    {
      label,
      children,
      variant = 'pearl',
      size = 'md',
      icon,
      iconPosition = 'left',
      showSparkle = false,
      sparklePosition = 'right',
      className = '',
      target,
      rel,
      ...restProps
    },
    ref
  ) => {
    const variantClass = getVariantClass(variant);
    const sizeClass = getSizeClass(size);
    const safeRel = target === '_blank' && !rel ? 'noopener noreferrer' : rel;

    return (
      <a
        ref={ref}
        target={target}
        rel={safeRel}
        className={`group pearl-btn ${variantClass} ${sizeClass} ${className}`}
        {...restProps}
      >
        {/* Specular gloss highlight reflection */}
        <span className="pearl-gloss" aria-hidden="true" />

        {/* Content Container */}
        <span className="relative z-10 inline-flex items-center justify-center gap-2">
          {/* Left Sparkle if enabled */}
          {showSparkle && sparklePosition === 'left' && <PearlSparkle />}

          {/* Left Icon if specified */}
          {icon && iconPosition === 'left' && (
            <span className="shrink-0 transition-transform duration-200 group-hover:scale-105">
              {icon}
            </span>
          )}

          {/* Text Content */}
          <span>{label || children}</span>

          {/* Right Icon if specified */}
          {icon && iconPosition === 'right' && (
            <span className="shrink-0 transition-transform duration-200 group-hover:scale-105">
              {icon}
            </span>
          )}

          {/* Right Sparkle if enabled */}
          {showSparkle && sparklePosition === 'right' && <PearlSparkle />}
        </span>
      </a>
    );
  }
);

PearlLink.displayName = 'PearlLink';

export default PearlButton;
