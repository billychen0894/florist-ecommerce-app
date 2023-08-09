export const getBillingValue = (key: any, formData: any) => {
  if (formData.billingSameAsShipping) {
    return formData[`shipping${key}`];
  } else {
    return formData[`billing${key}`];
  }
};
