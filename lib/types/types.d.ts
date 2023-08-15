import { Category, Image, Product } from '@prisma/client';

export type ProductItem = Product & { images: Image[] } & {
  categories: Category[];
};
