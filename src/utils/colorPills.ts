/**
 * Utilities for solid bright color-coded pills, tags, buttons, and status badges.
 * Ensures immediate visual distinction across categories without neon washouts.
 */

export interface ColorBadgeStyle {
  bg: string;
  text: string;
  border: string;
  shadow?: string;
  dotColor?: string;
}

/**
 * Returns solid bright color styling for any category tag (e.g. #Environment, #Robotics, #Arts).
 */
export function getSolidTagStyle(tag: string): ColorBadgeStyle {
  const normalized = (tag || '').toLowerCase().replace(/^[#\s]+/, '');

  // 1. Environment / Sustainability / Eco / Nature / Energy -> Solid Bright Green
  if (
    normalized.includes('environment') ||
    normalized.includes('sustain') ||
    normalized.includes('eco') ||
    normalized.includes('energy') ||
    normalized.includes('volunteer') ||
    normalized.includes('biology') ||
    normalized.includes('climate')
  ) {
    return {
      bg: '#10B981',
      text: '#FFFFFF',
      border: '#059669',
      shadow: '0 2px 8px rgba(16, 185, 129, 0.35)',
      dotColor: '#FFFFFF',
    };
  }

  // 2. Robotics / STEM / Tech / Hardware / Coding / Engineering -> Solid Bright Blue / Cyan
  if (
    normalized.includes('robot') ||
    normalized.includes('tech') ||
    normalized.includes('code') ||
    normalized.includes('coding') ||
    normalized.includes('circuit') ||
    normalized.includes('cad') ||
    normalized.includes('firmware') ||
    normalized.includes('algorithm') ||
    normalized.includes('engineering') ||
    normalized.includes('hardware') ||
    normalized.includes('stem')
  ) {
    return {
      bg: '#0284C7',
      text: '#FFFFFF',
      border: '#0369A1',
      shadow: '0 2px 8px rgba(2, 132, 199, 0.35)',
      dotColor: '#FFFFFF',
    };
  }

  // 3. Arts / Architecture / Design / Music / Creative / Culture -> Solid Bright Purple
  if (
    normalized.includes('art') ||
    normalized.includes('design') ||
    normalized.includes('architect') ||
    normalized.includes('music') ||
    normalized.includes('portfolio') ||
    normalized.includes('creative') ||
    normalized.includes('culture') ||
    normalized.includes('media')
  ) {
    return {
      bg: '#8B5CF6',
      text: '#FFFFFF',
      border: '#7C3AED',
      shadow: '0 2px 8px rgba(139, 92, 246, 0.35)',
      dotColor: '#FFFFFF',
    };
  }

  // 4. Debate / Civics / Leadership / Humanities / Philosophy -> Solid Bright Amber / Gold
  if (
    normalized.includes('debate') ||
    normalized.includes('speak') ||
    normalized.includes('civic') ||
    normalized.includes('leader') ||
    normalized.includes('policy') ||
    normalized.includes('philosophy') ||
    normalized.includes('humanities') ||
    normalized.includes('mun') ||
    normalized.includes('court')
  ) {
    return {
      bg: '#F59E0B',
      text: '#0F172A',
      border: '#D97706',
      shadow: '0 2px 8px rgba(245, 158, 11, 0.35)',
      dotColor: '#0F172A',
    };
  }

  // 5. Physics / Math / Olympiad / Science / Curriculum -> Solid Bright Indigo / Royal
  if (
    normalized.includes('physic') ||
    normalized.includes('math') ||
    normalized.includes('olympiad') ||
    normalized.includes('science') ||
    normalized.includes('academic') ||
    normalized.includes('curriculum') ||
    normalized.includes('proof')
  ) {
    return {
      bg: '#4F46E5',
      text: '#FFFFFF',
      border: '#4338CA',
      shadow: '0 2px 8px rgba(79, 70, 229, 0.35)',
      dotColor: '#FFFFFF',
    };
  }

  // 6. Default / General / Campus -> Calm Slate Cobalt
  return {
    bg: '#3B82F6',
    text: '#FFFFFF',
    border: '#2563EB',
    shadow: '0 2px 8px rgba(59, 130, 246, 0.25)',
    dotColor: '#FFFFFF',
  };
}

/**
 * Returns solid bright color styling for geographic scope pills.
 */
export function getSolidScopeStyle(scope: string): ColorBadgeStyle {
  const normalized = (scope || '').toLowerCase();
  if (normalized === 'district') {
    return {
      bg: '#10B981',
      text: '#FFFFFF',
      border: '#059669',
      shadow: '0 2px 8px rgba(16, 185, 129, 0.35)',
      dotColor: '#FFFFFF',
    };
  }
  if (normalized === 'division') {
    return {
      bg: '#0284C7',
      text: '#FFFFFF',
      border: '#0369A1',
      shadow: '0 2px 8px rgba(2, 132, 199, 0.35)',
      dotColor: '#FFFFFF',
    };
  }
  if (normalized === 'national') {
    return {
      bg: '#4F46E5',
      text: '#FFFFFF',
      border: '#4338CA',
      shadow: '0 2px 8px rgba(79, 70, 229, 0.35)',
      dotColor: '#FFFFFF',
    };
  }
  if (normalized === 'international') {
    return {
      bg: '#8B5CF6',
      text: '#FFFFFF',
      border: '#7C3AED',
      shadow: '0 2px 8px rgba(139, 92, 246, 0.35)',
      dotColor: '#FFFFFF',
    };
  }
  return {
    bg: '#3B82F6',
    text: '#FFFFFF',
    border: '#2563EB',
    shadow: '0 2px 8px rgba(59, 130, 246, 0.25)',
    dotColor: '#FFFFFF',
  };
}

/**
 * Returns solid bright color styling for status pills (Closing Soon, Active, Watched, etc.).
 */
export function getSolidStatusStyle(status: string): ColorBadgeStyle {
  const normalized = (status || '').toLowerCase();

  // Missed / Expired -> Quiet Grey (Origin of Stele: "Missed items are grey and dashed — never red")
  if (normalized.includes('missed') || normalized.includes('expired')) {
    return {
      bg: 'rgba(148, 163, 184, 0.15)',
      text: '#94A3B8',
      border: 'rgba(148, 163, 184, 0.3)',
      shadow: 'none',
      dotColor: '#94A3B8',
    };
  }

  // Closing Soon / Urgent / Critical / Due Soon -> Warm Amber (Clear time-horizon signaling, zero distress)
  if (
    normalized.includes('closing') ||
    normalized.includes('urgent') ||
    normalized.includes('critical') ||
    normalized.includes('due') ||
    normalized.includes('internal') ||
    normalized.includes('soon')
  ) {
    return {
      bg: '#F59E0B',
      text: '#0F172A',
      border: '#D97706',
      shadow: '0 2px 8px rgba(245, 158, 11, 0.25)',
      dotColor: '#0F172A',
    };
  }

  // Active / Committed / Completed / Verified / Open / Success -> Solid Bright Green
  if (
    normalized.includes('active') ||
    normalized.includes('commit') ||
    normalized.includes('complet') ||
    normalized.includes('verified') ||
    normalized.includes('open') ||
    normalized.includes('success') ||
    normalized.includes('cached') ||
    normalized.includes('sync')
  ) {
    return {
      bg: '#10B981',
      text: '#FFFFFF',
      border: '#059669',
      shadow: '0 2px 8px rgba(16, 185, 129, 0.35)',
      dotColor: '#FFFFFF',
    };
  }

  // Warning / Watched / Streak / Pending / In Review -> Solid Bright Amber
  if (
    normalized.includes('watch') ||
    normalized.includes('streak') ||
    normalized.includes('pending') ||
    normalized.includes('warn') ||
    normalized.includes('radar') ||
    normalized.includes('schedule')
  ) {
    return {
      bg: '#F59E0B',
      text: '#0F172A',
      border: '#D97706',
      shadow: '0 2px 8px rgba(245, 158, 11, 0.35)',
      dotColor: '#0F172A',
    };
  }

  // Academic / Official / Circular / Notices -> Solid Bright Blue
  if (
    normalized.includes('academic') ||
    normalized.includes('official') ||
    normalized.includes('circular') ||
    normalized.includes('notice') ||
    normalized.includes('feed')
  ) {
    return {
      bg: '#0284C7',
      text: '#FFFFFF',
      border: '#0369A1',
      shadow: '0 2px 8px rgba(2, 132, 199, 0.35)',
      dotColor: '#FFFFFF',
    };
  }

  // Club / Society / Social / Recess / DM -> Solid Bright Purple
  if (
    normalized.includes('club') ||
    normalized.includes('society') ||
    normalized.includes('social') ||
    normalized.includes('dm') ||
    normalized.includes('private') ||
    normalized.includes('recess')
  ) {
    return {
      bg: '#8B5CF6',
      text: '#FFFFFF',
      border: '#7C3AED',
      shadow: '0 2px 8px rgba(139, 92, 246, 0.35)',
      dotColor: '#FFFFFF',
    };
  }

  return {
    bg: '#3B82F6',
    text: '#FFFFFF',
    border: '#2563EB',
    shadow: '0 2px 8px rgba(59, 130, 246, 0.25)',
    dotColor: '#FFFFFF',
  };
}
