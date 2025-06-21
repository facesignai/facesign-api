# FaceSign Go SDK

Official Go SDK for the FaceSign identity verification API.

## Installation

```bash
go get github.com/facesignai/facesign-go
```

## Requirements

- Go 1.21 or higher
- FaceSign API key

## Quick Start

```go
package main

import (
    "context"
    "fmt"
    "log"
    
    facesign "github.com/facesignai/facesign-go"
)

func main() {
    // Create client
    client := facesign.NewClient("your-api-key")
    
    // Create a session
    ctx := context.Background()
    session, err := client.Sessions.Create(ctx, &facesign.CreateSessionRequest{
        ClientReferenceID: "user-123",
        Metadata: map[string]interface{}{
            "source": "go-sdk",
        },
        Modules: []facesign.Module{
            {Type: "identityVerification"},
        },
    })
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Printf("Session ID: %s\n", session.Session.ID)
    fmt.Printf("Verification URL: %s\n", session.ClientSecret.URL)
}
```

## Documentation

For detailed documentation and examples, visit [docs.facesign.ai](https://docs.facesign.ai).

## License

MIT License - see LICENSE file for details.