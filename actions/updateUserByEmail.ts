'use server';

import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcrypt';

export const updateUserPasswordByEmail = async (
  email: string,
  newPassword: string
) => {
  try {
    if (!email || !newPassword) {
      throw new Error('Email and new password are required');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    const user = await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: hashedNewPassword,
        passwordVerificationToken: '',
      },
    });

    if (!user) {
      throw new Error('Something went wrong during updating user');
    }

    return true;
  } catch (err: any) {
    console.log('Error:', err.message);
    return false;
  }
};
