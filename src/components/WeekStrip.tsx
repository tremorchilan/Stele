import React, { useRef } from 'react';
import { Commitment } from '../types';
import { Calendar as CalendarIcon } from 'lucide-react';

interface WeekStripProps {
  commitments?: Commitment[];
  selectedDay?: number;
  onSelectDay?: (dayIndex: number) => void;
  onFlashNotch?: () => void;
  onOpenUnifiedCalendar?: () => void;
}

export const WeekStrip: React.FC<WeekStripProps> = ({
  selectedDay = 0,
  onSelectDay,
  onFlashNotch,
  onOpenUnifiedCalendar,
}) => {
  // 7-Day Week Strip matching the reference code
  const weekData = [
    { label: 'Wed', date: '12', dots: ['#E87A3D', '#E0A83A', '#E5484D'] },
    { label: 'Thu', date: '13', dots: ['#7A8595', '#E0A83A'] },
    { label: 'Fri', date: '14', dots: ['#E5484D'] },
    { label: 'Sat', date: '15', dots: ['#7A8595', '#E87A3D', '#E0A83A'] },
    { label: 'Sun', date: '16', dots: [] },
    { label: 'Mon', date: '17', dots: ['#7A8595'] },
    { label: 'Tue', date: '18', dots: ['#E0A83A', '#7A8595'] },
  ];

  // Ref for double-tap detection on mobile
  const lastTapRef = useRef<{ time: number; idx: number }>({ time: 0, idx: -1 });

  const handleDayClick = (idx: number) => {
    const now = Date.now();
    if (now - lastTapRef.current.time < 380 && lastTapRef.current.idx === idx) {
      // Double click / double tap registered!
      onOpenUnifiedCalendar?.();
      lastTapRef.current = { time: 0, idx: -1 };
      return;
    }
    lastTapRef.current = { time: now, idx };
    onSelectDay?.(idx);
    onFlashNotch?.();
  };

  return (
    <div
      className="week-strip items-center"
      id="weekStrip"
      onDoubleClick={() => onOpenUnifiedCalendar?.()}
      title="Double-click weekly ribbon to open Dedicated Unified Calendar (Academic + Tasks + Opportunities)"
    >
      {weekData.map((item, idx) => {
        const isToday = selectedDay === idx;
        return (
          <button
            key={item.label}
            className={`day ${isToday ? 'today' : ''}`}
            data-day={item.label}
            type="button"
            onClick={() => handleDayClick(idx)}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onOpenUnifiedCalendar?.();
            }}
            title={`${item.label} ${item.date} · Double-click to open Unified In-App Calendar`}
          >
            <span className="day-label">{item.label}</span>
            <span className="day-date">{item.date}</span>
            <div className="day-dots">
              {item.dots.map((color, dIdx) => (
                <span
                  key={dIdx}
                  className="dot"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </button>
        );
      })}

      {/* Subtle Unified Calendar Shortcut Trigger Button */}
      <button
        type="button"
        onClick={() => onOpenUnifiedCalendar?.()}
        className="shrink-0 ml-1 p-2 rounded-[14px] bg-[var(--card)]/60 hover:bg-[var(--card)] border border-[var(--rule-default)]/70 hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all cursor-pointer flex flex-col items-center justify-center gap-1 min-w-[36px] h-[52px]"
        title="Double-click ribbon or click here to open Unified Calendar"
        aria-label="Open Unified In-App Calendar"
      >
        <CalendarIcon className="w-3.5 h-3.5" />
        <span className="text-[8px] font-mono font-bold tracking-tight text-[var(--accent)] uppercase">
          2x
        </span>
      </button>
    </div>
  );
};
