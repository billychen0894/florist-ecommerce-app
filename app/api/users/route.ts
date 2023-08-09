import { prisma } from '@lib/prisma';
import * as bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

import type { SignUpFormData } from '@components/Auth/SignUpForm';
import { transporter } from '@lib/emailTransporter';
import { signJwtAccessToken } from '@lib/jwt';

// POST: Create new user
export async function POST(req: Request, res: Response) {
  try {
    const body: SignUpFormData = await req.json();
    const { email, password, confirmPassword, firstName, lastName } = body;

    // Validate form data
    if (
      email === '' ||
      password === '' ||
      confirmPassword === '' ||
      firstName === '' ||
      lastName === ''
    ) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: 'ValidationError',
          message: 'Please fill in all fields',
        },
        {
          status: 401,
        }
      );
    }

    // Check if email exists in db
    const existedEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existedEmail) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: 'ValidationError',
          message: 'Email already exists',
        },
        {
          status: 401,
        }
      );
    }

    // Check email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: 'ValidationError',
          message: 'Please enter a valid email',
        },
        {
          status: 401,
        }
      );
    }

    if (firstName.length > 50 || lastName.length > 50) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: 'ValidationError',
          message: 'First and last name must be less than 50 characters',
        },
        {
          status: 401,
        }
      );
    }

    // Check password is valid
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: 'ValidationError',
          message:
            'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number',
        },
        {
          status: 401,
        }
      );
    }

    // Check passwords match
    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: 'ValidationError',
          message: 'Passwords do not match',
        },
        {
          status: 401,
        }
      );
    }

    // hash password with bcrypt before storing in database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate emailVerificationToken and will be saved in db
    const emailVerificationToken = signJwtAccessToken(
      {
        email,
        firstName,
        lastName,
      },
      {
        expiresIn: '1d',
      }
    );

    // create user in database
    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        password: hashedPassword,
        emailVerifyToken: emailVerificationToken,
      },
    });

    // send email verification
    if (user) {
      try {
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
      } catch (error) {
        console.error(error);
      }
    }

    // return user object if password is correct but do not expose password
    const { password: userPassword, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        success: true,
        data: { ...userWithoutPassword },
        message: 'User created successfully',
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: 'Something went wrong',
      },
      {
        status: 500,
      }
    );
  }
}
