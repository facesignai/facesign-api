export enum FSNodeType {
  START = 'start',
  END = 'end',
  CONVERSATION = 'conversation',
  LIVENESS_DETECTION = 'liveness_detection',
  ENTER_EMAIL = 'enter_email',
  DATA_VALIDATION = 'data_validation',
  DOCUMENT_SCAN = 'document_scan',
  RECOGNITION = 'recognition',
  FACE_SCAN = 'face_scan',
}

export interface FSNodeBase {
  id: string
  type: FSNodeType
}

export type FSTransitionId = string
export interface FSStartNode extends FSNodeBase {
  type: FSNodeType.START
}

export interface FSNodeTransition {
  id: string
  condition: string
}

export interface FSConversationNode extends FSNodeBase {
  type: FSNodeType.CONVERSATION
  prompt: string
  transitions: FSNodeTransition[]
}

export enum FSLivenessDetectionOutcome {
  LIVENESS_DETECTED = 'livenessDetected',
  DEEPFAKE_DETECTED = 'deepfakeDetected',
  NO_FACE = 'noFace',
}

export interface FSLivenessDetectionNode extends FSNodeBase {
  type: FSNodeType.LIVENESS_DETECTION
  outcomes: Record<FSLivenessDetectionOutcome, FSTransitionId>
}

export enum FSEnterEmailOutcome {
  EMAIL_ENTERED = 'emailEntered',
  CANCELED = 'canceled',
}
export interface FSEnterEmailNode extends FSNodeBase {
  type: FSNodeType.ENTER_EMAIL
  outcomes: Record<FSEnterEmailOutcome, FSTransitionId>
}

export interface FSDataValidationNode extends FSNodeBase {
  type: FSNodeType.DATA_VALIDATION
  transitions: FSNodeTransition[]
  validation: {
    field: string
    action: string
    value?: string
  }
}

export enum FSRecognitionOutcome {
  RECOGNIZED = 'recognized',
  NEW_USER = 'newUser',
  NO_FACE = 'noFace',
}

export interface FSRecognitionNode extends FSNodeBase {
  type: FSNodeType.RECOGNITION
  outcomes: Record<FSRecognitionOutcome, FSTransitionId>
}

export enum FSDocumentType {
  UNKNOWN = 'MRTD_TYPE_UNKNOWN',
  IDENTITY_CARD = 'MRTD_TYPE_IDENITY_CARD',
  PASSPORT = 'MRTD_TYPE_PASSPORT',
  VISA = 'MRTD_TYPE_VISA',
  GREEN_CARD = 'MRTD_TYPE_GREEN_CARD',
  MYS_PASS_IMM13P = 'MRTD_TYPE_MYS_PASS_IMM13P',
  DL = 'MRTD_TYPE_DL',
  INTERNAL_TRAVEL_DOCUMENT = 'MRTD_TYPE_INTERNAL_TRAVEL_DOCUMENT',
  BORDER_CROSSING_CARD = 'MRTD_TYPE_BORDER_CROSSING_CARD',
}

export enum FSDocumentScanOutcome {
  SCAN_SUCCESS = 'scanSuccess',
  // SCAN_FAILURE = 'scanFailure',
  USER_CANCELLED = 'userCancelled',
  TIMEOUT = 'scanTimeout',
  // PARTIAL_DATA = 'partialDataExtracted',
  // VALIDATION_FAILURE = 'validationFailure',
}

export enum FSDocumentScanMode {
  SINGLE_SIDE = 'SINGLE_SIDE',
  MULTI_SIDE = 'MULTI_SIDE',
  BARCODE = 'BARCODE',
}

export interface FSDocumentScanNode extends FSNodeBase {
  type: FSNodeType.DOCUMENT_SCAN
  scanningMode: FSDocumentScanMode
  allowedDocumentTypes: FSDocumentType[] // Configuration for selectable document types
  // Other configurations like scan region, specific recognizers can be added here later
  outcomes: Record<FSDocumentScanOutcome, FSTransitionId> // Fixed outcomes for flow branching
  showTorchButton?: boolean      // Default: true
  showCameraSwitch?: boolean      // Default: true
}

export interface FSEndNode extends FSNodeBase {
  type: FSNodeType.END
}

export enum FSFaceScanMode {
  CAPTURE = 'capture',      // Only capture face image
  COMPARE = 'compare',      // Capture and compare with reference
}

export enum FSFaceScanOutcome {
  // Capture mode outcomes
  CAPTURED = 'captured',
  NO_FACE = 'noFace',
  ERROR = 'error',
  
  // Compare mode outcomes (when mode === 'compare')
  MATCH = 'match',
  NO_MATCH = 'noMatch',
}

export interface FSFaceScanNode extends FSNodeBase {
  type: FSNodeType.FACE_SCAN
  outcomes: Record<FSFaceScanOutcome, FSTransitionId>
  
  // Core configuration
  mode: FSFaceScanMode // Determines capture-only or capture+compare
  
  // Capture configuration (always used)
  captureInstructions?: string
  saveToField?: string // Where to save captured face URL in session data
  requireLiveness?: boolean
  
  // Compare configuration (only used when mode === 'compare')
  referenceImageSource?: 'session' | 'providedData' | 'url'
  referenceImageKey?: string
  referenceImageUrl?: string
  similarityThreshold?: number
  
  // Advanced configuration
  captureDelay?: number // Milliseconds before capture (default: 3000)
  detectionInterval?: number // How often to check for faces (default: 150ms)
  qualityThreshold?: number // Overall quality score 0-1 (default: 0.7)
  blurThreshold?: number // Blur detection threshold (default: 50)
  minFaceSize?: number // Minimum face size in pixels (default: 100)
  maxFaceSize?: number // Maximum face size in pixels (default: 400)
  enableSound?: boolean // Enable audio feedback (default: true)
  enableHaptics?: boolean // Enable haptic feedback (default: true)
  useWebGL?: boolean // Use WebGL acceleration when available (default: true)
  maxRetries?: number // Maximum capture attempts (default: 3)
}

export type FSNode =
  | FSStartNode
  | FSConversationNode
  | FSEndNode
  | FSEnterEmailNode
  | FSLivenessDetectionNode
  | FSDataValidationNode
  | FSDocumentScanNode
  | FSRecognitionNode
  | FSFaceScanNode

export type FSEdge = {
  id: string
  source: string
  target: string
}
