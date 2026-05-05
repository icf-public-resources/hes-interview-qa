// const { auth } = NextAuth(authConfig);
import { auth } from '@/auth';
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  uiAuthPrefix,
  publicRoutes,
  apiSecuredRoutes,
} from '@/routes';
import { NextResponse } from 'next/server';

const setCorsHeaders = (req: Request, res: Response): Response => {
  const origin = req.headers.get('origin') ?? '*';
  const requestedHeaders = req.headers.get('access-control-request-headers');

  res.headers.set('Access-Control-Allow-Origin', origin);
  res.headers.set('Vary', 'Origin');
  res.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  );
  res.headers.set(
    'Access-Control-Allow-Headers',
    requestedHeaders ?? 'Content-Type, Authorization',
  );

  return res;
};

export default auth((req): void | Response | Promise<void | Response> => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  if (req.method === 'OPTIONS') {
    return setCorsHeaders(req, new NextResponse(null, { status: 204 }));
  }

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isUiAuthRoute = nextUrl.pathname.startsWith(uiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isApiSecuredRoute = apiSecuredRoutes.some((p) =>
    nextUrl.pathname.includes(p),
  );

  if (isApiAuthRoute) return setCorsHeaders(req, NextResponse.next());

  if (isApiSecuredRoute && !isPublicRoute) {
    if (!isLoggedIn)
      return setCorsHeaders(
        req,
        NextResponse.json(
          { error: "Your token has expired or you aren't logged in!" },
          { status: 401 },
        ),
      );
    return setCorsHeaders(req, NextResponse.next());
  }

  if (isUiAuthRoute) {
    if (isLoggedIn)
      return setCorsHeaders(
        req,
        Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl)),
      );
    return setCorsHeaders(req, NextResponse.next());
  }

  if (!isLoggedIn && !isPublicRoute) {
    // let callbackUrl = nextUrl.pathname;
    // if (nextUrl.search) {
    //   callbackUrl += nextUrl.search;
    // }

    // const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    // return Response.redirect(new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl));
    return setCorsHeaders(
      req,
      Response.redirect(new URL('/auth/login', nextUrl)),
    );
  }

  return setCorsHeaders(req, NextResponse.next());
});

// Optionally, don't invoke Proxy on some paths
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
