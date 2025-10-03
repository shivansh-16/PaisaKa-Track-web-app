import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_PROJECT_URL, SUPABASE_SERVICE_ROLE_KEY } from "./constants";

let cachedBrowserClient: SupabaseClient | null = null;

export function getBrowserSupabase(): SupabaseClient {
	if (!SUPABASE_PROJECT_URL || !SUPABASE_ANON_KEY) {
		throw new Error("Supabase URL or Anon Key is not configured");
	}
	if (!cachedBrowserClient) {
		cachedBrowserClient = createClient(SUPABASE_PROJECT_URL, SUPABASE_ANON_KEY);
	}
	return cachedBrowserClient;
}

export function getServerSupabase(accessToken?: string): SupabaseClient {
	if (!SUPABASE_PROJECT_URL) {
		throw new Error("Supabase URL is not configured");
	}
	const serviceOrAnon = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
	if (!serviceOrAnon) {
		throw new Error("Neither Service Role key nor Anon key is configured");
	}
	return createClient(SUPABASE_PROJECT_URL, serviceOrAnon, {
		global: accessToken
			? { headers: { Authorization: `Bearer ${accessToken}` } }
			: undefined,
	});
}

