// /api/record/relative/user/id/[id]

import { getRecordsWithRelativesInfoUnderUserId } from "@/actions/actionsRecord";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const id: number | undefined = parseInt((await context.params).id) || undefined;
  const { success, recordsWithRelationship, error, db_error, code } = await getRecordsWithRelativesInfoUnderUserId(id);
  return Response.json({ success, recordsWithRelationship, error, db_error }, { status: code });
}
