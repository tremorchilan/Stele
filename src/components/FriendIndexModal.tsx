import React, { useState } from 'react';
import {
  X,
  QrCode,
  Users,
  Search,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Sparkles,
  MessageSquare,
  UserPlus,
  Copy,
  Check,
  Camera,
  ExternalLink,
  Star,
  Flame,
} from 'lucide-react';
import { FriendPeer, Role } from '../types';
import { MOCK_FRIENDS } from '../data/mockData';

interface FriendIndexModalProps {
  isOpen: boolean;
  onClose: () => void;
  friends?: FriendPeer[];
  onOpenPeerDM?: (peerName: string) => void;
  onAddFriend?: (peer: FriendPeer) => void;
  isDark: boolean;
}

export const FriendIndexModal: React.FC<FriendIndexModalProps> = ({
  isOpen,
  onClose,
  friends: initialFriends = MOCK_FRIENDS,
  onOpenPeerDM,
  onAddFriend,
  isDark,
}) => {
  const [activeTab, setActiveTab] = useState<'roster' | 'my_qr' | 'scan_qr'>('roster');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<'all' | 'favorites' | 'section' | 'lab'>('all');
  const [friendsList, setFriendsList] = useState<FriendPeer[]>(initialFriends);
  const [copiedKey, setCopiedKey] = useState(false);
  const [scanInputKey, setScanInputKey] = useState('');
  const [scanSuccessMsg, setScanSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const mySovereignAddress = 'stele://peer/shadman-11a-0x8f4b29ce';

  const handleCopyMyKey = () => {
    navigator.clipboard?.writeText(mySovereignAddress);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSimulatedScanAdd = (customName?: string, customHandle?: string) => {
    const nameToAdd = customName || 'Tanvir Hossain';
    const handleToAdd = customHandle || '@tanvir.stele';
    const newPeer: FriendPeer = {
      id: `peer-${Date.now()}`,
      name: nameToAdd,
      handle: handleToAdd,
      sovereignAddress: `stele://peer/${handleToAdd.replace('@', '')}-0x${Math.random().toString(16).slice(2, 10)}`,
      section: 'Section 11-A · Science',
      role: 'member',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
      trustLevel: 'Study Partner',
      mutualCommitments: 1,
      clubAffiliations: ['Robotics Society', 'Physics Review Circle'],
      status: 'online',
      statusMessage: 'Just paired through Sovereign QR handshake',
      lastExchange: 'Just now',
      mutualCircleCount: 8,
      verifiedDate: 'Today',
      isFavorite: false,
    };

    setFriendsList((prev) => [newPeer, ...prev]);
    onAddFriend?.(newPeer);
    setScanSuccessMsg(`Successfully verified and listed ${nameToAdd} (${handleToAdd}) to your Sovereign Friend Index!`);
    setTimeout(() => {
      setScanSuccessMsg(null);
      setActiveTab('roster');
    }, 1800);
  };

  const filteredFriends = friendsList.filter((f) => {
    const matchesQuery =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.section.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesQuery) return false;
    if (filterTag === 'favorites') return f.isFavorite;
    if (filterTag === 'section') return f.section.includes('11-A');
    if (filterTag === 'lab') return f.status === 'in_lab' || f.clubAffiliations.some((c) => c.includes('Robotics'));
    return true;
  });

  const getStatusColor = (status: FriendPeer['status']) => {
    switch (status) {
      case 'online':
        return 'bg-emerald-400';
      case 'in_lab':
        return 'bg-amber-400';
      case 'in_study_pod':
        return 'bg-purple-400';
      case 'quiet_mode':
        return 'bg-slate-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs android-popup-backdrop">
      <div
        className={`relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-[24px] shadow-2xl border overflow-hidden android-popup-widget ${
          isDark
            ? 'bg-[#14171F] border-[rgba(255,255,255,0.1)] text-[#E8ECF2]'
            : 'bg-white border-[#E2E8F0] text-[#1E293B]'
        }`}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[var(--track)] flex items-center justify-center border border-[var(--rule)] text-[var(--accent)]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[18px] sm:text-[20px] font-extrabold tracking-tight">
                  Sovereign Friend Index
                </h2>
                <span className="px-2 py-0.5 rounded-[6px] bg-[var(--tile-active)] border border-[var(--rule)] text-[var(--text-sub)] text-[10.5px] font-medium tracking-wide flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>QR Cryptographic Handshake</span>
                </span>
              </div>
              <p className="text-[12px] sm:text-[13px] text-[var(--meta)] mt-0.5">
                Surveillance-free peer directory. No phone numbers or address book uploads required.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Friend Index"
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-[var(--meta)] hover:text-[var(--text)] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 py-2.5 border-b border-[rgba(255,255,255,0.06)] bg-[var(--track)] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('roster')}
              className={`px-3 py-1.5 rounded-[10px] text-[12px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'roster'
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'text-[var(--meta)] hover:text-[var(--text)]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Peer Directory ({friendsList.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('my_qr')}
              className={`px-3 py-1.5 rounded-[10px] text-[12px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'my_qr'
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'text-[var(--meta)] hover:text-[var(--text)]'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>My Peer QR</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('scan_qr')}
              className={`px-3 py-1.5 rounded-[10px] text-[12px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'scan_qr'
                  ? 'bg-[var(--accent)] text-white shadow-xs'
                  : 'text-[var(--meta)] hover:text-[var(--text)]'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Scan / Add QR</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Peer Directory Roster */}
        {activeTab === 'roster' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[var(--meta)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, @handle, or section..."
                  className="w-full pl-9 pr-3 py-2 rounded-[12px] bg-[var(--track)] border border-[rgba(255,255,255,0.08)] text-[13px] text-[var(--text)] placeholder-[var(--meta)] outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="flex items-center gap-1 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setFilterTag('all')}
                  className={`px-2.5 py-1.5 rounded-[8px] text-[11px] font-bold ${
                    filterTag === 'all'
                      ? 'bg-[var(--tile)] border border-[var(--accent)] text-[var(--accent)]'
                      : 'text-[var(--meta)] hover:text-[var(--text)]'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTag('favorites')}
                  className={`px-2.5 py-1.5 rounded-[8px] text-[11px] font-bold flex items-center gap-1 ${
                    filterTag === 'favorites'
                      ? 'bg-[var(--tile)] border border-[var(--orange)] text-[var(--orange)]'
                      : 'text-[var(--meta)] hover:text-[var(--text)]'
                  }`}
                >
                  <Star className="w-3 h-3" />
                  <span>Favorites</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTag('section')}
                  className={`px-2.5 py-1.5 rounded-[8px] text-[11px] font-bold ${
                    filterTag === 'section'
                      ? 'bg-[var(--tile)] border border-[var(--accent)] text-[var(--accent)]'
                      : 'text-[var(--meta)] hover:text-[var(--text)]'
                  }`}
                >
                  11-A
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTag('lab')}
                  className={`px-2.5 py-1.5 rounded-[8px] text-[11px] font-bold ${
                    filterTag === 'lab'
                      ? 'bg-[var(--tile)] border border-[var(--accent)] text-[var(--accent)]'
                      : 'text-[var(--meta)] hover:text-[var(--text)]'
                  }`}
                >
                  Lab Active
                </button>
              </div>
            </div>

            {/* Peer Cards List */}
            <div className="space-y-2.5">
              {filteredFriends.map((peer) => (
                <div
                  key={peer.id}
                  className="p-3.5 rounded-[16px] bg-[var(--tile)] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <img
                        src={peer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                        alt={peer.name}
                        className="w-10 h-10 rounded-full object-cover border border-white/10"
                        referrerPolicy="no-referrer"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-[var(--tile)] ${getStatusColor(
                          peer.status
                        )}`}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-[14px] font-bold text-[var(--text)]">
                          {peer.name}
                        </h4>
                        <span className="text-[11.5px] font-mono text-[var(--meta)]">
                          {peer.handle}
                        </span>
                        {peer.isFavorite && (
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] px-2 py-0.5 rounded-[6px] bg-[var(--track)] text-[var(--meta)] font-medium">
                          {peer.section}
                        </span>
                        <span className="text-[10.5px] px-2 py-0.5 rounded-[6px] bg-sky-500/15 text-sky-400 font-bold uppercase">
                          {peer.trustLevel}
                        </span>
                        <span className="text-[11px] text-[var(--meta)]">
                          · {peer.mutualCommitments} mutual commitments
                        </span>
                      </div>

                      {peer.statusMessage && (
                        <p className="text-[12px] text-[var(--text)]/80 mt-1 italic">
                          "{peer.statusMessage}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenPeerDM?.(peer.name);
                      }}
                      className="px-3 py-1.5 rounded-[10px] bg-[var(--accent-soft)] border border-[var(--accent)]/30 text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all text-[12px] font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Message DM</span>
                    </button>
                  </div>
                </div>
              ))}

              {filteredFriends.length === 0 && (
                <div className="py-10 text-center text-[var(--meta)] text-[13px]">
                  No peer matches found. Use the QR Scan tab to discover new scholars!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: My Peer QR Code */}
        {activeTab === 'my_qr' && (
          <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 rounded-[24px] bg-white text-slate-900 shadow-xl border-4 border-[var(--accent)]/40 flex flex-col items-center">
              {/* High Fidelity SVG QR Code Graphic */}
              <div className="w-52 h-52 relative flex items-center justify-center p-2">
                <svg
                  viewBox="0 0 160 160"
                  className="w-full h-full"
                  fill="currentColor"
                >
                  {/* Top Left Corner Finder */}
                  <rect x="10" y="10" width="40" height="40" rx="6" fill="#1E293B" />
                  <rect x="18" y="18" width="24" height="24" rx="2" fill="#FFFFFF" />
                  <rect x="24" y="24" width="12" height="12" rx="1" fill="#1E293B" />

                  {/* Top Right Corner Finder */}
                  <rect x="110" y="10" width="40" height="40" rx="6" fill="#1E293B" />
                  <rect x="118" y="18" width="24" height="24" rx="2" fill="#FFFFFF" />
                  <rect x="124" y="24" width="12" height="12" rx="1" fill="#1E293B" />

                  {/* Bottom Left Corner Finder */}
                  <rect x="10" y="110" width="40" height="40" rx="6" fill="#1E293B" />
                  <rect x="18" y="118" width="24" height="24" rx="2" fill="#FFFFFF" />
                  <rect x="24" y="124" width="12" height="12" rx="1" fill="#1E293B" />

                  {/* QR Data Matrix Bits */}
                  <rect x="60" y="15" width="8" height="8" fill="#1E293B" />
                  <rect x="75" y="15" width="8" height="8" fill="#1E293B" />
                  <rect x="90" y="20" width="8" height="8" fill="#1E293B" />
                  <rect x="60" y="30" width="8" height="8" fill="#1E293B" />
                  <rect x="75" y="40" width="8" height="8" fill="#1E293B" />
                  <rect x="90" y="35" width="8" height="8" fill="#1E293B" />

                  <rect x="15" y="65" width="8" height="8" fill="#1E293B" />
                  <rect x="30" y="70" width="8" height="8" fill="#1E293B" />
                  <rect x="45" y="65" width="8" height="8" fill="#1E293B" />
                  <rect x="25" y="85" width="8" height="8" fill="#1E293B" />
                  <rect x="40" y="90" width="8" height="8" fill="#1E293B" />

                  <rect x="65" y="65" width="10" height="10" fill="#2563EB" />
                  <rect x="85" y="65" width="10" height="10" fill="#2563EB" />
                  <rect x="65" y="85" width="10" height="10" fill="#2563EB" />
                  <rect x="85" y="85" width="10" height="10" fill="#2563EB" />

                  <rect x="115" y="65" width="8" height="8" fill="#1E293B" />
                  <rect x="135" y="75" width="8" height="8" fill="#1E293B" />
                  <rect x="125" y="85" width="8" height="8" fill="#1E293B" />
                  <rect x="140" y="95" width="8" height="8" fill="#1E293B" />

                  <rect x="60" y="115" width="8" height="8" fill="#1E293B" />
                  <rect x="75" y="125" width="8" height="8" fill="#1E293B" />
                  <rect x="90" y="115" width="8" height="8" fill="#1E293B" />
                  <rect x="65" y="135" width="8" height="8" fill="#1E293B" />
                  <rect x="80" y="140" width="8" height="8" fill="#1E293B" />

                  <rect x="115" y="115" width="8" height="8" fill="#1E293B" />
                  <rect x="130" y="125" width="8" height="8" fill="#1E293B" />
                  <rect x="140" y="115" width="8" height="8" fill="#1E293B" />
                  <rect x="125" y="135" width="8" height="8" fill="#1E293B" />
                  <rect x="135" y="140" width="8" height="8" fill="#1E293B" />
                </svg>

                {/* Center Stele Sovereign Token Marker */}
                <div className="absolute w-10 h-10 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-bold text-[14px] shadow-md border-2 border-white">
                  ⬣
                </div>
              </div>

              <div className="mt-1">
                <span className="text-[14px] font-extrabold text-slate-900 block">
                  Shadman Shakib
                </span>
                <span className="text-[11.5px] font-mono text-slate-500 font-medium">
                  @shadman.stele · Section 11-A
                </span>
              </div>
            </div>

            {/* Cryptographic Sovereign Address */}
            <div className="w-full max-w-md p-3 rounded-[14px] bg-[var(--track)] border border-[rgba(255,255,255,0.08)] flex items-center justify-between gap-2 text-left">
              <div className="overflow-hidden">
                <span className="text-[10.5px] uppercase font-bold text-[var(--meta)] block">
                  Sovereign Public Key URI
                </span>
                <span className="text-[12px] font-mono text-[var(--text)] truncate block">
                  {mySovereignAddress}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyMyKey}
                className="px-3 py-1.5 rounded-[10px] bg-[var(--tile)] border border-[rgba(255,255,255,0.1)] text-[12px] font-semibold text-[var(--text)] hover:border-[var(--accent)] shrink-0 flex items-center gap-1 cursor-pointer"
              >
                {copiedKey ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="max-w-md text-[12px] text-[var(--meta)] leading-relaxed">
              Present this QR to another student in physical proximity to establish a peer-to-peer encrypted channel. Does not disclose personal phone numbers or social media handles.
            </div>
          </div>
        )}

        {/* Tab 3: Scan / Add QR Peer */}
        {activeTab === 'scan_qr' && (
          <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center space-y-5">
            {scanSuccessMsg && (
              <div className="w-full p-3 rounded-[14px] bg-[var(--tile-active)] border border-[var(--rule)] text-[var(--text)] text-[13px] font-semibold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent)] shrink-0" />
                <span>{scanSuccessMsg}</span>
              </div>
            )}

            {/* Simulated Camera Viewfinder */}
            <div className="relative w-64 h-64 rounded-[24px] bg-black border border-[var(--rule)] overflow-hidden flex flex-col items-center justify-center shadow-lg">
              {/* Subtle scanning laser */}
              <div className="absolute inset-x-0 h-0.5 bg-[var(--accent)] shadow-sm animate-pulse opacity-80" />

              <div className="text-center p-4">
                <Camera className="w-8 h-8 text-[var(--meta)] mx-auto mb-2" />
                <span className="text-[12px] font-bold text-white/80 block">
                  Point at Peer’s Stele QR Code
                </span>
                <span className="text-[10.5px] text-white/50">
                  Auto-detects cryptographic sovereign handshake
                </span>
              </div>

              {/* Viewfinder Corners */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-sky-400" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-sky-400" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-sky-400" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-sky-400" />
            </div>

            {/* Quick Simulate Scan Button */}
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => handleSimulatedScanAdd('Tanvir Hossain', '@tanvir.stele')}
                className="px-5 py-2.5 rounded-[14px] bg-[var(--accent)] text-white text-[13px] font-bold hover:opacity-95 active:scale-95 shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Simulate Camera Scan Handshake</span>
              </button>
              <span className="text-[11px] text-[var(--meta)]">
                Instant peer key authentication
              </span>
            </div>

            {/* Or Paste Peer Key */}
            <div className="w-full max-w-md pt-4 border-t border-[rgba(255,255,255,0.08)]">
              <label className="text-[12px] font-bold text-[var(--text)] block mb-1.5">
                Or Paste Friend’s Sovereign Handle or Key URI
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={scanInputKey}
                  onChange={(e) => setScanInputKey(e.target.value)}
                  placeholder="e.g. stele://peer/tanvir-11a-0x89ab or @tanvir.stele"
                  className="flex-1 px-3 py-2 rounded-[12px] bg-[var(--track)] border border-[rgba(255,255,255,0.08)] text-[12.5px] text-[var(--text)] outline-none focus:border-[var(--accent)]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (scanInputKey.trim()) {
                      handleSimulatedScanAdd(scanInputKey.trim(), `@${scanInputKey.trim().toLowerCase().replace(/[^a-z]/g, '')}.stele`);
                      setScanInputKey('');
                    }
                  }}
                  className="px-3.5 py-2 rounded-[12px] bg-[var(--tile)] border border-[rgba(255,255,255,0.1)] text-[12px] font-bold text-[var(--text)] hover:border-[var(--accent)] cursor-pointer shrink-0"
                >
                  Pair &amp; Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-[var(--track)] border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[12px] text-[var(--meta)]">
            <Lock className="w-3.5 h-3.5 text-[var(--meta)]" />
            <span>Anti-surveillance certified: Peer lists never sync to central school database</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-[10px] bg-[var(--tile)] border border-[rgba(255,255,255,0.08)] text-[12.5px] font-semibold text-[var(--text)] hover:border-[var(--accent)] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
