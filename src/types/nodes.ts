export enum FSNodeType {
  START = 'start',
  END = 'end',
  CONVERSATION = 'conversation',
  LIVENESS_DETECTION = 'liveness_detection',
  ENTER_EMAIL = 'enter_email',
  DATA_VALIDATION = 'data_validation',
  DOCUMENT_SCAN = 'document_scan',
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

export enum MicroblinkDocumentType {
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
  SCAN_FAILURE = 'scanFailure',
  USER_CANCELLED = 'userCancelled',
  TIMEOUT = 'scanTimeout',
  PARTIAL_DATA = 'partialDataExtracted',
  VALIDATION_FAILURE = 'validationFailure',
}

export interface FSDocumentScanNode extends FSNodeBase {
  type: FSNodeType.DOCUMENT_SCAN
  allowedDocumentTypes: MicroblinkDocumentType[] // Configuration for selectable document types
  // Other configurations like scan region, specific recognizers can be added here later
  outcomes: Record<FSDocumentScanOutcome, FSTransitionId> // Fixed outcomes for flow branching
}

export interface FSEndNode extends FSNodeBase {
  type: FSNodeType.END
}

export type FSNode =
  | FSStartNode
  | FSConversationNode
  | FSEndNode
  | FSEnterEmailNode
  | FSLivenessDetectionNode
  | FSDataValidationNode
  | FSDocumentScanNode

export type FSEdge = {
  id: string
  source: string
  target: string
}
