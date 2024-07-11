"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pick = void 0;
function pick(base, keys) {
    const entries = keys.map(key => [key, base === null || base === void 0 ? void 0 : base[key]]);
    return Object.fromEntries(entries);
}
exports.pick = pick;
//# sourceMappingURL=utils.js.map