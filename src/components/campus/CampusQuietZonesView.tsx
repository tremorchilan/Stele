import React, { useState } from 'react';
import { CampusQuietZone } from '../../types';
import { MOCK_QUIET_ZONES } from '../../data/academicCalendarData';
import {
  Volume2,
  VolumeX,
  Wifi,
  Zap,
  CheckCircle2,
  ArrowLeft,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface CampusQuietZonesViewProps {
  onBack: () => void;
  onShowToast: (msg: string) => void;
  isDark: boolean;
}

export const CampusQuietZonesView: React.FC<CampusQuietZonesViewProps> = ({
  onBack,
  onShowToast,
  isDark,
}) => {
  const [zones, setZones] = useState<CampusQuietZone[]>(MOCK_QUIET_ZONES);
  const [reservedZoneId, setReservedZoneId] = useState<string | null>(null);

  const handleReserve = (zone: CampusQuietZone) => {
    if (reservedZoneId === zone.id) {
      setReservedZoneId(null);
      onShowToast(`Pod reservation at ${zone.name} released.`);
      return;
    }
    setReservedZoneId(zone.id);
    onShowToast(`45-minute focus session reserved at ${zone.name}! Access pin sent to your Stele ledger.`);
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-[12px] bg-[var(--tile)] border border-[rgba(255,255,255,0.08)] text-[var(--meta)] hover:text-[var(--text)] transition-colors cursor-pointer"
            aria-label="Back to Campus Hub"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent)]">
                Sensory Environment
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-[6px] bg-emerald-500/15 text-emerald-400 font-bold">
                Real-Time Acoustic Telemetry
              </span>
            </div>
            <h1 className="text-[22px] font-extrabold text-[var(--text)] mt-0.5">
              Campus Quiet Zones &amp; Live Study Pods
            </h1>
          </div>
        </div>

        <span className="text-[12px] text-[var(--meta)] font-mono">
          Updated 10s ago via Campus Acoustic Enclaves
        </span>
      </div>

      {/* Zones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {zones.map((zone) => {
          const isReserved = reservedZoneId === zone.id;
          return (
            <div
              key={zone.id}
              className={`p-5 rounded-[22px] bg-[var(--tile)] border transition-all flex flex-col justify-between ${
                isReserved
                  ? 'border-emerald-500 ring-1 ring-emerald-500 shadow-md'
                  : 'border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.18)]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-[6px] flex items-center gap-1 ${
                      zone.noiseLevel === 'Silent'
                        ? 'bg-purple-500/15 text-purple-400'
                        : zone.noiseLevel === 'Whisper'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-amber-500/15 text-amber-400'
                    }`}
                  >
                    {zone.noiseLevel === 'Silent' ? (
                      <VolumeX className="w-3 h-3" />
                    ) : (
                      <Volume2 className="w-3 h-3" />
                    )}
                    <span>{zone.noiseLevel} Zone</span>
                  </span>

                  <span className="text-[14px] font-mono font-bold text-[var(--text)]">
                    {zone.noiseDb} dB
                  </span>
                </div>

                <h3 className="text-[17px] font-bold text-[var(--text)]">
                  {zone.name}
                </h3>

                <p className="text-[12px] text-[var(--meta)] flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>{zone.location}</span>
                </p>

                {/* Amenities */}
                <div className="flex items-center gap-3 mt-4 text-[11.5px] text-[var(--meta)]">
                  <span className="flex items-center gap-1">
                    <Wifi className="w-3.5 h-3.5 text-sky-400" />
                    <span>{zone.wifiSpeedMbps} Mbps</span>
                  </span>
                  {zone.powerOutlets && (
                    <span className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>USB-C / AC</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>45m Slots</span>
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center justify-between text-[12px] mb-2">
                  <span className="text-[var(--meta)]">Available Pods:</span>
                  <span className="font-bold text-[var(--text)] font-mono">
                    {isReserved ? zone.availablePods - 1 : zone.availablePods} / {zone.totalPods} Free
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleReserve(zone)}
                  className={`w-full py-2 rounded-[12px] text-[12.5px] font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 ${
                    isReserved
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                      : 'bg-[var(--accent)] text-white hover:opacity-90'
                  }`}
                >
                  {isReserved ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Reserved · Slot Active</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Reserve 45m Pod</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
