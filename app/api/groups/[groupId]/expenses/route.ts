import { requireUser } from "@/lib/auth";
import { getServerSupabaseFromRequest } from "@/lib/db";

export async function GET(req: Request, { params }: { params: { groupId: string } }) {
	const { user, response } = await requireUser(req);
	if (!user) return response as Response;
	const groupId = params.groupId;
	const supabase = getServerSupabaseFromRequest(req);
	const { data, error } = await supabase
		.from("group_expenses")
		.select("id, group_id, payer_id, description, amount, currency, occurred_at, created_at")
		.eq("group_id", groupId)
		.order("occurred_at", { ascending: false });
	if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	return new Response(JSON.stringify({ items: data }), { status: 200 });
}
