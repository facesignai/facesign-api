import { Device } from './types/deviceDetails'
import { Location } from './types/location'
import { FSEdge, FSNode } from './types/nodes'
import { Customization } from './types/customization'
import { NodeReport } from './types/nodeReports'

export * from './types/deviceDetails'
export * from './types/location'
export * from './types/nodes'
export * from './types/customization'
export * from './types/nodeReports'

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
  lang?: string
  // TODO:  {{{ remove this a bit later
  extractedData?: Record<string, string>
  livenessDetected?: boolean
  screenshots?: string[]
  videos?: {
    avatarVideoUrl?: string
    userVideoUrl?: string
  }
  isVerified?: boolean
  // }}}
  nodeReports?: NodeReport[]
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

export type ProvidedData = Record<string, string> & {
  name?: string
  email?: string
  phone?: string
}

export interface SessionSettings {
  clientReferenceId: string
  metadata: object
  initialPhrase?: string
  finalPhrase?: string
  providedData?: ProvidedData
  avatarId?: string
  langs?: string[]
  defaultLang?: string
  zone?: Zone
  modules: Module[]
  flow?: FSFlow
  customization?: Customization
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
    'customization',
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
  limit?: number // Default: 25, max: 100
  cursor?: string // For cursor-based pagination

  // Filtering
  flowId?: string // Filter by specific flow/form (maps to videoFormId in DB)
  clientReferenceId?: string
  status?: SessionStatus | SessionStatus[]
  fromDate?: number // Unix timestamp
  toDate?: number // Unix timestamp

  // Sorting
  sortBy?: 'createdAt' | 'status' | 'finishedAt' // Default: 'createdAt'
  sortOrder?: 'asc' | 'desc' // Default: 'desc'

  // Search
  search?: string // Search in metadata, client reference, etc.

  // Options
  includeTotal?: boolean // Include total count (expensive, default: false)
}

export interface GetSessionsResponse {
  sessions: Session[]
  nextCursor?: string
  totalCount?: number // Only included if includeTotal=true
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
    'includeTotal',
  ],
  bodyParams: [],
  path: (): string => '/sessions',
} as const
