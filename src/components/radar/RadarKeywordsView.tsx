import React, { useState } from 'react';
import { SteleItem, Commitment } from '../../types';
import { CardItem } from '../CardItem';
import {
  Tag,
  Plus,
  Trash2,
  Bell,
  BellOff,
  Check,
  Search,
  Sparkles,
  SlidersHorizontal,
  Compass,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface RadarKeywordsViewProps {
  items: SteleItem[];
  commitments: Commitment[];
  onSelectItem: (item: SteleItem) => void;
  isDark: boolean;
}

interface TrackedKeyword {
  id: string;
  word: string;
  addedDate: string;
  isQuiet: boolean;
  category: string;
}

const DEFAULT_KEYWORDS: TrackedKeyword[] = [
  { id: 'kw-1', word: 'Robotics', addedDate: '2025-08-20', isQuiet: false, category: 'Engineering' },
  { id: 'kw-2', word: 'Olympiad', addedDate: '2025-08-22', isQuiet: false, category: 'Competition' },
  { id: 'kw-3', word: 'Debate', addedDate: '2025-08-25', isQuiet: true, category: 'Public Speaking' },
  { id: 'kw-4', word: 'Machine Learning', addedDate: '2025-09-02', isQuiet: false, category: 'AI & Data' },
  { id: 'kw-5', word: 'Physics', addedDate: '2025-09-05', isQuiet: false, category: 'Sciences' },
  { id: 'kw-6', word: 'Hardware', addedDate: '2025-09-10', isQuiet: true, category: 'FabLab' },
];

const SUGGESTED_KEYWORDS = [
  'Bioinformatics',
  'Autonomous Drones',
  'Mathematics',
  'Fellowship',
  'Cybersecurity',
  'FabLab',
  'Astronomy',
  'Quantum',
];

export const RadarKeywordsView: React.FC<RadarKeywordsViewProps> = ({
  items,
  commitments,
  onSelectItem,
  isDark,
}) => {
  const [keywords, setKeywords] = useState<TrackedKeyword[]>(() => {
    const saved = localStorage.getItem('stele_radar_keywords');
    return saved ? JSON.parse(saved) : DEFAULT_KEYWORDS;
  });
  const [newWordInput, setNewWordInput] = useState('');
  const [activeKeywordFilter, setActiveKeywordFilter] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast((cur) => (cur === msg ? null : cur)), 2500);
  };

  const handleAddKeyword = (wordToAdd?: string) => {
    const word = (wordToAdd || newWordInput).trim();
    if (!word) return;
    if (keywords.some((k) => k.word.toLowerCase() === word.toLowerCase())) {
      showToast(`"${word}" is already tracked`);
      return;
    }

    const newKeyword: TrackedKeyword = {
      id: `kw-${Date.now()}`,
      word,
      addedDate: new Date().toISOString().split('T')[0],
      isQuiet: false,
      category: 'Student Tracked',
    };

    const updated = [newKeyword, ...keywords];
    setKeywords(updated);
    localStorage.setItem('stele_radar_keywords', JSON.stringify(updated));
    setNewWordInput('');
    showToast(`Keyword "${word}" added to sovereign radar`);
  };

  const handleRemoveKeyword = (id: string, word: string) => {
    const updated = keywords.filter((k) => k.id !== id);
    setKeywords(updated);
    localStorage.setItem('stele_radar_keywords', JSON.stringify(updated));
    if (activeKeywordFilter?.toLowerCase() === word.toLowerCase()) {
      setActiveKeywordFilter(null);
    }
    showToast(`Removed "${word}" from tracked keywords`);
  };

  const handleToggleQuiet = (id: string) => {
    const updated = keywords.map((k) => (k.id === id ? { ...k, isQuiet: !k.isQuiet } : k));
    setKeywords(updated);
    localStorage.setItem('stele_radar_keywords', JSON.stringify(updated));
    const target = updated.find((k) => k.id === id);
    showToast(`"${target?.word}" alerts set to ${target?.isQuiet ? 'Quiet Plasma' : 'Active Signal'}`);
  };

  // Calculate matches in items for each keyword
  const getMatchCount = (word: string) => {
    const lower = word.toLowerCase();
    return items.filter((item) => {
      const inTitle = item.title.toLowerCase().includes(lower);
      const inDesc = item.originalMessage.toLowerCase().includes(lower);
      const inTags = item.tags.some((t) => t.toLowerCase().includes(lower));
      return inTitle || inDesc || inTags;
    }).length;
  };

  // Filter items matching activeKeywordFilter (or all tracked keywords if no specific one selected)
  const matchedItems = items.filter((item) => {
    if (activeKeywordFilter) {
      const lower = activeKeywordFilter.toLowerCase();
      return (
        item.title.toLowerCase().includes(lower) ||
        item.originalMessage.toLowerCase().includes(lower) ||
        item.tags.some((t) => t.toLowerCase().includes(lower))
      );
    }
    // Match any tracked keyword
    return keywords.some((k) => {
      const lower = k.word.toLowerCase();
      return (
        item.title.toLowerCase().includes(lower) ||
        item.originalMessage.toLowerCase().includes(lower) ||
        item.tags.some((t) => t.toLowerCase().includes(lower))
      );
    });
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-[12px] bg-slate-900/95 text-white border border-slate-700 text-[12.5px] font-bold shadow-2xl flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Header Info Banner */}
      <div className="p-5 rounded-[22px] bg-[var(--card)] border border-[var(--rule-default)] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent)] font-mono">
                Sovereign Discovery Filters
              </span>
              <span className="text-[10.5px] px-2 py-0.5 rounded-[6px] bg-sky-500/15 text-sky-400 font-bold">
                {keywords.length} Tracked
              </span>
            </div>
            <h2 className="text-[20px] font-extrabold text-[var(--text-primary)] mt-1">
              My Tracked Keywords
            </h2>
            <p className="text-[13px] text-[var(--text-secondary)] mt-0.5 max-w-2xl">
              Stele's anti-algorithmic radar monitors opportunities strictly against your declared keywords. No engagement bait, no predictive profiling.
            </p>
          </div>

          <div className="p-3 rounded-[16px] bg-[var(--canvas)] border border-[var(--rule-default)] text-center sm:text-right shrink-0">
            <span className="text-[20px] font-extrabold font-mono text-[var(--accent)] block">
              {matchedItems.length}
            </span>
            <span className="text-[11px] text-[var(--text-secondary)] font-semibold uppercase tracking-wider">
              Matching Opportunities
            </span>
          </div>
        </div>

        {/* Add Keyword Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddKeyword();
          }}
          className="mt-4 pt-4 border-t border-[var(--rule-default)] flex flex-col sm:flex-row gap-2"
        >
          <div className="relative flex-1">
            <Tag className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={newWordInput}
              onChange={(e) => setNewWordInput(e.target.value)}
              placeholder="Add tracked keyword (e.g., Quantum Computing, Bioethics, Math Olympiad)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-[12px] bg-[var(--canvas)] border border-[var(--rule-default)] text-[13px] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent)] transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-[12px] bg-[var(--accent)] text-white text-[13px] font-bold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Track Keyword</span>
          </button>
        </form>

        {/* Suggested Keywords Strip */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[12px]">
          <span className="text-[var(--text-secondary)] text-[11.5px] font-medium mr-1">Suggestions:</span>
          {SUGGESTED_KEYWORDS.map((sug) => {
            const isTracked = keywords.some((k) => k.word.toLowerCase() === sug.toLowerCase());
            return (
              <button
                key={sug}
                type="button"
                disabled={isTracked}
                onClick={() => handleAddKeyword(sug)}
                className={`px-2.5 py-1 rounded-[8px] text-[11px] font-medium transition-all cursor-pointer ${
                  isTracked
                    ? 'opacity-40 line-through bg-[var(--canvas)] text-[var(--text-muted)]'
                    : 'bg-[var(--canvas)] border border-[var(--rule-default)] text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                }`}
              >
                + {sug}
              </button>
            );
          })}
        </div>
      </div>

      {/* Keywords Management Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[15px] font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            <span>Active Tracked Keywords ({keywords.length})</span>
          </h3>
          {activeKeywordFilter && (
            <button
              type="button"
              onClick={() => setActiveKeywordFilter(null)}
              className="text-[12px] text-[var(--accent)] hover:underline font-medium cursor-pointer"
            >
              Clear filter (showing all)
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {keywords.map((kw) => {
            const count = getMatchCount(kw.word);
            const isSelected = activeKeywordFilter?.toLowerCase() === kw.word.toLowerCase();

            return (
              <div
                key={kw.id}
                onClick={() => setActiveKeywordFilter(isSelected ? null : kw.word)}
                className={`p-3.5 rounded-[16px] border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[var(--accent)]/10 border-[var(--accent)] shadow-xs'
                    : 'bg-[var(--card)] border-[var(--rule-default)] hover:border-[var(--rule-default)]/80'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[14px] font-bold text-[var(--text-primary)] block">
                      #{kw.word}
                    </span>
                    <span className="text-[11px] text-[var(--text-secondary)] font-mono">
                      {kw.category} · Added {kw.addedDate}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-[6px] text-[11px] font-mono font-bold ${
                      count > 0
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-[var(--canvas)] text-[var(--text-muted)]'
                    }`}
                  >
                    {count} {count === 1 ? 'match' : 'matches'}
                  </span>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[var(--rule-default)] flex items-center justify-between text-[11.5px]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleQuiet(kw.id);
                    }}
                    className={`flex items-center gap-1 font-medium transition-colors cursor-pointer ${
                      kw.isQuiet
                        ? 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                        : 'text-sky-400 hover:text-sky-300'
                    }`}
                    title={kw.isQuiet ? 'Quiet plasma (no ring)' : 'Signal active'}
                  >
                    {kw.isQuiet ? <BellOff className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                    <span>{kw.isQuiet ? 'Quiet' : 'Live Signal'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-[10.5px] text-[var(--accent)] font-semibold">
                      {isSelected ? 'Filtering Feed' : 'Inspect'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveKeyword(kw.id, kw.word);
                      }}
                      className="p-1 rounded-[6px] hover:bg-rose-500/10 text-[var(--text-muted)] hover:text-rose-400 transition-all cursor-pointer"
                      title="Remove keyword"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Matching Opportunities Feed Section */}
      <div className="pt-4 border-t border-[var(--rule-default)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[17px] font-extrabold text-[var(--text-primary)]">
              {activeKeywordFilter
                ? `Opportunities Matching "#${activeKeywordFilter}" (${matchedItems.length})`
                : `All Keyword-Matched Opportunities (${matchedItems.length})`}
            </h3>
            <p className="text-[12.5px] text-[var(--text-secondary)]">
              {activeKeywordFilter
                ? `Filtered strictly by keyword "#${activeKeywordFilter}". Click the card to view details or commit.`
                : 'Aggregated feed derived from your active tracked keyword portfolio.'}
            </p>
          </div>
        </div>

        {matchedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchedItems.map((item) => (
              <CardItem
                key={item.id}
                item={item}
                isEngaged={commitments.some((c) => c.itemId === item.id)}
                onSelect={onSelectItem}
                isHero={false}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-[20px] bg-[var(--card)] border border-[var(--rule-default)] text-center">
            <p className="text-[14px] text-[var(--text-secondary)]">
              No opportunities currently match your tracked keyword filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
