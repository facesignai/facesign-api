# FaceSign API OpenAPI Specification

This directory contains the OpenAPI 3.0 specification for the FaceSign API in both YAML and JSON formats.

## Files

- **`openapi.yaml`** - The primary OpenAPI specification in YAML format (human-readable)
- **`openapi.json`** - The same specification in JSON format (for tools that require JSON)
- **`generate-openapi-json.js`** - Script to convert YAML to JSON

## Specification Details

- **OpenAPI Version**: 3.0.3
- **API Version**: 1.0.18
- **Base URL**: https://api.facesign.ai

## Key Features Documented

### Authentication
- Bearer token authentication using API keys
- Test mode (sk_test_*) and live mode (sk_live_*) keys

### Endpoints

#### Sessions
- `POST /sessions` - Create a verification session
- `GET /sessions` - List sessions with filtering
- `GET /sessions/{sessionId}` - Retrieve session details
- `GET /sessions/{sessionId}/refresh` - Generate new client secret

#### Configuration
- `GET /langs` - Get supported languages
- `GET /avatars` - Get available avatars

### Node Types
The specification includes all available node types for building verification flows:
- **Control Flow**: Start, End, Conversation, Data Validation
- **Authentication**: Two-Factor, Enter Email
- **Biometric**: Face Scan, Recognition, Liveness Detection
- **Document**: Document Scan

### Response Types
- Detailed session objects with status tracking
- Client secrets for end-user authentication
- Comprehensive error responses with proper HTTP status codes

## Using the Specification

### With API Development Tools

**Postman**:
1. Import → Upload Files → Select `openapi.json`
2. Generate collection from the specification

**Insomnia**:
1. Create → Import from File → Select `openapi.yaml` or `openapi.json`

**Swagger UI**:
```bash
docker run -p 8080:8080 -e SWAGGER_JSON=/openapi/openapi.json -v $(pwd):/openapi swaggerapi/swagger-ui
```

### For Code Generation

Generate client SDKs using OpenAPI Generator:

```bash
# TypeScript/JavaScript client
openapi-generator-cli generate -i openapi.yaml -g typescript-fetch -o ./generated/ts-client

# Python client
openapi-generator-cli generate -i openapi.yaml -g python -o ./generated/python-client

# Go client
openapi-generator-cli generate -i openapi.yaml -g go -o ./generated/go-client
```

### For Documentation

Generate HTML documentation:

```bash
# Using Redoc
npx @redocly/cli build-docs openapi.yaml -o api-docs.html

# Using Swagger UI
npx @apidevtools/swagger-cli bundle openapi.yaml -o bundled.yaml
```

## Updating the Specification

1. Edit `openapi.yaml` with your changes
2. Run `node generate-openapi-json.js` to update the JSON version
3. Validate the specification:
   ```bash
   npx @apidevtools/swagger-cli validate openapi.yaml
   ```

## Schema Highlights

### Session Creation
The specification shows how to create sessions with:
- Node-based flows (recommended)
- Legacy module configuration
- UI/UX customization options
- Multi-language support

### Flow Configuration
Detailed schemas for building verification flows:
- Node definitions with type-specific properties
- Edge connections between nodes
- Outcome-based branching
- Transition conditions

### Error Handling
Standardized error responses with:
- Error types (authentication, validation, rate limit, etc.)
- HTTP status codes
- Rate limit headers

## Examples

The specification includes example requests for common use cases:
- Basic conversational session
- Face verification flow
- Document scanning session
- Multi-factor authentication

## Compliance

The specification follows:
- OpenAPI 3.0.3 standards
- RESTful API best practices
- Consistent naming conventions
- Comprehensive type definitions

## Support

For questions about the API specification:
- Email: support@facesign.ai
- GitHub Issues: https://github.com/facesignai/facesign-api/issues 