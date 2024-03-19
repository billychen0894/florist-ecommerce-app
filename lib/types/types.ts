import { fetchProducts } from '@actions/fetch-products';
import { getProductById } from '@actions/getProductById';
import { OrderStatus, Prisma, Product, User } from '@prisma/client';
import { Unpacked } from '@utils';
import Stripe from 'stripe';

export type TProducts = Prisma.PromiseReturnType<typeof fetchProducts>;
export type TFullProduct = Prisma.PromiseReturnType<
  typeof getProductById
> extends { data: infer T }
  ? T
  : never;
export type TProduct = Unpacked<TProducts>;
export type TCartItem = { id: string; quantity: number; product: Product };
export type UserWithoutPass = Omit<User, 'password'>;
export interface ExtendedStripeInvoice extends Stripe.Invoice {
  orderStatus: OrderStatus;
}
