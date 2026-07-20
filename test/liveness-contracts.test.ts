import {
  FSLivenessDetectionNode,
  FSLivenessDetectionOutcome,
  FSNodeType,
  LivenessDetectionNodeReport,
  VideoAIAnalysisStatus,
} from "../src/api-endpoints"

const legacyNode: FSLivenessDetectionNode = {
  id: "liveness",
  type: FSNodeType.LIVENESS_DETECTION,
  outcomes: {
    [FSLivenessDetectionOutcome.LIVENESS_DETECTED]: "pass",
    [FSLivenessDetectionOutcome.DEEPFAKE_DETECTED]: "deny",
    [FSLivenessDetectionOutcome.NO_FACE]: "retry",
  },
}

const versionedNode: FSLivenessDetectionNode = {
  ...legacyNode,
  outcomes: {
    ...legacyNode.outcomes,
    [FSLivenessDetectionOutcome.CAPTURE_UNAVAILABLE]: "platform-error",
  },
}

describe("liveness contracts", () => {
  it("keeps the capture-unavailable edge optional for legacy flows", () => {
    expect(legacyNode.outcomes.captureUnavailable).toBeUndefined()
    expect(versionedNode.outcomes.captureUnavailable).toBe("platform-error")
  })

  it("exposes diagnosable unavailable reports and analysis states", () => {
    const report: LivenessDetectionNodeReport = {
      type: FSNodeType.LIVENESS_DETECTION,
      nodeId: "liveness",
      createdAt: Date.now(),
      outcome: FSLivenessDetectionOutcome.CAPTURE_UNAVAILABLE,
      screenshotCount: 0,
      captureStatus: "unavailable",
      errored: true,
      errorCode: "SOURCE_UNAVAILABLE",
    }
    const status: VideoAIAnalysisStatus = "pending"

    expect(report.captureStatus).toBe("unavailable")
    expect(status).toBe("pending")
  })
})
