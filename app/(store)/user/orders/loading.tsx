import SkeletonTable from '@/components/Table/SkeletonTable';

export default function OrdersLoading() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="my-10 flow-root">
        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <SkeletonTable />
          </div>
        </div>
      </div>
    </div>
  );
}
