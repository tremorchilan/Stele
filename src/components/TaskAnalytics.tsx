import React, { useMemo, useState } from 'react';
import { Commitment } from '../types';
import { calculateTimeStatus } from '../utils/time';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  Flame,
  PieChart,
  ShieldCheck,
  Calendar,
  Award,
  Zap,
  Check,
  Target,
  Sparkles,
} from 'lucide-react';

interface TaskAnalyticsProps {
  commitments: Commitment[];
  isDark?: boolean;
  score?: number;
  dailyStreak?: number;
  onOpenProfile?: () => void;
}

export const TaskAnalytics: React.FC<TaskAnalyticsProps> = ({
  commitments,
  isDark = true,
  score = 685,
  dailyStreak = 3,
  onOpenProfile,
}) => {
  const [timeHorizon, setTimeHorizon] = useState<'all' | '30d' | '7d'>('all');

  const nextMilestone = 750;
  const milestoneProgress = Math.min(100, Math.round((score / nextMilestone) * 100));

  // Compute analytics
  const metrics = useMemo(() => {
    const total = commitments.length;
    const active = commitments.filter((c) => c.status === 'active');
    const watched = commitments.filter((c) => c.status === 'watched');
    const completed = commitments.filter((c) => c.status === 'completed');
    const missed = commitments.filter((c) => c.status === 'missed');

    const pastTotal = completed.length + missed.length;
    const fulfillmentRate = pastTotal > 0 ? Math.round((completed.length / pastTotal) * 100) : 100;

    // Retrospectives written
    const retrosCount = completed.filter((c) => !!c.retrospective).length;
    const retroRate = completed.length > 0 ? Math.round((retrosCount / completed.length) * 100) : 100;

    // Type breakdown
    const selfChosen = commitments.filter((c) => c.type === 'self_chosen').length;
    const delegated = commitments.filter((c) => c.type === 'delegated').length;
    const autonomyScore = total > 0 ? Math.round((selfChosen / total) * 100) : 100;

    // Urgency distribution for active items
    let criticalCount = 0;
    let impendingCount = 0;
    let relaxedCount = 0;

    active.forEach((item) => {
      const status = calculateTimeStatus(item.deadline);
      const hoursRemaining = status.totalMsRemaining / (3600 * 1000);
      if (status.isCritical || status.tier === 'critical' || hoursRemaining <= 24) {
        criticalCount++;
      } else if (status.tier === 'urgent' || hoursRemaining <= 72) {
        impendingCount++;
      } else {
        relaxedCount++;
      }
    });

    // Institution breakdown
    const institutionMap: Record<string, number> = {};
    commitments.forEach((c) => {
      const inst = c.sourceInstitution || 'General Academic';
      institutionMap[inst] = (institutionMap[inst] || 0) + 1;
    });

    const institutionList = Object.entries(institutionMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    // Estimated focus hours (assuming avg 2.5 hrs per active/completed task)
    const estimatedFocusHours = Math.round(completed.length * 2.5 + active.length * 1.2);

    return {
      total,
      activeCount: active.length,
      watchedCount: watched.length,
      completedCount: completed.length,
      missedCount: missed.length,
      fulfillmentRate,
      retrosCount,
      retroRate,
      selfChosen,
      delegated,
      autonomyScore,
      criticalCount,
      impendingCount,
      relaxedCount,
      institutionList,
      estimatedFocusHours,
    };
  }, [commitments]);

  return (
    <div className="flex flex-col gap-5 pt-2 pb-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-[18px] bg-[var(--card)] border border-[var(--rule-default)]">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[var(--accent)]" />
            <h2 className="text-[17px] font-bold text-[var(--text-primary)]">
              Task Velocity &amp; Sovereign Fulfillment
            </h2>
          </div>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
            Cryptographic ledger analytics across personal obligations, delivery cadence, and retro-inscriptions.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-[12px] bg-[var(--canvas)] border border-[var(--rule-default)] self-start sm:self-auto">
          {(['all', '30d', '7d'] as const).map((hz) => (
            <button
              key={hz}
              type="button"
              onClick={() => setTimeHorizon(hz)}
              className={`px-3 py-1 rounded-[8px] text-[12px] font-semibold transition-all ${
                timeHorizon === hz
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {hz === 'all' ? 'All Time' : hz === '30d' ? '30 Days' : '7 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Embedded Sovereign Reward Circuit & Streak Multiplier */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Reward Horizon & Score */}
        <div
          className="p-4 sm:p-5 rounded-[20px] bg-[var(--card)] border border-[rgba(255,255,255,0.07)] shadow-sm flex flex-col justify-between group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-out cursor-pointer"
          onClick={onOpenProfile}
          title="Inspect Sovereign Reward Circuit & Perks"
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Sovereign Reward Circuit</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10.5px] font-extrabold bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30">
              Tier III · Fellow
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-[30px] font-black tracking-tight text-[var(--text-primary)]">
              {score}
            </span>
            <span className="text-[14px] font-bold text-[var(--accent)]">
              PTS
            </span>
            <span className="text-[11px] text-[var(--text-muted)] ml-auto font-medium">
              {milestoneProgress}% to next perk
            </span>
          </div>

          <div className="w-full bg-[var(--track)] h-2 rounded-full overflow-hidden mb-2">
            <div
              className="bg-gradient-to-r from-[var(--orange)] to-[var(--accent)] h-full rounded-full transition-all duration-500"
              style={{ width: `${milestoneProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11.5px] text-[var(--text-secondary)] font-medium pt-1">
            <span>Next: Cafeteria Pass at 750 pts</span>
            <span className="text-[var(--accent)] font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Inspect Perks &rarr;
            </span>
          </div>
        </div>

        {/* Consistency Streak Tracker */}
        <div
          className="p-4 sm:p-5 rounded-[20px] bg-[var(--card)] border border-[var(--rule-default)] shadow-sm flex flex-col justify-between group hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer"
          onClick={onOpenProfile}
          title="Daily Consistency Streak · Tap to view history"
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]/20" />
              <span>Consistency Streak Engine</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10.5px] font-extrabold bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
              +15% Multiplier Active
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-[30px] font-black tracking-tight text-[var(--text-primary)]">
              {dailyStreak}
            </span>
            <span className="text-[14px] font-bold text-[#F59E0B]">
              DAYS ACTIVE
            </span>
            <span className="text-[11px] text-[var(--text-muted)] ml-auto font-mono">
              Cadence: 100% On-Time
            </span>
          </div>

          {/* 7-Day Visual Activity Bar */}
          <div className="grid grid-cols-7 gap-1.5 mb-2 py-1">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
              const isActive = idx < dailyStreak;
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
            <span>Delivered daily commitments without breaking chain</span>
            <span className="text-[#F59E0B] font-bold">Unbroken</span>
          </div>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Fulfillment Rate */}
        <div className="p-4 rounded-[18px] bg-[var(--card)] border border-[var(--rule-default)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[12px] text-[var(--text-secondary)]">
            <span>Fulfillment Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <span className="text-[28px] font-extrabold font-mono text-[var(--text-primary)] tracking-tight">
              {metrics.fulfillmentRate}%
            </span>
          </div>
          <div className="w-full bg-[var(--canvas)] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${metrics.fulfillmentRate}%` }}
            />
          </div>
          <span className="text-[11px] text-[var(--text-muted)] mt-2">
            {metrics.completedCount} fulfilled · {metrics.missedCount} missed
          </span>
        </div>

        {/* Active Commitments */}
        <div className="p-4 rounded-[18px] bg-[var(--card)] border border-[var(--rule-default)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[12px] text-[var(--text-secondary)]">
            <span>Active Pressure</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <span className="text-[28px] font-extrabold font-mono text-[var(--text-primary)] tracking-tight">
              {metrics.activeCount}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-amber-400 font-semibold">{metrics.criticalCount} due &lt;24h</span>
            <span>· {metrics.impendingCount} in 3d</span>
          </div>
          <span className="text-[11px] text-[var(--text-muted)] mt-2">
            {metrics.watchedCount} watched in background
          </span>
        </div>

        {/* Autonomy & Self-Choice */}
        <div className="p-4 rounded-[18px] bg-[var(--card)] border border-[var(--rule-default)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[12px] text-[var(--text-secondary)]">
            <span>Sovereign Autonomy</span>
            <ShieldCheck className="w-4 h-4 text-sky-400" />
          </div>
          <div className="my-2">
            <span className="text-[28px] font-extrabold font-mono text-[var(--text-primary)] tracking-tight">
              {metrics.autonomyScore}%
            </span>
          </div>
          <div className="w-full bg-[var(--canvas)] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-sky-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${metrics.autonomyScore}%` }}
            />
          </div>
          <span className="text-[11px] text-[var(--text-muted)] mt-2">
            {metrics.selfChosen} self-chosen · {metrics.delegated} witnessed
          </span>
        </div>

        {/* Retrospective Capture */}
        <div className="p-4 rounded-[18px] bg-[var(--card)] border border-[var(--rule-default)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[12px] text-[var(--text-secondary)]">
            <span>Knowledge Inscription</span>
            <Award className="w-4 h-4 text-[var(--accent)]" />
          </div>
          <div className="my-2">
            <span className="text-[28px] font-extrabold font-mono text-[var(--text-primary)] tracking-tight">
              {metrics.retroRate}%
            </span>
          </div>
          <div className="w-full bg-[var(--canvas)] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[var(--accent)] h-full rounded-full transition-all duration-500"
              style={{ width: `${metrics.retroRate}%` }}
            />
          </div>
          <span className="text-[11px] text-[var(--text-muted)] mt-2">
            {metrics.retrosCount} archived retrospectives
          </span>
        </div>
      </div>

      {/* Visual Analytics Bento Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Urgency & Time-Horizon Breakdown */}
        <div className="p-5 rounded-[20px] bg-[var(--card)] border border-[var(--rule-default)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--accent)]" />
              <span>Active Deadline Horizons</span>
            </h3>
            <span className="text-[11.5px] font-mono text-[var(--text-muted)]">
              {metrics.activeCount} Pending Tasks
            </span>
          </div>

          <div className="space-y-3.5">
            {/* Critical */}
            <div>
              <div className="flex items-center justify-between text-[12.5px] mb-1">
                <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Critical Horizon (&lt; 24 Hours)
                </span>
                <span className="font-mono font-bold text-[var(--text-primary)]">
                  {metrics.criticalCount} tasks
                </span>
              </div>
              <div className="w-full bg-[var(--canvas)] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${metrics.activeCount > 0 ? (metrics.criticalCount / metrics.activeCount) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Impending */}
            <div>
              <div className="flex items-center justify-between text-[12.5px] mb-1">
                <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Impending Horizon (1 to 3 Days)
                </span>
                <span className="font-mono font-bold text-[var(--text-primary)]">
                  {metrics.impendingCount} tasks
                </span>
              </div>
              <div className="w-full bg-[var(--canvas)] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${metrics.activeCount > 0 ? (metrics.impendingCount / metrics.activeCount) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Relaxed */}
            <div>
              <div className="flex items-center justify-between text-[12.5px] mb-1">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Planned Horizon (&gt; 3 Days)
                </span>
                <span className="font-mono font-bold text-[var(--text-primary)]">
                  {metrics.relaxedCount} tasks
                </span>
              </div>
              <div className="w-full bg-[var(--canvas)] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${metrics.activeCount > 0 ? (metrics.relaxedCount / metrics.activeCount) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 p-3 rounded-[12px] bg-[var(--canvas)] border border-[var(--rule-default)] flex items-center justify-between text-[12px]">
            <span className="text-[var(--text-secondary)]">Total estimated focus hours:</span>
            <span className="font-bold text-[var(--accent)] font-mono">
              ~{metrics.estimatedFocusHours} Focus Hours
            </span>
          </div>
        </div>

        {/* Institution & Domain Load Distribution */}
        <div className="p-5 rounded-[20px] bg-[var(--card)] border border-[var(--rule-default)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-[var(--text-primary)] flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[var(--accent)]" />
              <span>Institutional Commitment Origin</span>
            </h3>
            <span className="text-[11.5px] font-mono text-[var(--text-muted)]">
              {metrics.total} Total Logged
            </span>
          </div>

          <div className="space-y-3">
            {metrics.institutionList.map((inst, index) => {
              const pct = metrics.total > 0 ? Math.round((inst.count / metrics.total) * 100) : 0;
              const colors = ['bg-indigo-500', 'bg-sky-500', 'bg-amber-500', 'bg-emerald-500'];
              return (
                <div key={inst.name}>
                  <div className="flex items-center justify-between text-[12.5px] mb-1">
                    <span className="text-[var(--text-primary)] font-medium truncate max-w-[200px]">
                      {inst.name}
                    </span>
                    <span className="font-mono text-[var(--text-secondary)]">
                      {inst.count} tasks ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-[var(--canvas)] rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`${colors[index % colors.length]} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-3 border-t border-[var(--rule-default)] flex items-center justify-between text-[11.5px] text-[var(--text-muted)]">
            <span>Sovereignty: 0 involuntary ads or algorithmic nudges</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> High Cadence
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
