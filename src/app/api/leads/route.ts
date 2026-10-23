import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, message } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Attempt to persist in Supabase if credentials exist
    try {
      const supabase = await createClient();
      await supabase.from("leads").insert([
        {
          name,
          phone: phone || "",
          email,
          message: message || "",
          status: "new",
        },
      ]);
    } catch (dbErr) {
      // Non-blocking: continue even if DB is offline or table uninitialized
      console.warn("Could not save lead to Supabase:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Lead received successfully",
      data: body,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request payload" },
      { status: 400 }
    );
  }
}
