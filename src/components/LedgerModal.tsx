import React, { useState } from 'react';
import { X, ShieldCheck, Share2, Download, FileText, CheckCircle2 } from 'lucide-react';
import { LedgerEntry } from '../types';

interface LedgerModalProps {
  entries: LedgerEntry[];
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  isDark: boolean;
}

export const LedgerModal: React.FC<LedgerModalProps> = ({
  entries,
  isOpen,
  onClose,
  studentName,
  isDark,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadedPack, setDownloadedPack] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    setCopiedLink(true);
    navigator.clipboard?.writeText(`https://stele.network/verify/student/${studentName.toLowerCase().replace(/\s+/g, '.')}`);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownloadPack = () => {
    setDownloadedPack(true);
    const blob = new Blob([JSON.stringify({ studentName, exportedAt: new Date().toISOString(), entries }, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stele-ledger-pack-${studentName.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    setTimeout(() => setDownloadedPack(false), 2500);
  };

  return (
    <div
      id="ledger-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md android-popup-backdrop"
      onClick={onClose}
    >
      <div
        id="ledger-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 md:p-8 rounded-[26px] stele-glassmorphic-overlay text-[var(--text)] android-popup-widget"
        style={{
          background: 'rgba(26, 26, 32, 0.82)',
          backdropFilter: 'blur(28px) saturate(190%)',
          WebkitBackdropFilter: 'blur(28px) saturate(190%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 24px 50px rgba(0, 0, 0, 0.6), 0 1px 1px rgba(255, 255, 255, 0.15) inset',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--rule-default)]/40">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-[var(--reward-done)]" />
              <span className="text-[12px] uppercase tracking-wider font-semibold text-[var(--reward-done)]">
                Permanent Sovereign Ledger
              </span>
            </div>
            <h2 className="text-[22px] font-bold tracking-tight text-[var(--text-primary)]">
              {studentName}&apos;s Witnessed Acts
            </h2>
            <p className="text-[13px] text-[var(--text-secondary)] mt-1">
              The immutable chain that travels with the student across institutions. Institutional records (grades, discipline) never enter this chain.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[var(--accent-soft)] text-[var(--text-secondary)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ledger Entries List */}
        <div className="my-6 flex flex-col gap-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="p-4 rounded-[16px] bg-[var(--card)] border border-[var(--rule-default)]/70 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-[15px] font-semibold text-[var(--text-primary)] leading-[1.3]">
                  {entry.action}
                </h4>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-[8px] font-medium shrink-0 uppercase tracking-wider ${
                    entry.isWitnessed
                      ? 'bg-[var(--reward-done)]/15 text-[var(--reward-done)] border border-[var(--reward-done)]/30'
                      : 'bg-[var(--rule-default)] text-[var(--text-muted)]'
                  }`}
                >
                  {entry.isWitnessed ? 'Witnessed Act' : 'Self-Chosen'}
                </span>
              </div>

              <div className="text-[13px] text-[var(--text-secondary)] mt-2">
                {entry.isWitnessed ? (
                  <p>
                    Confirmed by <strong className="text-[var(--text-primary)]">{entry.witnessName}</strong> ({entry.witnessRole})
                  </p>
                ) : (
                  <p>Unwitnessed independent study</p>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-[var(--rule-default)]/30 flex items-center justify-between text-[11px] text-[var(--text-muted)] tabular-nums">
                <span>Inscribed: {new Date(entry.moment).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                <span className="font-mono">{entry.hash.slice(0, 14)}...</span>
              </div>
            </div>
          ))}
        </div>

        {/* The Two Exports (White Paper Section 17) */}
        <div className="pt-4 border-t border-[var(--rule-default)]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            id="export-signed-pack-btn"
            type="button"
            onClick={handleDownloadPack}
            className="w-full sm:w-auto px-4 py-2.5 rounded-[14px] bg-[var(--accent)] text-white text-[14px] font-medium flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.97] transition-all shadow-sm"
          >
            {downloadedPack ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            <span>{downloadedPack ? 'Pack Exported' : 'Export Signed Pack'}</span>
          </button>

          <button
            id="copy-public-link-btn"
            type="button"
            onClick={handleCopyLink}
            className="w-full sm:w-auto px-4 py-2.5 rounded-[14px] border border-[var(--rule-default)] text-[var(--text-primary)] text-[14px] font-medium flex items-center justify-center gap-2 hover:border-[var(--text-primary)] active:scale-[0.97] transition-all"
          >
            {copiedLink ? <CheckCircle2 className="w-4 h-4 text-[var(--reward-done)]" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedLink ? 'Link Copied' : 'Public Profile Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
