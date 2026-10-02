import React, { useEffect, useRef } from 'react';
import { Award, CheckCircle2, X, Sparkles, FileText, BookOpen, ExternalLink, Zap } from 'lucide-react';

export interface CelebrationData {
  title: string;
  points: number;
  pointsBreakdown: { label: string; points: number }[];
  tailoredMessage: string;
  witnessName?: string;
  category?: string;
  hash?: string;
  isEarly?: boolean;
}

interface CelebrationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  celebrationData: CelebrationData | null;
  isDark: boolean;
  onOpenLedger?: () => void;
  onOpenRetrospective?: () => void;
}

// Full-screen Party Papers & Sprinkles Canvas Particle Engine
const PartyPapersAndSprinkles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = [
      '#F59E0B', // Amber / Gold
      '#10B981', // Emerald
      '#6366F1', // Indigo
      '#EF4444', // Crimson
      '#0EA5E9', // Azure
      '#8B5CF6', // Purple
      '#F43F5E', // Rose
      '#EAB308', // Yellow
      '#14B8A6', // Teal
      '#EC4899', // Pink
    ];

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      type: 'paper' | 'sprinkle' | 'star';
      color: string;
      size: number;
      width: number;
      height: number;
      rotation: number;
      rotationSpeed: number;
      rotationX: number;
      rotationXSpeed: number;
      wobble: number;
      wobbleSpeed: number;
      opacity: number;
    }

    const particles: Particle[] = [];
    const PARTICLE_COUNT = 140;

    // Initialize particles: mix of initial explosion burst + ongoing rain
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const isBurst = i < 60;
      const typeRand = Math.random();
      const type: 'paper' | 'sprinkle' | 'star' =
        typeRand < 0.55 ? 'paper' : typeRand < 0.85 ? 'sprinkle' : 'star';

      const startX = isBurst ? width / 2 + (Math.random() - 0.5) * 120 : Math.random() * width;
      const startY = isBurst ? height * 0.45 + (Math.random() - 0.5) * 80 : -20 - Math.random() * height * 0.8;

      const angle = Math.random() * Math.PI * 2;
      const speed = isBurst ? 4 + Math.random() * 9 : 1 + Math.random() * 3;

      particles.push({
        x: startX,
        y: startY,
        vx: isBurst ? Math.cos(angle) * speed : (Math.random() - 0.5) * 2.5,
        vy: isBurst ? Math.sin(angle) * speed - 4 : 2 + Math.random() * 4,
        type,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: type === 'sprinkle' ? 4 + Math.random() * 5 : 7 + Math.random() * 7,
        width: type === 'paper' ? 9 + Math.random() * 8 : type === 'sprinkle' ? 4 : 10,
        height: type === 'paper' ? 14 + Math.random() * 12 : type === 'sprinkle' ? 10 : 10,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.15,
        rotationX: Math.random() * Math.PI,
        rotationXSpeed: 0.05 + Math.random() * 0.08,
        wobble: Math.random() * 10,
        wobbleSpeed: 0.04 + Math.random() * 0.06,
        opacity: 0.95,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx + Math.sin(p.wobble) * 1.5;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.rotationX += p.rotationXSpeed;
        p.wobble += p.wobbleSpeed;
        p.vy += 0.08; // Gravity

        // Air drag
        p.vx *= 0.985;

        // Reset to top if falling off bottom
        if (p.y > height + 30) {
          p.y = -20;
          p.x = Math.random() * width;
          p.vx = (Math.random() - 0.5) * 2;
          p.vy = 2 + Math.random() * 3.5;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(1, Math.cos(p.rotationX)); // 3D tumbling effect

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;

        if (p.type === 'paper') {
          // Party Paper Ribbon / Confetti strip
          ctx.beginPath();
          ctx.roundRect(-p.width / 2, -p.height / 2, p.width, p.height, 2);
          ctx.fill();
        } else if (p.type === 'sprinkle') {
          // Candy sprinkles (cylindrical pills)
          ctx.beginPath();
          ctx.roundRect(-p.width / 2, -p.height / 2, p.width, p.height, 3);
          ctx.fill();
        } else {
          // Star of Intellect & Radiance
          ctx.beginPath();
          for (let s = 0; s < 5; s++) {
            const rot = (Math.PI / 5) * s * 2 - Math.PI / 2;
            const rOuter = p.size;
            const rInner = p.size * 0.45;
            const ox = Math.cos(rot) * rOuter;
            const oy = Math.sin(rot) * rOuter;
            if (s === 0) ctx.moveTo(ox, oy);
            else ctx.lineTo(ox, oy);

            const rotInner = rot + Math.PI / 5;
            ctx.lineTo(Math.cos(rotInner) * rInner, Math.sin(rotInner) * rInner);
          }
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 select-none"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};

// The Exuberant Mascot of Optimism and Intellect: "Archie the Scholarly Owl"
const ArchieMascot: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center justify-center my-1 select-none">
      {/* Radiant Optimism Aura */}
      <div className="absolute w-36 h-36 rounded-full bg-gradient-to-r from-amber-400/25 via-indigo-500/20 to-teal-400/25 blur-xl animate-pulse pointer-events-none" />

      {/* Floating Sparkle Elements */}
      <div className="absolute -top-3 -left-3 animate-bounce text-amber-400 text-lg select-none">✨</div>
      <div className="absolute -top-4 right-1 animate-pulse text-indigo-400 text-xl select-none">💡</div>
      <div className="absolute top-8 -right-4 animate-bounce text-emerald-400 text-base select-none">⭐</div>

      {/* Exuberant Animated Mascot SVG */}
      <div
        className="relative z-10 transition-transform hover:scale-105"
        style={{
          animation: 'rejoiceHop 1.8s cubic-bezier(0.34, 1.56, 0.64, 1) infinite',
        }}
      >
        <svg
          width="130"
          height="125"
          viewBox="0 0 130 125"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.3)]"
        >
          {/* Animated Flapping Wings */}
          {/* Left Wing (holding golden scroll of intellect) */}
          <g className="origin-[35px_65px] animate-[wingFlapLeft_0.9s_ease-in-out_infinite_alternate]">
            <path
              d="M36 62C20 54 8 40 12 28C16 16 32 30 42 46C44 49 46 54 44 58L36 62Z"
              fill="#4338CA"
            />
            <path
              d="M34 60C22 52 14 42 16 32C18 24 28 34 38 46"
              stroke="#6366F1"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Rolled Diploma / Sovereign Scroll of Intellect */}
            <g transform="translate(6, 22) rotate(-22)">
              <rect x="0" y="0" width="22" height="7" rx="3.5" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.2" />
              <rect x="18" y="-1" width="3" height="9" rx="1.5" fill="#EF4444" />
              <line x1="4" y1="3.5" x2="15" y2="3.5" stroke="#D97706" strokeWidth="0.8" strokeDasharray="1 1" />
            </g>
          </g>

          {/* Right Wing (waving exultantly with sparkles) */}
          <g className="origin-[95px_65px] animate-[wingFlapRight_0.9s_ease-in-out_infinite_alternate]">
            <path
              d="M94 62C110 54 122 40 118 28C114 16 98 30 88 46C86 49 84 54 86 58L94 62Z"
              fill="#4338CA"
            />
            <path
              d="M96 60C108 52 116 42 114 32C112 24 102 34 92 46"
              stroke="#6366F1"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Golden Starburst held in right wing */}
            <circle cx="118" cy="24" r="5" fill="#FBBF24" className="animate-ping" />
            <path d="M118 16V32M110 24H126" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Body of Archie the Owl */}
          <ellipse cx="65" cy="72" rx="34" ry="38" fill="#312E81" />
          {/* Feather belly gradient / texture */}
          <ellipse cx="65" cy="77" rx="23" ry="26" fill="#4F46E5" />
          {/* Wisdom feather notches */}
          <path d="M57 66C61 70 69 70 73 66" stroke="#A5B4FC" strokeWidth="2" strokeLinecap="round" />
          <path d="M54 75C60 79 70 79 76 75" stroke="#A5B4FC" strokeWidth="2" strokeLinecap="round" />
          <path d="M58 84C62 88 68 88 72 84" stroke="#A5B4FC" strokeWidth="2" strokeLinecap="round" />

          {/* Feet grasping perch */}
          <ellipse cx="53" cy="108" rx="7" ry="4" fill="#F59E0B" />
          <ellipse cx="77" cy="108" rx="7" ry="4" fill="#F59E0B" />

          {/* Head */}
          <circle cx="65" cy="48" r="28" fill="#3730A3" />

          {/* Eye Mask & Huge Scholarly Expressive Eyes */}
          <ellipse cx="53" cy="48" rx="13" ry="14" fill="#FFFFFF" />
          <ellipse cx="77" cy="48" rx="13" ry="14" fill="#FFFFFF" />

          {/* Golden Amber Irises (wide and full of wonder & optimism) */}
          <circle cx="54" cy="48" r="8" fill="#F59E0B" />
          <circle cx="76" cy="48" r="8" fill="#F59E0B" />

          {/* Deep Pupils with sparkling joy reflections */}
          <circle cx="55" cy="48" r="5" fill="#1E1B4B" />
          <circle cx="75" cy="48" r="5" fill="#1E1B4B" />
          {/* Sparkles in pupils */}
          <circle cx="53" cy="46" r="2.2" fill="#FFFFFF" />
          <circle cx="56.5" cy="49.5" r="1.2" fill="#FFFFFF" />
          <circle cx="73" cy="46" r="2.2" fill="#FFFFFF" />
          <circle cx="76.5" cy="49.5" r="1.2" fill="#FFFFFF" />

          {/* Intellectual Wireframe Spectacles (Gold rims across eyes) */}
          <circle cx="53" cy="48" r="13.5" stroke="#FBBF24" strokeWidth="2.2" fill="none" />
          <circle cx="77" cy="48" r="13.5" stroke="#FBBF24" strokeWidth="2.2" fill="none" />
          {/* Spectacle Bridge & Arms */}
          <path d="M66.5 48C65 46.5 65 46.5 63.5 48" stroke="#FBBF24" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M39.5 47L33 45" stroke="#FBBF24" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M90.5 47L97 45" stroke="#FBBF24" strokeWidth="1.8" strokeLinecap="round" />

          {/* Cheerful Golden Beak (wide beaming smile of pure optimism) */}
          <path
            d="M60 55C60 55 65 65 65 65C65 65 70 55 70 55C70 55 65 57 60 55Z"
            fill="#F59E0B"
            stroke="#D97706"
            strokeWidth="1.2"
          />
          {/* Open mouth smile inside */}
          <path d="M62 57C63.5 60 66.5 60 68 57" stroke="#B45309" strokeWidth="1.4" strokeLinecap="round" />

          {/* Scholar's Mortarboard (Academic Cap of Intellect) */}
          <g transform="translate(65, 23) rotate(-6)">
            {/* Skullcap */}
            <ellipse cx="0" cy="5" rx="14" ry="6" fill="#1E1B4B" />
            {/* Diamond Board */}
            <polygon points="0,-7 26,0 0,7 -26,0" fill="#111827" stroke="#374151" strokeWidth="1" />
            {/* Mortarboard Center Button */}
            <circle cx="0" cy="0" r="2.5" fill="#F59E0B" />
            {/* Swinging Gold Tassel */}
            <path
              d="M0 0C6 4 14 9 18 17"
              stroke="#F59E0B"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              className="origin-top animate-[tasselSwing_1.2s_ease-in-out_infinite_alternate]"
            />
            {/* Tassel fringe */}
            <rect x="16" y="16" width="4" height="6" rx="1" fill="#F59E0B" />
          </g>
        </svg>
      </div>

      {/* Exuberant Speech Bubble / Badge */}
      <div className="mt-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-teal-500/20 border border-amber-400/40 text-amber-300 font-bold text-[11px] tracking-wide uppercase flex items-center gap-1.5 shadow-sm">
        <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
        <span>Optimism &amp; Intellect Unlocked!</span>
      </div>

      <style>{`
        @keyframes rejoiceHop {
          0%, 100% { transform: translateY(0) scale(1); }
          30% { transform: translateY(-12px) scale(1.05) rotate(-2deg); }
          60% { transform: translateY(-4px) scale(1.02) rotate(2deg); }
        }
        @keyframes wingFlapLeft {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-18deg) translateY(-4px); }
        }
        @keyframes wingFlapRight {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(18deg) translateY(-4px); }
        }
        @keyframes tasselSwing {
          0% { transform: rotate(-8deg); }
          100% { transform: rotate(12deg); }
        }
      `}</style>
    </div>
  );
};

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({
  isOpen,
  onClose,
  celebrationData,
  isDark,
  onOpenLedger,
  onOpenRetrospective,
}) => {
  // Web Audio celebratory chime upon popup trigger
  useEffect(() => {
    if (!isOpen) return;

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      // Uplifting celebratory chord arpeggio: C5 (523.25), E5 (659.25), G5 (783.99), C6 (1046.50)
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + idx * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.85);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.9);
      });
    } catch {
      // Audio playback may be silenced by browser policy, safe to proceed
    }
  }, [isOpen]);

  if (!isOpen || !celebrationData) return null;

  return (
    <div
      id="celebration-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-none"
    >
      {/* Shower of Sprinkles and Party Papers across full screen */}
      <PartyPapersAndSprinkles />

      {/* Plasma Event Ambient Backdrop */}
      <div
        className="fixed inset-0 animate-plasma opacity-85 transition-opacity pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(circle at 50% 40%, rgba(59, 130, 246, 0.22) 0%, transparent 70%), #131417'
            : 'radial-gradient(circle at 50% 40%, rgba(59, 130, 246, 0.15) 0%, transparent 70%), #F5F3EF',
          filter: 'blur(45px)',
        }}
      />

      {/* Semi-transparent backdrop scrim */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Celebration Modal Card */}
      <div
        id="celebration-badge-card"
        className={`relative z-50 max-w-lg w-full p-6 sm:p-8 rounded-[32px] text-center shadow-2xl transition-all border ${
          isDark
            ? 'bg-[#151519]/95 text-white border-white/15'
            : 'bg-white/95 text-slate-900 border-black/10'
        }`}
        style={{
          backdropFilter: 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: 'blur(30px) saturate(180%)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px rgba(245, 158, 11, 0.15)',
          animation: 'springOvershoot 500ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        }}
      >
        {/* Dismiss Button */}
        <button
          id="celebration-close-btn"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[var(--stele-text-muted)] hover:text-[var(--stele-text-primary)] rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors z-20"
          title="Close Celebration"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Exuberant Intellectual Mascot */}
        <ArchieMascot />

        {/* Big Points Congratulation Header */}
        <div className="mt-3 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-[18px] sm:text-[20px] shadow-lg animate-pulse tracking-tight">
            <Zap className="w-5 h-5 fill-black" />
            <span>+{celebrationData.points} POINTS AWARDED!</span>
          </div>

          {/* Points Breakdown Pills */}
          {celebrationData.pointsBreakdown && celebrationData.pointsBreakdown.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2.5">
              {celebrationData.pointsBreakdown.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-[8px] bg-black/10 dark:bg-white/10 text-[11px] font-mono font-semibold text-[var(--stele-text-secondary)] border border-white/10"
                >
                  {item.label}: <strong className="text-amber-400">+{item.points}</strong>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Tailored Task Title */}
        <h2 className="text-[20px] sm:text-[23px] font-extrabold mt-4 leading-snug tracking-tight text-[var(--stele-text-primary)]">
          {celebrationData.title}
        </h2>

        {/* Witness & Credential Line */}
        {celebrationData.witnessName ? (
          <p className="text-[12px] font-medium text-emerald-500 dark:text-emerald-400 mt-1 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Witnessed by <strong>{celebrationData.witnessName}</strong> &middot; Inscribed to Sovereign Ledger</span>
          </p>
        ) : (
          <p className="text-[12px] font-medium text-[var(--stele-accent)] mt-1 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Sovereign Milestone Confirmed &amp; Inscribed</span>
          </p>
        )}

        {/* Tailored Task Congratulation Message Card */}
        <div
          className={`mt-4 p-4 rounded-[20px] text-left border relative overflow-hidden ${
            isDark
              ? 'bg-black/30 border-white/10 text-slate-200'
              : 'bg-amber-50/80 border-amber-200/80 text-slate-800'
          }`}
        >
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-amber-500 block">
                Intellect &amp; Impact Assessment
              </span>
              <p className="text-[13.5px] leading-relaxed mt-1 font-normal">
                {celebrationData.tailoredMessage}
              </p>
            </div>
          </div>

          {/* Cryptographic Ledger Inscription Stamp */}
          {celebrationData.hash && (
            <div className="mt-3 pt-2.5 border-t border-white/10 dark:border-white/10 flex items-center justify-between text-[10.5px] text-[var(--stele-text-muted)] font-mono">
              <span>LEDGER RECORD:</span>
              <span className="text-[var(--stele-accent)] font-semibold truncate max-w-[200px]">
                {celebrationData.hash}
              </span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          {onOpenRetrospective && (
            <button
              id="celebration-retro-btn"
              type="button"
              onClick={() => {
                onClose();
                onOpenRetrospective();
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-[16px] bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 dark:text-indigo-300 font-semibold text-[13px] border border-indigo-500/30 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
              title="Add a 2-minute retrospective for +40 extra knowledge points"
            >
              <BookOpen className="w-4 h-4" />
              <span>Inscribe Wiki Retrospective (+40)</span>
            </button>
          )}

          {onOpenLedger && (
            <button
              id="celebration-ledger-btn"
              type="button"
              onClick={() => {
                onClose();
                onOpenLedger();
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-[16px] bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-[var(--stele-text-primary)] font-medium text-[13px] border border-white/15 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Inspect Ledger</span>
            </button>
          )}

          <button
            id="celebration-continue-btn"
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-[16px] bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold text-[14px] shadow-lg shadow-amber-500/25 active:scale-[0.98] transition-all"
          >
            Celebrate &amp; Continue
          </button>
        </div>
      </div>
    </div>
  );
};
