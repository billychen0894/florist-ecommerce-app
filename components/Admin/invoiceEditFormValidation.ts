import { OrderStatus } from '@prisma/client';
import * as yup from 'yup';

export interface DefaultInvoiceEditFormSchemaProps {
  orderStatus: OrderStatus;
}

export const defaultInvoiceEditFormSchema: yup.ObjectSchema<DefaultInvoiceEditFormSchemaProps> =
  yup.object().shape({
    orderStatus: yup
      .string()
      .oneOf(['CREATED', 'PROCESSING', 'COMPLETED', 'CANCELLED'])
      .required('Select order status'),
  });

export type InvoiceEditFormSchema = yup.InferType<
  typeof defaultInvoiceEditFormSchema
>;
