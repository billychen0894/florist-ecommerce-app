'use server';

import { prisma } from '@lib/prisma';

export const fetchUserByEmail = async (email: string) => {
  try {
    if (!email) return false;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return !!user;
  } catch (err: any) {
    console.log('Something went wrong', err.message);
  }
};
