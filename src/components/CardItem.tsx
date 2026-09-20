import React, { useState } from 'react';
import { SteleItem } from '../types';
import { calculateTimeStatus } from '../utils/time';
import { CountdownBar } from './CountdownBar';
import { Sparkles } from 'lucide-react';

interface CardItemProps {
  item: SteleItem;
  isEngaged?: boolean;
  onSelect: (item: SteleItem) => void;
  isHero?: boolean;
}

const FALLBACK_THUMBNAILS: Record<string, string> = {
  Robotics: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=700&q=80',
  Debate: 'https://images.unsplash.com/photo-1544531585-9847b68c8c86?auto=format&fit=crop&w=700&q=80',
  Physics: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=700&q=80',
  Academics: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=700&q=80',
  Math: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=700&q=80',
  Coding: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=700&q=80',
  Environment: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=700&q=80',
  Arts: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=700&q=80',
};

export const CardItem: React.FC<CardItemProps> = ({ item, isEngaged = false, onSelect, isHero = false }) => {
  const [imgError, setImgError] = useState(false);
  const status = calculateTimeStatus(item.deadline);

  // Critical: text bolder and slightly larger (PRD 5.1 & 6.2)
  const deadlineTextClass = status.isCritical
    ? 'text-[15px] font-bold tracking-tight'
    : 'text-[13px] font-medium tracking-normal';

  const deadlineColor = status.isMissed
    ? 'var(--text-muted)'
    : status.isRed
    ? 'var(--urgent)'
    : 'var(--text-muted)';

  // Determine thumbnail image
  const primaryTag = item.tags[0] || 'Robotics';
  const resolvedThumbnail =
    item.thumbnailUrl ||
    FALLBACK_THUMBNAILS[primaryTag] ||
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=700&q=80';

  return (
    <div
      id={`card-${item.id}`}
      onClick={() => onSelect(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(item);
        }
      }}
      className={`group cursor-pointer select-none text-left w-full transition-all duration-200 active:scale-[0.985] p-3.5 rounded-[18px] bg-[var(--card)] shadow-[0_2px_8px_rgba(0,0,0,0.12)] border border-[var(--rule-default)]/50 hover:border-[var(--accent)] hover:shadow-lg flex flex-col justify-between gap-3 ${
        isHero ? 'sm:col-span-2 sm:row-span-2 p-5' : ''
      }`}
    >
      {/* Visual Dummy Thumbnail Banner */}
      <div
        className={`relative w-full overflow-hidden rounded-[14px] bg-[var(--track)] ${
          isHero ? 'h-44' : 'h-32'
        }`}
      >
        {!imgError ? (
          <img
            src={resolvedThumbnail}
            alt={item.title}
            onError={() => setImgError(true)}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-[var(--tile-active)] to-[var(--track)] flex items-center justify-center text-[var(--meta)]">
            <Sparkles className="w-6 h-6 opacity-40" />
          </div>
        )}

        {/* Gradient scrim for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/90 via-transparent to-black/30 pointer-events-none" />

        {/* Scope and Provenance Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
          <span className="px-2 py-0.5 rounded-[8px] bg-black/60 backdrop-blur-md text-[10.5px] font-bold text-white uppercase tracking-wider border border-white/15">
            {item.scope}
          </span>
          {item.isInstitutionOnly && (
            <span className="px-2 py-0.5 rounded-[8px] bg-[var(--orange)] text-white text-[10.5px] font-bold uppercase tracking-wider shadow-xs">
              Internal
            </span>
          )}
        </div>

        {/* Category Tag pill */}
        <div className="absolute bottom-2 left-2.5 pointer-events-none">
          <span className="px-2 py-0.5 rounded-[6px] bg-[var(--tile)]/90 backdrop-blur-sm text-[11px] font-semibold text-[var(--accent)] border border-white/10">
            #{primaryTag}
          </span>
        </div>
      </div>

      <div className="flex flex-col h-full justify-between gap-2.5">
        {/* Header: Title and Metadata */}
        <div>
          <h3
            className={`font-bold leading-[1.3] text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors ${
              isHero ? 'text-[20px] mb-1.5' : 'text-[16px] mb-1'
            }`}
          >
            {item.title}
          </h3>
          <p className="text-[12.5px] text-[var(--text-secondary)] leading-[1.4] line-clamp-1">
            {item.sourceInstitution} · {item.stewardName}
          </p>
        </div>

        {/* Middle description preview */}
        {isHero && (
          <p className="text-[13.5px] text-[var(--text-secondary)] line-clamp-2 leading-[1.5]">
            {item.originalMessage}
          </p>
        )}

        {/* Footer: Pure deadline text and draining countdown bar */}
        <div className="pt-1 mt-auto">
          <div className="flex items-center justify-between pb-1.5">
            <span
              className={`tabular-nums transition-colors ${deadlineTextClass}`}
              style={{ color: deadlineColor }}
            >
              {status.label}
            </span>

            <span className="text-[11.5px] text-[var(--text-muted)] font-medium">
              {item.reachCount ? `${item.reachCount} Reach` : item.sourceSpace}
            </span>
          </div>

          {/* Draining Countdown Bar in feed */}
          <CountdownBar deadlineISO={item.deadline} isEngaged={isEngaged} />
        </div>
      </div>
    </div>
  );
};
