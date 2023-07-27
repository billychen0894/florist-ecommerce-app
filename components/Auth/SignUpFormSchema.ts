import * as yup from 'yup';

// Override default email regex
yup.addMethod(yup.string, 'email', function validateEmail(message) {
  return this.matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message,
    excludeEmptyString: true,
  });
});

export const signUpFormSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('Your first name is required')
    .max(50, 'Your first name is too long'),
  lastName: yup
    .string()
    .required('Your last name is required')
    .max(50, 'Your last name is too long'),
  // If the email validation fails inside the test method, it will throw validationError, which prevents calling the API in every keystroke (deboucing)
  // source from this github issue: https://github.com/jquense/yup/issues/256
  email: yup
    .string()
    .required('Your email is required')
    .test('unique-email', 'This email is already registered', async (value) => {
      try {
        await yup
          .object({
            email: yup
              .string()
              .email('Invalid email address')
              .required('Your email is required'),
          })
          .validate({ email: value });

        const result = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/emailValidation/${value}`
        );

        return result.status === 200;
      } catch (error) {
        return false;
      }
    }),

  // password must contain at least 8 characters, at least one uppercase letter, one lowercase letter, one number
  password: yup
    .string()
    .required('Your password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      'Password must contain at least one uppercase and lowercase letter, and one number'
    ),
  // confirm password must match password
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .test('passwords-match', 'Passwords must match', function (value) {
      return this.parent.password === value;
    }),
});

export type SignUpFormData = yup.InferType<typeof signUpFormSchema>;
