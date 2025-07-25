export enum WebhookType {
  SESSION_START = "session.start",
}

export type WebhookSessionStartData = {
  sessionId: string
}

export type WebhookEventBase = {
  id: string
  type: WebhookType
  createdAt: number
  data: WebhookSessionStartData
}

export type WebhookEventSessionStart = WebhookEventBase & {
  type: WebhookType.SESSION_START
  data: WebhookSessionStartData
}

export type WebhookEvent = WebhookEventSessionStart
