import React, { useState } from 'react';
import { Commitment, SteleItem } from '../types';
import { CountdownRing } from '../components/CountdownRing';
import { calculateTimeStatus } from '../utils/time';
import { CheckCircle2, Bookmark, Eye, Clock, Check, ShieldAlert, BarChart3 } from 'lucide-react';
import { TaskAnalytics } from '../components/TaskAnalytics';

interface BoardViewProps {
  commitments: Commitment[];
  onSelectCommitment: (commitment: Commitment) => void;
  onCompleteCommitment: (commitment: Commitment) => void;
  onUnwatchCommitment: (commitmentId: string) => void;
  onOpenUnconventionalFeatures?: () => void;
  initialSection?: 'active' | 'watched' | 'past' | 'analytics';
  onSectionChange?: (section: 'active' | 'watched' | 'past' | 'analytics') => void;
}

export const BoardView: React.FC<BoardViewProps> = ({
  commitments,
  onSelectCommitment,
  onCompleteCommitment,
  onUnwatchCommitment,
  onOpenUnconventionalFeatures,
  initialSection = 'active',
  onSectionChange,
}) => {
  const [boardSection, setBoardSection] = useState<'active' | 'watched' | 'past' | 'analytics'>(initialSection);

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

  // Active items sorted strictly by deadline ascending
  const sortedActive = [...activeItems].sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  );

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 overflow-hidden">
      <div className="main" id="boardMain">
        <div id="board-view" className="w-full max-w-4xl mx-auto pt-4 pb-16">
      {/* Screen Title (PRD 6.3 Display font placement) */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-6">
        <div>
          <h1 className="text-[24px] md:text-[28px] font-bold text-[var(--text-primary)] tracking-tight">
            Commitments Board
          </h1>
          <p className="text-[14px] text-[var(--text-secondary)]">
            Personal sovereign obligations only. Separated into Active, Watched, and Past.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <button
            id="board-unconventional-btn"
            type="button"
            onClick={() => onOpenUnconventionalFeatures?.()}
            className="p-2 rounded-[14px] bg-[var(--card)] border border-[var(--rule-default)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all flex items-center gap-1.5 text-[13px] font-medium"
            title="Unconventional Features (PRD & White Paper)"
            aria-label="Unconventional Features"
          >
            <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10.5px] font-bold font-serif italic leading-none">
              i
            </div>
          </button>

          {/* 3 Board Sections (White Paper Section 12) */}
          <div className="flex items-center gap-1 p-1 rounded-[16px] bg-[var(--card)] border border-[var(--rule-default)]">
          <button
            type="button"
            id="board-tab-active"
            onClick={() => setBoardSection('active')}
            className={`px-3.5 py-1.5 rounded-[12px] text-[13px] font-semibold transition-all ${
              boardSection === 'active'
                ? 'bg-[var(--accent)] text-white shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Active ({activeItems.length})
          </button>
          <button
            type="button"
            id="board-tab-watched"
            onClick={() => setBoardSection('watched')}
            className={`px-3.5 py-1.5 rounded-[12px] text-[13px] font-semibold transition-all ${
              boardSection === 'watched'
                ? 'bg-[var(--accent)] text-white shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Watched ({watchedItems.length})
          </button>
          <button
            type="button"
            id="board-tab-past"
            onClick={() => setBoardSection('past')}
            className={`px-3.5 py-1.5 rounded-[12px] text-[13px] font-semibold transition-all ${
              boardSection === 'past'
                ? 'bg-[var(--accent)] text-white shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Past ({pastItems.length})
          </button>
          <button
            type="button"
            id="board-tab-analytics"
            onClick={() => setBoardSection('analytics')}
            className={`px-3.5 py-1.5 rounded-[12px] text-[13px] font-semibold transition-all flex items-center gap-1.5 ${
              boardSection === 'analytics'
                ? 'bg-[var(--accent)] text-white shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </button>
        </div>
      </div>
    </div>

      {/* SECTION 1: Active Commitments */}
      {boardSection === 'active' && (
        <div className="flex flex-col gap-4">
          {sortedActive.length > 0 ? (
            sortedActive.map((item) => {
              const status = calculateTimeStatus(item.deadline);
              return (
                <div
                  key={item.id}
                  id={`commitment-row-${item.id}`}
                  className="p-4 sm:p-5 rounded-[18px] bg-[var(--card)] border border-[var(--rule-default)]/70 shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div
                    className="flex items-start gap-3.5 flex-1 cursor-pointer"
                    onClick={() => onSelectCommitment(item)}
                  >
                    {item.thumbnailUrl && (
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-[12px] object-cover shrink-0 border border-white/10 shadow-xs"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-[6px] font-semibold uppercase tracking-wider ${
                            item.type === 'delegated'
                              ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                              : 'bg-[var(--rule-default)] text-[var(--text-secondary)]'
                          }`}
                        >
                          {item.type === 'delegated' ? 'Witnessed Task' : 'Self-Chosen'}
                        </span>
                        <span className="text-[13px] text-[var(--text-muted)] font-medium">
                          {item.sourceInstitution}
                        </span>
                      </div>

                      <h3 className="text-[17px] font-bold text-[var(--text-primary)] leading-[1.3] hover:text-[var(--accent)] transition-colors">
                        {item.title}
                      </h3>

                      {item.witnessName && (
                        <p className="text-[13px] text-[var(--text-secondary)] mt-1">
                          Witnessed by: <strong className="text-[var(--text-primary)]">{item.witnessName}</strong>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Countdown Ring on active board commitments (Section 9.3 & 12) */}
                  <div className="flex items-center gap-5 shrink-0">
                    <div className="text-right">
                      <span className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] block font-medium">
                        Deadline
                      </span>
                      <span
                        className={`tabular-nums font-bold ${
                          status.isCritical ? 'text-[15px]' : 'text-[14px]'
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

                    <CountdownRing
                      deadlineISO={item.deadline}
                      size="sm"
                      isEngaged={true}
                    />

                    {/* Mark Complete Action Button */}
                    <button
                      id={`complete-btn-${item.id}`}
                      type="button"
                      onClick={() => onCompleteCommitment(item)}
                      className="px-3.5 py-2 rounded-[14px] bg-[var(--reward-done)] text-white text-[13px] font-semibold flex items-center gap-1.5 hover:opacity-90 active:scale-[0.97] transition-all shadow-xs"
                      title="Mark complete and record knowledge in wiki"
                    >
                      <Check className="w-4 h-4" />
                      <span>Complete</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="relative overflow-hidden p-12 rounded-[24px] bg-[var(--card)] border border-[var(--rule-default)] text-center my-6">
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, #D9A441 0%, #1B2A4A 100%)',
                }}
              />
              <p className="relative z-10 text-[15px] text-[var(--text-secondary)] font-medium">
                Nothing claimed yet.
              </p>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: Watched (Starred) Items (White Paper Section 12: No rings. Quieter.) */}
      {boardSection === 'watched' && (
        <div className="flex flex-col gap-4">
          {watchedItems.length > 0 ? (
            watchedItems.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-[18px] bg-[var(--card)] border border-[var(--rule-default)]/70 flex items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[12px] text-[var(--text-muted)] font-medium uppercase">
                    Watching · {item.sourceInstitution}
                  </span>
                  <h3 className="text-[17px] font-semibold text-[var(--text-primary)] mt-0.5">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-[var(--text-muted)] mt-1">
                    Due {new Date(item.deadline).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onUnwatchCommitment(item.id)}
                    className="px-3 py-1.5 rounded-[12px] text-[12px] border border-[var(--rule-default)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    Remove
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // Promote watched item to active commitment
                      item.status = 'active';
                      setBoardSection('active');
                    }}
                    className="px-3.5 py-1.5 rounded-[12px] bg-[var(--accent)] text-white text-[12px] font-medium hover:opacity-90 transition-opacity"
                  >
                    Commit Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 rounded-[20px] bg-[var(--card)] border border-[var(--rule-default)] text-center text-[14px] text-[var(--text-muted)]">
              No watched items. Star items on Radar to observe them quietly without notifications.
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: Past (Completed or Missed) */}
      {boardSection === 'past' && (
        <div className="flex flex-col gap-4">
          {pastItems.length > 0 ? (
            pastItems.map((item) => {
              const isMissed = item.status === 'missed';
              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-[18px] bg-[var(--card)] border transition-all ${
                    isMissed
                      ? 'border-dashed border-[var(--text-muted)]/60 opacity-80'
                      : 'border-[var(--rule-default)]/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-[6px] font-semibold uppercase tracking-wider ${
                            isMissed
                              ? 'bg-[var(--text-muted)]/15 text-[var(--text-muted)]'
                              : 'bg-[var(--reward-done)]/15 text-[var(--reward-done)]'
                          }`}
                        >
                          {isMissed ? 'Missed Deadline' : 'Witnessed Completion'}
                        </span>
                        <span className="text-[12px] text-[var(--text-muted)]">
                          {item.sourceInstitution}
                        </span>
                      </div>

                      <h4 className="text-[16px] font-bold text-[var(--text-primary)]">
                        {item.title}
                      </h4>

                      {item.witnessName && (
                        <p className="text-[13px] text-[var(--text-secondary)] mt-1">
                          Witness: {item.witnessName}
                        </p>
                      )}

                      {/* Retrospective note preview if completed */}
                      {item.retrospective && (
                        <div className="mt-3 p-3 rounded-[12px] bg-[var(--canvas)] border border-[var(--rule-default)] text-[12px] text-[var(--text-secondary)]">
                          <span className="font-semibold text-[var(--text-primary)] block mb-1">
                            Archived Knowledge Retrospective:
                          </span>
                          <p>&ldquo;{item.retrospective.wentWell}&rdquo;</p>
                        </div>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      {isMissed ? (
                        <span className="text-[13px] font-medium text-[var(--text-muted)] border-b border-dashed border-[var(--text-muted)] pb-0.5">
                          Uncompleted
                        </span>
                      ) : (
                        <span className="text-[13px] font-semibold text-[var(--reward-done)] flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Inscribed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-10 rounded-[20px] bg-[var(--card)] border border-[var(--rule-default)] text-center text-[14px] text-[var(--text-muted)]">
              No historical commitments yet.
            </div>
          )}
        </div>
      )}

      {/* SECTION 4: Task Analytics (Velocity, Fulfillment, Urgency Distribution) */}
      {boardSection === 'analytics' && (
        <TaskAnalytics commitments={commitments} />
      )}
        </div>
      </div>
    </div>
  );
};
