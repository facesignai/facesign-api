"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClientSecretEndpoint = exports.getSessionEndpoint = exports.createSessionEndpoint = exports.SessionStatus = exports.Method = exports.ILogLevel = void 0;
var ILogLevel;
(function (ILogLevel) {
    ILogLevel["TRACE"] = "TRACE";
    ILogLevel["DEBUG"] = " DEBUG";
    ILogLevel["INFO"] = "INFO";
    ILogLevel["WARN"] = "WARN";
    ILogLevel["ERROR"] = "ERROR";
    ILogLevel["OFF"] = "OFF";
})(ILogLevel = exports.ILogLevel || (exports.ILogLevel = {}));
var Method;
(function (Method) {
    Method["GET"] = "get";
    Method["POST"] = "post";
    Method["PATCH"] = "patch";
    Method["DELTE"] = "delete";
})(Method = exports.Method || (exports.Method = {}));
var SessionStatus;
(function (SessionStatus) {
    SessionStatus["RequiresInput"] = "requiresInput";
    SessionStatus["Processing"] = "processing";
    SessionStatus["Canceled"] = "canceled";
    SessionStatus["Complete"] = "complete";
})(SessionStatus = exports.SessionStatus || (exports.SessionStatus = {}));
exports.createSessionEndpoint = {
    method: Method.POST,
    pathParams: [],
    queryParams: [],
    bodyParams: [
        'clientReferenceId',
        'metadata',
        'requestedData',
        'avatar',
        'initialPhrase',
        'finalPhrase',
        'providedData',
    ],
    path: () => '/sessions',
};
exports.getSessionEndpoint = {
    method: Method.GET,
    pathParams: ['sessionId'],
    queryParams: [],
    bodyParams: [],
    path: (p) => `/sessions/${p.sessionId}`,
};
exports.createClientSecretEndpoint = {
    method: Method.GET,
    pathParams: ['sessionId'],
    queryParams: [],
    bodyParams: [],
    path: (p) => `/sessions/${p.sessionId}/refresh`,
};
