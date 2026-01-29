export enum CriterionEvaluation {
  normal = "normal",
  suspicious = "suspicious",
  highFraudRisk = "highFraudRisk",
}

export type CriterionAnalysis = {
  observation: string
  confidence: number
  evaluation: CriterionEvaluation
}

export type Criterion =
  | "behavioralAnomalies"
  | "environmentalConsistency"
  | "eyeAndHeadMovement"
  | "faceAuthenticity"
  | "facialExpressionAndMovement"
  | "interactionConfidence"
  | "lipSyncAccuracy"
  | "presenceOfSuspiciousObjectsOrPeople"
  | "useOfExternalDevices"
  | string

export type VideoAIAnalysis = Partial<Record<Criterion, CriterionAnalysis>>
