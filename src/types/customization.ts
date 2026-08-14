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
  /**
   * Buttons rendered in the in-session control panel. When omitted, all
   * applicable buttons are shown, preserving the default UI. Pass an explicit
   * subset (for example `["captions"]`) to expose only those controls. An
   * empty array hides the control panel entirely.
   *
   * The `language` button is still shown only when the session has more than
   * one available language. Ignored when `showUxControls` is `false`.
   */
  buttons?: ControlButton[]
  /**
   * Whether the control panel may automatically fade out when idle. Omitted or
   * `true` preserves the default behaviour; `false` keeps the selected buttons
   * visible. Ignored when `showUxControls` is `false`.
   */
  autoHide?: boolean
}

export type ControlButton =
  | "microphone"
  | "camera"
  | "captions"
  | "language"
  | "close"

export type Customization = {
  permissionsPage?: PermissionsPageCustomization
  controls?: ControlsCustomization
}
