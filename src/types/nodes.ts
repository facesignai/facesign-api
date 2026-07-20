import { DocumentType, ScanningMode } from "./docScanning"

export type NonEmptyArray<T> = [T, ...Array<T>]

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
  TWO_FACTOR_EMAIL = "two_factor_email",
  TWO_FACTOR_SMS = "two_factor_sms",
  PERMISSIONS = "permissions",
  FACE_COMPARE = "face_compare",
}

export interface FSNodeBase {
  id: string
  type: FSNodeType
}

export type FSNodeId = string
/**
 * The entry point of every flow. Each flow must have exactly one START node.
 * It has a single `outcome` that points to the first node in the flow.
 */
export interface FSStartNode extends FSNodeBase {
  type: FSNodeType.START
  outcome: FSNodeId
}

export interface FSConditionalOutcome {
  id: string
  targetNodeId: string
  condition: string
}

/**
 * The avatar speaks to the user using the `prompt` text and routes the flow based on the user's response.
 * The session stays on this node until one of the outcome conditions matches, enabling multi-turn dialog.
 *
 * The `prompt` supports two modes:
 * - Direct speech: "Say: Hi, how are you doing?"
 * - Goal-driven behavior: "Chat with the user and assess their medical knowledge."
 *
 * When using goal-driven prompts, always include realistic exit conditions in the outcomes
 * (e.g., user didn't respond after 3 attempts, dialog reached N exchanges, user refuses to answer).
 *
 * Set `doesNotRequireReply: true` for final messages before an END node where no user response is needed.
 */
export interface FSConversationNode extends FSNodeBase {
  type: FSNodeType.CONVERSATION
  prompt: string
  outcomes: NonEmptyArray<FSConditionalOutcome>
  doesNotRequireReply?: boolean
}

export enum FSLivenessDetectionOutcome {
  LIVENESS_DETECTED = "livenessDetected",
  DEEPFAKE_DETECTED = "deepfakeDetected",
  NO_FACE = "noFace",
  CAPTURE_UNAVAILABLE = "captureUnavailable",
}

type RequiredLivenessDetectionOutcome = Exclude<
  FSLivenessDetectionOutcome,
  FSLivenessDetectionOutcome.CAPTURE_UNAVAILABLE
>

/**
 * Checks whether the user is a real person or a deepfake by analyzing the video feed.
 *
 * Requires camera access. Needs several seconds of video for analysis —
 * do not place immediately after a PERMISSIONS node. Add a CONVERSATION node
 * in between to accumulate video data.
 *
 * Recommended flow order: PERMISSIONS → CONVERSATION → LIVENESS_DETECTION
 */
export interface FSLivenessDetectionNode extends FSNodeBase {
  type: FSNodeType.LIVENESS_DETECTION
  outcomes: Record<RequiredLivenessDetectionOutcome, FSNodeId> &
    Partial<Record<FSLivenessDetectionOutcome.CAPTURE_UNAVAILABLE, FSNodeId>>
}

export enum FSEnterEmailOutcome {
  EMAIL_ENTERED = "emailEntered",
  CANCELED = "canceled",
}
/**
 * Displays a UI for the user to enter their email address.
 * The collected email can be used later in the flow for two-factor authentication or data collection.
 *
 * `prompt` is an optional phrase the avatar will say at the moment the input field appears
 * (e.g., "Could you please enter your email?").
 */
export interface FSEnterEmailNode extends FSNodeBase {
  type: FSNodeType.ENTER_EMAIL
  outcomes: Record<FSEnterEmailOutcome, FSNodeId>
  prompt?: string
}

/**
 * Validates data collected during the session and routes the flow based on the result.
 * Uses a `validation` object to specify which field to check, what action to perform,
 * and an optional expected value. Uses conditional outcomes to branch the flow.
 */
export interface FSDataValidationNode extends FSNodeBase {
  type: FSNodeType.DATA_VALIDATION
  outcomes: NonEmptyArray<FSConditionalOutcome>
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

/**
 * Performs biometric face recognition to identify the user.
 * Compares the user's face against previously registered faces.
 *
 * Requires camera access. Like LIVENESS_DETECTION, needs several seconds of video —
 * do not place immediately after a PERMISSIONS node. Add a CONVERSATION node in between.
 */
export interface FSRecognitionNode extends FSNodeBase {
  type: FSNodeType.RECOGNITION
  outcomes: Record<FSRecognitionOutcome, FSNodeId>
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

/**
 * Opens a document scanning UI powered by Microblink. The user can scan identity documents
 * using their camera. Extracted data becomes available in the session report.
 *
 * `scanningMode`:
 * - "single" — scan only one side of the document
 * - "automatic" — automatically determine how many sides need to be scanned
 */
export interface FSDocumentScanNode extends FSNodeBase {
  type: FSNodeType.DOCUMENT_SCAN
  scanningMode: FSDocumentScanMode
  allowedDocumentTypes: FSDocumentType[] // Configuration for selectable document types
  // Other configurations like scan region, specific recognizers can be added here later
  outcomes: Record<FSDocumentScanOutcome, FSNodeId> // Fixed outcomes for flow branching
  showTorchButton?: boolean // Default: true
  showCameraSwitch?: boolean // Default: true
  showMirrorCameraButton?: boolean // // Default: true
}

/**
 * The terminal node of a flow. A flow can have multiple END nodes
 * (e.g., one for success path, one for failure path). It has no outcomes.
 */
export interface FSEndNode extends FSNodeBase {
  type: FSNodeType.END
}

export enum FSFaceScanOutcome {
  PASSED = "passed",
  NOT_PASSED = "notPassed",
  CANCELLED = "cancelled",
  ERROR = "error",
}

/**
 * Performs 1:1 biometric face matching. Captures the user's face and compares it
 * against a reference image to verify their identity.
 *
 * Requires camera access. Like LIVENESS_DETECTION, needs several seconds of video —
 * do not place immediately after a PERMISSIONS node.
 */
export interface FSFaceScanNode extends FSNodeBase {
  type: FSNodeType.FACE_SCAN
  outcomes: Record<FSFaceScanOutcome, FSNodeId>

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

/**
 * Base interface for two-factor authentication nodes (email and SMS).
 * Sends a one-time password (OTP) and verifies the code the user enters.
 * If the required contact info (email or phone) was not provided via `providedData`
 * or collected by a previous node, it will be requested automatically during this node.
 */
export interface FSTwoFactorNode extends FSNodeBase {
  outcomes: Record<FSTwoFactorOutcome, FSNodeId>

  // Verification settings
  otpLength?: number // 4-8 digits, default 6
  expirySeconds?: number // default 300 (5 minutes)
  maxAttempts?: number // default 3
  resendAfterSeconds?: number // optional min delay before "Resend" enabled

  // UI settings
  showUI?: boolean // Show on-screen toast notification, default true
}

export interface FSTwoFactorNodeEmail extends FSTwoFactorNode {
  type: FSNodeType.TWO_FACTOR_EMAIL
  emailTemplate?: string
}

export interface FSTwoFactorNodeSMS extends FSTwoFactorNode {
  type: FSNodeType.TWO_FACTOR_SMS
  smsTemplate?: string
}

/**
 * Requests camera and/or microphone permissions from the user.
 * Use when you need a custom prompt or want to handle the denied case with a specific flow path.
 * If the flow has no PERMISSIONS node, permissions are requested automatically.
 *
 * The `prompt` uses direct speech mode (e.g., "Say: Could you please enable your microphone so I can hear you.").
 * If the site already has permanent permissions granted, the avatar will not say this phrase
 * and the flow continues directly via the `permissionsGranted` outcome.
 */
export interface FSPermissionsNode extends FSNodeBase {
  prompt?: string
  type: FSNodeType.PERMISSIONS
  permissions: {
    camera?: boolean
    microphone?: boolean
  }
  outcomes: Record<FSPermissionsOutcome, FSNodeId>
}

export enum FSPermissionsOutcome {
  PERMISSIONS_GRANTED = "permissionsGranted",
  PERMISSIONS_DENIED = "permissionsDenied",
}

export enum FSFaceCompareSource {
  SESSION_VIDEO = "sessionVideo",
  FACE_SCAN = "faceScan",
  PROVIDED_DATA = "providedData",
  DOCUMENT_PHOTO = "documentPhoto",
}

export type FSFaceCompareSourceConfig =
  | { source: FSFaceCompareSource.SESSION_VIDEO }
  | { source: FSFaceCompareSource.FACE_SCAN }
  | { source: FSFaceCompareSource.PROVIDED_DATA; providedDataKey: string }
  | { source: FSFaceCompareSource.DOCUMENT_PHOTO }

export enum FSFaceCompareOutcome {
  MATCH = "match",
  NO_MATCH = "noMatch",
  IMAGE_UNAVAILABLE = "imageUnavailable",
}

/**
 * Compares faces from two different sources to verify they belong to the same person.
 *
 * Available sources:
 * - `sessionVideo` — frame captured from the live video feed during the session
 * - `faceScan` — higher-quality photo from a FACE_SCAN node (oval capture)
 * - `providedData` — image URL from a `providedData` field (specify the key via `providedDataKey`)
 * - `documentPhoto` — photo extracted from a scanned document (DOCUMENT_SCAN node)
 *
 * For `faceScan` and `documentPhoto`, the photo is taken from the most recent
 * completed node of that type in the session.
 */
export interface FSFaceCompareNode extends FSNodeBase {
  type: FSNodeType.FACE_COMPARE
  sourceA: FSFaceCompareSourceConfig
  sourceB: FSFaceCompareSourceConfig
  outcomes: Record<FSFaceCompareOutcome, FSNodeId>
  similarityThreshold?: number
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
  | FSTwoFactorNodeEmail
  | FSTwoFactorNodeSMS
  | FSPermissionsNode
  | FSFaceCompareNode
