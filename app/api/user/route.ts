import { requireUser } from "@/lib/auth";
import { getServerSupabaseFromRequest } from "@/lib/db";

export async function GET(req: Request) {
	const { user, response } = await requireUser(req);
	if (!user) return response as Response;
	const supabase = getServerSupabaseFromRequest(req);
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

export async function POST(req: Request) {
	const { id, full_name } = await req.json();
	
	// Create profile for new user
	const supabase = getServerSupabaseFromRequest(req);
	const { error } = await supabase
		.from("profiles")
		.insert({ id, full_name });
		
	if (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}
	
	return new Response(JSON.stringify({ message: "Profile created successfully" }), { status: 200 });
}
