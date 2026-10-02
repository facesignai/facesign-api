/** Experimental video + frame PAD result, including deepfake analysis when enabled. */
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
  /** When true, a pass also requires the configured deepfake check to pass. */
  deepfakeRequired?: boolean
  checks?: {
    video: PostSessionLivenessCheck
    framePad: PostSessionLivenessCheck
    deepfake?: PostSessionLivenessCheck
  }
  timings?: {
    finalizationMs: number
    analysisMs: number
    totalMs: number
  }
}
