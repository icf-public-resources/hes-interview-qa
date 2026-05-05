// /api/user/email/[email]

import { getUserByEmail } from "@/actions/actionsUser";

export async function GET(request: Request, context: { params: Promise<{ email: string }> }) {
  const email: string | undefined = (await context.params).email || undefined;
  const { success, user, error, code } = await getUserByEmail(email);
  return Response.json({ success, user, error }, { status: code });
}
