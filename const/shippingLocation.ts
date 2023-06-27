export interface ShippingLocation {
  id: string;
  country: string;
  stateOrProvince: { name: string; value: string }[];
}

// ShippingLocation for Canada
export const shippingLocations: ShippingLocation[] = [
  {
    id: 'CA',
    country: 'Canada',
    stateOrProvince: [
      { name: 'Alberta', value: 'AB' },
      { name: 'British Columbia', value: 'BC' },
      { name: 'Manitoba', value: 'MB' },
      { name: 'New Brunswick', value: 'NB' },
      { name: 'Newfoundland and Labrador', value: 'NL' },
      { name: 'Northwest Territories', value: 'NT' },
      { name: 'Nova Scotia', value: 'NS' },
      { name: 'Nunavut', value: 'NU' },
      { name: 'Ontario', value: 'ON' },
      { name: 'Prince Edward Island', value: 'PE' },
      { name: 'Quebec', value: 'QC' },
      { name: 'Saskatchewan', value: 'SK' },
      { name: 'Yukon', value: 'YT' },
    ],
  },
];
