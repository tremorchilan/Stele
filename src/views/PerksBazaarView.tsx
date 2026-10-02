import React, { useState } from 'react';
import {
  Coffee,
  Printer,
  Library,
  Ticket,
  Cpu,
  GraduationCap,
  Sparkles,
  MapPin,
  Clock,
  QrCode,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  X,
  ExternalLink,
} from 'lucide-react';
import { CampusPerk, ClaimedPerkVoucher, StudentProfile } from '../types';

interface PerksBazaarViewProps {
  perks: CampusPerk[];
  profile: StudentProfile;
  onRedeemPerk: (perk: CampusPerk) => void;
  onMarkPerkUsed?: (voucherId: string) => void;
  onNavigateBack: () => void;
  isDark: boolean;
  initialTab?: 'bazaar' | 'my_vouchers';
}

export const PerksBazaarView: React.FC<PerksBazaarViewProps> = ({
  perks,
  profile,
  onRedeemPerk,
  onMarkPerkUsed,
  onNavigateBack,
  isDark,
  initialTab = 'bazaar',
}) => {
  const [activeTab, setActiveTab] = useState<'bazaar' | 'my_vouchers'>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVoucher, setSelectedVoucher] = useState<ClaimedPerkVoucher | null>(null);
  const [redeemConfirmPerk, setRedeemConfirmPerk] = useState<CampusPerk | null>(null);

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

  const filteredPerks = perks.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const handleConfirmRedeem = () => {
    if (!redeemConfirmPerk) return;
    onRedeemPerk(redeemConfirmPerk);
    setRedeemConfirmPerk(null);
    setActiveTab('my_vouchers');
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto pb-28">
      {/* Top Banner & Navigation */}
      <div className="p-4 sm:p-6 border-b border-[rgba(255,255,255,0.08)] bg-[var(--tile)]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onNavigateBack}
              className="p-2 rounded-[12px] bg-[var(--track)] border border-[rgba(255,255,255,0.08)] text-[var(--text)] hover:-translate-y-0.5 hover:shadow-xs transition-all cursor-pointer"
              title="Return to Campus"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[22px] sm:text-[26px] font-extrabold text-[var(--text)] tracking-tight">
                  In-Campus Physical Perks Bazaar
                </h1>
                <span className="px-2.5 py-0.5 rounded-[8px] bg-[var(--accent-soft)] text-[var(--accent)] text-[11px] font-bold uppercase tracking-wider">
                  Physical Utility
                </span>
              </div>
              <p className="text-[13px] text-[var(--meta)] mt-0.5">
                Redeem your earned sovereign consistency points for tangible in-school amenities.
              </p>
            </div>
          </div>

          {/* Student Balance Pill */}
          <div className="flex items-center gap-3 self-end sm:self-center">
            <div className="px-4 py-2 rounded-[14px] bg-[var(--track)] border border-[rgba(255,255,255,0.08)] flex items-center gap-2.5 shadow-xs">
              <span className="text-[11px] text-[var(--meta)] font-bold uppercase">
                Sovereign Balance:
              </span>
              <span className="text-[17px] font-extrabold text-[var(--amber)] font-mono">
                {profile.score} pts
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 space-y-6">
        {/* Navigation Tabs (Bazaar vs My Vouchers) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(255,255,255,0.08)] pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('bazaar')}
              className={`chip ${activeTab === 'bazaar' ? 'on' : ''}`}
            >
              Perks Catalog ({perks.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('my_vouchers')}
              className={`chip flex items-center gap-2 ${activeTab === 'my_vouchers' ? 'on' : ''}`}
            >
              <span>My Claimed Vouchers</span>
              {activeVouchers.length > 0 && (
                <span className="pill pill-sm urgent">
                  {activeVouchers.length} Active
                </span>
              )}
            </button>
          </div>

          {/* Category Filter Chips */}
          {activeTab === 'bazaar' && (
            <div className="chips">
              {[
                { id: 'all', label: 'All' },
                { id: 'beverage', label: 'Café & Drinks' },
                { id: 'fabrication', label: 'Maker Labs' },
                { id: 'academic', label: 'Study & Honors' },
                { id: 'culture', label: 'Events & Arts' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`chip ${selectedCategory === cat.id ? 'on' : ''}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tab 1: Perks Catalog */}
        {activeTab === 'bazaar' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPerks.map((perk) => {
              const canAfford = profile.score >= perk.cost;
              return (
                <div
                  key={perk.id}
                  className="p-5 rounded-[20px] bg-[var(--tile)] border border-[rgba(255,255,255,0.06)] hover:-translate-y-1 hover:shadow-lg transition-all flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-[12px] bg-[var(--track)] border border-[rgba(255,255,255,0.06)]">
                          {getPerkIcon(perk.iconName)}
                        </div>
                        <div>
                          <span className="text-[10.5px] uppercase tracking-wider font-bold text-[var(--meta)] block">
                            {perk.category}
                          </span>
                          <h3 className="text-[16px] font-extrabold text-[var(--text)] leading-snug">
                            {perk.title}
                          </h3>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[16px] font-extrabold text-[var(--amber)] font-mono">
                          {perk.cost}
                        </span>
                        <span className="text-[11px] text-[var(--meta)] block">points</span>
                      </div>
                    </div>

                    <p className="text-[12.5px] text-[var(--meta)] mt-3 leading-relaxed">
                      {perk.description}
                    </p>

                    <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.06)] space-y-1.5 text-[12px] text-[var(--meta)]">
                      <div className="flex items-center gap-1.5 text-[var(--text)]">
                        <MapPin className="w-3.5 h-3.5 text-[var(--orange)] shrink-0" />
                        <span className="truncate">{perk.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span>{perk.availability}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between gap-2">
                    <span className="text-[11px] text-[var(--meta)] line-clamp-1">
                      {perk.counterInstructions}
                    </span>

                    <button
                      type="button"
                      disabled={!canAfford}
                      onClick={() => setRedeemConfirmPerk(perk)}
                      className={`px-4 py-2 rounded-[12px] text-[12.5px] font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                        canAfford
                          ? 'bg-[var(--accent)] text-white hover:opacity-95 active:scale-95 shadow-xs'
                          : 'bg-[var(--track)] text-[var(--meta)] cursor-not-allowed border border-white/5'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{canAfford ? 'Redeem Voucher' : `Need ${perk.cost - profile.score} more`}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: My Claimed Vouchers */}
        {activeTab === 'my_vouchers' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-[16px] font-bold text-[var(--text)] mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" />
                <span>Active Unused Physical Vouchers ({activeVouchers.length})</span>
              </h2>

              {activeVouchers.length === 0 ? (
                <div className="p-8 rounded-[18px] bg-[var(--tile)] border border-[rgba(255,255,255,0.06)] text-center text-[var(--meta)] text-[13px]">
                  You have no active vouchers. Redeem items from the Perks Catalog above using your earned points!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeVouchers.map((voucher) => (
                    <div
                      key={voucher.id}
                      className="p-5 rounded-[20px] bg-[var(--tile)] border border-[var(--rule)] shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[11px] font-bold text-[var(--accent)] uppercase tracking-wide">
                            Valid Physical Voucher
                          </span>
                          <span className="text-[11px] font-mono text-[var(--meta)]">
                            {voucher.voucherCode}
                          </span>
                        </div>
                        <h3 className="text-[17px] font-extrabold text-[var(--text)] mt-1">
                          {voucher.perkTitle}
                        </h3>
                        <div className="flex items-center gap-1.5 text-[12px] text-[var(--meta)] mt-2">
                          <MapPin className="w-3.5 h-3.5 text-[var(--orange)]" />
                          <span>{voucher.location}</span>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setSelectedVoucher(voucher)}
                          className="px-4 py-2 rounded-[12px] bg-[var(--accent)] text-white text-[12.5px] font-bold hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <QrCode className="w-4 h-4" />
                          <span>Present QR to Counter</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onMarkPerkUsed?.(voucher.id)}
                          className="text-[12px] text-[var(--meta)] hover:text-[var(--text)] underline cursor-pointer"
                        >
                          Mark Used
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Used History */}
            {usedVouchers.length > 0 && (
              <div className="pt-4 border-t border-[rgba(255,255,255,0.08)]">
                <h3 className="text-[14px] font-bold text-[var(--meta)] mb-2">
                  Archived / Redeemed Past Vouchers
                </h3>
                <div className="space-y-2">
                  {usedVouchers.map((uv) => (
                    <div
                      key={uv.id}
                      className="p-3 rounded-[12px] bg-[var(--track)] border border-white/5 flex items-center justify-between text-[12.5px] opacity-75"
                    >
                      <span className="font-medium text-[var(--text)]">{uv.perkTitle}</span>
                      <span className="text-[11px] text-[var(--meta)] font-mono">
                        Redeemed {uv.voucherCode}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {redeemConfirmPerk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-[24px] bg-[var(--tile)] border border-[rgba(255,255,255,0.1)] shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[var(--tile-active)] border border-[var(--rule)] text-[var(--accent)] flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-[18px] font-extrabold text-[var(--text)]">
                Confirm Physical Voucher Claim
              </h3>
              <p className="text-[13px] text-[var(--meta)] mt-1">
                Claim <strong>"{redeemConfirmPerk.title}"</strong> for{' '}
                <span className="font-bold text-[var(--amber)]">{redeemConfirmPerk.cost} points</span>?
              </p>
            </div>
            <div className="p-3 rounded-[12px] bg-[var(--track)] text-[12px] text-[var(--meta)] text-left">
              <strong>Counter Instructions:</strong> {redeemConfirmPerk.counterInstructions}
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRedeemConfirmPerk(null)}
                className="px-4 py-2 rounded-[12px] bg-[var(--track)] text-[13px] font-bold text-[var(--text)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRedeem}
                className="px-5 py-2 rounded-[12px] bg-[var(--accent)] text-white text-[13px] font-bold hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer"
              >
                Confirm &amp; Generate QR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Presentation Modal */}
      {selectedVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-sm p-6 rounded-[28px] bg-white text-slate-900 shadow-2xl text-center space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                In-Campus Redemption Terminal
              </span>
              <button
                type="button"
                onClick={() => setSelectedVoucher(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-[18px] font-extrabold text-slate-900 leading-snug">
                {selectedVoucher.perkTitle}
              </h3>
              <p className="text-[12px] text-slate-500 mt-0.5">{selectedVoucher.location}</p>
            </div>

            {/* High Contrast QR Code Display */}
            <div className="w-48 h-48 mx-auto p-2 rounded-[20px] bg-slate-50 border-2 border-slate-200 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
                <rect x="5" y="5" width="25" height="25" rx="3" />
                <rect x="10" y="10" width="15" height="15" rx="1" fill="#FFFFFF" />
                <rect x="13" y="13" width="9" height="9" />
                <rect x="70" y="5" width="25" height="25" rx="3" />
                <rect x="75" y="10" width="15" height="15" rx="1" fill="#FFFFFF" />
                <rect x="78" y="13" width="9" height="9" />
                <rect x="5" y="70" width="25" height="25" rx="3" />
                <rect x="10" y="75" width="15" height="15" rx="1" fill="#FFFFFF" />
                <rect x="13" y="78" width="9" height="9" />
                {/* Random Pattern Dots */}
                <rect x="40" y="10" width="6" height="6" />
                <rect x="52" y="10" width="6" height="6" />
                <rect x="40" y="25" width="6" height="6" />
                <rect x="55" y="25" width="6" height="6" />
                <rect x="40" y="40" width="6" height="6" />
                <rect x="48" y="48" width="6" height="6" />
                <rect x="58" y="40" width="6" height="6" />
                <rect x="10" y="40" width="6" height="6" />
                <rect x="25" y="40" width="6" height="6" />
                <rect x="70" y="40" width="6" height="6" />
                <rect x="85" y="40" width="6" height="6" />
                <rect x="40" y="70" width="6" height="6" />
                <rect x="52" y="75" width="6" height="6" />
                <rect x="70" y="70" width="6" height="6" />
                <rect x="85" y="80" width="6" height="6" />
              </svg>
            </div>

            <div className="font-mono font-extrabold text-[15px] tracking-wider text-slate-800 bg-slate-100 py-1.5 rounded-[10px]">
              {selectedVoucher.voucherCode}
            </div>

            <p className="text-[11.5px] text-slate-500 leading-snug">
              Present screen to the on-duty staff at the campus desk. Once verified, tap below.
            </p>

            <button
              type="button"
              onClick={() => {
                onMarkPerkUsed?.(selectedVoucher.id);
                setSelectedVoucher(null);
              }}
              className="w-full py-2.5 rounded-[14px] bg-[var(--accent)] hover:brightness-110 active:scale-95 transition-all text-white font-bold text-[13px] shadow-sm cursor-pointer"
            >
              Mark Verified by Counter Staff ✓
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
