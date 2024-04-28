import { getAllUsers } from '@/actions/adminActions';
import CustomerCard from '@/components/Admin/CustomerCard';

export default async function Customers() {
  const customers = await getAllUsers();

  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Customers
          </h1>
        </div>
      </header>
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <ul
          role="list"
          className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8"
        >
          {customers?.map((customer) => (
            <CustomerCard key={customer?.id} customer={customer} />
          ))}
        </ul>
      </div>
    </>
  );
}
