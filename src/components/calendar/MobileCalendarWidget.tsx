import React, { useState, useMemo } from 'react';
import {
  X,
  Check,
  Calendar as CalendarIcon,
  Sun,
  Armchair,
  ArrowRight,
  Clock,
  Repeat,
  ChevronRight,
  ChevronsUpDown,
  CalendarDays,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Target,
  ExternalLink,
  Download,
  Link as LinkIcon,
  RefreshCw,
  Sliders,
  ChevronDown,
  Sparkles,
  Layers,
  ChevronLeft,
} from 'lucide-react';
import { UnifiedCalendarEvent } from '../UnifiedCalendarModal';
import { SteleItem, Commitment } from '../../types';

interface MobileCalendarWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  activeEvents: UnifiedCalendarEvent[];
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  academicEventsCount: number;
  tasksCount: number;
  opportunitiesCount: number;
  onCommitOpportunity?: (item: SteleItem) => void;
  onCompleteCommitment?: (cm: Commitment) => void;
  calendarSync: boolean;
  onToggleCalendarSync: (val: boolean) => void;
  onDownloadICS: () => void;
  onCopyWebCalFeed: () => void;
  onShowToast: (msg: string) => void;
  isDark: boolean;
  onSwitchToDesktopView?: () => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEKDAY_NAMES_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const MobileCalendarWidget: React.FC<MobileCalendarWidgetProps> = ({
  isOpen,
  onClose,
  activeEvents,
  selectedDate,
  onSelectDate,
  academicEventsCount,
  tasksCount,
  opportunitiesCount,
  onCommitOpportunity,
  onCompleteCommitment,
  calendarSync,
  onToggleCalendarSync,
  onDownloadICS,
  onCopyWebCalFeed,
  onShowToast,
  isDark,
  onSwitchToDesktopView,
}) => {
  // Parse currently selected date
  const parsedSelected = useMemo(() => {
    try {
      const parts = selectedDate.split('-');
      if (parts.length === 3) {
        return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      }
    } catch {
      // Fallback
    }
    return new Date();
  }, [selectedDate]);

  // Current viewed month & year
  const [currentYear, setCurrentYear] = useState<number>(() => parsedSelected.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(() => parsedSelected.getMonth());

  // Time & Repeat State matching screenshot
  const [timeRange, setTimeRange] = useState<string>('2:00 PM-3:00 PM');
  const [timePickerOpen, setTimePickerOpen] = useState(false);

  const [repeatRule, setRepeatRule] = useState<'weekday' | 'daily' | 'weekly' | 'none'>('weekday');
  const [repeatPickerOpen, setRepeatPickerOpen] = useState(false);

  // Stream filter for the mobile agenda section
  const [streamFilter, setStreamFilter] = useState<'all' | 'academic' | 'tasks' | 'opportunities'>('all');
  const [showSyncDrawer, setShowSyncDrawer] = useState(false);

  // Quick Preset Dates calculation (relative to real today or current reference)
  const presets = useMemo(() => {
    const now = new Date();
    // Use the reference anchor year if currently browsing demo
    const base = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Today
    const today = new Date(base);
    const todayISO = today.toISOString().split('T')[0];
    const todayDayShort = today.toLocaleDateString('en-US', { weekday: 'short' });

    // Tomorrow
    const tomorrow = new Date(base);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowISO = tomorrow.toISOString().split('T')[0];
    const tomorrowDayShort = tomorrow.toLocaleDateString('en-US', { weekday: 'short' });

    // This Weekend (Saturday)
    const weekend = new Date(base);
    const dow = weekend.getDay(); // 0 Sun, 6 Sat
    const daysUntilSat = (6 - dow + 7) % 7 || 7;
    weekend.setDate(weekend.getDate() + daysUntilSat);
    const weekendISO = weekend.toISOString().split('T')[0];
    const weekendDayShort = weekend.toLocaleDateString('en-US', { weekday: 'short' });

    // Next Week (Monday)
    const nextWeek = new Date(base);
    const daysUntilMon = (1 - dow + 7) % 7 || 7;
    nextWeek.setDate(nextWeek.getDate() + daysUntilMon);
    const nextWeekISO = nextWeek.toISOString().split('T')[0];
    const nextWeekDayShort = nextWeek.toLocaleDateString('en-US', { weekday: 'short' });

    return {
      today: { label: 'Today', dayShort: todayDayShort, iso: todayISO },
      tomorrow: { label: 'Tomorrow', dayShort: tomorrowDayShort, iso: tomorrowISO },
      weekend: { label: 'This Weekend', dayShort: weekendDayShort, iso: weekendISO },
      nextWeek: { label: 'Next Week', dayShort: nextWeekDayShort, iso: nextWeekISO },
    };
  }, []);

  // Format header banner text based on current selection
  const scheduleBannerText = useMemo(() => {
    try {
      const parts = selectedDate.split('-');
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      const dt = new Date(y, m, d);
      const monthShort = dt.toLocaleDateString('en-US', { month: 'short' });
      const dayNum = dt.getDate();
      const timeStr = timeRange.split('-')[0].trim();

      if (repeatRule === 'weekday') {
        return `Every weekday starting ${monthShort} ${dayNum} at ${timeStr}...`;
      }
      if (repeatRule === 'daily') {
        return `Daily starting ${monthShort} ${dayNum} at ${timeStr}...`;
      }
      if (repeatRule === 'weekly') {
        const weekday = dt.toLocaleDateString('en-US', { weekday: 'short' });
        return `Weekly on ${weekday} starting ${monthShort} ${dayNum} at ${timeStr}...`;
      }
      return `${dt.toLocaleDateString('en-US', { weekday: 'short' })}, ${monthShort} ${dayNum} at ${timeRange}`;
    } catch {
      return `Starting ${selectedDate} at ${timeRange}`;
    }
  }, [selectedDate, repeatRule, timeRange]);

  // Sub-caption underneath M T W T F S S: e.g. "Thu Feb 12 · 0 tasks"
  const selectedDateSubcaption = useMemo(() => {
    try {
      const parts = selectedDate.split('-');
      const dt = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      const weekday = dt.toLocaleDateString('en-US', { weekday: 'short' });
      const month = dt.toLocaleDateString('en-US', { month: 'short' });
      const day = dt.getDate();

      const dayEvents = activeEvents.filter((e) => e.date === selectedDate);
      const taskCount = dayEvents.filter((e) => e.sourceType === 'task').length;
      const oppCount = dayEvents.filter((e) => e.sourceType === 'opportunity').length;
      const acadCount = dayEvents.filter((e) => e.sourceType === 'academic').length;

      if (dayEvents.length === 0) {
        return `${weekday} ${month} ${day} · 0 tasks`;
      }
      const partsSummary = [];
      if (taskCount > 0) partsSummary.push(`${taskCount} task${taskCount > 1 ? 's' : ''}`);
      if (oppCount > 0) partsSummary.push(`${oppCount} radar`);
      if (acadCount > 0) partsSummary.push(`${acadCount} decree${acadCount > 1 ? 's' : ''}`);

      return `${weekday} ${month} ${day} · ${partsSummary.join(' · ')}`;
    } catch {
      return `${selectedDate} · 0 tasks`;
    }
  }, [selectedDate, activeEvents]);

  // Helper to check whether a calendar date satisfies the dashed circle indicator
  const isDashedDay = (dateStr: string, dt: Date) => {
    // If repeatRule is active and the day is on or after the selected date
    if (dateStr >= selectedDate) {
      const dayOfWeek = dt.getDay(); // 0 is Sun, 1-5 is Mon-Fri, 6 is Sat
      if (repeatRule === 'weekday') {
        return dayOfWeek >= 1 && dayOfWeek <= 5;
      }
      if (repeatRule === 'daily') {
        return true;
      }
      if (repeatRule === 'weekly') {
        const selDt = new Date(selectedDate);
        return dayOfWeek === selDt.getDay();
      }
    }
    // Alternatively, if there are scheduled deadlines on this date
    return activeEvents.some((e) => e.date === dateStr);
  };

  // Month 1 Grid (Current Month)
  const month1Cells = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    let startDayOfWeek = firstDay.getDay() - 1; // Mon = 0, Sun = 6
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevDaysInMonth = new Date(currentYear, currentMonth, 0).getDate();

    const cells: {
      dayNumber: number;
      dateStr: string;
      isCurrentMonth: boolean;
      dt: Date;
    }[] = [];

    // Leading days from previous month
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = prevDaysInMonth - i;
      const pMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const pYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${pYear}-${String(pMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: false,
        dt: new Date(pYear, pMonth, d),
      });
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: true,
        dt: new Date(currentYear, currentMonth, d),
      });
    }

    return cells;
  }, [currentYear, currentMonth]);

  // Month 2 (Subsequent Month, e.g. Mar 2026 in screenshot)
  const month2Meta = useMemo(() => {
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const monthName = MONTH_NAMES[nextMonth];

    const firstDay = new Date(nextYear, nextMonth, 1);
    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const daysInMonth = new Date(nextYear, nextMonth + 1, 0).getDate();

    const cells: {
      dayNumber: number;
      dateStr: string;
      dt: Date;
    }[] = [];

    // Up to 14 days of the next month for continuous flow
    const daysToShow = Math.min(14, daysInMonth);
    for (let d = 1; d <= daysToShow; d++) {
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({
        dayNumber: d,
        dateStr,
        dt: new Date(nextYear, nextMonth, d),
      });
    }

    return {
      monthName,
      year: nextYear,
      startDayOfWeek,
      cells,
    };
  }, [currentYear, currentMonth]);

  // Selected date events
  const selectedEvents = useMemo(() => {
    return activeEvents.filter((e) => {
      if (e.date !== selectedDate) return false;
      if (streamFilter === 'academic' && e.sourceType !== 'academic') return false;
      if (streamFilter === 'tasks' && e.sourceType !== 'task') return false;
      if (streamFilter === 'opportunities' && e.sourceType !== 'opportunity') return false;
      return true;
    });
  }, [activeEvents, selectedDate, streamFilter]);

  const handleSelectDay = (dateStr: string) => {
    onSelectDate(dateStr);
    try {
      const parts = dateStr.split('-');
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      if (m !== currentMonth || y !== currentYear) {
        setCurrentYear(y);
        setCurrentMonth(m);
      }
    } catch {
      // ignore
    }
  };

  const handleConfirm = () => {
    onShowToast(`Schedule confirmed: ${scheduleBannerText}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex flex-col justify-end sm:items-center sm:justify-center p-0 sm:p-4 android-popup-backdrop"
      onClick={onClose}
    >
      {/* Mobile Card / Sheet Container */}
      <div
        className="w-full max-w-[430px] rounded-t-[32px] sm:rounded-[32px] bg-[#FFFFFF] dark:bg-[#18181B] text-[#18181B] dark:text-[#F4F4F5] border border-black/10 dark:border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.35)] flex flex-col max-h-[92vh] overflow-hidden android-popup-widget relative select-none"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 20px 60px rgba(0,0,0,0.45), 0 0 1px rgba(0,0,0,0.2)',
        }}
      >
        {/* Top Grab Handle */}
        <div className="pt-2.5 pb-1 flex justify-center shrink-0">
          <div className="w-10 h-1.5 rounded-full bg-gray-300 dark:bg-white/20" />
        </div>

        {/* Top App Bar matching screenshot: [✕]   Date   [✓] */}
        <div className="flex items-center justify-between px-4 pt-1 pb-3 shrink-0">
          {/* Close Circular Button */}
          <button
            type="button"
            id="mobile-cal-close-btn"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/15 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Title */}
          <div className="flex items-center gap-1.5">
            <h2 className="text-[17px] font-bold text-gray-900 dark:text-white tracking-tight">
              Date
            </h2>
            {/* Discrete desktop mode switcher if accessible */}
            {onSwitchToDesktopView && (
              <button
                type="button"
                onClick={onSwitchToDesktopView}
                className="text-[11px] font-medium text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-1 py-0.5"
                title="Switch to PC Expanded View"
              >
                (PC)
              </button>
            )}
          </div>

          {/* Confirm Action Button: Accent Circular Checkmark */}
          <button
            type="button"
            id="mobile-cal-confirm-btn"
            onClick={handleConfirm}
            className="w-9 h-9 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
            aria-label="Confirm Date"
          >
            <Check className="w-5 h-5 stroke-[2.8]" />
          </button>
        </div>

        {/* Recurrence / Active Schedule Summary Banner */}
        <div className="px-4 pb-2.5 shrink-0">
          <div className="w-full bg-gray-100/90 dark:bg-white/6 rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-gray-800 dark:text-gray-200 border border-gray-200/50 dark:border-white/6 flex items-center justify-between truncate shadow-2xs">
            <span className="truncate">{scheduleBannerText}</span>
            {repeatRule !== 'none' && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)] ml-2 shrink-0">
                Active
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Body: Presets, Calendar Grid, and Time/Repeat Controls */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-4">
          {/* Quick Preset Jump Rows */}
          <div className="flex flex-col divide-y divide-gray-100 dark:divide-white/6 text-[14.5px]">
            {/* 1. Today */}
            <button
              type="button"
              id="cal-preset-today"
              onClick={() => handleSelectDay(presets.today.iso)}
              className={`w-full py-2.5 flex items-center justify-between transition-colors cursor-pointer text-left ${
                selectedDate === presets.today.iso
                  ? 'text-[var(--accent)] font-bold'
                  : 'text-gray-800 dark:text-gray-200 hover:text-gray-950 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 text-gray-700 dark:text-gray-300 shrink-0 flex items-center justify-center">
                  <CalendarDays className="w-4 h-4 stroke-[2.2]" />
                </div>
                <span className="font-medium">{presets.today.label}</span>
              </div>
              <span className="text-[13.5px] text-gray-400 dark:text-gray-500 font-normal">
                {presets.today.dayShort}
              </span>
            </button>

            {/* 2. Tomorrow */}
            <button
              type="button"
              id="cal-preset-tomorrow"
              onClick={() => handleSelectDay(presets.tomorrow.iso)}
              className={`w-full py-2.5 flex items-center justify-between transition-colors cursor-pointer text-left ${
                selectedDate === presets.tomorrow.iso
                  ? 'text-[var(--accent)] font-bold'
                  : 'text-gray-800 dark:text-gray-200 hover:text-gray-950 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 text-gray-700 dark:text-gray-300 shrink-0 flex items-center justify-center">
                  <Sun className="w-4 h-4 stroke-[2.2]" />
                </div>
                <span className="font-medium">{presets.tomorrow.label}</span>
              </div>
              <span className="text-[13.5px] text-gray-400 dark:text-gray-500 font-normal">
                {presets.tomorrow.dayShort}
              </span>
            </button>

            {/* 3. This Weekend */}
            <button
              type="button"
              id="cal-preset-weekend"
              onClick={() => handleSelectDay(presets.weekend.iso)}
              className={`w-full py-2.5 flex items-center justify-between transition-colors cursor-pointer text-left ${
                selectedDate === presets.weekend.iso
                  ? 'text-[var(--accent)] font-bold'
                  : 'text-gray-800 dark:text-gray-200 hover:text-gray-950 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 text-gray-700 dark:text-gray-300 shrink-0 flex items-center justify-center">
                  <Armchair className="w-4 h-4 stroke-[2.2]" />
                </div>
                <span className="font-medium">{presets.weekend.label}</span>
              </div>
              <span className="text-[13.5px] text-gray-400 dark:text-gray-500 font-normal">
                {presets.weekend.dayShort}
              </span>
            </button>

            {/* 4. Next Week */}
            <button
              type="button"
              id="cal-preset-nextweek"
              onClick={() => handleSelectDay(presets.nextWeek.iso)}
              className={`w-full py-2.5 flex items-center justify-between transition-colors cursor-pointer text-left ${
                selectedDate === presets.nextWeek.iso
                  ? 'text-[var(--accent)] font-bold'
                  : 'text-gray-800 dark:text-gray-200 hover:text-gray-950 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 text-gray-700 dark:text-gray-300 shrink-0 flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 stroke-[2.2]" />
                </div>
                <span className="font-medium">{presets.nextWeek.label}</span>
              </div>
              <span className="text-[13.5px] text-gray-400 dark:text-gray-500 font-normal">
                {presets.nextWeek.dayShort}
              </span>
            </button>
          </div>

          {/* Calendar Month Navigation & Grid */}
          <div className="pt-2">
            {/* Month & Year Title Bar with subtle arrow triggers */}
            <div className="flex items-center justify-between px-1 mb-1">
              <span className="text-[14px] font-bold text-gray-900 dark:text-white tracking-tight">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </span>
              <div className="flex items-center gap-1 text-gray-400">
                <button
                  type="button"
                  onClick={() => {
                    if (currentMonth === 0) {
                      setCurrentMonth(11);
                      setCurrentYear((y) => y - 1);
                    } else {
                      setCurrentMonth((m) => m - 1);
                    }
                  }}
                  className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-white/10"
                  aria-label="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (currentMonth === 11) {
                      setCurrentMonth(0);
                      setCurrentYear((y) => y + 1);
                    } else {
                      setCurrentMonth((m) => m + 1);
                    }
                  }}
                  className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-white/10"
                  aria-label="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Day of Week Headers: M  T  W  T  F  S  S */}
            <div className="grid grid-cols-7 text-center text-[12px] font-semibold text-gray-400 dark:text-gray-500 py-1">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((char, i) => (
                <div key={i}>{char}</div>
              ))}
            </div>

            {/* Sub-caption: e.g. "Thu Feb 12 · 0 tasks" */}
            <div className="text-center text-[11.5px] font-medium text-gray-400 dark:text-gray-500 pb-2">
              {selectedDateSubcaption}
            </div>

            {/* Month 1 Day Grid */}
            <div className="grid grid-cols-7 gap-y-2 text-center text-[13.5px]">
              {month1Cells.map((cell) => {
                const isSelected = cell.dateStr === selectedDate;
                const dashed = isDashedDay(cell.dateStr, cell.dt);
                const hasTask = activeEvents.some((e) => e.date === cell.dateStr);

                return (
                  <div
                    key={cell.dateStr}
                    onClick={() => handleSelectDay(cell.dateStr)}
                    className="flex flex-col items-center justify-center min-h-[36px] cursor-pointer"
                  >
                    {isSelected ? (
                      // Selected date: Solid Accent Circle
                      <div className="w-8 h-8 rounded-full bg-[var(--accent)] text-white font-bold flex items-center justify-center text-[14px] shadow-sm">
                        {cell.dayNumber}
                      </div>
                    ) : dashed ? (
                      // Recurring / active day: Dashed circle outline matching screenshot
                      <div className="w-8 h-8 rounded-full border border-dashed border-gray-400 dark:border-gray-500 text-gray-800 dark:text-gray-200 font-medium flex items-center justify-center text-[13.5px]">
                        {cell.dayNumber}
                      </div>
                    ) : (
                      // Standard day cell
                      <div
                        className={`w-8 h-8 flex flex-col items-center justify-center text-[13.5px] font-medium ${
                          cell.isCurrentMonth
                            ? 'text-gray-800 dark:text-gray-200 hover:text-gray-950 dark:hover:text-white'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      >
                        <span>{cell.dayNumber}</span>
                        {hasTask && (
                          <div className="w-1 h-1 rounded-full bg-[var(--accent)] -mt-0.5" />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Continuous Flow into Next Month matching screenshot (e.g. "Mar 2026") */}
            <div className="pt-4">
              <div className="text-[13px] font-bold text-gray-900 dark:text-white px-1 mb-2">
                {month2Meta.monthName} {month2Meta.year}
              </div>

              <div className="grid grid-cols-7 gap-y-2 text-center text-[13.5px]">
                {/* Empty slots for starting day of week */}
                {Array.from({ length: month2Meta.startDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-[36px]" />
                ))}

                {month2Meta.cells.map((cell) => {
                  const isSelected = cell.dateStr === selectedDate;
                  const dashed = isDashedDay(cell.dateStr, cell.dt);
                  const hasTask = activeEvents.some((e) => e.date === cell.dateStr);

                  return (
                    <div
                      key={cell.dateStr}
                      onClick={() => handleSelectDay(cell.dateStr)}
                      className="flex flex-col items-center justify-center min-h-[36px] cursor-pointer"
                    >
                      {isSelected ? (
                        <div className="w-8 h-8 rounded-full bg-[var(--accent)] text-white font-bold flex items-center justify-center text-[14px] shadow-sm">
                          {cell.dayNumber}
                        </div>
                      ) : dashed ? (
                        <div className="w-8 h-8 rounded-full border border-dashed border-gray-400 dark:border-gray-500 text-gray-800 dark:text-gray-200 font-medium flex items-center justify-center text-[13.5px]">
                          {cell.dayNumber}
                        </div>
                      ) : (
                        <div className="w-8 h-8 flex flex-col items-center justify-center text-[13.5px] font-medium text-gray-800 dark:text-gray-200 hover:text-gray-950 dark:hover:text-white">
                          <span>{cell.dayNumber}</span>
                          {hasTask && (
                            <div className="w-1 h-1 rounded-full bg-[var(--accent)] -mt-0.5" />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Settings matching screenshot: Time & Repeat rows */}
          <div className="pt-3 border-t border-gray-200 dark:border-white/10 space-y-1">
            {/* 1. Time Row */}
            <div>
              <div
                id="mobile-cal-time-row"
                onClick={() => setTimePickerOpen(!timePickerOpen)}
                className="w-full py-2.5 flex items-center justify-between text-[14px] text-gray-800 dark:text-gray-200 hover:text-gray-950 dark:hover:text-white cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <span className="font-semibold text-gray-900 dark:text-white">Time</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                  <span className="text-[13.5px] font-normal">{timeRange}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Time Selector Drawer */}
              {timePickerOpen && (
                <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/6 mb-2 space-y-1.5 animate-in slide-in-from-top-1 text-[13px]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 block px-1">
                    Select Time Window
                  </span>
                  {[
                    'All Day',
                    '9:00 AM-10:00 AM',
                    '2:00 PM-3:00 PM',
                    '4:30 PM-5:30 PM',
                    '6:00 PM-7:00 PM',
                  ].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        setTimeRange(slot);
                        setTimePickerOpen(false);
                      }}
                      className={`w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between cursor-pointer ${
                        timeRange === slot
                          ? 'bg-[var(--accent)]/15 text-[var(--accent)] font-bold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10'
                      }`}
                    >
                      <span>{slot}</span>
                      {timeRange === slot && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Repeat Row */}
            <div>
              <div
                id="mobile-cal-repeat-row"
                onClick={() => setRepeatPickerOpen(!repeatPickerOpen)}
                className="w-full py-2.5 flex items-center justify-between text-[14px] text-gray-800 dark:text-gray-200 hover:text-gray-950 dark:hover:text-white cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <RefreshCw className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <span className="font-semibold text-gray-900 dark:text-white">Repeat</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                  <span className="text-[13.5px] font-normal">
                    {repeatRule === 'weekday' && 'Every weekday (Mon - Fri)'}
                    {repeatRule === 'daily' && 'Daily'}
                    {repeatRule === 'weekly' && 'Weekly'}
                    {repeatRule === 'none' && 'Does not repeat'}
                  </span>
                  <ChevronsUpDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Repeat Selector Drawer */}
              {repeatPickerOpen && (
                <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/6 mb-2 space-y-1.5 animate-in slide-in-from-top-1 text-[13px]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 block px-1">
                    Select Recurrence Pattern
                  </span>
                  {[
                    { id: 'none', label: 'Does not repeat' },
                    { id: 'weekday', label: 'Every weekday (Mon - Fri)' },
                    { id: 'daily', label: 'Daily' },
                    { id: 'weekly', label: 'Weekly on this day' },
                  ].map((rule) => (
                    <button
                      key={rule.id}
                      type="button"
                      onClick={() => {
                        setRepeatRule(rule.id as any);
                        setRepeatPickerOpen(false);
                      }}
                      className={`w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between cursor-pointer ${
                        repeatRule === rule.id
                          ? 'bg-[var(--accent)]/15 text-[var(--accent)] font-bold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10'
                      }`}
                    >
                      <span>{rule.label}</span>
                      {repeatRule === rule.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ================= PRESERVED UNIFIED CALENDAR FEATURES ================= */}
          {/* Streams Filter Pills & Agenda Events Section */}
          <div className="pt-3 border-t border-gray-200 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Scheduled on {selectedDate}
              </span>
              <button
                type="button"
                onClick={() => setShowSyncDrawer(!showSyncDrawer)}
                className="text-[11.5px] font-semibold text-[var(--accent)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Export / Sync</span>
              </button>
            </div>

            {/* Quick Stream Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11.5px]">
              <button
                type="button"
                onClick={() => setStreamFilter('all')}
                className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                  streamFilter === 'all'
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xs'
                    : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                All ({activeEvents.filter((e) => e.date === selectedDate).length})
              </button>

              <button
                type="button"
                onClick={() => setStreamFilter('tasks')}
                className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                  streamFilter === 'tasks'
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xs'
                    : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Tasks ({activeEvents.filter((e) => e.date === selectedDate && e.sourceType === 'task').length})
              </button>

              <button
                type="button"
                onClick={() => setStreamFilter('opportunities')}
                className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                  streamFilter === 'opportunities'
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xs'
                    : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Radar ({activeEvents.filter((e) => e.date === selectedDate && e.sourceType === 'opportunity').length})
              </button>

              <button
                type="button"
                onClick={() => setStreamFilter('academic')}
                className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                  streamFilter === 'academic'
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xs'
                    : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Academic ({activeEvents.filter((e) => e.date === selectedDate && e.sourceType === 'academic').length})
              </button>
            </div>

            {/* Sync & ICS Drawer */}
            {showSyncDrawer && (
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/6 space-y-2 animate-in slide-in-from-top-2 text-[12px]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 dark:text-white">
                    External Calendar Subscriptions
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleCalendarSync(!calendarSync)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      calendarSync ? 'bg-[var(--accent)] text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {calendarSync ? 'Feed Active' : 'Enable Feed'}
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onDownloadICS}
                    className="flex-1 py-1.5 rounded-lg bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/15 text-gray-800 dark:text-gray-200 font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span>Download .ICS</span>
                  </button>
                  <button
                    type="button"
                    onClick={onCopyWebCalFeed}
                    className="flex-1 py-1.5 rounded-lg bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/15 text-gray-800 dark:text-gray-200 font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Copy WebCal</span>
                  </button>
                </div>
              </div>
            )}

            {/* List of Events for the chosen Date */}
            <div className="space-y-2 pt-1">
              {selectedEvents.length > 0 ? (
                selectedEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3 rounded-xl bg-gray-50 dark:bg-white/4 border border-gray-200/50 dark:border-white/6 flex flex-col gap-1.5 text-left"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono uppercase font-bold px-1.5 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                          {evt.category}
                        </span>
                        <h4 className="text-[13.5px] font-bold text-gray-900 dark:text-white mt-1 leading-snug">
                          {evt.title}
                        </h4>
                      </div>

                      {evt.time && (
                        <span className="text-[11px] font-mono text-gray-400 dark:text-gray-500 shrink-0 font-medium">
                          {evt.time}
                        </span>
                      )}
                    </div>

                    {evt.description && (
                      <p className="text-[11.5px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {evt.description}
                      </p>
                    )}

                    {/* Action button if task or opportunity */}
                    <div className="flex items-center justify-between pt-1 border-t border-gray-200/40 dark:border-white/4 mt-1">
                      <span className="text-[11px] text-gray-400">
                        {evt.sourceInstitution || 'Stele Faculty'}
                      </span>

                      {evt.sourceType === 'task' && evt.originalCommitment && (
                        <button
                          type="button"
                          onClick={() => {
                            if (onCompleteCommitment && evt.originalCommitment) {
                              onCompleteCommitment(evt.originalCommitment);
                              onShowToast(`Marked complete: ${evt.title}`);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 text-[11px] font-bold flex items-center gap-1 cursor-pointer active:scale-95 transition-transform"
                        >
                          <Check className="w-3 h-3 stroke-[2.5]" />
                          <span>Complete Task</span>
                        </button>
                      )}

                      {evt.sourceType === 'opportunity' && evt.originalItem && (
                        <button
                          type="button"
                          onClick={() => {
                            if (onCommitOpportunity && evt.originalItem) {
                              onCommitOpportunity(evt.originalItem);
                              onShowToast(`Committed to opportunity: ${evt.title}`);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[var(--accent)] hover:brightness-110 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer active:scale-95 transition-transform"
                        >
                          <span>Commit / Watch</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-[12.5px] text-gray-400 dark:text-gray-500 bg-gray-50/50 dark:bg-white/2 rounded-xl border border-dashed border-gray-200 dark:border-white/6">
                  No active deadlines on this date.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
