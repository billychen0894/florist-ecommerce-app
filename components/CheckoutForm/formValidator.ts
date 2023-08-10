import * as yup from 'yup';
import { CheckoutFormValues } from './checkout.type';

export const stringRequired = (errorMsg?: string) => {
  return yup.string().required(errorMsg || 'This field is required');
};
// Override default email regex
yup.addMethod(yup.string, 'email', function validateEmail(message) {
  return this.matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message,
    excludeEmptyString: true,
  });
});

export const defaultformProps: yup.ObjectSchema<CheckoutFormValues> =
  yup.object({
    contactEmail: yup
      .string()
      .email('Your email is invalid')
      .required('Your email is required'),
    shippingFirstName: stringRequired('Your first name is required').max(
      50,
      'Your first name is too long'
    ),
    shippingLastName: stringRequired('Your last name is required').max(
      50,
      'Your last name is too long'
    ),
    shippingAddressLine1: stringRequired('Your address is required').max(
      100,
      'Your address is too long'
    ),
    shippingAddressLine2: yup.string().defined(),
    shippingCompany: yup
      .string()
      .max(50, 'Your company name is too long')
      .defined(),
    shippingCity: stringRequired('Please enter your city').max(
      20,
      'Your city name is too long'
    ),
    shippingArea: stringRequired('Please enter your State or Province').max(
      20,
      'Your State or Province name is too long'
    ),
    // Regex Postal Code for Canada Only
    shippingPostalCode: stringRequired('Please enter your Postal Code')
      .max(7, 'Your Postal Code is invalid')
      .matches(
        /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
        'Your Postal Code is invalid'
      ),
    shippingCountry: stringRequired('Please enter your Country').max(
      20,
      'Your Country name is too long'
    ),
    // Regex Phone Number for Canada Only
    shippingPhone: stringRequired('Please enter your phone number')
      .max(20, 'Your phone number is too long')
      .matches(
        /^(\+?1[ -]?)?\(?([0-9]{3})\)?[ -]?([0-9]{3})[ -]?([0-9]{4})$/,
        'Your phone number is invalid'
      ),
    deliveryMethod: yup
      .string()
      .oneOf(['Delivery', 'Pick up'])
      .required('Please select a delivery method'),
    billingSameAsShipping: yup.boolean().defined('Please select an option'),
    paymentMethod: yup
      .string()
      .oneOf(['creditCard', 'paypal'])
      .required('Please select a payment method'),
    creditCardNumber: yup.string().when('paymentMethod', {
      is: 'creditCard',
      then: (schema) =>
        schema
          .required('Your credit card number is required')
          .min(15, 'Your credit card number is invalid')
          .max(19, 'Your credit card number is invalid')
          .matches(/^[0-9]*$/, 'Your credit card number is invalid'),
      otherwise: (schema) => schema.optional(),
    }),
    creditCardName: yup.string().when('paymentMethod', {
      is: 'creditCard',
      then: (schema) =>
        schema
          .required('Your credit card name is required')
          .min(1, 'Your credit card name is required')
          .max(50, 'Your credit card name is invalid')
          .matches(/^[a-zA-Z ]*$/, 'Your credit card name is invalid'),
      otherwise: (schema) => schema.defined(),
    }),
    creditCardExpiry: yup.string().when('paymentMethod', {
      is: 'creditCard',
      then: (schema) =>
        schema
          .required('Your credit card expiry is required')
          .length(4, 'Your credit card expiry is invalid')
          .matches(/^[0-9]*$/, 'Your credit card expiry is invalid'),
      otherwise: (schema) => schema.defined(),
    }),
    creditCardCvc: yup.string().when('paymentMethod', {
      is: 'creditCard',
      then: (schema) =>
        schema
          .required('Your credit card CVC is required')
          .length(3, 'Your credit card CVC is invalid')
          .matches(/^[0-9]*$/, 'Your credit card CVC is invalid'),
      otherwise: (schema) => schema.defined(),
    }),
    billingAddressLine1: yup.string().when('billingSameAsShipping', {
      is: false,
      then: (schema) =>
        schema
          .required('Your address is required')
          .max(100, 'Your address is too long'),
      otherwise: (schema) => schema.defined(),
    }),
    billingAddressLine2: yup.string().when('billingSameAsShipping', {
      is: false,
      then: (schema) =>
        schema.max(50, 'Apartment, suite, etc. is too long').defined(),
      otherwise: (schema) => schema.defined(),
    }),
    billingCompany: yup.string().when('billingSameAsShipping', {
      is: false,
      then: (schema) =>
        schema.max(50, 'Your company name is too long').defined(),
      otherwise: (schema) => schema.defined(),
    }),
    billingCity: yup.string().when('billingSameAsShipping', {
      is: false,
      then: (schema) =>
        schema
          .required('Please enter your city')
          .max(20, 'Your city name is too long'),
      otherwise: (schema) => schema.defined(),
    }),
    billingArea: yup.string().when('billingSameAsShipping', {
      is: false,
      then: (schema) =>
        schema
          .required('Please enter your State or Province')
          .max(20, 'Your State or Province name is too long'),
      otherwise: (schema) => schema.defined(),
    }),
    billingPostalCode: yup.string().when('billingSameAsShipping', {
      is: false,
      then: (schema) =>
        schema
          .required('Please enter your Postal Code')
          .max(7, 'Your Postal Code is invalid')
          .matches(
            /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
            'Your Postal Code is invalid'
          ),
      otherwise: (schema) => schema.defined(),
    }),
    billingCountry: yup.string().when('billingSameAsShipping', {
      is: false,
      then: (schema) =>
        schema
          .required('Please enter your Country')
          .max(20, 'Your Country name is too long'),
      otherwise: (schema) => schema.defined(),
    }),
  });

export const formSchema = defaultformProps;

export type FormData = yup.InferType<typeof formSchema>;
