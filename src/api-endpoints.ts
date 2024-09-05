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
  serverUrl?: string
}

export enum Method {
  GET = 'get',
  POST = 'post',
  PATCH = 'patch',
  DELTE = 'delete',
}

export type AvatarType = 'heygen' | 'azure' | 'custom'

export type RequestedData = {
  key: string
  isRequired?: boolean
  description?: string
}

export type GetSessionParameters = {
  sessionId: string
}

export type CreateClientSecretParameters = {
  sessionId: string
}

export type Phrase = {
  id: string
  createdAt: number
  text: string
  isAvatar: boolean
}

export enum SessionStatus {
  RequiresInput = 'requiresInput',
  Processing = 'processing',
  Canceled = 'canceled',
  Complete = 'complete',
}

export interface ClientSecret {
  secret: string
  createdAt: number
  expireAt: number
  url: string
}

export type Session = {
  id: string
  createdAt: number
  startedAt?: number
  finishedAt?: number
  transcript: Phrase[]
  status: SessionStatus
  settings: SessionSettings
  version?: string
  data: Record<string, string>
}

export type GetSessionResponse = {
  session: Session
  clientSecret: ClientSecret
}

export type SessionSettings = {
  clientReferenceId: string
  metadata: object
  requestedData: RequestedData[]
  avatar?: AvatarType
  initialPhrase?: string
  finalPhrase?: string
  providedData?: Record<string, string>
  avatarId?: string
  voiceId?: string
}

export type CreateSessionResponse = {
  session: Session
  clientSecret: ClientSecret
}

export const createSessionEndpoint = {
  method: Method.POST,
  pathParams: [],
  queryParams: [],
  bodyParams: [
    'clientReferenceId',
    'metadata',
    'requestedData',
    'avatar',
    'initialPhrase',
    'finalPhrase',
    'providedData',
    'avatarId',
    'voiceId',
  ],
  path: (): string => '/sessions',
} as const

type GetSessionPathParameters = {
  sessionId: string
}

export const getSessionEndpoint = {
  method: Method.GET,
  pathParams: ['sessionId'],
  queryParams: [],
  bodyParams: [],
  path: (p: GetSessionPathParameters): string => `/sessions/${p.sessionId}`,
} as const

export const createClientSecretEndpoint = {
  method: Method.GET,
  pathParams: ['sessionId'],
  queryParams: [],
  bodyParams: [],
  path: (p: GetSessionPathParameters): string =>
    `/sessions/${p.sessionId}/refresh`,
} as const
