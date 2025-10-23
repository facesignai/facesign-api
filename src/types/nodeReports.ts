import {
  FSNodeType,
  FSNodeId,
  FSLivenessDetectionOutcome,
  FSEnterEmailOutcome,
  FSDocumentScanOutcome,
  FSRecognitionOutcome,
  FSFaceScanOutcome,
  FSTwoFactorOutcome,
} from "./nodes"

import { DocumentScanReport } from "./docScanning"

export type NodeReportBase = {
  type: FSNodeType
  nodeId: string
  createdAt: number
}

export type TwoFactorReport =
  | { email: string; phoneNumber?: never }
  | { phoneNumber: string; email?: never }
  | { email: string; phoneNumber: string }

export type TwoFactorNodeReport = NodeReportBase & {
  type: FSNodeType.TWO_FACTOR
  outcome: FSTwoFactorOutcome
  report?: TwoFactorReport
}

export type CompareFacesReport = {
  isMatch: boolean
  similarity?: number
  sourceImageFaceFound: boolean
  targetImageFaceFound: boolean
  error?: string
}

export type FaceScanReport = {
  livenessChallengePassed?: boolean
  aiLivenessCheckPassed?: boolean
  compareFacesReport?: CompareFacesReport
}

export type FaceScanNodeReport = NodeReportBase & {
  type: FSNodeType.FACE_SCAN
  outcome: FSFaceScanOutcome
  report?: FaceScanReport
}

export type RecognitionReport = Record<string, string> & {
  name?: string
  email?: string
  phone?: string
  company?: string
  jobTitle?: string
}

export type RecognitionNodeReport = NodeReportBase & {
  type: FSNodeType.RECOGNITION
  outcome: FSRecognitionOutcome
  report?: RecognitionReport
}

export type DocumentScanNodeReport = NodeReportBase & {
  type: FSNodeType.DOCUMENT_SCAN
  outcome: FSDocumentScanOutcome
  report?: DocumentScanReport
}

export type DataValidationNodeReport = NodeReportBase & {
  type: FSNodeType.DATA_VALIDATION
  outcome: FSNodeId
}

export type EnterEmailNodeReport = NodeReportBase & {
  type: FSNodeType.ENTER_EMAIL
  outcome: FSEnterEmailOutcome
  email?: string
}

export type LivenessDetectionNodeReport = NodeReportBase & {
  type: FSNodeType.LIVENESS_DETECTION
  outcome: FSLivenessDetectionOutcome
}

export type ConversationNodeReport = NodeReportBase & {
  type: FSNodeType.CONVERSATION
  outcome: FSNodeId
}

export type NodeReport =
  | ConversationNodeReport
  | LivenessDetectionNodeReport
  | EnterEmailNodeReport
  | DataValidationNodeReport
  | DocumentScanNodeReport
  | RecognitionNodeReport
  | TwoFactorNodeReport
  | FaceScanNodeReport
