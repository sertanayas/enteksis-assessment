# FlowPilot

A fictional small-business automation service built with Next.js App Router, TypeScript, Tailwind, Zod, and Supabase.

## Run locally

Install dependencies with `npm install`, then run `npm run dev`. On Windows PowerShell, use `npm.cmd` if script execution is restricted.

The existing `.env.local` needs `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Never prefix the service key with `NEXT_PUBLIC_` or commit the environment file. No environment values are included in this repository documentation.

## Submission architecture

- `src/app/page.tsx` renders the responsive landing page as a Server Component.
- `src/components/request-form.tsx` handles client validation, pending state, accessible field errors, and submission feedback.
- `src/lib/request-schema.ts` shares the Zod schema and service choices between the browser and API.
- `src/app/api/requests/route.ts` validates JSON independently and inserts only validated fields into `requests`.
- `src/lib/supabase-server.ts` uses a server-only import guard and the service-role key. It disables session persistence. The server can insert with RLS enabled without a public insert policy.

Names are trimmed and must have 2–100 characters; emails are trimmed, valid, and at most 254 characters. Services must match one of the three options. Descriptions are trimmed and must have 20–5,000 characters. Invalid submissions return HTTP 400; database or configuration failures return a generic HTTP 500 without leaking details. Successful inserts return HTTP 201. Database-generated IDs and timestamps are left to Supabase.

The form retains values after an error, blocks duplicate clicks while pending, and resets only after a successful insert. Requests are not idempotent: retrying after an ambiguous network failure may create a duplicate.

## Verification

Run `npm run lint` and `npm run build`.

Manual checks:
1. Check the layout at narrow mobile and desktop widths, keyboard navigation, visible focus, and CTA scrolling.
2. Submit blank fields, whitespace-only values, a malformed email, and a short description. Check field errors and focus on the first invalid field.
3. Submit a valid request and confirm one matching row exists in Supabase, including generated `id` and `created_at`. Success must appear only after the insert completes.
4. Use browser network throttling to verify the loading state and disabled controls.
5. Simulate a network failure or a database failure in a test environment. Confirm clear error feedback and retained input.
6. Send malformed JSON or an unsupported service directly to `/api/requests`; expect HTTP 400.

No authentication, deployment, or public database policy is added.

## AI usage

See [AI_USAGE.md](AI_USAGE.md) for the planning, implementation, debugging, and verification log.
