import { Prisma, PrismaClient } from '@prisma/client';

export const productData: Prisma.ProductCreateInput[] = [
  {
    name: 'Signature Seasonal Bouquet',
    description:
      'Discover the beauty of our exquisite bouquet, a captivating blend of vibrant and fragrant flowers. Handcrafted with care, this stunning arrangement is designed to bring joy and elegance to any occasion.',
    price: 1100,
    categories: {
      create: [
        {
          name: 'Bouquets',
        },
      ],
    },
    images: {
      create: [
        {
          name: 'Bouquet 1 image 1',
          url: '/images/products/product1.jpg',
          alt: 'Bouquet 1 image 1',
        },
        {
          name: 'Bouquet 1 image 2',
          url: '/images/products/product2.jpg',
          alt: 'Bouquet 1 image 2',
        },
        {
          name: 'Bouquet 1 image 3',
          url: '/images/products/product3.jpg',
          alt: 'Bouquet 1 image 3',
        },
        {
          name: 'Bouquet 1 image 4',
          url: '/images/products/product4.jpg',
          alt: 'Bouquet 1 image 4',
        },
      ],
    },
    productDetails: {
      create: [
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
    },
    leadTime: '1-2 weeks',
    shippingDetails: 'Bouquet 1 shipping details',
    inStock: true,
  },
  {
    name: 'Classic Bouquet',
    description:
      'Discover the beauty of our exquisite bouquet, a captivating blend of vibrant and fragrant flowers. Handcrafted with care, this stunning arrangement is designed to bring joy and elegance to any occasion.',
    price: 1200,
    categories: {
      create: [
        {
          name: 'Bouquets',
        },
      ],
    },
    images: {
      create: [
        {
          name: 'Bouquet 1 image 1',
          url: '/images/products/product1.jpg',
          alt: 'Bouquet 1 image 1',
        },
        {
          name: 'Bouquet 1 image 2',
          url: '/images/products/product2.jpg',
          alt: 'Bouquet 1 image 2',
        },
        {
          name: 'Bouquet 1 image 3',
          url: '/images/products/product3.jpg',
          alt: 'Bouquet 1 image 3',
        },
        {
          name: 'Bouquet 1 image 4',
          url: '/images/products/product4.jpg',
          alt: 'Bouquet 1 image 4',
        },
      ],
    },
    productDetails: {
      create: [
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
    },
    leadTime: '1-2 weeks',
    shippingDetails: 'Bouquet 1 shipping details',
    inStock: true,
  },
  {
    name: 'Tuplip Bunch',
    description:
      'Discover the beauty of our exquisite bouquet, a captivating blend of vibrant and fragrant flowers. Handcrafted with care, this stunning arrangement is designed to bring joy and elegance to any occasion.',
    price: 1300,
    categories: {
      create: [
        {
          name: 'Bouquets',
        },
      ],
    },
    images: {
      create: [
        {
          name: 'Bouquet 1 image 1',
          url: '/images/products/product1.jpg',
          alt: 'Bouquet 1 image 1',
        },
        {
          name: 'Bouquet 1 image 2',
          url: '/images/products/product2.jpg',
          alt: 'Bouquet 1 image 2',
        },
        {
          name: 'Bouquet 1 image 3',
          url: '/images/products/product3.jpg',
          alt: 'Bouquet 1 image 3',
        },
        {
          name: 'Bouquet 1 image 4',
          url: '/images/products/product4.jpg',
          alt: 'Bouquet 1 image 4',
        },
      ],
    },
    productDetails: {
      create: [
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
    },
    leadTime: '1-2 weeks',
    shippingDetails: 'Bouquet 1 shipping details',
    inStock: true,
  },
  {
    name: 'Signature Seasonal Bouquet',
    description:
      'Discover the beauty of our exquisite bouquet, a captivating blend of vibrant and fragrant flowers. Handcrafted with care, this stunning arrangement is designed to bring joy and elegance to any occasion.',
    price: 1400,
    categories: {
      create: [
        {
          name: 'Bouquets',
        },
      ],
    },
    images: {
      create: [
        {
          name: 'Bouquet 1 image 1',
          url: '/images/products/product1.jpg',
          alt: 'Bouquet 1 image 1',
        },
        {
          name: 'Bouquet 1 image 2',
          url: '/images/products/product2.jpg',
          alt: 'Bouquet 1 image 2',
        },
        {
          name: 'Bouquet 1 image 3',
          url: '/images/products/product3.jpg',
          alt: 'Bouquet 1 image 3',
        },
        {
          name: 'Bouquet 1 image 4',
          url: '/images/products/product4.jpg',
          alt: 'Bouquet 1 image 4',
        },
      ],
    },
    productDetails: {
      create: [
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
    },
    leadTime: '1-2 weeks',
    shippingDetails: 'Bouquet 1 shipping details',
    inStock: false,
  },
];

export const createdProducts: Prisma.ProductCreateInput[] = [];
export async function seedProducts(prisma: PrismaClient): Promise<void> {
  try {
    console.log('Seeding products...');

    // Seed each product 5 times from productData array
    for (let i = 0; i < 5; i++) {
      for (const product of productData) {
        const createdProduct = await prisma.product.create({
          data: product,
        });
        createdProducts.push(createdProduct);
        console.log(`Seeded product ${createdProduct.id}`);
      }
    }
  } catch (error) {
    console.log('Error seeding products: ', error);
  } finally {
    await prisma.$disconnect();
  }
}