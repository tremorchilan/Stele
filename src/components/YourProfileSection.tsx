import React, { useState } from 'react';
import {
  Flame,
  Zap,
  ShieldCheck,
  BookOpen,
  Sparkles,
  Award,
  Calendar,
  CheckCircle2,
  FileCheck,
  ChevronRight,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Share2,
  Lock,
  Compass,
  Eye,
  AlertCircle,
  Coffee,
} from 'lucide-react';
import { StudentProfile, LedgerEntry, Role } from '../types';

interface YourProfileSectionProps {
  profile: StudentProfile;
  currentRole: Role;
  ledgerEntries: LedgerEntry[];
  onOpenLedger: () => void;
  onClaimDailyStreak?: () => void;
  canClaimStreak?: boolean;
  onSimulateActionReward?: (type: 'notice' | 'early_task' | 'retro') => void;
  onOpenPerksBazaar?: () => void;
}

export const YourProfileSection: React.FC<YourProfileSectionProps> = ({
  profile,
  currentRole,
  ledgerEntries,
  onOpenLedger,
  onClaimDailyStreak,
  canClaimStreak = true,
  onSimulateActionReward,
  onOpenPerksBazaar,
}) => {
  const [activeTab, setActiveTab] = useState<'rewards' | 'breakdown' | 'badges'>('rewards');

  // Calculate horizon tier
  const score = profile.score;
  const nextHorizon = score < 300 ? 300 : score < 600 ? 600 : score < 900 ? 900 : 1200;
  const prevHorizon = score < 300 ? 0 : score < 600 ? 300 : score < 900 ? 600 : 900;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round(((score - prevHorizon) / (nextHorizon - prevHorizon)) * 100))
  );

  const getHorizonTitle = (pts: number) => {
    if (pts >= 900) return 'Foundational Scholar';
    if (pts >= 600) return 'Consistent Contributor';
    if (pts >= 300) return 'Active Aspirant';
    return 'Emerging Dweller';
  };

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-4 h-4 text-[#D9A93D]" />;
      case 'Zap':
        return <Zap className="w-4 h-4 text-[var(--stele-accent)]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4 text-[var(--reward-done)]" />;
      case 'BookOpen':
        return <BookOpen className="w-4 h-4 text-[#4DB8C8]" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-[#A672D9]" />;
      default:
        return <Award className="w-4 h-4 text-[var(--stele-accent)]" />;
    }
  };

  // Day indicators for weekly consistency strip
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const activeDaysCount = Math.min(7, profile.dailyStreak % 7 === 0 ? 7 : profile.dailyStreak % 7);

  return (
    <div
      id="your-profile-section"
      className="p-4 sm:p-5 rounded-[22px] bg-[var(--stele-canvas)] border border-[var(--stele-rule)] flex flex-col gap-4 text-[var(--stele-text-primary)]"
    >
      {/* 1. Header: Identity & Standing */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[var(--stele-rule)]/60">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-[16px] bg-[var(--stele-accent-soft)] border border-[var(--stele-accent)]/30 text-[var(--stele-accent)] flex items-center justify-center font-bold text-[17px] shadow-xs overflow-hidden">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                profile.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
              )}
            </div>
            <div
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[var(--reward-done)] border-2 border-[var(--stele-canvas)] flex items-center justify-center"
              title="Verified Institutional Standing"
            >
              <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-[17px] font-bold text-[var(--stele-text-primary)] leading-tight">
                {profile.name}
              </h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-[6px] bg-[var(--stele-accent-soft)] text-[var(--stele-accent)] font-semibold uppercase">
                {currentRole.replace('_', ' ')}
              </span>
            </div>
            <p className="text-[12px] text-[var(--stele-text-secondary)] mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span>{profile.section}</span>
              <span>·</span>
              <span>{profile.institution}</span>
            </p>
          </div>
        </div>

        {/* Quick Ledger Link */}
        <button
          id="profile-inspect-ledger-btn"
          type="button"
          onClick={onOpenLedger}
          className="self-start sm:self-auto px-3 py-1.5 rounded-[12px] bg-[var(--stele-surface)] border border-[var(--stele-rule)] hover:border-[var(--stele-accent)] text-[12px] font-medium text-[var(--stele-text-primary)] flex items-center gap-1.5 transition-all shadow-2xs"
          title="Inspect Sovereign Ledger"
        >
          <FileCheck className="w-3.5 h-3.5 text-[var(--stele-accent)]" />
          <span>Ledger: {ledgerEntries.length} witnessed</span>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--stele-text-muted)]" />
        </button>
      </div>

      {/* 2. Unified Reward Circuit (Sensory Feedbacks & Short-Term Gratification) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Metric 1: Daily Streak & Continuity */}
        <div className="p-3.5 rounded-[16px] bg-[var(--stele-surface)] border border-[var(--stele-rule)] flex flex-col justify-between gap-2.5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-[10px] bg-[#D9A93D]/15 text-[#D9A93D]">
                <Flame className="w-4 h-4 fill-current" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[var(--stele-text-muted)] block">
                  Daily Consistency Streak
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[20px] font-extrabold text-[var(--stele-text-primary)]">
                    {profile.dailyStreak} Days
                  </span>
                  <span className="text-[11px] text-[var(--stele-text-secondary)]">
                    (Best: {profile.longestStreak}d)
                  </span>
                </div>
              </div>
            </div>

            {canClaimStreak ? (
              <button
                id="claim-streak-btn"
                type="button"
                onClick={onClaimDailyStreak}
                className="px-2.5 py-1 rounded-[10px] bg-[#D9A93D] text-black text-[11.5px] font-bold hover:opacity-90 active:scale-95 transition-all shadow-xs flex items-center gap-1 shrink-0"
                title="Claim today's daily streak bonus"
              >
                <Zap className="w-3 h-3 fill-current" />
                <span>+25 pts</span>
              </button>
            ) : (
              <span className="px-2 py-0.5 rounded-[8px] bg-[var(--reward-done)]/15 text-[var(--reward-done)] text-[11px] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Claimed</span>
              </span>
            )}
          </div>

          {/* 7-Day Consistency Meter */}
          <div className="pt-1">
            <div className="flex items-center justify-between gap-1">
              {daysOfWeek.map((day, idx) => {
                const isActive = idx < activeDaysCount;
                return (
                  <div key={idx} className="flex flex-col items-center gap-1 flex-1">
                    <div
                      className={`w-full h-1.5 rounded-full transition-colors ${
                        isActive
                          ? 'bg-[#D9A93D]'
                          : 'bg-[var(--stele-rule)]/60'
                      }`}
                    />
                    <span className="text-[9.5px] font-mono text-[var(--stele-text-muted)] font-semibold">
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-[var(--stele-text-secondary)] mt-1.5">
              Showing up every day builds verified operational reliability.
            </p>
          </div>
        </div>

        {/* Metric 2: Semester Rolling Horizon Score */}
        <div className="p-3.5 rounded-[16px] bg-[var(--stele-surface)] border border-[var(--stele-rule)] flex flex-col justify-between gap-2.5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[var(--stele-text-muted)] block">
                Semester Rolling Horizon
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--stele-accent-soft)] text-[var(--stele-accent)] font-semibold">
                PRD §18 Mirror
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-[22px] font-extrabold text-[var(--stele-text-primary)]">
                {score}
              </span>
              <span className="text-[12px] font-semibold text-[var(--stele-accent)]">
                {getHorizonTitle(score)}
              </span>
            </div>
          </div>

          {/* Horizon Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-[10.5px] text-[var(--stele-text-muted)] mb-1">
              <span>{prevHorizon} pts</span>
              <span>{progressPercent}% to next tier ({nextHorizon} pts)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[var(--stele-rule)] overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--stele-accent)] transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[10.5px] text-[var(--stele-text-secondary)] mt-1.5 leading-snug">
              Decorative mirror score; rolls over 90 days. Immutable ledger is permanent.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Section Selector Tabs: Unified Reward Circuit */}
      <div className="flex items-center gap-1 p-1 rounded-[14px] bg-[var(--stele-surface)] border border-[var(--stele-rule)] self-start text-[12px]">
        <button
          type="button"
          onClick={() => setActiveTab('rewards')}
          className={`px-3 py-1 rounded-[10px] font-medium transition-all ${
            activeTab === 'rewards'
              ? 'bg-[var(--stele-accent)] text-white font-semibold shadow-xs'
              : 'text-[var(--stele-text-secondary)] hover:text-[var(--stele-text-primary)]'
          }`}
        >
          Reward Circuit
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('breakdown')}
          className={`px-3 py-1 rounded-[10px] font-medium transition-all ${
            activeTab === 'breakdown'
              ? 'bg-[var(--stele-accent)] text-white font-semibold shadow-xs'
              : 'text-[var(--stele-text-secondary)] hover:text-[var(--stele-text-primary)]'
          }`}
        >
          Activity Log ({profile.rewardHistory.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('badges')}
          className={`px-3 py-1 rounded-[10px] font-medium transition-all ${
            activeTab === 'badges'
              ? 'bg-[var(--stele-accent)] text-white font-semibold shadow-xs'
              : 'text-[var(--stele-text-secondary)] hover:text-[var(--stele-text-primary)]'
          }`}
        >
          Facts &amp; Badges ({profile.badges.length})
        </button>
      </div>

      {/* TAB 1: Reward Circuit & Sensory Feedbacks */}
      {activeTab === 'rewards' && (
        <div className="flex flex-col gap-3 animate-fadeIn">
          {/* Why this matters (Solving the lack of sensory reward in institutional tasks) */}
          <div className="p-3 rounded-[14px] bg-[var(--stele-accent-soft)] border border-[var(--stele-accent)]/20 text-[12px] flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[var(--stele-accent)] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-[var(--stele-text-primary)]">
                The Civic Reward Invariant (PRD §18):
              </strong>{' '}
              <span className="text-[var(--stele-text-secondary)]">
                Completing commitments, inspecting notices, and showing interest in national olympiads directly builds institutional credibility. Stele provides instant sensory reward to make civic contribution more gratifying than mindless scrolling.
              </span>
            </div>
          </div>

          {/* Unified Point Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Early Fulfillment Bonus */}
            <div className="p-2.5 rounded-[12px] bg-[var(--stele-surface)] border border-[var(--stele-rule)] flex flex-col justify-between gap-1">
              <div className="flex items-center justify-between">
                <Zap className="w-3.5 h-3.5 text-[var(--stele-accent)]" />
                <span className="text-[12px] font-extrabold text-[var(--stele-accent)]">+50</span>
              </div>
              <div>
                <span className="text-[11.5px] font-bold text-[var(--stele-text-primary)] block leading-tight">
                  Early Delivery
                </span>
                <span className="text-[10.5px] text-[var(--stele-text-secondary)]">
                  Completed &gt;24h before clock
                </span>
              </div>
            </div>

            {/* Witnessed Task Completion */}
            <div className="p-2.5 rounded-[12px] bg-[var(--stele-surface)] border border-[var(--stele-rule)] flex flex-col justify-between gap-1">
              <div className="flex items-center justify-between">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--reward-done)]" />
                <span className="text-[12px] font-extrabold text-[var(--reward-done)]">+100</span>
              </div>
              <div>
                <span className="text-[11.5px] font-bold text-[var(--stele-text-primary)] block leading-tight">
                  Witnessed Task
                </span>
                <span className="text-[10.5px] text-[var(--stele-text-secondary)]">
                  Steward-signed club act
                </span>
              </div>
            </div>

            {/* Operational Retrospective */}
            <div className="p-2.5 rounded-[12px] bg-[var(--stele-surface)] border border-[var(--stele-rule)] flex flex-col justify-between gap-1">
              <div className="flex items-center justify-between">
                <BookOpen className="w-3.5 h-3.5 text-[#A672D9]" />
                <span className="text-[12px] font-extrabold text-[#A672D9]">+40</span>
              </div>
              <div>
                <span className="text-[11.5px] font-bold text-[var(--stele-text-primary)] block leading-tight">
                  2-Min Memory
                </span>
                <span className="text-[10.5px] text-[var(--stele-text-secondary)]">
                  Cohort knowledge handover
                </span>
              </div>
            </div>

            {/* Civic Notice Review */}
            <div className="p-2.5 rounded-[12px] bg-[var(--stele-surface)] border border-[var(--stele-rule)] flex flex-col justify-between gap-1">
              <div className="flex items-center justify-between">
                <Eye className="w-3.5 h-3.5 text-[#4DB8C8]" />
                <span className="text-[12px] font-extrabold text-[#4DB8C8]">+15</span>
              </div>
              <div>
                <span className="text-[11.5px] font-bold text-[var(--stele-text-primary)] block leading-tight">
                  Civic Reader
                </span>
                <span className="text-[10.5px] text-[var(--stele-text-secondary)]">
                  Official notices inspected
                </span>
              </div>
            </div>
          </div>

          {/* Physical Perks In-Campus Utility Banner */}
          <div className="p-3.5 rounded-[16px] bg-[var(--stele-surface)] border border-[var(--stele-accent)]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-[var(--stele-accent-soft)] border border-[var(--stele-accent)]/40 flex items-center justify-center text-[var(--stele-accent)] shrink-0">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-extrabold text-[var(--stele-text-primary)]">
                    In-Campus Physical Perks Bazaar
                  </span>
                  <span className="px-1.5 py-0.2 rounded-[6px] bg-[var(--stele-surface-elevated)] text-[var(--stele-text-secondary)] border border-[var(--stele-rule)] text-[9.5px] font-semibold uppercase">
                    Physical Utility
                  </span>
                </div>
                <p className="text-[11.5px] text-[var(--stele-text-secondary)] mt-0.5">
                  Exchange your consistency points for Foundry Café handcrafted coffee, Maker Lab 3D print reservations, and quiet study pods.
                </p>
              </div>
            </div>
            {onOpenPerksBazaar && (
              <button
                type="button"
                onClick={onOpenPerksBazaar}
                className="px-3.5 py-2 rounded-[12px] bg-[var(--stele-accent)] hover:bg-[var(--stele-accent)]/90 text-white text-[12px] font-bold shrink-0 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all"
              >
                <span>Open Bazaar</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Interactive Simulation / Instant Gratification Triggers */}
          {onSimulateActionReward && (
            <div className="p-3 rounded-[14px] bg-[var(--stele-surface)] border border-[var(--stele-rule)] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[11.5px] font-semibold text-[var(--stele-text-secondary)]">
                  Quick Civic Actions (Test sensory feedback):
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onSimulateActionReward('notice')}
                  className="px-2.5 py-1.5 rounded-[10px] bg-[var(--stele-canvas)] border border-[var(--stele-rule)] text-[11.5px] font-medium hover:border-[#4DB8C8] text-[var(--stele-text-primary)] flex items-center gap-1.5 transition-all"
                >
                  <Eye className="w-3 h-3 text-[#4DB8C8]" />
                  <span>Inspect Official Notice (+15 pts)</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSimulateActionReward('early_task')}
                  className="px-2.5 py-1.5 rounded-[10px] bg-[var(--stele-canvas)] border border-[var(--stele-rule)] text-[11.5px] font-medium hover:border-[var(--stele-accent)] text-[var(--stele-text-primary)] flex items-center gap-1.5 transition-all"
                >
                  <Zap className="w-3 h-3 text-[var(--stele-accent)]" />
                  <span>Deliver 48h Early (+50 pts)</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSimulateActionReward('retro')}
                  className="px-2.5 py-1.5 rounded-[10px] bg-[var(--stele-canvas)] border border-[var(--stele-rule)] text-[11.5px] font-medium hover:border-[#A672D9] text-[var(--stele-text-primary)] flex items-center gap-1.5 transition-all"
                >
                  <BookOpen className="w-3 h-3 text-[#A672D9]" />
                  <span>Inscribe Retrospective (+40 pts)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Recent Reward Activity Log */}
      {activeTab === 'breakdown' && (
        <div className="flex flex-col gap-2 animate-fadeIn max-h-[220px] overflow-y-auto pr-1">
          {profile.rewardHistory.map((item) => (
            <div
              key={item.id}
              className="p-2.5 rounded-[12px] bg-[var(--stele-surface)] border border-[var(--stele-rule)] flex items-center justify-between gap-3 text-[12px]"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-[8px] bg-[var(--stele-accent-soft)] text-[var(--stele-accent)] shrink-0">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[var(--stele-text-primary)]">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-[var(--stele-text-muted)] font-mono">
                      {new Date(item.timestamp).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  {item.details && (
                    <p className="text-[11px] text-[var(--stele-text-secondary)] mt-0.5 leading-snug">
                      {item.details}
                    </p>
                  )}
                </div>
              </div>

              <span className="font-mono font-bold text-[13px] text-[var(--reward-done)] shrink-0">
                +{item.points} pts
              </span>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Badges as Facts (WP §18) */}
      {activeTab === 'badges' && (
        <div className="flex flex-col gap-2 animate-fadeIn">
          <div className="p-2.5 rounded-[12px] bg-[var(--stele-surface)] border border-[var(--stele-rule)]/60 text-[11px] text-[var(--stele-text-secondary)]">
            <strong>Rule of Two Rewards (WP §18):</strong> Badges are strictly factual records of what was achieved, not arbitrary gold/silver game ranks.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {profile.badges.map((badge) => (
              <div
                key={badge.id}
                className="p-3 rounded-[14px] bg-[var(--stele-surface)] border border-[var(--stele-rule)] flex items-start gap-2.5 text-[12px]"
              >
                <div className="p-2 rounded-[10px] bg-[var(--stele-canvas)] border border-[var(--stele-rule)] shrink-0 mt-0.5">
                  {getBadgeIcon(badge.iconName)}
                </div>
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-bold text-[var(--stele-text-primary)]">
                      {badge.title}
                    </h4>
                    <span className="text-[9.5px] font-mono text-[var(--stele-text-muted)]">
                      {badge.dateEarned}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--stele-text-secondary)] mt-0.5 leading-snug">
                    {badge.fact}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Sovereign Identity DID Footer */}
      <div className="pt-2 border-t border-[var(--stele-rule)]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[var(--stele-text-muted)]">
        <div className="flex items-center gap-1.5 font-mono">
          <Lock className="w-3 h-3 text-[var(--stele-accent)]" />
          <span>DID: {profile.federationId}</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Joined {profile.joinedDate}</span>
          <span>·</span>
          <span>District 4 Sovereign Pool</span>
        </div>
      </div>
    </div>
  );
};
