import StickyHeader from './StickyHeader';

export default function SkeletonTable() {
  return (
    <table className="min-w-full border-separate border-spacing-2">
      <thead>
        <tr>
          <StickyHeader>Invoice Number</StickyHeader>
          <StickyHeader className="hidden sm:table-cell">Total</StickyHeader>
          <StickyHeader className="hidden lg:table-cell">
            Order Status
          </StickyHeader>
          <StickyHeader>Payment Status</StickyHeader>
          <StickyHeader>
            <span className="sr-only">View Invoice Details</span>
          </StickyHeader>
        </tr>
      </thead>
      <tbody>
        <tr className="animate-pulse">
          <td className="h-8 w-2 my-1 rounded-lg shadow-sm bg-slate-200" />
          <td className="h-8 w-2 rounded-lg shadow-sm bg-slate-200" />
          <td className="h-8 w-2 rounded-lg shadow-sm bg-slate-200" />
          <td className="h-8 w-2 rounded-lg shadow-sm bg-slate-200" />
          <td className="h-8 w-2 rounded-lg shadow-sm bg-slate-200" />
        </tr>
        <tr className="animate-pulse">
          <td className="h-8 w-2 my-1 rounded-lg shadow-sm bg-slate-200" />
          <td className="h-8 w-2 rounded-lg shadow-sm bg-slate-200" />
          <td className="h-8 w-2 rounded-lg shadow-sm bg-slate-200" />
          <td className="h-8 w-2 rounded-lg shadow-sm bg-slate-200" />
          <td className="h-8 w-2 rounded-lg shadow-sm bg-slate-200" />
        </tr>
        <tr className="animate-pulse">
          <td className="h-8 w-2 my-1 rounded-lg shadow-sm bg-slate-200" />
          <td className="h-8 w-2 rounded-lg shadow-sm bg-slate-200" />
          <td className="h-8 w-2 rounded-lg shadow-sm bg-slate-200" />
          <td className="h-8 w-2 rounded-lg shadow-sm bg-slate-200" />
          <td className="h-8 w-2 rounded-lg shadow-sm bg-slate-200" />
        </tr>
        <tr className="animate-pulse">
          <td className="h-8 w-2 my-1 rounded-lg shadow-sm bg-slate-200" />
          <td className="h-8 w-2 rounded-lg shadow-sm bg-slate-200" />
          <td className="h-8 w-2 rounded-lg shadow-sm bg-slate-200" />
          <td className="h-8 w-2 rounded-lg shadow-sm bg-slate-200" />
          <td className="h-8 w-2 rounded-lg shadow-sm bg-slate-200" />
        </tr>
        <tr className="animate-pulse">
          <td className="h-8 w-2 my-1 rounded-lg shadow-sm bg-slate-200" />
          <td className="h-8 w-2 rounded-lg shadow-sm bg-slate-200" />
          <td className="h-8 w-2 rounded-lg shadow-sm bg-slate-200" />
          <td className="h-8 w-2 rounded-lg shadow-sm bg-slate-200" />
          <td className="h-8 w-2 rounded-lg shadow-sm bg-slate-200" />
        </tr>
      </tbody>
    </table>
  );
}
