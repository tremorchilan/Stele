import React from 'react';
import { NavTab } from './Ribbon';
import {
  Sliders,
  Smartphone,
  Flame,
} from 'lucide-react';

interface DesktopSidebarProps {
  activeTab: NavTab;
  ribbonTab: NavTab;
  ribbonOpen: boolean;
  onNavClick: (tab: NavTab) => void;
  onSelectRibbonItem: (item: string) => void;
  onOpenSettings: () => void;
  onOpenProfile?: () => void;
  profileScore?: number;
  dailyStreak?: number;
  currentRole?: string;
  isDark?: boolean;
  onSwitchToDeviceFrame?: () => void;
}

interface RibbonItemData {
  title: string;
  icon: string;
  bg: string;
  color?: string;
}

const TAB_RIBBON_ITEMS: Record<NavTab, RibbonItemData[]> = {
  home: [
    { title: 'Recent Notices', icon: '◍', bg: '#0284C7', color: '#FFFFFF' },
    { title: 'Weekly Schedule', icon: '✦', bg: '#F59E0B', color: '#0F172A' },
    { title: 'Closing Soon', icon: '⬢', bg: '#EF4444', color: '#FFFFFF' },
  ],
  radar: [
    { title: 'Federation Feed', icon: '◍', bg: '#0284C7', color: '#FFFFFF' },
    { title: 'My Tracked Keywords', icon: '✦', bg: '#F59E0B', color: '#0F172A' },
    { title: 'Saved Discovery Tasks', icon: '⬣', bg: '#10B981', color: '#FFFFFF' },
  ],
  board: [
    { title: 'Active Commitments', icon: '⬣', bg: '#10B981', color: '#FFFFFF' },
    { title: 'Watched List', icon: '✦', bg: '#F59E0B', color: '#0F172A' },
    { title: 'Historical Archive', icon: '◍', bg: '#0284C7', color: '#FFFFFF' },
  ],
  campus: [
    { title: 'Messenger', icon: '💬', bg: '#0284C7', color: '#FFFFFF' },
    { title: 'Physical Perks Bazaar', icon: '☕', bg: '#F59E0B', color: '#0F172A' },
    { title: 'Clubs & Societies', icon: '✦', bg: '#8B5CF6', color: '#FFFFFF' },
    { title: 'Classes & Timetable', icon: '⬣', bg: '#10B981', color: '#FFFFFF' },
    { title: 'Resources & Syllabi', icon: '⬢', bg: '#EF4444', color: '#FFFFFF' },
  ],
  dispatches: [
    { title: 'Common Channels', icon: '◍', bg: '#0284C7', color: '#FFFFFF' },
    { title: 'Private DMs', icon: '🔒', bg: '#8B5CF6', color: '#FFFFFF' },
    { title: 'Friend Index & QR', icon: '👥', bg: '#10B981', color: '#FFFFFF' },
    { title: 'Catch-up Digest', icon: '⚡', bg: '#F59E0B', color: '#0F172A' },
  ],
  bazaar: [
    { title: 'All Physical Perks', icon: '☕', bg: '#F59E0B', color: '#0F172A' },
    { title: 'My Claimed Vouchers', icon: '🎟️', bg: '#0284C7', color: '#FFFFFF' },
  ],
};

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  activeTab,
  ribbonTab,
  ribbonOpen,
  onNavClick,
  onSelectRibbonItem,
  onOpenSettings,
  onOpenProfile,
  profileScore = 185,
  dailyStreak = 3,
  onSwitchToDeviceFrame,
}) => {
  return (
    <div className="h-full flex flex-col justify-between items-center py-4 px-2 sm:px-3 select-none relative z-40 w-[78px] sm:w-[84px] shrink-0">
      {/* 1. TOP-LEFT: Exact Mobile Navigation Bar, Vertically Positioned */}
      <div className="relative">
        <div
          className="clay-nav-vertical"
          id="desktopTopNav"
          role="navigation"
          aria-label="Primary Navigation"
        >
          {/* The 4 Clay Nav Buttons exactly matching mobile */}
          <div className="flex flex-col items-center gap-1.5 p-1.5 w-full">
            {/* Home */}
            <button
              id="desktop-nav-home"
              type="button"
              onClick={() => onNavClick('home')}
              className={`clay-nav-btn ${
                (ribbonOpen ? ribbonTab === 'home' : activeTab === 'home') ? 'active' : ''
              }`}
              title="Home (Daily Overview & Bento)"
              aria-label="Home"
            >
              <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]">
                <path d="M3 10.5L12 3l9 7.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5.5 9.5V20h13V9.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[10px] font-bold tracking-tight">Home</span>
            </button>

            {/* Radar */}
            <button
              id="desktop-nav-radar"
              type="button"
              onClick={() => onNavClick('radar')}
              className={`clay-nav-btn relative ${
                (ribbonOpen ? ribbonTab === 'radar' : activeTab === 'radar') ? 'active' : ''
              }`}
              title="Opportunity Radar"
              aria-label="Opportunity Radar"
            >
              <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]">
                <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="1" fill="currentColor" />
              </svg>
              <span className="text-[10px] font-bold tracking-tight">Radar</span>
              <div
                className="radar-dot"
                style={{ top: '8px', right: '14px', position: 'absolute' }}
              />
            </button>

            {/* Board */}
            <button
              id="desktop-nav-board"
              type="button"
              onClick={() => onNavClick('board')}
              className={`clay-nav-btn ${
                (ribbonOpen ? ribbonTab === 'board' : activeTab === 'board') ? 'active' : ''
              }`}
              title="Commitments Board"
              aria-label="Commitments Board"
            >
              <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]">
                <rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 9h18M9 9v11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[10px] font-bold tracking-tight">Board</span>
            </button>

            {/* Campus */}
            <button
              id="desktop-nav-campus"
              type="button"
              onClick={() => onNavClick('campus')}
              className={`clay-nav-btn ${
                (ribbonOpen ? ribbonTab === 'campus' : activeTab === 'campus') ? 'active' : ''
              }`}
              title="Campus Hub"
              aria-label="Campus Hub"
            >
              <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]">
                <path d="M12 3L2 9l10 6 10-6-10-6z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 11.5V17c0 0 2.5 3 6 3s6-3 6-3v-5.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[10px] font-bold tracking-tight">Campus</span>
            </button>
          </div>
        </div>

        {/* 2-Tap Unrolling Ribbon Flyout beside Top-Left Nav */}
        {ribbonOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/20"
              onClick={() => onNavClick(ribbonTab)}
              aria-label="Close ribbon menu"
            />
            <div className="absolute left-[84px] top-0 w-[240px] z-50 clay-ribbon-flyout animate-in fade-in zoom-in-95 duration-200">
              <div className="p-2.5 rounded-[22px] bg-[#1E1E22]/95 backdrop-blur-xl border border-white/10 shadow-[0_14px_34px_rgba(0,0,0,0.65)]">
              <div className="px-2 py-1 text-[10.5px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center justify-between border-b border-white/8 pb-1.5 mb-1.5">
                <span>{ribbonTab.toUpperCase()} QUICK ACCESS</span>
                <span className="text-[9px] font-medium text-white/40">2-Tap Ribbon</span>
              </div>
              <div className="flex flex-col gap-1">
                {TAB_RIBBON_ITEMS[ribbonTab]?.map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => onSelectRibbonItem(item.title)}
                    className="w-full px-2.5 py-2 rounded-[12px] hover:bg-white/10 active:bg-white/15 text-left text-[12.5px] font-medium text-[var(--text)] flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <div
                      className="w-6 h-6 rounded-[8px] flex items-center justify-center text-[12px] font-bold shadow-xs shrink-0"
                      style={{ background: item.bg, color: item.color || '#FFFFFF' }}
                    >
                      {item.icon}
                    </div>
                    <span className="truncate">{item.title}</span>
                  </button>
                ))}
              </div>

              <div className="mt-2 pt-1.5 border-t border-white/8">
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="w-full px-2.5 py-1.5 rounded-[12px] hover:bg-white/10 text-left text-[12px] font-medium text-[var(--accent)] flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Role Calibration &amp; Settings</span>
                </button>
              </div>
            </div>
          </div>
          </>
        )}
      </div>

      {/* 2. BOTTOM-LEFT: Vertically Positioned Pill-Like Bar, Detached from Top-Left */}
      <div
        className="clay-nav-vertical"
        id="desktopBottomPill"
        role="complementary"
        aria-label="Account and Settings"
      >
        <div className="flex flex-col items-center gap-1.5 p-1.5 w-full">
          {/* Account Profile Button */}
          <button
            id="desktop-bottom-profile"
            type="button"
            onClick={onOpenProfile}
            className="clay-nav-btn group"
            title={`Your Sovereign Profile (${profileScore} pts)`}
            aria-label="Your Profile"
          >
            <div className="w-7 h-7 rounded-[10px] bg-[var(--accent)] text-white flex items-center justify-center text-[10.5px] font-bold shadow-xs group-hover:scale-105 transition-transform">
              SS
            </div>
            <span className="text-[9.5px] font-bold text-[var(--text-secondary)] group-hover:text-white transition-colors">
              {profileScore}
            </span>
          </button>

          {/* Daily Streak Button */}
          <button
            id="desktop-bottom-streak"
            type="button"
            onClick={onOpenProfile}
            className="clay-nav-btn text-[#F59E0B] group"
            title={`Daily Consistency Streak: ${dailyStreak} days · Tap to inspect`}
            aria-label="Daily Streak"
          >
            <Flame className="w-5 h-5 text-[#F59E0B] group-hover:scale-110 transition-transform fill-[#F59E0B]/20" />
            <span className="text-[9.5px] font-bold text-[#F59E0B]">
              {dailyStreak}d
            </span>
          </button>

          {/* System Settings & Calibration */}
          <button
            id="desktop-bottom-settings"
            type="button"
            onClick={onOpenSettings}
            className="clay-nav-btn text-[var(--text-secondary)] hover:text-[var(--accent)]"
            title="Role Calibration & System Settings"
            aria-label="Settings"
          >
            <Sliders className="w-[20px] h-[20px]" />
            <span className="text-[9.5px] font-medium">Config</span>
          </button>

          {/* Switch to Reference Device Frame */}
          {onSwitchToDeviceFrame && (
            <button
              id="desktop-bottom-frame-toggle"
              type="button"
              onClick={onSwitchToDeviceFrame}
              className="clay-nav-btn text-[var(--text-muted)] hover:text-white"
              title="Switch to Reference Mobile Frame (390x844)"
              aria-label="Switch to Mobile Frame"
            >
              <Smartphone className="w-4 h-4" />
              <span className="text-[9px]">Frame</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
