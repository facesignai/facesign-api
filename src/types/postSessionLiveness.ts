/** Experimental video + frame PAD result, with visibility in v2 and enabled deepfake analysis. */
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
  policyVersion: "video-frame-pad-v1" | "video-frame-pad-v2"
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
    /** Required for a v2 pass. Usable visibility is evidence quality, not liveness. */
    faceVisibility?: {
      state: "passed" | "inconclusive"
      reason: string
    }
  }
  timings?: {
    finalizationMs: number
    analysisMs: number
    totalMs: number
  }
}
