import { fetchProducts, getProductById } from '@/actions/productsActions';
import { getUserOrdersByUserId, getUserWishlist } from '@/actions/userActions';
import { ProductDetailsFormSchema } from '@/lib/schemaValidator';
import { Unpacked } from '@/utils';
import { OrderStatus, Prisma, User } from '@prisma/client';
import Stripe from 'stripe';

export type TProducts = Prisma.PromiseReturnType<typeof fetchProducts>;
export type TFullProduct = Prisma.PromiseReturnType<typeof getProductById>;
export type TProduct = Unpacked<TProducts>;
export type TWishlist = Prisma.PromiseReturnType<typeof getUserWishlist>;
export type TWishlistItem = Unpacked<TWishlist>;
export type TCartItem = {
  id: string;
  quantity: number;
  product: Exclude<TProduct, null>;
};
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
export type ProductReqPayload = Omit<
  Omit<ProductDetailsFormSchema, 'images'>,
  'selectedProductId'
> & {
  images: {
    existingImages?: ImageUploadResult[];
    newImages?: ImageUploadResult[];
  };
};
export type TOrders = Prisma.PromiseReturnType<typeof getUserOrdersByUserId>;
export type ImageUploadResult = {
  publicId?: string;
  url: string;
};
export type NewProductReqPayload = Omit<
  Omit<ProductDetailsFormSchema, 'images'>,
  'selectedProductId'
> & {
  images: {
    newImages?: ImageUploadResult[];
  };
};
