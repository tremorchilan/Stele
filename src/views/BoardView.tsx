import React, { useState, useMemo } from 'react';
import { Commitment, StudentProfile } from '../types';
import { CountdownRing } from '../components/CountdownRing';
import { calculateTimeStatus } from '../utils/time';
import {
  CheckCircle2,
  Bookmark,
  Eye,
  Clock,
  Check,
  ShieldAlert,
  BarChart3,
  Flame,
  Award,
  Zap,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  PieChart,
  Calendar,
  Layers,
} from 'lucide-react';
import { TaskAnalytics } from '../components/TaskAnalytics';
import { getSolidTagStyle } from '../utils/colorPills';

interface BoardViewProps {
  commitments: Commitment[];
  onSelectCommitment: (commitment: Commitment) => void;
  onCompleteCommitment: (commitment: Commitment) => void;
  onUnwatchCommitment: (commitmentId: string) => void;
  onOpenUnconventionalFeatures?: () => void;
  initialSection?: 'all' | 'active' | 'watched' | 'past' | 'analytics';
  onSectionChange?: (section: 'all' | 'active' | 'watched' | 'past' | 'analytics') => void;
  profile?: StudentProfile;
  onOpenProfile?: () => void;
}

export const BoardView: React.FC<BoardViewProps> = ({
  commitments,
  onSelectCommitment,
  onCompleteCommitment,
  onUnwatchCommitment,
  onOpenUnconventionalFeatures,
  initialSection = 'all',
  onSectionChange,
  profile,
  onOpenProfile,
}) => {
  const [boardSection, setBoardSection] = useState<'all' | 'active' | 'watched' | 'past' | 'analytics'>(initialSection);

  React.useEffect(() => {
    if (initialSection) {
      setBoardSection(initialSection);
    }
  }, [initialSection]);

  const handleSetSection = (sec: typeof boardSection) => {
    setBoardSection(sec);
    onSectionChange?.(sec);
  };

  const activeItems = commitments.filter((c) => c.status === 'active');
  const watchedItems = commitments.filter((c) => c.status === 'watched');
  const pastItems = commitments.filter((c) => c.status === 'completed' || c.status === 'missed');
  const completedItems = commitments.filter((c) => c.status === 'completed');

  // Compute fulfillment rate
  const pastTotal = pastItems.length;
  const fulfillmentRate = pastTotal > 0 ? Math.round((completedItems.length / pastTotal) * 100) : 100;
  
  // Autonomy ratio (self chosen vs delegated)
  const selfChosenCount = commitments.filter((c) => c.type === 'self_chosen').length;
  const autonomyPercent = commitments.length > 0 ? Math.round((selfChosenCount / commitments.length) * 100) : 100;

  // Urgency distribution for active items
  const urgencyStats = useMemo(() => {
    let critical = 0;
    let impending = 0;
    let relaxed = 0;

    activeItems.forEach((item) => {
      const status = calculateTimeStatus(item.deadline);
      const hoursRemaining = status.totalMsRemaining / (3600 * 1000);
      if (status.isCritical || status.tier === 'critical' || hoursRemaining <= 24) {
        critical++;
      } else if (status.tier === 'urgent' || hoursRemaining <= 72) {
        impending++;
      } else {
        relaxed++;
      }
    });

    return { critical, impending, relaxed };
  }, [activeItems]);

  const isCompetition = (title: string) => {
    const t = title.toLowerCase();
    return (
      t.includes('olympiad') ||
      t.includes('championship') ||
      t.includes('hackathon') ||
      t.includes('debate') ||
      t.includes('debating') ||
      t.includes('contest') ||
      t.includes('competition')
    );
  };

  const [phases, setPhases] = useState<Record<string, 'registered' | 'in_progress' | 'results_pending'>>({
    'commit-1': 'in_progress',
    'commit-2': 'in_progress',
  });

  const getPhase = (id: string) => {
    return phases[id] || 'in_progress';
  };

  const handleAdvancePhaseOrComplete = (item: Commitment) => {
    if (!isCompetition(item.title)) {
      onCompleteCommitment(item);
      return;
    }

    const current = getPhase(item.id);
    if (current === 'registered') {
      setPhases((prev) => ({ ...prev, [item.id]: 'in_progress' }));
    } else if (current === 'in_progress') {
      setPhases((prev) => ({ ...prev, [item.id]: 'results_pending' }));
    } else if (current === 'results_pending') {
      onCompleteCommitment(item);
    }
  };

  // Active items sorted strictly by deadline ascending
  const sortedActive = [...activeItems].sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  );

  // Institution distribution
  const institutionList = useMemo(() => {
    const map: Record<string, number> = {};
    commitments.forEach((c) => {
      const inst = c.sourceInstitution || 'Springfield Sovereign';
      map[inst] = (map[inst] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [commitments]);

  const currentScore = profile?.score ?? 685;
  const currentStreak = profile?.dailyStreak ?? 3;
  const nextMilestone = 750;
  const milestoneProgress = Math.min(100, Math.round((currentScore / nextMilestone) * 100));

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 overflow-y-auto no-scrollbar">
      <div className="main" id="boardMain">
        <div id="board-view" className="w-full max-w-7xl mx-auto pt-4 pb-20">
          
          {/* Header Title & Invariants Rules button */}
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[22px] sm:text-[28px] font-extrabold text-[var(--text-primary)] tracking-tight">
                  Commitments Board
                </h1>
                <span className="px-2 py-0.5 rounded-[6px] bg-[var(--tile-active)] border border-[var(--rule)] text-[var(--text-sub)] text-[11px] font-bold">
                  Sovereign Command
                </span>
              </div>
              <p className="text-[13px] sm:text-[14px] text-[var(--text-secondary)] mt-0.5">
                Personal obligations, active deadlines, and reputation ledger unified in one master command center.
              </p>
            </div>

            <button
              id="board-unconventional-btn"
              type="button"
              onClick={() => onOpenUnconventionalFeatures?.()}
              className="pill pill-sm flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] shrink-0 cursor-pointer shadow-xs"
              title="Commitment Invariants & Rules"
              aria-label="Commitment Invariants"
            >
              <div className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center text-[9.5px] font-bold font-serif italic leading-none">
                i
              </div>
              <span className="hidden sm:inline">Invariants</span>
            </button>
          </div>

          {/* ================= 1. THE SOVEREIGN PULSE: UNIFIED REWARD CIRCUIT & METRIC TILES ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-6">
            
            {/* Tile 1: Score, Reputation Tier & Reward Horizon */}
            <div
              className="p-4 sm:p-5 rounded-[20px] bg-[var(--card)] border border-[rgba(255,255,255,0.07)] shadow-md flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-out cursor-pointer"
              onClick={onOpenProfile}
              title="Inspect Sovereign Reward Circuit & Perks"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Sovereign Reputation</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10.5px] font-extrabold bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30">
                  Tier III · Fellow
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-[30px] sm:text-[34px] font-black tracking-tight text-[var(--text-primary)]">
                  {currentScore}
                </span>
                <span className="text-[14px] font-bold text-[var(--accent)]">
                  PTS
                </span>
                <span className="text-[11px] text-[var(--text-muted)] ml-auto font-medium">
                  {milestoneProgress}% to next perk
                </span>
              </div>

              {/* Progress bar to next perk milestone */}
              <div className="w-full bg-[var(--track)] h-2 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-gradient-to-r from-[var(--orange)] to-[var(--accent)] h-full rounded-full transition-all duration-500"
                  style={{ width: `${milestoneProgress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11.5px] text-[var(--text-secondary)] font-medium pt-1">
                <span>Free Cafeteria Pass at 700 pts</span>
                <span className="text-[var(--accent)] font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Inspect Perks &rarr;
                </span>
              </div>
            </div>

            {/* Tile 2: Consistency Streak & Multiplier Pulse */}
            <div
              className="p-4 sm:p-5 rounded-[20px] bg-[var(--card)] border border-[rgba(255,255,255,0.07)] shadow-md flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-out cursor-pointer"
              onClick={onOpenProfile}
              title="Daily Consistency Streak · Tap to view history"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]/20" />
                  <span>Consistency Streak</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10.5px] font-extrabold bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
                  +15% Multiplier
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-[30px] sm:text-[34px] font-black tracking-tight text-[var(--text-primary)]">
                  {currentStreak}
                </span>
                <span className="text-[14px] font-bold text-[#F59E0B]">
                  DAYS ACTIVE
                </span>
                <span className="text-[11px] text-[var(--text-muted)] ml-auto font-mono">
                  Personal Best: 14d
                </span>
              </div>

              {/* 7-Day Visual Activity Bar */}
              <div className="grid grid-cols-7 gap-1.5 mb-2 py-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
                  const isActive = idx < currentStreak;
                  return (
                    <div key={idx} className="flex flex-col items-center gap-1">
                      <div
                        className={`w-full h-1.5 rounded-full transition-colors ${
                          isActive ? 'bg-[#F59E0B]' : 'bg-[var(--track)]'
                        }`}
                      />
                      <span className="text-[9.5px] font-bold text-[var(--text-muted)]">
                        {day}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[11.5px] text-[var(--text-secondary)] font-medium pt-0.5">
                <span>Deliver commitments daily</span>
                <span className="text-[#F59E0B] font-bold">Unbroken</span>
              </div>
            </div>

            {/* Tile 3: Execution Velocity & Sovereign Reliability */}
            <div className="p-4 sm:p-5 rounded-[20px] bg-[var(--card)] border border-[var(--rule-default)]/70 shadow-md flex flex-col justify-between sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Execution Reliability</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10.5px] font-extrabold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                  {fulfillmentRate}% Fulfilled
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 my-1.5 text-center">
                <div className="p-2 rounded-[12px] bg-[var(--track)] border border-[var(--rule-default)]/60">
                  <span className="text-[18px] sm:text-[20px] font-black text-[#10B981] block leading-tight">
                    {activeItems.length}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Active
                  </span>
                </div>
                <div className="p-2 rounded-[12px] bg-[var(--track)] border border-[var(--rule-default)]/60">
                  <span className="text-[18px] sm:text-[20px] font-black text-[#F59E0B] block leading-tight">
                    {watchedItems.length}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Watched
                  </span>
                </div>
                <div className="p-2 rounded-[12px] bg-[var(--track)] border border-[var(--rule-default)]/60">
                  <span className="text-[18px] sm:text-[20px] font-black text-[#0284C7] block leading-tight">
                    {pastItems.length}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Fulfilled
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11.5px] text-[var(--text-secondary)] font-medium pt-1">
                <span>{autonomyPercent}% Self-Chosen Autonomy</span>
                <span className="text-[#10B981] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Cryptographic Proof
                </span>
              </div>
            </div>

          </div>

          {/* ================= 2. UNIFIED QUICK FILTER RIBBON ================= */}
          <div className="chips mb-6" id="board-tabs">
            <button
              type="button"
              id="board-tab-all"
              onClick={() => handleSetSection('all')}
              className={`chip font-bold ${boardSection === 'all' ? 'on' : ''}`}
              style={
                boardSection === 'all'
                  ? { background: '#3B82F6', borderColor: '#2563EB', color: '#FFFFFF', fontWeight: 800 }
                  : undefined
              }
            >
              <Layers className="w-3.5 h-3.5 mr-1" />
              Unified Dashboard ({commitments.length})
            </button>

            <button
              type="button"
              id="board-tab-active"
              onClick={() => handleSetSection('active')}
              className={`chip font-bold ${boardSection === 'active' ? 'on' : ''}`}
              style={
                boardSection === 'active'
                  ? { background: '#10B981', borderColor: '#059669', color: '#FFFFFF', fontWeight: 800 }
                  : undefined
              }
            >
              Active Obligations ({activeItems.length})
            </button>

            <button
              type="button"
              id="board-tab-watched"
              onClick={() => handleSetSection('watched')}
              className={`chip font-bold ${boardSection === 'watched' ? 'on' : ''}`}
              style={
                boardSection === 'watched'
                  ? { background: '#F59E0B', borderColor: '#D97706', color: '#0F172A', fontWeight: 800 }
                  : undefined
              }
            >
              Watched Queue ({watchedItems.length})
            </button>

            <button
              type="button"
              id="board-tab-past"
              onClick={() => handleSetSection('past')}
              className={`chip font-bold ${boardSection === 'past' ? 'on' : ''}`}
              style={
                boardSection === 'past'
                  ? { background: '#0284C7', borderColor: '#0369A1', color: '#FFFFFF', fontWeight: 800 }
                  : undefined
              }
            >
              Past Archive ({pastItems.length})
            </button>

            <button
              type="button"
              id="board-tab-analytics"
              onClick={() => handleSetSection('analytics')}
              className={`chip flex items-center gap-1.5 font-bold ${boardSection === 'analytics' ? 'on' : ''}`}
              style={
                boardSection === 'analytics'
                  ? { background: '#8B5CF6', borderColor: '#7C3AED', color: '#FFFFFF', fontWeight: 800 }
                  : undefined
              }
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics &amp; Rewards</span>
            </button>
          </div>

          {/* ================= 3. MASTER STAGE: UNIFIED DUAL-COLUMN BENTO ================= */}
          {boardSection === 'analytics' ? (
            /* Full in-depth Analytics View with Embedded Reward Circuit */
            <TaskAnalytics
              commitments={commitments}
              score={currentScore}
              dailyStreak={currentStreak}
              onOpenProfile={onOpenProfile}
              isDark={true}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* PRIMARY LEFT COLUMN: COMMITMENTS STREAM (~65% width) */}
              <div className="lg:col-span-8 flex flex-col gap-6">

                {/* --- A. ACTIVE COMMITMENTS SECTION --- */}
                {(boardSection === 'all' || boardSection === 'active') && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[16px] font-bold text-[var(--text-primary)] tracking-tight">
                          Active Obligations
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-[#10B981] text-white">
                          {activeItems.length} Urgent
                        </span>
                      </div>
                      <span className="text-[12px] text-[var(--text-muted)] font-medium">
                        Sorted by absolute deadline
                      </span>
                    </div>

                    {sortedActive.length > 0 ? (
                      sortedActive.map((item) => {
                        const status = calculateTimeStatus(item.deadline);
                        const isComp = isCompetition(item.title);
                        const compPhase = getPhase(item.id);

                        return (
                          <div
                            key={item.id}
                            id={`commitment-row-${item.id}`}
                            className="commitment-card p-4 sm:p-5 rounded-[20px] bg-[var(--card)] border border-[rgba(255,255,255,0.07)] shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5 sm:gap-4 overflow-hidden group hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
                          >
                            <div
                              className="commitment-header flex items-start gap-3.5 flex-1 cursor-pointer min-w-0"
                              onClick={() => onSelectCommitment(item)}
                            >
                              {item.thumbnailUrl && (
                                <img
                                  src={item.thumbnailUrl}
                                  alt={item.title}
                                  referrerPolicy="no-referrer"
                                  className="commitment-thumb w-14 h-14 sm:w-16 sm:h-16 rounded-[14px] object-cover shrink-0 border border-white/10 shadow-xs group-hover:scale-105 transition-transform"
                                />
                              )}
                              <div className="commitment-body min-w-0 flex-1">
                                <div className="commitment-badges flex items-center gap-1.5 flex-wrap mb-1">
                                  <span
                                    className={`text-[10px] px-2 py-0.5 rounded-[6px] font-bold uppercase tracking-wider ${
                                      item.type === 'delegated'
                                        ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                                        : 'bg-[var(--track)] text-[var(--text-secondary)] border border-[var(--rule)]'
                                    }`}
                                  >
                                    {item.type === 'delegated' ? 'Witnessed Task' : 'Self-Chosen'}
                                  </span>

                                  {isComp && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-[6px] font-bold uppercase tracking-wider bg-[var(--tile-active)] border border-[var(--rule)] text-[var(--text-sub)]">
                                      {compPhase === 'registered' && 'Phase 1: Registered'}
                                      {compPhase === 'in_progress' && 'Phase 2: Submissions Open'}
                                      {compPhase === 'results_pending' && 'Phase 3: Results Awaited'}
                                    </span>
                                  )}

                                  <span className="text-[12px] text-[var(--text-muted)] font-medium">
                                    {item.sourceInstitution}
                                  </span>
                                </div>

                                <h3 className="commitment-title text-[15.5px] sm:text-[17px] font-bold text-[var(--text-primary)] leading-[1.3] group-hover:text-[var(--accent)] transition-colors break-words">
                                  {item.title}
                                </h3>

                                {item.witnessName && (
                                  <p className="text-[12px] text-[var(--text-secondary)] mt-0.5 break-words">
                                    Witness: <strong className="text-[var(--text-primary)]">{item.witnessName}</strong>
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Deadline Visualizer & Action Pill */}
                            <div className="commitment-actions w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-[var(--rule-default)]/40 mt-1 sm:mt-0 shrink-0">
                              <div className="flex items-center gap-2.5">
                                <CountdownRing
                                  deadlineISO={item.deadline}
                                  size="sm"
                                  isEngaged={true}
                                />
                                <div className="text-left sm:text-right">
                                  <span className="text-[9.5px] uppercase tracking-wider text-[var(--text-muted)] block font-semibold leading-tight">
                                    Deadline
                                  </span>
                                  <span
                                    className={`tabular-nums font-bold leading-tight ${
                                      status.isCritical ? 'text-[14px]' : 'text-[13px]'
                                    }`}
                                    style={{
                                      color: status.isMissed
                                        ? 'var(--text-muted)'
                                        : status.isRed
                                        ? 'var(--urgent)'
                                        : 'var(--text-primary)',
                                    }}
                                  >
                                    {status.label}
                                  </span>
                                </div>
                              </div>

                              {/* Action Button: Solid bright green */}
                              <button
                                id={`complete-btn-${item.id}`}
                                type="button"
                                onClick={() => handleAdvancePhaseOrComplete(item)}
                                className="pill pill-sm success font-bold text-[12px] flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                                title={isComp ? 'Advance competition lifecycle phase' : 'Mark task complete'}
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>
                                  {!isComp
                                    ? 'Complete'
                                    : compPhase === 'registered'
                                    ? 'Check In'
                                    : compPhase === 'in_progress'
                                    ? 'Submit'
                                    : 'Claim'}
                                </span>
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 rounded-[20px] bg-[var(--card)] border border-[var(--rule-default)] text-center">
                        <p className="text-[14px] text-[var(--text-secondary)] font-medium">
                          No active obligations right now. Claim an opportunity from Radar!
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* --- B. WATCHED QUEUE SECTION --- */}
                {(boardSection === 'all' || boardSection === 'watched') && (
                  <div className="flex flex-col gap-3 pt-2">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[16px] font-bold text-[var(--text-primary)] tracking-tight">
                          Watched Opportunities Queue
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-[#F59E0B] text-black">
                          {watchedItems.length} Observed
                        </span>
                      </div>
                      <span className="text-[12px] text-[var(--text-muted)] font-medium">
                        Silent observation mode
                      </span>
                    </div>

                    {watchedItems.length > 0 ? (
                      watchedItems.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 sm:p-5 rounded-[20px] bg-[var(--card)] border border-[rgba(255,255,255,0.07)] shadow-md flex items-center justify-between gap-4 group hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
                        >
                          <div className="min-w-0 flex-1">
                            <span className="text-[11px] text-[var(--text-muted)] font-semibold uppercase tracking-wider block">
                              Observing · {item.sourceInstitution}
                            </span>
                            <h3 className="text-[16px] font-bold text-[var(--text-primary)] mt-0.5 truncate group-hover:text-[#F59E0B] transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-[12px] text-[var(--text-muted)] mt-1">
                              Target Deadline: {new Date(item.deadline).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => onUnwatchCommitment(item.id)}
                              className="px-3 py-1.5 rounded-[12px] text-[12px] font-medium border border-[var(--rule-default)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                            >
                              Remove
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                item.status = 'active';
                                handleSetSection('active');
                              }}
                              className="px-3.5 py-1.5 rounded-[12px] bg-[#F59E0B] text-black text-[12px] font-extrabold hover:opacity-95 shadow-sm active:scale-95 transition-all cursor-pointer"
                            >
                              Commit Now
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 rounded-[20px] bg-[var(--card)] border border-[var(--rule-default)] text-center">
                        <p className="text-[14px] text-[var(--text-muted)]">
                          No watched items. Star opportunities on Radar to observe them without notification spam.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* --- C. PAST ARCHIVE SECTION --- */}
                {(boardSection === 'all' || boardSection === 'past') && (
                  <div className="flex flex-col gap-3 pt-2">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[16px] font-bold text-[var(--text-primary)] tracking-tight">
                          Past Fulfilled Archive
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-[#0284C7] text-white">
                          {pastItems.length} Inscribed
                        </span>
                      </div>
                      <span className="text-[12px] text-[var(--text-muted)] font-medium">
                        Witnessed proof ledger
                      </span>
                    </div>

                    {pastItems.length > 0 ? (
                      pastItems.map((item) => {
                        const isMissed = item.status === 'missed';
                        return (
                          <div
                            key={item.id}
                            className={`p-4 sm:p-5 rounded-[20px] bg-[var(--card)] border shadow-md transition-all ${
                              isMissed
                                ? 'border-dashed border-[var(--text-muted)]/50 opacity-75'
                                : 'border-[var(--rule-default)]/70'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span
                                    className={`text-[10px] px-2 py-0.5 rounded-[6px] font-bold uppercase tracking-wider ${
                                      isMissed
                                        ? 'bg-[var(--text-muted)]/15 text-[var(--text-muted)]'
                                        : 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                                    }`}
                                  >
                                    {isMissed ? 'Missed Deadline' : 'Witnessed Completion'}
                                  </span>
                                  <span className="text-[11.5px] text-[var(--text-muted)] truncate">
                                    {item.sourceInstitution}
                                  </span>
                                </div>

                                <h4 className="text-[15.5px] font-bold text-[var(--text-primary)]">
                                  {item.title}
                                </h4>

                                {item.witnessName && (
                                  <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">
                                    Witness Verified: <strong className="text-[var(--text-primary)]">{item.witnessName}</strong>
                                  </p>
                                )}

                                {item.retrospective && (
                                  <div className="mt-2.5 p-2.5 rounded-[12px] bg-[var(--canvas)] border border-[var(--rule-default)] text-[12px] text-[var(--text-secondary)]">
                                    <span className="font-bold text-[var(--text-primary)] block mb-0.5">
                                      Archived Knowledge Retrospective:
                                    </span>
                                    <p className="italic">&ldquo;{item.retrospective.wentWell}&rdquo;</p>
                                  </div>
                                )}
                              </div>

                              <div className="text-right shrink-0">
                                {isMissed ? (
                                  <span className="text-[12px] font-medium text-[var(--text-muted)] border-b border-dashed border-[var(--text-muted)] pb-0.5">
                                    Uncompleted
                                  </span>
                                ) : (
                                  <span className="text-[12.5px] font-bold text-[#10B981] flex items-center gap-1">
                                    <CheckCircle2 className="w-4 h-4" /> Inscribed
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 rounded-[20px] bg-[var(--card)] border border-[var(--rule-default)] text-center">
                        <p className="text-[14px] text-[var(--text-muted)]">
                          No historical archived commitments yet.
                        </p>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* SECONDARY RIGHT BENTO RAIL: LIVE ANALYTICS & INSIGHTS (~35% width) */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                
                {/* Bento Card 1: Urgency & Deadline Pressure */}
                <div className="p-4 sm:p-5 rounded-[20px] bg-[var(--card)] border border-[var(--rule-default)]/70 shadow-md">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--rule-default)]/50 mb-3">
                    <span className="text-[12px] font-extrabold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                      <PieChart className="w-3.5 h-3.5 text-[#EF4444]" />
                      <span>Deadline Pressure</span>
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)] font-mono">
                      {activeItems.length} Total
                    </span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {/* Critical */}
                    <div className="flex items-center justify-between text-[12.5px]">
                      <span className="flex items-center gap-2 font-medium text-[var(--text)]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                        Critical (&le; 24h)
                      </span>
                      <span className="font-extrabold text-[#EF4444] tabular-nums">
                        {urgencyStats.critical}
                      </span>
                    </div>

                    {/* Impending */}
                    <div className="flex items-center justify-between text-[12.5px]">
                      <span className="flex items-center gap-2 font-medium text-[var(--text)]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                        Impending (&le; 72h)
                      </span>
                      <span className="font-extrabold text-[#F59E0B] tabular-nums">
                        {urgencyStats.impending}
                      </span>
                    </div>

                    {/* Relaxed */}
                    <div className="flex items-center justify-between text-[12.5px]">
                      <span className="flex items-center gap-2 font-medium text-[var(--text)]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                        On Track (&gt; 72h)
                      </span>
                      <span className="font-extrabold text-[#10B981] tabular-nums">
                        {urgencyStats.relaxed}
                      </span>
                    </div>
                  </div>

                  {/* Segmented bar */}
                  <div className="w-full bg-[var(--track)] h-2 rounded-full overflow-hidden mt-3 flex">
                    <div
                      className="bg-[#EF4444] h-full"
                      style={{
                        width: activeItems.length > 0 ? `${(urgencyStats.critical / activeItems.length) * 100}%` : '0%',
                      }}
                    />
                    <div
                      className="bg-[#F59E0B] h-full"
                      style={{
                        width: activeItems.length > 0 ? `${(urgencyStats.impending / activeItems.length) * 100}%` : '0%',
                      }}
                    />
                    <div
                      className="bg-[#10B981] h-full"
                      style={{
                        width: activeItems.length > 0 ? `${(urgencyStats.relaxed / activeItems.length) * 100}%` : '100%',
                      }}
                    />
                  </div>
                </div>

                {/* Bento Card 2: Top Sourcing Institutions */}
                <div className="p-4 sm:p-5 rounded-[20px] bg-[var(--card)] border border-[var(--rule-default)]/70 shadow-md">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--rule-default)]/50 mb-3">
                    <span className="text-[12px] font-extrabold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>Federated Sources</span>
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      Top Sponsors
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {institutionList.map((inst) => {
                      const tagStyle = getSolidTagStyle(inst.name);
                      return (
                        <div
                          key={inst.name}
                          className="flex items-center justify-between p-2 rounded-[12px] bg-[var(--track)] border border-[var(--rule-default)]/60 text-[12px]"
                        >
                          <span className="font-semibold text-[var(--text-primary)] truncate max-w-[190px]">
                            {inst.name}
                          </span>
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0"
                            style={{
                              backgroundColor: tagStyle.bg,
                              color: tagStyle.text,
                            }}
                          >
                            {inst.count} Tasks
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bento Card 3: Quick Starred Opportunity Shortcut */}
                {watchedItems.length > 0 && (
                  <div className="p-4 sm:p-5 rounded-[20px] bg-[var(--card)] border border-[#F59E0B]/40 shadow-md relative overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#F59E0B] flex items-center gap-1">
                        <Bookmark className="w-3.5 h-3.5 fill-[#F59E0B]" />
                        <span>Ready to Claim</span>
                      </span>
                    </div>

                    <h4 className="text-[14px] font-bold text-[var(--text-primary)] line-clamp-1 mb-1">
                      {watchedItems[0].title}
                    </h4>
                    <p className="text-[11.5px] text-[var(--text-muted)] mb-3">
                      Due {new Date(watchedItems[0].deadline).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        watchedItems[0].status = 'active';
                        handleSetSection('active');
                      }}
                      className="w-full py-2 rounded-[12px] bg-[#F59E0B] text-black font-extrabold text-[12px] shadow-sm hover:opacity-95 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Commit to Task Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Bento Card 4: Switch to Full Analytics Suite Shortcut */}
                <div className="p-4 rounded-[20px] bg-[var(--track)] border border-[var(--rule-default)]/60 text-center">
                  <span className="text-[12px] text-[var(--text-secondary)] font-medium block mb-2">
                    Need in-depth velocity curves &amp; retrospectives?
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSetSection('analytics')}
                    className="w-full py-2 rounded-[12px] bg-[var(--card)] hover:bg-[var(--tile-active)] border border-[var(--rule-default)] text-[var(--text)] text-[12px] font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <BarChart3 className="w-4 h-4 text-[#8B5CF6]" />
                    <span>Open Task Analytics Suite</span>
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
