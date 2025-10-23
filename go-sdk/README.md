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

### Using Modules (Legacy)

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

    // Create a session with modules
    ctx := context.Background()
    session, err := client.Sessions.Create(ctx, &facesign.CreateSessionRequest{
        ClientReferenceID: "user-123",
        Metadata: map[string]interface{}{
            "source": "go-sdk",
        },
        Modules: []facesign.Module{
            {Type: facesign.ModuleIdentityVerification},
        },
    })
    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("Session ID: %s\n", session.Session.ID)
    fmt.Printf("Verification URL: %s\n", session.ClientSecret.URL)
}
```

### Using Custom Flows (Recommended)

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

    // Create a custom flow
    flow := &facesign.Flow{
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
                    "livenessDetected": "document",
                    "deepfakeDetected": "end",
                    "noFace":          "end",
                },
            },
            {
                ID:   "document",
                Type: facesign.NodeTypeDocumentScan,
                Outcomes: map[string]string{
                    "scanSuccess":   "end",
                    "userCancelled": "end",
                    "scanTimeout":   "end",
                },
            },
            {
                ID:   "end",
                Type: facesign.NodeTypeEnd,
            },
        },
        Edges: []facesign.Edge{
            {ID: "e1", Source: "start", Target: "liveness"},
            {ID: "e2", Source: "liveness", Target: "document"},
            {ID: "e3", Source: "liveness", Target: "end"},
            {ID: "e4", Source: "document", Target: "end"},
        },
    }

    // Create session with custom flow
    ctx := context.Background()
    session, err := client.Sessions.Create(ctx, &facesign.CreateSessionRequest{
        ClientReferenceID: "user-123",
        Metadata: map[string]interface{}{
            "source": "go-sdk-flow",
        },
        Flow: flow,
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