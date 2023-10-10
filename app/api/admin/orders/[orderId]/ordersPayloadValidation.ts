import * as yup from 'yup';

export const ordersPayloadSchema = yup.object().shape({
  orderStatus: yup.string().required('Order status is required'),
});
