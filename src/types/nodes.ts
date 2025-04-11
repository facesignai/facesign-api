export enum FSNodeType {
  START = 'start',
  END = 'end',
  CONVERSATION = 'conversation',
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
  nodeType: FSNodeType.CONVERSATION
  prompt: string
  transitions: FSNodeTransition[]
}

export interface FSEndNode extends FSNodeBase {
  type: FSNodeType.END
}

export type FSNode = FSStartNode | FSConversationNode | FSEndNode

export type FSEdge = {
  id: string
  source: string
  target: string
}
