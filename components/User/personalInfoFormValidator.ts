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
  firstName: string;
  lastName: string;
  contactPhone: string;
  imageFile?: {} | null | undefined;
}

export const defaultPersonalInfoFormSchema: yup.ObjectSchema<DefaultPersonalInfoFormSchemaProps> =
  yup.object({
    firstName: yup
      .string()
      .required('First name is required')
      .max(50, 'First name cannot exceed 50 characters.'),
    lastName: yup
      .string()
      .required('Last name is required')
      .max(50, 'Last name cannot exceed 50 characters.'),
    contactPhone: yup
      .string()
      .required('Please enter your phone number')
      .max(20, 'Your phone number cannot exceed 20 characters.')
      .matches(
        /^(\+?1[ -]?)?\(?([0-9]{3})\)?[ -]?([0-9]{3})[ -]?([0-9]{4})$/,
        'Your phone number is invalid'
      ),
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
      .nullable(),
  });

export type PersonalInfoFormSchema = yup.InferType<
  typeof defaultPersonalInfoFormSchema
>;
