import { ArrowRight, MapPin } from 'lucide-react';
import { DishCard } from '../components/DishCard';
import { ResilientImage } from '../components/ResilientImage';
import { ThemeToggle } from '../components/ThemeToggle';
import {
  CHEF_PASS_IMAGE,
  DELIVERY_ZONES,
  HERO_IMAGE,
  NEIGHBORHOOD_REVIEWS,
} from '../data/catalog';
import { Dish, DishCategory, PageId } from '../types/food';

interface HomePageProps {
  dishes: Dish[];
  theme: 'light' | 'dark';
  selectedNeighborhood: string;
  favoriteIds: string[];
  getDishBagQty: (dishId: string) => number;
  onToggleTheme: (next: 'light' | 'dark') => void;
  onToggleFavorite: (dishId: string) => void;
  onSelectNeighborhood: (neighborhood: string) => void;
  onNavigate: (page: PageId) => void;
  onBrowseCategory: (category: DishCategory) => void;
  onSelectDish: (dish: Dish) => void;
  onQuickAdd: (dish: Dish) => void;
  onAdjustDishQty: (dish: Dish, delta: number) => void;
}

const CRAFT_CATEGORIES: {
  category: Exclude<DishCategory, 'All Dishes'>;
  kitchen: string;
  note: string;
}[] = [
  {
    category: 'Wood-Fired',
    kitchen: 'Fornace Sourdough',
    note: '72-hr dough baked at 485°C',
  },
  {
    category: 'Fresh Pasta',
    kitchen: 'Pastificio Verde',
    note: 'Daily extruded & hand-cut',
  },
  {
    category: 'Hearth Bowls',
    kitchen: 'Hearth & Grain',
    note: 'Charred fish, poultry & farro',
  },
  {
    category: 'Bakery & Sweet',
    kitchen: 'Maison Crumb',
    note: 'Laminated pastry & dark tarts',
  },
];

export function HomePage({
  dishes,
  theme,
  selectedNeighborhood,
  favoriteIds,
  getDishBagQty,
  onToggleTheme,
  onToggleFavorite,
  onSelectNeighborhood,
  onNavigate,
  onBrowseCategory,
  onSelectDish,
  onQuickAdd,
  onAdjustDishQty,
}: HomePageProps) {
  const featuredDishes = dishes.filter((d) => d.featured).slice(0, 6);
  const currentZone =
    DELIVERY_ZONES.find((z) => z.neighborhood === selectedNeighborhood) ??
    DELIVERY_ZONES[1];

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
      {/* Section 1: Storefront Split Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        <div className="lg:col-span-6 flex flex-col justify-between bg-white dark:bg-[#171A1E] border border-black/[0.08] dark:border-white/[0.10] rounded-2xl p-6 sm:p-10">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <p className="text-xs font-medium text-[#52565E] dark:text-[#9CA3AF]">
                Four kitchens · {currentZone.etaWindow} bike delivery
              </p>
              <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
            </div>

            <h1 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.08] font-semibold tracking-tight text-[#141517] dark:text-[#F3F4F6] text-balance">
              Chef-made dinner, brought warm to your table.
            </h1>

            <p className="mt-5 text-[15px] sm:text-base text-[#52565E] dark:text-[#9CA3AF] leading-relaxed max-w-[52ch]">
              Order wood-fired sourdough, hand-rolled pasta, hearth-roasted bowls, and
              laminated pastries straight from four independent local kitchens—delivered by
              cargo bike in compostable packaging.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-black/[0.06] dark:border-white/[0.08] space-y-4">
            <div>
              <label
                htmlFor="hero-neighborhood"
                className="block text-xs font-medium text-[#52565E] dark:text-[#9CA3AF] mb-2"
              >
                Delivery neighborhood
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <MapPin className="w-4 h-4 text-[#164E38] dark:text-[#5FD39E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    id="hero-neighborhood"
                    value={selectedNeighborhood}
                    onChange={(e) => onSelectNeighborhood(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-sm font-medium bg-[#FAFAFA] dark:bg-[#0F1113] border border-black/[0.12] dark:border-white/[0.14] rounded-lg text-[#141517] dark:text-[#F3F4F6] focus:outline-none focus:border-[#164E38] dark:focus:border-[#5FD39E] min-h-[44px] cursor-pointer"
                  >
                    {DELIVERY_ZONES.map((zone) => (
                      <option key={zone.id} value={zone.neighborhood}>
                        {zone.neighborhood} ({zone.etaWindow})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onNavigate('menu');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#164E38] hover:bg-[#113D2B] dark:bg-[#1D6347] dark:hover:bg-[#164E38] text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[44px]"
                >
                  <span>Explore Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-black/[0.08] dark:border-white/[0.10] bg-[#F1F2F3] dark:bg-[#1F2329] min-h-[300px] lg:min-h-[460px]">
          <ResilientImage
            src={HERO_IMAGE}
            alt="Artisanal dinner spread with blistered sourdough pizza, fresh pasta, and roasted seasonal vegetables"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Full-width 4-column summary strip directly below Hero */}
      <section
        aria-label="Service highlights"
        className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="bg-white dark:bg-[#171A1E] border border-black/[0.08] dark:border-white/[0.10] rounded-xl p-5">
          <p className="text-xs font-medium text-[#52565E] dark:text-[#9CA3AF]">
            01. Dispatch Window
          </p>
          <p className="mt-1.5 text-lg font-semibold text-[#141517] dark:text-[#F3F4F6] tabular-nums">
            {currentZone.etaWindow}
          </p>
          <p className="mt-1 text-xs text-[#52565E] dark:text-[#9CA3AF]">
            Active in {currentZone.neighborhood}
          </p>
        </div>
        <div className="bg-white dark:bg-[#171A1E] border border-black/[0.08] dark:border-white/[0.10] rounded-xl p-5">
          <p className="text-xs font-medium text-[#52565E] dark:text-[#9CA3AF]">
            02. Free Delivery
          </p>
          <p className="mt-1.5 text-lg font-semibold text-[#141517] dark:text-[#F3F4F6] tabular-nums">
            Orders $45+
          </p>
          <p className="mt-1 text-xs text-[#52565E] dark:text-[#9CA3AF]">
            Otherwise ${currentZone.fee.toFixed(2)} flat bike fee
          </p>
        </div>
        <div className="bg-white dark:bg-[#171A1E] border border-black/[0.08] dark:border-white/[0.10] rounded-xl p-5">
          <p className="text-xs font-medium text-[#52565E] dark:text-[#9CA3AF]">
            03. Direct Kitchens
          </p>
          <p className="mt-1.5 text-lg font-semibold text-[#141517] dark:text-[#F3F4F6] tabular-nums">
            4 Partner Counters
          </p>
          <p className="mt-1 text-xs text-[#52565E] dark:text-[#9CA3AF]">
            Combined in a single bag
          </p>
        </div>
        <div className="bg-white dark:bg-[#171A1E] border border-black/[0.08] dark:border-white/[0.10] rounded-xl p-5">
          <p className="text-xs font-medium text-[#52565E] dark:text-[#9CA3AF]">
            04. Packaging Standard
          </p>
          <p className="mt-1.5 text-lg font-semibold text-[#141517] dark:text-[#F3F4F6]">
            Zero Plastic
          </p>
          <p className="mt-1 text-xs text-[#52565E] dark:text-[#9CA3AF]">
            Compostable pulp &amp; kraft sleeves
          </p>
        </div>
      </section>

      {/* Browse by Craft Strip */}
      <section className="mt-14">
        <div className="flex items-center justify-between gap-4 mb-5">
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#141517] dark:text-[#F3F4F6]">
            Browse by kitchen craft
          </h2>
          <span className="text-xs text-[#52565E] dark:text-[#9CA3AF] tabular-nums">
            {dishes.length} dishes across 4 menus
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CRAFT_CATEGORIES.map((item) => {
            const count = dishes.filter((d) => d.category === item.category).length;
            return (
              <button
                key={item.category}
                type="button"
                onClick={() => {
                  onBrowseCategory(item.category);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group text-left bg-white dark:bg-[#171A1E] border border-black/[0.08] dark:border-white/[0.10] hover:border-[#164E38] dark:hover:border-[#5FD39E] rounded-xl p-5 transition-colors cursor-pointer flex items-center justify-between gap-3"
              >
                <div>
                  <p className="text-xs text-[#52565E] dark:text-[#9CA3AF]">
                    {item.kitchen}
                  </p>
                  <p className="text-base font-semibold text-[#141517] dark:text-[#F3F4F6] group-hover:text-[#164E38] dark:group-hover:text-[#5FD39E] mt-0.5 transition-colors">
                    {item.category}
                  </p>
                  <p className="text-xs text-[#737882] dark:text-[#9CA3AF] mt-1">
                    {item.note}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono tabular-nums text-[#52565E] dark:text-[#9CA3AF] block mb-2">
                    {count}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#52565E] dark:text-[#9CA3AF] group-hover:text-[#164E38] dark:group-hover:text-[#5FD39E] group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 2: Featured Menu Grid */}
      <section className="mt-16 sm:mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-medium text-[#164E38] dark:text-[#5FD39E] mb-1.5">
              Tonight&apos;s Kitchen Pass
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#141517] dark:text-[#F3F4F6] text-balance">
              Signature plates cooked to order
            </h2>
          </div>

          <button
            type="button"
            onClick={() => {
              onBrowseCategory('All Dishes');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#164E38] dark:text-[#5FD39E] hover:text-[#113D2B] dark:hover:text-[#86EFAC] cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>Browse All {dishes.length} Dishes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredDishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              bagQuantity={getDishBagQty(dish.id)}
              isFavorite={favoriteIds.includes(dish.id)}
              onToggleFavorite={onToggleFavorite}
              onSelectDish={onSelectDish}
              onQuickAdd={onQuickAdd}
              onAdjustDishQty={onAdjustDishQty}
            />
          ))}
        </div>
      </section>

      {/* Section 3: Craftsmanship & Neighborhood Reviews */}
      <section className="mt-16 sm:mt-20 space-y-6">
        <div className="bg-white dark:bg-[#171A1E] border border-black/[0.08] dark:border-white/[0.10] rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-6 aspect-[4/3] lg:aspect-auto bg-[#F1F2F3] dark:bg-[#1F2329]">
            <ResilientImage
              src={CHEF_PASS_IMAGE}
              alt="Chef plating fresh handmade tagliatelle pasta at the open kitchen pass"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
            <p className="text-xs font-medium text-[#164E38] dark:text-[#5FD39E] mb-2">
              Our Kitchen Collective
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#141517] dark:text-[#F3F4F6] text-balance">
              No ghost warehouses. Real chefs, open hearths, and local riders.
            </h2>
            <p className="mt-4 text-[15px] text-[#52565E] dark:text-[#9CA3AF] leading-relaxed">
              Every kitchen on Larder &amp; Table operates a physical neighborhood counter
              with daily market deliveries. Mix a wood-fired pie from Fornace Sourdough
              with handmade tagliatelle from Pastificio Verde in one synchronized bike drop.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  onNavigate('kitchens');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#141517] hover:bg-[#2A2D32] dark:bg-[#F3F4F6] dark:hover:bg-white text-white dark:text-[#141517] text-sm font-semibold rounded-lg transition-colors cursor-pointer min-h-[44px]"
              >
                <span>Meet Partner Kitchens</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onNavigate('orders');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-5 py-3 border border-black/[0.12] dark:border-white/[0.14] hover:bg-black/[0.03] dark:hover:bg-white/[0.05] text-[#141517] dark:text-[#F3F4F6] text-sm font-semibold rounded-lg transition-colors cursor-pointer min-h-[44px]"
              >
                <span>Track Active Order</span>
              </button>
            </div>
          </div>
        </div>

        {/* Claim-to-proof adjacent neighborhood reviews */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NEIGHBORHOOD_REVIEWS.map((review) => (
            <blockquote
              key={review.id}
              className="bg-white dark:bg-[#171A1E] border border-black/[0.08] dark:border-white/[0.10] rounded-xl p-6 flex flex-col justify-between gap-4"
            >
              <p className="text-sm text-[#141517] dark:text-[#E5E7EB] leading-relaxed">
                &ldquo;{review.quote}&rdquo;
              </p>
              <footer className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] text-xs text-[#52565E] dark:text-[#9CA3AF]">
                <p className="font-semibold text-[#141517] dark:text-[#F3F4F6]">
                  {review.name}
                </p>
                <p className="mt-0.5">
                  {review.neighborhood} · Ordered {review.dishOrdered}
                </p>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>
    </div>
  );
}
