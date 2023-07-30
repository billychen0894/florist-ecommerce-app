import { emails } from './api/email';
import { signJwtAccessToken, verifyJwtAccessToken } from './jwt';

export interface sendNewEmailVerificationLinkProps {
  emailVerificationToken: string | null;
  setEmailVerificationToken: (token: string) => void;
}

export const sendNewEmailVerificationLink = async ({
  emailVerificationToken,
  setEmailVerificationToken,
}: sendNewEmailVerificationLinkProps) => {
  // generate new email verification token
  try {
    if (!emailVerificationToken) {
      throw new Error('Email verification token is not supplied');
    }

    const { email, firstName, lastName } = verifyJwtAccessToken(
      emailVerificationToken
    ) as { email: string; firstName: string; lastName: string };

    const newEmailVerifyToken = signJwtAccessToken(
      {
        email,
        firstName,
        lastName,
      },
      {
        expiresIn: '1d',
      }
    );

    setEmailVerificationToken(newEmailVerifyToken);

    const newEmailVerifyTokenResult = await emails.updateVerifyingEmail({
      email: email,
      emailVerifyToken: newEmailVerifyToken,
    });

    const newEmailVerifyTokenData = newEmailVerifyTokenResult.data;

    if (newEmailVerifyTokenData?.status === 200) {
      try {
        await emails.sendEmail({
          email: email,
          emailVerificationToken: newEmailVerifyToken,
          firstName: firstName,
        });

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
