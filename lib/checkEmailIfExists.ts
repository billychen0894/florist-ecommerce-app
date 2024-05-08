import { validateEmail } from '@/actions/emailActions';
import { asyncCacheTest } from './asyncCacheTest';

export const checkEmailIfExists = asyncCacheTest(
  (value: string) =>
    new Promise((resolve) => {
      const result = validateEmail(value)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          console.error('Error while validating email:', error);
          resolve(false);
        });
      return result;
    })
);
