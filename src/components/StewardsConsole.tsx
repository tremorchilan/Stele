import React, { useState } from 'react';
import {
  Send,
  Inbox,
  Users,
  Scale,
  GitPullRequest,
  BookOpen,
  Plus,
  Check,
  Trash2,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { SteleItem, WikiPage, MemberPipelinePerson } from '../types';

interface StewardsConsoleProps {
  clubName: string;
  wikiPages: WikiPage[];
  pipeline: MemberPipelinePerson[];
  onAddTask: (task: Partial<SteleItem>) => void;
  onAddWikiPage: (page: Partial<WikiPage>) => void;
  onNominateSuccessor: (name: string, date: string) => void;
  isDark: boolean;
}

export const StewardsConsole: React.FC<StewardsConsoleProps> = ({
  clubName,
  wikiPages,
  pipeline,
  onAddTask,
  onAddWikiPage,
  onNominateSuccessor,
  isDark,
}) => {
  const [activeConsoleTab, setActiveConsoleTab] = useState<
    'delegate' | 'curate' | 'people' | 'fairness' | 'succession' | 'wiki'
  >('delegate');

  // Delegate Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskHours, setTaskHours] = useState('48');
  const [taskMinStage, setTaskMinStage] = useState('Trialist');
  const [taskTag, setTaskTag] = useState('Robotics');
  const [taskMessage, setTaskMessage] = useState('');
  const [taskSubmitted, setTaskSubmitted] = useState(false);

  // Curate Queue State
  const [curateQueue, setCurateQueue] = useState<SteleItem[]>([
    {
      id: 'curate-1',
      title: 'Regional Autonomous Quadcopter Challenge — Firmware Check',
      sourceInstitution: 'Division Aeronautics Board',
      sourceSpace: 'UAV Caucus',
      stewardName: 'Engr. Farid',
      provenance: 'Official',
      scope: 'division',
      deadline: new Date(Date.now() + 96 * 3600 * 1000).toISOString(),
      originalMessage:
        'Forwarded via Telegram Bot: Betaflight 4.4 gyro notch filters and failsafe switch demonstration required before field admission.',
      tags: ['Drones', 'Firmware', 'Aeronautics'],
    },
    {
      id: 'curate-2',
      title: 'Open Source CAD Modeling Sprint for Prosthetic Grippers',
      sourceInstitution: 'National Youth Innovation Labs',
      sourceSpace: 'Bio-Design',
      stewardName: 'Taslima Nasrin',
      provenance: 'Peer',
      scope: 'national',
      deadline: new Date(Date.now() + 120 * 3600 * 1000).toISOString(),
      originalMessage:
        'Forwarded via WhatsApp: SolidWorks or Fusion360 .step file exports of compliant finger mechanisms.',
      tags: ['CAD', 'Design', 'Prosthetics'],
    },
  ]);

  // Succession State
  const [successorName, setSuccessorName] = useState('Tahmid Hasan (Current Deputy)');
  const [departureDate, setDepartureDate] = useState('2026-11-30');
  const [handoverSaved, setHandoverSaved] = useState(false);

  // Wiki State
  const [selectedWikiPage, setSelectedWikiPage] = useState<WikiPage | null>(wikiPages[0] || null);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    onAddTask({
      title: taskTitle,
      sourceInstitution: 'Springfield High',
      sourceSpace: clubName,
      stewardName: 'Nafis Ahmed (Steward)',
      provenance: 'Institutional',
      scope: 'district',
      deadline: new Date(Date.now() + Number(taskHours) * 3600 * 1000).toISOString(),
      originalMessage: taskMessage || taskTitle,
      tags: [taskTag],
      requiresStage: taskMinStage,
      reachCount: 48,
      unseenCount: 0,
      lowFairnessFlag: false,
    });

    setTaskSubmitted(true);
    setTaskTitle('');
    setTaskMessage('');
    setTimeout(() => setTaskSubmitted(false), 3000);
  };

  const handleApproveCurate = (id: string) => {
    const item = curateQueue.find((i) => i.id === id);
    if (item) {
      onAddTask(item);
      setCurateQueue((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const handleDiscardCurate = (id: string) => {
    setCurateQueue((prev) => prev.filter((i) => i.id !== id));
  };

  const handleSuccessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNominateSuccessor(successorName, departureDate);
    setHandoverSaved(true);
    setTimeout(() => setHandoverSaved(false), 3000);
  };

  const consoleTabs: {
    id: 'delegate' | 'curate' | 'people' | 'fairness' | 'succession' | 'wiki';
    label: string;
    icon: React.ReactNode;
    count?: number;
  }[] = [
    { id: 'delegate', label: 'Delegate', icon: <Send className="w-4 h-4" /> },
    { id: 'curate', label: 'Curate', icon: <Inbox className="w-4 h-4" />, count: curateQueue.length },
    { id: 'people', label: 'People', icon: <Users className="w-4 h-4" /> },
    { id: 'fairness', label: 'Fairness', icon: <Scale className="w-4 h-4" /> },
    { id: 'succession', label: 'Succession', icon: <GitPullRequest className="w-4 h-4" /> },
    { id: 'wiki', label: 'Wiki', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <div
      id="stewards-console-container"
      className="w-full rounded-[20px] bg-[var(--card)] border border-[var(--rule-default)]/80 shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden my-6"
    >
      {/* Console Top Header */}
      <div className="p-4 md:p-6 border-b border-[var(--rule-default)]/60 bg-[var(--accent-soft)]/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[var(--accent)]">
            Executive Console · Sovereign Authority
          </span>
          <h2 className="text-[20px] font-bold text-[var(--text-primary)]">{clubName} Console</h2>
          <p className="text-[13px] text-[var(--text-secondary)]">
            Lead Steward: Nafis Ahmed · Operational memory & delegation desk
          </p>
        </div>

        {/* 6 Tabs as specified in White Paper Section 19 */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
          {consoleTabs.map((tab) => {
            const isActive = activeConsoleTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`console-tab-${tab.id}`}
                type="button"
                onClick={() => setActiveConsoleTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] text-[13px] font-medium transition-all shrink-0 ${
                  isActive
                    ? 'bg-[var(--accent)] text-white shadow-xs'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--card)] hover:text-[var(--text-primary)]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-bold">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Delegate */}
      {activeConsoleTab === 'delegate' && (
        <form onSubmit={handleCreateTask} className="p-6 flex flex-col gap-4 text-[14px]">
          <div>
            <h3 className="text-[16px] font-semibold text-[var(--text-primary)] mb-1">
              Create and Delegate Club Commitment
            </h3>
            <p className="text-[13px] text-[var(--text-secondary)]">
              Core members cannot delegate tasks; only Stewards can create verifiable commitments to prevent pad-ranking.
            </p>
          </div>

          {taskSubmitted && (
            <div className="p-3 rounded-[12px] bg-[var(--reward-done)]/15 border border-[var(--reward-done)]/40 text-[var(--reward-done)] text-[13px] font-medium flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Commitment broadcasted into tagged student radar feeds!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1">
                Task Title
              </label>
              <input
                id="delegate-task-title"
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g. Optical Sensor Breadboard Wiring & Pre-Calibration"
                required
                className="w-full p-2.5 rounded-[12px] bg-[var(--canvas)] border border-[var(--rule-default)] text-[14px] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1">
                Authoritative Clock Window
              </label>
              <select
                id="delegate-task-hours"
                value={taskHours}
                onChange={(e) => setTaskHours(e.target.value)}
                className="w-full p-2.5 rounded-[12px] bg-[var(--canvas)] border border-[var(--rule-default)] text-[14px] text-[var(--text-primary)]"
              >
                <option value="6">6 Hours (Critical &lt;24h pulse)</option>
                <option value="24">24 Hours (Critical boundary)</option>
                <option value="48">48 Hours (Urgent red 72-24h)</option>
                <option value="120">5 Days (Approaching grey)</option>
                <option value="360">15 Days (Ambient grey)</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1">
                Minimum Stage Required to Claim
              </label>
              <select
                id="delegate-task-stage"
                value={taskMinStage}
                onChange={(e) => setTaskMinStage(e.target.value)}
                className="w-full p-2.5 rounded-[12px] bg-[var(--canvas)] border border-[var(--rule-default)] text-[14px] text-[var(--text-primary)]"
              >
                <option value="Observer">Observer (Anyone)</option>
                <option value="Applicant">Applicant</option>
                <option value="Trialist">Trialist (Default)</option>
                <option value="Core">Core Member Only</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1">
                Broadcast Target Interest Tag
              </label>
              <input
                type="text"
                value={taskTag}
                onChange={(e) => setTaskTag(e.target.value)}
                placeholder="e.g. Robotics, Circuits, Firmware"
                className="w-full p-2.5 rounded-[12px] bg-[var(--canvas)] border border-[var(--rule-default)] text-[14px] text-[var(--text-primary)]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1">
                Verbatim Briefing Message
              </label>
              <textarea
                value={taskMessage}
                onChange={(e) => setTaskMessage(e.target.value)}
                placeholder="Specifications, component drawer IDs, testing guidelines..."
                rows={3}
                className="w-full p-2.5 rounded-[12px] bg-[var(--canvas)] border border-[var(--rule-default)] text-[14px] text-[var(--text-primary)]"
              />
            </div>
          </div>

          <div className="flex justify-end mt-2">
            <button
              id="delegate-submit-btn"
              type="submit"
              className="px-5 py-2.5 rounded-[14px] bg-[var(--accent)] text-white font-medium hover:opacity-90 active:scale-[0.97] transition-all flex items-center gap-2 shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Commitment</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Curate */}
      {activeConsoleTab === 'curate' && (
        <div className="p-6 flex flex-col gap-4 text-[14px]">
          <div>
            <h3 className="text-[16px] font-semibold text-[var(--text-primary)] mb-1">
              Curate Forwarded Items ({curateQueue.length} pending)
            </h3>
            <p className="text-[13px] text-[var(--text-secondary)]">
              Everything forwarded to the Stele ingestion bot lands here. Items untouched after 7 days drop automatically.
            </p>
          </div>

          {curateQueue.length === 0 ? (
            <div className="py-12 text-center text-[var(--text-muted)] text-[14px]">
              No forwarded opportunities pending curation today.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {curateQueue.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-[14px] bg-[var(--canvas)] border border-[var(--rule-default)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div>
                    <span className="text-[11px] px-2 py-0.5 rounded-[6px] bg-[var(--accent-soft)] text-[var(--accent)] font-semibold uppercase">
                      {item.provenance}
                    </span>
                    <h4 className="text-[15px] font-semibold text-[var(--text-primary)] mt-1">
                      {item.title}
                    </h4>
                    <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
                      {item.originalMessage}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleDiscardCurate(item.id)}
                      className="p-2 rounded-[12px] border border-[var(--rule-default)] text-[var(--text-muted)] hover:text-[var(--urgent)] transition-colors"
                      title="Discard item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApproveCurate(item.id)}
                      className="px-4 py-2 rounded-[12px] bg-[var(--accent)] text-white text-[13px] font-medium flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve to Board</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: People & Pipeline */}
      {activeConsoleTab === 'people' && (
        <div className="p-6 flex flex-col gap-4 text-[14px]">
          <div>
            <h3 className="text-[16px] font-semibold text-[var(--text-primary)] mb-1">
              Membership Pipeline & Promotion Review
            </h3>
            <p className="text-[13px] text-[var(--text-secondary)]">
              Observer → Applicant → Trialist → Core → Steward. Evidence appears only during promotion review.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px] border-collapse">
              <thead>
                <tr className="border-b border-[var(--rule-default)] text-[var(--text-muted)] uppercase text-[11px]">
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Current Role</th>
                  <th className="py-2.5 px-3">Claimed</th>
                  <th className="py-2.5 px-3">Completed</th>
                  <th className="py-2.5 px-3">Abandoned</th>
                  <th className="py-2.5 px-3">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--rule-default)]/40">
                {pipeline.map((p) => (
                  <tr key={p.id} className="hover:bg-[var(--accent-soft)]/20">
                    <td className="py-3 px-3 font-semibold text-[var(--text-primary)]">{p.name}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-[8px] text-[11px] font-medium bg-[var(--canvas)] border border-[var(--rule-default)]">
                        {p.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 tabular-nums">{p.claimedCount}</td>
                    <td className="py-3 px-3 tabular-nums text-[var(--reward-done)] font-medium">
                      {p.completedCount}
                    </td>
                    <td className="py-3 px-3 tabular-nums text-[var(--text-muted)]">{p.abandonedCount}</td>
                    <td className="py-3 px-3 text-[var(--text-secondary)]">{p.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Fairness */}
      {activeConsoleTab === 'fairness' && (
        <div className="p-6 flex flex-col gap-4 text-[14px]">
          <div>
            <h3 className="text-[16px] font-semibold text-[var(--text-primary)] mb-1">
              Did Students Actually See This? (DC-1 & DC-2 Checks)
            </h3>
            <p className="text-[13px] text-[var(--text-secondary)]">
              When an item expires, the Steward sees how many students never received or saw it. If &gt;50% missed or dropped outside reasonable hours, pulsing motion is suppressed for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-[14px] bg-[var(--canvas)] border border-[var(--rule-default)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-semibold text-[var(--text-primary)]">
                  Robotics Olympiad Qualifiers
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-[6px] bg-[var(--reward-done)]/15 text-[var(--reward-done)] font-medium">
                  Fair Drop (94% Reach)
                </span>
              </div>
              <p className="text-[12px] text-[var(--text-secondary)] mb-2">
                Broadcast at 10:15 AM on weekday. 226/240 active space members opened within 4 hours.
              </p>
              <div className="w-full h-2 rounded-full bg-[var(--rule-track)] overflow-hidden">
                <div className="w-[94%] h-full bg-[var(--reward-done)] rounded-full" />
              </div>
            </div>

            <div className="p-4 rounded-[14px] bg-[var(--canvas)] border border-[var(--urgent)]/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-semibold text-[var(--text-primary)]">
                  Campus Solar Energy Youth Audit
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-[6px] bg-[var(--urgent)]/15 text-[var(--urgent)] font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Flagged (41% Reach)
                </span>
              </div>
              <p className="text-[12px] text-[var(--text-secondary)] mb-2">
                Dropped at 23:45 PM. 38 students never saw notice prior to expiry. Motion pulsing suppressed by fairness protocol.
              </p>
              <div className="w-full h-2 rounded-full bg-[var(--rule-track)] overflow-hidden">
                <div className="w-[41%] h-full bg-[var(--urgent)] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Succession */}
      {activeConsoleTab === 'succession' && (
        <form onSubmit={handleSuccessionSubmit} className="p-6 flex flex-col gap-4 text-[14px]">
          <div>
            <h3 className="text-[16px] font-semibold text-[var(--text-primary)] mb-1">
              Succession & Authority Handover (White Paper Section 27)
            </h3>
            <p className="text-[13px] text-[var(--text-secondary)]">
              The invariant: no seat is ever permanently empty. The outgoing holder becomes alumni with read-only access permanently.
            </p>
          </div>

          {handoverSaved && (
            <div className="p-3 rounded-[12px] bg-[var(--reward-done)]/15 border border-[var(--reward-done)]/40 text-[var(--reward-done)] text-[13px] font-medium flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Succession registered. Handover wiki briefing created automatically!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1">
                Nominated Successor
              </label>
              <input
                type="text"
                value={successorName}
                onChange={(e) => setSuccessorName(e.target.value)}
                className="w-full p-2.5 rounded-[12px] bg-[var(--canvas)] border border-[var(--rule-default)] text-[14px] text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1">
                Handover Date (Authority Transfer)
              </label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full p-2.5 rounded-[12px] bg-[var(--canvas)] border border-[var(--rule-default)] text-[14px] text-[var(--text-primary)]"
              />
            </div>
          </div>

          <div className="p-4 rounded-[14px] bg-[var(--canvas)] border border-[var(--rule-default)] text-[13px] text-[var(--text-secondary)] flex flex-col gap-1">
            <span className="font-semibold text-[var(--text-primary)]">What Transfers:</span>
            <span>Role, settings, pending items, applicant pipeline, fairness history, full wiki, locker combinations.</span>
            <span className="font-semibold text-[var(--text-primary)] mt-2">What Stays:</span>
            <span>Private items belong to creator; outgoing Steward moves to Alumni read-only seat permanently.</span>
          </div>

          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-[14px] bg-[var(--accent)] text-white font-medium hover:opacity-90 active:scale-[0.97] transition-all shadow-xs"
            >
              Seal Successor Nomination
            </button>
          </div>
        </form>
      )}

      {/* Tab 6: Wiki */}
      {activeConsoleTab === 'wiki' && (
        <div className="p-6 flex flex-col md:flex-row gap-6 text-[14px]">
          {/* Wiki Page List */}
          <div className="md:w-1/3 flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] uppercase font-semibold text-[var(--text-muted)] tracking-wider">
                Club Wiki Memory
              </span>
              <span className="text-[11px] text-[var(--text-secondary)]">{wikiPages.length} Pages</span>
            </div>

            {wikiPages.map((page) => (
              <button
                key={page.id}
                type="button"
                onClick={() => setSelectedWikiPage(page)}
                className={`p-3 rounded-[12px] text-left border transition-all ${
                  selectedWikiPage?.id === page.id
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)]/20 ring-1 ring-[var(--accent)]'
                    : 'border-[var(--rule-default)] hover:border-[var(--text-primary)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[var(--accent)] uppercase tracking-wider">
                    {page.type}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] uppercase">v{page.version}</span>
                </div>
                <h5 className="text-[14px] font-semibold text-[var(--text-primary)] mt-1">
                  {page.title}
                </h5>
                <p className="text-[11px] text-[var(--text-muted)] mt-1">
                  Edited by {page.lastEditedBy}
                </p>
              </button>
            ))}
          </div>

          {/* Selected Wiki Content */}
          <div className="md:w-2/3 p-5 rounded-[16px] bg-[var(--canvas)] border border-[var(--rule-default)]">
            {selectedWikiPage ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--rule-default)]/60">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-[var(--accent)]">
                      {selectedWikiPage.type} · {selectedWikiPage.visibility} visibility
                    </span>
                    <h4 className="text-[18px] font-bold text-[var(--text-primary)]">
                      {selectedWikiPage.title}
                    </h4>
                  </div>
                  <span className="text-[12px] text-[var(--text-muted)]">
                    Last touched: {selectedWikiPage.lastEditedDate}
                  </span>
                </div>

                <div className="prose prose-sm max-w-none text-[14px] text-[var(--text-primary)] leading-[1.6] whitespace-pre-wrap font-mono">
                  {selectedWikiPage.content}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-[var(--text-muted)]">
                Select a wiki page to view club operational memory.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
