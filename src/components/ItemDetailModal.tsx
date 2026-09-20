import React, { useState } from 'react';
import { X, Star, CheckCircle, Calendar, Send, ShieldCheck, Eye, AlertTriangle } from 'lucide-react';
import { SteleItem, Role } from '../types';
import { CountdownRing } from './CountdownRing';
import { calculateTimeStatus } from '../utils/time';

interface ItemDetailModalProps {
  item: SteleItem | null;
  isOpen: boolean;
  onClose: () => void;
  currentRole: Role;
  onStar: (item: SteleItem) => void;
  onCommit: (item: SteleItem) => void;
  isStarred?: boolean;
  isCommitted?: boolean;
  isDark: boolean;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  currentRole,
  onStar,
  onCommit,
  isStarred = false,
  isCommitted = false,
  isDark,
}) => {
  const [showApplyConfirmation, setShowApplyConfirmation] = useState(false);
  const [attachLedger, setAttachLedger] = useState(true);

  if (!isOpen || !item) return null;

  const status = calculateTimeStatus(item.deadline);
  const isStewardOrHigher = currentRole === 'steward' || currentRole === 'teacher' || currentRole === 'authority';

  return (
    <div
      id="item-detail-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        id="item-detail-modal"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 md:p-8 rounded-[26px] stele-glassmorphic-overlay transition-all text-[var(--text)]"
        style={{
          background: 'rgba(26, 26, 32, 0.82)',
          backdropFilter: 'blur(28px) saturate(190%)',
          WebkitBackdropFilter: 'blur(28px) saturate(190%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 24px 50px rgba(0, 0, 0, 0.6), 0 1px 1px rgba(255, 255, 255, 0.15) inset',
        }}
      >
        {/* Header with Close */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--rule-default)]/40">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded-[6px] text-[11px] font-semibold tracking-wider uppercase bg-[var(--accent-soft)] text-[var(--accent)]">
                {item.provenance} Source
              </span>
              <span className="text-[12px] text-[var(--text-muted)] font-medium uppercase tracking-wider">
                {item.scope} Scope
              </span>
            </div>
            <h2 className="text-[22px] md:text-[24px] font-bold leading-[1.2] text-[var(--text-primary)]">
              {item.title}
            </h2>
            <p className="text-[14px] text-[var(--text-secondary)] mt-1">
              Issued by <strong className="text-[var(--text-primary)]">{item.sourceInstitution}</strong> · {item.sourceSpace} ({item.stewardName})
            </p>
          </div>
          <button
            id="item-detail-close-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[var(--accent-soft)] text-[var(--text-secondary)] transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Opportunity Dummy Thumbnail Banner */}
        <div className="my-4 relative w-full h-44 sm:h-52 rounded-[18px] overflow-hidden border border-white/10 shadow-md">
          <img
            src={
              item.thumbnailUrl ||
              'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80'
            }
            alt={item.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
          <div className="absolute bottom-3 left-4 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-[8px] bg-black/60 backdrop-blur-md text-[11.5px] font-bold text-white border border-white/15"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Hero Urgency Section with Countdown Ring (PRD 9.3: 80px ring in detail) */}
        <div className="flex items-center justify-between gap-4 py-6 px-4 my-4 rounded-[16px] bg-[var(--card)]/60 border border-[var(--rule-default)]/50">
          <div>
            <span className="text-[12px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">
              Authoritative Clock
            </span>
            <div className="text-[18px] md:text-[20px] font-semibold text-[var(--text-primary)] mt-0.5">
              <span
                className="tabular-nums"
                style={{ color: status.isMissed ? 'var(--text-muted)' : status.isRed ? 'var(--urgent)' : 'var(--text-primary)' }}
              >
                {status.label}
              </span>
            </div>
            <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">
              Absolute deadline: {new Date(item.deadline).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>

          {/* 80px Countdown Ring in Detail View */}
          <div className="shrink-0">
            <CountdownRing
              deadlineISO={item.deadline}
              size="md"
              isEngaged={isCommitted}
              showTextInside={false}
            />
          </div>
        </div>

        {/* Original Forwarded Message (PRD 14: unedited, exactly as it arrived) */}
        <div className="mb-6">
          <span className="text-[12px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            Original Forwarded Message (Unfiltered)
          </span>
          <div className="mt-1.5 p-4 rounded-[14px] bg-[var(--card)] border border-[var(--rule-default)]/60 text-[14px] text-[var(--text-primary)] leading-[1.6]">
            {item.originalMessage}
          </div>
        </div>

        {/* Trust Signals / Endorsements */}
        {item.endorsedBy && item.endorsedBy.length > 0 && (
          <div className="mb-6 flex items-start gap-2 text-[13px] text-[var(--text-secondary)]">
            <ShieldCheck className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-[var(--text-primary)]">Endorsed Standing: </span>
              {item.endorsedBy.join(' · ')}
            </div>
          </div>
        )}

        {/* Steward Console Inspection Data (Section 14 & 19) */}
        {isStewardOrHigher && (
          <div className="mb-6 p-4 rounded-[16px] bg-[var(--accent-soft)]/25 border border-[var(--accent)]/30">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-[var(--accent)]" />
              <span className="text-[13px] font-semibold text-[var(--text-primary)]">
                Steward Inspection & Reach Telemetry
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[13px]">
              <div>
                <span className="text-[var(--text-muted)] block">Total Reach:</span>
                <strong className="text-[var(--text-primary)] font-semibold">{item.reachCount || 240} students</strong>
              </div>
              <div>
                <span className="text-[var(--text-muted)] block">Unseen Count:</span>
                <strong className="text-[var(--text-primary)] font-semibold">{item.unseenCount || 14}</strong>
              </div>
              <div>
                <span className="text-[var(--text-muted)] block">Fairness Flag:</span>
                <strong className={item.lowFairnessFlag ? 'text-[var(--urgent)] font-semibold flex items-center gap-1' : 'text-[var(--reward-done)] font-semibold'}>
                  {item.lowFairnessFlag ? <><AlertTriangle className="w-3.5 h-3.5" /> Low Reach Flag</> : 'Fair Drop (OK)'}
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* Primary & Secondary Actions (PRD 3.4 & 9.7) */}
        <div className="pt-4 border-t border-[var(--rule-default)]/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Star / Watch (Secondary action: no commitment, no countdown reminders) */}
            <button
              id="item-star-btn"
              type="button"
              onClick={() => onStar(item)}
              className={`px-3.5 py-2 rounded-[14px] text-[13px] font-medium border flex items-center gap-1.5 transition-all ${
                isStarred
                  ? 'border-[var(--reward-badge)] text-[var(--reward-badge)] bg-[var(--reward-badge)]/10'
                  : 'border-[var(--rule-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>{isStarred ? 'Watching' : 'Watch'}</span>
            </button>

            {/* Add to Personal Calendar */}
            <button
              id="item-calendar-btn"
              type="button"
              onClick={() => {
                alert(`Added "${item.title}" to local schedule.`);
              }}
              className="px-3.5 py-2 rounded-[14px] text-[13px] font-medium border border-[var(--rule-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1.5 transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Apply / Attach Ledger */}
            <button
              id="item-apply-btn"
              type="button"
              onClick={() => setShowApplyConfirmation(true)}
              className="px-4 py-2 rounded-[14px] border border-[var(--accent)] text-[var(--accent)] text-[14px] font-medium hover:bg-[var(--accent-soft)]/40 active:scale-[0.97] transition-all flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Apply with Ledger</span>
            </button>

            {/* One Primary Action Per Screen (PRD 3.4): Register / Claim */}
            <button
              id="item-commit-btn"
              type="button"
              onClick={() => {
                onCommit(item);
                onClose();
              }}
              disabled={isCommitted}
              className={`px-5 py-2 rounded-[14px] text-[14px] font-semibold text-white shadow-sm flex items-center gap-1.5 transition-all active:scale-[0.97] ${
                isCommitted
                  ? 'bg-[var(--reward-done)] cursor-default'
                  : 'bg-[var(--accent)] hover:opacity-90'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isCommitted ? 'Committed to Board' : 'Claim Commitment'}</span>
            </button>
          </div>
        </div>

        {/* Apply Dialog Overlay */}
        {showApplyConfirmation && (
          <div className="mt-4 p-4 rounded-[16px] bg-[var(--card)] border border-[var(--accent)]/50 flex flex-col gap-3">
            <h4 className="text-[14px] font-semibold text-[var(--text-primary)]">
              Submit Application to {item.stewardName}
            </h4>
            <label className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)] cursor-pointer">
              <input
                type="checkbox"
                checked={attachLedger}
                onChange={(e) => setAttachLedger(e.target.checked)}
                className="rounded text-[var(--accent)]"
              />
              Attach verified SHA-256 portable ledger snapshot (3 witnessed acts)
            </label>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowApplyConfirmation(false)}
                className="px-3 py-1.5 text-[13px] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowApplyConfirmation(false);
                  onCommit(item);
                  alert(`Application successfully transmitted to ${item.sourceInstitution} with signed cryptographic ledger attached!`);
                  onClose();
                }}
                className="px-4 py-1.5 rounded-[12px] bg-[var(--accent)] text-white text-[13px] font-medium"
              >
                Transmit Application
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
