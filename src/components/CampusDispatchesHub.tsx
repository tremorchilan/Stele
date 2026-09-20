import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  ShieldCheck,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  BellOff,
  ArrowRight,
  User,
  FileText,
  Lock,
  ShieldAlert,
  Search,
  EyeOff,
  Check,
  X,
  Paperclip,
  Smile,
  MoreVertical,
  Bot,
  Building2,
  GraduationCap,
  Users,
  Terminal,
  Copy,
  ChevronRight,
  Eye,
} from 'lucide-react';
import {
  CommunicationChannel,
  DispatchMessage,
  Role,
  ChannelCategory,
  InstitutionalKnowledgeQuery,
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
  // Telegram-style folder tabs: All, Official, Commons, Direct
  const [activeFolder, setActiveFolder] = useState<'all' | 'official' | 'commons' | 'direct'>('all');
  const [selectedChannelId, setSelectedChannelId] = useState<string>(
    initialChannelId || channels[0]?.id || 'ch-circulars'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [draftMessage, setDraftMessage] = useState('');

  // AI & Anti-Surveillance state
  const [aiExtracting, setAiExtracting] = useState<string | null>(null);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [knowledgeResolverOpen, setKnowledgeResolverOpen] = useState(false);
  const [knowledgeSearch, setKnowledgeSearch] = useState('');
  const [aiDigestModalOpen, setAiDigestModalOpen] = useState(openAiDigestDirectly);
  const [copiedDigest, setCopiedDigest] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast((cur) => (cur === msg ? null : cur)), 2500);
  };

  // Filter channels based on Telegram-like folder tabs & search
  const filteredChannels = useMemo(() => {
    return channels.filter((ch) => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = ch.name.toLowerCase().includes(q);
        const matchDesc = ch.description.toLowerCase().includes(q);
        const matchPeer = ch.dmPeerName?.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchPeer) return false;
      }

      // Folder filter
      if (activeFolder === 'official') {
        return ch.category === 'authority' || ch.category === 'faculty';
      }
      if (activeFolder === 'commons') {
        return ch.category === 'section' || ch.category === 'class' || ch.category === 'club' || ch.category === 'noninstitutional';
      }
      if (activeFolder === 'direct') {
        return ch.category === 'dm';
      }
      return true;
    });
  }, [channels, activeFolder, searchQuery]);

  const activeChannel =
    channels.find((c) => c.id === selectedChannelId) || filteredChannels[0] || channels[0];
  const channelMessages = messages.filter((m) => m.channelId === activeChannel?.id);

  // Anti-Surveillance Gate:
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
        extractedTitle = 'Laser Cutter Steward Sign-off in Bay 3';
        extractedDeadline = 'Friday, 5:00 PM';
        points = 60;
      } else if (content.includes('thermodynamics') || content.includes('tray')) {
        extractedTitle = 'Submit Thermodynamics Worksheet into Tray 204';
        extractedDeadline = 'Today, 2:00 PM';
        points = 25;
      } else if (content.includes('calculator') || content.includes('physics')) {
        extractedTitle = 'Bring Non-Programmable Calculator for Physics Assessment';
        extractedDeadline = 'Today, 3:30 PM';
        points = 35;
      }

      onConvertToActionableTask({
        title: extractedTitle,
        deadline: extractedDeadline,
        points,
        channelName: activeChannel.name,
      });

      setAiExtracting(null);
      showToast(`Action Item Extracted: "${extractedTitle}" (+${points} pts)`);
    }, 600);
  };

  // AI Channel Digest Content
  const channelDigest = useMemo(() => {
    const isOfficial = activeChannel.category === 'authority' || activeChannel.category === 'faculty';
    const isCommons = activeChannel.category === 'section';

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
          'Thermodynamics Problem Set: Nadia confirmed step 2 requires converting Celsius to Kelvin to avoid violating the 2nd law of thermodynamics (pg 84).',
          'Physical submission cutoff: Hard-copy worksheets must be placed into homework tray outside Room 204 before 2:00 PM today.',
          'Hardware team line-follower chassis design completed; pending laser cutter slot in Bay 3.',
        ],
        tasks: [
          { title: 'Submit Thermodynamics Problem Set into Tray 204', deadline: 'Today, 2:00 PM', points: 25 },
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

  const getChannelInitials = (ch: CommunicationChannel) => {
    if (ch.isDirectMessage && ch.dmPeerName) {
      return ch.dmPeerName.slice(0, 2).toUpperCase();
    }
    return ch.name.slice(0, 2).toUpperCase();
  };

  const getSenderColor = (role: Role) => {
    switch (role) {
      case 'authority':
        return 'text-sky-400';
      case 'teacher':
        return 'text-amber-400';
      case 'steward':
        return 'text-purple-400';
      case 'loyal_core':
        return 'text-emerald-400';
      default:
        return 'text-[var(--accent)]';
    }
  };

  return (
    <div className="flex flex-col rounded-[22px] bg-[var(--card)] border border-[var(--rule-default)] overflow-hidden shadow-2xl">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-[12px] bg-slate-900/95 text-white border border-slate-700 text-[12.5px] font-bold shadow-2xl flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* WhatsApp + Telegram Split Screen Layout */}
      <div className="flex flex-col md:flex-row h-[620px] divide-y md:divide-y-0 md:divide-x divide-[var(--rule-default)]">
        {/* ================= LEFT SIDEBAR (Telegram/WhatsApp Chat List) ================= */}
        <div className="w-full md:w-80 md:min-w-[320px] flex flex-col bg-[var(--card)]">
          {/* Top Search Bar */}
          <div className="p-3 border-b border-[var(--rule-default)]">
            <div className="relative">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats, circulars..."
                className="w-full pl-9 pr-3 py-2 rounded-[12px] bg-[var(--canvas)] border border-[var(--rule-default)] text-[12.5px] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent)] transition-all"
              />
            </div>

            {/* Telegram-style 4 Folders (Clean Segmented Control, No 8 Chunky Pills) */}
            <div className="flex items-center gap-1 mt-2.5 p-1 rounded-[10px] bg-[var(--canvas)] border border-[var(--rule-default)]">
              {[
                { id: 'all', label: 'All' },
                { id: 'official', label: 'Official' },
                { id: 'commons', label: 'Commons' },
                { id: 'direct', label: 'Direct' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFolder(tab.id as any)}
                  className={`flex-1 py-1 text-[11px] font-bold rounded-[7px] transition-all cursor-pointer text-center ${
                    activeFolder === tab.id
                      ? 'bg-[var(--accent)] text-white shadow-xs'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chat List Scrollable */}
          <div className="flex-1 overflow-y-auto divide-y divide-[var(--rule-default)]/40 no-scrollbar">
            {filteredChannels.map((ch) => {
              const isSelected = ch.id === activeChannel?.id;
              const isOfficial = ch.category === 'authority' || ch.category === 'faculty';
              const isCommons = ch.privacySphere === 'student_commons';
              const isEncrypted = ch.privacySphere === 'peer_encrypted';

              return (
                <div
                  key={ch.id}
                  onClick={() => setSelectedChannelId(ch.id)}
                  className={`p-3 transition-colors cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'bg-[var(--accent)]/15 border-l-4 border-l-[var(--accent)]'
                      : 'hover:bg-[var(--canvas)]'
                  }`}
                >
                  {/* Avatar Icon */}
                  <div className="relative shrink-0">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center font-bold font-mono text-[13px] ${
                        isOfficial
                          ? 'bg-sky-500/20 text-sky-400 ring-2 ring-sky-500/30'
                          : isCommons
                          ? 'bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/30'
                          : 'bg-purple-500/20 text-purple-400 ring-2 ring-purple-500/30'
                      }`}
                    >
                      {isOfficial ? <Building2 className="w-5 h-5" /> : getChannelInitials(ch)}
                    </div>
                    {isOfficial && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-sky-500 text-white flex items-center justify-center text-[9px] font-bold">
                        ✓
                      </span>
                    )}
                  </div>

                  {/* Info & Last Message */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-[13px] font-bold text-[var(--text-primary)] truncate flex items-center gap-1">
                        {ch.isDirectMessage ? ch.dmPeerName : ch.name}
                        {isEncrypted && <Lock className="w-3 h-3 text-purple-400 shrink-0" />}
                      </span>
                      <span className="text-[10.5px] text-[var(--text-secondary)] font-mono shrink-0">
                        {isOfficial ? '08:15 AM' : '10:22 AM'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-1">
                      <p className="text-[11.5px] text-[var(--text-secondary)] truncate">
                        {isOfficial ? 'Official Circular: Fabrication Annex Bay 3...' : 'Life saver Nadia! Remember we need to...'}
                      </p>

                      {ch.unreadCount > 0 && !isSelected && (
                        <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[9.5px] font-bold font-mono flex items-center justify-center shrink-0">
                          {ch.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredChannels.length === 0 && (
              <div className="p-8 text-center text-[12.5px] text-[var(--text-muted)]">
                No chats found in this folder.
              </div>
            )}
          </div>

          {/* Bottom Anti-Surveillance Indicator */}
          <div className="p-2.5 px-3.5 border-t border-[var(--rule-default)] bg-[var(--canvas)] flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sovereign Enclave Active</span>
            </div>
            <button
              type="button"
              onClick={() => setPrivacyModalOpen(true)}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-[10.5px] underline cursor-pointer"
            >
              Charter
            </button>
          </div>
        </div>

        {/* ================= RIGHT CONVERSATION PANE (WhatsApp/Telegram Experience) ================= */}
        <div className="flex-1 flex flex-col bg-[var(--canvas)]">
          {/* WhatsApp / Telegram Chat Header */}
          <div className="p-3 sm:px-4 border-b border-[var(--rule-default)] bg-[var(--card)] flex items-center justify-between gap-3 shrink-0 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[13px] shrink-0 ${
                  activeChannel.category === 'authority' || activeChannel.category === 'faculty'
                    ? 'bg-sky-500/20 text-sky-400'
                    : activeChannel.privacySphere === 'student_commons'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-purple-500/20 text-purple-400'
                }`}
              >
                {activeChannel.category === 'authority' ? <Building2 className="w-5 h-5" /> : getChannelInitials(activeChannel)}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-[14.5px] font-extrabold text-[var(--text-primary)] truncate">
                    {activeChannel.isDirectMessage ? activeChannel.dmPeerName : activeChannel.name}
                  </h3>
                  {activeChannel.category === 'authority' && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-[4px] bg-sky-500/20 text-sky-400 flex items-center gap-0.5 shrink-0">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Official</span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] truncate">
                  {activeChannel.category === 'authority'
                    ? 'official broadcast channel • 1,420 members'
                    : activeChannel.privacySphere === 'student_commons'
                    ? 'student commons · shielded from surveillance • 28 members'
                    : 'end-to-end encrypted direct dispatch'}
                </p>
              </div>
            </div>

            {/* Right Action Icons: Prominent ✨ AI Quick Digest button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setAiDigestModalOpen(true)}
                className="px-3.5 py-1.5 rounded-[12px] bg-[var(--accent)] text-white hover:opacity-95 text-[12px] font-extrabold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title="Open AI Quick Digest of channel announcements and deadlines"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>AI Digest</span>
              </button>

              <button
                type="button"
                onClick={() => setKnowledgeResolverOpen(true)}
                className="p-2 rounded-[10px] bg-[var(--canvas)] border border-[var(--rule-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                title="Campus Knowledge Resolver"
              >
                <Bot className="w-4 h-4 text-sky-400" />
              </button>

              <button
                type="button"
                onClick={() => setPrivacyModalOpen(true)}
                className="p-2 rounded-[10px] bg-[var(--canvas)] border border-[var(--rule-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                title="Inspect Privacy & Security"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body with WhatsApp/Telegram Bubbles */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
            {/* Centered Date Badge */}
            <div className="flex justify-center my-1">
              <span className="px-3 py-0.5 rounded-full bg-[var(--card)] border border-[var(--rule-default)] text-[10.5px] font-mono font-semibold text-[var(--text-secondary)]">
                Today, September 19
              </span>
            </div>

            {/* Blocked by Surveillance Gate Check */}
            {isBlockedBySurveillanceShield ? (
              <div className="p-8 rounded-[20px] bg-[var(--card)] border border-amber-500/40 text-center max-w-md mx-auto my-12 shadow-lg">
                <ShieldAlert className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                <h4 className="text-[16px] font-bold text-[var(--text-primary)]">
                  Zero-Surveillance Shield Active
                </h4>
                <p className="text-[12.5px] text-[var(--text-secondary)] mt-1 leading-relaxed">
                  Under the Stele Campus Charter, informal student commons and peer dispatches are strictly shielded from administrative, teacher, or authority surveillance.
                </p>
              </div>
            ) : (
              <>
                {channelMessages.map((msg) => {
                  const isMe = msg.senderName === studentName;
                  const isOfficialBroadcast = msg.isOfficial || activeChannel.category === 'authority';

                  // TELEGRAM BROADCAST POST STYLE (For Official Notices)
                  if (isOfficialBroadcast) {
                    return (
                      <div
                        key={msg.id}
                        className="max-w-2xl mx-auto p-4 rounded-[18px] bg-[var(--card)] border border-sky-500/30 shadow-xs flex flex-col gap-2.5"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-[var(--rule-default)]">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={msg.senderAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
                              alt={msg.senderName}
                              className="w-8 h-8 rounded-full object-cover border border-sky-400"
                            />
                            <div>
                              <span className="text-[13px] font-bold text-[var(--text-primary)] block">
                                {msg.senderName}
                              </span>
                              <span className="text-[10px] text-sky-400 font-bold">
                                Official Circular
                              </span>
                            </div>
                          </div>
                          <span className="text-[11px] font-mono text-[var(--text-secondary)]">
                            {msg.timestamp}
                          </span>
                        </div>

                        <p className="text-[13px] text-[var(--text-primary)] leading-relaxed">
                          {msg.content}
                        </p>

                        {msg.actionableTask && (
                          <div className="p-3 rounded-[12px] bg-[var(--canvas)] border border-amber-500/30 flex items-center justify-between gap-3">
                            <div>
                              <span className="text-[10.5px] uppercase font-bold text-amber-400 font-mono block">
                                Actionable Requirement
                              </span>
                              <span className="text-[12.5px] font-bold text-[var(--text-primary)]">
                                {msg.actionableTask.title}
                              </span>
                              <span className="text-[11px] text-[var(--text-secondary)] block font-mono">
                                Deadline: {msg.actionableTask.deadline} · +{msg.actionableTask.points} points
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
                              className="px-3 py-1 rounded-[8px] bg-[var(--accent)] text-white text-[11.5px] font-bold hover:opacity-90 cursor-pointer shrink-0"
                            >
                              Commit
                            </button>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[10.5px] text-[var(--text-secondary)] pt-1">
                          <span className="flex items-center gap-1 font-mono">
                            <Eye className="w-3 h-3" /> 1,420 views
                          </span>
                          <span className="font-mono flex items-center gap-1 text-sky-400">
                            ✓✓ Verified
                          </span>
                        </div>
                      </div>
                    );
                  }

                  // WHATSAPP CHAT BUBBLE STYLE (For Peer & Section Chats)
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col group ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`relative max-w-[82%] sm:max-w-[70%] p-3 rounded-[16px] shadow-xs text-[13px] ${
                          isMe
                            ? 'bg-[var(--accent)] text-white rounded-tr-none'
                            : 'bg-[var(--card)] border border-[var(--rule-default)] text-[var(--text-primary)] rounded-tl-none'
                        }`}
                      >
                        {/* Sender name for other peers (like Telegram groups) */}
                        {!isMe && (
                          <span
                            className={`block text-[11.5px] font-bold mb-1 ${getSenderColor(
                              msg.senderRole
                            )}`}
                          >
                            {msg.senderName}
                          </span>
                        )}

                        <p className="leading-relaxed break-words">{msg.content}</p>

                        {/* Timestamp & double checks */}
                        <div
                          className={`flex items-center justify-end gap-1 mt-1 text-[10px] font-mono ${
                            isMe ? 'text-white/80' : 'text-[var(--text-secondary)]'
                          }`}
                        >
                          <span>{msg.timestamp}</span>
                          {isMe && <span>✓✓</span>}
                        </div>
                      </div>

                      {/* AI Action Extract button on hover for peer messages with potential tasks */}
                      {!isMe && !msg.isOfficial && (
                        <button
                          type="button"
                          onClick={() => handleAiExtract(msg)}
                          disabled={aiExtracting === msg.id}
                          className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-bold text-[var(--accent)] hover:underline flex items-center gap-1 cursor-pointer pl-1"
                        >
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>{aiExtracting === msg.id ? 'Extracting...' : '✨ AI Extract Task'}</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* WhatsApp Style Bottom Input Bar */}
          {!isBlockedBySurveillanceShield && (
            <form
              onSubmit={handleSend}
              className="p-2.5 sm:p-3 border-t border-[var(--rule-default)] bg-[var(--card)] flex items-center gap-2 shrink-0"
            >
              <button
                type="button"
                onClick={() => setKnowledgeResolverOpen(true)}
                className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--canvas)] transition-colors cursor-pointer"
                title="Attach Knowledge File"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={draftMessage}
                onChange={(e) => setDraftMessage(e.target.value)}
                placeholder="Type a sovereign dispatch..."
                className="flex-1 px-4 py-2 rounded-full bg-[var(--canvas)] border border-[var(--rule-default)] text-[13px] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent)] transition-all"
              />

              <button
                type="submit"
                disabled={!draftMessage.trim()}
                className={`p-2.5 rounded-full transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                  draftMessage.trim()
                    ? 'bg-[var(--accent)] text-white shadow-md active:scale-95'
                    : 'bg-[var(--canvas)] text-[var(--text-muted)] opacity-50 cursor-not-allowed'
                }`}
                title="Send dispatch"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ================= MODAL: AI QUICK DIGEST ================= */}
      {aiDigestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-[22px] bg-[var(--card)] border border-[var(--rule-default)] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 border-b border-[var(--rule-default)] bg-[var(--canvas)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[10px] bg-[var(--accent)]/15 flex items-center justify-center text-[var(--accent)]">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-[15px] font-extrabold text-[var(--text-primary)]">
                    AI Channel Quick Digest
                  </h3>
                  <span className="text-[11px] text-[var(--text-secondary)] font-mono">
                    {activeChannel.name}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAiDigestModalOpen(false)}
                className="p-1.5 rounded-[8px] hover:bg-[var(--canvas)] text-[var(--text-secondary)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Digest Body */}
            <div className="p-5 space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent)] font-mono block mb-2">
                  Key Takeaways (Synthesized by Local AI)
                </span>
                <div className="space-y-2">
                  {channelDigest.bullets.map((bullet, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-[12px] bg-[var(--canvas)] border border-[var(--rule-default)] text-[12.5px] text-[var(--text-primary)] leading-relaxed flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-1.5 shrink-0" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {channelDigest.tasks.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono block mb-2">
                    Extracted Action Items &amp; Deadlines
                  </span>
                  <div className="space-y-2">
                    {channelDigest.tasks.map((task, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-[12px] bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-2"
                      >
                        <div>
                          <span className="text-[12.5px] font-bold text-[var(--text-primary)] block">
                            {task.title}
                          </span>
                          <span className="text-[11px] text-[var(--text-secondary)] font-mono">
                            Deadline: {task.deadline} · +{task.points} pts
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            onConvertToActionableTask({
                              title: task.title,
                              deadline: task.deadline,
                              points: task.points,
                              channelName: activeChannel.name,
                            });
                            showToast('Task committed to Sovereign Board!');
                          }}
                          className="px-3 py-1 rounded-[8px] bg-[var(--accent)] text-white text-[11.5px] font-bold hover:opacity-90 cursor-pointer whitespace-nowrap"
                        >
                          Commit +{task.points}p
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3.5 border-t border-[var(--rule-default)] bg-[var(--canvas)] flex items-center justify-between">
              <button
                type="button"
                onClick={handleCopyDigest}
                className="px-3 py-1.5 rounded-[10px] bg-[var(--card)] border border-[var(--rule-default)] hover:border-[var(--accent)] text-[12px] font-semibold text-[var(--text-primary)] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedDigest ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDigest ? 'Copied' : 'Copy Digest'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAiDigestModalOpen(false);
                  showToast('Channel marked as digested');
                }}
                className="px-4 py-1.5 rounded-[10px] bg-[var(--accent)] text-white text-[12px] font-bold hover:opacity-90 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CAMPUS KNOWLEDGE RESOLVER ================= */}
      {knowledgeResolverOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-[22px] bg-[var(--card)] border border-[var(--rule-default)] shadow-2xl overflow-hidden animate-in fade-in duration-200">
            <div className="p-4 border-b border-[var(--rule-default)] bg-[var(--canvas)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-sky-400" />
                <h3 className="text-[15px] font-extrabold text-[var(--text-primary)]">
                  Campus Knowledge Resolver
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setKnowledgeResolverOpen(false)}
                className="p-1.5 rounded-[8px] hover:bg-[var(--canvas)] text-[var(--text-secondary)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4">
              <input
                type="text"
                value={knowledgeSearch}
                onChange={(e) => setKnowledgeSearch(e.target.value)}
                placeholder="Search campus rules, lab hours, syllabus policies..."
                className="w-full px-3.5 py-2 rounded-[12px] bg-[var(--canvas)] border border-[var(--rule-default)] text-[12.5px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
              />

              <div className="mt-3 max-h-72 overflow-y-auto space-y-2 no-scrollbar">
                {INSTITUTIONAL_KNOWLEDGE_BASE.filter(
                  (k) =>
                    !knowledgeSearch ||
                    k.question.toLowerCase().includes(knowledgeSearch.toLowerCase()) ||
                    k.answer.toLowerCase().includes(knowledgeSearch.toLowerCase())
                ).map((k) => (
                  <div key={k.id} className="p-3 rounded-[12px] bg-[var(--canvas)] border border-[var(--rule-default)]">
                    <span className="text-[10px] font-mono font-bold text-[var(--accent)] uppercase block">
                      {k.category} · {k.sourceDoc}
                    </span>
                    <span className="text-[12.5px] font-bold text-[var(--text-primary)] block mt-0.5">
                      {k.question}
                    </span>
                    <p className="text-[11.5px] text-[var(--text-secondary)] mt-1">
                      {k.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ANTI-SURVEILLANCE CHARTER ================= */}
      {privacyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-[22px] bg-[var(--card)] border border-[var(--rule-default)] shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-[16px] font-extrabold text-[var(--text-primary)]">
                  Anti-Surveillance Charter
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPrivacyModalOpen(false)}
                className="p-1 rounded-[6px] hover:bg-[var(--canvas)] text-[var(--text-secondary)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-[12.5px] text-[var(--text-secondary)] leading-relaxed">
              <p>
                <strong className="text-[var(--text-primary)]">Zero Keyword Auditing:</strong> The institution does not monitor or index student discourse in commons or peer groups.
              </p>
              <p>
                <strong className="text-[var(--text-primary)]">Cryptographic Air-Gaps:</strong> Authority and faculty roles have zero access tokens into informal student channels.
              </p>
              <p>
                <strong className="text-[var(--text-primary)]">Local AI Synthesis:</strong> Catch-up digests and action extraction operate locally on-device without telemetry.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setPrivacyModalOpen(false)}
              className="w-full py-2 rounded-[12px] bg-[var(--accent)] text-white text-[12.5px] font-bold hover:opacity-90 cursor-pointer"
            >
              Acknowledge Protection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
