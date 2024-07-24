/// <reference types="node" />
import { CreateSessionParameters, CreateSessionResponse, Method, ClientOptions, GeteSessionParameters, GetSessionResponse } from './api-endpoints';
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
    private request;
    readonly session: {
        /**
         * Create an identity verification session
         */
        create: (args: CreateSessionParameters) => Promise<CreateSessionResponse>;
        /**
         * Retrieve the identity verification session
         */
        retrieve: (args: GeteSessionParameters) => Promise<GetSessionResponse>;
    };
}
export default Client;
//# sourceMappingURL=client.d.ts.map