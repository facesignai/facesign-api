package facesign

import (
	"context"
)

// AvatarsService handles communication with avatar-related endpoints
type AvatarsService struct {
	client *Client
}

// Get retrieves all available avatars
func (a *AvatarsService) Get(ctx context.Context) (*GetAvatarsResponse, error) {
	// First try to get the response as expected structure
	var resp GetAvatarsResponse
	err := a.client.get(ctx, "/v1/avatars", &resp)
	if err != nil {
		return nil, err
	}
	
	// If avatars is empty, the API might be returning an array directly
	if len(resp.Avatars) == 0 {
		var avatars []Avatar
		if err := a.client.get(ctx, "/v1/avatars", &avatars); err == nil {
			resp.Avatars = avatars
		}
	}
	
	return &resp, nil
}

// GetByID retrieves a specific avatar by ID
func (a *AvatarsService) GetByID(ctx context.Context, avatarID string) (*Avatar, error) {
	avatars, err := a.Get(ctx)
	if err != nil {
		return nil, err
	}
	
	for _, avatar := range avatars.Avatars {
		if avatar.ID == avatarID {
			return &avatar, nil
		}
	}
	
	return nil, &APIError{
		StatusCode: 404,
		Code:       ErrorCodeNotFound,
		Message:    "Avatar not found",
	}
}

// GetActive retrieves only active (non-disabled) avatars
func (a *AvatarsService) GetActive(ctx context.Context) (*GetAvatarsResponse, error) {
	avatars, err := a.Get(ctx)
	if err != nil {
		return nil, err
	}
	
	// Filter out disabled avatars
	activeAvatars := make([]Avatar, 0, len(avatars.Avatars))
	for _, avatar := range avatars.Avatars {
		if !avatar.IsDisabled {
			activeAvatars = append(activeAvatars, avatar)
		}
	}
	
	return &GetAvatarsResponse{
		Avatars: activeAvatars,
	}, nil
}