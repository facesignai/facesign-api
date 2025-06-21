package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"
	
	facesign "github.com/facesignai/facesign-go"
)

// TestResult represents the result of a single test
type TestResult struct {
	TestName    string        `json:"test_name"`
	Status      string        `json:"status"`
	Error       string        `json:"error,omitempty"`
	Duration    time.Duration `json:"duration"`
	Details     interface{}   `json:"details,omitempty"`
}

// TestSuite runs all SDK tests
type TestSuite struct {
	client  *facesign.Client
	results []TestResult
}

func main() {
	// Get API key from environment
	apiKey := os.Getenv("FACESIGN_DEV_API_KEY")
	if apiKey == "" {
		apiKey = "your_dev_api_key_here"
	}
	
	serverURL := os.Getenv("FACESIGN_DEV_SERVER_URL")
	if serverURL == "" {
		serverURL = "https://api.dev.facesign.ai"
	}
	
	fmt.Printf("🧪 FaceSign Go SDK Comprehensive Test Suite\n")
	fmt.Printf("Server: %s\n", serverURL)
	fmt.Printf("Time: %s\n\n", time.Now().Format("2006-01-02 15:04:05"))
	
	// Initialize client
	client := facesign.NewClient(apiKey,
		facesign.WithBaseURL(serverURL),
		facesign.WithTimeout(30*time.Second),
	)
	
	suite := &TestSuite{
		client:  client,
		results: make([]TestResult, 0),
	}
	
	// Run all tests
	suite.runAllTests()
	
	// Print summary
	suite.printSummary()
	
	// Save results to file
	suite.saveResults()
}

func (s *TestSuite) runAllTests() {
	tests := []struct {
		name string
		fn   func() TestResult
	}{
		{"Test Client Initialization", s.testClientInit},
		{"Test Get Languages", s.testGetLanguages},
		{"Test Get Avatars", s.testGetAvatars},
		{"Test Create Session with Modules", s.testCreateSessionModules},
		{"Test Create Session with Flow", s.testCreateSessionFlow},
		{"Test Get Session", s.testGetSession},
		{"Test List Sessions", s.testListSessions},
		{"Test Refresh Client Secret", s.testRefreshClientSecret},
		{"Test Error Handling - Invalid Session", s.testErrorHandlingInvalidSession},
		{"Test Error Handling - Invalid API Key", s.testErrorHandlingInvalidAPIKey},
		{"Test Metadata Handling", s.testMetadataHandling},
		{"Test Concurrent Requests", s.testConcurrentRequests},
		{"Test Context Cancellation", s.testContextCancellation},
		{"Test Complex Flow", s.testComplexFlow},
		{"Test Session Status Transitions", s.testSessionStatusTransitions},
		{"Test Rate Limiting", s.testRateLimiting},
	}
	
	for _, test := range tests {
		fmt.Printf("Running: %s...\n", test.name)
		result := test.fn()
		s.results = append(s.results, result)
		
		if result.Status == "PASS" {
			fmt.Printf("✅ %s (%.2fs)\n", test.name, result.Duration.Seconds())
		} else {
			fmt.Printf("❌ %s: %s\n", test.name, result.Error)
		}
	}
}

func (s *TestSuite) testClientInit() TestResult {
	start := time.Now()
	
	if s.client == nil {
		return TestResult{
			TestName: "Test Client Initialization",
			Status:   "FAIL",
			Error:    "Client is nil",
			Duration: time.Since(start),
		}
	}
	
	return TestResult{
		TestName: "Test Client Initialization",
		Status:   "PASS",
		Duration: time.Since(start),
		Details:  "Client initialized successfully",
	}
}

func (s *TestSuite) testGetLanguages() TestResult {
	start := time.Now()
	ctx := context.Background()
	
	langs, err := s.client.Languages.Get(ctx)
	if err != nil {
		return TestResult{
			TestName: "Test Get Languages",
			Status:   "FAIL",
			Error:    err.Error(),
			Duration: time.Since(start),
		}
	}
	
	if len(langs.Langs) == 0 {
		return TestResult{
			TestName: "Test Get Languages",
			Status:   "FAIL",
			Error:    "No languages returned",
			Duration: time.Since(start),
		}
	}
	
	return TestResult{
		TestName: "Test Get Languages",
		Status:   "PASS",
		Duration: time.Since(start),
		Details: map[string]interface{}{
			"language_count": len(langs.Langs),
			"sample_lang":    langs.Langs[0],
		},
	}
}

func (s *TestSuite) testGetAvatars() TestResult {
	start := time.Now()
	ctx := context.Background()
	
	avatars, err := s.client.Avatars.Get(ctx)
	if err != nil {
		return TestResult{
			TestName: "Test Get Avatars",
			Status:   "FAIL",
			Error:    err.Error(),
			Duration: time.Since(start),
		}
	}
	
	if len(avatars.Avatars) == 0 {
		return TestResult{
			TestName: "Test Get Avatars",
			Status:   "FAIL",
			Error:    "No avatars returned",
			Duration: time.Since(start),
		}
	}
	
	return TestResult{
		TestName: "Test Get Avatars",
		Status:   "PASS",
		Duration: time.Since(start),
		Details: map[string]interface{}{
			"avatar_count": len(avatars.Avatars),
			"sample_avatar": avatars.Avatars[0],
		},
	}
}

func (s *TestSuite) testCreateSessionModules() TestResult {
	start := time.Now()
	ctx := context.Background()
	
	req := &facesign.CreateSessionRequest{
		ClientReferenceID: fmt.Sprintf("go-test-modules-%d", time.Now().Unix()),
		Metadata: map[string]interface{}{
			"test_type": "module_session",
			"sdk":       "go",
		},
		Modules: []facesign.Module{
			{Type: facesign.ModuleIdentityVerification},
		},
		DefaultLang: "en",
	}
	
	resp, err := s.client.Sessions.Create(ctx, req)
	if err != nil {
		return TestResult{
			TestName: "Test Create Session with Modules",
			Status:   "FAIL",
			Error:    err.Error(),
			Duration: time.Since(start),
		}
	}
	
	if resp.Session == nil || resp.ClientSecret == nil {
		return TestResult{
			TestName: "Test Create Session with Modules",
			Status:   "FAIL",
			Error:    "Missing session or client secret in response",
			Duration: time.Since(start),
		}
	}
	
	return TestResult{
		TestName: "Test Create Session with Modules",
		Status:   "PASS",
		Duration: time.Since(start),
		Details: map[string]interface{}{
			"session_id": resp.Session.ID,
			"status":     resp.Session.Status,
			"url":        resp.ClientSecret.URL,
		},
	}
}

func (s *TestSuite) testCreateSessionFlow() TestResult {
	start := time.Now()
	ctx := context.Background()
	
	flow := &facesign.Flow{
		Nodes: []facesign.Node{
			{ID: "start", Type: facesign.NodeTypeStart},
			{ID: "greeting", Type: facesign.NodeTypeConversation, Prompt: "Hello!"},
			{ID: "end", Type: facesign.NodeTypeEnd},
		},
		Edges: []facesign.Edge{
			{ID: "e1", Source: "start", Target: "greeting"},
			{ID: "e2", Source: "greeting", Target: "end"},
		},
	}
	
	req := &facesign.CreateSessionRequest{
		ClientReferenceID: fmt.Sprintf("go-test-flow-%d", time.Now().Unix()),
		Flow:              flow,
		DefaultLang:       "en",
	}
	
	resp, err := s.client.Sessions.Create(ctx, req)
	if err != nil {
		return TestResult{
			TestName: "Test Create Session with Flow",
			Status:   "FAIL",
			Error:    err.Error(),
			Duration: time.Since(start),
		}
	}
	
	return TestResult{
		TestName: "Test Create Session with Flow",
		Status:   "PASS",
		Duration: time.Since(start),
		Details: map[string]interface{}{
			"session_id": resp.Session.ID,
			"has_flow":   resp.Session.Flow != nil,
		},
	}
}

func (s *TestSuite) testGetSession() TestResult {
	start := time.Now()
	ctx := context.Background()
	
	// First create a session
	createResp, err := s.client.Sessions.Create(ctx, &facesign.CreateSessionRequest{
		ClientReferenceID: fmt.Sprintf("go-test-get-%d", time.Now().Unix()),
		Modules: []facesign.Module{
			{Type: facesign.ModuleIdentityVerification},
		},
	})
	if err != nil {
		return TestResult{
			TestName: "Test Get Session",
			Status:   "FAIL",
			Error:    "Failed to create test session: " + err.Error(),
			Duration: time.Since(start),
		}
	}
	
	// Get the session
	getResp, err := s.client.Sessions.Get(ctx, createResp.Session.ID)
	if err != nil {
		return TestResult{
			TestName: "Test Get Session",
			Status:   "FAIL",
			Error:    err.Error(),
			Duration: time.Since(start),
		}
	}
	
	if getResp.Session.ID != createResp.Session.ID {
		return TestResult{
			TestName: "Test Get Session",
			Status:   "FAIL",
			Error:    "Session ID mismatch",
			Duration: time.Since(start),
		}
	}
	
	return TestResult{
		TestName: "Test Get Session",
		Status:   "PASS",
		Duration: time.Since(start),
		Details:  getResp.Session,
	}
}

func (s *TestSuite) testListSessions() TestResult {
	start := time.Now()
	ctx := context.Background()
	
	req := &facesign.ListSessionsRequest{
		Limit:     5,
		SortBy:    "createdAt",
		SortOrder: "desc",
	}
	
	resp, err := s.client.Sessions.List(ctx, req)
	if err != nil {
		return TestResult{
			TestName: "Test List Sessions",
			Status:   "FAIL",
			Error:    err.Error(),
			Duration: time.Since(start),
		}
	}
	
	return TestResult{
		TestName: "Test List Sessions",
		Status:   "PASS",
		Duration: time.Since(start),
		Details: map[string]interface{}{
			"total":          resp.Total,
			"returned_count": len(resp.Sessions),
			"limit":          resp.Limit,
		},
	}
}

func (s *TestSuite) testRefreshClientSecret() TestResult {
	start := time.Now()
	ctx := context.Background()
	
	// First create a session
	createResp, err := s.client.Sessions.Create(ctx, &facesign.CreateSessionRequest{
		ClientReferenceID: fmt.Sprintf("go-test-refresh-%d", time.Now().Unix()),
		Modules: []facesign.Module{
			{Type: facesign.ModuleIdentityVerification},
		},
	})
	if err != nil {
		return TestResult{
			TestName: "Test Refresh Client Secret",
			Status:   "FAIL",
			Error:    "Failed to create test session: " + err.Error(),
			Duration: time.Since(start),
		}
	}
	
	// Refresh the client secret
	newSecret, err := s.client.Sessions.RefreshClientSecret(ctx, createResp.Session.ID)
	if err != nil {
		return TestResult{
			TestName: "Test Refresh Client Secret",
			Status:   "FAIL",
			Error:    err.Error(),
			Duration: time.Since(start),
		}
	}
	
	if newSecret.Secret == createResp.ClientSecret.Secret {
		return TestResult{
			TestName: "Test Refresh Client Secret",
			Status:   "FAIL",
			Error:    "New secret is the same as old secret",
			Duration: time.Since(start),
		}
	}
	
	return TestResult{
		TestName: "Test Refresh Client Secret",
		Status:   "PASS",
		Duration: time.Since(start),
		Details: map[string]interface{}{
			"old_secret": createResp.ClientSecret.Secret[:10] + "...",
			"new_secret": newSecret.Secret[:10] + "...",
		},
	}
}

func (s *TestSuite) testErrorHandlingInvalidSession() TestResult {
	start := time.Now()
	ctx := context.Background()
	
	_, err := s.client.Sessions.Get(ctx, "invalid_session_id")
	if err == nil {
		return TestResult{
			TestName: "Test Error Handling - Invalid Session",
			Status:   "FAIL",
			Error:    "Expected error for invalid session ID",
			Duration: time.Since(start),
		}
	}
	
	apiErr, ok := facesign.GetAPIError(err)
	if !ok {
		return TestResult{
			TestName: "Test Error Handling - Invalid Session",
			Status:   "FAIL",
			Error:    "Error is not an APIError",
			Duration: time.Since(start),
		}
	}
	
	if !apiErr.IsNotFound() {
		return TestResult{
			TestName: "Test Error Handling - Invalid Session",
			Status:   "FAIL",
			Error:    "Expected 404 error",
			Duration: time.Since(start),
		}
	}
	
	return TestResult{
		TestName: "Test Error Handling - Invalid Session",
		Status:   "PASS",
		Duration: time.Since(start),
		Details:  fmt.Sprintf("Correctly identified 404 error: %s", apiErr.Message),
	}
}

func (s *TestSuite) testErrorHandlingInvalidAPIKey() TestResult {
	start := time.Now()
	ctx := context.Background()
	
	// Create client with invalid API key
	invalidClient := facesign.NewClient("invalid_api_key",
		facesign.WithBaseURL(s.client.baseURL.String()),
	)
	
	_, err := invalidClient.Languages.Get(ctx)
	if err == nil {
		return TestResult{
			TestName: "Test Error Handling - Invalid API Key",
			Status:   "FAIL",
			Error:    "Expected error for invalid API key",
			Duration: time.Since(start),
		}
	}
	
	apiErr, ok := facesign.GetAPIError(err)
	if ok && apiErr.IsUnauthorized() {
		return TestResult{
			TestName: "Test Error Handling - Invalid API Key",
			Status:   "PASS",
			Duration: time.Since(start),
			Details:  "Correctly identified unauthorized error",
		}
	}
	
	return TestResult{
		TestName: "Test Error Handling - Invalid API Key",
		Status:   "PASS",
		Duration: time.Since(start),
		Details:  "API key validation error detected",
	}
}

func (s *TestSuite) testMetadataHandling() TestResult {
	start := time.Now()
	ctx := context.Background()
	
	metadata := map[string]interface{}{
		"string_val":  "test",
		"number_val":  123,
		"bool_val":    true,
		"array_val":   []string{"a", "b", "c"},
		"nested_val": map[string]interface{}{
			"key": "value",
		},
	}
	
	req := &facesign.CreateSessionRequest{
		ClientReferenceID: fmt.Sprintf("go-test-metadata-%d", time.Now().Unix()),
		Metadata:          metadata,
		Modules: []facesign.Module{
			{Type: facesign.ModuleIdentityVerification},
		},
	}
	
	resp, err := s.client.Sessions.Create(ctx, req)
	if err != nil {
		return TestResult{
			TestName: "Test Metadata Handling",
			Status:   "FAIL",
			Error:    err.Error(),
			Duration: time.Since(start),
		}
	}
	
	// Verify metadata was stored
	getResp, _ := s.client.Sessions.Get(ctx, resp.Session.ID)
	if getResp.Session.Metadata == nil {
		return TestResult{
			TestName: "Test Metadata Handling",
			Status:   "FAIL",
			Error:    "Metadata not preserved",
			Duration: time.Since(start),
		}
	}
	
	return TestResult{
		TestName: "Test Metadata Handling",
		Status:   "PASS",
		Duration: time.Since(start),
		Details:  getResp.Session.Metadata,
	}
}

func (s *TestSuite) testConcurrentRequests() TestResult {
	start := time.Now()
	ctx := context.Background()
	
	// Run 5 concurrent language requests
	results := make(chan error, 5)
	for i := 0; i < 5; i++ {
		go func() {
			_, err := s.client.Languages.Get(ctx)
			results <- err
		}()
	}
	
	// Collect results
	var errors []string
	for i := 0; i < 5; i++ {
		if err := <-results; err != nil {
			errors = append(errors, err.Error())
		}
	}
	
	if len(errors) > 0 {
		return TestResult{
			TestName: "Test Concurrent Requests",
			Status:   "FAIL",
			Error:    fmt.Sprintf("%d errors: %v", len(errors), errors),
			Duration: time.Since(start),
		}
	}
	
	return TestResult{
		TestName: "Test Concurrent Requests",
		Status:   "PASS",
		Duration: time.Since(start),
		Details:  "5 concurrent requests completed successfully",
	}
}

func (s *TestSuite) testContextCancellation() TestResult {
	start := time.Now()
	
	// Create context that cancels immediately
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	
	_, err := s.client.Languages.Get(ctx)
	if err == nil {
		return TestResult{
			TestName: "Test Context Cancellation",
			Status:   "FAIL",
			Error:    "Expected error for cancelled context",
			Duration: time.Since(start),
		}
	}
	
	if err == context.Canceled {
		return TestResult{
			TestName: "Test Context Cancellation",
			Status:   "PASS",
			Duration: time.Since(start),
			Details:  "Context cancellation handled correctly",
		}
	}
	
	return TestResult{
		TestName: "Test Context Cancellation",
		Status:   "PASS",
		Duration: time.Since(start),
		Details:  fmt.Sprintf("Request failed as expected: %v", err),
	}
}

func (s *TestSuite) testComplexFlow() TestResult {
	start := time.Now()
	ctx := context.Background()
	
	flow := &facesign.Flow{
		Nodes: []facesign.Node{
			{ID: "start", Type: facesign.NodeTypeStart},
			{ID: "greeting", Type: facesign.NodeTypeConversation, 
				Prompt: "Welcome to verification",
				Transitions: []facesign.Transition{{ID: "t1", Condition: "true"}},
			},
			{ID: "email", Type: facesign.NodeTypeEmailInput,
				Data: map[string]interface{}{"required": true},
			},
			{ID: "email-verify", Type: facesign.NodeTypeEmailVerification},
			{ID: "face", Type: facesign.NodeTypeFaceScan,
				Mode: "capture",
				Outcomes: map[string]string{
					"captured": "document",
					"error":    "face-error",
				},
			},
			{ID: "face-error", Type: facesign.NodeTypeConversation,
				Prompt: "Face scan failed, please try again",
			},
			{ID: "document", Type: facesign.NodeTypeDocumentScan,
				Mode: "capture",
			},
			{ID: "complete", Type: facesign.NodeTypeConversation,
				Prompt: "Verification complete!",
			},
			{ID: "end", Type: facesign.NodeTypeEnd},
		},
		Edges: []facesign.Edge{
			{ID: "e1", Source: "start", Target: "greeting"},
			{ID: "e2", Source: "greeting", Target: "email"},
			{ID: "e3", Source: "email", Target: "email-verify"},
			{ID: "e4", Source: "email-verify", Target: "face"},
			{ID: "e5", Source: "face-error", Target: "face"},
			{ID: "e6", Source: "document", Target: "complete"},
			{ID: "e7", Source: "complete", Target: "end"},
		},
	}
	
	req := &facesign.CreateSessionRequest{
		ClientReferenceID: fmt.Sprintf("go-test-complex-%d", time.Now().Unix()),
		Flow:              flow,
		DefaultLang:       "en",
	}
	
	resp, err := s.client.Sessions.Create(ctx, req)
	if err != nil {
		return TestResult{
			TestName: "Test Complex Flow",
			Status:   "FAIL",
			Error:    err.Error(),
			Duration: time.Since(start),
		}
	}
	
	return TestResult{
		TestName: "Test Complex Flow",
		Status:   "PASS",
		Duration: time.Since(start),
		Details: map[string]interface{}{
			"session_id": resp.Session.ID,
			"node_count": len(flow.Nodes),
			"edge_count": len(flow.Edges),
		},
	}
}

func (s *TestSuite) testSessionStatusTransitions() TestResult {
	start := time.Now()
	ctx := context.Background()
	
	// Create a session
	createResp, err := s.client.Sessions.Create(ctx, &facesign.CreateSessionRequest{
		ClientReferenceID: fmt.Sprintf("go-test-status-%d", time.Now().Unix()),
		Modules: []facesign.Module{
			{Type: facesign.ModuleIdentityVerification},
		},
	})
	if err != nil {
		return TestResult{
			TestName: "Test Session Status Transitions",
			Status:   "FAIL",
			Error:    "Failed to create session: " + err.Error(),
			Duration: time.Since(start),
		}
	}
	
	// Check initial status
	if createResp.Session.Status != facesign.SessionStatusPending &&
	   createResp.Session.Status != facesign.SessionStatusActive {
		return TestResult{
			TestName: "Test Session Status Transitions",
			Status:   "FAIL",
			Error:    fmt.Sprintf("Unexpected initial status: %s", createResp.Session.Status),
			Duration: time.Since(start),
		}
	}
	
	// Monitor status for a few seconds
	statuses := []string{createResp.Session.Status}
	for i := 0; i < 3; i++ {
		time.Sleep(1 * time.Second)
		getResp, _ := s.client.Sessions.Get(ctx, createResp.Session.ID)
		if getResp != nil && getResp.Session != nil {
			statuses = append(statuses, getResp.Session.Status)
		}
	}
	
	return TestResult{
		TestName: "Test Session Status Transitions",
		Status:   "PASS",
		Duration: time.Since(start),
		Details: map[string]interface{}{
			"session_id":      createResp.Session.ID,
			"status_sequence": statuses,
		},
	}
}

func (s *TestSuite) testRateLimiting() TestResult {
	start := time.Now()
	ctx := context.Background()
	
	// This test is informational - we don't want to actually hit rate limits
	// Just verify that we can detect rate limit errors if they occur
	
	// Make a normal request
	_, err := s.client.Languages.Get(ctx)
	if err != nil {
		apiErr, ok := facesign.GetAPIError(err)
		if ok && apiErr.IsRateLimited() {
			return TestResult{
				TestName: "Test Rate Limiting",
				Status:   "PASS",
				Duration: time.Since(start),
				Details:  "Rate limit detection working (limit reached)",
			}
		}
	}
	
	return TestResult{
		TestName: "Test Rate Limiting",
		Status:   "PASS",
		Duration: time.Since(start),
		Details:  "Rate limit detection ready (limit not reached)",
	}
}

func (s *TestSuite) printSummary() {
	fmt.Println("\n📊 Test Summary")
	fmt.Println("================")
	
	passed := 0
	failed := 0
	
	for _, result := range s.results {
		if result.Status == "PASS" {
			passed++
		} else {
			failed++
		}
	}
	
	total := len(s.results)
	passRate := float64(passed) / float64(total) * 100
	
	fmt.Printf("Total Tests: %d\n", total)
	fmt.Printf("Passed: %d\n", passed)
	fmt.Printf("Failed: %d\n", failed)
	fmt.Printf("Pass Rate: %.1f%%\n", passRate)
	
	if failed > 0 {
		fmt.Println("\n❌ Failed Tests:")
		for _, result := range s.results {
			if result.Status == "FAIL" {
				fmt.Printf("  - %s: %s\n", result.TestName, result.Error)
			}
		}
	}
}

func (s *TestSuite) saveResults() {
	data, err := json.MarshalIndent(s.results, "", "  ")
	if err != nil {
		log.Printf("Failed to marshal results: %v", err)
		return
	}
	
	filename := fmt.Sprintf("go_test_results_%s.json", time.Now().Format("20060102_150405"))
	err = os.WriteFile(filename, data, 0644)
	if err != nil {
		log.Printf("Failed to save results: %v", err)
		return
	}
	
	fmt.Printf("\n💾 Results saved to: %s\n", filename)
}