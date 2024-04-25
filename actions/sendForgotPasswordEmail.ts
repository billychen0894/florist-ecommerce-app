'use server';

import { signJwtAccessToken } from '@lib/jwt';
import { transporter } from '@lib/emailTransporter';
import { prisma } from '@lib/prisma';

export const sendForgotPasswordEmail = async (email: string) => {
  try {
    if (!email) throw new Error('Email is required');

    const existedUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    const verifyToken = signJwtAccessToken({ email }, { expiresIn: '1d' });

    if (existedUser) {
      await prisma.user.update({
        where: {
          id: existedUser.id,
        },
        data: {
          passwordVerificationToken: verifyToken,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Reset your password',
        html: `
           <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #007bff; color: #fff; text-align: center; padding: 20px;">
                <h1 style="font-size: 24px; margin-bottom: 20px;">Reset Your Password</h1>
            </div>
            <div style="background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h1 style="font-size: 24px; margin-bottom: 20px;">Hello,</h1>
                <p style="font-size: 16px; margin-bottom: 20px;">You have requested to reset your password. Click the button below to reset your password:</p>
                <a style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;" href="${process.env.APP_BASE_URL}/auth/forgot-password/reset?token=${verifyToken}">Reset Password</a>
                <p style="font-size: 16px; margin-bottom: 20px;">If you didn't request this, you can ignore this email. Your password won't be changed.</p>
                <p style="font-size: 16px;">Thanks,<br>Blossom Lane</p>
            </div>
        </div>
    </div> 
        `,
      });
    } else {
      return {
        success: false,
        message: 'This email is not registered',
      };
    }

    return {
      success: true,
      message: 'Reset email sent successfully',
    };
  } catch (err: any) {
    console.error('Error: ', err.message);
    return {
      success: false,
      message: 'Error while sending reset email',
    };
  }
};
