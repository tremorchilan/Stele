import React, { useState } from 'react';
import { SteleItem } from '../types';
import { calculateTimeStatus } from '../utils/time';
import { CountdownBar } from './CountdownBar';
import { Sparkles } from 'lucide-react';
import { getSolidTagStyle, getSolidScopeStyle, getSolidStatusStyle } from '../utils/colorPills';

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

  const tagStyle = getSolidTagStyle(primaryTag);
  const scopeStyle = getSolidScopeStyle(item.scope);
  const isClosingSoon = status.isCritical || status.isRed;

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
      className={`card-item group cursor-pointer select-none text-left w-full transition-all duration-300 ease-out active:scale-[0.985] rounded-[18px] bg-[var(--card)] shadow-[0_4px_16px_rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.07)] hover:-translate-y-1 hover:shadow-[0_20px_40px_-8px_rgba(0,0,0,0.7),0_4px_12px_rgba(0,0,0,0.5)] flex flex-col justify-between overflow-hidden relative ${
        isHero ? 'sm:col-span-2 sm:row-span-2' : ''
      }`}
    >
      {/* Mobile-Only Badges (Top Row when Thumbnail Banner is hidden in mobile mode) */}
      <div className="card-mobile-badges items-center gap-1.5 flex-wrap p-3.5 pb-0">
        <span
          className="pill pill-sm uppercase font-semibold"
          style={{
            backgroundColor: scopeStyle.bg,
            color: scopeStyle.text,
            borderColor: scopeStyle.border,
          }}
        >
          {item.scope}
        </span>
        {isClosingSoon && (
          <span className="pill pill-sm urgent font-bold">
            Closing Soon
          </span>
        )}
        {item.isInstitutionOnly && (
          <span className="pill pill-sm urgent">
            Internal
          </span>
        )}
        <span
          className="pill pill-sm font-bold shadow-xs"
          style={{
            backgroundColor: tagStyle.bg,
            color: tagStyle.text,
            borderColor: tagStyle.border,
            boxShadow: tagStyle.shadow,
          }}
        >
          #{primaryTag}
        </span>
      </div>

      {/* Visual Thumbnail Banner with extended height & floating title + description group */}
      <div
        className={`card-thumb-banner relative w-full overflow-hidden bg-[var(--card)] ${
          isHero ? 'h-72 sm:h-80' : 'h-64 sm:h-72'
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

        {/* Multi-stop gradient scrim: rich dark gradient at the bottom so floating text has superb contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent via-35% to-[var(--card)] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[var(--card)] via-[var(--card)]/90 via-55% to-transparent pointer-events-none" />

        {/* Top Floating Badges: Scope + Closing Soon + Internal */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="pill pill-sm font-bold uppercase shadow-md"
              style={{
                backgroundColor: scopeStyle.bg,
                color: scopeStyle.text,
                borderColor: scopeStyle.border,
              }}
            >
              {item.scope}
            </span>
            {isClosingSoon && (
              <span className="pill pill-sm urgent font-bold shadow-md">
                Closing Soon
              </span>
            )}
            {item.isInstitutionOnly && (
              <span className="pill pill-sm urgent font-bold shadow-md">
                Internal
              </span>
            )}
          </div>

          {/* Star / Engaged indicator on top right */}
          {isEngaged && (
            <span className="px-2 py-0.5 rounded-full bg-[var(--accent)] text-white text-[10.5px] font-bold shadow-md">
              Committed
            </span>
          )}
        </div>

        {/* Lower Floating Group: Tag + Title + Description Preview + Steward directly over the artwork */}
        <div className="absolute bottom-2.5 left-3.5 right-3.5 z-10 pointer-events-none flex flex-col gap-1">
          {/* Primary Tag & Source Pill */}
          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
            <span
              className="pill pill-sm shadow-md font-bold"
              style={{
                backgroundColor: tagStyle.bg,
                color: tagStyle.text,
                borderColor: tagStyle.border,
                boxShadow: tagStyle.shadow,
              }}
            >
              #{primaryTag}
            </span>
            <span className="text-[10.5px] text-[var(--text-sub)] font-medium bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs border border-white/10">
              {item.sourceInstitution}
            </span>
          </div>

          {/* Floating Title with crisp contrast */}
          <h3
            className={`font-extrabold leading-[1.25] text-white group-hover:text-[var(--accent)] transition-colors drop-shadow-md ${
              isHero ? 'text-[19px] sm:text-[21px]' : 'text-[15.5px] sm:text-[16.5px]'
            }`}
          >
            {item.title}
          </h3>

          {/* Floating Description preview directly on the picture */}
          {item.originalMessage && (
            <p className="text-[12px] sm:text-[12.5px] text-[var(--text-secondary)] line-clamp-2 leading-[1.4] opacity-95 drop-shadow-xs">
              {item.originalMessage}
            </p>
          )}

          {/* Steward subtitle */}
          <p className="text-[11px] text-[var(--text-muted)] font-medium truncate pt-0.5 opacity-85">
            Steward: {item.stewardName}
          </p>
        </div>
      </div>

      {/* Content Section: Action Footer with Countdown Bar */}
      <div className="p-3 sm:p-3.5 pt-2 relative z-10 bg-[var(--card)] border-t border-[var(--rule-default)]/40">
        <div className="flex items-center justify-between pb-1.5">
          <span
            className={`tabular-nums transition-colors font-bold ${deadlineTextClass}`}
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
  );
};
