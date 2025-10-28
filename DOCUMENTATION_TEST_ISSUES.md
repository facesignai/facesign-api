# FaceSign API Documentation Testing - Issues Log

**Tester Role**: Junior/New External Developer (no prior FaceSign knowledge)
**Test Date**: 2025-01-27
**API Environment**: Dev (https://api.dev.facesign.ai)
**Documentation Source**: Local docs/ folder

## Testing Rules
1. Don't invent endpoints/params - document unknowns and use conservative placeholders
2. Start with cURL examples before moving to SDKs
3. Document every confusion, guess, or unclear instruction

---

## Issues Encountered

### Issue #1
**Time**: 2025-01-27 11:30
**Page/Section**: Quickstart - Step 1
**Issue Type**: Missing critical information
**Description**: The documentation says to get API key from "FaceSign dashboard (Settings → API Keys)" but doesn't explain how to get access.
**What I Tried**: Looking for a link to the dashboard or signup process
**What Happened**: Had to use the provided test key from .env file instead
**Resolution Found**: API keys must be provisioned by a FaceSign admin. After provisioning, users with access to Flow Builder (https://create.facesign.ai) can see their API key there.
**Severity**: CRITICAL (blocking for new developers)
**Recommendation**: Add a note explaining: "To get an API key, contact a FaceSign administrator for provisioning. Once provisioned, you can access your key at https://create.facesign.ai (Flow Builder)."

### Issue #2
**Time**: 2025-01-27 11:32
**Page/Section**: Quickstart - Step 2
**Issue Type**: Potential confusion
**Description**: The example shows "Bearer $FACESIGN_API_KEY" which might confuse non-technical users about whether to literally use "$FACESIGN_API_KEY" or replace it with actual key
**What I Tried**: N/A
**What Happened**: N/A
**Severity**: Minor
**Questions for Clarification**: Should there be a note explaining to replace $FACESIGN_API_KEY with actual key value?

### Issue #3
**Time**: 2025-01-27 11:35
**Page/Section**: Quickstart - Step 2 Response Example
**Issue Type**: Documentation/API mismatch
**Description**: The documentation shows session status as "requiresInput" but actual API returned "created"
**What I Tried**: Made the exact API call from the quickstart
**What Happened**: Got status "created" instead of "requiresInput"
**Severity**: Major (confusing for developers)
**Questions for Clarification**:
- Is "created" a valid status that should be documented?
- When does status change from "created" to "requiresInput"?

### Issue #4
**Time**: 2025-01-27 11:36
**Page/Section**: Quickstart - Step 2 Response Example
**Issue Type**: Missing fields in documentation
**Description**: The actual API response includes additional fields not shown in the example: avatarId, report (with transcript, lang, nodeReports)
**What I Tried**: Compared actual response to documented example
**What Happened**: Found extra fields in real response
**Severity**: Minor (but could be important for some use cases)
**Questions for Clarification**: Should these fields be documented in the response example?

### Issue #5
**Time**: 2025-01-27 11:37
**Page/Section**: Quickstart - Step 2 Response Example
**Issue Type**: Data type mismatch
**Description**: Documentation shows timestamps as Unix timestamps (e.g., 1705314600) but actual API returns milliseconds (e.g., 1761594651878)
**What I Tried**: Compared timestamp formats
**What Happened**: Different precision levels
**Severity**: Major (could break integrations if developers expect seconds)
**Questions for Clarification**: Should docs clarify timestamp format is milliseconds?

### Issue #6
**Time**: 2025-01-27 11:39
**Page/Section**: Quickstart - Retrieve session section
**Issue Type**: Documentation unclear
**Description**: The docs mention status values (requiresInput, processing, complete, canceled) but the actual API returns "created" which isn't listed
**What I Tried**: Retrieved a freshly created session
**What Happened**: Status is "created" not "requiresInput"
**Severity**: Major (core concept confusion)
**Questions for Clarification**:
- Is there a complete list of all possible statuses?
- What triggers status changes?
- Should "created" be added to the documented list?

### Issue #7
**Time**: 2025-01-27 11:45
**Page/Section**: Flows page
**Issue Type**: Confusing API design
**Description**: The flows page shows examples of creating/getting flows as separate entities, but the quickstart embeds the flow directly in the session creation. Which is the right way?
**What I Tried**: Understanding the relationship between flows and sessions
**What Happened**: Conflicting patterns in documentation
**Severity**: Major (architectural confusion)
**Questions for Clarification**:
- Should flows be created separately and referenced by ID?
- Or should they be embedded in session creation?
- What are the pros/cons of each approach?

### Issue #8
**Time**: 2025-01-27 11:46
**Page/Section**: Flows page - Node types
**Issue Type**: Incomplete documentation
**Description**: Lists node types but doesn't explain what each does or their required properties
**What I Tried**: Looking for details on what "conversation" or "liveness_detection" nodes actually do
**What Happened**: Only see the type names, no descriptions
**Severity**: Major (can't build flows without understanding nodes)
**Questions for Clarification**:
- What does each node type do?
- What properties are required for each?
- Are there examples for each type?

### Issue #9
**Time**: 2025-01-27 11:47
**Page/Section**: Flows page - Minimal flow JSON
**Issue Type**: Unexplained properties
**Description**: Example shows "outcome" and "transitions" properties that weren't explained
**What I Tried**: Understanding what these properties do
**What Happened**: No explanation provided
**Severity**: Major (critical for flow logic)
**Questions for Clarification**:
- What is "outcome" for?
- How do "transitions" work?
- What is "condition" in transitions?

### Issue #10
**Time**: 2025-01-27 11:52
**Page/Section**: API Error Handling
**Issue Type**: Weak validation
**Description**: API accepts invalid node types without error (e.g., "invalid_type")
**What I Tried**: Sending a node with type "invalid_type"
**What Happened**: Session created successfully without validation error
**Severity**: Major (could lead to runtime errors)
**Questions for Clarification**: Should the API validate node types on creation?

### Issue #11
**Time**: 2025-01-27 11:53
**Page/Section**: API Error Handling
**Issue Type**: Missing required field validation
**Description**: API accepts empty body {} without requiring flow
**What I Tried**: POST to /sessions with empty JSON body
**What Happened**: Session created without a flow
**Severity**: Major (unclear what minimum requirements are)
**Questions for Clarification**:
- Is flow optional?
- What are the actual required fields?

### Issue #12
**Time**: 2025-01-27 11:54
**Page/Section**: Error responses
**Issue Type**: API/Documentation mismatch
**Description**: Actual error format doesn't match documentation
**What I Tried**: Using invalid API key
**What Happened**: Got `{"error":"Incorrect api key"}` but docs show `{"error": {"type": "...", "message": "...", "code": "..."}}`
**Severity**: CRITICAL (completely different error structure)
**Questions for Clarification**:
- Is the API using old error format?
- Should docs reflect current API behavior?

### Issue #13
**Time**: 2025-01-27 11:58
**Page/Section**: Error Handling page
**Issue Type**: Missing example
**Description**: Shows validation_error example mentioning "clientReferenceId" is required, but API accepts empty body
**What I Tried**: Sending empty body to /sessions
**What Happened**: Session created successfully, no validation error
**Severity**: Major (misleading about required fields)
**Questions for Clarification**: Are there actually any required fields?

---

## Summary Statistics
- Total Issues Found: 13
- CRITICAL: 2 (Issues #1, #12)
- Major: 9 (Issues #3, #4, #5, #6, #7, #8, #9, #10, #11, #13)
- Minor: 2 (Issues #2, #4)

## Key Themes
1. **Documentation/API Mismatch**: Multiple cases where actual API behavior differs from docs
2. **Missing Information**: Critical details like API key access, node properties, status definitions missing
3. **Weak Validation**: API accepts invalid/empty data without errors
4. **Inconsistent Examples**: Conflicting patterns between quickstart and other pages
5. **Unexplained Concepts**: Core concepts like transitions, outcomes, conditions not explained

## Recommendations for Improvement

### Immediate Fixes Needed
1. **API Key Access**: Add clear instructions about contacting FaceSign admin for provisioning
2. **Error Format**: Update docs to match actual API error format OR fix API to match docs
3. **Session Status**: Document "created" status and explain status transitions
4. **Timestamps**: Clarify that timestamps are in milliseconds, not seconds

### Documentation Enhancements
1. **Node Reference**: Create comprehensive reference with:
   - Description of what each node type does
   - Required and optional properties for each
   - Example usage for each node type
   - Explanation of outcomes and transitions

2. **Flow Architecture**: Explain clearly:
   - When to embed flows vs create separately
   - How edges connect nodes
   - What conditions mean in transitions
   - Best practices for flow design

3. **Validation Rules**: Document:
   - Which fields are actually required
   - What validation the API performs
   - Expected error responses for invalid data

### Developer Experience Improvements
1. **Interactive Examples**: Add runnable examples with real API calls
2. **Troubleshooting Guide**: Common errors and how to fix them
3. **Migration Guide**: For developers moving from embedded to separate flows
4. **Testing Guide**: How to test flows before production

## Conclusion
As a new developer approaching the FaceSign API, I encountered significant obstacles that would prevent successful integration without additional support. The most critical issues are the inability to obtain an API key independently and the mismatch between documented and actual API behavior. While the documentation has good structure and covers many topics, it needs more accuracy, completeness, and clarity to be truly developer-friendly.

## TECHNICAL QUESTIONS FOR DEV TEAM

### Q1: Session Status "created" vs "requiresInput"
**File References:**
- `/facesign-api/src/api-endpoints.ts:62-67` - SessionStatus enum only has: RequiresInput, Processing, Canceled, Complete
- `/facesign-api/openapi.yaml:995-1001` - Same four statuses defined
- `/facesign-api/docs/src/examples/create_session.json:5` - Example shows status: "created"

**Issue:** Dev API returns `"status": "created"` but this value is NOT in:
- SessionStatus enum in `api-endpoints.ts`
- OpenAPI spec SessionStatus schema
- Documentation

**Question:** Is "created" a valid status that should be added to the enum, or should the API return "requiresInput" instead?

### Q2: Error Response Format Discrepancy
**File References:**
- `/facesign-api/openapi.yaml:337-357` - Defines nested error structure
- `/facesign-api/docs/src/app/errors/page.mdx:56-58` - Documents nested format

**Expected format (per OpenAPI):**
```json
{"error": {"type": "authentication_error", "message": "Invalid API key", "code": "invalid_api_key"}}
```

**Actual API response:**
```json
{"error": "Incorrect api key"}
```

**Question:** Which format should be canonical? Should API be updated to match OpenAPI spec or vice versa?

### Q3: Required Fields Not Enforced
**File References:**
- `/facesign-api/openapi.yaml:361-365` - SessionSettings requires clientReferenceId and metadata

**Issue:** API accepts empty body `{}` and creates session successfully, despite OpenAPI marking fields as required.

**Question:** Should API enforce these requirements or should OpenAPI spec be updated to make them optional?

### Q4: Invalid Node Types Accepted
**Test Case:**
```bash
curl -X POST https://api.dev.facesign.ai/sessions \
  -d '{"flow": {"nodes": [{"id": "start", "type": "invalid_type"}]}}'
```

**Result:** Session created with invalid node type, no validation error

**Question:** Should the API validate node types against FSNodeType enum at session creation time?

### Q5: Timestamp Format Documentation
**File References:**
- All examples show milliseconds (e.g., 1761594651878)
- Docs sometimes describe as "Unix timestamp" which typically means seconds

**Question:** Confirm timestamps are always milliseconds and should be documented as "Unix milliseconds"?

### Q6: "created" Status Lifecycle
**Observation:** Sessions start with "created" status

**Questions:**
- What triggers transition from "created" to "requiresInput"?
- Should "created" be added to official status list?
- Is there documentation about status transitions?