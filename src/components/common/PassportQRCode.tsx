import React, { useMemo } from 'react';

interface PassportQRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

/**
 * Deterministic vector QR-style matrix generator
 * Produces crisp SVG modules with authentic position finder patterns
 * Zero external libraries needed; lightweight and razor-sharp on all screens
 */
export const PassportQRCode: React.FC<PassportQRCodeProps> = ({
  value,
  size = 140,
  className = ''
}) => {
  const matrix = useMemo(() => {
    const dimension = 21; // Standard Version 1 QR matrix size
    const grid: boolean[][] = Array.from({ length: dimension }, () =>
      Array(dimension).fill(false)
    );

    // Function to draw finder pattern (7x7 with 3x3 core)
    const drawFinder = (top: number, left: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (
            r === 0 ||
            r === 6 ||
            c === 0 ||
            c === 6 ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)
          ) {
            grid[top + r][left + c] = true;
          }
        }
      }
    };

    // Draw 3 primary corner finder patterns
    drawFinder(0, 0);
    drawFinder(0, dimension - 7);
    drawFinder(dimension - 7, 0);

    // Timing patterns
    for (let i = 8; i < dimension - 8; i++) {
      grid[6][i] = i % 2 === 0;
      grid[i][6] = i % 2 === 0;
    }

    // Deterministic pseudo-random payload pattern based on hash of string
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = (hash << 5) - hash + value.charCodeAt(i);
      hash |= 0;
    }

    let seed = Math.abs(hash) || 1234567;
    const lcg = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    // Populate data regions avoiding finder margins
    for (let r = 0; r < dimension; r++) {
      for (let c = 0; c < dimension; c++) {
        // Skip finder areas
        const isFinderTopLeft = r < 8 && c < 8;
        const isFinderTopRight = r < 8 && c >= dimension - 8;
        const isFinderBottomLeft = r >= dimension - 8 && c < 8;
        const isTiming = (r === 6 && c >= 8 && c < dimension - 8) || (c === 6 && r >= 8 && r < dimension - 8);

        if (!isFinderTopLeft && !isFinderTopRight && !isFinderBottomLeft && !isTiming) {
          // Center quiet area for center shield
          const isCenter = r >= 9 && r <= 11 && c >= 9 && c <= 11;
          if (!isCenter) {
            grid[r][c] = lcg() > 0.45;
          }
        }
      }
    }

    return grid;
  }, [value]);

  const dimension = matrix.length;
  const cellSize = 100 / dimension;

  return (
    <div 
      style={{ width: size, height: size }} 
      className={`relative inline-block bg-white p-2 rounded-xl border border-black/10 shadow-xs ${className}`}
      aria-label={`Passport QR Code for ${value}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        shapeRendering="crispEdges"
      >
        <rect width="100" height="100" fill="#ffffff" />
        {matrix.map((row, r) =>
          row.map((active, c) =>
            active ? (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize + 0.1}
                height={cellSize + 0.1}
                fill="#111111"
              />
            ) : null
          )
        )}
      </svg>
      {/* Center Micro Brand Seal */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-5 h-5 rounded-md bg-[#111111] text-white flex items-center justify-center text-[9px] font-bold shadow-xs">
          PV
        </div>
      </div>
    </div>
  );
};
