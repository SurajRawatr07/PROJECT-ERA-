import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  note?: string;
  icon?: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  note,
  icon: Icon,
  trend,
  trendPositive = true,
  className = ''
}) => {
  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-[#FBFBFA] border border-black/8 hover:border-black/15 transition-all shadow-2xs flex flex-col justify-between ${className}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-[11px] sm:text-xs font-mono-code uppercase font-semibold text-[#737373] tracking-wide">
          {label}
        </span>
        {Icon && (
          <div className="w-7 h-7 rounded-lg bg-black/4 flex items-center justify-center text-[#111111] shrink-0">
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      <div className="my-1">
        <p className="text-2xl sm:text-3xl font-bold font-display text-[#111111] tracking-tight leading-none">
          {value}
        </p>
      </div>

      {(note || trend) && (
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-black/4 text-xs">
          {trend && (
            <span
              className={`font-mono-code text-[11px] font-medium ${
                trendPositive ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              {trend}
            </span>
          )}
          {note && <span className="text-[#737373] text-[11px] truncate">{note}</span>}
        </div>
      )}
    </div>
  );
};
