"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="./jQuery.d.ts" />
const jquery = require("jquery");
function equalsTextFn(textOrRegex, isCaseSensitive) {
    return exports.$(this).filter(function () {
        var val = (exports.$(this).text() || this.nodeValue || "").trim();
        if (textOrRegex instanceof RegExp) {
            return textOrRegex.test(val);
        }
        else if (isCaseSensitive) {
            return val === textOrRegex;
        }
        else {
            return val.toLowerCase() === textOrRegex.toLowerCase();
        }
    });
}
jquery.fn.equalsText = equalsTextFn;
exports.$ = jquery;
//# sourceMappingURL=jQuery.js.map