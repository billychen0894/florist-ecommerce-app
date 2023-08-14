import * as yup from 'yup';

// Override default email regex
yup.addMethod(yup.string, 'email', function validateEmail(message) {
  return this.matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message,
    excludeEmptyString: true,
  });
});

export const ordersPayloadSchema = yup.object().shape({
  contactEmail: yup.string().email().required('Contact email is required'),
  contactPhone: yup
    .string()
    .max(20, 'Phone Number cannot exceed 20 charaters long')
    .matches(
      /^(\+?1[ -]?)?\(?([0-9]{3})\)?[ -]?([0-9]{3})[ -]?([0-9]{4})$/,
      'Your phone number is invalid'
    )
    .required('Contact phone is required'),
  orderStatus: yup.string().required('Order status is required'),
  shippingAddress: yup.object().shape({
    addressLine1: yup.string().required('Address is required'),
    addressLine2: yup.string().notRequired(),
    company: yup.string().notRequired(),
    city: yup.string().required('City is required'),
    stateOrProvince: yup.string().required('State or Province is required'),
    country: yup.string().required('Country is required'),
    postalCode: yup.string().required('Postal Code is required'),
  }),
});
