import React, { useState, useEffect } from 'react';
import { SteleItem, Scope, Commitment } from '../types';
import { CardItem } from '../components/CardItem';
import { Filter, Search, SlidersHorizontal, Building, Globe, Compass, Tag, Bookmark } from 'lucide-react';
import { RadarKeywordsView } from '../components/radar/RadarKeywordsView';
import { RadarSavedTasksView } from '../components/radar/RadarSavedTasksView';

export type RadarViewMode = 'feed' | 'keywords' | 'saved';

interface RadarViewProps {
  items: SteleItem[];
  commitments: Commitment[];
  onSelectItem: (item: SteleItem) => void;
  isDark: boolean;
  onOpenUnconventionalFeatures?: () => void;
  initialMode?: RadarViewMode;
  onModeChange?: (mode: RadarViewMode) => void;
}

export const RadarView: React.FC<RadarViewProps> = ({
  items,
  commitments,
  onSelectItem,
  isDark,
  onOpenUnconventionalFeatures,
  initialMode = 'feed',
  onModeChange,
}) => {
  const [viewMode, setViewMode] = useState<RadarViewMode>(initialMode);
  const [selectedScope, setSelectedScope] = useState<Scope | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [institutionOnly, setInstitutionOnly] = useState(false);
  const [browseDrawerOpen, setBrowseDrawerOpen] = useState(false);

  useEffect(() => {
    if (initialMode && initialMode !== viewMode) {
      setViewMode(initialMode);
    }
  }, [initialMode]);

  const handleSwitchMode = (mode: RadarViewMode) => {
    setViewMode(mode);
    onModeChange?.(mode);
  };

  // Extract all available tags
  const allTags = Array.from(new Set(items.flatMap((i) => i.tags)));

  // Scope hierarchy order (PRD 11: District -> Division -> National -> International)
  const scopeOrder: Record<Scope, number> = {
    district: 1,
    division: 2,
    national: 3,
    international: 4,
  };

  // Filter items
  const filtered = items.filter((item) => {
    if (institutionOnly && !item.isInstitutionOnly) return false;
    if (selectedScope !== 'all' && item.scope !== selectedScope) return false;
    if (selectedTag !== 'all' && !item.tags.includes(selectedTag)) return false;
    return true;
  });

  // Sort strictly by Scope first, Deadline ascending second (Section 11)
  const sortedItems = [...filtered].sort((a, b) => {
    if (selectedScope === 'all') {
      const scopeDiff = scopeOrder[a.scope] - scopeOrder[b.scope];
      if (scopeDiff !== 0) return scopeDiff;
    }
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 overflow-hidden">
      <div className="main" id="radarMain">
        <div id="radar-view" className="w-full max-w-7xl mx-auto pt-4 pb-16">
      {/* Screen Title (PRD 6.3 Display font placement) */}
      <div className="mb-4">
        <h1 className="text-[22px] md:text-[28px] font-bold text-[var(--text-primary)] tracking-tight">
          Opportunity Radar
        </h1>
        <p className="text-[13px] sm:text-[14px] text-[var(--text-secondary)]">
          Ordered strictly by geographic scope and deadline. No algorithmic ranking.
        </p>
      </div>

      {/* Sub-page back link when navigated via quick access ribbon */}
      {viewMode !== 'feed' && (
        <div className="mb-4">
          <button
            type="button"
            onClick={() => handleSwitchMode('feed')}
            className="text-[13px] font-medium text-[var(--accent)] hover:underline flex items-center gap-1.5"
          >
            &larr; Return to Opportunity Radar Feed
          </button>
        </div>
      )}

      {/* Conditional Sub-View Rendering */}
      {viewMode === 'keywords' && (
        <RadarKeywordsView
          items={items}
          commitments={commitments}
          onSelectItem={onSelectItem}
          isDark={isDark}
        />
      )}

      {viewMode === 'saved' && (
        <RadarSavedTasksView
          items={items}
          commitments={commitments}
          onSelectItem={onSelectItem}
          isDark={isDark}
        />
      )}

      {viewMode === 'feed' && (
        <>
          {/* Layer directly above the scope pills: [Browse Filters] and [Rules] */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <button
                id="radar-browse-btn"
                type="button"
                onClick={() => setBrowseDrawerOpen(!browseDrawerOpen)}
                className={`pill pill-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  browseDrawerOpen
                    ? 'on'
                    : 'text-[var(--text-primary)]'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Browse Filters</span>
              </button>

              {(selectedScope !== 'all' || selectedTag !== 'all' || institutionOnly) && (
                <span className="text-[11px] text-[var(--accent)] font-semibold">
                  Filtered
                </span>
              )}
            </div>

            <button
              id="radar-unconventional-btn"
              type="button"
              onClick={() => onOpenUnconventionalFeatures?.()}
              className="pill pill-sm flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              title="Radar Invariants & Scope Rules"
              aria-label="Radar Rules"
            >
              <div className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center text-[9.5px] font-bold font-serif italic leading-none">
                i
              </div>
              <span>Rules</span>
            </button>
          </div>

          {/* Deliberate Browse & Filters Surface (PRD 11) */}
          {browseDrawerOpen && (
        <div
          id="browse-filters-drawer"
          className="p-5 rounded-[20px] bg-[var(--card)] border border-[var(--rule-default)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] mb-6 transition-all"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[var(--rule-default)]/40 mb-4">
            <span className="text-[13px] font-semibold text-[var(--text-primary)] uppercase tracking-wider">
              Deliberate Filters
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedScope('all');
                setSelectedTag('all');
                setInstitutionOnly(false);
              }}
              className="text-[12px] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              Reset All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[13px]">
            {/* Scope Filter */}
            <div>
              <label className="block text-[12px] font-medium text-[var(--text-secondary)] mb-1.5">
                Geographic Scope
              </label>
              <select
                id="scope-select"
                value={selectedScope}
                onChange={(e) => setSelectedScope(e.target.value as Scope | 'all')}
                className="w-full p-2.5 rounded-[12px] bg-[var(--canvas)] border border-[var(--rule-default)] text-[13px] text-[var(--text-primary)]"
              >
                <option value="all">All Scopes (District First)</option>
                <option value="district">District Only (Springfield)</option>
                <option value="division">Division Only</option>
                <option value="national">National Only</option>
                <option value="international">International</option>
              </select>
            </div>

            {/* Declared Interest Tags */}
            <div>
              <label className="block text-[12px] font-medium text-[var(--text-secondary)] mb-1.5">
                Declared Interests
              </label>
              <select
                id="interest-tag-select"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full p-2.5 rounded-[12px] bg-[var(--canvas)] border border-[var(--rule-default)] text-[13px] text-[var(--text-primary)]"
              >
                <option value="all">All Tags</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            {/* Institution-Only Switch */}
            <div>
              <label className="block text-[12px] font-medium text-[var(--text-secondary)] mb-1.5">
                Source Boundary
              </label>
              <button
                id="toggle-institution-only"
                type="button"
                onClick={() => setInstitutionOnly(!institutionOnly)}
                className={`w-full p-2.5 rounded-[12px] border text-[13px] font-medium flex items-center justify-between transition-colors ${
                  institutionOnly
                    ? 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)] font-semibold'
                    : 'bg-[var(--canvas)] border-[var(--rule-default)] text-[var(--text-secondary)]'
                }`}
              >
                <span>Institution Only</span>
                {institutionOnly ? (
                  <Building className="w-4 h-4" />
                ) : (
                  <Globe className="w-4 h-4 text-[var(--text-muted)]" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scope quick tabs matching previous ribbon type */}
      <div className="chips" id="scope-chips">
        {(
          [
            { id: 'all', label: 'All Scopes', bg: 'var(--accent)', border: 'var(--accent)' },
            { id: 'district', label: 'District', bg: '#10B981', border: '#059669' },
            { id: 'division', label: 'Division', bg: '#0284C7', border: '#0369A1' },
            { id: 'national', label: 'National', bg: '#4F46E5', border: '#4338CA' },
            { id: 'international', label: 'International', bg: '#8B5CF6', border: '#7C3AED' },
          ] as const
        ).map((s) => {
          const isSelected = selectedScope === s.id;
          return (
            <button
              key={s.id}
              id={`scope-chip-${s.id}`}
              type="button"
              onClick={() => setSelectedScope(s.id as any)}
              className={`chip uppercase tracking-wider font-bold ${isSelected ? 'on' : ''}`}
              style={
                isSelected
                  ? {
                      backgroundColor: s.bg,
                      borderColor: s.border,
                      color: '#FFFFFF',
                      boxShadow: `0 2px 10px ${s.bg}40`,
                    }
                  : undefined
              }
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* 8.2 The Constraint: Tile size must NEVER imply editorial weight in a feed.
          In Radar and Board, all cards are identical! */}
      {sortedItems.length > 0 ? (
        <div className="radar-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sortedItems.map((item) => (
            <CardItem
              key={item.id}
              item={item}
              isEngaged={commitments.some((c) => c.itemId === item.id)}
              onSelect={onSelectItem}
              isHero={false} // Never hero cell in comparison feed!
            />
          ))}
        </div>
      ) : (
        /* 9.10 Empty State: Quiet plasma, static. One line of type. No mascot. */
        <div className="relative overflow-hidden p-12 rounded-[24px] bg-[var(--card)] border border-[var(--rule-default)] text-center my-6">
          <p className="relative z-10 text-[15px] text-[var(--text-secondary)] font-medium">
            No opportunities match your interests today.
          </p>
        </div>
      )}
        </>
      )}
        </div>
      </div>
    </div>
  );
};
