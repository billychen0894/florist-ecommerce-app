import { OrderItem } from './types/api';

export function getCartItemsFromLocalStorage(): OrderItem[] {
  const cartItemsStr = localStorage.getItem('cartItems');

  if (cartItemsStr) {
    const cartItem: OrderItem[] = JSON.parse(cartItemsStr);
    return cartItem;
  }
  return [];
}
