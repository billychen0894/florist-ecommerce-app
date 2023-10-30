import * as yup from 'yup';
import { Category, Product, ProductDetail } from '@prisma/client';

type OmittedProduct = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
type OmittedCategory = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;
type OmittedProductDetail = Omit<
  ProductDetail,
  'id' | 'createdAt' | 'updatedAt' | 'productId'
>;

type TProductDetailItem = {
  productDetailItemName: string;
  items: (string | undefined)[];
};

type OmittedTProduct = OmittedProduct & {
  categories: OmittedCategory[];
} & {
  productDetail: OmittedProductDetail & {
    productDetailItems: TProductDetailItem[];
  };
} & {
  images: {
    existingImages: string[];
    newImages: File[];
  };
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
          .of(
            yup
              .mixed<File>()
              .defined()
              .test(
                'is-File',
                'This is not a correct file type',
                (file) => file instanceof File
              )
          )
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
      .test('FileSize', 'Image files cannot excceed 10MB', (value) => {
        const maxFileSize = 1024 * 1024 * 10;
        const currentFileSize = value.newImages.reduce((prev, curr) => {
          return prev + curr.size;
        }, 0);
        return currentFileSize <= maxFileSize;
      })
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

export type ProductDetailsFormSchema = yup.InferType<
  typeof defaultProductDetailsFromSchema
>;
