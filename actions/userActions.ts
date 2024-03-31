'use server';

import { options } from '@app/api/auth/[...nextauth]/options';
import { SignUpFormData, signUpFormSchema } from '@components/Auth/SignUpForm';
import { transporter } from '@lib/emailTransporter';
import { signJwtAccessToken } from '@lib/jwt';
import { prisma } from '@lib/prisma';
import { UpdatedUserData } from '@lib/types/types';
import bcrypt from 'bcrypt';
import { getServerSession } from 'next-auth';
import { exclude } from '@lib/exclude';
import { revalidatePath } from 'next/cache';
import { stripe } from '@lib/stripe';
import Stripe from 'stripe';

export const getUserWishlist = async (userId: string) => {
  try {
    if (!userId) throw new Error('User ID is required');
    const session = await getServerSession(options);
    if (!session) throw new Error('Unauthorized');
    if (session?.user?.id !== userId) throw new Error('Unauthorized');

    const result = await prisma.user.findFirst({
      where: { id: userId },
      select: {
        wishlist: {
          include: {
            images: true,
          },
        },
      },
    });

    revalidatePath('(store)/products/[product]', 'page');
    return result ? result.wishlist : null;
  } catch (error) {
    console.error('Error fetching user wishlist', error);
    return null;
  }
};

export const createUser = async (userPayload: SignUpFormData) => {
  try {
    const validatedUserData = await signUpFormSchema.validate(userPayload);
    const { email, password, firstName, lastName } = validatedUserData;

    const existedEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existedEmail) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const emailVerificationToken = signJwtAccessToken({
      email,
      firstName,
      lastName,
    });

    const newUser = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        password: hashedPassword,
        emailVerifyToken: emailVerificationToken,
      },
    });

    if (!newUser) {
      throw new Error('Error creating user');
    }

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify your email address',
      html: `
          <div>
            <h1>Verify your email address</h1>
            <p>Hi ${firstName},</p>
            <p>Thanks for signing up for an account on <a href=${process.env.APP_BASE_URL}>Blossom Lane</a>.</p>
            <p>Please click the link below to verify your email address:</p>
            <a href="${process.env.APP_BASE_URL}/verify-email?token=${emailVerificationToken}">Verify your email address</a>
            <p>Thanks,</p>
            <p>Blossom Lane Team</p>
          </div>
        `,
    });

    const { password: userPassword, ...userWithoutPassword } = newUser;
    return {
      success: true,
      data: { ...userWithoutPassword },
      message: 'User created successfully',
    };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      message: error.message,
    };
  }
};

export const updateUser = async (userData: UpdatedUserData, userId: string) => {
  try {
    if (!userId) throw new Error('User ID is required');

    const session = await getServerSession(options);
    if (!session) throw new Error('Unauthorized');

    if (
      session?.user?.id !== userId &&
      session?.user?.role !== 'user' &&
      session?.user?.role !== 'admin'
    ) {
      throw new Error('Unauthorized');
    }

    const {
      name,
      emailVerified,
      emailVerifyToken,
      image,
      phone,
      password,
      cloudinaryPublicId,
      stripeCustomerId,
    } = userData;

    const existingUser = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new Error('User not found');
    }

    let hashedNewPassword: string | undefined;
    if (password) {
      hashedNewPassword = await bcrypt.hash(password, 10);
    }

    const updatedUserData = {
      ...existingUser,
      name: name || existingUser.name,
      emailVerified: emailVerified || existingUser.emailVerified,
      emailVerifyToken: emailVerifyToken || existingUser.emailVerifyToken,
      phone: phone || existingUser.phone,
      image: image || existingUser.image,
      password: hashedNewPassword || existingUser.password,
      cloudinaryPublicId: cloudinaryPublicId || existingUser.cloudinaryPublicId,
      stripeCustomerId: stripeCustomerId || existingUser.stripeCustomerId,
    };

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...updatedUserData,
      },
    });

    const userWithoutPassword = exclude(user, ['password']);

    revalidatePath('(store)/user');
    return {
      success: true,
      data: userWithoutPassword,
      message: 'User updated successfully',
    };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getUser = async (userId: string) => {
  try {
    if (!userId) throw new Error('User ID is required');

    const session = await getServerSession(options);
    if (!session) throw new Error('Unauthorized');
    if (session?.user?.id !== userId) throw new Error('Unauthorized');
    if (session?.user?.role !== 'user' && session?.user?.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const userWithoutPassword = exclude(user, ['password']);

    return userWithoutPassword;
  } catch (error: any) {
    console.error(error);
    return null;
  }
};

export const addToUserWishlist = async (productId: string, userId: string) => {
  try {
    if (!userId) throw new Error('User ID is required');
    if (!productId) throw new Error('Product ID is required');

    const session = await getServerSession(options);
    if (!session) throw new Error('Unauthorized');

    if (session?.user?.id !== userId && session?.user?.role !== 'user') {
      throw new Error('Unauthorized');
    }

    const promises = [
      await prisma.user.findFirst({
        where: { id: userId },
      }),
      await prisma.product.findFirst({
        where: { id: productId },
      }),
    ];

    const [existingUser, existingProduct] = await Promise.all(promises);

    if (!existingUser) {
      throw new Error('User not found');
    }

    if (!existingProduct) {
      throw new Error('Product not found');
    }

    const addedProduct = await prisma.user.update({
      where: { id: userId },
      data: {
        wishlist: {
          connect: {
            id: productId,
          },
        },
      },
    });

    revalidatePath('(store)/products/[product]', 'page');
    return {
      success: true,
      data: addedProduct,
      message: 'Product added to wishlist',
    };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      message: error.message,
    };
  }
};

export const removeProductFromWishlist = async (
  productId: string,
  userId: string
) => {
  try {
    if (!userId) throw new Error('User ID is required');
    if (!productId) throw new Error('Product ID is required');

    const session = await getServerSession(options);
    if (!session) throw new Error('Unauthorized');

    if (session?.user?.id !== userId && session?.user?.role !== 'user') {
      throw new Error('Unauthorized');
    }

    const existingUser = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new Error('User not found');
    }

    const updatedWishlist = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        wishlist: {
          disconnect: {
            id: productId,
          },
        },
      },
      include: {
        wishlist: true,
      },
    });

    revalidatePath('(store)/products/[product]', 'page');
    return {
      success: true,
      data: updatedWishlist,
      message: 'Product removed from wishlist',
    };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      message: error.message,
    };
  }
};

export const fetchUserByStripeId = async (stripeCustomerId: string) => {
  try {
    if (!stripeCustomerId) throw new Error('Stripe customer ID is required');

    const customer = await stripe.customers.retrieve(stripeCustomerId, {
      apiKey: process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY,
    });

    return customer as Stripe.Customer;
  } catch (error) {
    console.error('Error fetching user by stripe ID', error);
    return null;
  }
};
