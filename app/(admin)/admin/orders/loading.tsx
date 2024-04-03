import SkeletonTable from '@components/Table/SkeletonTable';
import Spinner from '@components/ui/Spinner';

export default function OrdersLoading() {
  return <Spinner className="text-primary-500 h-16 w-16 mx-auto mt-24" />;
}
