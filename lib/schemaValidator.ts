import { z } from 'zod';

const MAX_UPLOAD_SIZE = 1024 * 1024; // 1MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

export const personalInfoFormSchema = z.object({
  userId: z.string(),
  firstName: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters.' })
    .max(50, { message: 'First name cannot exceed 50 characters.' }),
  lastName: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters.' })
    .max(50, { message: 'Last name cannot exceed 50 characters.' }),
  contactPhone: z
    .string()
    .max(20, { message: 'Your phone number cannot exceed 20 characters.' })
    .regex(/^(?:(?:\+1[ -]?)?(?:\(\d{3}\)|\d{3})[ -]?\d{3}[ -]?\d{4})?$/, {
      message: 'Your phone number is invalid',
    }),
  imageFile: z
    .any()
    .optional()
    .nullable()
    .refine(
      (file: File) => {
        if (file.size === 0 || typeof file === 'string') return true; // If no file is selected, it's valid (optional)
        return file.size <= MAX_UPLOAD_SIZE;
      },
      { message: 'File size exceeds the maximum limit of 1MB.' }
    )
    .refine(
      (file: File) => {
        if (file.size === 0 || typeof file === 'string') return true; // If no file is selected, it's valid (optional)
        return ALLOWED_FILE_TYPES.includes(file.type);
      },
      { message: 'Invalid file type. Only JPG, JPEG, and PNG are allowed.' }
    ),
  stripeCustomerId: z.string().optional(),
});

export type PersonalInfoFormSchema = z.infer<typeof personalInfoFormSchema>;

export const billingShippingFormSchema = z.object({
  shippingAddressLine1: z
    .string()
    .min(1, { message: 'Your address is required' })
    .max(100, { message: 'Your address is too long' }),
  shippingAddressLine2: z.string().optional(),
  shippingCity: z
    .string()
    .min(1, { message: 'Please enter your city' })
    .max(20, { message: 'Your city name is too long' }),
  shippingArea: z
    .string()
    .min(1, { message: 'Please enter your State or Province' })
    .max(20, { message: 'Your State or Province name is too long' }),
  shippingPostalCode: z
    .string()
    .min(1, { message: 'Please enter your Postal Code' })
    .max(7, { message: 'Your Postal Code is invalid' })
    .regex(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, {
      message: 'Your Postal Code is invalid',
    }),
  shippingCountry: z
    .string()
    .min(1, { message: 'Please enter your Country' })
    .max(20, { message: 'Your Country name is too long' }),
  billingAddressLine1: z
    .string()
    .min(1, { message: 'Your address is required' })
    .max(100, { message: 'Your address is too long' }),
  billingAddressLine2: z.string().optional(),
  billingCity: z
    .string()
    .min(1, { message: 'Please enter your city' })
    .max(20, { message: 'Your city name is too long' }),
  billingArea: z
    .string()
    .min(1, { message: 'Please enter your State or Province' })
    .max(20, { message: 'Your State or Province name is too long' }),
  billingPostalCode: z
    .string()
    .min(1, { message: 'Please enter your Postal Code' })
    .max(7, { message: 'Your Postal Code is invalid' })
    .regex(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, {
      message: 'Your Postal Code is invalid',
    }),
  billingCountry: z
    .string()
    .min(1, { message: 'Please enter your Country' })
    .max(20, { message: 'Your Country name is too long' }),
});

export type BillingShippingFormSchema = z.infer<
  typeof billingShippingFormSchema
>;

export const invoiceEditFormSchema = z.object({
  stripeInvoiceId: z.string(),
  orderStatus: z.enum(['CREATED', 'PROCESSING', 'COMPLETED', 'CANCELLED']),
});
export type InvoiceEditFormSchema = z.infer<typeof invoiceEditFormSchema>;
