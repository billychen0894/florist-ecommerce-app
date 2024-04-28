import { removeProductFromWishlist } from '@/actions/userActions';
import Button from '@/components/ui/Button';
import { TWishlistItem } from '@/lib/types/types';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useSession } from 'next-auth/react';

type ProductWishlistButtonProps = {
  product: TWishlistItem;
};

export default function ProductWishlistButton({
  product,
}: ProductWishlistButtonProps) {
  const { data: session } = useSession();

  return (
    <div className="relative z-10">
      <Button
        type="button"
        className="absolute top-0 right-0 ml-4 flex items-center justify-center px-3 py-3 text-secondary-400 bg-transparent hover:bg-transparent shadow-none hover:text-secondary-500 transition-transform transform hover:scale-90"
        title="Add Products to Wishlist"
        onClick={() => {
          if (session?.user && product) {
            removeProductFromWishlist(product.id, session?.user?.id);
          }
        }}
      >
        <HeartIconSolid className="h-8 w-8 flex-shrink-0" aria-hidden="true" />
        <span className="sr-only">Add to Wishlist</span>
      </Button>
    </div>
  );
}
