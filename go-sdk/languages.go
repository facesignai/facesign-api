package facesign

import (
	"context"
)

// LanguagesService handles communication with language-related endpoints
type LanguagesService struct {
	client *Client
}

// Get retrieves all supported languages
func (l *LanguagesService) Get(ctx context.Context) (*GetLanguagesResponse, error) {
	// First try to get the response as expected structure
	var resp GetLanguagesResponse
	err := l.client.get(ctx, "/v1/langs", &resp)
	if err != nil {
		return nil, err
	}
	
	// If langs is empty, the API might be returning an array directly
	if len(resp.Langs) == 0 {
		var langs []Language
		if err := l.client.get(ctx, "/v1/langs", &langs); err == nil {
			resp.Langs = langs
		}
	}
	
	return &resp, nil
}

// GetByID retrieves a specific language by ID
func (l *LanguagesService) GetByID(ctx context.Context, langID string) (*Language, error) {
	langs, err := l.Get(ctx)
	if err != nil {
		return nil, err
	}
	
	for _, lang := range langs.Langs {
		if lang.ID == langID {
			return &lang, nil
		}
	}
	
	return nil, &APIError{
		StatusCode: 404,
		Code:       ErrorCodeNotFound,
		Message:    "Language not found",
	}
}