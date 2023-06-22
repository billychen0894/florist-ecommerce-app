export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl: {
    primaryImage: string;
    otherImages?: string[];
  };
  specifications: string;
  notes: string;
  shippingDetails: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  products: Product[];
}

// Bouquets or flowers products
export const products: Product[] = [
  {
    id: 1,
    name: 'Signature Seasonal Bouquet',
    price: 100,
    category: 'Bouquets',
    description: 'Bouquet 1 description',
    imageUrl: {
      primaryImage: '/images/products/product1.jpg',
      otherImages: [],
    },
    specifications: 'Bouquet 1 specifications',
    notes: 'Bouquet 1 notes',
    shippingDetails: 'Bouquet 1 shipping details',
  },
  {
    id: 2,
    name: 'Classic Bouquet',
    price: 200,
    category: 'Bouquets',
    description: 'Bouquet 2 description',
    imageUrl: {
      primaryImage: '/images/products/product2.jpg',
      otherImages: [],
    },
    specifications: 'Bouquet 2 specifications',
    notes: 'Bouquet 2 notes',
    shippingDetails: 'Bouquet 2 shipping details',
  },
  {
    id: 3,
    name: 'Tuplip Bunch',
    price: 300,
    category: 'Bouquets',
    description: 'Bouquet 3 description',
    imageUrl: {
      primaryImage: '/images/products/product3.jpg',
      otherImages: [],
    },
    specifications: 'Bouquet 3 specifications',
    notes: 'Bouquet 3 notes',
    shippingDetails: 'Bouquet 3 shipping details',
  },
  {
    id: 4,
    name: 'Signature Seasonal Bouquet',
    price: 400,
    category: 'Bouquets',
    description: 'Bouquet 4 description',
    imageUrl: {
      primaryImage: '/images/products/product4.jpg',
      otherImages: [],
    },
    specifications: 'Bouquet 4 specifications',
    notes: 'Bouquet 4 notes',
    shippingDetails: 'Bouquet 4 shipping details',
  },
  {
    id: 5,
    name: 'Classic Bouquet',
    price: 500,
    category: 'Bouquets',
    description: 'Bouquet 5 description',
    imageUrl: {
      primaryImage: '/images/products/product5.jpg',
      otherImages: [],
    },
    specifications: 'Bouquet 5 specifications',
    notes: 'Bouquet 5 notes',
    shippingDetails: 'Bouquet 5 shipping details',
  },
  {
    id: 6,
    name: 'Tuplip Bunch',
    price: 600,
    category: 'Bouquets',
    description: 'Bouquet 6 description',
    imageUrl: {
      primaryImage: '/images/products/product6.jpg',
      otherImages: [],
    },
    specifications: 'Bouquet 6 specifications',
    notes: 'Bouquet 6 notes',
    shippingDetails: 'Bouquet 6 shipping details',
  },
  {
    id: 7,
    name: 'Signature Seasonal Bouquet',
    price: 700,
    category: 'Bouquets',
    description: 'Bouquet 7 description',
    imageUrl: {
      primaryImage: '/images/products/product7.jpg',
      otherImages: [],
    },
    specifications: 'Bouquet 7 specifications',
    notes: 'Bouquet 7 notes',
    shippingDetails: 'Bouquet 7 shipping details',
  },
  {
    id: 8,
    name: 'Classic Bouquet',
    price: 800,
    category: 'Bouquets',
    description: 'Bouquet 8 description',
    imageUrl: {
      primaryImage: '/images/products/product8.jpg',
      otherImages: [],
    },
    specifications: 'Bouquet 8 specifications',
    notes: 'Bouquet 8 notes',
    shippingDetails: 'Bouquet 8 shipping details',
  },
  {
    id: 9,
    name: 'Tuplip Bunch',
    price: 900,
    category: 'Bouquets',
    description: 'Bouquet 9 description',
    imageUrl: {
      primaryImage: '/images/products/product9.jpg',
      otherImages: [],
    },
    specifications: 'Bouquet 9 specifications',
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
