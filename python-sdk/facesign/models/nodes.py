"""
Node types for FaceSign flow-based verification system.
"""

from enum import Enum
from typing import List, Dict, Optional, Any, Union
from pydantic import BaseModel, Field


class FSNodeType(str, Enum):
    """Types of nodes in a verification flow."""
    
    START = "start"
    END = "end"
    CONVERSATION = "conversation"
    LIVENESS_DETECTION = "liveness_detection"
    ENTER_EMAIL = "enter_email"
    DATA_VALIDATION = "data_validation"
    DOCUMENT_SCAN = "document_scan"
    RECOGNITION = "recognition"
    FACE_SCAN = "face_scan"
    TWO_FACTOR = "two_factor"


class FSDocumentType(str, Enum):
    """Document types for document scanning."""
    
    UNKNOWN = "MRTD_TYPE_UNKNOWN"
    IDENTITY_CARD = "MRTD_TYPE_IDENITY_CARD"  # Note: typo preserved from API
    PASSPORT = "MRTD_TYPE_PASSPORT"
    VISA = "MRTD_TYPE_VISA"
    GREEN_CARD = "MRTD_TYPE_GREEN_CARD"
    MYS_PASS_IMM13P = "MRTD_TYPE_MYS_PASS_IMM13P"
    DL = "MRTD_TYPE_DL"
    INTERNAL_TRAVEL_DOCUMENT = "MRTD_TYPE_INTERNAL_TRAVEL_DOCUMENT"
    BORDER_CROSSING_CARD = "MRTD_TYPE_BORDER_CROSSING_CARD"


class FSDocumentScanMode(str, Enum):
    """Document scanning modes."""
    
    SINGLE_SIDE = "SINGLE_SIDE"
    MULTI_SIDE = "MULTI_SIDE"
    BARCODE = "BARCODE"


class FSFaceScanMode(str, Enum):
    """Face scanning modes."""
    
    CAPTURE = "capture"
    COMPARE = "compare"


class FSTwoFactorChannel(str, Enum):
    """Two-factor authentication channels."""
    
    EMAIL = "email"
    SMS = "sms"


class FSTwoFactorContactSource(str, Enum):
    """Sources for two-factor contact information."""
    
    SESSION_DATA = "session_data"
    MODULE_SETTINGS = "module_settings"
    RECOGNITION_MATCH = "recognition_match"


# Base node classes
class FSNodeBase(BaseModel):
    """Base class for all flow nodes."""
    
    id: str
    type: FSNodeType


class FSNodeTransition(BaseModel):
    """Transition condition for conversation nodes."""
    
    id: str
    condition: str


class FSEdge(BaseModel):
    """Edge connecting nodes in a flow."""
    
    id: str
    source: str
    target: str


# Specific node types
class FSStartNode(FSNodeBase):
    """Flow start node."""
    
    type: FSNodeType = Field(default=FSNodeType.START, frozen=True)


class FSEndNode(FSNodeBase):
    """Flow end node."""
    
    type: FSNodeType = Field(default=FSNodeType.END, frozen=True)


class FSConversationNode(FSNodeBase):
    """Conversational AI node."""
    
    type: FSNodeType = Field(default=FSNodeType.CONVERSATION, frozen=True)
    prompt: str
    transitions: List[FSNodeTransition]


class FSLivenessDetectionNode(FSNodeBase):
    """Liveness detection node."""
    
    type: FSNodeType = Field(default=FSNodeType.LIVENESS_DETECTION, frozen=True)
    outcomes: Dict[str, str]


class FSEnterEmailNode(FSNodeBase):
    """Email input node."""
    
    type: FSNodeType = Field(default=FSNodeType.ENTER_EMAIL, frozen=True)
    outcomes: Dict[str, str]
    transitions: Optional[List[FSNodeTransition]] = None


class FSDataValidationNode(FSNodeBase):
    """Data validation node."""
    
    type: FSNodeType = Field(default=FSNodeType.DATA_VALIDATION, frozen=True)
    transitions: List[FSNodeTransition]
    validation: Dict[str, Any]


class FSDocumentScanNode(FSNodeBase):
    """Document scanning node."""
    
    type: FSNodeType = Field(default=FSNodeType.DOCUMENT_SCAN, frozen=True)
    scanning_mode: FSDocumentScanMode
    allowed_document_types: List[FSDocumentType]
    outcomes: Dict[str, str]
    show_torch_button: Optional[bool] = True
    show_camera_switch: Optional[bool] = True


class FSRecognitionNode(FSNodeBase):
    """Face recognition node."""
    
    type: FSNodeType = Field(default=FSNodeType.RECOGNITION, frozen=True)
    outcomes: Dict[str, str]


class FSFaceScanNode(FSNodeBase):
    """Face scanning node."""
    
    type: FSNodeType = Field(default=FSNodeType.FACE_SCAN, frozen=True)
    mode: FSFaceScanMode
    outcomes: Dict[str, str]
    capture_instructions: Optional[str] = None
    save_to_field: Optional[str] = None
    require_liveness: Optional[bool] = None
    reference_image_source: Optional[str] = None
    reference_image_key: Optional[str] = None
    reference_image_url: Optional[str] = None
    similarity_threshold: Optional[float] = None
    capture_delay: Optional[int] = 3000
    detection_interval: Optional[int] = 150
    quality_threshold: Optional[float] = 0.7
    blur_threshold: Optional[float] = 50
    min_face_size: Optional[int] = 100
    max_face_size: Optional[int] = 400
    enable_sound: Optional[bool] = True
    enable_haptics: Optional[bool] = True
    use_webgl: Optional[bool] = True
    max_retries: Optional[int] = 3


class FSTwoFactorNode(FSNodeBase):
    """Two-factor authentication node."""
    
    type: FSNodeType = Field(default=FSNodeType.TWO_FACTOR, frozen=True)
    channels: List[FSTwoFactorChannel]
    contact_source: FSTwoFactorContactSource
    outcomes: Dict[str, str]
    static_email: Optional[str] = None
    static_phone: Optional[str] = None
    email_template: Optional[str] = None
    sms_template: Optional[str] = None
    otp_length: Optional[int] = 6
    expiry_seconds: Optional[int] = 300
    max_attempts: Optional[int] = 3
    resend_after_seconds: Optional[int] = None
    show_ui: Optional[bool] = True
    test_mode: Optional[Dict[str, Any]] = None


# Union type for all nodes
FSNode = Union[
    FSStartNode,
    FSEndNode,
    FSConversationNode,
    FSLivenessDetectionNode,
    FSEnterEmailNode,
    FSDataValidationNode,
    FSDocumentScanNode,
    FSRecognitionNode,
    FSFaceScanNode,
    FSTwoFactorNode,
]


class FSFlow(BaseModel):
    """Complete flow definition with nodes and edges."""
    
    nodes: List[FSNode]
    edges: List[FSEdge]