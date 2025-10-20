# FaceSign Docs – Content and Veracity (Chakra Pro) Plan v2

### Confirmed direction

- UI/UX is now Chakra Pro (no Redoc). Keep using Chakra Pro blocks; ask you before any custom/community component.
- Reference lives at `/api` (Chakra split view). Docs home is `/docs`; `/` should redirect to `/docs`.
- Default examples use Dev `https://api.dev.facesign.ai`; production is noted sparingly.
- Scope: absolute accuracy across ALL content (guides + reference prose + examples), plus resolving any API vs docs drift. SDKs later.

### What’s done

- New Chakra split view for `api#create-session` acts as the pattern.
- Single left nav; links fixed; service worker/manifest cleaned; spec mirrors in `docs/public/openapi.yaml`.

### Content-first IA (for this phase)

- `/` → redirect to `/docs`
- `/docs`
- Quickstart (Dev): create session → client secret → open hosted URL
- Concepts: Sessions; Flows (FSFlow + nodes/outcomes); Authentication; Errors
- Guides: Webhooks; Sandbox → Production (facesign-create export → FSFlow import)
- `/api`
- Endpoint pages in Chakra split view; params/description on left; tabs for curl/Node/Python/Go; responses from fixtures

### Veracity approach (expanded)

1) Full content audit matrix

- Inventory every content source: `docs/src/app/docs/**`, `docs/src/app/api/**`, and any reference prose/MDX.
- For each page/section: map every claim (fields, enums, error types, example shapes) to ground truth in `openapi.yaml` and `src/api-endpoints.ts` + `src/types/**`.
- Produce a change list per page: edits required (remove, rewrite, or confirm as accurate).

2) API/code reconciliation (one-off)

- Endpoints/verbs/status codes/params, including defaults/ranges and query names
- Models/enums: `FSNodeType`, `FSDocumentType`, `FSTwoFactor*`, `SessionStatus`, `Zone`, `ClientSecret`, etc.
- Auth scheme and server URLs
- Resolve deltas: update content and, where necessary, propose spec/code edits (but we won’t change code/spec in this phase unless you approve).

3) Runtime fixtures (Dev only)

- For each endpoint in spec: record 200 + one representative 4xx with sanitized JSON; save to `docs/src/examples/`.
- Use fixtures for response blocks and for Quickstart; ensure consistency with spec fields.

4) Chakra reference generator (to eliminate drift)

- Build a small OpenAPI → Chakra renderer that:
- Generates the parameters table and status code list
- Injects code samples (curl/Node/Python/Go) and fixture-based responses
- Use it to render all endpoints under `/api` so prose can stay concise and never contradict the spec.

5) Guides/content rewrites

- Quickstart: 3-step, Dev URLs, fixture-backed
- Sessions concept: lifecycle + `SessionStatus` (requiresInput/processing/canceled/complete), minimal `report` overview
- Flows concept: confirm current API supports FSFlow (exists in spec/types); remove any “/flows” endpoints unless they truly exist; include FSNode mapping
- Authentication: bearer key format; Dev/Prod base URLs (Dev default); brief key hygiene
- Errors: standardize on OpenAPI `error.type` taxonomy (auth/validation/not_found/rate_limit/server); align examples
- Webhooks: confirm in code/types how signatures are sent and verify; document event list and signature verification sample
- Sandbox → Production: facesign-create flow export → API FSFlow import; include a small translation snippet if builder JSON differs from FSFlow

6) Home redirect

- Add `/` → `/docs` redirect (no hero in this phase)

7) Polish (post content lock)

- Spacing/typography fine-tune; optionally add Copy‑page and `llms.txt` later

### Updated To‑dos

- [x] Chakra split-view baseline (create-session)
- [x] Build content audit matrix (every doc page vs spec/types) and mark inaccuracies
- [ ] Reconcile OpenAPI ↔ code (endpoints, params, enums, errors) and produce delta list
- [ ] Record fixtures (Dev) for all endpoints and wire into examples
- [ ] Implement OpenAPI→Chakra renderer for params/status codes + sample tabs
- [ ] Expand `/api` pages using the renderer for all endpoints
- [x] Rewrite Quickstart (fixture-backed)
- [ ] Concepts: Sessions, Flows, Authentication, Errors
- [ ] Guide: Webhooks (confirm support + signatures and document)
- [ ] Guide: Sandbox → Production (facesign-create → FSFlow + snippet)
- [x] Implement `/` → `/docs` redirect
- [ ] Content polish after lock; decide on Copy‑page/`llms.txt`

### 7 clarifying questions

1) Confirm `/api` should fully replace the prior `/api-reference` path everywhere (I’ll update any remaining links).
2) For code sample tabs: curl, Node (fetch/axios?), Python (requests), Go (http stdlib) — is this the set you want?
3) Prefer showing auth as literal `Authorization: Bearer <API_KEY>` or `.env` var interpolation in samples?
4) If we find endpoints present in code but absent in spec (e.g., `/flows`), should we hide them in docs or include a clearly labeled “beta/internal” section pending spec update?
5) Webhooks: should we include sample delivery retries/backoff expectations, or keep it minimal for now?
6) Do you want a minimal “Try in Dev” note on each page (just a curl snippet) or keep the reference purely descriptive?
7) Any specific Chakra Pro components you want used for the in-page nav/TOC and code tabs (so I don’t pick a non-preferred block)?

### To-dos

- [ ] Merge latest `flow_builder` into `api_docs` via refresh PR
- [x] Unify spec: copy root openapi.yaml → docs/public and generate JSON
- [ ] Write one-off script to hit staging and save sanitized fixtures
- [x] Implement split-view, params tables, response preview in ApiEndpoint
- [ ] Add sticky section header and auto-advancing left nav
- [ ] Add Copy Page to clipboard as markdown across pages
- [ ] Generate downloadable llms.txt from spec and quickstart
- [x] Rewrite Quickstart to 3-step hello world with code blocks
- [x] Render 6 endpoints from OpenAPI with verified examples
- [ ] Author Flow Builder → FSFlow mapping and promotion checklist
- [ ] Finalize styles, responsiveness, accessibility, and copy
- [ ] Open PR to api_docs, verify Vercel preview, address feedback
- [ ] Sketch endpoint harness for later (not executed now)
- [ ] Draft developer task sheet template (later phase)
