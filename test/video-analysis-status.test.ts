import {
  DeepfakeDetectionStatus,
  PostSessionLiveness,
  PostSessionLivenessPolicy,
  PostSessionLivenessReasonCode,
  SessionReport,
  SessionSettings,
  VideoAIAnalysisStatus,
} from "../src/api-endpoints"

describe("public video analysis lifecycle", () => {
  it.each<VideoAIAnalysisStatus>(["pending", "succeeded", "failed"])(
    "accepts video analysis status %s",
    status => {
      const report: SessionReport = {
        transcript: [],
        videoAIAnalysisStatus: status,
      }

      expect(report.videoAIAnalysisStatus).toBe(status)
    }
  )

  it.each([
    [PostSessionLivenessPolicy.V1, "v1"],
    [PostSessionLivenessPolicy.V2, "v2"],
  ] as const)("exposes liveness policy %s", (policy, value) => {
    const settings: SessionSettings = {
      metadata: {},
      flow: [],
      postSessionLiveness: policy,
    }
    const result: PostSessionLiveness = {
      policyVersion: policy,
      state: "inconclusive",
      reasonCodes: [PostSessionLivenessReasonCode.INSUFFICIENT_EVIDENCE],
    }

    expect(settings.postSessionLiveness).toBe(value)
    expect(result.policyVersion).toBe(value)
    expect(result.reasonCodes).toEqual(["insufficient_evidence"])
  })

  it.each<DeepfakeDetectionStatus["state"]>(["pending", "succeeded", "failed"])(
    "accepts deepfake analysis status %s",
    state => {
      const status: DeepfakeDetectionStatus = { state }

      expect(status.state).toBe(state)
    }
  )
})
