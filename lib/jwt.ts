import jwt, { JwtPayload } from 'jsonwebtoken';

interface SignOptions {
  expiresIn?: string;
}

const DEFAULT_ACCESS_TOKEN_SIGN_OPTIONS: SignOptions = {
  expiresIn: '1h',
};

const DEFAULT_REFRESH_TOKEN_SIGN_OPTIONS: SignOptions = {
  expiresIn: '30d',
};

const accessTokenSecret =
  process.env.JWT_ACCESS_TOKEN_SECRET ||
  process.env.NEXT_PUBLIC_JWT_ACCESS_TOKEN_SECRET;
const refreshTokenSecret =
  process.env.JWT_REFRESH_TOKEN_SECRET ||
  process.env.NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET;

export function signJwtAccessToken(
  payload: JwtPayload,
  options: SignOptions = DEFAULT_ACCESS_TOKEN_SIGN_OPTIONS
) {
  if (!accessTokenSecret) {
    throw new Error('Missing JWT_SECRET env variable');
  }

  if (!payload) {
    throw new Error('Missing payload');
  }

  const accessToken = jwt.sign(payload, accessTokenSecret!, options);

  return accessToken;
}

export function signJwtRefreshToken(
  payload: JwtPayload,
  options: SignOptions = DEFAULT_REFRESH_TOKEN_SIGN_OPTIONS
) {
  if (!refreshTokenSecret) {
    throw new Error('Missing JWT_SECRET env variable');
  }

  if (!payload) {
    throw new Error('Missing payload');
  }

  const refreshToken = jwt.sign(payload, refreshTokenSecret!, options);

  return refreshToken;
}

export function verifyJwtAccessToken(accessToken: string) {
  try {
    if (!accessTokenSecret) {
      throw new Error('Missing JWT_SECRET env variable');
    }

    if (!accessToken) {
      throw new Error('Missing token');
    }

    // Decode the token
    const payload = jwt.verify(accessToken, accessTokenSecret!) as JwtPayload;

    return payload as JwtPayload;
  } catch (error) {
    console.error('Error verifying token:', error);
    return error;
  }
}

export function verifyJwtRefreshToken(refreshToken: string) {
  try {
    if (!refreshTokenSecret) {
      throw new Error('Missing JWT_SECRET env variable');
    }

    if (!refreshToken) {
      throw new Error('Missing token');
    }

    // Decode the token
    const payload = jwt.verify(refreshToken, refreshTokenSecret!) as JwtPayload;

    return payload;
  } catch (error) {
    console.error(error);
    return null;
  }
}
