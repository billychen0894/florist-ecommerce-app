import { z } from 'zod';

const MAX_UPLOAD_SIZE = 1024 * 1024; // 1MB
const MAX_UPLOAD_PRODUCTS_SIZE = 1024 * 1024 * 10; // 10MB
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

export const productDetailsFormSchema = z.object({
  name: z.string().min(1, { message: 'Product name is required' }),
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(255, { message: 'Description is too long' }),
  price: z.coerce
    .number()
    .min(0.01, { message: 'Price is required' })
    .positive({ message: 'Price must be a positive number' }),
  images: z
    .object({
      existingImages: z.array(
        z.object({
          url: z.string(),
          publicId: z.string().nullable(),
        })
      ),
      newImages: z.array(z.any()).superRefine((val, ctx) => {
        const totalSize = val.reduce(
          (acc: number = 0, file: File) => acc + file.size,
          0
        );
        const fileTypes = val.map((file: File) => file.type);

        if (totalSize > MAX_UPLOAD_PRODUCTS_SIZE) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Total upload size exceeds the maximum limit of 10MB.',
          });
        }

        // if (fileTypes.some((type) => !ALLOWED_FILE_TYPES.includes(type))) {
        //   ctx.addIssue({
        //     code: z.ZodIssueCode.custom,
        //     message: 'Invalid file type. Only JPG, JPEG, and PNG are allowed.',
        //   });
        // }
      }),
    })
    .refine(
      (value) => {
        return value.existingImages.length + value?.newImages?.length > 0;
      },
      { message: 'Product should at least have one image' }
    )
    .refine(
      (value) => {
        return value.existingImages.length + value?.newImages?.length <= 4;
      },
      { message: 'Maximum of 4 uploads' }
    ),
  categories: z.array(z.object({ name: z.string() })).min(1, {
    message: 'Product should belong to at least one category',
  }),
  units: z.coerce
    .number()
    .min(1, { message: 'Product must have at least one unit' })
    .positive({ message: 'Product must have at least one unit' }),
  inStock: z.boolean(),
  leadTime: z.string(),
  productDetail: z.object({
    productDetailItems: z.array(
      z.object({
        productDetailItemName: z.string(),
        items: z.array(z.string()).min(1, {
          message: 'Product detail item should have at least one item',
        }),
      })
    ),
  }),
  selectedProductId: z.string(),
});

export type ProductDetailsFormSchema = z.infer<typeof productDetailsFormSchema>;

export const signUpFormSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: 'First name is required' })
      .max(50, { message: 'First name is too long' }),
    lastName: z
      .string()
      .min(2, { message: 'Last name is required' })
      .max(50, { message: 'Last name is too long' }),
    email: z
      .string()
      .email({ message: 'Invalid email address' })
      .max(255, { message: 'Email is too long' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .max(255, { message: 'Password is too long' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignUpFormSchema = z.infer<typeof signUpFormSchema>;

export const signInFormSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password is required' }),
});

export type SignInFormSchema = z.infer<typeof signInFormSchema>;
