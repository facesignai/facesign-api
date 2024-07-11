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
export declare enum Method {
    GET = "get",
    POST = "post",
    PATCH = "patch",
    DELTE = "delete"
}
export type AvatarType = 'heygen' | 'azure' | 'custom';
export type VerificationParam = {
    key: string;
    isRequired?: boolean;
    description?: string;
    value?: string | null;
};
export type CreateSessionParameters = {
    clientReferenceId: string;
    metadata: object;
    verificationParams: VerificationParam[];
    avatar?: AvatarType;
    initialPhrase?: string;
    finalPhrase?: string;
};
export type CreateSessionResponse = {
    id: string;
    url: string;
};
export declare const createSessionEndpoint: {
    readonly method: Method.POST;
    readonly pathParams: readonly [];
    readonly queryParams: readonly [];
    readonly bodyParams: readonly ["clientReferenceId", "metadata", "verificationParams", "avatar", "initialPhrase", "finalPhrase"];
    readonly path: () => string;
};
//# sourceMappingURL=api-endpoints.d.ts.map