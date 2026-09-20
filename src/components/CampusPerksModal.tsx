import React, { useState } from 'react';
import {
  Coffee,
  Printer,
  Library,
  Ticket,
  Cpu,
  GraduationCap,
  X,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  QrCode,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { CampusPerk, ClaimedPerkVoucher, StudentProfile } from '../types';

interface CampusPerksModalProps {
  isOpen: boolean;
  onClose: () => void;
  perks: CampusPerk[];
  profile: StudentProfile;
  onRedeemPerk: (perk: CampusPerk) => void;
  onMarkPerkUsed?: (voucherId: string) => void;
  isDark: boolean;
}

export const CampusPerksModal: React.FC<CampusPerksModalProps> = ({
  isOpen,
  onClose,
  perks,
  profile,
  onRedeemPerk,
  onMarkPerkUsed,
  isDark,
}) => {
  const [activeTab, setActiveTab] = useState<'bazaar' | 'my_vouchers'>('bazaar');
  const [selectedVoucher, setSelectedVoucher] = useState<ClaimedPerkVoucher | null>(null);
  const [redeemConfirmPerk, setRedeemConfirmPerk] = useState<CampusPerk | null>(null);

  if (!isOpen) return null;

  const claimedList = profile.claimedPerks || [];
  const activeVouchers = claimedList.filter((v) => v.status === 'active');
  const usedVouchers = claimedList.filter((v) => v.status === 'used');

  const getPerkIcon = (iconName: string) => {
    switch (iconName) {
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-[#D9A93D]" />;
      case 'Printer':
        return <Printer className="w-5 h-5 text-[#4DB8C8]" />;
      case 'Library':
        return <Library className="w-5 h-5 text-[#6366F1]" />;
      case 'Ticket':
        return <Ticket className="w-5 h-5 text-[#EC4899]" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-[#10B981]" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-[#D9A93D]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[var(--accent)]" />;
    }
  };

  const handleConfirmRedeem = () => {
    if (!redeemConfirmPerk) return;
    onRedeemPerk(redeemConfirmPerk);
    setRedeemConfirmPerk(null);
    setActiveTab('my_vouchers');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-[24px] shadow-2xl border overflow-hidden ${
          isDark
            ? 'bg-[#14171F] border-[rgba(255,255,255,0.1)] text-[#E8ECF2]'
            : 'bg-white border-[#E2E8F0] text-[#1E293B]'
        }`}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[var(--accent-soft)] flex items-center justify-center border border-[var(--accent)]/30 text-[var(--accent)]">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[18px] sm:text-[20px] font-extrabold tracking-tight">
                  In-Campus Physical Perks Bazaar
                </h2>
                <span className="px-2 py-0.5 rounded-[8px] bg-[var(--accent-soft)] text-[var(--accent)] text-[10.5px] font-bold tracking-wide uppercase">
                  Physical Utility
                </span>
              </div>
              <p className="text-[12.5px] text-[var(--meta)] mt-0.5">
                Redeem your consistency points for tangible goods & lab privileges across campus.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[rgba(255,255,255,0.06)] text-[var(--meta)] hover:text-[var(--text)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance & Sub-Navigation */}
        <div className="px-5 sm:px-6 py-3.5 bg-[var(--tile)] border-b border-[rgba(255,255,255,0.06)] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-[12px] text-[var(--meta)] font-medium">Available Balance:</span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-[12px] bg-[var(--accent-soft)] border border-[var(--accent)]/30">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span className="text-[15px] font-extrabold text-[var(--accent)]">{profile.score}</span>
              <span className="text-[11px] font-bold text-[var(--accent)]/80 uppercase">pts</span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-[rgba(255,255,255,0.04)] p-1 rounded-[14px] border border-[rgba(255,255,255,0.06)]">
            <button
              type="button"
              onClick={() => {
                setActiveTab('bazaar');
                setSelectedVoucher(null);
              }}
              className={`px-3.5 py-1.5 rounded-[10px] text-[12px] font-bold transition-all ${
                activeTab === 'bazaar'
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'text-[var(--meta)] hover:text-[var(--text)]'
              }`}
            >
              Available Perks ({perks.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('my_vouchers')}
              className={`px-3.5 py-1.5 rounded-[10px] text-[12px] font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'my_vouchers'
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'text-[var(--meta)] hover:text-[var(--text)]'
              }`}
            >
              <span>My Vouchers</span>
              {activeVouchers.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[10px] font-black">
                  {activeVouchers.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'bazaar' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {perks.map((perk) => {
                const canAfford = profile.score >= perk.cost;
                return (
                  <div
                    key={perk.id}
                    className={`p-4 rounded-[20px] border flex flex-col justify-between transition-all ${
                      canAfford
                        ? 'bg-[var(--tile)] border-[rgba(255,255,255,0.08)] hover:border-[var(--accent)]/40 hover:shadow-md'
                        : 'bg-[var(--tile)]/60 border-[rgba(255,255,255,0.04)] opacity-75'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="w-9 h-9 rounded-[12px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center">
                          {getPerkIcon(perk.iconName)}
                        </div>
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-[10px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)]">
                          <span className="text-[13px] font-black text-[var(--accent)]">{perk.cost}</span>
                          <span className="text-[10px] text-[var(--meta)] font-bold">PTS</span>
                        </div>
                      </div>

                      <h3 className="text-[14.5px] font-bold text-[var(--text)] leading-snug">
                        {perk.title}
                      </h3>
                      <p className="text-[12px] text-[var(--meta)] mt-1.5 leading-relaxed">
                        {perk.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)] space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] text-[var(--meta)]">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-[var(--accent)]" />
                        <span className="truncate">{perk.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[var(--meta)]">
                        <Clock className="w-3.5 h-3.5 shrink-0 text-[var(--accent)]" />
                        <span className="truncate">{perk.availability}</span>
                      </div>

                      <button
                        type="button"
                        disabled={!canAfford}
                        onClick={() => setRedeemConfirmPerk(perk)}
                        className={`w-full mt-2 py-2 px-3 rounded-[12px] text-[12.5px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                          canAfford
                            ? 'bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white shadow-xs cursor-pointer'
                            : 'bg-[rgba(255,255,255,0.05)] text-[var(--meta)] cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? (
                          <>
                            <span>Redeem for {perk.cost} pts</span>
                            <ChevronRight className="w-4 h-4" />
                          </>
                        ) : (
                          <span>Need {perk.cost - profile.score} more pts</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* MY VOUCHERS TAB */}
          {activeTab === 'my_vouchers' && (
            <div className="space-y-4">
              {claimedList.length === 0 ? (
                <div className="text-center py-10 px-4 rounded-[20px] bg-[var(--tile)] border border-dashed border-[rgba(255,255,255,0.1)]">
                  <Coffee className="w-10 h-10 mx-auto text-[var(--meta)] mb-2 opacity-50" />
                  <h4 className="text-[15px] font-bold text-[var(--text)]">No Vouchers Claimed Yet</h4>
                  <p className="text-[12.5px] text-[var(--meta)] mt-1 max-w-sm mx-auto">
                    Complete commitments and maintain daily consistency streaks to earn points and claim campus goods.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('bazaar')}
                    className="mt-4 px-4 py-2 rounded-[12px] bg-[var(--accent)] text-white text-[12px] font-bold"
                  >
                    Explore Available Perks
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {claimedList.map((voucher) => {
                    const isActive = voucher.status === 'active';
                    return (
                      <div
                        key={voucher.id}
                        onClick={() => setSelectedVoucher(voucher)}
                        className={`p-4 rounded-[20px] border cursor-pointer transition-all ${
                          isActive
                            ? 'bg-[var(--tile)] border-emerald-500/40 hover:border-emerald-500 shadow-xs'
                            : 'bg-[var(--tile)]/50 border-[rgba(255,255,255,0.04)] opacity-60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-[6px] text-[10px] font-black uppercase tracking-wider ${
                              isActive
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-[rgba(255,255,255,0.06)] text-[var(--meta)]'
                            }`}
                          >
                            {isActive ? 'Ready to Present' : 'Redeemed ✓'}
                          </span>
                          <span className="font-mono text-[11px] font-bold text-[var(--meta)]">
                            {voucher.voucherCode}
                          </span>
                        </div>

                        <h4 className="text-[14px] font-bold text-[var(--text)] mt-2 line-clamp-2">
                          {voucher.perkTitle}
                        </h4>

                        <div className="mt-3 pt-2.5 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[11.5px] text-[var(--meta)]">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[var(--accent)]" />
                            <span className="truncate max-w-[140px]">{voucher.location}</span>
                          </div>
                          <span className="text-[var(--accent)] font-bold flex items-center gap-0.5">
                            Show Pass <QrCode className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info banner */}
        <div className="px-5 py-3 bg-[rgba(255,255,255,0.02)] border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[11.5px] text-[var(--meta)]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Campus physical vouchers authenticated via Sovereign Invariant Ledger.</span>
          </div>
          <span>Non-transferable</span>
        </div>
      </div>

      {/* CONFIRMATION POPUP */}
      {redeemConfirmPerk && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-sm p-5 rounded-[22px] bg-[var(--canvas)] border border-[rgba(255,255,255,0.12)] shadow-2xl text-center">
            <div className="w-12 h-12 rounded-[16px] bg-[var(--accent-soft)] text-[var(--accent)] mx-auto flex items-center justify-center border border-[var(--accent)]/30 mb-3">
              {getPerkIcon(redeemConfirmPerk.iconName)}
            </div>
            <h3 className="text-[16px] font-extrabold text-[var(--text)]">
              Redeem Physical Perk?
            </h3>
            <p className="text-[12.5px] text-[var(--meta)] mt-1.5 leading-relaxed">
              This will exchange <strong className="text-[var(--accent)]">{redeemConfirmPerk.cost} points</strong> from your balance for a tangible voucher at <strong>{redeemConfirmPerk.location}</strong>.
            </p>

            <div className="mt-4 p-3 rounded-[14px] bg-[var(--tile)] border border-[rgba(255,255,255,0.06)] text-left text-[11.5px] space-y-1">
              <div className="text-[var(--text)] font-semibold">{redeemConfirmPerk.title}</div>
              <div className="text-[var(--meta)]">New Point Balance: {profile.score - redeemConfirmPerk.cost} pts</div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setRedeemConfirmPerk(null)}
                className="flex-1 py-2 px-3 rounded-[12px] bg-[rgba(255,255,255,0.06)] text-[var(--meta)] hover:text-[var(--text)] text-[12px] font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRedeem}
                className="flex-1 py-2 px-3 rounded-[12px] bg-[var(--accent)] text-white text-[12px] font-bold shadow-xs"
              >
                Confirm & Issue Pass
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED VOUCHER PASS MODAL (Physical Pass with QR Code & Barcode) */}
      {selectedVoucher && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-[24px] bg-[var(--canvas)] border border-[rgba(255,255,255,0.15)] shadow-2xl overflow-hidden">
            <div className="p-4 bg-[var(--tile)] border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-[12.5px] font-extrabold uppercase tracking-wide text-[var(--text)]">
                  Campus Physical Pass
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVoucher(null)}
                className="p-1 rounded-full text-[var(--meta)] hover:text-[var(--text)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 text-center">
              <span
                className={`inline-block px-2.5 py-0.5 rounded-[8px] text-[10.5px] font-black uppercase tracking-wider mb-2 ${
                  selectedVoucher.status === 'active'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-[rgba(255,255,255,0.06)] text-[var(--meta)]'
                }`}
              >
                {selectedVoucher.status === 'active' ? '● Active · Present to Staff' : 'Redeemed Voucher'}
              </span>

              <h3 className="text-[16px] font-extrabold text-[var(--text)] leading-snug">
                {selectedVoucher.perkTitle}
              </h3>
              <p className="text-[12px] text-[var(--meta)] mt-1">
                {selectedVoucher.location}
              </p>

              {/* Crisp SVG QR Code Representation */}
              <div className="my-4 mx-auto w-44 h-44 p-3 rounded-[18px] bg-white text-black shadow-inner flex flex-col items-center justify-center border-4 border-slate-200">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Outer corner anchors */}
                  <rect x="10" y="10" width="22" height="22" rx="3" fill="#0F172A" />
                  <rect x="14" y="14" width="14" height="14" rx="2" fill="#FFFFFF" />
                  <rect x="18" y="18" width="6" height="6" fill="#0F172A" />

                  <rect x="68" y="10" width="22" height="22" rx="3" fill="#0F172A" />
                  <rect x="72" y="14" width="14" height="14" rx="2" fill="#FFFFFF" />
                  <rect x="76" y="18" width="6" height="6" fill="#0F172A" />

                  <rect x="10" y="68" width="22" height="22" rx="3" fill="#0F172A" />
                  <rect x="14" y="72" width="14" height="14" rx="2" fill="#FFFFFF" />
                  <rect x="18" y="76" width="6" height="6" fill="#0F172A" />

                  {/* Pseudo matrix dots */}
                  <rect x="38" y="14" width="5" height="5" fill="#0F172A" />
                  <rect x="48" y="14" width="5" height="5" fill="#0F172A" />
                  <rect x="56" y="22" width="5" height="5" fill="#0F172A" />
                  <rect x="38" y="26" width="5" height="5" fill="#0F172A" />
                  <rect x="46" y="34" width="8" height="8" fill="#0F172A" />
                  <rect x="14" y="44" width="5" height="5" fill="#0F172A" />
                  <rect x="24" y="48" width="5" height="5" fill="#0F172A" />
                  <rect x="38" y="48" width="5" height="5" fill="#0F172A" />
                  <rect x="58" y="48" width="5" height="5" fill="#0F172A" />
                  <rect x="68" y="44" width="5" height="5" fill="#0F172A" />
                  <rect x="80" y="52" width="5" height="5" fill="#0F172A" />
                  <rect x="42" y="62" width="6" height="6" fill="#0F172A" />
                  <rect x="54" y="66" width="6" height="6" fill="#0F172A" />
                  <rect x="70" y="72" width="5" height="5" fill="#0F172A" />
                  <rect x="80" y="76" width="5" height="5" fill="#0F172A" />
                  <rect x="40" y="78" width="5" height="5" fill="#0F172A" />
                  <rect x="50" y="82" width="5" height="5" fill="#0F172A" />
                </svg>
                <span className="text-[9px] font-mono font-bold text-slate-800 tracking-wider mt-1">
                  {selectedVoucher.voucherCode}
                </span>
              </div>

              {/* Instructions Box */}
              <div className="p-3 rounded-[14px] bg-[var(--tile)] border border-[rgba(255,255,255,0.06)] text-left text-[11.5px] space-y-1">
                <div className="font-bold text-[var(--text)] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[var(--accent)]" /> Counter Instructions:
                </div>
                <p className="text-[var(--meta)] leading-relaxed">
                  {selectedVoucher.counterInstructions}
                </p>
                <div className="pt-1.5 border-t border-[rgba(255,255,255,0.06)] text-[10.5px] text-[var(--meta)] font-mono">
                  Issued to: {profile.name} ({profile.studentId})
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 flex flex-col gap-2">
                {selectedVoucher.status === 'active' && onMarkPerkUsed && (
                  <button
                    type="button"
                    onClick={() => {
                      onMarkPerkUsed(selectedVoucher.id);
                      setSelectedVoucher((prev) => (prev ? { ...prev, status: 'used' } : null));
                    }}
                    className="w-full py-2.5 px-3 rounded-[12px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[12px] shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark as Redeemed by Staff
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedVoucher(null)}
                  className="w-full py-2 px-3 rounded-[12px] bg-[rgba(255,255,255,0.06)] text-[var(--meta)] hover:text-[var(--text)] font-semibold text-[12px]"
                >
                  Close Pass
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
