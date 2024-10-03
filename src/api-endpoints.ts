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

export interface RequestedData {
  key: string
  isRequired?: boolean
  description?: string
}

export interface GetSessionParameters {
  sessionId: string
}

export interface CreateClientSecretParameters {
  sessionId: string
}

export interface Phrase {
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

export interface Session {
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

export interface GetSessionResponse {
  session: Session
  clientSecret: ClientSecret
}

export type Lang = 'en' | 'fr' | 'de' | 'es'
export type Zone = 'es' | 'eu'

export interface SessionSettings {
  clientReferenceId: string
  metadata: object
  requestedData: RequestedData[]
  avatar?: AvatarType
  initialPhrase?: string
  finalPhrase?: string
  providedData?: Record<string, string>
  avatarId?: string
  voiceId?: string
  lang?: Lang
  zone?: Zone
}

export interface CreateSessionResponse {
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
    'lang',
    'zone',
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
