import {
  DeepfakeDetectionStatus,
  SessionReport,
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

  it.each<DeepfakeDetectionStatus["state"]>(["pending", "succeeded", "failed"])(
    "accepts deepfake analysis status %s",
    state => {
      const status: DeepfakeDetectionStatus = { state }

      expect(status.state).toBe(state)
    }
  )
})
