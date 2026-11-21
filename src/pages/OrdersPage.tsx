import {
  Bike,
  Check,
  ChefHat,
  Clock,
  MapPin,
  PackageCheck,
  Pause,
  Play,
  RotateCcw,
  ShoppingBag,
  Tag,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '../components/ThemeToggle';
import { DELIVERY_ZONES, PROMO_CODES } from '../data/catalog';
import { CartItem, Order, OrderStage, PageId } from '../types/food';

interface OrdersPageProps {
  theme: 'light' | 'dark';
  cartItems: CartItem[];
  selectedNeighborhood: string;
  activeOrder: Order;
  pastOrders: Order[];
  checkoutRequested: boolean;
  onToggleTheme: (next: 'light' | 'dark') => void;
  onStartCheckout: () => void;
  onCancelCheckout: () => void;
  onPlaceOrder: (details: {
    customerName: string;
    phone: string;
    address: string;
    neighborhood: string;
    deliveryWindow: string;
    dropoffPreference: 'Leave at Door' | 'Hand to Me';
    tip: number;
    discount: number;
    promoCode?: string;
    paymentMethod: 'Card Online' | 'Card on Delivery' | 'Cash on Delivery';
  }) => void;
  onAdvanceOrderStage: () => void;
  onReorderPast: (order: Order) => void;
  onNavigate: (page: PageId) => void;
}

const STAGES: {
  id: OrderStage;
  label: string;
  detail: string;
  progressPct: number;
}[] = [
  {
    id: 'confirmed',
    label: 'Order Confirmed',
    detail: 'Ticket received by partner kitchen counters',
    progressPct: 12,
  },
  {
    id: 'preparing',
    label: 'Kitchen Preparing',
    detail: 'Chefs firing dough, rolling pasta, and plating',
    progressPct: 40,
  },
  {
    id: 'courier',
    label: 'With Courier',
    detail: 'Insulated cargo bike rider en route to your door',
    progressPct: 76,
  },
  {
    id: 'delivered',
    label: 'Delivered',
    detail: 'Left safely at your door or handed over',
    progressPct: 100,
  },
];

const DELIVERY_WINDOWS = [
  'Deliver ASAP (22–32 min)',
  '19:30 – 20:00',
  '20:00 – 20:30',
  '20:30 – 21:00',
];

export function OrdersPage({
  theme,
  cartItems,
  selectedNeighborhood,
  activeOrder,
  pastOrders,
  checkoutRequested,
  onToggleTheme,
  onStartCheckout,
  onCancelCheckout,
  onPlaceOrder,
  onAdvanceOrderStage,
  onReorderPast,
  onNavigate,
}: OrdersPageProps) {
  const [customerName, setCustomerName] = useState('Hannah Brooks');
  const [phone, setPhone] = useState('(212) 555-0148');
  const [address, setAddress] = useState('418 Mercer St, Apt 4B');
  const [neighborhood, setNeighborhood] = useState(selectedNeighborhood);
  const [deliveryWindow, setDeliveryWindow] = useState(DELIVERY_WINDOWS[0]);
  const [dropoffPreference, setDropoffPreference] = useState<
    'Leave at Door' | 'Hand to Me'
  >('Leave at Door');
  const [tipRate, setTipRate] = useState<number>(0.15);
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoStatus, setPromoStatus] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<
    'Card Online' | 'Card on Delivery' | 'Cash on Delivery'
  >('Card Online');
  const [formError, setFormError] = useState<string | null>(null);
  const [autoAdvance, setAutoAdvance] = useState(false);

  const showCheckoutForm = checkoutRequested && cartItems.length > 0;

  useEffect(() => {
    if (!autoAdvance || activeOrder.stage === 'delivered' || showCheckoutForm) {
      return;
    }
    const timer = window.setInterval(() => {
      onAdvanceOrderStage();
    }, 3200);
    return () => window.clearInterval(timer);
  }, [autoAdvance, activeOrder.stage, showCheckoutForm, onAdvanceOrderStage]);

  useEffect(() => {
    if (activeOrder.stage === 'delivered') {
      setAutoAdvance(false);
    }
  }, [activeOrder.stage]);

  const zone =
    DELIVERY_ZONES.find((z) => z.neighborhood === neighborhood) ?? DELIVERY_ZONES[0];
  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  const promoObj = appliedPromo ? PROMO_CODES[appliedPromo] : undefined;
  const discount = promoObj
    ? promoObj.type === 'percent'
      ? Number((cartSubtotal * promoObj.value).toFixed(2))
      : Math.min(cartSubtotal, promoObj.value)
    : 0;

  const cartDeliveryFee =
    cartSubtotal >= zone.freeThreshold || cartSubtotal === 0 ? 0 : zone.fee;
  const tipAmount = Number((cartSubtotal * tipRate).toFixed(2));
  const cartTotal = Math.max(0, cartSubtotal - discount + cartDeliveryFee + tipAmount);

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) {
      setPromoStatus('Enter FRESH10 or FIRSTBITE to apply a neighborhood credit.');
      return;
    }
    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      setPromoStatus(`Applied: ${PROMO_CODES[code].label}`);
    } else {
      setAppliedPromo(null);
      setPromoStatus('Code not recognized. Try FRESH10 or FIRSTBITE.');
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      setFormError('Please enter your name, phone number, and street address.');
      return;
    }
    setFormError(null);
    onPlaceOrder({
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      neighborhood,
      deliveryWindow,
      dropoffPreference,
      tip: tipAmount,
      discount,
      promoCode: appliedPromo ?? undefined,
      paymentMethod,
    });
  };

  const activeStageIndex = STAGES.findIndex((s) => s.id === activeOrder.stage);
  const currentStageObj = STAGES[activeStageIndex] ?? STAGES[0];
  const riderX = 12 + (currentStageObj.progressPct / 100) * 76;

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-8 sm:pt-12 space-y-12">
      {/* Header */}
      <section className="pb-8 border-b border-black/[0.08] dark:border-white/[0.10] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <p className="text-xs font-medium text-[#164E38] dark:text-[#5FD39E]">
              {showCheckoutForm ? 'Checkout & Dispatch' : 'Live Delivery Tracking'}
            </p>
            <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#141517] dark:text-[#F3F4F6] text-balance">
            {showCheckoutForm
              ? 'Confirm your delivery details'
              : `Order #${activeOrder.id}`}
          </h1>
          <p className="mt-2 text-sm text-[#52565E] dark:text-[#9CA3AF]">
            {showCheckoutForm
              ? 'Schedule your courier drop, add a rider tip, or apply a promo code.'
              : `Placed ${activeOrder.placedAt} · ${activeOrder.neighborhood} · ${activeOrder.dropoffPreference}`}
          </p>
        </div>

        {!showCheckoutForm && cartItems.length > 0 && (
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('menu')}
              className="px-4 py-2.5 border border-black/[0.12] dark:border-white/[0.14] hover:bg-black/[0.03] dark:hover:bg-white/[0.05] text-[#141517] dark:text-[#F3F4F6] text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
            >
              Add More Dishes
            </button>
            <button
              type="button"
              onClick={onStartCheckout}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#164E38] hover:bg-[#113D2B] dark:bg-[#1D6347] dark:hover:bg-[#164E38] text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Checkout Bag ({cartItems.reduce((s, i) => s + i.quantity, 0)})</span>
            </button>
          </div>
        )}
      </section>

      {showCheckoutForm ? (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <form
            onSubmit={handleCheckoutSubmit}
            className="lg:col-span-7 bg-white dark:bg-[#171A1E] border border-black/[0.08] dark:border-white/[0.10] rounded-2xl p-6 sm:p-8 space-y-6"
          >
            <h2 className="font-display text-xl font-semibold text-[#141517] dark:text-[#F3F4F6]">
              Recipient &amp; Dispatch Details
            </h2>

            {formError && (
              <div className="p-3.5 rounded-lg bg-[#FEF2F2] dark:bg-[#3F1515] border border-[#FECACA] dark:border-[#7F1D1D] text-xs font-medium text-[#B91C1C] dark:text-[#FCA5A5]">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="checkout-name"
                  className="block text-xs font-semibold text-[#141517] dark:text-[#F3F4F6] mb-1.5"
                >
                  Full Name
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAFA] dark:bg-[#0F1113] border border-black/[0.12] dark:border-white/[0.14] rounded-lg text-[#141517] dark:text-[#F3F4F6] focus:outline-none focus:border-[#164E38] dark:focus:border-[#5FD39E] min-h-[44px]"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-phone"
                  className="block text-xs font-semibold text-[#141517] dark:text-[#F3F4F6] mb-1.5"
                >
                  Mobile Phone
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAFA] dark:bg-[#0F1113] border border-black/[0.12] dark:border-white/[0.14] rounded-lg text-[#141517] dark:text-[#F3F4F6] focus:outline-none focus:border-[#164E38] dark:focus:border-[#5FD39E] min-h-[44px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="checkout-address"
                  className="block text-xs font-semibold text-[#141517] dark:text-[#F3F4F6] mb-1.5"
                >
                  Street Address &amp; Apt
                </label>
                <input
                  id="checkout-address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAFA] dark:bg-[#0F1113] border border-black/[0.12] dark:border-white/[0.14] rounded-lg text-[#141517] dark:text-[#F3F4F6] focus:outline-none focus:border-[#164E38] dark:focus:border-[#5FD39E] min-h-[44px]"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-zone"
                  className="block text-xs font-semibold text-[#141517] dark:text-[#F3F4F6] mb-1.5"
                >
                  Neighborhood Zone
                </label>
                <select
                  id="checkout-zone"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAFA] dark:bg-[#0F1113] border border-black/[0.12] dark:border-white/[0.14] rounded-lg text-[#141517] dark:text-[#F3F4F6] focus:outline-none focus:border-[#164E38] dark:focus:border-[#5FD39E] min-h-[44px] cursor-pointer"
                >
                  {DELIVERY_ZONES.map((z) => (
                    <option key={z.id} value={z.neighborhood}>
                      {z.neighborhood} ({z.etaWindow})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
              <div>
                <label
                  htmlFor="delivery-window"
                  className="block text-xs font-semibold text-[#141517] dark:text-[#F3F4F6] mb-1.5"
                >
                  Delivery Window
                </label>
                <select
                  id="delivery-window"
                  value={deliveryWindow}
                  onChange={(e) => setDeliveryWindow(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAFAFA] dark:bg-[#0F1113] border border-black/[0.12] dark:border-white/[0.14] rounded-lg text-[#141517] dark:text-[#F3F4F6] focus:outline-none focus:border-[#164E38] dark:focus:border-[#5FD39E] min-h-[44px] cursor-pointer"
                >
                  {DELIVERY_WINDOWS.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="block text-xs font-semibold text-[#141517] dark:text-[#F3F4F6] mb-1.5">
                  Drop-off Preference
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {(['Leave at Door', 'Hand to Me'] as const).map((pref) => (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => setDropoffPreference(pref)}
                      className={`px-3 py-2.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer min-h-[44px] ${
                        dropoffPreference === pref
                          ? 'border-[#164E38] dark:border-[#5FD39E] bg-[#164E38]/[0.06] dark:bg-[#1D6347]/25 text-[#141517] dark:text-white'
                          : 'border-black/[0.08] dark:border-white/[0.10] bg-[#FAFAFA] dark:bg-[#0F1113] text-[#52565E] dark:text-[#9CA3AF]'
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Courier Tip */}
            <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-sm font-semibold text-[#141517] dark:text-[#F3F4F6]">
                  Bike Courier Tip
                </h3>
                <span className="text-xs font-mono tabular-nums text-[#52565E] dark:text-[#9CA3AF]">
                  ${tipAmount.toFixed(2)}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: '10%', rate: 0.1 },
                  { label: '15%', rate: 0.15 },
                  { label: '20%', rate: 0.2 },
                  { label: 'No tip', rate: 0 },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setTipRate(opt.rate)}
                    className={`py-2.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer min-h-[42px] ${
                      tipRate === opt.rate
                        ? 'border-[#164E38] dark:border-[#5FD39E] bg-[#164E38]/[0.06] dark:bg-[#1D6347]/25 text-[#141517] dark:text-white'
                        : 'border-black/[0.08] dark:border-white/[0.10] bg-[#FAFAFA] dark:bg-[#0F1113] text-[#52565E] dark:text-[#9CA3AF] hover:border-black/20 dark:hover:border-white/25'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
              <h3 className="text-sm font-semibold text-[#141517] dark:text-[#F3F4F6] mb-3">
                Payment Method
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {(['Card Online', 'Card on Delivery', 'Cash on Delivery'] as const).map(
                  (method) => {
                    const active = paymentMethod === method;
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`px-3.5 py-3 rounded-lg border text-xs font-semibold transition-colors cursor-pointer min-h-[44px] ${
                          active
                            ? 'border-[#164E38] dark:border-[#5FD39E] bg-[#164E38]/[0.06] dark:bg-[#1D6347]/25 text-[#141517] dark:text-white'
                            : 'border-black/[0.08] dark:border-white/[0.10] bg-[#FAFAFA] dark:bg-[#0F1113] text-[#52565E] dark:text-[#9CA3AF] hover:border-black/20 dark:hover:border-white/25'
                        }`}
                      >
                        {method}
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-black/[0.08] dark:border-white/[0.10] flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={onCancelCheckout}
                className="px-4 py-2.5 text-sm font-medium text-[#52565E] dark:text-[#9CA3AF] hover:text-[#141517] dark:hover:text-white cursor-pointer"
              >
                Return to Order Tracker
              </button>

              <button
                type="submit"
                className="px-7 py-3 bg-[#164E38] hover:bg-[#113D2B] dark:bg-[#1D6347] dark:hover:bg-[#164E38] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer min-h-[46px]"
              >
                Place Order · ${cartTotal.toFixed(2)}
              </button>
            </div>
          </form>

          {/* Bag & Promo Summary */}
          <aside className="lg:col-span-5 bg-white dark:bg-[#171A1E] border border-black/[0.08] dark:border-white/[0.10] rounded-2xl p-6 sm:p-8 space-y-5">
            <h2 className="font-display text-xl font-semibold text-[#141517] dark:text-[#F3F4F6]">
              Bag Summary
            </h2>
            <ul className="divide-y divide-black/[0.06] dark:divide-white/[0.08]">
              {cartItems.map((item) => (
                <li key={item.cartItemId} className="py-3 flex justify-between gap-3 text-sm">
                  <div>
                    <p className="font-medium text-[#141517] dark:text-[#F3F4F6]">
                      <span className="font-mono text-xs text-[#52565E] dark:text-[#9CA3AF] mr-1.5">
                        {item.quantity}x
                      </span>
                      {item.name}
                    </p>
                    <p className="text-xs text-[#52565E] dark:text-[#9CA3AF]">
                      {item.kitchenName}
                    </p>
                  </div>
                  <span className="tabular-nums font-mono text-[#141517] dark:text-[#F3F4F6] shrink-0">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Promo Code */}
            <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] space-y-2">
              <label
                htmlFor="promo-input"
                className="block text-xs font-semibold text-[#141517] dark:text-[#F3F4F6]"
              >
                Promo Code (try <span className="font-mono">FRESH10</span> or{' '}
                <span className="font-mono">FIRSTBITE</span>)
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-[#737882] dark:text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="promo-input"
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Enter code"
                    className="w-full pl-8 pr-3 py-2 text-xs uppercase font-mono bg-[#FAFAFA] dark:bg-[#0F1113] border border-black/[0.12] dark:border-white/[0.14] rounded-lg text-[#141517] dark:text-[#F3F4F6] focus:outline-none focus:border-[#164E38] dark:focus:border-[#5FD39E] min-h-[40px]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-4 py-2 bg-[#141517] hover:bg-[#2A2D32] dark:bg-[#F3F4F6] dark:hover:bg-white text-white dark:text-[#141517] text-xs font-semibold rounded-lg transition-colors cursor-pointer min-h-[40px]"
                >
                  Apply
                </button>
              </div>
              {promoStatus && (
                <p
                  className={`text-xs ${
                    appliedPromo
                      ? 'text-[#164E38] dark:text-[#5FD39E] font-medium'
                      : 'text-[#52565E] dark:text-[#9CA3AF]'
                  }`}
                >
                  {promoStatus}
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-black/[0.08] dark:border-white/[0.10] space-y-2 text-sm">
              <div className="flex justify-between text-[#52565E] dark:text-[#9CA3AF]">
                <span>Subtotal</span>
                <span className="tabular-nums font-mono">${cartSubtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#164E38] dark:text-[#5FD39E]">
                  <span>Promo ({appliedPromo})</span>
                  <span className="tabular-nums font-mono">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#52565E] dark:text-[#9CA3AF]">
                <span>Bike Courier ({zone.etaWindow})</span>
                <span className="tabular-nums font-mono">
                  {cartDeliveryFee === 0 ? 'Free' : `$${cartDeliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-[#52565E] dark:text-[#9CA3AF]">
                <span>Courier Tip ({Math.round(tipRate * 100)}%)</span>
                <span className="tabular-nums font-mono">${tipAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#141517] dark:text-[#F3F4F6] pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
                <span>Total Due</span>
                <span className="tabular-nums font-mono">${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </aside>
        </section>
      ) : (
        /* Active Order Live Tracking + Route Map + Receipt */
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white dark:bg-[#171A1E] border border-black/[0.08] dark:border-white/[0.10] rounded-2xl p-6 sm:p-8 space-y-7">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div>
                <p className="text-xs text-[#52565E] dark:text-[#9CA3AF]">
                  Current Kitchen &amp; Rider Status
                </p>
                <h2 className="font-display text-2xl font-semibold text-[#141517] dark:text-[#F3F4F6] mt-1">
                  {currentStageObj.label}
                </h2>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-xs text-[#52565E] dark:text-[#9CA3AF]">
                  Estimated Arrival
                </p>
                <p className="text-lg font-semibold font-mono tabular-nums text-[#164E38] dark:text-[#5FD39E]">
                  {activeOrder.stage === 'delivered'
                    ? 'Arrived'
                    : activeOrder.estimatedArrival}
                </p>
              </div>
            </div>

            {/* Live Dispatch Route Diagram */}
            <div className="bg-[#FAFAFA] dark:bg-[#0F1113] border border-black/[0.06] dark:border-white/[0.08] rounded-xl p-4 sm:p-5">
              <div className="flex items-center justify-between text-xs text-[#52565E] dark:text-[#9CA3AF] mb-3">
                <span className="font-medium text-[#141517] dark:text-[#F3F4F6]">
                  Kitchen Hub → {activeOrder.address}
                </span>
                <span className="font-mono tabular-nums">
                  {currentStageObj.progressPct}% complete
                </span>
              </div>

              <div className="relative h-20 w-full bg-white dark:bg-[#171A1E] border border-black/[0.06] dark:border-white/[0.08] rounded-lg overflow-hidden">
                <svg
                  viewBox="0 0 100 32"
                  preserveAspectRatio="none"
                  className="w-full h-full text-black/[0.06] dark:text-white/[0.08]"
                  aria-hidden="true"
                >
                  {[20, 40, 60, 80].map((x) => (
                    <line
                      key={x}
                      x1={x}
                      y1="0"
                      x2={x}
                      y2="32"
                      stroke="currentColor"
                      strokeWidth="0.6"
                    />
                  ))}
                  <line
                    x1="12"
                    y1="16"
                    x2="88"
                    y2="16"
                    stroke={theme === 'dark' ? '#2A2F37' : '#E5E7EB'}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <line
                    x1="12"
                    y1="16"
                    x2={riderX}
                    y2="16"
                    stroke={theme === 'dark' ? '#5FD39E' : '#164E38'}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="12"
                    cy="16"
                    r="2.2"
                    fill={theme === 'dark' ? '#F3F4F6' : '#141517'}
                  />
                  <circle
                    cx="88"
                    cy="16"
                    r="2.2"
                    fill={theme === 'dark' ? '#5FD39E' : '#164E38'}
                  />
                </svg>

                {/* Animated Rider Pin */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500"
                  style={{ left: `${riderX}%` }}
                >
                  <div className="w-8 h-8 rounded-full bg-[#164E38] dark:bg-[#1D6347] text-white flex items-center justify-center shadow-md border-2 border-white dark:border-[#171A1E]">
                    <Bike className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between text-[11px] text-[#52565E] dark:text-[#9CA3AF] mt-2">
                <span className="inline-flex items-center gap-1">
                  <ChefHat className="w-3 h-3" /> Kitchen Pass
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#164E38] dark:text-[#5FD39E]" />{' '}
                  {activeOrder.neighborhood}
                </span>
              </div>
            </div>

            {/* 4-Stage Stepper */}
            <ol className="space-y-5">
              {STAGES.map((stage, idx) => {
                const isDone = idx < activeStageIndex || activeOrder.stage === 'delivered';
                const isCurrent =
                  idx === activeStageIndex && activeOrder.stage !== 'delivered';
                return (
                  <li key={stage.id} className="flex items-start gap-4">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                        isDone
                          ? 'bg-[#164E38] dark:bg-[#1D6347] border-[#164E38] dark:border-[#1D6347] text-white'
                          : isCurrent
                            ? 'bg-[#164E38]/10 dark:bg-[#1D6347]/25 border-[#164E38] dark:border-[#5FD39E] text-[#164E38] dark:text-[#5FD39E]'
                            : 'bg-[#FAFAFA] dark:bg-[#0F1113] border-black/[0.12] dark:border-white/[0.14] text-[#737882] dark:text-[#6B7280]'
                      }`}
                    >
                      {isDone ? (
                        <Check className="w-4 h-4" strokeWidth={2.5} />
                      ) : idx === 1 ? (
                        <ChefHat className="w-4 h-4" />
                      ) : idx === 2 ? (
                        <Bike className="w-4 h-4" />
                      ) : idx === 3 ? (
                        <PackageCheck className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </div>

                    <div className="pt-0.5">
                      <p
                        className={`text-sm font-semibold ${
                          isDone || isCurrent
                            ? 'text-[#141517] dark:text-[#F3F4F6]'
                            : 'text-[#737882] dark:text-[#6B7280]'
                        }`}
                      >
                        {stage.label}
                        {isCurrent && (
                          <span className="ml-2 text-xs font-medium text-[#164E38] dark:text-[#5FD39E]">
                            · In progress
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-[#52565E] dark:text-[#9CA3AF] mt-0.5">
                        {stage.detail}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="pt-6 border-t border-black/[0.06] dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-[#52565E] dark:text-[#9CA3AF]">
                <span className="font-semibold text-[#141517] dark:text-[#F3F4F6]">
                  Assigned Courier:
                </span>{' '}
                {activeOrder.courierName} · {activeOrder.courierVehicle}
              </div>

              {activeOrder.stage !== 'delivered' && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAutoAdvance((prev) => !prev)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer min-h-[40px] ${
                      autoAdvance
                        ? 'border-[#164E38] dark:border-[#5FD39E] bg-[#164E38]/10 dark:bg-[#1D6347]/25 text-[#164E38] dark:text-[#5FD39E]'
                        : 'border-black/[0.12] dark:border-white/[0.14] bg-white dark:bg-[#1F2329] text-[#141517] dark:text-[#F3F4F6] hover:bg-black/[0.03] dark:hover:bg-white/[0.06]'
                    }`}
                  >
                    {autoAdvance ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Pause Live</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Auto-Track</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onAdvanceOrderStage}
                    className="px-4 py-2 bg-[#F3F4F6] dark:bg-[#1F2329] hover:bg-[#E5E7EB] dark:hover:bg-[#2A2F37] text-[#141517] dark:text-[#F3F4F6] text-xs font-semibold rounded-lg transition-colors cursor-pointer min-h-[40px]"
                  >
                    Advance Stage
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Receipt Card */}
          <aside className="lg:col-span-5 bg-white dark:bg-[#171A1E] border border-black/[0.08] dark:border-white/[0.10] rounded-2xl p-6 sm:p-8 space-y-5">
            <div>
              <h2 className="font-display text-xl font-semibold text-[#141517] dark:text-[#F3F4F6]">
                Order Receipt
              </h2>
              <p className="text-xs text-[#52565E] dark:text-[#9CA3AF] mt-1">
                {activeOrder.customerName} · {activeOrder.address}
              </p>
              <p className="text-xs text-[#52565E] dark:text-[#9CA3AF] mt-0.5">
                Window: {activeOrder.deliveryWindow}
              </p>
            </div>

            <ul className="divide-y divide-black/[0.06] dark:divide-white/[0.08]">
              {activeOrder.items.map((item, idx) => (
                <li key={idx} className="py-3 flex justify-between gap-3 text-sm">
                  <div>
                    <p className="font-medium text-[#141517] dark:text-[#F3F4F6]">
                      <span className="font-mono text-xs text-[#52565E] dark:text-[#9CA3AF] mr-1.5">
                        {item.quantity}x
                      </span>
                      {item.name}
                    </p>
                    <p className="text-xs text-[#52565E] dark:text-[#9CA3AF]">
                      {item.kitchenName}
                      {item.selectedOption ? ` · ${item.selectedOption}` : ''}
                    </p>
                  </div>
                  <span className="tabular-nums font-mono text-[#141517] dark:text-[#F3F4F6] shrink-0">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-black/[0.08] dark:border-white/[0.10] space-y-2 text-sm">
              <div className="flex justify-between text-[#52565E] dark:text-[#9CA3AF]">
                <span>Subtotal</span>
                <span className="tabular-nums font-mono">
                  ${activeOrder.subtotal.toFixed(2)}
                </span>
              </div>
              {activeOrder.discount > 0 && (
                <div className="flex justify-between text-[#164E38] dark:text-[#5FD39E]">
                  <span>Promo ({activeOrder.promoCode})</span>
                  <span className="tabular-nums font-mono">
                    -${activeOrder.discount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-[#52565E] dark:text-[#9CA3AF]">
                <span>Delivery</span>
                <span className="tabular-nums font-mono">
                  {activeOrder.deliveryFee === 0
                    ? 'Free'
                    : `$${activeOrder.deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-[#52565E] dark:text-[#9CA3AF]">
                <span>Courier Tip</span>
                <span className="tabular-nums font-mono">
                  ${activeOrder.tip.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#141517] dark:text-[#F3F4F6] pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
                <span>Total Paid ({activeOrder.paymentMethod})</span>
                <span className="tabular-nums font-mono">
                  ${activeOrder.total.toFixed(2)}
                </span>
              </div>
            </div>
          </aside>
        </section>
      )}

      {/* Past Orders History */}
      <section className="pt-4">
        <h2 className="font-display text-2xl font-semibold text-[#141517] dark:text-[#F3F4F6] mb-5">
          Recent Orders
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pastOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-[#171A1E] border border-black/[0.08] dark:border-white/[0.10] rounded-xl p-6 flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-[#52565E] dark:text-[#9CA3AF] mb-2">
                  <span className="font-mono font-semibold text-[#141517] dark:text-[#F3F4F6]">
                    Order #{order.id}
                  </span>
                  <span>{order.placedAt} · Delivered</span>
                </div>

                <ul className="text-sm text-[#141517] dark:text-[#F3F4F6] space-y-1">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between gap-2">
                      <span className="truncate">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="tabular-nums font-mono text-xs text-[#52565E] dark:text-[#9CA3AF] shrink-0">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-[#141517] dark:text-[#F3F4F6] tabular-nums font-mono">
                  Total ${order.total.toFixed(2)}
                </span>

                <button
                  type="button"
                  onClick={() => onReorderPast(order)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#F3F4F6] dark:bg-[#1F2329] hover:bg-[#164E38] dark:hover:bg-[#1D6347] hover:text-white text-[#141517] dark:text-[#F3F4F6] text-xs font-semibold rounded-lg transition-colors cursor-pointer min-h-[38px]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Add Items to Bag</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
