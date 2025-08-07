export enum WebhookType {
  SESSION_STARTED = "session.started",
  SESSION_FINISHED = "session.finished",
  MEDIA_USER_PHOTO = "media.user_photo",
  MEDIA_DOCUMENT_PHOTO = "media.document_photo",
  MEDIA_USER_VIDEO = "media.user_video",
  ANALYSIS_VIDEO = "analysis.video",
}

export type WebhookMedia = {
  id: string
  downloadUrl: string
  downloadUrlExpireAt: number
}

export type WebhookEvent = {
  id: string
  type: WebhookType
  createdAt: number
  sessionId: string
  media?: WebhookMedia
}
