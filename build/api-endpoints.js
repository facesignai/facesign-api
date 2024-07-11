"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSessionEndpoint = exports.Method = void 0;
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