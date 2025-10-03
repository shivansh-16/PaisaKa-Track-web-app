import { requireUser } from "@/lib/auth";
import { getServerSupabase } from "@/lib/db";

export async function GET(req: Request) {
	const { user, response } = await requireUser(req);
	if (!user) return response as Response;
	const supabase = getServerSupabase();
	const { data, error } = await supabase
		.from("profiles")
		.select("id, full_name, language, currency, timezone")
		.eq("id", user.id)
		.single();
	if (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}
	return new Response(JSON.stringify({ user, profile: data }), { status: 200 });
}
