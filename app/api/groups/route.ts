import { requireUser } from "@/lib/auth";
import { getServerSupabase } from "@/lib/db";

export async function GET(req: Request) {
	const { user, response } = await requireUser(req);
	if (!user) return response as Response;
	const supabase = getServerSupabase();
	const { data, error } = await supabase
		.from("groups")
		.select("id, name, description, created_at")
		.or(`owner_id.eq.${user.id},id.in.(select group_id from group_members where user_id = '${user.id}')`);
	if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	return new Response(JSON.stringify({ items: data }), { status: 200 });
}
