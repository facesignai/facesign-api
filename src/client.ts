import jsLogger from 'js-logger'
import nodeFetch from 'node-fetch'
import { rejectAfterTimeout } from './helpers'
import {
  createSessionEndpoint,
  CreateSessionParameters,
  CreateSessionResponse,
  Method,
} from './api-endpoints'
import { pick } from './utils'

export enum ILogLevel {
  TRACE = 'TRACE',
  DEBUG = ' DEBUG',
  INFO = 'INFO',
  TIME = 'TIME',
  WARN = 'WARN',
  ERROR = 'ERROR',
  OFF = 'OFF',
}

export interface ClientOptions {
  auth?: string
  timeoutMs?: number
  logLevel?: ILogLevel
}

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
      jsLogger.setLevel(jsLogger.OFF)
    }
  }

  private setLogLevel (logLevel: ILogLevel) {
    switch (logLevel) {
      case ILogLevel.DEBUG: {
        jsLogger.setLevel(jsLogger.DEBUG)
        break
      }
      case ILogLevel.TRACE: {
        jsLogger.setLevel(jsLogger.TRACE)
        break
      }
      case ILogLevel.INFO: {
        jsLogger.setLevel(jsLogger.INFO)
        break
      }
      case ILogLevel.TIME: {
        jsLogger.setLevel(jsLogger.TIME)
        break
      }
      case ILogLevel.WARN: {
        jsLogger.setLevel(jsLogger.WARN)
        break
      }
      case ILogLevel.ERROR: {
        jsLogger.setLevel(jsLogger.ERROR)
        break
      }
      case ILogLevel.OFF: {
        jsLogger.setLevel(jsLogger.OFF)
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
    jsLogger.log('request start', { method, path })

    const bodyAsJsonString =
      !body || Object.entries(body).length === 0
        ? undefined
        : JSON.stringify(body)

    const url = new URL(`${FACESIGN_URL}${path}`)
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
        jsLogger.error('request error', {
          status: response.status,
          statusText: response.statusText,
          responseText,
        })
        throw new Error(responseText)
      }

      const responseJson: ResponseBody = JSON.parse(responseText)
      jsLogger.log('request success', { method, path })
      return responseJson
    } catch (error: unknown) {
      jsLogger.warn('request fail', {
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
  }
}

export default Client
