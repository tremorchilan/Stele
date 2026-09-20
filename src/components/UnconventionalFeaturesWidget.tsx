import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  EyeOff,
  ShieldCheck,
  Scale,
  BookOpen,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  Compass,
  Bookmark
} from 'lucide-react';

interface UnconventionalFeaturesWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFullOrigin?: () => void;
  isDark?: boolean;
}

interface FeatureItem {
  id: string;
  category: 'principles' | 'architecture' | 'institutional';
  title: string;
  tag: string;
  sectionRef: string;
  conventional: string;
  unconventional: string;
  liveExample: string;
  icon: React.ReactNode;
}

const UNCONVENTIONAL_FEATURES: FeatureItem[] = [
  {
    id: 'clock-urgency',
    category: 'principles',
    title: 'Clock-Driven Urgency',
    tag: 'Urgency Invariant',
    sectionRef: 'PRD §15',
    conventional: 'Admins and stewards flag announcements with custom red tags or "HIGH PRIORITY!" banners to manufacture synthetic panic.',
    unconventional: 'Urgency colour is set strictly by the mathematical clock. A Steward cannot make an item red. Only <24h triggers critical red. Missed items turn quiet grey dashed lines—never public red shame markers.',
    liveExample: 'Observed on Radar items, Commitments Board, and Home notice countdown rings.',
    icon: <Clock className="w-4 h-4 text-[#C9342B]" />,
  },
  {
    id: 'earned-motion',
    category: 'principles',
    title: 'Earned Motion Protocol',
    tag: 'Quiet Attention Invariant',
    sectionRef: 'WP §7 & PRD §15',
    conventional: 'Apps pulse, shake, and bounce icons automatically to manipulate users into clicking unopened notifications.',
    unconventional: 'Zero unsolicited motion on anything the student hasn’t engaged with. Motion is strictly an earned physical response to your active touch, never a demand for attention.',
    liveExample: 'Dynamic notch only pulses when you complete a task or toggle filters.',
    icon: <EyeOff className="w-4 h-4 text-[var(--accent)]" />,
  },
  {
    id: 'anti-pressure',
    category: 'principles',
    title: 'Anti-Pressure Architecture',
    tag: 'Honest Attention',
    sectionRef: 'WP §5 & §6',
    conventional: 'Phantom notification badges, countdown timers with false scarcity ("Only 3 spots left!"), and anxiety-inducing streak penalties.',
    unconventional: 'Nothing manufactures pressure that isn’t real. No fake countdowns, no psychological streaks, and no phantom red-dots. An empty feed on a slow day is the product working.',
    liveExample: 'Week Strip shows quiet activity dots without anxiety-inducing numerals.',
    icon: <ShieldCheck className="w-4 h-4 text-[var(--reward-done)]" />,
  },
  {
    id: 'scope-sorting',
    category: 'architecture',
    title: 'Scope-First, Deadline-Second Sorting',
    tag: 'Algorithmic Neutrality',
    sectionRef: 'WP §5, §6 & PRD §11',
    conventional: 'Feeds use algorithmic engagement loops, promoted cards, and popularity ranking to boost sponsored or loud clubs.',
    unconventional: 'Feeds sort strictly by geographic scope first (District → Division → National → International), then deadline ascending. No endorsements pin items. No popularity raises them. The student is the algorithm.',
    liveExample: 'Radar View feed displays identical-dimension cards ordered by scope ladders.',
    icon: <Scale className="w-4 h-4 text-[#D9A93D]" />,
  },
  {
    id: 'preview-stack',
    category: 'architecture',
    title: 'Preview Stack, Never a Feed',
    tag: 'Information Dignity',
    sectionRef: 'PRD §9 & §10',
    conventional: 'Home screens are infinite-scroll content streams designed to keep the student thumb scrolling endlessly.',
    unconventional: 'Home is a short vertical stack of preview cards (Commitments, Notices, Opportunities). It is a table of contents, not an infinite feed. Tap a card to expand it.',
    liveExample: 'Home View displays a fixed three-part card hierarchy with tap-to-expand details.',
    icon: <Bookmark className="w-4 h-4 text-[var(--accent)]" />,
  },
  {
    id: 'two-minute-retrospective',
    category: 'institutional',
    title: '2-Minute Retrospective Memory',
    tag: 'Operational Memory',
    sectionRef: 'PRD §20 & WP §1',
    conventional: 'Student tasks vanish into empty checkboxes without capturing institutional know-how, repeating mistakes each cohort.',
    unconventional: 'Completing a commitment prompts a brief, skippable 2-minute retrospective: "Anything worth remembering for next year? (What went well · What went wrong · What to change)" Captures tacit knowledge before leaders graduate.',
    liveExample: 'Board View: Completing a commitment launches the retrospective dialogue.',
    icon: <BookOpen className="w-4 h-4 text-[#A672D9]" />,
  },
  {
    id: 'fairness-telemetry',
    category: 'institutional',
    title: 'Fairness Telemetry & Suppression',
    tag: 'Fair Drop Audits',
    sectionRef: 'PRD §19',
    conventional: 'Clubs blast notices at 11:30 PM with zero accountability if half the student body was asleep.',
    unconventional: 'Stewards see reach audits before expiry. If >50% missed an item or it dropped outside reasonable daylight hours, attention pulsing is automatically suppressed across the system.',
    liveExample: 'Campus View → Stewards Console → Fairness tab audits item reach percentages.',
    icon: <AlertTriangle className="w-4 h-4 text-[#D9A93D]" />,
  },
  {
    id: 'succession-invariant',
    category: 'institutional',
    title: 'Zero-Empty-Seat Succession',
    tag: 'Continuity Invariant',
    sectionRef: 'WP §27',
    conventional: 'Student clubs collapse every graduation cycle because passwords and operational memory vanish.',
    unconventional: 'No leadership seat can ever be permanently empty. Outgoing stewards register a successor and handover date, auto-generating the handover briefing wiki and transitioning to read-only alumni status.',
    liveExample: 'Campus View → Stewards Console → Succession handover registration.',
    icon: <Sparkles className="w-4 h-4 text-[var(--accent)]" />,
  },
  {
    id: 'sovereign-ledger',
    category: 'institutional',
    title: 'Witnessed Sovereign Ledger',
    tag: 'Portable Credentials',
    sectionRef: 'WP §5, §17 & §26',
    conventional: 'Academic platforms lock achievements into proprietary walled gardens, mixing disciplinary marks and GPAs.',
    unconventional: 'Stele holds only peer-witnessed and steward-signed actions. Grades and test scores are permanently barred. The cryptographic signed JSON pack travels with the student across any school.',
    liveExample: 'Settings Sheet → View Sovereign Ledger & Export Signed JSON Pack.',
    icon: <CheckCircle2 className="w-4 h-4 text-[var(--reward-done)]" />,
  },
  {
    id: 'attention-monetization',
    category: 'principles',
    title: 'Ethical Attention Monetization',
    tag: 'Honest Economics',
    sectionRef: 'WP §5 & §24',
    conventional: 'Platforms sell student data, track behavioral cookies, or charge students fees to access educational opportunities.',
    unconventional: 'Schools publish free. NGOs and olympiads pay reduced rates. Commercial entities pay full rate. Revenue comes from whoever is buying attention, never from the students whose attention is bought.',
    liveExample: 'Radar provenance badges indicate Official Institutional vs Verified Federated publisher tiers.',
    icon: <DollarSign className="w-4 h-4 text-[#34C759]" />,
  },
];

export const UnconventionalFeaturesWidget: React.FC<UnconventionalFeaturesWidgetProps> = ({
  isOpen,
  onClose,
  onOpenFullOrigin,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'principles' | 'architecture' | 'institutional'>('all');
  const [activeFeatureId, setActiveFeatureId] = useState<string>('clock-urgency');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredFeatures = selectedCategory === 'all'
    ? UNCONVENTIONAL_FEATURES
    : UNCONVENTIONAL_FEATURES.filter((f) => f.category === selectedCategory);

  const activeFeature = UNCONVENTIONAL_FEATURES.find((f) => f.id === activeFeatureId) || filteredFeatures[0];

  return (
    <div
      id="unconventional-widget-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="unconventional-features-widget"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-[24px] stele-glassmorphic-overlay text-[var(--text)] transition-all shadow-2xl"
        style={{
          background: 'rgba(22, 22, 28, 0.92)',
          backdropFilter: 'blur(30px) saturate(190%)',
          WebkitBackdropFilter: 'blur(30px) saturate(190%)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.16)',
        }}
      >
        {/* Widget Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--rule-default)]/50 shrink-0 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[12px] bg-[var(--accent)]/15 border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] shadow-xs">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[17px] sm:text-[18px] font-bold text-[var(--text-primary)] leading-tight">
                  Unconventional Features
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold tracking-wider uppercase bg-[var(--accent-soft)] text-[var(--accent)]">
                  White Paper &amp; PRD v2.0
                </span>
              </div>
              <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">
                Core philosophical stances, sovereign invariants &amp; anti-slop rules
              </p>
            </div>
          </div>

          <button
            id="close-unconventional-widget-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/10 transition-colors"
            title="Close widget"
            aria-label="Close widget"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 border-b border-[var(--rule-default)]/30 overflow-x-auto no-scrollbar shrink-0 bg-black/15">
          {[
            { id: 'all', label: 'All Invariants (10)' },
            { id: 'principles', label: 'Constitutional Principles (WP §5–7)' },
            { id: 'architecture', label: 'Feed & Screen Architecture (PRD §9–11)' },
            { id: 'institutional', label: 'Institutional Memory (PRD §17–27)' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.id as any);
                const first = cat.id === 'all'
                  ? UNCONVENTIONAL_FEATURES[0]
                  : UNCONVENTIONAL_FEATURES.find((f) => f.category === cat.id);
                if (first) setActiveFeatureId(first.id);
              }}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[var(--accent)] text-white shadow-xs font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4">
          {/* Feature Quick Selector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {filteredFeatures.map((item) => {
              const isSelected = activeFeature?.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveFeatureId(item.id)}
                  className={`p-2.5 rounded-[14px] text-left transition-all flex flex-col justify-between border ${
                    isSelected
                      ? 'bg-[var(--accent)]/15 border-[var(--accent)] shadow-sm'
                      : 'bg-white/[0.03] border-[var(--rule-default)]/60 hover:bg-white/[0.06] hover:border-[var(--rule-default)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="p-1 rounded-[8px] bg-white/[0.06]">{item.icon}</span>
                    <span className="text-[10px] font-bold text-[var(--meta)] tracking-wider">
                      {item.sectionRef}
                    </span>
                  </div>
                  <span className={`text-[12px] font-semibold leading-tight ${isSelected ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                    {item.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Feature Deep Dive Card */}
          {activeFeature && (
            <div className="p-4 sm:p-5 rounded-[18px] bg-white/[0.03] border border-[var(--rule-default)] flex flex-col gap-3 animate-fadeIn">
              <div className="flex items-center justify-between gap-2 border-b border-[var(--rule-default)]/40 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-[12px] bg-[var(--accent-soft)]">
                    {activeFeature.icon}
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-[var(--text-primary)] leading-tight">
                      {activeFeature.title}
                    </h3>
                    <span className="text-[11.5px] font-medium text-[var(--accent)]">
                      {activeFeature.tag} · {activeFeature.sectionRef}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comparison Grid: Conventional vs Stele */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
                {/* Conventional Apps */}
                <div className="p-3.5 rounded-[14px] bg-red-500/10 border border-red-500/20 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-red-400 font-semibold text-[11.5px] uppercase tracking-wider">
                    <X className="w-3.5 h-3.5" />
                    <span>Conventional Pattern</span>
                  </div>
                  <p className="text-[var(--text-secondary)] leading-relaxed text-[12.5px]">
                    {activeFeature.conventional}
                  </p>
                </div>

                {/* Stele Invariant */}
                <div className="p-3.5 rounded-[14px] bg-[var(--accent)]/10 border border-[var(--accent)]/30 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-[var(--accent)] font-semibold text-[11.5px] uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Stele Invariant</span>
                  </div>
                  <p className="text-[var(--text-primary)] leading-relaxed text-[12.5px] font-medium">
                    {activeFeature.unconventional}
                  </p>
                </div>
              </div>

              {/* Live Where to Observe */}
              <div className="p-2.5 rounded-[12px] bg-white/[0.02] border border-[var(--rule-default)]/40 flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <span className="text-[10.5px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
                    In Action:
                  </span>
                  <span>{activeFeature.liveExample}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 border-t border-[var(--rule-default)]/40 flex items-center justify-between gap-3 shrink-0 bg-white/[0.02]">
          {onOpenFullOrigin ? (
            <button
              id="open-full-origin-from-widget-btn"
              type="button"
              onClick={onOpenFullOrigin}
              className="text-[12.5px] text-[var(--accent)] hover:underline font-medium flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>Read Full White Paper &amp; PRD (v2.0)</span>
            </button>
          ) : <div />}

          <button
            id="dismiss-unconventional-widget-btn"
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-[12px] bg-[var(--accent)] text-white text-[13px] font-semibold hover:opacity-90 active:scale-95 transition-all shadow-xs"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
