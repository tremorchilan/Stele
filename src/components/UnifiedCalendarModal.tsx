import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Download,
  Link,
  Check,
  Clock,
  AlertCircle,
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
  X,
  Layers,
  Search,
  Bookmark,
  Share2,
  Copy,
  Zap,
  GraduationCap,
  Target,
  RefreshCw,
} from 'lucide-react';
import {
  AcademicCalendarEvent,
  Commitment,
  SteleItem,
  DispatchMessage,
} from '../types';
import { MOCK_ACADEMIC_CALENDAR } from '../data/academicCalendarData';

export interface UnifiedCalendarEvent {
  id: string;
  sourceType: 'academic' | 'task' | 'opportunity';
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm or human time
  endDate?: string;
  category: string;
  term?: string;
  description?: string;
  points?: number;
  sourceInstitution?: string;
  stewardName?: string;
  urgency?: 'critical' | 'urgent' | 'standard';
  status?: 'active' | 'watched' | 'completed' | 'open' | 'missed';
  originalItem?: SteleItem;
  originalCommitment?: Commitment;
  originalAcademic?: AcademicCalendarEvent;
}

interface UnifiedCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  academicEvents?: AcademicCalendarEvent[];
  commitments?: Commitment[];
  opportunities?: SteleItem[];
  messages?: DispatchMessage[];
  calendarSync: boolean;
  onToggleCalendarSync: (val: boolean) => void;
  onCommitOpportunity?: (item: SteleItem) => void;
  onCompleteCommitment?: (commitment: Commitment) => void;
  onShowToast: (msg: string) => void;
  isDark: boolean;
  initialDate?: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const UnifiedCalendarModal: React.FC<UnifiedCalendarModalProps> = ({
  isOpen,
  onClose,
  academicEvents = MOCK_ACADEMIC_CALENDAR,
  commitments = [],
  opportunities = [],
  messages = [],
  calendarSync,
  onToggleCalendarSync,
  onCommitOpportunity,
  onCompleteCommitment,
  onShowToast,
  isDark,
  initialDate = '2025-09-19',
}) => {
  // Navigation & View state
  const [currentYear, setCurrentYear] = useState<number>(2025);
  const [currentMonth, setCurrentMonth] = useState<number>(8); // September (0-indexed)
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [viewMode, setViewMode] = useState<'month' | 'agenda' | 'week'>('month');

  // Stream toggles (User can filter which streams are active in the calendar)
  const [showAcademic, setShowAcademic] = useState(true);
  const [showTasks, setShowTasks] = useState(true);
  const [showOpportunities, setShowOpportunities] = useState(true);

  // Sync drawer & export state
  const [syncPanelOpen, setSyncPanelOpen] = useState(false);
  const [copiedFeedUrl, setCopiedFeedUrl] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [agendaFilter, setAgendaFilter] = useState<'all' | 'urgent' | 'academic' | 'tasks' | 'opportunities'>('all');

  // Normalize and combine all 3 data streams into unified events
  const unifiedEvents = useMemo<UnifiedCalendarEvent[]>(() => {
    const list: UnifiedCalendarEvent[] = [];

    // 1. Academic Calendar Data
    academicEvents.forEach((ac) => {
      list.push({
        id: `acad-${ac.id}`,
        sourceType: 'academic',
        title: ac.title,
        date: ac.date,
        endDate: ac.endDate,
        category: ac.category === 'exam' ? 'Exam Benchmark' : ac.category === 'off_day' ? 'Recess / Holiday' : 'Academic Milestone',
        term: ac.term,
        description: ac.description,
        sourceInstitution: 'Stele Collegiate Faculty',
        urgency: ac.category === 'exam' ? 'urgent' : 'standard',
        originalAcademic: ac,
      });
    });

    // 2. Task & Commitment Deadlines
    commitments.forEach((cm, idx) => {
      // Map dates to fall within realistic semester demo days
      const demoDates = [
        '2025-09-19',
        '2025-09-22',
        '2025-09-25',
        '2025-10-02',
        '2025-10-12',
        '2025-10-24',
        '2025-11-05',
      ];
      let eventDate = '2025-09-19';
      try {
        if (cm.deadline) {
          const parsed = new Date(cm.deadline);
          if (!isNaN(parsed.getTime())) {
            // If it parses to a valid date, keep it or map to current semester range
            eventDate = parsed.toISOString().split('T')[0];
          } else {
            eventDate = demoDates[idx % demoDates.length];
          }
        } else {
          eventDate = demoDates[idx % demoDates.length];
        }
      } catch {
        eventDate = demoDates[idx % demoDates.length];
      }

      list.push({
        id: `task-${cm.id}`,
        sourceType: 'task',
        title: cm.title,
        date: eventDate,
        time: '18:00',
        category: cm.status === 'watched' ? 'Watched Task' : 'Committed Task Deadline',
        description: `Steward: ${cm.stewardName} · ${cm.sourceInstitution}. Verified commitment status: ${cm.status}.`,
        sourceInstitution: cm.sourceInstitution,
        stewardName: cm.stewardName,
        points: cm.status === 'completed' ? 50 : 35,
        urgency: cm.status === 'active' ? 'critical' : 'standard',
        status: cm.status,
        originalCommitment: cm,
      });
    });

    // Additional hard-coded high-value student deadlines matching campus circulars
    list.push(
      {
        id: 'task-extra-1',
        sourceType: 'task',
        title: 'Thermodynamics Worksheet Tray 204 Submission',
        date: '2025-09-19',
        time: '14:00',
        category: 'Committed Task Deadline',
        description: 'Hard-copy physics problem set step 2: conversion to Kelvin required. Place in tray outside Room 204.',
        sourceInstitution: 'Physics Preparatory Desk',
        stewardName: 'Nadia Chowdhury',
        points: 25,
        urgency: 'critical',
        status: 'active',
      },
      {
        id: 'task-extra-2',
        sourceType: 'task',
        title: 'Laser Cutter Bay 3 Steward Sign-off',
        date: '2025-09-26',
        time: '17:00',
        category: 'Committed Task Deadline',
        description: 'Mentor review of acrylic line-follower chassis design and safety certification in Fabrication Annex.',
        sourceInstitution: 'Fabrication Annex',
        stewardName: 'Mr. Rahman',
        points: 60,
        urgency: 'urgent',
        status: 'active',
      }
    );

    // 3. Opportunity Deadlines
    opportunities.forEach((op, idx) => {
      const demoOppDates = [
        '2025-09-20',
        '2025-09-28',
        '2025-10-05',
        '2025-10-18',
        '2025-10-31',
        '2025-11-12',
        '2025-11-25',
      ];
      let oppDate = '2025-09-20';
      try {
        if (op.deadline) {
          const parsed = new Date(op.deadline);
          if (!isNaN(parsed.getTime())) {
            oppDate = parsed.toISOString().split('T')[0];
          } else {
            oppDate = demoOppDates[idx % demoOppDates.length];
          }
        } else {
          oppDate = demoOppDates[idx % demoOppDates.length];
        }
      } catch {
        oppDate = demoOppDates[idx % demoOppDates.length];
      }

      list.push({
        id: `opp-${op.id}`,
        sourceType: 'opportunity',
        title: `${op.title} (Registration Closes)`,
        date: oppDate,
        time: '23:59',
        category: `${op.scope.toUpperCase()} Opportunity Deadline`,
        description: `${op.originalMessage} Hosted by ${op.sourceInstitution}. Verified tags: ${op.tags.join(', ')}.`,
        sourceInstitution: op.sourceInstitution,
        stewardName: op.stewardName,
        points: op.tags.includes('Olympiad') ? 80 : 45,
        urgency: idx === 0 ? 'critical' : 'urgent',
        status: 'open',
        originalItem: op,
      });
    });

    return list;
  }, [academicEvents, commitments, opportunities]);

  // Filtered list based on current multi-select stream toggles
  const activeEvents = useMemo(() => {
    return unifiedEvents.filter((evt) => {
      if (evt.sourceType === 'academic' && !showAcademic) return false;
      if (evt.sourceType === 'task' && !showTasks) return false;
      if (evt.sourceType === 'opportunity' && !showOpportunities) return false;
      return true;
    });
  }, [unifiedEvents, showAcademic, showTasks, showOpportunities]);

  // Calendar month grid generation
  const calendarGrid = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    let startingDayOfWeek = firstDay.getDay() - 1;
    if (startingDayOfWeek === -1) startingDayOfWeek = 6; // Mon=0, Sun=6

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const cells = [];

    // Leading days from previous month
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const pDay = prevMonthDays - i;
      const pMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const pYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${pYear}-${String(pMonth + 1).padStart(2, '0')}-${String(pDay).padStart(2, '0')}`;
      cells.push({
        dayNumber: pDay,
        dateStr,
        isCurrentMonth: false,
        events: activeEvents.filter((e) => e.date === dateStr),
      });
    }

    // Days of current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: true,
        events: activeEvents.filter((e) => e.date === dateStr),
      });
    }

    // Trailing padding days to fill 5 or 6 weeks (multiple of 7)
    const totalCells = Math.ceil(cells.length / 7) * 7;
    const remaining = totalCells - cells.length;
    for (let i = 1; i <= remaining; i++) {
      const nMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${nYear}-${String(nMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      cells.push({
        dayNumber: i,
        dateStr,
        isCurrentMonth: false,
        events: activeEvents.filter((e) => e.date === dateStr),
      });
    }

    return cells;
  }, [currentYear, currentMonth, activeEvents]);

  // Selected date events
  const selectedDayEvents = useMemo(() => {
    return activeEvents.filter((e) => e.date === selectedDate);
  }, [activeEvents, selectedDate]);

  // External Calendar Synchronization Handlers
  const handleDownloadICS = () => {
    const lines: string[] = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Stele Campus//Unified Calendar Sync v2.4//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:Stele Unified Campus Calendar',
      'X-WR-CALDESC:Synchronized Academic Milestones, Task Deadlines, and Opportunity Deadlines',
      'X-WR-TIMEZONE:UTC',
    ];

    activeEvents.forEach((evt) => {
      const dateClean = evt.date.replace(/-/g, '');
      const timeClean = evt.time ? evt.time.replace(/:/g, '') + '00' : '090000';
      const timeEndClean = evt.time ? '100000' : '100000';
      const nowStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

      const escapeText = (str: string) => str.replace(/[,;\\]/g, '\\$&').replace(/\n/g, '\\n');

      lines.push('BEGIN:VEVENT');
      lines.push(`UID:${evt.id}-${dateClean}@stele.campus.internal`);
      lines.push(`DTSTAMP:${nowStamp}`);
      lines.push(`DTSTART:${dateClean}T${timeClean}Z`);
      lines.push(`DTEND:${dateClean}T${timeEndClean}Z`);
      lines.push(`SUMMARY:[${evt.sourceType.toUpperCase()}] ${escapeText(evt.title)}`);
      lines.push(`DESCRIPTION:${escapeText(evt.description || evt.title)}`);
      lines.push(`LOCATION:${escapeText(evt.sourceInstitution || 'Stele Campus')}`);
      lines.push(`CATEGORIES:${escapeText(evt.category)}`);
      lines.push('STATUS:CONFIRMED');
      lines.push('END:VEVENT');
    });

    lines.push('END:VCALENDAR');
    const icsContent = lines.join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stele-unified-calendar.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    onShowToast('Downloaded stele-unified-calendar.ics (Apple, Google & Outlook compatible)');
  };

  const handleCopyWebCalFeed = () => {
    const feedUrl = 'webcal://stele.campus.internal/sync/feed.ics';
    navigator.clipboard?.writeText(feedUrl);
    setCopiedFeedUrl(true);
    onShowToast('WebCal Feed URL copied! Paste into Apple Calendar or Outlook');
    setTimeout(() => setCopiedFeedUrl(false), 2500);
  };

  const handleGoogleCalendarSync = (evt: UnifiedCalendarEvent) => {
    const dateClean = evt.date.replace(/-/g, '');
    const start = `${dateClean}T090000Z`;
    const end = `${dateClean}T100000Z`;
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `[Stele] ${evt.title}`,
      dates: `${start}/${end}`,
      details: `${evt.description || evt.title}\n\nCategory: ${evt.category}\nPoints: ${evt.points || 0}`,
      location: evt.sourceInstitution || 'Stele Collegiate Campus',
    });
    window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank');
    onShowToast('Opened Google Calendar event scheduler');
  };

  const handleToggleSyncStatus = () => {
    const next = !calendarSync;
    onToggleCalendarSync(next);
    onShowToast(`External Calendar Sync: ${next ? 'Connected & Subscribed' : 'Disconnected'}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-5xl h-[92vh] max-h-[850px] rounded-[26px] bg-[var(--card)] border border-[var(--rule-default)] shadow-2xl flex flex-col overflow-hidden text-[var(--text-primary)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= MODAL TOP HEADER ================= */}
        <div className="p-3.5 sm:p-4 border-b border-[var(--rule-default)] bg-[var(--canvas)] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[var(--accent)] text-white flex items-center justify-center shadow-md">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[16px] sm:text-[18px] font-extrabold tracking-tight">
                  Dedicated Unified Calendar
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3" />
                  <span>3 Streams Synchronized</span>
                </span>
              </div>
              <p className="text-[11.5px] text-[var(--text-secondary)]">
                Academic Almanac + Task &amp; Commitment Deadlines + Opportunity Radar Deadlines
              </p>
            </div>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Sync External Calendar Quick Button */}
            <button
              type="button"
              onClick={() => setSyncPanelOpen(!syncPanelOpen)}
              className={`px-3 py-1.5 rounded-[12px] text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                calendarSync
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                  : 'bg-[var(--card)] text-[var(--text-secondary)] border-[var(--rule-default)] hover:text-[var(--text-primary)]'
              }`}
              title="Configure external calendar synchronization (Google, Apple, Outlook, iCal)"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${calendarSync ? 'animate-spin-slow text-emerald-400' : ''}`} />
              <span className="hidden sm:inline">External Sync:</span>
              <span>{calendarSync ? 'Connected' : 'Sync External'}</span>
            </button>

            {/* 1-Click .ICS Download Button */}
            <button
              type="button"
              onClick={handleDownloadICS}
              className="p-2 rounded-[12px] bg-[var(--card)] border border-[var(--rule-default)] hover:border-[var(--accent)] text-[var(--text-primary)] transition-colors cursor-pointer"
              title="Download .ics calendar file"
            >
              <Download className="w-4 h-4 text-[var(--accent)]" />
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-[12px] bg-[var(--card)] border border-[var(--rule-default)] hover:bg-[var(--card-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= EXTERNAL SYNC DRAWER (SLIDE-DOWN) ================= */}
        {syncPanelOpen && (
          <div className="p-4 bg-[var(--canvas)] border-b border-[var(--rule-default)] animate-in slide-in-from-top-2 duration-200">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-[var(--text-primary)]">
                    External Calendar Integration Hub
                  </span>
                  <span className="text-[10.5px] font-mono px-2 py-0.5 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] font-semibold">
                    RFC 5545 iCalendar Standard
                  </span>
                </div>
                <p className="text-[11.5px] text-[var(--text-secondary)]">
                  Subscribe or export all academic milestones, personal tasks, and opportunity cutoffs into your external calendar application.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleToggleSyncStatus}
                  className={`px-3.5 py-1.5 rounded-[10px] text-[12px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    calendarSync
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-[var(--card)] border border-[var(--rule-default)] text-[var(--text-primary)] hover:border-[var(--accent)]'
                  }`}
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>{calendarSync ? 'Auto-Sync Active' : 'Enable 2-Way Sync'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyWebCalFeed}
                  className="px-3 py-1.5 rounded-[10px] bg-[var(--card)] border border-[var(--rule-default)] hover:border-[var(--accent)] text-[12px] font-semibold text-[var(--text-primary)] flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedFeedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Link className="w-3.5 h-3.5" />}
                  <span>{copiedFeedUrl ? 'Copied Feed URL' : 'Copy WebCal Feed'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadICS}
                  className="px-3 py-1.5 rounded-[10px] bg-[var(--accent)] text-white text-[12px] font-bold hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export .ICS</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= CONTROLS BAR: STREAM TOGGLES & VIEW MODES ================= */}
        <div className="p-3 px-4 border-b border-[var(--rule-default)] bg-[var(--card)] flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* 3 Stream Filter Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase text-[var(--text-secondary)] mr-1">
              Data Streams:
            </span>

            {/* Stream 1: Academic Calendar */}
            <button
              type="button"
              onClick={() => setShowAcademic(!showAcademic)}
              className={`px-2.5 py-1 rounded-[10px] text-[11.5px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                showAcademic
                  ? 'bg-sky-500/20 text-sky-400 border-sky-500/40'
                  : 'bg-[var(--canvas)] text-[var(--text-muted)] border-[var(--rule-default)] opacity-60'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Academic Almanac</span>
              <span className="text-[10px] font-mono bg-sky-500/30 px-1.5 py-0.2 rounded-full">
                {academicEvents.length}
              </span>
            </button>

            {/* Stream 2: Tasks & Commitments */}
            <button
              type="button"
              onClick={() => setShowTasks(!showTasks)}
              className={`px-2.5 py-1 rounded-[10px] text-[11.5px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                showTasks
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-[var(--canvas)] text-[var(--text-muted)] border-[var(--rule-default)] opacity-60'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Task &amp; Commitments</span>
              <span className="text-[10px] font-mono bg-emerald-500/30 px-1.5 py-0.2 rounded-full">
                {commitments.length + 2}
              </span>
            </button>

            {/* Stream 3: Opportunities Radar */}
            <button
              type="button"
              onClick={() => setShowOpportunities(!showOpportunities)}
              className={`px-2.5 py-1 rounded-[10px] text-[11.5px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                showOpportunities
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-[var(--canvas)] text-[var(--text-muted)] border-[var(--rule-default)] opacity-60'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Opportunity Deadlines</span>
              <span className="text-[10px] font-mono bg-amber-500/30 px-1.5 py-0.2 rounded-full">
                {opportunities.length}
              </span>
            </button>
          </div>

          {/* View Mode Switcher (Month Grid vs Agenda Timeline) */}
          <div className="flex items-center gap-1 p-1 rounded-[10px] bg-[var(--canvas)] border border-[var(--rule-default)] ml-auto">
            <button
              type="button"
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-[7px] text-[11.5px] font-bold transition-all cursor-pointer ${
                viewMode === 'month'
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Month Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode('agenda')}
              className={`px-3 py-1 rounded-[7px] text-[11.5px] font-bold transition-all cursor-pointer ${
                viewMode === 'agenda'
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Agenda Timeline
            </button>
          </div>
        </div>

        {/* ================= MAIN BODY CONTENT ================= */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-[var(--rule-default)]">
          {/* ================= LEFT / PRIMARY AREA: CALENDAR DISPLAY ================= */}
          <div className="flex-1 flex flex-col min-w-0 bg-[var(--canvas)] overflow-y-auto no-scrollbar">
            {/* Month Navigation Bar */}
            <div className="p-3 px-4 bg-[var(--card)] border-b border-[var(--rule-default)] flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <h3 className="text-[15px] sm:text-[17px] font-extrabold text-[var(--text-primary)]">
                  {MONTH_NAMES[currentMonth]} {currentYear}
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[var(--canvas)] border border-[var(--rule-default)] text-[var(--text-secondary)]">
                  Fall Term 2025
                </span>
              </div>

              <div className="flex items-center gap-1.5">
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
                  className="p-1.5 rounded-[8px] bg-[var(--canvas)] border border-[var(--rule-default)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentYear(2025);
                    setCurrentMonth(8);
                    setSelectedDate('2025-09-19');
                    onShowToast('Jumped to current academic session');
                  }}
                  className="px-2.5 py-1 rounded-[8px] bg-[var(--canvas)] border border-[var(--rule-default)] hover:border-[var(--accent)] text-[11.5px] font-bold text-[var(--text-primary)] cursor-pointer"
                >
                  Today
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
                  className="p-1.5 rounded-[8px] bg-[var(--canvas)] border border-[var(--rule-default)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* MONTH GRID VIEW */}
            {viewMode === 'month' && (
              <div className="flex-1 flex flex-col p-3 sm:p-4">
                {/* 7 Day Names Header */}
                <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mb-1.5 text-center">
                  {DAYS_OF_WEEK.map((d) => (
                    <div
                      key={d}
                      className="py-1 text-[11px] font-bold font-mono text-[var(--text-secondary)] uppercase tracking-wider"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 sm:gap-1.5 flex-1">
                  {calendarGrid.map((cell, idx) => {
                    const isSelected = cell.dateStr === selectedDate;
                    const isToday = cell.dateStr === '2025-09-19';

                    const hasAcademic = cell.events.some((e) => e.sourceType === 'academic');
                    const hasTasks = cell.events.some((e) => e.sourceType === 'task');
                    const hasOpportunities = cell.events.some((e) => e.sourceType === 'opportunity');

                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedDate(cell.dateStr)}
                        className={`min-h-[58px] sm:min-h-[72px] p-1.5 sm:p-2 rounded-[14px] border transition-all cursor-pointer flex flex-col justify-between relative ${
                          isSelected
                            ? 'bg-[var(--accent)]/15 border-[var(--accent)] ring-2 ring-[var(--accent)]/30 shadow-md'
                            : isToday
                            ? 'bg-[var(--card)] border-amber-500/50 shadow-xs'
                            : cell.isCurrentMonth
                            ? 'bg-[var(--card)] border-[var(--rule-default)]/60 hover:border-[var(--rule-default)]'
                            : 'bg-[var(--canvas)]/40 border-transparent opacity-40'
                        }`}
                      >
                        {/* Day Number and Today Marker */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[12px] font-bold font-mono ${
                              isSelected
                                ? 'text-[var(--accent)]'
                                : isToday
                                ? 'text-amber-400 font-extrabold'
                                : cell.isCurrentMonth
                                ? 'text-[var(--text-primary)]'
                                : 'text-[var(--text-muted)]'
                            }`}
                          >
                            {cell.dayNumber}
                          </span>

                          {isToday && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          )}
                        </div>

                        {/* Event Category Indicators (Dots & Badges) */}
                        <div className="flex flex-col gap-0.5 mt-1">
                          {/* Dot cluster for mobile / compact */}
                          <div className="flex items-center gap-1">
                            {hasAcademic && (
                              <span
                                className="w-2 h-2 rounded-full bg-sky-400 shrink-0"
                                title="Academic Milestone"
                              />
                            )}
                            {hasTasks && (
                              <span
                                className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"
                                title="Task / Commitment Deadline"
                              />
                            )}
                            {hasOpportunities && (
                              <span
                                className="w-2 h-2 rounded-full bg-amber-400 shrink-0"
                                title="Opportunity Deadline"
                              />
                            )}
                          </div>

                          {/* Desktop Pill previews */}
                          {cell.events.slice(0, 2).map((ev) => (
                            <div
                              key={ev.id}
                              className={`hidden sm:block text-[9.5px] font-semibold truncate px-1 py-0.2 rounded-[4px] leading-tight ${
                                ev.sourceType === 'academic'
                                  ? 'bg-sky-500/20 text-sky-400'
                                  : ev.sourceType === 'task'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-amber-500/20 text-amber-400'
                              }`}
                            >
                              {ev.title}
                            </div>
                          ))}

                          {cell.events.length > 2 && (
                            <span className="hidden sm:inline text-[8.5px] text-[var(--text-secondary)] font-mono pl-0.5">
                              +{cell.events.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* AGENDA TIMELINE VIEW */}
            {viewMode === 'agenda' && (
              <div className="p-4 space-y-4">
                {/* Search Bar & Quick Filters */}
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search academic milestones, tasks, competitions..."
                      className="w-full pl-9 pr-3 py-2 rounded-[12px] bg-[var(--card)] border border-[var(--rule-default)] text-[12.5px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
                    />
                  </div>

                  <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'urgent', label: 'Urgent' },
                      { id: 'academic', label: 'Academic' },
                      { id: 'tasks', label: 'Tasks' },
                      { id: 'opportunities', label: 'Radar' },
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        type="button"
                        onClick={() => setAgendaFilter(btn.id as any)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-[8px] cursor-pointer whitespace-nowrap transition-colors ${
                          agendaFilter === btn.id
                            ? 'bg-[var(--accent)] text-white'
                            : 'bg-[var(--card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--rule-default)]'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chronological List */}
                <div className="space-y-3">
                  {activeEvents
                    .filter((e) => {
                      if (searchQuery.trim()) {
                        const q = searchQuery.toLowerCase();
                        if (
                          !e.title.toLowerCase().includes(q) &&
                          !e.category.toLowerCase().includes(q) &&
                          !e.description?.toLowerCase().includes(q)
                        )
                          return false;
                      }
                      if (agendaFilter === 'urgent') return e.urgency === 'critical' || e.urgency === 'urgent';
                      if (agendaFilter === 'academic') return e.sourceType === 'academic';
                      if (agendaFilter === 'tasks') return e.sourceType === 'task';
                      if (agendaFilter === 'opportunities') return e.sourceType === 'opportunity';
                      return true;
                    })
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .map((evt) => (
                      <div
                        key={evt.id}
                        onClick={() => setSelectedDate(evt.date)}
                        className={`p-3.5 rounded-[18px] bg-[var(--card)] border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          evt.date === selectedDate
                            ? 'border-[var(--accent)] shadow-md'
                            : 'border-[var(--rule-default)] hover:border-[var(--rule-default)]/80'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 ${
                              evt.sourceType === 'academic'
                                ? 'bg-sky-500/20 text-sky-400'
                                : evt.sourceType === 'task'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-amber-500/20 text-amber-400'
                            }`}
                          >
                            {evt.sourceType === 'academic' ? (
                              <GraduationCap className="w-5 h-5" />
                            ) : evt.sourceType === 'task' ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <Target className="w-5 h-5" />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.2 rounded-[4px] ${
                                  evt.sourceType === 'academic'
                                    ? 'bg-sky-500/20 text-sky-400'
                                    : evt.sourceType === 'task'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-amber-500/20 text-amber-400'
                                }`}
                              >
                                {evt.category}
                              </span>
                              <span className="text-[11px] font-mono text-[var(--text-secondary)]">
                                {evt.date} {evt.time ? `· ${evt.time}` : ''}
                              </span>
                            </div>

                            <h4 className="text-[13.5px] font-bold text-[var(--text-primary)] mt-1">
                              {evt.title}
                            </h4>

                            <p className="text-[11.5px] text-[var(--text-secondary)] line-clamp-1 mt-0.5">
                              {evt.description}
                            </p>
                          </div>
                        </div>

                        {/* Right Action buttons */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {evt.points && (
                            <span className="text-[11.5px] font-mono font-bold text-[var(--accent)]">
                              +{evt.points} pts
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGoogleCalendarSync(evt);
                            }}
                            className="p-1.5 rounded-[8px] bg-[var(--canvas)] border border-[var(--rule-default)] hover:border-sky-400 text-[var(--text-secondary)] hover:text-sky-400 cursor-pointer"
                            title="Add to Google Calendar"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* ================= RIGHT DETAIL PANE: SELECTED DAY SCHEDULE ================= */}
          <div className="w-full md:w-88 md:min-w-[340px] bg-[var(--card)] flex flex-col shrink-0">
            {/* Selected Date Header */}
            <div className="p-3.5 border-b border-[var(--rule-default)] bg-[var(--canvas)] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[var(--text-secondary)] font-bold block">
                  Focused Date Schedule
                </span>
                <h4 className="text-[14.5px] font-extrabold text-[var(--text-primary)]">
                  {selectedDate}
                </h4>
              </div>

              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--accent)]/15 text-[var(--accent)]">
                {selectedDayEvents.length} Fixtures
              </span>
            </div>

            {/* Events for this day */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 no-scrollbar">
              {selectedDayEvents.length === 0 ? (
                <div className="p-8 text-center text-[var(--text-secondary)] space-y-2">
                  <CalendarCheck className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-50" />
                  <p className="text-[13px] font-semibold text-[var(--text-primary)]">
                    No deadlines on this date
                  </p>
                  <p className="text-[11.5px] text-[var(--text-secondary)] leading-relaxed">
                    Enjoy study focus time, or explore upcoming milestones in the agenda timeline.
                  </p>
                </div>
              ) : (
                selectedDayEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3.5 rounded-[16px] bg-[var(--canvas)] border border-[var(--rule-default)] shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.2 rounded-[4px] ${
                          evt.sourceType === 'academic'
                            ? 'bg-sky-500/20 text-sky-400'
                            : evt.sourceType === 'task'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {evt.category}
                      </span>
                      {evt.time && (
                        <span className="text-[10.5px] font-mono text-[var(--text-secondary)] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{evt.time}</span>
                        </span>
                      )}
                    </div>

                    <h5 className="text-[13px] font-bold text-[var(--text-primary)] leading-snug">
                      {evt.title}
                    </h5>

                    {evt.description && (
                      <p className="text-[11.5px] text-[var(--text-secondary)] leading-relaxed">
                        {evt.description}
                      </p>
                    )}

                    {evt.sourceInstitution && (
                      <div className="text-[10.5px] text-[var(--text-muted)] font-mono">
                        {evt.sourceInstitution} {evt.stewardName ? `· ${evt.stewardName}` : ''}
                      </div>
                    )}

                    {/* Action Bar for this event */}
                    <div className="pt-2 border-t border-[var(--rule-default)] flex items-center justify-between gap-2">
                      {evt.points ? (
                        <span className="text-[11px] font-mono font-bold text-[var(--accent)]">
                          +{evt.points} pts reward
                        </span>
                      ) : (
                        <span className="text-[10.5px] font-mono text-[var(--text-muted)]">
                          Official Institutional Event
                        </span>
                      )}

                      <div className="flex items-center gap-1.5">
                        {evt.sourceType === 'opportunity' && evt.originalItem && (
                          <button
                            type="button"
                            onClick={() => {
                              onCommitOpportunity?.(evt.originalItem!);
                              onShowToast(`Committed "${evt.originalItem!.title}" to your Sovereign Board!`);
                            }}
                            className="px-2.5 py-1 rounded-[8px] bg-[var(--accent)] text-white text-[11px] font-bold hover:opacity-90 cursor-pointer"
                          >
                            Commit to Board
                          </button>
                        )}

                        {evt.sourceType === 'task' && evt.originalCommitment && (
                          <button
                            type="button"
                            onClick={() => {
                              onCompleteCommitment?.(evt.originalCommitment!);
                              onShowToast(`Task "${evt.originalCommitment!.title}" marked complete!`);
                            }}
                            className="px-2.5 py-1 rounded-[8px] bg-emerald-500 text-white text-[11px] font-bold hover:opacity-90 cursor-pointer"
                          >
                            Mark Complete
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleGoogleCalendarSync(evt)}
                          className="p-1 rounded-[6px] hover:bg-[var(--card)] text-[var(--text-secondary)] hover:text-sky-400 cursor-pointer"
                          title="Send to Google Calendar"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Sync Quick Link */}
            <div className="p-3 border-t border-[var(--rule-default)] bg-[var(--canvas)] flex items-center justify-between text-[11.5px]">
              <span className="text-[var(--text-secondary)]">External Calendar:</span>
              <button
                type="button"
                onClick={handleDownloadICS}
                className="font-bold text-[var(--accent)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Download .ICS Feed</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
