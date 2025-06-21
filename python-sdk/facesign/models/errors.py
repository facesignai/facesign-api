"""
Error types and exceptions for FaceSign API.
"""

from enum import Enum
from typing import Optional
from pydantic import BaseModel


class ErrorType(str, Enum):
    """Error types from the FaceSign API."""
    
    AUTHENTICATION_ERROR = "authentication_error"
    VALIDATION_ERROR = "validation_error" 
    NOT_FOUND_ERROR = "not_found_error"
    RATE_LIMIT_ERROR = "rate_limit_error"
    SERVER_ERROR = "server_error"


class ErrorDetails(BaseModel):
    """Error details from API response."""
    
    type: ErrorType
    message: str
    code: Optional[str] = None


class ErrorResponse(BaseModel):
    """API error response structure."""
    
    error: ErrorDetails


# Exception classes
class FaceSignError(Exception):
    """Base exception for all FaceSign errors."""
    
    def __init__(self, message: str, error_type: Optional[ErrorType] = None, code: Optional[str] = None):
        super().__init__(message)
        self.message = message
        self.error_type = error_type
        self.code = code


class FaceSignAPIError(FaceSignError):
    """Exception raised for API errors."""
    
    def __init__(self, error_details: ErrorDetails, status_code: int):
        super().__init__(error_details.message, error_details.type, error_details.code)
        self.status_code = status_code
        self.error_details = error_details


class AuthenticationError(FaceSignAPIError):
    """Exception raised for authentication errors."""
    pass


class ValidationError(FaceSignAPIError):
    """Exception raised for validation errors."""
    pass


class NotFoundError(FaceSignAPIError):
    """Exception raised when resource is not found.""" 
    pass


class RateLimitError(FaceSignAPIError):
    """Exception raised when rate limit is exceeded."""
    pass


class ServerError(FaceSignAPIError):
    """Exception raised for server errors."""
    pass