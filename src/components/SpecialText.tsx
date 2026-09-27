import React, { useEffect, useState, useRef } from 'react';

interface SpecialTextProps {
  children: string;
  className?: string;
  speed?: number;
  delay?: number;
  as?: React.ElementType;
}

// Sophisticated letter pool for editorial typography (not cyberpunk symbols)
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export const SpecialText: React.FC<SpecialTextProps> = ({
  children,
  className = '',
  speed = 20,
  delay = 0,
  as: Component = 'span',
}) => {
  const targetText = typeof children === 'string' ? children : String(children ?? '');
  const [displayText, setDisplayText] = useState(targetText);
  const [isResolved, setIsResolved] = useState(false);
  const isCancelledRef = useRef(false);

  useEffect(() => {
    isCancelledRef.current = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const totalChars = targetText.length;
    // Total steps to smoothly transition from initial scramble to clean reveal
    const steps = Math.max(Math.floor(totalChars * 1.8), 36);

    const startAnimation = () => {
      let step = 0;
      intervalId = setInterval(() => {
        if (isCancelledRef.current) {
          if (intervalId) clearInterval(intervalId);
          return;
        }

        step++;
        // Calculate progress from 0 to 1
        const progress = Math.min(step / steps, 1);
        // Characters resolve sequentially from left to right while keeping word spacing
        const resolvedCount = Math.floor(progress * totalChars);

        const nextText = targetText
          .split('')
          .map((char, index) => {
            // Keep whitespace strictly intact so word wrapping and layouts stay rock solid
            if (char === ' ' || char === '\n' || char === '\t') {
              return char;
            }
            if (index < resolvedCount) {
              return char;
            }
            // Scrambled random characters for unrevealed letters
            const randomIndex = Math.floor(Math.random() * CHARS.length);
            return CHARS[randomIndex];
          })
          .join('');

        setDisplayText(nextText);

        if (progress >= 1) {
          if (intervalId) clearInterval(intervalId);
          setDisplayText(targetText);
          setIsResolved(true);
        }
      }, speed);
    };

    if (delay > 0) {
      timeoutId = setTimeout(() => {
        if (!isCancelledRef.current) {
          startAnimation();
        }
      }, delay);
    } else {
      startAnimation();
    }

    return () => {
      isCancelledRef.current = true;
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [targetText, speed, delay]);

  return (
    <Component className={className}>
      {isResolved ? targetText : displayText}
    </Component>
  );
};

export default SpecialText;
