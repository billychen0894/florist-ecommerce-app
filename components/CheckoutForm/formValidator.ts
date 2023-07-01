import * as z from 'zod';

const stringRequired = (errorMsg?: string) => {
  return z.string().min(1, { message: errorMsg });
};

const defaultformProps = z
  .object({
    contactEmail: z
      .string()
      .email({ message: 'Your email is invalid' })
      .or(z.literal('')),
    shippingFirstName: stringRequired('Your first name is required').max(50, {
      message: 'Your first name is too long',
    }),
    shippingLastName: stringRequired('Your last name is required').max(50, {
      message: 'Your last name is too long',
    }),
    shippingAddressLine1: stringRequired('Your address is required').max(100, {
      message: 'Your address is too long',
    }),
    shippingAddressLine2: z
      .string()
      .max(50, { message: 'Apartment, suite, etc. is too long' })
      .optional(),
    shippingCompany: z
      .string()
      .max(50, { message: 'Your company name is too long' })
      .optional(),
    shippingCity: stringRequired('Please enter your city').max(20, {
      message: 'Your city name is too long',
    }),
    shippingArea: stringRequired('Please enter your State or Province').max(
      20,
      {
        message: 'Your State or Province name is too long',
      }
    ),
    shippingPostalCode: stringRequired('Please enter your Postal Code').max(7, {
      message: 'Your Postal Code is invalid',
    }),
    shippingCountry: stringRequired('Please enter your Country').max(20, {
      message: 'Your Country name is too long',
    }),
    shippingPhone: stringRequired('Please enter your phone number').max(20, {
      message: 'Your phone number is too long',
    }),
    deliveryMethod: z.union([
      z.literal('delivery', {
        errorMap: () => ({
          message: 'Please select a delivery method',
        }),
      }),
      z.literal('pickup'),
    ]),
    billingSameAsShipping: z.boolean(),
    paymentMethod: z.union([
      z.literal('creditCard', {
        errorMap: () => ({
          message: 'Please select a payment method',
        }),
      }),
      z.literal('paypal'),
    ]),
    creditCardNumber: z
      .string()
      .min(15, { message: 'Your credit card number is invalid' })
      .max(19, { message: 'Your credit card number is invalid' })
      .regex(/^[0-9]*$/, { message: 'Your credit card number is invalid' })
      .or(z.literal('')),
    creditCardName: z
      .string()
      .min(1, { message: 'Your credit card name is required' })
      .max(50, { message: 'Your credit card name is invalid' })
      .regex(/^[a-zA-Z ]*$/, { message: 'Your credit card name is invalid' })
      .or(z.literal('')),
    creditCardExpiry: z
      .string()
      .length(4, { message: 'Your credit card expiry is invalid' })
      .regex(/^[0-9]*$/, { message: 'Your credit card expiry is invalid' })
      .or(z.literal('')),
    creditCardCvc: z
      .string()
      .length(3, { message: 'Your credit card CVC is invalid' })
      .regex(/^[0-9]*$/, { message: 'Your credit card CVC is invalid' })
      .or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod === 'creditCard' && !data.creditCardNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['creditCardNumber'],
        message: 'Please enter your credit card number',
      });
    }

    if (data.paymentMethod === 'creditCard' && !data.creditCardName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['creditCardName'],
        message: 'Please enter your credit card name',
      });
    }

    if (data.paymentMethod === 'creditCard' && !data.creditCardExpiry) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['creditCardExpiry'],
        message: 'Please enter your credit card expiry',
      });
    }

    if (data.paymentMethod === 'creditCard' && !data.creditCardCvc) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['creditCardCvc'],
        message: 'Please enter CVC',
      });
    }

    if (data.contactEmail === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['contactEmail'],
        message: 'Please enter your email',
      });
    }
  });

const billingIsSameAsShippingSchema = z.object({
  billingSameAsShipping: z.literal(true),
});

const billingIsNotSameAsShippingSchema = z.object({
  billingSameAsShipping: z.literal(false),
  billingCompany: stringRequired('Your company name is required').max(50, {
    message: 'Your company name is too long',
  }),
  billingAddressLine1: stringRequired('Your address is required').max(100, {
    message: 'Your address is too long',
  }),
  billingAddressLine2: z
    .string()
    .max(50, { message: 'Apartment, suite, etc. is too long' })
    .optional(),
  billingCity: stringRequired('Please enter your city').max(20, {
    message: 'Your city name is too long',
  }),
  billingArea: stringRequired('Please enter your State or Province').max(20, {
    message: 'Your State or Province name is too long',
  }),
  billingPostalCode: stringRequired('Please enter your Postal Code').max(7, {
    message: 'Your Postal Code is invalid',
  }),
  billingCountry: stringRequired('Please enter your Country').max(20, {
    message: 'Your Country name is too long',
  }),
});

const isCreditCardSchema = z.object({
  paymentMethod: z.literal('creditCard'),
  creditCardNumber: z
    .string()
    .min(15, { message: 'Your credit card number is invalid' })
    .max(19, { message: 'Your credit card number is invalid' })
    .or(z.string().min(1, { message: 'Your credit card number is required' })),
  creditCardName: z
    .string()
    .min(1, { message: 'Your credit card name is required' })
    .max(50, { message: 'Your credit card name is too long' }),
  creditCardExpiry: z
    .string()
    .min(1, { message: 'Your credit card expiry is required' })
    .max(4, { message: 'Your credit card expiry is invalid' }),
  creditCardCvc: z
    .string()
    .min(1, { message: 'Your credit card CVC is required' })
    .max(3, { message: 'Your credit card CVC is invalid' }),
});

const isPaypalSchema = z.object({
  paymentMethod: z.literal('paypal'),
});

// Mark union depends on billingSameAsShipping attribute
const billingSameAsShippingSchemaCond = z.discriminatedUnion(
  'billingSameAsShipping',
  [billingIsSameAsShippingSchema, billingIsNotSameAsShippingSchema]
);
// Mark union depends on paymentMethod attribute
const paymentMethodSchemaCond = z.discriminatedUnion('paymentMethod', [
  isCreditCardSchema,
  isPaypalSchema,
]);

// Intersect with defaultSchema
// export const formSchema = z.intersection(
//   defaultformProps,
//   billingSameAsShippingSchemaCond,
//   paymentMethodSchemaCond
// );

export const formSchema = defaultformProps;

export type FormData = z.infer<typeof formSchema>;
