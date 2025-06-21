package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"sync"
	"time"
	
	facesign "github.com/facesignai/facesign-go"
)

// SessionResult holds the result of a session creation
type SessionResult struct {
	UserID    string
	SessionID string
	URL       string
	Error     error
}

func main() {
	// Get API key from environment
	apiKey := os.Getenv("FACESIGN_API_KEY")
	if apiKey == "" {
		log.Fatal("FACESIGN_API_KEY environment variable is required")
	}
	
	// Create client with connection pooling
	client := facesign.NewClient(apiKey,
		facesign.WithTimeout(30*time.Second),
	)
	
	// List of users to verify
	users := []string{
		"user-001",
		"user-002", 
		"user-003",
		"user-004",
		"user-005",
	}
	
	// Create sessions concurrently
	fmt.Printf("Creating %d verification sessions concurrently...\n", len(users))
	
	var wg sync.WaitGroup
	results := make(chan SessionResult, len(users))
	
	// Rate limiting - max 3 concurrent requests
	semaphore := make(chan struct{}, 3)
	
	for _, userID := range users {
		wg.Add(1)
		go func(uid string) {
			defer wg.Done()
			
			// Acquire semaphore
			semaphore <- struct{}{}
			defer func() { <-semaphore }()
			
			result := createSession(client, uid)
			results <- result
		}(userID)
	}
	
	// Close results channel when all goroutines complete
	go func() {
		wg.Wait()
		close(results)
	}()
	
	// Collect results
	var successful, failed int
	sessionIDs := make([]string, 0)
	
	fmt.Println("\nResults:")
	for result := range results {
		if result.Error != nil {
			failed++
			fmt.Printf("❌ %s: Failed - %v\n", result.UserID, result.Error)
		} else {
			successful++
			sessionIDs = append(sessionIDs, result.SessionID)
			fmt.Printf("✅ %s: Success - Session %s\n", result.UserID, result.SessionID)
		}
	}
	
	fmt.Printf("\nSummary: %d successful, %d failed\n", successful, failed)
	
	// Batch retrieve session statuses
	if len(sessionIDs) > 0 {
		fmt.Printf("\nChecking status of %d sessions...\n", len(sessionIDs))
		checkSessionStatuses(client, sessionIDs)
	}
	
	// List all sessions with pagination
	fmt.Println("\nListing all sessions with pagination...")
	listAllSessions(client)
}

func createSession(client *facesign.Client, userID string) SessionResult {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	
	req := &facesign.CreateSessionRequest{
		ClientReferenceID: userID,
		Metadata: map[string]interface{}{
			"source":    "concurrent-example",
			"batchID":   "batch-001",
			"timestamp": time.Now().Unix(),
		},
		Modules: []facesign.Module{
			{Type: facesign.ModuleIdentityVerification},
			{Type: facesign.ModuleEmailVerification},
		},
		DefaultLang: "en",
	}
	
	resp, err := client.Sessions.Create(ctx, req)
	if err != nil {
		return SessionResult{
			UserID: userID,
			Error:  err,
		}
	}
	
	return SessionResult{
		UserID:    userID,
		SessionID: resp.Session.ID,
		URL:       resp.ClientSecret.URL,
	}
}

func checkSessionStatuses(client *facesign.Client, sessionIDs []string) {
	ctx := context.Background()
	
	var wg sync.WaitGroup
	statusChan := make(chan string, len(sessionIDs))
	
	for _, sessionID := range sessionIDs {
		wg.Add(1)
		go func(sid string) {
			defer wg.Done()
			
			resp, err := client.Sessions.Get(ctx, sid)
			if err != nil {
				statusChan <- fmt.Sprintf("%s: Error - %v", sid, err)
			} else {
				statusChan <- fmt.Sprintf("%s: %s", sid, resp.Session.Status)
			}
		}(sessionID)
	}
	
	go func() {
		wg.Wait()
		close(statusChan)
	}()
	
	for status := range statusChan {
		fmt.Printf("  %s\n", status)
	}
}

func listAllSessions(client *facesign.Client) {
	ctx := context.Background()
	
	const pageSize = 10
	var offset int
	var totalSessions int
	
	for {
		req := &facesign.ListSessionsRequest{
			Limit:     pageSize,
			Offset:    offset,
			SortBy:    "createdAt",
			SortOrder: "desc",
		}
		
		resp, err := client.Sessions.List(ctx, req)
		if err != nil {
			log.Printf("Error listing sessions: %v", err)
			break
		}
		
		if offset == 0 {
			totalSessions = resp.Total
			fmt.Printf("Total sessions: %d\n", totalSessions)
		}
		
		fmt.Printf("\nPage %d (sessions %d-%d):\n", 
			(offset/pageSize)+1, 
			offset+1, 
			min(offset+pageSize, totalSessions))
		
		for _, session := range resp.Sessions {
			createdAt := time.Unix(session.CreatedAt/1000, 0)
			fmt.Printf("  - %s: %s (created %s)\n", 
				session.ID, 
				session.Status,
				createdAt.Format("2006-01-02 15:04:05"))
		}
		
		offset += pageSize
		if offset >= resp.Total || len(resp.Sessions) < pageSize {
			break
		}
		
		// Small delay between pages
		time.Sleep(100 * time.Millisecond)
	}
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}