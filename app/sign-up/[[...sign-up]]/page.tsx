import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <SignUp
      path="/sign-in"
      routing="path"
      signInUrl="/sign-in"
      redirectUrl="/account"
    />
  );
}
