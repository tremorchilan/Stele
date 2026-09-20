import React from 'react';
import { NavTab } from './Ribbon';

interface NavBarProps {
  activeTab: NavTab;
  ribbonTab: NavTab;
  ribbonOpen: boolean;
  onNavClick: (tab: NavTab) => void;
  onSelectRibbonItem: (item: string) => void;
  onOpenSettings: () => void;
  onOpenProfile?: () => void;
  profileScore?: number;
  isDark?: boolean;
}

interface RibbonItemData {
  title: string;
  icon: string;
  bg: string;
}

const TAB_RIBBON_ITEMS: Record<NavTab, RibbonItemData[]> = {
  home: [
    { title: 'Recent Notices', icon: '◍', bg: 'rgba(77,126,247,.15)' },
    { title: 'Weekly Schedule', icon: '✦', bg: 'rgba(224,168,58,.15)' },
    { title: 'Closing Soon', icon: '⬢', bg: 'rgba(232,122,61,.15)' },
  ],
  radar: [
    { title: 'Federation Feed', icon: '◍', bg: 'rgba(77,126,247,.15)' },
    { title: 'My Tracked Keywords', icon: '✦', bg: 'rgba(224,168,58,.15)' },
    { title: 'Saved Discovery Tasks', icon: '⬣', bg: 'rgba(61,177,110,.15)' },
  ],
  board: [
    { title: 'Active Commitments', icon: '⬣', bg: 'rgba(61,177,110,.15)' },
    { title: 'Watched List', icon: '✦', bg: 'rgba(224,168,58,.15)' },
    { title: 'Historical Archive', icon: '◍', bg: 'rgba(77,126,247,.15)' },
  ],
  campus: [
    { title: 'Calm Dispatches', icon: '💬', bg: 'rgba(56,189,248,.2)' },
    { title: 'Physical Perks Bazaar', icon: '☕', bg: 'rgba(245,158,11,.2)' },
    { title: 'Clubs & Societies', icon: '✦', bg: 'rgba(224,168,58,.15)' },
    { title: 'Classes & Timetable', icon: '⬣', bg: 'rgba(61,177,110,.15)' },
    { title: 'Resources & Syllabi', icon: '⬢', bg: 'rgba(232,122,61,.15)' },
  ],
  dispatches: [
    { title: 'Common Channels', icon: '◍', bg: 'rgba(56,189,248,.2)' },
    { title: 'Private DMs', icon: '🔒', bg: 'rgba(168,85,247,.2)' },
    { title: 'Friend Index & QR', icon: '👥', bg: 'rgba(16,185,129,.2)' },
    { title: 'Catch-up Digest', icon: '⚡', bg: 'rgba(245,158,11,.2)' },
  ],
  bazaar: [
    { title: 'All Physical Perks', icon: '☕', bg: 'rgba(245,158,11,.2)' },
    { title: 'My Claimed Vouchers', icon: '🎟️', bg: 'rgba(56,189,248,.2)' },
  ],
};

export const NavBar: React.FC<NavBarProps> = ({
  activeTab,
  ribbonTab,
  ribbonOpen,
  onNavClick,
  onSelectRibbonItem,
  onOpenSettings,
  onOpenProfile,
  profileScore = 640,
}) => {
  const currentItems = TAB_RIBBON_ITEMS[ribbonTab] || TAB_RIBBON_ITEMS[activeTab];

  return (
    <div className="nav-area" id="navArea">
      <div className={`clay-nav ${ribbonOpen ? 'open' : ''}`} id="clayNav">
        {/* Unrolling Ribbon Section matching reference */}
        <div className="clay-ribbon" id="clayRibbon">
          <div className="ribbon-inner">
            <div className="ribbon-glass">
              {currentItems.map((item) => (
                <div
                  key={item.title}
                  className="ribbon-row"
                  onClick={() => onSelectRibbonItem(item.title)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectRibbonItem(item.title)}
                >
                  <div className="ribbon-ico" style={{ background: item.bg }}>
                    {item.icon}
                  </div>
                  <span>{item.title}</span>
                  <span className="chev">&rsaquo;</span>
                </div>
              ))}

              <hr className="ribbon-rule" />

              <div
                className="ribbon-settings"
                id="settingsBtn"
                onClick={onOpenSettings}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpenSettings()}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
                <span>Role Calibration &amp; Settings</span>
              </div>

              {/* Your Profile & Unified Reward Circuit below Role Calibration & Settings */}
              {onOpenProfile && (
                <div
                  className="ribbon-settings"
                  id="yourProfileRibbonBtn"
                  onClick={onOpenProfile}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpenProfile()}
                  style={{
                    marginTop: '4px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingTop: '8px',
                  }}
                >
                  <div className="w-5 h-5 rounded-[7px] bg-[var(--accent)] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                    SS
                  </div>
                  <span className="font-medium">Your Profile &amp; Rewards</span>
                  <span className="ml-auto px-1.5 py-0.5 rounded-[6px] text-[10px] font-mono bg-[var(--accent)]/15 text-[var(--accent)] font-bold">
                    {profileScore} pts
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* The 4 Clay Nav Buttons */}
        <div className="nav-items">
          {/* Home */}
          <button
            className={`nav-item ${(ribbonOpen ? ribbonTab === 'home' : activeTab === 'home') ? 'active' : ''}`}
            data-tab="home"
            type="button"
            onClick={() => onNavClick('home')}
          >
            <svg viewBox="0 0 24 24">
              <path d="M3 10.5L12 3l9 7.5" />
              <path d="M5.5 9.5V20h13V9.5" />
            </svg>
            <span>Home</span>
          </button>

          {/* Radar */}
          <button
            className={`nav-item ${(ribbonOpen ? ribbonTab === 'radar' : activeTab === 'radar') ? 'active' : ''}`}
            data-tab="radar"
            type="button"
            onClick={() => onNavClick('radar')}
          >
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="8" />
              <circle cx="12" cy="12" r="3.5" />
              <circle cx="12" cy="12" r="1" fill="currentColor" />
            </svg>
            <span>Radar</span>
            <div className="radar-dot" />
          </button>

          {/* Board */}
          <button
            className={`nav-item ${(ribbonOpen ? ribbonTab === 'board' : activeTab === 'board') ? 'active' : ''}`}
            data-tab="board"
            type="button"
            onClick={() => onNavClick('board')}
          >
            <svg viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M3 9h18M9 9v11" />
            </svg>
            <span>Board</span>
          </button>

          {/* Campus */}
          <button
            className={`nav-item ${(ribbonOpen ? ribbonTab === 'campus' : activeTab === 'campus') ? 'active' : ''}`}
            data-tab="campus"
            type="button"
            onClick={() => onNavClick('campus')}
          >
            <svg viewBox="0 0 24 24">
              <path d="M12 3L2 9l10 6 10-6-10-6z" />
              <path d="M6 11.5V17c0 0 2.5 3 6 3s6-3 6-3v-5.5" />
            </svg>
            <span>Campus</span>
          </button>
        </div>
      </div>
    </div>
  );
};
