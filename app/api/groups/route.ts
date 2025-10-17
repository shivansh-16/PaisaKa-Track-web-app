import { requireUser } from "@/lib/auth";
import { getServerSupabase } from "@/lib/db";

export async function GET(req: Request) {
  const { user, response } = await requireUser(req);
  if (!user) return response as Response;
  const supabase = getServerSupabase();
  try {
    // 1. Get the list of group IDs where the user is a member
    const { data: memberGroupLinks, error: memberGroupsError } = await supabase
      .from("group_members")
      .select("group_id")
      .eq("user_id", user.id);

    if (memberGroupsError) {
      console.error("Error fetching member groups:", memberGroupsError);
      return new Response(JSON.stringify({ error: memberGroupsError.message }), { status: 500 });
    }

    const memberGroupIds = memberGroupLinks.map((g) => g.group_id);

    // 2. Build the query to fetch groups
    let query = supabase
      .from("groups")
      .select("id, name, description, created_at");

    // Fetch groups where the user is the owner OR is a member
    if (memberGroupIds.length > 0) {
      query = query.or(`owner_id.eq.${user.id},id.in.(${memberGroupIds.join(',')})`);
    } else {
      // If the user is not a member of any group, only fetch groups they own
      query = query.eq("owner_id", user.id);
    }

    const { data, error } = await query;


    if (error) {
      console.error("Error fetching groups:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ items: data }), { status: 200 });
  } catch (error: any) {
    console.error("Unexpected error in /api/groups:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), { status: 500 });
  }
}
