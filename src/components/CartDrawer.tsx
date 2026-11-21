import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useEffect } from 'react';
import { DELIVERY_ZONES } from '../data/catalog';
import { CartItem } from '../types/food';
import { ResilientImage } from './ResilientImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  selectedNeighborhood: string;
  onUpdateQty: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  onBrowseMenu: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  selectedNeighborhood,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  onBrowseMenu,
}: CartDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const zone =
    DELIVERY_ZONES.find((z) => z.neighborhood === selectedNeighborhood) ??
    DELIVERY_ZONES[1];
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const qualifiesFree = subtotal >= zone.freeThreshold || subtotal === 0;
  const deliveryFee = items.length === 0 ? 0 : qualifiesFree ? 0 : zone.fee;
  const total = subtotal + deliveryFee;
  const remainingForFree = Math.max(0, zone.freeThreshold - subtotal);
  const progressPct = Math.min(100, (subtotal / zone.freeThreshold) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          className="fixed inset-0 z-50 flex justify-end bg-black/55 backdrop-blur-[1px]"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Your delivery bag"
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md bg-white dark:bg-[#171A1E] h-full flex flex-col shadow-2xl border-l border-black/[0.08] dark:border-white/[0.10]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-black/[0.08] dark:border-white/[0.10] flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold text-[#141517] dark:text-[#F3F4F6]">
                  Your Delivery Bag
                </h2>
                <p className="text-xs text-[#52565E] dark:text-[#9CA3AF] mt-0.5 tabular-nums">
                  {items.reduce((sum, i) => sum + i.quantity, 0)} items ·{' '}
                  {zone.neighborhood} ({zone.etaWindow})
                </p>
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="text-xs font-medium text-[#737882] dark:text-[#9CA3AF] hover:text-[#B91C1C] dark:hover:text-[#F87171] px-2 py-1 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close bag"
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-[#52565E] dark:text-[#9CA3AF] hover:bg-black/[0.05] dark:hover:bg-white/[0.06] hover:text-[#141517] dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {items.length > 0 && (
              <div className="px-6 py-3.5 bg-[#FAFAFA] dark:bg-[#0F1113] border-b border-black/[0.06] dark:border-white/[0.08]">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[#141517] dark:text-[#F3F4F6] font-medium">
                    {qualifiesFree
                      ? 'Free bike delivery unlocked'
                      : `Add $${remainingForFree.toFixed(2)} more for free delivery`}
                  </span>
                  <span className="tabular-nums font-mono text-[#52565E] dark:text-[#9CA3AF]">
                    ${subtotal.toFixed(2)} / ${zone.freeThreshold}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-black/[0.08] dark:bg-white/[0.10] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#164E38] dark:bg-[#5FD39E] transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-14 h-14 rounded-full bg-[#F3F4F6] dark:bg-[#1F2329] flex items-center justify-center text-[#52565E] dark:text-[#9CA3AF] mb-4">
                    <ShoppingBag className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-base font-semibold text-[#141517] dark:text-[#F3F4F6] mb-1">
                    Your bag is empty
                  </h3>
                  <p className="text-sm text-[#52565E] dark:text-[#9CA3AF] max-w-[26ch] mb-6 leading-relaxed">
                    Mix wood-fired sourdough, fresh pasta, and hearth bowls from any kitchen.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onBrowseMenu();
                    }}
                    className="px-5 py-2.5 bg-[#164E38] hover:bg-[#113D2B] dark:bg-[#1D6347] dark:hover:bg-[#164E38] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer min-h-[42px]"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-black/[0.06] dark:divide-white/[0.08]">
                  {items.map((item) => (
                    <li key={item.cartItemId} className="py-4 first:pt-0 flex gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#F1F2F3] dark:bg-[#1F2329] shrink-0">
                        <ResilientImage
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs text-[#52565E] dark:text-[#9CA3AF]">
                              {item.kitchenName}
                            </p>
                            <h4 className="text-sm font-semibold text-[#141517] dark:text-[#F3F4F6] leading-snug">
                              {item.name}
                            </h4>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.cartItemId)}
                            aria-label={`Remove ${item.name}`}
                            className="text-[#737882] dark:text-[#9CA3AF] hover:text-[#B91C1C] dark:hover:text-[#F87171] p-1 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {(item.selectedOption ||
                          item.selectedAddons.length > 0 ||
                          item.notes) && (
                          <div className="mt-1 text-xs text-[#52565E] dark:text-[#9CA3AF] space-y-0.5">
                            {item.selectedOption && <p>{item.selectedOption}</p>}
                            {item.selectedAddons.length > 0 && (
                              <p>+ {item.selectedAddons.join(', ')}</p>
                            )}
                            {item.notes && (
                              <p className="italic text-[#737882] dark:text-[#9CA3AF]">
                                &ldquo;{item.notes}&rdquo;
                              </p>
                            )}
                          </div>
                        )}

                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center border border-black/[0.1] dark:border-white/[0.12] rounded-md bg-[#FAFAFA] dark:bg-[#1F2329]">
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.cartItemId, -1)}
                              aria-label="Decrease quantity"
                              className="w-8 h-8 flex items-center justify-center text-[#141517] dark:text-[#F3F4F6] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-7 text-center text-xs font-semibold tabular-nums font-mono text-[#141517] dark:text-[#F3F4F6]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.cartItemId, 1)}
                              aria-label="Increase quantity"
                              className="w-8 h-8 flex items-center justify-center text-[#141517] dark:text-[#F3F4F6] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <span className="text-sm font-semibold text-[#141517] dark:text-[#F3F4F6] tabular-nums font-mono">
                            ${(item.unitPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-black/[0.08] dark:border-white/[0.10] bg-[#FAFAFA] dark:bg-[#0F1113] space-y-4">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-[#52565E] dark:text-[#9CA3AF]">
                    <span>Subtotal</span>
                    <span className="tabular-nums font-mono">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#52565E] dark:text-[#9CA3AF]">
                    <span>Bike Courier ({zone.neighborhood})</span>
                    <span className="tabular-nums font-mono">
                      {deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-semibold text-[#141517] dark:text-[#F3F4F6] pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
                    <span>Estimated Total</span>
                    <span className="tabular-nums font-mono">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onProceedToCheckout();
                  }}
                  className="w-full py-3.5 px-5 bg-[#164E38] hover:bg-[#113D2B] dark:bg-[#1D6347] dark:hover:bg-[#164E38] text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer min-h-[46px]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
