export enum CriterionEvaluation {
  normal = "normal",
  suspicious = "suspicious",
  highFraudRisk = "highFraudRisk",
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

export type CriterionAnalysis = {
  criterion: Criterion
  observation: string
  confidence: number
  evaluation: CriterionEvaluation
}

export type VideoAIAnalysis = CriterionAnalysis[]
