import { Prisma, PrismaClient } from '@prisma/client';

const productDetailsData: Prisma.ProductDetailCreateInput[] = [
  {
    productDetailItems: {
      create: [
        {
          productDetailItemName: 'Product',
          items: [
            'Beautiful arrangement of fresh flowers',
            'Includes a variety of roses, lilies, and daisies',
            'Carefully handcrafted by expert florists',
            'Comes with a decorative vase',
            'Perfect for birthdays, anniversaries, or any special occasion',
          ],
        },
        {
          productDetailItemName: 'Care',
          items: [
            'Always keep your bouquet in a cool spot, away from direct heat or sunlight',
            'Take special care when moving your bouquet - there is a vase with water inside, so the bouquet must always be level',
            'Lift the roses out of the box to check water levels every 2-3 days, and cut the stems on a diagonal every 4-5 days to ensure optimal hydration',
          ],
        },
        {
          productDetailItemName: 'Delivery and Pickup',
          items: [
            'In Toronto, Vancouver and Kelowna we offer the option to either have your bouquet delivered, or picked up from any of our local studios on the date of your choice',
            'Delivery rates are determined by your postal code, and will be displayed upon checkout. They range from $14.99 up to $70 depending on distance from our central studios.',
          ],
        },
      ],
    },
  },
];

export const createdProductDetails: Prisma.ProductDetailCreateInput[] = [];

export async function seedProductDetails(prisma: PrismaClient): Promise<void> {
  try {
    // Seed Product Details
    console.log('Seeding product details...');

    for (const productDetail of productDetailsData) {
      const createdProductDetail = await prisma.productDetail.create({
        data: productDetail,
      });

      createdProductDetails.push(createdProductDetail);

      console.log(
        `Created product details with id: ${createdProductDetail.id}`
      );
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}
