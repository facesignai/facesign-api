"""
FaceSign Python SDK

Official Python SDK for the FaceSign identity verification API.
"""

from .client import FaceSignClient, AsyncFaceSignClient
from .models.errors import FaceSignError, FaceSignAPIError, AuthenticationError, ValidationError
from .models.sessions import Session, SessionSettings, CreateSessionResponse

__version__ = "1.0.19"
__all__ = [
    "FaceSignClient",
    "AsyncFaceSignClient",
    "FaceSignError",
    "FaceSignAPIError", 
    "AuthenticationError",
    "ValidationError",
    "Session",
    "SessionSettings",
    "CreateSessionResponse",
]