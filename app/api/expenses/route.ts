import { requireUser } from "@/lib/auth";
import { getServerSupabase } from "@/lib/db";

export async function GET(req: Request) {
	const { user, response } = await requireUser(req);
	if (!user) return response as Response;
	const url = new URL(req.url);
	const limit = Math.min(Number(url.searchParams.get("limit") || 25), 100);
	const supabase = getServerSupabase();
	const { data, error } = await supabase
		.from("transactions")
		.select("id, type, amount, currency, category_id, payment_method, note, occurred_at")
		.eq("user_id", user.id)
		.order("occurred_at", { ascending: false })
		.limit(limit);
	if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	return new Response(JSON.stringify({ items: data }), { status: 200 });
}

export async function POST(req: Request) {
	const { user, response } = await requireUser(req);
	if (!user) return response as Response;
	const body = await req.json().catch(() => null);
	if (!body || typeof body.amount !== "number" || !body.type) {
		return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400 });
	}
	const supabase = getServerSupabase();
	const insert = {
		user_id: user.id,
		type: body.type,
		amount: body.amount,
		currency: body.currency || "INR",
		category_id: body.category_id ?? null,
		payment_method: body.payment_method ?? null,
		note: body.note ?? null,
		occurred_at: body.occurred_at || new Date().toISOString(),
	};
	const { data, error } = await supabase.from("transactions").insert(insert).select("*").single();
	if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	return new Response(JSON.stringify(data), { status: 201 });
}
