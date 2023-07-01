export interface PaymentMethod {
  id: string;
  title: string;
}

export const paymentMethods: PaymentMethod[] = [
  { id: 'creditCard', title: 'Credit card' },
  { id: 'paypal', title: 'PayPal' },
];
