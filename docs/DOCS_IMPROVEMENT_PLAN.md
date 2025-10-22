# FaceSign API Documentation Improvement Plan

**Status:** Work in Progress
**Created:** 2025-10-22
**Updated:** 2025-10-22 (Added critical findings)
**Goal:** Standardize UI components, ensure content accuracy, improve junior developer experience, and align guide pages with `/api` page patterns

---

## Executive Summary

### Critical Findings (NEW)

**1. Flows are NOT adequately presented in API Reference:**
- The `/api` page only briefly mentions flows when describing sessions
- **No dedicated Flows section** explaining the node/edge architecture
- No documentation of FSNode types, their properties, or outcomes
- The quickstart shows a flow example without explaining what nodes/edges mean
- Critical gap: Developers reading API docs won't understand how to construct flows

**2. Documentation is NOT adequate for junior developers:**
- **No conceptual overview** - jumps straight into technical implementation
- Missing "How It Works" section explaining the verification journey
- No clear explanation of core relationships: flows → nodes → sessions → verification
- Quickstart assumes prior knowledge of graph-based flow systems
- Lacks progressive disclosure: simple → intermediate → advanced examples

**3. Content scattered across locations:**
- Flow concepts in `/flows` guide but missing from `/api` reference
- Node types listed in guide but not in API reference
- No clear path from "I want to verify users" to "Here's how to build that"

### Current State Analysis

**Two Component Systems Coexist:**
1. **Guide Pages** (`/docs`, `/sessions`, `/flows`, etc.) - Uses Tailwind + Headless UI
   - External tabs above code blocks (`CodeGroup` component)
   - `Row`/`Col` layout divs
   - MDX-based with custom `Properties`, `Property`, `Note`, `Warning` components

2. **API Reference** (`/api`) - Uses Chakra UI v3
   - Inline language switcher inside code block header (Chakra `Select`)
   - `Grid` layout with 45/55 split
   - Split-view: left (description/params), right (code/responses)
   - Dark code blocks (gray.900), light reference tables (gray.50)

**Key Problem:** Guide pages use **external tabs** for language selection, while API page uses **inline switcher** inside code block header. This creates visual inconsistency.

### Desired End State

1. **All pages use Chakra UI components** (no Tailwind/Headless UI mix)
2. **Inline language switcher** in code block headers (no external tabs)
3. **Consistent layout patterns** across all documentation
4. **Content accuracy** verified against `openapi.yaml` and `src/types/nodes.ts`
5. **Component usage guidelines** documented for future development

---

## UI Standardization Guidelines

### Component Usage Matrix

| Purpose | ✅ Use This | ❌ Don't Use This |
|---------|------------|------------------|
| **Code Examples** | `RequestCodeBlock` (Chakra) | `CodeGroup` (Headless UI tabs) |
| **Inline Code** | `CodeBlock.Root` (Chakra) | `Code` component (Tailwind) |
| **Layout Grid** | `Grid` (Chakra) | `Row`/`Col` (Tailwind divs) |
| **Stacks** | `VStack`, `HStack` (Chakra) | Tailwind flex divs |
| **Cards** | `Card.Root` (Chakra) | Custom Tailwind divs |
| **Tabs** | Never for language selection | `TabGroup` (Headless UI) |
| **Tables** | `ReferenceTable` (Chakra) or `Table.Root` | HTML tables |
| **Headings** | `Heading` (Chakra) | `h1`, `h2` tags |
| **Text** | `Text` (Chakra) | `p` tags |
| **Badges** | `Badge` (Chakra) | Custom spans |
| **Alerts** | `Alert` (Chakra) | `Note`/`Warning` components |
| **Separators** | `Separator` (Chakra) | `<hr>` |

### Code Block Standards

**Pattern to Follow** (from `/api` page):

```tsx
import { RequestCodeBlock } from '@/components/chakra/RequestCodeBlock'

<RequestCodeBlock
  method="POST"
  path="/sessions"
  codeExamples={{
    curl: `curl -X POST https://api.dev.facesign.ai/sessions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{...}'`,
    javascript: `const client = new Client({ auth: 'sk_test_...' })
const session = await client.session.create({...})`,
    python: `client = Client(auth='sk_test_...')
session = client.session.create(...)`
  }}
/>
```

**Key Features:**
- Language switcher (Select dropdown) in code block header
- Method badge + path in header
- Copy button in header
- Dark background (gray.800)
- Syntax highlighting via Shiki
- Language preference persisted in localStorage

**Pattern to Remove** (from guide pages):

```tsx
// ❌ OLD: External tabs above code block
<CodeGroup title="Create a session">
  <Code language="javascript">...</Code>
  <Code language="python">...</Code>
</CodeGroup>
```

### Layout Standards

**Split-View Pattern** (for API-style documentation):

```tsx
<Grid
  templateColumns={{ base: '1fr', lg: 'minmax(400px, 45%) minmax(400px, 55%)' }}
  gap={6}
>
  {/* Left Column: Description + Reference Data */}
  <VStack align="stretch" gap={6}>
    <Box>
      <Heading size="lg">Create Session</Heading>
      <Text>Description text...</Text>
    </Box>

    {/* Reference tables with gray.50 background */}
    <ReferenceTable data={parameters} />
  </VStack>

  {/* Right Column: Code Examples */}
  <VStack align="stretch" gap={6}>
    <RequestCodeBlock method="POST" path="/sessions" codeExamples={{...}} />
    <ResponseCodeBlock response={{...}} />
  </VStack>
</Grid>
```

**Simple Flow Pattern** (for guide pages):

```tsx
<VStack align="stretch" gap={8}>
  <Box>
    <Heading size="lg">Session Lifecycle</Heading>
    <Text>Explanation...</Text>
  </Box>

  <RequestCodeBlock method="POST" path="/sessions" codeExamples={{...}} />

  <Alert status="info">
    <Alert.Indicator />
    <Alert.Content>Important note...</Alert.Content>
  </Alert>
</VStack>
```

---

## Content Accuracy Requirements

### Source of Truth Hierarchy

1. **`openapi.yaml`** - PRIMARY SOURCE for:
   - Endpoint paths, methods, parameters
   - Request/response schemas
   - Session statuses: `requiresInput`, `processing`, `complete`, `canceled`
   - Error types: `authentication_error`, `validation_error`, `not_found_error`, `rate_limit_error`, `server_error`
   - Field names, types, descriptions

2. **`src/types/nodes.ts`** - SOURCE for:
   - FSNode types: `START`, `END`, `CONVERSATION`, `LIVENESS_DETECTION`, `DOCUMENT_SCAN`, `RECOGNITION`, `FACE_SCAN`, `ENTER_EMAIL`, `DATA_VALIDATION`, `TWO_FACTOR`
   - Outcome enums (e.g., `FSLivenessDetectionOutcome`)
   - Node properties and structure

3. **`docs/src/examples/*.json`** - Realistic response fixtures

### Common Mistakes to AVOID

❌ **Session Statuses (WRONG):**
- Don't use: `"verified"`, `"failed"`, `"pending"`, `"active"`

✅ **Session Statuses (CORRECT):**
- Use: `requiresInput`, `processing`, `complete`, `canceled`

❌ **Error Types (WRONG):**
- Don't use: `invalid_request_error`, `permission_error`, `resource_not_found`, `api_error`

✅ **Error Types (CORRECT):**
- Use: `authentication_error`, `validation_error`, `not_found_error`, `rate_limit_error`, `server_error`

❌ **Base URLs:**
- Don't default to production URLs in examples

✅ **Base URLs:**
- Always use Dev by default: `https://api.dev.facesign.ai`
- Mention Prod URL separately: `https://api.facesign.ai`

---

## Implementation Plan

### Phase 0: Improve Junior Developer Experience (NEW PRIORITY)

**Goal:** Add conceptual foundation and progressive learning path

#### 0.1 Create "Concepts" Section in Main Docs

- [ ] **Add to `/docs/page.tsx`** - New section before "Installation"
  - [ ] "How FaceSign Works" - Visual diagram + explanation
  - [ ] "Core Concepts" - Sessions, Flows, Nodes, Verification
  - [ ] "Verification Journey" - Step-by-step walkthrough
  - [ ] "Common Use Cases" - KYC, age verification, re-authentication

#### 0.2 Enhance Quickstart with Explanations

- [ ] **Update `/quickstart/page.mdx`**
  - [ ] Add "What are Flows?" callout box before Step 2
  - [ ] Explain nodes and edges with simple diagram
  - [ ] Add commented version of flow JSON
  - [ ] Link to detailed flows guide

#### 0.3 Create Progressive Examples

- [ ] **Simple Flow** (start → email → end)
- [ ] **Intermediate Flow** (start → conversation → document → end)
- [ ] **Advanced Flow** (conditional branching, multiple paths)

### Phase 0.5: Add Flows Section to API Reference (NEW PRIORITY)

**Goal:** Make flows first-class citizens in API documentation

#### 0.5.1 Add Dedicated Flows Section

- [ ] **Update `/api/page.tsx`** - Add new section after Sessions
  - [ ] Flows intro paragraph
  - [ ] Flow structure explanation (nodes + edges)
  - [ ] Visual diagram of flow architecture
  - [ ] Node Types reference table
  - [ ] Code examples for common flows

#### 0.5.2 Create Flow Builder Reference

- [ ] **Node Types Table** with columns:
  - Type (enum value)
  - Description
  - Required fields
  - Outcomes
  - Example usage

- [ ] **Edge Structure** documentation
  - Source/target relationship
  - Conditional transitions
  - Outcome-based routing

#### 0.5.3 Add Flow Examples to Create Session

- [ ] Update Create Session endpoint to show:
  - [ ] Simple flow example (default)
  - [ ] Document verification flow
  - [ ] Multi-factor authentication flow
  - [ ] Link to Flows section for details

### Phase 1: Component Migration (UI Standardization)

**Goal:** Replace all Tailwind/Headless UI components with Chakra UI equivalents

#### 1.1 Create New Chakra Components (if needed)

- [ ] **`DocsCodeBlock.tsx`** - Wrapper around `RequestCodeBlock` for guide page usage
  - Simpler API for common use cases
  - Auto-handles localStorage persistence
  - Supports title/description props

- [ ] **`InfoAlert.tsx`** - Replacement for `Note` component
  - Uses Chakra `Alert` with `info` status
  - Consistent styling with API page

- [ ] **`WarningAlert.tsx`** - Replacement for `Warning` component
  - Uses Chakra `Alert` with `warning` status

- [ ] **`PropertiesTable.tsx`** - Replacement for `Properties`/`Property` components
  - Uses `ReferenceTable` under the hood
  - Renders parameter/field definitions
  - Matches API page styling (gray.50 background)

#### 1.2 Update MDX Provider

- [ ] Update `docs/src/components/mdx.tsx`
  - Remove exports: `CodeGroup`, `Code`, `Row`, `Col`, `Properties`, `Property`, `Note`, `Warning`
  - Add exports: `RequestCodeBlock`, `InfoAlert`, `WarningAlert`, `PropertiesTable`
  - Add Chakra layout exports: `Grid`, `VStack`, `HStack`, `Box`

#### 1.3 Migrate Guide Pages

**Priority Order:**

1. [ ] **`/quickstart`** - Small page, good test case
2. [ ] **`/docs`** (main landing) - High traffic
3. [ ] **`/authentication`** - Simple page
4. [ ] **`/sessions`** - Medium complexity
5. [ ] **`/flows`** - Complex, many code examples
6. [ ] **`/webhooks`** - Medium complexity
7. [ ] **`/errors`** - Simple page
8. [ ] **`/customization`** - Simple page
9. [ ] **Module pages** - Lower priority

**Migration Steps Per Page:**

1. Change file extension from `.mdx` to `.tsx` (if needed)
2. Import Chakra components at top
3. Replace `CodeGroup` → `RequestCodeBlock`
4. Replace `Row`/`Col` → `Grid` with proper columns
5. Replace `Properties`/`Property` → `PropertiesTable`
6. Replace `Note` → `InfoAlert`
7. Replace `Warning` → `WarningAlert`
8. Replace HTML headings → Chakra `Heading`
9. Replace `<p>` → Chakra `Text`
10. Wrap content in `VStack` for proper spacing
11. Test in dev server
12. Verify language switcher works
13. Verify responsive layout

### Phase 2: Content Accuracy Audit

**Goal:** Ensure all claims match source of truth (OpenAPI spec, type definitions)

#### 2.1 Verify Session Documentation

- [ ] **`/docs/page.tsx`**
  - [ ] Check session status examples use correct enums
  - [ ] Verify lifecycle description matches behavior
  - [ ] Update code examples to use Dev URL
  - [ ] Cross-link to `/sessions` and `/api#create-session`

- [ ] **`/sessions/page.mdx`**
  - [ ] Audit lifecycle section
  - [ ] Verify webhook integration examples
  - [ ] Check all status references
  - [ ] Update code examples
  - [ ] Cross-link to Session object page

- [ ] **`/sessions/object/page.mdx`**
  - [ ] Compare all attributes against `openapi.yaml` Session schema
  - [ ] Verify types, required/optional, descriptions
  - [ ] Add missing fields (if any)
  - [ ] Remove hallucinated fields (if any)

- [ ] **`/sessions/client-secret/page.mdx`**
  - [ ] Verify against `openapi.yaml` ClientSecret schema
  - [ ] Check expiry behavior description

#### 2.2 Verify Flow Documentation

- [ ] **`/flows/page.mdx`**
  - [ ] Cross-check all node types against `src/types/nodes.ts`
  - [ ] Verify node type list is complete
  - [ ] Update node descriptions to match source
  - [ ] Verify outcome enum examples
  - [ ] Update code examples

- [ ] **`/flows/fsnode/page.mdx`**
  - [ ] Verify FSNode base structure
  - [ ] Check all node type properties
  - [ ] Verify outcome enums for each type
  - [ ] Ensure no outdated node types listed

- [ ] **`/flows/mapping/page.mdx`**
  - [ ] Verify export/import instructions
  - [ ] Test facesign-create flow → API flow mapping
  - [ ] Update examples if mapping changed

#### 2.3 Verify Error Documentation

- [ ] **`/errors/page.mdx`**
  - [ ] Compare error types against `openapi.yaml` Error schema
  - [ ] Verify error structure examples
  - [ ] Check HTTP status code mappings
  - [ ] Remove any non-existent error types
  - [ ] Add missing error types (if any)

#### 2.4 Verify Webhook Documentation

- [ ] **`/webhooks/page.mdx`**
  - [ ] Verify event type list
  - [ ] Check event payload structure
  - [ ] Document Dev unsigned behavior
  - [ ] Document Prod signed behavior
  - [ ] Cross-link to webhook event type reference

- [ ] **`/webhooks/signed-headers/page.mdx`**
  - [ ] Mark as "Future Feature" if not yet implemented
  - [ ] Or update if implementation exists
  - [ ] Add implementation timeline

#### 2.5 Verify Authentication Documentation

- [ ] **`/authentication/page.mdx`**
  - [ ] Verify bearer token format
  - [ ] Check base URL examples (Dev vs Prod)
  - [ ] Verify API key structure description

### Phase 3: API Page Polish (Stripe Pattern)

**Goal:** Complete the Stripe-style layout for `/api` page

#### 3.1 Add Resource Intro Sections

- [ ] **Sessions Intro**
  - [ ] Add description paragraph before Create Session
  - [ ] Add `EndpointsCard` with links to all session endpoints
  - [ ] Add anchor: `#sessions`

- [ ] **Webhooks Intro**
  - [ ] Add description paragraph before webhook events table
  - [ ] Add anchor: `#webhooks`

- [ ] **Client Secrets Intro** (if needed)
  - [ ] Add description
  - [ ] Add anchor

#### 3.2 Convert Explanatory Sections to Split Layout

- [ ] **Base URL section**
  - [ ] Left column: explanation text
  - [ ] Right column: code literal showing URL

- [ ] **Authentication section**
  - [ ] Left column: explanation text
  - [ ] Right column: auth header example

#### 3.3 Clean Up OpenAPI Renderer

- [ ] Remove all `<OpenApiRenderer />` calls (responses already in right rail)
- [ ] Verify no duplicate response sections

#### 3.4 Update Sidebar

- [ ] Add `#sessions` anchor
- [ ] Add `#webhooks` anchor
- [ ] Add other resource section anchors
- [ ] Test scroll-spy highlighting

### Phase 4: Cross-Link Polish

**Goal:** Ensure seamless navigation between related pages

#### 4.1 Sessions Cross-Links

- [ ] `/docs` → `/sessions` and `/api#create-session`
- [ ] `/sessions` → `/sessions/object`, `/api#sessions`
- [ ] `/sessions/object` → Back to `/sessions`, relevant endpoints
- [ ] `/api` Sessions section → `/sessions` guide

#### 4.2 Flows Cross-Links

- [ ] `/docs` → `/flows`
- [ ] `/flows` → `/flows/fsnode`, `/api#create-session` (flow parameter)
- [ ] `/flows/fsnode` → Back to `/flows`, node type details
- [ ] `/flows/mapping` → `/flows`, facesign-create export docs

#### 4.3 Webhooks Cross-Links

- [ ] `/sessions` → `/webhooks` (event notifications)
- [ ] `/webhooks` → `/api#webhooks`, `/webhooks/signed-headers`
- [ ] `/api` Webhooks section → `/webhooks` guide

#### 4.4 Errors Cross-Links

- [ ] `/docs` → `/errors`
- [ ] `/api` Errors section → `/errors` guide
- [ ] All pages with error examples → `/errors` reference

### Phase 5: Testing & Validation

#### 5.1 Visual Testing

- [ ] Test all pages in dev server (`npm run dev` on port 4002)
- [ ] Verify responsive layout (mobile, tablet, desktop)
- [ ] Check dark mode (if supported)
- [ ] Verify code block syntax highlighting
- [ ] Test language switcher on all code examples
- [ ] Verify localStorage persistence of language preference

#### 5.2 Functional Testing

- [ ] Test all navigation links
- [ ] Test sidebar scroll-spy
- [ ] Test search functionality (FlexSearch)
- [ ] Test copy-to-clipboard buttons
- [ ] Test anchor links within pages

#### 5.3 Accuracy Validation

- [ ] Spot-check 5 random endpoints against `openapi.yaml`
- [ ] Spot-check 5 random node types against `src/types/nodes.ts`
- [ ] Verify all error types match spec
- [ ] Verify all status enums match spec

#### 5.4 Documentation Scripts

- [ ] Regenerate LLM docs: `node docs/scripts/generate-llms.mjs`
- [ ] Verify `docs/public/llms/*.txt` updated
- [ ] Test "Copy for AI" button functionality

### Phase 6: Final Review

- [ ] Review sidebar organization
- [ ] Review page order and flow
- [ ] Check for broken links
- [ ] Check for missing pages
- [ ] Verify all code examples are executable
- [ ] Verify all fixtures are realistic
- [ ] Check for typos/grammar
- [ ] Verify technical accuracy

---

## File Modification Checklist

### New Files to Create

- [ ] `docs/src/components/chakra/DocsCodeBlock.tsx`
- [ ] `docs/src/components/chakra/InfoAlert.tsx`
- [ ] `docs/src/components/chakra/WarningAlert.tsx`
- [ ] `docs/src/components/chakra/PropertiesTable.tsx`

### Files to Modify

**Component Files:**
- [ ] `docs/src/components/mdx.tsx` - Update exports
- [ ] `docs/src/components/Code.tsx` - Mark as deprecated or remove
- [ ] `docs/src/components/chakra/ApiSidebarPro.tsx` - Add anchors

**API Page:**
- [ ] `docs/src/app/api/page.tsx` - Add intro sections, fix layout

**Guide Pages (convert to Chakra):**
- [ ] `docs/src/app/docs/page.tsx` - Already uses Chakra, audit content
- [ ] `docs/src/app/quickstart/page.mdx` → `.tsx`
- [ ] `docs/src/app/sessions/page.mdx` → `.tsx`
- [ ] `docs/src/app/sessions/object/page.mdx` → `.tsx`
- [ ] `docs/src/app/sessions/client-secret/page.mdx` → `.tsx`
- [ ] `docs/src/app/flows/page.mdx` → `.tsx`
- [ ] `docs/src/app/flows/fsnode/page.mdx` → `.tsx`
- [ ] `docs/src/app/flows/mapping/page.mdx` → `.tsx`
- [ ] `docs/src/app/authentication/page.mdx` → `.tsx`
- [ ] `docs/src/app/errors/page.mdx` → `.tsx`
- [ ] `docs/src/app/webhooks/page.mdx` → `.tsx`
- [ ] `docs/src/app/webhooks/signed-headers/page.mdx` → `.tsx`
- [ ] `docs/src/app/customization/page.mdx` → `.tsx`
- [ ] `docs/src/app/modules/*/page.mdx` → `.tsx` (8 module pages)

**Documentation Scripts:**
- [ ] `docs/scripts/generate-llms.mjs` - Verify works after changes

---

## Success Criteria

### UI Consistency
- ✅ All pages use Chakra UI components exclusively
- ✅ No external tabs for language selection
- ✅ All code blocks have inline language switcher
- ✅ Consistent grid layouts
- ✅ Consistent spacing and typography

### Content Accuracy
- ✅ All session statuses match OpenAPI spec
- ✅ All error types match OpenAPI spec
- ✅ All FSNode types match source code
- ✅ All endpoint parameters match OpenAPI spec
- ✅ All code examples use Dev URL by default
- ✅ No hallucinated fields or endpoints

### User Experience
- ✅ Seamless navigation between related pages
- ✅ Clear hierarchy and information architecture
- ✅ Working search functionality
- ✅ Responsive on all devices
- ✅ Fast page loads
- ✅ Copy buttons work on all code blocks
- ✅ Language preference persists

### Developer Experience
- ✅ Clear component usage guidelines
- ✅ Consistent patterns for future pages
- ✅ Easy to maintain
- ✅ Type-safe (TypeScript)
- ✅ Good DX with Chakra UI

---

## Timeline Estimate

**Phase 0 (Junior Developer Experience):** 2 days
- Concepts section: 1 day
- Quickstart enhancement: 0.5 day
- Progressive examples: 0.5 day

**Phase 0.5 (Flows in API Reference):** 1.5 days
- Flows section creation: 1 day
- Node types documentation: 0.5 day

**Phase 1 (UI Standardization):** 3-4 days
- Component creation: 0.5 day
- MDX provider update: 0.5 day
- Page migrations: 2-3 days (20+ pages)

**Phase 2 (Content Audit):** 2-3 days
- Session docs: 0.5 day
- Flow docs: 1 day
- Error/Webhook/Auth docs: 0.5 day
- Cross-checking: 0.5-1 day

**Phase 3 (API Page Polish):** 1 day
- Intro sections: 0.5 day
- Split layouts: 0.25 day
- Cleanup: 0.25 day

**Phase 4 (Cross-Links):** 0.5 day

**Phase 5 (Testing):** 1 day

**Phase 6 (Final Review):** 0.5 day

**Total:** 11.5-13.5 days of focused work (increased from 8-10 days)

---

## Notes

### Language Preference Persistence

Both systems currently persist language preference in localStorage:
- API page: Uses `fs-docs.langs` key
- Guide pages: Uses different key (in `Code.tsx` Zustand store)

**After migration:** Should consolidate to single key (`fs-docs.langs`)

### Responsive Breakpoints

Use Chakra UI breakpoints:
- `base`: Mobile (default)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px (where split-view kicks in)
- `xl`: 1280px
- `2xl`: 1536px

### Color Palette

**Code Blocks:**
- Background: `gray.800` (dark)
- Text: `white`
- Border: `gray.700`

**Reference Tables:**
- Background: `gray.50` (light)
- Border: `gray.200`

**Badges (HTTP methods):**
- GET: `green`
- POST: `blue`
- PUT: `orange`
- PATCH: `purple`
- DELETE: `red`

### Shiki Syntax Highlighting

Uses `shikiAdapter` from `@/lib/shiki-adapter` for all code blocks.

Supported languages:
- `bash` (for curl)
- `javascript`
- `typescript`
- `python`
- `json`
- `yaml`

---

## Future Enhancements

**After Phase 6 completion:**

1. **Interactive Examples**
   - Editable code blocks
   - "Try it" buttons with API key input
   - Live response preview

2. **Advanced Search**
   - Filter by page type
   - Search within code examples
   - Recent searches

3. **Dark Mode**
   - Full dark mode support
   - Automatic theme detection

4. **Code Playground**
   - Embedded CodeSandbox/StackBlitz
   - Runnable examples

5. **Video Tutorials**
   - Embed demo videos
   - Step-by-step walkthroughs

6. **API Changelog**
   - Version comparison
   - Breaking changes highlighted
   - Migration guides
