import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  MessageSquare,
  ShieldCheck,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  BellOff,
  User,
  Lock,
  ShieldAlert,
  Search,
  Check,
  X,
  Paperclip,
  Smile,
  MoreVertical,
  Bot,
  Building2,
  Users,
  Copy,
  Phone,
  Video,
  ChevronDown,
  Mic,
  Camera,
  FileText,
  Radio,
  CircleDashed,
  Archive,
  Settings,
  CornerUpLeft,
  Image as ImageIcon,
  ArrowLeft,
} from 'lucide-react';
import {
  CommunicationChannel,
  DispatchMessage,
  Role,
} from '../types';
import { INSTITUTIONAL_KNOWLEDGE_BASE } from '../data/mockData';

interface CampusDispatchesHubProps {
  channels: CommunicationChannel[];
  messages: DispatchMessage[];
  currentRole: Role;
  studentName: string;
  onSendMessage: (channelId: string, content: string) => void;
  onConvertToActionableTask: (task: {
    title: string;
    deadline: string;
    points: number;
    channelName: string;
  }) => void;
  isDark: boolean;
  initialChannelId?: string;
  openAiDigestDirectly?: boolean;
}

export const CampusDispatchesHub: React.FC<CampusDispatchesHubProps> = ({
  channels,
  messages,
  currentRole,
  studentName,
  onSendMessage,
  onConvertToActionableTask,
  isDark,
  initialChannelId,
  openAiDigestDirectly = false,
}) => {
  // Navigation rail active tab
  const [navTab, setNavTab] = useState<'chats' | 'calls' | 'status' | 'channels' | 'communities' | 'meta_ai' | 'settings'>('chats');

  // Filter chips (matching reference WhatsApp UI)
  const [filterChip, setFilterChip] = useState<'all' | 'unread' | 'groups' | 'me' | 'official' | 'commons'>('all');
  
  // Selected channel
  const [selectedChannelId, setSelectedChannelId] = useState<string>(
    initialChannelId || channels[0]?.id || 'ch-cultured-memers'
  );
  
  const [searchQuery, setSearchQuery] = useState('');
  const [draftMessage, setDraftMessage] = useState('');
  const [showNotificationBanner, setShowNotificationBanner] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);

  // AI & Anti-Surveillance state
  const [aiExtracting, setAiExtracting] = useState<string | null>(null);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [knowledgeResolverOpen, setKnowledgeResolverOpen] = useState(false);
  const [knowledgeSearch, setKnowledgeSearch] = useState('');
  const [aiDigestModalOpen, setAiDigestModalOpen] = useState(openAiDigestDirectly);
  const [copiedDigest, setCopiedDigest] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolledUp, setIsScrolledUp] = useState(false);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast((cur) => (cur === msg ? null : cur)), 2500);
  };

  // Filter channels based on WhatsApp chips and search query
  const filteredChannels = useMemo(() => {
    return channels.filter((ch) => {
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = ch.name.toLowerCase().includes(q);
        const matchDesc = ch.description?.toLowerCase().includes(q);
        const matchPeer = ch.dmPeerName?.toLowerCase().includes(q);
        const matchLast = ch.lastMessage?.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchPeer && !matchLast) return false;
      }

      // Filter chips
      if (filterChip === 'unread') return ch.unreadCount > 0;
      if (filterChip === 'groups') return ch.category === 'club' || ch.category === 'section' || ch.participantCount > 2;
      if (filterChip === 'official') return ch.category === 'authority' || ch.category === 'faculty';
      if (filterChip === 'commons') return ch.privacySphere === 'student_commons';
      if (filterChip === 'me') return ch.isDirectMessage || ch.category === 'dm';
      return true;
    });
  }, [channels, filterChip, searchQuery]);

  const activeChannel =
    channels.find((c) => c.id === selectedChannelId) || filteredChannels[0] || channels[0];
  
  const channelMessages = messages.filter((m) => m.channelId === activeChannel?.id);

  // Auto scroll to bottom when messages update - container-scoped to prevent view lock
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [channelMessages.length, selectedChannelId]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    setIsScrolledUp(scrollHeight - scrollTop - clientHeight > 180);
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  // Anti-Surveillance Gate
  const isAuthorityOrTeacher = currentRole === 'authority' || currentRole === 'teacher';
  const isBlockedBySurveillanceShield =
    (activeChannel?.privacySphere === 'student_commons' ||
      activeChannel?.privacySphere === 'peer_encrypted') &&
    !activeChannel.allowedRoles.includes(currentRole);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftMessage.trim() || !activeChannel || isBlockedBySurveillanceShield) return;
    onSendMessage(activeChannel.id, draftMessage.trim());
    setDraftMessage('');
    setShowEmojiPicker(false);
    setShowAttachMenu(false);
  };

  // AI Task Extractor from peer bubbles
  const handleAiExtract = (msg: DispatchMessage) => {
    setAiExtracting(msg.id);
    setTimeout(() => {
      let extractedTitle = 'Complete Discussion Action Item';
      let extractedDeadline = 'Tomorrow, 5:00 PM';
      let points = 35;

      const content = msg.content.toLowerCase();
      if (content.includes('laser cutter') || content.includes('bay 3')) {
        extractedTitle = 'Review Bay 3 Laser Cutter Logic Schematic';
        extractedDeadline = 'Tomorrow, 5:00 PM';
        points = 60;
      } else if (content.includes('thermodynamics') || content.includes('tray') || content.includes('204')) {
        extractedTitle = 'Submit Thermodynamics Worksheet into Tray 204';
        extractedDeadline = 'Today, 2:00 PM';
        points = 40;
      } else if (content.includes('calculator') || content.includes('physics')) {
        extractedTitle = 'Bring Non-Programmable Calculator for Physics Assessment';
        extractedDeadline = 'Today, 3:30 PM';
        points = 35;
      }

      onConvertToActionableTask({
        title: msg.actionableTask?.title || extractedTitle,
        deadline: msg.actionableTask?.deadline || extractedDeadline,
        points: msg.actionableTask?.points || points,
        channelName: activeChannel.name,
      });

      setAiExtracting(null);
      showToast(`Action Item Extracted: "${msg.actionableTask?.title || extractedTitle}" (+${msg.actionableTask?.points || points} pts)`);
    }, 600);
  };

  // AI Channel Digest Content
  const channelDigest = useMemo(() => {
    const isOfficial = activeChannel?.category === 'authority' || activeChannel?.category === 'faculty';
    const isCommons = activeChannel?.category === 'section' || activeChannel?.id === 'ch-cultured-memers';

    if (isOfficial) {
      return {
        title: `AI Digest: ${activeChannel.name}`,
        bullets: [
          'Fabrication Annex Bay 3 remains open extended hours this Friday for line-follower prototypes. Steward supervision is mandatory.',
          'Physical Perks Bazaar integration live: students with 120+ consistency points can claim Foundry Café beverage vouchers immediately.',
          'Physics Olympiad calibration clinic confirmed for 3:30 PM in Room 302; non-programmable scientific calculators required.',
        ],
        tasks: [
          { title: 'Inspect Extended Lab Protocol in Bay 3', deadline: 'Today, 6:00 PM', points: 15 },
          { title: 'Attend Physics Lab Calibration Clinic (Room 302)', deadline: 'Today, 3:30 PM', points: 35 },
        ],
      };
    }

    if (isCommons) {
      return {
        title: `AI Digest: ${activeChannel.name}`,
        bullets: [
          'Thermodynamics Problem Set: Nadia confirmed step 2 requires converting Celsius to Kelvin to avoid violating the 2nd law of thermodynamics.',
          'Physical submission cutoff: Hard-copy worksheets must be placed into homework tray outside Room 204 before 2:00 PM today.',
          'Hardware team line-follower chassis design completed; pending laser cutter slot in Bay 3.',
        ],
        tasks: [
          { title: 'Submit Thermodynamics Problem Set into Tray 204', deadline: 'Today, 2:00 PM', points: 40 },
        ],
      };
    }

    return {
      title: `AI Digest: ${activeChannel.name}`,
      bullets: [
        'Active group collaboration in progress. Key points and file references have been indexed to local cache.',
        'Zero surveillance telemetry active: discussions are end-to-end encrypted with zero administrative oversight.',
      ],
      tasks: [],
    };
  }, [activeChannel]);

  const handleCopyDigest = () => {
    const text = [
      channelDigest.title,
      '---',
      ...channelDigest.bullets.map((b) => `• ${b}`),
      ...(channelDigest.tasks.length > 0
        ? ['\nActionable Deadlines:', ...channelDigest.tasks.map((t) => `• [${t.deadline}] ${t.title} (+${t.points} pts)`)]
        : []),
    ].join('\n');

    navigator.clipboard?.writeText(text);
    setCopiedDigest(true);
    showToast('AI Channel Digest copied to clipboard');
    setTimeout(() => setCopiedDigest(false), 2000);
  };

  const getSenderColor = (name: string, role?: Role) => {
    if (name.includes('Yeasar')) return 'text-[var(--accent)]';
    if (name.includes('chinchinman')) return 'text-[#f59e0b]';
    if (name.includes('MVruf')) return 'text-[#06b6d4]';
    if (name.includes('Nadia')) return 'text-[#ec4899]';
    if (name.includes('Tariq')) return 'text-[#8b5cf6]';
    if (role === 'authority') return 'text-[#38bdf8]';
    if (role === 'teacher') return 'text-[#fbbf24]';
    return 'text-[var(--accent)]';
  };

  const getChannelInitials = (ch: CommunicationChannel) => {
    if (ch.isDirectMessage && ch.dmPeerName) {
      return ch.dmPeerName.slice(0, 2).toUpperCase();
    }
    return ch.name.slice(0, 2).toUpperCase();
  };

  const QUICK_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏', '🔥', '🍜', '🎓', '💻'];

  return (
    <div className="whatsapp-desktop-root flex w-full flex-1 min-h-0 h-full rounded-[14px] sm:rounded-[20px] overflow-hidden shadow-2xl border border-[var(--rule)] bg-[var(--tile)] text-[var(--text)] font-sans antialiased">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-[var(--tile-active)] text-[var(--text)] border border-[var(--accent)]/40 text-[13px] font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-[var(--accent)]" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* ================= COLUMN 1: LEFT VERTICAL ICON RAIL (~60px) ================= */}
      <div className="hidden md:flex flex-col w-[60px] bg-[var(--tile)] border-r border-[var(--rule)] py-3 items-center justify-between shrink-0 z-20">
        {/* Top Rail Navigation Icons */}
        <div className="flex flex-col items-center gap-3 w-full">
          {/* Chats Bubble with Red Badge */}
          <button
            type="button"
            onClick={() => setNavTab('chats')}
            className={`relative p-2.5 rounded-full transition-all cursor-pointer ${
              navTab === 'chats' ? 'bg-[var(--tile-active)] text-[var(--accent)]' : 'text-[var(--text-sub)] hover:text-[var(--text)] hover:bg-[var(--tile-active)]'
            }`}
            title="Chats"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 px-1.5 py-0.2 rounded-full bg-[#EF4444] text-white text-[10px] font-extrabold shadow-xs">
              4
            </span>
          </button>

          {/* Calls with Red Badge */}
          <button
            type="button"
            onClick={() => setNavTab('calls')}
            className={`relative p-2.5 rounded-full transition-all cursor-pointer ${
              navTab === 'calls' ? 'bg-[var(--tile-active)] text-[var(--accent)]' : 'text-[var(--text-sub)] hover:text-[var(--text)] hover:bg-[var(--tile-active)]'
            }`}
            title="Calls"
          >
            <Phone className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 px-1.5 py-0.2 rounded-full bg-[#EF4444] text-white text-[10px] font-extrabold shadow-xs">
              9
            </span>
          </button>

          {/* Status Updates */}
          <button
            type="button"
            onClick={() => setNavTab('status')}
            className={`relative p-2.5 rounded-full transition-all cursor-pointer ${
              navTab === 'status' ? 'bg-[var(--tile-active)] text-[var(--accent)]' : 'text-[var(--text-sub)] hover:text-[var(--text)] hover:bg-[var(--tile-active)]'
            }`}
            title="Status"
          >
            <CircleDashed className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--accent)] ring-2 ring-[var(--tile)]" />
          </button>

          {/* Channels / Broadcasts */}
          <button
            type="button"
            onClick={() => setNavTab('channels')}
            className={`p-2.5 rounded-full transition-all cursor-pointer ${
              navTab === 'channels' ? 'bg-[var(--tile-active)] text-[var(--accent)]' : 'text-[var(--text-sub)] hover:text-[var(--text)] hover:bg-[var(--tile-active)]'
            }`}
            title="Channels"
          >
            <Radio className="w-5 h-5" />
          </button>

          {/* Communities */}
          <button
            type="button"
            onClick={() => setNavTab('communities')}
            className={`p-2.5 rounded-full transition-all cursor-pointer ${
              navTab === 'communities' ? 'bg-[var(--tile-active)] text-[var(--accent)]' : 'text-[var(--text-sub)] hover:text-[var(--text)] hover:bg-[var(--tile-active)]'
            }`}
            title="Communities"
          >
            <Users className="w-5 h-5" />
          </button>

          {/* Meta AI / Sovereign AI Sparkle Ring */}
          <button
            type="button"
            onClick={() => setAiDigestModalOpen(true)}
            className="p-2.5 rounded-full transition-all cursor-pointer text-[var(--text-sub)] hover:text-[var(--text)] hover:bg-[var(--tile-active)] group"
            title="Sovereign AI Digest"
          >
            <div className="w-5 h-5 rounded-full border-2 border-dashed border-[var(--accent)] group-hover:rotate-45 transition-transform flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-[var(--accent)]" />
            </div>
          </button>
        </div>

        {/* Bottom Rail Icons */}
        <div className="flex flex-col items-center gap-3 w-full">
          {/* Media / Starred */}
          <button
            type="button"
            onClick={() => showToast('Starred media & archives opened')}
            className="p-2.5 rounded-full text-[var(--text-sub)] hover:text-[var(--text)] hover:bg-[var(--tile-active)] transition-colors cursor-pointer"
            title="Media & Archives"
          >
            <Archive className="w-5 h-5" />
          </button>

          {/* Settings */}
          <button
            type="button"
            onClick={() => setPrivacyModalOpen(true)}
            className="p-2.5 rounded-full text-[var(--text-sub)] hover:text-[var(--text)] hover:bg-[var(--tile-active)] transition-colors cursor-pointer"
            title="Settings & Privacy"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* User Profile Avatar with Online Dot */}
          <div className="relative cursor-pointer" onClick={() => setPrivacyModalOpen(true)}>
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"
              alt={studentName}
              className="w-8 h-8 rounded-full object-cover border border-[var(--rule)]"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[var(--accent)] ring-2 ring-[var(--tile)]" />
          </div>
        </div>
      </div>

      {/* ================= COLUMN 2: CHAT LIST PANEL (~380px) ================= */}
      <div className={`w-full md:w-[360px] lg:w-[400px] flex flex-col bg-[var(--tile)] border-r border-[var(--rule)] shrink-0 min-h-0 h-full overflow-hidden ${mobileChatOpen ? 'hidden md:flex' : 'flex'}`}>
        {/* Header: Title + Action Icons */}
        <div className="px-4 py-3 flex items-center justify-between bg-[var(--tile)]">
          <h2 className="text-[20px] font-bold text-[var(--text)] tracking-tight flex items-center gap-2">
            <span>WhatsApp</span>
          </h2>

          <div className="flex items-center gap-1">
            {/* Options Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMenuDropdown(!showMenuDropdown)}
                className="p-2 rounded-full text-[var(--text-sub)] hover:text-[var(--text)] hover:bg-[var(--tile-active)] transition-colors cursor-pointer"
                title="Menu"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {showMenuDropdown && (
                <div className="absolute right-0 top-10 w-48 rounded-[12px] bg-[var(--tile-active)] border border-[var(--rule)] shadow-2xl py-1.5 z-50 text-[13.5px]">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenuDropdown(false);
                      setAiDigestModalOpen(true);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-[var(--track)] flex items-center gap-2 text-[var(--text)]"
                  >
                    <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                    <span>AI Quick Digest</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenuDropdown(false);
                      setKnowledgeResolverOpen(true);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-[var(--track)] flex items-center gap-2 text-[var(--text)]"
                  >
                    <Bot className="w-4 h-4 text-[#38bdf8]" />
                    <span>Campus Bot</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenuDropdown(false);
                      setPrivacyModalOpen(true);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-[var(--track)] flex items-center gap-2 text-[var(--text)]"
                  >
                    <ShieldCheck className="w-4 h-4 text-[var(--accent)]" />
                    <span>Privacy Charter</span>
                  </button>
                </div>
              )}
            </div>

            {/* Circular Stele Accent New Chat Button (+) */}
            <button
              type="button"
              onClick={() => showToast('New dispatch conversation started')}
              className="w-8 h-8 rounded-full bg-[var(--accent)] hover:bg-[#E8684D] text-white flex items-center justify-center font-bold transition-transform active:scale-95 cursor-pointer shadow-md"
              title="New Chat"
            >
              <span className="text-[20px] leading-none mb-0.5">+</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-3 pb-2 bg-[var(--tile)]">
          <div className="relative flex items-center bg-[var(--track)] rounded-[10px] px-3 py-1.5 border border-[var(--rule)] focus-within:border-[var(--accent)] transition-colors">
            <Search className="w-4 h-4 text-[var(--meta)] shrink-0 mr-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search or start a new chat"
              className="w-full bg-transparent text-[13px] text-[var(--text)] placeholder-[var(--meta)] outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[var(--meta)] hover:text-[var(--text)]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Chips (Horizontally Scrollable) */}
        <div className="px-3 pb-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-[var(--tile)]">
          {[
            { id: 'all', label: 'All', color: 'var(--accent)' },
            { id: 'unread', label: 'Unread', color: '#F59E0B', textColor: '#0F172A' },
            { id: 'groups', label: 'Groups', color: '#0284C7' },
            { id: 'me', label: 'Me', color: '#8B5CF6' },
            { id: 'official', label: 'Official', color: '#10B981' },
            { id: 'commons', label: 'Commons', color: '#F59E0B', textColor: '#0F172A' },
          ].map((chip) => {
            const isSelected = filterChip === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setFilterChip(chip.id as any)}
                className={`px-3 py-1 rounded-full text-[12px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'shadow-xs border'
                    : 'bg-[var(--track)] text-[var(--text-sub)] hover:text-[var(--text)] hover:bg-[var(--tile-active)] border border-[var(--rule)]'
                }`}
                style={
                  isSelected
                    ? {
                        backgroundColor: chip.color,
                        borderColor: chip.color,
                        color: chip.textColor || '#FFFFFF',
                      }
                    : undefined
                }
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Dismissible Notification Banner */}
        {showNotificationBanner && (
          <div className="px-3 py-2.5 mx-3 mb-2 rounded-[10px] bg-[var(--tile-active)] border border-[var(--rule)] flex items-center justify-between gap-2.5 text-[12.5px]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center shrink-0">
                <BellOff className="w-4 h-4" />
              </div>
              <div className="truncate text-[var(--text)]">
                <span>Message and call notifications are off. </span>
                <button
                  type="button"
                  onClick={() => {
                    showToast('Notifications enabled for sovereign dispatches');
                    setShowNotificationBanner(false);
                  }}
                  className="text-[var(--accent)] font-medium hover:underline cursor-pointer"
                >
                  Turn on
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowNotificationBanner(false)}
              className="text-[var(--meta)] hover:text-[var(--text)] shrink-0 p-1 cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Conversation List Scrollable */}
        <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-[var(--rule)]/40">
          {filteredChannels.map((ch) => {
            const isSelected = ch.id === activeChannel?.id;
            const isOfficial = ch.category === 'authority' || ch.category === 'faculty';
            const isGroup = ch.category === 'club' || ch.category === 'section' || ch.participantCount > 2;

            return (
              <div
                key={ch.id}
                onClick={() => {
                  setSelectedChannelId(ch.id);
                  setMobileChatOpen(true);
                }}
                className={`px-3 py-2.5 flex items-center gap-3 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--tile-active)] border-l-3 border-[var(--accent)]'
                    : 'hover:bg-[var(--tile-active)]/70'
                }`}
              >
                {/* Circular Avatar */}
                <div className="relative shrink-0">
                  {ch.avatarUrl ? (
                    <img
                      src={ch.avatarUrl}
                      alt={ch.name}
                      className="w-12 h-12 rounded-full object-cover border border-[var(--rule)]"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[var(--track)] border border-[var(--rule)] text-[var(--text)] flex items-center justify-center font-bold text-[14px]">
                      {isOfficial ? <Building2 className="w-5 h-5 text-[var(--accent)]" /> : getChannelInitials(ch)}
                    </div>
                  )}

                  {/* Group / Official Sub-badge */}
                  {isOfficial && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-[var(--tile)]">
                      ✓
                    </span>
                  )}
                  {isGroup && !isOfficial && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--tile-active)] text-[var(--text-sub)] flex items-center justify-center text-[10px] ring-2 ring-[var(--tile)]">
                      <Users className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                {/* Chat Information */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-[14px] font-semibold text-[var(--text)] truncate">
                      {ch.isDirectMessage ? ch.dmPeerName : ch.name}
                    </span>
                    <span className="text-[11px] text-[var(--meta)] font-mono shrink-0">
                      {ch.lastMessageTime || (isOfficial ? '8:15 AM' : '12:41 AM')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 min-w-0 text-[12.5px] text-[var(--text-sub)] truncate">
                      {ch.lastMessageStatus === 'read' && (
                        <span className="text-[#38BDF8] text-[11px] font-bold shrink-0">✓✓</span>
                      )}
                      {ch.hasMedia && <Camera className="w-3.5 h-3.5 shrink-0 text-[var(--text-sub)]" />}
                      <span className="truncate">
                        {ch.lastMessage ||
                          (isOfficial
                            ? 'Official Circular: Fabrication Annex Bay 3 extended...'
                            : 'Another day another plate of vomit but with noodles today')}
                      </span>
                    </div>

                    {ch.unreadCount > 0 && !isSelected && (
                      <span className="px-1.5 py-0.2 min-w-[18px] text-center rounded-full bg-[#EF4444] text-white text-[11px] font-extrabold shrink-0 shadow-xs">
                        {ch.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredChannels.length === 0 && (
            <div className="p-8 text-center text-[13px] text-[var(--meta)]">
              No chats match your filter.
            </div>
          )}
        </div>

        {/* Bottom Signature End-to-End Encryption Banner */}
        <div className="px-4 py-2 border-t border-[var(--rule)] bg-[var(--tile)] flex items-center justify-center gap-1.5 text-[11px] text-[var(--meta)]">
          <Lock className="w-3 h-3 text-[var(--meta)]" />
          <span>
            Your personal messages are{' '}
            <span className="text-[var(--accent)] font-medium">end-to-end encrypted</span>
          </span>
        </div>
      </div>

      {/* ================= COLUMN 3: RIGHT ACTIVE CHAT CONVERSATION PANE ================= */}
      <div className={`flex-1 flex flex-col bg-[var(--bg)] relative min-w-0 min-h-0 h-full overflow-hidden ${!mobileChatOpen ? 'hidden md:flex' : 'flex'}`}>
        {/* Chat Header */}
        <div className="px-3 sm:px-4 py-2.5 bg-[var(--tile)] border-b border-[var(--rule)] flex items-center justify-between gap-2 sm:gap-3 shrink-0 z-10 shadow-xs">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Mobile Back Button */}
            <button
              type="button"
              onClick={() => setMobileChatOpen(false)}
              className="md:hidden p-1.5 -ml-1 text-[var(--text-sub)] hover:text-[var(--text)] rounded-full hover:bg-[var(--tile-active)] shrink-0 cursor-pointer"
              title="Back to Channels"
            >
              <ArrowLeft className="w-5 h-5 text-[var(--accent)]" />
            </button>

            {/* Header Avatar */}
            {activeChannel.avatarUrl ? (
              <img
                src={activeChannel.avatarUrl}
                alt={activeChannel.name}
                className="w-10 h-10 rounded-full object-cover border border-[var(--rule)] shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[var(--track)] border border-[var(--rule)] text-[var(--text)] flex items-center justify-center font-bold text-[13px] shrink-0">
                {activeChannel.category === 'authority' ? (
                  <Building2 className="w-5 h-5 text-[var(--accent)]" />
                ) : (
                  getChannelInitials(activeChannel)
                )}
              </div>
            )}

            <div className="min-w-0">
              <h3 className="text-[15px] font-bold text-[var(--text)] leading-tight truncate">
                {activeChannel.isDirectMessage ? activeChannel.dmPeerName : activeChannel.name}
              </h3>
              <p className="text-[11.5px] text-[var(--text-sub)] truncate mt-0.5">
                {activeChannel.participantsSnippet ||
                  (activeChannel.category === 'authority'
                    ? '1,420 subscribers · Official verified decrees'
                    : '+880 1894-634119, +880 1894-634220, +880 1976-282828, You')}
              </p>
            </div>
          </div>

          {/* Right Action Icons: Video Call, Search, AI Quick Digest, Options */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => showToast('Simulating secure peer video connection...')}
              className="p-2 rounded-full text-[var(--text-sub)] hover:text-[var(--text)] hover:bg-[var(--tile-active)] transition-colors cursor-pointer flex items-center gap-0.5"
              title="Video Call"
            >
              <Video className="w-5 h-5" />
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            <button
              type="button"
              onClick={() => showToast('Search inside active conversation')}
              className="p-2 rounded-full text-[var(--text-sub)] hover:text-[var(--text)] hover:bg-[var(--tile-active)] transition-colors cursor-pointer"
              title="Search in chat"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* AI Digest Button */}
            <button
              type="button"
              onClick={() => setAiDigestModalOpen(true)}
              className="px-3 py-1 rounded-[10px] bg-[var(--accent)] hover:bg-[#E8684D] text-white text-[12px] font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
              title="AI Digest of announcements and actionable tasks"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">AI Digest</span>
            </button>

            <button
              type="button"
              onClick={() => setPrivacyModalOpen(true)}
              className="p-2 rounded-full text-[var(--text-sub)] hover:text-[var(--text)] hover:bg-[var(--tile-active)] transition-colors cursor-pointer"
              title="Inspect Privacy Charter"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Wallpaper Background */}
        <div
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 relative no-scrollbar"
          style={{
            backgroundColor: 'var(--bg)',
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.025) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        >
          {/* Centered Date Pill (Matching Screenshot "Yesterday", "Today") */}
          <div className="flex justify-center my-2">
            <span className="px-3.5 py-1 rounded-lg bg-[var(--tile-active)] border border-[var(--rule)] text-[11px] font-semibold text-[var(--text-sub)] shadow-sm uppercase tracking-wider">
              Yesterday
            </span>
          </div>

          {/* Blocked by Anti-Surveillance Gate Check */}
          {isBlockedBySurveillanceShield ? (
            <div className="p-8 rounded-[20px] bg-[var(--tile)] border border-[var(--accent)]/40 text-center max-w-md mx-auto my-12 shadow-2xl">
              <ShieldAlert className="w-10 h-10 text-[var(--accent)] mx-auto mb-2" />
              <h4 className="text-[16px] font-bold text-[var(--text)]">
                Zero-Surveillance Shield Active
              </h4>
              <p className="text-[12.5px] text-[var(--text-sub)] mt-1.5 leading-relaxed">
                Under the Stele Campus Charter, informal student commons and peer dispatches are strictly shielded from administrative, teacher, or authority surveillance.
              </p>
            </div>
          ) : (
            <>
              {channelMessages.map((msg) => {
                const isMe = msg.senderName === studentName || msg.senderRole === 'aspirant';
                const isOfficial = msg.isOfficial || activeChannel.category === 'authority';

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 group ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* Peer Avatar on Left for Group Chats */}
                    {!isMe && (
                      <img
                        src={
                          msg.senderAvatar ||
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
                        }
                        alt={msg.senderName}
                        className="w-7 h-7 rounded-full object-cover border border-[var(--rule)] shrink-0 mt-0.5 shadow-xs"
                      />
                    )}

                    <div className="flex flex-col max-w-[85%] sm:max-w-[70%]">
                      {/* Chat Bubble (Harmonized with Stele) */}
                      <div
                        className={`relative rounded-[12px] p-2.5 sm:p-3 text-[13.5px] shadow-md transition-all ${
                          isMe
                            ? 'bg-[#2B2321] text-[var(--text)] border border-[var(--accent)]/40 rounded-tr-[2px]'
                            : 'bg-[var(--tile-active)] text-[var(--text)] rounded-tl-[2px] border border-[var(--rule)]'
                        }`}
                      >
                        {/* Group Sender Name with Phone Number */}
                        {!isMe && (
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-[12px] font-bold ${getSenderColor(
                                msg.senderName,
                                msg.senderRole
                              )}`}
                            >
                              ~ {msg.senderName}
                            </span>
                            <span className="text-[10px] text-[var(--meta)] font-mono">
                              {msg.senderPhone || '+880 1711-711758'}
                            </span>
                          </div>
                        )}

                        {/* Quoted Message (Replied-to box) */}
                        {msg.replyTo && (
                          <div className="mb-2 p-2 rounded-[8px] bg-[var(--tile)] border-l-4 border-l-[var(--accent)] text-[11.5px] leading-snug">
                            <span className="font-bold text-[var(--accent)] block">
                              ~ {msg.replyTo.senderName}
                            </span>
                            <span className="text-[var(--text-sub)] line-clamp-1">{msg.replyTo.text}</span>
                          </div>
                        )}

                        {/* Media Attachment (Photo of noodles bowl / meme) */}
                        {msg.mediaUrl && (
                          <div className="mb-2 rounded-[10px] overflow-hidden border border-[var(--rule)] relative bg-black/40">
                            <img
                              src={msg.mediaUrl}
                              alt={msg.mediaCaption || 'Media attachment'}
                              className="w-full max-h-72 object-cover hover:scale-102 transition-transform cursor-pointer"
                              onClick={() => setSelectedImagePreview(msg.mediaUrl!)}
                            />
                            {/* Overlay hover reaction buttons */}
                            <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full text-[11px] text-white">
                              <Smile className="w-3 h-3 text-[var(--accent)]" />
                              <span>React</span>
                            </div>
                          </div>
                        )}

                        {/* Message Content Text */}
                        <p className="leading-relaxed whitespace-pre-wrap break-words">
                          {msg.content}
                        </p>

                        {/* Actionable Campus Requirement Banner (Convert to Sovereign Board Task) */}
                        {msg.actionableTask && (
                          <div className="mt-2.5 p-2.5 rounded-[10px] bg-[var(--tile)] border border-[var(--accent)]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                                <span className="text-[10px] font-mono uppercase font-bold text-[var(--accent)]">
                                  Actionable Commitment
                                </span>
                              </div>
                              <span className="text-[12.5px] font-bold text-[var(--text)] block mt-0.5">
                                {msg.actionableTask.title}
                              </span>
                              <span className="text-[11px] text-[var(--meta)] font-mono">
                                Deadline: {msg.actionableTask.deadline} · +{msg.actionableTask.points} pts
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                onConvertToActionableTask({
                                  title: msg.actionableTask!.title,
                                  deadline: msg.actionableTask!.deadline,
                                  points: msg.actionableTask!.points,
                                  channelName: activeChannel.name,
                                });
                                showToast('Task committed to Sovereign Board!');
                              }}
                              className="px-3 py-1 rounded-[8px] bg-[var(--accent)] hover:bg-[#E8684D] text-white text-[11.5px] font-bold transition-all shadow-xs cursor-pointer shrink-0"
                            >
                              Commit ✓
                            </button>
                          </div>
                        )}

                        {/* Timestamp & Double Checkmarks (Blue ticks) */}
                        <div className="flex items-center justify-end gap-1 mt-1 text-[10.5px] font-mono text-[var(--meta)]">
                          <span>{msg.timestamp}</span>
                          {isMe && (
                            <span className="text-[#38BDF8] text-[11px] font-bold ml-0.5">
                              ✓✓
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quick AI Task Extraction on hover for peer messages */}
                      {!isMe && !msg.actionableTask && (
                        <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity pl-1">
                          <button
                            type="button"
                            onClick={() => handleAiExtract(msg)}
                            disabled={aiExtracting === msg.id}
                            className="text-[11px] font-semibold text-[var(--accent)] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3 text-[var(--accent)]" />
                            <span>
                              {aiExtracting === msg.id ? 'Extracting...' : 'Extract Task to Board'}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}

          {/* Floating Scroll to Bottom Button */}
          {isScrolledUp && (
            <button
              type="button"
              onClick={scrollToBottom}
              className="sticky bottom-3 float-right w-10 h-10 rounded-full bg-[var(--tile-active)] text-[var(--text-sub)] hover:text-[var(--text)] border border-[var(--rule)] shadow-2xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer z-20"
              title="Scroll to bottom"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Bottom Input Bar */}
        {!isBlockedBySurveillanceShield && (
          <div className="bg-[var(--tile)] border-t border-[var(--rule)] p-2.5 sm:px-4 relative shrink-0">
            {/* Quick Emoji Bar Popup */}
            {showEmojiPicker && (
              <div className="absolute bottom-16 left-4 p-2 rounded-[14px] bg-[var(--tile-active)] border border-[var(--rule)] shadow-2xl flex items-center gap-1.5 z-30 animate-in fade-in duration-150">
                {QUICK_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setDraftMessage((prev) => prev + emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="w-8 h-8 rounded-lg hover:bg-[var(--track)] text-[18px] flex items-center justify-center transition-transform hover:scale-125 cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            {/* Quick Attachment Menu */}
            {showAttachMenu && (
              <div className="absolute bottom-16 left-12 w-48 rounded-[14px] bg-[var(--tile-active)] border border-[var(--rule)] shadow-2xl p-2 z-30 text-[13px] animate-in fade-in duration-150 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowAttachMenu(false);
                    setKnowledgeResolverOpen(true);
                  }}
                  className="w-full px-3 py-2 rounded-lg hover:bg-[var(--track)] flex items-center gap-2.5 text-left text-[var(--text)]"
                >
                  <FileText className="w-4 h-4 text-[var(--accent)]" />
                  <span>Document / Notes</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAttachMenu(false);
                    showToast('Photo & video picker opened');
                  }}
                  className="w-full px-3 py-2 rounded-lg hover:bg-[var(--track)] flex items-center gap-2.5 text-left text-[var(--text)]"
                >
                  <ImageIcon className="w-4 h-4 text-[#38bdf8]" />
                  <span>Photos &amp; Videos</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAttachMenu(false);
                    showToast('Camera scanner ready');
                  }}
                  className="w-full px-3 py-2 rounded-lg hover:bg-[var(--track)] flex items-center gap-2.5 text-left text-[var(--text)]"
                >
                  <Camera className="w-4 h-4 text-[#ec4899]" />
                  <span>Camera</span>
                </button>
              </div>
            )}

            {/* Main Input Form */}
            <form onSubmit={handleSend} className="flex items-center gap-2">
              {/* Paperclip / Attachment Button */}
              <button
                type="button"
                onClick={() => {
                  setShowAttachMenu(!showAttachMenu);
                  setShowEmojiPicker(false);
                }}
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  showAttachMenu ? 'text-[var(--accent)] bg-[var(--tile-active)]' : 'text-[var(--text-sub)] hover:text-[var(--text)]'
                }`}
                title="Attach"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              {/* Emoji Picker Button */}
              <button
                type="button"
                onClick={() => {
                  setShowEmojiPicker(!showEmojiPicker);
                  setShowAttachMenu(false);
                }}
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  showEmojiPicker ? 'text-[var(--accent)] bg-[var(--tile-active)]' : 'text-[var(--text-sub)] hover:text-[var(--text)]'
                }`}
                title="Emoji"
              >
                <Smile className="w-5 h-5" />
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={draftMessage}
                onChange={(e) => setDraftMessage(e.target.value)}
                placeholder="Type a message"
                className="flex-1 px-4 py-2.5 rounded-lg bg-[var(--track)] text-[14px] text-[var(--text)] placeholder-[var(--meta)] outline-none border border-[var(--rule)] focus:border-[var(--accent)] transition-all"
              />

              {/* Voice Note / Send Button */}
              {draftMessage.trim() ? (
                <button
                  type="submit"
                  className="w-10 h-10 rounded-full bg-[var(--accent)] hover:bg-[#E8684D] text-white flex items-center justify-center font-bold shadow-md transition-transform active:scale-95 cursor-pointer shrink-0"
                  title="Send"
                >
                  <Send className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => showToast('Hold to record sovereign audio dispatch')}
                  className="p-2.5 rounded-full text-[var(--text-sub)] hover:text-[var(--text)] hover:bg-[var(--tile-active)] transition-colors cursor-pointer shrink-0"
                  title="Voice Message"
                >
                  <Mic className="w-5 h-5" />
                </button>
              )}
            </form>
          </div>
        )}
      </div>

      {/* ================= MODAL: AI QUICK DIGEST ================= */}
      {aiDigestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-[22px] bg-[var(--tile)] border border-[var(--rule)] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 border-b border-[var(--rule)] bg-[var(--tile-active)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[10px] bg-[var(--accent)]/15 flex items-center justify-center text-[var(--accent)]">
                  <Sparkles className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[var(--text)]">
                    AI Quick Digest · {activeChannel.name}
                  </h3>
                  <span className="text-[11px] text-[var(--meta)] font-mono">
                    Synthesized from last 24h peer &amp; official dispatches
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAiDigestModalOpen(false)}
                className="p-1 rounded-full text-[var(--meta)] hover:text-[var(--text)] hover:bg-[var(--track)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar">
              <div className="space-y-2.5">
                <span className="text-[11.5px] font-bold uppercase tracking-wider text-[var(--accent)] font-mono block">
                  Key Discussion Highlights
                </span>
                {channelDigest.bullets.map((b, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-[12px] bg-[var(--tile-active)] border border-[var(--rule)] text-[13px] text-[var(--text)] leading-relaxed flex items-start gap-2.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-2 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              {channelDigest.tasks.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[var(--rule)]">
                  <span className="text-[11.5px] font-bold uppercase tracking-wider text-amber-400 font-mono block">
                    Actionable Deadlines
                  </span>
                  {channelDigest.tasks.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-[12px] bg-[var(--tile-active)] border border-amber-500/30 flex items-center justify-between gap-3"
                    >
                      <div>
                        <span className="text-[13px] font-bold text-[var(--text)] block">
                          {t.title}
                        </span>
                        <span className="text-[11px] text-[var(--meta)] font-mono">
                          {t.deadline} · +{t.points} points
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onConvertToActionableTask({
                            title: t.title,
                            deadline: t.deadline,
                            points: t.points,
                            channelName: activeChannel.name,
                          });
                          showToast('Task added to Sovereign Board!');
                        }}
                        className="px-3 py-1 rounded-[8px] bg-[var(--accent)] hover:bg-[#E8684D] text-white text-[11.5px] font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                      >
                        Claim
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3.5 bg-[var(--tile-active)] border-t border-[var(--rule)] flex items-center justify-between">
              <button
                type="button"
                onClick={handleCopyDigest}
                className="px-3 py-1.5 rounded-[10px] bg-[var(--tile)] border border-[var(--rule)] hover:border-[var(--accent)] text-[12px] font-semibold text-[var(--text)] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedDigest ? <Check className="w-3.5 h-3.5 text-[var(--accent)]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDigest ? 'Copied' : 'Copy Digest'}</span>
              </button>

              <button
                type="button"
                onClick={() => setAiDigestModalOpen(false)}
                className="px-4 py-1.5 rounded-[10px] bg-[var(--accent)] hover:bg-[#E8684D] text-white text-[12.5px] font-bold transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ================= MODAL: KNOWLEDGE RESOLVER ================= */}
      {knowledgeResolverOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-[22px] bg-[var(--tile)] border border-[var(--rule)] shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--rule)] pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-[#38bdf8]" />
                <h3 className="text-[16px] font-bold text-[var(--text)]">
                  Campus Knowledge Resolver
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setKnowledgeResolverOpen(false)}
                className="p-1 rounded-full text-[var(--meta)] hover:text-[var(--text)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-[var(--meta)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={knowledgeSearch}
                onChange={(e) => setKnowledgeSearch(e.target.value)}
                placeholder="Query institutional rules, lab bays, schedules..."
                className="w-full pl-9 pr-3 py-2 rounded-[12px] bg-[var(--track)] border border-[var(--rule)] text-[13px] text-[var(--text)] placeholder-[var(--meta)] outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto no-scrollbar">
              {INSTITUTIONAL_KNOWLEDGE_BASE.filter(
                (k) =>
                  !knowledgeSearch ||
                  k.question.toLowerCase().includes(knowledgeSearch.toLowerCase()) ||
                  k.answer.toLowerCase().includes(knowledgeSearch.toLowerCase())
              ).map((k) => (
                <div key={k.id} className="p-3.5 rounded-[14px] bg-[var(--tile-active)] border border-[var(--rule)]">
                  <span className="text-[13px] font-bold text-[var(--accent)] block mb-1">
                    {k.question}
                  </span>
                  <p className="text-[12px] text-[var(--text-sub)] leading-relaxed">{k.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: PRIVACY & CHARTER ================= */}
      {privacyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-[22px] bg-[var(--tile)] border border-[var(--rule)] shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--rule)] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[var(--accent)]" />
                <h3 className="text-[16px] font-extrabold text-[var(--text)]">
                  Anti-Surveillance Charter
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPrivacyModalOpen(false)}
                className="p-1 rounded-full text-[var(--meta)] hover:text-[var(--text)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-[13px] text-[var(--text-sub)] space-y-3 leading-relaxed">
              <p>
                The Stele Sovereign Communication Subsystem implements cryptographic boundaries
                guaranteeing student autonomy.
              </p>
              <div className="p-3 rounded-[12px] bg-[var(--tile-active)] border border-[var(--accent)]/30 space-y-1.5 text-[12px]">
                <span className="font-bold text-[var(--accent)] block">Autonomous Student Commons</span>
                <p className="text-[var(--text)]">
                  Student lounges and peer channels operate on local encryption keys. Teachers and
                  administrators cannot access, inspect, or query student commons.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setPrivacyModalOpen(false)}
                className="px-4 py-2 rounded-[12px] bg-[var(--accent)] hover:bg-[#E8684D] text-white text-[12.5px] font-bold cursor-pointer transition-all"
              >
                Close Charter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= FULL IMAGE PREVIEW ================= */}
      {selectedImagePreview && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImagePreview(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh]">
            <img
              src={selectedImagePreview}
              alt="Enlarged media preview"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
            />
            <button
              type="button"
              onClick={() => setSelectedImagePreview(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
