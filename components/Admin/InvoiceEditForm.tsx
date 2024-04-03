'use client';

import { Label } from '@components/ui';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import Button from '@components/ui/Button';
import Spinner from '@components/ui/Spinner';
import toast from 'react-hot-toast';
import {
  InvoiceEditFormSchema,
  invoiceEditFormSchema,
} from '@lib/schemaValidator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Order } from '@prisma/client';
import { onSubmitInvoiceEditForm } from '@lib/formActions';

interface InvoiceEditFormProps {
  order: Order | undefined;
}

export default function InvoiceEditForm({ order }: InvoiceEditFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InvoiceEditFormSchema>({
    resolver: zodResolver(invoiceEditFormSchema),
    defaultValues: {
      orderStatus: order?.orderStatus,
      stripeInvoiceId: order?.stripeInvoiceId || '',
    },
  });

  const onSubmit = async (data: InvoiceEditFormSchema) => {
    const formData = new FormData();
    formData.append('orderStatus', data.orderStatus);
    formData.append('stripeInvoiceId', order?.stripeInvoiceId || '');

    try {
      const result = await onSubmitInvoiceEditForm(formData);

      if (!result.success) {
        throw new Error('Failed to update order status');
      }

      toast.success('Order status updated successfully');
    } catch (err: any) {
      console.log('Error: ', err);
      toast.error('Something went wrong while updating order status');
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
