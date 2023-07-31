import { transporter } from '@lib/emailTransporter';
import { NextResponse } from 'next/server';

interface emailPayload {
  firstName: string;
  email: string;
  emailVerificationToken: string;
}

export async function POST(req: Request, res: Response) {
  const body: emailPayload = await req.json();
  const { firstName, email, emailVerificationToken } = body;
  try {
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: 'ValidationError',
          message: 'Email is not supplied',
        },
        {
          status: 401,
        }
      );
    }

    if (!emailVerificationToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'ValidationError',
          message: 'Email verification token is not supplied',
        },
        {
          status: 401,
        }
      );
    }

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify your email address',
      html: `
      <div>
        <h1>Verify your email address</h1>
        <p>Hi ${firstName},</p>
        <p>Thanks for signing up for an account on <a href=${process.env.APP_BASE_URL}>Blossom Lane</a>.</p>
        <p>Please click the link below to verify your email address:</p>
        <a href="${process.env.APP_BASE_URL}/verify-email?token=${emailVerificationToken}">Verify your email address</a>
        <p>Thanks,</p>
        <p>Blossom Lane Team</p>
      </div>
    `,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Email Verification Link is sent successfully',
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
  }
}
