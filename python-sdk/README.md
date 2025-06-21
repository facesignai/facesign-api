# FaceSign Python SDK

The official Python SDK for the FaceSign identity verification API.

## Installation

```bash
pip install facesign-api
```

## Quick Start

```python
import asyncio
from facesign import FaceSignClient

async def main():
    client = FaceSignClient(api_key="sk_test_...")
    
    # Create a verification session
    session = await client.sessions.create(
        client_reference_id="user-123",
        metadata={"source": "python-sdk"},
        modules=[{"type": "identityVerification"}]
    )
    
    print(f"Session created: {session.session.id}")
    print(f"Client secret: {session.client_secret.secret}")

if __name__ == "__main__":
    asyncio.run(main())
```

## Features

- **Full API Coverage**: Complete support for all FaceSign API endpoints
- **Type Safety**: Built with Pydantic for robust type validation
- **Async/Sync Support**: Use async/await or synchronous calls
- **Comprehensive Error Handling**: Detailed error responses with proper typing

## Documentation

For detailed documentation, visit [https://docs.facesign.ai](https://docs.facesign.ai)

## License

MIT License - see LICENSE file for details.