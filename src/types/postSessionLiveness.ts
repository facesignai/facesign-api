/** Experimental video + frame PAD result. Separate from identity and FLOW outcomes. */
export type PostSessionLivenessState =
  | "pending"
  | "passed"
  | "rejected"
  | "inconclusive"

export interface PostSessionLivenessCheck {
  state: Exclude<PostSessionLivenessState, "pending">
  reason: string
}

export interface PostSessionLiveness {
  policyVersion: "video-frame-pad-v1"
  state: PostSessionLivenessState
  /** All timestamps are Unix milliseconds. */
  requestedAt: number
  startedAt?: number
  deadlineAt?: number
  finishedAt?: number
  reasonCodes: string[]
  checks?: {
    video: PostSessionLivenessCheck
    framePad: PostSessionLivenessCheck
  }
  timings?: {
    finalizationMs: number
    analysisMs: number
    totalMs: number
  }
}
