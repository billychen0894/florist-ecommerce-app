import * as yup from 'yup';

export const productsPayloadSchema = yup.object().shape({
  name: yup.string().required('Product name is required'),
  description: yup.string().required('Product description is required'),
  price: yup
    .number()
    .required('Product price is required')
    .min(1, 'Product price must be greater than 0'),
  images: yup
    .array()
    .of(
      yup.object().shape({
        url: yup.string().required('Image url is required'),
        name: yup.string().required('Image name is required'),
        alt: yup.string().required('Image alt is required'),
      })
    )
    .min(1, 'Product must have at least 1 image'),
  inStock: yup.boolean().required('Product inStock is required'),
  leadTime: yup.string().required('Product leadTime is required'),
  categories: yup
    .array()
    .of(
      yup
        .object()
        .shape({ name: yup.string().required('Category name is required') })
    )
    .required('Product categories is required'),
  productDetail: yup.object().shape({
    productDetailItems: yup
      .array()
      .of(
        yup.object().shape({
          productDetailItemName: yup
            .string()
            .required('Product detail item name is required'),
          items: yup
            .array()
            .of(yup.string().required('Product detail item is required')),
        })
      )
      .required('Product detail items is required'),
  }),
});
