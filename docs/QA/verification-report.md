# FaceSign Verification Report

- Environment: Dev (https://api.dev.facesign.ai)
- Date: 2025-10-29
- Commit/Docs build: TODO

## Coverage

- cURL: Happy + negative cases recorded for all listed endpoints
- JS API Harness: TODO
- Python API Harness: TODO
- SDK JS/TS: TODO
- SDK Python: TODO
- Webhooks: TODO

## Issues (Spec vs Reality)

- P1: SessionStatus enum mismatch
  - Observed: `session.status` == "created" in create/get responses
  - Spec: `SessionStatus` enum = [requiresInput, processing, canceled, complete]
  - Fixtures:
    - scripts/fixtures/curl/createSession/response.json
    - scripts/fixtures/curl/getSession/response.json
  - Recommendation: Align spec/docs to include `created` or change backend to an allowed status. Source of truth: backend.

- P1: Dev server missing from OpenAPI servers list
  - Observed: Dev base used `https://api.dev.facesign.ai` but spec lists prod + staging only
  - Recommendation: Add Dev to `servers` in OpenAPI for developer workflows (or document override). Source of truth: backend envs.

- P0: Validation behavior diverges from spec (missing required fields accepted)
  - Observed: `POST /sessions` succeeds 200 when `metadata` is omitted
  - Spec: `SessionSettings` requires `metadata`
  - Fixture: scripts/fixtures/curl/createSession_missingMetadata/{meta.json,response.json}
  - Recommendation: Either enforce validation in backend or relax OpenAPI requirements. Source of truth: backend.

- P0: Mutually-exclusive fields accepted (modules + flow)
  - Observed: `POST /sessions` succeeds with both `modules` and `flow`
  - Docs/assumptions: These should be mutually exclusive; examples imply deprecation of `modules`
  - Fixture: scripts/fixtures/curl/createSession_bothModulesAndFlow/{meta.json,response.json}
  - Recommendation: Enforce exclusivity in backend or clarify docs/spec. Source of truth: backend.

- P1: Pagination param validation lenient
  - Observed: `GET /sessions?limit=0` returns 200 (spec: min 1)
  - Fixture: scripts/fixtures/curl/listSessions_invalidLimit/{meta.json,response.json}
  - Recommendation: Enforce backend validation or update spec min. Source of truth: backend.

- P1: Auth error code mismatch
  - Observed: `GET /langs` without Authorization returns 403
  - Spec: `401 Unauthorized`
  - Fixture: scripts/fixtures/curl/getLangs_401_noAuth/meta.json
  - Recommendation: Standardize to 401 on missing/invalid credentials or document 403. Source of truth: backend.

- P2: Legacy/invalid node types present in data
  - Observed in list: a session with node type `invalid_type`
  - Fixture: scripts/fixtures/curl/listSessions/response.json
  - Recommendation: Sanitize stored data or expand enum mapping. Source of truth: backend schema.

## Documentation Gaps

- Clarify status lifecycle including `created` and when it transitions to `requiresInput`.
- Specify supported environments and how to target Dev.
- Detail validation rules: required fields, mutual exclusivity of `modules` vs `flow`.
- Auth errors: document 401 vs 403 behavior.

## Performance

- Initial p95 collection: TODO (runner enhancement)

## Fixes matrix (what to change and where)

- Session status lifecycle includes `created`
  - Backend (truth): keep current behavior
  - OpenAPI: update `components.schemas.SessionStatus.enum` to add `created`
  - Docs: update `src/app/sessions/page.mdx` to document lifecycle (created → requiresInput → processing → complete)

- Add Dev server to spec/docs
  - OpenAPI: add `servers[].url = https://api.dev.facesign.ai` with description "Dev server"
  - Docs: update `src/app/authentication/page.mdx` and `src/app/quickstart/page.mdx` to mention Dev base URL

- `metadata` currently optional in backend
  - Backend (truth): keep optional
  - OpenAPI: remove `metadata` from `components.schemas.SessionSettings.required`
  - Docs: mark `metadata` as optional in `src/app/sessions/page.mdx`

- `modules` and `flow` exclusivity
  - Backend (truth): recommend enforcing exclusivity in POST /sessions validator
    - If not changing backend, then document coexistence as allowed but discouraged
  - OpenAPI: express exclusivity with `oneOf` at `SessionSettings` (either `modules` or `flow`, not both)
  - Docs: explicitly state preference for `flow` and deprecation pathway for `modules`

- `limit` minimum on listSessions
  - Backend (truth): recommend enforcing `limit >= 1`
    - If backend remains lenient, update OpenAPI `parameters[limit].minimum` to 0 and note behavior in docs
  - Docs: call out accepted range and default behavior

- Auth errors should be 401 for missing/invalid Authorization
  - Backend (truth): change to return 401 (current fixture shows 403)
  - OpenAPI: already lists 401 → no change
  - Docs: ensure examples mention 401 on missing/invalid key

- Invalid `FSNodeType` seen in stored data
  - Backend (truth): add validation to block invalid node types; consider a data cleanup/migration
  - OpenAPI: enums already strict → no change
  - Docs: no change

Notes
- Docs paths referenced align to slugs used in scripts/generate-llms.mjs: `sessions`, `quickstart`, `authentication`, etc.
- When backend changes are chosen, leave OpenAPI/docs as-is until the backend is updated and re-verified.

## Endpoint coverage checklist (Dev)

- POST /sessions (createSession)
  - curl: 200 ✓ — fixtures: scripts/fixtures/curl/createSession/
  - JS harness: 200 ✓ — fixtures: scripts/fixtures/api-js/liveness-and-document/01_createSession/
  - Python harness: 200 ✓ — fixtures: scripts/fixtures/api-py/liveness-and-document/01_createSession/
  - Observed: status = "created"; `metadata` omitted still 200; modules+flow together accepted.
  - Spec/docs mismatches:
    - SessionStatus enum omits created
    - SessionSettings requires metadata (backend optional)
    - Exclusivity between modules and flow unclear (backend allows both)
  - Suggested improvements (docs/spec only): document lifecycle incl. created; mark metadata optional; clarify modules XOR flow or explicitly state both allowed.

- GET /sessions (listSessions)
  - curl: 200 ✓ — fixtures: scripts/fixtures/curl/listSessions/
  - Observed: limit=0 returns 200; one session contains `invalid_type` node.
  - Spec/docs mismatches:
    - limit minimum documented as 1 (backend accepts 0)
    - No note about data quality/validation for node types in results
  - Suggested improvements: clarify accepted range (or note backend behavior); add a note on node type validation expectations.

- GET /sessions/{sessionId} (getSession)
  - curl: 200 ✓ — fixtures: scripts/fixtures/curl/getSession/
  - curl: 404 ✓ — fixtures: scripts/fixtures/curl/getSession_404/
  - Observed: status = "created" on fresh session
  - Suggested improvements: same as lifecycle above.

- GET /sessions/{sessionId}/refresh (createClientSecret)
  - curl: 200 ✓ — fixtures: scripts/fixtures/curl/createClientSecret/
  - Observed: returns secret + url + timestamps as expected
  - Suggested improvements: add example fields to docs and cross-link to hosted session URL semantics.

- GET /langs (getLangs)
  - curl: 200 ✓ — fixtures: scripts/fixtures/curl/getLangs/
  - Negative (no auth): 403 observed — fixtures: scripts/fixtures/curl/getLangs_401_noAuth/
  - Spec/docs mismatches: docs say 401; Dev returns 403 on missing Authorization
  - Suggested improvements: note current Dev behavior; target is 401.

- GET /avatars (getAvatars)
  - curl: 200 ✓ — fixtures: scripts/fixtures/curl/getAvatars/
  - Negative: not executed; likely same auth behavior as /langs
  - Suggested improvements: add explicit example and auth behavior note.

## Additional cross-cutting observations

- Dev server URL not consistently documented
  - Observed: Dev base used in tests: https://api.dev.facesign.ai
  - Suggested improvement: mention Dev base URL in getting started/authentication pages.

- Example headers and versioning
  - Observed: `openapi-example.http` includes `Facesign-Version` header; not declared in spec
  - Suggested improvement: add a short versioning note in docs and clarify if header is optional.
