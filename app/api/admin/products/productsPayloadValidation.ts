import * as yup from 'yup';

export const productsPayloadSchema = yup.object().shape({
  name: yup.string().required('Product name is required'),
  description: yup
    .string()
    .required('Description is required.')
    .max(255, 'Description is too long'),
  price: yup
    .number()
    .min(1, 'Price cannot be 0')
    .positive('Price must be a positive number')
    .required('Price is required'),
  images: yup
    .object()
    .shape({
      existingImages: yup
        .array()
        .of(
          yup
            .string()
            .min(1, 'Product should at least have one image')
            .defined()
        )
        .required('Product images are required'),
      newImages: yup
        .array()
        .of(yup.object())
        .required('Product images are required'),
    })
    .test(
      'fileLength',
      'Maximum of 4 uploads',
      (value) => value.existingImages.length + value.newImages.length <= 4
    )
    .test(
      'minFileLength',
      'Product requires at least one image',
      (value) => value.existingImages.length + value.newImages.length >= 1
    )
    .required('Product images are required'),
  categories: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required('Category name is required'),
      })
    )
    .min(1, 'Product should have at least one category')
    .required('Product categories is required'),
  units: yup
    .number()
    .test(
      'is-positive',
      'Units must be a positive number',
      (value: any) => value >= 0
    )
    .required('Units is required.'),
  inStock: yup.boolean().required('Product inStock is required'),
  leadTime: yup.string().required('Lead time is required'),
  productDetail: yup
    .object()
    .shape({
      productDetailItems: yup
        .array()
        .of(
          yup.object().shape({
            productDetailItemName: yup
              .string()
              .required('Product detail item name is required'),
            items: yup
              .array()
              .of(yup.string())
              .min(1, 'Each Product detail should at least have one item')
              .required('Product detail item is required'),
          })
        )
        .required('Product detail items is required'),
    })
    .required('Product detail is required'),
});
