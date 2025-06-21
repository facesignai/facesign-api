# Python SDK Testing Issues Found

**Test Date:** 2025-06-20  
**Test Environment:** Live API  
**API Key:** 1f04ddd7-a5de-6390-9184-34999250a419

## Critical Issues Found

### 1. **API Authentication - HTTP 403 Forbidden**
- **Issue:** All API calls return HTTP 403 "Incorrect api key"
- **Impact:** Cannot test any functionality against live API
- **Possible Causes:**
  - API key format may be incorrect
  - API key may not be properly activated
  - Server URL may be incorrect
  - Authorization header format may be wrong

### 2. **Missing Export for AsyncFaceSignClient**
- **Issue:** `AsyncFaceSignClient` was not exported in `__init__.py`
- **Status:** ✅ **FIXED** - Added to exports
- **Impact:** Could not import async client for testing

### 3. **Pydantic Model Validation Issues**

#### Flow Node Type Validation
- **Issue:** Flow nodes with type `"identityVerification"` are rejected
- **Error:** Input should be one of: 'start', 'end', 'conversation', 'liveness_detection', 'enter_email', 'data_validation', 'document_scan', 'recognition', 'face_scan', 'two_factor'
- **Impact:** Cannot create sessions with flow-based configuration
- **Root Cause:** SDK models don't support legacy module types in flow format

#### Missing Required Fields in Flow Nodes
- **Issue:** Flow node validation requires many fields that aren't provided in simple examples
- **Examples of missing fields:**
  - `FSConversationNode.prompt` (required)
  - `FSConversationNode.transitions` (required)
  - `FSLivenessDetectionNode.outcomes` (required)
  - `FSDocumentScanNode.scanning_mode` (required)
  - And many others...

### 4. **Metadata Field Validation Issue**
- **Issue:** `metadata` field seems to be required in some contexts but not others
- **Error:** "Field required [type=missing, input_value={'client_reference_id': '...identityVerification'}]}"
- **Impact:** Inconsistent session creation behavior

### 5. **Error Response Parsing Issues**
- **Issue:** Some error responses return empty content, causing JSON parsing failures
- **Error:** "Expecting value: line 1 column 1 (char 0)"
- **Impact:** Cannot properly handle all API error responses

## Test Results Summary

- **Total Tests:** 16
- **Passed:** 3 (only client initialization tests)
- **Failed:** 13
- **Success Rate:** 18.8%

### Tests That Passed ✅
1. Client Initialization - Default
2. Client Initialization - Custom Config  
3. AsyncClient Initialization

### Tests That Failed ❌
1. All API endpoint tests (due to 403 authentication)
2. Flow-based session creation (due to validation issues)
3. Some error handling tests (due to parsing issues)

## Recommendations

### Immediate Fixes Needed

1. **Verify API Key Configuration**
   - Test API key manually with curl
   - Verify server URL is correct
   - Check if API key needs different format or activation

2. **Fix Flow Node Type Support**
   - Add support for legacy module types like `"identityVerification"`
   - Make flow node validation more flexible
   - Add proper mapping between legacy modules and new flow types

3. **Improve Error Handling**
   - Handle empty response bodies gracefully
   - Add better error parsing for different API error formats
   - Improve validation error messages

4. **Fix Model Validation**
   - Make metadata field properly optional
   - Review all required fields in flow nodes
   - Add better default values for optional fields

### Testing Strategy
1. First resolve authentication issues
2. Test with simpler module-based sessions before flow-based ones
3. Add more comprehensive error scenario testing
4. Test with different API environments (dev/staging if available)

## Next Steps

1. ✅ Document all issues found (this file)
2. 🔄 Fix critical SDK issues identified
3. 🔄 Retest with corrected implementation
4. 🔄 Update documentation based on working examples
5. 🔄 Create properly working code examples