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
  deliveryMethod: string;
  billingSameAsShipping?: string;
  billingCompany?: string;
  billingAddressLine1?: string;
  billingAddressLine2?: string;
  billingCity?: string;
  billingArea?: string;
  billingPostalCode?: string;
  billingCountry?: string;
  paymentMethod: string;
  creditCardNumber?: string;
  creditCardName?: string;
  creditCardExpiry?: string;
  creditCardCvc?: string;
}
