import { cn } from '@lib/classNames';

export default function ContextMenu({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'mt-2 flex justify-center items-center rounded-lg border border-dashed border-gray-900/25 py-2',
        className
      )}
    >
      <div className="text-center">
        <div className="flex justify-center items-center text-xs leading-6 text-gray-400">
          {children}
        </div>
      </div>
    </div>
  );
}
