import WishlistView from '@components/User/WishlistView';
import { getServerSession } from 'next-auth';
import { options } from '@app/api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';
import { getUserWishlist } from '@actions/userActions';

export default async function Wishlist() {
  const session = await getServerSession(options);
  if (!session) {
    redirect('auth/signin');
  }

  const wishlist = await getUserWishlist(session?.user?.id);

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8 ">
      <WishlistView wishlist={wishlist} />
    </main>
  );
}
