'use server';
import { verifyJwtAccessToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';
import { JwtPayload } from 'jsonwebtoken';

export const validateTokenWithUserEmail = async (
  email: string,
  token: string
) => {
  try {
    if (!email || !token) {
      throw new Error('Email and token must be supplied');
    }

    const payload = verifyJwtAccessToken(token) as JwtPayload;
    if (email !== payload.email) {
      throw new Error('Token validation failed');
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error('No users found with this email address');
    }

    if (user.passwordVerificationToken !== token) {
      throw new Error('Invalid token');
    }

    return true;
  } catch (err: any) {
    console.log('Error:', err.message);
    return false;
  }
};
