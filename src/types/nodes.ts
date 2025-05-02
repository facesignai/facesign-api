export enum FSNodeType {
  START = 'start',
  END = 'end',
  CONVERSATION = 'conversation',
  LIVENESS_DETECTION = 'liveness_detection',
  ENTER_EMAIL = 'enter_email',
  DATA_VALIDATION = 'data_validation'
}

export interface FSNodeBase {
  id: string
  type: FSNodeType
}

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

export interface FSLivenessDetectionNode extends FSNodeBase {
  type: FSNodeType.LIVENESS_DETECTION
  transitions: FSNodeTransition[]
}

export interface FSEnterEmailNode extends FSNodeBase {
  type: FSNodeType.ENTER_EMAIL
  transitions: FSNodeTransition[]
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

export type FSNode = FSStartNode | FSConversationNode | FSEndNode | FSEnterEmailNode | FSLivenessDetectionNode | FSDataValidationNode

export type FSEdge = {
  id: string
  source: string
  target: string
}
