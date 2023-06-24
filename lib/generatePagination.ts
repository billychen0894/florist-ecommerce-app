export const generatePagination = (
  currentPage: number,
  totalPages: number
): string[] => {
  const pagination: string[] = [];

  // if total pages is less than 12, show all pages
  if (totalPages <= 12) {
    for (let i = 1; i <= totalPages; i++) {
      pagination.push(String(i));
    }
  } else if (currentPage <= 4) {
    // if current page is less than 4, show first 5 pages and last page
    for (let i = 1; i <= 5; i++) {
      pagination.push(String(i));
    }
    pagination.push('...');
    pagination.push(String(totalPages));
  } else if (currentPage >= totalPages - 3) {
    // if current page is within last 3 pages, show first page and last 5 pages
    pagination.push('1');
    pagination.push('...');
    for (let i = totalPages - 4; i <= totalPages; i++) {
      pagination.push(String(i));
    }
  } else if (currentPage <= 8) {
    // if current page is within first 8 pages, show first 8 pages and last page
    for (let i = 1; i <= 8; i++) {
      pagination.push(String(i));
    }
    pagination.push('...');
    pagination.push(String(totalPages));
  } else if (currentPage >= totalPages - 7) {
    // if current page is within last 7 pages, show first page and last 7 pages
    pagination.push('1');
    pagination.push('...');
    for (let i = totalPages - 7; i <= totalPages; i++) {
      pagination.push(String(i));
    }
  } else {
    // if current page is within middle pages, show first page, current page - 3, current page + 3, and last page
    pagination.push('1');
    pagination.push('...');
    for (let i = currentPage - 3; i <= currentPage + 3; i++) {
      pagination.push(String(i));
    }
    pagination.push('...');
    pagination.push(String(totalPages));
  }

  return pagination;
};
