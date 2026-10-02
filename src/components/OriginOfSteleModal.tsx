import React from 'react';
import Markdown from 'react-markdown';
import { X, BookOpen, ShieldCheck } from 'lucide-react';
import { ORIGIN_OF_STELE_MARKDOWN } from '../data/originOfStele';

interface OriginOfSteleModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export const OriginOfSteleModal: React.FC<OriginOfSteleModalProps> = ({
  isOpen,
  onClose,
  isDark,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="origin-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-md android-popup-backdrop"
      onClick={onClose}
    >
      <div
        id="origin-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[26px] p-6 sm:p-10 stele-glassmorphic-overlay text-[var(--text)] android-popup-widget"
        style={{
          background: 'rgba(26, 26, 32, 0.84)',
          backdropFilter: 'blur(28px) saturate(190%)',
          WebkitBackdropFilter: 'blur(28px) saturate(190%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 24px 50px rgba(0, 0, 0, 0.6), 0 1px 1px rgba(255, 255, 255, 0.15) inset',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[var(--stele-rule)]/60 sticky top-0 bg-inherit z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-[12px] bg-[var(--stele-accent-soft)] text-[var(--stele-accent)]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[20px] sm:text-[22px] font-bold text-[var(--stele-text-primary)]">
                Origin of Stele
              </h2>
              <p className="text-[12px] text-[var(--stele-text-muted)] font-medium">
                The Ultimate White Paper &amp; Product Requirements (Version 2.0 — Consolidated, September 2026)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--stele-canvas)] text-[var(--stele-text-muted)] hover:text-[var(--stele-text-primary)] transition-colors"
            title="Close Origin document"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pristine Markdown Content */}
        <div className="stele-markdown-body text-[14px] sm:text-[15px] leading-[1.7] text-[var(--stele-text-primary)] space-y-4">
          <Markdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-[24px] sm:text-[26px] font-extrabold text-[var(--stele-text-primary)] tracking-tight pb-2 border-b border-[var(--stele-rule)] mt-6 mb-3">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-[20px] sm:text-[21px] font-bold text-[var(--stele-text-primary)] tracking-tight pb-1 mt-6 mb-2">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-[16px] sm:text-[17px] font-semibold text-[var(--stele-accent)] mt-4 mb-1">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-[14px] sm:text-[15px] text-[var(--stele-text-secondary)] leading-[1.65] my-2">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-outside pl-5 space-y-1.5 text-[var(--stele-text-secondary)] my-3">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-outside pl-5 space-y-1.5 text-[var(--stele-text-secondary)] my-3">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="leading-[1.6] pl-1">{children}</li>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-4 rounded-[14px] border border-[var(--stele-rule)]">
                  <table className="w-full text-left text-[13px] border-collapse">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-[var(--stele-canvas)] border-b border-[var(--stele-rule)] text-[var(--stele-text-muted)] font-semibold uppercase text-[11px] tracking-wider">
                  {children}
                </thead>
              ),
              tbody: ({ children }) => (
                <tbody className="divide-y divide-[var(--stele-rule)]/50">
                  {children}
                </tbody>
              ),
              tr: ({ children }) => (
                <tr className="hover:bg-[var(--stele-accent-soft)]/20 transition-colors">
                  {children}
                </tr>
              ),
              th: ({ children }) => (
                <th className="py-2.5 px-3.5 font-semibold text-[var(--stele-text-primary)]">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="py-2.5 px-3.5 text-[var(--stele-text-secondary)]">
                  {children}
                </td>
              ),
              code: ({ children }) => (
                <code className="px-1.5 py-0.5 rounded-[6px] bg-[var(--stele-canvas)] text-[var(--stele-accent)] font-mono text-[13px] border border-[var(--stele-rule)]/50">
                  {children}
                </code>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-[var(--stele-text-primary)]">
                  {children}
                </strong>
              ),
              hr: () => (
                <hr className="my-6 border-[var(--stele-rule)]" />
              ),
            }}
          >
            {ORIGIN_OF_STELE_MARKDOWN}
          </Markdown>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-[var(--stele-rule)]/60 flex items-center justify-between text-[12px] text-[var(--stele-text-muted)]">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-[var(--stele-completion)]" />
            Consolidated Design System Standard
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-[12px] bg-[var(--stele-accent)] text-white text-[13px] font-medium hover:opacity-90 transition-opacity"
          >
            Done Reading
          </button>
        </div>
      </div>
    </div>
  );
};
