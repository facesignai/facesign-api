"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectAfterTimeout = void 0;
const errors_1 = require("./errors");
const rejectAfterTimeout = (promise, timeoutMS) => {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(errors_1.ClientErrorCode.RequestTimeout);
        }, timeoutMS);
        promise
            .then(resolve)
            .catch(reject)
            .then(() => clearTimeout(timeoutId));
    });
};
exports.rejectAfterTimeout = rejectAfterTimeout;
