export interface ProductImage {
  id: number;
  name: string;
  imageUrl: string;
  alt?: string;
}

export interface ProductDetails {
  name: string;
  items: string[];
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  images: ProductImage[];
  details: ProductDetails[];
  inStock: boolean;
  leadTime?: string;
  notes: string;
  shippingDetails: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  products: Product[];
}

export interface ProductSortOption {
  name: string;
  href: string;
}

// Bouquets or flowers products
export const products: Product[] = [
  {
    id: 1,
    name: 'Signature Seasonal Bouquet',
    price: 100,
    category: 'Bouquets',
    description:
      'Discover the beauty of our exquisite bouquet, a captivating blend of vibrant and fragrant flowers. Handcrafted with care, this stunning arrangement is designed to bring joy and elegance to any occasion.',
    images: [
      {
        id: 1,
        name: 'Bouquet 1 image 1',
        imageUrl: '/images/products/product1.jpg',
        alt: 'Bouquet 1 image 1',
      },
      {
        id: 2,
        name: 'Bouquet 1 image 2',
        imageUrl: '/images/products/product2.jpg',
        alt: 'Bouquet 1 image 2',
      },
      {
        id: 3,
        name: 'Bouquet 1 image 3',
        imageUrl: '/images/products/product3.jpg',
        alt: 'Bouquet 1 image 3',
      },
      {
        id: 4,
        name: 'Bouquet 1 image 4',
        imageUrl: '/images/products/product4.jpg',
        alt: 'Bouquet 1 image 4',
      },
    ],
    details: [
      {
        name: 'Our Bouquet',
        items: [
          'Beautiful arrangement of fresh flowers',
          'Includes a variety of roses, lilies, and daisies',
          'Carefully handcrafted by expert florists',
          'Comes with a decorative vase',
          'Perfect for birthdays, anniversaries, or any special occasion',
        ],
      },
      {
        name: 'Care',
        items: [
          'Always keep your bouquet in a cool spot, away from direct heat or sunlight',
          'Take special care when moving your bouquet - there is a vase with water inside, so the bouquet must always be level',
          'Lift the roses out of the box to check water levels every 2-3 days, and cut the stems on a diagonal every 4-5 days to ensure optimal hydration',
        ],
      },
      {
        name: 'Delivery and Pickup',
        items: [
          'In Toronto, Vancouver and Kelowna we offer the option to either have your bouquet delivered, or picked up from any of our local studios on the date of your choice',
          'Delivery rates are determined by your postal code, and will be displayed upon checkout. They range from $14.99 up to $70 depending on distance from our central studios.',
        ],
      },
    ],
    inStock: true,
    leadTime: '1-2 weeks',
    notes: 'Bouquet 1 notes',
    shippingDetails: 'Bouquet 1 shipping details',
  },
  {
    id: 2,
    name: 'Classic Bouquet',
    price: 200,
    category: 'Bouquets',
    description: 'Bouquet 2 description',
    images: [
      {
        id: 1,
        name: 'Bouquet 1 image 1',
        imageUrl: '/images/products/product2.jpg',
        alt: 'Bouquet 1 image 1',
      },
      {
        id: 2,
        name: 'Bouquet 1 image 2',
        imageUrl: '/images/products/product2.jpg',
        alt: 'Bouquet 1 image 2',
      },
      {
        id: 3,
        name: 'Bouquet 1 image 3',
        imageUrl: '/images/products/product3.jpg',
        alt: 'Bouquet 1 image 3',
      },
      {
        id: 4,
        name: 'Bouquet 1 image 4',
        imageUrl: '/images/products/product4.jpg',
        alt: 'Bouquet 1 image 4',
      },
    ],
    details: [
      {
        name: 'Bouquet 1 detail 1',
        items: [
          'Bouquet 1 detail 1 item 1',
          'Bouquet 1 detail 1 item 2',
          'Bouquet 1 detail 1 item 3',
        ],
      },
      {
        name: 'Bouquet 1 detail 2',
        items: [
          'Bouquet 1 detail 2 item 1',
          'Bouquet 1 detail 2 item 2',
          'Bouquet 1 detail 2 item 3',
        ],
      },
      {
        name: 'Bouquet 1 detail 3',
        items: [
          'Bouquet 1 detail 3 item 1',
          'Bouquet 1 detail 3 item 2',
          'Bouquet 1 detail 3 item 3',
        ],
      },
    ],
    inStock: false,
    leadTime: '1-2 weeks',
    notes: 'Bouquet 2 notes',
    shippingDetails: 'Bouquet 2 shipping details',
  },
  {
    id: 3,
    name: 'Tuplip Bunch',
    price: 300,
    category: 'Bouquets',
    description: 'Bouquet 3 description',
    images: [
      {
        id: 1,
        name: 'Bouquet 1 image 1',
        imageUrl: '/images/products/product3.jpg',
        alt: 'Bouquet 1 image 1',
      },
      {
        id: 2,
        name: 'Bouquet 1 image 2',
        imageUrl: '/images/products/product2.jpg',
        alt: 'Bouquet 1 image 2',
      },
      {
        id: 3,
        name: 'Bouquet 1 image 3',
        imageUrl: '/images/products/product3.jpg',
        alt: 'Bouquet 1 image 3',
      },
      {
        id: 4,
        name: 'Bouquet 1 image 4',
        imageUrl: '/images/products/product4.jpg',
        alt: 'Bouquet 1 image 4',
      },
    ],
    details: [
      {
        name: 'Bouquet 1 detail 1',
        items: [
          'Bouquet 1 detail 1 item 1',
          'Bouquet 1 detail 1 item 2',
          'Bouquet 1 detail 1 item 3',
        ],
      },
      {
        name: 'Bouquet 1 detail 2',
        items: [
          'Bouquet 1 detail 2 item 1',
          'Bouquet 1 detail 2 item 2',
          'Bouquet 1 detail 2 item 3',
        ],
      },
      {
        name: 'Bouquet 1 detail 3',
        items: [
          'Bouquet 1 detail 3 item 1',
          'Bouquet 1 detail 3 item 2',
          'Bouquet 1 detail 3 item 3',
        ],
      },
    ],
    inStock: true,
    leadTime: '1-2 weeks',
    notes: 'Bouquet 3 notes',
    shippingDetails: 'Bouquet 3 shipping details',
  },
  {
    id: 4,
    name: 'Signature Seasonal Bouquet',
    price: 400,
    category: 'Bouquets',
    description: 'Bouquet 4 description',
    images: [
      {
        id: 1,
        name: 'Bouquet 1 image 1',
        imageUrl: '/images/products/product4.jpg',
        alt: 'Bouquet 1 image 1',
      },
      {
        id: 2,
        name: 'Bouquet 1 image 2',
        imageUrl: '/images/products/product2.jpg',
        alt: 'Bouquet 1 image 2',
      },
      {
        id: 3,
        name: 'Bouquet 1 image 3',
        imageUrl: '/images/products/product3.jpg',
        alt: 'Bouquet 1 image 3',
      },
      {
        id: 4,
        name: 'Bouquet 1 image 4',
        imageUrl: '/images/products/product4.jpg',
        alt: 'Bouquet 1 image 4',
      },
    ],
    details: [
      {
        name: 'Bouquet 1 detail 1',
        items: [
          'Bouquet 1 detail 1 item 1',
          'Bouquet 1 detail 1 item 2',
          'Bouquet 1 detail 1 item 3',
        ],
      },
      {
        name: 'Bouquet 1 detail 2',
        items: [
          'Bouquet 1 detail 2 item 1',
          'Bouquet 1 detail 2 item 2',
          'Bouquet 1 detail 2 item 3',
        ],
      },
      {
        name: 'Bouquet 1 detail 3',
        items: [
          'Bouquet 1 detail 3 item 1',
          'Bouquet 1 detail 3 item 2',
          'Bouquet 1 detail 3 item 3',
        ],
      },
    ],
    inStock: true,
    leadTime: '1-2 weeks',
    notes: 'Bouquet 4 notes',
    shippingDetails: 'Bouquet 4 shipping details',
  },
  {
    id: 5,
    name: 'Classic Bouquet',
    price: 500,
    category: 'Bouquets',
    description: 'Bouquet 5 description',
    images: [
      {
        id: 1,
        name: 'Bouquet 1 image 1',
        imageUrl: '/images/products/product5.jpg',
        alt: 'Bouquet 1 image 1',
      },
      {
        id: 2,
        name: 'Bouquet 1 image 2',
        imageUrl: '/images/products/product2.jpg',
        alt: 'Bouquet 1 image 2',
      },
      {
        id: 3,
        name: 'Bouquet 1 image 3',
        imageUrl: '/images/products/product3.jpg',
        alt: 'Bouquet 1 image 3',
      },
      {
        id: 4,
        name: 'Bouquet 1 image 4',
        imageUrl: '/images/products/product4.jpg',
        alt: 'Bouquet 1 image 4',
      },
    ],
    details: [
      {
        name: 'Bouquet 1 detail 1',
        items: [
          'Bouquet 1 detail 1 item 1',
          'Bouquet 1 detail 1 item 2',
          'Bouquet 1 detail 1 item 3',
        ],
      },
      {
        name: 'Bouquet 1 detail 2',
        items: [
          'Bouquet 1 detail 2 item 1',
          'Bouquet 1 detail 2 item 2',
          'Bouquet 1 detail 2 item 3',
        ],
      },
      {
        name: 'Bouquet 1 detail 3',
        items: [
          'Bouquet 1 detail 3 item 1',
          'Bouquet 1 detail 3 item 2',
          'Bouquet 1 detail 3 item 3',
        ],
      },
    ],
    inStock: true,
    leadTime: '1-2 weeks',
    notes: 'Bouquet 5 notes',
    shippingDetails: 'Bouquet 5 shipping details',
  },
  {
    id: 6,
    name: 'Tuplip Bunch',
    price: 600,
    category: 'Bouquets',
    description: 'Bouquet 6 description',
    images: [
      {
        id: 1,
        name: 'Bouquet 1 image 1',
        imageUrl: '/images/products/product6.jpg',
        alt: 'Bouquet 1 image 1',
      },
      {
        id: 2,
        name: 'Bouquet 1 image 2',
        imageUrl: '/images/products/product2.jpg',
        alt: 'Bouquet 1 image 2',
      },
      {
        id: 3,
        name: 'Bouquet 1 image 3',
        imageUrl: '/images/products/product3.jpg',
        alt: 'Bouquet 1 image 3',
      },
      {
        id: 4,
        name: 'Bouquet 1 image 4',
        imageUrl: '/images/products/product4.jpg',
        alt: 'Bouquet 1 image 4',
      },
    ],
    details: [
      {
        name: 'Bouquet 1 detail 1',
        items: [
          'Bouquet 1 detail 1 item 1',
          'Bouquet 1 detail 1 item 2',
          'Bouquet 1 detail 1 item 3',
        ],
      },
      {
        name: 'Bouquet 1 detail 2',
        items: [
          'Bouquet 1 detail 2 item 1',
          'Bouquet 1 detail 2 item 2',
          'Bouquet 1 detail 2 item 3',
        ],
      },
      {
        name: 'Bouquet 1 detail 3',
        items: [
          'Bouquet 1 detail 3 item 1',
          'Bouquet 1 detail 3 item 2',
          'Bouquet 1 detail 3 item 3',
        ],
      },
    ],
    inStock: true,
    leadTime: '1-2 weeks',
    notes: 'Bouquet 6 notes',
    shippingDetails: 'Bouquet 6 shipping details',
  },
  {
    id: 7,
    name: 'Signature Seasonal Bouquet',
    price: 700,
    category: 'Bouquets',
    description: 'Bouquet 7 description',
    images: [
      {
        id: 1,
        name: 'Bouquet 1 image 1',
        imageUrl: '/images/products/product7.jpg',
        alt: 'Bouquet 1 image 1',
      },
      {
        id: 2,
        name: 'Bouquet 1 image 2',
        imageUrl: '/images/products/product2.jpg',
        alt: 'Bouquet 1 image 2',
      },
      {
        id: 3,
        name: 'Bouquet 1 image 3',
        imageUrl: '/images/products/product3.jpg',
        alt: 'Bouquet 1 image 3',
      },
      {
        id: 4,
        name: 'Bouquet 1 image 4',
        imageUrl: '/images/products/product4.jpg',
        alt: 'Bouquet 1 image 4',
      },
    ],
    details: [
      {
        name: 'Bouquet 1 detail 1',
        items: [
          'Bouquet 1 detail 1 item 1',
          'Bouquet 1 detail 1 item 2',
          'Bouquet 1 detail 1 item 3',
        ],
      },
      {
        name: 'Bouquet 1 detail 2',
        items: [
          'Bouquet 1 detail 2 item 1',
          'Bouquet 1 detail 2 item 2',
          'Bouquet 1 detail 2 item 3',
        ],
      },
      {
        name: 'Bouquet 1 detail 3',
        items: [
          'Bouquet 1 detail 3 item 1',
          'Bouquet 1 detail 3 item 2',
          'Bouquet 1 detail 3 item 3',
        ],
      },
    ],
    inStock: true,
    leadTime: '1-2 weeks',
    notes: 'Bouquet 7 notes',
    shippingDetails: 'Bouquet 7 shipping details',
  },
  {
    id: 8,
    name: 'Classic Bouquet',
    price: 800,
    category: 'Bouquets',
    description: 'Bouquet 8 description',
    images: [
      {
        id: 1,
        name: 'Bouquet 1 image 1',
        imageUrl: '/images/products/product8.jpg',
        alt: 'Bouquet 1 image 1',
      },
      {
        id: 2,
        name: 'Bouquet 1 image 2',
        imageUrl: '/images/products/product2.jpg',
        alt: 'Bouquet 1 image 2',
      },
      {
        id: 3,
        name: 'Bouquet 1 image 3',
        imageUrl: '/images/products/product3.jpg',
        alt: 'Bouquet 1 image 3',
      },
      {
        id: 4,
        name: 'Bouquet 1 image 4',
        imageUrl: '/images/products/product4.jpg',
        alt: 'Bouquet 1 image 4',
      },
    ],
    details: [
      {
        name: 'Bouquet 1 detail 1',
        items: [
          'Bouquet 1 detail 1 item 1',
          'Bouquet 1 detail 1 item 2',
          'Bouquet 1 detail 1 item 3',
        ],
      },
      {
        name: 'Bouquet 1 detail 2',
        items: [
          'Bouquet 1 detail 2 item 1',
          'Bouquet 1 detail 2 item 2',
          'Bouquet 1 detail 2 item 3',
        ],
      },
      {
        name: 'Bouquet 1 detail 3',
        items: [
          'Bouquet 1 detail 3 item 1',
          'Bouquet 1 detail 3 item 2',
          'Bouquet 1 detail 3 item 3',
        ],
      },
    ],
    inStock: true,
    leadTime: '1-2 weeks',
    notes: 'Bouquet 8 notes',
    shippingDetails: 'Bouquet 8 shipping details',
  },
  {
    id: 9,
    name: 'Tuplip Bunch',
    price: 900,
    category: 'Bouquets',
    description: 'Bouquet 9 description',
    images: [
      {
        id: 1,
        name: 'Bouquet 1 image 1',
        imageUrl: '/images/products/product9.jpg',
        alt: 'Bouquet 1 image 1',
      },
      {
        id: 2,
        name: 'Bouquet 1 image 2',
        imageUrl: '/images/products/product2.jpg',
        alt: 'Bouquet 1 image 2',
      },
      {
        id: 3,
        name: 'Bouquet 1 image 3',
        imageUrl: '/images/products/product3.jpg',
        alt: 'Bouquet 1 image 3',
      },
      {
        id: 4,
        name: 'Bouquet 1 image 4',
        imageUrl: '/images/products/product4.jpg',
        alt: 'Bouquet 1 image 4',
      },
    ],
    details: [
      {
        name: 'Bouquet 1 detail 1',
        items: [
          'Bouquet 1 detail 1 item 1',
          'Bouquet 1 detail 1 item 2',
          'Bouquet 1 detail 1 item 3',
        ],
      },
      {
        name: 'Bouquet 1 detail 2',
        items: [
          'Bouquet 1 detail 2 item 1',
          'Bouquet 1 detail 2 item 2',
          'Bouquet 1 detail 2 item 3',
        ],
      },
      {
        name: 'Bouquet 1 detail 3',
        items: [
          'Bouquet 1 detail 3 item 1',
          'Bouquet 1 detail 3 item 2',
          'Bouquet 1 detail 3 item 3',
        ],
      },
    ],
    inStock: true,
    leadTime: '1-2 weeks',
    notes: 'Bouquet 9 notes',
    shippingDetails: 'Bouquet 9 shipping details',
  },
];

export const productCategories: ProductCategory[] = [
  {
    id: 1,
    name: 'Bouquets',
    products: products,
  },
  {
    id: 2,
    name: 'Flowers',
    products: products,
  },
  {
    id: 3,
    name: 'Plants',
    products: products,
  },
  {
    id: 4,
    name: 'Gifts',
    products: products,
  },
];

export const productSortOptions: ProductSortOption[] = [
  { name: 'Most Popular', href: 'popular' },
  { name: 'Newest', href: 'newest' },
  { name: 'Price: Low to High', href: 'price-low-to-high' },
  { name: 'Price: High to Low', href: 'price-high-to-low' },
];
