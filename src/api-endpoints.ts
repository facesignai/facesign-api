import { Device } from "./types/deviceDetails"
import { Location } from "./types/location"
import { FSNode } from "./types/nodes"
import { Customization } from "./types/customization"
import { NodeReport } from "./types/nodeReports"
import { VideoAIAnalysis } from "./types/videoAIAnalysis"

export * from "./types/deviceDetails"
export * from "./types/location"
export * from "./types/nodes"
export * from "./types/customization"
export * from "./types/nodeReports"
export * from "./types/docScanning"
export * from "./types/webhooks"
export * from "./types/videoAIAnalysis"

export enum ILogLevel {
  TRACE = "TRACE",
  DEBUG = " DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  OFF = "OFF",
}

export interface ClientOptions {
  auth?: string
  timeoutMs?: number
  logLevel?: ILogLevel
  serverUrl?: string
}

export enum Method {
  GET = "get",
  POST = "post",
  PATCH = "patch",
  DELTE = "delete",
}

export interface RequestedData {
  key: string
  isRequired?: boolean
  description?: string
}

/**
 * Describes a single field to extract from the session transcript using an LLM.
 *
 * - `fieldName` — key under which the extracted value will appear in `SessionReport.extractedData`.
 * - `type` — expected value type. `"date"` is returned as an ISO 8601 string.
 * - `description` — natural-language hint for the LLM describing what to look for.
 *   This is the primary signal for extraction, so be specific.
 * - `enum` — optional list of allowed string values. When set, the LLM normalizes
 *   free-form answers (e.g., "yeah", "sure") into one of the listed values.
 *
 * Every field is treated as optional: if the transcript does not contain the data,
 * the value in `extractedData` will be `null`.
 */
export interface ExtractionField {
  fieldName: string
  type: "string" | "number" | "boolean" | "date"
  description: string
  enum?: string[]
}

export type ExtractedData = Record<string, string | number | boolean | null>

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
  Created = "created",
  InProgress = "inProgress",
  Incomplete = "incomplete",
  Complete = "complete",
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
  sex: "male" | "female"
  realPersonOrVirtual: "real" | "virtual" | "noface"
  overallSummary: string
  analysis: SessionReportAIAnalysisSection[]
}

export type VideoAIAnalysisStatus =
  | "notRequested"
  | "pending"
  | "completed"
  | "failed"
  | "timedOut"

export interface SessionMedia {
  id: string
  createdAt: number
  expireAt?: number
  contentType?: string
  url: string
}

export type DocumentImageFile = {
  side: number
  type: "document" | "face" | "signature" | "input" | "barcodeInput"
  file: SessionMedia
}

export interface SessionReport {
  transcript: Phrase[]
  aiAnalysis?: SessionReportAIAnalysis
  location?: Location
  device?: Device
  lang?: string
  nodeReports?: NodeReport[]
  videoAIAnalysis?: VideoAIAnalysis
  videoAIAnalysisStatus?: VideoAIAnalysisStatus
  extractedData?: ExtractedData
  media?: {
    screenshots?: SessionMedia[]
    userVideo?: SessionMedia
    avatarVideo?: SessionMedia
    documentImages?: DocumentImageFile[]
  }
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

export type Zone = "us" | "eu"

export type Avatar = {
  id: string
  name: string
  gender: "male" | "female" | "unknown"
  imageUrl: string
}

export type ProvidedData = Record<string, string> & {
  name?: string
  email?: string
  phone?: string
}

export interface SessionSettings {
  clientReferenceId?: string
  metadata: object
  flow: FSNode[]
  providedData?: ProvidedData
  avatarId?: string
  langs?: string[]
  defaultLang?: string
  zone?: Zone
  customization?: Customization
  videoAIAnalysisEnabled?: boolean
  /**
   * Schema describing which fields the backend should extract from the session
   * transcript using an LLM. Results are returned in `SessionReport.extractedData`.
   */
  extractionSchema?: ExtractionField[]
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
    "clientReferenceId",
    "metadata",
    "providedData",
    "avatarId",
    "langs",
    "defaultLang",
    "zone",
    "flow",
    "customization",
    "videoAIAnalysisEnabled",
    "extractionSchema",
  ],
  path: (): string => "/sessions",
} as const

type GetSessionPathParameters = {
  sessionId: string
}

export const getSessionEndpoint = {
  method: Method.GET,
  pathParams: ["sessionId"],
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
  path: (): string => "/langs",
} as const

export interface GetAvatarsResponse {
  avatars: Avatar[]
}

export const getAvatarsEndpoint = {
  method: Method.GET,
  pathParams: [],
  queryParams: [],
  bodyParams: [],
  path: (): string => "/avatars",
} as const

export const createClientSecretEndpoint = {
  method: Method.GET,
  pathParams: ["sessionId"],
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
  sortBy?: "createdAt" | "status" | "finishedAt" // Default: 'createdAt'
  sortOrder?: "asc" | "desc" // Default: 'desc'

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
    "limit",
    "cursor",
    "flowId",
    "clientReferenceId",
    "status",
    "fromDate",
    "toDate",
    "sortBy",
    "sortOrder",
    "search",
    "includeTotal",
  ],
  bodyParams: [],
  path: (): string => "/sessions",
} as const
