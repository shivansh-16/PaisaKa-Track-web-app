import { requireUser } from "@/lib/auth";
import { getServerSupabaseFromRequest } from "@/lib/db";

export async function GET(req: Request) {
	const { user, response } = await requireUser(req);
	if (!user) return response as Response;
	const supabase = getServerSupabaseFromRequest(req);
	const { data, error } = await supabase
		.from("budgets")
		.select("id, name, amount, currency, period, category_id, start_date, end_date, alerts_threshold, created_at")
		.eq("user_id", user.id)
		.order("created_at", { ascending: false });
	if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	return new Response(JSON.stringify({ items: data }), { status: 200 });
}

export async function POST(req: Request) {
	const { user, response } = await requireUser(req);
	if (!user) return response as Response;
	const body = await req.json().catch(() => null);
	if (!body || typeof body.name !== "string" || typeof body.amount !== "number") {
		return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400 });
	}
	const supabase = getServerSupabaseFromRequest(req);
	const insert = {
		user_id: user.id,
		name: body.name,
		amount: body.amount,
		currency: body.currency || "INR",
		period: body.period || "monthly",
		category_id: body.category_id ?? null,
		start_date: body.start_date ?? null,
		end_date: body.end_date ?? null,
		alerts_threshold: body.alerts_threshold ?? 80.0,
	};
	const { data, error } = await supabase.from("budgets").insert(insert).select("*").single();
	if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	return new Response(JSON.stringify(data), { status: 201 });
}

export async function PUT(req: Request) {
	const { user, response } = await requireUser(req);
	if (!user) return response as Response;
	const body = await req.json().catch(() => null);
	if (!body || typeof body.id !== "number") {
		return new Response(JSON.stringify({ error: "id required" }), { status: 400 });
	}
	const supabase = getServerSupabaseFromRequest(req);
	const { data, error } = await supabase
		.from("budgets")
		.update({
			name: body.name,
			amount: body.amount,
			currency: body.currency,
			period: body.period,
			category_id: body.category_id,
			start_date: body.start_date,
			end_date: body.end_date,
			alerts_threshold: body.alerts_threshold,
		})
		.eq("id", body.id)
		.eq("user_id", user.id)
		.select("*")
		.single();
	if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	return new Response(JSON.stringify(data), { status: 200 });
}

export async function DELETE(req: Request) {
	const { user, response } = await requireUser(req);
	if (!user) return response as Response;
	const url = new URL(req.url);
	const id = Number(url.searchParams.get("id"));
	if (!id) return new Response(JSON.stringify({ error: "id required" }), { status: 400 });
	const supabase = getServerSupabaseFromRequest(req);
	const { error } = await supabase.from("budgets").delete().eq("id", id).eq("user_id", user.id);
	if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	return new Response(null, { status: 204 });
}
