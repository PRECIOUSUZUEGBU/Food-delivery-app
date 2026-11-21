import { ArrowRight, Heart, Plus, Search, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';
import { DishCard } from '../components/DishCard';
import { ThemeToggle } from '../components/ThemeToggle';
import { CHEF_PAIRINGS, KITCHENS } from '../data/catalog';
import {
  ChefPairing,
  DietaryTag,
  Dish,
  DishCategory,
  SortOption,
} from '../types/food';

interface MenuPageProps {
  dishes: Dish[];
  theme: 'light' | 'dark';
  selectedCategory: DishCategory;
  selectedKitchenFilter: string;
  favoriteIds: string[];
  bagCount: number;
  bagSubtotal: number;
  getDishBagQty: (dishId: string) => number;
  onToggleTheme: (next: 'light' | 'dark') => void;
  onChangeCategory: (category: DishCategory) => void;
  onChangeKitchenFilter: (kitchenId: string) => void;
  onToggleFavorite: (dishId: string) => void;
  onSelectDish: (dish: Dish) => void;
  onQuickAdd: (dish: Dish) => void;
  onAdjustDishQty: (dish: Dish, delta: number) => void;
  onAddPairing: (pairing: ChefPairing) => void;
  onOpenCart: () => void;
}

const CATEGORIES: DishCategory[] = [
  'All Dishes',
  'Wood-Fired',
  'Fresh Pasta',
  'Hearth Bowls',
  'Bakery & Sweet',
];

const DIETARY_FILTERS: ('All' | DietaryTag)[] = [
  'All',
  'Vegetarian',
  'Spicy',
  'Gluten-Free',
];

export function MenuPage({
  dishes,
  theme,
  selectedCategory,
  selectedKitchenFilter,
  favoriteIds,
  bagCount,
  bagSubtotal,
  getDishBagQty,
  onToggleTheme,
  onChangeCategory,
  onChangeKitchenFilter,
  onToggleFavorite,
  onSelectDish,
  onQuickAdd,
  onAdjustDishQty,
  onAddPairing,
  onOpenCart,
}: MenuPageProps) {
  const [dietary, setDietary] = useState<'All' | DietaryTag>('All');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDishes = dishes
    .filter((dish) => {
      const matchesCategory =
        selectedCategory === 'All Dishes' || dish.category === selectedCategory;
      const matchesKitchen =
        selectedKitchenFilter === 'all' || dish.kitchenId === selectedKitchenFilter;
      const matchesDietary =
        dietary === 'All' || dish.dietary.includes(dietary);
      const matchesFavorite = !onlyFavorites || favoriteIds.includes(dish.id);
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        dish.name.toLowerCase().includes(query) ||
        dish.description.toLowerCase().includes(query) ||
        dish.ingredients.toLowerCase().includes(query) ||
        dish.kitchenName.toLowerCase().includes(query);

      return (
        matchesCategory &&
        matchesKitchen &&
        matchesDietary &&
        matchesFavorite &&
        matchesSearch
      );
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'prep-asc') return a.prepMinutes - b.prepMinutes;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

  const resetFilters = () => {
    onChangeCategory('All Dishes');
    setDietary('All');
    setOnlyFavorites(false);
    setSortBy('featured');
    onChangeKitchenFilter('all');
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedCategory !== 'All Dishes' ||
    dietary !== 'All' ||
    onlyFavorites ||
    sortBy !== 'featured' ||
    selectedKitchenFilter !== 'all' ||
    searchQuery.trim() !== '';

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
      {/* Page Header */}
      <section className="pb-8 border-b border-black/[0.08] dark:border-white/[0.10]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <p className="text-xs font-medium text-[#164E38] dark:text-[#5FD39E]">
            Daily Kitchen Menu
          </p>
          <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#141517] dark:text-[#F3F4F6] text-balance">
              Order across all four kitchens
            </h1>
            <p className="mt-2 text-[15px] text-[#52565E] dark:text-[#9CA3AF] max-w-[56ch]">
              Click any dish to customize portions, add extras, or leave a note for the chef.
            </p>
          </div>

          <div className="relative w-full lg:w-80 shrink-0">
            <Search className="w-4 h-4 text-[#737882] dark:text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, ingredients, kitchens..."
              aria-label="Search menu"
              className="w-full pl-10 pr-9 py-2.5 text-sm bg-white dark:bg-[#171A1E] border border-black/[0.12] dark:border-white/[0.14] rounded-lg text-[#141517] dark:text-[#F3F4F6] placeholder:text-[#737882] dark:placeholder:text-[#6B7280] focus:outline-none focus:border-[#164E38] dark:focus:border-[#5FD39E] min-h-[44px]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#737882] dark:text-[#9CA3AF] hover:text-[#141517] dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-8 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div
            role="tablist"
            aria-label="Dish categories"
            className="flex flex-wrap items-center gap-1.5 p-1 bg-[#EFEFEF] dark:bg-[#1F2329] rounded-lg"
          >
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onChangeCategory(cat)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[38px] ${
                    active
                      ? 'bg-white dark:bg-[#171A1E] text-[#141517] dark:text-white shadow-xs'
                      : 'text-[#52565E] dark:text-[#9CA3AF] hover:text-[#141517] dark:hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              aria-label="Filter by kitchen"
              value={selectedKitchenFilter}
              onChange={(e) => onChangeKitchenFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-white dark:bg-[#171A1E] border border-black/[0.12] dark:border-white/[0.14] rounded-lg text-[#141517] dark:text-[#F3F4F6] focus:outline-none focus:border-[#164E38] dark:focus:border-[#5FD39E] min-h-[40px] cursor-pointer"
            >
              <option value="all">All 4 Kitchens</option>
              {KITCHENS.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1 p-1 bg-[#EFEFEF] dark:bg-[#1F2329] rounded-lg">
              {DIETARY_FILTERS.map((diet) => {
                const active = dietary === diet;
                return (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => setDietary(diet)}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[32px] ${
                      active
                        ? 'bg-white dark:bg-[#171A1E] text-[#141517] dark:text-white shadow-xs'
                        : 'text-[#52565E] dark:text-[#9CA3AF] hover:text-[#141517] dark:hover:text-white'
                    }`}
                  >
                    {diet}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setOnlyFavorites((prev) => !prev)}
              aria-pressed={onlyFavorites}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px] ${
                onlyFavorites
                  ? 'border-[#164E38] dark:border-[#5FD39E] bg-[#164E38] dark:bg-[#1D6347] text-white'
                  : 'border-black/[0.12] dark:border-white/[0.14] bg-white dark:bg-[#171A1E] text-[#141517] dark:text-[#F3F4F6] hover:bg-black/[0.03] dark:hover:bg-white/[0.05]'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  onlyFavorites
                    ? 'fill-white text-white'
                    : 'text-[#52565E] dark:text-[#9CA3AF]'
                }`}
              />
              <span>Saved ({favoriteIds.length})</span>
            </button>

            <select
              aria-label="Sort dishes"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 text-xs font-semibold bg-white dark:bg-[#171A1E] border border-black/[0.12] dark:border-white/[0.14] rounded-lg text-[#141517] dark:text-[#F3F4F6] focus:outline-none focus:border-[#164E38] dark:focus:border-[#5FD39E] min-h-[40px] cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="prep-asc">Fastest Prep</option>
            </select>
          </div>
        </div>
      </section>

      {/* Inline Bag Summary Strip when user has items */}
      {bagCount > 0 && (
        <div className="mt-6 bg-white dark:bg-[#171A1E] border border-[#164E38]/25 dark:border-[#5FD39E]/30 rounded-xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm">
            <ShoppingBag className="w-4 h-4 text-[#164E38] dark:text-[#5FD39E] shrink-0" />
            <span className="font-medium text-[#141517] dark:text-[#F3F4F6]">
              <span className="tabular-nums font-semibold">{bagCount}</span>{' '}
              {bagCount === 1 ? 'dish' : 'dishes'} in your bag
            </span>
            <span className="text-[#52565E] dark:text-[#9CA3AF] tabular-nums font-mono">
              · ${bagSubtotal.toFixed(2)} subtotal
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#164E38] dark:text-[#5FD39E] hover:text-[#113D2B] dark:hover:text-[#86EFAC] cursor-pointer"
          >
            <span>Open Bag &amp; Checkout</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Curated Chef Pairings Strip */}
      {!hasActiveFilters && (
        <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {CHEF_PAIRINGS.map((pairing) => {
            const pairedDishes = pairing.dishIds
              .map((id) => dishes.find((d) => d.id === id))
              .filter((d): d is Dish => Boolean(d));
            const bundleTotal = pairedDishes.reduce((s, d) => s + d.price, 0);

            return (
              <div
                key={pairing.id}
                className="bg-white dark:bg-[#171A1E] border border-black/[0.08] dark:border-white/[0.10] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <p className="text-xs font-medium text-[#164E38] dark:text-[#5FD39E]">
                    Chef Pairing · {pairedDishes.length} dishes
                  </p>
                  <h2 className="text-base font-semibold text-[#141517] dark:text-[#F3F4F6] mt-0.5">
                    {pairing.title}
                  </h2>
                  <p className="text-xs text-[#52565E] dark:text-[#9CA3AF] mt-1">
                    {pairing.subtitle}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onAddPairing(pairing)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F3F4F6] dark:bg-[#1F2329] hover:bg-[#164E38] dark:hover:bg-[#1D6347] hover:text-white text-[#141517] dark:text-[#F3F4F6] text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="tabular-nums font-mono">
                    Add Bundle · ${bundleTotal.toFixed(2)}
                  </span>
                </button>
              </div>
            );
          })}
        </section>
      )}

      {/* Results Metadata Row */}
      <div className="py-5 flex items-center justify-between gap-4 text-xs text-[#52565E] dark:text-[#9CA3AF]">
        <span className="tabular-nums">
          Showing {filteredDishes.length} of {dishes.length} dishes
        </span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="font-semibold text-[#164E38] dark:text-[#5FD39E] hover:underline cursor-pointer"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Dishes Grid */}
      {filteredDishes.length === 0 ? (
        <div className="bg-white dark:bg-[#171A1E] border border-black/[0.08] dark:border-white/[0.10] rounded-2xl p-12 text-center my-4">
          <h2 className="font-display text-xl font-semibold text-[#141517] dark:text-[#F3F4F6]">
            No dishes match these filters
          </h2>
          <p className="mt-2 text-sm text-[#52565E] dark:text-[#9CA3AF] max-w-md mx-auto">
            Try clearing your search term or switching back to all kitchens and dietary options.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-6 px-5 py-2.5 bg-[#164E38] hover:bg-[#113D2B] dark:bg-[#1D6347] dark:hover:bg-[#164E38] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer min-h-[42px]"
          >
            Show All Dishes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredDishes.map((dish) => (
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
      )}
    </div>
  );
}
