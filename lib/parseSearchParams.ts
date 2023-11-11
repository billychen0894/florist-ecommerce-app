export function parseSearchParams(searchParams: {
  [key: string]: string | string[] | undefined;
}): {
  page: number;
  limit: number;
  sort: string;
  keyword: string | undefined;
  category: string[];
} {
  return {
    page: Number(searchParams.page) || 1,
    limit: Number(searchParams.limit) || 12,
    sort: typeof searchParams.sort === 'string' ? searchParams.sort : 'popular',
    keyword:
      typeof searchParams.keyword === 'string'
        ? searchParams.keyword
        : undefined,
    category: Array.isArray(searchParams.category)
      ? searchParams.category
      : searchParams.category === undefined
      ? []
      : [searchParams.category],
  };
}
