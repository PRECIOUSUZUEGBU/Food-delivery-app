export type PageId = 'home' | 'menu' | 'kitchens' | 'orders';

export type DishCategory =
  | 'All Dishes'
  | 'Wood-Fired'
  | 'Fresh Pasta'
  | 'Hearth Bowls'
  | 'Bakery & Sweet';

export type DietaryTag = 'Vegetarian' | 'Spicy' | 'Gluten-Free';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'prep-asc';

export interface DishAddon {
  id: string;
  label: string;
  price: number;
}

export interface DishOption {
  id: string;
  label: string;
  priceDelta: number;
}

export interface Dish {
  id: string;
  name: string;
  kitchenId: string;
  kitchenName: string;
  category: Exclude<DishCategory, 'All Dishes'>;
  description: string;
  ingredients: string;
  price: number;
  prepMinutes: number;
  calories: number;
  image: string;
  featured?: boolean;
  dietary: DietaryTag[];
  tag?: string;
  options?: DishOption[];
  addons?: DishAddon[];
}

export interface Kitchen {
  id: string;
  name: string;
  specialty: string;
  chefName: string;
  neighborhood: string;
  hours: string;
  avgPrepMinutes: number;
  description: string;
  signatureDish: string;
  sourcingNote: string;
  image: string;
}

export interface DeliveryZone {
  id: string;
  neighborhood: string;
  postalCodes: string[];
  etaWindow: string;
  distanceKm: number;
  fee: number;
  freeThreshold: number;
  courierMethod: string;
  mapCoords: { x: number; y: number };
}

export interface DinerReview {
  id: string;
  name: string;
  neighborhood: string;
  dishOrdered: string;
  quote: string;
}

export interface ChefPairing {
  id: string;
  title: string;
  subtitle: string;
  dishIds: string[];
  savings: number;
}

export interface CartItem {
  cartItemId: string;
  dishId: string;
  name: string;
  kitchenName: string;
  image: string;
  unitPrice: number;
  quantity: number;
  selectedOption?: string;
  selectedAddons: string[];
  notes?: string;
}

export type OrderStage =
  | 'confirmed'
  | 'preparing'
  | 'courier'
  | 'delivered';

export interface OrderItemSummary {
  name: string;
  kitchenName: string;
  quantity: number;
  unitPrice: number;
  selectedOption?: string;
  selectedAddons: string[];
}

export interface Order {
  id: string;
  placedAt: string;
  estimatedArrival: string;
  deliveryWindow: string;
  dropoffPreference: 'Leave at Door' | 'Hand to Me';
  stage: OrderStage;
  customerName: string;
  phone: string;
  address: string;
  neighborhood: string;
  paymentMethod: 'Card Online' | 'Card on Delivery' | 'Cash on Delivery';
  courierName: string;
  courierVehicle: string;
  subtotal: number;
  discount: number;
  promoCode?: string;
  tip: number;
  deliveryFee: number;
  total: number;
  items: OrderItemSummary[];
}
