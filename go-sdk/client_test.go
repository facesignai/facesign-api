package facesign

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
	
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestNewClient(t *testing.T) {
	apiKey := "test-api-key"
	
	t.Run("default configuration", func(t *testing.T) {
		client := NewClient(apiKey)
		
		assert.NotNil(t, client)
		assert.Equal(t, apiKey, client.apiKey)
		assert.Equal(t, defaultBaseURL, client.baseURL.String())
		assert.NotNil(t, client.httpClient)
		assert.NotNil(t, client.Sessions)
		assert.NotNil(t, client.Languages)
		assert.NotNil(t, client.Avatars)
	})
	
	t.Run("with custom options", func(t *testing.T) {
		customURL := "https://api.dev.facesign.ai"
		customTimeout := 60 * time.Second
		customUA := "my-app/1.0"
		
		client := NewClient(apiKey,
			WithBaseURL(customURL),
			WithTimeout(customTimeout),
			WithUserAgent(customUA),
		)
		
		assert.Equal(t, customURL, client.baseURL.String())
		assert.Equal(t, customTimeout, client.httpClient.Timeout)
		assert.Contains(t, client.userAgent, customUA)
	})
	
	t.Run("with custom HTTP client", func(t *testing.T) {
		customClient := &http.Client{
			Timeout: 45 * time.Second,
		}
		
		client := NewClient(apiKey, WithHTTPClient(customClient))
		assert.Equal(t, customClient, client.httpClient)
	})
}

func TestClientNewRequest(t *testing.T) {
	client := NewClient("test-key")
	ctx := context.Background()
	
	t.Run("GET request", func(t *testing.T) {
		req, err := client.newRequest(ctx, http.MethodGet, "/v1/test", nil)
		
		require.NoError(t, err)
		assert.Equal(t, http.MethodGet, req.Method)
		assert.Equal(t, "https://api.facesign.ai/v1/test", req.URL.String())
		assert.Equal(t, "application/json", req.Header.Get("Content-Type"))
		assert.Equal(t, "application/json", req.Header.Get("Accept"))
		assert.Equal(t, "test-key", req.Header.Get("X-API-Key"))
		assert.Contains(t, req.Header.Get("User-Agent"), userAgent)
	})
	
	t.Run("POST request with body", func(t *testing.T) {
		body := map[string]string{"test": "value"}
		req, err := client.newRequest(ctx, http.MethodPost, "/v1/test", body)
		
		require.NoError(t, err)
		assert.Equal(t, http.MethodPost, req.Method)
		
		// Verify body
		var decoded map[string]string
		err = json.NewDecoder(req.Body).Decode(&decoded)
		require.NoError(t, err)
		assert.Equal(t, body, decoded)
	})
	
	t.Run("with context cancellation", func(t *testing.T) {
		ctx, cancel := context.WithCancel(context.Background())
		cancel()
		
		req, err := client.newRequest(ctx, http.MethodGet, "/v1/test", nil)
		require.NoError(t, err)
		assert.Equal(t, ctx, req.Context())
	})
}

func TestClientDo(t *testing.T) {
	ctx := context.Background()
	
	t.Run("successful response", func(t *testing.T) {
		server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			assert.Equal(t, "test-key", r.Header.Get("X-API-Key"))
			
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
		}))
		defer server.Close()
		
		client := NewClient("test-key", WithBaseURL(server.URL))
		req, _ := client.newRequest(ctx, http.MethodGet, "/test", nil)
		
		var result map[string]string
		err := client.do(ctx, req, &result)
		
		require.NoError(t, err)
		assert.Equal(t, "ok", result["status"])
	})
	
	t.Run("API error response", func(t *testing.T) {
		server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			w.Header().Set("X-Request-ID", "req-123")
			w.WriteHeader(http.StatusBadRequest)
			
			json.NewEncoder(w).Encode(APIError{
				Code:    ErrorCodeBadRequest,
				Message: "Invalid request",
			})
		}))
		defer server.Close()
		
		client := NewClient("test-key", WithBaseURL(server.URL))
		req, _ := client.newRequest(ctx, http.MethodPost, "/test", nil)
		
		err := client.do(ctx, req, nil)
		
		require.Error(t, err)
		apiErr, ok := GetAPIError(err)
		require.True(t, ok)
		assert.Equal(t, http.StatusBadRequest, apiErr.StatusCode)
		assert.Equal(t, ErrorCodeBadRequest, apiErr.Code)
		assert.Equal(t, "Invalid request", apiErr.Message)
		assert.Equal(t, "req-123", apiErr.RequestID)
	})
	
	t.Run("network error", func(t *testing.T) {
		client := NewClient("test-key", WithBaseURL("http://localhost:0"))
		req, _ := client.newRequest(ctx, http.MethodGet, "/test", nil)
		
		err := client.do(ctx, req, nil)
		
		require.Error(t, err)
		clientErr, ok := err.(*ClientError)
		require.True(t, ok)
		assert.Equal(t, "send request", clientErr.Operation)
	})
	
	t.Run("context cancellation", func(t *testing.T) {
		server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			time.Sleep(100 * time.Millisecond)
			w.WriteHeader(http.StatusOK)
		}))
		defer server.Close()
		
		client := NewClient("test-key", WithBaseURL(server.URL))
		
		ctx, cancel := context.WithCancel(context.Background())
		req, _ := client.newRequest(ctx, http.MethodGet, "/test", nil)
		
		// Cancel context immediately
		cancel()
		
		err := client.do(ctx, req, nil)
		require.Error(t, err)
		
		clientErr, ok := err.(*ClientError)
		require.True(t, ok)
		assert.Equal(t, "request cancelled", clientErr.Operation)
	})
}