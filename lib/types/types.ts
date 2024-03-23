import { fetchProducts } from '@actions/fetch-products';
import { getProductById } from '@actions/productsActions';
import { ProductDetailsFormSchema } from '@components/Admin/ProductDetailsFormValidation';
import { OrderStatus, Prisma, Product, User } from '@prisma/client';
import { Unpacked } from '@utils';
import Stripe from 'stripe';

export type TProducts = Prisma.PromiseReturnType<typeof fetchProducts>;
export type TFullProduct = Prisma.PromiseReturnType<typeof getProductById>;
export type TProduct = Unpacked<TProducts>;
export type TCartItem = { id: string; quantity: number; product: Product };
export type UserWithoutPass = Omit<User, 'password'>;
export interface ExtendedStripeInvoice extends Stripe.Invoice {
  orderStatus: OrderStatus;
}
export type UpdatedUserData = {
  name?: string;
  emailVerified?: Date;
  emailVerifyToken?: string;
  image?: string;
  phone?: string;
  password?: string;
  cloudinaryPublicId?: string;
  stripeCustomerId?: string;
};
export type ProductReqPayload = Omit<ProductDetailsFormSchema, 'images'> & {
  images: {
    existingImages: string[];
    newImages: ({ url: string; publicId: string } | null)[];
  };
};
