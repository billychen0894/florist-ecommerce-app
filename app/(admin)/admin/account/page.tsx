import { getUser } from '@/actions/userActions';
import { options } from '@/app/api/auth/[...nextauth]/options';
import PersonalInfoForm from '@/components/User/PersonalInfoForm';
import { redirect } from '@/node_modules/next/navigation';
import { getServerSession } from 'next-auth';

export default async function Account() {
  const session = await getServerSession(options);

  if (!session || session?.user?.role !== 'admin') {
    redirect('/denied');
  }
  const user = await getUser(session.user.id);

  return (
    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-800">
            Personal Information
          </h2>
        </div>
        <PersonalInfoForm isInputsDisabled={false} user={user} />
        {/* AdminAccountDelBtn component is disabled preventing from other testers removing it intentionally */}
        {/* <div> */}
        {/*   <h2 className="text-base font-semibold leading-7 text-gray-700"> */}
        {/*     Delete account */}
        {/*   </h2> */}
        {/*   <p className="mt-1 text-sm leading-6 text-gray-500"> */}
        {/*     No longer want to use this account? You can delete your account */}
        {/*     here. This action is not reversible. All information related to this */}
        {/*     account will be deleted permanently. */}
        {/*   </p> */}
        {/* </div> */}
        {/* <AdminAccountDelBtn user={user} /> */}
      </div>
    </div>
  );
}
