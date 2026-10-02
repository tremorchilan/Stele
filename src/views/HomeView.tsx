import React, { useState, useEffect } from 'react';
import { SteleItem, Commitment, NoticeItem, Role } from '../types';
import { WeekStrip } from '../components/WeekStrip';
import { CardItem } from '../components/CardItem';
import { Sparkles, ArrowRight, Compass, Zap, MessageSquare, ShieldCheck, ChevronRight } from 'lucide-react';

interface HomeViewProps {
  items: SteleItem[];
  commitments: Commitment[];
  notices: NoticeItem[];
  currentRole: Role;
  onSelectItem: (item: SteleItem) => void;
  onOpenCommitment: (commitment: Commitment) => void;
  onNavigateTab: (tab: 'radar' | 'board' | 'campus') => void;
  onFlashNotch?: () => void;
  onShowToast?: (msg: string) => void;
  onOpenDetailSheet?: () => void;
  onOpenUnconventionalFeatures?: () => void;
  onOpenProfile?: () => void;
  onInspectNotice?: () => void;
  onFulfillSlip?: () => void;
  onOpenCatchupDigest?: () => void;
  onOpenDispatches?: () => void;
  onOpenUnifiedCalendar?: () => void;
  streakCount?: number;
  score?: number;
}

const WEEK_DAYS = [
  { label: 'Wed', date: '12', count: 3 },
  { label: 'Thu', date: '13', count: 2 },
  { label: 'Fri', date: '14', count: 1 },
  { label: 'Sat', date: '15', count: 4 },
  { label: 'Sun', date: '16', count: 0 },
  { label: 'Mon', date: '17', count: 1 },
  { label: 'Tue', date: '18', count: 2 },
];

export const HomeView: React.FC<HomeViewProps> = ({
  items,
  commitments,
  notices,
  currentRole,
  onSelectItem,
  onOpenCommitment,
  onNavigateTab,
  onFlashNotch,
  onShowToast,
  onOpenDetailSheet,
  onOpenUnconventionalFeatures,
  onOpenProfile,
  onInspectNotice,
  onFulfillSlip,
  onOpenCatchupDigest,
  onOpenDispatches,
  onOpenUnifiedCalendar,
  streakCount,
  score,
}) => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [isChecked, setIsChecked] = useState(true);
  const [ringProgress, setRingProgress] = useState(40);

  // Dynamic bar breathing animation
  const [barOrangeWidth, setBarOrangeWidth] = useState(30);
  const [barAmberWidth, setBarAmberWidth] = useState(70);

  useEffect(() => {
    let t = 0;
    let animId: number;
    const renderLoop = () => {
      t += 0.02;
      setBarOrangeWidth(30 + Math.sin(t * 1.5) * 4);
      setBarAmberWidth(70 + Math.cos(t * 1.2) * 5);
      animId = requestAnimationFrame(renderLoop);
    };
    animId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const currentDayData = WEEK_DAYS[selectedDay] || WEEK_DAYS[0];

  const heroCommitment = commitments.find((c) => c.status === 'active') || commitments[0];
  const heroTitle = heroCommitment ? heroCommitment.title : 'Robotics Olympiad — Regional';
  const heroSource = heroCommitment
    ? `${heroCommitment.sourceInstitution} · ${heroCommitment.stewardName}`
    : 'Springfield High · Mr. Rahman';

  const previewNotice = notices[0] || {
    title: 'Fee deadline extended',
    summary: 'Registration window now closes Friday',
  };

  const handleTileClick = () => {
    onFlashNotch?.();
  };

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 overflow-hidden">
      {/* 7-Day Calendar Strip from Reference */}
      <WeekStrip
        selectedDay={selectedDay}
        onSelectDay={(day) => {
          setSelectedDay(day);
          onShowToast?.(`Day selected: ${WEEK_DAYS[day].label} ${WEEK_DAYS[day].date}`);
        }}
        onFlashNotch={onFlashNotch}
        onOpenUnifiedCalendar={onOpenUnifiedCalendar}
      />

      <div className="main" id="homeMain">
        <div className="w-full max-w-7xl mx-auto pb-8">
        {/* Header Row from Reference */}
        <div className="header-row">
          <div>
            <div className="app-title-wrap">
              <div className="app-title">
                St<em>e</em>le
              </div>
              <div className="live-dot" />
            </div>
            <div className="app-sub" id="appSub">
              <b>{currentDayData.count} Opportunities</b> · {currentDayData.label} {currentDayData.date}
            </div>
          </div>
          <div className="header-actions">
            <button
              className="icon-btn"
              id="unconventionalInfoBtn"
              aria-label="Unconventional Features & PRD Invariants"
              title="Unconventional Features (PRD & White Paper)"
              type="button"
              onClick={() => onOpenUnconventionalFeatures?.()}
            >
              <div className="w-5 h-5 rounded-full border-[1.5px] border-[var(--accent)] text-[var(--accent)] flex items-center justify-center text-[12px] font-bold font-serif italic leading-none shadow-xs">
                i
              </div>
            </button>
            <button
              className="icon-btn"
              id="searchBtn"
              aria-label="Search"
              type="button"
              onClick={() => onShowToast?.('Search: STEM, Hackathons, Olympiad')}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
            </button>
            <button
              className="icon-btn"
              id="bellBtn"
              aria-label="Notifications"
              type="button"
              onClick={() => onShowToast?.('2 active deadlines approaching')}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.7 21a2 2 0 01-3.4 0" />
              </svg>
              <span className="ping" />
            </button>
          </div>
        </div>

        {/* Bento Grid from Reference */}
        <div className="bento">
          {/* Hero 2×2 Tile */}
          <div
            className="tile hero relative overflow-hidden"
            id="tileHero"
            onClick={() => {
              handleTileClick();
              if (onOpenDetailSheet) {
                onOpenDetailSheet();
              } else if (heroCommitment) {
                onOpenCommitment(heroCommitment);
              }
            }}
          >
            {/* Subtle dummy thumbnail scrim banner */}
            <div className="absolute inset-0 z-0 opacity-15 pointer-events-none overflow-hidden">
              <img
                src={items[0]?.thumbnailUrl || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'}
                alt=""
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--tile)] via-[var(--tile)]/70 to-transparent" />
            </div>

            <div className="pill urgent relative z-1">
              <i />
              Closing soon
            </div>
            <div className="hero-title relative z-1">{heroTitle}</div>
            <div className="hero-source relative z-1">{heroSource}</div>

            <div className="hero-avatars relative z-1">
              <div className="ava" style={{ background: '#4D7EF7' }}>AR</div>
              <div className="ava" style={{ background: '#E87A3D' }}>JK</div>
              <div className="ava" style={{ background: '#3DB16E' }}>MS</div>
              <span className="ava-more">+12 joined</span>
            </div>

            <div className="hero-bottom relative z-1">
              <div className="deadline-fig">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                <span id="heroTime">6 hours left</span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill orange"
                  id="barOrange"
                  style={{ width: `${barOrangeWidth.toFixed(1)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Wide Ring 2×1 Tile */}
          <div
            className="tile wide-ring"
            id="tileRing"
            onClick={() => {
              handleTileClick();
              setRingProgress((prev) => (prev === 40 ? 80 : 40));
              onShowToast?.('Design Hackathon: 70% seats filled');
            }}
          >
            <div className="ring-wrap">
              <svg viewBox="0 0 52 52">
                <defs>
                  <linearGradient id="amberGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFDB8A" />
                    <stop offset="100%" stopColor="#E0A83A" />
                  </linearGradient>
                </defs>
                <circle className="ring-bg" cx="26" cy="26" r="22" />
                <circle
                  className="ring-fg"
                  id="ringFg"
                  cx="26"
                  cy="26"
                  r="22"
                  style={{ strokeDashoffset: ringProgress }}
                />
              </svg>
              <div className="ring-label">{ringProgress === 40 ? '2d' : '4d'}</div>
            </div>
            <div className="ring-text">
              <b>Design Hackathon</b>
              <span>70% seats filled · Hall B</span>
            </div>
          </div>

          {/* Wide Check 2×1 Tile */}
          <div
            className={`tile wide-check ${isChecked ? 'done' : ''}`}
            id="tileCheck"
            onClick={() => {
              handleTileClick();
              const next = !isChecked;
              setIsChecked(next);
              if (next) {
                onFulfillSlip?.();
                onShowToast?.('+20 pts · Institutional Slip Signed ✓');
              } else {
                onShowToast?.('Pending permission slip signature');
              }
            }}
          >
            <div className="check-icon">
              <svg viewBox="0 0 28 28" fill="none">
                <path
                  d="M6 15.5L11.5 21L22 8"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="check-text">
              <b>{isChecked ? 'Forms signed ✓' : 'Permission slip'}</b>
              <span>{isChecked ? 'All set — approved' : 'Tap to mark permission slip'}</span>
            </div>
          </div>

          {/* Standard Notice 1×1 Tile */}
          <div
            className="tile std-notice"
            id="tileNotice"
            onClick={() => {
              handleTileClick();
              onInspectNotice?.();
              onShowToast?.('+15 pts · Inspected Official Notice: Fee deadline extended');
            }}
          >
            <div className="notice-title">{previewNotice.title}</div>
            <div className="notice-ctx">{previewNotice.summary}</div>
            <div className="notice-link">
              View notice <span>&rarr;</span>
            </div>
          </div>

          {/* Standard Deadline 1×1 Tile */}
          <div
            className="tile std-deadline"
            id="tileDeadline"
            onClick={() => {
              handleTileClick();
              onShowToast?.('Autonomous Robotics Pitch Deck: 2 days remaining');
            }}
          >
            <div className="deadline-amber" id="amberTime">2 days left</div>
            <div className="notice-ctx" style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '5px', lineHeight: 1.3 }}>
              Autonomous Robotics Pitch Deck
            </div>
            <div className="bar-track">
              <div
                className="bar-fill amber"
                id="barAmber"
                style={{ width: `${barAmberWidth.toFixed(1)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Messenger & Catch-up Digest Full-Width Banner: Sleek, clickable, no overflow */}
        <div
          className="w-full mt-3 p-3.5 sm:p-4 rounded-[18px] sm:rounded-[20px] bg-[var(--tile)] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(56,189,248,0.35)] transition-all flex items-center justify-between gap-3 shadow-xs cursor-pointer group active:scale-[0.98]"
          id="tileCatchupDigest"
          onClick={() => {
            handleTileClick();
            onOpenCatchupDigest?.();
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleTileClick();
              onOpenCatchupDigest?.();
            }
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[12px] sm:rounded-[14px] bg-[var(--track)] flex items-center justify-center border border-[var(--rule)] text-[var(--text)] shrink-0">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-[13.5px] sm:text-[14px] font-extrabold text-[var(--text)] transition-colors">
                  Catch-up Digest
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-[var(--track)] text-[var(--text)] text-[10.5px] font-bold border border-[var(--rule)]">
                  5 New
                </span>
                <span className="text-[11px] text-[var(--meta)] font-medium hidden sm:inline">
                  Private Broadcast
                </span>
              </div>
              <p className="text-[11.5px] sm:text-[12px] text-[var(--text-secondary)] mt-0.5 truncate">
                5 missed messages across Section 11-A &amp; Robotics · Tap to review
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[var(--text-sub)] group-hover:text-[var(--text)] shrink-0 group-hover:translate-x-0.5 transition-all text-[12px] font-semibold">
            <span className="hidden sm:inline">Review</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Featured Opportunities Section */}
        <div className="mt-6 pt-5 border-t border-[rgba(255,255,255,0.07)]">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold text-[var(--text)] tracking-tight">
                Featured Opportunities
              </span>
              <span className="pill pill-sm active-status font-bold">
                {items.length} Active
              </span>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('radar')}
              className="text-[12px] font-semibold text-[var(--accent)] hover:underline flex items-center gap-1"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="home-opportunities-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {items.slice(0, 4).map((item) => (
              <CardItem
                key={item.id}
                item={item}
                onSelect={onSelectItem}
              />
            ))}
          </div>
        </div>

        {/* Explore Radar Feed Shortcut */}
        <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.07)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--orange)]" />
            <span className="text-[13px] font-semibold text-[var(--text)]">
              All Opportunity Radar Feed
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('radar')}
            className="text-[12px] font-semibold text-[var(--accent)] hover:underline flex items-center gap-1"
          >
            <span>Open Radar View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};
