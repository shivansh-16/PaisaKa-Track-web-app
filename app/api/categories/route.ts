import { requireUser } from "@/lib/auth";
import { getServerSupabaseFromRequest } from "@/lib/db";

export async function GET(req: Request) {
	const { user, response } = await requireUser(req);
	if (!user) return response as Response;
	const supabase = getServerSupabaseFromRequest(req);
	const { data, error } = await supabase
		.from("categories")
		.select("id, name_en, name_hi, icon, is_system")
		.or(`is_system.eq.true,owner_id.eq.${user.id}`)
		.order("is_system", { ascending: false });
	if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	return new Response(JSON.stringify({ items: data }), { status: 200 });
}

export async function POST(req: Request) {
	const { user, response } = await requireUser(req);
	if (!user) return response as Response;
	const body = await req.json().catch(() => null);
	if (!body || typeof body.name_en !== "string" || !body.name_en?.trim()) {
		return new Response(JSON.stringify({ error: "name_en required" }), { status: 400 });
	}
	const supabase = getServerSupabaseFromRequest(req);
	const payload = {
		owner_id: user.id,
		name_en: body.name_en.trim(),
		name_hi: (body.name_hi || null),
		icon: body.icon || null,
		is_system: false,
	};
	const { data, error } = await supabase.from("categories").insert(payload).select("*").single();
	if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	return new Response(JSON.stringify(data), { status: 201 });
}
