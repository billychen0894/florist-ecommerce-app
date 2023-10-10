'use client';

import { Label } from '@components/ui';
import { useForm } from 'react-hook-form';
import {
  defaultInvoiceEditFormSchema,
  InvoiceEditFormSchema,
} from '@components/Admin/invoiceEditFormValidation';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorMessage } from '@hookform/error-message';
import Button from '@components/ui/Button';
import Spinner from '@components/ui/Spinner';
import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { admin } from '@lib/api/admin';
import useAxiosWithAuth from '@hooks/useAxiosAuth';
import toast from 'react-hot-toast';
import { updateOrder } from '@store/features/adminSlice';

interface InvoiceEditFormProps {
  invoiceId: string;
}

export default function InvoiceEditForm({ invoiceId }: InvoiceEditFormProps) {
  const orders = useAppSelector((state) => state.adminReducer.orders);
  const [order] = orders.filter((order) => order.stripeInvoiceId === invoiceId);
  const dispatch = useAppDispatch();
  const axiosWithAuth = useAxiosWithAuth();

  const methods = useForm<InvoiceEditFormSchema>({
    resolver: yupResolver(defaultInvoiceEditFormSchema),
    defaultValues: {
      orderStatus: order?.orderStatus!,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = methods;

  useEffect(() => {
    const formDefaultValues: { [key: string]: string } = {
      orderStatus: order?.orderStatus || '',
    };

    Object.keys(formDefaultValues).forEach((key) =>
      // @ts-ignore
      setValue(key, formDefaultValues[key] as never)
    );
  }, [order?.orderStatus, setValue]);

  const isFormDataSameAsCurrent = useCallback(
    (formData: InvoiceEditFormSchema): boolean => {
      if (order && formData) {
        return formData.orderStatus === order?.orderStatus;
      }
      return false;
    },
    [order]
  );

  const onSubmit = async (data: InvoiceEditFormSchema) => {
    try {
      const isDataSameAsCurrent = isFormDataSameAsCurrent(data);

      if (!isDirty || isDataSameAsCurrent) {
        toast.error('No information updated. Cannot save');
        return;
      }

      const { orderStatus } = data;

      if (orderStatus) {
        const payload = {
          orderStatus: data.orderStatus,
        };
        await admin.updateOrderByStripeId(invoiceId, payload, axiosWithAuth);
        dispatch(updateOrder({ stripeInvoiceId: invoiceId, orderStatus }));

        toast.success('Successfully updated!');
      }
    } catch (err: any) {
      console.log('Error: ', err.message);
      toast.error('Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="py-8">
      <h2 className="text-base font-semibold leading-6 text-gray-900">
        Order Management
      </h2>
      <div className="grid grid-cols-3 py-8 gap-8">
        <div className="col-span-full sm:col-span-1">
          <Label htmlFor="orderStatus">Order Status</Label>
          <div className="mt-2">
            <select
              id="orderStatus"
              defaultValue={order?.orderStatus || ''}
              {...register('orderStatus')}
              className="w-full block rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border-gray-300"
            >
              <option value="" disabled>
                Select order status
              </option>
              <option value="CREATED">Created</option>
              <option value="PROCESSING">Processing</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <ErrorMessage
            name="orderStatus"
            errors={errors}
            as="p"
            className="text-sm font-medium text-red-500 mt-1 ml-1"
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button
          type="submit"
          className={
            isSubmitting
              ? 'bg-secondary-200 text-secondary-400 cursor-not-allowed border-secondary-300 hover:bg-secondary-200'
              : 'bg-secondary-500 hover:bg-secondary-400'
          }
          disabled={isSubmitting}
        >
          <div className="flex justify-center items-center">
            {isSubmitting && <Spinner />}
            <span className="block">Save</span>
          </div>
        </Button>
      </div>
    </form>
  );
}
