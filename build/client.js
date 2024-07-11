"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Client_auth, _Client_timeoutMs, _Client_facesignVersion, _Client_fetch;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ILogLevel = void 0;
const js_logger_1 = require("js-logger");
const node_fetch_1 = require("node-fetch");
const helpers_1 = require("./helpers");
const api_endpoints_1 = require("./api-endpoints");
const utils_1 = require("./utils");
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
const FACESIGN_URL = 'https://api.facefile.co';
class Client {
    constructor(options) {
        var _a;
        _Client_auth.set(this, void 0);
        _Client_timeoutMs.set(this, 10000);
        _Client_facesignVersion.set(this, '2024-10-11');
        _Client_fetch.set(this, node_fetch_1.default);
        this.session = {
            /**
             * Create an identity verification session
             */
            create: (args) => {
                return this.request({
                    path: api_endpoints_1.createSessionEndpoint.path(),
                    method: api_endpoints_1.createSessionEndpoint.method,
                    query: (0, utils_1.pick)(args, api_endpoints_1.createSessionEndpoint.queryParams),
                    body: (0, utils_1.pick)(args, api_endpoints_1.createSessionEndpoint.bodyParams),
                });
            },
        };
        __classPrivateFieldSet(this, _Client_auth, options === null || options === void 0 ? void 0 : options.auth, "f");
        __classPrivateFieldSet(this, _Client_timeoutMs, (_a = options === null || options === void 0 ? void 0 : options.timeoutMs) !== null && _a !== void 0 ? _a : 10000, "f");
        if (options && options.logLevel) {
            this.setLogLevel(options.logLevel);
        }
        else {
            js_logger_1.default.setLevel(js_logger_1.default.OFF);
        }
    }
    setLogLevel(logLevel) {
        switch (logLevel) {
            case ILogLevel.DEBUG: {
                js_logger_1.default.setLevel(js_logger_1.default.DEBUG);
                break;
            }
            case ILogLevel.TRACE: {
                js_logger_1.default.setLevel(js_logger_1.default.TRACE);
                break;
            }
            case ILogLevel.INFO: {
                js_logger_1.default.setLevel(js_logger_1.default.INFO);
                break;
            }
            case ILogLevel.TIME: {
                js_logger_1.default.setLevel(js_logger_1.default.TIME);
                break;
            }
            case ILogLevel.WARN: {
                js_logger_1.default.setLevel(js_logger_1.default.WARN);
                break;
            }
            case ILogLevel.ERROR: {
                js_logger_1.default.setLevel(js_logger_1.default.ERROR);
                break;
            }
            case ILogLevel.OFF: {
                js_logger_1.default.setLevel(js_logger_1.default.OFF);
                break;
            }
        }
    }
    async request({ path, method, query, body, }) {
        js_logger_1.default.log('request start', { method, path });
        const bodyAsJsonString = !body || Object.entries(body).length === 0
            ? undefined
            : JSON.stringify(body);
        const url = new URL(`${FACESIGN_URL}${path}`);
        if (query) {
            for (const [key, value] of Object.entries(query)) {
                if (value !== undefined) {
                    if (Array.isArray(value)) {
                        value.forEach(val => url.searchParams.append(key, decodeURIComponent(val)));
                    }
                    else {
                        url.searchParams.append(key, String(value));
                    }
                }
            }
        }
        const headers = {
            'Facesign-Version': __classPrivateFieldGet(this, _Client_facesignVersion, "f"),
        };
        if (__classPrivateFieldGet(this, _Client_auth, "f")) {
            headers['authorization'] = `Bearer ${__classPrivateFieldGet(this, _Client_auth, "f")}`;
        }
        if (bodyAsJsonString !== undefined) {
            headers['content-type'] = 'application/json';
        }
        try {
            const response = await (0, helpers_1.rejectAfterTimeout)(__classPrivateFieldGet(this, _Client_fetch, "f").call(this, url.toString(), {
                method: method.toUpperCase(),
                headers,
                body: bodyAsJsonString,
            }), __classPrivateFieldGet(this, _Client_timeoutMs, "f"));
            const responseText = await response.text();
            if (!response.ok) {
                js_logger_1.default.error('request error', {
                    status: response.status,
                    statusText: response.statusText,
                    responseText,
                });
                throw new Error(responseText);
            }
            const responseJson = JSON.parse(responseText);
            js_logger_1.default.log('request success', { method, path });
            return responseJson;
        }
        catch (error) {
            js_logger_1.default.warn('request fail', {
                error,
            });
            throw error;
        }
    }
}
_Client_auth = new WeakMap(), _Client_timeoutMs = new WeakMap(), _Client_facesignVersion = new WeakMap(), _Client_fetch = new WeakMap();
exports.default = Client;
//# sourceMappingURL=client.js.map