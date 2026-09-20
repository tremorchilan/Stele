import React, { useState } from 'react';
import { BookOpen, X } from 'lucide-react';
import { Commitment } from '../types';

interface KnowledgeCaptureModalProps {
  commitment: Commitment | null;
  isOpen: boolean;
  onSave: (commitmentId: string, retrospective: { wentWell: string; wentWrong: string; toChange: string }) => void;
  onSkip: (commitmentId: string) => void;
  isDark: boolean;
}

export const KnowledgeCaptureModal: React.FC<KnowledgeCaptureModalProps> = ({
  commitment,
  isOpen,
  onSave,
  onSkip,
  isDark,
}) => {
  const [wentWell, setWentWell] = useState('');
  const [wentWrong, setWentWrong] = useState('');
  const [toChange, setToChange] = useState('');

  if (!isOpen || !commitment) return null;

  const handleSave = () => {
    onSave(commitment.id, { wentWell, wentWrong, toChange });
    setWentWell('');
    setWentWrong('');
    setToChange('');
  };

  const handleSkip = () => {
    onSkip(commitment.id);
    setWentWell('');
    setWentWrong('');
    setToChange('');
  };

  return (
    <div
      id="knowledge-capture-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
    >
      <div
        id="knowledge-capture-modal"
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded-[26px] stele-glassmorphic-overlay text-[var(--text)]"
        style={{
          background: 'rgba(26, 26, 32, 0.82)',
          backdropFilter: 'blur(28px) saturate(190%)',
          WebkitBackdropFilter: 'blur(28px) saturate(190%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 24px 50px rgba(0, 0, 0, 0.6), 0 1px 1px rgba(255, 255, 255, 0.15) inset',
        }}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[var(--rule-default)]/40">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[var(--accent)]" />
            <h3 className="text-[17px] font-semibold tracking-tight">
              Anything worth remembering for next year? (2 min)
            </h3>
          </div>
          <button
            type="button"
            onClick={handleSkip}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[13px] text-[var(--text-secondary)] mt-2">
          Knowledge capture for <strong className="text-[var(--text-primary)]">{commitment.title}</strong>. Feeds directly into the club wiki so incoming cohorts never repeat mistakes.
        </p>

        <div className="flex flex-col gap-3 mt-4 text-[14px]">
          <div>
            <label className="block text-[12px] font-medium text-[var(--text-secondary)] mb-1">
              What went well
            </label>
            <textarea
              id="retrospective-went-well"
              value={wentWell}
              onChange={(e) => setWentWell(e.target.value)}
              placeholder="e.g. Mentor pre-cleared line sensor specs; team communication was clean..."
              rows={2}
              className="w-full p-2.5 rounded-[12px] bg-[var(--card)] border border-[var(--rule-default)] text-[13px] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[var(--text-secondary)] mb-1">
              What went wrong
            </label>
            <textarea
              id="retrospective-went-wrong"
              value={wentWrong}
              onChange={(e) => setWentWrong(e.target.value)}
              placeholder="e.g. Spare power cables were forgotten at the lab gate..."
              rows={2}
              className="w-full p-2.5 rounded-[12px] bg-[var(--card)] border border-[var(--rule-default)] text-[13px] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[var(--text-secondary)] mb-1">
              What to change
            </label>
            <textarea
              id="retrospective-to-change"
              value={toChange}
              onChange={(e) => setToChange(e.target.value)}
              placeholder="e.g. Print hardware equipment checklist 48h in advance..."
              rows={2}
              className="w-full p-2.5 rounded-[12px] bg-[var(--card)] border border-[var(--rule-default)] text-[13px] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-5 pt-3 border-t border-[var(--rule-default)]/40">
          <button
            id="knowledge-skip-btn"
            type="button"
            onClick={handleSkip}
            className="text-[14px] text-[var(--text-muted)] hover:text-[var(--text-primary)] px-3 py-1.5"
          >
            Skip for now
          </button>
          <button
            id="knowledge-save-btn"
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-[14px] bg-[var(--accent)] text-white text-[14px] font-medium hover:opacity-90 active:scale-[0.97] transition-all"
          >
            Inscribe in Wiki
          </button>
        </div>
      </div>
    </div>
  );
};
