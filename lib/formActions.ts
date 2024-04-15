'use server';

import { imageUpload } from '@actions/imageUpload';
import {
  billingShippingFormSchema,
  invoiceEditFormSchema,
  personalInfoFormSchema,
  productDetailsFormSchema,
  signUpFormSchema,
} from './schemaValidator';
import {
  createStripeCustomer,
  updateStripeCustomer,
} from '@actions/stripeCustomer';
import { createUser, updateUser } from '@actions/userActions';
import { revalidatePath } from 'next/cache';
import {
  ImageUploadResult,
  ProductReqPayload,
  UserWithoutPass,
} from './types/types';
import { options } from '@app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import {
  updateOrderByStripeId,
  updateProductById,
} from '@actions/adminActions';
import { getProductById } from '@actions/productsActions';
import { preprocessFormData } from './preprocessFormData';

export type FormState = {
  success: boolean;
  message: string;
  errors?: string[];
};

export async function onSubmitPersonalInfoForm(
  data: FormData
): Promise<FormState> {
  try {
    const formData = Object.fromEntries(data);
    const parsedData = personalInfoFormSchema.safeParse(formData);
    const session = await getServerSession(options);
    if (!session || session?.user?.role !== 'user')
      throw new Error('Unauthorized');

    if (!parsedData.success) {
      return {
        success: false,
        message: 'Form submission failed',
        errors: parsedData.error.issues.map((issue) => issue.message),
      };
    }

    const {
      firstName,
      lastName,
      contactPhone,
      stripeCustomerId,
      imageFile,
      userId,
    } = parsedData.data;

    let uploadResult: ImageUploadResult | undefined;
    if (imageFile && imageFile.size > 0) {
      uploadResult = await imageUpload(imageFile);
    }

    if (!stripeCustomerId) {
      const promises = [
        await createStripeCustomer({
          name: `${firstName} ${lastName}`,
          phone: contactPhone,
        }),

        await updateUser(
          {
            name: `${firstName} ${lastName}`,
            phone: contactPhone,
            image: uploadResult?.url || '',
            cloudinaryPublicId: uploadResult?.publicId || '',
          },
          userId
        ),
      ];

      await Promise.all(promises);
    } else {
      const promises = [
        await updateStripeCustomer(stripeCustomerId, {
          name: `${firstName} ${lastName}`,
          phone: contactPhone,
        }),

        await updateUser(
          {
            name: `${firstName} ${lastName}`,
            phone: contactPhone,
            image: uploadResult?.url || '',
            cloudinaryPublicId: uploadResult?.publicId || '',
          },
          userId
        ),
      ];

      await Promise.all(promises);
    }

    revalidatePath('(store)/user');
    return {
      success: true,
      message: 'Form submitted successfully',
    };
  } catch (error: any) {
    console.error('Form submission error: ', error);
    return {
      success: false,
      message: 'Form submission failed',
    };
  }
}

export async function onSubmitBillingShippingForm(
  data: FormData,
  user: UserWithoutPass
): Promise<FormState> {
  const parsedData = billingShippingFormSchema.safeParse(
    Object.fromEntries(data)
  );
  try {
    if (!user) throw new Error('User object is missing');
    const session = await getServerSession(options);
    if (!session || session?.user?.id !== user.id)
      throw new Error('Unauthorized');

    if (!parsedData.success) {
      return {
        success: false,
        message: 'Form submission failed',
        errors: parsedData.error.issues.map((issue) => issue.message),
      };
    }

    const userInfo = {
      address: {
        city: parsedData.data.billingCity,
        country: parsedData.data.billingCountry,
        line1: parsedData.data.billingAddressLine1,
        line2: parsedData.data.billingAddressLine2,
        postal_code: parsedData.data.billingPostalCode,
        state: parsedData.data.billingArea,
      },
      shipping: {
        address: {
          city: parsedData.data.shippingCity,
          country: parsedData.data.shippingCountry,
          line1: parsedData.data.shippingAddressLine1,
          line2: parsedData.data.shippingAddressLine2,
          postal_code: parsedData.data.shippingPostalCode,
          state: parsedData.data.shippingArea,
        },
        name: user.name,
        phone: user.phone,
      },
    };

    if (user.stripeCustomerId) {
      await updateStripeCustomer(user.stripeCustomerId, userInfo);
    }

    const stripeCustomerId = await createStripeCustomer(userInfo);

    if (!stripeCustomerId) {
      throw new Error('Stripe customer creation failed');
    }

    const result = await updateUser({ stripeCustomerId }, user.id);

    if (!result) {
      throw new Error('User update failed');
    }

    revalidatePath('(store)/user');
    return {
      success: true,
      message: 'Form submitted successfully',
    };
  } catch (error: any) {
    console.error('Form submission error: ', error);
    return {
      success: false,
      message: 'Form submission failed',
    };
  }
}

export async function onSubmitInvoiceEditForm(data: FormData) {
  try {
    const session = await getServerSession(options);
    if (!session || session?.user?.role !== 'admin')
      throw new Error('Unauthorized');

    const parsedData = invoiceEditFormSchema.safeParse(
      Object.fromEntries(data)
    );

    if (!parsedData.success) {
      return {
        success: false,
        message: 'Form submission failed',
        errors: parsedData.error.issues.map((issue) => issue.message),
      };
    }

    const { stripeInvoiceId, orderStatus } = parsedData.data;

    const result = await updateOrderByStripeId(stripeInvoiceId, orderStatus);

    if (!result?.success) {
      throw new Error('Invoice update failed');
    }

    revalidatePath('(store)/admin/orders/[orderNumber]/edit', 'page');
    return {
      success: true,
      message: 'Form submitted successfully',
    };
  } catch (error: any) {
    console.error('Form submission error: ', error);
    return {
      success: false,
      message: 'Form submission failed',
    };
  }
}

export async function onSubmitProductDetailsForm(data: FormData) {
  try {
    const session = await getServerSession(options);
    if (!session || session?.user?.role !== 'admin')
      throw new Error('Unauthorized');

    const preprocessedData = preprocessFormData(data);
    const parsedData = productDetailsFormSchema.safeParse(preprocessedData);

    if (!parsedData.success) {
      return {
        success: false,
        message: 'Form submission failed',
        errors: parsedData.error.issues.map((issue) => issue.message),
      };
    }

    const { selectedProductId, images } = parsedData.data;

    const selectedProduct = await getProductById(selectedProductId);
    const prevImages = selectedProduct?.images.filter((image) => {
      return images.existingImages.some(
        (existingImage) => existingImage.url === image.url
      );
    });

    const existingImagesResult = prevImages?.reduce(
      (
        acc: { url: string; publicId?: string; name: string; alt: string }[],
        image
      ) => {
        if (image) {
          acc.push({
            url: image.url,
            publicId: image.publicId || '',
            name: `image-${image.publicId || ''}`,
            alt: `image-${image.publicId || ''}`,
          });
        }
        return acc;
      },
      []
    );

    const newImagesUploadPromises = images.newImages.map(async (image) => {
      const result = await imageUpload(image);
      return result;
    });

    const newImagesUploadResult = await Promise.all(newImagesUploadPromises);

    const newImages = newImagesUploadResult.filter(
      (image) => image !== undefined
    ) as ImageUploadResult[];

    const productPayload: ProductReqPayload = {
      name: parsedData.data.name,
      price: parsedData.data.price,
      description: parsedData.data.description,
      categories: parsedData.data.categories,
      productDetail: {
        productDetailItems: parsedData.data.productDetail.productDetailItems,
      },
      units: parsedData.data.units,
      inStock: parsedData.data.inStock,
      leadTime: parsedData.data.leadTime,
      images: {
        existingImages: existingImagesResult,
        newImages,
      },
    };

    const updateResult = await updateProductById(
      selectedProductId,
      productPayload
    );

    if (!updateResult) {
      throw new Error('Product update failed');
    }

    revalidatePath('(store)/admin/products/[productId]', 'page');
    return {
      success: true,
      message: 'Form submitted successfully',
    };
  } catch (error: any) {
    console.error('Form submission error: ', error);
    return {
      success: false,
      message: 'Form submission failed',
    };
  }
}

export const onSubmitSignUpForm = async (data: FormData) => {
  try {
    const formData = Object.fromEntries(data);
    const parsedData = await signUpFormSchema.safeParseAsync(formData);

    if (!parsedData.success) {
      console.log('parsedData.error: ', parsedData.error.issues);
      return {
        success: false,
        message: 'Form submission failed',
        errors: parsedData.error.issues.map((issue) => issue.message),
      };
    }

    const newUser = await createUser(parsedData.data);

    if (!newUser.success) {
      throw new Error('User creation failed');
    }

    return {
      success: true,
      message: 'User created successfully',
    };
  } catch (error: any) {
    console.error('Form submission error: ', error);
    return {
      success: false,
      message: 'Form submission failed',
    };
  }
};
