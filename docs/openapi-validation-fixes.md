# OpenAPI Validation - Required Code Fixes

## Critical Fixes Required

### 1. Remove Duplicate BackgroundType Enum
**File**: `/src/api-endpoints.ts` (lines 99-103)
```typescript
// DELETE THESE LINES:
export enum BackgroundType {
  AVATAR = 'avatar',
  COLOR = 'color',
}
```
The correct BackgroundType enum is already exported from `customization.ts` with uppercase values matching OpenAPI.

### 2. Fix Method Enum Typo
**File**: `/src/api-endpoints.ts` (line 31)
```typescript
// Change:
DELTE = 'delete',
// To:
DELETE = 'delete',
```

### 3. Make modules Optional in SessionSettings
**File**: `/src/api-endpoints.ts` (line 202)
```typescript
// Change:
modules: Module[]
// To:
modules?: Module[]
```

### 4. Add Error Response Types
**File**: Create new file `/src/types/errors.ts`
```typescript
export enum ErrorType {
  AUTHENTICATION_ERROR = 'authentication_error',
  VALIDATION_ERROR = 'validation_error',
  NOT_FOUND_ERROR = 'not_found_error',
  RATE_LIMIT_ERROR = 'rate_limit_error',
  SERVER_ERROR = 'server_error',
}

export interface ErrorDetails {
  type: ErrorType;
  message: string;
  code?: string;
}

export interface ErrorResponse {
  error: ErrorDetails;
}
```

Then add to `/src/api-endpoints.ts`:
```typescript
export * from './types/errors'
```

### 5. Optional: Fix FSDocumentType Typo
**File**: `/src/types/nodes.ts` (line 79)
```typescript
// Change:
IDENTITY_CARD = 'MRTD_TYPE_IDENITY_CARD',
// To:
IDENTITY_CARD = 'MRTD_TYPE_IDENTITY_CARD',
```
Note: This would be a breaking change since the OpenAPI spec also has this typo. Consider fixing in both places in a coordinated release.

## Testing After Fixes

1. Run TypeScript compilation: `npm run build`
2. Run linting: `npm run lint`
3. Verify imports still work correctly
4. Test that BackgroundType enum values are uppercase when used

## Migration Notes

- The BackgroundType enum change from lowercase to uppercase may affect existing code using the SDK
- Making modules optional allows for flow-only configurations as intended by the API design
- Error types will improve error handling consistency with API responses