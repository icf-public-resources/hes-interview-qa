// /api/record/id/[id]

import { deleteRecordById, getRecordById } from "@/actions/actionsRecord";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const id: number | undefined = parseInt((await context.params).id) || undefined;
  const { success, record, error, db_error, code } = await getRecordById(id);
  return Response.json({ success, record, error, db_error }, { status: code });
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const id: number | undefined = parseInt((await context.params).id) || undefined;
  const { success, error, db_error, code } = await deleteRecordById(id);
  return Response.json({ success, error, db_error }, { status: code });
}
