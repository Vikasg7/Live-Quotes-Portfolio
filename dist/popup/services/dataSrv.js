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
const sendMsg_1 = require("./sendMsg");
let DataSrv = class DataSrv {
    constructor(_sendMsg) {
        this._sendMsg = _sendMsg;
    }
    getData() {
        // console.log("Getting data ...")
        this._sendMsg.sendMessage({ action: "Get" });
    }
    onData() {
        return this._sendMsg.onReply();
    }
    add(symbols) {
        // console.log("Adding symbols ", symbols)
        this._sendMsg.sendMessage({ action: "Add", symbols });
    }
    del(symbol) {
        this._sendMsg.sendMessage({ action: "Del", symbol });
    }
    update(msg) {
        this._sendMsg.sendMessage(msg);
    }
};
DataSrv = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [sendMsg_1.SendMsgSrv])
], DataSrv);
exports.DataSrv = DataSrv;
//# sourceMappingURL=dataSrv.js.map