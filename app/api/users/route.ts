import { prisma } from '@lib/prisma';
import * as bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

import type { SignUpFormData } from '@components/Auth/SignUpForm';
import { transporter } from '@lib/emailTransporter';
import { signJwtAccessToken } from '@lib/jwt';

// TODO: Check Why the endpoint always returns 200
// POST: Create new user
export async function POST(req: Request, res: Response) {
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
    return NextResponse.json({
      success: false,
      data: null,
      status: 401,
      error: 'ValidationError',
      message: 'Please fill in all fields',
    });
  }

  // Check if email exists in db
  const existedEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (existedEmail) {
    return NextResponse.json({
      success: false,
      data: null,
      status: 401,
      error: 'ValidationError',
      message: 'Email already exists',
    });
  }

  // Check email is valid
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({
      success: false,
      data: null,
      status: 401,
      error: 'ValidationError',
      message: 'Please enter a valid email',
    });
  }

  if (firstName.length > 50 || lastName.length > 50) {
    return NextResponse.json({
      success: false,
      data: null,
      status: 401,
      error: 'ValidationError',
      message: 'First and last name must be less than 50 characters',
    });
  }

  // Check password is valid
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  if (!passwordRegex.test(password)) {
    return NextResponse.json({
      success: false,
      data: null,
      status: 401,
      error: 'ValidationError',
      message:
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number',
    });
  }

  // Check passwords match
  if (password !== confirmPassword) {
    return NextResponse.json({
      success: false,
      data: null,
      status: 401,
      error: 'ValidationError',
      message: 'Passwords do not match',
    });
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

  return NextResponse.json({
    success: true,
    data: { ...userWithoutPassword },
    status: 201,
    message: 'User created successfully',
  });
}

// Update user data
export async function PUT(req: Request, res: Response) {
  const body: {
    name?: string;
    email?: string;
    emailVerified?: Date;
    emailVerifyToken?: string;
    image?: string;
    password?: string;
  } = await req.json();
  const { name, email, emailVerified, emailVerifyToken, image, password } =
    body;

  if (!email) {
    return NextResponse.json({
      success: false,
      data: null,
      status: 401,
      error: 'ValidationError',
      message: 'Email is required',
    });
  }

  // Check if email exists in db
  const existedEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (!existedEmail) {
    return NextResponse.json({
      success: false,
      data: null,
      status: 401,
      error: 'ValidationError',
      message: 'User not found',
    });
  }

  const updatedUserData = {
    name: name || existedEmail.name,
    email: existedEmail.email,
    emailVerified: emailVerified || existedEmail.emailVerified,
    emailVerifyToken: emailVerifyToken || existedEmail.emailVerifyToken,
    image: image || existedEmail.image,
    password: password || existedEmail.password,
  };

  // update user in database
  const user = await prisma.user.update({
    where: { email },
    data: {
      ...updatedUserData,
    },
  });

  const { password: userPassword, ...userWithoutPassword } = user;

  return NextResponse.json({
    success: true,
    data: { ...userWithoutPassword },
    status: 201,
    message: 'User updated successfully',
  });
}
