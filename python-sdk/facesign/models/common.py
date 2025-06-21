"""
Common types and enums used across the FaceSign API.
"""

from enum import Enum
from typing import Optional, Dict, Any, List
from pydantic import BaseModel


class Zone(str, Enum):
    """Geographic zones for the API."""
    
    ES = "es"  # United States
    EU = "eu"  # European Union


class SessionStatus(str, Enum):
    """Status of a verification session."""
    
    REQUIRES_INPUT = "requiresInput"
    PROCESSING = "processing"
    CANCELED = "canceled"
    COMPLETE = "complete"


class ClientSecret(BaseModel):
    """Client secret for frontend integration."""
    
    secret: str
    created_at: Optional[int] = None  # Made optional as API doesn't always include this
    expire_at: int
    url: Optional[str] = None  # Made optional as API doesn't always include this
    
    class Config:
        # Allow API to use camelCase field names
        alias_generator = lambda field_name: {
            'created_at': 'createdAt',
            'expire_at': 'expireAt'
        }.get(field_name, field_name)
        populate_by_name = True


class Lang(BaseModel):
    """Supported language."""
    
    id: str
    title: str


class Avatar(BaseModel):
    """Available AI avatar."""
    
    id: str
    name: str
    gender: str
    image_url: str
    created_at: Optional[int] = None  # API includes this field
    is_disabled: Optional[bool] = None  # API includes this field
    
    class Config:
        # Allow API to use camelCase field names
        alias_generator = lambda field_name: {
            'image_url': 'imageUrl',
            'created_at': 'createdAt',
            'is_disabled': 'isDisabled'
        }.get(field_name, field_name)
        populate_by_name = True


class Phrase(BaseModel):
    """Conversation phrase in session transcript."""
    
    id: str
    created_at: int
    text: str
    is_avatar: bool


class SessionReportAIAnalysisSection(BaseModel):
    """Section of AI analysis report."""
    
    title: str
    short_description: str
    long_description: str


class SessionReportAIAnalysis(BaseModel):
    """AI analysis of verification session."""
    
    age_min: int
    age_max: int
    sex: str
    real_person_or_virtual: str
    overall_summary: str
    analysis: List[SessionReportAIAnalysisSection]


class SessionReport(BaseModel):
    """Verification session report with results."""
    
    transcript: List[Phrase]
    ai_analysis: Optional[SessionReportAIAnalysis] = None
    location: Optional[Dict[str, Any]] = None
    device: Optional[Dict[str, Any]] = None
    liveness_detected: Optional[bool] = None
    lang: Optional[str] = None
    extracted_data: Optional[Dict[str, str]] = None
    screenshots: Optional[List[str]] = None
    videos: Optional[Dict[str, str]] = None
    is_verified: Optional[bool] = None


# Response types for API endpoints
class GetLangsResponse(BaseModel):
    """Response from GET /langs endpoint."""
    
    langs: List[Lang]


class GetAvatarsResponse(BaseModel):
    """Response from GET /avatars endpoint."""
    
    avatars: List[Avatar]