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

## 7. Independent Code Review with Claude Code

After the initial implementation and automated testing, I used Claude Code as an independent reviewer rather than as an implementation agent.

The review focused on:

- Browser → API → validation → Supabase data flow
- Server/client boundaries
- Secret handling
- Supabase RLS assumptions
- Validation consistency
- Error handling and false-success risks
- Accessibility and keyboard behavior
- Automated test coverage
- README accuracy
- Vercel deployment risks

Claude identified no Critical issues, but highlighted several Important areas for improvement.

I accepted the findings that directly improved the assessment requirements:

- Added a reproducible `supabase/schema.sql`
- Added API route behavior tests
- Added exact validation boundary tests
- Improved focus and accessibility behavior
- Added JSON Content-Type enforcement
- Added `.env.example`
- Expanded Vercel deployment documentation
- Documented the server-only Supabase secret architecture

I intentionally did not implement unrelated refactors or extra product features that would increase complexity without improving the assessment requirements.

## 8. Hardening Pass with Codex

After reviewing Claude's findings, I used Codex to implement the selected improvements.

The hardening pass added:

- Database schema and RLS definition
- Additional validation constraints
- API success and failure tests
- Extra-field stripping tests
- Accessibility and focus improvements
- Content-Type validation
- Safer client-side error handling
- Vercel deployment instructions
- Node version requirements
- Environment variable template

Final automated verification:

- `npm test`: 24/24 tests passed
- `npm run lint`: passed
- `npx tsc --noEmit`: passed
- `npm run build`: passed

## 9. Final Independent Review

Claude Code performed a second review after the hardening changes.

The second review confirmed:

- No Critical findings
- Correct browser → API → validation → Supabase flow
- Server-only secret handling
- No false-success path
- Validation consistency
- Correct RLS architecture
- All 24 automated tests passing
- Lint, TypeScript, and production build passing

The only remaining deployment-level item was rate limiting on the public POST endpoint, which is planned as a Vercel Firewall configuration rather than an application-code change.

## 10. Final Verification Approach

The final application was verified through a combination of:

- Automated tests
- Manual validation testing
- Successful Supabase persistence
- Mobile responsive checks
- Keyboard Tab navigation
- Independent AI code review
- Linting
- TypeScript checking
- Production build verification

AI tools were used to accelerate implementation, debugging, and review, but technical decisions were validated through testing and observed system behavior before acceptance.