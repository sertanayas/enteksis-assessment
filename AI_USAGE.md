# AI Usage Log

## Project

FlowPilot — ENTEKSIS Take-Home Assessment

## Tools Used

- ChatGPT: requirement analysis, architecture planning, testing strategy, debugging guidance, and delivery planning.
- Codex: code implementation, validation, Supabase integration, debugging, linting, and production build verification.

## 1. Initial Planning

I first broke the assessment into the following requirements:

- Responsive technology-service landing page
- Name, email, service, and description form
- Client-side validation
- Server-side validation
- Persistent database storage
- Clear loading, success, and error states
- Secure handling of database credentials
- Mobile and keyboard accessibility
- README and AI usage documentation

I selected Next.js, TypeScript, Tailwind CSS, Supabase, and Vercel because they allow the frontend, server API, validation, persistence, and deployment to remain simple enough for a small assessment project.

## 2. Initial Implementation

Codex was asked to implement the application inside the existing Next.js project.

I explicitly required:

- Supabase writes to happen only on the server
- The privileged Supabase secret never to be exposed through NEXT_PUBLIC variables
- Zod validation on both client and server
- Success feedback only after a successful database insert
- Accessible form labels and keyboard navigation
- No unnecessary authentication or libraries

Codex implemented the landing page, request form, server route, validation schema, and server-side Supabase helper.

## 3. Database and Security Decision

Supabase Row Level Security was kept enabled, and no public insert policy was created.

Instead of allowing the browser to insert records directly, the form submits to the Next.js server route. The server validates the payload and performs the database operation using a server-only Supabase secret.

This keeps privileged credentials out of client-side JavaScript.

## 4. Debugging a Failed Submission

During manual testing, valid form submissions initially returned HTTP 500.

The UI correctly displayed an error message instead of a false success state.

I used Codex to inspect the server helper and API route. The root cause was an environment-variable naming mismatch: the `.env.local` file and the server helper were using different names for the Supabase server key.

The variable name was corrected without disabling RLS or exposing the secret to the client.

Additional safe server-side diagnostics were also added. The logger reports Supabase error fields such as message, code, details, and hint without printing credentials.

After restarting the Next.js development server, the form submission succeeded.

## 5. Verification

I manually tested:

- Empty required fields
- Invalid email input
- Description length validation
- Valid service selection
- Successful request submission
- Server error feedback
- Persistent database storage in Supabase
- Mobile responsive layout
- Keyboard Tab navigation
- Loading and success states

A successful test submission was verified directly in the Supabase `requests` table.

Codex also ran lint and the production build successfully.

## 6. Final Decision

AI was used to accelerate implementation and debugging, but the final behavior was verified through manual testing, database inspection, linting, and production build checks.

I did not treat generated code as correct until the complete request flow worked from the browser to persistent database storage.
