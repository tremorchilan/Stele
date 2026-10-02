import React, { useState, useEffect } from 'react';
import {
  Club,
  Role,
  WikiPage,
  MemberPipelinePerson,
  SteleItem,
  CommunicationChannel,
  DispatchMessage,
  AcademicClassSchedule,
  AcademicSyllabus,
} from '../types';
import { MOCK_CLASS_SCHEDULE, MOCK_ACADEMIC_SYLLABI } from '../data/mockData';
import { StewardsConsole } from '../components/StewardsConsole';
import { CampusBentoGrid } from '../components/campus/CampusBentoGrid';
import { AcademicYearCalendarView } from '../components/campus/AcademicYearCalendarView';
import { ResourcesSyllabiView } from '../components/campus/ResourcesSyllabiView';
import { CampusQuietZonesView } from '../components/campus/CampusQuietZonesView';
import {
  Building2,
  Users,
  BookOpen,
  GraduationCap,
  FolderArchive,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Send,
  Eye,
  Award,
  Sparkles,
  MessageSquare,
  Coffee,
  Calendar,
  Clock,
  MapPin,
  Download,
  ExternalLink,
  FileText,
  ChevronDown,
  ChevronUp,
  Zap,
  Lock,
} from 'lucide-react';

interface CampusViewProps {
  clubs: Club[];
  wikiPages: WikiPage[];
  pipeline: MemberPipelinePerson[];
  currentRole: Role;
  onChangeRole?: (role: Role) => void;
  onAddTask: (task: Partial<SteleItem>) => void;
  onAddWikiPage: (page: Partial<WikiPage>) => void;
  onNominateSuccessor: (name: string, date: string) => void;
  onOpenUnconventionalFeatures?: () => void;
  channels?: CommunicationChannel[];
  messages?: DispatchMessage[];
  onSendMessage?: (channelId: string, content: string) => void;
  onConvertToActionableTask?: (task: { title: string; deadline: string; points: number; channelName: string }) => void;
  onOpenPerksBazaar?: () => void;
  onOpenDispatches?: () => void;
  onOpenUnifiedCalendar?: () => void;
  studentName?: string;
  meritPoints?: number;
  isDark: boolean;
  initialViewMode?: 'hub' | 'clubs' | 'classes' | 'academic-calendar' | 'resources' | 'quiet-zones' | 'steward-console';
  onViewModeChange?: (mode: 'hub' | 'clubs' | 'classes' | 'academic-calendar' | 'resources' | 'quiet-zones' | 'steward-console') => void;
}

export const CampusView: React.FC<CampusViewProps> = ({
  clubs,
  wikiPages,
  pipeline,
  currentRole,
  onChangeRole,
  onAddTask,
  onAddWikiPage,
  onNominateSuccessor,
  onOpenUnconventionalFeatures,
  channels = [],
  messages = [],
  onSendMessage,
  onConvertToActionableTask,
  onOpenPerksBazaar,
  onOpenDispatches,
  onOpenUnifiedCalendar,
  studentName = 'Shadman Shakib',
  meritPoints = 340,
  isDark,
  initialViewMode = 'hub',
  onViewModeChange,
}) => {
  const [campusViewMode, setCampusViewMode] = useState<
    'hub' | 'clubs' | 'classes' | 'academic-calendar' | 'resources' | 'quiet-zones' | 'steward-console'
  >(initialViewMode);

  useEffect(() => {
    if (initialViewMode) {
      setCampusViewMode(initialViewMode);
    }
  }, [initialViewMode]);

  const handleSetMode = (mode: typeof campusViewMode) => {
    setCampusViewMode(mode);
    onViewModeChange?.(mode);
  };
  const [selectedClub, setSelectedClub] = useState<Club | null>(clubs[0] || null);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<string>('Monday');
  const [selectedSyllabus, setSelectedSyllabus] = useState<AcademicSyllabus | null>(null);
  const [showConsole, setShowConsole] = useState<boolean>(currentRole === 'steward');
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Authority broadcast state
  const [broadcastDraft, setBroadcastDraft] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Teacher logbook signoff state
  const [signedLogbooks, setSignedLogbooks] = useState<Record<string, boolean>>({
    'std-1': true,
    'std-2': true,
    'std-3': false,
  });

  // Synchronize console and campus tabs when role changes dynamically
  // STEWARD CONSOLE IS STRICTLY EXCLUSIVE TO STEWARD ROLE
  useEffect(() => {
    if (currentRole === 'steward') {
      setShowConsole(true);
    } else {
      setShowConsole(false);
      if (campusViewMode === 'steward-console') {
        setCampusViewMode('hub');
      }
    }
  }, [currentRole, campusViewMode]);

  const handleBentoNavigation = (
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
  ) => {
    if (page === 'bazaar') {
      if (onOpenPerksBazaar) {
        onOpenPerksBazaar();
      } else {
        showToastMsg('Opening Physical Perks Bazaar');
      }
      return;
    }
    if (page === 'dispatches') {
      if (onOpenDispatches) {
        onOpenDispatches();
      } else {
        showToastMsg('Opening Messenger');
      }
      return;
    }
    if (page === 'steward-console') {
      if (currentRole !== 'steward') {
        showToastMsg('Institutional Steward Console is exclusive to the Steward role.');
        return;
      }
      setCampusViewMode('steward-console');
      return;
    }
    if (page === 'office-hours') {
      showToastMsg('Faculty Office Hours: Prof. Kaykobad & Mr. Rahman available Mon-Thu 2-4 PM');
      return;
    }
    if (page === 'gear-swap') {
      showToastMsg('Gear & Book Swap Depot: 14 textbooks & 6 lab calculators currently available at Central Desk');
      return;
    }
    setCampusViewMode(page);
  };

  const showToastMsg = (msg: string) => {
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(null), 3000);
  };

  const roleMeta: Record<
    Role,
    {
      title: string;
      tier: string;
      color: string;
      bg: string;
      desc: string;
      capabilities: string[];
    }
  > = {
    dweller: {
      title: 'Dweller (Visitor / Observer)',
      tier: 'Tier 0 · Read-Only Observer',
      color: '#7A8595',
      bg: 'rgba(122,133,149,0.12)',
      desc: 'Airy preview stack. You have read-only federation access without claiming pressure or notification pings.',
      capabilities: ['Read public club charters', 'Browse class timetables', 'Inspect verified syllabus guidelines'],
    },
    aspirant: {
      title: 'Aspirant (Active Student)',
      tier: 'Tier 1 · Standard Student Flow',
      color: '#4D7EF7',
      bg: 'rgba(77,126,247,0.12)',
      desc: 'Standard student flow. You can claim opportunities up to Trialist stage and commit to self-chosen personal tasks.',
      capabilities: ['Claim active trialist fixtures', 'Track 7-day deadlines in Week Strip', 'Mark personal permission slips'],
    },
    member: {
      title: 'Member (Active Scholar)',
      tier: 'Tier 1.5 · Section & Club Scholar',
      color: '#38BDF8',
      bg: 'rgba(56,189,248,0.12)',
      desc: 'Full participant in Section lounges, Class study circles, and Sovereign Student Commons.',
      capabilities: ['Participate in Sovereign Student Commons', 'Collaborate in unmonitored peer circles', 'Claim club fixtures'],
    },
    loyal_core: {
      title: 'Loyal Core (Club Editor)',
      tier: 'Tier 2 · Club Contributor',
      color: '#3DB16E',
      bg: 'rgba(61,177,110,0.12)',
      desc: 'Club content dominant. You can edit club wikis, draft retrospectives, and claim Core commitments.',
      capabilities: ['Inscribe club retrospectives into permanent memory', 'Edit club charter pages', 'Assist trialists on match days'],
    },
    steward: {
      title: 'Steward (Executive Officer)',
      tier: 'Tier 3 · Sovereign Executive',
      color: '#E0A83A',
      bg: 'rgba(224,168,58,0.12)',
      desc: 'Full 6-tab Steward Console unlocked: Delegate, Curate, People, Fairness, Succession, and Wiki.',
      capabilities: ['Publish school-wide opportunities', 'Nominate successor steward', 'Audit member pipeline fairness & workload'],
    },
    teacher: {
      title: 'Teacher (Faculty Advisor)',
      tier: 'Tier 4 · Academic Supervisor',
      color: '#E87A3D',
      bg: 'rgba(232,122,61,0.12)',
      desc: 'Academic section overview. Class logbook verification, student reach statistics, and office hours.',
      capabilities: ['Sign off Section 10-B science logbooks', 'Approve academic permission slips', 'Audit laboratory attendance'],
    },
    authority: {
      title: 'Authority (Principal / Board)',
      tier: 'Tier 5 · Campus Leadership',
      color: '#E5484D',
      bg: 'rgba(229,72,77,0.12)',
      desc: 'District governance. Broadcast official institutional emergency bulletins and audit network fairness.',
      capabilities: ['Broadcast district emergency notices', 'Inspect institution-wide ledger hashes', 'Govern club charters'],
    },
    alumni: {
      title: 'Alumni (Sovereign Fellow)',
      tier: 'Tier 6 · Permanent Archivist',
      color: '#9C7CF8',
      bg: 'rgba(156,124,248,0.12)',
      desc: 'Permanent read-only historical memory. Sovereign Ledger pack verification, fellowship, and archives.',
      capabilities: ['Verify cryptographic ledger provenance', 'Read historical retrospective archives', 'Inspect past fixtures'],
    },
  };

  const currentRoleInfo = roleMeta[currentRole];

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 overflow-hidden">
      <div className="main" id="campusMain">
        <div id="campus-view" className="w-full max-w-7xl mx-auto pt-3 pb-16 text-[var(--text)]">
      {/* Dynamic Feedback Toast */}
      {feedbackNotice && (
        <div className="mb-4 p-3 rounded-[14px] bg-[var(--accent)] text-white text-[13px] font-semibold flex items-center justify-between shadow-lg animate-fadeIn">
          <span>{feedbackNotice}</span>
          <button
            type="button"
            onClick={() => setFeedbackNotice(null)}
            className="text-white/80 hover:text-white text-[16px] leading-none px-2"
          >
            &times;
          </button>
        </div>
      )}

      {/* Screen Title & Invariants Bar */}
      <div className="flex flex-col gap-1.5 mb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h1 className="text-[22px] md:text-[26px] font-extrabold tracking-tight text-[var(--text)]">
              Institutional Campus
            </h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="pill pill-sm on shrink-0">
                Term 2025–2026 · Week 7
              </span>
            </div>
          </div>

          <button
            id="campus-unconventional-btn"
            type="button"
            onClick={() => onOpenUnconventionalFeatures?.()}
            className="pill pill-sm flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] shrink-0 cursor-pointer"
            title="Unconventional Features (PRD & White Paper)"
            aria-label="Unconventional Features"
          >
            <div className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center text-[9.5px] font-bold font-serif italic leading-none">
              i
            </div>
            <span>Invariants</span>
          </button>
        </div>
        <p className="text-[13px] text-[var(--text-secondary)]">
          Springfield High Directory · Sovereign internal spaces and club operating consoles.
        </p>
      </div>

        {/* Role-Specific Executive Action Panels */}

        {/* TEACHER ROLE: Section 10-B Logbook Sign-off Panel */}
        {currentRole === 'teacher' && (
          <div className="p-4 rounded-[18px] bg-[var(--tile)] border border-[rgba(232,122,61,0.3)] shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.08)]">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[var(--orange)]" />
                <span className="text-[14px] font-bold text-[var(--text)]">
                  Teacher Action: Physics Laboratory Logbook Verifications
                </span>
              </div>
              <span className="text-[11px] text-[var(--meta)]">3 pending reviews</span>
            </div>

            <div className="mt-3 flex flex-col gap-2">
              {[
                { id: 'std-1', name: 'Zayan Kabir', exp: 'Electromagnetic Induction Lab Report', date: 'Yesterday 4:20 PM' },
                { id: 'std-2', name: 'Ayesha Siddiqua', exp: 'Diffraction Grating Calibration Data', date: 'Today 9:15 AM' },
                { id: 'std-3', name: 'Tanvir Hossain', exp: 'Operational Amplifiers Circuit Plot', date: 'Today 11:30 AM' },
              ].map((sub) => {
                const isSigned = signedLogbooks[sub.id];
                return (
                  <div
                    key={sub.id}
                    className="p-3 rounded-[12px] bg-[var(--track)] border border-[rgba(255,255,255,0.05)] flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-[13px] font-bold text-[var(--text)]">{sub.name}</div>
                      <div className="text-[11.5px] text-[var(--meta)]">{sub.exp} · {sub.date}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSignedLogbooks((prev) => ({ ...prev, [sub.id]: !isSigned }));
                        showToastMsg(
                          !isSigned
                            ? `Signed off ${sub.name}'s logbook ✓`
                            : `Revoked signoff for ${sub.name}`
                        );
                      }}
                      className={`px-3 py-1.5 rounded-[10px] text-[12px] font-bold transition-all ${
                        isSigned
                          ? 'bg-[var(--green)] text-white'
                          : 'bg-[var(--orange)] text-white hover:opacity-90'
                      }`}
                    >
                      {isSigned ? 'Signed ✓' : 'Sign & Stamp'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* AUTHORITY ROLE: Emergency Institutional Broadcast Composer */}
        {currentRole === 'authority' && (
          <div className="p-4 rounded-[18px] bg-[var(--tile)] border border-[rgba(229,72,77,0.3)] shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.08)]">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[var(--red)]" />
                <span className="text-[14px] font-bold text-[var(--text)]">
                  Authority Action: Campus Institutional Broadcast
                </span>
              </div>
              <span className="text-[11px] text-[var(--red)] font-bold uppercase">Priority Network Level</span>
            </div>

            <div className="mt-3 flex flex-col gap-2.5">
              <textarea
                value={broadcastDraft}
                onChange={(e) => setBroadcastDraft(e.target.value)}
                placeholder="Draft campus advisory (e.g., Campus storm schedule adjustment, Regional Olympiad departure bus details)..."
                rows={2}
                className="w-full p-3 rounded-[12px] bg-[var(--track)] border border-[rgba(255,255,255,0.08)] text-[13px] text-[var(--text)] placeholder-[var(--meta)] outline-none focus:border-[var(--red)]"
              />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[var(--meta)]">
                  Target: All 1,420 Enrolled Students + Faculty
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (!broadcastDraft.trim()) {
                      showToastMsg('Please enter broadcast advisory content');
                      return;
                    }
                    setBroadcastSent(true);
                    showToastMsg('Official bulletin broadcasted across federation network');
                    setBroadcastDraft('');
                  }}
                  className="px-4 py-1.5 rounded-[10px] bg-[var(--red)] text-white text-[12px] font-bold hover:opacity-90 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Broadcast Advisory</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ALUMNI ROLE: Sovereign Ledger Fellowship Archive Seal */}
        {currentRole === 'alumni' && (
          <div className="p-4 rounded-[18px] bg-[var(--tile)] border border-[rgba(156,124,248,0.3)] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-[rgba(156,124,248,0.15)] text-[#9C7CF8] flex items-center justify-center font-serif text-[20px] font-bold">
                ⬣
              </div>
              <div>
                <span className="text-[13.5px] font-bold text-[var(--text)] block">
                  Honorary Fellow: Class of 2024
                </span>
                <span className="text-[12px] text-[var(--meta)]">
                  Cryptographic Ledger Seal: #4D7E-8F12-ALUMNI-PERMANENT
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => showToastMsg('Viewing 2024 Permanent Historical Fixture Archive')}
              className="px-3.5 py-1.5 rounded-[10px] bg-[rgba(156,124,248,0.2)] text-[#BFA6FF] hover:bg-[rgba(156,124,248,0.3)] text-[12px] font-semibold"
            >
              Verify Archives &rarr;
            </button>
          </div>
        )}

      {/* CAMPUS VIEW MODE: BENTO GRID HUB OR DEDICATED SUB-PAGE */}
      {campusViewMode === 'hub' ? (
        <CampusBentoGrid
          clubs={clubs}
          syllabi={MOCK_ACADEMIC_SYLLABI}
          todaySchedule={MOCK_CLASS_SCHEDULE.filter((item) => item.day === 'Monday')}
          currentRole={currentRole}
          unreadDispatchesCount={messages.filter((m) => m.isOfficial).length || 2}
          meritPoints={meritPoints}
          syllabusAlertsActive={true}
          onNavigateTo={handleBentoNavigation}
          isDark={isDark}
        />
      ) : (
        <div className="flex flex-col gap-5">
          {/* Top Back Navigation Bar without path indicator */}
          <div className="flex items-center pb-3 border-b border-[rgba(255,255,255,0.08)]">
            <button
              type="button"
              onClick={() => setCampusViewMode('hub')}
              className="px-3.5 py-1.5 rounded-[12px] bg-[var(--tile)] border border-[rgba(255,255,255,0.1)] text-[12.5px] font-bold text-[var(--text)] hover:-translate-y-0.5 hover:shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Campus Bento Grid</span>
            </button>
          </div>

          {/* CLUBS SUBPAGE */}
          {campusViewMode === 'clubs' && (
            <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {clubs.map((club) => {
              const isSelected = selectedClub?.id === club.id;
              return (
                <div
                  key={club.id}
                  onClick={() => setSelectedClub(club)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedClub(club)}
                  className={`p-4 rounded-[18px] bg-[var(--tile)] border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-[var(--accent)] ring-1 ring-[var(--accent)] shadow-md'
                      : 'border-[rgba(255,255,255,0.06)] hover:-translate-y-1 hover:shadow-md'
                  }`}
                >
                  <div>
                    <span className="text-[10.5px] font-bold text-[var(--accent)] uppercase tracking-wider">
                      {club.category}
                    </span>
                    <h3 className="text-[16px] font-extrabold text-[var(--text)] mt-1">
                      {club.name}
                    </h3>
                    <p className="text-[12.5px] text-[var(--meta)] mt-1 line-clamp-2 leading-snug">
                      {club.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[11.5px] text-[var(--meta)]">
                    <span>{club.memberCount} Members</span>
                    <span className="font-semibold text-[var(--text)]">
                      {club.activeOpportunities} Active Calls
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Club Detail Surface */}
          {selectedClub && (
            <div className="p-5 rounded-[22px] bg-[var(--tile)] border border-[rgba(255,255,255,0.08)] shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[rgba(255,255,255,0.08)]">
                <div>
                  <span className="text-[10.5px] uppercase tracking-wider font-bold text-[var(--accent)]">
                    {selectedClub.category}
                  </span>
                  <h2 className="text-[20px] font-extrabold text-[var(--text)]">
                    {selectedClub.name}
                  </h2>
                  <p className="text-[12.5px] text-[var(--meta)] mt-0.5">
                    Lead Steward: <strong className="text-[var(--text)]">{selectedClub.leadSteward}</strong> · Deputy: {selectedClub.deputySteward}
                  </p>
                </div>

                {currentRole === 'steward' ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowConsole(!showConsole)}
                      className="px-3.5 py-1.5 rounded-[12px] bg-[var(--accent)] text-white text-[12.5px] font-bold hover:opacity-90 active:scale-[0.97] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>{showConsole ? 'Hide Operating Console' : 'Open Steward Console'}</span>
                    </button>
                  </div>
                ) : (
                  <span className="text-[11.5px] px-2.5 py-1 rounded-[8px] bg-[var(--track)] text-[var(--meta)] flex items-center gap-1 font-medium">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Steward-Only Console</span>
                  </span>
                )}
              </div>

              {/* Steward Console Embedded when requested - Strictly for Steward role */}
              {showConsole && currentRole === 'steward' && (
                <StewardsConsole
                  clubName={selectedClub.name}
                  wikiPages={wikiPages.filter((w) => w.clubId === selectedClub.id)}
                  pipeline={pipeline}
                  onAddTask={onAddTask}
                  onAddWikiPage={onAddWikiPage}
                  onNominateSuccessor={onNominateSuccessor}
                  isDark={isDark}
                />
              )}

              {/* Tags & Membership Information */}
              {!showConsole && (
                <div className="pt-4 flex flex-col gap-4">
                  <div>
                    <h4 className="text-[13.5px] font-bold text-[var(--text)] mb-2">
                      Focus Areas &amp; Activity Tags
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedClub.tags.map((tag) => (
                        <span
                          key={tag}
                          className="pill pill-sm on"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-[14px] bg-[var(--track)] border border-[rgba(255,255,255,0.06)] text-[12.5px] text-[var(--meta)] leading-relaxed">
                    <strong className="text-[var(--text)] block mb-1">
                      {currentRole === 'dweller'
                        ? 'Visitor / Observer Clearance:'
                        : currentRole === 'loyal_core'
                        ? 'Loyal Core Editor Clearance:'
                        : 'Aspirant Student Clearance:'}
                    </strong>
                    {currentRole === 'dweller'
                      ? 'You can read club charters and explore public blueprints without joining. To claim tasks or assist during fixtures, switch to Aspirant in Role Calibration.'
                      : currentRole === 'loyal_core'
                      ? 'You can write retrospectives, assist during competition fixtures, and maintain wiki charters.'
                      : 'You are eligible to join regional trials and claim active opportunities.'}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* CLASSES SUBPAGE - INTERACTIVE TIMETABLE & CALENDAR */}
      {campusViewMode === 'classes' && (
        <div className="flex flex-col gap-5">
          {/* SYNCED ACADEMIC YEAR CALENDAR BANNER */}
          <div className="calendar-sync-banner p-4 rounded-[20px] bg-[var(--tile)] border border-[var(--rule)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent)]">
                  Academic Calendar Integration
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-[6px] bg-[var(--tile-active)] border border-[var(--rule)] text-[var(--text-sub)] font-semibold">
                  3-Way Synced
                </span>
              </div>
              <p className="text-[13.5px] text-[var(--text)] font-semibold mt-0.5">
                Class timetable adjusts automatically during official off-days, exam weeks, and study recesses.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCampusViewMode('academic-calendar')}
              className="calendar-sync-btn px-3.5 py-1.5 rounded-[12px] bg-[var(--accent)] text-white text-[12.5px] font-bold hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>View Academic Year Calendar &rarr;</span>
            </button>
          </div>

          {/* Header Banner & Day Selector */}
          <div className="p-5 rounded-[22px] bg-[var(--tile)] border border-[rgba(255,255,255,0.06)] shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-[10px] bg-[var(--accent-soft)] text-[var(--accent)]">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <h3 className="text-[17px] font-extrabold text-[var(--text)]">
                    Academic Timetable &amp; Class Schedule
                  </h3>
                </div>
                <p className="text-[12.5px] text-[var(--meta)] mt-0.5">
                  Section 11-A · Institutional Timetable detailing who conducts which session, venues, and topics.
                </p>
              </div>

              <div className="flex items-center gap-2 text-[12px] text-[var(--meta)]">
                <span className="px-2.5 py-1 rounded-[8px] bg-[var(--track)] border border-[rgba(255,255,255,0.06)] font-mono font-bold text-[var(--text)]">
                  Semester Term 2 (2026)
                </span>
              </div>
            </div>

            {/* Interactive Day Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[rgba(255,255,255,0.06)]">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'All Days'].map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedCalendarDay(day)}
                  className={`chip ${selectedCalendarDay === day ? 'on' : ''}`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule Sessions List */}
          <div className="space-y-3.5">
            {MOCK_CLASS_SCHEDULE.filter(
              (item) => selectedCalendarDay === 'All Days' || item.day === selectedCalendarDay
            ).map((session) => (
              <div
                key={session.id}
                className="timetable-session-card p-4 sm:p-5 rounded-[20px] bg-[var(--tile)] border border-[rgba(255,255,255,0.06)] hover:-translate-y-1 hover:shadow-md transition-all shadow-xs"
              >
                <div className="timetable-session-layout flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Class Info */}
                  <div className="timetable-session-info space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-[6px] bg-[var(--accent-soft)] text-[var(--accent)]">
                        {session.courseCode}
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-[6px] bg-sky-500/15 text-sky-400">
                        {session.day} · Period {session.period}
                      </span>
                      <span className="text-[12px] text-[var(--orange)] font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{session.startTime} – {session.endTime}</span>
                      </span>
                    </div>

                    <h4 className="text-[17px] font-extrabold text-[var(--text)]">
                      {session.courseName}
                    </h4>

                    {/* Venue & Active Topic */}
                    <div className="space-y-1 text-[12.5px]">
                      <div className="flex items-center gap-1.5 text-[var(--text)] font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                        <span>{session.room} · {session.building}</span>
                      </div>
                      <p className="text-[var(--meta)]">
                        <strong className="text-[var(--text)]">Today’s Topic:</strong> {session.currentTopic}
                      </p>
                    </div>

                    {/* Required Materials & Module */}
                    <div className="pt-2 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-[var(--meta)] font-semibold mr-1">
                        Required:
                      </span>
                      {session.requiredMaterials.map((mat, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-2 py-0.5 rounded-[6px] bg-[var(--track)] text-[var(--meta)] border border-white/5"
                        >
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Instructor Card */}
                  <div className="timetable-instructor-card p-3.5 rounded-[16px] bg-[var(--track)] border border-[rgba(255,255,255,0.06)] shrink-0 w-full md:w-64 flex flex-col justify-between">
                    <div>
                      <span className="text-[10.5px] uppercase font-bold text-[var(--meta)] block mb-1.5">
                        Conducted By
                      </span>
                      <div className="flex items-center gap-2.5">
                        <img
                          src={session.instructorAvatar}
                          alt={session.instructorName}
                          className="w-9 h-9 rounded-full object-cover border border-white/10"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h5 className="text-[13px] font-bold text-[var(--text)] leading-tight">
                            {session.instructorName}
                          </h5>
                          <span className="text-[11px] text-[var(--meta)] block">
                            {session.instructorRole}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[11.5px]">
                      <span className="text-[var(--meta)] truncate">
                        Office: {session.officeHours}
                      </span>
                      <button
                        type="button"
                        onClick={() => showToastMsg(`Consultation desk notified for ${session.instructorName}`)}
                        className="text-[var(--accent)] font-bold hover:underline cursor-pointer"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {MOCK_CLASS_SCHEDULE.filter(
              (item) => selectedCalendarDay === 'All Days' || item.day === selectedCalendarDay
            ).length === 0 && (
              <div className="p-8 rounded-[20px] bg-[var(--tile)] border border-[rgba(255,255,255,0.06)] text-center text-[var(--meta)] text-[13px]">
                No scheduled academic periods for {selectedCalendarDay}. Use this time for independent inquiry or laboratory fabrication.
              </div>
            )}
          </div>
        </div>
      )}

      {/* DEDICATED SUB-VIEWS: ACADEMIC CALENDAR, RESOURCES, QUIET ZONES, STEWARD CONSOLE */}
      {campusViewMode === 'academic-calendar' && (
        <AcademicYearCalendarView
          onBack={() => setCampusViewMode('hub')}
          onShowToast={showToastMsg}
          messages={messages}
          onOpenDispatches={onOpenDispatches}
          onConvertToActionableTask={onConvertToActionableTask}
          onOpenUnifiedCalendar={onOpenUnifiedCalendar}
          isDark={isDark}
        />
      )}

      {campusViewMode === 'resources' && (
        <ResourcesSyllabiView
          onBack={() => setCampusViewMode('hub')}
          onShowToast={showToastMsg}
          isDark={isDark}
        />
      )}

      {campusViewMode === 'quiet-zones' && (
        <CampusQuietZonesView
          onBack={() => setCampusViewMode('hub')}
          onShowToast={showToastMsg}
          isDark={isDark}
        />
      )}

      {campusViewMode === 'steward-console' && (
        <div>
          {currentRole === 'steward' ? (
            <StewardsConsole
              clubName={selectedClub?.name || 'Institutional Central Senate'}
              wikiPages={wikiPages}
              pipeline={pipeline}
              onAddTask={onAddTask}
              onAddWikiPage={onAddWikiPage}
              onNominateSuccessor={onNominateSuccessor}
              isDark={isDark}
            />
          ) : (
            <div className="p-8 rounded-[22px] bg-[var(--tile)] border border-[var(--rule)] text-center space-y-3">
              <div className="w-12 h-12 rounded-[16px] bg-[var(--accent-soft)] text-[var(--accent)] mx-auto flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-[18px] font-bold text-[var(--text)]">
                Steward Console Access Restricted
              </h3>
              <p className="text-[13px] text-[var(--meta)] max-w-md mx-auto">
                The Institutional Steward Console is exclusively reserved for the Steward role. Calibrate your role to Steward in the strip above to access governance tabs.
              </p>
              <button
                type="button"
                onClick={() => {
                  onChangeRole?.('steward');
                  showToastMsg('Role calibrated to Steward');
                }}
                className="px-4 py-2 rounded-[12px] bg-[var(--accent)] text-white text-[13px] font-bold cursor-pointer"
              >
                Calibrate to Steward Role
              </button>
            </div>
          )}
        </div>
      )}
        </div>
      )}
        </div>
      </div>
    </div>
  );
};
