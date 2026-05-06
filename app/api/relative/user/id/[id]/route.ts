// /api/relative/user/id/[id]

import { getRelativesUnderUserId } from "@/actions/actionsRecord";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const id: number | undefined = parseInt((await context.params).id) || undefined;
  const { success, relatives, error, db_error, code } = await getRelativesUnderUserId(id);
  return Response.json({ success, relatives, error, db_error }, { status: code });
}
