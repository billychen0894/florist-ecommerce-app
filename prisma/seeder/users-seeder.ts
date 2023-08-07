import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

const DEFAULT_ACCESS_TOKEN_SIGN_OPTIONS: SignOptions = {
  expiresIn: '1h',
};

const accessTokenSecret =
  process.env.JWT_ACCESS_TOKEN_SECRET ||
  process.env.NEXT_PUBLIC_JWT_ACCESS_TOKEN_SECRET;

export function signJwtAccessToken(
  payload: JwtPayload,
  options: SignOptions = DEFAULT_ACCESS_TOKEN_SIGN_OPTIONS
) {
  if (!accessTokenSecret) {
    throw new Error('Missing JWT_SECRET env variable');
  }

  if (!payload) {
    throw new Error('Missing payload');
  }

  const accessToken = jwt.sign(payload, accessTokenSecret!, options);

  return accessToken;
}

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'test1 test1',
    email: 'test1@test.com',
  },
  {
    name: 'test2 test2',
    email: 'test2@test.com',
  },
  {
    name: 'test3 test2',
    email: 'test3@test.com',
  },
];

export const createdUsers: Prisma.UserCreateInput[] = [];

export async function seedUsers(prisma: PrismaClient): Promise<void> {
  try {
    // Seed Users
    console.log('Seeding users...');

    for (let i = 1; i <= userData.length; i++) {
      const createdUser = await prisma.user.create({
        data: {
          ...userData[i - 1],
          password: await bcrypt.hash(`TestTest${i}`, 10),
          emailVerifyToken: signJwtAccessToken(
            {
              email: userData[i - 1].email,
              name: userData[i - 1].name,
            },
            {
              expiresIn: '1d',
            }
          ),
        },
      });
      createdUsers.push(createdUser);
      console.log(`Created user with id: ${createdUser.id}`);
    }

    console.log('Seeding admin user...');
    // Seed one admin user
    const adminUser = await prisma.user.create({
      data: {
        name: 'admin1 admin1',
        email: 'admin1@admin.com',
        role: 'admin',
        password: await bcrypt.hash('AdminAdmin1', 10),
      },
    });
    console.log(`Created admin user with id: ${adminUser.id}`);
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}
