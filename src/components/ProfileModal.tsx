import React from 'react';
import { X, User, Shield, Award, FileCheck } from 'lucide-react';
import { StudentProfile, LedgerEntry, Role } from '../types';
import { YourProfileSection } from './YourProfileSection';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  currentRole: Role;
  ledgerEntries: LedgerEntry[];
  onOpenLedger: () => void;
  onClaimDailyStreak?: () => void;
  canClaimStreak?: boolean;
  onSimulateActionReward?: (type: 'notice' | 'early_task' | 'retro') => void;
  onOpenPerksBazaar?: () => void;
  isDark?: boolean;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  currentRole,
  ledgerEntries,
  onOpenLedger,
  onClaimDailyStreak,
  canClaimStreak,
  onSimulateActionReward,
  onOpenPerksBazaar,
  isDark,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="profile-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="profile-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[92vh] overflow-y-auto p-5 sm:p-6 rounded-[26px] stele-glassmorphic-overlay transition-all text-[var(--stele-text-primary)]"
        style={{
          background: 'rgba(26, 26, 32, 0.88)',
          backdropFilter: 'blur(30px) saturate(190%)',
          WebkitBackdropFilter: 'blur(30px) saturate(190%)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          boxShadow: '0 24px 50px rgba(0, 0, 0, 0.6), 0 1px 1px rgba(255, 255, 255, 0.15) inset',
        }}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--stele-rule)]/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-[12px] bg-[var(--stele-accent-soft)] text-[var(--stele-accent)]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[19px] font-bold tracking-tight text-[var(--stele-text-primary)]">
                Your Profile &amp; Reward Circuit
              </h2>
              <p className="text-[12px] text-[var(--stele-text-secondary)]">
                Overview your identity, immutable ledger, and sensory consistency circuit
              </p>
            </div>
          </div>

          <button
            id="profile-modal-close-btn"
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--stele-canvas)] transition-colors text-[var(--stele-text-secondary)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Profile Section */}
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
          onOpenPerksBazaar={() => {
            onClose();
            onOpenPerksBazaar?.();
          }}
        />
      </div>
    </div>
  );
};
