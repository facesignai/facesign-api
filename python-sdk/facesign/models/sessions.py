"""
Session-related models for FaceSign API.
"""

from typing import Optional, Dict, Any, List
from pydantic import BaseModel

from .common import SessionStatus, SessionReport, ClientSecret, Zone
from .nodes import FSFlow


# Legacy module types (deprecated in favor of flows)
class EmailVerificationModule(BaseModel):
    """Email verification module (legacy)."""
    
    type: str = "emailVerification"
    name: Optional[str] = None
    email: Optional[str] = None
    public_recognition_enabled: Optional[bool] = None


class SmsVerificationModule(BaseModel):
    """SMS verification module (legacy)."""
    
    type: str = "smsVerification"
    phone: Optional[str] = None


class IdentityVerificationModule(BaseModel):
    """Identity verification module (legacy)."""
    
    type: str = "identityVerification"


class DocumentAuthenticationModule(BaseModel):
    """Document authentication module (legacy)."""
    
    type: str = "documentAuthentication"


class AgeEstimationModule(BaseModel):
    """Age estimation module (legacy)."""
    
    type: str = "ageEstimation"
    age: int


class ProofOfIntentModule(BaseModel):
    """Proof of intent module (legacy)."""
    
    type: str = "proofOfIntent"
    requested_data: List[Dict[str, Any]]


class KnowledgeVerifyModule(BaseModel):
    """Knowledge verification module (legacy)."""
    
    type: str = "knowledgeVerify"


# Customization types
class PermissionsPageCustomization(BaseModel):
    """Customization for permissions page."""
    
    button_text: Optional[str] = None
    background_type: Optional[str] = None
    background_color: Optional[str] = None
    main_heading: Optional[str] = None
    subheading: Optional[str] = None
    button_text_translates: Optional[Dict[str, str]] = None
    main_heading_translates: Optional[Dict[str, str]] = None
    subheading_translates: Optional[Dict[str, str]] = None


class ControlsCustomization(BaseModel):
    """Customization for UI controls."""
    
    show_ux_controls: Optional[bool] = None


class Customization(BaseModel):
    """UI/UX customization options."""
    
    permissions_page: Optional[PermissionsPageCustomization] = None
    controls: Optional[ControlsCustomization] = None


# Main session types
class SessionSettings(BaseModel):
    """Settings for creating a verification session."""
    
    client_reference_id: str
    metadata: Optional[Dict[str, Any]] = None  # Made optional as it's not always required
    initial_phrase: Optional[str] = None
    final_phrase: Optional[str] = None
    provided_data: Optional[Dict[str, str]] = None
    avatar_id: Optional[str] = None
    langs: Optional[List[str]] = None
    default_lang: Optional[str] = None
    zone: Optional[Zone] = None
    modules: Optional[List[Dict[str, Any]]] = None  # Legacy modules (optional)
    flow: Optional[FSFlow] = None  # Recommended flow-based approach
    customization: Optional[Customization] = None


class Session(BaseModel):
    """Verification session object."""
    
    id: str
    created_at: Optional[int] = None  # Made optional as API doesn't always include this
    started_at: Optional[int] = None
    finished_at: Optional[int] = None
    status: SessionStatus
    settings: Optional[SessionSettings] = None  # Made optional as API doesn't always include full settings
    version: Optional[str] = None
    report: Optional[SessionReport] = None


class CreateSessionResponse(BaseModel):
    """Response from creating a session."""
    
    session: Session
    client_secret: ClientSecret


class GetSessionResponse(BaseModel):
    """Response from retrieving a session."""
    
    session: Session
    client_secret: ClientSecret


class GetSessionsResponse(BaseModel):
    """Response from listing sessions."""
    
    sessions: List[Session]
    next_cursor: Optional[str] = None
    total_count: Optional[int] = None
    has_more: bool