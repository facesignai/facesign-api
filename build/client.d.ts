/// <reference types="node" />
import { CreateSessionParameters, CreateSessionResponse, Method } from './api-endpoints';
export declare enum ILogLevel {
    TRACE = "TRACE",
    DEBUG = " DEBUG",
    INFO = "INFO",
    TIME = "TIME",
    WARN = "WARN",
    ERROR = "ERROR",
    OFF = "OFF"
}
export interface ClientOptions {
    auth?: string;
    timeoutMs?: number;
    logLevel?: ILogLevel;
}
type QueryParams = Record<string, string | number | string[]> | URLSearchParams;
export interface RequestParameters {
    path: string;
    method: Method;
    query?: QueryParams;
    body?: Record<string, unknown>;
    auth?: string;
}
declare class Client {
    #private;
    constructor(options?: ClientOptions);
    private setLogLevel;
    request<ResponseBody>({ path, method, query, body, }: RequestParameters): Promise<ResponseBody>;
    readonly createSession: {
        /**
         * Create an identity verification session
         */
        create: (args: CreateSessionParameters) => Promise<CreateSessionResponse>;
    };
}
export default Client;
//# sourceMappingURL=client.d.ts.map