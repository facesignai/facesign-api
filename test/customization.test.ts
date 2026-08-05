import nodeFetch from "node-fetch"
import Client from "../src/client"
import {
  FSLivenessDetectionOutcome,
  FSNode,
  FSNodeType,
  SessionSettings,
} from "../src/api-endpoints"

jest.mock("node-fetch", () => jest.fn())

const mockFetch = nodeFetch as unknown as jest.Mock

const flow: FSNode[] = [
  { id: "start", type: FSNodeType.START, outcome: "liveness" },
  {
    id: "liveness",
    type: FSNodeType.LIVENESS_DETECTION,
    outcomes: {
      [FSLivenessDetectionOutcome.LIVENESS_DETECTED]: "end",
      [FSLivenessDetectionOutcome.DEEPFAKE_DETECTED]: "end",
      [FSLivenessDetectionOutcome.NO_FACE]: "end",
      [FSLivenessDetectionOutcome.INCONCLUSIVE]: "end",
    },
  },
  { id: "end", type: FSNodeType.END },
]

const createSession = async (settings: Partial<SessionSettings>) => {
  const client = new Client({ auth: "sk_test_key" })
  await client.session.create({ metadata: {}, flow, ...settings })

  const [, init] = mockFetch.mock.calls[0]
  return JSON.parse(init.body as string) as SessionSettings
}

describe("createSession customization pass-through", () => {
  beforeEach(() => {
    mockFetch.mockReset()
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      text: async () =>
        JSON.stringify({
          session: { id: "sess_1", createdAt: 0, status: "created" },
          clientSecret: { secret: "cs_1", expiresAt: 0 },
        }),
    })
  })

  it("omits customization entirely when it is not set", async () => {
    const body = await createSession({})

    expect(body.customization).toBeUndefined()
    expect("customization" in body).toBe(false)
  })

  it("sends captionsOpenedByDefault: false as-is", async () => {
    const body = await createSession({
      customization: { controls: { captionsOpenedByDefault: false } },
    })

    expect(body.customization?.controls?.captionsOpenedByDefault).toBe(false)
  })

  it("sends captionsOpenedByDefault: true as-is", async () => {
    const body = await createSession({
      customization: { controls: { captionsOpenedByDefault: true } },
    })

    expect(body.customization?.controls?.captionsOpenedByDefault).toBe(true)
  })

  it("keeps captionsOpenedByDefault alongside showUxControls", async () => {
    const body = await createSession({
      customization: {
        controls: { showUxControls: true, captionsOpenedByDefault: true },
      },
    })

    expect(body.customization?.controls).toEqual({
      showUxControls: true,
      captionsOpenedByDefault: true,
    })
  })
})
