export function parseSearchParams(
  page?: string,
  limit?: number,
  sort?: string,
  keyword?: string,
  category?: string | string[]
) {
  return {
    page: Number(page) || 1,
    limit: limit || undefined,
    sort: typeof sort === 'string' ? sort : 'popular',
    keyword: typeof keyword === 'string' ? keyword : undefined,
    category: Array.isArray(category)
      ? category
      : category === undefined
      ? []
      : [category],
  };
}
