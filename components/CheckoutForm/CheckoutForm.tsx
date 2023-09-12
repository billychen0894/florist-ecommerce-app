'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';

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
    resolver: yupResolver(formSchema),
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
      deliveryMethod: 'Delivery',
      billingSameAsShipping: true,
      paymentMethod: 'creditCard',
      billingCompany: '',
      billingAddressLine1: '',
      billingAddressLine2: '',
      billingCity: '',
      billingArea: '',
      billingPostalCode: '',
      billingCountry: '',
      creditCardNumber: '',
      creditCardName: '',
      creditCardExpiry: '',
      creditCardCvc: '',
    },
  });

  // // handle form submission
  const onSubmit = (data: FormData) => {
    //TODO: If billing is same as shipping, copy shipping info to billing info
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
        <OrderSummary />
      </form>
    </FormProvider>
  );
}
