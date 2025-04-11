export enum FSNodeType {
  START = 'start',
  END = 'end',
  CONVERSATION = 'conversation',
}

export interface FSNodeBase {
  id: string
  nodeType: FSNodeType
}

export interface FSStartNode extends FSNodeBase {
  nodeType: FSNodeType.START
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
  nodeType: FSNodeType.END
}

export type FSNode = FSStartNode | FSConversationNode | FSEndNode

export type FSEdge = {
  id: string
  source: string
  target: string
}
