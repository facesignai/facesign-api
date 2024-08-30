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
var _Client_auth, _Client_timeoutMs, _Client_facesignVersion, _Client_fetch, _Client_serverUrl;
Object.defineProperty(exports, "__esModule", { value: true });
const loglevel_1 = require("loglevel");
const node_fetch_1 = require("node-fetch");
const helpers_1 = require("./helpers");
const api_endpoints_1 = require("./api-endpoints");
const utils_1 = require("./utils");
class Client {
    constructor(options) {
        var _a;
        _Client_auth.set(this, void 0);
        _Client_timeoutMs.set(this, 10000);
        _Client_facesignVersion.set(this, '2024-10-11');
        _Client_fetch.set(this, node_fetch_1.default);
        _Client_serverUrl.set(this, 'https://api.facesign.ai');
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
            /**
             * Retrieve the identity verification session
             */
            retrieve: (args) => {
                return this.request({
                    path: api_endpoints_1.getSessionEndpoint.path(args),
                    method: api_endpoints_1.getSessionEndpoint.method,
                    query: (0, utils_1.pick)(args, api_endpoints_1.getSessionEndpoint.queryParams),
                    body: (0, utils_1.pick)(args, api_endpoints_1.getSessionEndpoint.bodyParams),
                });
            },
            /**
             * Generate client secret for the specified session
             */
            createClientSecret: (args) => {
                return this.request({
                    path: api_endpoints_1.createClientSecretEndpoint.path(args),
                    method: api_endpoints_1.createClientSecretEndpoint.method,
                    query: (0, utils_1.pick)(args, api_endpoints_1.createClientSecretEndpoint.queryParams),
                    body: (0, utils_1.pick)(args, api_endpoints_1.createClientSecretEndpoint.bodyParams),
                });
            },
        };
        __classPrivateFieldSet(this, _Client_auth, options === null || options === void 0 ? void 0 : options.auth, "f");
        __classPrivateFieldSet(this, _Client_timeoutMs, (_a = options === null || options === void 0 ? void 0 : options.timeoutMs) !== null && _a !== void 0 ? _a : 10000, "f");
        if (options === null || options === void 0 ? void 0 : options.serverUrl) {
            __classPrivateFieldSet(this, _Client_serverUrl, options.serverUrl, "f");
        }
        if (options && options.logLevel) {
            this.setLogLevel(options.logLevel);
        }
        else {
            loglevel_1.default.disableAll();
        }
    }
    setLogLevel(logLevel) {
        switch (logLevel) {
            case api_endpoints_1.ILogLevel.DEBUG: {
                loglevel_1.default.setLevel(loglevel_1.default.levels.DEBUG);
                break;
            }
            case api_endpoints_1.ILogLevel.TRACE: {
                loglevel_1.default.setLevel(loglevel_1.default.levels.TRACE);
                break;
            }
            case api_endpoints_1.ILogLevel.INFO: {
                loglevel_1.default.setLevel(loglevel_1.default.levels.INFO);
                break;
            }
            case api_endpoints_1.ILogLevel.WARN: {
                loglevel_1.default.setLevel(loglevel_1.default.levels.WARN);
                break;
            }
            case api_endpoints_1.ILogLevel.ERROR: {
                loglevel_1.default.setLevel(loglevel_1.default.levels.ERROR);
                break;
            }
            case api_endpoints_1.ILogLevel.OFF: {
                loglevel_1.default.disableAll();
                break;
            }
        }
    }
    async request({ path, method, query, body, }) {
        loglevel_1.default.debug('request start', { method, path });
        const bodyAsJsonString = !body || Object.entries(body).length === 0
            ? undefined
            : JSON.stringify(body);
        const url = new URL(`${__classPrivateFieldGet(this, _Client_serverUrl, "f")}${path}`);
        loglevel_1.default.debug('endpoint url', url);
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
                loglevel_1.default.error('request error', {
                    status: response.status,
                    statusText: response.statusText,
                    responseText,
                });
                throw new Error(responseText);
            }
            const responseJson = JSON.parse(responseText);
            loglevel_1.default.debug('request success', { method, path });
            return responseJson;
        }
        catch (error) {
            loglevel_1.default.warn('request fail', {
                error,
            });
            throw error;
        }
    }
}
_Client_auth = new WeakMap(), _Client_timeoutMs = new WeakMap(), _Client_facesignVersion = new WeakMap(), _Client_fetch = new WeakMap(), _Client_serverUrl = new WeakMap();
exports.default = Client;
