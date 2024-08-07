/// <reference types="node" />
import { SessionSettings, CreateSessionResponse, Method, ClientOptions, GetSessionParameters, GetSessionResponse, CreateClientSecretParameters, ClientSecret } from './api-endpoints';
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
        create: (args: SessionSettings) => Promise<CreateSessionResponse>;
        /**
         * Retrieve the identity verification session
         */
        retrieve: (args: GetSessionParameters) => Promise<GetSessionResponse>;
        /**
         * Generate client secret for the specified session
         */
        createClientSecret: (args: CreateClientSecretParameters) => Promise<ClientSecret>;
    };
}
export default Client;
//# sourceMappingURL=client.d.ts.map