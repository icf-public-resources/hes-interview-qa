// /api/user

import { auth } from '@/auth';
import { deleteUserById, updateUser } from '@/actions/actionsUser';
import { dbGetUserByEmail, dbGetUserById } from '@/data/dbUsers';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

const SWAGGER_BEARER_SALT = 'swagger-bearer';
const API_TOKEN_COOKIE_NAME = 'api_access_token';

export async function PATCH(request: Request) {
  const { user, success, error, data, db_error, code } = await updateUser(
    await request.json(),
  );
  return Response.json(
    { success, user, error, data, db_error },
    { status: code },
  );
}

export async function DELETE(request: Request) {
  const { success, error, db_error, code } = await deleteUserById(
    (await request.json()).id,
  );
  return Response.json({ success, error, db_error }, { status: code });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id: number | undefined = searchParams.get('id')
    ? parseInt(searchParams.get('id') as string)
    : undefined;
  const email: string | undefined = searchParams.get('email') || undefined;

  if (!id && !email)
    return Response.json(
      { error: 'At least one query parameter required, id or email' },
      { status: 403 },
    );

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

  const token = headerToken ?? cookieToken;
  const authUserId = session?.user?.id
    ? parseInt(session.user.id as string)
    : token?.sub
      ? parseInt(token.sub)
      : undefined;
  const authUserEmail = session?.user?.email ?? token?.email ?? undefined;

  if (!authUserId && !authUserEmail) {
    return Response.json(
      { error: 'your session expired. please log in' },
      { status: 401 },
    );
  }

  const authDbUser = authUserId
    ? await dbGetUserById(authUserId)
    : authUserEmail
      ? await dbGetUserByEmail(authUserEmail)
      : null;
  if (!authDbUser) {
    return Response.json(
      { error: 'your session expired. please log in' },
      { status: 401 },
    );
  }

  const targetUser = id
    ? await dbGetUserById(id)
    : await dbGetUserByEmail(email as string);
  if (!targetUser) {
    return Response.json(
      {
        error: id
          ? `No user by id '${id}' found.`
          : `No user with email '${email}' found.`,
      },
      { status: 404 },
    );
  }

  const isOwner = targetUser.id === authDbUser.id;
  const isAdmin = authDbUser.role === 'ADMIN';
  if (!isOwner && !isAdmin) {
    return Response.json(
      { error: "You don't have permission to get someone's relatives" },
      { status: 401 },
    );
  }

  return Response.json(
    { success: 'User found.', user: targetUser },
    { status: 200 },
  );
}
