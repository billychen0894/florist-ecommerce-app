import * as yup from 'yup';

// Define a custom validation function for file type
const validateFileType = (file: any) => {
  if (!file) return true; // If no file is selected, it's valid (optional)
  const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];

  return allowedFileTypes.includes(file.type);
};

// Define a custom validation function for file size (1MB = 1024 * 1024 bytes)
const validateFileSize = (file: any) => {
  if (!file) return true; // If no file is selected, it's valid (optional)

  const maxSizeBytes = 1024 * 1024; // 1MB

  return file.size <= maxSizeBytes;
};

export interface DefaultPersonalInfoFormSchemaProps {
  firstName?: string;
  lastName?: string;
  contactPhone?: string;
  imageFile?: {} | null | undefined;
}

export const defaultPersonalInfoFormSchema: yup.ObjectSchema<DefaultPersonalInfoFormSchemaProps> =
  yup.object({
    firstName: yup
      .string()
      .max(50, 'First name cannot exceed 50 characters.')
      .optional(),
    lastName: yup
      .string()
      .max(50, 'Last name cannot exceed 50 characters.')
      .optional(),
    contactPhone: yup
      .string()
      .max(20, 'Your phone number cannot exceed 20 characters.')
      .matches(
        /^(?:(?:\+1[ -]?)?(?:\(\d{3}\)|\d{3})[ -]?\d{3}[ -]?\d{4})?$/,
        'Your phone number is invalid'
      )
      .optional(),
    imageFile: yup
      .mixed()
      .test(
        'fileType',
        'Invalid file type. Only JPG, JPEG, and PNG are allowed.',
        validateFileType
      )
      .test(
        'fileSize',
        'File size exceeds the maximum limit of 1MB.',
        validateFileSize
      )
      .nullable()
      .optional(),
  });

export type PersonalInfoFormSchema = yup.InferType<
  typeof defaultPersonalInfoFormSchema
>;
