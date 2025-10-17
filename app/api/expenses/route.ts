import { requireUser } from "@/lib/auth";
import { getServerSupabase } from "@/lib/db";

export async function GET(req: Request) {
  const { user, response } = await requireUser(req);
  if (!user) return response as Response;
  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit") || 25), 100);
  const supabase = getServerSupabase();
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select(`
        id,
        type,
        amount,
        currency,
        category_id,
        payment_method,
        note,
        occurred_at,
        title,
        user_id,
        categories (
          id,
          name_en,
          name_hi
        )
      `)
      .eq("user_id", user.id)
      .order("occurred_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching expenses:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ items: data }), { status: 200 });
  } catch (error: any) {
    console.error("Unexpected error in /api/expenses:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), { status: 500 });
  }
}

export async function POST(req: Request) {
  const { user, response } = await requireUser(req);
  if (!user) return response as Response;
  const body = await req.json().catch(() => null);
  
  if (!body || typeof body.amount !== "number" || !body.type) {
    return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400 });
  }
  
  // Additional validation to check for NaN values
  if (isNaN(body.amount)) {
    return new Response(JSON.stringify({ error: "Invalid amount value" }), { status: 400 });
  }
  
  // Additional validation to ensure amount is positive
  if (body.amount <= 0) {
    return new Response(JSON.stringify({ error: "Amount must be greater than zero" }), { status: 400 });
  }
  const supabase = getServerSupabase();
  try {
    let categoryId = body.category ?? null;

    // If category is a string, attempt to resolve it to an ID
    if (typeof body.category === 'string') {
      // Determine which column to query based on language
      const language = body.language || 'en';
      const columnName = language === 'hi' ? 'name_hi' : 'name_en';
      
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq(columnName, body.category);

      if (categoryError) {
        console.error("Error fetching category ID:", categoryError);
        return new Response(JSON.stringify({ error: "Invalid category" }), { status: 400 });
      }

      // Check if we found any matching categories
      if (categoryData && categoryData.length > 0) {
        categoryId = categoryData[0].id;
      } else {
        // If no exact match found, try to find by English name as fallback
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('categories')
          .select('id')
          .eq('name_en', body.category);
        
        if (!fallbackError && fallbackData && fallbackData.length > 0) {
          categoryId = fallbackData[0].id;
        } else {
          // If still not found, create a new category or return error
          return new Response(JSON.stringify({ error: "Category not found" }), { status: 400 });
        }
      }
    }

    const insert = {
      user_id: user.id,
      type: body.type,
      amount: body.amount,
      currency: body.currency || "INR",
      category_id: categoryId,
      payment_method: body.payment_method ?? null,
      note: body.note ?? null,
      occurred_at: body.occurred_at || new Date().toISOString(),
      title: body.title ?? null,
    };
    const { data, error } = await supabase.from("transactions").insert(insert).select("*").single();

    if (error) {
      console.error("Error adding expense:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error: any) {
    console.error("Unexpected error in /api/expenses POST:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), { status: 500 });
  }
}
