// /api/record/user/id/[id]

import { getRecordsUnderUserId } from "@/actions/actionsRecord";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const id: number | undefined = parseInt((await context.params).id) || undefined;
  const { success, records, error, db_error, code } = await getRecordsUnderUserId(id);
  return Response.json({ success, records, error, db_error }, { status: code });
}
