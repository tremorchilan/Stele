import React from 'react';
import { X, Moon, Sun, Palette, UserCheck, Shield, Laptop, HardDriveDownload, BookOpen, Check, User } from 'lucide-react';
import { Role, NaturalPalette, StudentProfile, LedgerEntry } from '../types';
import { YourProfileSection } from './YourProfileSection';

interface SettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onToggleDarkMode: () => void;
  currentPalette: NaturalPalette;
  onChangePalette: (palette: NaturalPalette) => void;
  currentRole: Role;
  onChangeRole: (role: Role) => void;
  currentInstance: string;
  onChangeInstance: (instance: string) => void;
  performanceTier: 'full' | 'reduced';
  onTogglePerformanceTier: () => void;
  onOpenLedgerExport: () => void;
  onOpenOriginModal: () => void;
  profile: StudentProfile;
  ledgerEntries: LedgerEntry[];
  onOpenLedger: () => void;
  onClaimDailyStreak?: () => void;
  canClaimStreak?: boolean;
  onSimulateActionReward?: (type: 'notice' | 'early_task' | 'retro') => void;
}

export const SettingsSheet: React.FC<SettingsSheetProps> = ({
  isOpen,
  onClose,
  isDark,
  onToggleDarkMode,
  currentPalette,
  onChangePalette,
  currentRole,
  onChangeRole,
  currentInstance,
  onChangeInstance,
  performanceTier,
  onTogglePerformanceTier,
  onOpenLedgerExport,
  onOpenOriginModal,
  profile,
  ledgerEntries,
  onOpenLedger,
  onClaimDailyStreak,
  canClaimStreak,
  onSimulateActionReward,
}) => {
  if (!isOpen) return null;

  const roles: { id: Role; label: string; stage: string; desc: string; authority: string }[] = [
    {
      id: 'dweller',
      label: 'Dweller',
      stage: 'Observer Stage',
      desc: 'Airy preview stack. Read-only federation access without claiming pressure.',
      authority: 'Visitor Access',
    },
    {
      id: 'aspirant',
      label: 'Aspirant',
      stage: 'Trialist Stage',
      desc: 'Active student flow. Can claim tasks up to Trialist stage and build personal commitments.',
      authority: 'Standard Student',
    },
    {
      id: 'loyal_core',
      label: 'Loyal Core',
      stage: 'Core Stage',
      desc: 'Club content dominant. Can edit club wikis, write retrospectives, and claim Core commitments.',
      authority: 'Wiki Editor',
    },
    {
      id: 'steward',
      label: 'Steward',
      stage: 'Executive Stage',
      desc: 'Unlocks full 6-tab Steward Console (Delegate, Curate, People, Fairness, Succession, Wiki).',
      authority: 'Sovereign Steward',
    },
    {
      id: 'teacher',
      label: 'Teacher',
      stage: 'Faculty Stage',
      desc: 'Academic section overview. Class logbook verification, reach statistics, and office hours.',
      authority: 'Faculty Supervisor',
    },
    {
      id: 'authority',
      label: 'Authority',
      stage: 'Institutional Board',
      desc: 'District governance. Broadcast official institutional notices and audit network fairness.',
      authority: 'Campus Leadership',
    },
    {
      id: 'alumni',
      label: 'Alumni',
      stage: 'Sovereign Fellow',
      desc: 'Permanent read-only historical memory. Sovereign Ledger pack verification and archives.',
      authority: 'Permanent Seat',
    },
  ];

  const palettes: { id: NaturalPalette; label: string; colors: string[] }[] = [
    { id: 'sunset', label: 'Sunset', colors: ['#1B2A4A', '#6B4E9E', '#D9A441', '#F4F1EA'] },
    { id: 'afternoon', label: 'Afternoon', colors: ['#B8AFA0', '#4DB8C8', '#E8A045', '#EAF3F5'] },
    { id: 'seaside', label: 'Seaside', colors: ['#2A6B7C', '#7EC8D8', '#E8D5A3', '#F5F0E6'] },
  ];

  return (
    <div
      id="settings-overlay-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="settings-sheet-modal"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[92vh] overflow-y-auto p-5 sm:p-7 rounded-[26px] stele-glassmorphic-overlay transition-all text-[var(--text)]"
        style={{
          background: 'rgba(26, 26, 32, 0.82)',
          backdropFilter: 'blur(28px) saturate(190%)',
          WebkitBackdropFilter: 'blur(28px) saturate(190%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 24px 50px rgba(0, 0, 0, 0.6), 0 1px 1px rgba(255, 255, 255, 0.15) inset',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--stele-rule)]/60">
          <div>
            <h2 className="text-[20px] font-bold tracking-tight text-[var(--stele-text-primary)]">
              Stele Settings
            </h2>
            <p className="text-[13px] text-[var(--stele-text-secondary)]">
              Role calibration, appearance &amp; system origin
            </p>
          </div>
          <button
            id="settings-close-btn"
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--stele-canvas)] transition-colors text-[var(--stele-text-secondary)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content rows */}
        <div className="flex flex-col gap-6 py-4 text-[14px]">
          {/* SECTION: Origin of Stele (PRD & Whitepaper) */}
          <div className="p-4 rounded-[18px] bg-[var(--stele-canvas)] border border-[var(--stele-rule)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-[12px] bg-[var(--stele-accent-soft)] text-[var(--stele-accent)] shrink-0 mt-0.5">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-[15px] text-[var(--stele-text-primary)] block">
                  Origin of Stele
                </span>
                <p className="text-[12px] text-[var(--stele-text-secondary)] leading-[1.4] mt-0.5">
                  Consolidated Design System PRD (v1.0), 5 Constitutional Rules, Material Recipes &amp; White Paper.
                </p>
              </div>
            </div>

            <button
              id="open-origin-of-stele-btn"
              type="button"
              onClick={() => {
                onClose();
                onOpenOriginModal();
              }}
              className="px-3.5 py-2 rounded-[12px] bg-[var(--stele-accent)] text-white text-[13px] font-medium hover:opacity-90 active:scale-[0.98] transition-all shrink-0 flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Read PRD</span>
            </button>
          </div>

          {/* Role Calibration — Explicitly reactive */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-5 h-5 text-[var(--stele-accent)]" />
                <div>
                  <span className="font-semibold text-[15px] text-[var(--stele-text-primary)]">
                    Role Calibration
                  </span>
                  <p className="text-[12px] text-[var(--stele-text-secondary)]">
                    Select a role to dynamically re-calibrate UI layout, authority, and permissions
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-[8px] bg-[var(--stele-accent-soft)] text-[var(--stele-accent)] font-semibold uppercase">
                {currentRole.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 pt-1">
              {roles.map((r) => {
                const isSelected = currentRole === r.id;
                return (
                  <button
                    key={r.id}
                    id={`role-btn-${r.id}`}
                    type="button"
                    onClick={() => {
                      onChangeRole(r.id);
                    }}
                    className={`p-3 rounded-[14px] border text-left transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'border-[var(--stele-accent)] ring-1 ring-[var(--stele-accent)] bg-[var(--stele-accent-soft)]'
                        : 'border-[var(--stele-rule)] hover:border-[var(--stele-text-muted)] bg-[var(--stele-surface)]'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-bold text-[var(--stele-text-primary)]">
                          {r.label}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-[6px] bg-[var(--stele-canvas)] border border-[var(--stele-rule)] text-[var(--stele-text-secondary)]">
                          {r.stage}
                        </span>
                      </div>
                      <p className="text-[12px] text-[var(--stele-text-secondary)] mt-1 leading-[1.4]">
                        {r.desc}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5 pt-0.5">
                      {isSelected ? (
                        <span className="w-5 h-5 rounded-full bg-[var(--stele-accent)] text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="text-[11px] text-[var(--stele-text-muted)] hover:text-[var(--stele-accent)]">
                          Switch
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION: Your Profile, Ledger & Progress Unified Circuit */}
          <div className="flex flex-col gap-2.5 pt-2 border-t border-[var(--stele-rule)]/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <User className="w-5 h-5 text-[var(--stele-accent)]" />
                <div>
                  <span className="font-semibold text-[15px] text-[var(--stele-text-primary)]">
                    Your Profile &amp; Reward Circuit
                  </span>
                  <p className="text-[12px] text-[var(--stele-text-secondary)]">
                    Quick access to identity, sovereign ledger, daily streak and sensory consistency rewards
                  </p>
                </div>
              </div>
            </div>

            <YourProfileSection
              profile={profile}
              currentRole={currentRole}
              ledgerEntries={ledgerEntries}
              onOpenLedger={() => {
                onClose();
                onOpenLedger();
              }}
              onClaimDailyStreak={onClaimDailyStreak}
              canClaimStreak={canClaimStreak}
              onSimulateActionReward={onSimulateActionReward}
            />
          </div>

          {/* Appearance / Dark Canvas Mode */}
          <div className="flex items-center justify-between pt-2 border-t border-[var(--stele-rule)]/40">
            <div className="flex items-center gap-3">
              {isDark ? (
                <Moon className="w-5 h-5 text-[var(--stele-accent)]" />
              ) : (
                <Sun className="w-5 h-5 text-[var(--stele-accent)]" />
              )}
              <div>
                <span className="font-semibold text-[14px] text-[var(--stele-text-primary)]">
                  Dark Canvas Mode
                </span>
                <p className="text-[12px] text-[var(--stele-text-secondary)]">
                  Strictly non-pure-black (#10141A dark / #F7F5F0 light)
                </p>
              </div>
            </div>
            <div
              id="toggle-dark-mode"
              role="switch"
              aria-checked={isDark}
              tabIndex={0}
              onClick={onToggleDarkMode}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  onToggleDarkMode();
                }
              }}
              className={`ios-switch ${isDark ? 'on' : ''}`}
            >
              <div className="thumb" />
            </div>
          </div>

          {/* Natural Atmosphere Palette Selector */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <Palette className="w-5 h-5 text-[var(--stele-accent)]" />
              <div>
                <span className="font-semibold text-[14px] text-[var(--stele-text-primary)]">
                  Natural Palette
                </span>
                <p className="text-[12px] text-[var(--stele-text-secondary)]">
                  Atmosphere only (Chrome &amp; Plasma, never content)
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {palettes.map((p) => (
                <button
                  key={p.id}
                  id={`palette-${p.id}`}
                  type="button"
                  onClick={() => onChangePalette(p.id)}
                  className={`p-2.5 rounded-[14px] border text-left flex flex-col gap-1.5 transition-all ${
                    currentPalette === p.id
                      ? 'border-[var(--stele-accent)] ring-1 ring-[var(--stele-accent)] bg-[var(--stele-accent-soft)]'
                      : 'border-[var(--stele-rule)] hover:border-[var(--stele-text-muted)] bg-[var(--stele-surface)]'
                  }`}
                >
                  <span className="text-[12px] font-semibold text-[var(--stele-text-primary)]">
                    {p.label}
                  </span>
                  <div className="flex gap-1">
                    {p.colors.map((c, i) => (
                      <span
                        key={i}
                        className="w-3.5 h-3.5 rounded-full border border-black/10"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sovereign Instance Theming */}
          <div className="flex items-center justify-between pt-2 border-t border-[var(--stele-rule)]/40">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-[var(--stele-accent)]" />
              <div>
                <span className="font-semibold text-[14px] text-[var(--stele-text-primary)]">
                  Sovereign Instance
                </span>
                <p className="text-[12px] text-[var(--stele-text-secondary)]">
                  Overrides semantic accent token
                </p>
              </div>
            </div>
            <select
              id="instance-select"
              value={currentInstance}
              onChange={(e) => onChangeInstance(e.target.value)}
              className="px-3 py-1.5 rounded-[12px] bg-[var(--stele-surface)] border border-[var(--stele-rule)] text-[13px] font-medium text-[var(--stele-text-primary)]"
            >
              <option value="default">Federated Standard</option>
              <option value="springfield">Springfield High Node</option>
            </select>
          </div>

          {/* Device Performance Tiering */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Laptop className="w-5 h-5 text-[var(--stele-accent)]" />
              <div>
                <span className="font-semibold text-[14px] text-[var(--stele-text-primary)]">
                  Performance Budget
                </span>
                <p className="text-[12px] text-[var(--stele-text-secondary)]">
                  Dhaka student test tier (blurs vs low-end fallback)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-[12.5px] font-medium text-[var(--stele-text-secondary)]">
                {performanceTier === 'full' ? 'Full Glass' : 'Solid Fallback'}
              </span>
              <div
                id="toggle-perf-tier"
                role="switch"
                aria-checked={performanceTier === 'full'}
                tabIndex={0}
                onClick={onTogglePerformanceTier}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    onTogglePerformanceTier();
                  }
                }}
                className={`ios-switch ${performanceTier === 'full' ? 'on' : ''}`}
              >
                <div className="thumb" />
              </div>
            </div>
          </div>

          {/* Ledger Pack Export Link */}
          <div className="pt-3 border-t border-[var(--stele-rule)]/60 flex justify-between items-center">
            <div>
              <span className="font-semibold text-[14px] text-[var(--stele-text-primary)]">
                Permanent Sovereign Ledger
              </span>
              <p className="text-[12px] text-[var(--stele-text-secondary)]">
                Signed cryptographic JSON pack export
              </p>
            </div>
            <button
              id="open-ledger-pack-btn"
              type="button"
              onClick={() => {
                onClose();
                onOpenLedgerExport();
              }}
              className="px-3.5 py-2 rounded-[12px] bg-[var(--stele-surface)] border border-[var(--stele-rule)] text-[var(--stele-text-primary)] text-[13px] font-medium flex items-center gap-1.5 hover:border-[var(--stele-text-primary)] transition-colors"
            >
              <HardDriveDownload className="w-4 h-4 text-[var(--stele-accent)]" />
              <span>Inspect</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
