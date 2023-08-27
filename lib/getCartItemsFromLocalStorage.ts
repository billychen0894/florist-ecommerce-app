import { OrderItem } from './types/api';

export function getCartItemsFromLocalStorage(): OrderItem[] {
  const cartItemsStr = localStorage.getItem('cartItems');

  // check cachedCartItems from localStorage if exists
  // the life for cachedCartItems only lives for 3 days
  if (cartItemsStr) {
    const cartItems: {
      cartItems: OrderItem[];
      createdAt: number;
    } = JSON.parse(cartItemsStr);
    const threeDaysInMillis = 3 * 24 * 60 * 60 * 1000;
    const currentTime = new Date().getTime();
    if (currentTime - cartItems.createdAt >= threeDaysInMillis) {
      localStorage.removeItem('cartItems');
    }
    return cartItems.cartItems;
  }
  return [];
}
