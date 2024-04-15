'use server';

import { prisma } from '../lib/prisma';

export async function validateEmail(email: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user ? true : false;
  } catch (error: any) {
    console.error('Error validating email: ', error);
    return true;
  }
}
