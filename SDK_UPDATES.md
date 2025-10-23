# SDK Updates to Match OpenAPI Specification

**Date:** 2025-10-22
**Version:** 1.0.27 → 1.0.28 (recommended version bump)
**Type:** Breaking changes

---

## Summary

Updated `@facesignai/api` SDK to fully align with `openapi.yaml` specification. This includes adding required fields, standardizing naming conventions, and adding comprehensive configuration options.

---

## Breaking Changes

### 1. FSConversationNode: `outcomes` → `transitions`

**Before:**
```typescript
interface FSConversationNode {
  type: FSNodeType.CONVERSATION
  prompt: string
  outcomes: NonEmptyArray<FSConditionalOutcome>
  doesNotRequireReply?: boolean
}
```

**After:**
```typescript
interface FSConversationNode {
  type: FSNodeType.CONVERSATION
  prompt: string
  transitions: NonEmptyArray<FSNodeTransition>  // ⚠️ RENAMED
  doesNotRequireReply?: boolean
}
```

**Migration:**
```typescript
// Before
const node: FSConversationNode = {
  id: 'greet',
  type: FSNodeType.CONVERSATION,
  prompt: 'Hello!',
  outcomes: [{ id: 't1', targetNodeId: 'next', condition: 'true' }]
}

// After
const node: FSConversationNode = {
  id: 'greet',
  type: FSNodeType.CONVERSATION,
  prompt: 'Hello!',
  transitions: [{ id: 't1', targetNodeId: 'next', condition: 'true' }]
}
```

---

### 2. FSDataValidationNode: `outcomes` → `transitions`

**Before:**
```typescript
interface FSDataValidationNode {
  type: FSNodeType.DATA_VALIDATION
  outcomes: NonEmptyArray<FSConditionalOutcome>
  validation: { field: string; action: string; value?: string }
}
```

**After:**
```typescript
interface FSDataValidationNode {
  type: FSNodeType.DATA_VALIDATION
  transitions: NonEmptyArray<FSNodeTransition>  // ⚠️ RENAMED
  validation: { field: string; action: string; value?: string }
}
```

---

### 3. FSFaceScanNode: REQUIRED `mode` field + 13 new fields

**Before:**
```typescript
interface FSFaceScanNode {
  type: FSNodeType.FACE_SCAN
  outcomes: Record<FSFaceScanOutcome, FSNodeId>

  captureInstructions?: string
  requireLivenessChallenge?: boolean  // DEPRECATED
  requireAILivenessCheck?: boolean    // DEPRECATED
  referenceImageKey?: string
  similarityThreshold?: number
  enableSound?: boolean
  enableHaptics?: boolean
}
```

**After:**
```typescript
interface FSFaceScanNode {
  type: FSNodeType.FACE_SCAN
  mode: FSFaceScanMode  // ⚠️ NEW REQUIRED FIELD
  outcomes: Record<FSFaceScanOutcome, FSNodeId>

  // Capture/Compare configuration
  captureInstructions?: string
  saveToField?: string                           // NEW
  requireLiveness?: boolean                      // NEW (replaces deprecated fields)
  referenceImageSource?: FSReferenceImageSource  // NEW
  referenceImageKey?: string
  referenceImageUrl?: string                     // NEW
  similarityThreshold?: number

  // Capture timing and detection
  captureDelay?: number        // NEW (default: 3000ms)
  detectionInterval?: number   // NEW (default: 150ms)

  // Quality thresholds
  qualityThreshold?: number    // NEW (default: 0.7)
  blurThreshold?: number       // NEW (default: 50)
  minFaceSize?: number         // NEW (default: 100px)
  maxFaceSize?: number         // NEW (default: 400px)

  // UI/UX configuration
  enableSound?: boolean        // (default: true)
  enableHaptics?: boolean      // (default: true)

  // Performance
  useWebGL?: boolean           // NEW (default: true)
  maxRetries?: number          // NEW (default: 3)

  // Legacy fields (deprecated, will be removed)
  requireLivenessChallenge?: boolean  // Use requireLiveness instead
  requireAILivenessCheck?: boolean    // Use requireLiveness instead
}
```

**New Enums:**
```typescript
export enum FSFaceScanMode {
  CAPTURE = "capture",  // Capture a new face image
  COMPARE = "compare",  // Compare face to reference image
}

export enum FSReferenceImageSource {
  SESSION = "session",          // From session data
  PROVIDED_DATA = "providedData", // From providedData
  URL = "url",                  // From external URL
}
```

**Migration Examples:**

*Capture mode (simple):*
```typescript
// Before
const node: FSFaceScanNode = {
  id: 'face',
  type: FSNodeType.FACE_SCAN,
  outcomes: { passed: 'end', notPassed: 'retry', cancelled: 'end', error: 'end' },
  requireLivenessChallenge: true,
}

// After
const node: FSFaceScanNode = {
  id: 'face',
  type: FSNodeType.FACE_SCAN,
  mode: FSFaceScanMode.CAPTURE,  // ⚠️ REQUIRED
  outcomes: { passed: 'end', notPassed: 'retry', cancelled: 'end', error: 'end' },
  requireLiveness: true,  // Use this instead of requireLivenessChallenge
}
```

*Compare mode (face matching):*
```typescript
// After (new capability)
const node: FSFaceScanNode = {
  id: 'face_match',
  type: FSNodeType.FACE_SCAN,
  mode: FSFaceScanMode.COMPARE,  // ⚠️ REQUIRED
  referenceImageSource: FSReferenceImageSource.SESSION,
  referenceImageKey: 'idCardPhoto',
  similarityThreshold: 0.85,
  outcomes: { passed: 'verified', notPassed: 'failed', cancelled: 'end', error: 'end' },
}
```

---

## Non-Breaking Changes

### 4. FSEnterEmailNode: Added optional `transitions` field

**Before:**
```typescript
interface FSEnterEmailNode {
  type: FSNodeType.ENTER_EMAIL
  outcomes: Record<FSEnterEmailOutcome, FSNodeId>
}
```

**After:**
```typescript
interface FSEnterEmailNode {
  type: FSNodeType.ENTER_EMAIL
  outcomes: Record<FSEnterEmailOutcome, FSNodeId>
  transitions?: FSNodeTransition[]  // NEW (optional)
}
```

**Usage:** Allows conditional branching based on email validation.

---

### 5. New Type Alias: `FSNodeTransition`

Added for OpenAPI compatibility:

```typescript
// FSNodeTransition is an alias for FSConditionalOutcome
export type FSNodeTransition = FSConditionalOutcome

export interface FSConditionalOutcome {
  id: string
  targetNodeId: string
  condition: string
}
```

---

### 6. NodeReports: Unified TwoFactor types

**Before:**
```typescript
export type TwoFactorEmailNodeReport = NodeReportBase & {
  type: FSNodeType.TWO_FACTOR_EMAIL  // ❌ Didn't exist
  outcome: FSTwoFactorOutcome
  report?: TwoFactorReport
}

export type TwoFactorSMSNodeReport = NodeReportBase & {
  type: FSNodeType.TWO_FACTOR_SMS  // ❌ Didn't exist
  outcome: FSTwoFactorOutcome
  report?: TwoFactorReport
}
```

**After:**
```typescript
export type TwoFactorNodeReport = NodeReportBase & {
  type: FSNodeType.TWO_FACTOR  // ✅ Matches nodes.ts
  outcome: FSTwoFactorOutcome
  report?: TwoFactorReport
}
```

---

## Configuration Changes

### tsconfig.json

Updated to only compile SDK source files (not docs):

```json
{
  "compilerOptions": { ... },
  "include": ["src/**/*"]  // NEW: Only compile SDK
}
```

---

## Documentation Updates

### Updated Files:

1. **`docs/src/app/flows/page.mdx`**
   - Added FSFaceScanNode `mode` field documentation
   - Added capture vs compare mode examples
   - Updated field descriptions to match new SDK
   - Added `requireLiveness` (deprecated `requireLivenessChallenge`)

2. **`docs/src/app/flows/mapping/page.mdx`**
   - Already used `transitions` - now aligned with SDK

---

## Testing Checklist

- [x] SDK builds successfully (`npm run build`)
- [x] TypeScript compilation passes (no errors)
- [x] Documentation builds successfully
- [x] nodeReports.ts updated for TwoFactor unification
- [ ] Unit tests updated (if any exist)
- [ ] Integration tests with Dev API
- [ ] Version bump to 1.0.28 in package.json

---

## Files Modified

### SDK Source (`/src`):
- `src/types/nodes.ts` - Updated FSConversationNode, FSDataValidationNode, FSFaceScanNode, FSEnterEmailNode
- `src/types/nodeReports.ts` - Unified TwoFactorNodeReport

### Configuration:
- `tsconfig.json` - Added `include: ["src/**/*"]`

### Documentation (`/docs`):
- `docs/src/app/flows/page.mdx` - Updated FSFaceScanNode documentation

---

## Migration Guide

### For Existing Users:

1. **Update FSConversationNode:**
   ```diff
   const node: FSConversationNode = {
     id: 'greet',
     type: FSNodeType.CONVERSATION,
     prompt: 'Hello!',
   - outcomes: [...],
   + transitions: [...],
   }
   ```

2. **Update FSDataValidationNode:**
   ```diff
   const node: FSDataValidationNode = {
     id: 'validate',
     type: FSNodeType.DATA_VALIDATION,
     validation: { field: 'age', action: '>=', value: '18' },
   - outcomes: [...],
   + transitions: [...],
   }
   ```

3. **Update FSFaceScanNode (REQUIRED):**
   ```diff
   const node: FSFaceScanNode = {
     id: 'face',
     type: FSNodeType.FACE_SCAN,
   + mode: FSFaceScanMode.CAPTURE,  // ⚠️ REQUIRED
     outcomes: { ... },
   - requireLivenessChallenge: true,
   + requireLiveness: true,
   }
   ```

### For New Users:

Use the updated examples in the documentation:
- See `docs/src/app/flows/page.mdx` for comprehensive node examples
- See `docs/src/app/flows/mapping/page.mdx` for flow structure examples

---

## Deprecation Warnings

The following fields are deprecated and will be removed in a future version:

- `FSFaceScanNode.requireLivenessChallenge` → Use `requireLiveness` instead
- `FSFaceScanNode.requireAILivenessCheck` → Use `requireLiveness` instead

---

## Next Steps

1. **Version bump:** Update `package.json` version to `1.0.28`
2. **Changelog:** Add entry to `CHANGELOG.md`
3. **Testing:** Verify all examples work against Dev API
4. **Publish:** `npm publish` to release updated SDK
5. **Notify users:** Send migration guide to existing SDK users

---

## Alignment Status

✅ **SDK now fully aligned with OpenAPI spec** (openapi.yaml v1.0.18)

All 10 node types verified:
- ✅ FSStartNode (kept `outcome` field - useful in practice)
- ✅ FSEndNode
- ✅ FSConversationNode (now uses `transitions`)
- ✅ FSLivenessDetectionNode
- ✅ FSEnterEmailNode (added optional `transitions`)
- ✅ FSDataValidationNode (now uses `transitions`)
- ✅ FSDocumentScanNode
- ✅ FSRecognitionNode
- ✅ FSFaceScanNode (added REQUIRED `mode` + 13 fields)
- ✅ FSTwoFactorNode

See `OPENAPI_SDK_AUDIT.md` for detailed analysis.
