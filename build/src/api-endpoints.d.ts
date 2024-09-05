export declare enum ILogLevel {
    TRACE = "TRACE",
    DEBUG = " DEBUG",
    INFO = "INFO",
    WARN = "WARN",
    ERROR = "ERROR",
    OFF = "OFF"
}
export interface ClientOptions {
    auth?: string;
    timeoutMs?: number;
    logLevel?: ILogLevel;
    serverUrl?: string;
}
export declare enum Method {
    GET = "get",
    POST = "post",
    PATCH = "patch",
    DELTE = "delete"
}
export type AvatarType = 'heygen' | 'azure' | 'custom';
export type RequestedData = {
    key: string;
    isRequired?: boolean;
    description?: string;
};
export type GetSessionParameters = {
    sessionId: string;
};
export type CreateClientSecretParameters = {
    sessionId: string;
};
export type Phrase = {
    id: string;
    createdAt: number;
    text: string;
    isAvatar: boolean;
};
export declare enum SessionStatus {
    RequiresInput = "requiresInput",
    Processing = "processing",
    Canceled = "canceled",
    Complete = "complete"
}
export interface ClientSecret {
    secret: string;
    createdAt: number;
    expireAt: number;
    url: string;
}
export type Session = {
    id: string;
    createdAt: number;
    startedAt?: number;
    finishedAt?: number;
    transcript: Phrase[];
    status: SessionStatus;
    settings: SessionSettings;
    version?: string;
    data: Record<string, string>;
};
export type GetSessionResponse = {
    session: Session;
    clientSecret: ClientSecret;
};
export type SessionSettings = {
    clientReferenceId: string;
    metadata: object;
    requestedData: RequestedData[];
    avatar?: AvatarType;
    initialPhrase?: string;
    finalPhrase?: string;
    providedData?: Record<string, string>;
    avatarId?: string;
    voiceId?: string;
};
export type CreateSessionResponse = {
    session: Session;
    clientSecret: ClientSecret;
};
export declare const createSessionEndpoint: {
    readonly method: Method.POST;
    readonly pathParams: readonly [];
    readonly queryParams: readonly [];
    readonly bodyParams: readonly ["clientReferenceId", "metadata", "requestedData", "avatar", "initialPhrase", "finalPhrase", "providedData"];
    readonly path: () => string;
};
type GetSessionPathParameters = {
    sessionId: string;
};
export declare const getSessionEndpoint: {
    readonly method: Method.GET;
    readonly pathParams: readonly ["sessionId"];
    readonly queryParams: readonly [];
    readonly bodyParams: readonly [];
    readonly path: (p: GetSessionPathParameters) => string;
};
export declare const createClientSecretEndpoint: {
    readonly method: Method.GET;
    readonly pathParams: readonly ["sessionId"];
    readonly queryParams: readonly [];
    readonly bodyParams: readonly [];
    readonly path: (p: GetSessionPathParameters) => string;
};
export {};
//# sourceMappingURL=api-endpoints.d.ts.map