import { Prisma, PrismaClient } from '@prisma/client';

const shippingMethodsData: Prisma.ShippingMethodCreateInput[] = [
  {
    name: 'Delivery',
    price: 10,
    turnAround: '5-7 business days',
  },
  {
    name: 'Pickup',
    price: 0,
    location: '123 Main St, Vancouver, BC',
    location_operation_hours: 'Mon-Fri 9am-5pm',
  },
];
export const createdShippingMethods: Prisma.ShippingMethodCreateInput[] = [];
export async function seedShippingMethods(prisma: PrismaClient): Promise<void> {
  try {
    // Seed Shipping Methods
    console.log('Seeding shipping methods...');

    for (let i = 0; i < shippingMethodsData.length; i++) {
      const shippingMethod = shippingMethodsData[i];
      const createdShippingMethod = await prisma.shippingMethod.create({
        data: shippingMethod,
      });
      createdShippingMethods.push(createdShippingMethod);
      console.log(
        `Created shipping method with id: ${createdShippingMethod.id}`
      );
    }

    console.log('Seeding shipping methods completed!');
  } catch (error) {
    console.error('Error seeding shipping methods!', error);
  } finally {
    await prisma.$disconnect();
  }
}
