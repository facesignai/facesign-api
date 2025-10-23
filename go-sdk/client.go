package facesign

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"runtime"
	"time"
)

const (
	defaultBaseURL = "https://api.facesign.ai"
	defaultTimeout = 30 * time.Second
	userAgent      = "facesign-go-sdk"
)

// Client is the FaceSign API client
type Client struct {
	// HTTP client for making requests
	httpClient *http.Client
	
	// Base URL for API requests
	baseURL *url.URL
	
	// API key for authentication
	apiKey string
	
	// User agent string
	userAgent string
	
	// Services
	Sessions  *SessionsService
	Languages *LanguagesService
	Avatars   *AvatarsService
}

// ClientOption is a functional option for configuring the client
type ClientOption func(*Client)

// WithHTTPClient sets a custom HTTP client
func WithHTTPClient(httpClient *http.Client) ClientOption {
	return func(c *Client) {
		c.httpClient = httpClient
	}
}

// WithBaseURL sets a custom base URL
func WithBaseURL(baseURL string) ClientOption {
	return func(c *Client) {
		if u, err := url.Parse(baseURL); err == nil {
			c.baseURL = u
		}
	}
}

// WithTimeout sets the HTTP client timeout
func WithTimeout(timeout time.Duration) ClientOption {
	return func(c *Client) {
		c.httpClient.Timeout = timeout
	}
}

// WithUserAgent sets a custom user agent
func WithUserAgent(userAgent string) ClientOption {
	return func(c *Client) {
		c.userAgent = userAgent
	}
}

// NewClient creates a new FaceSign API client
func NewClient(apiKey string, opts ...ClientOption) *Client {
	baseURL, _ := url.Parse(defaultBaseURL)
	
	c := &Client{
		httpClient: &http.Client{
			Timeout: defaultTimeout,
		},
		baseURL:   baseURL,
		apiKey:    apiKey,
		userAgent: fmt.Sprintf("%s/%s go/%s", userAgent, version, runtime.Version()),
	}
	
	// Apply options
	for _, opt := range opts {
		opt(c)
	}
	
	// Initialize services
	c.Sessions = &SessionsService{client: c}
	c.Languages = &LanguagesService{client: c}
	c.Avatars = &AvatarsService{client: c}
	
	return c
}

// newRequest creates a new HTTP request
func (c *Client) newRequest(ctx context.Context, method, path string, body interface{}) (*http.Request, error) {
	u := c.baseURL.ResolveReference(&url.URL{Path: path})
	
	var buf io.ReadWriter
	if body != nil {
		buf = new(bytes.Buffer)
		enc := json.NewEncoder(buf)
		enc.SetEscapeHTML(false)
		if err := enc.Encode(body); err != nil {
			return nil, &ClientError{
				Operation: "encode request body",
				Err:       err,
			}
		}
	}
	
	req, err := http.NewRequestWithContext(ctx, method, u.String(), buf)
	if err != nil {
		return nil, &ClientError{
			Operation: "create request",
			Err:       err,
		}
	}
	
	// Set headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")
	req.Header.Set("User-Agent", c.userAgent)
	req.Header.Set("X-API-Key", c.apiKey)
	
	return req, nil
}

// do sends an HTTP request and decodes the response
func (c *Client) do(ctx context.Context, req *http.Request, v interface{}) error {
	resp, err := c.httpClient.Do(req)
	if err != nil {
		select {
		case <-ctx.Done():
			return &ClientError{
				Operation: "request cancelled",
				Err:       ctx.Err(),
			}
		default:
			return &ClientError{
				Operation: "send request",
				Err:       err,
			}
		}
	}
	defer resp.Body.Close()
	
	// Check for errors
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return parseAPIError(resp)
	}
	
	// Decode response if needed
	if v != nil {
		if err := json.NewDecoder(resp.Body).Decode(v); err != nil {
			return &ClientError{
				Operation: "decode response",
				Err:       err,
			}
		}
	}
	
	return nil
}

// get performs a GET request
func (c *Client) get(ctx context.Context, path string, v interface{}) error {
	req, err := c.newRequest(ctx, http.MethodGet, path, nil)
	if err != nil {
		return err
	}
	return c.do(ctx, req, v)
}

// post performs a POST request
func (c *Client) post(ctx context.Context, path string, body, v interface{}) error {
	req, err := c.newRequest(ctx, http.MethodPost, path, body)
	if err != nil {
		return err
	}
	return c.do(ctx, req, v)
}

// put performs a PUT request
func (c *Client) put(ctx context.Context, path string, body, v interface{}) error {
	req, err := c.newRequest(ctx, http.MethodPut, path, body)
	if err != nil {
		return err
	}
	return c.do(ctx, req, v)
}

// delete performs a DELETE request
func (c *Client) delete(ctx context.Context, path string) error {
	req, err := c.newRequest(ctx, http.MethodDelete, path, nil)
	if err != nil {
		return err
	}
	return c.do(ctx, req, nil)
}

// version is the SDK version
const version = "1.1.0"