import React, { useState } from 'react';
import { SteleItem, Commitment } from '../../types';
import { CardItem } from '../CardItem';
import {
  Bookmark,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  FolderArchive,
  Compass,
} from 'lucide-react';

interface RadarSavedTasksViewProps {
  items: SteleItem[];
  commitments: Commitment[];
  onSelectItem: (item: SteleItem) => void;
  isDark: boolean;
}

interface SavedSearchQuery {
  id: string;
  name: string;
  scope: string;
  category: string;
  lastRun: string;
  itemCount: number;
}

const DEFAULT_SAVED_SEARCHES: SavedSearchQuery[] = [
  {
    id: 'sq-1',
    name: 'National Olympiads & Contests with Zero Fee',
    scope: 'National',
    category: 'STEM & Math',
    lastRun: 'Today, 8:30 AM',
    itemCount: 4,
  },
  {
    id: 'sq-2',
    name: 'District Fabrication Workshops & Lab Passes',
    scope: 'District',
    category: 'Hardware & CAD',
    lastRun: 'Yesterday',
    itemCount: 3,
  },
  {
    id: 'sq-3',
    name: 'Asian Parliamentary Debate & Public Speaking',
    scope: 'International',
    category: 'Debate Guild',
    lastRun: 'Sep 16',
    itemCount: 2,
  },
];

export const RadarSavedTasksView: React.FC<RadarSavedTasksViewProps> = ({
  items,
  commitments,
  onSelectItem,
  isDark,
}) => {
  const [savedSearchQueries, setSavedSearchQueries] = useState<SavedSearchQuery[]>(DEFAULT_SAVED_SEARCHES);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'watched' | 'competitions' | 'grants'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage((cur) => (cur === msg ? null : cur)), 2500);
  };

  // Watched commitments or items marked as watched
  const watchedItemIds = new Set(
    commitments.filter((c) => c.status === 'watched').map((c) => c.itemId)
  );

  // Saved discovery items: includes watched items and sample starred radar items
  const savedItems = items.filter((item) => {
    const isWatched = watchedItemIds.has(item.id);
    if (selectedFilter === 'watched') return isWatched;
    if (selectedFilter === 'competitions') {
      return item.tags.some((t) => t.toLowerCase().includes('competition') || t.toLowerCase().includes('olympiad'));
    }
    if (selectedFilter === 'grants') {
      return item.tags.some((t) => t.toLowerCase().includes('grant') || t.toLowerCase().includes('fellowship'));
    }
    // Default: return items that are watched OR have high discovery priority
    return isWatched || item.isInstitutionOnly || item.scope === 'national';
  });

  const handleRunQuery = (query: SavedSearchQuery) => {
    showToast(`Executed search "${query.name}" · ${query.itemCount} items refreshed`);
  };

  const handleDeleteQuery = (id: string, name: string) => {
    setSavedSearchQueries((prev) => prev.filter((q) => q.id !== id));
    showToast(`Removed saved discovery query "${name}"`);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-[12px] bg-slate-900/95 text-white border border-slate-700 text-[12.5px] font-bold shadow-2xl flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Info Banner */}
      <div className="p-5 rounded-[22px] bg-[var(--card)] border border-[var(--rule-default)] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent)] font-mono">
                Discovery Preservation Enclave
              </span>
              <span className="text-[10.5px] px-2 py-0.5 rounded-[6px] bg-emerald-500/15 text-emerald-400 font-bold">
                {savedItems.length} Bookmarked
              </span>
            </div>
            <h2 className="text-[20px] font-extrabold text-[var(--text-primary)] mt-1">
              Saved Discovery Tasks &amp; Queries
            </h2>
            <p className="text-[13px] text-[var(--text-secondary)] mt-0.5 max-w-2xl">
              Archived opportunities, bookmarked query criteria, and pipeline exploration tasks saved for deliberate sovereign review.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-3 rounded-[16px] bg-[var(--canvas)] border border-[var(--rule-default)] text-center sm:text-right">
              <span className="text-[20px] font-extrabold font-mono text-emerald-400 block">
                {watchedItemIds.size}
              </span>
              <span className="text-[11px] text-[var(--text-secondary)] font-semibold uppercase tracking-wider">
                Watched on Board
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Search Queries & Alert Pipelines */}
      <div>
        <h3 className="text-[15px] font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-[var(--accent)]" />
          <span>Saved Radar Search Subscriptions ({savedSearchQueries.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {savedSearchQueries.map((query) => (
            <div
              key={query.id}
              className="p-4 rounded-[18px] bg-[var(--card)] border border-[var(--rule-default)] hover:border-[var(--accent)]/40 transition-all flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="pill pill-sm">
                    {query.scope}
                  </span>
                  <span className="text-[11px] text-[var(--text-secondary)]">
                    {query.itemCount} items found
                  </span>
                </div>

                <h4 className="text-[14px] font-bold text-[var(--text-primary)] leading-snug">
                  {query.name}
                </h4>
                <p className="text-[11.5px] text-[var(--text-secondary)] mt-1">
                  Category: {query.category} · Checked {query.lastRun}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-[var(--rule-default)] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleRunQuery(query)}
                  className="px-3 py-1.5 rounded-[10px] bg-[var(--accent)] text-white text-[11.5px] font-bold hover:opacity-90 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Run Query</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteQuery(query.id, query.name)}
                  className="p-1.5 rounded-[8px] hover:bg-rose-500/10 text-[var(--text-muted)] hover:text-rose-400 transition-all cursor-pointer"
                  title="Delete query"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bookmarked Opportunities Feed */}
      <div className="pt-4 border-t border-[var(--rule-default)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-[17px] font-extrabold text-[var(--text-primary)]">
              Bookmarked Opportunities ({savedItems.length})
            </h3>
            <p className="text-[12.5px] text-[var(--text-secondary)]">
              Opportunities you flagged for deep review. Click to inspect full specifications or commit.
            </p>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex items-center gap-1 p-1 rounded-[12px] bg-[var(--card)] border border-[var(--rule-default)] overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All Saved' },
              { id: 'watched', label: 'Board Watched' },
              { id: 'competitions', label: 'Contests' },
              { id: 'grants', label: 'Grants' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedFilter(f.id as any)}
                className={`chip chip-sm cursor-pointer ${
                  selectedFilter === f.id ? 'on' : ''
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {savedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedItems.map((item) => (
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
              No saved discovery tasks match this filter. Star opportunities in Radar to preserve them here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
