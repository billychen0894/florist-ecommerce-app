import * as yup from 'yup';
import {
  Category,
  Product,
  ProductDetail,
  ProductDetailItem,
} from '@prisma/client';

type OmittedProduct = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
type OmittedCategory = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;
type OmittedProductDetail = Omit<
  ProductDetail,
  'id' | 'createdAt' | 'updatedAt' | 'productId'
>;
type OmittedProductDetailItem = Omit<
  ProductDetailItem,
  'id' | 'createdAt' | 'updatedAt' | 'productDetailId'
>;

type OmittedTProduct = OmittedProduct & {
  categories: OmittedCategory[];
} & {
  productDetail: OmittedProductDetail & {
    productDetailItems: OmittedProductDetailItem[];
  };
} & {
  images: {};
};

export const defaultProductDetailsFromSchema: yup.ObjectSchema<OmittedTProduct> =
  yup.object().shape({
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
      .mixed()
      .test(
        'fileLength',
        'Maximum of 4 image files can be uploaded',
        (files: any) => {
          return !!(
            files && files.existingImages.length + files.newImages.length <= 4
          );
        }
      )
      .required('Product should have at least one image'),
    categories: yup
      .array()
      .of(
        yup.object().shape({
          name: yup.string().required('Category name is required'),
        })
      )
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
                .of(yup.string().required('Product detail item is required'))
                .required('Product detail item is required'),
            })
          )
          .required('Product detail items is required'),
      })
      .required('Product detail is required'),
  });

export type ProductDetailsFormSchema = yup.InferType<
  typeof defaultProductDetailsFromSchema
>;
