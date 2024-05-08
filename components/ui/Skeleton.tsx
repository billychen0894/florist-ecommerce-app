import { cn } from '@/lib/classNames';

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse', className)} {...props} />;
}
