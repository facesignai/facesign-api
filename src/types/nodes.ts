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
  EXTERNAL_CALL = "external_call",
  FIELD_CONDITION = "field_condition",
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
 * Where a value is read from when building an external-call payload or evaluating
 * a field condition.
 * - `extractedData` — a field declared in `extractionSchema`. If it has not yet
 *   been extracted from the transcript, it is extracted on demand at the moment
 *   it is needed.
 * - `providedData` — a key in `session.settings.providedData` (set at creation or
 *   written by a prior EXTERNAL_CALL / `awaitExternal` poll).
 */
export enum FSValueSource {
  EXTRACTED_DATA = "extractedData",
  PROVIDED_DATA = "providedData",
}

/** A reference to a single value held in one of the value sources. */
export interface FSFieldRef {
  source: FSValueSource
  field: string
}

/** A value that is either a literal or a reference to a session value. */
export type FSValueOperand =
  | { type: "literal"; value: string | number | boolean }
  | ({ type: "ref" } & FSFieldRef)

export type FSExternalCallMethod = "GET" | "POST"

/**
 * One entry in the outbound request payload: a request key and where its value
 * comes from.
 */
export interface FSExternalCallVar {
  /** Key under which the value is placed in the request payload. */
  name: string
  /** Literal value or a reference resolved from session data. */
  value: FSValueOperand
}

export interface FSExternalRequest {
  /**
   * Endpoint to call. Must pass the server-side allowlist. The current
   * `sessionId` is appended automatically as a query parameter.
   */
  url: string
  /** HTTP method. Defaults to POST (JSON body). GET sends `vars` as query params. */
  method?: FSExternalCallMethod
  /** Payload variables. Each resolves to a literal or a session value. */
  vars?: FSExternalCallVar[]
}

/**
 * Optional polling behavior for a CONVERSATION node. When present, the node
 * converses normally while polling an external endpoint in the background until
 * the result is ready, a timeout elapses, or the call errors — then it exits via
 * the matching `exits` target without needing a user utterance.
 *
 * Readiness is signaled by the endpoint at the transport level: HTTP 200 with a
 * JSON body means "ready" — the flat response is merged into `providedData` and
 * the node exits via `onDataReady` (usually a FIELD_CONDITION that branches on
 * the merged value). HTTP 202 means "still pending" — keep polling. Any other
 * status exits via `onError`. If `poll.timeoutMs` elapses first, the node exits
 * via `onTimeout`. Normal conversational `outcomes` remain active in parallel;
 * whichever transition fires first wins.
 */
export interface FSAwaitExternalConfig {
  request: FSExternalRequest
  poll: {
    intervalMs: number
    timeoutMs: number
  }
  exits: {
    onDataReady: FSNodeId
    onTimeout: FSNodeId
    onError: FSNodeId
  }
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
  /**
   * When set, the node polls an external endpoint in the background while the
   * dialog continues, and exits via `awaitExternal.exits` when the result is
   * ready, times out, or errors — without requiring a user utterance. The
   * conversational `outcomes` above remain active in parallel.
   */
  awaitExternal?: FSAwaitExternalConfig
}

/**
 * The four possible results of a liveness check. The set is total and
 * non-overlapping: every check ends in exactly one of them.
 *
 * - `livenessDetected` — a live person is in front of the camera.
 * - `deepfakeDetected` — a spoof or manipulation was detected.
 * - `noFace` — frames were captured, but no face is on them.
 * - `inconclusive` — there is no verdict: the detector could not decide, did
 *   not run, or there was nothing to analyze. This is a failure of the check,
 *   not of the user — route it deliberately (a retry, a step-up, a manual
 *   review or a stop), never to the happy path by default.
 */
export enum FSLivenessDetectionOutcome {
  LIVENESS_DETECTED = "livenessDetected",
  DEEPFAKE_DETECTED = "deepfakeDetected",
  NO_FACE = "noFace",
  INCONCLUSIVE = "inconclusive",
}

/**
 * Checks whether the user is a real person or a deepfake by analyzing the video feed.
 *
 * Requires camera access. Needs several seconds of video for analysis —
 * do not place immediately after a PERMISSIONS node. Add a CONVERSATION node
 * in between to accumulate video data.
 *
 * Recommended flow order: PERMISSIONS → CONVERSATION → LIVENESS_DETECTION
 *
 * Every outcome must be wired: `outcomes` is a total map over
 * `FSLivenessDetectionOutcome`, including `inconclusive`. An inconclusive
 * check means the detector produced no verdict — the reason is reported in
 * `LivenessDetectionNodeReport.inconclusiveReason`, but the routing decision
 * is yours and yours alone.
 */
export interface FSLivenessDetectionNode extends FSNodeBase {
  type: FSNodeType.LIVENESS_DETECTION
  outcomes: Record<FSLivenessDetectionOutcome, FSNodeId>
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

/**
 * Calls an external endpoint mid-session and merges the (flat, one-level) JSON
 * response into `providedData`, then advances to `outcome`. This node never
 * branches — branch on the stored response with a FIELD_CONDITION node.
 *
 * The response must be a flat object of scalar values (string | number | boolean);
 * nested values are ignored. Response keys become `providedData` keys. Request
 * values are resolved from `extractedData` (extracted on demand) or `providedData`.
 */
export interface FSExternalCallNode extends FSNodeBase {
  type: FSNodeType.EXTERNAL_CALL
  request: FSExternalRequest
  /** Next node (linear advance; this node does not branch). */
  outcome: FSNodeId
}

export enum FSConditionOperator {
  EQUALS = "equals",
  NOT_EQUALS = "notEquals",
  GT = "gt",
  LT = "lt",
  GTE = "gte",
  LTE = "lte",
  EXISTS = "exists",
  NOT_EXISTS = "notExists",
}

/**
 * A single branching rule. `left` is a reference to a session value; `right` is a
 * literal or another reference (omitted for `exists` / `notExists`). If the rule
 * evaluates true, the flow routes to `outcome`.
 */
export interface FSFieldConditionRule {
  left: FSFieldRef
  operator: FSConditionOperator
  right?: FSValueOperand
  outcome: FSNodeId
}

/**
 * Deterministic (no-LLM) router. Evaluates `rules` top to bottom; the first rule
 * that matches routes to its `outcome`. If none match, routes to `default`.
 * Equality normalizes types (compared as trimmed strings) so "1234", 1234 and
 * " 1234 " are treated as equal.
 */
export interface FSFieldConditionNode extends FSNodeBase {
  type: FSNodeType.FIELD_CONDITION
  rules: NonEmptyArray<FSFieldConditionRule>
  default: FSNodeId
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
  | FSExternalCallNode
  | FSFieldConditionNode
