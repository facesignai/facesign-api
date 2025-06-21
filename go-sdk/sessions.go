package facesign

import (
	"context"
	"fmt"
	"net/url"
	"strconv"
)

// SessionsService handles communication with session-related endpoints
type SessionsService struct {
	client *Client
}

// Create creates a new verification session
func (s *SessionsService) Create(ctx context.Context, req *CreateSessionRequest) (*CreateSessionResponse, error) {
	if req == nil {
		return nil, &ClientError{
			Operation: "create session",
			Err:       fmt.Errorf("request cannot be nil"),
		}
	}
	
	if req.ClientReferenceID == "" {
		return nil, &ClientError{
			Operation: "create session", 
			Err:       fmt.Errorf("clientReferenceId is required"),
		}
	}
	
	// Validate that either modules or flow is provided, not both
	if len(req.Modules) > 0 && req.Flow != nil {
		return nil, &ClientError{
			Operation: "create session",
			Err:       fmt.Errorf("cannot specify both modules and flow"),
		}
	}
	
	if len(req.Modules) == 0 && req.Flow == nil {
		return nil, &ClientError{
			Operation: "create session",
			Err:       fmt.Errorf("must specify either modules or flow"),
		}
	}
	
	var resp CreateSessionResponse
	err := s.client.post(ctx, "/v1/sessions", req, &resp)
	if err != nil {
		return nil, err
	}
	
	// Handle camelCase to snake_case conversion for clientSecret field
	if resp.ClientSecret != nil && resp.ClientSecret.Secret == "" {
		// Try to handle potential field name mismatch
		var rawResp map[string]interface{}
		if err := s.client.post(ctx, "/v1/sessions", req, &rawResp); err == nil {
			if clientSecretData, ok := rawResp["clientSecret"].(map[string]interface{}); ok {
				resp.ClientSecret = &ClientSecret{
					ID:        getStringValue(clientSecretData, "id"),
					Secret:    getStringValue(clientSecretData, "secret"),
					URL:       getStringValue(clientSecretData, "url"),
					ExpireAt:  getInt64Value(clientSecretData, "expireAt"),
					CreatedAt: getInt64Value(clientSecretData, "createdAt"),
				}
			}
		}
	}
	
	return &resp, nil
}

// Get retrieves a session by ID
func (s *SessionsService) Get(ctx context.Context, sessionID string) (*GetSessionResponse, error) {
	if sessionID == "" {
		return nil, &ClientError{
			Operation: "get session",
			Err:       fmt.Errorf("sessionID cannot be empty"),
		}
	}
	
	path := fmt.Sprintf("/v1/sessions/%s", url.PathEscape(sessionID))
	var resp GetSessionResponse
	err := s.client.get(ctx, path, &resp)
	if err != nil {
		return nil, err
	}
	
	return &resp, nil
}

// List retrieves a list of sessions
func (s *SessionsService) List(ctx context.Context, req *ListSessionsRequest) (*ListSessionsResponse, error) {
	if req == nil {
		req = &ListSessionsRequest{}
	}
	
	// Build query parameters
	params := url.Values{}
	if req.Limit > 0 {
		params.Set("limit", strconv.Itoa(req.Limit))
	}
	if req.Offset > 0 {
		params.Set("offset", strconv.Itoa(req.Offset))
	}
	if req.Status != "" {
		params.Set("status", req.Status)
	}
	if req.SortBy != "" {
		params.Set("sortBy", req.SortBy)
	}
	if req.SortOrder != "" {
		params.Set("sortOrder", req.SortOrder)
	}
	
	path := "/v1/sessions"
	if len(params) > 0 {
		path += "?" + params.Encode()
	}
	
	var resp ListSessionsResponse
	err := s.client.get(ctx, path, &resp)
	if err != nil {
		return nil, err
	}
	
	return &resp, nil
}

// RefreshClientSecret generates a new client secret for a session
func (s *SessionsService) RefreshClientSecret(ctx context.Context, sessionID string) (*RefreshClientSecretResponse, error) {
	if sessionID == "" {
		return nil, &ClientError{
			Operation: "refresh client secret",
			Err:       fmt.Errorf("sessionID cannot be empty"),
		}
	}
	
	path := fmt.Sprintf("/v1/sessions/%s/client-secret", url.PathEscape(sessionID))
	var resp RefreshClientSecretResponse
	err := s.client.post(ctx, path, nil, &resp)
	if err != nil {
		return nil, err
	}
	
	return &resp, nil
}

// Helper functions for extracting values from interface maps
func getStringValue(m map[string]interface{}, key string) string {
	if v, ok := m[key].(string); ok {
		return v
	}
	return ""
}

func getInt64Value(m map[string]interface{}, key string) int64 {
	switch v := m[key].(type) {
	case float64:
		return int64(v)
	case int64:
		return v
	case int:
		return int64(v)
	default:
		return 0
	}
}