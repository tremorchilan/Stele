export type UrgencyTier = 'critical' | 'urgent' | 'approaching' | 'ambient' | 'missed';

export interface TimeStatus {
  tier: UrgencyTier;
  label: string;
  isRed: boolean;
  isCritical: boolean;
  isMissed: boolean;
  fractionRemaining: number; // 1 = full, 0 = at or past deadline
  fractionElapsed: number; // 0 = start, 1 = at deadline (for rings that fill as time depletes)
  totalMsRemaining: number;
}

export function calculateTimeStatus(deadlineISO: string, createdAtOffsetDays = 30): TimeStatus {
  const now = Date.now();
  const deadline = new Date(deadlineISO).getTime();
  const diffMs = deadline - now;

  const hourMs = 3600 * 1000;
  const dayMs = 24 * hourMs;

  if (diffMs <= 0) {
    const hoursPast = Math.abs(Math.floor(diffMs / hourMs));
    const label = hoursPast >= 24 ? `Missed ${Math.floor(hoursPast / 24)}d ago` : `Missed ${hoursPast || 1}h ago`;
    return {
      tier: 'missed',
      label,
      isRed: false, // Rule DC-1 & 5.1: Missed is grey, dashed. NEVER RED.
      isCritical: false,
      isMissed: true,
      fractionRemaining: 0,
      fractionElapsed: 1,
      totalMsRemaining: diffMs,
    };
  }

  // Calculate window fraction relative to a standard baseline or created window
  const totalWindow = createdAtOffsetDays * dayMs;
  const fractionRemaining = Math.max(0, Math.min(1, diffMs / totalWindow));
  const fractionElapsed = 1 - fractionRemaining;

  // Tiers:
  // Critical: < 24h
  // Urgent: 24h - 72h (3 days)
  // Approaching: 72h - 14d
  // Ambient: > 14d

  if (diffMs < 24 * hourMs) {
    const hours = Math.floor(diffMs / hourMs);
    const minutes = Math.floor((diffMs % hourMs) / (60 * 1000));
    const seconds = Math.floor((diffMs % (60 * 1000)) / 1000);

    let label = '';
    if (diffMs < 10 * 60 * 1000) {
      // Under 10 minutes: display MM:SS with tabular figures
      const mStr = String(minutes).padStart(2, '0');
      const sStr = String(seconds).padStart(2, '0');
      label = `${mStr}:${sStr} left`;
    } else if (diffMs < hourMs) {
      // Under 1 hour: display MMm left
      label = `${minutes}m left`;
    } else {
      label = `${hours} hours left`;
    }

    return {
      tier: 'critical',
      label,
      isRed: true,
      isCritical: true,
      isMissed: false,
      fractionRemaining: Math.max(0.04, diffMs / (24 * hourMs)), // scale visibly in final 24h
      fractionElapsed: 1 - Math.max(0, diffMs / (24 * hourMs)),
      totalMsRemaining: diffMs,
    };
  }

  if (diffMs <= 72 * hourMs) {
    const hours = Math.floor(diffMs / hourMs);
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    const label = days > 0 ? `${days}d ${remainingHours}h left` : `${hours}h left`;

    return {
      tier: 'urgent',
      label,
      isRed: true,
      isCritical: false,
      isMissed: false,
      fractionRemaining: Math.max(0.1, diffMs / (72 * hourMs)),
      fractionElapsed: 1 - (diffMs / (72 * hourMs)),
      totalMsRemaining: diffMs,
    };
  }

  if (diffMs <= 14 * dayMs) {
    const days = Math.ceil(diffMs / dayMs);
    return {
      tier: 'approaching',
      label: `${days} days left`,
      isRed: false, // Approaching is grey-muted!
      isCritical: false,
      isMissed: false,
      fractionRemaining: Math.max(0.15, diffMs / (14 * dayMs)),
      fractionElapsed: 1 - (diffMs / (14 * dayMs)),
      totalMsRemaining: diffMs,
    };
  }

  // Ambient > 14 days
  const targetDate = new Date(deadline);
  const formatted = targetDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
  return {
    tier: 'ambient',
    label: `Due ${formatted}`,
    isRed: false, // Ambient is grey-muted!
    isCritical: false,
    isMissed: false,
    fractionRemaining: 0.85,
    fractionElapsed: 0.15,
    totalMsRemaining: diffMs,
  };
}
