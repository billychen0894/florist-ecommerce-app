import { signJwtAccessToken, verifyJwtAccessToken } from './jwt';

export interface sendNewEmailVerificationLinkProps {
  emailVerificationToken: string | null;
  setEmailVerificationToken: (token: string) => void;
  setIsEmailTokenExpired: (isExpired: boolean) => void;
}

export const sendNewEmailVerificationLink = async ({
  emailVerificationToken,
  setEmailVerificationToken,
  setIsEmailTokenExpired,
}: sendNewEmailVerificationLinkProps) => {
  // generate new email verification token
  try {
    if (!emailVerificationToken) {
      throw new Error('Email verification token is not supplied');
    }

    const { email, firstName, lastName } = verifyJwtAccessToken(
      emailVerificationToken
    ) as { email: string; firstName: string; lastName: string };

    const newEmailVerifyToken = signJwtAccessToken({
      email,
      firstName,
      lastName,
    });

    setEmailVerificationToken(newEmailVerifyToken);

    // save new email verification token to db
    const newEmailVerifyTokenResult = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          emailVerifyToken: newEmailVerifyToken,
        }),
      }
    );

    const newEmailVerifyTokenData = await newEmailVerifyTokenResult.json();

    if (newEmailVerifyTokenData?.status === 201) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sendEmail`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            emailVerificationToken: newEmailVerifyToken,
            firstName: firstName,
          }),
        });

        setIsEmailTokenExpired(false);
        return true;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to send email verification link');
      }
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to generate new email verification token');
  }
};