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
    <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden">
      {/* Top Header Banner */}
      <div className="px-3 sm:px-4 py-2 sm:py-2.5 border-b border-[rgba(255,255,255,0.08)] bg-[var(--tile)] shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={onNavigateBack}
              className="p-1.5 px-2.5 rounded-[10px] bg-[var(--track)] border border-[rgba(255,255,255,0.08)] text-[var(--text)] hover:-translate-y-0.5 hover:shadow-xs hover:text-[var(--accent)] transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
              title="Return to Campus"
            >
              <ArrowLeft className="w-4 h-4 text-[var(--accent)]" />
              <span className="text-[12px] font-semibold">Back to Campus</span>
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-[17px] sm:text-[20px] font-extrabold text-[var(--text)] tracking-tight truncate">
                  Messenger
                </h1>
                <span className="px-1.5 py-0.5 rounded-[6px] bg-[var(--tile-active)] border border-[var(--rule)] text-[var(--text-sub)] text-[10.5px] font-medium tracking-wide flex items-center gap-1 shrink-0">
                  <ShieldCheck className="w-3 h-3 text-[var(--accent)]" />
                  <span className="hidden xs:inline">Anti-Surveillance</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Header Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {onOpenCatchupDigest && (
              <button
                type="button"
                onClick={onOpenCatchupDigest}
                className="px-2.5 py-1 rounded-[10px] bg-[var(--accent-soft)] border border-[var(--accent)]/30 text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all text-[11.5px] font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Catch-up Digest</span>
                <span className="sm:hidden">Digest</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setFriendIndexOpen(true)}
              className="px-2.5 py-1 rounded-[10px] bg-[var(--track)] border border-[rgba(255,255,255,0.1)] text-[var(--text)] hover:-translate-y-0.5 hover:shadow-xs hover:text-[var(--accent)] transition-all text-[11.5px] font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Friend Index</span>
              <span className="sm:hidden">Friends</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Hub Body: Takes 100% of remaining height cleanly */}
      <div className="w-full max-w-7xl mx-auto p-1 sm:p-3 flex-1 flex flex-col min-h-0 overflow-hidden">
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
