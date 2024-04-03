'use server';

import { imageUpload } from '@actions/imageUpload';
import {
  billingShippingFormSchema,
  invoiceEditFormSchema,
  personalInfoFormSchema,
} from './schemaValidator';
import {
  createStripeCustomer,
  updateStripeCustomer,
} from '@actions/stripeCustomer';
import { updateUser } from '@actions/userActions';
import { revalidatePath } from 'next/cache';
import { UserWithoutPass } from './types/types';
import { options } from '@app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import { updateOrderByStripeId } from '@actions/adminActions';

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

    let uploadResult: undefined | { public_id: string; url: string };
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
            cloudinaryPublicId: uploadResult?.public_id || '',
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
            cloudinaryPublicId: uploadResult?.public_id || '',
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
