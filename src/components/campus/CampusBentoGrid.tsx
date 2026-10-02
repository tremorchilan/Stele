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
    <div className="flex flex-col gap-4 pb-12">
      {/* Primary Bento Grid */}
      <div className="campus-bento-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* CARD 1: Clubs & Guilds (Span 2 on lg) */}
        <div
          onClick={() => onNavigateTo('clubs')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigateTo('clubs')}
          className="bento-card-interactive sm:col-span-2 p-4 sm:p-5 rounded-[18px] sm:rounded-[24px] bg-[var(--tile)] border border-[rgba(255,255,255,0.08)] hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden min-w-0"
        >
          <div className="absolute top-0 right-0 w-36 h-36 bg-[var(--accent-soft)] rounded-full blur-3xl opacity-20 pointer-events-none" />

          <div className="min-w-0">
            <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] sm:rounded-[12px] bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-[var(--accent)] truncate">
                  Student Guilds &amp; Societies
                </span>
              </div>
              <span className="pill pill-sm shrink-0">
                {clubs.length} Guilds
              </span>
            </div>

            <h3 className="text-[16px] sm:text-[18px] font-extrabold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
              Clubs &amp; Autonomous Circles
            </h3>
            <p className="text-[12.5px] sm:text-[13px] text-[var(--text-secondary)] mt-1 line-clamp-2 leading-relaxed">
              Explore club charters, browse verified wiki playbooks, and inspect active competition calls.
            </p>

            {/* Featured top club snippet */}
            {topClub && (
              <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 rounded-[12px] sm:rounded-[14px] bg-[var(--track)] border border-[rgba(255,255,255,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 min-w-0">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase text-[var(--accent)] block">
                    Featured Guild
                  </span>
                  <span className="text-[13px] sm:text-[13.5px] font-bold text-[var(--text)] block truncate">
                    {topClub.name}
                  </span>
                </div>
                <div className="text-left sm:text-right text-[11px] sm:text-[11.5px] text-[var(--text-secondary)] shrink-0">
                  <span className="font-semibold text-[var(--text)]">{topClub.memberCount} Members</span> · {topClub.activeOpportunities} Active Calls
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 sm:mt-5 pt-2.5 sm:pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[12px] sm:text-[12.5px] font-semibold text-[var(--accent)]">
            <span>Enter Guild Directory &amp; Charters</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
          </div>
        </div>

        {/* CARD 2: Classes & Timetable */}
        <div
          onClick={() => onNavigateTo('classes')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigateTo('classes')}
          className="bento-card-interactive p-4 sm:p-5 rounded-[18px] sm:rounded-[24px] bg-[var(--tile)] border border-[rgba(255,255,255,0.08)] hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group min-w-0"
        >
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] sm:rounded-[12px] bg-sky-500/15 text-sky-400 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="pill pill-sm on shrink-0">
                Today's Roster
              </span>
            </div>

            <h3 className="text-[16px] sm:text-[17px] font-extrabold text-[var(--text)] group-hover:text-sky-400 transition-colors">
              Classes &amp; Timetable
            </h3>

            {nextClass ? (
              <div className="mt-2.5 sm:mt-3 p-2.5 sm:p-3 rounded-[12px] sm:rounded-[14px] bg-[var(--track)] border border-[rgba(255,255,255,0.06)] min-w-0">
                <span className="text-[10px] font-bold uppercase text-sky-400 block font-mono">
                  {nextClass.startTime} – {nextClass.endTime}
                </span>
                <span className="text-[12.5px] sm:text-[13px] font-bold text-[var(--text)] block mt-0.5 truncate">
                  {nextClass.courseCode}: {nextClass.courseName}
                </span>
                <span className="text-[11px] sm:text-[11.5px] text-[var(--text-secondary)] block mt-0.5 truncate">
                  {nextClass.room} · {nextClass.instructorName}
                </span>
              </div>
            ) : (
              <p className="text-[12px] sm:text-[12.5px] text-[var(--text-secondary)] mt-2">
                Full 5-day academic class timetable with room details and materials.
              </p>
            )}
          </div>

          <div className="mt-3.5 sm:mt-4 pt-2.5 sm:pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[11.5px] sm:text-[12px] font-semibold text-sky-400">
            <span>View Full Timetable</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </div>
        </div>

        {/* CARD 3: Academic Year Calendar (SYNCED CALENDAR) */}
        <div
          onClick={() => onNavigateTo('academic-calendar')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigateTo('academic-calendar')}
          className="bento-card-interactive p-4 sm:p-5 rounded-[18px] sm:rounded-[24px] bg-[var(--tile)] border border-[rgba(255,255,255,0.08)] hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden min-w-0"
        >
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] sm:rounded-[12px] bg-[#10B981]/20 text-[#10B981] flex items-center justify-center shrink-0">
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="pill pill-sm success shrink-0 font-bold">
                Synced
              </span>
            </div>

            <h3 className="text-[16px] sm:text-[17px] font-extrabold text-[var(--text)] group-hover:text-emerald-400 transition-colors">
              Academic Calendar
            </h3>
            <p className="text-[12px] sm:text-[12.5px] text-[var(--text-secondary)] mt-1 leading-snug">
              Official off-days, exam periods, recesses, and deadlines. Synced with timetable and exportable.
            </p>

            <div className="mt-2.5 sm:mt-3 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="truncate">Next: Autumn Reading Week (Oct 15)</span>
            </div>
          </div>

          <div className="mt-3.5 sm:mt-4 pt-2.5 sm:pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[11.5px] sm:text-[12px] font-semibold text-emerald-400">
            <span>Open Calendar &amp; Sync</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </div>
        </div>

        {/* CARD 4: Resources & Syllabi */}
        <div
          onClick={() => onNavigateTo('resources')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigateTo('resources')}
          className="bento-card-interactive p-4 sm:p-5 rounded-[18px] sm:rounded-[24px] bg-[var(--tile)] border border-[rgba(255,255,255,0.08)] hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group min-w-0"
        >
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] sm:rounded-[12px] bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="pill pill-sm urgent flex items-center gap-1 shrink-0">
                <BellRing className="w-3 h-3" />
                <span>Alerts Active</span>
              </span>
            </div>

            <h3 className="text-[16px] sm:text-[17px] font-extrabold text-[var(--text)] group-hover:text-amber-400 transition-colors">
              Resources &amp; Syllabi
            </h3>
            <p className="text-[12px] sm:text-[12.5px] text-[var(--text-secondary)] mt-1 leading-snug">
              Official faculty course blueprints, grading rubrics, and textbook reserve locator.
            </p>

            <div className="mt-2.5 sm:mt-3 p-2 sm:p-2.5 rounded-[10px] sm:rounded-[12px] bg-[var(--track)] border border-[rgba(255,255,255,0.06)] text-[11px] text-[var(--text-secondary)] min-w-0">
              <span className="font-bold text-[var(--text)] block truncate">
                ⚡ Real-Time Update Tracking
              </span>
              <span className="block truncate">Notifies on rubric changes &amp; addendums</span>
            </div>
          </div>

          <div className="mt-3.5 sm:mt-4 pt-2.5 sm:pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[11.5px] sm:text-[12px] font-semibold text-amber-400">
            <span>Inspect Syllabi &amp; Alerts</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </div>
        </div>

        {/* CARD 5: Physical Perks Bazaar */}
        <div
          onClick={() => onNavigateTo('bazaar')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigateTo('bazaar')}
          className="bento-card-interactive p-4 sm:p-5 rounded-[18px] sm:rounded-[24px] bg-[var(--tile)] border border-[rgba(255,255,255,0.08)] hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group min-w-0"
        >
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] sm:rounded-[12px] bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center shrink-0">
                <Coffee className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="pill pill-sm on shrink-0">
                {meritPoints} Pts
              </span>
            </div>

            <h3 className="text-[16px] sm:text-[17px] font-extrabold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
              Physical Perks Bazaar
            </h3>
            <p className="text-[12px] sm:text-[12.5px] text-[var(--text-secondary)] mt-1 leading-snug">
              Redeem sovereign points for campus coffee, FabLab 3D credits, and quiet library pods.
            </p>
          </div>

          <div className="mt-3.5 sm:mt-4 pt-2.5 sm:pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[11.5px] sm:text-[12px] font-semibold text-[var(--accent)]">
            <span>Enter Physical Bazaar</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
          </div>
        </div>

        {/* CARD 6: Messenger */}
        <div
          onClick={() => onNavigateTo('dispatches')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigateTo('dispatches')}
          className="bento-card-interactive p-4 sm:p-5 rounded-[18px] sm:rounded-[24px] bg-[var(--tile)] border border-[rgba(255,255,255,0.08)] hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group min-w-0"
        >
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] sm:rounded-[12px] bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="pill pill-sm on flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Distraction Free</span>
              </span>
            </div>

            <h3 className="text-[16px] sm:text-[17px] font-extrabold text-[var(--text)] group-hover:text-emerald-400 transition-colors">
              Messenger
            </h3>
            <p className="text-[12px] sm:text-[12.5px] text-[var(--text-secondary)] mt-1 leading-snug">
              Purpose-built asynchronous channels. Convert messages directly into sovereign commitments without notification noise.
            </p>
          </div>

          <div className="mt-3.5 sm:mt-4 pt-2.5 sm:pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[11.5px] sm:text-[12px] font-semibold text-emerald-400">
            <span>Open Dedicated Channels</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
          </div>
        </div>

        {/* CARD 7: Steward Console (EXCLUSIVE TO STEWARD ROLE!) */}
        {isSteward ? (
          <div
            onClick={() => onNavigateTo('steward-console')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigateTo('steward-console')}
            className="bento-card-interactive sm:col-span-2 p-4 sm:p-5 rounded-[18px] sm:rounded-[24px] bg-[var(--tile)] border border-[rgba(255,255,255,0.12)] hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group min-w-0"
          >
            <div className="min-w-0">
              <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] sm:rounded-[12px] bg-[var(--accent)] text-white flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-[var(--accent)] truncate">
                    Steward Clearance
                  </span>
                </div>
                <span className="pill pill-sm on shrink-0">
                  Tier 4 Active
                </span>
              </div>

              <h3 className="text-[16px] sm:text-[18px] font-extrabold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                Institutional Steward Console
              </h3>
              <p className="text-[12.5px] sm:text-[13px] text-[var(--text-secondary)] mt-1 leading-relaxed">
                Exclusive operating deck unlocked: Delegate commitments to aspirants, curate stele notices, and audit regional fairness.
              </p>
            </div>

            <div className="mt-3.5 sm:mt-4 pt-2.5 sm:pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[11.5px] sm:text-[12.5px] font-semibold text-[var(--accent)]">
              <span>Open Operating Console</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-5 rounded-[18px] sm:rounded-[24px] bg-[var(--tile)]/60 border border-[rgba(255,255,255,0.05)] opacity-70 flex flex-col justify-between min-w-0">
            <div className="min-w-0">
              <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] sm:rounded-[12px] bg-[var(--track)] text-[var(--text-secondary)] flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <span className="pill pill-sm shrink-0">
                  Steward Exclusive
                </span>
              </div>

              <h3 className="text-[15px] sm:text-[16px] font-bold text-[var(--text)]">
                Steward Console
              </h3>
              <p className="text-[12px] text-[var(--text-secondary)] mt-1">
                Restricted to verified Club Stewards. Calibrate role to Steward in Identity settings to access delegate and curation tools.
              </p>
            </div>

            <div className="mt-3.5 sm:mt-4 pt-2.5 sm:pt-3 border-t border-[rgba(255,255,255,0.06)] text-[11px] sm:text-[11.5px] text-[var(--text-secondary)] flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Role-gated security</span>
            </div>
          </div>
        )}

        {/* CARD 8: Campus Quiet Zones & Live Study Pods */}
        <div
          onClick={() => onNavigateTo('quiet-zones')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigateTo('quiet-zones')}
          className="bento-card-interactive p-4 sm:p-5 rounded-[18px] sm:rounded-[24px] bg-[var(--tile)] border border-[rgba(255,255,255,0.08)] hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group min-w-0"
        >
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] sm:rounded-[12px] bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
                <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="pill pill-sm on shrink-0">
                Acoustic Radar
              </span>
            </div>

            <h3 className="text-[16px] sm:text-[17px] font-extrabold text-[var(--text)] group-hover:text-purple-400 transition-colors">
              Campus Quiet Zones
            </h3>
            <p className="text-[12px] sm:text-[12.5px] text-[var(--text-secondary)] mt-1 leading-snug">
              Real-time decibel monitor &amp; seat availability across Science Library, Solar Atrium, and FabLab.
            </p>

            <div className="mt-2.5 sm:mt-3 flex items-center justify-between text-[11px] sm:text-[11.5px] font-mono text-[var(--text-secondary)]">
              <span className="text-emerald-400 font-bold">28 dB (Silent)</span>
              <span>16 / 48 Free</span>
            </div>
          </div>

          <div className="mt-3.5 sm:mt-4 pt-2.5 sm:pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[11.5px] sm:text-[12px] font-semibold text-purple-400">
            <span>Reserve Focus Pod</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
};
