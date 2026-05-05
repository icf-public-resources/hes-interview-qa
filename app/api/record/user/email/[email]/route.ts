// /api/record/user/email/[email]

import { getRecordsUnderUserEmail } from "@/actions/actionsRecord";

export async function GET(request: Request, context: { params: Promise<{ email: string }> }) {
  const email: string | undefined = (await context.params).email || undefined;
  const { success, records, error, db_error, code } = await getRecordsUnderUserEmail(email);
  return Response.json({ success, records, error, db_error }, { status: code });
}
