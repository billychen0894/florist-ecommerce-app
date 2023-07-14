// Ref: https://stackoverflow.com/questions/71806792/yup-run-async-validation-test-only-on-value-change
// This is mainly implemented to prevent calling the API if the value is the same as the previous value
export const asyncCacheTest = (
  asyncValidate: (val: string) => Promise<boolean>
) => {
  let _valid = false;
  let _value = '';

  return async (value: string) => {
    if (value !== _value) {
      const response = await asyncValidate(value);
      _value = value;
      _valid = response as boolean;
      return response as boolean;
    }
    return _valid;
  };
};
