"""
Main FaceSign API client.
"""

import logging
from typing import Optional, Dict, Any, List, Union
from urllib.parse import urljoin

import httpx
from pydantic import ValidationError

from .models.sessions import (
    SessionSettings,
    CreateSessionResponse,
    GetSessionResponse,
    GetSessionsResponse,
)
from .models.common import GetLangsResponse, GetAvatarsResponse, ClientSecret
from .models.errors import (
    FaceSignError,
    FaceSignAPIError,
    AuthenticationError,
    ValidationError as FaceSignValidationError,
    NotFoundError,
    RateLimitError,
    ServerError,
    ErrorResponse,
    ErrorType,
)
from .api.sessions import SessionsAPI
from .api.languages import LanguagesAPI
from .api.avatars import AvatarsAPI


class FaceSignClient:
    """
    Main client for the FaceSign API.
    
    Provides both synchronous and asynchronous access to all FaceSign API endpoints.
    """
    
    def __init__(
        self,
        api_key: str,
        server_url: str = "https://api.facesign.ai",
        timeout: float = 10.0,
        log_level: str = "INFO",
    ):
        """
        Initialize the FaceSign client.
        
        Args:
            api_key: Your FaceSign API key (sk_test_... or sk_live_...)
            server_url: Base URL for the API (default: production)
            timeout: Request timeout in seconds
            log_level: Logging level (DEBUG, INFO, WARNING, ERROR)
        """
        self.api_key = api_key
        self.server_url = server_url.rstrip("/")
        self.timeout = timeout
        
        # Setup logging
        self.logger = logging.getLogger("facesign")
        self.logger.setLevel(getattr(logging, log_level.upper()))
        
        # HTTP client configuration
        self._client_config = {
            "timeout": timeout,
            "headers": {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "User-Agent": "facesign-python-sdk/1.0.19",
                "Facesign-Version": "2024-12-18",
            }
        }
        
        # Initialize API sections
        self.sessions = SessionsAPI(self)
        self.languages = LanguagesAPI(self)
        self.avatars = AvatarsAPI(self)
    
    def _get_url(self, path: str) -> str:
        """Get full URL for an API path."""
        return urljoin(self.server_url, path.lstrip("/"))
    
    def _handle_error_response(self, response: httpx.Response) -> None:
        """Handle API error responses and raise appropriate exceptions."""
        try:
            error_data = response.json()
            error_response = ErrorResponse(**error_data)
            error_details = error_response.error
            
            # Map error types to specific exceptions
            error_classes = {
                ErrorType.AUTHENTICATION_ERROR: AuthenticationError,
                ErrorType.VALIDATION_ERROR: FaceSignValidationError,
                ErrorType.NOT_FOUND_ERROR: NotFoundError,
                ErrorType.RATE_LIMIT_ERROR: RateLimitError,
                ErrorType.SERVER_ERROR: ServerError,
            }
            
            error_class = error_classes.get(error_details.type, FaceSignAPIError)
            raise error_class(error_details, response.status_code)
            
        except ValidationError:
            # Fallback for malformed error responses
            raise FaceSignAPIError(
                error_details=type('ErrorDetails', (), {
                    'type': ErrorType.SERVER_ERROR,
                    'message': f"HTTP {response.status_code}: {response.text}",
                    'code': None
                })(),
                status_code=response.status_code
            )
    
    def request(
        self,
        method: str,
        path: str,
        params: Optional[Dict[str, Any]] = None,
        data: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Make a synchronous request to the API.
        
        Args:
            method: HTTP method (GET, POST, etc.)
            path: API endpoint path
            params: Query parameters
            data: Request body data
            
        Returns:
            Parsed JSON response
            
        Raises:
            FaceSignAPIError: For API errors
            FaceSignError: For client errors
        """
        url = self._get_url(path)
        
        self.logger.debug(f"Making {method} request to {url}")
        
        try:
            with httpx.Client(**self._client_config) as client:
                response = client.request(
                    method=method,
                    url=url,
                    params=params,
                    json=data,
                )
                
                if not response.is_success:
                    self._handle_error_response(response)
                
                return response.json()
                
        except httpx.RequestError as e:
            raise FaceSignError(f"Request failed: {str(e)}")
        except Exception as e:
            if isinstance(e, (FaceSignError, FaceSignAPIError)):
                raise
            raise FaceSignError(f"Unexpected error: {str(e)}")
    
    async def arequest(
        self,
        method: str,
        path: str,
        params: Optional[Dict[str, Any]] = None,
        data: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Make an asynchronous request to the API.
        
        Args:
            method: HTTP method (GET, POST, etc.)
            path: API endpoint path
            params: Query parameters
            data: Request body data
            
        Returns:
            Parsed JSON response
            
        Raises:
            FaceSignAPIError: For API errors
            FaceSignError: For client errors
        """
        url = self._get_url(path)
        
        self.logger.debug(f"Making async {method} request to {url}")
        
        try:
            async with httpx.AsyncClient(**self._client_config) as client:
                response = await client.request(
                    method=method,
                    url=url,
                    params=params,
                    json=data,
                )
                
                if not response.is_success:
                    self._handle_error_response(response)
                
                return response.json()
                
        except httpx.RequestError as e:
            raise FaceSignError(f"Request failed: {str(e)}")
        except Exception as e:
            if isinstance(e, (FaceSignError, FaceSignAPIError)):
                raise
            raise FaceSignError(f"Unexpected error: {str(e)}")


class AsyncFaceSignClient(FaceSignClient):
    """
    Async-first client for the FaceSign API.
    
    Provides async context manager support and async-only methods.
    """
    
    async def __aenter__(self):
        """Async context manager entry."""
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        # Cleanup if needed
        pass