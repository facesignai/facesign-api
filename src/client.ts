import log from 'loglevel'
import nodeFetch from 'node-fetch'
import { rejectAfterTimeout } from './helpers'
import {
  createSessionEndpoint,
  SessionSettings,
  CreateSessionResponse,
  Method,
  ILogLevel,
  ClientOptions,
  GetSessionParameters,
  GetSessionResponse,
  CreateClientSecretParameters,
  getSessionEndpoint,
  ClientSecret,
  createClientSecretEndpoint,
  GetLangsResponse,
  getLangsEndpoint,
  getAvatarsEndpoint,
  GetAvatarsResponse,
  GetSessionsParameters,
  GetSessionsResponse,
  getSessionsEndpoint,
} from './api-endpoints'
import { pick } from './utils'
import packageJson from '../package.json'

type QueryParams = Record<string, string | number | string[]> | URLSearchParams

export interface RequestParameters {
  path: string
  method: Method
  query?: QueryParams
  body?: Record<string, unknown>
  auth?: string
}

class Client {
  #auth?: string
  #timeoutMs = 10000
  #facesignVersion = '2024-12-18'
  #fetch = nodeFetch
  #serverUrl = 'https://api.facesign.ai'

  public constructor(options?: ClientOptions) {
    this.#auth = options?.auth
    this.#timeoutMs = options?.timeoutMs ?? 10000

    if (options?.serverUrl) {
      this.#serverUrl = options.serverUrl
    } else if (options?.auth) {
      this.#serverUrl = this.getServerUrlFromApiKey(options.auth)
    }

    if (options && options.logLevel) {
      this.setLogLevel(options.logLevel)
    } else {
      log.disableAll()
    }
  }

  private getServerUrlFromApiKey(apiKey: string): string {
    if (apiKey.startsWith('sk_live_')) {
      return 'https://api.facesign.ai'
    } else if (apiKey.startsWith('sk_test_')) {
      return 'https://api.dev.facesign.ai'
    }

    // Default fallback for keys without prefix (backward compatibility)
    log.warn('API key does not have a recognized prefix (sk_live_ or sk_test_). Using default production URL.')
    return 'https://api.facesign.ai'
  }

  private setLogLevel(logLevel: ILogLevel) {
    switch (logLevel) {
      case ILogLevel.DEBUG: {
        log.setLevel(log.levels.DEBUG)
        break
      }
      case ILogLevel.TRACE: {
        log.setLevel(log.levels.TRACE)
        break
      }
      case ILogLevel.INFO: {
        log.setLevel(log.levels.INFO)
        break
      }
      case ILogLevel.WARN: {
        log.setLevel(log.levels.WARN)
        break
      }
      case ILogLevel.ERROR: {
        log.setLevel(log.levels.ERROR)
        break
      }
      case ILogLevel.OFF: {
        log.disableAll()
        break
      }
    }
  }

  private async request<ResponseBody>({
    path,
    method,
    query,
    body,
  }: RequestParameters): Promise<ResponseBody> {
    log.debug('request start', { method, path })

    const bodyAsJsonString =
      !body || Object.entries(body).length === 0
        ? undefined
        : JSON.stringify(body)

    const url = new URL(`${this.#serverUrl}${path}`)
    log.debug('endpoint url', url)
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(val =>
              url.searchParams.append(key, decodeURIComponent(val))
            )
          } else {
            url.searchParams.append(key, String(value))
          }
        }
      }
    }

    const headers: Record<string, string> = {
      'Facesign-Version': this.#facesignVersion,
    }

    if (this.#auth) {
      headers['authorization'] = `Bearer ${this.#auth}`
    }

    if (bodyAsJsonString !== undefined) {
      headers['content-type'] = 'application/json'
    }

    headers['x-facesign-api-version'] = packageJson.version

    try {
      const response = await rejectAfterTimeout(
        this.#fetch(url.toString(), {
          method: method.toUpperCase(),
          headers,
          body: bodyAsJsonString,
        }),
        this.#timeoutMs
      )

      const responseText = await response.text()
      if (!response.ok) {
        log.error('request error', {
          status: response.status,
          statusText: response.statusText,
          responseText,
        })
        throw new Error(responseText)
      }

      const responseJson: ResponseBody = JSON.parse(responseText)
      log.debug('request success', { method, path })
      return responseJson
    } catch (error: unknown) {
      log.warn('request fail', {
        error,
      })

      throw error
    }
  }

  public readonly session = {
    /**
     * Create an identity verification session
     */
    create: (args: SessionSettings): Promise<CreateSessionResponse> => {
      return this.request<CreateSessionResponse>({
        path: createSessionEndpoint.path(),
        method: createSessionEndpoint.method,
        query: pick(args, createSessionEndpoint.queryParams),
        body: pick(args, createSessionEndpoint.bodyParams),
      })
    },
    /**
     * Retrieve the identity verification session
     */
    retrieve: (args: GetSessionParameters): Promise<GetSessionResponse> => {
      return this.request<GetSessionResponse>({
        path: getSessionEndpoint.path(args),
        method: getSessionEndpoint.method,
        query: pick(args, getSessionEndpoint.queryParams),
        body: pick(args, getSessionEndpoint.bodyParams),
      })
    },
    /**
     * Generate client secret for the specified session
     */
    createClientSecret: (args: CreateClientSecretParameters) => {
      return this.request<ClientSecret>({
        path: createClientSecretEndpoint.path(args),
        method: createClientSecretEndpoint.method,
        query: pick(args, createClientSecretEndpoint.queryParams),
        body: pick(args, createClientSecretEndpoint.bodyParams),
      })
    },
    /**
     * List sessions with filtering and pagination
     */
    list: (args?: GetSessionsParameters): Promise<GetSessionsResponse> => {
      return this.request<GetSessionsResponse>({
        path: getSessionsEndpoint.path(),
        method: getSessionsEndpoint.method,
        query: args ? {
          ...(args.limit !== undefined && { limit: args.limit }),
          ...(args.cursor && { cursor: args.cursor }),
          ...(args.flowId && { flowId: args.flowId }),
          ...(args.clientReferenceId && { clientReferenceId: args.clientReferenceId }),
          ...(args.status && { status: args.status }),
          ...(args.fromDate !== undefined && { fromDate: args.fromDate }),
          ...(args.toDate !== undefined && { toDate: args.toDate }),
          ...(args.sortBy && { sortBy: args.sortBy }),
          ...(args.sortOrder && { sortOrder: args.sortOrder }),
          ...(args.search && { search: args.search }),
          ...(args.includeTotal !== undefined && { includeTotal: String(args.includeTotal) }),
        } : {},
        body: {},
      })
    },
    apiVersion: packageJson.version,
  }

  public readonly langs = {
    /**
     * Retrieve supported langs
     */
    retrieve: (): Promise<GetLangsResponse> => {
      return this.request<GetLangsResponse>({
        path: getLangsEndpoint.path(),
        method: getLangsEndpoint.method,
        query: {},
        body: {},
      })
    },
  }

  public readonly avatars = {
    /**
     * Retrieve supported avatars
     */
    retrieve: (): Promise<GetAvatarsResponse> => {
      return this.request<GetAvatarsResponse>({
        path: getAvatarsEndpoint.path(),
        method: getAvatarsEndpoint.method,
        query: {},
        body: {},
      })
    },
  }
}

export default Client
