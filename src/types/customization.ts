export enum BackgroundType {
  AVATAR = "AVATAR",
  COLOR = "COLOR",
}

export type PermissionsPageCustomization = {
  buttonText?: string
  backgroundType?: BackgroundType
  backgroundColor?: string
  mainHeading?: string
  subheading?: string
  buttonTextTranslates?: Record<string, string>
  mainHeadingTranslates?: Record<string, string>
  subheadingTranslates?: Record<string, string>
}

export type ControlsCustomization = {
  /**
   * Master switch for the in-session control panel. When `false` the panel is
   * not rendered at all, so every other `controls.*` setting — including
   * `captionsOpenedByDefault` — is inapplicable and silently has no effect.
   */
  showUxControls?: boolean
  /**
   * Initial state of the closed-captions (transcript) panel.
   *
   * Omitted or `false` — the panel starts closed (today's behaviour).
   * `true` — the panel is open from the start of the session; the user can
   * still close and reopen it with the CC button.
   *
   * Intended for accessibility and for users who are more comfortable reading
   * along in a second language. Ignored when `showUxControls` is `false`.
   */
  captionsOpenedByDefault?: boolean
}

export type Customization = {
  permissionsPage?: PermissionsPageCustomization
  controls?: ControlsCustomization
}
