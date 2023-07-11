export interface CheckoutFormValues {
  contactEmail: string;
  shippingFirstName: string;
  shippingLastName: string;
  shippingAddressLine1: string;
  shippingAddressLine2?: string;
  shippingCompany?: string;
  shippingCity: string;
  shippingArea: string;
  shippingPostalCode: string;
  shippingCountry: string;
  shippingPhone: string;
  deliveryMethod: 'delivery' | 'pickup';
  billingSameAsShipping?: boolean;
  billingCompany?: string;
  billingAddressLine1?: string;
  billingAddressLine2?: string;
  billingCity?: string;
  billingArea?: string;
  billingPostalCode?: string;
  billingCountry?: string;
  paymentMethod: 'creditCard' | 'paypal';
  creditCardNumber?: string;
  creditCardName?: string;
  creditCardExpiry?: string;
  creditCardCvc?: string;
}
