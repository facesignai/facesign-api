export enum FSNodeType {
  START = 'start',
  END = 'end',
  CONVERSATION = 'conversation',
  LIVENESS_DETECTION = 'liveness_detection',
  ENTER_EMAIL = 'enter_email',
  DATA_VALIDATION = 'data_validation',
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
  DEEPFAKE_DETECTED = 'deepfaceDetected',
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

export type FSEdge = {
  id: string
  source: string
  target: string
}
