# OpenAPI vs SDK Audit Report

Generated: 2025-10-22

## Executive Summary

Audited `openapi.yaml` (API specification) against `/src/types/nodes.ts` (SDK implementation) to identify discrepancies. Found **7 critical discrepancies** affecting 6 out of 10 node types, including 2 breaking issues.

**Critical Issues:**
1. **FSFaceScanNode missing REQUIRED `mode` field** - Sessions will fail validation
2. **Field naming inconsistency** - `transitions` vs `outcomes` affects FSConversationNode and FSDataValidationNode

**Status:** 3/10 node types fully aligned, 4/10 have critical issues, 3/10 have minor gaps.

---

## Node-by-Node Comparison

### 1. FSStartNode ⚠️ DISCREPANCY

**OpenAPI (lines 486-494):**
- Required: `id`, `type`
- Properties: `type: "start"`
- **No outcome field defined**

**SDK (nodes.ts:24-27):**
```typescript
interface FSStartNode extends FSNodeBase {
  type: FSNodeType.START
  outcome: FSNodeId  // ⚠️ NOT IN OPENAPI
}
```

**Issue:** SDK has `outcome` field that OpenAPI doesn't define.

**Impact:** SDK more permissive than spec. Sessions work but not documented in API.

**Recommendation:** Add `outcome: string` to OpenAPI spec (required field). This field is used in practice to define the next node after start.

---

### 2. FSEndNode ✓ ALIGNED

**OpenAPI (lines 495-502):**
- Required: `id`, `type`
- Properties: `type: "end"`

**SDK (nodes.ts:107-109):**
```typescript
interface FSEndNode extends FSNodeBase {
  type: FSNodeType.END
}
```

**Status:** Perfect match.

---

### 3. FSConversationNode 🔴 CRITICAL

**OpenAPI (lines 504-522):**
- Required: `prompt`, **`transitions`**
- Field: `transitions: FSNodeTransition[]`
- Optional: `doesNotRequireReply`

**SDK (nodes.ts:35-40):**
```typescript
interface FSConversationNode extends FSNodeBase {
  type: FSNodeType.CONVERSATION
  prompt: string
  outcomes: NonEmptyArray<FSConditionalOutcome>  // ⚠️ NOT transitions
  doesNotRequireReply?: boolean
}
```

**Issue:** Field naming - OpenAPI uses `transitions`, SDK uses `outcomes`.

**Impact:** Breaking. Sessions created with SDK won't validate against OpenAPI spec.

**Recommendation:** Standardize on `outcomes` pattern (used in SDK + 6 other node types). Update OpenAPI to use `outcomes` instead of `transitions`.

---

### 4. FSLivenessDetectionNode ✓ ALIGNED

**OpenAPI (lines 535-550):**
- Required: `outcomes`
- Field: `outcomes: object` (maps outcome to node ID)

**SDK (nodes.ts:48-51):**
```typescript
interface FSLivenessDetectionNode extends FSNodeBase {
  type: FSNodeType.LIVENESS_DETECTION
  outcomes: Record<FSLivenessDetectionOutcome, FSNodeId>
}
```

**Status:** Aligned. SDK provides stronger typing with Record and enum.

---

### 5. FSEnterEmailNode ⚠️ DISCREPANCY

**OpenAPI (lines 551-569):**
- Required: `outcomes`
- Fields: `outcomes: object`, **`transitions: FSNodeTransition[]`** (optional)

**SDK (nodes.ts:57-60):**
```typescript
interface FSEnterEmailNode extends FSNodeBase {
  type: FSNodeType.ENTER_EMAIL
  outcomes: Record<FSEnterEmailOutcome, FSNodeId>
  // ⚠️ MISSING: transitions field
}
```

**Issue:** SDK missing optional `transitions` field that OpenAPI defines.

**Impact:** Can't use conditional transitions with email entry node.

**Recommendation:** Either add `transitions` to SDK, or remove from OpenAPI if not supported.

---

### 6. FSDataValidationNode 🔴 CRITICAL

**OpenAPI (lines 570-597):**
- Required: **`transitions`**, `validation`
- Field: `transitions: FSNodeTransition[]`
- **No outcomes field**

**SDK (nodes.ts:62-70):**
```typescript
interface FSDataValidationNode extends FSNodeBase {
  type: FSNodeType.DATA_VALIDATION
  outcomes: NonEmptyArray<FSConditionalOutcome>  // ⚠️ NOT transitions
  validation: {
    field: string
    action: string
    value?: string
  }
}
```

**Issue:** Field naming - OpenAPI uses `transitions`, SDK uses `outcomes`.

**Impact:** Breaking. Same issue as FSConversationNode.

**Recommendation:** Update OpenAPI to use `outcomes` instead of `transitions`.

---

### 7. FSDocumentScanNode ⚠️ MINOR

**OpenAPI (lines 598-626):**
- Required: `scanningMode`, `allowedDocumentTypes`, `outcomes`
- Fields: `showTorchButton`, `showCameraSwitch`
- **No `showMirrorCameraButton`**

**SDK (nodes.ts:96-105):**
```typescript
interface FSDocumentScanNode extends FSNodeBase {
  type: FSNodeType.DOCUMENT_SCAN
  scanningMode: FSDocumentScanMode
  allowedDocumentTypes: FSDocumentType[]
  outcomes: Record<FSDocumentScanOutcome, FSNodeId>
  showTorchButton?: boolean
  showCameraSwitch?: boolean
  showMirrorCameraButton?: boolean  // ⚠️ NOT IN OPENAPI
}
```

**Issue:** SDK has `showMirrorCameraButton` field not in OpenAPI.

**Impact:** Low. Feature exists in SDK but undocumented in API spec.

**Recommendation:** Add `showMirrorCameraButton` to OpenAPI if feature is supported.

---

### 8. FSRecognitionNode ✓ ALIGNED

**OpenAPI (lines 647-661):**
- Required: `outcomes`
- Field: `outcomes: object`

**SDK (nodes.ts:78-81):**
```typescript
interface FSRecognitionNode extends FSNodeBase {
  type: FSNodeType.RECOGNITION
  outcomes: Record<FSRecognitionOutcome, FSNodeId>
}
```

**Status:** Aligned. SDK provides stronger typing.

---

### 9. FSFaceScanNode 🔴🔴 CRITICAL - MAJOR GAP

**OpenAPI (lines 662-726):**
```yaml
FSFaceScanNode:
  required:
    - mode        # ⚠️ REQUIRED!
    - outcomes
  properties:
    type: face_scan
    mode:         # ⚠️ REQUIRED!
      type: string
      enum: [capture, compare]
    outcomes: object
    captureInstructions: string
    saveToField: string
    requireLiveness: boolean
    referenceImageSource:
      enum: [session, providedData, url]
    referenceImageKey: string
    referenceImageUrl: string
    similarityThreshold: number (0-1)
    captureDelay: integer (default 3000)
    detectionInterval: integer (default 150)
    qualityThreshold: number (default 0.7)
    blurThreshold: number (default 50)
    minFaceSize: integer (default 100)
    maxFaceSize: integer (default 400)
    enableSound: boolean (default true)
    enableHaptics: boolean (default true)
    useWebGL: boolean (default true)
    maxRetries: integer (default 3)
```

**SDK (nodes.ts:118-132):**
```typescript
interface FSFaceScanNode extends FSNodeBase {
  type: FSNodeType.FACE_SCAN
  outcomes: Record<FSFaceScanOutcome, FSNodeId>

  // ⚠️ MISSING: mode field (REQUIRED by OpenAPI!)

  // Capture configuration (always used)
  captureInstructions?: string
  requireLivenessChallenge?: boolean     // ⚠️ NOT IN OPENAPI
  requireAILivenessCheck?: boolean       // ⚠️ NOT IN OPENAPI
  referenceImageKey?: string             // ✓ MATCHES
  similarityThreshold?: number           // ✓ MATCHES

  // Advanced configuration
  enableSound?: boolean                   // ✓ MATCHES
  enableHaptics?: boolean                 // ✓ MATCHES

  // ⚠️ MISSING from SDK (11 fields):
  // - saveToField
  // - requireLiveness
  // - referenceImageSource
  // - referenceImageUrl
  // - captureDelay
  // - detectionInterval
  // - qualityThreshold
  // - blurThreshold
  // - minFaceSize
  // - maxFaceSize
  // - useWebGL
  // - maxRetries
}
```

**Issues:**
1. **SDK missing REQUIRED `mode` field** - Sessions will fail validation
2. SDK missing 11 optional fields from OpenAPI
3. SDK has 2 fields (`requireLivenessChallenge`, `requireAILivenessCheck`) not in OpenAPI

**Impact:**
- **BREAKING:** Cannot create valid face_scan nodes without `mode`
- **Feature Gap:** Cannot configure face scanning behavior (quality, size, performance)
- **Undocumented:** SDK features don't appear in API spec

**Recommendation:**
1. **Immediate:** Add REQUIRED `mode` field to SDK
2. Add all 11 missing fields from OpenAPI to SDK
3. Either add the 2 SDK-only fields to OpenAPI, or remove from SDK
4. Version bump SDK to indicate breaking change

---

### 10. FSTwoFactorNode ✓ ALIGNED

**OpenAPI (lines 733-788):**
- Required: `channels`, `contactSource`, `outcomes`
- 15 total fields

**SDK (nodes.ts:152-183):**
```typescript
interface FSTwoFactorNode extends FSNodeBase {
  type: FSNodeType.TWO_FACTOR
  outcomes: Record<FSTwoFactorOutcome, FSNodeId>
  channels: FSTwoFactorChannel[]
  contactSource: FSTwoFactorContactSource
  staticEmail?: string
  staticPhone?: string
  emailTemplate?: string
  smsTemplate?: string
  otpLength?: number
  expirySeconds?: number
  maxAttempts?: number
  resendAfterSeconds?: number
  showUI?: boolean
  testMode?: { enabled: boolean; email?: string; phone?: string }
}
```

**Status:** Perfect match. All 15 fields aligned.

---

## Summary of Discrepancies

### 🔴 Critical (Breaking Changes)

| Issue | Nodes Affected | OpenAPI | SDK | Impact |
|-------|---------------|---------|-----|--------|
| **Missing REQUIRED `mode`** | FSFaceScanNode | REQUIRES `mode: "capture" \| "compare"` | No `mode` field | Sessions fail validation |
| **Field naming: `transitions` vs `outcomes`** | FSConversationNode, FSDataValidationNode | Uses `transitions` | Uses `outcomes` | Sessions won't validate |

**Total:** 2 critical issues affecting 3 node types

---

### ⚠️ Medium (Missing Features)

| Issue | Node | Impact |
|-------|------|--------|
| FSStartNode extra field | FSStartNode | SDK has `outcome`, OpenAPI doesn't |
| Missing `transitions` field | FSEnterEmailNode | Can't use conditional transitions |
| FSFaceScanNode missing 11 fields | FSFaceScanNode | Can't configure face scan behavior |

**Total:** 3 issues affecting 3 node types

---

### 📝 Low (Documentation Gaps)

| Issue | Node | Impact |
|-------|------|--------|
| Extra `showMirrorCameraButton` | FSDocumentScanNode | SDK feature not in spec |
| 2 extra fields | FSFaceScanNode | `requireLivenessChallenge`, `requireAILivenessCheck` not in spec |

**Total:** 2 issues affecting 2 node types

---

## Node Alignment Status

| Node Type | Status | Issue |
|-----------|--------|-------|
| FSStartNode | ⚠️ Minor | SDK has extra `outcome` field |
| FSEndNode | ✅ Aligned | Perfect match |
| FSConversationNode | 🔴 Critical | Field naming: transitions vs outcomes |
| FSLivenessDetectionNode | ✅ Aligned | Perfect match |
| FSEnterEmailNode | ⚠️ Medium | Missing `transitions` field |
| FSDataValidationNode | 🔴 Critical | Field naming: transitions vs outcomes |
| FSDocumentScanNode | ⚠️ Minor | Extra `showMirrorCameraButton` |
| FSRecognitionNode | ✅ Aligned | Perfect match |
| FSFaceScanNode | 🔴🔴 Critical | Missing REQUIRED `mode` + 11 fields |
| FSTwoFactorNode | ✅ Aligned | Perfect match |

**Summary:** 4 aligned ✅ | 3 minor ⚠️ | 3 critical 🔴

---

## Recommendations

### 1. Immediate Actions (Critical)

#### Fix FSFaceScanNode (REQUIRED for spec compliance)

Add to `/src/types/nodes.ts`:

```typescript
export enum FSFaceScanMode {
  CAPTURE = "capture",
  COMPARE = "compare",
}

export enum FSReferenceImageSource {
  SESSION = "session",
  PROVIDED_DATA = "providedData",
  URL = "url",
}

export interface FSFaceScanNode extends FSNodeBase {
  type: FSNodeType.FACE_SCAN
  mode: FSFaceScanMode  // ⚠️ ADD THIS (REQUIRED)
  outcomes: Record<FSFaceScanOutcome, FSNodeId>

  // Existing fields
  captureInstructions?: string
  referenceImageKey?: string
  similarityThreshold?: number
  enableSound?: boolean
  enableHaptics?: boolean

  // ADD THESE from OpenAPI:
  saveToField?: string
  requireLiveness?: boolean
  referenceImageSource?: FSReferenceImageSource
  referenceImageUrl?: string
  captureDelay?: number
  detectionInterval?: number
  qualityThreshold?: number
  blurThreshold?: number
  minFaceSize?: number
  maxFaceSize?: number
  useWebGL?: boolean
  maxRetries?: number

  // DECISION NEEDED: Keep or remove these?
  requireLivenessChallenge?: boolean  // Not in OpenAPI
  requireAILivenessCheck?: boolean    // Not in OpenAPI
}
```

#### Standardize Field Naming

**Option A:** Update OpenAPI to use `outcomes` (Recommended)

Rationale: SDK already uses `outcomes` in 8/10 node types. Changing SDK would be more disruptive.

Update in `openapi.yaml`:
- FSConversationNode: Change `transitions` → `outcomes` (line 510)
- FSDataValidationNode: Change `transitions` → `outcomes` (line 574)
- Remove `FSNodeTransition` schema (not used elsewhere)

**Option B:** Update SDK to use `transitions`

Less preferred due to:
- Requires changing 2 node types + all consuming code
- `outcomes` is more semantic for conditional branching
- Most nodes already use `outcomes` pattern

---

### 2. Medium Priority (Feature Completeness)

#### Add `outcome` to FSStartNode in OpenAPI

```yaml
FSStartNode:
  allOf:
    - $ref: '#/components/schemas/FSNodeBase'
    - type: object
      required:
        - outcome
      properties:
        type:
          type: string
          enum: [start]
        outcome:
          type: string
          description: Target node ID to transition to after start
```

#### Align FSEnterEmailNode

Add `transitions` to SDK if conditional logic is supported:

```typescript
export interface FSEnterEmailNode extends FSNodeBase {
  type: FSNodeType.ENTER_EMAIL
  outcomes: Record<FSEnterEmailOutcome, FSNodeId>
  transitions?: FSConditionalOutcome[]  // Add if supported
}
```

Or remove from OpenAPI if not implemented.

---

### 3. Low Priority (Documentation)

#### Document FSDocumentScanNode

Add to `openapi.yaml`:

```yaml
showMirrorCameraButton:
  type: boolean
  default: true
  description: Show mirror camera button in UI
```

#### Document FSFaceScanNode SDK fields

Add to `openapi.yaml` if features exist:

```yaml
requireLivenessChallenge:
  type: boolean
  description: Require interactive liveness challenge
requireAILivenessCheck:
  type: boolean
  description: Enable AI-based liveness detection
```

---

### 4. Long-Term Alignment Strategy

1. **Use OpenAPI as source of truth**
   - OpenAPI defines the API contract
   - SDK should implement exactly what OpenAPI specifies
   - No SDK-only features unless documented in OpenAPI

2. **Generate SDK types from OpenAPI**
   - Use `openapi-typescript` or similar tool
   - Auto-generate TypeScript types from `openapi.yaml`
   - Eliminates manual sync issues

3. **Add validation tests**
   ```typescript
   // Test that SDK types match OpenAPI spec
   describe('OpenAPI Alignment', () => {
     it('FSFaceScanNode has required mode field', () => {
       const node: FSFaceScanNode = { /* ... */ }
       expect(node.mode).toBeDefined()
     })
   })
   ```

4. **Version SDK with API spec**
   - SDK version should match OpenAPI version
   - Breaking changes = major version bump
   - Current: OpenAPI v1.0.18, SDK should align

---

## Testing Checklist

Before deploying fixes:

- [ ] Add `mode` field to FSFaceScanNode interface
- [ ] Add 11 missing FSFaceScanNode fields
- [ ] Update FSConversationNode in OpenAPI (transitions → outcomes)
- [ ] Update FSDataValidationNode in OpenAPI (transitions → outcomes)
- [ ] Add `outcome` to FSStartNode in OpenAPI
- [ ] Test session creation with face_scan nodes
- [ ] Verify OpenAPI validation passes
- [ ] Update documentation to reflect changes
- [ ] Version bump SDK (breaking change)

---

## Files to Update

### SDK Changes (`/src/types/nodes.ts`):
- Add `FSFaceScanMode` enum
- Add `FSReferenceImageSource` enum
- Update `FSFaceScanNode` interface with 13 new fields

### OpenAPI Changes (`/openapi.yaml`):
- Line 510: FSConversationNode `transitions` → `outcomes`
- Line 574: FSDataValidationNode `transitions` → `outcomes`
- Line 486-494: FSStartNode add `outcome` field (required)
- Line 620-625: FSDocumentScanNode add `showMirrorCameraButton`
- Remove `FSNodeTransition` schema if no longer used

### Documentation Changes:
- flows/fsnode/page.mdx: Update examples to use `outcomes`
- flows/mapping/page.mdx: Update examples to use `outcomes`

---

**Report Generated:** 2025-10-22
**Auditor:** Claude Code
**Scope:** Complete audit of all 10 FSNode types in openapi.yaml vs /src/types/nodes.ts
