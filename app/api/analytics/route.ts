import { requireUser } from "@/lib/auth";
import { getServerSupabase } from "@/lib/db";

export async function GET(req: Request) {
	const { user, response } = await requireUser(req);
	if (!user) return response as Response;
	const supabase = getServerSupabase();
	const totals = await supabase.rpc("sql", { sql: `
		select type, sum(amount)::numeric as total
		from public.transactions where user_id = '${user.id}' group by type
	` });
	const byCategory = await supabase.rpc("sql", { sql: `
		select c.name_en as category, sum(t.amount)::numeric as total
		from public.transactions t
		left join public.categories c on c.id = t.category_id
		where t.user_id = '${user.id}'
		group by c.name_en
	` });
	if (totals.error) return new Response(JSON.stringify({ error: totals.error.message }), { status: 500 });
	if (byCategory.error) return new Response(JSON.stringify({ error: byCategory.error.message }), { status: 500 });
	return new Response(JSON.stringify({ totals: totals.data, byCategory: byCategory.data }), { status: 200 });
}
