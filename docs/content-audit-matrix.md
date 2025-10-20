# Content Audit Matrix (spec ↔ code ↔ docs)

Legend: [OK] accurate; [FIX] needs change; [CHK] investigate in code

## Reference (/api)

- Sessions
  - Create Session [OK]
    - Body fields: clientReferenceId, metadata, flow (FSFlow) [OK]
    - Response: { session, clientSecret } [OK]
  - Get Session [OK]
    - Path: /sessions/{id} [OK]
    - Response: { session, clientSecret } [OK]
  - List Sessions [OK]
    - Query: limit, cursor, flowId, clientReferenceId, status, fromDate, toDate, sortBy, sortOrder, search, includeTotal [OK]
    - Response: { sessions[], nextCursor?, totalCount?, hasMore } [OK]
- Flows [FIX]
  - No standalone /flows endpoints in OpenAPI; replaced with concept note using Session.settings.flow [DONE]
- Auth/Base URL [OK]
  - Dev default base https://api.dev.facesign.ai [OK]

## Docs (/docs)

- Quickstart [FIX]
  - Ensure steps and examples use Dev base and match Create Session/Client Secret shapes
- Concepts
  - Sessions [CHK]
    - Status values: requiresInput | processing | canceled | complete (align text/examples)
    - Report fields listed as optional and non-normative
  - Flows [OK]
    - FSFlow and node mapping aligns with components/schemas/FSNode and FSNodeType
    - Emphasize no /flows REST; configured via Session.settings.flow
  - Authentication [OK]
    - Bearer header, Dev/Prod servers
  - Errors [CHK]
    - Align to components/responses and Error schema: authentication_error, validation_error, not_found_error, rate_limit_error, server_error
- Guides
  - Webhooks [FIX]
    - Dev: no signature header currently; verify by fetching session using event.sessionId
    - Update examples accordingly; note that signed headers may be added later
  - Sandbox → Production [FIX]
    - facesign-create export → API FSFlow import; add minimal translation snippet if needed

## Spec ↔ Code Deltas (initial)

- Flows REST endpoints: Not in spec, removed from /api page [DONE]
- Webhook signature header: not defined in code/types; confirm with backend [CHK]

## Fixture Coverage Plan (Dev)

Endpoints to record:
- POST /sessions (200, 400)
- GET /sessions (200)
- GET /sessions/{id} (200, 404)
- GET /sessions/{sessionId}/refresh (200, 404)
- GET /langs (200)
- GET /avatars (200)


