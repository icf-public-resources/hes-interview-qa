import { auth } from '@/auth';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const SWAGGER_BEARER_SALT = 'swagger-bearer';
const API_TOKEN_COOKIE_NAME = 'api_access_token';

export async function GET(request: NextRequest) {
  const session = await auth();

  const headerToken = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    salt: SWAGGER_BEARER_SALT,
  });

  const cookieToken = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    salt: SWAGGER_BEARER_SALT,
    cookieName: API_TOKEN_COOKIE_NAME,
  });

  const source = session?.user
    ? 'session'
    : headerToken
      ? 'bearer-header'
      : cookieToken
        ? 'api-cookie'
        : null;

  const principal = session?.user
    ? {
        id: session.user.id ?? null,
        name: session.user.name ?? null,
        email: session.user.email ?? null,
      }
    : headerToken || cookieToken
      ? {
          id: (headerToken?.sub ?? cookieToken?.sub) ?? null,
          name: (headerToken?.name ?? cookieToken?.name) ?? null,
          email: (headerToken?.email ?? cookieToken?.email) ?? null,
        }
      : null;

  const authenticated = Boolean(source);

  return NextResponse.json(
    {
      authenticated,
      source,
      principal,
      checks: {
        session: Boolean(session?.user),
        bearerHeader: Boolean(headerToken),
        apiCookie: Boolean(cookieToken),
      },
    },
    { status: authenticated ? 200 : 401 },
  );
}