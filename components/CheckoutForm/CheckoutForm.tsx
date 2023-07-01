'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';

import { products } from '@const/products';
import BillingInfo from './BillingInfo';
import ContactInfo from './ContactInfo';
import DeliveryMethod from './DeliveryMethod';
import OrderSummary from './OrderSummary';
import Payment from './Payment';
import ShippingInfo from './ShippingInfo';
import { FormData, formSchema } from './formValidator';

export function CheckoutForm() {
  // initialize form with default values
  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contactEmail: '',
      shippingFirstName: '',
      shippingLastName: '',
      shippingAddressLine1: '',
      shippingAddressLine2: '',
      shippingCompany: '',
      shippingCity: '',
      shippingArea: '',
      shippingPostalCode: '',
      shippingCountry: '',
      shippingPhone: '',
      deliveryMethod: 'delivery',
      billingSameAsShipping: true,
      billingCompany: '',
      billingAddressLine1: '',
      billingAddressLine2: '',
      billingCity: '',
      billingArea: '',
      billingPostalCode: '',
      billingCountry: '',
      paymentMethod: 'creditCard',
      creditCardNumber: '',
      creditCardName: '',
      creditCardExpiry: '',
      creditCardCvc: '',
    },
  });

  // // handle form submission
  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16"
      >
        <div>
          <div>
            <ContactInfo />
          </div>
          <div className="mt-10 border-t border-gray-200 pt-10">
            <ShippingInfo />
          </div>
          <div className="mt-10 border-t border-gray-200 pt-10">
            <BillingInfo />
          </div>
          <div className="mt-10 border-t border-gray-200 pt-10">
            <DeliveryMethod />
          </div>
          <Payment />
        </div>
        <OrderSummary products={products} />
      </form>
    </FormProvider>
  );
}
