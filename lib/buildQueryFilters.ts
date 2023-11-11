export function buildQueryFilters(categoryFilters: string[], search?: string) {
  if (categoryFilters.length > 0 && !search) {
    return {
      categories: {
        some: {
          name: {
            in: categoryFilters,
          },
        },
      },
    };
  } else if (categoryFilters.length > 0 && search) {
    return {
      categories: {
        some: {
          name: {
            in: categoryFilters,
          },
        },
      },
      name: {
        search: search,
      },
    };
  } else if (categoryFilters.length === 0 && search) {
    return {
      name: {
        search: search,
      },
    };
  }
  return {};
}
