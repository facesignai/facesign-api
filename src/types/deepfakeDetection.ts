/**
 * Deepfake / manipulation detection result.
 *
 * Surfaced on the public session report (`SessionReport.deepfakeDetection`).
 * Intentionally independent of any specific detection backend so the
 * implementation can change without affecting the API contract.
 */
export type DeepfakeDetection = {
  /** Normalized verdict. */
  verdict: "authentic" | "manipulated" | "unknown"
  /** Manipulation probability in [0,1] (higher = more likely a deepfake). */
  score?: number | null
  /** When the analysis completed (ms epoch). */
  analyzedAt?: number
}

/**
 * Lifecycle of the post-session deepfake analysis, surfaced on the public
 * session report (`SessionReport.deepfakeDetectionStatus`).
 *
 * This is what distinguishes "the analysis ran and found nothing" from "the
 * analysis never produced a result". `deepfakeDetection` is present only in
 * the former case; this field says which case you are in.
 *
 * The field is absent when the analysis was not requested for the session.
 *
 * Subscribe to the `analysis.deepfake` webhook to be told when the state goes
 * terminal instead of polling for it.
 */
export type DeepfakeDetectionStatus = {
  /**
   * - `pending` — analysis is running.
   * - `succeeded` — analysis produced a verdict; see `deepfakeDetection`.
   * - `failed` — the analysis backend failed; see `errorCode`.
   * - `timed_out` — the analysis did not finish in time.
   */
  state: "pending" | "succeeded" | "failed" | "timed_out"
  /** When the analysis started (ms epoch). */
  startedAt?: number
  /** When the analysis reached a terminal state (ms epoch). */
  finishedAt?: number
  /** Machine-readable failure reason, set for `failed`. */
  errorCode?: string
}
