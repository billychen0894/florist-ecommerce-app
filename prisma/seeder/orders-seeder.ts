import { Prisma, PrismaClient } from '@prisma/client';
import { createdProducts } from './products-seeder';
import { createdShippingMethods } from './shippingMethods-seeder';
import { createdUsers } from './users-seeder';

// orderNumber should be unique string
function generateUniqueOrderNumber(): string {
  return Math.random().toString(36).slice(2, 10);
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
    paymentMethod: 'CREDIT_CARD',
    contactPhone: '1234567890',
    total: 1100,
    shippingMethod: {
      connect: {
        id: '',
      },
    },
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
        addressType: 'BILLING',
        addressLine1: 'test1',
        city: 'Vancouver',
        stateOrProvince: 'BC',
        postalCode: generateRandomPostalCode(),
        country: 'Canada',
      },
    },
    shippingAddress: {
      create: {
        addressType: 'SHIPPING',
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
          orderNumber: generateUniqueOrderNumber(),
          contactEmail: `test${Math.floor(Math.random() * 3) + 1}@test.com`,
          user: {
            connect: {
              id: createdUsers[Math.floor(Math.random() * createdUsers.length)]
                .id,
            },
          },
          shippingMethod: {
            connect: {
              id: createdShippingMethods[
                Math.floor(Math.random() * createdShippingMethods.length)
              ].id as string,
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
          discountCoupon: {
            create: {
              code: generateUniqueOrderNumber(),
              description: 'Test coupon',
              discount: 0.9,
              expiresAt: new Date('2024-12-31'),
            },
          },
          billingAddress: {
            create: {
              addressType: 'BILLING',
              addressLine1: 'test1',
              city: 'Vancouver',
              stateOrProvince: 'BC',
              postalCode: generateRandomPostalCode(),
              country: 'Canada',
            },
          },
          shippingAddress: {
            create: {
              addressType: 'SHIPPING',
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
