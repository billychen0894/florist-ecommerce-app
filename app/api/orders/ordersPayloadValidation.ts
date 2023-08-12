import { defaultformProps } from '@components/CheckoutForm/formValidator';
import * as yup from 'yup';

export const orderPurchaserSchema = yup.object().shape({
  isGuestCheckout: yup.boolean().required('isGuestCheckout is required'),
  userId: yup.string().when('isGuestCheckout', {
    is: false,
    then: (schema) =>
      schema.uuid('UserId must be uuid format').required('UserId is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export const orderFormDataSchema =
  defaultformProps.concat(orderPurchaserSchema);

export const orderSummarySchema = yup.object().shape({
  total: yup.number().required('Total is required'),
  discountCoupon: yup
    .object()
    .shape({
      id: yup
        .string()
        .uuid('DiscountCouponId must be uuid format')
        .required('DiscountCouponId is required'),
      code: yup.string().required('DiscountCouponCode is required'),
      description: yup
        .string()
        .required('DiscountCouponDescription is required'),
      discount: yup.number().required('DiscountCouponDiscount is required'),
      expiresAt: yup.date().required('DiscountCouponExpiresAt is required'),
      numberOfRedemptions: yup
        .number()
        .required('NumberOfRedemptions is required')
        .min(1, 'NumberOfRedemptions must be greater than 0'),
    })
    .notRequired(),
  orderItems: yup
    .array()
    .of(
      yup
        .object()
        .shape({
          productId: yup
            .string()
            .uuid('ProductId must be uuid format')
            .required('ProductId is required'),
          quantity: yup.number().required('Quantity is required'),
        })
        .required('OrderItem is required')
    )
    .required('OrderItems is required'),
});
