# FlowPilot

A fictional small-business automation service built with Next.js App Router, TypeScript, Tailwind, Zod, and Supabase.

## Run locally

Install dependencies with `npm install`, then run `npm run dev`. On Windows PowerShell, use `npm.cmd` if script execution is restricted.

Create `.env.local` by copying `.env.example`, then fill in `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Never prefix the service key with `NEXT_PUBLIC_` or commit the environment file. No environment values are included in this repository documentation.

Use the base Supabase project URL, without `/rest/v1`. Restart the development server after changing environment variables.

## Database setup

Run [supabase/schema.sql](supabase/schema.sql) in the Supabase SQL editor for a fresh project. It creates `public.requests` with an identity primary key, timestamp default, required fields, length/email/service CHECK constraints, and RLS enabled with no public policies. It does not drop existing data or alter an existing table: for an existing project, review and apply equivalent migrations separately. This hardening pass does not apply SQL to the live database.

Database checks are defense in depth; the shared Zod schema remains the authoritative application validator. Automated tests verify that a 20-character description is accepted, a 19-character description is rejected, and values exceeding the name, email, and description maximum lengths are rejected.

## Architecture / Data Flow

Browser → Next.js Form → `/api/requests` → Zod server validation → Supabase

The form validates before sending; the API validates independently before inserting into `public.requests`. Success is returned only after the database insert succeeds.

- `src/app/page.tsx` renders the responsive landing page as a Server Component.
- `src/components/request-form.tsx` handles client validation, pending state, accessible field errors, and submission feedback.
- `src/lib/request-schema.ts` shares the Zod schema and service choices between the browser and API.
- `src/app/api/requests/route.ts` wires the server-only Supabase adapter to `src/lib/request-handler.ts`, which checks Content-Type, parses JSON, validates independently, and inserts only validated fields into `public.requests`. The handler accepts injected dependencies for offline tests.
- `src/lib/supabase-server.ts` uses a server-only import guard and the service-role key. It disables session persistence. The server can insert with RLS enabled without a public insert policy.

Names are trimmed and must have 2–100 characters; emails are trimmed, valid, and at most 254 characters. Services must match one of the three options. Descriptions are trimmed and must have 20–5,000 characters. Invalid submissions return HTTP 400; database or configuration failures return a generic HTTP 500 without leaking details. Successful inserts return HTTP 201. Database-generated IDs and timestamps are left to Supabase.

Requests without a Content-Type starting with `application/json` return HTTP 415. Unknown input fields, including `id` and `created_at`, are stripped before insertion.

The form retains values after an error, blocks duplicate clicks while pending, and resets only after a successful insert. Requests are not idempotent: retrying after an ambiguous network failure may create a duplicate.

## Security

`SUPABASE_SERVICE_ROLE_KEY` is read only by the server-only Supabase helper and is never exposed to the browser or a `NEXT_PUBLIC_` variable. The browser sends requests to the API rather than writing directly to Supabase. RLS remains enabled, with no public insert policy; privileged inserts happen only after server validation. Error responses are generic, and server diagnostic logging redacts credentials. Keep `.env.local` out of version control.

## Automated tests

Use Node.js 22.18+ (or Node.js 24) for built-in TypeScript support, then run:

```bash
npm test
```

On restricted Windows PowerShell, use `npm.cmd test`. The suite uses Node's built-in test runner and assertions, with no additional dependencies. It imports the existing Zod schema and the same handler used by the API route. TypeScript permits explicit `.ts` imports for this direct Node test setup.

- Schema tests cover exactly 20 description characters, 19 characters, invalid email, each missing field, whitespace-only fields, unknown services, over-maximum name/email/description lengths, and stripping extra fields.
- Handler tests cover malformed JSON and invalid payloads (400), missing/unsupported Content-Type (415), successful inserts (201), returned and thrown insert failures (500), generic error messages, and stripping extra fields before insertion.

Tests use injected insert/logger fakes and do not require environment variables, network access, or database writes. They do not replace manual browser accessibility checks or live Supabase verification.

## Verification

Run `npm test`, `npm run lint`, `npx tsc --noEmit`, and `npm run build`.

Manual checks:
1. Check the layout at narrow mobile and desktop widths, keyboard navigation, visible focus, and CTA scrolling.
2. Submit blank fields, whitespace-only values, a malformed email, and a short description. Check field errors and focus on the first invalid field.
3. Submit a valid request and confirm one matching row exists in Supabase, including generated `id` and `created_at`. Success must appear only after the insert completes.
4. Use browser network throttling to verify the loading state and disabled controls.
5. Simulate a network failure or a database failure in a test environment. Confirm clear error feedback and retained input.
6. Send malformed JSON or an unsupported service directly to `/api/requests`; expect HTTP 400.
7. Verify focus after a server validation error returns to the first invalid field after controls are enabled. Success and other errors should focus the feedback message. Check with a screen reader for duplicate announcements.
8. Simulate an HTML/non-JSON server response. Expect a generic server error, retained input, and enabled controls.

No authentication or public database policy is added. Vercel deployment instructions are provided below.

## Vercel deployment instructions

The production application is deployed manually through Vercel using the connected GitHub repository.

1. Prepare the target Supabase database using the schema above and run all verification commands locally.
2. When ready, import your repository into Vercel, select the Next.js framework, and use the project root. Keep `npm run build` as the build command and choose Node.js 24.x (the project requires Node >=22.18).
3. Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in the project's environment-variable settings. Never add a `NEXT_PUBLIC_` prefix or commit actual values.
4. Set the variables for **Production** to the production Supabase project. Set **Preview** separately, preferably to a separate test Supabase project with the same schema, so preview submissions do not populate production data. Local `.env.local` is not a substitute for Vercel configuration.
5. Deploy a Preview and run the smoke tests below, then deploy Production when ready. Redeploy after changing Vercel environment variables; changes apply to subsequent deployments. See [Vercel environment variables](https://vercel.com/docs/environment-variables) and [managing variables](https://vercel.com/docs/environment-variables/managing-environment-variables).
6. Configure a Vercel Firewall rule to rate-limit `POST /api/requests` by IP. The production setup uses a fixed window of 10 requests per 60 seconds and returns HTTP 429 when the limit is exceeded.
7. After deployment, verify the live form by submitting fictional test data and confirming that the record is persisted in Supabase.

### Post-deployment smoke tests

- Check the page on mobile and desktop, CTA scrolling, labels, Tab navigation, and visible focus.
- Submit invalid values and confirm field errors without a database row. Send non-JSON Content-Type to the API and confirm 415.
- Submit one clearly labeled test request. Confirm loading, then success, focus on feedback, and one matching row in the correct environment's `public.requests` table with generated ID/timestamp.
- In Preview, simulate an unavailable backend or non-JSON error response; confirm generic feedback, retained input, and re-enabled controls. Restore configuration and redeploy as needed.
- Check server logs for useful redacted diagnostics and browser bundles/network responses for absence of the privileged key. Remove test records manually when finished.

## AI usage

See [AI_USAGE.md](AI_USAGE.md) for the planning, implementation, debugging, and verification log.
