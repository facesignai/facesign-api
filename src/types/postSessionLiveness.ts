/** Result of a post-session liveness assessment. */
export type PostSessionLivenessState =
  | "pending"
  | "passed"
  | "rejected"
  | "inconclusive"

export const PostSessionLivenessPolicy = {
  V1: "v1",
  V2: "v2",
} as const

export type PostSessionLivenessPolicy =
  (typeof PostSessionLivenessPolicy)[keyof typeof PostSessionLivenessPolicy]

export const PostSessionLivenessReasonCode = {
  INSUFFICIENT_EVIDENCE: "insufficient_evidence",
  PROCESSING_FAILED: "processing_failed",
  PROCESSING_TIMED_OUT: "processing_timed_out",
} as const

export type PostSessionLivenessReasonCode =
  (typeof PostSessionLivenessReasonCode)[keyof typeof PostSessionLivenessReasonCode]

export interface PostSessionLiveness {
  policyVersion: PostSessionLivenessPolicy
  state: PostSessionLivenessState
  /** Unix timestamp in milliseconds when the assessment was finalized. */
  finishedAt?: number
  reasonCodes: PostSessionLivenessReasonCode[]
}
