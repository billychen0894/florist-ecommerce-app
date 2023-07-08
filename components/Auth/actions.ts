'use server';

import { prisma } from '@lib/prisma';

// Check if email is registered in db
// Returns true if email is not registered
export async function isNotRegisteredEmail(email: string) {
  const userWithRegisteredEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (userWithRegisteredEmail) {
    return false;
  }

  return true;
}
