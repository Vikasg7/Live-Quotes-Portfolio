"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
let OnMsgSrv = class OnMsgSrv {
    constructor() {
        this._msg = new rxjs_1.Subject();
        this._observable = this._msg.asObservable();
        this._listener = (msg, sender, reply) => this._msg.next(msg);
        chrome.runtime.onMessage.addListener(this._listener);
    }
    onMessage() {
        return this._observable;
    }
    sendMessage(msg) {
        this._msg.next(msg);
    }
    removeListener() {
        chrome.runtime.onMessage.removeListener(this._listener);
    }
};
OnMsgSrv = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], OnMsgSrv);
exports.OnMsgSrv = OnMsgSrv;
//# sourceMappingURL=onMsg.js.map