import { NextResponse } from "next/server";
import { z } from "zod";
import { requestSchema } from "@/lib/request-schema";
import { getSupabaseAdmin, logSupabaseError } from "@/lib/supabase-server";
export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ message: "Send a valid JSON request." }, { status: 400 }); }
  const result = requestSchema.safeParse(body);
  if (!result.success) return NextResponse.json({ message: "Please check the highlighted fields.", errors: z.flattenError(result.error).fieldErrors }, { status: 400 });
  try {
    const { error } = await getSupabaseAdmin().schema("public").from("requests").insert(result.data);
    if (error) {
      logSupabaseError("Request insert failed", error);
      return NextResponse.json({ message: "We couldn’t save your request. Please try again shortly." }, { status: 500 });
    }
    return NextResponse.json({ message: "Your request has been saved. Thanks for telling us about your project!" }, { status: 201 });
  } catch (error) {
    logSupabaseError("Request submission failed", error);
    return NextResponse.json({ message: "We couldn’t save your request. Please try again shortly." }, { status: 500 });
  }
}
