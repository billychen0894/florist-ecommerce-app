export interface Page {
  name: string;
  href: string;
}

export interface Navigation {
  pages: Page[];
}

export const navigation: Navigation = {
  pages: [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Company', href: '/company' },
    { name: 'FAQ', href: '/faq' },
  ],
};
