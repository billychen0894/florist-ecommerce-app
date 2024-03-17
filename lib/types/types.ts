import { fetchProducts } from '@actions/fetch-products';
import { Prisma, Product } from '@prisma/client';
import { Unpacked } from '@utils';

export type TProducts = Prisma.PromiseReturnType<typeof fetchProducts>;
export type TProduct = Unpacked<TProducts>;
export type TCartItem = { id: string; quantity: number; product: Product };
