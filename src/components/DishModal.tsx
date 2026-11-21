import { AnimatePresence, motion } from 'motion/react';
import { Heart, Minus, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Dish } from '../types/food';
import { ResilientImage } from './ResilientImage';

interface DishModalProps {
  dish: Dish | null;
  isFavorite: boolean;
  onToggleFavorite: (dishId: string) => void;
  onClose: () => void;
  onAddToCart: (params: {
    dish: Dish;
    quantity: number;
    selectedOption?: string;
    selectedAddons: string[];
    unitPrice: number;
    notes?: string;
  }) => void;
}

export function DishModal({
  dish,
  isFavorite,
  onToggleFavorite,
  onClose,
  onAddToCart,
}: DishModalProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (dish) {
      setSelectedOptionId(dish.options?.[0]?.id ?? '');
      setSelectedAddonIds([]);
      setQuantity(1);
      setNotes('');
    }
  }, [dish]);

  useEffect(() => {
    if (!dish) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [dish, onClose]);

  const chosenOption = dish?.options?.find((o) => o.id === selectedOptionId);
  const chosenAddons =
    dish?.addons?.filter((a) => selectedAddonIds.includes(a.id)) ?? [];

  const unitPrice = dish
    ? dish.price +
      (chosenOption?.priceDelta ?? 0) +
      chosenAddons.reduce((sum, a) => sum + a.price, 0)
    : 0;

  const toggleAddon = (addonId: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dish) return;
    onAddToCart({
      dish,
      quantity,
      selectedOption: chosenOption?.label,
      selectedAddons: chosenAddons.map((a) => a.label),
      unitPrice,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {dish && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-[2px]"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="dish-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white dark:bg-[#171A1E] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-black/[0.08] dark:border-white/[0.12]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] w-full bg-[#F1F2F3] dark:bg-[#1F2329] overflow-hidden">
              <ResilientImage
                src={dish.image}
                alt={dish.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleFavorite(dish.id)}
                  aria-label={isFavorite ? 'Remove from saved' : 'Save dish'}
                  aria-pressed={isFavorite}
                  className="w-10 h-10 rounded-full bg-white/95 dark:bg-[#171A1E]/95 text-[#141517] dark:text-[#F3F4F6] flex items-center justify-center shadow-sm hover:bg-white dark:hover:bg-[#171A1E] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#164E38]"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorite
                        ? 'fill-[#B91C1C] text-[#B91C1C] dark:fill-[#F87171] dark:text-[#F87171]'
                        : 'text-[#52565E] dark:text-[#9CA3AF]'
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close dish details"
                  className="w-10 h-10 rounded-full bg-white/95 dark:bg-[#171A1E]/95 text-[#141517] dark:text-[#F3F4F6] flex items-center justify-center shadow-sm hover:bg-white dark:hover:bg-[#171A1E] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#164E38]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#52565E] dark:text-[#9CA3AF] mb-2">
                  <span className="font-medium text-[#164E38] dark:text-[#5FD39E]">
                    {dish.kitchenName}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{dish.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{dish.prepMinutes} min prep</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{dish.calories} kcal</span>
                </div>

                <h2
                  id="dish-modal-title"
                  className="font-display text-2xl sm:text-3xl font-semibold text-[#141517] dark:text-[#F3F4F6] text-balance"
                >
                  {dish.name}
                </h2>

                <p className="mt-2.5 text-[15px] text-[#52565E] dark:text-[#9CA3AF] leading-relaxed">
                  {dish.description}
                </p>

                <p className="mt-3 text-xs text-[#52565E] dark:text-[#9CA3AF] leading-relaxed">
                  <span className="font-semibold text-[#141517] dark:text-[#F3F4F6]">
                    Key ingredients:
                  </span>{' '}
                  {dish.ingredients}
                </p>
              </div>

              {dish.options && dish.options.length > 0 && (
                <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
                  <h3 className="text-sm font-semibold text-[#141517] dark:text-[#F3F4F6] mb-3">
                    Preparation &amp; Size
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {dish.options.map((opt) => {
                      const active = opt.id === selectedOptionId;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSelectedOptionId(opt.id)}
                          className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg border text-left text-sm transition-colors cursor-pointer min-h-[44px] ${
                            active
                              ? 'border-[#164E38] dark:border-[#5FD39E] bg-[#164E38]/[0.06] dark:bg-[#1D6347]/25 text-[#141517] dark:text-white font-semibold'
                              : 'border-black/[0.08] dark:border-white/[0.10] bg-white dark:bg-[#1F2329] text-[#52565E] dark:text-[#9CA3AF] hover:border-black/20 dark:hover:border-white/25'
                          }`}
                        >
                          <span>{opt.label}</span>
                          <span className="tabular-nums font-mono text-xs shrink-0">
                            {opt.priceDelta === 0
                              ? 'Included'
                              : opt.priceDelta > 0
                                ? `+$${opt.priceDelta.toFixed(2)}`
                                : `-$${Math.abs(opt.priceDelta).toFixed(2)}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {dish.addons && dish.addons.length > 0 && (
                <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
                  <h3 className="text-sm font-semibold text-[#141517] dark:text-[#F3F4F6] mb-3">
                    Kitchen Additions
                  </h3>
                  <div className="space-y-2">
                    {dish.addons.map((addon) => {
                      const checked = selectedAddonIds.includes(addon.id);
                      return (
                        <label
                          key={addon.id}
                          className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg border text-sm cursor-pointer transition-colors min-h-[44px] ${
                            checked
                              ? 'border-[#164E38] dark:border-[#5FD39E] bg-[#164E38]/[0.06] dark:bg-[#1D6347]/25 text-[#141517] dark:text-white'
                              : 'border-black/[0.08] dark:border-white/[0.10] bg-white dark:bg-[#1F2329] text-[#52565E] dark:text-[#9CA3AF] hover:border-black/20 dark:hover:border-white/25'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleAddon(addon.id)}
                              className="w-4 h-4 accent-[#164E38] dark:accent-[#5FD39E] rounded cursor-pointer"
                            />
                            <span
                              className={
                                checked ? 'font-medium text-[#141517] dark:text-white' : ''
                              }
                            >
                              {addon.label}
                            </span>
                          </div>
                          <span className="tabular-nums font-mono text-xs text-[#141517] dark:text-[#F3F4F6]">
                            +${addon.price.toFixed(2)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
                <label
                  htmlFor="kitchen-note"
                  className="block text-sm font-semibold text-[#141517] dark:text-[#F3F4F6] mb-2"
                >
                  Special Kitchen Instructions
                </label>
                <input
                  id="kitchen-note"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Allergies, dressing on the side, or extra cutlery..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-black/[0.12] dark:border-white/[0.14] bg-[#FAFAFA] dark:bg-[#0F1113] text-[#141517] dark:text-[#F3F4F6] placeholder:text-[#737882] dark:placeholder:text-[#6B7280] focus:outline-none focus:border-[#164E38] dark:focus:border-[#5FD39E]"
                />
              </div>

              <div className="pt-4 border-t border-black/[0.08] dark:border-white/[0.10] flex flex-wrap items-center justify-between gap-4">
                <div className="inline-flex items-center border border-black/[0.12] dark:border-white/[0.14] rounded-lg bg-[#FAFAFA] dark:bg-[#1F2329]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="w-11 h-11 flex items-center justify-center text-[#141517] dark:text-[#F3F4F6] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold tabular-nums font-mono text-[#141517] dark:text-[#F3F4F6]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="w-11 h-11 flex items-center justify-center text-[#141517] dark:text-[#F3F4F6] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="submit"
                  className="flex-1 min-w-[200px] px-6 py-3 bg-[#164E38] hover:bg-[#113D2B] dark:bg-[#1D6347] dark:hover:bg-[#164E38] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer min-h-[44px] flex items-center justify-between gap-4"
                >
                  <span>Add to Bag</span>
                  <span className="tabular-nums font-mono">
                    ${(unitPrice * quantity).toFixed(2)}
                  </span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
