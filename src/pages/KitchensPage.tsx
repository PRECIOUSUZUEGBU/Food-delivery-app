import { ArrowRight, Bike, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { useState } from 'react';
import { ResilientImage } from '../components/ResilientImage';
import { ThemeToggle } from '../components/ThemeToggle';
import {
  COURIER_DISPATCH_IMAGE,
  DELIVERY_ZONES,
  KITCHENS,
} from '../data/catalog';
import { Kitchen } from '../types/food';

interface KitchensPageProps {
  theme: 'light' | 'dark';
  selectedNeighborhood: string;
  onToggleTheme: (next: 'light' | 'dark') => void;
  onSelectNeighborhood: (neighborhood: string) => void;
  onBrowseKitchenMenu: (kitchenId: string) => void;
}

export function KitchensPage({
  theme,
  selectedNeighborhood,
  onToggleTheme,
  onSelectNeighborhood,
  onBrowseKitchenMenu,
}: KitchensPageProps) {
  const [postalInput, setPostalInput] = useState('');
  const [postalMessage, setPostalMessage] = useState<string | null>(null);

  const activeZone =
    DELIVERY_ZONES.find((z) => z.neighborhood === selectedNeighborhood) ??
    DELIVERY_ZONES[0];

  const handleCheckPostal = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = postalInput.trim();
    if (!cleaned) {
      setPostalMessage('Enter a 5-digit neighborhood postal code (e.g. 10012).');
      return;
    }

    const matched = DELIVERY_ZONES.find((z) => z.postalCodes.includes(cleaned));
    if (matched) {
      onSelectNeighborhood(matched.neighborhood);
      setPostalMessage(
        `Covered by ${matched.neighborhood} courier dispatch (${matched.etaWindow}, $${matched.fee.toFixed(2)} bike fee or free over $${matched.freeThreshold}).`,
      );
    } else {
      setPostalMessage(
        `Postal code ${cleaned} is outside our 4-neighborhood bike radius. Select a supported zone below.`,
      );
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-8 sm:pt-12 space-y-16">
      {/* Page Header + Dispatch Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pb-10 border-b border-black/[0.08] dark:border-white/[0.10]">
        <div className="lg:col-span-6 flex flex-col justify-center">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <p className="text-xs font-medium text-[#164E38] dark:text-[#5FD39E]">
              Partner Kitchens &amp; Delivery Zones
            </p>
            <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#141517] dark:text-[#F3F4F6] text-balance">
            Four chef-led kitchens cooking fresh across the neighborhood
          </h1>
          <p className="mt-4 text-[15px] text-[#52565E] dark:text-[#9CA3AF] max-w-[56ch] leading-relaxed">
            Each partner kitchen operates its own hearth, pasta bench, or pastry deck.
            Our insulated cargo bike fleet synchronizes pickups so dishes from multiple
            counters arrive together in one drop.
          </p>
          <div className="mt-6 flex flex-wrap gap-6 text-xs text-[#52565E] dark:text-[#9CA3AF] pt-5 border-t border-black/[0.06] dark:border-white/[0.08]">
            <div>
              <span className="block font-semibold text-[#141517] dark:text-[#F3F4F6] text-sm tabular-nums">
                4 Counters
              </span>
              <span>Within 3.2 km radius</span>
            </div>
            <div>
              <span className="block font-semibold text-[#141517] dark:text-[#F3F4F6] text-sm tabular-nums">
                62°C Thermal
              </span>
              <span>Insulated bike boxes</span>
            </div>
            <div>
              <span className="block font-semibold text-[#141517] dark:text-[#F3F4F6] text-sm">
                Zero Plastic
              </span>
              <span>Compostable kraft vessels</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-black/[0.08] dark:border-white/[0.10] bg-[#F1F2F3] dark:bg-[#1F2329] aspect-[4/3] lg:aspect-auto">
          <ResilientImage
            src={COURIER_DISPATCH_IMAGE}
            alt="Cargo bicycle with insulated delivery box outside neighborhood kitchen storefront"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Partner Kitchens List */}
      <section aria-label="Partner kitchens" className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {KITCHENS.map((kitchen: Kitchen) => (
          <article
            key={kitchen.id}
            className="bg-white dark:bg-[#171A1E] border border-black/[0.08] dark:border-white/[0.10] rounded-2xl overflow-hidden flex flex-col"
          >
            <div className="aspect-[16/10] w-full bg-[#F1F2F3] dark:bg-[#1F2329] overflow-hidden">
              <ResilientImage
                src={kitchen.image}
                alt={`${kitchen.name} — ${kitchen.signatureDish}`}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#52565E] dark:text-[#9CA3AF] mb-2">
                  <span className="font-semibold text-[#164E38] dark:text-[#5FD39E]">
                    {kitchen.neighborhood}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">Hours {kitchen.hours}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">~{kitchen.avgPrepMinutes} min prep</span>
                </div>

                <h2 className="font-display text-2xl font-semibold text-[#141517] dark:text-[#F3F4F6]">
                  {kitchen.name}
                </h2>
                <p className="text-sm font-medium text-[#52565E] dark:text-[#9CA3AF] mt-1">
                  {kitchen.specialty} · Head Chef {kitchen.chefName}
                </p>

                <p className="mt-3.5 text-sm text-[#52565E] dark:text-[#9CA3AF] leading-relaxed">
                  {kitchen.description}
                </p>

                <p className="mt-3 text-xs text-[#52565E] dark:text-[#9CA3AF] bg-[#FAFAFA] dark:bg-[#0F1113] border border-black/[0.06] dark:border-white/[0.08] rounded-lg px-3.5 py-2.5">
                  <span className="font-semibold text-[#141517] dark:text-[#F3F4F6]">
                    Sourcing:
                  </span>{' '}
                  {kitchen.sourcingNote}
                </p>
              </div>

              <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-[#52565E] dark:text-[#9CA3AF]">
                  <span>Signature: </span>
                  <span className="font-semibold text-[#141517] dark:text-[#F3F4F6]">
                    {kitchen.signatureDish}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onBrowseKitchenMenu(kitchen.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#164E38] hover:bg-[#113D2B] dark:bg-[#1D6347] dark:hover:bg-[#164E38] text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
                >
                  <span>View Kitchen Menu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Interactive Delivery Zone Checker & Architectural SVG Coverage Map */}
      <section className="bg-white dark:bg-[#171A1E] border border-black/[0.08] dark:border-white/[0.10] rounded-2xl p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-5">
            <div>
              <p className="text-xs font-medium text-[#164E38] dark:text-[#5FD39E] mb-1.5">
                Bike Courier Coverage
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#141517] dark:text-[#F3F4F6] text-balance">
                Check delivery time for your block
              </h2>
              <p className="mt-2.5 text-sm text-[#52565E] dark:text-[#9CA3AF] leading-relaxed">
                Enter a local postal code (try{' '}
                <span className="font-mono text-[#141517] dark:text-[#F3F4F6]">10012</span>,{' '}
                <span className="font-mono text-[#141517] dark:text-[#F3F4F6]">10001</span>,{' '}
                <span className="font-mono text-[#141517] dark:text-[#F3F4F6]">10023</span>, or{' '}
                <span className="font-mono text-[#141517] dark:text-[#F3F4F6]">10025</span>) or
                click any neighborhood hub on the dispatch grid.
              </p>
            </div>

            <form onSubmit={handleCheckPostal} className="flex gap-2.5">
              <input
                type="text"
                inputMode="numeric"
                maxLength={10}
                value={postalInput}
                onChange={(e) => setPostalInput(e.target.value)}
                placeholder="Postal code (e.g. 10012)"
                aria-label="Postal code"
                className="flex-1 px-3.5 py-2.5 text-sm bg-[#FAFAFA] dark:bg-[#0F1113] border border-black/[0.12] dark:border-white/[0.14] rounded-lg text-[#141517] dark:text-[#F3F4F6] placeholder:text-[#737882] dark:placeholder:text-[#6B7280] focus:outline-none focus:border-[#164E38] dark:focus:border-[#5FD39E] min-h-[44px]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#141517] hover:bg-[#2A2D32] dark:bg-[#F3F4F6] dark:hover:bg-white text-white dark:text-[#141517] text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
              >
                Check Zone
              </button>
            </form>

            {postalMessage && (
              <div className="p-3.5 rounded-lg bg-[#FAFAFA] dark:bg-[#0F1113] border border-black/[0.08] dark:border-white/[0.10] text-xs text-[#141517] dark:text-[#F3F4F6] flex items-start gap-2.5 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-[#164E38] dark:text-[#5FD39E] shrink-0 mt-0.5" />
                <span>{postalMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 pt-2">
              {DELIVERY_ZONES.map((zone) => {
                const isSelected = zone.id === activeZone.id;
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => {
                      onSelectNeighborhood(zone.neighborhood);
                      setPostalMessage(null);
                    }}
                    className={`text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-[#164E38] dark:border-[#5FD39E] bg-[#164E38]/[0.05] dark:bg-[#1D6347]/20'
                        : 'border-black/[0.08] dark:border-white/[0.10] bg-[#FAFAFA] dark:bg-[#0F1113] hover:border-black/20 dark:hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#141517] dark:text-[#F3F4F6]">
                        <MapPin className="w-4 h-4 text-[#164E38] dark:text-[#5FD39E]" />
                        {zone.neighborhood}
                      </span>
                      <span className="text-xs font-mono tabular-nums text-[#52565E] dark:text-[#9CA3AF]">
                        ${zone.fee.toFixed(2)} · {zone.distanceKm} km
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#52565E] dark:text-[#9CA3AF]">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="tabular-nums">{zone.etaWindow}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-[11px]">
                        {zone.postalCodes.join(', ')}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive SVG Dispatch Street Grid */}
          <div className="lg:col-span-7 bg-[#FAFAFA] dark:bg-[#0F1113] border border-black/[0.08] dark:border-white/[0.10] rounded-xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#52565E] dark:text-[#9CA3AF]">
              <span className="font-semibold text-[#141517] dark:text-[#F3F4F6] inline-flex items-center gap-1.5">
                <Bike className="w-4 h-4 text-[#164E38] dark:text-[#5FD39E]" />
                Interactive Neighborhood Courier Grid
              </span>
              <span className="tabular-nums font-mono">
                Active Zone: {activeZone.neighborhood} ({activeZone.etaWindow})
              </span>
            </div>

            <div className="relative aspect-[16/10] w-full rounded-lg bg-white dark:bg-[#171A1E] border border-black/[0.06] dark:border-white/[0.08] overflow-hidden">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="w-full h-full text-black/[0.08] dark:text-white/[0.08]"
                aria-label="Neighborhood bike courier coverage map"
              >
                {[15, 30, 45, 60, 75, 90].map((pos) => (
                  <g key={pos}>
                    <line
                      x1={pos}
                      y1="0"
                      x2={pos}
                      y2="100"
                      stroke="currentColor"
                      strokeWidth="0.4"
                    />
                    <line
                      x1="0"
                      y1={pos}
                      x2="100"
                      y2={pos}
                      stroke="currentColor"
                      strokeWidth="0.4"
                    />
                  </g>
                ))}

                <path
                  d="M 88 0 Q 94 45 86 100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                />

                {DELIVERY_ZONES.map((zone) => {
                  const isActive = zone.id === activeZone.id;
                  return (
                    <line
                      key={`route-${zone.id}`}
                      x1="50"
                      y1="52"
                      x2={zone.mapCoords.x}
                      y2={zone.mapCoords.y}
                      stroke={
                        isActive
                          ? theme === 'dark'
                            ? '#5FD39E'
                            : '#164E38'
                          : theme === 'dark'
                            ? '#374151'
                            : '#CBD5E1'
                      }
                      strokeWidth={isActive ? '1.2' : '0.6'}
                      strokeDasharray={isActive ? 'none' : '1.5 1.5'}
                    />
                  );
                })}

                <circle
                  cx="50"
                  cy="52"
                  r="2.8"
                  fill={theme === 'dark' ? '#F3F4F6' : '#141517'}
                />
              </svg>

              {/* Hub Label */}
              <div
                className="absolute -translate-x-1/2 translate-y-2 pointer-events-none"
                style={{ left: '50%', top: '52%' }}
              >
                <span className="bg-[#141517] dark:bg-[#F3F4F6] text-white dark:text-[#141517] text-[10px] font-semibold px-2 py-0.5 rounded whitespace-nowrap shadow-xs">
                  Kitchen Hub
                </span>
              </div>

              {/* Clickable Zone Pins */}
              {DELIVERY_ZONES.map((zone) => {
                const isActive = zone.id === activeZone.id;
                return (
                  <button
                    key={`pin-${zone.id}`}
                    type="button"
                    onClick={() => {
                      onSelectNeighborhood(zone.neighborhood);
                      setPostalMessage(null);
                    }}
                    style={{
                      left: `${zone.mapCoords.x}%`,
                      top: `${zone.mapCoords.y}%`,
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shadow-sm border ${
                      isActive
                        ? 'bg-[#164E38] dark:bg-[#1D6347] text-white border-[#164E38] dark:border-[#5FD39E] scale-105 z-10'
                        : 'bg-white dark:bg-[#1F2329] text-[#141517] dark:text-[#F3F4F6] border-black/[0.12] dark:border-white/[0.14] hover:border-[#164E38] dark:hover:border-[#5FD39E]'
                    }`}
                  >
                    {zone.neighborhood}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2 text-xs">
              <div className="bg-white dark:bg-[#171A1E] border border-black/[0.06] dark:border-white/[0.08] rounded-lg p-3">
                <span className="text-[#52565E] dark:text-[#9CA3AF] block">
                  Estimated Arrival
                </span>
                <span className="font-semibold text-[#141517] dark:text-[#F3F4F6] tabular-nums mt-0.5 block">
                  {activeZone.etaWindow}
                </span>
              </div>
              <div className="bg-white dark:bg-[#171A1E] border border-black/[0.06] dark:border-white/[0.08] rounded-lg p-3">
                <span className="text-[#52565E] dark:text-[#9CA3AF] block">Bike Fee</span>
                <span className="font-semibold text-[#141517] dark:text-[#F3F4F6] tabular-nums font-mono mt-0.5 block">
                  ${activeZone.fee.toFixed(2)} (Free $45+)
                </span>
              </div>
              <div className="bg-white dark:bg-[#171A1E] border border-black/[0.06] dark:border-white/[0.08] rounded-lg p-3">
                <span className="text-[#52565E] dark:text-[#9CA3AF] block">
                  Dispatch Mode
                </span>
                <span className="font-semibold text-[#141517] dark:text-[#F3F4F6] mt-0.5 block truncate">
                  {activeZone.courierMethod}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
