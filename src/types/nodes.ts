import { DocumentType, ScanningMode } from "./docScanning"

export enum FSNodeType {
  START = "start",
  END = "end",
  CONVERSATION = "conversation",
  LIVENESS_DETECTION = "liveness_detection",
  ENTER_EMAIL = "enter_email",
  DATA_VALIDATION = "data_validation",
  DOCUMENT_SCAN = "document_scan",
  RECOGNITION = "recognition",
  FACE_SCAN = "face_scan",
  TWO_FACTOR = "two_factor",
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
  doesNotRequireReply?: boolean
}

export enum FSLivenessDetectionOutcome {
  LIVENESS_DETECTED = "livenessDetected",
  DEEPFAKE_DETECTED = "deepfakeDetected",
  NO_FACE = "noFace",
}

export interface FSLivenessDetectionNode extends FSNodeBase {
  type: FSNodeType.LIVENESS_DETECTION
  outcomes: Record<FSLivenessDetectionOutcome, FSTransitionId>
}

export enum FSEnterEmailOutcome {
  EMAIL_ENTERED = "emailEntered",
  CANCELED = "canceled",
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
  RECOGNIZED = "recognized",
  NEW_USER = "newUser",
  NO_FACE = "noFace",
}

export interface FSRecognitionNode extends FSNodeBase {
  type: FSNodeType.RECOGNITION
  outcomes: Record<FSRecognitionOutcome, FSTransitionId>
}

export type FSDocumentType = DocumentType

export enum FSDocumentScanOutcome {
  SCAN_SUCCESS = "scanSuccess",
  // SCAN_FAILURE = 'scanFailure',
  USER_CANCELLED = "userCancelled",
  TIMEOUT = "scanTimeout",
  // PARTIAL_DATA = 'partialDataExtracted',
  // VALIDATION_FAILURE = 'validationFailure',
}

export type FSDocumentScanMode = ScanningMode

export interface FSDocumentScanNode extends FSNodeBase {
  type: FSNodeType.DOCUMENT_SCAN
  scanningMode: FSDocumentScanMode
  allowedDocumentTypes: FSDocumentType[] // Configuration for selectable document types
  // Other configurations like scan region, specific recognizers can be added here later
  outcomes: Record<FSDocumentScanOutcome, FSTransitionId> // Fixed outcomes for flow branching
  showTorchButton?: boolean // Default: true
  showCameraSwitch?: boolean // Default: true
  showMirrorCameraButton?: boolean // // Default: true
}

export interface FSEndNode extends FSNodeBase {
  type: FSNodeType.END
}

export enum FSFaceScanOutcome {
  PASSED = "passed",
  NOT_PASSED = "notPassed",
  CANCELLED = "cancelled",
  ERROR = "error",
}

export interface FSFaceScanNode extends FSNodeBase {
  type: FSNodeType.FACE_SCAN
  outcomes: Record<FSFaceScanOutcome, FSTransitionId>

  // Capture configuration (always used)
  captureInstructions?: string
  requireLivenessChallenge?: boolean
  requireAILivenessCheck?: boolean
  referenceImageKey?: string
  similarityThreshold?: number

  // Advanced configuration
  enableSound?: boolean // Enable audio feedback (default: true)
  enableHaptics?: boolean // Enable haptic feedback (default: true)
}

export enum FSTwoFactorChannel {
  EMAIL = "email",
  SMS = "sms",
}

export enum FSTwoFactorOutcome {
  VERIFIED = "verified",
  DELIVERY_FAILED = "delivery_failed",
  FAILED_UNVERIFIED = "failed_unverified",
  CANCELLED = "cancelled",
  ERROR = "error",
}

export interface FSTwoFactorNode extends FSNodeBase {
  type: FSNodeType.TWO_FACTOR
  outcomes: Record<FSTwoFactorOutcome, FSTransitionId>
  // Core configuration
  channels: FSTwoFactorChannel[] // Email, SMS, or both

  // Templates (support variables like {{userName}}, {{code}}, {{companyName}})
  emailTemplate?: string
  smsTemplate?: string

  // Verification settings
  otpLength?: number // 4-8 digits, default 6
  expirySeconds?: number // default 300 (5 minutes)
  maxAttempts?: number // default 3
  resendAfterSeconds?: number // optional min delay before "Resend" enabled

  // UI settings
  showUI?: boolean // Show on-screen toast notification, default true
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
  | FSTwoFactorNode

export type FSEdge = {
  id: string
  source: string
  target: string
}
