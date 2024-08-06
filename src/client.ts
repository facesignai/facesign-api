import log from 'loglevel'
import nodeFetch from 'node-fetch'
import { rejectAfterTimeout } from './helpers'
import {
  createSessionEndpoint,
  CreateSessionParameters,
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
} from './api-endpoints'
import { pick } from './utils'

type QueryParams = Record<string, string | number | string[]> | URLSearchParams

const FACESIGN_URL = 'https://api.facefile.co'

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
  #facesignVersion = '2024-10-11'
  #fetch = nodeFetch

  public constructor (options?: ClientOptions) {
    this.#auth = options?.auth
    this.#timeoutMs = options?.timeoutMs ?? 10000

    if (options && options.logLevel) {
      this.setLogLevel(options.logLevel)
    } else {
      log.disableAll()
    }
  }

  private setLogLevel (logLevel: ILogLevel) {
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

  private async request<ResponseBody> ({
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

    const url = new URL(`${FACESIGN_URL}${path}`)
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
    create: (args: CreateSessionParameters): Promise<CreateSessionResponse> => {
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
  }
}

export default Client
