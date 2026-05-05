import bcrypt from 'bcryptjs';
import { encode } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

import { dbGetUserByEmail } from '@/data/dbUsers';
import { LoginSchema } from '@/schemas';

const SWAGGER_BEARER_SALT = 'swagger-bearer';
const API_TOKEN_COOKIE_NAME = 'api_access_token';
const TOKEN_MAX_AGE_SECONDS = 2 * 60 * 60;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const validatedFields = LoginSchema.safeParse(body);

  if (!validatedFields.success) {
    return Response.json(
      { error: 'Invalid email or password payload.' },
      { status: 400 },
    );
  }

  const { email, password } = validatedFields.data;
  const user = await dbGetUserByEmail(email);

  if (!user || !user.password) {
    return Response.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return Response.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    return Response.json(
      { error: 'AUTH_SECRET is not configured.' },
      { status: 500 },
    );
  }

  const accessToken = await encode({
    secret,
    salt: SWAGGER_BEARER_SALT,
    maxAge: TOKEN_MAX_AGE_SECONDS,
    token: {
      sub: String(user.id),
      name: user.name,
      email: user.email,
      picture: user.image,
    },
  });

  const response = NextResponse.json({
    accessToken,
    tokenType: 'Bearer',
    expiresIn: TOKEN_MAX_AGE_SECONDS,
  });

  response.cookies.set(API_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: TOKEN_MAX_AGE_SECONDS,
  });

  return response;
}
