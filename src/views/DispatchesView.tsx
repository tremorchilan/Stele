import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Users,
  QrCode,
  Sparkles,
  MessageSquare,
  Lock,
  Search,
} from 'lucide-react';
import { CampusDispatchesHub } from '../components/CampusDispatchesHub';
import { FriendIndexModal } from '../components/FriendIndexModal';
import { Role, CommunicationChannel, DispatchMessage, FriendPeer } from '../types';

interface DispatchesViewProps {
  channels?: CommunicationChannel[];
  messages?: DispatchMessage[];
  currentRole: Role;
  studentName?: string;
  onSendMessage?: (channelId: string, content: string) => void;
  onConvertToActionableTask?: (task: { title: string; deadline: string; points: number; channelName: string }) => void;
  onNavigateBack: () => void;
  onOpenCatchupDigest?: () => void;
  friends?: FriendPeer[];
  onAddFriend?: (peer: FriendPeer) => void;
  isDark: boolean;
}

export const DispatchesView: React.FC<DispatchesViewProps> = ({
  channels = [],
  messages = [],
  currentRole,
  studentName = 'Shadman Shakib',
  onSendMessage,
  onConvertToActionableTask,
  onNavigateBack,
  onOpenCatchupDigest,
  friends,
  onAddFriend,
  isDark,
}) => {
  const [friendIndexOpen, setFriendIndexOpen] = useState(false);
  const [activePeerDM, setActivePeerDM] = useState<string | null>(null);

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto pb-28">
      {/* Top Header Banner */}
      <div className="p-4 sm:p-5 border-b border-[rgba(255,255,255,0.08)] bg-[var(--tile)]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onNavigateBack}
              className="p-2 rounded-[12px] bg-[var(--track)] border border-[rgba(255,255,255,0.08)] text-[var(--text)] hover:border-[var(--accent)] transition-all cursor-pointer"
              title="Return to Campus"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[20px] sm:text-[24px] font-extrabold text-[var(--text)] tracking-tight">
                  Calm Dispatches
                </h1>
                <span className="px-2.5 py-0.5 rounded-[8px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Anti-Surveillance Enclave</span>
                </span>
              </div>
              <p className="text-[12.5px] text-[var(--meta)] mt-0.5">
                Institutional &amp; autonomous student communications with guaranteed privacy for informal student commons.
              </p>
            </div>
          </div>

          {/* Action Header Buttons */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            {onOpenCatchupDigest && (
              <button
                type="button"
                onClick={onOpenCatchupDigest}
                className="px-3 py-1.5 rounded-[12px] bg-[var(--accent-soft)] border border-[var(--accent)]/30 text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all text-[12px] font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Catch-up Digest</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setFriendIndexOpen(true)}
              className="px-3.5 py-1.5 rounded-[12px] bg-[var(--track)] border border-[rgba(255,255,255,0.1)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all text-[12px] font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Users className="w-3.5 h-3.5 text-sky-400" />
              <span>Friend Index &amp; QR</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Hub Body */}
      <div className="max-w-6xl mx-auto w-full p-3 sm:p-5">
        <CampusDispatchesHub
          channels={channels}
          messages={messages}
          currentRole={currentRole}
          studentName={studentName}
          onSendMessage={onSendMessage || ((ch, text) => {})}
          onConvertToActionableTask={onConvertToActionableTask || (() => {})}
          isDark={isDark}
        />
      </div>

      {/* Friend Index & QR Modal */}
      <FriendIndexModal
        isOpen={friendIndexOpen}
        onClose={() => setFriendIndexOpen(false)}
        friends={friends}
        onAddFriend={onAddFriend}
        onOpenPeerDM={(peerName) => {
          setActivePeerDM(peerName);
        }}
        isDark={isDark}
      />
    </div>
  );
};
