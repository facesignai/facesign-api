import { Device } from './types/deviceDetails'
import { Location } from './types/location'
import { FSEdge, FSNode } from './types/nodes'

export * from './types/deviceDetails'
export * from './types/location'
export * from './types/nodes'

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

export type SessionReportAIAnalysisSection = {
  title: string
  shortDescription: string
  longDescription: string
}

export type SessionReportAIAnalysis = {
  ageMin: number
  ageMax: number
  sex: 'male' | 'female'
  realPersonOrVirtual: 'real' | 'virtual' | 'noface'
  overallSummary: string
  analysis: SessionReportAIAnalysisSection[]
}
export interface SessionReport {
  transcript: Phrase[]
  aiAnalysis?: SessionReportAIAnalysis
  location?: Location
  device?: Device
  livenessDetected?: boolean
  lang?: string
  extractedData?: Record<string, string>
  screenshots?: string[]
  videos?: {
    avatarVideoUrl?: string
    userVideoUrl?: string
  }
  isVerified?: boolean
}

export interface Session {
  id: string
  createdAt: number
  startedAt?: number
  finishedAt?: number
  status: SessionStatus
  settings: SessionSettings
  version?: string
  report?: SessionReport
}

export interface GetSessionResponse {
  session: Session
  clientSecret: ClientSecret
}

export type Lang = {
  id: string
  title: string
}

export type Zone = 'es' | 'eu'

export enum ModuleType {
  EmailVerification = 'emailVerification',
  SmsVerification = 'smsVerification',
  IdentityVerification = 'identityVerification',
  DocumentAuthentication = 'documentAuthentication',
  AgeEstimation = 'ageEstimation',
  ProofOfIntent = 'proofOfIntent',
  KnowledgeVerify = 'knowledgeVerify',
}

export type EmailVerification = {
  type: ModuleType.EmailVerification
  name?: string
  email?: string
  publicRecognitionEnabled?: boolean
}

export type SmsVerification = {
  type: ModuleType.SmsVerification
  phone?: string
}

export type IdentityVerification = {
  type: ModuleType.IdentityVerification
}

export type DocumentAuthentication = {
  type: ModuleType.DocumentAuthentication
}

export type AgeEstimation = {
  type: ModuleType.AgeEstimation
  age: number
}

export type ProofOfIntent = {
  type: ModuleType.ProofOfIntent
  requestedData: RequestedData[]
}

export type KnowledgeVerify = {
  type: ModuleType.KnowledgeVerify
}

export type Avatar = {
  id: string
  name: string
  gender: 'male' | 'female' | 'unknown'
  imageUrl: string
}

export type Module =
  | EmailVerification
  | SmsVerification
  | IdentityVerification
  | DocumentAuthentication
  | AgeEstimation
  | ProofOfIntent
  | KnowledgeVerify

export type FSFlow = {
  nodes: FSNode[]
  edges: FSEdge[]
}

export interface SessionSettings {
  clientReferenceId: string
  metadata: object
  initialPhrase?: string
  finalPhrase?: string
  providedData?: Record<string, string>
  avatarId?: string
  langs?: string[]
  defaultLang?: string
  zone?: Zone
  modules: Module[]
  flow?: FSFlow
  permissionsButtonText?: string
  permissionsBackgroundType?: 'avatar' | 'color'
  permissionsBackgroundColor?: string
  permissionsMainHeading?: string
  permissionsSubheading?: string
  permissionsButtonTextTranslates?: Record<string, string>
  permissionsMainHeadingTranslates?: Record<string, string>
  permissionsSubheadingTranslates?: Record<string, string>
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
    'initialPhrase',
    'finalPhrase',
    'providedData',
    'avatarId',
    'langs',
    'defaultLang',
    'zone',
    'modules',
    'flow',
    'permissionsButtonText',
    'permissionsBackgroundType',
    'permissionsBackgroundColor',
    'permissionsMainHeading',
    'permissionsSubheading',
    'permissionsButtonTextTranslates',
    'permissionsMainHeadingTranslates',
    'permissionsSubheadingTranslates',
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

export interface GetLangsResponse {
  langs: Lang[]
}

export const getLangsEndpoint = {
  method: Method.GET,
  pathParams: [],
  queryParams: [],
  bodyParams: [],
  path: (): string => '/langs',
} as const

export interface GetAvatarsResponse {
  avatars: Avatar[]
}

export const getAvatarsEndpoint = {
  method: Method.GET,
  pathParams: [],
  queryParams: [],
  bodyParams: [],
  path: (): string => '/avatars',
} as const

export const createClientSecretEndpoint = {
  method: Method.GET,
  pathParams: ['sessionId'],
  queryParams: [],
  bodyParams: [],
  path: (p: GetSessionPathParameters): string =>
    `/sessions/${p.sessionId}/refresh`,
} as const

// Session list filtering options
export interface GetSessionsParameters {
  // Pagination
  limit?: number           // Default: 25, max: 100
  cursor?: string         // For cursor-based pagination
  
  // Filtering
  flowId?: string         // Filter by specific flow/form (maps to videoFormId in DB)
  clientReferenceId?: string
  status?: SessionStatus | SessionStatus[]
  fromDate?: number       // Unix timestamp
  toDate?: number         // Unix timestamp
  
  // Sorting
  sortBy?: 'createdAt' | 'status' | 'finishedAt'  // Default: 'createdAt'
  sortOrder?: 'asc' | 'desc'  // Default: 'desc'
  
  // Search
  search?: string         // Search in metadata, client reference, etc.
  
  // Options
  includeTotal?: boolean  // Include total count (expensive, default: false)
}

// Response types
export interface SessionListItem {
  id: string
  createdAt: number
  startedAt?: number
  finishedAt?: number
  status: SessionStatus
  clientReferenceId: string
  metadata: object
  flowId?: string  // Maps to videoFormId in database
  
  // Expanded session data (excluding sensitive fields)
  clientId: string
  apiKeyId: string
  conversation: string[]
  moduleIndex: number
  settings: SessionSettings
  apiVersion?: string
  data: Record<string, string>
  attempts: Record<string, {
    startedAt: number
    conversation: string[]
    lastUserPhraseAppliedAt?: number
    lastAvatarPhraseAppliedAt?: number
    clientVersion?: string
    isLocalhost?: boolean
    userVideoUrl?: string
    avatarVideoUrl?: string
    userVideoMimeType?: string
    avatarVideoMimeType?: string
  }>
  webhookUrl?: string
  modulesData?: {
    emailVerification?: {
      verificationId?: string
      userId?: string
      emailInputSkipped?: boolean
      livenessDetected?: boolean
      userName?: string
      isVerified?: boolean
      isNotNew?: boolean
      email?: string
    }
  }
  lang?: string
  slackNotificationsDisabled?: boolean
  aiAnalysisFirst?: SessionReportAIAnalysis
  aiAnalysis?: SessionReportAIAnalysis
  device?: {
    userAgent?: string
    platform?: string
    vendor?: string
    language?: string
    languages?: string[]
    online?: boolean
    cookieEnabled?: boolean
    doNotTrack?: string
    maxTouchPoints?: number
    hardwareConcurrency?: number
    deviceMemory?: number
    webdriver?: boolean
    pdfViewerEnabled?: boolean
    screen?: {
      width?: number
      height?: number
      availWidth?: number
      availHeight?: number
      colorDepth?: number
      pixelDepth?: number
    }
  }
  ip?: string
  location?: {
    city?: {
      geoname_id?: number
      names?: Record<string, string>
    }
    continent?: {
      code?: string
      geoname_id?: number
      names?: Record<string, string>
    }
    country?: {
      geoname_id?: number
      iso_code?: string
      names?: Record<string, string>
    }
    subdivisions?: Array<{
      geoname_id?: number
      iso_code?: string
      names?: Record<string, string>
    }>
    postal?: {
      code?: string
    }
    location?: {
      accuracy_radius?: number
      latitude?: number
      longitude?: number
      metro_code?: number
      time_zone?: string
    }
  }
  phrases: Record<string, {
    id: string
    text: string
    lang: string
    isAvatar: boolean
    duration?: number
    createdAt: number
    interruptedAt?: number
    moduleIndex?: number
    moduleCompleted?: boolean
    flags?: { key: string; value: string }[]
    stage?: string
    latencies?: Record<string, number>
    passedNodes?: Array<{
      nodeId: string
      transitionId: string
    }>
    nodeId?: string
    action?: {
      type: string
      [key: string]: any
    }
  }>
  
  // Legacy summary field for backwards compatibility
  summary?: {
    duration?: number
    moduleResults?: Record<string, boolean>
    errorMessage?: string
  }
}

export interface GetSessionsResponse {
  sessions: SessionListItem[]
  nextCursor?: string
  totalCount?: number  // Only included if includeTotal=true
  hasMore: boolean
}

// List sessions endpoint
export const getSessionsEndpoint = {
  method: Method.GET,
  pathParams: [],
  queryParams: [
    'limit',
    'cursor',
    'flowId',
    'clientReferenceId',
    'status',
    'fromDate',
    'toDate',
    'sortBy',
    'sortOrder',
    'search',
    'includeTotal'
  ],
  bodyParams: [],
  path: (): string => '/sessions',
} as const
