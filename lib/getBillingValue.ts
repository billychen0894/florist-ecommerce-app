export const getBillingValue = (key: any, formData: any) => {
  if (formData.billingSameAsShipping) {
    return formData[`shipping${key}`];
  } else {
    return formData[`billing${key}`];
  }
};

export const getBillingValues = (formData: any) => {
  const billingAddressLine1 = getBillingValue('AddressLine1', formData);
  const billingAddressLine2 = getBillingValue('AddressLine2', formData);
  const billingCompany = getBillingValue('Company', formData);
  const billingCity = getBillingValue('City', formData);
  const billingArea = getBillingValue('Area', formData);
  const billingCountry = getBillingValue('Country', formData);
  const billingPostalCode = getBillingValue('PostalCode', formData);
  return {
    billingAddressLine1,
    billingAddressLine2,
    billingCompany,
    billingCity,
    billingArea,
    billingCountry,
    billingPostalCode,
  };
};
