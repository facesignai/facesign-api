package facesign

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// ErrorCode represents API error codes
type ErrorCode string

const (
	// Client errors
	ErrorCodeBadRequest          ErrorCode = "BAD_REQUEST"
	ErrorCodeUnauthorized        ErrorCode = "UNAUTHORIZED"
	ErrorCodeForbidden           ErrorCode = "FORBIDDEN"
	ErrorCodeNotFound            ErrorCode = "NOT_FOUND"
	ErrorCodeConflict            ErrorCode = "CONFLICT"
	ErrorCodeTooManyRequests     ErrorCode = "TOO_MANY_REQUESTS"
	
	// Server errors
	ErrorCodeInternalServerError ErrorCode = "INTERNAL_SERVER_ERROR"
	ErrorCodeServiceUnavailable  ErrorCode = "SERVICE_UNAVAILABLE"
	
	// Custom errors
	ErrorCodeInvalidAPIKey       ErrorCode = "INVALID_API_KEY"
	ErrorCodeSessionExpired      ErrorCode = "SESSION_EXPIRED"
	ErrorCodeInvalidFlow         ErrorCode = "INVALID_FLOW"
)

// APIError represents an error response from the FaceSign API
type APIError struct {
	StatusCode int                    `json:"statusCode"`
	Code       ErrorCode              `json:"code"`
	Message    string                 `json:"message"`
	Details    map[string]interface{} `json:"details,omitempty"`
	RequestID  string                 `json:"requestId,omitempty"`
}

// Error implements the error interface
func (e *APIError) Error() string {
	if e.RequestID != "" {
		return fmt.Sprintf("FaceSign API error: %s - %s (request ID: %s)", e.Code, e.Message, e.RequestID)
	}
	return fmt.Sprintf("FaceSign API error: %s - %s", e.Code, e.Message)
}

// IsNotFound returns true if the error is a not found error
func (e *APIError) IsNotFound() bool {
	return e.Code == ErrorCodeNotFound || e.StatusCode == http.StatusNotFound
}

// IsUnauthorized returns true if the error is an authorization error
func (e *APIError) IsUnauthorized() bool {
	return e.Code == ErrorCodeUnauthorized || e.Code == ErrorCodeInvalidAPIKey || e.StatusCode == http.StatusUnauthorized
}

// IsRateLimited returns true if the error is due to rate limiting
func (e *APIError) IsRateLimited() bool {
	return e.Code == ErrorCodeTooManyRequests || e.StatusCode == http.StatusTooManyRequests
}

// ClientError represents a client-side error
type ClientError struct {
	Operation string
	Err       error
}

// Error implements the error interface
func (e *ClientError) Error() string {
	return fmt.Sprintf("FaceSign client error during %s: %v", e.Operation, e.Err)
}

// Unwrap returns the underlying error
func (e *ClientError) Unwrap() error {
	return e.Err
}

// parseAPIError attempts to parse an API error from an HTTP response
func parseAPIError(resp *http.Response) error {
	var apiErr APIError
	
	// Try to decode the error response
	if err := json.NewDecoder(resp.Body).Decode(&apiErr); err != nil {
		// If we can't decode it, create a generic error
		apiErr = APIError{
			StatusCode: resp.StatusCode,
			Code:       ErrorCode(http.StatusText(resp.StatusCode)),
			Message:    fmt.Sprintf("HTTP %d: %s", resp.StatusCode, http.StatusText(resp.StatusCode)),
		}
	} else {
		// Ensure status code is set
		if apiErr.StatusCode == 0 {
			apiErr.StatusCode = resp.StatusCode
		}
	}
	
	// Extract request ID from headers if not in body
	if apiErr.RequestID == "" {
		apiErr.RequestID = resp.Header.Get("X-Request-ID")
	}
	
	return &apiErr
}

// IsAPIError checks if an error is an APIError
func IsAPIError(err error) bool {
	_, ok := err.(*APIError)
	return ok
}

// GetAPIError attempts to extract an APIError from an error
func GetAPIError(err error) (*APIError, bool) {
	apiErr, ok := err.(*APIError)
	return apiErr, ok
}