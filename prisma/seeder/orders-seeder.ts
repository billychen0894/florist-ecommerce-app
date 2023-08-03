import { Prisma, PrismaClient } from '@prisma/client';
import { createdUsers } from './users-seeder';

// orderNumber should be unique string
function generateUniqueOrderNumber(): string {
  return Math.random().toString(36).slice(2, 10);
}

const orderData: Prisma.OrderCreateInput[] = [
  {
    orderNumber: generateUniqueOrderNumber(),
    orderStatus: 'CREATED',
    paymentMethod: 'CREDIT_CARD',
    contactEmail: 'test1@test.com',
    contactPhone: '1234567890',
    total: 1100,
    shippingMethod: {
      create: {
        name: 'Delivery',
        price: 10,
      },
    },
    user: {
      connect: {
        id: createdUsers[Math.floor(Math.random() * createdUsers.length)].id,
      },
    },
    orderItems: {
      create: {
        quantity: 1,
        product: {
          connect: {
            id: '1',
          },
        },
      },
    },
    billingAddress: {
      create: {
        addressType: 'BILLING',
        addressLine1: 'test1',
        city: 'Vancouver',
        stateOrProvince: 'BC',
        postalCode: 'V6N3E6',
        country: 'Canada',
      },
    },
  },
];

export async function seedOrders(prisma: PrismaClient): Promise<void> {
  try {
    // Seed Orders
    console.log('Seeding orders...');

    for (const order of orderData) {
      const createdOrder = await prisma.order.create({
        data: order,
      });
      console.log(`Created order with id: ${createdOrder.id}`);
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}
