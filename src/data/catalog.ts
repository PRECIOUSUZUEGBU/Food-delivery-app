import {
  ChefPairing,
  DeliveryZone,
  DinerReview,
  Dish,
  Kitchen,
  Order,
} from '../types/food';

export const HERO_IMAGE = '/src/assets/images/hero_dining_spread_1795190153281.jpg';
export const CHEF_PASS_IMAGE = '/src/assets/images/kitchen_chef_pass_1795190156229.jpg';
export const COURIER_DISPATCH_IMAGE = '/src/assets/images/kitchen_courier_dispatch_1795190705273.jpg';

export const KITCHENS: Kitchen[] = [
  {
    id: 'fornace',
    name: 'Fornace Sourdough',
    specialty: 'Wood-Fired Pies & Hearth Breads',
    chefName: 'Marco Bellini',
    neighborhood: 'Arts District',
    hours: '11:30 – 22:30',
    avgPrepMinutes: 18,
    description:
      '72-hour cold-fermented organic heritage wheat dough baked at 485°C over seasoned white oak, finished with raw-milk cheeses and market tomatoes.',
    signatureDish: 'Blistered San Marzano Margherita',
    sourcingNote: 'Stone-milled Hudson Valley Red Fife flour & DOP San Marzano tomatoes',
    image: '/src/assets/images/dish_sourdough_pizza_1795190155653.jpg',
  },
  {
    id: 'pastificio',
    name: 'Pastificio Verde',
    specialty: 'Hand-Rolled & Bronze-Die Pasta',
    chefName: 'Elena Conti',
    neighborhood: 'West End',
    hours: '12:00 – 22:00',
    avgPrepMinutes: 16,
    description:
      'Fresh pasture-raised egg pasta extruded and hand-cut every morning, paired with slow-simmered ragùs, shaved black truffle, and Calabrian chilies.',
    signatureDish: 'Black Truffle Egg Tagliatelle',
    sourcingNote: 'Pasture-raised heritage yolks & 24-month aged Parmigiano-Reggiano',
    image: '/src/assets/images/dish_fresh_tagliatelle_1795190156213.jpg',
  },
  {
    id: 'hearth',
    name: 'Hearth & Grain',
    specialty: 'Charred Proteins & Harvest Bowls',
    chefName: 'Nadia Okafor',
    neighborhood: 'Downtown',
    hours: '11:00 – 21:30',
    avgPrepMinutes: 20,
    description:
      'Seasonal grains, herb-brined poultry, and line-caught fish roasted over glowing charcoal and dressed with bright cold-pressed oils and fermented pickles.',
    signatureDish: 'Cedar-Seared Salmon & Farro Bowl',
    sourcingNote: 'Line-caught Pacific salmon & organic heirloom grains milled weekly',
    image: '/src/assets/images/dish_harvest_bowl_1795190156226.jpg',
  },
  {
    id: 'crumb',
    name: 'Maison Crumb',
    specialty: 'Laminated Viennoiserie & Tarts',
    chefName: 'Claire Moreau',
    neighborhood: 'Riverside',
    hours: '07:30 – 19:30',
    avgPrepMinutes: 10,
    description:
      'Cultured Normandy-style butter pastry laminated in small morning batches, stone-milled cardamom knots, and single-origin dark chocolate tarts.',
    signatureDish: 'Morning Viennoiserie Tasting Box',
    sourcingNote: '84% butterfat Normandy-style cultured butter & Valrhona couverture',
    image: '/src/assets/images/dish_bakery_pastries_1795190156238.jpg',
  },
];

export const DISHES: Dish[] = [
  {
    id: 'margherita-sourdough',
    name: 'Blistered San Marzano Margherita',
    kitchenId: 'fornace',
    kitchenName: 'Fornace Sourdough',
    category: 'Wood-Fired',
    description:
      '72-hour naturally leavened sourdough crust blistered in our oak oven with crushed DOP San Marzano tomatoes, fior di latte mozzarella, and sweet basil.',
    ingredients:
      'Heritage stone-milled flour, San Marzano tomatoes, buffalo mozzarella, cold-pressed olive oil, sea salt',
    price: 21.0,
    prepMinutes: 18,
    calories: 780,
    image: '/src/assets/images/dish_sourdough_pizza_1795190155653.jpg',
    featured: true,
    dietary: ['Vegetarian'],
    tag: 'House Classic',
    options: [
      { id: 'standard', label: '12-inch Whole Pie', priceDelta: 0 },
      { id: 'spelt', label: 'Spelt & Ancient Grain Crust', priceDelta: 2.5 },
    ],
    addons: [
      { id: 'burrata', label: 'Fresh Pugliese Burrata', price: 4.5 },
      { id: 'chili-honey', label: 'Calabrian Chili Honey Dip', price: 2.0 },
    ],
  },
  {
    id: 'truffle-tagliatelle',
    name: 'Black Truffle Egg Tagliatelle',
    kitchenId: 'pastificio',
    kitchenName: 'Pastificio Verde',
    category: 'Fresh Pasta',
    description:
      'Silky hand-cut golden egg ribbons emulsified with cultured Alpine butter, 24-month Parmigiano-Reggiano, cracked Tellicherry pepper, and shaved black truffle.',
    ingredients:
      'Pasture egg yolk dough, black Umbrian truffle, Parmigiano-Reggiano, cultured butter, thyme',
    price: 26.5,
    prepMinutes: 16,
    calories: 690,
    image: '/src/assets/images/dish_fresh_tagliatelle_1795190156213.jpg',
    featured: true,
    dietary: ['Vegetarian'],
    tag: 'Chef Selection',
    options: [
      { id: 'regular', label: 'Regular Dinner Portion', priceDelta: 0 },
      { id: 'sharing', label: 'Large Sharing Bowl', priceDelta: 9.0 },
    ],
    addons: [
      { id: 'extra-truffle', label: 'Extra Shaved Black Truffle', price: 7.0 },
      { id: 'focaccia-side', label: 'Warm Rosemary Focaccia Slice', price: 3.5 },
    ],
  },
  {
    id: 'cedar-salmon-bowl',
    name: 'Cedar-Seared Salmon & Farro Bowl',
    kitchenId: 'hearth',
    kitchenName: 'Hearth & Grain',
    category: 'Hearth Bowls',
    description:
      'Crisp-skin wild salmon over nutty toasted farro, blistered broccolini, roasted sweet potato, pickled red onion, sliced avocado, and green herb tahini.',
    ingredients:
      'Wild king salmon, organic farro, broccolini, sweet potato, avocado, parsley tahini',
    price: 24.0,
    prepMinutes: 20,
    calories: 640,
    image: '/src/assets/images/dish_harvest_bowl_1795190156226.jpg',
    featured: true,
    dietary: [],
    options: [
      { id: 'farro', label: 'Warm Toasted Farro Base', priceDelta: 0 },
      { id: 'greens-gf', label: 'Charred Greens Base (Gluten-Free)', priceDelta: 0 },
    ],
    addons: [
      { id: 'soft-egg', label: '6-Minute Jammy Egg', price: 2.5 },
      { id: 'extra-avocado', label: 'Half Hass Avocado', price: 3.0 },
    ],
  },
  {
    id: 'calabrian-rigatoni',
    name: 'Spicy Calabrian Vodka Rigatoni',
    kitchenId: 'pastificio',
    kitchenName: 'Pastificio Verde',
    category: 'Fresh Pasta',
    description:
      'Bronze-die mezze rigatoni tossed in a velvety slow-roasted tomato and Calabrian chili cream reduction, topped with sourdough pangrattato and torn basil.',
    ingredients:
      'Semolina rigatoni, Calabrian chili paste, sweet cream, garlic confit, toasted sourdough crumbs',
    price: 22.0,
    prepMinutes: 15,
    calories: 720,
    image: '/src/assets/images/dish_spicy_rigatoni_1795190155780.jpg',
    featured: true,
    dietary: ['Vegetarian', 'Spicy'],
    tag: 'Most Ordered',
    options: [
      { id: 'medium-heat', label: 'Balanced Calabrian Heat', priceDelta: 0 },
      { id: 'extra-heat', label: 'Extra Chili Oil Finish', priceDelta: 0 },
    ],
    addons: [
      { id: 'stracciatella', label: 'Whipped Stracciatella Crown', price: 4.0 },
      { id: 'fennel-sausage', label: 'Braised Fennel Pork Crumble', price: 5.0 },
    ],
  },
  {
    id: 'hearth-roast-chicken',
    name: 'Herb-Brined Hearth Half Chicken',
    kitchenId: 'hearth',
    kitchenName: 'Hearth & Grain',
    category: 'Hearth Bowls',
    description:
      '24-hour thyme and lemon-brined half pasture chicken roasted on the hearth until crisp, served with charred baby carrots, blistered lemon, and bright salsa verde.',
    ingredients:
      'Pasture-raised chicken, heirloom baby carrots, parsley, capers, charred Meyer lemon',
    price: 27.0,
    prepMinutes: 24,
    calories: 710,
    image: '/src/assets/images/dish_roasted_chicken_1795190155947.jpg',
    featured: true,
    dietary: ['Gluten-Free'],
    options: [
      { id: 'half-bird', label: 'Half Bird & Roasted Carrots', priceDelta: 0 },
      { id: 'with-potatoes', label: 'Add Crispy Smashed Potatoes', priceDelta: 5.5 },
    ],
    addons: [
      { id: 'extra-salsa', label: 'Extra Jar of Salsa Verde', price: 2.5 },
      { id: 'sourdough-loaf', label: 'Half Country Sourdough Loaf', price: 4.5 },
    ],
  },
  {
    id: 'viennoiserie-box',
    name: 'Morning Viennoiserie Tasting Box',
    kitchenId: 'crumb',
    kitchenName: 'Maison Crumb',
    category: 'Bakery & Sweet',
    description:
      'Six warm pastries baked at dawn: two toasted almond croissants, two Swedish pearl-sugar cardamom knots, and two Bronte pistachio cream danishes.',
    ingredients:
      'Cultured French butter, organic stoneground wheat, roasted Sicilian pistachios, freshly ground cardamom',
    price: 25.0,
    prepMinutes: 10,
    calories: 1420,
    image: '/src/assets/images/dish_bakery_pastries_1795190156238.jpg',
    featured: true,
    dietary: ['Vegetarian'],
    tag: 'Small Batch',
    options: [
      { id: 'box-6', label: 'Box of 6 Assorted Pastries', priceDelta: 0 },
      { id: 'box-3', label: 'Trio Box (1 of Each)', priceDelta: -10.5 },
    ],
    addons: [
      { id: 'cultured-butter', label: 'Whipped Sea Salt Butter Pot', price: 3.0 },
      { id: 'cold-brew', label: '500ml Single-Origin Cold Brew', price: 6.5 },
    ],
  },
  {
    id: 'diavola-sourdough',
    name: 'Charred Soppressata & Hot Honey Pie',
    kitchenId: 'fornace',
    kitchenName: 'Fornace Sourdough',
    category: 'Wood-Fired',
    description:
      'Wood-fired sourdough crust layered with crispy cupped soppressata, aged provolone, pickled Fresno chilies, fresh oregano, and wildflower hot honey.',
    ingredients:
      'Sourdough starter dough, Calabrian soppressata, provolone piccante, wildflower honey, oregano',
    price: 23.5,
    prepMinutes: 18,
    calories: 860,
    image: '/src/assets/images/dish_diavola_pizza_1795190704519.jpg',
    dietary: ['Spicy'],
    tag: 'Oak Oven',
    options: [
      { id: 'standard', label: '12-inch Whole Pie', priceDelta: 0 },
      { id: 'extra-crispy', label: 'Well-Done Charred Crust', priceDelta: 0 },
    ],
    addons: [
      { id: 'burrata', label: 'Fresh Pugliese Burrata', price: 4.5 },
      { id: 'ranch-herb', label: 'Buttermilk Herb Dip', price: 2.0 },
    ],
  },
  {
    id: 'cacio-e-pepe',
    name: 'Cracked Tellicherry Cacio e Pepe',
    kitchenId: 'pastificio',
    kitchenName: 'Pastificio Verde',
    category: 'Fresh Pasta',
    description:
      'Thick hand-rolled tonnarelli glazed in an intense emulsion of aged Pecorino Romano DOP and freshly toasted, coarsely cracked black Tellicherry peppercorns.',
    ingredients:
      'Semolina tonnarelli, Pecorino Romano DOP, Tellicherry black pepper, pasta starch emulsion',
    price: 20.5,
    prepMinutes: 14,
    calories: 650,
    image: '/src/assets/images/dish_cacio_pepe_1795190704449.jpg',
    dietary: ['Vegetarian'],
    options: [
      { id: 'regular', label: 'Regular Dinner Bowl', priceDelta: 0 },
      { id: 'extra-pecorino', label: 'Extra Aged Pecorino Finish', priceDelta: 2.0 },
    ],
    addons: [
      { id: 'prosciutto-crisp', label: 'Crispy Prosciutto di Parma', price: 4.5 },
      { id: 'focaccia-side', label: 'Warm Rosemary Focaccia Slice', price: 3.5 },
    ],
  },
  {
    id: 'burrata-harvest-bowl',
    name: 'Roasted Squash & Torn Burrata Bowl',
    kitchenId: 'hearth',
    kitchenName: 'Hearth & Grain',
    category: 'Hearth Bowls',
    description:
      'Caramelized honeynut squash, charred broccolini, crispy spiced chickpeas, and warm herb farro crowned with fresh torn Pugliese burrata and pistachio dukkah.',
    ingredients:
      'Honeynut squash, broccolini, organic chickpeas, Pugliese burrata, pistachio dukkah, mint',
    price: 21.5,
    prepMinutes: 16,
    calories: 590,
    image: '/src/assets/images/dish_burrata_bowl_1795190705022.jpg',
    dietary: ['Vegetarian'],
    tag: 'Seasonal',
    options: [
      { id: 'farro', label: 'Warm Herb Farro Base', priceDelta: 0 },
      { id: 'quinoa-gf', label: 'Red Quinoa Base (Gluten-Free)', priceDelta: 1.0 },
    ],
    addons: [
      { id: 'roasted-salmon', label: 'Add Seared Salmon Fillet', price: 8.5 },
      { id: 'soft-egg', label: '6-Minute Jammy Egg', price: 2.5 },
    ],
  },
  {
    id: 'rosemary-focaccia',
    name: 'Castelvetrano Olive & Rosemary Focaccia',
    kitchenId: 'fornace',
    kitchenName: 'Fornace Sourdough',
    category: 'Wood-Fired',
    description:
      'Thick, airy sourdough focaccia dimpled with estate olive oil, blistered green Castelvetrano olives, rosemary needles, and flaky Maldon sea salt.',
    ingredients:
      '72-hour sourdough, Castelvetrano olives, cold-pressed olive oil, fresh rosemary, Maldon salt',
    price: 13.0,
    prepMinutes: 10,
    calories: 520,
    image: '/src/assets/images/dish_rosemary_focaccia_1795190705177.jpg',
    dietary: ['Vegetarian'],
    options: [
      { id: 'half-slab', label: 'Warm Table Slab (4 Cuts)', priceDelta: 0 },
      { id: 'whole-sheet', label: 'Full Sharing Sheet (8 Cuts)', priceDelta: 9.5 },
    ],
    addons: [
      { id: 'chili-oil', label: 'Roasted Garlic & Chili Dipping Oil', price: 2.5 },
      { id: 'burrata', label: 'Fresh Pugliese Burrata', price: 4.5 },
    ],
  },
  {
    id: 'chocolate-hazelnut-tart',
    name: 'Valrhona Dark Chocolate & Hazelnut Tart',
    kitchenId: 'crumb',
    kitchenName: 'Maison Crumb',
    category: 'Bakery & Sweet',
    description:
      'Silky 70% Valrhona dark chocolate ganache in a crisp almond pâte sucrée shell, finished with roasted Piedmont hazelnuts, flaky sea salt, and espresso mascarpone.',
    ingredients:
      'Valrhona Guanaja 70%, Piedmont hazelnuts, cultured cream, espresso mascarpone, flaky sea salt',
    price: 14.5,
    prepMinutes: 8,
    calories: 480,
    image: '/src/assets/images/dish_chocolate_tart_1795190705462.jpg',
    dietary: ['Vegetarian'],
    tag: 'Evening Dessert',
    options: [
      { id: 'single-slice', label: 'Single Slice & Espresso Cream', priceDelta: 0 },
      { id: 'two-slices', label: 'Duo Pack (2 Slices)', priceDelta: 12.5 },
    ],
    addons: [
      { id: 'cold-brew', label: '500ml Single-Origin Cold Brew', price: 6.5 },
    ],
  },
];

export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'downtown',
    neighborhood: 'Downtown',
    postalCodes: ['10001', '10002', '10003', '10013'],
    etaWindow: '20 – 30 min',
    distanceKm: 1.4,
    fee: 3.5,
    freeThreshold: 45,
    courierMethod: 'Insulated Cargo Bike',
    mapCoords: { x: 24, y: 68 },
  },
  {
    id: 'arts-district',
    neighborhood: 'Arts District',
    postalCodes: ['10012', '10014', '10011'],
    etaWindow: '22 – 32 min',
    distanceKm: 1.8,
    fee: 3.5,
    freeThreshold: 45,
    courierMethod: 'Insulated Cargo Bike',
    mapCoords: { x: 46, y: 44 },
  },
  {
    id: 'west-end',
    neighborhood: 'West End',
    postalCodes: ['10019', '10023', '10024'],
    etaWindow: '25 – 35 min',
    distanceKm: 2.6,
    fee: 4.5,
    freeThreshold: 45,
    courierMethod: 'Electric Courier Bike',
    mapCoords: { x: 72, y: 34 },
  },
  {
    id: 'riverside',
    neighborhood: 'Riverside',
    postalCodes: ['10025', '10027', '10028'],
    etaWindow: '28 – 38 min',
    distanceKm: 3.2,
    fee: 5.0,
    freeThreshold: 45,
    courierMethod: 'Electric Courier Bike',
    mapCoords: { x: 78, y: 74 },
  },
];

export const CHEF_PAIRINGS: ChefPairing[] = [
  {
    id: 'wood-fired-night',
    title: 'Wood-Fired Supper for Two',
    subtitle: 'Blistered Margherita + Olive Focaccia + Dark Chocolate Tart',
    dishIds: ['margherita-sourdough', 'rosemary-focaccia', 'chocolate-hazelnut-tart'],
    savings: 4.5,
  },
  {
    id: 'pasta-hearth-duo',
    title: 'Chef Bench & Hearth Duo',
    subtitle: 'Black Truffle Tagliatelle + Roasted Squash & Burrata Bowl',
    dishIds: ['truffle-tagliatelle', 'burrata-harvest-bowl'],
    savings: 4.0,
  },
];

export const NEIGHBORHOOD_REVIEWS: DinerReview[] = [
  {
    id: 'rev-1',
    name: 'Clara Jensen',
    neighborhood: 'Arts District',
    dishOrdered: 'Black Truffle Egg Tagliatelle',
    quote:
      'Ordered pasta and sourdough focaccia from two different kitchens in one bag; the insulated bike box kept the noodles hot and glossy in 24 minutes.',
  },
  {
    id: 'rev-2',
    name: 'David Osei',
    neighborhood: 'Downtown',
    dishOrdered: 'Herb-Brined Hearth Half Chicken',
    quote:
      'Crisp skin straight out of the compostable tray and zero soggy steam. Knowing the exact kitchen counter cooking my dinner makes all the difference.',
  },
  {
    id: 'rev-3',
    name: 'Miriam Kagawa',
    neighborhood: 'West End',
    dishOrdered: 'Charred Soppressata & Hot Honey Pie',
    quote:
      'Friday night pizza arrived with blistered spots still crisp and Calabrian honey packed separately. Easily our weekly neighborhood ritual.',
  },
];

export const PROMO_CODES: Record<string, { label: string; type: 'percent' | 'fixed'; value: number }> = {
  FRESH10: { label: '10% Neighborhood Welcome', type: 'percent', value: 0.1 },
  FIRSTBITE: { label: '$5.00 Off First Dispatch', type: 'fixed', value: 5 },
};

export const INITIAL_ACTIVE_ORDER: Order = {
  id: 'LT-4082',
  placedAt: 'Today, 18:42',
  estimatedArrival: '19:12',
  deliveryWindow: 'Deliver ASAP (22–32 min)',
  dropoffPreference: 'Leave at Door',
  stage: 'preparing',
  customerName: 'Hannah Brooks',
  phone: '(212) 555-0148',
  address: '418 Mercer St, Apt 4B',
  neighborhood: 'Arts District',
  paymentMethod: 'Card Online',
  courierName: 'Mateo Alvarez',
  courierVehicle: 'Cargo Bike #14',
  subtotal: 47.5,
  discount: 0,
  tip: 7.0,
  deliveryFee: 0,
  total: 54.5,
  items: [
    {
      name: 'Black Truffle Egg Tagliatelle',
      kitchenName: 'Pastificio Verde',
      quantity: 1,
      unitPrice: 26.5,
      selectedOption: 'Regular Dinner Portion',
      selectedAddons: [],
    },
    {
      name: 'Blistered San Marzano Margherita',
      kitchenName: 'Fornace Sourdough',
      quantity: 1,
      unitPrice: 21.0,
      selectedOption: '12-inch Whole Pie',
      selectedAddons: [],
    },
  ],
};

export const INITIAL_PAST_ORDERS: Order[] = [
  {
    id: 'LT-3914',
    placedAt: 'Nov 14, 19:15',
    estimatedArrival: 'Delivered 19:44',
    deliveryWindow: '19:30 – 20:00',
    dropoffPreference: 'Hand to Me',
    stage: 'delivered',
    customerName: 'Hannah Brooks',
    phone: '(212) 555-0148',
    address: '418 Mercer St, Apt 4B',
    neighborhood: 'Arts District',
    paymentMethod: 'Card Online',
    courierName: 'Sora Takahashi',
    courierVehicle: 'Electric Bike #08',
    subtotal: 49.0,
    discount: 0,
    tip: 7.35,
    deliveryFee: 0,
    total: 56.35,
    items: [
      {
        name: 'Cedar-Seared Salmon & Farro Bowl',
        kitchenName: 'Hearth & Grain',
        quantity: 1,
        unitPrice: 24.0,
        selectedOption: 'Warm Toasted Farro Base',
        selectedAddons: [],
      },
      {
        name: 'Morning Viennoiserie Tasting Box',
        kitchenName: 'Maison Crumb',
        quantity: 1,
        unitPrice: 25.0,
        selectedOption: 'Box of 6 Assorted Pastries',
        selectedAddons: [],
      },
    ],
  },
];
