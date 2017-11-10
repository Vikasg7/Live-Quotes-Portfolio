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
const dataSrv_1 = require("../../services/dataSrv");
const onMsg_1 = require("../../services/onMsg");
let SettingsComponent = class SettingsComponent {
    constructor(_dataSrv, _changeDetector, _onMsgSrv) {
        this._dataSrv = _dataSrv;
        this._changeDetector = _changeDetector;
        this._onMsgSrv = _onMsgSrv;
        this.data = [];
        this._onData = this._dataSrv.onData().subscribe((data) => {
            this.data = data;
            this._changeDetector.detectChanges(); // running change detection manually.
        });
        this.apiKey = localStorage["apiKey"] || "";
        this.updateInterval = localStorage["updateInterval"] || "60";
        this.from = localStorage.from || "9";
        this.to = localStorage.to || "17";
        if (!localStorage.from && !localStorage.to) {
            this.saveFromTo();
        }
    }
    ngOnInit() {
        this._dataSrv.getData();
    }
    add(input) {
        const symbols = input.value;
        input.value = ""; // Resetting value of input
        // Add only one symbols at a time
        this._dataSrv.add(symbols.split(/[,\s]+/));
    }
    saveAPIKey() {
        localStorage["apiKey"] = this.apiKey;
        // updating apiKey in bg.ts
        chrome.runtime.sendMessage({ action: "ApiKey", apiKey: this.apiKey });
    }
    // Saving update interval
    saveUpInt() {
        this.updateInterval = parseFloat(this.updateInterval) < 60 ? "60" : this.updateInterval;
        localStorage["updateInterval"] = this.updateInterval;
        // updating updateInterval in bg.ts
        chrome.runtime.sendMessage({ action: "UpdateInterval", updateInterval: this.updateInterval });
    }
    saveFromTo() {
        // validation
        const from = parseInt(this.from);
        const to = parseInt(this.to);
        if (to <= from) {
            this._reportError("Error: 'to' can't be less than or equal to'from'.");
        }
        else {
            if (from < 0 || from > 23) {
                this._reportError("Error: 'from' should be between 0 to 24");
                return;
            }
            if (to < 1 || to > 24) {
                this._reportError("Error: 'to' should be between 1 to 23");
                return;
            }
            localStorage.from = from;
            localStorage.to = to;
            this._reportError("from, to saved!");
        }
    }
    _reportError(errMsg) {
        this._onMsgSrv.sendMessage({ action: "ReportError", error: errMsg });
    }
    ngOnDestroy() {
        this._onData.unsubscribe();
    }
};
SettingsComponent = __decorate([
    core_1.Component({
        selector: 'app-settings',
        templateUrl: 'dist/popup/components/settings/settings.component.html',
        styleUrls: ['dist/popup/components/settings/settings.component.css']
    }),
    __metadata("design:paramtypes", [dataSrv_1.DataSrv, core_1.ChangeDetectorRef, onMsg_1.OnMsgSrv])
], SettingsComponent);
exports.SettingsComponent = SettingsComponent;
//# sourceMappingURL=settings.component.js.map