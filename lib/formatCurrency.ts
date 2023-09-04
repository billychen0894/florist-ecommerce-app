export function formatCurrency(
  price: number,
  locale: string,
  currencyCode: string,
  isDecimal: boolean = false
): string {
  const currencyFormatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: isDecimal ? 2 : 0,
  });
  const formattedPrice = currencyFormatter.format(price);
  return `${formattedPrice} ${currencyCode}`;
}
