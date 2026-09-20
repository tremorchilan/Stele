import React from 'react';
import { calculateTimeStatus } from '../utils/time';

interface CountdownRingProps {
  deadlineISO: string;
  size?: 'sm' | 'md' | 'lg';
  isEngaged?: boolean;
  showTextInside?: boolean;
}

export const CountdownRing: React.FC<CountdownRingProps> = ({
  deadlineISO,
  size = 'md',
  isEngaged = false,
  showTextInside = false,
}) => {
  const status = calculateTimeStatus(deadlineISO);

  const dimension = size === 'sm' ? 32 : size === 'md' ? 80 : 120;
  const strokeWidth = 3;
  const radius = (dimension - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Direction: Fills as deadline approaches (fractionElapsed 0 to 1)
  const offset = circumference * (1 - status.fractionElapsed);
  const strokeColor = status.isMissed
    ? 'var(--text-muted)'
    : status.isRed
    ? 'var(--urgent)'
    : 'var(--text-muted)';

  const pulseClass = isEngaged && status.isCritical ? 'animate-critical-pulse' : '';

  return (
    <div
      id={`ring-container-${size}`}
      className={`relative inline-flex items-center justify-center shrink-0 ${pulseClass}`}
      style={{ width: dimension, height: dimension }}
    >
      <svg
        width={dimension}
        height={dimension}
        className="-rotate-90 transform"
        viewBox={`0 0 ${dimension} ${dimension}`}
      >
        {/* Track circle */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          stroke="var(--rule-track)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={status.isMissed ? '3 3' : undefined}
        />
        {/* Progress circle (fills as deadline nears) */}
        {!status.isMissed && (
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        )}
      </svg>

      {showTextInside && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-1">
          <span
            className={`tabular-nums font-semibold tracking-tight ${
              size === 'lg' ? 'text-xl' : size === 'md' ? 'text-sm' : 'text-[10px]'
            }`}
            style={{ color: status.isMissed ? 'var(--text-muted)' : status.isRed ? 'var(--urgent)' : 'var(--text-primary)' }}
          >
            {status.label}
          </span>
          {size !== 'sm' && (
            <span className="text-[10px] text-[var(--text-muted)] tracking-wider uppercase">
              {status.isMissed ? 'Missed' : 'Remaining'}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
