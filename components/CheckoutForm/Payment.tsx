import { ErrorMessage } from '@hookform/error-message';
import { useFormContext } from 'react-hook-form';

import { Input, Label } from '@components/ui';
import { paymentMethods } from '@const/paymentMethod';

export default function Payment() {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  return (
    <div className="mt-10 border-t border-gray-200 pt-10">
      <h2 className="text-lg font-medium text-gray-900">Payment</h2>

      {/* Payment Method Radio */}
      <fieldset className="mt-4">
        <legend className="sr-only">Payment type</legend>
        <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
          {paymentMethods.map((paymentMethod, paymentMethodIdx) => (
            <div key={paymentMethod.id} className="flex items-center">
              <input
                id={paymentMethod.id}
                type="radio"
                value={paymentMethod.id}
                {...register('paymentMethod')}
                className="h-4 w-4 border-gray-300 text-primary-400 focus:ring-primary-500"
              />
              <label
                htmlFor={paymentMethod.id}
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                {paymentMethod.title}
              </label>
            </div>
          ))}
          <ErrorMessage
            errors={errors}
            name="paymentMethod"
            as="p"
            className="text-sm font-medium text-red-500 mt-1 ml-1"
          />
        </div>
      </fieldset>

      {watch('paymentMethod') === 'creditCard' && (
        <div className="mt-6 grid grid-cols-4 gap-x-4 gap-y-6">
          <div className="col-span-4">
            <Label htmlFor="creditCardNumber">Card number</Label>
            <div className="mt-1">
              <Input
                id="creditCardNumber"
                type="text"
                autoComplete="cc-number"
                {...register('creditCardNumber')}
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="creditCardNumber"
              as="p"
              className="text-sm font-medium text-red-500 mt-1 ml-1"
            />
          </div>

          <div className="col-span-4">
            <Label htmlFor="creditCardName">Name on card</Label>
            <div className="mt-1">
              <Input
                id="creditCardName"
                type="text"
                autoComplete="cc-name"
                {...register('creditCardName')}
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="creditCardName"
              as="p"
              className="text-sm font-medium text-red-500 mt-1 ml-1"
            />
          </div>

          <div className="col-span-3">
            <Label htmlFor="creditCardExpiry">Expiration date (MM/YY)</Label>
            <div className="mt-1">
              <Input
                id="creditCardExpiry"
                type="text"
                autoComplete="cc-exp"
                {...register('creditCardExpiry')}
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="creditCardExpiry"
              as="p"
              className="text-sm font-medium text-red-500 mt-1 ml-1"
            />
          </div>

          <div>
            <Label htmlFor="creditCardCvc">CVC</Label>
            <div className="mt-1">
              <Input
                id="creditCardCvc"
                type="text"
                autoComplete="csc"
                {...register('creditCardCvc')}
              />
            </div>
            <ErrorMessage
              errors={errors}
              name="creditCardCvc"
              as="p"
              className="text-sm font-medium text-red-500 mt-1 ml-1"
            />
          </div>
        </div>
      )}
    </div>
  );
}
