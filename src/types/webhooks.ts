export enum WebhookType {
  SESSION_STATUS = "session.status",
  MEDIA_USER_PHOTO = "media.user_photo",
  MEDIA_DOCUMENT_PHOTO = "media.document_photo",
  MEDIA_USER_VIDEO = "media.user_video",
  ANALYSIS_VIDEO = "analysis.video",
  ANALYSIS_SCREENSHOT = "analysis.screenshot",
  /**
   * Post-session deepfake analysis reached a terminal state (succeeded, failed
   * or timed out). Doorbell-only, like every other webhook here: the event
   * carries no verdict — refetch the session and read
   * `SessionReport.deepfakeDetectionStatus` and `SessionReport.deepfakeDetection`.
   */
  ANALYSIS_DEEPFAKE = "analysis.deepfake",
  SETTINGS_AVATARS = "settings.avatars",
  SETTINGS_LANGS = "settings.langs",
}

export type WebhookMedia = {
  id: string
  createdAt: number
  url: string
  expires: number
  contentType: string
}

export type WebhookEvent = {
  id: string
  type: WebhookType
  createdAt: number
  sessionId: string
  media?: WebhookMedia
}
