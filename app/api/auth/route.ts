import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(request: Request) {
  try {
    // validate env early
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error("[api/auth] Missing NEXT_PUBLIC_SUPABASE_URL");
      return NextResponse.json({ error: "Server misconfiguration: missing NEXT_PUBLIC_SUPABASE_URL" }, { status: 500 });
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("[api/auth] Missing SUPABASE_SERVICE_ROLE_KEY");
      return NextResponse.json({ error: "Server misconfiguration: missing SUPABASE_SERVICE_ROLE_KEY" }, { status: 500 });
    }

    // safe JSON parse
    let body: any;
    try {
      body = await request.json();
    } catch (parseErr) {
      console.error("[api/auth] invalid JSON body", parseErr);
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    console.log("[api/auth] incoming body:", body);
    const { email, password, type, name } = body ?? {};

    if (!email || !password) {
      console.warn("[api/auth] Missing email or password", { email, password });
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    if (type === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error("[api/auth] login error:", error);
        return NextResponse.json({ error: error.message || "Login failed", details: error }, { status: 400 });
      }
      return NextResponse.json({ user: data.user, session: data.session });
    }

    if (type === "signup") {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name },
      });

      if (error) {
        console.error("[api/auth] signup error:", error);
        // Map already-registered -> 409 so clients can show a friendly message
        const errMsg = error.message || "Signup failed";
        const isAlready = /already/i.test(errMsg) || (error as any)?.status === 409;
        return NextResponse.json(
          { error: errMsg, code: isAlready ? "USER_EXISTS" : "SIGNUP_ERROR", details: { status: (error as any).status, hint: (error as any).hint } },
          { status: isAlready ? 409 : 400 }
        );
      }

      return NextResponse.json({ user: data.user });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (err: any) {
    console.error("[api/auth] unhandled error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}

// (put inside AuthContext.tsx signup)
// const res = await fetch("/api/auth", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ type: "signup", email, password, name }),
// });
// const json = await res.json();
// if (!res.ok) throw new Error(json.error || "Signup failed");
// return json;
