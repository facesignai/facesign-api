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
