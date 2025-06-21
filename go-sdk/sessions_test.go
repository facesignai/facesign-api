package facesign

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestSessionsCreate(t *testing.T) {
	ctx := context.Background()
	
	t.Run("successful creation with modules", func(t *testing.T) {
		expectedResp := &CreateSessionResponse{
			Session: &Session{
				ID:                "vs_123",
				ClientReferenceID: "user-123",
				Status:            SessionStatusPending,
				CreatedAt:         1234567890000,
			},
			ClientSecret: &ClientSecret{
				ID:     "cs_123",
				Secret: "secret_123",
				URL:    "https://verify.facesign.ai/s/secret_123",
			},
		}
		
		server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			assert.Equal(t, http.MethodPost, r.Method)
			assert.Equal(t, "/v1/sessions", r.URL.Path)
			
			var req CreateSessionRequest
			err := json.NewDecoder(r.Body).Decode(&req)
			require.NoError(t, err)
			
			assert.Equal(t, "user-123", req.ClientReferenceID)
			assert.Len(t, req.Modules, 1)
			assert.Equal(t, ModuleIdentityVerification, req.Modules[0].Type)
			
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(expectedResp)
		}))
		defer server.Close()
		
		client := NewClient("test-key", WithBaseURL(server.URL))
		
		req := &CreateSessionRequest{
			ClientReferenceID: "user-123",
			Modules: []Module{
				{Type: ModuleIdentityVerification},
			},
		}
		
		resp, err := client.Sessions.Create(ctx, req)
		
		require.NoError(t, err)
		assert.Equal(t, expectedResp.Session.ID, resp.Session.ID)
		assert.Equal(t, expectedResp.ClientSecret.Secret, resp.ClientSecret.Secret)
	})
	
	t.Run("successful creation with flow", func(t *testing.T) {
		server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			var req CreateSessionRequest
			json.NewDecoder(r.Body).Decode(&req)
			
			assert.NotNil(t, req.Flow)
			assert.Len(t, req.Flow.Nodes, 2)
			assert.Empty(t, req.Modules)
			
			resp := CreateSessionResponse{
				Session: &Session{
					ID:     "vs_flow_123",
					Status: SessionStatusActive,
				},
				ClientSecret: &ClientSecret{
					Secret: "secret_flow_123",
				},
			}
			
			json.NewEncoder(w).Encode(resp)
		}))
		defer server.Close()
		
		client := NewClient("test-key", WithBaseURL(server.URL))
		
		req := &CreateSessionRequest{
			ClientReferenceID: "user-456",
			Flow: &Flow{
				Nodes: []Node{
					{ID: "start", Type: NodeTypeStart},
					{ID: "end", Type: NodeTypeEnd},
				},
			},
		}
		
		resp, err := client.Sessions.Create(ctx, req)
		
		require.NoError(t, err)
		assert.Equal(t, "vs_flow_123", resp.Session.ID)
	})
	
	t.Run("validation errors", func(t *testing.T) {
		client := NewClient("test-key")
		
		// Nil request
		_, err := client.Sessions.Create(ctx, nil)
		require.Error(t, err)
		assert.Contains(t, err.Error(), "request cannot be nil")
		
		// Empty client reference ID
		_, err = client.Sessions.Create(ctx, &CreateSessionRequest{})
		require.Error(t, err)
		assert.Contains(t, err.Error(), "clientReferenceId is required")
		
		// No modules or flow
		_, err = client.Sessions.Create(ctx, &CreateSessionRequest{
			ClientReferenceID: "user-123",
		})
		require.Error(t, err)
		assert.Contains(t, err.Error(), "must specify either modules or flow")
		
		// Both modules and flow
		_, err = client.Sessions.Create(ctx, &CreateSessionRequest{
			ClientReferenceID: "user-123",
			Modules:           []Module{{Type: ModuleIdentityVerification}},
			Flow:              &Flow{},
		})
		require.Error(t, err)
		assert.Contains(t, err.Error(), "cannot specify both modules and flow")
	})
	
	t.Run("camelCase field handling", func(t *testing.T) {
		server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Return response with camelCase clientSecret
			resp := map[string]interface{}{
				"session": map[string]interface{}{
					"id":     "vs_123",
					"status": "pending",
				},
				"clientSecret": map[string]interface{}{
					"id":        "cs_123",
					"secret":    "secret_123",
					"url":       "https://verify.facesign.ai/s/secret_123",
					"expireAt":  1234567890000,
					"createdAt": 1234567890000,
				},
			}
			
			json.NewEncoder(w).Encode(resp)
		}))
		defer server.Close()
		
		client := NewClient("test-key", WithBaseURL(server.URL))
		
		req := &CreateSessionRequest{
			ClientReferenceID: "user-123",
			Modules:           []Module{{Type: ModuleIdentityVerification}},
		}
		
		resp, err := client.Sessions.Create(ctx, req)
		
		require.NoError(t, err)
		assert.NotNil(t, resp.ClientSecret)
		assert.Equal(t, "secret_123", resp.ClientSecret.Secret)
		assert.Equal(t, "https://verify.facesign.ai/s/secret_123", resp.ClientSecret.URL)
	})
}

func TestSessionsGet(t *testing.T) {
	ctx := context.Background()
	
	t.Run("successful retrieval", func(t *testing.T) {
		expectedSession := &Session{
			ID:                "vs_123",
			ClientReferenceID: "user-123",
			Status:            SessionStatusComplete,
			Report: &Report{
				IsVerified: true,
			},
		}
		
		server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			assert.Equal(t, http.MethodGet, r.Method)
			assert.Equal(t, "/v1/sessions/vs_123", r.URL.Path)
			
			resp := GetSessionResponse{
				Session: expectedSession,
			}
			
			json.NewEncoder(w).Encode(resp)
		}))
		defer server.Close()
		
		client := NewClient("test-key", WithBaseURL(server.URL))
		
		resp, err := client.Sessions.Get(ctx, "vs_123")
		
		require.NoError(t, err)
		assert.Equal(t, "vs_123", resp.Session.ID)
		assert.Equal(t, SessionStatusComplete, resp.Session.Status)
		assert.True(t, resp.Session.Report.IsVerified)
	})
	
	t.Run("empty session ID", func(t *testing.T) {
		client := NewClient("test-key")
		
		_, err := client.Sessions.Get(ctx, "")
		require.Error(t, err)
		assert.Contains(t, err.Error(), "sessionID cannot be empty")
	})
	
	t.Run("not found error", func(t *testing.T) {
		server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(APIError{
				Code:    ErrorCodeNotFound,
				Message: "Session not found",
			})
		}))
		defer server.Close()
		
		client := NewClient("test-key", WithBaseURL(server.URL))
		
		_, err := client.Sessions.Get(ctx, "invalid_id")
		
		require.Error(t, err)
		apiErr, ok := GetAPIError(err)
		require.True(t, ok)
		assert.True(t, apiErr.IsNotFound())
	})
}

func TestSessionsList(t *testing.T) {
	ctx := context.Background()
	
	t.Run("successful listing with filters", func(t *testing.T) {
		expectedSessions := []Session{
			{ID: "vs_1", Status: SessionStatusComplete},
			{ID: "vs_2", Status: SessionStatusComplete},
		}
		
		server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			assert.Equal(t, http.MethodGet, r.Method)
			assert.Equal(t, "/v1/sessions", r.URL.Path)
			
			// Check query parameters
			query := r.URL.Query()
			assert.Equal(t, "10", query.Get("limit"))
			assert.Equal(t, "5", query.Get("offset"))
			assert.Equal(t, "complete", query.Get("status"))
			assert.Equal(t, "createdAt", query.Get("sortBy"))
			assert.Equal(t, "desc", query.Get("sortOrder"))
			
			resp := ListSessionsResponse{
				Sessions: expectedSessions,
				Total:    25,
				Limit:    10,
				Offset:   5,
			}
			
			json.NewEncoder(w).Encode(resp)
		}))
		defer server.Close()
		
		client := NewClient("test-key", WithBaseURL(server.URL))
		
		req := &ListSessionsRequest{
			Limit:     10,
			Offset:    5,
			Status:    SessionStatusComplete,
			SortBy:    "createdAt",
			SortOrder: "desc",
		}
		
		resp, err := client.Sessions.List(ctx, req)
		
		require.NoError(t, err)
		assert.Len(t, resp.Sessions, 2)
		assert.Equal(t, 25, resp.Total)
		assert.Equal(t, 10, resp.Limit)
		assert.Equal(t, 5, resp.Offset)
	})
	
	t.Run("nil request defaults", func(t *testing.T) {
		server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Should have no query parameters
			assert.Empty(t, r.URL.Query())
			
			resp := ListSessionsResponse{
				Sessions: []Session{},
				Total:    0,
			}
			
			json.NewEncoder(w).Encode(resp)
		}))
		defer server.Close()
		
		client := NewClient("test-key", WithBaseURL(server.URL))
		
		resp, err := client.Sessions.List(ctx, nil)
		
		require.NoError(t, err)
		assert.Empty(t, resp.Sessions)
	})
}

func TestSessionsRefreshClientSecret(t *testing.T) {
	ctx := context.Background()
	
	t.Run("successful refresh", func(t *testing.T) {
		expectedSecret := &ClientSecret{
			ID:        "cs_new_123",
			Secret:    "new_secret_123",
			URL:       "https://verify.facesign.ai/s/new_secret_123",
			ExpireAt:  1234567890000,
			CreatedAt: 1234567890000,
		}
		
		server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			assert.Equal(t, http.MethodPost, r.Method)
			assert.Equal(t, "/v1/sessions/vs_123/client-secret", r.URL.Path)
			
			json.NewEncoder(w).Encode(expectedSecret)
		}))
		defer server.Close()
		
		client := NewClient("test-key", WithBaseURL(server.URL))
		
		resp, err := client.Sessions.RefreshClientSecret(ctx, "vs_123")
		
		require.NoError(t, err)
		assert.Equal(t, "new_secret_123", resp.Secret)
		assert.Equal(t, expectedSecret.URL, resp.URL)
	})
	
	t.Run("empty session ID", func(t *testing.T) {
		client := NewClient("test-key")
		
		_, err := client.Sessions.RefreshClientSecret(ctx, "")
		require.Error(t, err)
		assert.Contains(t, err.Error(), "sessionID cannot be empty")
	})
}