// /api/household/user/email/[email]

import { getHouseholdByUserEmail, getHouseholdByUserId } from "@/actions/actionsHousehold";

export async function GET(request: Request, context: { params: Promise<{ email: string }> }) {
  const email: string | undefined = (await context.params).email || undefined;
  const { success, household, error, db_error, code } = await getHouseholdByUserEmail(email);
  return Response.json({ success, household, error, db_error }, { status: code });
}
