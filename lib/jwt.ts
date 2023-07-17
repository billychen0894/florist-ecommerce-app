import jwt, { JwtPayload } from 'jsonwebtoken';

interface SignOptions {
  expiresIn?: string;
}

const DEFAULT_SIGN_OPTIONS: SignOptions = {
  expiresIn: '2d',
};

export function signJwtAccessToken(
  payload: JwtPayload,
  options: SignOptions = DEFAULT_SIGN_OPTIONS
) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('Missing JWT_SECRET env variable');
  }

  if (!payload) {
    throw new Error('Missing payload');
  }

  const token = jwt.sign(payload, secret, options);

  return token;
}

export function verifyJwtAccessToken(token: string) {
  try {
    const secret = process.env.JWT_SECRET || process.env.NEXT_PUBLIC_JWT_SECRET;

    if (!secret) {
      throw new Error('Missing JWT_SECRET env variable');
    }

    if (!token) {
      throw new Error('Missing token');
    }

    // Decode the token
    const payload = jwt.verify(token, secret);

    return payload as JwtPayload;
  } catch (error) {
    console.error(error);
    return null;
  }
}
