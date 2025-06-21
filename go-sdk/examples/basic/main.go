package main

import (
	"context"
	"fmt"
	"log"
	"os"
	
	facesign "github.com/facesignai/facesign-go"
)

func main() {
	// Get API key from environment
	apiKey := os.Getenv("FACESIGN_API_KEY")
	if apiKey == "" {
		log.Fatal("FACESIGN_API_KEY environment variable is required")
	}
	
	// Create client
	client := facesign.NewClient(apiKey)
	
	// Create context
	ctx := context.Background()
	
	// Get supported languages
	fmt.Println("Fetching supported languages...")
	languages, err := client.Languages.Get(ctx)
	if err != nil {
		log.Printf("Error fetching languages: %v", err)
	} else {
		fmt.Printf("Found %d supported languages:\n", len(languages.Langs))
		for i, lang := range languages.Langs {
			if i >= 5 {
				fmt.Println("  ...")
				break
			}
			fmt.Printf("  - %s: %s\n", lang.ID, lang.Title)
		}
	}
	
	// Get available avatars
	fmt.Println("\nFetching available avatars...")
	avatars, err := client.Avatars.Get(ctx)
	if err != nil {
		log.Printf("Error fetching avatars: %v", err)
	} else {
		fmt.Printf("Found %d available avatars:\n", len(avatars.Avatars))
		for i, avatar := range avatars.Avatars {
			if i >= 3 {
				fmt.Println("  ...")
				break
			}
			fmt.Printf("  - %s: %s (%s)\n", avatar.ID, avatar.Name, avatar.Gender)
		}
	}
	
	// Create a session with modules
	fmt.Println("\nCreating verification session...")
	createReq := &facesign.CreateSessionRequest{
		ClientReferenceID: "go-example-user-123",
		Metadata: map[string]interface{}{
			"source": "go-sdk-example",
			"environment": "development",
		},
		Modules: []facesign.Module{
			{Type: facesign.ModuleIdentityVerification},
		},
		InitialPhrase: "Welcome to FaceSign verification!",
		DefaultLang:   "en",
	}
	
	// Add avatar if available
	if len(avatars.Avatars) > 0 {
		createReq.AvatarID = avatars.Avatars[0].ID
	}
	
	session, err := client.Sessions.Create(ctx, createReq)
	if err != nil {
		log.Fatalf("Error creating session: %v", err)
	}
	
	fmt.Println("\n✅ Session created successfully!")
	fmt.Printf("Session ID: %s\n", session.Session.ID)
	fmt.Printf("Status: %s\n", session.Session.Status)
	fmt.Printf("Client Secret: %s\n", session.ClientSecret.Secret)
	fmt.Printf("Verification URL: %s\n", session.ClientSecret.URL)
	
	// Retrieve the session
	fmt.Printf("\nRetrieving session %s...\n", session.Session.ID)
	getResp, err := client.Sessions.Get(ctx, session.Session.ID)
	if err != nil {
		log.Printf("Error retrieving session: %v", err)
	} else {
		fmt.Printf("Current status: %s\n", getResp.Session.Status)
	}
	
	// List recent sessions
	fmt.Println("\nListing recent sessions...")
	listReq := &facesign.ListSessionsRequest{
		Limit:     5,
		SortBy:    "createdAt",
		SortOrder: "desc",
	}
	
	sessions, err := client.Sessions.List(ctx, listReq)
	if err != nil {
		log.Printf("Error listing sessions: %v", err)
	} else {
		fmt.Printf("Found %d sessions (showing %d):\n", sessions.Total, len(sessions.Sessions))
		for _, s := range sessions.Sessions {
			fmt.Printf("  - %s: %s (created at %d)\n", s.ID, s.Status, s.CreatedAt)
		}
	}
	
	// Refresh client secret
	fmt.Printf("\nRefreshing client secret for session %s...\n", session.Session.ID)
	newSecret, err := client.Sessions.RefreshClientSecret(ctx, session.Session.ID)
	if err != nil {
		log.Printf("Error refreshing client secret: %v", err)
	} else {
		fmt.Println("✅ Client secret refreshed!")
		fmt.Printf("New secret: %s\n", newSecret.Secret)
		fmt.Printf("Expires at: %d\n", newSecret.ExpireAt)
	}
}