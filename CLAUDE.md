# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This repository contains:
- **`@facesignai/api`** - TypeScript SDK for the FaceSign identity verification API
- **`docs/`** - Next.js documentation site using Protocol template with Chakra UI v3
- **`python-sdk/`** and **`go-sdk/`** - Additional language SDK implementations
- **`openapi.yaml`** - OpenAPI 3.0.3 specification (source of truth for API contract)

## Development Commands

### TypeScript SDK (@facesignai/api)

```bash
# Build
npm run build              # Compiles TypeScript to build/
npm run clean              # Remove build artifacts

# Quality
npm run lint              # Run prettier + eslint + cspell
npm run prettier          # Format code
npm test                  # Run Jest tests
npx tsc --noEmit         # Type check without emit

# OpenAPI
npm run openapi:generate  # Generate openapi.json from openapi.yaml
```

### Documentation Site (docs/)

```bash
cd docs

npm run dev               # Dev server on port 4002
npm run build             # Production build
npm run start             # Start production server on port 4002
npm run lint              # Next.js linter

# Back to root for LLM docs generation
cd ..
node scripts/generate-llms.mjs  # Generate public/llms/*.txt
```

## Architecture

### SDK Structure

The TypeScript SDK follows an endpoint-based architecture:

- **`src/client.ts`** - Main `Client` class with namespaced methods (`session`, `langs`, `avatars`)
- **`src/api-endpoints.ts`** - Endpoint definitions with path/query/body parameter specs
- **`src/types/`** - Domain-organized type definitions:
  - `nodes.ts` - Flow node types (`FSNode`, `FSNodeType`, outcome enums)
  - `customization.ts` - UI customization options
  - `docScanning.ts`, `nodeReports.ts`, `videoAIAnalysis.ts`, `webhooks.ts`, `errors.ts`

### Node-Based Flow System

FaceSign uses a **node-graph architecture** for verification flows.

**Node Types** (`FSNodeType` enum in `src/types/nodes.ts`):
- `START` / `END` - Required flow entry/exit points
- `CONVERSATION` - AI conversational interaction
- `LIVENESS_DETECTION` - Deepfake/liveness check
- `DOCUMENT_SCAN` - ID document scanning (BlinkID)
- `RECOGNITION` - 1:N face recognition
- `FACE_SCAN` - 1:1 face matching/capture
- `ENTER_EMAIL` - Email input collection
- `DATA_VALIDATION` - Conditional validation
- `TWO_FACTOR` - SMS/Email OTP verification

**Key Patterns**:
- Each node type has specific outcome enums (e.g., `FSLivenessDetectionOutcome`)
- Use `NonEmptyArray<T>` for arrays requiring at least one element
- All nodes extend `FSNodeBase` with `id` and `type`
- Conditional branches use `FSConditionalOutcome`

### Documentation Site Architecture

**Chakra UI v3**:

- **MDX content** - All docs in `.mdx` files under `docs/src/app/`
- **FlexSearch** - Powers global search (`⌘K`)
- **Shiki** - Syntax highlighting
- **Port 4002** - To avoid conflicts with other services

Page structure:
- `/api` - API reference with Stripe-style split layout
- `/docs` - Main landing page
- `/quickstart` - Getting started
- `/sessions`, `/flows`, `/webhooks` - Domain guides

## Documentation UI Guidelines - CRITICAL

### Chakra Pro Components - ALWAYS USE FIRST

**Before creating ANY new UI component:**

1. **FIRST**: Check Chakra Pro using MCP tools:
   ```
   mcp__chakra-ui__list_components
   mcp__chakra-ui__list_component_templates
   mcp__chakra-ui__get_component_example
   mcp__chakra-ui__get_component_props
   ```

2. **SECOND**: If no appropriate Chakra Pro component exists, **ASK THE USER** before:
   - Using Chakra community components
   - Creating custom UI components

Chakra Pro MCP is installed and available. Common components include:
- Layout: `grid`, `stack`, `hstack`, `vstack`, `container`, `card`
- Typography: `heading`, `text`, `code`, `code-block`
- Data: `table`, `data-list`, `stat`, `badge`
- Feedback: `alert`, `toast`, `skeleton`, `progress`
- Navigation: `tabs`, `breadcrumb`, `pagination`
- Overlays: `dialog`, `drawer`, `popover`, `tooltip`
- Charts: `area-chart`, `bar-chart`, `line-chart`, `pie-chart`

### Stripe-Style Layout Pattern

The `/api` page uses a **consistent split-column layout**:

**1. DARK CODE BLOCKS (bg: gray.900)** - "Copy This Code"
- Executable snippets (cURL, JS, Python, JSON responses)
- Use `CodeBlock.Root` with dark background

**2. LIGHT GRAY CONTAINERS (bg: gray.50)** - "Reference This Info"
- Reference data (endpoint tables, error codes, event types)
- Use `ReferenceTable` or `Card.Root` with gray.50 background

**3. WHITE BACKGROUND** - "Read This Explanation"
- Prose, conceptual explanations, guides

**Grid Layout**:
```tsx
<Grid
  templateColumns={{ base: '1fr', lg: 'minmax(400px, 45%) minmax(400px, 55%)' }}
  gap={6}
>
  {/* Left: Description + Reference */}
  {/* Right: Code examples */}
</Grid>
```

## Accuracy Requirements - CRITICAL

### Source of Truth Hierarchy

1. **`openapi.yaml`** - PRIMARY SOURCE for:
   - All endpoint paths, methods, parameters
   - Request/response schemas
   - Session statuses: `requiresInput`, `processing`, `complete`, `canceled`
   - Error types: `authentication_error`, `validation_error`, `not_found_error`, `rate_limit_error`, `server_error`
   - Field names, types, descriptions

2. **`src/types/nodes.ts`** - SOURCE for:
   - All `FSNode` types and structure
   - All outcome enums
   - Node properties

3. **`docs/src/examples/*.json`** - Realistic response examples

### Verification Checklist

Before committing documentation changes, verify:
- [ ] Session statuses match `openapi.yaml` SessionStatus enum
- [ ] Error types match `openapi.yaml` Error schema enum
- [ ] FSNode types match `src/types/nodes.ts` FSNodeType enum
- [ ] Endpoint parameters match OpenAPI spec exactly
- [ ] Code examples use Dev base URL: `https://api.dev.facesign.ai`
- [ ] No hallucinated endpoints or fields
- [ ] Cross-links point to correct anchors

### Common Mistakes to AVOID

❌ **Session Statuses**:
- Don't use "verified"/"failed" (NOT in spec)
- Use: `requiresInput`, `processing`, `complete`, `canceled`

❌ **Error Types**:
- Don't use `invalid_request_error` (use `validation_error`)
- Don't use `permission_error` (NOT in spec)
- Don't use `resource_not_found` (use `not_found_error`)
- Don't use `api_error` (use `server_error`)

❌ **Other**:
- Don't invent fields not in OpenAPI spec
- Don't use Production URLs in examples (default to Dev)

## Code Style

From `.prettierrc`:
- No semicolons
- Single quotes
- Arrow parens: avoid
- Trailing commas: ES5
- Line endings: LF

ESLint:
- TypeScript strict mode
- Unused vars OK if prefixed with `_`
- Smart-tabs mode

## Key Files

- **`openapi.yaml`** - API contract source of truth (OpenAPI 3.0.3)
- **`src/types/nodes.ts`** - Flow node type definitions
- **`src/api-endpoints.ts`** - Endpoint specs
- **`src/client.ts`** - SDK Client class
- **`docs/src/app/api/page.tsx`** - Main API reference page
- **`docs/src/components/chakra/`** - Custom Chakra components

## Integration with Larger FaceSign Ecosystem

This SDK (`@facesignai/api`) is the **canonical type definition layer** for all FaceSign applications:

- **facesign-create** (Flow Builder) - Uses SDK types for node/flow configuration
- **facesign-ff** (Backend) - Uses SDK types to process sessions and validate data
- **facesign** (Frontend) - Uses SDK types to interpret backend responses

**Best Practice**: When changing `@facesignai/api`, update all consumers. Use `yarn link` for local dev.

## Documentation Workflow

When updating docs:

1. **Read the source** - Check `openapi.yaml` and `src/types/` for accurate info
2. **Use Chakra Pro** - Check MCP tools before creating custom UI
3. **Verify fixtures** - Use real examples from `docs/src/examples/`
4. **Test locally** - Run on port 4002
5. **Regenerate LLMs** - Run `node scripts/generate-llms.mjs` if content changed
6. **Cross-links** - Verify anchors point to correct sections

## Testing

- Jest configured for SDK tests (place in `test/` directory)
- Python/Go SDKs have separate test suites

## Version Management

- SDK version in `package.json`
- API version header: `Facesign-Version: 2024-12-18` (in client.ts)
- Changes documented in `CHANGELOG.md`
- Recent breaking change (v1.0.18): Two-Factor Auth field standardization

## SDK Usage Pattern

```typescript
const client = new Client({
  auth: 'sk_test_...',
  timeoutMs: 10000,
  logLevel: ILogLevel.DEBUG
})

await client.session.create({ flow: [...] })
await client.session.retrieve({ sessionId: '...' })
await client.session.list({ status: 'complete' })
await client.langs.retrieve()
await client.avatars.retrieve()
```
