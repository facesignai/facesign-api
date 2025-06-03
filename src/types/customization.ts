export enum BackgroundType {
  AVATAR = 'AVATAR',
  COLOR = 'COLOR',
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

export type Customization = {
  permissionsPage?: PermissionsPageCustomization
}
