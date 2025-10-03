import { getServerSupabase } from "./db";

export async function getUserFromRequest(req: Request) {
	const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
	const accessToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
	const supabase = getServerSupabase(accessToken);
	const { data, error } = await supabase.auth.getUser();
	if (error) return null;
	return data.user;
}

export async function requireUser(req: Request) {
	const user = await getUserFromRequest(req);
	if (!user) {
		return { user: null, response: new Response("Unauthorized", { status: 401 }) } as const;
	}
	return { user, response: null as Response | null } as const;
}

