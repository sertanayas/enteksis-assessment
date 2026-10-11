import "server-only";
import { createClient } from "@supabase/supabase-js";

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error("Missing server environment variable: SUPABASE_URL.");
  if (!key) throw new Error("Missing server environment variable: SUPABASE_SERVICE_ROLE_KEY.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
}

// Log only diagnostic fields, never the client, request, headers, or credentials.
export function logSupabaseError(context: string, error: unknown) {
  const diagnostic = error && typeof error === "object" ? error : {};
  const redact = (value: unknown) => {
    if (typeof value !== "string") return null;
    let text = value;
    for (const secret of [process.env.SUPABASE_SERVICE_ROLE_KEY, process.env.SUPABASE_URL]) {
      if (secret) text = text.split(secret).join("[REDACTED]");
    }
    return text
      .replace(/sb_(?:secret|publishable)_[A-Za-z0-9_-]+/g, "[REDACTED]")
      .replace(/Bearer\s+\S+/gi, "Bearer [REDACTED]");
  };
  console.error(context, {
    message: redact("message" in diagnostic ? diagnostic.message : null),
    code: redact("code" in diagnostic ? diagnostic.code : null),
    details: redact("details" in diagnostic ? diagnostic.details : null),
    hint: redact("hint" in diagnostic ? diagnostic.hint : null),
  });
}
