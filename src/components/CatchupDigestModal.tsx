import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Users,
  MessageSquare,
  ArrowRight,
  Plus,
  Flame,
  Clock,
  Send,
  Zap,
} from 'lucide-react';
import { DispatchMessage, CommunicationChannel } from '../types';

export interface CatchupTask {
  id: string;
  title: string;
  deadline: string;
  points: number;
  channelName: string;
  channelCategory: 'common' | 'private';
  senderName: string;
  isClaimed?: boolean;
}

interface CatchupDigestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimTask: (task: { title: string; deadline: string; points: number; channelName: string }) => void;
  onOpenChannel?: (channelId: string) => void;
  isDark: boolean;
}

export const CatchupDigestModal: React.FC<CatchupDigestModalProps> = ({
  isOpen,
  onClose,
  onClaimTask,
  onOpenChannel,
  isDark,
}) => {
  const [activeGroupTab, setActiveGroupTab] = useState<'all' | 'common' | 'private'>('all');
  const [claimedTaskIds, setClaimedTaskIds] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const additionWorthyTasks: CatchupTask[] = [
    {
      id: 'task-digest-1',
      title: 'Submit Thermodynamics Problem Set into Tray 204',
      deadline: 'Today, 2:00 PM',
      points: 40,
      channelName: 'Section 11-A Commons',
      channelCategory: 'common',
      senderName: 'Nadia Rahman & Tariq',
    },
    {
      id: 'task-digest-2',
      title: 'Solder 4x TCRT5000 IR Sensor Arrays for Line-Follower',
      deadline: 'Today, 4:30 PM',
      points: 60,
      channelName: 'Robotics Society',
      channelCategory: 'common',
      senderName: 'Zubair Al-Mahmud (Lead Steward)',
    },
    {
      id: 'task-digest-3',
      title: 'Mill Center Rib on Line-Follower Chassis (-15% weight)',
      deadline: 'Tomorrow, 2:00 PM',
      points: 45,
      channelName: 'Private DM · Zubair Al-Mahmud',
      channelCategory: 'private',
      senderName: 'Zubair Al-Mahmud',
    },
    {
      id: 'task-digest-4',
      title: 'Volunteer 45m Peer Tutoring on Projectile Motion for 9-B',
      deadline: 'Tomorrow, 4:00 PM',
      points: 50,
      channelName: 'Peer Tutoring Guild (Student Commons)',
      channelCategory: 'common',
      senderName: 'Zareen Tasnim',
    },
    {
      id: 'task-digest-5',
      title: 'Inspect Extended Friday Lab Protocol Notice (Bay 3)',
      deadline: 'Today, 6:00 PM',
      points: 15,
      channelName: 'Official Campus Circulars',
      channelCategory: 'common',
      senderName: 'Office of the Principal (Dr. Vance)',
    },
  ];

  const handleClaim = (task: CatchupTask) => {
    setClaimedTaskIds((prev) => ({ ...prev, [task.id]: true }));
    onClaimTask({
      title: task.title,
      deadline: task.deadline,
      points: task.points,
      channelName: task.channelName,
    });
  };

  const filteredTasks = additionWorthyTasks.filter((t) => {
    if (activeGroupTab === 'all') return true;
    return t.channelCategory === activeGroupTab;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs android-popup-backdrop">
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-[24px] shadow-2xl border overflow-hidden android-popup-widget ${
          isDark
            ? 'bg-[#14171F] border-[rgba(255,255,255,0.1)] text-[#E8ECF2]'
            : 'bg-white border-[#E2E8F0] text-[#1E293B]'
        }`}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-[var(--track)] flex items-center justify-center border border-[var(--rule)] text-[var(--accent)]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[18px] sm:text-[20px] font-extrabold tracking-tight">
                  Catch-up Digest
                </h2>
                <span className="px-2 py-0.5 rounded-[6px] bg-[var(--tile-active)] border border-[var(--rule)] text-[var(--text-sub)] text-[10.5px] font-medium tracking-wide flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Surveillance-Shielded</span>
                </span>
              </div>
              <p className="text-[12px] sm:text-[13px] text-[var(--meta)] mt-0.5">
                AI noise synthesis of missed interactions across Common groups and Private DMs.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Catch-up Digest"
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-[var(--meta)] hover:text-[var(--text)] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Filters */}
        <div className="px-5 py-3 border-b border-[rgba(255,255,255,0.06)] bg-[var(--track)] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveGroupTab('all')}
              className={`px-3 py-1 rounded-[10px] text-[12px] font-bold transition-all ${
                activeGroupTab === 'all'
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--meta)] hover:text-[var(--text)]'
              }`}
            >
              All Missed ({additionWorthyTasks.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveGroupTab('common')}
              className={`px-3 py-1 rounded-[10px] text-[12px] font-bold transition-all flex items-center gap-1 ${
                activeGroupTab === 'common'
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--meta)] hover:text-[var(--text)]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Common Groups (4)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveGroupTab('private')}
              className={`px-3 py-1 rounded-[10px] text-[12px] font-bold transition-all flex items-center gap-1 ${
                activeGroupTab === 'private'
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--meta)] hover:text-[var(--text)]'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Private DMs (1)</span>
            </button>
          </div>

          <span className="text-[11px] text-[var(--meta)] hidden sm:inline">
            Zero telemetry · Local device execution
          </span>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Missed Context Briefing Cards */}
          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-wider text-[var(--accent)] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Synthesized Briefings</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Common Groups Briefing */}
              {(activeGroupTab === 'all' || activeGroupTab === 'common') && (
                <div className="p-3.5 rounded-[16px] bg-[var(--tile)] border border-[rgba(255,255,255,0.06)] shadow-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-sky-400 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>Section 11-A &amp; Clubs</span>
                    </span>
                    <span className="text-[10.5px] text-[var(--meta)]">3 conversations</span>
                  </div>
                  <p className="text-[12.5px] text-[var(--text)] leading-snug">
                    Entropy conversion error resolved on Carnot cycle problem set (page 84). Physical homework submission required in Tray 204 before 2:00 PM. Robotics team stacked acrylic chassis on Bench 2.
                  </p>
                </div>
              )}

              {/* Private Groups Briefing */}
              {(activeGroupTab === 'all' || activeGroupTab === 'private') && (
                <div className="p-3.5 rounded-[16px] bg-[var(--tile)] border border-[rgba(156,124,248,0.25)] shadow-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-[#BFA6FF] flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Private E2E DMs</span>
                    </span>
                    <span className="text-[10.5px] text-[#BFA6FF]/80">Encrypted Enclave</span>
                  </div>
                  <p className="text-[12.5px] text-[var(--text)] leading-snug">
                    Zubair left a carbide milling bit on Bench 2 to mill 15% out of the center rib. Zareen refined Asian Parliamentary rebuttal constructive notes for debate practice.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actionable Commitments List */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-[13px] font-bold uppercase tracking-wider text-[var(--text)] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" />
                <span>Addition-Worthy Tasks &amp; Commitments</span>
              </h3>
              <span className="text-[11.5px] text-[var(--meta)]">
                Claiming awards sovereign points directly
              </span>
            </div>

            <div className="space-y-2.5">
              {filteredTasks.map((task) => {
                const isClaimed = claimedTaskIds[task.id];
                return (
                  <div
                    key={task.id}
                    className={`p-3.5 rounded-[16px] border transition-all flex items-start sm:items-center justify-between gap-3 ${
                      isClaimed
                        ? 'bg-[var(--tile-active)] border-[var(--rule)] opacity-85'
                        : 'bg-[var(--tile)] border-[rgba(255,255,255,0.06)] hover:-translate-y-0.5 hover:shadow-xs'
                    }`}
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10.5px] px-2 py-0.5 rounded-[6px] font-semibold uppercase bg-[var(--track)] border border-[var(--rule)] text-[var(--text-sub)]">
                          {task.channelName}
                        </span>
                        <span className="text-[11px] text-[var(--meta)]">
                          From {task.senderName}
                        </span>
                      </div>
                      <h4 className="text-[14px] font-bold text-[var(--text)]">
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-3 text-[12px] text-[var(--meta)]">
                        <span className="flex items-center gap-1 text-[var(--orange)]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{task.deadline}</span>
                        </span>
                        <span className="font-bold text-[var(--amber)]">
                          +{task.points} pts
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isClaimed}
                      onClick={() => handleClaim(task)}
                      className={`px-3.5 py-2 rounded-[12px] text-[12px] font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                        isClaimed
                          ? 'bg-[var(--track)] text-[var(--text-sub)] border border-[var(--rule)] cursor-default'
                          : 'bg-[var(--accent)] text-white hover:brightness-110 active:scale-95 shadow-xs'
                      }`}
                    >
                      {isClaimed ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Added to Board</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Commitments</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[var(--track)] border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[12px] text-[var(--meta)]">
            <Lock className="w-3.5 h-3.5 text-[var(--meta)]" />
            <span>Encrypted local storage enclave · Authority blinded</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-[10px] bg-[var(--tile)] border border-[rgba(255,255,255,0.08)] text-[12.5px] font-semibold text-[var(--text)] hover:-translate-y-0.5 hover:shadow-xs transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
