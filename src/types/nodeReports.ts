import {
  FSNodeType,
  FSNodeId,
  FSLivenessDetectionOutcome,
  FSEnterEmailOutcome,
  FSDocumentScanOutcome,
  FSRecognitionOutcome,
  FSFaceScanOutcome,
  FSTwoFactorOutcome,
  FSPermissionsOutcome,
  FSFaceCompareOutcome,
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

export type TwoFactorEmailNodeReport = NodeReportBase & {
  type: FSNodeType.TWO_FACTOR_EMAIL
  outcome: FSTwoFactorOutcome
  report?: TwoFactorReport
}

export type TwoFactorSMSNodeReport = NodeReportBase & {
  type: FSNodeType.TWO_FACTOR_SMS
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

export type ExternalCallReport = {
  url: string
  status?: number
  ok: boolean
  response?: Record<string, string | number | boolean>
  error?: string
  attempts?: number
}

export type ExternalCallNodeReport = NodeReportBase & {
  type: FSNodeType.EXTERNAL_CALL
  outcome: FSNodeId
  report?: ExternalCallReport
}

export type FieldConditionNodeReport = NodeReportBase & {
  type: FSNodeType.FIELD_CONDITION
  outcome: FSNodeId
  /** Index of the first matching rule, or omitted when `default` was taken. */
  matchedRuleIndex?: number
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

export type PermissionsNodeReport = NodeReportBase & {
  type: FSNodeType.PERMISSIONS
  outcome: FSPermissionsOutcome
}

export type FaceCompareReport = {
  isMatch: boolean
  similarity?: number
  sourceAImageFound: boolean
  sourceBImageFound: boolean
  error?: string
}

export type FaceCompareNodeReport = NodeReportBase & {
  type: FSNodeType.FACE_COMPARE
  outcome: FSFaceCompareOutcome
  report?: FaceCompareReport
}

export type NodeReport =
  | ConversationNodeReport
  | LivenessDetectionNodeReport
  | EnterEmailNodeReport
  | DataValidationNodeReport
  | DocumentScanNodeReport
  | RecognitionNodeReport
  | TwoFactorEmailNodeReport
  | TwoFactorSMSNodeReport
  | FaceScanNodeReport
  | PermissionsNodeReport
  | FaceCompareNodeReport
  | ExternalCallNodeReport
  | FieldConditionNodeReport
