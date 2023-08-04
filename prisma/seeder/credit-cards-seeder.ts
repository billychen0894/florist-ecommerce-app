import { Prisma, PrismaClient } from '@prisma/client';
import { createdUsers } from './users-seeder';

const creditCardsData: Prisma.CREDIT_CARDCreateInput[] = [
  {
    name: 'John Doe',
    number: '1234567890123456',
    expiry: '12/24',
    cvc: '123',
    user: {
      connect: {
        id: '',
      },
    },
  },
];

export async function seedCreditCards(prisma: PrismaClient): Promise<void> {
  try {
    for (let i = 0; i < 3; i++) {
      const createdCreditCard = await prisma.cREDIT_CARD.create({
        data: {
          ...creditCardsData[0],
          user: {
            connect: {
              id: createdUsers[i].id,
            },
          },
        },
      });
      console.log(`Created credit card with id: ${createdCreditCard.id}`);
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}
