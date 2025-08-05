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

export enum Criterion {
  behavioralAnomalies = "behavioralAnomalies",
  environmentalConsistency = "environmentalConsistency",
  eyeAndHeadMovement = "eyeAndHeadMovement",
  faceAuthenticity = "faceAuthenticity",
  facialExpressionAndMovement = "facialExpressionAndMovement",
  interactionConfidence = "interactionConfidence",
  lipSyncAccuracy = "lipSyncAccuracy",
  presenceOfSuspiciousObjectsOrPeople = "presenceOfSuspiciousObjectsOrPeople",
  useOfExternalDevices = "useOfExternalDevices",
}

export type VideoAIAnalysis = Record<Criterion, CriterionAnalysis>
