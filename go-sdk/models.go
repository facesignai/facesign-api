package facesign

import (
	"encoding/json"
	"time"
)

// Module types
const (
	ModuleIdentityVerification    = "identityVerification"
	ModuleDocumentAuthentication  = "documentAuthentication"
	ModuleEmailVerification       = "emailVerification"
	ModuleSMSVerification         = "smsVerification"
)

// Session statuses
const (
	SessionStatusPending   = "pending"
	SessionStatusActive    = "active"
	SessionStatusComplete  = "complete"
	SessionStatusExpired   = "expired"
	SessionStatusCancelled = "cancelled"
)

// Node types for flow-based sessions
const (
	NodeTypeStart            = "start"
	NodeTypeEnd              = "end"
	NodeTypeConversation     = "conversation"
	NodeTypeFaceScan         = "face_scan"
	NodeTypeDocumentScan     = "document_scan"
	NodeTypeEmailInput       = "email_input"
	NodeTypeSMSInput         = "sms_input"
	NodeTypeEmailVerification = "email_verification"
	NodeTypeSMSVerification   = "sms_verification"
	NodeTypeConditional      = "conditional"
)

// Module represents a verification module
type Module struct {
	Type string `json:"type"`
}

// Session represents a verification session
type Session struct {
	ID                string                 `json:"id"`
	ClientReferenceID string                 `json:"clientReferenceId"`
	Status            string                 `json:"status"`
	CreatedAt         int64                  `json:"createdAt"`
	UpdatedAt         int64                  `json:"updatedAt"`
	ExpiresAt         int64                  `json:"expiresAt"`
	Metadata          map[string]interface{} `json:"metadata,omitempty"`
	Flow              *Flow                  `json:"flow,omitempty"`
	Modules           []Module               `json:"modules,omitempty"`
	Report            *Report                `json:"report,omitempty"`
}

// ClientSecret represents client access credentials
type ClientSecret struct {
	ID        string `json:"id"`
	Secret    string `json:"secret"`
	URL       string `json:"url"`
	ExpireAt  int64  `json:"expireAt"`
	CreatedAt int64  `json:"createdAt"`
}

// Report represents verification results
type Report struct {
	IsVerified          bool                   `json:"isVerified"`
	VerificationResults map[string]interface{} `json:"verificationResults"`
}

// Flow represents a flow-based session configuration
type Flow struct {
	Nodes []Node `json:"nodes"`
	Edges []Edge `json:"edges"`
}

// Node represents a flow node
type Node struct {
	ID          string                 `json:"id"`
	Type        string                 `json:"type"`
	Prompt      string                 `json:"prompt,omitempty"`
	Mode        string                 `json:"mode,omitempty"`
	Outcomes    map[string]string      `json:"outcomes,omitempty"`
	Transitions []Transition           `json:"transitions,omitempty"`
	Data        map[string]interface{} `json:"data,omitempty"`
}

// Edge represents a flow edge
type Edge struct {
	ID     string `json:"id"`
	Source string `json:"source"`
	Target string `json:"target"`
}

// Transition represents a node transition
type Transition struct {
	ID        string `json:"id"`
	Condition string `json:"condition"`
}

// Language represents a supported language
type Language struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	IsRightToLeft bool `json:"isRightToLeft"`
}

// Avatar represents an available avatar
type Avatar struct {
	ID         string `json:"id"`
	Name       string `json:"name"`
	Gender     string `json:"gender"`
	ImageURL   string `json:"imageUrl"`
	CreatedAt  int64  `json:"createdAt,omitempty"`
	IsDisabled bool   `json:"isDisabled,omitempty"`
}

// CreateSessionRequest represents session creation parameters
type CreateSessionRequest struct {
	ClientReferenceID string                 `json:"clientReferenceId"`
	Metadata          map[string]interface{} `json:"metadata,omitempty"`
	Modules           []Module               `json:"modules,omitempty"`
	Flow              *Flow                  `json:"flow,omitempty"`
	InitialPhrase     string                 `json:"initialPhrase,omitempty"`
	DefaultLang       string                 `json:"defaultLang,omitempty"`
	AvatarID          string                 `json:"avatarId,omitempty"`
}

// CreateSessionResponse represents session creation result
type CreateSessionResponse struct {
	Session      *Session      `json:"session"`
	ClientSecret *ClientSecret `json:"clientSecret"`
}

// GetSessionResponse represents session retrieval result
type GetSessionResponse struct {
	Session *Session `json:"session"`
}

// ListSessionsRequest represents session listing parameters
type ListSessionsRequest struct {
	Limit     int    `json:"limit,omitempty"`
	Offset    int    `json:"offset,omitempty"`
	Status    string `json:"status,omitempty"`
	SortBy    string `json:"sortBy,omitempty"`
	SortOrder string `json:"sortOrder,omitempty"`
}

// ListSessionsResponse represents session listing result
type ListSessionsResponse struct {
	Sessions []Session `json:"sessions"`
	Total    int       `json:"total"`
	Limit    int       `json:"limit"`
	Offset   int       `json:"offset"`
}

// RefreshClientSecretResponse represents new client secret
type RefreshClientSecretResponse struct {
	*ClientSecret
}

// GetLanguagesResponse represents available languages
type GetLanguagesResponse struct {
	Langs []Language `json:"langs"`
}

// GetAvatarsResponse represents available avatars
type GetAvatarsResponse struct {
	Avatars []Avatar `json:"avatars"`
}

// Time returns the time.Time representation of a Unix timestamp
func unixToTime(unix int64) time.Time {
	return time.Unix(unix/1000, (unix%1000)*int64(time.Millisecond))
}

// Custom JSON marshaling for better date handling
func (s *Session) MarshalJSON() ([]byte, error) {
	type Alias Session
	return json.Marshal(&struct {
		*Alias
		CreatedAtTime time.Time `json:"createdAtTime,omitempty"`
		UpdatedAtTime time.Time `json:"updatedAtTime,omitempty"`
		ExpiresAtTime time.Time `json:"expiresAtTime,omitempty"`
	}{
		Alias:         (*Alias)(s),
		CreatedAtTime: unixToTime(s.CreatedAt),
		UpdatedAtTime: unixToTime(s.UpdatedAt),
		ExpiresAtTime: unixToTime(s.ExpiresAt),
	})
}