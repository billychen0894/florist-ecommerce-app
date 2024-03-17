'use server';
import { parseSearchParams } from '@lib/parseSearchParams';
import { prisma } from '@lib/prisma';

export const fetchProducts = async (
  page?: string,
  limit?: number,
  sort?: string,
  keyword?: string,
  category?: string | string[]
) => {
  const {
    page: pageNumber,
    limit: take,
    sort: sortOption,
    keyword: search,
    category: categoryFilters,
  } = parseSearchParams(page, limit, sort, keyword, category);

  const skip = limit ? (pageNumber - 1) * limit : 0;
  const popular = sortOption === 'popular' ? 'desc' : 'asc';
  const newest = sortOption === 'newest' ? 'desc' : 'asc';
  const priceDirection = sortOption === 'price-high-to-low' ? 'desc' : 'asc';

  let queryFilters = {
    categories: {},
    name: {},
  };
  if (categoryFilters.length > 0) {
    queryFilters.categories = {
      some: {
        name: {
          in: categoryFilters,
        },
      },
    };
  }

  if (search) {
    queryFilters.name = {
      search,
    };
  }

  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,
        categories: true,
      },
      skip,
      take,
      orderBy: [
        { price: priceDirection },
        { createdAt: newest },
        { orderItems: { _count: popular } },
      ],
      where: queryFilters,
    });
    return products;
  } catch (error) {
    console.error(error);
    return null;
  }
};
