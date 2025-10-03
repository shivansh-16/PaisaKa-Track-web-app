import { requireUser } from "@/lib/auth";
import { getServerSupabase } from "@/lib/db";

export async function GET(req: Request, { params }: { params: { groupId: string } }) {
	const { user, response } = await requireUser(req);
	if (!user) return response as Response;
	const groupId = params.groupId;
	const supabase = getServerSupabase();
	const { data, error } = await supabase
		.from("activity_feed")
		.select("id, action, metadata, actor_id, created_at")
		.eq("group_id", groupId)
		.order("created_at", { ascending: false })
		.limit(50);
	if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	return new Response(JSON.stringify({ items: data }), { status: 200 });
}
