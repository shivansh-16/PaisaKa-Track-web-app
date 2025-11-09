import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
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
    let body: { email?: string; password?: string; type?: string; name?: string; phone?: string };
    try {
      body = await request.json();
    } catch (parseErr) {
      console.error("[api/auth] invalid JSON body", parseErr);
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    console.log("[api/auth] incoming request type:", body?.type);
    const { email, password, type, name, phone } = body ?? {};

    if (!email || !password) {
      console.warn("[api/auth] Missing email or password");
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    if (type === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error("[api/auth] login error:", error.message);
        return NextResponse.json({ error: error.message || "Login failed" }, { status: 400 });
      }
      console.log("[api/auth] login successful for user:", data.user.id);
      return NextResponse.json({ 
        user: data.user, 
        session: data.session,
        success: true 
      });
    }

    if (type === "signup") {
      // Create user with admin API
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { 
          name: name || email.split('@')[0],
          phone: phone || null,
          language: 'en'
        },
      });

      if (error) {
        console.error("[api/auth] signup error:", error.message);
        // Map already-registered -> 409 so clients can show a friendly message
        const errMsg = error.message || "Signup failed";
        const isAlready = /already/i.test(errMsg) || (error as { status?: number })?.status === 409;
        return NextResponse.json(
          { 
            error: errMsg, 
            code: isAlready ? "USER_EXISTS" : "SIGNUP_ERROR"
          },
          { status: isAlready ? 409 : 400 }
        );
      }

      console.log("[api/auth] signup successful, user created:", data.user.id);

      // After successful signup, sign the user in to get a session
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        console.error("[api/auth] auto-login after signup failed:", signInError.message);
        // User was created but auto-login failed - still return success
        return NextResponse.json({ 
          user: data.user,
          success: true,
          message: "Account created successfully. Please login."
        });
      }

      console.log("[api/auth] auto-login successful");
      return NextResponse.json({ 
        user: signInData.user,
        session: signInData.session,
        success: true 
      });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (err: unknown) {
    console.error("[api/auth] unhandled error:", err);
    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
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
