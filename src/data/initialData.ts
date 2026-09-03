import { FoodCategory, FoodItem, DeliveryZone, Coupon, Order, TableReservation, Review, PaymentGatewaySettings, NotificationItem, User } from '../types';

export const INITIAL_CATEGORIES: FoodCategory[] = [
  {
    id: 'cat-biryani',
    slug: 'biryani-polao',
    name_bn: 'বিরিয়ানি ও পোলাও',
    name_en: 'Biryani & Polao',
    iconName: 'UtensilsCrossed',
  },
  {
    id: 'cat-beef-mutton',
    slug: 'beef-mutton',
    name_bn: 'গরু ও খাসির রেজালা/ভুনা',
    name_en: 'Beef & Mutton Delicacies',
    iconName: 'Flame',
  },
  {
    id: 'cat-fish',
    slug: 'fish-seafood',
    name_bn: 'ঐতিহ্যবাহী মাছ ও ইলিশ',
    name_en: 'Heritage Fish & Seafood',
    iconName: 'Fish',
  },
  {
    id: 'cat-chicken',
    slug: 'chicken-kebab',
    name_bn: 'মুরগি ও কাবাব আইটেম',
    name_en: 'Chicken & Charcoal Kebab',
    iconName: 'Sparkles',
  },
  {
    id: 'cat-breads',
    slug: 'breads-sides',
    name_bn: 'শাহি নান ও পরোটা',
    name_en: 'Artisan Naan & Paratha',
    iconName: 'Wheat',
  },
  {
    id: 'cat-desserts',
    slug: 'desserts',
    name_bn: 'নবাবী মিষ্টান্ন ও ফিরনি',
    name_en: 'Royal Sweets & Desserts',
    iconName: 'Heart',
  },
  {
    id: 'cat-drinks',
    slug: 'beverages',
    name_bn: 'বোরহানি ও পানীয়',
    name_en: 'Borhani & Refreshers',
    iconName: 'Coffee',
  }
];

export const INITIAL_FOOD_ITEMS: FoodItem[] = [
  {
    id: 'item-1',
    name_bn: 'পুরান ঢাকা স্পেশাল খাসির কাচ্চি বিরিয়ানি',
    name_en: 'Old Dhaka Shahi Mutton Kacchi Biryani',
    description_bn: 'খাঁটি গাওয়া ঘি ও জাফরানি বাসমতী চালে ম্যারিনেট করা নরম খাসির মাংস, শাহি আলু এবং ডিম সহযোগে পরিবেশিত ঐতিহ্যবাহী কাচ্চি।',
    description_en: 'Tender succulent pieces of mutton slow-cooked dum-style with aged fragrant Basmati rice, shahi potatoes, and pure cow ghee.',
    price: 490,
    originalPrice: 550,
    categoryId: 'cat-biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
    rating: 4.9,
    reviewsCount: 142,
    isVeg: false,
    spiceLevel: 2,
    prepTimeMinutes: 25,
    calories: 780,
    available: true,
    isFeatured: true,
    tags: ['Kacchi', 'Bestseller', 'Mutton', 'Old Dhaka'],
    addons: [
      { id: 'add-101', name_bn: 'অতিরিক্ত শাহি আলু (১ পিস)', name_en: 'Extra Spiced Potato (1 pc)', price: 30 },
      { id: 'add-102', name_bn: 'স্পেশাল বোরহানি (২৫০ মি.লি.)', name_en: 'Special Borhani (250ml)', price: 70 },
      { id: 'add-103', name_bn: 'শাহি জর্দা কাপ', name_en: 'Royal Zarda Cup', price: 60 },
      { id: 'add-104', name_bn: 'সেদ্ধ দেশি ডিম', name_en: 'Boiled Egg', price: 25 }
    ]
  },
  {
    id: 'item-2',
    name_bn: 'চট্টগ্রাম ঐতিহ্যবাহী গরুর কালা ভুনা',
    name_en: 'Chittagong Heritage Beef Kala Bhuna',
    description_bn: 'কালো জিরে, গোলমরিচ এবং রাঁধুনি মশলায় নিবিড় আঁচে ভুনা করা খাঁটি গরুর মাংসের অপূর্ব যুগলবন্দী। অসাধারণ সুবাস ও স্বাদ।',
    description_en: 'Slow-caramelized tender beef cuts tossed in roasted indigenous spices, dark mustard oil, and fiery crushed peppercorns.',
    price: 420,
    originalPrice: 460,
    categoryId: 'cat-beef-mutton',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80',
    rating: 4.9,
    reviewsCount: 98,
    isVeg: false,
    spiceLevel: 3,
    prepTimeMinutes: 20,
    calories: 620,
    available: true,
    isFeatured: true,
    tags: ['Beef', 'Kala Bhuna', 'Spicy', 'Signature'],
    addons: [
      { id: 'add-201', name_bn: 'বাটার নান (১ পিস)', name_en: 'Butter Naan (1 pc)', price: 60 },
      { id: 'add-202', name_bn: 'লুচি পরোটা (২ পিস)', name_en: 'Luchi Paratha (2 pcs)', price: 50 },
      { id: 'add-203', name_bn: 'কাঁচা পেঁয়াজ ও মরিচ সালাদ', name_en: 'Fresh Onion & Chili Salad', price: 20 }
    ]
  },
  {
    id: 'item-3',
    name_bn: 'সুগন্ধি মোরগ পোলাও ও ডিম রোস্ট',
    name_en: 'Fragrant Shahi Morog Polao with Egg Roast',
    description_bn: 'চিনিগুঁড়া সুগন্ধি চাল ও দেশি মুরগির রোস্টের নিখুঁত সংমিশ্রণ। বাদাম বাটা ও কিশমিশের শাহী সুগন্ধিতে ভরপুর।',
    description_en: 'Aromatic Chinigura rice delicately tossed with rich desi chicken leg roast, boiled egg, fried shallots, and golden raisins.',
    price: 360,
    originalPrice: 400,
    categoryId: 'cat-biryani',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&q=80',
    rating: 4.8,
    reviewsCount: 86,
    isVeg: false,
    spiceLevel: 1,
    prepTimeMinutes: 20,
    calories: 690,
    available: true,
    isFeatured: true,
    tags: ['Polao', 'Chicken Roast', 'Traditional'],
    addons: [
      { id: 'add-301', name_bn: 'অতিরিক্ত মুরগির রোস্ট (১ পিস)', name_en: 'Extra Chicken Roast Piece', price: 180 },
      { id: 'add-302', name_bn: 'আলু বোখারা চাটনি', name_en: 'Aloo Bukhara Chutney', price: 40 }
    ]
  },
  {
    id: 'item-4',
    name_bn: 'পদ্মার খাঁটি সর্ষে ইলিশ ভাপা',
    name_en: 'Steamed Padma Shorshe Ilish Bhapa',
    description_bn: 'তাজা পদ্মার বড় ইলিশের পেটি, হলুদ সর্ষে বাটা, কাঁচামরিচ ও ঘানিভাঙা খাঁটি সর্ষের তেলে ভাপানো অমৃত সমান স্বাদ।',
    description_en: 'Fresh wild Hilsa fish steak steamed in artisanal yellow mustard seed paste, green chilies, and cold-pressed mustard oil.',
    price: 580,
    originalPrice: 650,
    categoryId: 'cat-fish',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80',
    rating: 5.0,
    reviewsCount: 74,
    isVeg: false,
    spiceLevel: 2,
    prepTimeMinutes: 30,
    calories: 520,
    available: true,
    isFeatured: true,
    tags: ['Ilish', 'Hilsa', 'Fish', 'Padma'],
    addons: [
      { id: 'add-401', name_bn: 'সাদা সুগন্ধি ভাত', name_en: 'Steamed Fragrant Rice', price: 60 },
      { id: 'add-402', name_bn: 'ঘি ও কাঁচামরিচ টপিং', name_en: 'Ghee & Fresh Green Chili', price: 30 }
    ]
  },
  {
    id: 'item-5',
    name_bn: 'খুলনার ঐতিহ্যবাহী চুইঝাল গরুর মাংস',
    name_en: 'Khulna Special Beef Chuijhal',
    description_bn: 'প্রাকৃতিক ঔষধি চুই গাছের শিকড়ের তীব্র সুবাস ও তীক্ষ্ণ স্বাদে প্রস্তুত দক্ষিণাঞ্চলের তুমুল জনপ্রিয় গরুর মাংসের ঝোল।',
    description_en: 'Traditional beef curry braised with rare aromatic Chuijhal stem root, whole garlic pods, and robust rustic spices.',
    price: 450,
    categoryId: 'cat-beef-mutton',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80',
    rating: 4.8,
    reviewsCount: 52,
    isVeg: false,
    spiceLevel: 3,
    prepTimeMinutes: 25,
    calories: 640,
    available: true,
    tags: ['Chuijhal', 'Khulna', 'Spicy', 'Curry']
  },
  {
    id: 'item-6',
    name_bn: 'চিকেন রেশমি কাবাব ও পুদিনা চাটনি',
    name_en: 'Chicken Reshmi Kebab with Mint Chutney',
    description_bn: 'কাজুবাদাম বাটা, মালাই ও বিশেষ মশলায় ম্যারিনেট করা কাঠকয়লার আগুনে সেঁকা মোলায়েম চিকেন শিক কাবাব (৬ পিস)।',
    description_en: 'Tender chicken skewers marinated in cashew cream, yogurt, and gentle cardamom, grilled to smoky golden perfection.',
    price: 320,
    categoryId: 'cat-chicken',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&q=80',
    rating: 4.7,
    reviewsCount: 65,
    isVeg: false,
    spiceLevel: 1,
    prepTimeMinutes: 18,
    calories: 430,
    available: true,
    tags: ['Kebab', 'Grill', 'Appetizer']
  },
  {
    id: 'item-7',
    name_bn: 'ক্রিস্পি রূপচাঁদা মাছ ফ্রাই (আস্ত)',
    name_en: 'Whole Crisp Bay Silver Pomfret Fry',
    description_bn: 'বঙ্গোপসাগরের তাজা আস্ত রূপচাঁদা মাছ, লেবুর রস ও বিশেষ মশলায় ম্যারিনেট করে মুচমুচে ফ্রাই করা। সাথে পেঁয়াজ বেরেস্তা ও সস।',
    description_en: 'Whole sea pomfret scored and marinated with chili-turmeric glaze, flash-fried until crisp and golden brown.',
    price: 490,
    categoryId: 'cat-fish',
    image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800&q=80',
    rating: 4.8,
    reviewsCount: 39,
    isVeg: false,
    spiceLevel: 2,
    prepTimeMinutes: 22,
    calories: 480,
    available: true,
    tags: ['Pomfret', 'Fish', 'Fry']
  },
  {
    id: 'item-8',
    name_bn: 'গার্লিক বাটার নান (তন্দুরি)',
    name_en: 'Tandoori Garlic Butter Naan',
    description_bn: 'মাটির তন্দুরে সেঁকা তুলতুলে নরম নান, যার উপরিভাগে রসুন কুচি, ধনেপাতা ও খাঁটি মাখনের সুবাস।',
    description_en: 'Traditional clay-oven baked flatbread brushed generously with melted butter, roasted minced garlic, and fresh coriander.',
    price: 70,
    categoryId: 'cat-breads',
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&q=80',
    rating: 4.9,
    reviewsCount: 110,
    isVeg: true,
    spiceLevel: 0,
    prepTimeMinutes: 10,
    calories: 260,
    available: true,
    tags: ['Naan', 'Bread', 'Tandoor']
  },
  {
    id: 'item-9',
    name_bn: 'মাটির হাঁড়িতে নবাবী জাফরানি ফিরনি',
    name_en: 'Royal Saffron Phirni in Clay Pot',
    description_bn: 'খাঁটি ঘন দুধ, সুগন্ধি চাল ও খাঁটি ইরানি জাফরানে সেদ্ধ করে তৈরি রাজকীয় ফিরনি। ওপর দিয়ে পেস্তা ও কাজু বাদামের সাজ।',
    description_en: 'Creamy ground rice pudding slow-simmered in whole buffalo milk, Persian saffron, green cardamom, and slivered pistachios.',
    price: 120,
    originalPrice: 140,
    categoryId: 'cat-desserts',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80',
    rating: 4.9,
    reviewsCount: 88,
    isVeg: true,
    spiceLevel: 0,
    prepTimeMinutes: 5,
    calories: 280,
    available: true,
    isFeatured: true,
    tags: ['Dessert', 'Sweet', 'Saffron', 'Clay Pot']
  },
  {
    id: 'item-10',
    name_bn: 'পুরান ঢাকার ঐতিহ্যবাহী শাহি বোরহানি',
    name_en: 'Old Dhaka Authentic Shahi Borhani (500ml)',
    description_bn: 'টক দই, পুদিনা পাতা, ধনেপাতা, বিট লবণ ও বিশেষ ১৮ পদের ভেষজ মশলায় ব্লেন্ড করা অত্যন্ত সুস্বাদু ও হজমকারক পানীয়।',
    description_en: 'Traditional Dhaka celebratory yogurt beverage infused with fresh mint, cilantro, black salt, and digestive roasted cumin.',
    price: 110,
    categoryId: 'cat-drinks',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80',
    rating: 4.9,
    reviewsCount: 165,
    isVeg: true,
    spiceLevel: 1,
    prepTimeMinutes: 5,
    calories: 140,
    available: true,
    isFeatured: true,
    tags: ['Borhani', 'Drink', 'Digestive', 'Special']
  },
  {
    id: 'item-11',
    name_bn: 'নরম তুলতুলে শাহি রসমালাই (৪ পিস)',
    name_en: 'Artisan Malai Rasmalai (4 pcs)',
    description_bn: 'খাঁটি ছানার নরম স্পঞ্জ মিষ্টি, এলাচি ও জাফরান সুবাসিত ঘন ক্ষীরের মালাইয়ে ভেজানো অমৃত।',
    description_en: 'Delicate cottage cheese dumplings soaked in chilled saffron-infused clotted sweet cream milk with pistachio flakes.',
    price: 180,
    categoryId: 'cat-desserts',
    image: 'https://images.unsplash.com/photo-1605197143984-754641e7d235?w=800&q=80',
    rating: 4.9,
    reviewsCount: 60,
    isVeg: true,
    spiceLevel: 0,
    prepTimeMinutes: 5,
    calories: 320,
    available: true,
    tags: ['Rasmalai', 'Sweets', 'Dessert']
  },
  {
    id: 'item-12',
    name_bn: 'জাফরানি পেস্তা বাদাম লাচ্ছি',
    name_en: 'Saffron Pistachio Royal Lassi',
    description_bn: 'মিষ্টি দই, গোলাপ জল ও বরফের সাথে পেস্তা বাদাম ও জাফরান মিশিয়ে তৈরি ঘন রিফ্রেশিং পানীয়।',
    description_en: 'Rich churned sweet yogurt smoothie blended with rosewater, saffron strands, and crushed roasted pistachios.',
    price: 130,
    categoryId: 'cat-drinks',
    image: 'https://images.unsplash.com/photo-1571006682893-ac9ad89b6f87?w=800&q=80',
    rating: 4.8,
    reviewsCount: 45,
    isVeg: true,
    spiceLevel: 0,
    prepTimeMinutes: 5,
    calories: 220,
    available: true,
    tags: ['Lassi', 'Beverage', 'Summer']
  }
];

export const INITIAL_DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'zone-dhanmondi',
    name_bn: 'ধানমন্ডি ও সংলগ্ন এলাকা',
    name_en: 'Dhanmondi & Adjacent',
    baseFee: 40,
    minOrder: 250,
    estimatedMinutes: 30,
    lat: 23.7461,
    lng: 90.3742
  },
  {
    id: 'zone-gulshan-banani',
    name_bn: 'গুলশান, বনানী ও নিকেতন',
    name_en: 'Gulshan, Banani & Niketon',
    baseFee: 60,
    minOrder: 350,
    estimatedMinutes: 40,
    lat: 23.7925,
    lng: 90.4078
  },
  {
    id: 'zone-uttara',
    name_bn: 'উত্তরা (সেক্টর ১-১৮)',
    name_en: 'Uttara (Sectors 1-18)',
    baseFee: 80,
    minOrder: 500,
    estimatedMinutes: 45,
    lat: 23.8759,
    lng: 90.3795
  },
  {
    id: 'zone-mirpur',
    name_bn: 'মিরপুর (১-১২)',
    name_en: 'Mirpur (1-12)',
    baseFee: 60,
    minOrder: 300,
    estimatedMinutes: 35,
    lat: 23.8067,
    lng: 90.3683
  },
  {
    id: 'zone-mohammadpur',
    name_bn: 'মোহাম্মদপুর ও আদাবর',
    name_en: 'Mohammadpur & Adabor',
    baseFee: 45,
    minOrder: 250,
    estimatedMinutes: 30,
    lat: 23.7658,
    lng: 90.3585
  },
  {
    id: 'zone-old-dhaka',
    name_bn: 'পুরান ঢাকা ও লালবাগ',
    name_en: 'Old Dhaka & Lalbagh',
    baseFee: 50,
    minOrder: 300,
    estimatedMinutes: 35,
    lat: 23.7104,
    lng: 90.4074
  },
  {
    id: 'zone-bashundhara',
    name_bn: 'বসুন্ধরা আ/এ ও বারিধারা',
    name_en: 'Bashundhara R/A & Baridhara',
    baseFee: 70,
    minOrder: 400,
    estimatedMinutes: 45,
    lat: 23.8191,
    lng: 90.4286
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'DHAKA100',
    discountPercent: 20,
    maxDiscount: 100,
    minSpend: 500,
    validUntil: '2026-12-31',
    description_bn: 'যেকোনো ৫০০ টাকার বেশি অর্ডারে ২০% ছাড় (সর্বোচ্চ ১০০ টাকা)',
    description_en: '20% off on orders above ৳500 (Max ৳100)',
    active: true
  },
  {
    code: 'KACCHI50',
    discountPercent: 10,
    maxDiscount: 50,
    minSpend: 400,
    validUntil: '2026-12-31',
    description_bn: 'বিরিয়ানি অর্ডারে অতিরিক্ত ৫০ টাকা ছাড়',
    description_en: 'Flat ৳50 discount on Biryani meals',
    active: true
  },
  {
    code: 'FESTIVE',
    discountPercent: 15,
    maxDiscount: 200,
    minSpend: 1000,
    validUntil: '2026-12-31',
    description_bn: 'বড় ফ্যামিলি অর্ডারে ১৫% ফেস্টিভ ছাড়',
    description_en: '15% off on large family feasts above ৳1000',
    active: true
  }
];

export const INITIAL_GATEWAY_SETTINGS: PaymentGatewaySettings = {
  enabledMethods: {
    bkash: true,
    nagad: true,
    rocket: true,
    upay: true,
    tap: true,
    card: true,
    sslcommerz: true,
    cod: true,
    pay_at_restaurant: true
  },
  preferredGateway: 'SSLCommerz',
  minCodAmount: 200,
  maxCodAmount: 5000,
  bkashMerchantNumber: '01711-XXXXXX',
  nagadMerchantNumber: '01811-XXXXXX',
  rocketMerchantNumber: '01911-XXXXXX0',
  upayMerchantNumber: '01611-XXXXXX',
  sandboxMode: true,
  sslczStoreId: 'dhanshiri_live_01',
  autoConfirmOnlineOrders: true
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'DK-8491',
    customerName: 'তানভীর আহমেদ (Tanvir Ahmed)',
    customerPhone: '01712-345678',
    customerEmail: 'tanvir.ahmed@example.com',
    deliveryAddress: {
      id: 'addr-1',
      label: 'Home',
      area: 'ধানমন্ডি',
      zoneId: 'zone-dhanmondi',
      streetAddress: 'বাড়ি #১২, রোড #২৭, ধানমন্ডি',
      apartmentFloor: 'ফ্ল্যাট ৪বি',
      phone: '01712-345678'
    },
    deliveryZone: INITIAL_DELIVERY_ZONES[0],
    items: [
      {
        foodItemId: 'item-1',
        name_bn: 'পুরান ঢাকা স্পেশাল খাসির কাচ্চি বিরিয়ানি',
        name_en: 'Old Dhaka Shahi Mutton Kacchi Biryani',
        price: 490,
        quantity: 2,
        addons: [
          { id: 'add-102', name_bn: 'স্পেশাল বোরহানি (২৫০ মি.লি.)', name_en: 'Special Borhani (250ml)', price: 70 }
        ]
      },
      {
        foodItemId: 'item-9',
        name_bn: 'মাটির হাঁড়িতে নবাবী জাফরানি ফিরনি',
        name_en: 'Royal Saffron Phirni in Clay Pot',
        price: 120,
        quantity: 2,
        addons: []
      }
    ],
    subtotal: 1360,
    deliveryFee: 40,
    discount: 100,
    couponCode: 'DHAKA100',
    loyaltyDiscount: 0,
    total: 1300,
    paymentMethod: 'bkash',
    paymentStatus: 'success',
    orderStatus: 'on_the_way',
    trxId: 'BKS9A772LK1',
    paymentGateway: 'bKash Merchant Direct',
    paymentAccount: '01712-***678',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    estimatedDeliveryTime: '15-20 মিনিট'
  },
  {
    id: 'ord-1002',
    orderNumber: 'DK-8492',
    customerName: 'নুসরাত জাহান (Nusrat Jahan)',
    customerPhone: '01819-987654',
    customerEmail: 'nusrat.j@example.com',
    deliveryAddress: {
      id: 'addr-2',
      label: 'Office',
      area: 'গুলশান ২',
      zoneId: 'zone-gulshan-banani',
      streetAddress: 'প্লট #৪৫, রোড #১১, গুলশান ২',
      phone: '01819-987654'
    },
    deliveryZone: INITIAL_DELIVERY_ZONES[1],
    items: [
      {
        foodItemId: 'item-2',
        name_bn: 'চট্টগ্রাম ঐতিহ্যবাহী গরুর কালা ভুনা',
        name_en: 'Chittagong Heritage Beef Kala Bhuna',
        price: 420,
        quantity: 1,
        addons: [
          { id: 'add-201', name_bn: 'বাটার নান (১ পিস)', name_en: 'Butter Naan (1 pc)', price: 60 }
        ]
      }
    ],
    subtotal: 480,
    deliveryFee: 60,
    discount: 0,
    loyaltyDiscount: 0,
    total: 540,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    orderStatus: 'preparing',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    estimatedDeliveryTime: '25-30 মিনিট'
  }
];

export const INITIAL_RESERVATIONS: TableReservation[] = [
  {
    id: 'res-501',
    customerName: 'ড. ফারহান চৌধুরী (Dr. Farhan Chowdhury)',
    phone: '01713-998877',
    email: 'farhan.c@example.com',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '20:00',
    guests: 6,
    seatingArea: 'rooftop',
    specialRequests: 'বিবাহবার্ষিকী উদযাপন, সুন্দর ফুলের সাজসজ্জা রাখবেন।',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  },
  {
    id: 'res-502',
    customerName: 'সাদিয়া ইসলাম (Sadia Islam)',
    phone: '01912-112233',
    email: 'sadia.i@example.com',
    date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    time: '13:30',
    guests: 4,
    seatingArea: 'private_family',
    specialRequests: 'পরিবারের বয়োজ্যেষ্ঠ সদস্যদের জন্য শান্ত ও আরামদায়ক কর্নার।',
    status: 'pending',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title_bn: '🎉 প্রথম অর্ডারে ২০% ছাড়!',
    title_en: '🎉 20% OFF on First Order!',
    message_bn: 'কুপন কোড DHAKA100 ব্যবহার করে উপভোগ করুন সর্বোচ্চ ১০০ টাকা পর্যন্ত তাৎক্ষণিক ছাড়।',
    message_en: 'Use promo code DHAKA100 to claim up to ৳100 discount on your order.',
    type: 'discount',
    read: false,
    date: 'আজ ১০:০০ AM'
  },
  {
    id: 'notif-2',
    title_bn: '🍲 নতুন পদ: খুলনার চুইঝাল গরুর মাংস',
    title_en: '🍲 New Dish: Khulna Special Beef Chuijhal',
    message_bn: 'আমাদের কিচেনে এখন পাওয়া যাচ্ছে খুলনার ঐতিহ্যবাহী খাঁটি চুইঝাল মাংস। এখনই ট্রাই করুন!',
    message_en: 'Authentic indigenous Chuijhal beef from Khulna is now freshly available on our menu!',
    type: 'new_item',
    read: false,
    date: 'গতকাল'
  }
];

export const INITIAL_SAMPLE_ORDERS = INITIAL_ORDERS;

export const INITIAL_USER: User = {
  id: 'usr-dhaka-1',
  name: 'মুহাম্মদ শাকিল (Muhammad Shakil)',
  phone: '01715-678901',
  email: 'shakil.dhaka@example.com',
  role: 'customer',
  loyaltyPoints: 150,
  referralCode: 'DHAKA-VIP-88',
  savedAddresses: [
    {
      id: 'addr-default',
      label: 'Home',
      area: 'ধানমন্ডি (Dhanmondi)',
      zoneId: 'zone-dhanmondi',
      streetAddress: 'বাড়ি #১২, রোড #২৭, ধানমন্ডি',
      apartmentFloor: 'ফ্ল্যাট ৪বি',
      landmark: 'সোবহানবাগ মসজিদের কাছে',
      phone: '01715-678901',
      lat: 23.7510,
      lng: 90.3750
    }
  ],
  joinedDate: '২০২৫-১০-১৫'
};
