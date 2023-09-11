import { Prisma, PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { createdProducts } from './products-seeder';
import { createdUsers } from './users-seeder';

export function generateUniqueNumber(prefix: string) {
  const uniqueId = uuidv4().split('-')[0].toUpperCase();
  return `${prefix}${uniqueId}`;
}

// Generate random Canadian postal code
function generateRandomPostalCode(): string {
  const postalCode = [
    Math.floor(Math.random() * 10),
    String.fromCharCode(Math.floor(Math.random() * 26) + 65),
    Math.floor(Math.random() * 10),
    String.fromCharCode(Math.floor(Math.random() * 26) + 65),
    Math.floor(Math.random() * 10),
    String.fromCharCode(Math.floor(Math.random() * 26) + 65),
  ];
  return postalCode.join('');
}

const orderData: Prisma.OrderCreateInput[] = [
  {
    orderNumber: '',
    orderStatus: 'CREATED',
    contactEmail: 'test1@test.com',
    contactPhone: '1234567890',
    total: 1100,
    user: {
      connect: {
        id: '',
      },
    },
    orderItems: {
      create: {
        quantity: Math.floor(Math.random() * 10) + 1,
        product: {
          connect: {
            id: '',
          },
        },
      },
    },
    billingAddress: {
      create: {
        addressLine1: 'test1',
        city: 'Vancouver',
        stateOrProvince: 'BC',
        postalCode: generateRandomPostalCode(),
        country: 'Canada',
      },
    },
    shippingAddress: {
      create: {
        addressLine1: 'test1',
        city: 'Vancouver',
        stateOrProvince: 'BC',
        postalCode: generateRandomPostalCode(),
        country: 'Canada',
      },
    },
  },
];

export async function seedOrders(prisma: PrismaClient): Promise<void> {
  try {
    // Seed Orders
    console.log('Seeding orders...');

    for (let i = 0; i < 10; i++) {
      const createdOrder = await prisma.order.create({
        data: {
          ...orderData[0],
          orderNumber: generateUniqueNumber('BL'),
          contactEmail: `test${Math.floor(Math.random() * 3) + 1}@test.com`,
          user: {
            connect: {
              id: createdUsers[Math.floor(Math.random() * createdUsers.length)]
                .id,
            },
          },
          orderItems: {
            create: {
              quantity: Math.floor(Math.random() * 10) + 1,
              product: {
                connect: {
                  id: createdProducts[
                    Math.floor(Math.random() * createdProducts.length)
                  ].id as string,
                },
              },
            },
          },
          billingAddress: {
            create: {
              addressLine1: 'test1',
              city: 'Vancouver',
              stateOrProvince: 'BC',
              postalCode: generateRandomPostalCode(),
              country: 'Canada',
            },
          },
          shippingAddress: {
            create: {
              addressLine1: 'test1',
              city: 'Vancouver',
              stateOrProvince: 'BC',
              postalCode: generateRandomPostalCode(),
              country: 'Canada',
            },
          },
        },
      });
      console.log(`Created order with id: ${createdOrder.id}`);
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}
