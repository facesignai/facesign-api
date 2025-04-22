export enum FSNodeType {
  START = 'start',
  END = 'end',
  CONVERSATION = 'conversation',
  LIVENESS_DETECTION = 'liveness_detection',
  ENTER_EMAIL = 'enter_email'
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
  type: FSNodeType.LIVENESS_DETECTION;
}

export interface FSEnterEmailNode extends FSNodeBase {
  type: FSNodeType.ENTER_EMAIL;
}

export interface FSEndNode extends FSNodeBase {
  type: FSNodeType.END
}

export type FSNode = FSStartNode | FSConversationNode | FSEndNode | FSEnterEmailNode | FSLivenessDetectionNode

export type FSEdge = {
  id: string
  source: string
  target: string
}
