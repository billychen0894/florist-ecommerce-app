import * as yup from 'yup';

export interface DefaultBillingShippingFormSchemaProps {
  shippingAddressLine1: string;
  shippingAddressLine2?: string;
  shippingCity: string;
  shippingArea: string;
  shippingPostalCode: string;
  shippingCountry: string;
  billingAddressLine1: string;
  billingAddressLine2?: string;
  billingCity: string;
  billingArea: string;
  billingPostalCode: string;
  billingCountry: string;
}

export const defaultBillingShippingFormSchema: yup.ObjectSchema<DefaultBillingShippingFormSchemaProps> =
  yup.object({
    shippingAddressLine1: yup
      .string()
      .required('Your address is required')
      .max(100, 'Your address is too long'),
    shippingAddressLine2: yup.string().defined(),
    shippingCity: yup
      .string()
      .required('Please enter your city')
      .max(20, 'Your city name is too long'),
    shippingArea: yup
      .string()
      .required('Please enter your State or Province')
      .max(20, 'Your State or Province name is too long'),
    // Regex Postal Code for Canada Only
    shippingPostalCode: yup
      .string()
      .required('Please enter your Postal Code')
      .max(7, 'Your Postal Code is invalid')
      .matches(
        /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
        'Your Postal Code is invalid'
      ),
    shippingCountry: yup
      .string()
      .required('Please enter your Country')
      .max(20, 'Your Country name is too long'),
    billingAddressLine1: yup
      .string()
      .required('Your address is required')
      .max(100, 'Your address is too long'),
    billingAddressLine2: yup.string().defined(),
    billingCity: yup
      .string()
      .required('Please enter your city')
      .max(20, 'Your city name is too long'),
    billingArea: yup
      .string()
      .required('Please enter your State or Province')
      .max(20, 'Your State or Province name is too long'),
    billingPostalCode: yup
      .string()
      .required('Please enter your Postal Code')
      .max(7, 'Your Postal Code is invalid')
      .matches(
        /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
        'Your Postal Code is invalid'
      ),
    billingCountry: yup
      .string()
      .required('Please enter your Country')
      .max(20, 'Your Country name is too long'),
  });

export type BillingShippingFormSchema = yup.InferType<
  typeof defaultBillingShippingFormSchema
>;
