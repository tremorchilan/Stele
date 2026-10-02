import React, { useState, useEffect } from 'react';
import {
  SteleItem,
  Commitment,
  NoticeItem,
  Club,
  WikiPage,
  LedgerEntry,
  Role,
  NaturalPalette,
  StudentProfile,
  RewardLogItem,
  CampusPerk,
  ClaimedPerkVoucher,
  CommunicationChannel,
  DispatchMessage,
  FriendPeer,
} from './types';
import {
  INITIAL_ITEMS,
  INITIAL_COMMITMENTS,
  INITIAL_NOTICES,
  INITIAL_CLUBS,
  INITIAL_WIKI_PAGES,
  INITIAL_LEDGER_ENTRIES,
  INITIAL_PIPELINE,
  INITIAL_STUDENT_PROFILE,
  CAMPUS_PERKS,
  COMMUNICATION_CHANNELS,
  INITIAL_DISPATCH_MESSAGES,
  MOCK_FRIENDS,
} from './data/mockData';
import { NavBar } from './components/NavBar';
import { NavTab } from './components/Ribbon';
import { HomeView } from './views/HomeView';
import { RadarView } from './views/RadarView';
import { BoardView } from './views/BoardView';
import { CampusView } from './views/CampusView';
import { DispatchesView } from './views/DispatchesView';
import { PerksBazaarView } from './views/PerksBazaarView';
import { ItemDetailModal } from './components/ItemDetailModal';
import { SettingsSheet } from './components/SettingsSheet';
import { CelebrationOverlay, CelebrationData } from './components/CelebrationOverlay';
import { KnowledgeCaptureModal } from './components/KnowledgeCaptureModal';
import { LedgerModal } from './components/LedgerModal';
import { OriginOfSteleModal } from './components/OriginOfSteleModal';
import { UnconventionalFeaturesWidget } from './components/UnconventionalFeaturesWidget';
import { ProfileModal } from './components/ProfileModal';
import { CampusPerksModal } from './components/CampusPerksModal';
import { CatchupDigestModal } from './components/CatchupDigestModal';
import { FriendIndexModal } from './components/FriendIndexModal';
import { UnifiedCalendarModal } from './components/UnifiedCalendarModal';
import { DesktopSidebar } from './components/DesktopSidebar';
import { MOCK_ACADEMIC_CALENDAR } from './data/academicCalendarData';
import { Wifi, FileText, Sliders, BookOpen, Smartphone, Maximize2, User, Flame, Coffee, MessageSquare, QrCode } from 'lucide-react';

export default function App() {
  // Navigation & 2-Tap Ribbon State (PRD 9.6 & User Mandate)
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [ribbonTab, setRibbonTab] = useState<NavTab>('home');
  const [ribbonOpen, setRibbonOpen] = useState(false);

  // Modals & Sheets State
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [ledgerOpen, setLedgerOpen] = useState(false);
  const [originModalOpen, setOriginModalOpen] = useState(false);
  const [unconventionalWidgetOpen, setUnconventionalWidgetOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [campusPerksModalOpen, setCampusPerksModalOpen] = useState(false);
  const [catchupDigestModalOpen, setCatchupDigestModalOpen] = useState(false);
  const [friendIndexModalOpen, setFriendIndexModalOpen] = useState(false);
  const [unifiedCalendarOpen, setUnifiedCalendarOpen] = useState(false);
  const [friendsList, setFriendsList] = useState<FriendPeer[]>(MOCK_FRIENDS);

  // Student Profile & Reward Circuit State (WP §18 & User Mandate)
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('stele_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_STUDENT_PROFILE;
      }
    }
    return INITIAL_STUDENT_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem('stele_profile', JSON.stringify(studentProfile));
  }, [studentProfile]);

  // Layout View Mode (Device Frame vs Fluid Canvas)
  // Automatically start in Desktop Expanded View on desktop screens (>=1024px) so navigation is immediately visible
  const [isDeviceFrame, setIsDeviceFrame] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });

  // Dynamic Island Notch flash state & Inset Glass Sheet state from reference
  const [notchPulsing, setNotchPulsing] = useState(false);
  const [glassSheetOpen, setGlassSheetOpen] = useState(false);
  const [instantNotif, setInstantNotif] = useState(true);
  const [calendarSync, setCalendarSync] = useState(false);

  const handleFlashNotch = () => {
    setNotchPulsing(true);
    setTimeout(() => setNotchPulsing(false), 800);
  };

  // Appearance & Identity State
  const [isDark, setIsDark] = useState(true);
  const [currentPalette, setCurrentPalette] = useState<NaturalPalette>('sunset');
  const [currentRole, setCurrentRole] = useState<Role>('aspirant');
  const [currentInstance, setCurrentInstance] = useState('springfield');
  const [performanceTier, setPerformanceTier] = useState<'full' | 'reduced'>('full');

  // Application Data State
  const [items, setItems] = useState<SteleItem[]>(() => {
    const saved = localStorage.getItem('stele_items');
    return saved ? JSON.parse(saved) : INITIAL_ITEMS;
  });

  const [commitments, setCommitments] = useState<Commitment[]>(() => {
    const saved = localStorage.getItem('stele_commitments');
    return saved ? JSON.parse(saved) : INITIAL_COMMITMENTS;
  });

  const [notices] = useState<NoticeItem[]>(INITIAL_NOTICES);
  const [clubs] = useState<Club[]>(INITIAL_CLUBS);

  const [wikiPages, setWikiPages] = useState<WikiPage[]>(() => {
    const saved = localStorage.getItem('stele_wiki');
    return saved ? JSON.parse(saved) : INITIAL_WIKI_PAGES;
  });

  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>(() => {
    const saved = localStorage.getItem('stele_ledger');
    return saved ? JSON.parse(saved) : INITIAL_LEDGER_ENTRIES;
  });

  const [pipeline] = useState(INITIAL_PIPELINE);

  // In-Campus Physical Perks Bazaar State
  const [perks] = useState<CampusPerk[]>(CAMPUS_PERKS);

  // Distraction-Free Campus Communication State
  const [channels] = useState<CommunicationChannel[]>(COMMUNICATION_CHANNELS);
  const [dispatchMessages, setDispatchMessages] = useState<DispatchMessage[]>(() => {
    const saved = localStorage.getItem('stele_dispatches');
    return saved ? JSON.parse(saved) : INITIAL_DISPATCH_MESSAGES;
  });

  useEffect(() => {
    localStorage.setItem('stele_dispatches', JSON.stringify(dispatchMessages));
  }, [dispatchMessages]);

  // Modals & Overlay triggers
  const [selectedItem, setSelectedItem] = useState<SteleItem | null>(null);
  const [pendingKnowledgeCommitment, setPendingKnowledgeCommitment] = useState<Commitment | null>(null);
  const [celebrationData, setCelebrationData] = useState<CelebrationData | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('9:41');

  // Sub-page state for exact Ribbon quick-access wiring
  const [radarSubMode, setRadarSubMode] = useState<'feed' | 'keywords' | 'saved'>('feed');
  const [boardSection, setBoardSection] = useState<'all' | 'active' | 'watched' | 'past' | 'analytics'>('all');
  const [campusSubMode, setCampusSubMode] = useState<
    'hub' | 'clubs' | 'classes' | 'academic-calendar' | 'resources' | 'quiet-zones' | 'steward-console'
  >('hub');
  const [bazaarSubTab, setBazaarSubTab] = useState<'bazaar' | 'my_vouchers'>('bazaar');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 2200);
  };

  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      let h = d.getHours();
      const m = d.getMinutes();
      h = h % 12 || 12;
      setCurrentTime(`${h}:${m < 10 ? '0' : ''}${m}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('stele_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('stele_commitments', JSON.stringify(commitments));
  }, [commitments]);

  useEffect(() => {
    localStorage.setItem('stele_wiki', JSON.stringify(wikiPages));
  }, [wikiPages]);

  useEffect(() => {
    localStorage.setItem('stele_ledger', JSON.stringify(ledgerEntries));
  }, [ledgerEntries]);

  // Apply dark mode and theme attributes to HTML root
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.setAttribute('data-palette', currentPalette);
    root.setAttribute('data-instance', currentInstance);
  }, [isDark, currentPalette, currentInstance]);

  // 2-Tap Navigation Handler:
  // 1st tap on nav item -> opens Ribbon for that tab
  // 2nd tap on the same nav item -> moves to that page!
  const handleNavClick = (clickedTab: NavTab) => {
    if (!ribbonOpen || ribbonTab !== clickedTab) {
      // 1st tap: Open ribbon for this tab!
      setRibbonTab(clickedTab);
      setRibbonOpen(true);
    } else {
      // 2nd tap: Navigate to this tab!
      setActiveTab(clickedTab);
      setRibbonOpen(false);
    }
  };

  // Direct selection from ribbon rows
  const handleSelectRibbonItem = (item: string) => {
    const lower = item.toLowerCase();
    if (lower.includes('settings')) {
      setSettingsOpen(true);
      setRibbonOpen(false);
      return;
    }

    // --- RADAR QUICK ACCESS ITEMS ---
    if (lower.includes('federation feed')) {
      setRadarSubMode('feed');
      setActiveTab('radar');
      setRibbonOpen(false);
      return;
    }
    if (lower.includes('tracked keyword') || lower.includes('my tracked keywords')) {
      setRadarSubMode('keywords');
      setActiveTab('radar');
      setRibbonOpen(false);
      return;
    }
    if (lower.includes('saved discovery') || lower.includes('saved discovery tasks')) {
      setRadarSubMode('saved');
      setActiveTab('radar');
      setRibbonOpen(false);
      return;
    }

    // --- BOARD QUICK ACCESS ITEMS ---
    if (lower.includes('active commitment') || lower.includes('active commitments')) {
      setBoardSection('active');
      setActiveTab('board');
      setRibbonOpen(false);
      return;
    }
    if (lower.includes('watched list') || lower.includes('watched')) {
      setBoardSection('watched');
      setActiveTab('board');
      setRibbonOpen(false);
      return;
    }
    if (lower.includes('historical archive') || lower.includes('archive') || lower.includes('past')) {
      setBoardSection('past');
      setActiveTab('board');
      setRibbonOpen(false);
      return;
    }

    // --- CAMPUS QUICK ACCESS ITEMS ---
    if (lower.includes('calm dispatch') || lower.includes('messenger')) {
      setActiveTab('dispatches');
      setRibbonOpen(false);
      return;
    }
    if (lower.includes('clubs & societies') || lower.includes('club')) {
      setCampusSubMode('clubs');
      setActiveTab('campus');
      setRibbonOpen(false);
      return;
    }
    if (lower.includes('classes & timetable') || lower.includes('timetable') || lower.includes('class')) {
      setCampusSubMode('classes');
      setActiveTab('campus');
      setRibbonOpen(false);
      return;
    }
    if (lower.includes('resources & syllabi') || lower.includes('syllab') || lower.includes('resource')) {
      setCampusSubMode('resources');
      setActiveTab('campus');
      setRibbonOpen(false);
      return;
    }
    if (lower.includes('academic year') || lower.includes('academic calendar')) {
      setCampusSubMode('academic-calendar');
      setActiveTab('campus');
      setRibbonOpen(false);
      return;
    }
    if (lower.includes('unified calendar') || lower.includes('in-app calendar')) {
      setUnifiedCalendarOpen(true);
      setRibbonOpen(false);
      return;
    }

    // --- BAZAAR QUICK ACCESS ITEMS ---
    if (lower.includes('all physical perks') || lower.includes('perk') || lower.includes('bazaar')) {
      setBazaarSubTab('bazaar');
      setActiveTab('bazaar');
      setRibbonOpen(false);
      return;
    }
    if (lower.includes('claimed voucher') || lower.includes('my claimed vouchers') || lower.includes('voucher')) {
      setBazaarSubTab('my_vouchers');
      setActiveTab('bazaar');
      setRibbonOpen(false);
      return;
    }

    // --- DISPATCHES QUICK ACCESS ITEMS ---
    if (lower.includes('friend') || lower.includes('qr')) {
      setFriendIndexModalOpen(true);
      setRibbonOpen(false);
      return;
    }
    if (lower.includes('digest') || lower.includes('catch-up')) {
      setCatchupDigestModalOpen(true);
      setRibbonOpen(false);
      return;
    }
    if (
      lower.includes('common channel') ||
      lower.includes('private dm') ||
      lower.includes('dispatch') ||
      lower.includes('channel') ||
      lower.includes('dm')
    ) {
      setActiveTab('dispatches');
      setRibbonOpen(false);
      return;
    }

    // --- HOME QUICK ACCESS ITEMS ---
    if (lower.includes('notice') || lower.includes('schedule') || lower.includes('closing')) {
      setActiveTab('home');
      setRibbonOpen(false);
      return;
    }

    // Fallbacks
    if (lower.includes('radar')) {
      setActiveTab('radar');
      setRibbonOpen(false);
    } else if (lower.includes('campus')) {
      setActiveTab('campus');
      setRibbonOpen(false);
    }
  };

  // Unified Reward Circuit Engine (WP §18 & User Mandate)
  const awardReward = (
    type: RewardLogItem['type'],
    points: number,
    title: string,
    details?: string
  ) => {
    handleFlashNotch();
    showToast(`+${points} pts · ${title}`);
    setStudentProfile((prev) => {
      const newLog: RewardLogItem = {
        id: `rw-${Date.now()}`,
        type,
        title,
        points,
        timestamp: new Date().toISOString(),
        details,
      };
      return {
        ...prev,
        score: prev.score + points,
        rewardHistory: [newLog, ...prev.rewardHistory],
      };
    });
  };

  const handleClaimDailyStreak = () => {
    handleFlashNotch();
    const nextStreak = studentProfile.dailyStreak + 1;
    showToast(`+25 pts · Day ${nextStreak} Consistency Streak Claimed! 🔥`);
    setStudentProfile((prev) => {
      const newLog: RewardLogItem = {
        id: `rw-${Date.now()}`,
        type: 'streak',
        title: `Day ${nextStreak} Consistency Streak`,
        points: 25,
        timestamp: new Date().toISOString(),
        details: 'Active daily civic commitment fulfillment verified without hiatus',
      };
      return {
        ...prev,
        dailyStreak: nextStreak,
        longestStreak: Math.max(prev.longestStreak, nextStreak),
        score: prev.score + 25,
        lastActiveDate: new Date().toISOString().split('T')[0],
        rewardHistory: [newLog, ...prev.rewardHistory],
      };
    });
  };

  const handleSimulateActionReward = (type: 'notice' | 'early_task' | 'retro') => {
    if (type === 'notice') {
      awardReward('notice_view', 15, 'Civic Notice Inspected', 'Official institutional circular reviewed');
      setStudentProfile((prev) => ({
        ...prev,
        noticesInspectedCount: prev.noticesInspectedCount + 1,
      }));
    } else if (type === 'early_task') {
      awardReward('early_bonus', 50, 'Early Delivery Bonus', 'Line-follower robot completed 48h before clock');
      setStudentProfile((prev) => ({
        ...prev,
        earlyDeliveriesCount: prev.earlyDeliveriesCount + 1,
      }));
    } else if (type === 'retro') {
      awardReward('retrospective', 40, 'Operational Retrospective Inscribed', 'Robotics society fixture notes preserved');
      setStudentProfile((prev) => ({
        ...prev,
        retrospectivesContributedCount: prev.retrospectivesContributedCount + 1,
      }));
    }
  };

  // In-Campus Physical Perks Redemption Handlers
  const handleRedeemPerk = (perk: CampusPerk) => {
    if (studentProfile.score < perk.cost) {
      showToast(`Need ${perk.cost - studentProfile.score} more points to redeem ${perk.title}!`);
      return;
    }

    const newVoucher: ClaimedPerkVoucher = {
      id: `vch-${Date.now()}`,
      perkId: perk.id,
      perkTitle: perk.title,
      cost: perk.cost,
      claimedAt: new Date().toISOString(),
      voucherCode: `VCH-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      qrValue: `stele://voucher/${perk.id}/${Date.now()}`,
      location: perk.location,
      counterInstructions: perk.counterInstructions,
      status: 'active',
    };

    setStudentProfile((prev) => ({
      ...prev,
      score: Math.max(0, prev.score - perk.cost),
      claimedPerks: [newVoucher, ...(prev.claimedPerks || [])],
      rewardHistory: [
        {
          id: `rw-perk-${Date.now()}`,
          type: 'task_claim',
          title: `Redeemed: ${perk.title}`,
          points: -perk.cost,
          timestamp: new Date().toISOString(),
          details: `Physical in-campus voucher issued for ${perk.location}`,
        },
        ...prev.rewardHistory,
      ],
    }));

    showToast(`Voucher Claimed: ${perk.title} (-${perk.cost} pts)`);
  };

  const handleMarkPerkUsed = (voucherId: string) => {
    setStudentProfile((prev) => ({
      ...prev,
      claimedPerks: (prev.claimedPerks || []).map((v) =>
        v.id === voucherId ? { ...v, status: 'used' as const } : v
      ),
    }));
    showToast('Voucher verified & redeemed at campus counter ✓');
  };

  // Calm Campus Communication Handlers
  const handleSendDispatch = (channelId: string, content: string) => {
    const newMsg: DispatchMessage = {
      id: `disp-${Date.now()}`,
      channelId,
      senderName: studentProfile.name,
      senderRole: currentRole,
      senderAvatar: studentProfile.avatarUrl,
      timestamp: 'Just now',
      content,
    };
    setDispatchMessages((prev) => [...prev, newMsg]);
    showToast('Quiet dispatch posted to channel');
  };

  const handleConvertDispatchToActionableTask = (task: {
    title: string;
    deadline: string;
    points: number;
    channelName: string;
  }) => {
    const newCommitment: Commitment = {
      id: `commit-disp-${Date.now()}`,
      itemId: `item-disp-${Date.now()}`,
      title: task.title,
      deadline: new Date(Date.now() + 36 * 3600 * 1000).toISOString(),
      sourceInstitution: 'Springfield High School',
      stewardName: 'Channel Lead',
      witnessName: studentProfile.name,
      type: 'delegated',
      status: 'active',
    };
    setCommitments((prev) => [newCommitment, ...prev]);
    awardReward('task_claim', 20, 'Claimed Actionable Dispatch Task', `Extracted from #${task.channelName}`);
    showToast(`Commitment logged from #${task.channelName} (+${task.points} pts potential)`);
  };

  const handleInspectNotice = () => {
    awardReward('notice_view', 15, 'Civic Notice Inspected', 'Read institutional notice rather than scrolling social media');
    setStudentProfile((prev) => ({
      ...prev,
      noticesInspectedCount: prev.noticesInspectedCount + 1,
    }));
  };

  const handleFulfillSlip = () => {
    awardReward('task_claim', 20, 'Permission Slip Signed', 'Verified institutional administrative compliance');
  };

  // Actions
  const handleStarItem = (item: SteleItem) => {
    const existing = commitments.find((c) => c.itemId === item.id);
    if (existing) {
      if (existing.status === 'watched') {
        setCommitments((prev) => prev.filter((c) => c.id !== existing.id));
      }
    } else {
      const newCommitment: Commitment = {
        id: `commit-${Date.now()}`,
        itemId: item.id,
        title: item.title,
        sourceInstitution: item.sourceInstitution,
        stewardName: item.stewardName,
        deadline: item.deadline,
        type: 'self_chosen',
        status: 'watched',
      };
      setCommitments((prev) => [newCommitment, ...prev]);
    }
  };

  const handleCommitItem = (item: SteleItem) => {
    const existing = commitments.find((c) => c.itemId === item.id);
    if (existing) {
      setCommitments((prev) =>
        prev.map((c) => (c.id === existing.id ? { ...c, status: 'active' } : c))
      );
    } else {
      const newCommitment: Commitment = {
        id: `commit-${Date.now()}`,
        itemId: item.id,
        title: item.title,
        sourceInstitution: item.sourceInstitution,
        stewardName: item.stewardName,
        deadline: item.deadline,
        type: 'self_chosen',
        status: 'active',
      };
      setCommitments((prev) => [newCommitment, ...prev]);
    }

    // Sensory reward: Committed focus to real-world opportunity
    awardReward(
      'opportunity_star',
      10,
      'Committed to Real-World Task',
      `Active commitment registered for ${item.title}`
    );
  };

  // Context-aware praise generator celebrating optimism and intellect
  const getTailoredTaskMessage = (title: string, desc?: string, institution?: string): string => {
    const t = title.toLowerCase();
    if (t.includes('chassis') || t.includes('robot') || t.includes('assemble') || t.includes('hardware') || t.includes('line-follower')) {
      return "Outstanding engineering precision! By completing this line-follower chassis assembly with diligence, you've ensured freshman engineers have calibrated physical hardware to test sensor loops without mechanical failure. Your craftsmanship elevates the entire robotics society!";
    }
    if (t.includes('budget') || t.includes('finance') || t.includes('proposal') || t.includes('annual')) {
      return "Brilliant analytical clarity! Your meticulous budget accounting and resource forecasting guarantee that crucial student projects, lab consumables, and workshop equipment allocations stay fully funded and transparent.";
    }
    if (t.includes('slide') || t.includes('deck') || t.includes('speaker') || t.includes('presentation')) {
      return "Exceptional intellectual synthesis! You've transformed complex institutional ideas into a pristine, high-impact visual narrative that inspires and informs our guest speakers and attendees.";
    }
    if (t.includes('code') || t.includes('review') || t.includes('pull request') || t.includes('software') || t.includes('bug')) {
      return "Masterful code stewardship! Your thorough architectural discernment and testing discipline safeguarded system stability while fostering collaborative trust across your developer peers.";
    }
    if (t.includes('workshop') || t.includes('materials') || t.includes('organize') || t.includes('inventory')) {
      return "Exemplary organizational stewardship! A thoughtfully organized, fully prepared workspace empowers fellow students to jump straight into creative inquiry with zero downtime.";
    }
    if (t.includes('clean') || t.includes('lab') || t.includes('fixture') || t.includes('station')) {
      return "Inspiring civic diligence! Maintaining laboratory cleanliness and hardware fixtures creates a safe, welcoming, and high-performance workshop environment for all.";
    }
    return `Splendid display of intellect and resolve! Fulfilling "${title}" exemplifies personal accountability, civic reliability, and scholarly excellence across our campus community.`;
  };

  const handleCompleteCommitment = (commitment: Commitment) => {
    if (commitment.status === 'completed') {
      showToast('Commitment already completed ✓');
      return;
    }

    const nowMs = Date.now();
    const deadlineMs = new Date(commitment.deadline).getTime();
    const hoursRemaining = (deadlineMs - nowMs) / (3600 * 1000);
    const isEarly = hoursRemaining > 0;

    const basePoints = commitment.type === 'delegated' ? 100 : 60;
    const earlyBonus = isEarly ? 50 : 0;
    const totalPoints = basePoints + earlyBonus;

    // 1. Mark commitment status as completed
    setCommitments((prev) =>
      prev.map((c) =>
        c.id === commitment.id
          ? {
              ...c,
              status: 'completed',
              completedAt: new Date().toISOString(),
            }
          : c
      )
    );

    // 2. Inscribe in Sovereign Ledger
    const newEntry: LedgerEntry = {
      id: `ledger-${Date.now()}`,
      studentName: 'Shadman Shakib',
      action: `Fulfilled Commitment: ${commitment.title}`,
      moment: new Date().toISOString(),
      witnessName: commitment.stewardName,
      witnessRole: 'Steward Witness',
      isWitnessed: commitment.type === 'delegated',
      institution: commitment.sourceInstitution,
      hash: `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`,
    };
    setLedgerEntries((prev) => [newEntry, ...prev]);

    // 3. Award Reward Circuit points & update student profile
    awardReward(
      'completion',
      totalPoints,
      commitment.type === 'delegated' ? 'Witnessed Task Fulfilled' : 'Commitment Fulfilled',
      `${commitment.title}${isEarly ? ' · Early Delivery Bonus (+50)' : ''}`
    );

    setStudentProfile((prev) => ({
      ...prev,
      completedCommitmentsCount: prev.completedCommitmentsCount + 1,
      earlyDeliveriesCount: isEarly ? prev.earlyDeliveriesCount + 1 : prev.earlyDeliveriesCount,
    }));

    // 4. Trigger Exuberant Mascot & Confetti Sprinkles Celebration Overlay immediately!
    const tailoredMsg = getTailoredTaskMessage(
      commitment.title,
      undefined,
      commitment.sourceInstitution
    );

    setCelebrationData({
      title: commitment.title,
      points: totalPoints,
      pointsBreakdown: [
        {
          label: commitment.type === 'delegated' ? 'Witnessed Task Completion' : 'Self-Chosen Milestone',
          points: basePoints,
        },
        ...(isEarly ? [{ label: 'Early Delivery Speed Bonus', points: earlyBonus }] : []),
      ],
      tailoredMessage: tailoredMsg,
      witnessName: commitment.witnessName || commitment.stewardName,
      category: commitment.type,
      hash: newEntry.hash,
      isEarly,
    });
  };

  const handleSaveKnowledge = (
    commitmentId: string,
    retrospective: { wentWell: string; wentWrong: string; toChange: string }
  ) => {
    const comm = commitments.find((c) => c.id === commitmentId);
    if (!comm) return;

    // Inscribe in wiki memory
    const newWiki: WikiPage = {
      id: `wiki-${Date.now()}`,
      clubId: 'club-robotics',
      title: `Retrospective: ${comm.title}`,
      type: 'Retrospective',
      visibility: 'core',
      lastEditedBy: 'Shadman Shakib (Student)',
      lastEditedDate: new Date().toISOString().split('T')[0],
      content: `# Retrospective: ${comm.title}\n\n**What went well:**\n${retrospective.wentWell}\n\n**What went wrong:**\n${retrospective.wentWrong}\n\n**What to change:**\n${retrospective.toChange}`,
      version: 1,
    };
    setWikiPages((prev) => [newWiki, ...prev]);

    // Update commitment retrospective
    setCommitments((prev) =>
      prev.map((c) =>
        c.id === commitmentId
          ? {
              ...c,
              retrospective,
            }
          : c
      )
    );

    setPendingKnowledgeCommitment(null);

    // Award retrospective bonus
    awardReward(
      'retrospective',
      40,
      'Operational Retrospective Inscribed',
      `Retrospective added to club wiki for ${comm.title}`
    );

    setStudentProfile((prev) => ({
      ...prev,
      retrospectivesContributedCount: prev.retrospectivesContributedCount + 1,
    }));
  };

  const handleSkipKnowledge = (commitmentId: string) => {
    setPendingKnowledgeCommitment(null);
  };

  const handleUnwatchCommitment = (commitmentId: string) => {
    setCommitments((prev) => prev.filter((c) => c.id !== commitmentId));
  };

  const handleAddTask = (task: Partial<SteleItem>) => {
    const newItem: SteleItem = {
      id: `item-${Date.now()}`,
      title: task.title || 'Untitled Commitment',
      sourceInstitution: task.sourceInstitution || 'Springfield High',
      sourceSpace: task.sourceSpace || 'General Space',
      stewardName: task.stewardName || 'Lead Steward',
      provenance: task.provenance || 'Institutional',
      scope: task.scope || 'district',
      deadline: task.deadline || new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      originalMessage: task.originalMessage || '',
      tags: task.tags || ['General'],
      reachCount: task.reachCount || 48,
      unseenCount: 0,
      lowFairnessFlag: false,
    };
    setItems((prev) => [newItem, ...prev]);
  };

  const handleAddWikiPage = (page: Partial<WikiPage>) => {
    const newPage: WikiPage = {
      id: `wiki-${Date.now()}`,
      clubId: page.clubId || 'club-robotics',
      title: page.title || 'Untitled Page',
      type: page.type || 'Playbook',
      visibility: page.visibility || 'core',
      lastEditedBy: 'Lead Steward',
      lastEditedDate: new Date().toISOString().split('T')[0],
      content: page.content || '',
      version: 1,
    };
    setWikiPages((prev) => [newPage, ...prev]);
  };

  const handleNominateSuccessor = (name: string, date: string) => {
    const handoverWiki: WikiPage = {
      id: `wiki-handover-${Date.now()}`,
      clubId: 'club-robotics',
      title: `Executive Handover Protocol → ${name}`,
      type: 'Handover',
      visibility: 'steward',
      lastEditedBy: 'Nafis Ahmed (Lead Steward)',
      lastEditedDate: new Date().toISOString().split('T')[0],
      content: `# Formal Authority Handover: Outgoing Steward → ${name}\n\n**Transfer Effective Date:** ${date}\n\nAuthority transferred in trust according to White Paper Section 27. The outgoing holder becomes alumni with permanent read-only access.`,
      version: 1,
    };
    setWikiPages((prev) => [handoverWiki, ...prev]);
  };

  const renderActiveView = () => (
    <>
      {activeTab === 'home' && (
        <HomeView
          items={items}
          commitments={commitments}
          notices={notices}
          currentRole={currentRole}
          onSelectItem={(item) => setSelectedItem(item)}
          onOpenCommitment={(comm) => {
            const matched = items.find((i) => i.id === comm.itemId);
            if (matched) setSelectedItem(matched);
          }}
          onNavigateTab={(tab) => {
            setActiveTab(tab);
            setRibbonOpen(false);
          }}
          onFlashNotch={handleFlashNotch}
          onShowToast={showToast}
          onOpenDetailSheet={() => setDetailSheetOpen(true)}
          onOpenUnconventionalFeatures={() => setUnconventionalWidgetOpen(true)}
          onOpenProfile={() => setProfileModalOpen(true)}
          onInspectNotice={handleInspectNotice}
          onFulfillSlip={handleFulfillSlip}
          onOpenCatchupDigest={() => setCatchupDigestModalOpen(true)}
          onOpenDispatches={() => {
            setActiveTab('dispatches');
            setRibbonOpen(false);
          }}
          onOpenUnifiedCalendar={() => setUnifiedCalendarOpen(true)}
          streakCount={studentProfile.dailyStreak}
          score={studentProfile.score}
        />
      )}

      {activeTab === 'radar' && (
        <RadarView
          items={items}
          commitments={commitments}
          onSelectItem={(item) => setSelectedItem(item)}
          onOpenUnconventionalFeatures={() => setUnconventionalWidgetOpen(true)}
          isDark={isDark}
          initialMode={radarSubMode}
          onModeChange={setRadarSubMode}
        />
      )}

      {activeTab === 'board' && (
        <BoardView
          commitments={commitments}
          onSelectCommitment={(comm) => {
            const matched = items.find((i) => i.id === comm.itemId);
            if (matched) setSelectedItem(matched);
          }}
          onCompleteCommitment={handleCompleteCommitment}
          onUnwatchCommitment={handleUnwatchCommitment}
          onOpenUnconventionalFeatures={() => setUnconventionalWidgetOpen(true)}
          initialSection={boardSection}
          onSectionChange={setBoardSection}
          profile={studentProfile}
          onOpenProfile={() => setProfileModalOpen(true)}
        />
      )}

      {activeTab === 'campus' && (
        <CampusView
          clubs={clubs}
          wikiPages={wikiPages}
          pipeline={pipeline}
          currentRole={currentRole}
          onChangeRole={(newRole) => {
            setCurrentRole(newRole);
            showToast(`Calibrated to ${newRole.replace('_', ' ').toUpperCase()}`);
          }}
          onAddTask={handleAddTask}
          onAddWikiPage={handleAddWikiPage}
          onNominateSuccessor={handleNominateSuccessor}
          onOpenUnconventionalFeatures={() => setUnconventionalWidgetOpen(true)}
          channels={channels}
          messages={dispatchMessages}
          onSendMessage={handleSendDispatch}
          onConvertToActionableTask={handleConvertDispatchToActionableTask}
          onOpenPerksBazaar={() => {
            setBazaarSubTab('bazaar');
            setActiveTab('bazaar');
            setRibbonOpen(false);
          }}
          onOpenDispatches={() => {
            setActiveTab('dispatches');
            setRibbonOpen(false);
          }}
          onOpenUnifiedCalendar={() => setUnifiedCalendarOpen(true)}
          studentName={studentProfile.name}
          isDark={isDark}
          initialViewMode={campusSubMode}
          onViewModeChange={setCampusSubMode}
        />
      )}

      {/* Dedicated Messenger Communication Page */}
      {activeTab === 'dispatches' && (
        <DispatchesView
          channels={channels}
          messages={dispatchMessages}
          currentRole={currentRole}
          studentName={studentProfile.name}
          onSendMessage={handleSendDispatch}
          onConvertToActionableTask={handleConvertDispatchToActionableTask}
          onNavigateBack={() => setActiveTab('campus')}
          onOpenCatchupDigest={() => setCatchupDigestModalOpen(true)}
          friends={friendsList}
          onAddFriend={(peer) => {
            setFriendsList((prev) => [peer, ...prev]);
            showToast(`Peer added: ${peer.name} (${peer.trustLevel})`);
          }}
          isDark={isDark}
        />
      )}

      {/* Dedicated Physical Perks Bazaar Page */}
      {activeTab === 'bazaar' && (
        <PerksBazaarView
          perks={perks}
          profile={studentProfile}
          onRedeemPerk={handleRedeemPerk}
          onMarkPerkUsed={handleMarkPerkUsed}
          onNavigateBack={() => setActiveTab('campus')}
          isDark={isDark}
          initialTab={bazaarSubTab}
        />
      )}
    </>
  );

  const renderSheets = () => (
    <>
      {/* Inset Glass Settings Sheet from reference */}
      <div className={`glass-sheet ${glassSheetOpen ? 'visible' : ''}`} id="glassSheet">
        <div className="glass-sheet-header">
          <div className="glass-sheet-title">Campus Preferences</div>
          <button
            className="glass-sheet-close"
            id="closeGlassBtn"
            type="button"
            onClick={() => setGlassSheetOpen(false)}
          >
            &times;
          </button>
        </div>
        <div
          className="glass-row"
          onClick={() => {
            const next = !instantNotif;
            setInstantNotif(next);
            showToast(`Instant alerts: ${next ? 'Active' : 'Muted'}`);
          }}
        >
          <span>Instant Notifications</span>
          <div className={`ios-switch ${instantNotif ? 'on' : ''}`} id="toggleNotif">
            <div className="thumb" />
          </div>
        </div>
        <div
          className="glass-row"
          onClick={() => {
            const next = !calendarSync;
            setCalendarSync(next);
            showToast(`Calendar Sync: ${next ? 'Linked' : 'Detached'}`);
          }}
        >
          <span>Calendar Sync (iCal)</span>
          <div className={`ios-switch ${calendarSync ? 'on' : ''}`} id="toggleSync">
            <div className="thumb" />
          </div>
        </div>
        <div
          className="glass-row"
          onClick={() => {
            setGlassSheetOpen(false);
            setSettingsOpen(true);
          }}
        >
          <span className="text-[var(--accent)] font-semibold">Full System Calibration</span>
          <span className="text-[14px] text-[var(--meta)]">&rsaquo;</span>
        </div>
      </div>

      {/* Slide-Up Bottom Detail Sheet matching reference */}
      <div className={`detail-sheet ${detailSheetOpen ? 'show' : ''}`} id="detailSheet">
        <div className="relative w-full">
          <div
            className="grab"
            onClick={() => setDetailSheetOpen(false)}
            role="button"
            tabIndex={0}
            aria-label="Close detail sheet"
          />
          <button
            type="button"
            onClick={() => setDetailSheetOpen(false)}
            className="absolute top-0 right-0 p-1 text-[var(--meta)] hover:text-white rounded-full transition-colors text-lg leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <h3>Robotics Olympiad — Regional</h3>
        <p>
          Springfield High · Gym A · Team of 4 · Bring laptop + hardware kit. Mr. Rahman will finalize the team roster tonight at 8:00 PM.
        </p>
        <div className="detail-meta">
          <div>
            <b>6h</b>
            <span>Left</span>
          </div>
          <div>
            <b>12</b>
            <span>Spots</span>
          </div>
          <div>
            <b>$10</b>
            <span>Fee</span>
          </div>
        </div>
        <button
          className="cta"
          id="applyBtn"
          type="button"
          onClick={() => {
            showToast('Application drafted · Check Board');
            setDetailSheetOpen(false);
            if (items[0]) handleCommitItem(items[0]);
          }}
        >
          Apply now &rarr;
        </button>
      </div>
    </>
  );

  const renderNavBar = () => (
    <NavBar
      activeTab={activeTab}
      ribbonTab={ribbonTab}
      ribbonOpen={ribbonOpen}
      onNavClick={handleNavClick}
      onSelectRibbonItem={handleSelectRibbonItem}
      onOpenSettings={() => {
        setGlassSheetOpen(true);
        setRibbonOpen(false);
      }}
      onOpenProfile={() => {
        setProfileModalOpen(true);
        setRibbonOpen(false);
      }}
      profileScore={studentProfile.score}
      isDark={isDark}
    />
  );

  return (
    <div className="min-h-screen bg-[var(--stele-canvas)] text-[var(--stele-text-primary)] relative transition-colors duration-200">
      {/* Top Institutional Bar */}
      <header className="w-full border-b border-[var(--stele-rule)] bg-[var(--stele-surface)] sticky top-0 z-30 select-none shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div className="max-w-4xl mx-auto px-4 h-13 flex items-center justify-between">
          {/* Brand Wordmark & Node Info */}
          <div className="flex items-center gap-2.5">
            <span className="font-extrabold text-[17px] tracking-widest text-[var(--stele-text-primary)]">
              STELE
            </span>
            <div className="h-3.5 w-[1px] bg-[var(--stele-rule)]" />
            <span className="text-[12px] font-medium text-[var(--stele-text-secondary)] hidden sm:inline">
              Springfield Sovereign Node
            </span>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Device View vs Fluid Canvas Toggle */}
            <button
              type="button"
              onClick={() => setIsDeviceFrame(!isDeviceFrame)}
              className="px-2.5 py-1 rounded-[10px] bg-[var(--stele-canvas)] border border-[var(--stele-rule)] text-[11px] font-medium text-[var(--stele-text-secondary)] hover:text-[var(--stele-text-primary)] flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Toggle between Reference Device Frame (390x844) and Responsive Canvas"
            >
              {isDeviceFrame ? <Maximize2 className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
              <span>{isDeviceFrame ? 'Expanded Canvas' : 'Device Frame'}</span>
            </button>

            {/* Offline Cache Status */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--stele-canvas)] border border-[var(--stele-rule)] text-[11px] text-[var(--stele-text-secondary)] font-medium"
              title="Offline-first storage verified."
            >
              <Wifi className="w-3 h-3 text-[var(--stele-completion)]" />
              <span className="hidden xs:inline">Cached</span>
            </div>

            {/* Unconventional Features (i) Button */}
            <button
              id="header-unconventional-btn"
              type="button"
              onClick={() => setUnconventionalWidgetOpen(true)}
              className="px-2 py-1 rounded-[10px] bg-[var(--stele-accent-soft)] hover:opacity-90 border border-[var(--stele-accent)]/30 text-[12px] font-semibold text-[var(--stele-accent)] flex items-center gap-1.5 transition-all"
              title="Unconventional Features & Invariants (PRD & White Paper)"
            >
              <div className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center text-[9.5px] font-bold font-serif italic leading-none">
                i
              </div>
              <span className="hidden md:inline">Invariants</span>
            </button>

            {/* Origin of Stele (PRD & White Paper) */}
            <button
              id="header-origin-btn"
              type="button"
              onClick={() => setOriginModalOpen(true)}
              className="px-2.5 py-1 rounded-[10px] bg-[var(--stele-canvas)] hover:bg-[var(--stele-surface)] border border-[var(--stele-rule)] text-[12px] font-medium text-[var(--stele-text-primary)] flex items-center gap-1.5 transition-all"
              title="Read Origin of Stele (PRD & White Paper)"
            >
              <BookOpen className="w-3.5 h-3.5 text-[var(--stele-accent)]" />
              <span>Origin</span>
            </button>

            {/* Sovereign Ledger Link Button */}
            <button
              id="header-ledger-btn"
              type="button"
              onClick={() => setLedgerOpen(true)}
              className="px-2.5 py-1 rounded-[10px] bg-[var(--stele-canvas)] hover:bg-[var(--stele-surface)] border border-[var(--stele-rule)] text-[12px] font-medium text-[var(--stele-text-primary)] flex items-center gap-1.5 transition-colors"
              title="Inspect Witnessed Portable Ledger"
            >
              <FileText className="w-3.5 h-3.5 text-[var(--stele-accent)]" />
              <span className="hidden sm:inline">Ledger</span>
              <span className="text-[10px] text-[var(--stele-text-muted)] font-mono">
                ({ledgerEntries.length})
              </span>
            </button>

            {/* Profile & Reward Circuit */}
            <button
              id="header-profile-btn"
              type="button"
              onClick={() => setProfileModalOpen(true)}
              className="p-1.5 rounded-[10px] bg-[var(--stele-canvas)] hover:bg-[var(--stele-surface)] border border-[var(--stele-rule)] text-[var(--stele-text-secondary)] hover:text-[var(--stele-text-primary)] transition-colors relative"
              title={`Profile & Rewards (${studentProfile.dailyStreak}d streak · ${studentProfile.score} pts)`}
            >
              <User className="w-3.5 h-3.5 text-[var(--stele-accent)]" />
              {studentProfile.dailyStreak > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#D9A93D]" />
              )}
            </button>

            {/* Settings & Role Calibration */}
            <button
              id="header-settings-btn"
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="p-1.5 rounded-[10px] bg-[var(--stele-canvas)] hover:bg-[var(--stele-surface)] border border-[var(--stele-rule)] text-[var(--stele-text-secondary)] hover:text-[var(--stele-text-primary)] transition-colors"
              title="System Configuration & Role Calibration"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container: Device Shell Mode or Fluid Mode */}
      <div
        className={`w-full ${
          isDeviceFrame
            ? 'py-4 sm:py-7 flex justify-center'
            : 'p-2 sm:p-4 lg:p-6 flex justify-center'
        } relative`}
      >
        {/* Outer ambient backdrop glow from reference */}
        <div className="outer-ambient-glow" />

        {isDeviceFrame ? (
          <div className="device" id="deviceContainer">
            {/* Ambient orbs & grain background matching reference */}
            <div className="device-bg">
              <div className="orb1" />
              <div className="orb2" />
              <div className="grain" />
            </div>

            {/* Quick Toast Notification */}
            <div className={`toast ${toastMessage ? 'show' : ''}`} id="toast">
              {toastMessage}
            </div>

            {/* Dynamic Island / Top Notch */}
            <div
              className={`dynamic-notch ${notchPulsing ? 'pulse-active' : ''}`}
              id="dynamicNotch"
            >
              <div className="lens" />
              <div className="indicator" id="notchIndicator" />
            </div>

            {/* Status Bar */}
            <div className="status-bar">
              <span className="status-time" id="clock">{currentTime}</span>
              <div className="status-icons">
                <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
                  <rect x="0" y="3" width="3" height="9" rx="0.5" />
                  <rect x="4.5" y="2" width="3" height="10" rx="0.5" />
                  <rect x="9" y="0.5" width="3" height="11.5" rx="0.5" />
                  <rect x="13.5" y="0" width="3" height="12" rx="0.5" opacity="0.35" />
                </svg>
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                  <path d="M1 4.5C2.8 2.7 5.2 1.6 8 1.6S13.2 2.7 15 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  <path d="M3.2 6.8A6.2 6.2 0 018 5.2c1.9 0 3.6.7 4.8 1.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  <path d="M5.5 9a3.5 3.5 0 015 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  <circle cx="8" cy="11" r="1" fill="currentColor" />
                </svg>
                <svg width="27" height="13" viewBox="0 0 27 13">
                  <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" stroke="currentColor" strokeOpacity="0.35" fill="none" />
                  <rect x="2" y="2" width="17" height="9" rx="2" fill="currentColor" />
                  <rect x="23.5" y="4" width="3" height="5" rx="1" fill="currentColor" fillOpacity="0.4" />
                </svg>
              </div>
            </div>

            {/* Active View */}
            <main className="w-full flex-1 min-h-0 overflow-hidden flex flex-col relative">
              {renderActiveView()}
            </main>

            {/* Dismiss backdrop for sheets if active */}
            {(glassSheetOpen || detailSheetOpen || ribbonOpen) && (
              <div
                className="absolute inset-0 z-35 bg-black/50 backdrop-blur-[2px] transition-opacity cursor-pointer"
                onClick={() => {
                  setGlassSheetOpen(false);
                  setDetailSheetOpen(false);
                  setRibbonOpen(false);
                }}
                aria-label="Dismiss sheet"
              />
            )}

            {renderSheets()}

            {/* Floating Clay Navigation Bar with 2-Tap Unrolling Ribbon */}
            {renderNavBar()}

            {/* iPhone Home Indicator Bar */}
            <div className="home-bar" />
          </div>
        ) : (
          <div className="device-expanded" id="deviceContainer">
            {/* Ambient orbs & grain background matching reference */}
            <div className="device-bg">
              <div className="orb1" />
              <div className="orb2" />
              <div className="grain" />
            </div>

            {/* Quick Toast Notification */}
            <div className={`toast ${toastMessage ? 'show' : ''}`} id="toast">
              {toastMessage}
            </div>

            {/* Expanded Computer Screen Layout: Top-Left Mounted Navigation Bar + Expanded Content */}
            <div className="w-full flex-1 flex flex-row items-stretch relative z-10 min-h-0 h-full overflow-hidden">
              {/* Left Rail: Top-Left Vertical Navigation & Detached Bottom-Left Pill */}
              <div className="shrink-0 h-full flex flex-col z-40 bg-transparent">
                <DesktopSidebar
                  activeTab={activeTab}
                  ribbonTab={ribbonTab}
                  ribbonOpen={ribbonOpen}
                  onNavClick={handleNavClick}
                  onSelectRibbonItem={handleSelectRibbonItem}
                  onOpenSettings={() => {
                    setSettingsOpen(true);
                    setRibbonOpen(false);
                  }}
                  onOpenProfile={() => {
                    setProfileModalOpen(true);
                    setRibbonOpen(false);
                  }}
                  profileScore={studentProfile.score}
                  dailyStreak={studentProfile.dailyStreak}
                  currentRole={currentRole}
                  isDark={isDark}
                  onSwitchToDeviceFrame={() => setIsDeviceFrame(true)}
                />
              </div>

              {/* Expanded Main Workspace: Fully expands to fit window width */}
              <main className="flex-1 min-w-0 h-full flex flex-col relative overflow-hidden bg-transparent">
                {renderActiveView()}
              </main>
            </div>

            {/* Dismiss backdrop for sheets if active */}
            {(glassSheetOpen || detailSheetOpen) && (
              <div
                className="absolute inset-0 z-35 bg-black/50 backdrop-blur-[2px] transition-opacity cursor-pointer"
                onClick={() => {
                  setGlassSheetOpen(false);
                  setDetailSheetOpen(false);
                }}
                aria-label="Dismiss sheet"
              />
            )}

            {renderSheets()}
          </div>
        )}
      </div>

      {/* Glass Modals and Overlays */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        currentRole={currentRole}
        onStar={handleStarItem}
        onCommit={handleCommitItem}
        isStarred={commitments.some((c) => c.itemId === selectedItem?.id && c.status === 'watched')}
        isCommitted={commitments.some((c) => c.itemId === selectedItem?.id && c.status === 'active')}
        isDark={isDark}
      />

      {/* Settings & Role Calibration Sheet */}
      <SettingsSheet
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        isDark={isDark}
        onToggleDarkMode={() => setIsDark(!isDark)}
        currentPalette={currentPalette}
        onChangePalette={(p) => setCurrentPalette(p)}
        currentRole={currentRole}
        onChangeRole={(r) => {
          setCurrentRole(r);
        }}
        currentInstance={currentInstance}
        onChangeInstance={(inst) => setCurrentInstance(inst)}
        performanceTier={performanceTier}
        onTogglePerformanceTier={() =>
          setPerformanceTier(performanceTier === 'full' ? 'reduced' : 'full')
        }
        onOpenLedgerExport={() => setLedgerOpen(true)}
        onOpenOriginModal={() => setOriginModalOpen(true)}
        profile={studentProfile}
        ledgerEntries={ledgerEntries}
        onOpenLedger={() => setLedgerOpen(true)}
        onClaimDailyStreak={handleClaimDailyStreak}
        canClaimStreak={true}
        onSimulateActionReward={handleSimulateActionReward}
      />

      {/* Your Profile, Sovereign Ledger & Reward Progress Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        profile={studentProfile}
        currentRole={currentRole}
        ledgerEntries={ledgerEntries}
        onOpenLedger={() => {
          setProfileModalOpen(false);
          setLedgerOpen(true);
        }}
        onClaimDailyStreak={handleClaimDailyStreak}
        canClaimStreak={true}
        onSimulateActionReward={handleSimulateActionReward}
        onOpenPerksBazaar={() => setCampusPerksModalOpen(true)}
        isDark={isDark}
      />

      {/* Campus Perks Bazaar Modal (In-Campus Physical Accessible Rewards) */}
      <CampusPerksModal
        isOpen={campusPerksModalOpen}
        onClose={() => setCampusPerksModalOpen(false)}
        perks={perks}
        profile={studentProfile}
        onRedeemPerk={handleRedeemPerk}
        onMarkPerkUsed={handleMarkPerkUsed}
        isDark={isDark}
      />

      {/* Origin of Stele (PRD & White Paper Pristine Markdown Viewer) */}
      <OriginOfSteleModal
        isOpen={originModalOpen}
        onClose={() => setOriginModalOpen(false)}
        isDark={isDark}
      />

      {/* Unconventional Features Compact Widget (PRD & White Paper v2.0) */}
      <UnconventionalFeaturesWidget
        isOpen={unconventionalWidgetOpen}
        onClose={() => setUnconventionalWidgetOpen(false)}
        onOpenFullOrigin={() => {
          setUnconventionalWidgetOpen(false);
          setOriginModalOpen(true);
        }}
        isDark={isDark}
      />

      {/* Sovereign Ledger Modal */}
      <LedgerModal
        entries={ledgerEntries}
        isOpen={ledgerOpen}
        onClose={() => setLedgerOpen(false)}
        studentName="Shadman Shakib"
        isDark={isDark}
      />

      {/* 2-Minute Skippable Knowledge Capture Prompt */}
      <KnowledgeCaptureModal
        commitment={pendingKnowledgeCommitment}
        isOpen={pendingKnowledgeCommitment !== null}
        onSave={handleSaveKnowledge}
        onSkip={handleSkipKnowledge}
        isDark={isDark}
      />

      {/* Celebration Overlay with Exuberant Archie Mascot & Confetti Sprinkles */}
      <CelebrationOverlay
        isOpen={celebrationData !== null}
        onClose={() => setCelebrationData(null)}
        celebrationData={celebrationData}
        isDark={isDark}
        onOpenLedger={() => {
          setCelebrationData(null);
          setLedgerOpen(true);
        }}
        onOpenRetrospective={() => {
          if (celebrationData) {
            const foundComm = commitments.find((c) => c.title === celebrationData.title);
            if (foundComm) {
              setPendingKnowledgeCommitment(foundComm);
            }
          }
          setCelebrationData(null);
        }}
      />

      {/* Dedicated Unified In-App Calendar (Academic Almanac + Task/Commitment Deadlines + Opportunity Deadlines) */}
      <UnifiedCalendarModal
        isOpen={unifiedCalendarOpen}
        onClose={() => setUnifiedCalendarOpen(false)}
        academicEvents={MOCK_ACADEMIC_CALENDAR}
        commitments={commitments}
        opportunities={items}
        messages={dispatchMessages}
        calendarSync={calendarSync}
        onToggleCalendarSync={(val) => setCalendarSync(val)}
        onCommitOpportunity={handleCommitItem}
        onCompleteCommitment={handleCompleteCommitment}
        onShowToast={showToast}
        isDark={isDark}
        isDeviceFrame={isDeviceFrame}
      />
    </div>
  );
}
