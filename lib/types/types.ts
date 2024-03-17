import { fetchProducts } from '@actions/fetch-products';
import { getProductById } from '@actions/getProductById';
import { Prisma, Product } from '@prisma/client';
import { Unpacked } from '@utils';

export type TProducts = Prisma.PromiseReturnType<typeof fetchProducts>;
export type TFullProduct = Prisma.PromiseReturnType<
  typeof getProductById
> extends { data: infer T }
  ? T
  : never;
export type TProduct = Unpacked<TProducts>;
export type TCartItem = { id: string; quantity: number; product: Product };
