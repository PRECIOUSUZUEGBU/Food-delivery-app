import { Heart, Minus, Plus } from 'lucide-react';
import { Dish } from '../types/food';
import { ResilientImage } from './ResilientImage';

interface DishCardProps {
  dish: Dish;
  bagQuantity?: number;
  isFavorite?: boolean;
  onToggleFavorite?: (dishId: string) => void;
  onSelectDish: (dish: Dish) => void;
  onQuickAdd: (dish: Dish) => void;
  onAdjustDishQty?: (dish: Dish, delta: number) => void;
}

export function DishCard({
  dish,
  bagQuantity = 0,
  isFavorite = false,
  onToggleFavorite,
  onSelectDish,
  onQuickAdd,
  onAdjustDishQty,
}: DishCardProps) {
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAdd(dish);
  };

  const handleAdjust = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation();
    if (onAdjustDishQty) {
      onAdjustDishQty(dish, delta);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(dish.id);
    }
  };

  return (
    <article
      onClick={() => onSelectDish(dish)}
      className="group bg-white dark:bg-[#171A1E] border border-black/[0.08] dark:border-white/[0.10] rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-14px_rgba(20,21,23,0.14)] dark:hover:shadow-[0_12px_30px_-14px_rgba(0,0,0,0.55)] flex flex-col"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F1F2F3] dark:bg-[#1F2329]">
        <ResilientImage
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />

        {onToggleFavorite && (
          <button
            type="button"
            onClick={handleFavorite}
            aria-label={isFavorite ? `Remove ${dish.name} from saved` : `Save ${dish.name}`}
            aria-pressed={isFavorite}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 dark:bg-[#171A1E]/90 hover:bg-white dark:hover:bg-[#171A1E] text-[#141517] dark:text-[#F3F4F6] flex items-center justify-center shadow-xs transition-transform duration-150 active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#164E38] dark:focus-visible:outline-[#5FD39E]"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorite
                  ? 'fill-[#B91C1C] text-[#B91C1C] dark:fill-[#F87171] dark:text-[#F87171]'
                  : 'text-[#52565E] dark:text-[#9CA3AF]'
              }`}
              strokeWidth={1.8}
            />
          </button>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs text-[#52565E] dark:text-[#9CA3AF] mb-1.5">
            <span className="truncate font-medium">{dish.kitchenName}</span>
            <span className="shrink-0 tabular-nums">
              {dish.prepMinutes} min
              {dish.tag ? ` · ${dish.tag}` : ''}
            </span>
          </div>

          <h3 className="text-[16px] font-semibold text-[#141517] dark:text-[#F3F4F6] leading-snug mb-1.5 group-hover:text-[#164E38] dark:group-hover:text-[#5FD39E] transition-colors">
            {dish.name}
          </h3>

          <p className="text-sm text-[#52565E] dark:text-[#9CA3AF] line-clamp-2 leading-relaxed">
            {dish.description}
          </p>
        </div>

        <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-[15px] font-semibold text-[#141517] dark:text-[#F3F4F6] tabular-nums font-mono shrink-0">
              ${dish.price.toFixed(2)}
            </span>
            {dish.dietary.length > 0 && (
              <span className="text-xs text-[#52565E] dark:text-[#9CA3AF] truncate">
                · {dish.dietary.join(' · ')}
              </span>
            )}
          </div>

          {bagQuantity > 0 && onAdjustDishQty ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center rounded-lg bg-[#164E38] dark:bg-[#1D6347] text-white shrink-0"
            >
              <button
                type="button"
                onClick={(e) => handleAdjust(e, -1)}
                aria-label={`Remove one ${dish.name}`}
                className="w-9 h-10 flex items-center justify-center hover:bg-[#113D2B] dark:hover:bg-[#164E38] rounded-l-lg transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" strokeWidth={2.2} />
              </button>
              <span className="w-6 text-center text-xs font-semibold tabular-nums font-mono">
                {bagQuantity}
              </span>
              <button
                type="button"
                onClick={(e) => handleAdjust(e, 1)}
                aria-label={`Add one more ${dish.name}`}
                className="w-9 h-10 flex items-center justify-center hover:bg-[#113D2B] dark:hover:bg-[#164E38] rounded-r-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" strokeWidth={2.2} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleQuickAdd}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#F3F4F6] dark:bg-[#1F2329] text-[#141517] dark:text-[#F3F4F6] hover:bg-[#164E38] dark:hover:bg-[#1D6347] hover:text-white transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer min-h-[40px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#164E38] dark:focus-visible:outline-[#5FD39E]"
              aria-label={`Add ${dish.name} to bag`}
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2} />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
