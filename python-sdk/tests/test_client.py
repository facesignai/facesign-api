"""
Tests for the main FaceSign client.
"""

import pytest
import httpx
from unittest.mock import patch

from facesign import FaceSignClient
from facesign.models.errors import AuthenticationError, ValidationError


class TestFaceSignClient:
    """Test cases for FaceSignClient."""
    
    def test_client_initialization(self):
        """Test client initialization with default parameters."""
        client = FaceSignClient(api_key="sk_test_123")
        
        assert client.api_key == "sk_test_123"
        assert client.server_url == "https://api.facesign.ai"
        assert client.timeout == 10.0
        assert hasattr(client, "sessions")
        assert hasattr(client, "languages")
        assert hasattr(client, "avatars")
    
    def test_client_custom_config(self):
        """Test client initialization with custom configuration."""
        client = FaceSignClient(
            api_key="sk_test_456",
            server_url="https://api-staging.facesign.ai",
            timeout=30.0,
            log_level="DEBUG"
        )
        
        assert client.api_key == "sk_test_456"
        assert client.server_url == "https://api-staging.facesign.ai"
        assert client.timeout == 30.0
    
    def test_get_url(self):
        """Test URL construction."""
        client = FaceSignClient(api_key="sk_test_123")
        
        assert client._get_url("/sessions") == "https://api.facesign.ai/sessions"
        assert client._get_url("sessions") == "https://api.facesign.ai/sessions"
        assert client._get_url("/sessions/123") == "https://api.facesign.ai/sessions/123"
    
    @patch('httpx.Client.request')
    def test_successful_request(self, mock_request):
        """Test successful API request."""
        # Mock successful response
        mock_response = httpx.Response(
            status_code=200,
            json={"test": "data"},
            request=httpx.Request("GET", "https://api.facesign.ai/test")
        )
        mock_response.is_success = True
        mock_request.return_value = mock_response
        
        client = FaceSignClient(api_key="sk_test_123")
        result = client.request("GET", "/test")
        
        assert result == {"test": "data"}
        mock_request.assert_called_once()
    
    @patch('httpx.Client.request')
    def test_authentication_error(self, mock_request):
        """Test authentication error handling."""
        # Mock authentication error response
        mock_response = httpx.Response(
            status_code=401,
            json={
                "error": {
                    "type": "authentication_error",
                    "message": "Invalid API key provided"
                }
            },
            request=httpx.Request("GET", "https://api.facesign.ai/test")
        )
        mock_response.is_success = False
        mock_request.return_value = mock_response
        
        client = FaceSignClient(api_key="sk_test_invalid")
        
        with pytest.raises(AuthenticationError) as exc_info:
            client.request("GET", "/test")
        
        assert exc_info.value.status_code == 401
        assert "Invalid API key" in str(exc_info.value)
    
    @patch('httpx.Client.request')
    def test_validation_error(self, mock_request):
        """Test validation error handling."""
        # Mock validation error response
        mock_response = httpx.Response(
            status_code=400,
            json={
                "error": {
                    "type": "validation_error",
                    "message": "Missing required field: client_reference_id"
                }
            },
            request=httpx.Request("POST", "https://api.facesign.ai/sessions")
        )
        mock_response.is_success = False
        mock_request.return_value = mock_response
        
        client = FaceSignClient(api_key="sk_test_123")
        
        with pytest.raises(ValidationError) as exc_info:
            client.request("POST", "/sessions", data={})
        
        assert exc_info.value.status_code == 400
        assert "client_reference_id" in str(exc_info.value)