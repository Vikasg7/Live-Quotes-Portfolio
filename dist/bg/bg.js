"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = require("./lib/service");
const QuoteSrv = window["QuoteSrv"] = new service_1.QuoteService();
chrome.runtime.onMessage.addListener(onMessage);
function onMessage(msg, sender, reply) {
    switch (msg.action) {
        case "Add":
            QuoteSrv.addSymbol(msg.symbols, reply);
            break;
        case "Del":
            QuoteSrv.delSymbol(msg.symbol, reply);
            break;
        case "Get":
            QuoteSrv.getData(reply);
            break;
        case "Update":
            QuoteSrv.update(msg);
            break;
        case "ApiKey":
            QuoteSrv.updateApiKey(msg);
            break;
        case "UpdateInterval":
            QuoteSrv.updateInterval(msg);
            break;
    }
    return true; // this means reply will be called asynchronously
}
//# sourceMappingURL=bg.js.map