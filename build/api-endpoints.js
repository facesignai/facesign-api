"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSessionEndpoint = exports.Method = exports.ILogLevel = void 0;
var ILogLevel;
(function (ILogLevel) {
    ILogLevel["TRACE"] = "TRACE";
    ILogLevel["DEBUG"] = " DEBUG";
    ILogLevel["INFO"] = "INFO";
    ILogLevel["TIME"] = "TIME";
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
exports.createSessionEndpoint = {
    method: Method.POST,
    pathParams: [],
    queryParams: [],
    bodyParams: [
        'clientReferenceId',
        'metadata',
        'verificationParams',
        'avatar',
        'initialPhrase',
        'finalPhrase',
    ],
    path: () => '/identity/verification_sessions',
};
//# sourceMappingURL=api-endpoints.js.map