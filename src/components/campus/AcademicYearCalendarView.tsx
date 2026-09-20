import React, { useState, useMemo } from 'react';
import { AcademicCalendarEvent, DispatchMessage } from '../../types';
import { MOCK_ACADEMIC_CALENDAR } from '../../data/academicCalendarData';
import { INITIAL_DISPATCH_MESSAGES } from '../../data/mockData';
import {
  Calendar as CalendarIcon,
  Download,
  Link,
  Check,
  Clock,
  AlertCircle,
  Coffee,
  GraduationCap,
  Sparkles,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  CalendarCheck,
  ShieldCheck,
  FileText,
  Bell,
  Eye,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface AcademicYearCalendarViewProps {
  onBack: () => void;
  onShowToast: (msg: string) => void;
  messages?: DispatchMessage[];
  onOpenDispatches?: () => void;
  onConvertToActionableTask?: (task: { title: string; deadline: string; points: number; channelName: string }) => void;
  onOpenUnifiedCalendar?: () => void;
  isDark: boolean;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const AcademicYearCalendarView: React.FC<AcademicYearCalendarViewProps> = ({
  onBack,
  onShowToast,
  messages = INITIAL_DISPATCH_MESSAGES,
  onOpenDispatches,
  onConvertToActionableTask,
  onOpenUnifiedCalendar,
  isDark,
}) => {
  // Calendar view mode: 'grid' (Tactile Month Calendar) | 'agenda' (Full Almanac List) | 'notices' (Official Notices Stream)
  const [viewStyle, setViewStyle] = useState<'grid' | 'agenda' | 'notices'>('grid');

  // Month navigation: default to September 2025 (Autumn Term Start)
  const [currentYear, setCurrentYear] = useState<number>(2025);
  const [currentMonth, setCurrentMonth] = useState<number>(8); // 8 = September (0-indexed)
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTerm, setSelectedTerm] = useState<string>('all');
  const [inAppSyncEnabled, setInAppSyncEnabled] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Selected date on calendar grid (YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState<string>('2025-09-01');

  // Filter official dispatches with timestamps
  const officialNotices = useMemo(() => {
    return messages
      .filter((m) => m.isOfficial || m.channelId === 'ch-circulars' || m.senderRole === 'authority' || m.senderRole === 'teacher')
      .map((m, idx) => {
        // Assign realistic dates within the academic year for calendar mapping
        const dateMapping = [
          '2025-09-19',
          '2025-09-18',
          '2025-09-16',
          '2025-09-12',
          '2025-09-01',
          '2025-10-15',
          '2025-11-03',
        ];
        const noticeDate = dateMapping[idx % dateMapping.length];
        return {
          ...m,
          calendarDate: noticeDate,
          fullTimestamp: `${noticeDate} · ${m.timestamp}`,
          referenceNumber: `REG-2025-0${idx + 1}/ACAD`,
        };
      });
  }, [messages]);

  // Filter events
  const filteredEvents = MOCK_ACADEMIC_CALENDAR.filter((evt) => {
    if (selectedCategory !== 'all' && evt.category !== selectedCategory) return false;
    if (selectedTerm !== 'all' && !evt.term.toLowerCase().includes(selectedTerm.toLowerCase())) return false;
    return true;
  });

  // Calendar navigation helpers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleJumpToToday = () => {
    // Jump to academic start month (September 2025)
    setCurrentYear(2025);
    setCurrentMonth(8);
    setSelectedDate('2025-09-19');
    onShowToast('Navigated to current academic session');
  };

  // Build the grid days for currentMonth and currentYear
  const calendarGrid = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    // getDay returns 0 for Sunday, 1 for Monday... we want Mon=0, Sun=6
    let startingDayOfWeek = firstDay.getDay() - 1;
    if (startingDayOfWeek === -1) startingDayOfWeek = 6;

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const cells = [];

    // Leading padding days from previous month
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const pDay = prevMonthDays - i;
      const pMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const pYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${pYear}-${String(pMonth + 1).padStart(2, '0')}-${String(pDay).padStart(2, '0')}`;
      cells.push({
        dayNumber: pDay,
        dateStr,
        isCurrentMonth: false,
      });
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: true,
      });
    }

    // Trailing days to fill 35 or 42 grid boxes
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let t = 1; t <= remaining; t++) {
      const nMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${nYear}-${String(nMonth + 1).padStart(2, '0')}-${String(t).padStart(2, '0')}`;
      cells.push({
        dayNumber: t,
        dateStr,
        isCurrentMonth: false,
      });
    }

    return cells;
  }, [currentYear, currentMonth]);

  // Find events on a specific date (including date spans)
  const getEventsForDate = (dateStr: string) => {
    return MOCK_ACADEMIC_CALENDAR.filter((evt) => {
      if (evt.date === dateStr) return true;
      if (evt.endDate && evt.date <= dateStr && evt.endDate >= dateStr) return true;
      return false;
    });
  };

  // Find notices on a specific date
  const getNoticesForDate = (dateStr: string) => {
    return officialNotices.filter((n) => n.calendarDate === dateStr);
  };

  // Selected date's events & notices
  const selectedDateEvents = useMemo(() => getEventsForDate(selectedDate), [selectedDate]);
  const selectedDateNotices = useMemo(() => getNoticesForDate(selectedDate), [selectedDate, officialNotices]);

  // Generate .ics calendar download
  const handleDownloadICS = () => {
    const formatDateToICS = (dateStr: string) => dateStr.replace(/-/g, '') + 'T090000Z';
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Stele Campus Federation//Academic Year Calendar 2025-2026//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:Stele Campus Academic Year 2025-2026',
      'X-WR-TIMEZONE:UTC',
      ...MOCK_ACADEMIC_CALENDAR.map((evt) => [
        'BEGIN:VEVENT',
        `UID:${evt.id}@stele.campus.federation`,
        `DTSTAMP:${formatDateToICS(new Date().toISOString().split('T')[0])}`,
        `DTSTART:${formatDateToICS(evt.date)}`,
        `DTEND:${formatDateToICS(evt.endDate || evt.date)}`,
        `SUMMARY:[${evt.category.toUpperCase()}] ${evt.title}`,
        `DESCRIPTION:${evt.description} (Term: ${evt.term})`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
      ].join('\r\n')),
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Stele_Academic_Year_2025_2026.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onShowToast('iCalendar (.ics) downloaded. Importable to Google, Apple & Outlook Calendars!');
  };

  const handleCopyWebcalLink = () => {
    const feedUrl = 'webcal://stele.campus.federation/calendar/academic-year-2025-2026.ics';
    navigator.clipboard?.writeText(feedUrl);
    setCopiedLink(true);
    onShowToast('Webcal subscription link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const getCategoryBadge = (category: AcademicCalendarEvent['category']) => {
    switch (category) {
      case 'off_day':
        return {
          label: 'Off-Day / Holiday',
          dot: 'bg-emerald-500',
          bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          icon: Coffee,
        };
      case 'exam':
        return {
          label: 'Examination Period',
          dot: 'bg-rose-500',
          bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
          icon: GraduationCap,
        };
      case 'deadline':
        return {
          label: 'Academic Cutoff',
          dot: 'bg-amber-500',
          bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          icon: Clock,
        };
      case 'recess':
        return {
          label: 'Campus Recess',
          dot: 'bg-purple-500',
          bg: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
          icon: Sparkles,
        };
      case 'milestone':
      default:
        return {
          label: 'Term Milestone',
          dot: 'bg-sky-500',
          bg: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
          icon: CalendarCheck,
        };
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header & Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[var(--rule-default)]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-[12px] bg-[var(--card)] border border-[var(--rule-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            aria-label="Back to Campus Hub"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent)] font-mono">
                Federation Registry &amp; Registrar Stream
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-[6px] bg-emerald-500/15 text-emerald-400 font-bold">
                Timetable Synced
              </span>
            </div>
            <h1 className="text-[22px] font-extrabold text-[var(--text-primary)] mt-0.5">
              Academic Year Calendar &amp; Official Decrees
            </h1>
          </div>
        </div>

        {/* Sync Actions & ICS Export */}
        <div className="flex flex-wrap items-center gap-2">
          {onOpenUnifiedCalendar && (
            <button
              type="button"
              onClick={onOpenUnifiedCalendar}
              className="px-3.5 py-1.5 rounded-[12px] bg-sky-500/15 border border-sky-500/35 text-sky-400 text-[12.5px] font-bold hover:bg-sky-500/25 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Open Unified Calendar with Academic Events, Tasks, and Opportunity Deadlines"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Open Unified Calendar</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleDownloadICS}
            className="px-3.5 py-1.5 rounded-[12px] bg-[var(--accent)] text-white text-[12.5px] font-bold hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Download iCalendar format (.ics) to export to Google Calendar or Apple Calendar"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export .ics Calendar</span>
          </button>

          <button
            type="button"
            onClick={handleCopyWebcalLink}
            className="px-3 py-1.5 rounded-[12px] bg-[var(--card)] border border-[var(--rule-default)] text-[var(--text-primary)] hover:border-[var(--accent)] text-[12.5px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Copy subscription webcal URL"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Link className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied' : 'Webcal Sync'}</span>
          </button>
        </div>
      </div>

      {/* 3-Way Synchronization Assurance Strip */}
      <div className="p-3.5 px-4 rounded-[18px] bg-[var(--card)] border border-[var(--rule-default)] grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[10px] bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[12px] font-bold text-[var(--text-primary)] block">
              1. Class Timetable Pauses
            </span>
            <span className="text-[11px] text-[var(--text-secondary)]">
              Lectures automatically suppress on off-days &amp; exam fixtures.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[10px] bg-sky-500/15 text-sky-400 flex items-center justify-center shrink-0">
            <CalendarCheck className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-[var(--text-primary)]">
                2. In-App Personal Board
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] bg-emerald-500/20 text-emerald-400">
                Live Active
              </span>
            </div>
            <span className="text-[11px] text-[var(--text-secondary)]">
              Commitments align with registrar evaluation dates.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[10px] bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[12px] font-bold text-[var(--text-primary)] block">
              3. Time-Stamped Circulars
            </span>
            <span className="text-[11px] text-[var(--text-secondary)]">
              Official circulars synchronized directly from Calm Dispatch.
            </span>
          </div>
        </div>
      </div>

      {/* Main View Mode Selector: Month Grid vs Agenda Almanac vs Official Notices */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-[14px] bg-[var(--card)] border border-[var(--rule-default)]">
          <button
            type="button"
            onClick={() => setViewStyle('grid')}
            className={`px-3.5 py-1.5 rounded-[10px] text-[12.5px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewStyle === 'grid'
                ? 'bg-[var(--accent)] text-white shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Interactive Month Grid</span>
          </button>

          <button
            type="button"
            onClick={() => setViewStyle('agenda')}
            className={`px-3.5 py-1.5 rounded-[10px] text-[12.5px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewStyle === 'agenda'
                ? 'bg-[var(--accent)] text-white shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Full Year Almanac</span>
          </button>

          <button
            type="button"
            onClick={() => setViewStyle('notices')}
            className={`px-3.5 py-1.5 rounded-[10px] text-[12.5px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewStyle === 'notices'
                ? 'bg-[var(--accent)] text-white shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Official Notices ({officialNotices.length})</span>
          </button>
        </div>

        {/* Legend Pills */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-[var(--text-secondary)]">
          <span className="flex items-center gap-1 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Off-Days
          </span>
          <span className="flex items-center gap-1 font-medium">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Exams
          </span>
          <span className="flex items-center gap-1 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Cutoffs
          </span>
          <span className="flex items-center gap-1 font-medium">
            <span className="w-2 h-2 rounded-full bg-purple-500" /> Recesses
          </span>
          <span className="flex items-center gap-1 font-medium">
            <span className="w-2 h-2 rounded-full bg-sky-500" /> Circulars
          </span>
        </div>
      </div>

      {/* VIEW 1: INTERACTIVE MONTH GRID (Authentic Calendrical Experience) */}
      {viewStyle === 'grid' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Month Grid (7 cols on lg) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* Month Header with Controls */}
            <div className="p-4 rounded-[20px] bg-[var(--card)] border border-[var(--rule-default)] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-2 rounded-[10px] hover:bg-[var(--canvas)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                  aria-label="Previous Month"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-[18px] font-extrabold text-[var(--text-primary)] tracking-tight">
                  {MONTH_NAMES[currentMonth]} {currentYear}
                </h2>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-2 rounded-[10px] hover:bg-[var(--canvas)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                  aria-label="Next Month"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleJumpToToday}
                  className="px-3 py-1.5 rounded-[10px] bg-[var(--canvas)] border border-[var(--rule-default)] hover:border-[var(--accent)] text-[12px] font-semibold text-[var(--text-primary)] transition-all cursor-pointer"
                >
                  Session Start
                </button>

                <select
                  value={`${currentYear}-${currentMonth}`}
                  onChange={(e) => {
                    const [y, m] = e.target.value.split('-').map(Number);
                    setCurrentYear(y);
                    setCurrentMonth(m);
                  }}
                  className="p-1.5 px-2 rounded-[10px] bg-[var(--canvas)] border border-[var(--rule-default)] text-[12px] text-[var(--text-primary)] outline-none cursor-pointer"
                >
                  <option value="2025-8">September 2025 (Term Start)</option>
                  <option value="2025-9">October 2025 (Recess)</option>
                  <option value="2025-10">November 2025 (Mid-Terms)</option>
                  <option value="2025-11">December 2025 (Finals)</option>
                  <option value="2026-0">January 2026 (Spring Start)</option>
                  <option value="2026-1">February 2026 (Festivals)</option>
                  <option value="2026-2">March 2026 (Mid-Terms)</option>
                  <option value="2026-3">April 2026 (Spring Break)</option>
                  <option value="2026-4">May 2026 (Comprehensive)</option>
                </select>
              </div>
            </div>

            {/* Calendar Table Grid */}
            <div className="p-4 rounded-[22px] bg-[var(--card)] border border-[var(--rule-default)] shadow-xs">
              {/* Day of Week Headers */}
              <div className="grid grid-cols-7 gap-1 pb-2 border-b border-[var(--rule-default)]/60 text-center">
                {DAYS_OF_WEEK.map((day, idx) => (
                  <div
                    key={day}
                    className={`text-[11.5px] font-mono font-bold uppercase tracking-wider py-1 ${
                      idx >= 5 ? 'text-rose-400/80' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Day Cells Grid */}
              <div className="grid grid-cols-7 gap-1 pt-2">
                {calendarGrid.map((cell) => {
                  const isSelected = selectedDate === cell.dateStr;
                  const dayEvents = getEventsForDate(cell.dateStr);
                  const dayNotices = getNoticesForDate(cell.dateStr);
                  const hasHoliday = dayEvents.some((e) => e.category === 'off_day');
                  const hasExam = dayEvents.some((e) => e.category === 'exam');
                  const hasRecess = dayEvents.some((e) => e.category === 'recess');
                  const hasDeadline = dayEvents.some((e) => e.category === 'deadline');
                  const hasNotice = dayNotices.length > 0;

                  return (
                    <div
                      key={cell.dateStr}
                      onClick={() => setSelectedDate(cell.dateStr)}
                      className={`min-h-[72px] sm:min-h-[82px] p-1.5 sm:p-2 rounded-[14px] transition-all cursor-pointer flex flex-col justify-between border ${
                        isSelected
                          ? 'border-[var(--accent)] ring-2 ring-[var(--accent)]/30 bg-[var(--accent)]/10 shadow-xs'
                          : cell.isCurrentMonth
                          ? 'border-[var(--rule-default)]/40 hover:border-[var(--accent)]/60 bg-[var(--card)] hover:bg-[var(--canvas)]'
                          : 'border-transparent opacity-30 hover:opacity-70 bg-transparent'
                      }`}
                    >
                      {/* Top Day Number Row */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[12.5px] font-bold font-mono leading-none ${
                            isSelected
                              ? 'text-[var(--accent)]'
                              : cell.isCurrentMonth
                              ? 'text-[var(--text-primary)]'
                              : 'text-[var(--text-muted)]'
                          }`}
                        >
                          {cell.dayNumber}
                        </span>

                        {hasNotice && (
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-sky-400 ring-2 ring-sky-400/30"
                            title="Official circular posted on this date"
                          />
                        )}
                      </div>

                      {/* Event Dots and Indicators */}
                      <div className="flex flex-col gap-1 mt-1">
                        {dayEvents.slice(0, 2).map((evt) => {
                          const badge = getCategoryBadge(evt.category);
                          return (
                            <div
                              key={evt.id}
                              className="text-[9.5px] font-semibold px-1 py-0.5 rounded-[4px] truncate leading-tight flex items-center gap-1"
                              style={{
                                backgroundColor:
                                  evt.category === 'off_day'
                                    ? 'rgba(16, 185, 129, 0.15)'
                                    : evt.category === 'exam'
                                    ? 'rgba(244, 63, 94, 0.15)'
                                    : evt.category === 'deadline'
                                    ? 'rgba(245, 158, 11, 0.15)'
                                    : 'rgba(147, 51, 234, 0.15)',
                                color:
                                  evt.category === 'off_day'
                                    ? '#34d399'
                                    : evt.category === 'exam'
                                    ? '#fb7185'
                                    : evt.category === 'deadline'
                                    ? '#fbbf24'
                                    : '#c084fc',
                              }}
                              title={evt.title}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${badge.dot}`} />
                              <span className="truncate hidden sm:inline">{evt.title}</span>
                            </div>
                          );
                        })}

                        {dayEvents.length > 2 && (
                          <span className="text-[9px] font-bold text-[var(--text-muted)] pl-1">
                            +{dayEvents.length - 2} more
                          </span>
                        )}

                        {dayEvents.length === 0 && hasNotice && (
                          <div className="text-[9.5px] font-semibold px-1 py-0.5 rounded-[4px] bg-sky-500/15 text-sky-400 truncate leading-tight">
                            Circular #{dayNotices[0].referenceNumber.slice(0, 10)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Side Day Inspector Panel (4 cols on lg) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="p-5 rounded-[22px] bg-[var(--card)] border border-[var(--rule-default)] shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--rule-default)]">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent)] font-mono">
                    Day Fixture Inspector
                  </span>
                  <h3 className="text-[17px] font-extrabold text-[var(--text-primary)] mt-0.5">
                    {new Date(selectedDate + 'T00:00:00').toLocaleDateString(undefined, {
                      weekday: 'short',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </h3>
                </div>
                <div className="p-2 rounded-[12px] bg-[var(--canvas)] border border-[var(--rule-default)]">
                  <CalendarIcon className="w-4 h-4 text-[var(--accent)]" />
                </div>
              </div>

              {/* Day Events List */}
              <div className="mt-4 space-y-3">
                {selectedDateEvents.length > 0 ? (
                  selectedDateEvents.map((evt) => {
                    const badge = getCategoryBadge(evt.category);
                    const BadgeIcon = badge.icon;
                    return (
                      <div
                        key={evt.id}
                        className="p-3.5 rounded-[16px] bg-[var(--canvas)] border border-[var(--rule-default)] flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[10.5px] font-bold px-2 py-0.5 rounded-[6px] border flex items-center gap-1 ${badge.bg}`}
                          >
                            <BadgeIcon className="w-3 h-3" />
                            <span>{badge.label}</span>
                          </span>

                          {evt.affectsTimetable && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] bg-rose-500/15 text-rose-400">
                              Timetable Suspended
                            </span>
                          )}
                        </div>

                        <h4 className="text-[14px] font-bold text-[var(--text-primary)] leading-snug">
                          {evt.title}
                        </h4>
                        <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
                          {evt.description}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 rounded-[16px] bg-[var(--canvas)] border border-[var(--rule-default)] text-center text-[var(--text-muted)] text-[12.5px]">
                    No statutory off-days or exams scheduled for this date.
                  </div>
                )}
              </div>

              {/* Time-Stamped Official Notices Extracted for Selected Date */}
              <div className="mt-5 pt-4 border-t border-[var(--rule-default)]">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[12px] font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                    <span>Time-Stamped Official Dispatches</span>
                  </span>
                  <span className="text-[10.5px] font-mono font-bold text-[var(--accent)]">
                    {selectedDateNotices.length} Recorded
                  </span>
                </div>

                {selectedDateNotices.length > 0 ? (
                  <div className="space-y-2.5">
                    {selectedDateNotices.map((notice) => (
                      <div
                        key={notice.id}
                        className="p-3 rounded-[14px] bg-sky-500/10 border border-sky-500/20 flex flex-col gap-1.5"
                      >
                        <div className="flex items-center justify-between text-[10.5px]">
                          <span className="font-bold text-sky-400 font-mono">
                            {notice.referenceNumber}
                          </span>
                          <span className="text-[var(--text-secondary)] font-mono">
                            {notice.timestamp}
                          </span>
                        </div>
                        <span className="text-[11.5px] font-bold text-[var(--text-primary)]">
                          {notice.senderName}
                        </span>
                        <p className="text-[11.5px] text-[var(--text-secondary)] line-clamp-2">
                          {notice.content}
                        </p>

                        {notice.actionableTask && (
                          <div className="mt-1 flex items-center justify-between pt-1.5 border-t border-sky-500/20">
                            <span className="text-[10.5px] text-amber-400 font-semibold truncate max-w-[170px]">
                              Task: {notice.actionableTask.title}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                onConvertToActionableTask?.({
                                  title: notice.actionableTask!.title,
                                  deadline: notice.actionableTask!.deadline,
                                  points: notice.actionableTask!.points,
                                  channelName: 'Central Circulars',
                                });
                                onShowToast('Actionable task committed to Sovereign Board!');
                              }}
                              className="text-[10.5px] font-bold px-2 py-0.5 rounded-[6px] bg-[var(--accent)] text-white hover:opacity-90 cursor-pointer"
                            >
                              Commit +{notice.actionableTask.points}p
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[12px] text-[var(--text-muted)] italic">
                    No decrees or circulars promulgated on this date.
                  </p>
                )}
              </div>

              {/* Quick Jump to Calm Dispatch button */}
              <div className="mt-4 pt-3 border-t border-[var(--rule-default)] flex justify-end">
                <button
                  type="button"
                  onClick={onOpenDispatches}
                  className="text-[12px] font-bold text-[var(--accent)] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Full Calm Dispatch Stream</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: FULL YEAR ALMANAC LIST (Original Detailed View) */}
      {viewStyle === 'agenda' && (
        <div className="space-y-4">
          {/* Term Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-[16px] bg-[var(--card)] border border-[var(--rule-default)]">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'All Fixtures' },
                { id: 'off_day', label: 'Off-Days & Holidays' },
                { id: 'exam', label: 'Exam Periods' },
                { id: 'deadline', label: 'Academic Deadlines' },
                { id: 'recess', label: 'Recesses' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-[10px] text-[12px] font-bold transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[var(--accent)] text-white shadow-xs'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="p-1.5 px-2.5 rounded-[10px] bg-[var(--canvas)] border border-[var(--rule-default)] text-[12px] text-[var(--text-primary)] outline-none cursor-pointer"
            >
              <option value="all">Full Academic Year (2025–2026)</option>
              <option value="fall">Fall Term 2025</option>
              <option value="spring">Spring Term 2026</option>
              <option value="summer">Summer 2026</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredEvents.map((evt) => {
              const badge = getCategoryBadge(evt.category);
              const BadgeIcon = badge.icon;
              const isDateRange = evt.endDate && evt.endDate !== evt.date;

              return (
                <div
                  key={evt.id}
                  className="p-4 sm:p-5 rounded-[18px] bg-[var(--card)] border border-[var(--rule-default)] hover:border-[var(--accent)]/40 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-[14px] bg-[var(--canvas)] border border-[var(--rule-default)] flex flex-col items-center justify-center shrink-0 text-center">
                      <span className="text-[10px] uppercase font-bold text-[var(--accent)] leading-tight">
                        {new Date(evt.date + 'T00:00:00').toLocaleDateString(undefined, { month: 'short' })}
                      </span>
                      <span className="text-[16px] font-extrabold font-mono text-[var(--text-primary)] leading-none">
                        {new Date(evt.date + 'T00:00:00').getDate()}
                      </span>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-[6px] border flex items-center gap-1 ${badge.bg}`}
                        >
                          <BadgeIcon className="w-3 h-3" />
                          <span>{badge.label}</span>
                        </span>
                        <span className="text-[11.5px] font-mono text-[var(--text-secondary)]">
                          {evt.term}
                        </span>
                        {evt.affectsTimetable && (
                          <span className="text-[10.5px] font-bold px-1.5 py-0.5 rounded-[4px] bg-amber-500/15 text-amber-400">
                            Class Schedule Suspended
                          </span>
                        )}
                      </div>

                      <h3 className="text-[16px] font-bold text-[var(--text-primary)]">
                        {evt.title}
                      </h3>

                      <p className="text-[12.5px] text-[var(--text-secondary)] mt-1 max-w-2xl leading-relaxed">
                        {evt.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-[var(--rule-default)]">
                    <span className="text-[11px] uppercase tracking-wider text-[var(--text-secondary)] block font-medium">
                      Calendar Span
                    </span>
                    <span className="text-[13px] font-bold text-[var(--text-primary)] font-mono">
                      {isDateRange
                        ? `${new Date(evt.date + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${new Date(evt.endDate! + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
                        : new Date(evt.date + 'T00:00:00').toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-[11px] text-emerald-400 flex sm:justify-end items-center gap-1 mt-0.5 font-medium">
                      <Check className="w-3 h-3" /> Synchronized
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: TIME-STAMPED OFFICIAL NOTICES EXTRACTED FROM CALM DISPATCH */}
      {viewStyle === 'notices' && (
        <div className="space-y-4">
          <div className="p-4 rounded-[18px] bg-[var(--card)] border border-[var(--rule-default)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 font-mono">
                  Sovereign Dispatch Ledger
                </span>
              </div>
              <h2 className="text-[18px] font-extrabold text-[var(--text-primary)] mt-0.5">
                Time-Stamped Official Decrees &amp; Administrative Circulars
              </h2>
              <p className="text-[12.5px] text-[var(--text-secondary)] mt-0.5">
                Extracted verbatim from the Calm Dispatch verified broadcast stream. Timestamped with cryptographic integrity.
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenDispatches}
              className="px-3.5 py-2 rounded-[12px] bg-[var(--accent)] text-white text-[12.5px] font-bold hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
            >
              <span>Go to Calm Dispatch Chat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {officialNotices.map((notice) => (
              <div
                key={notice.id}
                className="p-5 rounded-[20px] bg-[var(--card)] border border-[var(--rule-default)] hover:border-sky-500/40 transition-all shadow-xs flex flex-col gap-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--rule-default)]">
                  <div className="flex items-center gap-3">
                    <img
                      src={notice.senderAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
                      alt={notice.senderName}
                      className="w-10 h-10 rounded-full object-cover border border-sky-400/40 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-bold text-[var(--text-primary)]">
                          {notice.senderName}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-[4px] bg-sky-500/20 text-sky-400 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verified Issuer</span>
                        </span>
                      </div>
                      <span className="text-[11px] text-[var(--text-secondary)] font-mono">
                        Reference: {notice.referenceNumber}
                      </span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[12px] font-mono font-bold text-sky-400 flex items-center sm:justify-end gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{notice.fullTimestamp}</span>
                    </span>
                    <span className="text-[11px] text-[var(--text-secondary)]">
                      Academic Year 2025–2026 Archive
                    </span>
                  </div>
                </div>

                <div className="text-[13.5px] text-[var(--text-primary)] leading-relaxed pl-1">
                  {notice.content}
                </div>

                {notice.actionableTask && (
                  <div className="p-3 rounded-[14px] bg-[var(--canvas)] border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block font-mono">
                        Extract Actionable Requirement
                      </span>
                      <span className="text-[13px] font-bold text-[var(--text-primary)]">
                        {notice.actionableTask.title}
                      </span>
                      <span className="text-[11.5px] text-[var(--text-secondary)] block font-mono">
                        Deadline: {notice.actionableTask.deadline} · Reward: +{notice.actionableTask.points} consistency points
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onConvertToActionableTask?.({
                          title: notice.actionableTask!.title,
                          deadline: notice.actionableTask!.deadline,
                          points: notice.actionableTask!.points,
                          channelName: 'Central Circulars',
                        });
                        onShowToast('Official decree requirement committed to Sovereign Board!');
                      }}
                      className="px-3.5 py-1.5 rounded-[10px] bg-[var(--accent)] text-white text-[12px] font-bold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap shadow-xs"
                    >
                      Commit to Board
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
