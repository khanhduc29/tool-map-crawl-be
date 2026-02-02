"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseKeywords = void 0;
const parseKeywords = (raw) => {
    return raw
        .split("\n")
        .map(k => k.trim())
        .filter(Boolean);
};
exports.parseKeywords = parseKeywords;
