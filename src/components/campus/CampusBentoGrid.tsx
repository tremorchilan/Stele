import React from 'react';
import { Club, Role, AcademicSyllabus, AcademicClassSchedule } from '../../types';
import {
  Users,
  Calendar,
  BookOpen,
  Coffee,
  MessageSquare,
  ShieldCheck,
  Volume2,
  VolumeX,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Clock,
  Download,
  BellRing,
  HelpCircle,
  Lock,
  Gift,
  Zap,
} from 'lucide-react';

interface CampusBentoGridProps {
  clubs: Club[];
  syllabi: AcademicSyllabus[];
  todaySchedule: AcademicClassSchedule[];
  currentRole: Role;
  unreadDispatchesCount: number;
  meritPoints: number;
  syllabusAlertsActive: boolean;
  onNavigateTo: (
    page:
      | 'clubs'
      | 'classes'
      | 'academic-calendar'
      | 'resources'
      | 'bazaar'
      | 'dispatches'
      | 'steward-console'
      | 'quiet-zones'
      | 'office-hours'
      | 'gear-swap'
  ) => void;
  isDark: boolean;
}

export const CampusBentoGrid: React.FC<CampusBentoGridProps> = ({
  clubs,
  syllabi,
  todaySchedule,
  currentRole,
  unreadDispatchesCount,
  meritPoints,
  syllabusAlertsActive,
  onNavigateTo,
  isDark,
}) => {
  const isSteward = currentRole === 'steward';
  const nextClass = todaySchedule[0] || null;
  const topClub = clubs[0] || null;

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Bento Grid Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] md:text-[28px] font-extrabold text-[var(--text)] tracking-tight">
              Campus Collective Hub
            </h1>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-[6px] bg-[var(--accent-soft)] text-[var(--accent)] uppercase tracking-wider">
              Bento Architecture
            </span>
          </div>
          <p className="text-[14px] text-[var(--meta)] mt-0.5">
            Decentralized guild directory, synchronized academic calendar, faculty syllabi, and physical amenities.
          </p>
        </div>

        <div className="text-left sm:text-right self-start sm:self-auto">
          <span className="text-[12px] text-[var(--meta)] font-mono">
            Academic Term 2025–2026 · Week 7
          </span>
        </div>
      </div>

      {/* Primary Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* CARD 1: Clubs & Guilds (Span 2 on lg) */}
        <div
          onClick={() => onNavigateTo('clubs')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigateTo('clubs')}
          className="md:col-span-2 p-5 rounded-[24px] bg-[var(--tile)] border border-[rgba(255,255,255,0.08)] hover:border-[var(--accent)] transition-all cursor-pointer flex flex-col justify-between group shadow-xs relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-36 h-36 bg-[var(--accent-soft)] rounded-full blur-3xl opacity-20 pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-[12px] bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[12px] font-bold uppercase tracking-wider text-[var(--accent)]">
                  Student Guilds &amp; Societies
                </span>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-[6px] bg-[var(--track)] text-[var(--meta)]">
                {clubs.length} Active Guilds
              </span>
            </div>

            <h3 className="text-[18px] font-extrabold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
              Clubs &amp; Autonomous Circles
            </h3>
            <p className="text-[13px] text-[var(--meta)] mt-1 line-clamp-2 leading-relaxed">
              Explore club charters, browse verified wiki playbooks, and inspect active competition calls.
            </p>

            {/* Featured top club snippet */}
            {topClub && (
              <div className="mt-4 p-3 rounded-[14px] bg-[var(--track)] border border-[rgba(255,255,255,0.06)] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[var(--accent)] block">
                    Featured Guild
                  </span>
                  <span className="text-[13.5px] font-bold text-[var(--text)]">
                    {topClub.name}
                  </span>
                </div>
                <div className="text-right text-[11.5px] text-[var(--meta)]">
                  <span className="font-semibold text-[var(--text)]">{topClub.memberCount} Members</span> · {topClub.activeOpportunities} Active Calls
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[12.5px] font-semibold text-[var(--accent)]">
            <span>Enter Guild Directory &amp; Charters</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* CARD 2: Classes & Timetable */}
        <div
          onClick={() => onNavigateTo('classes')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigateTo('classes')}
          className="p-5 rounded-[24px] bg-[var(--tile)] border border-[rgba(255,255,255,0.08)] hover:border-[var(--accent)] transition-all cursor-pointer flex flex-col justify-between group shadow-xs"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-[12px] bg-sky-500/15 text-sky-400 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-[6px] bg-sky-500/15 text-sky-400">
                Today's Roster
              </span>
            </div>

            <h3 className="text-[17px] font-extrabold text-[var(--text)] group-hover:text-sky-400 transition-colors">
              Classes &amp; Timetable
            </h3>

            {nextClass ? (
              <div className="mt-3 p-3 rounded-[14px] bg-[var(--track)] border border-[rgba(255,255,255,0.06)]">
                <span className="text-[10px] font-bold uppercase text-sky-400 block font-mono">
                  {nextClass.startTime} – {nextClass.endTime}
                </span>
                <span className="text-[13px] font-bold text-[var(--text)] block mt-0.5">
                  {nextClass.courseCode}: {nextClass.courseName}
                </span>
                <span className="text-[11.5px] text-[var(--meta)] block mt-0.5">
                  {nextClass.room} · {nextClass.instructorName}
                </span>
              </div>
            ) : (
              <p className="text-[12.5px] text-[var(--meta)] mt-2">
                Full 5-day academic class timetable with room details and materials.
              </p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[12px] font-semibold text-sky-400">
            <span>View Full Timetable</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* CARD 3: Academic Year Calendar (SYNCED CALENDAR) */}
        <div
          onClick={() => onNavigateTo('academic-calendar')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigateTo('academic-calendar')}
          className="p-5 rounded-[24px] bg-[var(--tile)] border border-[rgba(255,255,255,0.08)] hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between group shadow-xs relative overflow-hidden"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-[12px] bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-[6px] bg-emerald-500/15 text-emerald-400">
                3-Way Synced
              </span>
            </div>

            <h3 className="text-[17px] font-extrabold text-[var(--text)] group-hover:text-emerald-400 transition-colors">
              Academic Year Calendar
            </h3>
            <p className="text-[12.5px] text-[var(--meta)] mt-1 leading-snug">
              Official off-days, exam periods, recesses, and deadlines. Synced with timetable, in-app personal calendar, and exportable to .ics external calendar.
            </p>

            <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Next: Autumn Reading Week (Oct 15)</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[12px] font-semibold text-emerald-400">
            <span>Open Calendar &amp; Sync</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* CARD 4: Resources & Syllabi (With Notification Status!) */}
        <div
          onClick={() => onNavigateTo('resources')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigateTo('resources')}
          className="p-5 rounded-[24px] bg-[var(--tile)] border border-[rgba(255,255,255,0.08)] hover:border-[var(--accent)] transition-all cursor-pointer flex flex-col justify-between group shadow-xs"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-[12px] bg-amber-500/15 text-amber-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-[6px] bg-amber-500/15 text-amber-400 flex items-center gap-1">
                <BellRing className="w-3 h-3" />
                <span>Alerts Active</span>
              </span>
            </div>

            <h3 className="text-[17px] font-extrabold text-[var(--text)] group-hover:text-amber-400 transition-colors">
              Resources &amp; Syllabi
            </h3>
            <p className="text-[12.5px] text-[var(--meta)] mt-1 leading-snug">
              Official faculty course blueprints, grading rubrics, and library textbook reserve locator.
            </p>

            <div className="mt-3 p-2.5 rounded-[12px] bg-[var(--track)] border border-[rgba(255,255,255,0.06)] text-[11px] text-[var(--meta)]">
              <span className="font-bold text-[var(--text)] block">
                ⚡ Real-Time Update Tracking
              </span>
              <span>Notifies on rubric changes &amp; faculty addendums</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[12px] font-semibold text-amber-400">
            <span>Inspect Syllabi &amp; Alerts</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* CARD 5: Physical Perks Bazaar */}
        <div
          onClick={() => onNavigateTo('bazaar')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigateTo('bazaar')}
          className="p-5 rounded-[24px] bg-[var(--tile)] border border-[rgba(255,255,255,0.08)] hover:border-[var(--accent)] transition-all cursor-pointer flex flex-col justify-between group shadow-xs"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-[12px] bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center">
                <Coffee className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-[6px] bg-[var(--accent-soft)] text-[var(--accent)]">
                {meritPoints} Merit Pts
              </span>
            </div>

            <h3 className="text-[17px] font-extrabold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
              Physical Perks Bazaar
            </h3>
            <p className="text-[12.5px] text-[var(--meta)] mt-1 leading-snug">
              Redeem sovereign points for campus coffee, FabLab 3D printing credits, and private library pods.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[12px] font-semibold text-[var(--accent)]">
            <span>Enter Physical Bazaar</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* CARD 6: Calm Dispatches */}
        <div
          onClick={() => onNavigateTo('dispatches')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigateTo('dispatches')}
          className="p-5 rounded-[24px] bg-[var(--tile)] border border-[rgba(255,255,255,0.08)] hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between group shadow-xs"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-[12px] bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-[6px] bg-emerald-500/15 text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Distraction Free</span>
              </span>
            </div>

            <h3 className="text-[17px] font-extrabold text-[var(--text)] group-hover:text-emerald-400 transition-colors">
              Calm Dispatches
            </h3>
            <p className="text-[12.5px] text-[var(--meta)] mt-1 leading-snug">
              Purpose-built asynchronous channels. Convert messages directly into sovereign commitments without notification noise.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[12px] font-semibold text-emerald-400">
            <span>Open Dedicated Channels</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* CARD 7: Steward Console (EXCLUSIVE TO STEWARD ROLE!) */}
        {isSteward ? (
          <div
            onClick={() => onNavigateTo('steward-console')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigateTo('steward-console')}
            className="md:col-span-2 p-5 rounded-[24px] bg-gradient-to-br from-[var(--tile)] to-[var(--track)] border border-[var(--accent)]/50 hover:border-[var(--accent)] transition-all cursor-pointer flex flex-col justify-between group shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-[12px] bg-[var(--accent)] text-white flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[12px] font-bold uppercase tracking-wider text-[var(--accent)]">
                    Steward Role Clearance
                  </span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-[6px] bg-[var(--accent-soft)] text-[var(--accent)]">
                  Tier 4 Governance Active
                </span>
              </div>

              <h3 className="text-[18px] font-extrabold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                Institutional Steward Console
              </h3>
              <p className="text-[13px] text-[var(--meta)] mt-1 leading-relaxed">
                Exclusive operating deck unlocked: Delegate commitments to aspirants, curate stele notices, audit regional fairness, and nominate successors.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[12.5px] font-semibold text-[var(--accent)]">
              <span>Open Operating Console (6 Tabs)</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        ) : (
          /* Subtle Locked Card for Non-Stewards to maintain institutional governance clarity */
          <div className="p-5 rounded-[24px] bg-[var(--tile)]/60 border border-[rgba(255,255,255,0.05)] opacity-70 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-[12px] bg-[var(--track)] text-[var(--meta)] flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-[6px] bg-[var(--track)] text-[var(--meta)]">
                  Steward Exclusive
                </span>
              </div>

              <h3 className="text-[16px] font-bold text-[var(--text)]">
                Steward Console
              </h3>
              <p className="text-[12px] text-[var(--meta)] mt-1">
                Restricted to verified Club Stewards. Calibrate role to Steward in Identity settings to access delegate and curation tools.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)] text-[11.5px] text-[var(--meta)] flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Role-gated institutional security</span>
            </div>
          </div>
        )}

        {/* CARD 8: Suggested Addition 1 - Campus Quiet Zones & Live Study Pods */}
        <div
          onClick={() => onNavigateTo('quiet-zones')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigateTo('quiet-zones')}
          className="p-5 rounded-[24px] bg-[var(--tile)] border border-[rgba(255,255,255,0.08)] hover:border-purple-400 transition-all cursor-pointer flex flex-col justify-between group shadow-xs"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-[12px] bg-purple-500/15 text-purple-400 flex items-center justify-center">
                <VolumeX className="w-5 h-5" />
              </div>
              <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-[6px] bg-purple-500/15 text-purple-400">
                Acoustic Radar
              </span>
            </div>

            <h3 className="text-[17px] font-extrabold text-[var(--text)] group-hover:text-purple-400 transition-colors">
              Campus Quiet Zones
            </h3>
            <p className="text-[12.5px] text-[var(--meta)] mt-1 leading-snug">
              Real-time decibel monitor &amp; seat availability across Science Library, Solar Atrium, and FabLab.
            </p>

            <div className="mt-3 flex items-center justify-between text-[11.5px] font-mono text-[var(--meta)]">
              <span className="text-emerald-400 font-bold">28 dB (Silent)</span>
              <span>16 / 48 Pods Free</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[12px] font-semibold text-purple-400">
            <span>Reserve Focus Pod</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
