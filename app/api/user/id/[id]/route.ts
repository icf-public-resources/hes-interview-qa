// /api/user/id/[id]

import { getUserById } from "@/actions/actionsUser";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const id: number | undefined = (await context.params).id ? parseInt((await context.params).id as string) : undefined;
  const { success, user, error, code } = await getUserById(id);
  return Response.json({ success, user, error }, { status: code });
}
