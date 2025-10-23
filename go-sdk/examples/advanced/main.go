package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"
	
	facesign "github.com/facesignai/facesign-go"
)

func main() {
	// Get API key from environment
	apiKey := os.Getenv("FACESIGN_API_KEY")
	if apiKey == "" {
		log.Fatal("FACESIGN_API_KEY environment variable is required")
	}
	
	// Optional: Use development server
	baseURL := os.Getenv("FACESIGN_BASE_URL")
	if baseURL == "" {
		baseURL = "https://api.facesign.ai"
	}
	
	// Create client with custom configuration
	client := facesign.NewClient(apiKey,
		facesign.WithBaseURL(baseURL),
		facesign.WithTimeout(60*time.Second),
		facesign.WithUserAgent("my-app/1.0"),
	)
	
	// Create context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	
	// Create a flow-based session
	fmt.Println("Creating flow-based verification session...")
	
	flow := &facesign.Flow{
		Nodes: []facesign.Node{
			{
				ID:      "start",
				Type:    facesign.NodeTypeStart,
				Outcome: "greeting",
			},
			{
				ID:     "greeting",
				Type:   facesign.NodeTypeConversation,
				Prompt: "Hello! I'll help you verify your identity. Let's start with a quick face scan.",
				Transitions: []facesign.Transition{
					{ID: "t1", Condition: "true"},
				},
			},
			{
				ID:   "face-scan",
				Type: facesign.NodeTypeFaceScan,
				Mode: "capture",
				Outcomes: map[string]string{
					"captured": "email-input",
					"error":    "face-scan-error",
				},
			},
			{
				ID:     "face-scan-error",
				Type:   facesign.NodeTypeConversation,
				Prompt: "I couldn't capture your face. Let's try again.",
				Transitions: []facesign.Transition{
					{ID: "t2", Condition: "true"},
				},
			},
			{
				ID:     "email-input",
				Type:   facesign.NodeTypeEmailInput,
				Prompt: "Great! Now please enter your email address.",
				Data: map[string]interface{}{
					"required": true,
				},
			},
			{
				ID:   "email-verify",
				Type: facesign.NodeTypeEmailVerification,
				Data: map[string]interface{}{
					"codeLength": 6,
					"expiryMinutes": 10,
				},
			},
			{
				ID:     "document-scan",
				Type:   facesign.NodeTypeDocumentScan,
				Prompt: "Please scan your ID document.",
				Mode:   "capture",
				Outcomes: map[string]string{
					"captured": "completion",
					"error":    "document-error",
				},
			},
			{
				ID:     "document-error",
				Type:   facesign.NodeTypeConversation,
				Prompt: "There was an issue scanning your document. Please try again.",
				Transitions: []facesign.Transition{
					{ID: "t3", Condition: "true"},
				},
			},
			{
				ID:     "completion",
				Type:   facesign.NodeTypeConversation,
				Prompt: "Thank you! Your verification is complete.",
				Transitions: []facesign.Transition{
					{ID: "t4", Condition: "true"},
				},
			},
			{
				ID:   "end",
				Type: facesign.NodeTypeEnd,
			},
		},
		Edges: []facesign.Edge{
			{ID: "e1", Source: "start", Target: "greeting"},
			{ID: "e2", Source: "greeting", Target: "face-scan"},
			{ID: "e3", Source: "face-scan-error", Target: "face-scan"},
			{ID: "e4", Source: "email-input", Target: "email-verify"},
			{ID: "e5", Source: "email-verify", Target: "document-scan"},
			{ID: "e6", Source: "document-error", Target: "document-scan"},
			{ID: "e7", Source: "completion", Target: "end"},
		},
	}
	
	createReq := &facesign.CreateSessionRequest{
		ClientReferenceID: "go-flow-example-456",
		Metadata: map[string]interface{}{
			"source":     "go-sdk-advanced",
			"flowType":   "complete-verification",
			"customerId": "cust-789",
		},
		Flow:        flow,
		DefaultLang: "en",
	}
	
	session, err := client.Sessions.Create(ctx, createReq)
	if err != nil {
		// Handle specific error types
		if apiErr, ok := facesign.GetAPIError(err); ok {
			log.Fatalf("API Error: %s (code: %s, status: %d)", 
				apiErr.Message, apiErr.Code, apiErr.StatusCode)
		}
		log.Fatalf("Error creating session: %v", err)
	}
	
	fmt.Println("\n✅ Flow-based session created successfully!")
	fmt.Printf("Session ID: %s\n", session.Session.ID)
	fmt.Printf("Status: %s\n", session.Session.Status)
	fmt.Printf("Verification URL: %s\n", session.ClientSecret.URL)
	fmt.Printf("Expires at: %s\n", time.Unix(session.Session.ExpiresAt/1000, 0).Format(time.RFC3339))
	
	// Monitor session status
	fmt.Println("\nMonitoring session status...")
	for i := 0; i < 5; i++ {
		time.Sleep(2 * time.Second)
		
		status, err := client.Sessions.Get(ctx, session.Session.ID)
		if err != nil {
			log.Printf("Error checking status: %v", err)
			continue
		}
		
		fmt.Printf("Status check %d: %s\n", i+1, status.Session.Status)
		
		if status.Session.Status == facesign.SessionStatusComplete {
			fmt.Println("\n🎉 Verification completed!")
			if status.Session.Report != nil {
				fmt.Printf("Verified: %v\n", status.Session.Report.IsVerified)
				fmt.Printf("Results: %+v\n", status.Session.Report.VerificationResults)
			}
			break
		}

		if status.Session.Status == facesign.SessionStatusCanceled {
			fmt.Printf("\n❌ Session ended with status: %s\n", status.Session.Status)
			break
		}
	}
	
	// Error handling example
	fmt.Println("\nDemonstrating error handling...")
	_, err = client.Sessions.Get(ctx, "invalid-session-id")
	if err != nil {
		if apiErr, ok := facesign.GetAPIError(err); ok {
			if apiErr.IsNotFound() {
				fmt.Println("✓ Correctly identified 404 Not Found error")
			} else {
				fmt.Printf("API Error: %v\n", apiErr)
			}
		} else {
			fmt.Printf("Client Error: %v\n", err)
		}
	}
}