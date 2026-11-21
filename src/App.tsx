import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { CartDrawer } from './components/CartDrawer';
import { DishModal } from './components/DishModal';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ToastBanner } from './components/ToastBanner';
import {
  DELIVERY_ZONES,
  DISHES,
  INITIAL_ACTIVE_ORDER,
  INITIAL_PAST_ORDERS,
} from './data/catalog';
import { HomePage } from './pages/HomePage';
import { KitchensPage } from './pages/KitchensPage';
import { MenuPage } from './pages/MenuPage';
import { OrdersPage } from './pages/OrdersPage';
import {
  CartItem,
  ChefPairing,
  Dish,
  DishCategory,
  Order,
  OrderStage,
  PageId,
} from './types/food';

const STAGE_SEQUENCE: OrderStage[] = [
  'confirmed',
  'preparing',
  'courier',
  'delivered',
];

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function getInitialTheme(): 'light' | 'dark' {
  try {
    const stored = window.localStorage.getItem('lt_theme');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed === 'dark' || parsed === 'light') return parsed;
    }
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }
  } catch {
    // Ignore storage errors
  }
  return 'light';
}

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const [activePage, setActivePage] = useState<PageId>('home');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>(() =>
    loadStorage('lt_neighborhood', 'Arts District'),
  );
  const [selectedCategory, setSelectedCategory] =
    useState<DishCategory>('All Dishes');
  const [selectedKitchenFilter, setSelectedKitchenFilter] = useState('all');

  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    loadStorage('lt_cart', []),
  );
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() =>
    loadStorage('lt_favorites', ['truffle-tagliatelle', 'margherita-sourdough']),
  );

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [modalDish, setModalDish] = useState<Dish | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const [checkoutRequested, setCheckoutRequested] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order>(() =>
    loadStorage('lt_active_order', INITIAL_ACTIVE_ORDER),
  );
  const [pastOrders, setPastOrders] = useState<Order[]>(() =>
    loadStorage('lt_past_orders', INITIAL_PAST_ORDERS),
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      window.localStorage.setItem('lt_theme', JSON.stringify(theme));
    } catch {
      // Ignore storage errors
    }
  }, [theme]);

  useEffect(() => {
    try {
      window.localStorage.setItem('lt_cart', JSON.stringify(cartItems));
    } catch {
      // Ignore storage quota errors
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      window.localStorage.setItem('lt_favorites', JSON.stringify(favoriteIds));
    } catch {
      // Ignore storage quota errors
    }
  }, [favoriteIds]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        'lt_neighborhood',
        JSON.stringify(selectedNeighborhood),
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [selectedNeighborhood]);

  useEffect(() => {
    try {
      window.localStorage.setItem('lt_active_order', JSON.stringify(activeOrder));
      window.localStorage.setItem('lt_past_orders', JSON.stringify(pastOrders));
    } catch {
      // Ignore storage quota errors
    }
  }, [activeOrder, pastOrders]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  const getDishBagQty = (dishId: string) =>
    cartItems
      .filter((item) => item.dishId === dishId)
      .reduce((sum, item) => sum + item.quantity, 0);

  const handleToggleFavorite = (dishId: string) => {
    setFavoriteIds((prev) =>
      prev.includes(dishId)
        ? prev.filter((id) => id !== dishId)
        : [...prev, dishId],
    );
  };

  const handleQuickAdd = (dish: Dish, silent = false) => {
    const defaultOption = dish.options?.[0]?.label;
    const cartItemId = `${dish.id}::${defaultOption ?? 'base'}::`;

    setCartItems((prev) => {
      const existing = prev.find((i) => i.cartItemId === cartItemId);
      if (existing) {
        return prev.map((i) =>
          i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          dishId: dish.id,
          name: dish.name,
          kitchenName: dish.kitchenName,
          image: dish.image,
          unitPrice: dish.price + (dish.options?.[0]?.priceDelta ?? 0),
          quantity: 1,
          selectedOption: defaultOption,
          selectedAddons: [],
        },
      ];
    });

    if (!silent) {
      showToast(`Added ${dish.name} to bag`);
    }
  };

  const handleAdjustDishQty = (dish: Dish, delta: number) => {
    setCartItems((prev) => {
      const target = prev.find((item) => item.dishId === dish.id);
      if (!target) {
        if (delta > 0) {
          const defaultOption = dish.options?.[0]?.label;
          return [
            ...prev,
            {
              cartItemId: `${dish.id}::${defaultOption ?? 'base'}::`,
              dishId: dish.id,
              name: dish.name,
              kitchenName: dish.kitchenName,
              image: dish.image,
              unitPrice: dish.price + (dish.options?.[0]?.priceDelta ?? 0),
              quantity: delta,
              selectedOption: defaultOption,
              selectedAddons: [],
            },
          ];
        }
        return prev;
      }

      return prev
        .map((item) =>
          item.cartItemId === target.cartItemId
            ? { ...item, quantity: item.quantity + delta }
            : item,
        )
        .filter((item) => item.quantity > 0);
    });
  };

  const handleAddPairing = (pairing: ChefPairing) => {
    pairing.dishIds.forEach((id) => {
      const dish = DISHES.find((d) => d.id === id);
      if (dish) handleQuickAdd(dish, true);
    });
    showToast(`Added ${pairing.title} to bag`);
  };

  const handleModalAdd = ({
    dish,
    quantity,
    selectedOption,
    selectedAddons,
    unitPrice,
    notes,
  }: {
    dish: Dish;
    quantity: number;
    selectedOption?: string;
    selectedAddons: string[];
    unitPrice: number;
    notes?: string;
  }) => {
    const cartItemId = `${dish.id}::${selectedOption ?? 'base'}::${selectedAddons.join(',')}::${notes ?? ''}`;
    setCartItems((prev) => {
      const existing = prev.find((i) => i.cartItemId === cartItemId);
      if (existing) {
        return prev.map((i) =>
          i.cartItemId === cartItemId
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          dishId: dish.id,
          name: dish.name,
          kitchenName: dish.kitchenName,
          image: dish.image,
          unitPrice,
          quantity,
          selectedOption,
          selectedAddons,
          notes,
        },
      ];
    });
    showToast(`Added ${quantity}x ${dish.name} to bag`);
  };

  const handleUpdateQty = (cartItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + delta }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleNavigate = (page: PageId) => {
    if (page !== 'orders') {
      setCheckoutRequested(false);
    }
    setActivePage(page);
  };

  const handleBrowseCategory = (category: DishCategory) => {
    setSelectedCategory(category);
    setSelectedKitchenFilter('all');
    setActivePage('menu');
  };

  const handleBrowseKitchenMenu = (kitchenId: string) => {
    setSelectedKitchenFilter(kitchenId);
    setSelectedCategory('All Dishes');
    setActivePage('menu');
  };

  const handleProceedToCheckout = () => {
    setCheckoutRequested(true);
    setActivePage('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = (details: {
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
  }) => {
    const zone =
      DELIVERY_ZONES.find((z) => z.neighborhood === details.neighborhood) ??
      DELIVERY_ZONES[0];
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );
    const deliveryFee = subtotal >= zone.freeThreshold ? 0 : zone.fee;
    const total = Math.max(
      0,
      subtotal - details.discount + deliveryFee + details.tip,
    );

    const now = new Date();
    const eta = new Date(now.getTime() + 28 * 60000);
    const formatTime = (d: Date) =>
      d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    const newOrder: Order = {
      id: `LT-${Math.floor(4100 + Math.random() * 880)}`,
      placedAt: `Today, ${formatTime(now)}`,
      estimatedArrival: formatTime(eta),
      deliveryWindow: details.deliveryWindow,
      dropoffPreference: details.dropoffPreference,
      stage: 'confirmed',
      customerName: details.customerName,
      phone: details.phone,
      address: details.address,
      neighborhood: details.neighborhood,
      paymentMethod: details.paymentMethod,
      courierName: 'Devon Mercer',
      courierVehicle: 'Cargo Bike #09',
      subtotal,
      discount: details.discount,
      promoCode: details.promoCode,
      tip: details.tip,
      deliveryFee,
      total,
      items: cartItems.map((item) => ({
        name: item.name,
        kitchenName: item.kitchenName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        selectedOption: item.selectedOption,
        selectedAddons: item.selectedAddons,
      })),
    };

    setPastOrders((prev) => [activeOrder, ...prev]);
    setActiveOrder(newOrder);
    setCartItems([]);
    setCheckoutRequested(false);
    showToast(`Order #${newOrder.id} dispatched to kitchens`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdvanceOrderStage = () => {
    setActiveOrder((prev) => {
      const idx = STAGE_SEQUENCE.indexOf(prev.stage);
      const nextStage =
        STAGE_SEQUENCE[Math.min(STAGE_SEQUENCE.length - 1, idx + 1)];
      return { ...prev, stage: nextStage };
    });
  };

  const handleReorderPast = (order: Order) => {
    order.items.forEach((orderItem) => {
      const matchedDish = DISHES.find((d) => d.name === orderItem.name);
      if (matchedDish) {
        handleQuickAdd(matchedDish, true);
      }
    });
    showToast(`Re-added items from Order #${order.id}`);
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] dark:bg-[#0F1113] text-[#141517] dark:text-[#F3F4F6] transition-colors duration-150">
      <Header
        activePage={activePage}
        onNavigate={handleNavigate}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            {activePage === 'home' && (
              <HomePage
                dishes={DISHES}
                theme={theme}
                selectedNeighborhood={selectedNeighborhood}
                favoriteIds={favoriteIds}
                getDishBagQty={getDishBagQty}
                onToggleTheme={setTheme}
                onToggleFavorite={handleToggleFavorite}
                onSelectNeighborhood={setSelectedNeighborhood}
                onNavigate={handleNavigate}
                onBrowseCategory={handleBrowseCategory}
                onSelectDish={setModalDish}
                onQuickAdd={handleQuickAdd}
                onAdjustDishQty={handleAdjustDishQty}
              />
            )}

            {activePage === 'menu' && (
              <MenuPage
                dishes={DISHES}
                theme={theme}
                selectedCategory={selectedCategory}
                selectedKitchenFilter={selectedKitchenFilter}
                favoriteIds={favoriteIds}
                bagCount={totalCartCount}
                bagSubtotal={totalCartSubtotal}
                getDishBagQty={getDishBagQty}
                onToggleTheme={setTheme}
                onChangeCategory={setSelectedCategory}
                onChangeKitchenFilter={setSelectedKitchenFilter}
                onToggleFavorite={handleToggleFavorite}
                onSelectDish={setModalDish}
                onQuickAdd={handleQuickAdd}
                onAdjustDishQty={handleAdjustDishQty}
                onAddPairing={handleAddPairing}
                onOpenCart={() => setIsCartOpen(true)}
              />
            )}

            {activePage === 'kitchens' && (
              <KitchensPage
                theme={theme}
                selectedNeighborhood={selectedNeighborhood}
                onToggleTheme={setTheme}
                onSelectNeighborhood={setSelectedNeighborhood}
                onBrowseKitchenMenu={handleBrowseKitchenMenu}
              />
            )}

            {activePage === 'orders' && (
              <OrdersPage
                theme={theme}
                cartItems={cartItems}
                selectedNeighborhood={selectedNeighborhood}
                activeOrder={activeOrder}
                pastOrders={pastOrders}
                checkoutRequested={checkoutRequested}
                onToggleTheme={setTheme}
                onStartCheckout={() => setCheckoutRequested(true)}
                onCancelCheckout={() => setCheckoutRequested(false)}
                onPlaceOrder={handlePlaceOrder}
                onAdvanceOrderStage={handleAdvanceOrderStage}
                onReorderPast={handleReorderPast}
                onNavigate={handleNavigate}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer
        theme={theme}
        onToggleTheme={setTheme}
        onNavigate={handleNavigate}
      />

      <DishModal
        dish={modalDish}
        isFavorite={modalDish ? favoriteIds.includes(modalDish.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onClose={() => setModalDish(null)}
        onAddToCart={handleModalAdd}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        selectedNeighborhood={selectedNeighborhood}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCartItems([])}
        onProceedToCheckout={handleProceedToCheckout}
        onBrowseMenu={() => handleNavigate('menu')}
      />

      <ToastBanner
        message={toastMessage}
        actionLabel={totalCartCount > 0 ? 'View Bag' : undefined}
        onAction={() => {
          setToastMessage(null);
          setIsCartOpen(true);
        }}
        onDismiss={() => setToastMessage(null)}
      />
    </div>
  );
}
