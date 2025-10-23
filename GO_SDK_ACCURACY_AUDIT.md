# Go SDK Accuracy Audit Report

**Date:** January 22, 2025
**OpenAPI Version:** v1.0.19
**TypeScript SDK Version:** v1.0.28
**Go SDK Status:** ❌ CRITICAL INACCURACIES FOUND

---

## Executive Summary

Comprehensive audit of Go SDK documentation and code reveals **critical inaccuracies** that break compatibility with OpenAPI v1.0.19 specification. Found **6 major issues** affecting session statuses, node types, and example code.

**Priority:** 🔴 **CRITICAL** - Go SDK is not compatible with current API
**Recommendation:** Immediate update required to bring Go SDK to parity with TypeScript SDK and OpenAPI spec

---

## Issue 1: Wrong Session Status Constants (CRITICAL)

### Location
`go-sdk/models.go` lines 17-23

### Problem
All 5 session status constants are incorrect or non-existent in OpenAPI spec.

### Current Code (WRONG)
```go
// Session statuses
const (
	SessionStatusPending   = "pending"     // ❌ Should be "requiresInput"
	SessionStatusActive    = "active"      // ❌ Should be "processing"
	SessionStatusComplete  = "complete"    // ✅ Correct
	SessionStatusExpired   = "expired"     // ❌ Doesn't exist in spec
	SessionStatusCancelled = "cancelled"   // ❌ Should be "canceled" (one 'l')
)
```

### Correct Code (from OpenAPI v1.0.19)
```go
// Session statuses
const (
	SessionStatusRequiresInput = "requiresInput"
	SessionStatusProcessing    = "processing"
	SessionStatusComplete      = "complete"
	SessionStatusCanceled      = "canceled"
)
```

### Impact
- **BREAKING:** Applications using these constants will fail to match API responses
- **DATA LOSS:** Status checks will always fail for "requiresInput" and "processing" states
- **UNDEFINED BEHAVIOR:** Using non-existent "expired" status

### Reference
- OpenAPI spec: `components/schemas/Session/properties/status/enum`
- Python SDK (correct): `facesign/models/common.py:17-24`
- TypeScript SDK (correct): Matches OpenAPI exactly

---

## Issue 2: Wrong and Missing Node Types (CRITICAL)

### Location
`go-sdk/models.go` lines 26-37

### Problem
5 node types are wrong/deprecated, and 4 required node types are missing entirely.

### Current Code (WRONG)
```go
// Node types for flow-based sessions
const (
	NodeTypeStart            = "start"                 // ✅ Correct
	NodeTypeEnd              = "end"                   // ✅ Correct
	NodeTypeConversation     = "conversation"          // ✅ Correct
	NodeTypeFaceScan         = "face_scan"             // ✅ Correct
	NodeTypeDocumentScan     = "document_scan"         // ✅ Correct
	NodeTypeEmailInput       = "email_input"           // ❌ Should be "enter_email"
	NodeTypeSMSInput         = "sms_input"             // ❌ Doesn't exist
	NodeTypeEmailVerification = "email_verification"   // ❌ Doesn't exist (use two_factor)
	NodeTypeSMSVerification   = "sms_verification"     // ❌ Doesn't exist (use two_factor)
	NodeTypeConditional      = "conditional"           // ❌ Should be "data_validation"
)
```

### Correct Code (from TypeScript SDK/OpenAPI)
```go
// Node types for flow-based sessions
const (
	NodeTypeStart              = "start"
	NodeTypeEnd                = "end"
	NodeTypeConversation       = "conversation"
	NodeTypeLivenessDetection  = "liveness_detection"   // MISSING
	NodeTypeEnterEmail         = "enter_email"          // FIXED (was email_input)
	NodeTypeDataValidation     = "data_validation"      // MISSING (was conditional)
	NodeTypeDocumentScan       = "document_scan"
	NodeTypeRecognition        = "recognition"          // MISSING
	NodeTypeFaceScan           = "face_scan"
	NodeTypeTwoFactor          = "two_factor"           // MISSING
)
```

### Changes Required
**Remove (don't exist):**
- `NodeTypeEmailInput` → use `NodeTypeEnterEmail`
- `NodeTypeSMSInput` → doesn't exist in spec
- `NodeTypeEmailVerification` → use `NodeTypeTwoFactor` with channels: ["email"]
- `NodeTypeSMSVerification` → use `NodeTypeTwoFactor` with channels: ["sms"]
- `NodeTypeConditional` → use `NodeTypeDataValidation`

**Add (missing):**
- `NodeTypeLivenessDetection = "liveness_detection"`
- `NodeTypeDataValidation = "data_validation"`
- `NodeTypeRecognition = "recognition"`
- `NodeTypeTwoFactor = "two_factor"`

### Impact
- **BREAKING:** Flows using deprecated node types will be rejected by API
- **MISSING FEATURES:** Cannot create flows with liveness detection, recognition, or two-factor auth
- **CONFUSION:** Developers misunderstand API capabilities

### Reference
- TypeScript SDK: `src/types/nodes.ts:8-18` (FSNodeType enum)
- Documentation: `docs/src/app/flows/page.mdx:44-88`

---

## Issue 3: Missing `Outcome` Field in Node Struct (CRITICAL)

### Location
`go-sdk/models.go` lines 80-88

### Problem
Node struct is missing required `Outcome` field for FSStartNode. OpenAPI v1.0.19 made this a required field.

### Current Code (INCOMPLETE)
```go
// Node represents a flow node
type Node struct {
	ID          string                 `json:"id"`
	Type        string                 `json:"type"`
	Prompt      string                 `json:"prompt,omitempty"`
	Mode        string                 `json:"mode,omitempty"`
	Outcomes    map[string]string      `json:"outcomes,omitempty"`     // For other nodes
	Transitions []Transition           `json:"transitions,omitempty"`
	Data        map[string]interface{} `json:"data,omitempty"`
	// MISSING: Outcome field for FSStartNode
}
```

### Correct Code
```go
// Node represents a flow node
type Node struct {
	ID          string                 `json:"id"`
	Type        string                 `json:"type"`
	Outcome     string                 `json:"outcome,omitempty"`      // ADD THIS - for FSStartNode
	Prompt      string                 `json:"prompt,omitempty"`
	Mode        string                 `json:"mode,omitempty"`
	Outcomes    map[string]string      `json:"outcomes,omitempty"`     // For other nodes
	Transitions []Transition           `json:"transitions,omitempty"`
	Data        map[string]interface{} `json:"data,omitempty"`
}
```

### Impact
- **VALIDATION ERROR:** FSStartNode without `outcome` field will be rejected by API
- **INCOMPATIBLE:** Cannot create valid flows using Go SDK
- **BREAKING:** All flow examples in Go SDK are invalid

### Reference
- TypeScript SDK: `src/types/nodes.ts:24-28` (FSStartNode interface)
- Documentation: All flow examples updated to include outcome field

---

## Issue 4: Wrong Session Statuses in Advanced Example (HIGH)

### Location
`go-sdk/examples/advanced/main.go` lines 169, 178-179

### Problem
Example code uses wrong session status constants that don't exist in API.

### Current Code (WRONG)
```go
// Line 169
if status.Session.Status == facesign.SessionStatusComplete {  // ✅ Correct
	fmt.Println("\n🎉 Verification completed!")
	// ...
	break
}

// Lines 178-179
if status.Session.Status == facesign.SessionStatusExpired ||    // ❌ Doesn't exist
   status.Session.Status == facesign.SessionStatusCancelled {  // ❌ Wrong spelling
	fmt.Printf("\n❌ Session ended with status: %s\n", status.Session.Status)
	break
}
```

### Correct Code
```go
// Correct status checks using proper constants
if status.Session.Status == facesign.SessionStatusComplete {
	fmt.Println("\n🎉 Verification completed!")
	// ...
	break
}

if status.Session.Status == facesign.SessionStatusCanceled {  // Fixed spelling
	fmt.Printf("\n❌ Session ended with status: %s\n", status.Session.Status)
	break
}

// Note: "expired" status doesn't exist - sessions use "canceled" instead
```

### Impact
- **DOCUMENTATION:** Example code doesn't work as written
- **CONFUSION:** Developers copy broken example code
- **UNDEFINED:** Status checks never match actual API responses

---

## Issue 5: Missing `outcome` in FSStartNode Example (HIGH)

### Location
`go-sdk/examples/advanced/main.go` lines 42-46

### Problem
Start node in flow example is missing required `outcome` field.

### Current Code (INVALID)
```go
flow := &facesign.Flow{
	Nodes: []facesign.Node{
		{
			ID:   "start",
			Type: facesign.NodeTypeStart,
			// MISSING: Outcome field
		},
		// ... rest of nodes
```

### Correct Code
```go
flow := &facesign.Flow{
	Nodes: []facesign.Node{
		{
			ID:      "start",
			Type:    facesign.NodeTypeStart,
			Outcome: "greeting",  // ADD THIS - points to first node
		},
		// ... rest of nodes
```

### Impact
- **API REJECTION:** Flow creation will fail with validation error
- **BROKEN EXAMPLES:** Developers cannot run example code successfully
- **FRUSTRATION:** First experience with Go SDK is failure

### Reference
- All documentation flow examples now include outcome field
- TypeScript SDK examples: All include outcome field

---

## Issue 6: README.md Node Type Reference (MEDIUM)

### Location
`go-sdk/README.md` line 41

### Problem
README example uses legacy module syntax (which is still valid) but doesn't show flow-based example with correct node types.

### Current Code (OUTDATED BUT VALID)
```go
Modules: []facesign.Module{
	{Type: facesign.ModuleIdentityVerification},
},
```

### Recommendation
Add a second example showing modern flow-based approach with correct node types:

```go
// Modern approach: Flow-based session
Flow: &facesign.Flow{
	Nodes: []facesign.Node{
		{
			ID:      "start",
			Type:    facesign.NodeTypeStart,
			Outcome: "liveness",
		},
		{
			ID:   "liveness",
			Type: facesign.NodeTypeLivenessDetection,
			Outcomes: map[string]string{
				"livenessDetected": "end",
				"deepfakeDetected": "end",
				"noFace":          "end",
			},
		},
		{
			ID:   "end",
			Type: facesign.NodeTypeEnd,
		},
	},
	Edges: []facesign.Edge{
		{ID: "e1", Source: "start", Target: "liveness"},
		{ID: "e2", Source: "liveness", Target: "end"},
	},
},
```

---

## Comparison: Python SDK vs Go SDK

### Python SDK - ✅ ACCURATE
- Session statuses: **100% correct**
- Node types: Not applicable (no flow examples)
- Examples: All use modules (valid approach)
- Documentation: Accurate and concise

### Go SDK - ❌ CRITICAL ISSUES
- Session statuses: **0% correct** (4 out of 5 wrong)
- Node types: **60% correct** (6 out of 10 correct, 5 wrong, 4 missing)
- Examples: **Contains invalid code** that will be rejected by API
- Documentation: Outdated and incomplete

---

## Recommended Fixes (Priority Order)

### 🔴 P0 - CRITICAL (Must fix immediately)
1. **Fix session status constants** - All API interactions depend on this
2. **Add missing `Outcome` field to Node struct** - Required for valid flows
3. **Fix advanced example** - Remove references to non-existent statuses

### 🟠 P1 - HIGH (Should fix soon)
4. **Update node type constants** - Remove deprecated, add missing
5. **Fix FSStartNode in advanced example** - Add outcome field
6. **Update all examples** - Use correct node types and statuses

### 🟡 P2 - MEDIUM (Nice to have)
7. **Add flow-based example to README** - Show modern approach
8. **Add validation tests** - Ensure SDK stays in sync with OpenAPI spec

---

## Verification Checklist

After fixes are applied, verify:

- [ ] All session status constants match OpenAPI spec exactly
- [ ] All 10 node types from FSNodeType enum are defined
- [ ] Node struct includes `Outcome` field
- [ ] No references to deprecated node types remain
- [ ] All examples compile and run successfully
- [ ] Examples use only valid session statuses
- [ ] All FSStartNode examples include outcome field
- [ ] README shows both modules and flow-based approaches

---

## Testing Recommendations

1. **Unit Tests:** Add tests that validate constants match OpenAPI spec
2. **Integration Tests:** Create sessions with all node types
3. **Example Tests:** Run all examples in CI/CD pipeline
4. **Schema Validation:** Auto-generate Go structs from OpenAPI spec

---

## References

- **OpenAPI Spec:** `/facesign-api/openapi.yaml` v1.0.19
- **TypeScript SDK (canonical):** `/facesign-api/src/types/nodes.ts`
- **Python SDK (accurate):** `/facesign-api/python-sdk/facesign/models/common.py`
- **Documentation:** `/facesign-api/docs/src/app/api/page.tsx`
- **Flow Examples:** `/facesign-api/docs/src/examples/flows/*.json`

---

## Audit Methodology

This audit was conducted by:
1. Comparing Go SDK constants against OpenAPI v1.0.19 specification
2. Cross-referencing with TypeScript SDK v1.0.28 (source of truth)
3. Validating against Python SDK (recently updated, confirmed accurate)
4. Testing example code against current API requirements
5. Reviewing recent breaking changes (FSStartNode.outcome requirement)

**Audited by:** Claude Code
**Date:** January 22, 2025
**Related Report:** `DOCUMENTATION_ACCURACY_REPORT.md`
