import { cn } from '@/lib/classNames';

interface StickyHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export default function StickyHeader({
  children,
  className,
}: StickyHeaderProps) {
  return (
    <th
      scope="col"
      className={cn(
        'sticky top-0 z-10 border-b border-gray-200 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-700 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8',
        className
      )}
    >
      {children}
    </th>
  );
}
