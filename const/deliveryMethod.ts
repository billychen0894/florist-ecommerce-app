export interface DeliveryMethod {
  title: string;
  value: string;
  turnaround?: string;
  price?: string;
  location?: string;
  locationOperation?: string;
}

export const deliveryMethods: DeliveryMethod[] = [
  {
    title: 'Delivery',
    value: 'delivery',
    turnaround: '4–10 business days',
    price: '$5.00',
  },
  {
    title: 'Pick up',
    value: 'pickup',
    location: '1139 Davie Street, Vancouver BC',
    locationOperation: 'Open 7 days a week ',
  },
];
