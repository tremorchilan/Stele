import React from 'react';
import { Home, Compass, Bookmark, Building2, Settings } from 'lucide-react';

export type NavTab = 'home' | 'radar' | 'board' | 'campus' | 'dispatches' | 'bazaar';

interface RibbonProps {
  activeTab: NavTab;
  isOpen: boolean;
  onSelectRibbonItem: (item: string) => void;
  onOpenSettings: () => void;
  onClose: () => void;
  isDark: boolean;
}

const RIBBON_ITEMS: Record<NavTab, string[]> = {
  home: ['Commitments', 'Notices', 'Opportunities', 'Unified In-App Calendar'],
  radar: ['My interests', 'Browse', 'Saved'],
  board: ['Active', 'Watched', 'Past'],
  campus: [
    'Messenger',
    'Unified In-App Calendar',
    'Physical Perks Bazaar',
    'Clubs & Societies',
    'Classes & Timetable',
    'Resources & Syllabi',
  ],
  dispatches: ['Common Channels', 'Private DMs', 'Friend Index & QR', 'Catch-up Digest'],
  bazaar: ['All Physical Perks', 'My Claimed Vouchers'],
};

export const Ribbon: React.FC<RibbonProps> = ({
  activeTab,
  isOpen,
  onSelectRibbonItem,
  onOpenSettings,
  onClose,
  isDark,
}) => {
  if (!isOpen) return null;

  const items = RIBBON_ITEMS[activeTab] || [];

  return (
    <div
      id="stele-ribbon-panel"
      className={`absolute bottom-[72px] left-0 right-0 mx-auto w-[280px] p-3 z-40 rounded-[28px] transition-all origin-bottom ${
        isDark ? 'stele-clay-nav-dark' : 'stele-clay-nav-light'
      }`}
      style={{
        animation: 'unroll 250ms var(--spring-bounce) forwards',
      }}
    >
      <div className="flex flex-col gap-1">
        {/* Ribbon Header Label */}
        <div className="px-3 py-1 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-medium">
            {activeTab}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            Close
          </button>
        </div>

        {/* Staggered Ribbon items */}
        {items.map((item, index) => (
          <button
            key={item}
            id={`ribbon-item-${item.toLowerCase().replace(/\s+/g, '-')}`}
            type="button"
            onClick={() => {
              onSelectRibbonItem(item);
              onClose();
            }}
            className="w-full text-left px-3 py-2 rounded-[16px] text-[14px] font-medium text-[var(--text-primary)] hover:bg-[var(--accent-soft)]/60 transition-colors flex items-center justify-between"
            style={{
              animation: `fade-in 180ms ease-out forwards ${index * 20}ms`,
            }}
          >
            <span>{item}</span>
          </button>
        ))}

        {/* Settings lives at the bottom of every ribbon, separated by a thin rule (PRD 9.6) */}
        <div className="my-1 border-t border-[var(--rule-default)]/60" />

        <button
          id="ribbon-settings-btn"
          type="button"
          onClick={() => {
            onClose();
            onOpenSettings();
          }}
          className="w-full text-left px-3 py-2 rounded-[16px] text-[14px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-soft)]/40 transition-colors flex items-center gap-2"
        >
          <Settings className="w-4 h-4 text-[var(--text-muted)]" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};
