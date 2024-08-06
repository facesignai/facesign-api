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
    usedAt?: number;
}
export type Session = {
    id: string;
    createdAt: number;
    startedAt?: number;
    finishedAt?: number;
    transcript: Phrase[];
    status: SessionStatus;
    params: CreateSessionParameters;
    version?: string;
    data: Record<string, string>;
};
export type GetSessionResponse = {
    session: Session;
    clientSecret: ClientSecret;
};
export type ProvidedData = {
    key: string;
    value: string;
};
export type CreateSessionParameters = {
    clientReferenceId: string;
    metadata: object;
    verificationParams: VerificationParam[];
    avatar?: AvatarType;
    initialPhrase?: string;
    finalPhrase?: string;
    providedData?: ProvidedData[];
};
export type CreateSessionResponse = {
    session: Session;
    clientSecret: ClientSecret;
};
export declare const createSessionEndpoint: {
    readonly method: Method.POST;
    readonly pathParams: readonly [];
    readonly queryParams: readonly [];
    readonly bodyParams: readonly ["clientReferenceId", "metadata", "verificationParams", "avatar", "initialPhrase", "finalPhrase", "providedData"];
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