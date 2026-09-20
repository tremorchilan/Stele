import React from 'react';
import { calculateTimeStatus } from '../utils/time';

interface CountdownBarProps {
  deadlineISO: string;
  isEngaged?: boolean;
}

export const CountdownBar: React.FC<CountdownBarProps> = ({ deadlineISO, isEngaged = false }) => {
  const status = calculateTimeStatus(deadlineISO);

  if (status.isMissed) {
    return (
      <div
        id={`bar-missed-${deadlineISO}`}
        className="w-full h-[3px] rounded-[2px] border-b border-dashed border-[var(--text-muted)] opacity-60 mt-3"
        title="Deadline passed (Missed)"
      />
    );
  }

  const fillPercent = Math.max(3, Math.min(100, Math.round(status.fractionRemaining * 100)));
  const fillColor = status.isRed ? 'var(--urgent)' : 'var(--text-muted)';
  const pulseClass = isEngaged && status.isCritical ? 'animate-critical-pulse' : '';

  return (
    <div
      id={`bar-track-${deadlineISO}`}
      className="w-full h-[3px] rounded-[2px] bg-[var(--rule-track)] overflow-hidden mt-3 relative"
    >
      <div
        className={`h-full rounded-[2px] transition-all duration-300 ${pulseClass}`}
        style={{
          width: `${fillPercent}%`,
          backgroundColor: fillColor,
        }}
      />
    </div>
  );
};
