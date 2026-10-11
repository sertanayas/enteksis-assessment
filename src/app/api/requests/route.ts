import { createRequestHandler } from "@/lib/request-handler";
import { getSupabaseAdmin, logSupabaseError } from "@/lib/supabase-server";

export const POST = createRequestHandler({
  insert: (payload) => getSupabaseAdmin().schema("public").from("requests").insert(payload),
  logError: logSupabaseError,
});
