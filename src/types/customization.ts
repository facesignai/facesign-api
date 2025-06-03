export enum BackgroundType {
  AVATAR = 'AVATAR',
  COLOR = 'COLOR',
}

export type PermissionsPageCustomization = {
  buttonText?: string
  backgroundType?: BackgroundType
  permissionsBackgroundColor?: string
  permissionsMainHeading?: string
  permissionsSubheading?: string
  permissionsButtonTextTranslates?: Record<string, string>
  permissionsMainHeadingTranslates?: Record<string, string>
  permissionsSubheadingTranslates?: Record<string, string>
}

export type Customization = {
  permissionsPage?: PermissionsPageCustomization
}
