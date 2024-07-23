export enum ILogLevel {
  TRACE = 'TRACE',
  DEBUG = ' DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  OFF = 'OFF',
}

export interface ClientOptions {
  auth?: string
  timeoutMs?: number
  logLevel?: ILogLevel
}

export enum Method {
  GET = 'get',
  POST = 'post',
  PATCH = 'patch',
  DELTE = 'delete',
}

export type AvatarType = 'heygen' | 'azure' | 'custom'

export type VerificationParam = {
  key: string
  isRequired?: boolean
  description?: string
  value?: string | null
}

export type CreateSessionParameters = {
  clientReferenceId: string
  metadata: object
  verificationParams: VerificationParam[]
  avatar?: AvatarType
  initialPhrase?: string
  finalPhrase?: string
}

export type CreateSessionResponse = {
  id: string
  url: string
  clientSecret: string
}

export const createSessionEndpoint = {
  method: Method.POST,
  pathParams: [],
  queryParams: [],
  bodyParams: [
    'clientReferenceId',
    'metadata',
    'verificationParams',
    'avatar',
    'initialPhrase',
    'finalPhrase',
  ],
  path: (): string => '/identity/verification_sessions',
} as const
