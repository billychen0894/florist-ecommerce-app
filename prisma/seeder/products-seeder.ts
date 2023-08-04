import { Prisma, PrismaClient } from '@prisma/client';
import { createdCategories } from './categories-seeder';
import { createdProductDetails } from './productDetails-seeder';

export const productData: Prisma.ProductCreateInput[] = [
  {
    name: 'Signature Seasonal Bouquet',
    description:
      'Discover the beauty of our exquisite bouquet, a captivating blend of vibrant and fragrant flowers. Handcrafted with care, this stunning arrangement is designed to bring joy and elegance to any occasion.',
    price: 1100,
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
    leadTime: '1-2 weeks',
    shippingDetails: 'Bouquet 1 shipping details',
    inStock: true,
    productDetail: {
      connect: {
        id: '',
      },
    },
  },
  {
    name: 'Classic Bouquet',
    description:
      'Discover the beauty of our exquisite bouquet, a captivating blend of vibrant and fragrant flowers. Handcrafted with care, this stunning arrangement is designed to bring joy and elegance to any occasion.',
    price: 1200,
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
    leadTime: '1-2 weeks',
    shippingDetails: 'Bouquet 1 shipping details',
    inStock: true,
    productDetail: {
      connect: {
        id: '',
      },
    },
  },
  {
    name: 'Tuplip Bunch',
    description:
      'Discover the beauty of our exquisite bouquet, a captivating blend of vibrant and fragrant flowers. Handcrafted with care, this stunning arrangement is designed to bring joy and elegance to any occasion.',
    price: 1300,
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
    leadTime: '1-2 weeks',
    shippingDetails: 'Bouquet 1 shipping details',
    inStock: true,
    productDetail: {
      connect: {
        id: '',
      },
    },
  },
  {
    name: 'Signature Seasonal Bouquet',
    description:
      'Discover the beauty of our exquisite bouquet, a captivating blend of vibrant and fragrant flowers. Handcrafted with care, this stunning arrangement is designed to bring joy and elegance to any occasion.',
    price: 1400,
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
    leadTime: '1-2 weeks',
    shippingDetails: 'Bouquet 1 shipping details',
    inStock: false,
    productDetail: {
      connect: {
        id: '',
      },
    },
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
          data: {
            ...product,
            categories: {
              connect: {
                id: createdCategories[
                  Math.floor(Math.random() * createdCategories.length)
                ].id,
              },
            },
            productDetail: {
              connect: {
                id: createdProductDetails[0].id,
              },
            },
          },
        });

        createdProducts.push(createdProduct as any);
        console.log(`Seeded product ${createdProduct.id}`);
      }
    }
  } catch (error) {
    console.log('Error seeding products: ', error);
  } finally {
    await prisma.$disconnect();
  }
}
